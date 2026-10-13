import type { Transition, Variants } from 'framer-motion';

// One rhythm for entrances; a firmer spring for direct interaction.
export const entranceEase = [0.22, 1, 0.36, 1] as const;
export const interactionSpring: Transition = {
  type: 'spring',
  stiffness: 380,
  damping: 34,
  mass: 0.8,
};

export const revealVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: entranceEase } },
};

export const staggerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

// Content stays readable even before IntersectionObserver delivers its event.
export const scrollRevealVariants: Variants = {
  visible: {
    opacity: [0.6, 1],
    y: [16, 0],
    transition: { duration: 0.45, ease: entranceEase },
  },
};
