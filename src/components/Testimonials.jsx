import React, { useState, useEffect } from 'react'
import User1 from '../../public/images/User1.png'
import User2 from '../../public/images/User2.png'

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  // Testimonials data
  const testimonials = [
    {
      id: 1,
      stars: 5,
      review: "One of the best features of this tool is how simple it makes enhancing images. It has helped me create quality product photos in seconds. The results are clear, polished, and have greatly improved the way my products look online.",
      name: "Arlene McCoy",
      company: "McDonald's",
      image: User1
    },
    {
      id: 2,
      stars: 5,
      review: "Another thing I love about this platform is the supportive community and resources behind it. The tips, tutorials, and shared experiences from other users have helped me learn faster and get the most out of every feature",
      name: "Kathryn Murphy",
      company: "General Electric",
      image: User2
    },
    {
      id: 3,
      stars: 5,
      review: "The AI-powered image enhancement has revolutionized our marketing campaigns. What used to take hours of editing now happens in minutes, and the quality is consistently exceptional. Our team productivity has increased dramatically.",
      name: "Robert Johnson",
      company: "Adobe Inc",
      image: User1
    },
    {
      id: 4,
      stars: 5,
      review: "I've tried many image editing tools, but this platform stands out for its intuitive interface and powerful features. The automated background removal and color correction have saved us countless hours of manual work.",
      name: "Sarah Williams",
      company: "Microsoft",
      image: User2
    },
    {
      id: 5,
      stars: 5,
      review: "The batch processing feature is a game-changer for our e-commerce business. We can now process hundreds of product images in minutes while maintaining professional quality standards. Absolutely recommended!",
      name: "Michael Brown",
      company: "Amazon",
      image: User1
    },
    {
      id: 6,
      stars: 5,
      review: "Customer support is outstanding and the learning curve is minimal. The real-time preview feature helps us make perfect adjustments before finalizing our images. This tool has become essential to our workflow.",
      name: "Emma Davis",
      company: "Google",
      image: User2
    }
  ]

  // Handle responsive breakpoints
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      // Reset index when switching between mobile/desktop to prevent out of bounds
      setCurrentIndex(0)
    }

    // Initial check
    handleResize()
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Calculate max index based on screen size
  const getMaxIndex = () => {
    return isMobile ? testimonials.length - 1 : Math.floor(testimonials.length / 2) - 1
  }

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const maxIndex = getMaxIndex()
        return prevIndex >= maxIndex ? 0 : prevIndex + 1
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [isMobile, testimonials.length])

  // Get current testimonials to display
  const getCurrentTestimonials = () => {
    if (isMobile) {
      return [testimonials[currentIndex]]
    } else {
      const startIndex = currentIndex * 2
      return [
        testimonials[startIndex],
        testimonials[startIndex + 1]
      ]
    }
  }

  // Calculate number of dots
  const getDotsCount = () => {
    return isMobile ? testimonials.length : Math.ceil(testimonials.length / 2)
  }

  const TestimonialCard = ({ testimonial }) => (
    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 h-96 md:h-96 relative overflow-visible">
      {/* Top Right Quote Marks - Half inside, half outside */}
      <div className="absolute -top-6 -right-3">
        <div className="flex gap-1">
          <div className="w-8 h-12 bg-gradient-to-b from-pink-500 to-purple-500 transform skew-x-12"></div>
          <div className="w-8 h-12 bg-gradient-to-b from-purple-500 to-blue-500 transform skew-x-12"></div>
        </div>
      </div>

      {/* 5 Stars */}
      <div className="flex gap-1 mb-6">
        {[...Array(testimonial.stars)].map((_, i) => (
          <svg key={i} className="w-6 h-6 text-white fill-current" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        ))}
      </div>

      {/* Review Text - Adjusted for mobile */}
      <p className="text-white text-lg leading-relaxed mb-6 md:mb-8 line-clamp-5 md:line-clamp-none">
        {testimonial.review}
      </p>

      {/* White Divider Line */}
      <hr className="border-white/30 mb-6" />

      {/* User Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img 
            src={testimonial.image} 
            alt={testimonial.name} 
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h4 className="text-white font-semibold text-lg">{testimonial.name}</h4>
            <p className="text-gray-300 text-sm">{testimonial.company}</p>
          </div>
        </div>
        
        {/* Verified Badge */}
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
            <defs>
              <linearGradient id={`grad${testimonial.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ec4899" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke={`url(#grad${testimonial.id})`} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill={`url(#grad${testimonial.id})`} fillOpacity="0.2"/>
          </svg>
          <span className="text-white text-sm font-medium">Verified</span>
        </div>
      </div>
    </div>
  )

  return (
    <div className="bg-gradient-to-br from-blue-900 via-purple-900 to-blue-800 py-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            CLIENT <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 bg-clip-text text-transparent">TESTIMONIALS</span>
          </h2>
        </div>

        {/* Testimonial Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {getCurrentTestimonials().map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center gap-3">
          {Array.from({ length: getDotsCount() }).map((_, index) => (
            <div 
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer ${
                index === currentIndex 
                  ? 'bg-gradient-to-r from-pink-500 to-purple-500' 
                  : 'bg-white/50 hover:bg-white/70'
              }`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Testimonials