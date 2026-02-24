# SnapBlocks Roadmap: Soul & Education

This document outlines the proposed improvements to make SnapBlocks more engaging, educational, and rewarding for young learners.

## 🌟 Top Priority: Soul & Engagement

### 1. Visual Celebration (Confetti)
*   **Goal:** Make the "Lesson Complete" moment feel like a major victory.
*   **Feature:** Trigger a vibrant confetti explosion when a word/sum is correctly completed.
*   **Impact:** Increases user satisfaction and encourages the child to move to the next lesson.
*   **Implementation:** Use `canvas-confetti` for high-performance, mobile-friendly particle effects.

### 2. Audio Feedback (The "Teacher" Voice)
*   **Goal:** Provide multi-sensory learning.
*   **Feature:** 
    *   **Phonics:** Say the letter sound when a block is picked up.
    *   **Success:** Say the full word/number when the lesson is completed (e.g., "Great job! C-A-T spells CAT!").
*   **Impact:** Crucial for children who are still learning to read or speak.
*   **Implementation:** Utilize the browser's native `SpeechSynthesis` API (Web Speech API).

---

## 📚 Educational Progression

### 3. Difficulty Levels (Easy / Hard)
*   **Goal:** Keep the app challenging as the user grows.
*   **Feature:** 
    *   **Easy:** 3-letter words, simple addition up to 10, visual hints always shown.
    *   **Hard:** 5+ letter words, subtraction/multiplication, visual hints fade away.
*   **Impact:** Extends the lifecycle of the app.

### 4. Custom Lesson Creation
*   **Goal:** Allow parents/teachers to tailor the experience.
*   **Feature:** A simple screen where parents can enter their own words or math problems.
*   **Impact:** Makes the app a versatile tool for school homework.

---

## 🎨 Visual & UX Refinement

### 5. Animated Themes
*   **Goal:** Personalized experience.
*   **Feature:** Let users choose between "Space", "Jungle", or "Ocean" themes which change the background blobs and block colors.
*   **Impact:** High "toy-like" appeal.

### 6. Achievement Badges
*   **Goal:** Gamification.
*   **Feature:** Collect digital stickers or "Blocks" for completing a whole module without mistakes.
*   **Impact:** Encourages repetitive play and mastery.

---

## ✅ Implementation Checklist
- [ ] **Phase 1:** Add `canvas-confetti` support for lesson completions.
- [ ] **Phase 2:** Integrate `Web Speech API` for EN/KM pronunciation.
- [ ] **Phase 3:** Refactor `lessons.tsx` to support level-based filtering.
- [ ] **Phase 4:** Design and implement the "Theme" selector.
