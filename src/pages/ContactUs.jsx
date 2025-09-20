import React, { useState } from 'react'

const ContactUs = () => {
  const [status, setStatus] = useState(null) // "success" | "error" | null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus(null)

    const form = e.target
    const formData = new FormData(form)

    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: formData,
        headers: {
          Accept: 'application/json',
        },
      })

      if (response.ok) {
        setStatus('success')
        form.reset()
      } else {
        setStatus('error')
      }
    } catch (err) {
      setStatus('error')
    }

    setTimeout(() => setStatus(null), 4000) // Hide popup after 4s
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-blue-800 relative">
      {/* Popup Toast */}
      {status && (
        <div
          className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-2xl shadow-lg backdrop-blur-md border transition-all duration-500 ${
            status === 'success'
              ? 'bg-green-600/80 border-green-400 text-white'
              : 'bg-red-600/80 border-red-400 text-white'
          }`}
        >
          {status === 'success'
            ? 'Your message has been sent successfully!'
            : ' Oops! Something went wrong. Please try again.'}
        </div>
      )}

      {/* Hero Section */}
      <section className="relative min-h-screen w-full overflow-hidden text-white pt-16 sm:pt-20 md:pt-24">
        {/* Base solid background */}
        <div className="absolute inset-0 bg-[#0A0A0A]"></div>

        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-10 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
        </div>

        {/* Readability layer */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#2E1E6B] from-10% via-[#2E1E6B]/60 via-60% to-transparent"></div>

        <div className="relative z-10 min-h-screen container mx-auto flex flex-col md:flex-row items-center justify-center px-4 sm:px-6 py-8 sm:py-12 md:py-0">
          <div className="w-full text-center flex flex-col items-center justify-center">
            {/* Main Heading */}
            <h1 className="text-[30px] sm:text-[36px] md:text-[48px] lg:text-[54px] mt-10 font-extrabold leading-tight sm:leading-snug mb-6 sm:mb-8 max-w-4xl">
              LET'S{" "}
              <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
                CONNECT
              </span>{" "}
              AND
              <br />
              CREATE SOMETHING{" "}
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 bg-clip-text text-transparent">
                AMAZING
              </span>
            </h1>

            {/* Subtext */}
            <div className="text-gray-200 text-base sm:text-lg md:text-xl leading-relaxed mb-8 sm:mb-10 max-w-2xl">
              <p>Ready to transform your images with cutting-edge AI?</p>
              <p>We're here to answer your questions and help you get started.</p>
              <p>Your journey to stunning visuals begins with a simple conversation.</p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-12 sm:mb-16 w-full sm:w-auto">
              <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 sm:py-4 px-8 sm:px-10 uppercase tracking-wide shadow-lg transform skew-x-[-12deg] transition-all duration-300 hover:scale-105 text-sm md:text-base w-full sm:w-auto">
                <span className="inline-block skew-x-[12deg]">START CONVERSATION</span>
              </button>
              <button className="border border-purple-400 text-purple-200 font-bold py-3 sm:py-4 px-8 sm:px-10 uppercase tracking-wide transform skew-x-[-12deg] transition-all duration-300 hover:scale-105 bg-transparent hover:border-purple-300 hover:text-white text-sm md:text-base w-full sm:w-auto">
                <span className="inline-block skew-x-[12deg]">BOOK A DEMO</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-6 md:p-8 lg:p-12 relative overflow-visible">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-center">
              {/* Left Content */}
              <div className="w-full lg:w-1/2 text-center lg:text-left">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight text-white">
                  SEND US A{" "}
                  <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 bg-clip-text text-transparent">
                    MESSAGE
                  </span>
                </h2>

                <p className="text-gray-200 text-sm sm:text-base md:text-lg mb-8 leading-relaxed max-w-md mx-auto lg:mx-0">
                  Have specific questions about our AI-powered tools? Need technical support? Want to discuss enterprise solutions? Fill out the form and we'll get back to you promptly.
                </p>
              </div>

              {/* Right Form */}
              <div className="w-full lg:w-1/2">
                <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-3xl p-6 sm:p-8">
                  <form method="POST" action="https://formspree.io/f/xldweqgl" onSubmit={handleSubmit} className="space-y-6">
                    <input type="text" name="name" placeholder="Your Name" className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-300 focus:outline-none focus:border-purple-400 focus:bg-white/15 transition-all duration-300" required />
                    <input type="email" name="email" placeholder="Your Email" className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-300 focus:outline-none focus:border-purple-400 focus:bg-white/15 transition-all duration-300" required />
                    <input type="text" name="subject" placeholder="Subject" className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-300 focus:outline-none focus:border-purple-400 focus:bg-white/15 transition-all duration-300" required />
                    <textarea name="message" placeholder="Your Message" rows="5" className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-300 focus:outline-none focus:border-purple-400 focus:bg-white/15 transition-all duration-300 resize-none" required></textarea>
                    <div className="flex justify-center lg:justify-start">
                      <button type="submit" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-8 uppercase tracking-wide shadow-lg transform skew-x-[-12deg] transition-all duration-300 hover:scale-105">
                        <span className="inline-block skew-x-[12deg]">SEND MESSAGE</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section (unchanged) */}
      <section className="py-20 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              FREQUENTLY ASKED{" "}
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 bg-clip-text text-transparent">QUESTIONS</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
              <h4 className="text-white font-bold text-lg mb-3">How fast is the image enhancement?</h4>
              <p className="text-gray-300 text-sm leading-relaxed">Our AI-powered enhancement typically processes images in seconds, delivering professional results instantly.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
              <h4 className="text-white font-bold text-lg mb-3">What image formats do you support?</h4>
              <p className="text-gray-300 text-sm leading-relaxed">We support all major formats including JPG, PNG, WEBP, and more. Maximum file size is 50MB.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
              <h4 className="text-white font-bold text-lg mb-3">Is there a free trial available?</h4>
              <p className="text-gray-300 text-sm leading-relaxed">Yes! You can enhance up to 10 images for free to experience our powerful AI enhancement tools.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
              <h4 className="text-white font-bold text-lg mb-3">Do you offer bulk processing?</h4>
              <p className="text-gray-300 text-sm leading-relaxed">Absolutely! Our batch processing feature can handle hundreds of images while maintaining quality.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ContactUs
