import React from "react";
import { Link } from "react-router-dom";

const BorderButton = ({
    title,
    link,
    className = "",
    target,
}) => {
    return (
        <div className="mt-4 border-none">
            <Link
                to={link}
                target={target}
                className={`
                    relative inline-block px-8 py-2 
                    border-2 border-white 
                    text-white no-underline font-semibold text-base uppercase
                    hover:border-primary-light
                    transition-colors duration-200 ease-in-out
                    group
                    ${className}
                `}
            >
                {/* Before pseudo-element - vertical scaling */}
                <span 
                    className="
                        absolute top-1.5 -left-1 
                        w-[calc(100%+0.5rem)] h-[calc(100%-0.75rem)]
                        bg-black
                        transition-transform duration-200 ease-in-out
                        scale-y-100 group-hover:scale-y-0
                        origin-center
                    "
                />
                
                {/* After pseudo-element - horizontal scaling */}
                <span 
                    className="
                        absolute left-1.5 -top-1 
                        h-[calc(100%+0.5rem)] w-[calc(100%-0.75rem)]
                        bg-black
                        transition-transform duration-200 ease-in-out delay-200
                        scale-x-100 group-hover:scale-x-0
                        origin-center
                    "
                />
                
                {/* Text content */}
                <span className="relative z-10">
                    {title}
                </span>
            </Link>
        </div>
    );
};

export default BorderButton;
