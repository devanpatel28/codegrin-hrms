import { IMAGE_ASSETS } from "../constants/ImageContants";
import { Icon } from "@iconify/react/dist/iconify.js";

const ToolsAnimation = ({
  numberOfRows = 4,
  speed = 100,
  direction = 'alternate',
  pauseOnHover = true,
  gap = '1rem',
  iconSize = 'text-3xl',
  className = '',
  startOffset = 10 // Number of icons to offset each row
}) => {
  // Use all tools in every row
  const allIcons = IMAGE_ASSETS.TOOLS;

  const getRowDirection = (rowIndex) => {
    if (direction === 'left') return 'left';
    if (direction === 'right') return 'right';
    return rowIndex % 2 === 0 ? 'left' : 'right';
  };

  // Function to get icons with offset for each row
  const getRowIcons = (rowIndex) => {
    const offset = (rowIndex * startOffset) % allIcons.length;
    // Reorder array starting from the offset position
    return [...allIcons.slice(offset), ...allIcons.slice(0, offset)];
  };

  const cssStyles = `
    .infinite-marquee {
      overflow: hidden;
      position: relative;
      white-space: nowrap;
    }
    
    .marquee-track {
      display: inline-flex;
      animation: marquee linear infinite;
      animation-duration: var(--marquee-duration);
      animation-direction: var(--marquee-direction);
    }
    
    .marquee-track.reverse {
      animation-direction: reverse;
    }
    
    @keyframes marquee {
      0% {
        transform: translateX(0%);
      }
      100% {
        transform: translateX(-50%);
      }
    }
    
    ${pauseOnHover ? `
    .infinite-marquee:hover .marquee-track {
      animation-play-state: paused;
    }
    ` : ''}
  `;

  return (
    <div className={`w-full ${className}`}>
      <style dangerouslySetInnerHTML={{ __html: cssStyles }} />

      {Array.from({ length: numberOfRows }).map((_, rowIndex) => {
        const rowDirection = getRowDirection(rowIndex);
        const rowIcons = getRowIcons(rowIndex);
        
        return (
          <div
            key={rowIndex}
            className="infinite-marquee py-3 blend-x"
          >
            <div
              className={`marquee-track ${rowDirection === 'right' ? 'reverse' : ''}`}
              style={{
                '--marquee-duration': `${speed}s`,
                '--marquee-direction': 'normal',
                gap: gap,
              }}
            >
              {/* Render all icons twice for seamless looping */}
              {Array(2).fill(rowIcons).flat().map((iconName, iconIndex) => (
                <div
                  key={iconIndex}
                  className=" flex items-center justify-center p-5 bg-primary-card rounded-xl w-20 h-20"
                  style={{ marginRight: gap }}
                >
                  <Icon
                    icon={iconName}
                    className={`${iconSize} text-white/80 hover:text-white transition-colors duration-300`}
                  />
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ToolsAnimation;
