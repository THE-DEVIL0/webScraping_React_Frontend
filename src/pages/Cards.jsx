import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link, useNavigate } from "react-router-dom";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const Cards = () => {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const headingRef = useRef(null);
  const subtextRef = useRef(null);
  const buttonsRef = useRef(null);
  const cardsRef = useRef(null);
  const cardRefs = useRef([]);
  const [hoveredCard, setHoveredCard] = useState(null);

  // Platform cards data with enhanced visuals
  const platformCards = [
    {
      id: 1,
      name: "AMAZON",
      description: "Transform your Amazon product images with AI-powered background removal and enhancement. Meet Amazon's strict image requirements with professional white backgrounds.",
      features: ["White Background Required", "1000px Minimum Resolution", "Professional Enhancement", "SP-API Integration"],
      gradient: "from-orange-400 via-amber-500 to-yellow-400",
      primaryColor: "#ff9500",
      secondaryColor: "#ffb340",
      shadowColor: "rgba(255, 149, 0, 0.4)",
      icon: "🛒",
      bgPattern: "radial-gradient(circle at 20% 80%, rgba(255, 149, 0, 0.2) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 179, 64, 0.2) 0%, transparent 50%)",
      buttonText: "ENHANCE FOR AMAZON",
      route: "/view?service=amazon",
      stats: ["99.9% Uptime", "500K+ Images", "24/7 Support"]
    },
    {
      id: 2,
      name: "EBAY",
      description: "Optimize your eBay listings with stunning lifestyle backgrounds and professional product photography. Stand out in the marketplace with eye-catching visuals.",
      features: ["Lifestyle Backgrounds", "500px Minimum Resolution", "Studio Quality Enhancement", "Trading API Integration"],
      gradient: "from-blue-400 via-purple-500 to-indigo-600",
      primaryColor: "#3b82f6",
      secondaryColor: "#8b5cf6",
      shadowColor: "rgba(59, 130, 246, 0.4)",
      icon: "🏪",
      bgPattern: "radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.2) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.2) 0%, transparent 50%)",
      buttonText: "ENHANCE FOR EBAY",
      route: "/view?service=ebay",
      stats: ["Lightning Fast", "AI Powered", "Pro Quality"]
    },
    {
      id: 3,
      name: "SHOPIFY",
      description: "Create premium product images for your Shopify store with AI-generated backgrounds and professional optimization. Boost conversion rates with stunning visuals.",
      features: ["Premium Backgrounds", "2048px High Resolution", "Brand Consistent Styling", "Admin API Integration"],
      gradient: "from-emerald-400 via-green-500 to-teal-600",
      primaryColor: "#10b981",
      secondaryColor: "#34d399",
      shadowColor: "rgba(16, 185, 129, 0.4)",
      icon: "🛍️",
      bgPattern: "radial-gradient(circle at 80% 20%, rgba(16, 185, 129, 0.2) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(52, 211, 153, 0.2) 0%, transparent 50%)",
      buttonText: "ENHANCE FOR SHOPIFY",
      route: "/view?service=shopify",
      stats: ["Enterprise", "Scalable", "Reliable"]
    }
  ];

  // Navigation function for button clicks
  const handlePlatformNavigation = (route) => {
    navigate(route);
  };

  // Hero section animations removed

  // Enhanced card animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate the section heading
      gsap.from('.section-heading h2', {
        y: -50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: cardsRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      });

      // Animate card headings with a slight delay
      gsap.utils.toArray('.card-heading').forEach((heading, i) => {
        gsap.from(heading, {
          y: 30,
          opacity: 0,
          duration: 0.8,
          delay: 0.2 + (i * 0.1),
          ease: 'power3.out',
          scrollTrigger: {
            trigger: heading,
            start: 'top 90%',
            toggleActions: 'play none none none'
          }
        });
      });

      // Animate cards
      cardRefs.current.forEach((cardRef, index) => {
        if (cardRef) {
          gsap.set(cardRef, {
            opacity: 0,
            y: 100,
            scale: 0.8,
            rotationY: 15
          });

          gsap.to(cardRef, {
            opacity: 1,
            y: 0,
            scale: 1,
            rotationY: 0,
            duration: 1,
            ease: "power3.out",
            delay: index * 0.3,
            scrollTrigger: {
              trigger: cardsRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse"
            }
          });
        }
      });
    }, cardsRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="bg-gradient-to-br from-[#1a1c54] via-[#2d2e7a] to-[#4c0d73] min-h-screen">
      {/* Background pattern overlay */}
      <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2Utb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNIDAgMCBMIDYwIDYwIE0gNjAgMCBMIDAgNjAiLz48L2c+PC9zdmc+')]"></div>
      
      {/* Revolutionary Platform Cards Section */}
      <section 
        ref={cardsRef}
        className="py-20 px-4 sm:px-6 min-h-screen flex items-center overflow-hidden relative"
      >
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-400 rounded-full animate-ping opacity-30"></div>
          <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-pink-400 rounded-full animate-pulse opacity-40"></div>
          <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce opacity-25"></div>
          <div className="absolute bottom-1/4 left-1/2 w-1 h-1 bg-emerald-400 rounded-full animate-ping opacity-35"></div>
        </div>
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto w-full">
          {/* Section Heading */}
          <div className="section-heading text-center mb-20">
            <h2 className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 tracking-tight leading-none">
              SELECT YOUR{" "}
              <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 animate-pulse">
                DESTINATION
              </span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
              Each platform demands perfection. Choose yours and witness the transformation.
            </p>
          </div>

          {/* Revolutionary Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 perspective-1000">
            {platformCards.map((card, index) => (
              <div
                key={card.id}
                ref={el => cardRefs.current[index] = el}
                className="group relative transform-gpu"
                onMouseEnter={() => setHoveredCard(card.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Outer glow effect - Reduced intensity */}
                <div className={`absolute inset-0 rounded-3xl blur-md opacity-0 group-hover:opacity-20 transition-all duration-700 bg-gradient-to-r ${card.gradient}`}
                     style={{ transform: 'scale(1.05)' }}></div>

                {/* Main Card Container */}
                <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden
                               transform group-hover:scale-102 transition-all duration-700 group-hover:border-white/30
                               shadow-2xl group-hover:shadow-4xl min-h-[600px] flex flex-col">
                  
                  {/* Dynamic Background Pattern */}
                  <div className="absolute inset-0 opacity-30 group-hover:opacity-40 transition-opacity duration-700"
                       style={{ background: card.bgPattern }}></div>

                  {/* Animated border */}
                  <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-50 transition-opacity duration-700">
                    <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${card.gradient} animate-pulse`}
                         style={{ 
                           background: `linear-gradient(45deg, ${card.primaryColor}10, ${card.secondaryColor}10, ${card.primaryColor}10)`,
                           backgroundSize: '400% 400%',
                           animation: hoveredCard === card.id ? 'gradientShift 3s ease infinite' : 'none'
                         }}></div>
                  </div>

                  {/* Content Container */}
                  <div className="relative z-20 p-8 flex flex-col h-full">
                    
                    {/* Header Section */}
                    <div className="text-center mb-8">
                      {/* Platform Icon with 3D effect */}
                      <div className="relative inline-block mb-6">
                        <div className="text-7xl transform group-hover:scale-110 group-hover:rotate-12 
                                        transition-all duration-500 filter drop-shadow-2xl">
                          {card.icon}
                        </div>
                        <div className={`absolute -inset-4 rounded-full blur-2xl opacity-0 group-hover:opacity-20 
                                         transition-all duration-700 bg-gradient-to-r ${card.gradient}`}></div>
                      </div>

                      {/* Platform Name with holographic effect */}
                      <h3 className={`card-heading text-4xl font-black mb-4 transform group-hover:scale-110 
                                      transition-all duration-500 bg-gradient-to-r ${card.gradient} 
                                      bg-clip-text text-transparent`}
                          style={{
                            textShadow: hoveredCard === card.id 
                              ? `0 0 15px ${card.shadowColor}, 0 0 30px ${card.shadowColor}` 
                              : 'none',
                            opacity: 0 // Start invisible for the animation
                          }}>
                        {card.name}
                      </h3>

                      {/* Stats badges */}
                      <div className="flex flex-wrap justify-center gap-2 mb-6">
                        {card.stats.map((stat, i) => (
                          <span key={i} className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full 
                                                    text-xs text-white/80 border border-white/20
                                                    transform group-hover:scale-105 transition-all duration-300"
                                style={{ animationDelay: `${i * 100}ms` }}>
                            {stat}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-300 text-sm leading-relaxed mb-8 text-center flex-grow
                                  group-hover:text-white transition-colors duration-500">
                      {card.description}
                    </p>

                    {/* Features with animated icons */}
                    <div className="mb-8">
                      <div className="grid grid-cols-1 gap-3">
                        {card.features.map((feature, featureIndex) => (
                          <div key={featureIndex} 
                               className="flex items-center group-hover:translate-x-2 transition-all duration-300 
                                          bg-white/5 rounded-lg p-3 backdrop-blur-sm border border-white/10
                                          group-hover:bg-white/10 group-hover:border-white/20"
                               style={{ animationDelay: `${featureIndex * 100}ms` }}>
                            <div className={`w-3 h-3 rounded-full mr-3 bg-gradient-to-r ${card.gradient} 
                                            animate-pulse shadow-lg flex-shrink-0`}
                                 style={{ 
                                   boxShadow: hoveredCard === card.id 
                                     ? `0 0 10px ${card.shadowColor}` 
                                     : 'none' 
                                 }}></div>
                            <span className="text-gray-300 text-xs group-hover:text-white transition-colors duration-300 font-medium">
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Revolutionary Action Button */}
                    <div className="mt-auto">
                      <button 
                        onClick={() => handlePlatformNavigation(card.route)}
                        className="relative w-full group/btn overflow-hidden"
                      >
                        {/* Button background with animated gradient */}
                        <div className={`absolute inset-0 bg-gradient-to-r ${card.gradient} 
                                         transform scale-105 blur-sm opacity-50 
                                         group-hover/btn:scale-110 group-hover/btn:opacity-70 
                                         transition-all duration-500`}></div>
                        
                        {/* Main button */}
                        <div className={`relative bg-gradient-to-r ${card.gradient} text-white font-black 
                                         py-4 px-8 uppercase tracking-wider shadow-2xl 
                                         transform skew-x-[-8deg] transition-all duration-500 
                                         group-hover/btn:scale-105 group-hover/btn:skew-x-[-4deg] 
                                         text-sm border-2 border-white/20 group-hover/btn:border-white/40`}
                             style={{
                               boxShadow: hoveredCard === card.id 
                                 ? `0 10px 40px ${card.shadowColor}, inset 0 1px 0 rgba(255,255,255,0.2)` 
                                 : `0 4px 20px ${card.shadowColor}40`
                             }}>
                          <span className="inline-block skew-x-[8deg] relative z-10">
                            {card.buttonText}
                          </span>
                          
                          {/* Animated shine effect */}
                          <div className="absolute inset-0 -skew-x-12 translate-x-[-100%] 
                                          bg-gradient-to-r from-transparent via-white/10 to-transparent 
                                          group-hover/btn:translate-x-[100%] transition-transform duration-1000"></div>
                        </div>

                        {/* Floating particles effect */}
                        <div className="absolute inset-0 opacity-0 group-hover/btn:opacity-50 transition-opacity duration-500">
                          <div className="absolute top-1/2 left-1/4 w-1 h-1 bg-white rounded-full animate-ping"></div>
                          <div className="absolute top-1/3 right-1/4 w-0.5 h-0.5 bg-white rounded-full animate-pulse delay-200"></div>
                          <div className="absolute bottom-1/3 left-1/2 w-0.5 h-0.5 bg-white rounded-full animate-bounce delay-100"></div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Holographic overlay */}
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700
                                   bg-gradient-to-br from-white via-transparent to-transparent 
                                   mix-blend-overlay pointer-events-none`}></div>
                </div>

                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-white/10 to-transparent 
                                rounded-full blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-700 
                                animate-pulse"></div>
                <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-tr from-white/10 to-transparent 
                                rounded-full blur-lg opacity-0 group-hover:opacity-40 transition-opacity duration-700 
                                animate-bounce"></div>
              </div>
            ))}
          </div>

          {/* Enhanced Bottom Section */}
          <div className="text-center mt-12 sm:mt-16">
            <p className="text-gray-400 text-sm sm:text-base mb-6">
              Not sure which platform? Contact our team for personalized recommendations.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              {/* Contact Support */}
              <button className="border border-purple-400 text-purple-200 font-bold py-3 px-6 sm:px-8 
                                  uppercase tracking-wide 
                                  transform skew-x-[-12deg] transition-all duration-300 hover:scale-105 
                                  bg-transparent hover:border-purple-300 hover:text-white w-full sm:w-auto">
                <span className="inline-block skew-x-[12deg]">CONTACT SUPPORT</span>
              </button>

              {/* Back to Home */}
              <Link 
                to="/" 
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-6 sm:px-8 
                           uppercase tracking-wide shadow-lg 
                           transform skew-x-[-12deg] transition-all duration-300 hover:scale-105 w-full sm:w-auto inline-block text-center"
              >
                <span className="inline-block skew-x-[12deg]">BACK TO HOME</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Custom CSS for animations */}
      <style >{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .perspective-1000 {
          perspective: 1000px;
        }
        
        .shadow-4xl {
          box-shadow: 0 20px 60px -12px rgba(0, 0, 0, 0.5), 
                      0 0 80px rgba(168, 85, 247, 0.2);
        }
      `}</style>
    </div>
  );
};

export default Cards;