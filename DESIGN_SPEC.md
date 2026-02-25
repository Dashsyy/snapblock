# SnapBlocks: UI/UX Redesign Specification

This document outlines the **"Modern Playful Glass"** design language for the SnapBlocks application. Use these prompts to guide the implementation of each screen and component.

## 🎨 Core Design Philosophy: "Modern Playful Glass"
The goal is a premium, tactile, and fun experience that feels like a modern physical toy.

*   **Visual Style:** Frosted glass (Glassmorphism), deep soft shadows, and vibrant gradients.
*   **Color Palette:**
    *   **Electric Blue:** `#3b82f6` (Primary/Word)
    *   **Emerald Green:** `#10b981` (Math/Success)
    *   **Amber Gold:** `#f59e0b` (Visual/Level 3)
    *   **Soft Slate:** `#f8fafc` (Background)
*   **Surfaces:** Translucent cards (`rgba(255, 255, 255, 0.7)`) with `backdrop-filter: blur(12px)` and `1px solid rgba(255, 255, 255, 0.5)` borders.
*   **Motion:** High-frequency, low-amplitude bouncy springs using `framer-motion`.

---

## 🚀 Component Design Prompts

### 1. `IntroScreen` (The "Hook")
> "Transform the Intro Screen into a high-energy portal. Use a centered, large glassmorphic card with deep 'shadow-borders'. Add a floating particle system in the background using the app's brand colors. The name input should feel tactile, enlarging slightly on focus with a glowing blue border. The 'Start' button should be 'squishy'—using a heavy bottom shadow that disappears when pressed (3D effect)."

### 2. `ModuleSelector` (The "Choice")
> "Redesign the module cards as 'Bento Box' style interactive tiles. Instead of a horizontal scroll, use a vertical grid with varying tile sizes. Each module should have a unique, large gradient background that 'bleeds' into the card. On hover/tap, the card should tilt using 3D transforms (`rotateX` and `rotateY`). Level selection should appear as a pop-over tray with 'pill-shaped' buttons that bounce into view."

### 3. `GameHeader` & `ProgressBar` (The "Context")
> "Create a floating header detached from the top edge, using a slim frosted-glass bar. Stats (Score/Timer) should be encased in small 'capsule' containers with micro-animations—when the score increases, the capsule should 'pop' and emit tiny sparkles. The Progress Bar should be a thick, rounded track with a glowing neon filler that has a 'liquid' wave animation at the leading edge."

### 4. `TargetZone` & `Blocks` (The "Play")
> "The TargetZone slots should look like 'indents' in the glass surface (inner shadows). When a block is snapped, trigger a radial 'pulse' animation from the center of the slot. Redesign Blocks to have a 'plastic-toy' look: use subtle gradients, a slight top highlight (glint), and a 4px bottom border for depth. When dragged, the block should scale up by 20% and increase its drop shadow to feel 'lifted' off the screen."

### 5. `Tray` (The "Inventory")
> "The Tray should be a semi-transparent 'dock' at the bottom of the screen with a blurred background. Use a 'spring-loaded' entrance for blocks where they cascade in one by one. Implement a 'jiggle' animation for the hint block instead of just a glow—make it vibrate slightly every 2 seconds to catch the eye."

### 6. `ResultsScreen` (The "Reward")
> "The Results Screen should be a full-screen celebration. Use a large, animated 'Level Complete' trophy in the center. Stats should be presented as 'Achievement Cards' that flip into view sequentially. Add a 'confetti' burst using SVG particles that match the module's color theme. The 'Play Again' button should have a continuous 'shimmer' sweep animation."

---

## 🛠 Technical Implementation Notes
*   **Framer Motion:** Use `type: "spring", stiffness: 300, damping: 20` for standard interactions.
*   **CSS Filters:** Heavily utilize `backdrop-filter: blur()` for the glass effect.
*   **Performance:** Ensure `will-change: transform` is used on animated blocks to maintain 60fps on mobile.
