import { useEffect, useState, useRef } from "react";
import { IMAGE_ASSETS } from "../constants/ImageContants";

const TeamCarousel = ({
  numberOfColumns = 4,
  speed = 60,
  pauseOnHover = false,
  direction = "alternate",
  className = "",
}) => {
  const allData = IMAGE_ASSETS.TEAM;
  const [columns, setColumns] = useState(numberOfColumns);
  const imgPerCol = Math.ceil(allData.length / columns);
  const scrollerRefs = useRef([]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setColumns(2);
      } else {
        setColumns(numberOfColumns); // 4 columns on larger screens
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [numberOfColumns]);

  useEffect(() => {
    const observers = scrollerRefs.current.map((scroller) => {
      if (!scroller) return null;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !scroller.dataset.duplicated) {
              const scrollerInner = scroller.querySelector(".scroller-y__list");
              if (!scrollerInner) return;

              const scrollerContent = Array.from(scrollerInner.children);
              if (!scrollerContent.length) return;

              const fragment = document.createDocumentFragment();
              scrollerContent.forEach((item) => {
                const duplicateItem = item.cloneNode(true);
                fragment.appendChild(duplicateItem);
              });
              scrollerInner.appendChild(fragment);
              scroller.dataset.duplicated = "true";
              observer.unobserve(scroller);
            }
          });
        },
        { threshold: 0 }
      );

      observer.observe(scroller);
      return observer;
    });

    return () => {
      observers.forEach((observer) => {
        if (observer) observer.disconnect();
      });
    };
  }, [columns]);

  const getColumnDirection = (columnIndex) => {
    if (direction === "up") return "top";
    if (direction === "down") return "bottom";
    return columnIndex % 2 === 0 ? "bottom" : "top";
  };

  const getColumnData = (columnIndex) => {
    const imagesPerColumn = columns === 2 ? imgPerCol/2 : imgPerCol;
    const startIndex = columnIndex * imagesPerColumn;
    return allData.slice(startIndex, startIndex + imagesPerColumn);
  };

  const cssStyles = `
    .carousel-container {
      display: flex;
      width: 100%;
      height: 80vh;
      gap: 0;
      box-sizing: border-box;
    }

    .scroller-y {
      overflow: hidden;
      position: relative;
      flex: 1 1 ${100 / columns}%;
      display: flex;
      flex-direction: column;
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    .scroller-y[data-direction="bottom"] {
      --_animation-direction: reverse;
    }

    .scroller-y[data-direction="top"] {
      --_animation-direction: forwards;
    }

    .scroller-y__list {
      height: max-content;
      flex-wrap: nowrap;
      animation: scrollY var(--_animation-duration, ${speed}s) var(--_animation-direction, forwards) linear infinite;
      display: flex;
      flex-direction: column;
      gap: 0;
    }

    .scroller-y__list:hover {
      animation-play-state: ${pauseOnHover ? "paused" : "running"};
    }

    .scroller-y__list > div {
      flex-shrink: 0;
      width: 100%;
      margin: 0;
      padding: 0;
    }

    .scroller-y__list img {
      width: 100%;
      height: auto;
      display: block;
      margin: 0;
      padding: 0;
    }

    @keyframes scrollY {
      to {
        transform: translateY(-50%);
      }
    }

    @media (max-width: 767px) {
      .scroller-y {
        flex: 1 1 50%;
      }
    }
  `;

  return (
    <div className={`w-full ${className}`}>
      <style dangerouslySetInnerHTML={{ __html: cssStyles }} />
      <div className="carousel-container">
        {Array.from({ length: columns }).map((_, columnIndex) => {
          const columnDirection = getColumnDirection(columnIndex);
          const columnData = getColumnData(columnIndex);

          return (
            <div
              key={columnIndex}
              className="scroller-y blend-y"
              data-direction={columnDirection}
              data-speed={speed}
              ref={(el) => (scrollerRefs.current[columnIndex] = el)}
            >
              <div className="scroller-y__list">
                {columnData.map((image, imgIndex) => (
                  <div key={`image-${columnIndex}-${imgIndex}`} className="flex-shrink-0">
                    <img
                      src={image}
                      alt={`team-${columnIndex * (columns === 2 ? 10 : 5) + imgIndex + 1}`}
                      className="w-full h-auto block"
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TeamCarousel;