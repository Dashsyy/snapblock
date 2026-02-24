import type { Transition } from 'framer-motion';

export const SPRING_SNAPPY: Transition = { type: "spring", stiffness: 400, damping: 25 };
export const SPRING_BOUNCY: Transition = { type: "spring", stiffness: 300, damping: 15, mass: 0.8 };
export const SPRING_HEAVY: Transition = { type: "spring", stiffness: 500, damping: 50 };
