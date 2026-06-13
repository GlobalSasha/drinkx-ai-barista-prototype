# DrinkX AI Barista — Expressive Premium Concept

UX/UI specification + implementation notes for the next-generation AI Barista touchscreen interface.
Working prototype: `public/concept/` (open `/concept/` on the running server).

---

## 1. Product concept summary

DrinkX is not a vending menu — it is **an intelligent barista inside the station**. The customer does not pick from a list of coffee categories; they express a *situation, mood, or intent* ("Wake me up", "Refresh me", "No caffeine") and the AI Barista reduces choice to 2–3 personally argued recommendations, explains them like a real barista, and then **builds the drink visibly** — a transparent-cup "assembly show" that turns waiting time into the most memorable part of the experience.

Core formula: **Hybrid AI Interface = intent icons + short AI dialogue + recommendation cards + adaptive learning menu.**

Three product promises:

1. **Fast path always exists** — Fast Order and "As Usual" bypass all AI interaction in ≤3 taps.
2. **AI reduces choice** — never more than 3 recommendation cards, never more than 2 quick questions.
3. **The drink feels personally assembled** — assembly preview → live preparation → satisfying ready moment, never a spinner.

Visual direction: **Expressive Premium Cards** — dark warm graphite, Electric Orange accent, satin-surface cards with large radii, ingredient-colored details, calm intelligent motion. Premium, not playful; AI-driven, not chat-first; futuristic, but practical for high-traffic touch.

---

## 2. Full user journey

```
                        ┌──────────────┐
                        │  IDLE/ATTRACT │  (loop video / pulse, any touch wakes)
                        └──────┬───────┘
                               ▼
                        ┌──────────────┐
              ┌─────────│  1 HOME      │────────────┐
              │         └──┬────────┬──┘            │
   "Fast Order"            │        │          "As Usual"
              │   "Pick with AI"  "Surprise Me"     │ (saved profile)
              ▼            ▼        │               │
      ┌──────────┐  ┌──────────┐    │               │
      │ classic  │  │ 2 INTENT │    │               │
      │ grid     │  └────┬─────┘    │               │
      └────┬─────┘       ▼          │               │
           │       ┌──────────┐     │               │
           │       │ 3 QUICK  │     │               │
           │       │ QUESTIONS│     │               │
           │       └────┬─────┘     │               │
           │            ▼           │               │
           │      ┌───────────┐     │               │
           │      │ 4 RECOMMEND│◄───┘ (reveal card) │
           │      └────┬───────┘                    │
           │     ┌─────┴─────┐                      │
           │  "Order"   "Customize"                 │
           │     │           ▼                      │
           │     │     ┌──────────┐                 │
           │     │     │ 5 CUSTOM │                 │
           │     │     └────┬─────┘                 │
           ▼     ▼          ▼                       ▼
        ┌────────────────────────────┐
        │ 6 SUMMARY / FINAL CONFIRM  │  (never straight to prep)
        └─────────────┬──────────────┘
                      ▼
        ┌────────────────────────────┐
        │ 7 ASSEMBLY PREVIEW         │  ghost blueprint, 3–7 s,
        │   "Still editable"         │  last small edits allowed
        └─────────────┬──────────────┘
                      ▼  (machine starts dosing → recipe locked)
        ┌────────────────────────────┐
        │ 8 LIVE PREPARATION         │  telemetry- or timer-driven,
        │   "Recipe locked"          │  same cup/module visual language
        └─────────────┬──────────────┘
                      ▼
        ┌────────────────────────────┐
        │ 9 READY                    │  glow, pickup instruction
        └─────────────┬──────────────┘
                      ▼
        ┌────────────────────────────┐
        │ 10 RATE / SAVE             │  feeds the learning menu
        └─────────────┬──────────────┘
                      ▼ timeout / done
                    HOME
```

Hard rule: **at no point after order confirmation does the user see a bare spinner, static progress bar, or generic loading screen.**

---

## 3. Screen-by-screen UX specification

### 3.1 Home (main choice screen)

| | |
|---|---|
| **Purpose** | Route four user modes in one glance; greet; surface adaptive picks. |
| **Headline** | "What should we make today?" |
| **Layout** | Top: greeting + AI orb. Center: bento — one **hero card** "Pick with AI Barista" + three supporting cards (Fast Order / Surprise Me / As Usual). Bottom: `AdaptiveRecommendationStrip`. |
| **Components** | `HeroRecommendationCard`, `ExpressiveCard ×3`, `AdaptiveRecommendationStrip`, `AIBaristaPanel` (greeting line). |
| **Copy** | Hero: "Pick with AI Barista — tell me the mood, I'll find the drink." Fast Order: "Classics, no questions." Surprise Me: "Feeling lucky?" As Usual: "Your Focus Flat, M, oat" (when profile exists) / "Save a drink once — reorder in one tap." |
| **Actions** | Tap any of 4 cards; tap a strip chip → jumps straight to that drink's summary. |
| **AI behavior** | Greeting adapts to daypart ("Good morning — need a proper start?"). Strip recomputes from time/weather/popularity. |
| **Animation** | Cards rise-stagger on entry; hero has a slow living edge-glow; strip chips slide in; orb breathes. |
| **Edge cases** | No saved profile → "As Usual" shows teaching copy and routes to AI pick. AI offline → hero card stays, but routes to rule-based flow (identical UI). Idle 60 s → attract loop. |

### 3.2 Intent selection

| | |
|---|---|
| **Purpose** | Replace coffee categories with situational intent. |
| **Headline** | "What's the mood?" |
| **Layout** | 8 `IntentCard`s in an expressive 2-column rhythm (not a uniform kiosk grid — alternating heights), bottom bar: "Just show the menu" escape hatch. |
| **Intents** | Wake me up · Focus · Refresh me · Soft taste · Something sweet · No caffeine · On the road · Surprise me. |
| **Icons** | Custom line+soft-fill SVG: elegant pulse, focus ring, wave/ice glow, milk swirl cloud, caramel drop, calm moon cup, road line, spark. |
| **Actions** | Single tap advances. "Surprise me" skips questions entirely. |
| **AI behavior** | Card order adapts: morning boosts "Wake me up", heat boosts "Refresh me", evening boosts "No caffeine". |
| **Animation** | Selected card expands ~4 % with orange edge, others dim 200 ms, then morph-transition to questions. |
| **Edge cases** | Ingredient outage can dim an intent (e.g., no milk → "Soft taste" dimmed with "limited today"). |

### 3.3 Quick questions (max 2)

| | |
|---|---|
| **Purpose** | Sharpen the intent with ≤2 tappable questions — never a chat. |
| **Headline** | Question itself, e.g. "How do you want the energy?" |
| **Layout** | AI orb + question as the panel headline; 3–5 large `PillActionButton` options; progress dots (1/2); back affordance. |
| **Example** | Wake me up → Q1 "How do you want the energy?": Strong and clean / With milk, but still bold / Cold and refreshing / Not bitter, but energizing. Q2 "Any preferences?": No sugar / Regular milk / Oat milk / No milk / Not sure. |
| **Actions** | Tap option → next question or straight to recommendations. "Not sure" is always present and safe. |
| **AI behavior** | Q2 can be skipped when Q1 answer is decisive (e.g. "Strong and clean" → only milk question matters → asked; "Cold and refreshing" → sweetness question instead). |
| **Animation** | Options cascade in 40 ms apart; chosen pill fills orange and flies up into a "context chip" under the orb. |
| **Edge cases** | 20 s inactivity → AI proposes default ("I'll assume balanced — here are my picks") with undo. |

### 3.4 Recommendation cards

| | |
|---|---|
| **Purpose** | AI's answer: 1 hero + 2 alternatives, argued like a barista. |
| **Headline** | "My pick for you" |
| **Layout** | Large `DrinkRecommendationCard` (hero) with AI-selected animated highlight + badge "AI pick"; two smaller alternates beside/below; mini `TasteProfileCard`; bottom action bar. |
| **Card contents** | Drink name (display type) · taste line ("Strong · milky · no sugar") · taste tags · **why** ("I picked this because you want energy without too much sweetness.") · key modifiers · price · CTA "Order". |
| **Quick mutations** | Make it softer / Make it colder / Make it stronger — these *re-rank or transform* the hero card in place (visible swap animation), they don't open menus. |
| **Secret Menu** | Branded names layer: Focus Flat, Morning Boost, Latte Soft, Iced Balance, Oat Vanilla Calm, Road Coffee, After Lunch, No Sugar Creamy, Cold Energy, Evening Decaf. Surfaced via strip chip + "Surprise me". |
| **AI behavior** | Explanation is generated from answer→tag mapping (template grammar in fallback mode; LLM phrasing in advanced mode). |
| **Animation** | Hero card materializes with a soft scale-settle; alternates slide from underneath; tapping an alternate promotes it to hero with a card-morph. |
| **Edge cases** | An ingredient missing → card not hidden but re-composed ("with regular milk today — oat is out") or replaced; never show an orderable drink that can't be made. |

### 3.5 Customization ("drink profile editor")

| | |
|---|---|
| **Purpose** | Conversational, visual tuning — not an options table. |
| **Headline** | "Make it yours" |
| **Layout** | Center: live drink card (mini cup updates with milk color/ice). Side/below: segmented pill controls — Strength (light/balanced/strong), Sweetness (none/low/medium/sweet), Milk (regular/oat/coconut/none), Temperature (hot/iced), Syrup (none/vanilla/caramel/hazelnut), Size (S/M/L). `AIBaristaPanel` explains the *last change* in plain language. Live `TasteProfilePanel`. |
| **AI copy examples** | "Oat milk will make the drink softer and naturally sweeter." · "Less milk will make the coffee taste more intense." · "Half vanilla gives aroma without making it a dessert." |
| **Actions** | Each control applies instantly (profile bars animate); "Done — looks right" returns to summary. |
| **Animation** | Cup liquid recolors with a 400 ms crossfade; affected taste bar flashes orange; AI line slides up replacing previous. |
| **Edge cases** | Incompatible combo (decaf + Cold Energy) → control disabled with reason chip, not silent. Price delta always visible. |

### 3.6 Summary / final confirm

| | |
|---|---|
| **Purpose** | The mandated stop between "Order" and preparation — confirm, pay (stub), last full edit point. |
| **Headline** | "Your {Drink Name}" |
| **Layout** | Drink card with final taste line + modifier chips + price; buttons: **Start preparation** (primary) / Customize / Back. |
| **Edge cases** | Payment fail → stay here with gentle retry copy. Walk-away timeout → cancel to home, nothing charged. |

### 3.7 Assembly preview (Screen 5 — see §4)
### 3.8 Live preparation (Screen 6 — see §5)
### 3.9 Ready (Screen 7 — see §6)
### 3.10 Rate / save (Screen 8 — see §6)

---

## 4. Dynamic drink assembly screen concept

**The most important screen.** After "Start preparation", the recommendation card *transforms* into an assembly scene — the drink name persists, the card surface expands into a stage. No cut to a loader.

### Phase 1 — Assembly Preview ("Still editable", 3–7 s)

Central metaphor: **transparent cup as an X-ray blueprint**.

- `TransparentDrinkCup` — procedural SVG glass (tapered silhouette, rim ellipse, two light-streak reflections). Interior is a clip-path; layers render inside it.
- **Ghost build**: layers appear bottom-up at ~800 ms/stage in translucent "blueprint" opacity with thin labels (Coffee base → Milk → Foam → Syrup accent → Ice). Structured layers with gradients, not flat fills; foam gets bubble texture; syrup is a thin swirl path; ice cubes drop with mass.
- `StationModuleNode`s arranged around the cup (coffee, water, milk, syrup, foam, cooling, heating — only the recipe's modules). The node for the current stage glows orange; an `IngredientFlow` (animated dashed SVG path, ingredient-colored) flows from node to rim while its layer fills.
- `TasteProfilePanel` — 4–6 bars relevant to this drink (Strength, Milkiness, Sweetness, Caffeine + Texture/Temperature chips). Each stage's `tasteImpact` animates and flash-highlights the affected metric.
- `AIBaristaComment` — one line, ≤90 chars, synced to stage: "I'm starting with a dense coffee base so the drink stays bold."
- `AssemblyTimeline` — dot/segment timeline: done · current (pulsing) · upcoming.
- **Editing rail** (`RecipeModificationControls`): Make it stronger / Make it softer / Less sweet / Change milk / Add vanilla — plus **Start now**. A countdown ring on "Start now" auto-advances after ~7 s. Edits mutate the recipe, profile bars react, ghost layers re-tint, preview restarts compressed.
- Banner state: **"Still editable"** (soft outline chip).

Example content (Focus Flat): headline "Building your Focus Flat", sub "Strong coffee base, smooth milk texture, no added sugar." Steps: Coffee base → "Dense coffee profile for energy" · Milk texture → "Softened with microfoam" · Balance check → "Keeping it bold, not bitter" · Final temperature → "Ready for the perfect first sip". Profile: Strength 82 % · Milkiness 45 % · Sweetness 0 % · creamy · hot.

### Phase 2 transition

When dosing begins (telemetry `coffee_dosing_started` or simulated timer): editing rail collapses into locked actions, banner flips to **"Preparation started — recipe locked"**, ghost layers drain in a quick elegant sweep, and the *same scene* re-fills for real. Continuity of cup, modules, name, and profile makes the lock legible without a screen cut.

**Never let the user believe they can change something the machine has already dosed.** Buttons before lock: Make stronger / Less sweet / Change milk / Start now. After lock: Save this drink / Show taste profile / Why this recipe? / Skip animation.

---

## 5. Dynamic preparation screen concept

Same scene, now truth-driven. Not a spinner — a **premium animated status card system**.

- **Stage cards**: large current-stage card (title + human line), e.g. "Foaming milk — Good foam is about texture, not just volume. I'm creating a soft layer so the drink feels smoother."
- **Cup fills for real**, layer by layer, synced to stage events; module glow = active machine process; flow lines run only while their stage runs.
- **Progress ring** around the cup + % + ETA; `AssemblyTimeline` advances.
- Canonical stage vocabulary: Preparing cup / checking recipe → Dosing coffee base → Heating water or milk → Foaming milk → Adding syrup → Mixing / layering → Final pour → Ready. Stages are **data-driven per recipe** (an Americano never shows a foam stage).
- **Telemetry binding**: events `recipe_started, cup_detected, coffee_dosing_started/completed, water_started/completed, milk_started/completed, foam_started/completed, syrup_started/completed, rinse_required, error, drink_ready` map 1:1 onto stage starts/completions. Without telemetry, a **simulated driver** plays the same events on the recipe's `durationMs` schedule — visually identical.
- **Interactions during prep** (never block the machine): Why this recipe? · Show taste profile · Save as my DrinkX · Recommend next time · Skip animation (simplifies display to compact stage list + ring; never cancels preparation).
- Edge cases: telemetry stalls > stage budget ×1.6 → switch to estimated mode with honest copy "Taking a little longer — finishing your foam properly." `error` → human recovery card ("Milk module needs attention. I can make this drink without milk or suggest another option."), never raw codes.

---

## 6. Drink ready & post-order interaction

### Ready (Screen 7)

Satisfying conclusion, no confetti, no cartoon celebration:

- Cup visualization completes and **settles**: flow lines fade, modules dim, a single elegant ring of warm glow blooms around the finished cup.
- Headline "Your Focus Flat is ready" · sub "Bold, smooth, and built for focus." · large pickup instruction "Please take your cup from the dispensing area."
- Completed taste summary chips: Strong · smooth · no sugar · hot.
- AI final line: "Try it first without sugar — this recipe is designed to stay bold but smooth."
- Actions (`ReadyDrinkCard` + bar): Save as my DrinkX · Rate the drink · Order again · Try something softer next time · (loyalty QR slot).
- Emotional closer: "Want me to remember this recipe for next time?"

### Rate / save (Screen 8)

- One question: **"How was the balance?"** Options: Perfect · Too strong · Too sweet · Too milky · Not cold enough.
- Save flow: name the drink (default = recipe name), stored to taste profile; "As Usual" card on Home now shows it.
- Rating writes a taste-profile delta (e.g. "Too strong" → strength −8 for future recommendations) — the input of the **AI Menu That Learns**.
- Everything skippable; auto-return to attract after 20 s.

---

## 7. Adaptive AI Menu That Learns

Inputs → effects:

| Signal | Effect |
|---|---|
| Time of day | Morning: Cappuccino, Flat White, Americano, Morning Boost · Afternoon: After Lunch · Evening: Evening Decaf boost |
| Weather | Hot: Iced Latte, Iced Americano, Cold Energy, Lemon Tea promoted; cold: hot classics |
| Location type | Gas station: Road Coffee, Fast Cappuccino, Americano to go · Office: As usual, Focus Flat, No Sugar Creamy · Hotel: Soft Morning, Premium Latte, Evening Decaf, Classic Barista |
| Ingredient availability | Recompose or substitute, never show unmakeable drinks |
| Margin priorities | Tie-break re-ranking only — never overrides taste fit |
| User history / repeats | "As Usual" instant card; repeat-purchase boost; rating deltas shift the user taste vector |
| Popular combinations | "Popular here now" strip chip, local sales aggregation |

Mechanism (fallback-safe): every recipe has a tag/taste vector; context produces a weight vector; score = taste fit × context weight × availability × margin epsilon. Runs entirely on-device as rules; the AI service only upgrades *phrasing and edge intelligence*, so **AI-offline mode is the same UX with templated copy**.

---

## 8. Visual design system

**Direction: Expressive Premium Cards** — premium, intelligent, warm, slightly futuristic. Not fast-food, not Material-default, not neobrutalist, not gamified.

### Tokens

| Token | Value | Use |
|---|---|---|
| `--bg-0` | `#13110F` | app background (deep warm graphite) |
| `--bg-1` | `#1A1714` | section panels |
| `--surface` | `#211D19` | cards |
| `--surface-2` | `#2A251F` | elevated / active cards |
| `--edge` | `rgba(255,243,230,.08)` | 1 px inner light edge on every card |
| `--text` | `#F4EDE4` | primary (warm off-white) |
| `--text-dim` | `#A4988A` | secondary |
| `--accent` | `#FF4E00` | Electric Orange — actions, active edges, glow |
| `--accent-soft` | `rgba(255,78,0,.15)` | washes, badges |
| Ingredient | coffee `#7A4A26` · milk `#F2E9DC` · oat `#E0C9A4` · caramel `#D69A4E` · ice `#9FD4E8` · foam `#FAF3E7` · water `#BFD9E2` · cocoa `#5A3A28` | layers, flows, accents |
| Radii | cards 28 px · pills 999 px · cup stage 32 px | |
| Shadow | `0 24px 60px -28px rgba(0,0,0,.8)` + edge light | soft depth, no hard offsets |
| Type | **Onest** 400/500/600/800 (brand font; Google Fonts, system fallback) | display 800 for drink names; 500 body; tabular numerals for metrics |

Type scale (kiosk portrait): display 40/32 · h2 26 · card title 20 · body 16 · micro 13 (caps, tracked).

### Material rules

Solid dark satin surfaces + selective translucent overlays; illuminated 1 px edges; orange edge = active; ingredient-colored soft accents; depth through layering, **glass only as supporting material** (cup, sheen) — never whole-screen glassmorphism. No pure-white backgrounds, no rainbow, no childish gradients.

### Motion principles

Soft-spring curve `cubic-bezier(.22,1,.36,1)`, 250–500 ms. Every animation explains something: selection = gentle expansion + orange edge; card-morph between screens; flows = moving dashed paths; module glow = active process; meters animate on impact; AI lines fade/slide. **No bounce, no confetti, no wobble, nothing that slows ordering.** Full `prefers-reduced-motion` fallback: states swap instantly, ring becomes numeric %.

### Iconography

Custom line + soft-fill SVG set (24 px grid, 1.8 px stroke, low-opacity fill): pulse, focus ring, cold wave, milk swirl, caramel drop, moon cup, road, spark; module icons: bean, droplet, syrup drop, water drop, foam bubbles, snowflake, flame. No Material defaults, no emoji.

### Adaptive styling

Daypart/context shifts **emphasis only** (greeting, strip order, accent temperature ±, recommended badges) — brand style never changes wholesale.

---

## 9. Component architecture

Prototype = vanilla ES modules (matches existing stack, zero build, kiosk-fast). Production = React; mapping is 1:1.

```
<App>                                    state machine root (screen, order, profile)
├── <ScreenRouter>
│   ├── <HomeScreen>
│   │   ├── <AIBaristaPanel greeting/>
│   │   ├── <HeroRecommendationCard/>          "Pick with AI"
│   │   ├── <ExpressiveCard×3/>                Fast / Surprise / AsUsual
│   │   └── <AdaptiveRecommendationStrip/>
│   ├── <IntentScreen>        → <IntentCard×8/>
│   ├── <QuestionScreen>      → <PillActionButton×n/> <ProgressDots/>
│   ├── <RecommendScreen>     → <DrinkRecommendationCard hero/> <AltCard×2/> <TasteProfileCard mini/>
│   ├── <CustomizeScreen>     → <SegmentedPills×6/> <AIBaristaPanel explain/> <TasteProfilePanel/>
│   ├── <SummaryScreen>
│   ├── <DrinkAssemblyScreen>                  phases: preview | preparing
│   │   ├── <TransparentDrinkCup>              procedural SVG
│   │   │   └── <DrinkLayer×n/> <FoamTexture/> <IceCubes/> <SyrupSwirl/> <PourStream/>
│   │   ├── <StationModuleNode×n/> + <IngredientFlow×n/>
│   │   ├── <TasteProfilePanel live/>
│   │   ├── <AIBaristaComment/>
│   │   ├── <AssemblyTimeline/>
│   │   ├── <PreparationProgress ring/>
│   │   └── <RecipeModificationControls/> | <LockedActions/>
│   ├── <DrinkReadyScreen>    → <ReadyDrinkCard/> <BottomActionBar/>
│   └── <RatingScreen>        → <RatingCard/>
├── <AssemblyEngine>          stage scheduler + telemetry adapter (EventTarget)
└── <Recommender>             rule-based scoring (AI-service optional upgrade)
```

Animation approach: CSS transitions/keyframes for cards & screens; SVG geometry transitions + dash-offset keyframes for cup/flows; rAF only for the progress ring. (React production: Framer Motion for card morphs/choreography; keep cup as plain SVG + CSS for performance.)

**Drink motion assets** (`public/concept/drink-assets.js` + `motion-asset.js`): asset-driven visual architecture per the unified brief §25–§39. Every drink resolves a `DrinkAssetSet` (static render / assembly video WebM+MP4 / preparation video / ready render / poster / fallback) by `drinkId` — nothing is hardcoded per screen. `preloadDrinkAssets(drinkId)` fires on selection (cached, probe-based; the prep screen never waits for loading). `DrinkMotionAsset` (vanilla `mountDrinkVisual`/`mountStageMotion`; React props contract documented in the brief) mounts videos over the cup area of the assembly stage with `has-video`; modules, flows, progress ring, timeline and AI comments keep running in sync around the video. Any video failure falls back to the premium procedural scene without breaking the flow (internal console.warn only). The stage engine supports **overlapping stages** (`overlapNextMs`, §31): for milk coffees the milk stage starts while espresso is at ~70–85%, and stages carry `telemetryEventStart/End` names for real-machine sync. Production video specs and folder layout: `public/assets/drinks/MOTION-ASSETS.md`.

**Drink renderer** (`public/concept/drink-renderer.js`): one parameterized premium visual system for every drink — semi-realistic 2.5D product render in procedural SVG. Cylindrical geometry (every liquid level is an ellipse, never a flat line), visible wall thickness, studio lighting (specular streaks, rim highlight, ground shadow), material gradients per ingredient, crema line + speckles, domed microfoam with bubble texture, ice cubes with refraction highlights (float at the surface in finished renders, drop into their pour band during assembly), syrup swirl, steam for hot drinks, condensation for iced. Consumes recipe data via `drinkVisualModel(recipe)` (the `DrinkVisualModel` contract); same cup, camera and light across all drinks. In the assembly scene the engine animates per-layer *reveal rects*, so the full material render is what gets "poured". Upgrade path if even higher fidelity is required: procedural SVG (current) → Canvas liquid/foam → Three.js / React Three Fiber semi-realistic 3D or Spline-authored cup model → drink cards switch to pre-rendered WebP from the same master model. Cards should stay pre-rendered/procedural (cheap); only the central assembly cup justifies real-time 3D.

State management: single store + reducer-style transitions (prototype: module-scope state object + `setScreen`; React: Zustand or useReducer — no Redux needed at this scale).

---

## 10. State machine

```
IDLE → HOME
HOME → FAST_ORDER | INTENT | SURPRISE(reveal) | AS_USUAL(summary) | STRIP_PICK(summary)
INTENT → QUESTION_1 → [QUESTION_2] → RECOMMEND
RECOMMEND → SUMMARY (Order) | CUSTOMIZE | RECOMMEND' (softer/colder/stronger re-rank)
CUSTOMIZE ⇄ SUMMARY
SUMMARY → ASSEMBLY_PREVIEW (start) | CUSTOMIZE | back
ASSEMBLY_PREVIEW —edits→ ASSEMBLY_PREVIEW (recipe mutated, still editable)
ASSEMBLY_PREVIEW —start/auto(≈7s)/telemetry dosing→ PREPARING (recipe LOCKED)
PREPARING —stages…→ READY        PREPARING —error→ RECOVERY → (alt drink | refund msg) → HOME
READY → RATE | ORDER_AGAIN(summary) | SOFTER_NEXT(recommend) | timeout → HOME
RATE → SAVE_PROFILE → HOME
any screen —idle 60 s (pre-payment)→ HOME → IDLE
```

Locking invariant: `recipe.locked = true` the moment the first irreversible telemetry event (or its simulated equivalent) fires; all mutation controls derive enabled-state from it.

---

## 11. Data model

```ts
type TasteProfile = {
  strength: number; sweetness: number; milkiness: number;     // 0–100
  creaminess?: number; bitterness?: number; refreshing?: number;
  caffeine: "none" | "low" | "medium" | "high";
  texture: "clean" | "smooth" | "creamy" | "velvet";
  temperature: "hot" | "iced";
};

type DrinkIngredient = {
  id: "coffee" | "water" | "milk" | "oat_milk" | "coconut_milk" | "syrup" | "foam" | "ice";
  label: string; color: string; ratio: number;                 // share of cup fill, 0–1
};

type DrinkAssemblyStage = {
  id: string; title: string; description: string;
  ingredient?: DrinkIngredient["id"];
  module?: "coffee_module" | "water_module" | "milk_module" | "syrup_module"
         | "foam_module" | "cooling_module" | "heating_module";
  durationMs: number;
  animation: "flow" | "layer_fill" | "foam_build" | "swirl" | "ice_drop"
           | "profile_highlight" | "module_glow";
  tasteImpact?: Partial<Pick<TasteProfile,
    "strength" | "sweetness" | "milkiness" | "creaminess" | "bitterness" | "refreshing">>;
  aiComment: string;                                           // ≤90 chars
  editableUntilStage?: boolean;                                // true ⇒ still editable while pending
};

type DrinkRecipe = {
  id: string; name: string; displayName: string; shortDescription: string;
  tags: string[];                                              // intent/context matching
  price: number; estimatedPreparationTimeMs: number;
  temperature: "hot" | "iced";
  ingredients: DrinkIngredient[];
  tasteProfile: TasteProfile;
  assemblyStages: DrinkAssemblyStage[];
  modifiers?: { milkOptions: string[]; syrupOptions: string[]; sizeOptions: string[] };
};

type UserTasteProfile = {
  userId?: string;                                             // loyalty QR
  savedDrinks: { recipeId: string; customName?: string; modifiers: OrderModifiers }[];
  vector: { strength: number; sweetness: number; milkiness: number; iced: number }; // learned deltas
  history: { recipeId: string; ts: number; rating?: BalanceRating }[];
};

type BalanceRating = "perfect" | "too_strong" | "too_sweet" | "too_milky" | "not_cold_enough";

type RecommendationRequest = { intent: string; answers: Record<string,string>;
  context: { daypart: string; tempC?: number; locationType?: string }; user?: UserTasteProfile };
type RecommendationResponse = { cards: { recipeId: string; why: string; badge?: "ai_pick" }[] };
```

### API endpoints (production)

```
POST /api/recommend            RecommendationRequest → RecommendationResponse   (AI; rule fallback on-device)
GET  /api/menu                 recipes + availability + prices
POST /api/order                { recipeId, modifiers } → { orderId }
GET  /api/order/:id/telemetry  SSE/WebSocket stream of telemetry events
POST /api/feedback             { orderId, rating, save?: {name} }
GET  /api/context              daypart/weather/location hints (cacheable)
```

### Telemetry events (machine → UI)

`recipe_started · cup_detected · coffee_dosing_started/completed · water_started/completed · milk_started/completed · foam_started/completed · syrup_started/completed · rinse_required · error{code,humanHint} · drink_ready`

Adapter contract: each event resolves to `engine.startStage(id)` / `engine.completeStage(id)`. **Simulated driver implements the same interface** from `durationMs` — UI code never knows which is running. To connect the real machine later: implement `MachineTelemetrySource` (see `public/concept/app.js`, `SimulatedTelemetry` class) over the station's WebSocket and pass it to `AssemblyEngine`.

---

## 12. Analytics events

`session_start · home_card_tap{card} · strip_chip_tap{slot,recipeId} · intent_selected{intent} · question_answered{q,a,ms} · recommendation_shown{ids} · recommendation_mutated{action} · alt_promoted{recipeId} · order_confirmed{recipeId,modifiers,price,path:fast|ai|surprise|usual} · customization_change{control,value} · assembly_edit{action,phase} · assembly_locked{editsCount} · prep_stage{stageId,plannedMs,actualMs} · telemetry_fallback{reason} · skip_animation · prep_error{code} · drink_ready{totalMs} · drink_pickup_timeout · rating{value} · drink_saved{name} · order_again · session_abandoned{screen,ms}`

Key funnels: home→confirm conversion per path; question drop-off; edit usage in preview; rating distribution per recipe (feeds learning).

---

## 13. MVP scope (this prototype implements it)

✅ Home with 4 entries + adaptive strip (time-of-day rules) · Fast Order grid · AI pick via intent icons · 2 quick questions · 3 recommendation cards with "why" · basic customization (strength/sweetness/milk/temp/syrup/size) with AI explanations · summary confirm step · **animated assembly preview (editable) → locked live preparation (simulated telemetry)** · transparent SVG cup, layers, flows, modules, taste panel, AI comments, timeline, progress ring, skip-animation · ready screen · rate/save to localStorage ("As Usual" learns) · AI-offline = identical rule-based UX · reduced-motion mode.

## 14. Advanced scope (next)

Voice input (hybrid with the existing Realtime voice prototype at `/`) · server-side personal taste profiles + loyalty QR · weather/location-aware context service · real machine telemetry binding · personalized secret menu + AI-generated drink names · margin-aware dynamic upsell · multi-language · semi-3D cup (only if hardware allows; SVG stays the fallback).

## 15. Implementation recommendations

1. **Stack**: current repo is vanilla JS + Node static server — the prototype keeps that (zero build, instant kiosk load, no remote deps at runtime except fonts; self-host Onest for production). For the production app: Vite + React + Framer Motion, port components 1:1 from §9.
2. **Performance**: everything is CSS/SVG-composited (transform/opacity); one rAF loop only for the ring; no images for the cup — fully procedural; target 60 fps on mid-range Android touch panels; `prefers-reduced-motion` honored.
3. **Resilience**: AI offline → rule recommender + template copy (built-in). Telemetry offline → simulated schedule (built-in). Network offline → menu/prices cached, orders queued.
4. **Extensibility**: adding a drink = one `DrinkRecipe` object with stages; no component changes. New module types = add node slot + color token.
5. **Where things live**: prototype `public/concept/{index.html,styles.css,data.js,app.js,drink-renderer.js}`; voice-first neo-brutalist prototype unchanged at `/`; this document is the source of truth for the concept.
