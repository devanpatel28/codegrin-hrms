import { useEffect, useState } from "react";
import { CLIENT_FEEDBACK } from "../constants/ClientFeedbackConstant";

const ClientFeedbackAnimation = ({
  numberOfColumns = 2, // default for desktop
  speed = 25,
  direction = "alternate",
  pauseOnHover = false,
  gap = "1rem",
  className = "",
  startOffset = 3,
}) => {
  const allData = CLIENT_FEEDBACK;
  const [columns, setColumns] = useState(numberOfColumns);

  // 👇 detect screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setColumns(1); // mobile = 1 column
      } else {
        setColumns(numberOfColumns); // desktop = passed prop
      }
    };

    handleResize(); // run on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [numberOfColumns]);

  const getColumnDirection = (columnIndex) => {
    if (direction === "up") return "up";
    if (direction === "down") return "down";
    return columnIndex % 2 === 0 ? "down" : "up";
  };

  const getColumnData = (columnIndex) => {
    const offset = (columnIndex * startOffset) % allData.length;
    return [...allData.slice(offset), ...allData.slice(0, offset)];
  };

  const cssStyles = `
    .infinite-marquee-vertical {
      overflow: hidden;
      position: relative;
      height: 80vh;
      display: flex;
      gap: ${gap};
    }
    
    .marquee-column {
      flex: 1;
      display: flex;
      flex-direction: column;
      animation: marquee-vertical linear infinite;
      animation-duration: var(--marquee-duration);
      animation-direction: var(--marquee-direction);
      will-change: transform;
    }
    
    .marquee-column.reverse {
      animation-direction: reverse;
    }
    
    @keyframes marquee-vertical {
      0% {
        transform: translateY(0);
      }
      100% {
        transform: translateY(-50%);
      }
    }
    
    ${
      pauseOnHover
        ? `
    .infinite-marquee-vertical:hover .marquee-column {
      animation-play-state: paused;
    }
    `
        : ""
    }
  `;

  return (
    <div className={`w-full ${className} blend-y`}>
      <style dangerouslySetInnerHTML={{ __html: cssStyles }} />

      <div className="infinite-marquee-vertical">
        {Array.from({ length: columns }).map((_, columnIndex) => {
          const columnDirection = getColumnDirection(columnIndex);
          const columnData = getColumnData(columnIndex);

          return (
            <div
              key={columnIndex}
              className={`marquee-column ${
                columnDirection === "up" ? "reverse" : ""
              }`}
              style={{
                "--marquee-duration": `${speed}s`,
                "--marquee-direction": "normal",
              }}
            >
              {/* First set of content */}
              {columnData.map((feedback, feedbackIndex) => (
                <div
                  key={`original-${columnIndex}-${feedbackIndex}`}
                  className="bg-primary-card border border-primary-border text-light rounded-xl p-6 shadow-lg flex-shrink-0"
                  style={{ marginBottom: gap }}
                >
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <div className="flex-grow">
                      <h4 className="mb-1 font-bold text-lg text-primary">
                        {feedback.clientName}
                      </h4>
                      <span className="text-sm text-secondary">
                        {feedback.clientPosition}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-100 font-medium mb-4 leading-relaxed">
                    {feedback.clientDescription}
                  </p>

                  {feedback.clientTags && feedback.clientTags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {feedback.clientTags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-3 py-1 bg-gray-500/20 text-gray-300 text-xs rounded-full border border-gray-500/30"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Duplicate set for seamless loop */}
              {columnData.map((feedback, feedbackIndex) => (
                <div
                  key={`duplicate-${columnIndex}-${feedbackIndex}`}
                  className="bg-primary-card border border-primary-border text-light rounded-xl p-6 shadow-lg flex-shrink-0"
                  style={{ marginBottom: gap }}
                >
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <div className="flex-grow">
                      <h4 className="mb-1 font-bold text-lg text-primary-light">
                        {feedback.clientName}
                      </h4>
                      <span className="text-sm text-gray-500">
                        {feedback.clientPosition}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-100 font-medium mb-4 leading-relaxed">
                    {feedback.clientDescription}
                  </p>

                  {feedback.clientTags && feedback.clientTags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {feedback.clientTags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-3 py-1 bg-gray-500/20 text-gray-300 text-xs rounded-full border border-gray-500/30"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ClientFeedbackAnimation;
