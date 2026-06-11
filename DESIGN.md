---
version: "alpha"
name: "DrinkX Cognitive Uplink Terminal"
description: "Voice-first kiosk interface for AI-assisted drink ordering, adapted from the Cognitive Uplink Terminal design system."
colors:
  primary: "#FF8800"
  secondary: "#2A1E16"
  tertiary: "#443427"
  neutral: "#FFFFFF"
  background: "#1C140E"
  surface: "#2A1E16"
  text-primary: "#F5E9DC"
  text-muted: "#9C846D"
  border: "#443427"
  accent: "#FF8800"
typography:
  headline-lg:
    fontFamily: "SFMono-Regular"
    fontSize: "24px"
    fontWeight: 600
    lineHeight: "32px"
    letterSpacing: "0"
    textTransform: "uppercase"
  body-md:
    fontFamily: "SFMono-Regular"
    fontSize: "10px"
    fontWeight: 400
    lineHeight: "16px"
    letterSpacing: "0.1em"
    textTransform: "uppercase"
  label-md:
    fontFamily: "SFMono-Regular"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: "24px"
rounded:
  md: "8px"
spacing:
  base: "4px"
  gap: "6px"
  card-padding: "12px"
  section-padding: "24px"
components:
  terminal-panel:
    backgroundColor: "{colors.secondary}"
    borderColor: "{colors.border}"
    rounded: "{rounded.md}"
    padding: "{spacing.card-padding}"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.background}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
---

## Overview

DrinkX uses a bounded grid, glassy terminal panels, monospaced typography, and a dot-matrix animated background. The interface should feel like a technical ordering terminal with a live AI core.

## Usage

- Use `/assets/drinkx-logo.png` as the primary brand asset. Place it on a light logo plate when used over dark terminal backgrounds so the dark wordmark remains legible.
- Use orange only for active states, primary actions, system pulses, and confirmed selections.
- Keep the order card, assistant state, and option panels aligned to a strong grid.
- Avoid unrelated accent colors unless they communicate state.
- Keep text concise because voice is the primary interaction.
