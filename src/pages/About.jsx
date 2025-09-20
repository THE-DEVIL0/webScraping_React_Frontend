import React, { useState } from 'react'

const About = () => {
  const [hoveredStat, setHoveredStat] = useState(null)

  const stats = [
    {
      id: 1,
      number: "2M+",
      label: "Images Enhanced",
      description: "Professional transformations delivered"
    },
    {
      id: 2,
      number: "10K+",
      label: "Happy Clients",
      description: "Businesses trust our AI technology"
    },
    {
      id: 3,
      number: "99.9%",
      label: "Uptime",
      description: "Reliable service you can count on"
    },
    {
      id: 4,
      number: "<2s",
      label: "Processing Time",
      description: "Lightning-fast AI enhancement"
    }
  ]

  const team = [
    {
      id: 1,
      name: "Sarah Chen",
      role: "AI Research Lead",
      description: "PhD in Computer Vision from Stanford. 8+ years developing cutting-edge image processing algorithms.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
        </svg>
      )
    },
    {
      id: 2,
      name: "Marcus Rodriguez",
      role: "Product Engineering",
      description: "Former Google engineer specializing in scalable ML infrastructure and real-time image processing.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
      )
    },
    {
      id: 3,
      name: "Emily Watson",
      role: "Design & UX Director",
      description: "Award-winning designer with 10+ years creating intuitive interfaces for complex AI technologies.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
        </svg>
      )
    }
  ]

  const values = [
    {
      id: 1,
      title: "Innovation First",
      description: "We push the boundaries of what's possible with AI, constantly researching and implementing the latest breakthroughs in computer vision and machine learning.",
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
        </svg>
      )
    },
    {
      id: 2,
      title: "Quality Obsessed",
      description: "Every pixel matters. We're committed to delivering professional-grade results that exceed expectations, maintaining the highest standards in image enhancement.",
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      )
    },
    {
      id: 3,
      title: "Customer Success",
      description: "Your success is our mission. We provide not just tools, but partnerships that help businesses transform their visual content and achieve their goals.",
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
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
          <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse delay-700"></div>
        </div>
        
        {/* Readability layer */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#2E1E6B] from-10% via-[#2E1E6B]/60 via-60% to-transparent"></div>
        
        <div className="relative z-10 min-h-screen container mx-auto flex flex-col items-center justify-center px-4 sm:px-6 py-8 sm:py-12 md:py-0">
          
          {/* Center Content */}
          <div className="w-full text-center flex flex-col items-center justify-center">
            {/* Main Heading */}
            <h1 className="text-[30px] sm:text-[36px] md:text-[48px] lg:text-[54px] mt-10 font-extrabold leading-tight sm:leading-snug mb-6 sm:mb-8 max-w-4xl">
              REVOLUTIONIZING{" "}
              <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
                PRODUCT
              </span>
              {" "}PHOTOGRAPHY<br />
              WITH{" "}
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 bg-clip-text text-transparent">
                AI PRECISION
              </span>
            </h1>

            {/* Subtext */}
            <div className="text-gray-200 text-base sm:text-lg md:text-xl leading-relaxed mb-8 sm:mb-10 max-w-3xl">
              <p>We're a team of AI researchers, engineers, and designers passionate about transforming</p>
              <p>how businesses showcase their products online.</p>
              <p>Our mission: Make professional-quality product photography accessible to everyone.</p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-12 sm:mb-16 w-full sm:w-auto">
              <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 sm:py-4 px-8 sm:px-10 
                                  uppercase tracking-wide shadow-lg 
                                  transform skew-x-[-12deg] transition-all duration-300 hover:scale-105 text-sm md:text-base w-full sm:w-auto">
                <span className="inline-block skew-x-[12deg]">JOIN OUR MISSION</span>
              </button>

              <button className="border border-purple-400 text-purple-200 font-bold py-3 sm:py-4 px-8 sm:px-10 
                                  uppercase tracking-wide 
                                  transform skew-x-[-12deg] transition-all duration-300 hover:scale-105 
                                  bg-transparent hover:border-purple-300 hover:text-white text-sm md:text-base w-full sm:w-auto">
                <span className="inline-block skew-x-[12deg]">VIEW OUR STORY</span>
              </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 max-w-4xl w-full mb-12">
              {stats.map((stat) => (
                <div 
                  key={stat.id}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 sm:p-6 transform transition-all duration-300 hover:scale-105 hover:bg-white/15 cursor-pointer"
                  onMouseEnter={() => setHoveredStat(stat.id)}
                  onMouseLeave={() => setHoveredStat(null)}
                >
                  <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-300 text-sm font-semibold mb-1">{stat.label}</div>
                  {hoveredStat === stat.id && (
                    <div className="text-gray-400 text-xs leading-relaxed animate-fadeIn">
                      {stat.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 md:p-12 relative overflow-hidden">
            
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full opacity-10 transform translate-x-16 -translate-y-16"></div>
            
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
              
              {/* Left Content */}
              <div className="w-full lg:w-1/2 text-center lg:text-left">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight text-white">
                  OUR{" "}
                  <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 bg-clip-text text-transparent">
                    STORY
                  </span>
                </h2>
                
                <div className="text-gray-200 text-base md:text-lg leading-relaxed space-y-6 max-w-2xl mx-auto lg:mx-0">
                  <p>
                    Founded in 2021 by a team of AI researchers from Stanford and MIT, we started with a simple observation: 
                    most businesses struggle to create professional product photography that converts customers.
                  </p>
                  
                  <p>
                    Traditional photography is expensive, time-consuming, and often inconsistent. 
                    We knew AI could solve this - but it needed to be accessible, reliable, and produce results that rival professional studios.
                  </p>
                  
                  <p>
                    Today, we've processed over 2 million images and helped thousands of businesses transform their visual content. 
                    Our AI doesn't just enhance images - it understands context, brand aesthetics, and market trends.
                  </p>
                  
                  <p>
                    Every day, we're pushing the boundaries of what's possible, making professional-quality product photography 
                    accessible to everyone from solo entrepreneurs to enterprise brands.
                  </p>
                </div>

                {/* Mission Statement */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mt-8">
                  <h4 className="text-white font-bold text-lg mb-3 flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                      </svg>
                    </div>
                    Our Mission
                  </h4>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    "To democratize professional product photography through AI, empowering every business 
                    to create stunning visuals that drive sales and build brand trust."
                  </p>
                </div>
              </div>

              {/* Right Visual */}
              <div className="w-full lg:w-1/2">
                <div className="relative bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl p-8 h-96 lg:h-[500px] flex items-center justify-center overflow-hidden">
                  
                  {/* Decorative elements */}
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute top-8 right-8 w-20 h-20 border-2 border-white/30 rounded-2xl transform rotate-12"></div>
                  <div className="absolute bottom-8 left-8 w-16 h-16 border-2 border-white/20 rounded-xl transform -rotate-12"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-white/30 rounded-full"></div>
                  
                  {/* Center Content */}
                  <div className="relative z-10 text-center text-white">
                    <div className="w-24 h-24 mx-auto mb-6">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                      </svg>
                    </div>
                    <div className="text-2xl font-bold mb-2">Since 2021</div>
                    <div className="text-sm opacity-90">Transforming Product Photography</div>
                  </div>
                  
                  {/* Floating elements */}
                  <div className="absolute top-16 left-16 w-3 h-3 bg-white/40 rounded-full animate-pulse"></div>
                  <div className="absolute bottom-20 right-20 w-2 h-2 bg-white/30 rounded-full animate-pulse delay-500"></div>
                  <div className="absolute top-32 right-12 w-4 h-4 bg-white/50 rounded-full animate-pulse delay-1000"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              OUR{" "}
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 bg-clip-text text-transparent">
                VALUES
              </span>
            </h2>
            <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto">
              The principles that guide everything we do and every decision we make
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value) => (
              <div key={value.id} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 text-center group hover:bg-white/15 transition-all duration-300 hover:scale-105">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white group-hover:rotate-6 group-hover:scale-110 transition-all duration-300">
                  {value.icon}
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-4">{value.title}</h3>
                <p className="text-gray-300 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              MEET THE{" "}
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 bg-clip-text text-transparent">
                TEAM
              </span>
            </h2>
            <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto">
              The brilliant minds behind our AI-powered image enhancement technology
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member) => (
              <div key={member.id} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 text-center group hover:bg-white/15 transition-all duration-300 hover:scale-105">
                
                {/* Avatar */}
                <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white group-hover:rotate-6 group-hover:scale-110 transition-all duration-300">
                  {member.icon}
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2">{member.name}</h3>
                <div className="text-purple-300 font-semibold mb-4">{member.role}</div>
                <p className="text-gray-300 text-sm leading-relaxed">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 md:p-12 text-center">
            
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
              CUTTING-EDGE{" "}
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 bg-clip-text text-transparent">
                TECHNOLOGY
              </span>
            </h3>
            
            <p className="text-gray-300 text-lg md:text-xl mb-12 max-w-3xl mx-auto">
              We leverage the latest advances in computer vision, machine learning, and neural networks 
              to deliver results that constantly push the boundaries of what's possible.
            </p>

            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                  </svg>
                </div>
                <h4 className="text-white font-bold text-lg mb-2">Deep Learning</h4>
                <p className="text-gray-300 text-sm">Advanced neural networks trained on millions of images</p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                </div>
                <h4 className="text-white font-bold text-lg mb-2">GPU Acceleration</h4>
                <p className="text-gray-300 text-sm">Lightning-fast processing with enterprise hardware</p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                </div>
                <h4 className="text-white font-bold text-lg mb-2">Computer Vision</h4>
                <p className="text-gray-300 text-sm">Intelligent scene understanding and object recognition</p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <h4 className="text-white font-bold text-lg mb-2">Quality Assurance</h4>
                <p className="text-gray-300 text-sm">Multi-layer validation ensures perfect results</p>
              </div>
            </div>

            <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 px-10
                               uppercase tracking-wide shadow-lg
                               transform skew-x-[-12deg] transition-all duration-300 hover:scale-105">
              <span className="inline-block skew-x-[12deg]">EXPLORE OUR TECH</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About