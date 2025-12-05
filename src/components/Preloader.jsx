// components/Preloader.jsx
import React from 'react';
import { IMAGE_ASSETS } from '../constants/ImageContants';

export const Preloader = ({ isVisible }) => {
  return (
    <div 
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black transition-opacity duration-500 preloader ${!isVisible ? 'hidden' : ''}`}
      style={{ display: isVisible ? 'flex' : 'none' }}
    >
      <img 
        src={IMAGE_ASSETS.LOGO_SYMBOL} 
        className='w-50 h-50 animate-smooth-spin' 
        alt="Loading..." 
      />
    </div>
  );
};

export default Preloader;
