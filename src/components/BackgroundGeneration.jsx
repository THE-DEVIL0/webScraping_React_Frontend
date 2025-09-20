import React from 'react';
import { Eye, Download } from 'lucide-react';
import axios from 'axios';

const BackgroundGeneration = ({
  backgroundPrompt,
  setBackgroundPrompt,
  negativePrompt,
  setNegativePrompt,
  numImages,
  setNumImages,
  imageSize,
  setImageSize,
  quality,
  setQuality,
  generatingBackground,
  setGeneratingBackground,
  generatedBackgrounds,
  setGeneratedBackgrounds,
  addLog,
  scrapedImages,
  toggleSelectAll,
  clearSelections
}) => {
  // Generate background images
  const generateBackgrounds = async () => {
    if (!backgroundPrompt.trim()) {
      addLog('⚠️ Please enter a valid prompt', 'warning');
      return;
    }

    setGeneratingBackground(true);

    try {
      const requestPayload = {
        prompt: backgroundPrompt,
        negative_prompt: negativePrompt || null,
        num_images: numImages,
        size: imageSize,
        quality: quality
      };

      addLog('🎨 Generating backgrounds...', 'info');
      const response = await axios.post('http://127.0.0.1:8001/api/generation/generate', requestPayload, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 300000 // 5 minute timeout
      });

      // Log the raw response for debugging
      addLog(`ℹ️ API response: ${JSON.stringify(response.data)}`, 'info');

      if (response.data && Array.isArray(response.data.images)) {
        if (response.data.images.length === 0) {
          addLog('⚠️ No images generated. Check backend logs for errors.', 'warning');
          return;
        }

        const newBackgrounds = response.data.images.map((imgUrl, index) => ({
          id: `bg-${Date.now()}-${index}`,
          url: imgUrl,
          name: `generated-bg-${index + 1}.jpg`, // Changed to .jpg to match backend
          timestamp: new Date().toISOString()
        }));

        setGeneratedBackgrounds(newBackgrounds);
        addLog(`✅ Generated ${newBackgrounds.length} background images!`, 'success');
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      console.error('Error generating backgrounds:', error);
      if (error.response) {
        if (error.response.status === 404) {
          addLog('❌ API endpoint /api/generation/generate not found. Please check backend configuration.', 'error');
        } else if (error.response.status === 500) {
          addLog(`❌ Server error: ${error.response.data.detail || 'Failed to generate backgrounds. Check backend logs.'}`, 'error');
        } else {
          addLog(`❌ Error generating backgrounds: ${error.message}`, 'error');
        }
      } else if (error.request) {
        addLog('❌ No response from server. Ensure the backend is running on http://127.0.0.1:8001.', 'error');
      } else {
        addLog(`❌ Error generating backgrounds: ${error.message}`, 'error');
      }
    } finally {
      setGeneratingBackground(false);
    }
  };

  const renderBackgroundGenerationSection = () => {
    return (
      <div className="space-y-6">
        <div className="bg-gray-900/50 p-6 rounded-xl border border-white/10">
          <h3 className="text-lg font-medium text-white mb-4">AI Background Generation</h3>
          <p className="text-gray-400 mb-6">Generate custom backgrounds for your product images using AI.</p>
          
          <div className="space-y-4">
            {/* Prompt Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Prompt</label>
              <textarea
                value={backgroundPrompt}
                onChange={(e) => setBackgroundPrompt(e.target.value)}
                placeholder="Describe the background you want to generate (e.g., 'studio product background, soft light')..."
                className="w-full bg-gray-800/50 border border-white/20 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                rows={3}
              />
            </div>
            
            {/* Negative Prompt Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Negative Prompt (Optional)</label>
              <textarea
                value={negativePrompt}
                onChange={(e) => setNegativePrompt(e.target.value)}
                placeholder="What to exclude from the generated images (e.g., 'blurry, dark, cluttered')..."
                className="w-full bg-gray-800/50 border border-white/20 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                rows={2}
              />
            </div>
            
            {/* Number of Images */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Number of Images</label>
              <select
                value={numImages}
                onChange={(e) => setNumImages(parseInt(e.target.value))}
                className="w-full bg-gray-800/50 border border-white/20 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value={1}>1 Image</option>
                <option value={2}>2 Images</option>
                <option value={4}>4 Images</option>
                <option value={8}>8 Images</option>
              </select>
            </div>
            
            {/* Image Size */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Image Size</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setImageSize('1024x1024')}
                  className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    imageSize === '1024x1024'
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                  }`}
                >
                  1024x1024
                </button>
                <button
                  onClick={() => setImageSize('1152x896')}
                  className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    imageSize === '1152x896'
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                  }`}
                >
                  1152x896
                </button>
                <button
                  onClick={() => setImageSize('896x1152')}
                  className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    imageSize === '896x1152'
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                  }`}
                >
                  896x1152
                </button>
              </div>
            </div>
            
            {/* Quality Option */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Quality</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setQuality('standard')}
                  className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    quality === 'standard'
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                  }`}
                >
                  Standard
                </button>
                <button
                  onClick={() => setQuality('hd')}
                  className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    quality === 'hd'
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                  }`}
                >
                  HD
                </button>
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <button
              onClick={generateBackgrounds}
              disabled={generatingBackground}
              className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                generatingBackground
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
              }`}
            >
              {generatingBackground ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </span>
              ) : (
                <span>Generate Background</span>
              )}
            </button>
          </div>
        </div>
        
        {generatedBackgrounds.length > 0 && (
          <div className="bg-gray-900/50 p-6 rounded-xl border border-white/10">
            <h3 className="text-lg font-medium text-white mb-4">Generated Backgrounds</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {generatedBackgrounds.map((bg) => (
                <div key={bg.id} className="relative group">
                  <div className="bg-black/20 rounded-lg overflow-hidden border border-white/10">
                    <img 
                      src={bg.url} 
                      alt={bg.name} 
                      className="w-full h-48 object-cover"
                      onError={() => addLog(`❌ Failed to load image: ${bg.url}. Ensure the Cloudinary URL is accessible.`, 'error')}
                    />
                  </div>
                  
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                    <button 
                      className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors"
                      onClick={() => window.open(bg.url, '_blank')}
                      title="Preview"
                    >
                      <Eye className="w-4 h-4 text-white" />
                    </button>
                    <button 
                      className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors"
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = bg.url;
                        link.download = bg.name;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }}
                      title="Download"
                    >
                      <Download className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-white">Background Generation</h3>
        <div className="flex space-x-2">
          <button
            onClick={toggleSelectAll}
            className="px-3 py-1.5 text-sm bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-colors"
          >
            {scrapedImages.length > 0 ? (scrapedImages.length === scrapedImages.length ? 'Deselect All' : 'Select All') : 'Select All'}
          </button>
          <button
            onClick={clearSelections}
            className="px-3 py-1.5 text-sm bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-colors"
            disabled={scrapedImages.length === 0}
          >
            Clear
          </button>
        </div>
      </div>
      
      {renderBackgroundGenerationSection()}
    </div>
  );
};

export default BackgroundGeneration;