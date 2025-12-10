import { useNavigate } from "react-router-dom";
import { useRef, useLayoutEffect, useState, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import PageTitle from "../../components/PageTitle";
import { ROUTES } from "../../constants/RoutesContants";
import { portfolioAPI, categoryAPI } from "../../utils/api";
import { Spinner } from "@/components/ui/spinner";

gsap.registerPlugin(ScrollTrigger);

export default function Portfolio() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [portfolioData, setPortfolioData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Initialize from sessionStorage to persist loaded images
  const [imageLoadStatus, setImageLoadStatus] = useState(() => {
    const cached = sessionStorage.getItem("portfolioImageLoadStatus");
    return cached ? JSON.parse(cached) : {};
  });
  
  const containerRef = useRef(null);
  const cardsRef = useRef([]);
  const filtersRef = useRef([]);

  // Persist image load status to sessionStorage whenever it changes
  useEffect(() => {
    sessionStorage.setItem("portfolioImageLoadStatus", JSON.stringify(imageLoadStatus));
  }, [imageLoadStatus]);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryAPI.getAll();
        setCategories(response.data.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch portfolios based on selected category
  useEffect(() => {
    const fetchPortfolios = async () => {
      setLoading(true);
      try {
        let response;
        if (selectedCategory === "All") {
          response = await portfolioAPI.getAll();
        } else {
          response = await portfolioAPI.getByCategory(selectedCategory);
        }
        
        setPortfolioData(response.data.portfolios || []);
        
        // Only initialize load status for NEW portfolios (preserve existing)
        setImageLoadStatus((prev) => {
          const updated = { ...prev };
          (response.data.portfolios || []).forEach((portfolio) => {
            if (!(portfolio.id in updated)) {
              updated[portfolio.id] = false;
            }
          });
          return updated;
        });
      } catch (error) {
        console.error("Error fetching portfolios:", error);
        setPortfolioData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolios();
  }, [selectedCategory]);

  const handleCardClick = (portfolio) => {
    navigate(`${ROUTES.PROJECT_DETAILS}/${portfolio.slug}`);
  };

  const handleCategoryChange = (categorySlug) => {
    setSelectedCategory(categorySlug);
  };

  const handleImageLoad = (portfolioId) => {
    setImageLoadStatus((prev) => ({
      ...prev,
      [portfolioId]: true,
    }));
  };

  useLayoutEffect(() => {
    if (!loading && portfolioData.length > 0) {
      const ctx = gsap.context(() => {
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
    }
  }, [portfolioData, loading]);

  // Re-animate cards when category changes
  useLayoutEffect(() => {
    if (cardsRef.current.length > 0 && !loading) {
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
  }, [selectedCategory, loading]);

  return (
    <section className="w-full min-h-screen" ref={containerRef}>
      <div className="container">
        <PageTitle title="Built by CodeGrin" />

        {/* Category Filter Radio Buttons */}
        <div className="w-full flex flex-row lg:items-start mt-20 mb-8 gap-2">
          <h3 className="hidden lg:block lg:text-lg lg:font-semibold mt-2">
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
            {categories.map((category, index) => (
              <label
                key={category.slug}
                ref={(el) => (filtersRef.current[index + 1] = el)}
                className={`flex items-center cursor-pointer ${
                  selectedCategory === category.slug
                    ? "border border-primary-border"
                    : ""
                } bg-primary-card py-3 px-5 hover:scale-105 transition-transform duration-200`}
              >
                <input
                  type="radio"
                  name="category"
                  value={category.slug}
                  checked={selectedCategory === category.slug}
                  onChange={() => handleCategoryChange(category.slug)}
                  className="mr-2 w-3.5 h-3.5 accent-primary"
                />
                <span
                  className={`text-sm capitalize ${
                    selectedCategory === category.slug
                      ? "text-primary font-semibold"
                      : "text-white"
                  }`}
                >
                  {category.name}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Loading State with Spinner */}
        {loading && (
          <div className="w-full flex justify-center items-center mt-20 min-h-[400px]">
            <Spinner size="large" />
          </div>
        )}

        {/* Portfolio Grid */}
        {!loading && (
          <div className="w-full grid grid-cols-1 md:grid-cols-2 mt-20 gap-8 md:gap-7 lg:gap-10">
            {portfolioData.map((portfolio, index) => (
              <div
                key={`${selectedCategory}-${portfolio.id}`}
                ref={(el) => (cardsRef.current[index] = el)}
                className="w-full relative border border-primary-border rounded-xl cursor-pointer group hover:shadow-2xl transition-shadow duration-300"
                onClick={() => handleCardClick(portfolio)}
              >
                <div className="overflow-hidden rounded-xl relative">
                  {/* Image Loading Spinner */}
                  {!imageLoadStatus[portfolio.id] && (
                    <div className="w-full h-64 flex items-center justify-center bg-primary-card">
                      <Spinner size="default" />
                    </div>
                  )}
                  
                  {/* Actual Header Image */}
                  <img
                    src={portfolio.header_image_url || "/placeholder.webp"}
                    className={`rounded-lg group-hover:scale-110 transition-all duration-300 object-cover origin-center ${
                      !imageLoadStatus[portfolio.id] ? "hidden" : ""
                    }`}
                    alt={portfolio.title}
                    onLoad={() => handleImageLoad(portfolio.id)}
                    onError={(e) => {
                      e.target.src = "/placeholder.webp";
                      handleImageLoad(portfolio.id);
                    }}
                  />
                </div>
                <div className="absolute -bottom-4 left-5">
                  <div className="flex gap-2">
                    {portfolio.categories?.map((cat, idx) => (
                      <h2
                        key={idx}
                        className="lg:text-sm text-xs w-fit bg-black/50 rounded-full text-white px-4 py-1 capitalize"
                      >
                        {cat.name}
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
        )}

        {/* No results message */}
        {!loading && portfolioData.length === 0 && (
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
