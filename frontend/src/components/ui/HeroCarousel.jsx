import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/navigation';

const HeroCarousel = ({ items }) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="relative w-full overflow-hidden group h-[250px] sm:h-[400px] md:h-[500px] lg:h-[600px]">
      <style>
        {`
          .swiper-button-next-hero, .swiper-button-prev-hero {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            z-index: 20;
            cursor: pointer;
          }
          .swiper-button-disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }
        `}
      </style>
      
      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        speed={1000}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        navigation={{
           nextEl: '.swiper-button-next-hero',
           prevEl: '.swiper-button-prev-hero',
        }}
        className="w-full h-full"
      >
        {items.map((item, index) => (
          <SwiperSlide key={index} className="w-full h-full relative">
             <div className="w-full h-full bg-gray-900">
               <img 
                 src={item.image} 
                 alt={item.alt || item.title || ''} 
                 className="w-full h-full object-cover opacity-90" 
               />               {/* Optional overlay for better text contrast if needed later */}
               <div className="absolute inset-0 bg-black/10"></div>
             </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation Controls (Arrows) */}
      <button 
        type="button"
        className="swiper-button-prev-hero left-4 bg-white/20 hover:bg-white/80 text-white hover:text-gray-900 p-3 rounded-full backdrop-blur-sm transition-all duration-300 opacity-0 group-hover:opacity-100 transform -translate-x-4 group-hover:translate-x-0 shadow-lg"
        aria-label="Previous Slide"
      >
        <ChevronLeft size={28} />
      </button>
      
      <button 
        type="button"
        className="swiper-button-next-hero right-4 bg-white/20 hover:bg-white/80 text-white hover:text-gray-900 p-3 rounded-full backdrop-blur-sm transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 shadow-lg"
        aria-label="Next Slide"
      >
        <ChevronRight size={28} />
      </button>      

    </div>
  );
};

export default HeroCarousel;
