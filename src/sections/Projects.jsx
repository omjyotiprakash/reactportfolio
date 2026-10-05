

import React from "react"; 
import { motion, useScroll, AnimatePresence } from "framer-motion"; 
// motion: for animating elements
// useScroll: to track scroll position
// AnimatePresence: to animate components when mounting/unmounting

// Importing project images (desktop & mobile versions)
import img1 from "../assets/img1.png";
import img2 from "../assets/img2.png";
// import img3 from "../assets/img3.JPG";
import photo1 from "../assets/photo1.png";
import photo2 from "../assets/photo2.png";
// import photo3 from "../assets/photo3.png";

const MH3 = motion.h3; 
// Shortcut for <motion.h3> for easier typing

// 🔹 Custom Hook: Detects if screen size matches "mobile"
const useIsMobile = (query = "(max-width: 639px)") => {
  const [isMobile, setIsMobile] = React.useState(
    typeof window !== "undefined" && window.matchMedia(query).matches
    // Checks if the screen width is <= 639px (mobile breakpoint)
  );

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia(query); // Media query list
    const handler = (e) => setIsMobile(e.matches); // Update state when query changes
    mql.addEventListener?.("change", handler) || mql.addListener(handler); 
    // Add correct event listener (modern OR fallback)

    setIsMobile(mql.matches); // Initialize with current screen size
    return () =>
      mql.removeEventListener?.("change", handler) || mql.removeListener(handler); 
    // Cleanup event listener
  }, [query]);

  return isMobile; 
};

export default function Projects() {
  const isMobile = useIsMobile(); 
  // Detect if the user is on a mobile screen

  // 🔹 List of project objects (dynamic images based on screen size)
  const projects = React.useMemo(
    () => [
      {
        title: "QUICKNOTE - A Social Note Sharing Platform",
        link: "https://quicknote.co.in",
        bgColor: "#0d4d3d",
        tech: ["React", "Node.js", "Express", "MongoDB"],
        image: isMobile ? photo1 : img1, // Mobile vs desktop image
      },
      {
        title: "Spotify Clone - Web App",
        link: "https://github.com/omjyotiprakash/spotify",
        bgColor: "#3884d3",
        tech: ["React", "Tailwind CSS", "Spotify API"],
        image: isMobile ? photo2 : img2,
      },
      // {
      //   title: "Hungry Tiger",
      //   link: "https://www.eathungrytiger.com/",
      //   bgColor: "#dc9317",
      //   image: isMobile ? photo3 : img3,
      // },
    ],
    [isMobile] 
    // Memoize to prevent recalculating unless screen size changes
  );

  const sceneRef = React.useRef(null); 
  // Reference to the whole projects section (used for scroll tracking)

  const { scrollYProgress } = useScroll({
    target: sceneRef, 
    offset: ["start start", "end end"], 
    // Scroll progress is 0 when section top hits viewport top and 1 at the end
  });

  const thresholds = projects.map((_, i) => (i + 1) / projects.length); 
  // Array of thresholds to switch between projects as user scrolls
  const [activeIndex, setActiveIndex] = React.useState(0); 
  // Keeps track of which project is currently active

  // 🔹 Update activeIndex as user scrolls
  React.useEffect(() => {
    const unsubscribe = scrollYProgress.onChange((v) => {
      const idx = thresholds.findIndex((t) => v <= t); 
      // Find the first threshold that is greater than or equal to scroll progress
      setActiveIndex(idx === -1 ? thresholds.length - 1 : idx); 
      // If not found, show the last project
    });
    return () => unsubscribe(); 
    // Cleanup scroll listener
  }, [scrollYProgress, thresholds]);

  const activeProject = projects[activeIndex]; 
  // Currently displayed project

  return (
    <section
      id="projects"
      ref={sceneRef} 
      className="relative text-white"
      style={{
        height: `${100 * projects.length}vh`, 
        // Section height = 100vh per project (makes scroll-based transitions work) 
        backgroundColor: activeProject.bgColor, 
        // Background changes color based on active project
        transition: "background-color 400ms ease",
      }}
    >
      {/* Sticky container keeps content fixed while scrolling */}
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center">
        
        {/* Section Title */}
        <h2 className={`text-3xl font-semibold z-10 text-center ${isMobile ? "mt-4" : "mt-8"}`}>
          My Work 
        </h2>

        {/* Main Project Display Area */}
        <div className={`relative w-full flex-1 flex items-center justify-center ${isMobile ? "-mt-4 mb-40" : "mb-36"}`}>
          {projects.map((project, idx) => (
            <div
              key={project.title}
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ${
                activeIndex === idx ? "opacity-100 z-20" : "opacity-0 z-0 sm:z-10"
              }`}
              style={{ width: "85%", maxWidth: "1200px" }}
            >
              {/* Animate project title when switching */}
              <AnimatePresence mode="wait">
                {activeIndex === idx && (
                  <MH3
                    key={project.title}
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 30 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className={`block text-center text-[clamp(1.5rem,4vw,3rem)] text-white/95 mb-3 font-bangers italic font-semibold ${
                      ""
                    }`}
                    style={{ zIndex: 5, textAlign: "center" }}
                  >
                    {project.title}
                  </MH3>
                )}
              </AnimatePresence>

              {/* Project Image Wrapper */}
              <div
                className={`relative w-fit max-w-full mx-auto overflow-hidden bg-black/20 shadow-2xl md:shadow-[0_35px_60px_-15px_rgba(0,0,0,0.7)] ${
                  isMobile ? "mb-4 rounded-lg" : "mb-4 rounded-xl"
                }`}
                style={{ zIndex: 10, transition: "box-shadow 250ms ease" }}
              >
                {/* Browser bar */}
                <div className="flex items-center gap-2 px-4 py-2 bg-black/60 backdrop-blur border-b border-white/10">
                  <span className="w-3 h-3 rounded-full bg-red-400" />
                  <span className="w-3 h-3 rounded-full bg-yellow-400" />
                  <span className="w-3 h-3 rounded-full bg-green-400" />
                  <span className="ml-3 text-xs text-white/60 truncate">
                    {project.link.replace("https://", "")}
                  </span>
                </div>

                {/* Project Image */}
                <img
                  src={project.image}
                  alt={project.title}
                  className="block w-auto h-auto max-w-full max-h-[40vh] sm:max-h-[46vh] object-contain drop-shadow-xl md:drop-shadow-2xl"
                  style={{
                    position: "relative",
                    zIndex: 10,
                    filter: "drop-shadow(0 16px 40px rgba(0,0,0,0.65))",
                    transition: "filter 200ms ease",
                  }}
                  loading="lazy"
                />
                {/* Subtle gradient overlay for better readability */}
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    zIndex: 11,
                    background: "linear-gradient(180deg, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0) 40%)",
                  }}
                />
              </div>

              {/* Tech chips */}
              <div className="flex flex-wrap justify-center gap-2">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1 text-xs sm:text-sm rounded-full bg-white/10 border border-white/20 backdrop-blur text-white/90"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* View Project Button */}
        <div className={`absolute flex flex-col items-center gap-4 ${isMobile ? "bottom-20" : "bottom-10"}`}>
          <div className="flex gap-2">
            {projects.map((p, i) => (
              <span
                key={p.title}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  activeIndex === i ? "w-8 bg-white" : "w-1.5 bg-white/40"
                }`}
              />
            ))}
          </div>
          <a
            href={activeProject?.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-3 font-semibold rounded-full bg-white text-black shadow-xl hover:bg-gray-100 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300"
            aria-label={`View ${activeProject?.title}`}
          >
            View Project →
          </a>
        </div>
      </div>
    </section>
  );
}
