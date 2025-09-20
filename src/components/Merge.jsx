import React, { useState } from 'react';
import { Eye, Download, Image as ImageIcon, AlertCircle } from 'lucide-react';
import axios from 'axios';

const Merge = ({
  scrapedImages,
  generatedBackgrounds,
  addLog,
  toggleSelectAll,
  clearSelections,
  platform
}) => {
  const [foregroundImage, setForegroundImage] = useState('');
  const [backgroundImage, setBackgroundImage] = useState('');
  const [foregroundScale, setForegroundScale] = useState(1.0);
  const [backgroundScale, setBackgroundScale] = useState(1.0);
  const [positionX, setPositionX] = useState(0);
  const [positionY, setPositionY] = useState(0);
  const [previewMode, setPreviewMode] = useState(true);
  const [merging, setMerging] = useState(false);
  const [mergedImages, setMergedImages] = useState([]);
  const [endpointError, setEndpointError] = useState(false);
  const [imageAccessError, setImageAccessError] = useState('');

  // Validate image URLs with stricter timeout
  const validateImageUrl = async (url, type) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3-second timeout
      const response = await fetch(url, {
        method: 'HEAD',
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        addLog(`⚠️ Invalid ${type} image URL: ${url}. Status: ${response.status}. Ensure the image is accessible.`, 'warning');
        setImageAccessError(`Failed to access ${type} image: ${url}. Status: ${response.status}. Please select a different image or verify the URL.`);
        return false;
      }
      addLog(`ℹ️ Validated ${type} image URL: ${url}`, 'info');
      return true;
    } catch (error) {
      if (error.name === 'AbortError') {
        addLog(`⚠️ Timeout validating ${type} image URL: ${url}. Server took too long to respond.`, 'warning');
        setImageAccessError(`Timeout accessing ${type} image: ${url}. Please select a different image or check connectivity.`);
      } else {
        addLog(`⚠️ Error validating ${type} image URL: ${url}. ${error.message}`, 'warning');
        setImageAccessError(`Error accessing ${type} image: ${url}. ${error.message}. Please select a different image.`);
      }
      return false;
    }
  };

  // Handle image merging
  const mergeImages = async () => {
    if (!foregroundImage) {
      addLog('⚠️ Please select a foreground image', 'warning');
      return;
    }
    if (!backgroundImage) {
      addLog('⚠️ Please select a background image', 'warning');
      return;
    }

    // Validate image URLs
    setImageAccessError('');
    const isForegroundValid = await validateImageUrl(foregroundImage, 'foreground');
    const isBackgroundValid = await validateImageUrl(backgroundImage, 'background');
    if (!isForegroundValid || !isBackgroundValid) {
      addLog('❌ Cannot merge images due to invalid or inaccessible image URLs.', 'error');
      return;
    }

    setMerging(true);
    setEndpointError(false);
    const endpoint = 'http://127.0.0.1:8001/api/generation/merge';
    addLog(`ℹ️ Attempting to merge images using endpoint: ${endpoint}`, 'info');

    try {
      const requestPayload = {
        foreground_url: foregroundImage,
        background_url: backgroundImage,
        foreground_scale: parseFloat(foregroundScale),
        background_scale: parseFloat(backgroundScale),
        position_x: parseInt(positionX),
        position_y: parseInt(positionY),
        preview_mode: previewMode
      };

      addLog(`ℹ️ Sending payload: ${JSON.stringify(requestPayload)}`, 'info');
      const response = await axios.post(endpoint, requestPayload, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 300000 // 5 minute timeout
      });

      addLog(`ℹ️ API response: ${JSON.stringify(response.data)}`, 'info');

      if (response.data && response.data.status && response.data.merged_image) {
        const mergedImageUrl = response.data.merged_image;
        const isPreview = previewMode || mergedImageUrl.startsWith('data:image');

        addLog(`ℹ️ Merged image URL: ${mergedImageUrl}`, 'info');

        const newMergedImage = {
          id: `merged-${Date.now()}`,
          url: mergedImageUrl,
          name: `merged-${Date.now()}.png`,
          timestamp: new Date().toISOString(),
          isPreview
        };

        setMergedImages([newMergedImage, ...mergedImages]);
        addLog('✅ Image merged successfully!', 'success');
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      console.error('Error merging images:', error);
      if (error.response) {
        if (error.response.status === 404) {
          setEndpointError(true);
          addLog(`❌ API endpoint ${endpoint} not found. Verify in app/routers/generation.py or contact the backend team.`, 'error');
        } else if (error.response.status === 500) {
          const errorDetail = error.response.data.detail || 'Failed to merge images. Check backend logs for details.';
          addLog(`❌ Server error: ${errorDetail}`, 'error');
          if (errorDetail.includes('Failed to fetch one or both input images')) {
            setImageAccessError(`Failed to access input image(s): ${foregroundImage} or ${backgroundImage}. Please select different images or check server status.`);
          }
        } else if (error.response.status === 422) {
          addLog(`❌ Validation error: ${JSON.stringify(error.response.data.detail)}`, 'error');
        } else {
          addLog(`❌ Error merging images: ${error.message}`, 'error');
        }
      } else if (error.request) {
        addLog(`❌ No response from server. Ensure the backend is running on http://127.0.0.1:8001.`, 'error');
      } else {
        addLog(`❌ Error merging images: ${error.message}`, 'error');
      }
    } finally {
      setMerging(false);
    }
  };

  // Handle file upload for foreground or background image
  const handleFileUpload = (event, setImage) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImage(url);
      addLog(`ℹ️ Uploaded image: ${file.name}`, 'info');
      addLog('⚠️ Note: Uploaded images are for preview only. Use scraped or generated images for merging, as the backend requires URLs.', 'warning');
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-white">Image Merge</h3>
        <div className="flex space-x-2">
          <button
            onClick={toggleSelectAll}
            className="px-3 py-1.5 text-sm bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-colors"
          >
            {scrapedImages.length > 0 ? 'Select All' : 'Deselect All'}
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

      <div className="space-y-6">
        {endpointError && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 flex items-center">
            <AlertCircle className="w-5 h-5 text-red-300 mr-2" />
            <p className="text-red-300">
              The merge functionality is unavailable because the backend endpoint (/api/generation/merge) is not found. Please contact the backend team to verify the endpoint in app/routers/generation.py.
            </p>
          </div>
        )}
        {imageAccessError && (
          <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4 flex items-center">
            <AlertCircle className="w-5 h-5 text-yellow-300 mr-2" />
            <p className="text-yellow-300">{imageAccessError}</p>
          </div>
        )}

        <div className="bg-gray-900/50 p-6 rounded-xl border border-white/10">
          <h3 className="text-lg font-medium text-white mb-4">Merge Images</h3>
          <p className="text-gray-400 mb-6">Combine a foreground image with a background image using AI.</p>

          <div className="space-y-4">
            {/* Foreground Image Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Foreground Image</label>
              <div className="flex items-center space-x-2">
                <select
                  value={foregroundImage}
                  onChange={(e) => setForegroundImage(e.target.value)}
                  className="w-full bg-gray-800/50 border border-white/20 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select a foreground image</option>
                  {scrapedImages.map((img) => (
                    <option key={img.id} value={img.url}>
                      {img.name}
                    </option>
                  ))}
                </select>
                <label className="flex items-center justify-center px-4 py-2 bg-gray-800/50 border border-white/20 rounded-lg cursor-pointer hover:bg-gray-700/50">
                  <ImageIcon className="w-4 h-4 text-white mr-2" />
                  <span className="text-sm text-white">Upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, setForegroundImage)}
                  />
                </label>
              </div>
            </div>

            {/* Background Image Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Background Image</label>
              <div className="flex items-center space-x-2">
                <select
                  value={backgroundImage}
                  onChange={(e) => setBackgroundImage(e.target.value)}
                  className="w-full bg-gray-800/50 border border-white/20 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select a background image</option>
                  {generatedBackgrounds.map((bg) => (
                    <option key={bg.id} value={bg.url}>
                      {bg.name}
                    </option>
                  ))}
                </select>
                <label className="flex items-center justify-center px-4 py-2 bg-gray-800/50 border border-white/20 rounded-lg cursor-pointer hover:bg-gray-700/50">
                  <ImageIcon className="w-4 h-4 text-white mr-2" />
                  <span className="text-sm text-white">Upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, setBackgroundImage)}
                  />
                </label>
              </div>
            </div>

            {/* Foreground Scale */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Foreground Scale (0.5-2.0)</label>
              <input
                type="number"
                step="0.1"
                min="0.5"
                max="2.0"
                value={foregroundScale}
                onChange={(e) => setForegroundScale(Math.min(Math.max(parseFloat(e.target.value), 0.5), 2.0))}
                className="w-full bg-gray-800/50 border border-white/20 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., 1.0"
              />
            </div>

            {/* Background Scale */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Background Scale (0.8-1.5)</label>
              <input
                type="number"
                step="0.1"
                min="0.8"
                max="1.5"
                value={backgroundScale}
                onChange={(e) => setBackgroundScale(Math.min(Math.max(parseFloat(e.target.value), 0.8), 1.5))}
                className="w-full bg-gray-800/50 border border-white/20 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., 1.0"
              />
            </div>

            {/* Position X */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Position X (-200 to 200 pixels)</label>
              <input
                type="number"
                min="-200"
                max="200"
                value={positionX}
                onChange={(e) => setPositionX(Math.min(Math.max(parseInt(e.target.value), -200), 200))}
                className="w-full bg-gray-800/50 border border-white/20 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., 0 (center)"
              />
            </div>

            {/* Position Y */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Position Y (-200 to 200 pixels)</label>
              <input
                type="number"
                min="-200"
                max="200"
                value={positionY}
                onChange={(e) => setPositionY(Math.min(Math.max(parseInt(e.target.value), -200), 200))}
                className="w-full bg-gray-800/50 border border-white/20 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., 0 (center)"
              />
            </div>

            {/* Preview Mode */}
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={previewMode}
                  onChange={(e) => setPreviewMode(e.target.checked)}
                  className="form-checkbox bg-gray-800/50 border-white/20 text-purple-500 focus:ring-purple-500"
                />
                <span className="text-sm text-gray-300">Preview Mode (Base64)</span>
              </label>
            </div>
          </div>

          <div className="mt-8">
            <button
              onClick={mergeImages}
              disabled={merging || endpointError}
              className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                merging || endpointError
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
              }`}
            >
              {merging ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Merging...
                </span>
              ) : (
                <span>Merge Images</span>
              )}
            </button>
          </div>
        </div>

        {mergedImages.length > 0 && (
          <div className="bg-gray-900/50 p-6 rounded-xl border border-white/10">
            <h3 className="text-lg font-medium text-white mb-4">Merged Images</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {mergedImages.map((img) => (
                <div key={img.id} className="relative group">
                  <div className="bg-black/20 rounded-lg overflow-hidden border border-white/10">
                    <img
                      src={img.url}
                      alt={img.name}
                      className="w-full h-48 object-cover"
                      onError={() => addLog(`❌ Failed to load merged image: ${img.url}. Ensure the Cloudinary URL or base64 string is valid.`, 'error')}
                    />
                  </div>

                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                    <button
                      className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors"
                      onClick={() => window.open(img.url, '_blank')}
                      title="Preview"
                    >
                      <Eye className="w-4 h-4 text-white" />
                    </button>
                    {!img.isPreview && (
                      <button
                        className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors"
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = img.url;
                          link.download = img.name;
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        }}
                        title="Download"
                      >
                        <Download className="w-4 h-4 text-white" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Merge;