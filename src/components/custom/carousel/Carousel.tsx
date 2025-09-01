import { cn } from "@/lib/utils";
import { useRef, useEffect, ReactNode } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

interface Props {
  className?: string;
  duration?: number;
  children: ReactNode;
}

const Carousel = ({ children, className, duration = 30 }: Props) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const totalWidth = carousel.scrollWidth / 2;

    const animate = () => {
      controls.start({
        x: [0, -totalWidth],
        transition: {
          x: {
            duration: duration,
            repeat: Infinity,
            ease: "linear",
          },
        },
      });
    };

    animate();
  }, [controls, duration]);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <div className="absolute top-0 left-0 h-full w-1/6 bg-gradient-to-r from-black/90 to-transparent pointer-events-none z-10"></div>
      <div className="absolute top-0 right-0 h-full w-1/6 bg-gradient-to-l from-black/90 to-transparent pointer-events-none z-10"></div>
      <AnimatePresence>
        <motion.div
          className="flex w-max"
          ref={carouselRef}
          animate={controls}
          style={{ display: "flex" }}
        >
          {children}
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const CarouselWrapper = ({ children, className, duration }: Props) => {
  const location = useLocation();

  return (
    <Carousel key={location.key} className={className} duration={duration}>
      {children}
    </Carousel>
  );
};

export default CarouselWrapper;
