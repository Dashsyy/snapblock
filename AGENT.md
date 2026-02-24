# WordSnap Academy - Project Status

WordSnap Academy is a physical, interactive educational platform built with React and Framer Motion. It utilizes a "Lego-style" block interaction model to teach spelling, math, and visual recognition.

## 🚀 Tech Stack
- **Framework:** React 19 (TypeScript)
- **Animation:** Framer Motion (Spring Physics + Motion Values)
- **I18n:** i18next (English & Khmer support)
- **Monitoring:** Vercel Analytics & Speed Insights
- **Build Tool:** Vite
- **Styling:** Vanilla CSS + Dynamic Viewport Units (dvh)

## ✨ Key Features
- **Physical Block Engine:** Weighted drag-and-drop with **dynamic inertia** and **horizontal tilt**.
- **Multi-Language Support:** Instant switching between English (EN) and Khmer (KM).
- **Refactored Architecture:** Clean separation of concerns using custom hooks and modular UI components.
- **Mobile Production Ready:** 
  - Dynamic Viewport Height (`100dvh`) for mobile browsers.
  - Safe-area inset support for modern smartphones (iPhone 14+).
  - Scrollable tray with intelligent overflow management during drag.
- **Multi-Module Curriculum:**
  - **Spelling Word:** Traditional letter-to-word matching.
  - **Math Fun:** Equation solving with instant feedback.
  - **Visual Hint:** Icon-based word puzzles.
- **Soulful UX:**
  - Rotating hero messages on the entry screen.
  - Intensified "Bonus Active" environment with pulsing gradients and shimmer effects.
  - Horizontal module selection with scroll-snapping.

## 📂 Project Structure
```text
src/
├── components/
│   ├── Block.tsx           # Weighted draggable block with dynamic tilt
│   ├── Tray.tsx            # Scrollable block container with overflow logic
│   ├── TargetZone.tsx      # Target slots with snap placement logic
│   ├── GameHeader.tsx      # Dynamic module-aware status bar
│   ├── GameBackground.tsx  # Reactive environment (Bonus/Normal states)
│   ├── LessonDisplay.tsx   # Localized hints and icons
│   ├── IntroScreen.tsx     # Animated welcome screen with i18n
│   ├── ModuleSelector.tsx  # Soulful horizontal curriculum selection
│   ├── LanguageSwitcher.tsx # Animated language toggle (EN/KM)
│   └── ResultsScreen.tsx   # Performance grading & summary
├── hooks/
│   └── useGameLogic.ts     # Core state machine, timers, and drag logic
├── locales/                # JSON translation files (EN/KM)
├── constants/
│   └── animations.ts       # Global spring physics definitions
├── data/
│   └── lessons.tsx         # Centralized multi-subject curriculum
├── App.tsx                 # Root layout & component orchestrator
└── main.tsx                # App entry with Analytics & I18n initialization
```

## 🛠 Interaction Spec (Framer Motion)
| State | Trigger | Animation | Physics / Logic |
|-------|---------|-----------|-----------------|
| **Idle** | Default | scale: 1, rotate: 0 | Snappy Spring |
| **Hover** | whileHover | scale: 1.1 | Snappy Spring |
| **Drag** | whileDrag | **Dynamic Tilt (Inertia)** | Mass: 2, Elastic: 0.05 |
| **Snap** | onDrop | scale: [1.1, 1.2, 1] | Fade-in Transition |
| **Bonus** | isBonusActive | Pulsing Gradients | 4s Heartbeat Loop |

## 📝 Recent Refinement
The application has been refactored to decouple logic from layout. `useGameLogic` now handles the "Brain" of the game, while `App.tsx` focuses on the "Body" (layout and layering). Stacking contexts (z-index) have been rigorously tuned for Mobile Safari.

## 🔮 Future Roadmap (See ROADMAP.md)
- [ ] Confetti celebration on lesson completion.
- [ ] Native Web Speech API for EN/KM pronunciation.
- [ ] Difficulty levels (Easy/Hard progression).
- [ ] Themed environments (Space, Jungle, Ocean).
