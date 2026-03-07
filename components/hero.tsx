"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const slides = [
  {
    image: "/fresh.png",
    headline: "Your One-Stop Shop for Quality Groceries",
    caption: "Farm fresh vegetables & food 100% organic. Always fresh organic products for you.",
    badge: "🌱 100% Fresh & Organic"
  },
  {
    image: "/delivery2.png",
    headline: "1-Hour Delivery to Your Door",
    caption: "Order now, enjoy fresh groceries within 1 hour. Fast and reliable delivery.",
    badge: "⚡Fast Delivery"
  },
  {
    image: "/meat.png",
    headline: "Premium Quality Meats & Seafood",
    caption: "Hand-selected cuts, delivered fresh to your doorstep. Quality you can trust.",
    badge: "🥩 Fresh Daily"
  },
  {
    image: "/dairy.png",
    headline: "Farm-Fresh Dairy Products",
    caption: "Fresh milk, cheese, and eggs delivered daily. Direct from local farms to your table.",
    badge: "🥛 Direct from Farm"
  }
];

export function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [preloadedSlides, setPreloadedSlides] = useState(new Set([0]));

  // Preload next slide image
  useEffect(() => {
    const nextSlideIndex = (currentSlide + 1) % slides.length;
    if (!preloadedSlides.has(nextSlideIndex)) {
      const img = new window.Image();
      img.src = slides[nextSlideIndex].image;
      img.onload = () => {
        setPreloadedSlides(prev => new Set([...prev, nextSlideIndex]));
      };
    }
  }, [currentSlide, preloadedSlides]);

  // Auto-rotate slides every 5 seconds
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <section 
      className="relative w-full h-[80vh] md:h-[90vh] lg:h-[95vh] overflow-hidden bg-gradient-to-br from-emerald-50 to-green-100"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Carousel Slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {/* Image */}
          <div className="relative w-full h-full">
            <Image
              src={slides[currentSlide].image}
              alt={slides[currentSlide].headline}
              fill
              className="object-fill"
              priority={currentSlide === 0}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
              quality={85}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
            />
            
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />
          </div>

          {/* Text Content */}
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-6 md:px-12 lg:px-16">
              <div className="max-w-3xl space-y-6">
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <span className="inline-flex items-center px-5 py-2.5 bg-green-600 text-white rounded-full text-sm md:text-base font-semibold shadow-lg">
                    {slides[currentSlide].badge}
                  </span>
                </motion.div>

                {/* Headline */}
                <motion.h1
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight"
                >
                  {currentSlide === 0 ? "Grocery Uganda - Fresh Groceries Delivered in Kampala" : slides[currentSlide].headline}
                </motion.h1>

                {/* Caption */}
                <motion.p
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="text-base md:text-lg lg:text-xl text-white/90 max-w-xl leading-relaxed"
                >
                  {slides[currentSlide].caption}
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="flex flex-col sm:flex-row gap-4 pt-2"
                >
                  <Link href="/products">
                    <button className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-full text-base md:text-lg font-semibold transition-all duration-300 hover:scale-105 shadow-2xl">
                      Shop Now
                    </button>
                  </Link>
                  {/* <button className="px-8 py-4 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white border-2 border-white rounded-lg text-base md:text-lg font-semibold transition-all duration-300 hover:scale-105">
                    Learn More
                  </button> */}
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      {/* <button
        onClick={goToPrevious}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-14 md:h-14 bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-300 border border-white/30 group"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 md:w-7 md:h-7 text-white group-hover:scale-110 transition-transform" />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-14 md:h-14 bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-300 border border-white/30 group"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 md:w-7 md:h-7 text-white group-hover:scale-110 transition-transform" />
      </button> */}

      {/* Dot Indicators */}
      <div className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              "transition-all duration-300 rounded-full",
              currentSlide === index
                ? "w-12 h-3 bg-white"
                : "w-3 h-3 bg-white/50 hover:bg-white/70"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      {/* <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-20">
        <motion.div
          key={currentSlide}
          initial={{ width: "0%" }}
          animate={{ width: isPaused ? "100%" : "100%" }}
          transition={{ duration: isPaused ? 0 : 5, ease: "linear" }}
          className="h-full bg-green-500"
        />
      </div> */}
      {/* Contact Us Widget */}
      <div className="hidden md:block">
  <div className="fixed md:absolute bottom-6 right-6 md:right-12 z-30">
    <div className="bg-white rounded-xl shadow-xl p-4 w-[270px] border border-gray-100 flex flex-col gap-2">
      <div className="font-bold text-gray-900 text-sm p-2">
        Professional Grocery Services
      </div>
      <div className="text-gray-600 text-xs leading-relaxed">
        From fresh produce to fast delivery, we provide comprehensive grocery
        solutions tailored to your needs.
      </div>
      <Link href="/contact">
        <button className="mt-2 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white rounded-full text-sm font-semibold transition-all duration-300 shadow-lg hover:shadow-xl group transform hover:scale-105 border border-green-500/20">
          Contact Us
          <svg
            className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1.5 transition-all duration-300 group-hover:scale-110"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
      </Link>
    </div>
  </div>
</div>

    </section>
  );
}
