import gsap from "gsap";

export const animateCardHover = (element, isHovering) => {
  if (!element) return;

  if (isHovering) {
    gsap.to(element, {
      y: -4,
      scale: 1.02,
      duration: 0.3,
      ease: "power2.out",
      boxShadow:
        "0 10px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.4)",
    });
  } else {
    gsap.to(element, {
      y: 0,
      scale: 1,
      duration: 0.3,
      ease: "power2.out",
      clearProps: "boxShadow",
    });
  }
};

export const animatePulse = (element) => {
  if (!element) return;

  return gsap.to(element, {
    opacity: 0.5,
    duration: 1,
    yoyo: true,
    repeat: -1,
    ease: "power1.inOut",
  });
};
