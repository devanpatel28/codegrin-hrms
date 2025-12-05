// components/Accordion.jsx (Enhanced Version)
import { useState, useRef, useEffect } from 'react';

export default function Accordion({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);
  const [height, setHeight] = useState(0);
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? contentRef.current.scrollHeight : 0);
    }
  }, [isOpen]);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="rounded-lg mb-3 overflow-hidden transition-all duration-200">
      {/* Question Button */}
      <button
        onClick={toggleAccordion}
        className="cursor-pointer w-full px-6 py-4 text-left bg-primary-card hover:bg-primary-card transition-all duration-200 flex justify-between items-start group"
      >
        <span className="text-white font-medium pr-4 leading-relaxed group-hover:text-primary transition-colors duration-200">
          {question}
        </span>
        <svg
          className={`w-5 h-5 mt-0.5 transform transition-all duration-300 ease-out flex-shrink-0 text-secondary group-hover:text-primary ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Answer with dynamic height animation */}
      <div
        style={{ height: `${height}px` }}
        className="overflow-hidden transition-all duration-300 ease-out"
      >
        <div ref={contentRef} className="px-6 pb-4 pt-2 bg-primary-card border-t-2 border-primary-border">
          <div 
            className={`text-secondary md:pl-6 leading-relaxed transform transition-all duration-300  ${
              isOpen ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
            }`}
            dangerouslySetInnerHTML={{ __html: answer }}
          />
        </div>
      </div>
    </div>
  );
}
