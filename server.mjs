import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "public");

async function loadLocalEnv() {
  try {
    const envFile = await fs.readFile(path.join(__dirname, ".env"), "utf8");
    envFile
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#") && line.includes("="))
      .forEach((line) => {
        const separatorIndex = line.indexOf("=");
        const key = line.slice(0, separatorIndex).trim();
        const value = line.slice(separatorIndex + 1).trim().replace(/^["']|["']$/g, "");
        if (key && process.env[key] === undefined) process.env[key] = value;
      });
  } catch {
    // .env is optional. Demo Mode works without an API key.
  }
}

await loadLocalEnv();

const port = Number(process.env.PORT || 3000);
const assistantVoice = "cedar";

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon"
};

const menu = {
  drinks: [
    "Капучино",
    "Латте",
    "Американо",
    "Райский остров",
    "Жасмин кокос",
    "Рафкранч",
    "Сезон Сакуры",
    "Фудзи раф",
    "Жасмин-земляника",
    "Сад лунного цветка",
    "Колдбрю манго-маракуйя",
    "Латте банан-кокос",
    "Латте D2D",
    "Клубничный пломбир",
    "Морс",
    "Грог",
    "Юдзу Лимонад",
    "Груша-Жасмин",
    "Матча Латте Дабл",
    "Земляника-шисо",
    "Кариб",
    "Вьетнамский бамбл",
    "Чай Каркаде Яблоко D2D",
    "Латте Баунти",
    "Капучино соленый миндаль",
    "Изумрудный чай",
    "Ханами",
    "Айс матча",
    "Айс-ти Каркаде Яблоко",
    "Айс-ти Каркаде Манго-Маракуйя",
    "Баннофи",
    "Колдбрю вишня",
    "Раф клубника-банан"
  ],
  sizes: ["S", "M", "L"],
  milks: ["Обычное", "Овсяное", "Миндальное", "Кокосовое", "Без молока"],
  syrups: [
    "Ваниль",
    "Карамель",
    "Лесной орех",
    "Шоколад",
    "Кокос",
    "Мята",
    "Клубника",
    "Банан",
    "Лаванда",
    "Соленая карамель"
  ]
};

function sendJson(res, status, payload) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return Buffer.concat(chunks).toString("utf8");
}

async function serveStatic(req, res) {
  const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
  const pathname = url.pathname === "/" ? "/index.html" : url.pathname;
  const safePath = path.normalize(pathname).replace(/^(\.\.[/\\])+/, "");
  const filePath = path.join(publicDir, safePath);

  if (!filePath.startsWith(publicDir)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  try {
    const file = await fs.readFile(filePath);
    const ext = path.extname(filePath);
    res.writeHead(200, { "Content-Type": mimeTypes[ext] || "application/octet-stream" });
    res.end(req.method === "HEAD" ? undefined : file);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
  }
}

async function createRealtimeSession(req, res) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    sendJson(res, 500, {
      error: "OPENAI_API_KEY не задан. Добавьте ключ в переменную окружения и перезапустите сервер."
    });
    return;
  }

  const offerSdp = await readBody(req);
  if (!offerSdp.trim()) {
    sendJson(res, 400, { error: "Не получен WebRTC offer SDP." });
    return;
  }

  const sessionConfig = {
    type: "realtime",
    model: "gpt-realtime",
    instructions: [
      "Ты голосовой AI Barista DrinkX.",
      "ЯЗЫК: пользователь всегда говорит с тобой по-русски. Распознавай речь и отвечай только на русском языке.",
      "Если речь распознана как другой язык или фраза неразборчива, не переходи на другой язык. Коротко попроси повторить по-русски.",
      "Говори спокойным, уверенным мужским голосом: ниже по тону, без суеты, с короткими паузами.",
      "Отвечай быстро: обычно одной или двумя короткими фразами. Не произноси длинные вступления и списки.",
      "Твоя задача - принять заказ напитка голосом, отвечать на связанные с заказом вопросы и обновлять интерфейс через функции update_order, show_menu и show_drink_details.",
      "РАЗРЕШЁННЫЕ ТЕМЫ: приветствие; меню DrinkX; выбор, состав и настройка напитка; размер, молоко, сироп, сахар и температура; подтверждение, приготовление и получение заказа.",
      "ЗАПРЕЩЁННЫЕ ТЕМЫ: новости, погода, политика, развлечения, общие знания, личные советы и любые разговоры, не связанные с выбором или заказом напитка.",
      "На запрещённую тему ответь только: 'Я могу помочь только с выбором и заказом напитка. Что приготовим?' Не отвечай по существу запрещённого вопроса и не продолжай эту тему.",
      "Справочная база о компании и оборудовании DrinkX временно отключена. На такие вопросы ответь: 'Справочный режим DrinkX сейчас недоступен. Я могу помочь с заказом напитка.'",
      "Если запрос смешанный, обработай только часть про выбор или заказ напитка.",
      `Меню: ${JSON.stringify(menu)}.`,
      "Задавай только один уточняющий вопрос за раз.",
      "Не придумывай позиции вне меню. Если пользователь просит что-то вне меню, предложи ближайший вариант.",
      "Если пользователь просит показать меню, всё меню, варианты напитков или спрашивает что есть, вызови show_menu.",
      "Если пользователь просит подробнее про напиток, состав или 'что это за напиток', вызови show_drink_details с названием напитка. Если название не сказано, используй последний обсуждаемый напиток.",
      "Для чайных напитков, лимонадов, морса и колдбрю не требуй выбор молока: используй 'Без молока'.",
      "Когда заказ содержит напиток, размер, молоко или решение без молока, а также сироп/решение без сиропа, повтори заказ и попроси подтверждение.",
      "Если пользователь подтверждает, вызови update_order со статусом confirmed."
    ].join("\n"),
    audio: {
      input: {
        transcription: {
          model: "gpt-4o-mini-transcribe",
          language: "ru",
          prompt: "DrinkX, кофе, капучино, латте, американо, раф, колдбрю, матча, чай, лимонад, сироп, молоко"
        },
        turn_detection: {
          type: "server_vad",
          threshold: 0.5,
          prefix_padding_ms: 300,
          silence_duration_ms: 450,
          create_response: true,
          interrupt_response: true
        }
      },
      output: {
        voice: assistantVoice
      }
    },
    tools: [
      {
        type: "function",
        name: "update_order",
        description: "Обновляет видимую карточку заказа DrinkX AI Barista.",
        parameters: {
          type: "object",
          properties: {
            drink: { type: ["string", "null"], description: "Напиток из меню" },
            size: { type: ["string", "null"], enum: ["S", "M", "L", null] },
            milk: { type: ["string", "null"], description: "Тип молока из меню" },
            syrup: { type: ["string", "null"], description: "Сироп из меню или 'без сиропа'" },
            sugar: { type: ["string", "null"], description: "Например: без сахара, 1 ложка, 2 ложки" },
            temperature: { type: ["string", "null"], description: "Горячий, теплый, холодный" },
            status: {
              type: ["string", "null"],
              enum: ["draft", "needs_clarification", "ready_to_confirm", "confirmed", null]
            },
            assistant_message: { type: ["string", "null"], description: "Короткое сообщение для интерфейса" }
          },
          additionalProperties: false
        }
      },
      {
        type: "function",
        name: "show_menu",
        description: "Показывает на экране визуальное меню DrinkX с картинками напитков.",
        parameters: {
          type: "object",
          properties: {
            category: {
              type: ["string", "null"],
              description: "Опциональная категория, например кофе, чай, лимонад, холодные напитки"
            }
          },
          additionalProperties: false
        }
      },
      {
        type: "function",
        name: "show_drink_details",
        description: "Открывает подробную визуальную карточку напитка с картинкой, составом и описанием.",
        parameters: {
          type: "object",
          properties: {
            drink: {
              type: ["string", "null"],
              description: "Название напитка из меню. Если пользователь сказал 'этот напиток', можно передать null."
            }
          },
          additionalProperties: false
        }
      }
    ],
    tool_choice: "auto"
  };

  const formData = new FormData();
  formData.set("sdp", offerSdp);
  formData.set("session", JSON.stringify(sessionConfig));

  try {
    const response = await fetch("https://api.openai.com/v1/realtime/calls", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`
      },
      body: formData
    });

    const body = await response.text();
    if (!response.ok) {
      sendJson(res, response.status, { error: body });
      return;
    }

    res.writeHead(200, { "Content-Type": "application/sdp; charset=utf-8" });
    res.end(body);
  } catch (error) {
    sendJson(res, 500, { error: error.message });
  }
}

const server = http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/session") {
    createRealtimeSession(req, res);
    return;
  }

  if (req.method === "GET" || req.method === "HEAD") {
    serveStatic(req, res);
    return;
  }

  res.writeHead(405, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("Method not allowed");
});

server.listen(port, () => {
  console.log(`DrinkX AI Barista prototype: http://localhost:${port}`);
});
