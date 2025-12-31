import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { useLocation } from "react-router-dom";
import { animatePageIn } from "../../animations/pageTransitions";

const PageTransition = ({ children }) => {
  const containerRef = useRef(null);
  const location = useLocation();

  useGSAP(
    () => {
      // Animate page in whenever location changes or component mounts
      animatePageIn(containerRef.current);
    },
    { scope: containerRef, dependencies: [location.pathname] }
  );

  return (
    <div ref={containerRef} className="w-full h-full">
      {children}
    </div>
  );
};

export default PageTransition;
