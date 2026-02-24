# TODO: Fix Mobile Production Issues

## 1. Viewport & Layout Fixes
- [x] **Fix Viewport Height:** Replace `100vh` with `100dvh` (Dynamic Viewport Height) or use a robust CSS variable approach to prevent the UI from being cut off by mobile browser chrome (URL bars/Home indicator).
- [x] **Fix Body Touch Action:** Remove `touch-action: none` from `body` or set `touch-action: pan-y` on the tray container to allow scrolling.
- [x] **Responsive Header:** Improve header layout for small screens to prevent vertical expansion when content wraps.

## 2. Tray UI & Scrolling
- [x] **Enable Tray Scrolling:**
    - Set `overflow-y: auto` on the tray container.
    - Ensure `touch-action: auto` or `pan-y` is set on the tray grid.
    - Adjust `maxHeight` and `minHeight` to be more flexible on different screen sizes.
- [x] **Adjust Grid Layout:** Optimize `tray-grid` columns for mobile (consider 3-4 columns depending on screen width).

## 3. Snap Logic & Interaction
- [x] **Stale Rects Fix:** Update `slotRefs.current` rects on window resize or when the layout changes. Currently, they are only captured once on mount.
- [x] **Hit Testing Improvement:** Verify `info.point` coordinates against `getBoundingClientRect` in various mobile browsers.
- [x] **Safe Area Insets:** Add support for `env(safe-area-inset-bottom)` to ensure the tray is not covered by the iPhone Home indicator.

## 4. Performance & UX
- [ ] **Haptics Check:** Verify haptic feedback works on mobile production.
- [ ] **Loading States:** Ensure icons and assets load correctly on slower mobile connections.
