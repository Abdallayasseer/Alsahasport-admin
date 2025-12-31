import gsap from "gsap";

export const dashboardTimeline = (scope) => {
  if (!scope.current) return;

  const tl = gsap.timeline({
    defaults: { ease: "power3.out" },
  });

  // Header Animation
  tl.from(".dashboard-header", {
    y: -20,
    opacity: 0,
    duration: 0.6,
  });

  // Stats Cards Stagger
  tl.from(
    ".stat-card",
    {
      y: 20,
      opacity: 0,
      scale: 0.95,
      duration: 0.5,
      stagger: 0.1,
    },
    "-=0.3"
  );

  // Charts and lower content
  tl.from(
    ".dashboard-content-grid",
    {
      y: 20,
      opacity: 0,
      duration: 0.5,
      stagger: 0.1,
    },
    "-=0.2"
  );

  return tl;
};
