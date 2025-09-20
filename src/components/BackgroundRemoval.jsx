import React, { useState, useEffect } from 'react';
import { Download, Layers, AlertCircle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const BackgroundRemoval = ({
  selectedImages = [],
  scrapedImages = [],
  setScrapedImages = () => { },
  setSelectedImages = () => { },
  platform = '',
  whiteBackground = false,
  setWhiteBackground = () => { },
  processing = false,
  setProcessing = () => { },
  processedImages = [],
  setProcessedImages = () => { },
  toggleSelectAll = () => { },
  clearSelections = () => { },
  addLog
}) => {
  const [error, setError] = useState('');
  const [selectedProcessedImages, setSelectedProcessedImages] = useState([]);




  const log = (message, type = 'info') => {
    if (typeof addLog === 'function') {
      addLog(message, type);
    } else {
      console.log(`[${type.toUpperCase()}] ${message}`);
    }
  };

  const downloadProcessedImages = async () => {
    if (selectedProcessedImages.length === 0) {
      log("⚠️ No processed images selected for download.", "warning");
      return;
    }

    try {
      log(`⬇️ Preparing to download ${selectedProcessedImages.length} processed images...`, "info");

      const filesToDownload = selectedProcessedImages.map((id) => {
        const img = processedImages.find((img) => img.id === id);
        return { url: img.url, filename: img.fileName };
      });

      // Try ZIP download
      const response = await fetch("http://127.0.0.1:8001/api/scrapers/download-zip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          files: filesToDownload,
          platform: platform.toLowerCase() || "background-removal",
        }),
      });

      if (!response.ok) throw new Error("ZIP download failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `${platform || "processed"}-images-${new Date().toISOString().slice(0, 10)}.zip`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      log("✅ ZIP file download started!", "success");
    } catch (err) {
      log("⚠️ ZIP failed, falling back to individual downloads", "warning", { err });

      selectedProcessedImages.forEach((id) => {
        const img = processedImages.find((img) => img.id === id);
        if (img) {
          const link = document.createElement("a");
          link.href = img.url;
          link.download = img.fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      });

      log("✅ Individual downloads started!", "success");
    }
  };

  const validateImageUrl = (url, type = 'processed', retries = 2) => {
    return new Promise((resolve) => {
      const attemptValidation = (attempt) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          log(`✅ Validated ${type} image URL: ${url} (Attempt ${attempt + 1})`, 'info');
          resolve(true);
        };
        img.onerror = () => {
          if (attempt < retries) {
            log(`⚠️ Retrying ${type} image URL: ${url} (Attempt ${attempt + 1} of ${retries})`, 'warning');
            setTimeout(() => attemptValidation(attempt + 1), 2000);
          } else {
            log(`⚠️ Error validating ${type} image URL: ${url}. Image failed to load after ${retries} attempts.`, 'warning');
            resolve(false);
          }
        };
        img.src = url + '?t=' + new Date().getTime();
        setTimeout(() => {
          if (img.complete) return;
          if (attempt < retries) {
            log(`⚠️ Retrying ${type} image URL: ${url} due to timeout (Attempt ${attempt + 1} of ${retries})`, 'warning');
            setTimeout(() => attemptValidation(attempt + 1), 2000);
          } else {
            log(`⚠️ Timeout validating ${type} image URL: ${url} after ${retries} attempts.`, 'warning');
            resolve(false);
          }
        }, 20000);
      };
      attemptValidation(0);
    });
  };

  const processBackgroundRemoval = async () => {
    if (selectedImages.length === 0) {
      setError('No images selected for background removal.');
      log('⚠️ No images selected for background removal.', 'warning');
      return;
    }

    setProcessing(true);
    setError('');
    log('ℹ️ Starting background removal process...', 'info');

    try {
      // Resolve IDs -> URLs
      let imageUrls = selectedImages;
      log(`🔎 Selected image IDs: ${JSON.stringify(selectedImages)}`, 'info');
      log(`📦 Available scraped images: ${JSON.stringify(scrapedImages.map(img => ({ id: img.id, url: img.url })))}`, 'info');

      imageUrls = imageUrls
        .map(id => scrapedImages.find(img => img.id === id)?.url)
        .filter(url => url);

      if (imageUrls.length === 0) {
        throw new Error('No valid images found for selected IDs.');
      }
      log(`✅ Resolved input URLs: ${JSON.stringify(imageUrls)}`, 'info');

      // Validate inputs
      const validationResults = await Promise.all(
        imageUrls.map(url => validateImageUrl(url, 'input'))
      );
      const validImageUrls = imageUrls.filter((_, i) => validationResults[i]);

      log(`🟢 Valid input URLs: ${JSON.stringify(validImageUrls)}`, 'info');
      log(`🔴 Invalid input URLs: ${JSON.stringify(imageUrls.filter((_, i) => !validationResults[i]))}`, 'info');

      if (validImageUrls.length === 0) {
        throw new Error('All selected images are inaccessible.');
      }

      // Send to API
      const payload = {
        image_urls: validImageUrls,
        add_white_bg: whiteBackground,
      };

      log(`ℹ️ Sending background removal request for ${validImageUrls.length} images`, 'info');
      log(`📤 API request payload: ${JSON.stringify(payload)}`, 'info');

      const apiResponse = await fetch('http://127.0.0.1:8001/api/background/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      log(`📥 API Response Status: ${apiResponse.status}`, 'info');

      if (!apiResponse.ok) {
        const errorData = await apiResponse.json();
        throw new Error(`API Error: ${JSON.stringify(errorData)}`);
      }

      const result = await apiResponse.json();
      log(`📥 API Response Body: ${JSON.stringify(result)}`, 'info');

      // Validate processed results
      if (result.successful > 0 && result.results && result.results.length > 0) {
        const processedValidationResults = await Promise.all(
          result.results.map(url => validateImageUrl(url, 'processed'))
        );

        const validProcessedUrls = result.results.filter((_, i) => processedValidationResults[i]);
        log(`🟢 Valid processed URLs: ${JSON.stringify(validProcessedUrls)}`, 'info');
        log(`🔴 Invalid processed URLs: ${JSON.stringify(result.results.filter((_, i) => !processedValidationResults[i]))}`, 'info');

        if (validProcessedUrls.length > 0) {
          // Build pairs: match each processed URL to its original safely
          const newProcessedImages = validProcessedUrls.map((url, i) => {
            const originalUrl = validImageUrls[i] || 'unknown-original';
            return {
              id: uuidv4(),
              original: originalUrl,
              url,
              platform,
              taskId: result.task_id || 'unknown',
              fileName: url.split('/').pop() || `no_bg_image_${i}.png`,
            };
          });

          log(`🆕 New processed images: ${JSON.stringify(newProcessedImages)}`, 'info');

          setProcessedImages(prev => {
            const existingIds = new Set(prev.map(img => img.id));
            const uniqueNewImages = newProcessedImages.filter(img => !existingIds.has(img.id));
            const newState = [...prev, ...uniqueNewImages];
            log(`📦 Updated processedImages state: ${JSON.stringify(newState)}`, 'info');
            return newState;
          });

          log(
            `✅ Background removal completed for ${validProcessedUrls.length} images. Task ID: ${result.task_id || 'unknown'}`,
            'success'
          );
          setSelectedImages([]);
        } else {
          log('⚠️ No valid processed images after validation. Check network or CORS.', 'warning');
        }
      } else {
        throw new Error(
          result.failed > 0
            ? `Background removal failed for ${result.failed} images.`
            : 'No valid results returned.'
        );
      }
    } catch (error) {
      console.error('❌ Error processing images:', error);
      setError(`Error processing images: ${error.message}`);
      log(`❌ Error processing images: ${error.message}`, 'error');
    } finally {
      setProcessing(false);
      log('ℹ️ Background removal process completed', 'info');
    }
  };

  const toggleProcessedImage = (id) => {
  setSelectedProcessedImages(prev => {
    const newSelection = prev.includes(id)
      ? prev.filter(pid => pid !== id)
      : [...prev, id];

    // Sync into selectedImages for optimization
    setSelectedImages(prevSel => {
      if (newSelection.includes(id)) {
        // Add processed image to optimization selection
        const processedImg = processedImages.find(img => img.id === id);
        if (processedImg && !prevSel.includes(id)) {
          return [...prevSel, id];
        }
      } else {
        // Remove from optimization selection
        return prevSel.filter(selId => selId !== id);
      }
      return prevSel;
    });

    // Ensure processedImages are also in scrapedImages for optimization
    setScrapedImages(prevScraped => {
      const processedImg = processedImages.find(img => img.id === id);
      if (processedImg && !prevScraped.some(img => img.id === processedImg.id)) {
        return [...prevScraped, processedImg];
      }
      return prevScraped;
    });

    return newSelection;
  });

  log(`ℹ️ Toggled processed image selection: ${id}`, 'info');
};


  const toggleSelectAllProcessed = () => {
    if (selectedProcessedImages.length === processedImages.length) {
      setSelectedProcessedImages([]);
      log('ℹ️ Deselected all processed images', 'info');
    } else {
      setSelectedProcessedImages(processedImages.map(img => img.id));
      log('ℹ️ Selected all processed images', 'info');
    }
  };

  const clearProcessedSelections = () => {
    setSelectedProcessedImages([]);
    log('ℹ️ Cleared processed image selections', 'info');
  };

  // Log when rendering processed images
  useEffect(() => {
    if (processedImages.length > 0) {
      log(`ℹ️ Rendering ${processedImages.length} processed images`, 'info');
    } else {
      log('ℹ️ No processed images to render', 'info');
    }
  }, [processedImages]);

  return (
    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Layers className="w-6 h-6 text-blue-400" />
            Background Removal
          </h2>
          <p className="text-gray-400 text-sm mt-1">Remove background from selected images</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 flex items-center mb-6">
          <AlertCircle className="w-5 h-5 text-red-300 mr-2" />
          <p className="text-red-300">{error}</p>
        </div>
      )}

      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-white">Selected Scraped Images</h3>
          <div className="flex items-center gap-2">
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

        <div className="flex items-center gap-4 mb-6">
          <label className="flex items-center cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                className="sr-only"
                checked={whiteBackground}
                onChange={() => setWhiteBackground(!whiteBackground)}
              />
              <div className={`block w-10 h-6 rounded-full ${whiteBackground ? 'bg-purple-500' : 'bg-gray-600'}`}></div>
              <div
                className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${whiteBackground ? 'transform translate-x-4' : ''}`}
              ></div>
            </div>
            <div className="ml-3 text-sm text-gray-300">
              White Background
            </div>
          </label>

          <button
            onClick={processBackgroundRemoval}
            disabled={selectedImages.length === 0 || processing}
            className={`px-4 py-1.5 rounded-lg font-medium transition-all duration-300 text-sm ${selectedImages.length === 0 || processing
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
              }`}
          >
            {processing ? 'Processing...' : 'Remove Background'}
          </button>
        </div>
        {Array.isArray(processedImages) && processedImages.length > 0 ?(
          <div className="mt-6 bg-black/30 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-white">Processed Images</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleSelectAllProcessed}
                  className="px-3 py-1.5 text-sm bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-colors"
                >
                  {selectedProcessedImages.length === processedImages.length ? 'Deselect All' : 'Select All'}
                </button>
                <button
                  onClick={clearProcessedSelections}
                  className="px-3 py-1.5 text-sm bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-colors"
                  disabled={selectedProcessedImages.length === 0}
                >
                  Clear
                </button>
                <button
                  onClick={downloadProcessedImages}
                  disabled={selectedProcessedImages.length === 0}
                  className="px-3 py-1.5 text-sm bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-lg text-white transition-colors flex items-center gap-1"
                >
                  <Download className="w-4 h-4" />
                  Download Selected
                </button>

              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {processedImages.map((img) => (
                <div key={img.id} className="bg-white/5 p-2 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedProcessedImages.includes(img.id)}
                        onChange={() => toggleProcessedImage(img.id)}
                        className="mr-2"
                      />
                      <h4 className="text-sm font-medium text-gray-300">Processed Image</h4>
                    </div>
                    

                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Original</p>
                      <img
                        src={img.original}
                        alt="Original"
                        className="w-full h-auto max-h-40 object-contain bg-transparent"
                        crossOrigin="anonymous"
                        onLoad={() => log(`✅ Loaded original image: ${img.original}`, 'info')}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/140x91?text=Original+Failed';
                          log(`❌ Failed to load original image: ${img.original}`, 'error');
                        }}
                      />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Processed</p>
                      <img
                        src={img.url}
                        alt="Processed"
                        className="w-full h-auto max-h-40 object-contain bg-transparent"
                        crossOrigin="anonymous"
                        onLoad={() => log(`✅ Loaded processed image: ${img.url}`, 'info')}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/140x91?text=Processed+Failed';
                          log(`❌ Failed to load processed image: ${img.url}`, 'error');
                        }}
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">Task ID: {img.taskId}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-400">No processed images yet. Select images and click "Remove Background" to start.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BackgroundRemoval;