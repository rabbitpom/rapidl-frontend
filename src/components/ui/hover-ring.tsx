import { ReactNode, useState } from "react";
import { cn } from "@/lib/utils";
import { useMotionTemplate, useMotionValue, motion } from "framer-motion";

export interface DivProps extends React.HTMLAttributes<HTMLDivElement> {}

const HoverRing = ({
  idleDisabled = false,
  radius = 200,
  className,
  innerClassName,
  children,
  ringColor = "hsl(var(--primary))",
}: {
  idleDisabled?: boolean;
  radius?: number;
  className?: string;
  innerClassName?: string;
  children?: ReactNode;
  ringColor?: string;
}) => {
  const [visible, setVisible] = useState(false);

  let mouseX = useMotionValue(0);
  let mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: any) {
    let { left, top } = currentTarget.getBoundingClientRect();

    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      style={{
        background: useMotionTemplate`
          radial-gradient(
            ${
              visible ? `${radius}px` : "0px"
            } circle at ${mouseX}px ${mouseY}px,
            ${ringColor},
            transparent 80%
          )`,
        position: "relative",
        transition: "background 0.3s ease-in-out",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      className={cn(
        "p-[3px] transition duration-300 rounded-lg group/div",
        className
      )}
    >
      <div className={cn("bg-black w-full h-full rounded-lg", innerClassName)}>
        {children}
      </div>
      {!idleDisabled && (
        <>
          <div
            className={cn(
              "absolute rounded-lg pointer-events-none inset-0 border-0 border-primary transition-border duration-100 animate-fade"
            )}
            style={{ borderWidth: !visible ? `3px` : `0px` }}
          ></div>
          <style>{`
        @keyframes fade {
          0% {
            opacity: 0.1;
          }
          100% {
            opacity: 0.3;
          }
        }
        .animate-fade {
          animation: fade 6s ease-in-out infinite alternate;
        }
      `}</style>
        </>
      )}
    </motion.div>
  );
};

HoverRing.displayName = "HoverRing";

export { HoverRing };
