import React from 'react';
import { Download } from 'lucide-react';
import axios from 'axios';

const ImageOptimization = ({
  selectedImages,
  scrapedImages,
  processedImages = [],  // Add this prop
  optimizationOptions,
  setOptimizationOptions,
  optimizing,
  setOptimizing,
  optimizationResults,
  setOptimizationResults,
  optimizedImages,
  setOptimizedImages,
  addLog,
  toggleSelectAll,
  clearSelections,
  platform
}) => {
  // Toggle optimization option
  const toggleOptimizationOption = (option) => {
    setOptimizationOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
  };

  // Process image optimization
  const processOptimization = async (image) => {
    try {
      setOptimizing(true);
      setOptimizationResults({ original: null, optimized: null });

      // Use the image URL directly
      console.log(image)
      if (!image) {
        throw new Error('Selected image not found in scraped or processed images.');
      }
      const imageUrl = image.url;

      // Prepare payload with image_urls and all optimization options
      const requestPayload = {
        image_urls: [imageUrl],
        upscale: optimizationOptions.upscale,
        denoise: optimizationOptions.denoise,
        enhance_lighting: optimizationOptions.enhance_lighting
      };

      // Make the API call to optimize the image
      const response = await axios.post('http://127.0.0.1:8001/api/optimization/optimize', requestPayload, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 300000 // 5 minute timeout for long-running optimizations
      });

      // Process the response
      if (response.data && response.data.optimized && response.data.optimized.length > 0) {
        const optimizedUrl = response.data.optimized[0];

        // Store both original and optimized images for comparison
        setOptimizationResults({
          original: imageUrl,
          optimized: optimizedUrl
        });

        // Add to optimized images list
        setOptimizedImages(prev => [...prev, {
          id: `optimized-${Date.now()}`,
          original: imageUrl,
          optimized: optimizedUrl,
          timestamp: new Date().toISOString()
        }]);

        addLog('✅ Image optimization completed successfully!', 'success');
      } else {
        throw new Error('No optimized images returned from the server');
      }
    } catch (error) {
      console.error('Error optimizing image:', error);
      addLog(`❌ Error optimizing image: ${error.message}`, 'error');
    } finally {
      setOptimizing(false);
    }
  };

  const renderOptimizationSection = () => {
    return (
      <div className="space-y-6">
        <div className="bg-gray-900/50 p-6 rounded-xl border border-white/10">
          <h3 className="text-lg font-medium text-white mb-4">Image Optimization</h3>
          <p className="text-gray-400 mb-6">Enhance your product images with AI-powered optimization.</p>

          <div className="space-y-4">
            <div className="flex items-center justify-between bg-gray-800/50 p-4 rounded-lg">
              <div>
                <h4 className="font-medium text-white">Upscaling</h4>
                <p className="text-sm text-gray-400">Enhance image resolution up to 4K</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={optimizationOptions.upscale}
                  onChange={() => toggleOptimizationOption('upscale')}
                />
                <div className={`block w-11 h-6 rounded-full ${optimizationOptions.upscale ? 'bg-purple-500' : 'bg-gray-600'}`}></div>
                <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${optimizationOptions.upscale ? 'transform translate-x-4' : ''}`}></div>
              </label>
            </div>

            <div className="flex items-center justify-between bg-gray-800/50 p-4 rounded-lg">
              <div>
                <h4 className="font-medium text-white">Noise Reduction</h4>
                <p className="text-sm text-gray-400">Reduce image noise and artifacts</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={optimizationOptions.denoise}
                  onChange={() => toggleOptimizationOption('denoise')}
                />
                <div className={`block w-11 h-6 rounded-full ${optimizationOptions.denoise ? 'bg-purple-500' : 'bg-gray-600'}`}></div>
                <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${optimizationOptions.denoise ? 'transform translate-x-4' : ''}`}></div>
              </label>
            </div>

            <div className="flex items-center justify-between bg-gray-800/50 p-4 rounded-lg">
              <div>
                <h4 className="font-medium text-white">Lighting Enhancement</h4>
                <p className="text-sm text-gray-400">Improve brightness and contrast</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={optimizationOptions.enhance_lighting}
                  onChange={() => toggleOptimizationOption('enhance_lighting')}
                />
                <div className={`block w-11 h-6 rounded-full ${optimizationOptions.enhance_lighting ? 'bg-purple-500' : 'bg-gray-600'}`}></div>
                <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${optimizationOptions.enhance_lighting ? 'transform translate-x-4' : ''}`}></div>
              </label>
            </div>
          </div>

          <div className="mt-8">
            <button
              onClick={() =>{
                console.log(selectedImages);
                console.log(scrapedImages);
                console.log(processedImages);  // Add this for debugging
                const firstId = selectedImages[0];
                if (firstId) {
                  const image = scrapedImages.find(img => img.id === firstId) || processedImages.find(img => img.id === firstId);
                  selectedImages.length > 0 && processOptimization(image);
                }
              }}
              disabled={selectedImages.length === 0 || optimizing}
              className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                selectedImages.length === 0 || optimizing
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {optimizing ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Optimizing...
                </span>
              ) : (
                <span>Optimize Selected Image</span>
              )}
            </button>
          </div>
        </div>

        {/* Optimization Results */}
        {optimizationResults.original && (
          <div className="bg-gray-900/50 p-6 rounded-xl border border-white/10">
            <h3 className="text-lg font-medium text-white mb-4">Optimization Results</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">Original</h4>
                <div className="bg-black/20 rounded-lg overflow-hidden border border-white/10">
                  <img
                    src={optimizationResults.original}
                    alt="Original"
                    className="w-full h-auto max-h-80 object-contain mx-auto"
                  />
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">Optimized</h4>
                <div className="bg-black/20 rounded-lg overflow-hidden border border-white/10 relative">
                  <img
                    src={optimizationResults.optimized}
                    alt="Optimized"
                    className="w-full h-auto max-h-80 object-contain mx-auto"
                  />
                  {optimizing && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex space-x-3">
                  <a
                    href={optimizationResults.optimized}
                    download
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-center transition-colors"
                  >
                    <Download className="inline-block w-4 h-4 mr-2" />
                    Download
                  </a>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(optimizationResults.optimized);
                      addLog('✅ Optimized image URL copied to clipboard', 'success');
                    }}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                    Copy URL
                  </button>
                </div>
              </div>
            </div>

            {/* Optimization Details */}
            <div className="mt-6 pt-6 border-t border-white/10">
              <h4 className="text-sm font-medium text-gray-400 mb-3">Optimization Details</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-gray-800/50 p-3 rounded-lg">
                  <p className="text-xs text-gray-400">Upscaling</p>
                  <p className="text-sm font-medium text-white">
                    {optimizationOptions.upscale ? 'Enabled' : 'Disabled'}
                  </p>
                </div>
                <div className="bg-gray-800/50 p-3 rounded-lg">
                  <p className="text-xs text-gray-400">Noise Reduction</p>
                  <p className="text-sm font-medium text-white">
                    {optimizationOptions.denoise ? 'Enabled' : 'Disabled'}
                  </p>
                </div>
                <div className="bg-gray-800/50 p-3 rounded-lg">
                  <p className="text-xs text-gray-400">Lighting Enhancement</p>
                  <p className="text-sm font-medium text-white">
                    {optimizationOptions.enhance_lighting ? 'Enabled' : 'Disabled'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-white">Image Optimization</h3>
        <div className="flex space-x-2">
          <button
            onClick={toggleSelectAll}
            className="px-3 py-1.5 text-sm bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-colors"
          >
            {selectedImages.length === scrapedImages.length ? 'Deselect All' : 'Select All'}
          </button>
          <button
            onClick={clearSelections}
            className="px-3 py-1.5 text-sm bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-colors"
            disabled={selectedImages.length === 0}
          >
            Clear
          </button>
        </div>
      </div>

      {renderOptimizationSection()}
    </div>
  );
};

export default ImageOptimization;