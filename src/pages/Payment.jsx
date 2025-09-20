import React, { useState } from 'react';
import { Check, X, CreditCard, Lock, Shield, ArrowLeft } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Load Stripe with publishable key
const stripePromise = loadStripe('pk_test_51ReZ2wFZnb6rhAJYhVFgdZVFXMet0Cu1UH4zzP7rP9Fy307nI6FOt6tOnvypkGcPhLOQdkytzRQ2YDoXdH2QQBgp00d2aBYlmm');

// Payment Component (Updated with Stripe Elements)
const Payment = ({ selectedPlan, onBack }) => {
  const [formData, setFormData] = useState({
    email: '',
    billingAddress: '',
    city: '',
    zipCode: '',
    country: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const stripe = useStripe();
  const elements = useElements();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    try {
      // Calculate total amount in cents
      const totalAmount = Math.round(selectedPlan.price * 1.1 * 100); // price + 10% tax

      // Step 1: Create Payment Intent on backend
      const response = await fetch('http://localhost:5000/api/payment/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: totalAmount }),
      });

      const { clientSecret } = await response.json();

      if (!clientSecret) {
        throw new Error('Failed to create payment intent');
      }

      // Step 2: Confirm payment with Stripe
      const billingDetails = {
        email: formData.email,
        name: formData.email.split('@')[0], // Fallback name
        address: {
          line1: formData.billingAddress,
          city: formData.city,
          postal_code: formData.zipCode,
          country: formData.country,
        },
      };

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: billingDetails,
        },
      });

      if (stripeError) {
        setError(stripeError.message);
        return;
      }

      // Step 3: Record payment in backend
      const res2 = await fetch('http://localhost:5000/api/payment/record-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          planName: selectedPlan.name,
          planPrice: selectedPlan.price,
          paymentIntentId: paymentIntent.id,
          billingAddress: billingDetails.address,
        }),
      });
      const newRes = await res2.json();
      console.log(newRes.user);
      const user = await JSON.stringify(newRes.user);
      localStorage.setItem("user", user);
      setSuccess(true);
      console.log('Payment successful:', paymentIntent);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-blue-800 flex items-center justify-center">
        <div className="text-center text-white">
          <Check className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Payment Successful!</h2>
          <p className="text-gray-300">Welcome to the {selectedPlan.name} plan.</p>
          <button onClick={onBack} className="mt-4 bg-purple-500 px-6 py-2 rounded-lg">Back to Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-blue-800">
      <div className="relative min-h-screen w-full overflow-hidden text-white">
        <div className="absolute inset-0 bg-[#0A0A0A]"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-10 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#2E1E6B] from-10% via-[#2E1E6B]/60 via-60% to-transparent"></div>

        <div className="relative z-10 container mx-auto px-4 py-20">
          <button onClick={onBack} className="flex items-center gap-2 text-white mb-8 hover:text-purple-300 transition-colors">
            <ArrowLeft size={20} />
            <span>Back to Pricing</span>
          </button>

          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                COMPLETE YOUR{" "}
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 bg-clip-text text-transparent">
                  PURCHASE
                </span>
              </h2>
              <p className="text-gray-300 text-lg">
                You've selected the <span className="text-purple-300 font-semibold">{selectedPlan.name}</span> plan
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-6 sticky top-20">
                  <h3 className="text-xl font-bold mb-6 text-white">Order Summary</h3>
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">{selectedPlan.name} Plan</span>
                      <span className="text-white font-bold">${selectedPlan.price}/mo</span>
                    </div>
                    <div className="border-t border-white/10 pt-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-300">Subtotal</span>
                        <span className="text-white">${selectedPlan.price}</span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-300">Tax (10%)</span>
                        <span className="text-white">${(selectedPlan.price * 0.1).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center text-lg font-bold border-t border-white/10 pt-4">
                        <span className="text-white">Total</span>
                        <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                          ${(selectedPlan.price * 1.1).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-purple-300 mb-3">Included Features:</h4>
                    {selectedPlan.features.slice(0, 4).map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-400" />
                        <span className="text-sm text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 pt-6 border-t border-white/10">
                    <div className="flex items-center justify-center gap-4 text-gray-400">
                      <Shield className="w-5 h-5" />
                      <span className="text-xs">Secure Checkout</span>
                      <Lock className="w-5 h-5" />
                      <span className="text-xs">SSL Encrypted</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && <div className="bg-red-500/20 border border-red-500 text-red-300 p-4 rounded-xl">{error}</div>}

                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-6">
                    <h3 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <span className="text-sm font-bold">1</span>
                      </div>
                      Contact Information
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-gray-300 text-sm mb-2">Email Address</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 transition-colors"
                          placeholder="your@email.com"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-6">
                    <h3 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <span className="text-sm font-bold">2</span>
                      </div>
                      Payment Details
                    </h3>
                    <div className="space-y-4">
                      <div className="relative">
                        <label className="block text-gray-300 text-sm mb-2">Card Information</label>
                        <CardElement
                          options={{
                            style: {
                              base: {
                                color: '#ffffff',
                                fontSize: '16px',
                                '::placeholder': { color: '#9ca3af' },
                              },
                              invalid: { color: '#f87171' },
                            },
                          }}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
                        />
                        <CreditCard className="absolute left-3 top-9 w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-6">
                    <h3 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <span className="text-sm font-bold">3</span>
                      </div>
                      Billing Address
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-gray-300 text-sm mb-2">Street Address</label>
                        <input
                          type="text"
                          name="billingAddress"
                          value={formData.billingAddress}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 transition-colors"
                          placeholder="123 Main Street"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-gray-300 text-sm mb-2">City</label>
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 transition-colors"
                            placeholder="New York"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-gray-300 text-sm mb-2">ZIP Code</label>
                          <input
                            type="text"
                            name="zipCode"
                            value={formData.zipCode}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 transition-colors"
                            placeholder="10001"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-gray-300 text-sm mb-2">Country</label>
                        <select
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 transition-colors"
                          required
                        >
                          <option value="">Select Country</option>
                          <option value="US">United States</option>
                          <option value="CA">Canada</option>
                          <option value="UK">United Kingdom</option>
                          <option value="AU">Australia</option>
                          <option value="DE">Germany</option>
                          <option value="FR">France</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={!stripe || loading}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 px-8
                             uppercase tracking-wide shadow-lg
                             transform -skew-x-12 transition-all duration-300 hover:scale-105 disabled:opacity-50"
                  >
                    <span className="inline-block skew-x-12">
                      {loading ? 'Processing...' : `Complete Payment $${(selectedPlan.price * 1.1).toFixed(2)}`}
                    </span>
                  </button>

                  <p className="text-center text-gray-400 text-sm mt-4">
                    By completing this purchase you agree to our Terms of Service and Privacy Policy
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Wrapper for Payment to use Elements
const PaymentWithElements = (props) => (
  <Elements stripe={stripePromise}>
    <Payment {...props} />
  </Elements>
);

// Main Pricing Component (Updated)
const PricingSection = () => {
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const pricingPlans = [
    {
      id: 1,
      name: 'Free Trial',
      price: 0,
      description: 'Test-drive the platform before subscribing',
      popular: false,
      gradient: 'from-green-400 to-teal-400',
      features: [
        '100 Image scrapes total',
        'Background removal for 50 images',
        'Preset backgrounds: White & Lifestyle only',
        'Downloads in JPEG / WebP',
        'No bulk upload / limited features'
      ],
      notIncluded: [
        'Unlimited scrapes',
        'Bulk CSV upload',
        'Advanced enhancements',
        'Cloud storage'
      ]
    },
    {
      id: 2,
      name: 'Starter',
      price: 29,
      description: 'For solo sellers testing a few products',
      popular: false,
      gradient: 'from-blue-500 to-purple-500',
      features: [
        '100 Image scrapes / month',
        'URL input (up to 10 URLs)',
        'Standard enhancements (resize, sharpen, lighting fix)',
        'Background removal + White & Lifestyle presets',
        'Marketplace presets: Amazon, eBay, Shopify'
      ],
      notIncluded: [
        'Unlimited scrapes',
        'CSV bulk upload',
        'Priority support',
        'Cloud storage'
      ]
    },
    {
      id: 3,
      name: 'Growth',
      price: 149,
      description: 'For sellers scaling their catalog',
      popular: true,
      gradient: 'from-purple-500 to-pink-500',
      features: [
        'Unlimited image scrapes',
        '100 URLs / month',
        'Bulk upload via CSV (500 images in one go)',
        'Advanced enhancements + lifestyle / studio scenes',
        'Marketplace-ready exports (Amazon, eBay, Shopify)',
        'Cloud storage with 30-day history',
        'Priority email & chat support'
      ],
      notIncluded: [
        'AI scene suggestions',
        'Scheduled auto-updates',
        'Admin dashboard'
      ]
    },
    {
      id: 4,
      name: 'Enterprise',
      price: 299,
      description: 'For agencies & large teams needing automation & AI',
      popular: false,
      gradient: 'from-pink-500 to-purple-600',
      features: [
        'Unlimited URLs',
        'Unlimited image scrapes',
        'Complete image enhancements (resize, sharpen, lighting, BG)',
        'AI scene suggestions (smart backgrounds)',
        'Bulk processing: CSV up to 5 000+ images',
        'Scheduled auto-updates (daily / weekly)',
        'Admin dashboard for job tracking',
        'Premium & priority support'
      ],
      notIncluded: []
    }
  ];

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    setShowPayment(true);
  };

  if (showPayment && selectedPlan) {
    return <PaymentWithElements selectedPlan={selectedPlan} onBack={() => setShowPayment(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-blue-800">
      <section className="relative min-h-screen w-full overflow-hidden text-white py-20">
        <div className="absolute inset-0 bg-[#0A0A0A]"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-10 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#2E1E6B] from-10% via-[#2E1E6B]/60 via-60% to-transparent"></div>

        <div className="relative mt-20 z-10 container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              CHOOSE YOUR{" "}
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 bg-clip-text text-transparent">
                PERFECT PLAN
              </span>
            </h2>
            <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto">
              Transform your product images with AI-powered automation. No contracts, cancel anytime.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {pricingPlans.map((plan) => (
              <div key={plan.id} className={`relative group ${plan.popular ? 'lg:scale-105' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
                      Most Popular
                    </div>
                  </div>
                )}

                <div className={`bg-white/10 backdrop-blur-sm border ${plan.popular ? 'border-purple-400' : 'border-white/20'} rounded-3xl p-6 relative overflow-hidden h-full group-hover:bg-white/15 transition-all duration-500`}>
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${plan.gradient} rounded-full opacity-10 transform translate-x-16 -translate-y-16 group-hover:scale-150 transition-all duration-700`}></div>

                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                    <p className="text-gray-300 text-xs mb-4">{plan.description}</p>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-gray-400">$</span>
                      <span className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        {plan.price}
                      </span>
                      <span className="text-gray-400 text-sm">/mo</span>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-r from-green-400 to-teal-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </div>
                    ))}
                    {plan.notIncluded.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3 opacity-50">
                        <div className="w-5 h-5 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <X className="w-3 h-3 text-gray-400" />
                        </div>
                        <span className="text-gray-500 text-sm line-through">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => handleSelectPlan(plan)}
                    className={`w-full ${plan.popular
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                        : 'bg-white/10 border border-purple-400 hover:bg-white/20'
                      } text-white font-bold py-3 px-6
                    uppercase tracking-wide shadow-lg
                    transform -skew-x-12 transition-all duration-300 hover:scale-105`}
                  >
                    <span className="inline-block skew-x-12 text-sm">
                      {plan.popular ? 'Get Started' : 'Select Plan'}
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-20 text-center">
            <div className="flex flex-wrap items-center justify-center gap-8 mb-8">
              <div className="flex items-center gap-2 text-gray-300">
                <Shield className="w-5 h-5 text-green-400" />
                <span className="text-sm">30-Day Money Back Guarantee</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Lock className="w-5 h-5 text-blue-400" />
                <span className="text-sm">Secure Payment Processing</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <CreditCard className="w-5 h-5 text-purple-400" />
                <span className="text-sm">All Major Cards Accepted</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              Questions? Contact our sales team at{" "}
              <a href="mailto:sales@tritanium.ai" className="text-purple-300 hover:text-purple-200 transition-colors">
                sales@devrollins.com
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PricingSection;