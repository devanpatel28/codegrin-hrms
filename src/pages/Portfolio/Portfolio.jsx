import { useNavigate } from "react-router-dom";
import { useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import PageTitle from "../../components/PageTitle";
import {
  PORTFOLIO,
  PORTFOLIO_CATEGORY,
} from "../../constants/PortfolioConstants";
import { ROUTES } from "../../constants/RoutesContants";
import { useState } from "react";

gsap.registerPlugin(ScrollTrigger);

export default function Portfolio() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const containerRef = useRef(null);
  const cardsRef = useRef([]);
  const filtersRef = useRef([]);

  const handleCardClick = (portfolio) => {
    // Only pass the slug in the URL, no state
    navigate(`${ROUTES.PROJECT_DETAILS}/${portfolio.slug}`);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  // Filter portfolio based on selected category
  const filteredPortfolio =
    selectedCategory === "All"
      ? PORTFOLIO
      : PORTFOLIO.filter((project) =>
          project.tech_category.includes(selectedCategory)
        );

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Animate portfolio cards with ScrollTrigger
      gsap.fromTo(
        cardsRef.current,
        {
          opacity: 0,
          y: 50,
          scale: 0.9,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [filteredPortfolio]);

  // Re-animate cards when category changes
  useLayoutEffect(() => {
    if (cardsRef.current.length > 0) {
      gsap.fromTo(
        cardsRef.current,
        {
          opacity: 0,
          scale: 0.8,
          y: 30,
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out",
        }
      );
    }
  }, [selectedCategory]);

  return (
    <section className="w-full min-h-screen" ref={containerRef}>
      <div className="container">
        <PageTitle title="Built by CodeGrin" />

        {/* Category Filter Radio Buttons */}
        <div className="w-full flex flex-row lg:items-center mt-20 mb-8 gap-4">
          <h3 className="hidden lg:block lg:text-lg lg:font-semibold">
            Filter:
          </h3>
          <div className="flex flex-wrap gap-4">
            {/* All option */}
            <label
              ref={(el) => (filtersRef.current[0] = el)}
              className={`flex items-center cursor-pointer ${
                selectedCategory === "All" ? "border border-primary-border" : ""
              } bg-primary-card py-3 px-5 hover:scale-105 transition-transform duration-200`}
            >
              <input
                type="radio"
                name="category"
                value="All"
                checked={selectedCategory === "All"}
                onChange={() => handleCategoryChange("All")}
                className="mr-2 w-3.5 h-3.5 accent-primary"
              />
              <span
                className={`text-sm capitalize ${
                  selectedCategory === "All"
                    ? "text-primary font-semibold"
                    : "text-white"
                }`}
              >
                All
              </span>
            </label>

            {/* Category options */}
            {PORTFOLIO_CATEGORY.map((category, index) => (
              <label
                key={category}
                ref={(el) => (filtersRef.current[index + 1] = el)}
                className={`flex items-center cursor-pointer ${
                  selectedCategory === category
                    ? "border border-primary-border"
                    : ""
                } bg-primary-card py-3 px-5 hover:scale-105 transition-transform duration-200`}
              >
                <input
                  type="radio"
                  name="category"
                  value={category}
                  checked={selectedCategory === category}
                  onChange={() => handleCategoryChange(category)}
                  className="mr-2 w-3.5 h-3.5 accent-primary"
                />
                <span
                  className={`text-sm capitalize ${
                    selectedCategory === category
                      ? "text-primary font-semibold"
                      : "text-white"
                  }`}
                >
                  {category}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Portfolio Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 mt-20 gap-8 md:gap-7 lg:gap-10">
          {filteredPortfolio.map((portfolio, index) => (
            <div
              key={`${selectedCategory}-${index}`}
              ref={(el) => (cardsRef.current[index] = el)}
              className="w-full relative border border-primary-border rounded-xl cursor-pointer group hover:shadow-2xl transition-shadow duration-300"
              onClick={() => handleCardClick(portfolio)} // Removed index parameter
            >
              <div className="overflow-hidden rounded-xl">
                <img
                  src={portfolio.image_path + "header.webp"}
                  className="rounded-lg group-hover:scale-110 transition-all duration-300 object-cover origin-center"
                  alt={portfolio.title}
                />
              </div>
              <div className="absolute -bottom-4 left-5">
                <div className="flex gap-2">
                  {portfolio.tech_category.map((tech, index) => (
                    <h2
                      key={index}
                      className="lg:text-sm text-xs w-fit bg-black/50 rounded-full text-white px-4 py-1 capitalize"
                    >
                      {tech}
                    </h2>
                  ))}
                </div>
                <h2 className="lg:text-2xl text-sm w-fit bg-primary-card-light text-white py-2 px-5 font-bold mt-3">
                  {portfolio.title}
                </h2>
              </div>
            </div>
          ))}
        </div>

        {/* No results message */}
        {filteredPortfolio.length === 0 && (
          <div className="text-center mt-10">
            <p className="text-gray-500 text-lg">
              No projects found for "{selectedCategory}" category.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
