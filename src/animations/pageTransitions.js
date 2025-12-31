import gsap from "gsap";

export const animatePageIn = (container) => {
  if (!container) return;

  // Kill any existing animations on the container to prevent conflicts
  gsap.killTweensOf(container);

  return gsap.fromTo(
    container,
    {
      opacity: 0,
      y: 20,
    },
    {
      opacity: 1,
      y: 0,
      duration: 0.35,
      ease: "power2.out",
      clearProps: "all", // Clean up after animation to avoid CSS conflicts
    }
  );
};
