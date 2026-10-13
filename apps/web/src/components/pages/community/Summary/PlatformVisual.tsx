import { useRef } from 'react';
import { motion, useInView, useReducedMotion, useSpring } from 'framer-motion';
import { Globe2, Monitor, Smartphone } from 'lucide-react';
import { entranceEase, interactionSpring } from '@/lib/motion';

export default function PlatformVisual() {
  const visualRef = useRef<HTMLDivElement>(null);
  const inView = useInView(visualRef, { once: true, amount: 0.2 });
  const reduceMotion = useReducedMotion();
  const rotateX = useSpring(0, { stiffness: 160, damping: 24 });
  const rotateY = useSpring(0, { stiffness: 160, damping: 24 });
  const visible = inView || reduceMotion;
  const nodeMotion = (delay: number, rotate: number) => ({
    initial: false as const,
    animate: reduceMotion
      ? { rotate }
      : visible
        ? { y: [12, 0], scale: [0.9, 1], rotate }
        : undefined,
    transition: { ...interactionSpring, delay: reduceMotion ? 0 : delay },
  });

  return (
    <motion.div
      ref={visualRef}
      className="platform-visual"
      aria-hidden="true"
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      onPointerMove={(event) => {
        if (reduceMotion || event.pointerType !== 'mouse') return;
        const bounds = event.currentTarget.getBoundingClientRect();
        rotateX.set(-((event.clientY - bounds.top) / bounds.height - 0.5) * 8);
        rotateY.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 8);
      }}
      onPointerLeave={() => {
        rotateX.set(0);
        rotateY.set(0);
      }}
    >
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
        viewBox="0 0 440 400"
        fill="none"
      >
        <motion.ellipse
          cx="220"
          cy="200"
          rx="198"
          ry="138"
          transform="rotate(-32 220 200)"
          stroke="currentColor"
          strokeOpacity="0.2"
          strokeWidth="1"
          initial={false}
          animate={visible && !reduceMotion ? { pathLength: [0, 1] } : undefined}
          transition={{
            duration: reduceMotion ? 0 : 1.1,
            ease: entranceEase,
            delay: reduceMotion ? 0 : 0.12,
          }}
        />
        <motion.ellipse
          cx="220"
          cy="200"
          rx="147"
          ry="105"
          transform="rotate(32 220 200)"
          stroke="currentColor"
          strokeOpacity="0.12"
          strokeWidth="1"
          initial={false}
          animate={visible && !reduceMotion ? { pathLength: [0, 1] } : undefined}
          transition={{
            duration: reduceMotion ? 0 : 1.1,
            ease: entranceEase,
            delay: reduceMotion ? 0 : 0.25,
          }}
        />
      </svg>
      <div className="platform-axis platform-axis-horizontal" />
      <div className="platform-axis platform-axis-vertical" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <motion.div className="platform-core" {...nodeMotion(0.15, -6)}>
          <img src="/assets/logo.png" alt="" className="h-full w-full object-contain" />
        </motion.div>
      </div>
      <motion.div className="platform-node platform-node-mobile" {...nodeMotion(0.28, -6)}>
        <Smartphone size={23} strokeWidth={1.4} />
        <span>MOBILE</span>
      </motion.div>
      <motion.div className="platform-node platform-node-desktop" {...nodeMotion(0.38, 6)}>
        <Monitor size={24} strokeWidth={1.4} />
        <span>DESKTOP</span>
      </motion.div>
      <motion.div className="platform-node platform-node-web" {...nodeMotion(0.48, -3)}>
        <Globe2 size={24} strokeWidth={1.4} />
        <span>WEB</span>
      </motion.div>
      <span className="platform-caption">MANY PLATFORMS. ONE COMMUNITY.</span>
      <span className="platform-coordinate">CPK / CONNECT</span>
    </motion.div>
  );
}
