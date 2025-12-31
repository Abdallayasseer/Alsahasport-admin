import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Skeleton = ({ className, ...props }) => {
  const skeletonRef = useRef(null);

  useGSAP(
    () => {
      gsap.to(skeletonRef.current, {
        opacity: 0.5,
        duration: 1.5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    },
    { scope: skeletonRef }
  );

  return (
    <div
      ref={skeletonRef}
      className={cn("animate-none rounded-md bg-zinc-800/50", className)}
      {...props}
    />
  );
};

export { Skeleton };
