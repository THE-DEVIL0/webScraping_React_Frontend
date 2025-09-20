import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

const FreeTrialNotification = ({ daysLeft, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // Check if user has already dismissed the notification
    const notificationDismissed = localStorage.getItem('trialNotificationDismissed');
    if (notificationDismissed) {
      setIsVisible(false);
    }
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    localStorage.setItem('trialNotificationDismissed', 'true');
    
    // Wait for the animation to complete before hiding the component
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed top-4 right-4 z-50 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg shadow-xl border border-white/10 transform transition-all duration-300 ${
        isClosing ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'
      }`}
      style={{ backdropFilter: 'blur(10px)' }}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <h3 className="font-bold text-sm sm:text-base">🎉 Free Trial Activated</h3>
          <p className="text-xs sm:text-sm opacity-90">
            Your free trial will expire in {daysLeft} day{daysLeft !== 1 ? 's' : ''}. 
            <a 
              href="/payment" 
              className="font-semibold underline ml-1 hover:opacity-80"
              onClick={(e) => e.stopPropagation()}
            >
              Upgrade to Growth Plan
            </a>
          </p>
        </div>
        <button 
          onClick={handleClose}
          className="p-1 rounded-full hover:bg-white/20 transition-colors"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default FreeTrialNotification;
