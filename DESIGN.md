---
version: "beta"
name: "DrinkX Neo-Brutalist Barista"
description: "Voice-first + touch hybrid kiosk interface for AI-assisted drink ordering. Neo-brutalism 2.0: raw flat surfaces, thick black borders, hard offset shadows, editorial heavy typography."
colors:
  primary-yellow: "#FFD700"
  primary-magenta: "#FF1493"
  primary-cyan: "#00CED1"
  secondary-green: "#32CD32"
  secondary-orange: "#FF4E00" # DrinkX brand accent
  black: "#0A0A0A"
  white: "#FFFFFF"
  grey: "#F5F5F5"
typography:
  display:
    fontFamily: "Unbounded" # heavy editorial sans, Cyrillic support
    weights: [700, 900]
    textTransform: "uppercase"
  mono:
    fontFamily: "JetBrains Mono" # engineering labels, body, telemetry
    weights: [400, 500, 700]
  scale:
    h1: "46px desktop / 32px mobile, weight 900"
    h2: "28px desktop / 22px mobile, weight 900"
    body: "15px, mono 400"
    caption: "11-12px, mono 700, uppercase, letter-spacing 0.08em"
rounded:
  none: "0px" # sharp corners everywhere
borders:
  default: "3px solid #0A0A0A"
  thin: "2px solid #0A0A0A"
  heavy: "4px solid #0A0A0A"
shadows:
  default: "4px 4px 0 #0A0A0A" # flat, no blur, no gradients, no glow
  large: "8px 8px 0 #0A0A0A"
  small: "3px 3px 0 #0A0A0A"
spacing:
  base: "8px grid (8, 16, 24, 32, 48)"
  card-padding: "16-24px"
  button-padding: "18px 24px (xl)"
voice-states:
  idle: "yellow fill, slow breathing pulse (scale 1 -> 1.04, 2.6s)"
  listening: "magenta fill, fast pulse (0.9s), white sound bars wave"
  thinking: "cyan fill, status dot spins (flat square rotation)"
  speaking: "green fill, sound bars dance"
components:
  button: "white/yellow/magenta fill, 3px black border, 4px flat shadow; press = translate(4,4) + shadow collapse"
  menu-card: "white, 3px border, 4px shadow, square image, magenta type tag; active = yellow fill + -1.2deg tilt"
  order-chip: "white, 2px border, 3px shadow, black icon square with yellow mono glyph"
  detail-sheet: "bottom sheet, 4px black top border, slide-up 0.28s"
  ticker: "yellow marquee strip, display font, 36s linear loop"
  confetti: "flat 12px squares, 2px black border, brand palette, fall + rotate"
motion:
  principles: "flat scale + translate only; no 3D, no gradients, no soft glow; intentional jitter (rotate ±0.8deg, steps(2)); staggered rise-in for cards (40ms per index); prefers-reduced-motion disables everything"
---

## Overview

DrinkX AI Barista is a two-screen voice + touch hybrid:

1. **Welcome** — editorial hero ("ПРИВЕТ. Я ТВОЙ AI-БАРИСТА"), pulsing flat-face barista mark, two equal entry points: tap (ВЫБРАТЬ НАПИТОК) and voice (СКАЗАТЬ «ХОЧУ КОФЕ»), drink-name marquee ticker.
2. **Select** — voice orb with four animated states + always-visible tappable menu grid. Voice and touch run in parallel: a tap feeds the live dialog as an interface event; the agent confirms it by voice. Order chips mirror every understood slot. Confirm dock at the bottom.

Then: **Preparing** (giant timer on yellow block, magenta progress bar) and **Ready** (green ГОТОВО! stamp, confetti).

## Usage

- Use `/assets/drinkx-logo.png` on a white bordered plate.
- Color communicates state, not decoration: yellow=idle/brand, magenta=action/listening, cyan=thinking/info, green=speaking/success, orange=DrinkX brand accents only.
- Black on white stark contrast; max 2 font families (Unbounded + JetBrains Mono).
- Everything sits on a hard grid separated by 3px black rules; no border-radius, no gradients, no blur shadows.
- Keep text concise: voice leads, screen confirms.
