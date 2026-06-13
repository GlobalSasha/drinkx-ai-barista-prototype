/* DrinkX "living mind" — interactive neural constellation for the home hero card.
   Calm intelligent presence, not a mascot: drifting nodes, synaptic links,
   breathing glow. Reacts to touch — nodes gravitate to the finger, links
   brighten, a tap emits a soft thought-pulse. Canvas 2D, one rAF loop,
   paused off-screen; prefers-reduced-motion renders a single static frame. */

const ACCENT = [255, 110, 50];     // electric orange
const WARM = [255, 238, 224];      // warm white
const LINK_DIST = 105;
const POINTER_DIST = 170;

export function initMind(canvas, pointerHost) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let W = 0, H = 0, dpr = 1;
  let nodes = [];
  let pulses = [];                  // { x, y, t0 } expanding thought rings
  let synapse = null;               // { a, b, t0 } traveling spark between nodes
  let pointer = { x: 0, y: 0, active: false };
  let running = false;
  let rafId = 0;
  let last = performance.now();
  let nextSynapseAt = 2200;
  let clock = 0;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = rect.width;
    H = rect.height;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (!nodes.length) seed();
  }

  function seed() {
    const count = Math.round(Math.min(46, Math.max(26, (W * H) / 9000)));
    nodes = Array.from({ length: count }, (_, i) => {
      /* bias the constellation to the airy top-right half of the card,
         keeping the headline on the left readable */
      const biased = i % 3 !== 0;
      const x = biased ? W * (0.38 + Math.random() * 0.6) : W * Math.random();
      const y = biased ? H * (Math.random() * 0.72) : H * Math.random();
      const a = Math.random() * Math.PI * 2;
      return {
        x, y,
        vx: Math.cos(a) * 7, vy: Math.sin(a) * 7,   // px/s drift
        r: 1.7 + Math.random() * 2.1,
        warmth: Math.random(),                        // 0=white, 1=orange
        phase: Math.random() * Math.PI * 2
      };
    });
  }

  function step(dt) {
    clock += dt;
    for (const n of nodes) {
      // gentle pointer gravity
      if (pointer.active) {
        const dx = pointer.x - n.x, dy = pointer.y - n.y;
        const d = Math.hypot(dx, dy);
        if (d > 1 && d < POINTER_DIST) {
          const f = (1 - d / POINTER_DIST) * 26 * dt;
          n.vx += (dx / d) * f;
          n.vy += (dy / d) * f;
        }
      }
      // pulse rings push outward as they pass
      for (const p of pulses) {
        const age = (clock - p.t0) / 1000;
        const ring = age * 220;
        const d = Math.hypot(n.x - p.x, n.y - p.y);
        if (Math.abs(d - ring) < 26 && d > 1) {
          const f = 16 * dt;
          n.vx += ((n.x - p.x) / d) * f;
          n.vy += ((n.y - p.y) / d) * f;
        }
      }
      // damping toward calm drift speed
      const speed = Math.hypot(n.vx, n.vy);
      const calm = 7;
      if (speed > calm) { n.vx *= 0.965; n.vy *= 0.965; }
      n.x += n.vx * dt;
      n.y += n.vy * dt;
      // soft bounce inside bounds
      if (n.x < 6) { n.x = 6; n.vx = Math.abs(n.vx); }
      if (n.x > W - 6) { n.x = W - 6; n.vx = -Math.abs(n.vx); }
      if (n.y < 6) { n.y = 6; n.vy = Math.abs(n.vy); }
      if (n.y > H - 6) { n.y = H - 6; n.vy = -Math.abs(n.vy); }
    }

    pulses = pulses.filter((p) => clock - p.t0 < 1600);
    if (synapse && clock - synapse.t0 > 900) synapse = null;

    // idle "thinking": fire a spark along a random existing link
    if (clock > nextSynapseAt) {
      nextSynapseAt = clock + 2600 + Math.random() * 2600;
      const a = nodes[Math.floor(Math.random() * nodes.length)];
      let best = null, bestD = LINK_DIST;
      for (const b of nodes) {
        if (b === a) continue;
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < bestD) { best = b; bestD = d; }
      }
      if (best) synapse = { a, b: best, t0: clock };
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const breathe = 0.72 + 0.28 * Math.sin(clock / 1700);

    // links
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d2 = dx * dx + dy * dy;
        if (d2 > LINK_DIST * LINK_DIST) continue;
        const d = Math.sqrt(d2);
        let alpha = (1 - d / LINK_DIST) * 0.26 * breathe;
        if (pointer.active) {
          const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
          const pd = Math.hypot(pointer.x - mx, pointer.y - my);
          if (pd < POINTER_DIST) alpha += (1 - pd / POINTER_DIST) * 0.34;
        }
        ctx.strokeStyle = `rgba(${ACCENT}, ${Math.min(alpha, 0.55).toFixed(3)})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }

    // traveling synapse spark
    if (synapse) {
      const t = Math.min(1, (clock - synapse.t0) / 800);
      const x = synapse.a.x + (synapse.b.x - synapse.a.x) * t;
      const y = synapse.a.y + (synapse.b.y - synapse.a.y) * t;
      const fade = Math.sin(t * Math.PI);
      ctx.fillStyle = `rgba(${ACCENT}, ${(0.8 * fade).toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(x, y, 2.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = `rgba(${ACCENT}, ${(0.18 * fade).toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.fill();
    }

    // thought-pulse rings (tap feedback)
    for (const p of pulses) {
      const age = (clock - p.t0) / 1000;
      const ring = age * 220;
      const alpha = Math.max(0, 0.3 * (1 - age / 1.6));
      ctx.strokeStyle = `rgba(${ACCENT}, ${alpha.toFixed(3)})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(p.x, p.y, ring, 0, Math.PI * 2);
      ctx.stroke();
    }

    // nodes: soft halo + core
    for (const n of nodes) {
      const tw = 0.55 + 0.45 * Math.sin(clock / 900 + n.phase);
      let glow = 0;
      if (pointer.active) {
        const pd = Math.hypot(pointer.x - n.x, pointer.y - n.y);
        if (pd < POINTER_DIST) glow = 1 - pd / POINTER_DIST;
      }
      const c = n.warmth > 0.62 || glow > 0.35 ? ACCENT : WARM;
      ctx.fillStyle = `rgba(${c}, ${(0.14 + glow * 0.22).toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r * (2.6 + glow * 2), 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = `rgba(${c}, ${Math.min(0.9, (0.46 + 0.38 * tw + glow * 0.4) * breathe).toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r + glow * 0.8, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    step(dt);
    draw();
    rafId = requestAnimationFrame(frame);
  }

  function start() {
    if (running || reduced) return;
    running = true;
    last = performance.now();
    step(0.016);
    draw();                          // immediate frame: visible even if rAF is throttled
    rafId = requestAnimationFrame(frame);
  }

  function stop() {
    running = false;
    cancelAnimationFrame(rafId);
  }

  // pointer interaction (host = the hero card button; canvas itself is inert)
  const host = pointerHost || canvas.parentElement;
  host.addEventListener("pointermove", (e) => {
    const rect = canvas.getBoundingClientRect();
    pointer.x = e.clientX - rect.left;
    pointer.y = e.clientY - rect.top;
    pointer.active = true;
  });
  host.addEventListener("pointerleave", () => { pointer.active = false; });
  host.addEventListener("pointerdown", (e) => {
    const rect = canvas.getBoundingClientRect();
    pulses.push({ x: e.clientX - rect.left, y: e.clientY - rect.top, t0: clock });
  });

  // run only while the home screen is visible
  const app = document.querySelector(".app");
  const syncRunState = () => {
    const onHome = app.dataset.screen === "home" && !document.hidden;
    if (onHome) { resize(); start(); } else stop();
  };
  new MutationObserver(syncRunState).observe(app, { attributes: true, attributeFilter: ["data-screen"] });
  document.addEventListener("visibilitychange", syncRunState);
  new ResizeObserver(() => {
    nodes = [];
    resize();
    if (nodes.length) { step(0.016); draw(); }
  }).observe(canvas);

  resize();
  if (reduced) {
    step(0.016);
    draw();                          // single calm static frame
  } else {
    syncRunState();
  }
}
