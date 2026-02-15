import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

/**
 * Reveal component for scroll-triggered animations.
 * 
 * @param {object} props
 * @param {React.ReactNode} props.children - The content to animate
 * @param {string} [props.width] - Width of the container (default: "w-full")
 * @param {number} [props.delay=0.25] - Delay before animation starts
 * @param {string} [props.className] - Additional classes
 */
const Reveal = ({ children, width = "w-full", delay = 0.25, className = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px 0px" });

  return (
    <div ref={ref} className={`${width} ${className} relative`}>
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 75 },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        transition={{ duration: 0.5, delay: delay }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default Reveal;
