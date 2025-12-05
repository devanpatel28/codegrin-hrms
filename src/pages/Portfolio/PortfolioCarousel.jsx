import React, { useState, useEffect } from 'react';
import { PORTFOLIO } from '../../constants/PortfolioConstants';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/RoutesContants';

const PortfolioCarousel = ({
  autoPlay = true,
  autoPlayInterval = 3000,
  showDashes = true,
  showArrows = true,
  className = '',
  projectLimit = 5,
}) => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Get limited portfolio data
  const displayProjects = PORTFOLIO.slice(0, projectLimit);

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay || isHovered) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % displayProjects.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, isHovered, displayProjects.length]);

  // Reset current slide if projectLimit changes and current slide is out of bounds
  useEffect(() => {
    if (currentSlide >= displayProjects.length) {
      setCurrentSlide(0);
    }
  }, [projectLimit, displayProjects.length, currentSlide]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const goToPrevious = (e) => {
    e.stopPropagation(); // Prevent triggering the slide navigation
    setCurrentSlide((prev) => (prev - 1 + displayProjects.length) % displayProjects.length);
  };

  const goToNext = (e) => {
    e.stopPropagation(); // Prevent triggering the slide navigation
    setCurrentSlide((prev) => (prev + 1) % displayProjects.length);
  };


  const handleRedirect = (portfolio) => {
    // Only pass the slug in the URL, no state
    navigate(`${ROUTES.PROJECT_DETAILS}/${portfolio.slug}`);
  };
  

  return (
    <div 
      className={`relative w-full h-[70vh] overflow-hidden rounded-3xl ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Carousel Container */}
      <div 
        className="flex transition-transform duration-700 ease-in-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {displayProjects.map((project, index) => (
          <div 
            key={index} 
            className="relative w-full h-full flex-shrink-0 cursor-pointer"
            onClick={() => handleRedirect(project)}
          >
            {/* Background Image */}
            <div  
              className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-500 hover:scale-105"
              style={{
                backgroundImage: `url(${project.image_path}header.webp)`
              }}
            >
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-l from-black/20 via-transparent to-transparent" />
            </div>

            {/* Text Overlay */}
            <div className="absolute inset-0 flex items-end">
              <div className="p-8 md:p-12 lg:p-16 text-white max-w-4xl">
                {/* Project Title */}
                <h2 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-4 leading-tight hover:text-primary-light transition-colors duration-300">
                  {project.title}
                </h2>
                
                {/* Tech Stack Badge */}
                <div className="mb-4 flex gap-2 capitalize">
                  {project.tech_category.map((tech, index) => (
                    <span key={index} className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border border-primary-light text-white backdrop-blur-sm hover:bg-primary-light/10 transition-all duration-300">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {showArrows && displayProjects.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute cursor-pointer left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all duration-300 z-10"
            style={{ opacity: isHovered ? 1 : 0.7 }}
          >
            <Icon icon="mdi:chevron-left" className="w-6 h-6" />
          </button>
          
          <button
            onClick={goToNext}
            className="absolute cursor-pointer right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all duration-300 z-10"
            style={{ opacity: isHovered ? 1 : 0.7 }}
          >
            <Icon icon="mdi:chevron-right" className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Dash Indicators */}
      {showDashes && displayProjects.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3 z-10">
          {displayProjects.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                goToSlide(index);
              }}
              className={`h-0.5 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'w-8 bg-primary-light scale-125'
                  : 'w-3 bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PortfolioCarousel;
