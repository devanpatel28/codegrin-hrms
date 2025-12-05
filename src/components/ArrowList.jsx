import { Icon } from "@iconify/react/dist/iconify.js";

export const ArrowList = ({ items, className = "" }) => {
    return (
      <ul className={`list-none mt-3 ${className}`}>
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-2">
            <Icon
              icon="si:arrow-right-fill"
              className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0 text-primary"
            />
            <span className="text-secondary text-base text-justify">
              {item}
            </span>
          </li>
        ))}
      </ul>
    );
  };

export default ArrowList;
