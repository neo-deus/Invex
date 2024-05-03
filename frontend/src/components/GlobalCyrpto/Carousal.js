"use client"
import React, { useContext, useEffect, useRef } from "react";
import { CryptoContext } from "@/Context/Cyrpto"; // Correct path as needed
import Link from "next/link";

const Carousal = () => {
  const { carouselData ,currency} = useContext(CryptoContext);
  const carouselRef = useRef(null);
  const requestAnimationRef = useRef();

  const doubledCarouselData = [...carouselData, ...carouselData];
  // Smooth continuous scroll effect
  useEffect(() => {
    const speed = 1; // Adjust speed as necessary
    let isHovering = false;
    let isDragging = false;

    const scroll = () => {
      if (carouselRef.current && !isHovering && !isDragging) {
        carouselRef.current.scrollLeft += speed;

        // Reset scroll position to start before it visibly reaches the end of duplicated content
        if (carouselRef.current.scrollLeft >= carouselRef.current.scrollWidth / 2) {
          carouselRef.current.scrollLeft = 0;
        }
      }

      requestAnimationRef.current = requestAnimationFrame(scroll);
    };

    const onMouseEnter = () => { isHovering = true; };
    const onMouseLeave = () => { isHovering = false; };
    const onMouseDown = () => { isDragging = true; };
    const onMouseUpOutside = () => { isDragging = false; };

    if (carouselRef.current) {
      carouselRef.current.addEventListener('mouseenter', onMouseEnter);
      carouselRef.current.addEventListener('mouseleave', onMouseLeave);
      carouselRef.current.addEventListener('mousedown', onMouseDown);
      document.addEventListener('mouseup', onMouseUpOutside);
    }

    requestAnimationRef.current = requestAnimationFrame(scroll);

    return () => {
      if (carouselRef.current) {
        carouselRef.current.removeEventListener('mouseenter', onMouseEnter);
        carouselRef.current.removeEventListener('mouseleave', onMouseLeave);
        carouselRef.current.removeEventListener('mousedown', onMouseDown);
      }
      document.removeEventListener('mouseup', onMouseUpOutside);
      cancelAnimationFrame(requestAnimationRef.current);
    };
  }, []);

  return (
    <div className="flex justify-center items-center">
      <div
        ref={carouselRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide no-scrollbar p-4 mt-48 scroll-smooth"
        style={{ scrollBehavior: "auto" }} // Disable smooth scroll CSS to avoid jittering on reset
      >
        {doubledCarouselData.map((coin, index) => (
          <div
            key={index} // Index as key due to duplicated items; ensure uniqueness if possible
            className="min-w-max h-full rounded-lg shadow-lg flex flex-col items-center justify-around p-4 backdrop-blur-lg bg-white/20 m-7"
          >
            <div className="flex">
              <img
                src={coin.image}
                alt={coin.name}
                className="w-16 h-16 rounded-full mr-3 shadow-sm"
              />
              <div>
                <div className="text-lg font-bold text-yellow-500">
                  {coin.symbol.toUpperCase()}
                </div>
                <div
                  className={`text-sm ${
                    coin.price_change_percentage_24h >= 0
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {coin.price_change_percentage_24h?.toFixed(2)}%
                </div>
                <div className="text-sm text-slate-300">
                {new Intl.NumberFormat("en-IN", {
                      style: 'currency',
                      currency: currency,
                    }).format(coin.current_price)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Carousal;
