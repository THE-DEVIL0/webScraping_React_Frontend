import React from 'react'
import { Link } from "react-router-dom";

const Services = () => {

  const services = [
    {
      id: 1,
      title: "Background Removal",
      subtitle: "Perfect Product Isolation",
      description: "Isolate your products with crisp, clean edges using advanced AI segmentation. No artifacts, just professional results.",
      features: [
        "remove.bg API integration",
        "Meta's Segment Anything Model (SAM)",
        "U²-Net and MODNet compatibility",
        "RemBG Python library support"
      ],
      gradient: "from-purple-500 to-pink-500",
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a4 4 0 004-4V5z"/>
        </svg>
      )
    },
    {
      id: 2,
      title: "Background Generation",
      subtitle: "Realistic Scene Creation",
      description: "Transform your products with AI-generated studio and lifestyle backgrounds that look professionally shot.",
      features: [
        "Stable Diffusion with ControlNet",
        "DALL·E 3 integration",
        "Midjourney compatibility",
        "Smart compositing with OpenCV"
      ],
      gradient: "from-pink-500 to-purple-500",
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
        </svg>
      )
    },
    {
      id: 3,
      title: "Image Optimization",
      subtitle: "Perfect Quality & Performance",
      description: "Enhance lighting, sharpness, and colors while optimizing file sizes for lightning-fast online store performance.",
      features: [
        "GFPGAN sharpness restoration",
        "ESRGAN upscaling technology",
        "AI-powered color correction",
        "Smart compression optimization"
      ],
      gradient: "from-blue-500 to-purple-500",
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
        </svg>
      )
    },
    {
      id: 4,
      title: "Automated Workflow",
      subtitle: "Zero-Touch Processing",
      description: "Fully automated process that integrates directly with your store. No manual uploads or downloads required.",
      features: [
        "Shopify Admin API integration",
        "FastAPI backend automation",
        "Node.js workflow support",
        "Make/Zapier compatibility"
      ],
      gradient: "from-purple-600 to-pink-500",
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
      )
    },
    {
      id: 5,
      title: "AI Scene Suggestions",
      subtitle: "Creative Background Ideas",
      description: "Get intelligent, brand-consistent background suggestions automatically generated for your specific products.",
      features: [
        "GPT-4/5 scene prompting",
        "CLIP-powered image ranking",
        "Brand consistency analysis",
        "Creative lifestyle suggestions"
      ],
      gradient: "from-indigo-500 to-blue-500",
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
        </svg>
      )
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-blue-800">
      {/* Hero Section */}
      <section className="relative min-h-screen w-full overflow-hidden text-white pt-16 sm:pt-20 md:pt-24">
        {/* Base solid background */}
        <div className="absolute inset-0 bg-[#0A0A0A]"></div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-10 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
          <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse delay-700"></div>
        </div>
        
        {/* Readability layer */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#2E1E6B] from-10% via-[#2E1E6B]/60 via-60% to-transparent"></div>
        
        <div className="relative z-10 min-h-screen container mx-auto flex flex-col items-center justify-center px-4 sm:px-6 py-8 sm:py-12 md:py-0">
          
          {/* Center Content */}
          <div className="w-full text-center flex flex-col items-center justify-center">
            {/* Main Heading */}
            <h1 className="text-[30px] sm:text-[36px] md:text-[48px] lg:text-[54px] mt-10 font-extrabold leading-tight sm:leading-snug mb-6 sm:mb-8 max-w-4xl">
              POWERFUL{" "}
              <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
                AI SERVICES
              </span>
              {" "}FOR<br />
              STUNNING{" "}
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 bg-clip-text text-transparent">
                PRODUCT IMAGES
              </span>
            </h1>

            {/* Subtext */}
            <div className="text-gray-200 text-base sm:text-lg md:text-xl leading-relaxed mb-8 sm:mb-10 max-w-3xl">
              <p>Transform your product photography with cutting-edge AI technology.</p>
              <p>From background removal to scene generation, we've got everything covered.</p>
              <p>Professional results in seconds, not hours.</p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-12 sm:mb-16 w-full sm:w-auto">
              <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 sm:py-4 px-8 sm:px-10 
                                  uppercase tracking-wide shadow-lg 
                                  transform -skew-x-12 transition-all duration-300 hover:scale-105 text-sm md:text-base w-full sm:w-auto">
                <span className="inline-block skew-x-12">START FREE TRIAL</span>
              </button>
            </div>

            {/* Service Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 max-w-4xl w-full mb-12">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 transform transition-all duration-300 hover:scale-105">
                <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                  5
                </div>
                <div className="text-gray-300 text-sm">AI Services</div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 transform transition-all duration-300 hover:scale-105">
                <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                  &lt;3s
                </div>
                <div className="text-gray-300 text-sm">Processing Time</div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 transform transition-all duration-300 hover:scale-105">
                <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent mb-2">
                  99%
                </div>
                <div className="text-gray-300 text-sm">Accuracy Rate</div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 transform transition-all duration-300 hover:scale-105">
                <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-2">
                  24/7
                </div>
                <div className="text-gray-300 text-sm">API Access</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid Section */}
      <section className="py-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              OUR{" "}
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 bg-clip-text text-transparent">
                SERVICES
              </span>
            </h2>
            <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto">
              Comprehensive AI-powered solutions for all your product image enhancement needs
            </p>
          </div>

          <div className="grid gap-8 lg:gap-12">
            {services.map((service,) => (
              <div 
                key={service.id}
                className="relative group"
                
              >
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 lg:p-12 relative overflow-hidden group-hover:bg-white/15 transition-all duration-500 w-full">
                  
                  {/* Background decoration */}
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${service.gradient} rounded-full opacity-10 transform translate-x-16 -translate-y-16 group-hover:scale-150 transition-all duration-700`}></div>
                  
                  <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8 lg:gap-12">
                    
                    {/* Service Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white transform group-hover:rotate-6 group-hover:scale-110 transition-all duration-300">
                          {service.icon}
                        </div>
                        <div>
                          <h3 className="text-2xl lg:text-3xl font-bold text-white mb-1">{service.title}</h3>
                          <p className="text-purple-300 text-lg">{service.subtitle}</p>
                        </div>
                      </div>

                      <p className="text-gray-300 text-lg leading-relaxed mb-8 max-w-2xl">
                        {service.description}
                      </p>

                      <div className="grid sm:grid-cols-2 gap-4 mb-8">
                        {service.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
                            <span className="text-gray-300 text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>

                      <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-8
                                         uppercase tracking-wide shadow-lg
                                         transform -skew-x-12 transition-all duration-300 hover:scale-105 opacity-80 hover:opacity-100">
                        <span className="inline-block skew-x-12 text-sm">LEARN MORE</span>
                      </button>
                    </div>

                    {/* Visual Element */}
                    <div className="lg:w-80 w-full">
                      <div className="relative bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl p-8 h-64 lg:h-80 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-all duration-500">
                        {/* Decorative elements */}
                        <div className="absolute inset-0 bg-black/20"></div>
                        <div className="absolute top-4 right-4 w-16 h-16 border-2 border-white/30 rounded-xl transform rotate-12 group-hover:rotate-45 transition-all duration-700"></div>
                        <div className="absolute bottom-4 left-4 w-12 h-12 border-2 border-white/20 rounded-lg transform -rotate-12 group-hover:-rotate-45 transition-all duration-700"></div>
                        
                        {/* Center Icon */}
                        <div className="relative z-10 text-white transform group-hover:scale-110 transition-all duration-300">
                          <div className="w-20 h-20">
                            {service.icon}
                          </div>
                        </div>
                        
                        {/* Number Badge */}
                        <div className="absolute top-6 left-6 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {service.id}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="py-20 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 md:p-12 text-center">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
              SEAMLESS{" "}
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 bg-clip-text text-transparent">
                INTEGRATION
              </span>
            </h3>
            
            <p className="text-gray-300 text-lg md:text-xl mb-12 max-w-3xl mx-auto">
              Our AI services integrate directly with your existing workflow. 
              No complex setup, no manual processes - just powerful automation that works.
            </p>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
                  </svg>
                </div>
                <h4 className="text-white font-bold text-lg mb-2">API First</h4>
                <p className="text-gray-300 text-sm">RESTful APIs for seamless integration with any platform</p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"/>
                  </svg>
                </div>
                <h4 className="text-white font-bold text-lg mb-2">Batch Processing</h4>
                <p className="text-gray-300 text-sm">Handle thousands of images simultaneously</p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <h4 className="text-white font-bold text-lg mb-2">99.9% Uptime</h4>
                <p className="text-gray-300 text-sm">Enterprise-grade reliability you can depend on</p>
              </div>
            </div>

            <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 px-10
                               uppercase tracking-wide shadow-lg
                               transform -skew-x-12 transition-all duration-300 hover:scale-105">
              <span className="inline-block skew-x-12">GET API ACCESS</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Services

