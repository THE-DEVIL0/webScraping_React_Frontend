import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeroImage from "../../public/images/Hero.png";
import Feature1 from "../../public/images/Feature1.png";
import Feature2 from "../../public/images/Feature2.png";
import Feature3 from "../../public/images/Feature3.png";
import Result from "../../public/images/Result.png";
import Testimonials from "../components/Testimonials";
import { Link } from "react-router-dom";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const heroRef = useRef(null);
  const headingRef = useRef(null);
  const subtextRef = useRef(null);
  const buttonsRef = useRef(null);
  const statsRef = useRef(null);
  
  // For Video section
  const videoSectionRef = useRef(null);
  const videoRef = useRef(null);
  
  // For Results section
  const resultsSectionRef = useRef(null);
  const resultsImageRef = useRef(null);
  const resultsContentRef = useRef(null);
  
  // For Features section
  const [currentSlide, setCurrentSlide] = useState(0);

  // Features data array
  const featuresData = [
    {
      id: 1,
      image: Feature1,
      alt: "Feature1",
      buttonText: "AI FILTERS"
    },
    {
      id: 2,
      image: Feature2,
      alt: "Feature2", 
      buttonText: "AI IMAGE ENHANCEMENT"
    },
    {
      id: 3,
      image: Feature3,
      alt: "Feature3",
      buttonText: "AI PORTRAIT"
    }
  ];

  // Auto-slide functionality for features
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuresData.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [featuresData.length]);

  // Animation for Hero section
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Set initial states for all text elements - slide from left
      gsap.set([headingRef.current, subtextRef.current, buttonsRef.current, statsRef.current], {
        opacity: 0,
        x: -100
      });

      // Animate all text elements together from left
      gsap.to([headingRef.current, subtextRef.current, buttonsRef.current, statsRef.current], {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      });

    }, heroRef);

    return () => ctx.revert();
  }, []);

  // Animation for Video section
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(videoRef.current, {
        opacity: 0,
        scale: 0.8
      });

      gsap.to(videoRef.current, {
        opacity: 1,
        scale: 1,
        duration: 1.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: videoSectionRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      });

    }, videoSectionRef);

    return () => ctx.revert();
  }, []);

  // Animation for Results section
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Set initial states - image from left, content from right
      gsap.set(resultsImageRef.current, {
        opacity: 0,
        x: -100
      });

      gsap.set(resultsContentRef.current, {
        opacity: 0,
        x: 100
      });

      // Animate image from left
      gsap.to(resultsImageRef.current, {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: resultsSectionRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      });

      // Animate content from right
      gsap.to(resultsContentRef.current, {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: resultsSectionRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      });

    }, resultsSectionRef);

    return () => ctx.revert();
  }, []);

  // Get card position and styling for features
  const getCardPosition = (index) => {
    const diff = (index - currentSlide + featuresData.length) % featuresData.length;
    const isMobile = window.innerWidth < 768;
    
    if (isMobile) {
      // Mobile: Only show current slide
      if (diff === 0) {
        return {
          left: '50%',
          transform: 'translateX(-50%) translateY(-20px)',
          width: '85vw',
          height: '300px',
          zIndex: 10,
          opacity: 1,
          display: 'block'
        };
      } else {
        return {
          display: 'none'
        };
      }
    } else {
      // Desktop: Original logic
      if (diff === 0) {
        // Center card - largest, elevated upward, wider
        return {
          left: '50%',
          transform: 'translateX(-50%) translateY(-30px)',
          width: '45vw',
          height: '350px',
          zIndex: 10,
          opacity: 1
        };
      } else if (diff === 1) {
        // Right card - half visible, smaller, normal height
        return {
          right: '-120px',
          transform: 'translateX(0) translateY(0)',
          width: '35vw',
          height: '280px',
          zIndex: 5,
          opacity: 0.8
        };
      } else {
        // Left card - half visible, smaller, normal height
        return {
          left: '-120px',
          transform: 'translateX(0) translateY(0)',
          width: '35vw',
          height: '280px',
          zIndex: 5,
          opacity: 0.8
        };
      }
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen w-full overflow-hidden text-white pt-16 sm:pt-20 md:pt-24">
        {/* Base solid background - changed to dark background */}
        <div className="absolute inset-0 bg-[#0A0A0A]"></div>
        
        {/* Hero image - covers full width */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-no-repeat"
            style={{
              backgroundImage: `url(${HeroImage})`,
              backgroundSize: "cover",
              backgroundPosition: window.innerWidth < 768 ? "center" : "center right",
              mixBlendMode: "normal",
              opacity: 1,
            }}
          />
        </div>
        
        {/* Readability layer - strong gradient from left to right */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#2E1E6B] from-40% sm:from-30% via-[#2E1E6B]/70 sm:via-[#2E1E6B]/60 via-70% sm:via-60% to-transparent"></div>
        
        <div className="relative z-10 min-h-screen container mx-auto flex flex-col md:flex-row items-center justify-center px-4 sm:px-6 py-8 sm:py-12 md:py-0">
          {/* Left text content */}
          <div className="w-full ml-2 sm:ml-6 md:ml-10 md:w-1/2 flex flex-col items-start justify-center">
            {/* Heading */}
            <h1 ref={headingRef} className="text-[28px] sm:text-[32px] md:text-[42px] lg:text-[46px] font-extrabold leading-tight sm:leading-snug mb-4 sm:mb-6 max-w-xl">
              ENHANCE <br />
              <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
                YOUR PRODUCT
              </span>
              <br />
              IMAGE
            </h1>

            {/* Subtext */}
            <div ref={subtextRef} className="text-gray-200 text-sm sm:text-base md:text-base leading-relaxed mb-6 sm:mb-8 max-w-md">
              <p>Turn ordinary photos into eye-catching visuals.</p>
              <p>Showcase your products with clarity and style.</p>
              <p>Let AI make your images market-ready in seconds.</p>
            </div>

            {/* Buttons */}
            <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-10 w-full sm:w-auto">
              {/* Try Now */}
              <Link to="/cards" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 sm:py-2.5 px-6 sm:px-8 
                                  uppercase tracking-wide shadow-lg 
                                  transform skew-x-[-12deg] transition-all duration-300 hover:scale-105 text-sm md:text-base w-full sm:w-auto">
                <span className="inline-block skew-x-[12deg]">TRY NOW</span>
              </Link>

              {/* Learn More */}
              <button className="border border-purple-400 text-purple-200 font-bold py-3 sm:py-2.5 px-6 sm:px-8 
                                  uppercase tracking-wide 
                                  transform skew-x-[-12deg] transition-all duration-300 hover:scale-105 
                                  bg-transparent hover:border-purple-300 hover:text-white text-sm md:text-base w-full sm:w-auto">
                <span className="inline-block skew-x-[12deg]">LEARN MORE</span>
              </button>
            </div>

            {/* Stats */}
            <div ref={statsRef} className="flex mb-8 sm:mb-10 gap-6 sm:gap-8 md:gap-12 justify-center sm:justify-start w-full sm:w-auto">
              <div className="text-center">
                <div className="text-lg sm:text-xl md:text-2xl font-bold">300+</div>
                <div className="text-xs md:text-sm text-gray-300">Unique Style</div>
              </div>
              <div className="text-center">
                <div className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                  2K+
                </div>
                <div className="text-xs md:text-sm text-gray-300">Product Enhanced</div>
              </div>
              <div className="text-center">
                <div className="text-lg sm:text-xl md:text-2xl font-bold">75+</div>
                <div className="text-xs md:text-sm text-gray-300">Happy Customer</div>
              </div>
            </div>
          </div>

          {/* Spacer for hero image on right */}
          <div className="hidden md:block w-1/2"></div>
        </div>
      </section>

      {/* Video Demo Section */}
      <section 
        ref={videoSectionRef} 
        className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#1a1c54] via-[#2d2e7a] to-[#4c0d73] py-12 sm:py-20"
      >
        {/* Background pattern overlay */}
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2Utb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNIDAgMCBMIDYwIDYwIE0gNjAgMCBMIDAgNjAiLz48L2c+PC9zdmc+')]"></div>
        
        <div className="relative z-10 container mx-auto px-4 sm:px-6 flex flex-col items-center">
          {/* Section Heading */}
          <h2 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-4 sm:mb-6 tracking-wide">
            WITNESS THE{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600">
              MAGIC
            </span>
          </h2>
          <p className="text-gray-300 text-lg sm:text-xl text-center mb-10 sm:mb-12 max-w-2xl">
            See how our AI transforms ordinary images into extraordinary visuals in seconds
          </p>
          
          {/* Video Container */}
          <div 
            ref={videoRef}
            className="relative w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl transform transition-all duration-700"
          >
            <div className="relative aspect-video w-full">
              <div className="absolute inset-0 w-full h-full">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/Jf_usaY7B6c?autoplay=1&mute=1&loop=1&playlist=Jf_usaY7B6c&controls=0&modestbranding=1&showinfo=0&rel=0"
                  title="Product Demo"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen={false}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: 'none'
                  }}
                ></iframe>
              </div>
              
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          </div>
          
          {/* Call to action */}
          <div className="mt-10 sm:mt-12 text-center">
            <p className="text-gray-300 text-sm sm:text-base mb-6">
              Ready to transform your images?
            </p>
            <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold 
                               py-3 px-8 uppercase tracking-wide shadow-lg 
                               transform skew-x-[-12deg] transition-all duration-300 hover:scale-105">
              <span className="inline-block skew-x-[12deg]">GET STARTED NOW</span>
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full bg-gradient-to-br from-[#1a1c54] via-[#2d2e7a] to-[#4c0d73] py-12 sm:py-20 flex flex-col items-center overflow-hidden relative min-h-screen">
        {/* Background overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        
        {/* Heading */}
        <div className="relative z-10 mb-12 sm:mb-16 px-4">
          <h2 className="text-white text-3xl sm:text-4xl md:text-6xl font-bold text-center tracking-wide leading-tight">
            EXPLORE<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600">
              POWERFUL
            </span>{" "}
            FEATURE
          </h2>
        </div>
        
        {/* Cards Container */}
        <div className="relative w-full max-w-7xl mx-auto mb-12 sm:mb-16" style={{ height: window.innerWidth < 768 ? '380px' : '450px' }}>
          {featuresData.map((feature, index) => {
            const position = getCardPosition(index);
            const isCenter = (index - currentSlide + featuresData.length) % featuresData.length === 0;
            
            return (
              <div 
                key={feature.id}
                className="absolute transition-all duration-700 ease-in-out"
                style={{
                  ...position,
                  top: '50%',
                  marginTop: window.innerWidth < 768 ? '-150px' : '-175px'
                }}
              >
                {/* Card Image */}
                <div 
                  className={`overflow-hidden shadow-2xl relative ${isCenter ? '' : 'rounded-xl'}`}
                  style={{ width: position.width, height: position.height }}
                >
                  <img 
                    src={feature.image} 
                    alt={feature.alt} 
                    className="w-full h-full object-cover object-center" 
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                </div>
                
                {/* Button positioned outside/below the card - only show for center card */}
                {isCenter && (
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 z-20">
                    <div 
                      className="bg-gradient-to-r from-purple-600 to-pink-500 text-white 
                                 text-xs sm:text-sm font-bold px-4 sm:px-6 py-2 sm:py-3 shadow-lg relative"
                      style={{
                        clipPath: 'polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)',
                        minWidth: window.innerWidth < 768 ? '160px' : '200px',
                        textAlign: 'center'
                      }}
                    >
                      {feature.buttonText}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 relative z-10 px-4 w-full sm:w-auto">
          {/* View All */}
          <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-6 sm:px-8 
                              uppercase tracking-wide shadow-lg 
                              transform skew-x-[-12deg] transition-all duration-300 hover:scale-105 w-full sm:w-auto">
            <span className="inline-block skew-x-[12deg]">VIEW ALL</span>
          </button>

          {/* Try Now */}
          <button className="border border-purple-400 text-purple-200 font-bold py-3 px-6 sm:px-8 
                              uppercase tracking-wide 
                              transform skew-x-[-12deg] transition-all duration-300 hover:scale-105 
                              bg-transparent hover:border-purple-300 hover:text-white w-full sm:w-auto">
            <span className="inline-block skew-x-[12deg]">TRY NOW</span>
          </button>
        </div>
      </section>

      {/* Results Section */}
      <section 
        ref={resultsSectionRef} 
        className="bg-gradient-to-br from-blue-900 via-purple-900 to-blue-800 
                   min-h-screen px-4 sm:px-6 md:px-12 flex items-center 
                   overflow-x-hidden"
      >
        <div className="max-w-7xl mx-auto w-full max-w-full">
          {/* Main Card Container */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl 
                          h-auto md:h-[80vh] p-4 md:p-6 relative overflow-hidden flex items-center">
            <div className="flex flex-col lg:flex-row items-center gap-6 sm:gap-8 lg:gap-16 w-full">
              
              {/* Left Image */}
              <div ref={resultsImageRef} className="w-full lg:w-1/2 relative">
                <div className="relative z-10">
                  <img 
                    src={Result} 
                    alt="VR Experience" 
                    className="w-full h-56 sm:h-72 md:h-96 lg:h-[480px] 
                               object-cover max-w-sm sm:max-w-md md:max-w-lg 
                               mx-auto lg:mx-0 drop-shadow-2xl rounded-2xl"
                  />
                </div>
              </div>

              {/* Right Content */}
              <div 
                ref={resultsContentRef} 
                className="w-full lg:w-1/2 text-white text-center lg:text-left 
                           mt-6 sm:mt-8 lg:mt-0 px-2 sm:px-0"
              >
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold 
                               mb-4 sm:mb-6 leading-snug sm:leading-tight">
                  EXPERIENCE RESULTS<br />
                  IN{" "}
                  <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    REALTIME
                  </span><br />
                  RESULTS
                </h2>
                
                <p className="text-sm sm:text-base md:text-lg text-gray-300 mb-6 
                               leading-relaxed max-w-md sm:max-w-xl mx-auto lg:mx-0">
                  A powerful feature header combines clean icons, bold typography, engaging visuals, and a clear layout to highlight functionality, ease of use, and the value your product delivers.
                </p>
                
                {/* Button */}
                <div className="flex justify-center lg:justify-start">
                  <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold 
                                     py-2 px-6 sm:py-2.5 sm:px-8 uppercase tracking-wide shadow-lg 
                                     transform skew-x-[-12deg] transition-all duration-300 
                                     hover:scale-105 text-xs sm:text-sm md:text-base">
                    <span className="inline-block skew-x-[12deg]">EXPLORE NOW</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials />
    </div>
  );
};

export default Home;