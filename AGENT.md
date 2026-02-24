# WordSnap Academy - Project Status

WordSnap Academy is a physical, interactive educational platform built with React and Framer Motion. It utilizes a "Lego-style" block interaction model to teach spelling, math, and visual recognition.

## 🚀 Tech Stack
- **Framework:** React 19 (TypeScript)
- **Animation:** Framer Motion (Spring Physics)
- **Icons:** Lucide React
- **Build Tool:** Vite
- **Styling:** Vanilla CSS + Inline Styles for dynamic physics

## ✨ Key Features
- **Physical Block Engine:** High-performance drag-and-drop with spring physics (Snappy, Bouncy, and Heavy configurations).
- **Multi-Module Curriculum:**
  - **Spelling Word:** Traditional letter-to-word matching.
  - **Math Fun:** Solving equations with number blocks and instant visual feedback (Red X / Green Check).
  - **Visual Hint:** Icon-based prompts for word construction.
- **Dynamic Feedback:**
  - **Speed Bonus:** 5s/character countdown for x2 points.
  - **Haptic Feedback:** Tactile pulses for pickup, success, and error (on supported devices).
  - **Progressive Grading:** Performance-based results (Perfect, Excellent, Good, Improvement).
- **Responsive Design:** Fully optimized for Mobile, iPad, and Desktop with fluid grid systems.
- **Personalization:** User-name entry and personalized achievement screens.

## 📂 Project Structure
```text
src/
├── components/
│   ├── Block.tsx           # Individual draggable block with spring variants
│   ├── TargetZone.tsx      # Word/Equation slots with placement logic
│   ├── IntroScreen.tsx     # Welcome & Name entry
│   ├── ModuleSelector.tsx  # Curriculum selection
│   └── ResultsScreen.tsx   # Final score & performance grading
├── constants/
│   └── animations.ts       # Global Framer Motion spring specs
├── data/
│   └── lessons.tsx         # Centralized module content (Spelling, Math, Visual)
├── utils/
│   └── haptics.ts          # Browser Vibration API wrapper
├── App.tsx                 # Core game loop & state management
└── index.css               # Global styles & responsive breakpoints
```

## 🛠 Interaction Spec (Framer Motion)
| State | Trigger | Animation | Physics |
|-------|---------|-----------|---------|
| **Idle** | Default | scale: 1 | Snappy Spring |
| **Hover** | whileHover | scale: 1.1 | Snappy Spring |
| **Drag** | whileDrag | scale: 1.1, rotate: 5 | Heavy Spring |
| **Snap** | onDragEnd | scale: [1.1, 1.2, 1] | Bouncy Spring |
| **Entry** | Mount | staggerChildren: 0.05 | Snappy Spring |

## 📝 How to Run
1. Install dependencies: `npm install`
2. Start development server: `npm run dev`
3. Build for production: `npm run build`

## 🔮 Future Roadmap
- [ ] Support for sentence construction.
- [ ] Sound effect integration (SFX).
- [ ] Persistence using LocalStorage for student profiles.
- [ ] Custom lesson builder for teachers.
