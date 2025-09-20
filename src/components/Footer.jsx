import React from 'react'
import { Twitter, Facebook, Instagram, MapPin } from 'lucide-react'
import footer from '../../public/images/Footer.png'
import logo from '../../public/images/logo.png'

const Footer = () => {
  return (
    <div 
      className="relative bg-cover bg-center bg-no-repeat py-16 px-6 md:px-12"
      style={{ backgroundImage: `url(${footer})` }}
    >
      {/* Footer Content */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col text-white">
          
          {/* Logo, Description and Navigation Sections */}
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-12 gap-8 lg:gap-0">
            {/* Logo and Description Section */}
            <div className="w-full lg:w-1/3">
              <div className="flex items-center gap-3 mb-4">
                <img src={logo} alt="Pixellift Logo" className="w-8 h-8" />
                <h2 className="text-2xl font-bold">PIXELLIFT</h2>
              </div>
              <p className="text-sm leading-relaxed text-white/90 max-w-sm">
                A well-designed features header often incorporates clean icons, intuitive layouts, vibrant accents, and engaging visuals to showcase functionality and value with clarity.
              </p>
            </div>

            {/* Navigation Sections */}
            <div className="flex flex-col sm:flex-row lg:ml-40 gap-8 sm:gap-16 w-full lg:w-auto">
              {/* Company Section */}
              <div className="flex-1 sm:flex-none">
                <h3 className="text-lg font-semibold mb-4 text-white">COMPANY</h3>
                <ul className="space-y-3 text-sm">
                  <li><a href="#" className="text-white/90 hover:text-white transition-colors">Services</a></li>
                  <li><a href="#" className="text-white/90 hover:text-white transition-colors">Features</a></li>
                </ul>
              </div>

              {/* Help Section */}
              <div className="flex-1 sm:flex-none">
                <h3 className="text-lg font-semibold mb-4 text-white">HELP</h3>
                <ul className="space-y-3 text-sm">
                  <li><a href="#" className="text-white/90 hover:text-white transition-colors">About</a></li>
                  <li><a href="#" className="text-white/90 hover:text-white transition-colors">Contact Us</a></li>
                </ul>
              </div>

              {/* Resources Section */}
              <div className="flex-1 sm:flex-none">
                <h3 className="text-lg font-semibold mb-4 text-white">RESOURCES</h3>
                <ul className="space-y-3 text-sm">
                  <li><a href="#" className="text-white/90 hover:text-white transition-colors">Youtube Playlist</a></li>
                  <li><a href="#" className="text-white/90 hover:text-white transition-colors">Terms & Conditions</a></li>
                </ul>
              </div>
            </div>

            {/* Empty div to maintain spacing on desktop */}
            <div className="hidden lg:block lg:w-1/3"></div>
          </div>
        </div>

        {/* Bottom Section with Social Icons and Copyright */}
        <div className="pt-6 border-t border-white/20">
          
          {/* Social Icons and Copyright */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Social Icons */}
            <div className="flex items-center gap-4 order-2 sm:order-1">
              <div className="w-10 h-10 rounded-full flex items-center justify-center hover:opacity-80 transition-colors cursor-pointer"
                   style={{ backgroundColor: '#3023E1' }}>
                <Twitter className="w-5 h-5 text-white" />
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity">
                <Facebook className="w-5 h-5 text-white" />
              </div>
              <div className="w-10 h-10 rounded-full flex items-center justify-center hover:opacity-80 transition-colors cursor-pointer"
                   style={{ backgroundColor: '#3023E1' }}>
                <Instagram className="w-5 h-5 text-white" />
              </div>
              <div className="w-10 h-10 rounded-full flex items-center justify-center hover:opacity-80 transition-colors cursor-pointer"
                   style={{ backgroundColor: '#3023E1' }}>
                <MapPin className="w-5 h-5 text-white" />
              </div>
            </div>

            {/* Copyright */}
            <div className="text-sm text-white/80 order-1 sm:order-2">
              © Copyright 2023, All Rights Reserved by pixellift
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer