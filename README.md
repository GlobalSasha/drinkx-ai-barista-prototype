# DrinkX AI Barista Prototype

Голосовой прототип интерфейса DrinkX для заказа напитков через AI-бариста.

## Возможности

- Голосовой диалог на русском языке через OpenAI Realtime API.
- Выбор напитка, размера, молока, сиропа, сахара и температуры.
- Визуальное меню с фотографиями напитков.
- Карточка состава и подтверждение заказа.
- Экран приготовления с таймером.
- Адаптация под вертикальный планшет 16:9 и мобильные экраны.

## Запуск

1. Создайте локальный файл `.env` на основе `.env.example`.
2. Добавьте OpenAI API key:

```env
OPENAI_API_KEY=your_openai_api_key_here
PORT=3000
```

3. Запустите проект:

```bash
npm start
```

4. Откройте [http://localhost:3000](http://localhost:3000).

## Режим Barista

Рабочий прототип встроенного интерфейса для бариста доступен отдельно:

[http://localhost:3000/barista.html](http://localhost:3000/barista.html)

В нём можно выбрать категорию, молоко, сироп, сахар и размер, а затем одним нажатием запустить демонстрацию приготовления напитка.

Визуальные варианты:

- [Blueprint Manifest](http://localhost:3000/barista.html)
- [Control Panel](http://localhost:3000/barista-control.html)
- [Retro Terminal](http://localhost:3000/barista-retro.html)

## Публичные прототипы

После публикации через GitHub Pages три интерфейса доступны как отдельные сайты:

- [Выбрать прототип](https://globalsasha.github.io/drinkx-ai-barista-prototype/prototypes.html)
- [Blueprint Manifest](https://globalsasha.github.io/drinkx-ai-barista-prototype/barista.html)
- [Control Panel](https://globalsasha.github.io/drinkx-ai-barista-prototype/barista-control.html)
- [Retro Terminal](https://globalsasha.github.io/drinkx-ai-barista-prototype/barista-retro.html)

Публикация запускается автоматически после изменений в ветке `main`.

## Проверка

```bash
npm run check
```

Файл `.env` не сохраняется в Git и не должен публиковаться.
