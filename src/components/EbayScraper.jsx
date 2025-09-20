
import React, { useState } from 'react';
import axios from 'axios';
import { Image as ImageIcon, ExternalLink, Download, Check, Trash2 } from 'lucide-react';

const EbayScraper = ({
  platform,
  url,
  setUrl,
  isScraping,
  setIsScraping,
  scrapedImages,
  setScrapedImages,
  selectedImages,
  setSelectedImages,
  progress,
  setProgress,
  logs,
  setLogs,
  addLog,
  scrapingComplete,
  setScrapingComplete,
  maxProducts,
  setMaxProducts,
  toggleSelectAll,
  clearSelections
}) => {
  const platformConfig = {
    name: 'eBay',
    placeholder: 'https://www.ebay.com/itm/ITEM_ID or https://www.ebay.com/sch/i.html?_nkw=shoes',
    color: 'from-blue-500 to-purple-500',
    icon: '🏪',
    apiEndpoint: 'http://127.0.0.1:8001/api/scrapers/ebay',
    scrapeParams: {
      max_products: 30,
      headless: true
    }
  };

  const startScraping = async () => {
    if (isScraping || !url) {
      if (!url) {
        addLog('❌ Please enter a valid URL', 'error');
      }
      return;
    }

    setIsScraping(true);
    setScrapingComplete(false);
    setProgress(0);
    setScrapedImages([]);
    setLogs([]);

    addLog(`🚀 Starting ${platformConfig.name} image scraper...`, 'info');
    addLog(`🌐 Scraping URL: ${url}`, 'info');

    try {
      addLog('📡 Connecting to server...', 'info');
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = Math.min(prev + 5, 90);
          if (newProgress % 20 === 0) {
            addLog(`Processing... ${newProgress}% complete`, 'info');
          }
          return newProgress;
        });
      }, 1000);

      const requestPayload = {
        url,
        max_products: maxProducts || platformConfig.scrapeParams.max_products,
        headless: platformConfig.scrapeParams.headless
      };

      addLog(`🔗 Sending request to ${platformConfig.name} scraper...`, 'info');
      const response = await axios.post(platformConfig.apiEndpoint, requestPayload, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Origin': 'http://localhost:3000',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Allow-Credentials': 'true'
        },
        withCredentials: true,
        timeout: 300000
      });

      clearInterval(progressInterval);
      setProgress(100);

      const { total_products, total_images, image_urls, unique_images, errors } = response.data;

      if (image_urls && image_urls.length > 0) {
        const formattedImages = image_urls.map((imgUrl, index) => {
          const filename = imgUrl.split('/').pop().split('?')[0] || `image-${index}.jpg`;
          return {
            id: `${platform}-${Date.now()}-${index}`,
            url: imgUrl,
            name: filename,
            size: 'Unknown',
            selected: false,
            platform
          };
        });
        setScrapedImages(formattedImages);
        addLog(`✨ Found ${formattedImages.length} product image URLs`, 'success');
      } else {
        addLog('ℹ️ No image URLs were found', 'info');
      }

      addLog(`✅ Scraping completed: ${total_products} products, ${unique_images} unique images found`, 'success');
      if (errors && errors.length > 0) {
        errors.forEach(err => addLog(`⚠️ Error: ${err.error}`, 'warning'));
      }
      setScrapingComplete(true);
    } catch (err) {
      console.error('Scraping error:', err);
      const errorMessage = err.response?.data?.detail || err.response?.data?.error || err.message || 'An unknown error occurred';
      addLog(`❌ Error: ${errorMessage}`, 'error');

      if (err.response?.data?.image_urls) {
        const imageUrls = err.response.data.image_urls;
        const partialImages = imageUrls.map((imgUrl, index) => {
          const filename = imgUrl.split('/').pop().split('?')[0] || `image-${index}.jpg`;
          return {
            id: `${platform}-${index}`,
            url: imgUrl,
            name: filename,
            size: 'Unknown',
            selected: false,
            platform
          };
        });
        setScrapedImages(partialImages);
        addLog(`ℹ️ Recovered ${partialImages.length} partial image URLs`, 'info');
      }
    } finally {
      setIsScraping(false);
    }
  };

  const downloadSelectedImages = async () => {
    if (selectedImages.length === 0) {
      addLog('⚠️ No images selected for download', 'warning');
      return;
    }

    addLog(`⬇️ Preparing to download ${selectedImages.length} images...`, 'info');

    try {
      const selectedFiles = selectedImages.map(id => {
        const img = scrapedImages.find(img => img.id === id);
        return {
          url: img.url,
          filename: img.name
        };
      });

      const response = await axios.post(
        'http://127.0.0.1:8001/api/scrapers/download-zip',
        {
          files: selectedFiles,
          platform: platformConfig.name.toLowerCase()
        },
        {
          responseType: 'blob',
          headers: { 'Content-Type': 'application/json' }
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${platformConfig.name.toLowerCase()}-images-${new Date().toISOString().split('T')[0]}.zip`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      addLog('✅ ZIP file download started!', 'success');
    } catch (error) {
      console.error('Error downloading ZIP:', error);
      addLog('❌ Failed to create ZIP download. Falling back to individual downloads.', 'error');

      addLog('⚠️ Attempting individual downloads...', 'info');
      selectedImages.forEach(id => {
        const img = scrapedImages.find(img => img.id === id);
        if (img) {
          const link = document.createElement('a');
          link.href = img.url;
          link.download = img.name;
          link.target = '_blank';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      });
      addLog('✅ Individual downloads started!', 'success');
    }
  };

  const toggleImageSelection = (id) => {
    setSelectedImages(prev =>
      prev.includes(id)
        ? prev.filter(imgId => imgId !== id)
        : [...prev, id]
    );
    setScrapedImages(prev =>
      prev.map(img =>
        img.id === id ? { ...img, selected: !img.selected } : img
      )
    );
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-blue-400" />
            {platformConfig.name} Image Scraper
          </h2>
          <p className="text-gray-400 text-sm mt-1">Extract high-quality product images from {platformConfig.name}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative flex-1 min-w-0">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={platformConfig.placeholder}
              className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={isScraping}
            />
            <ExternalLink className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
          </div>
          <button
            onClick={startScraping}
            disabled={isScraping || !url}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 text-sm ${isScraping || !url
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
              }`}
          >
            {isScraping ? 'Scraping...' : 'Start'}
          </button>
        </div>
      </div>

      <div className="mb-4 flex items-center gap-2">
        <label className="text-sm text-gray-300">Max Products:</label>
        <input
          type="number"
          value={maxProducts}
          onChange={(e) => setMaxProducts(parseInt(e.target.value) || 0)}
          className="bg-white/10 border border-white/20 text-white rounded-lg px-3 py-1 text-sm w-20 focus:outline-none focus:ring-2 focus:ring-purple-500"
          disabled={isScraping}
          min="0"
        />
        <span className="text-xs text-gray-400">(0 for all)</span>
      </div>

      {isScraping && (
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-300 mb-1">
            <span>Progress: {progress}%</span>
            <span>{scrapedImages.length} images found</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2.5">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {logs.length > 0 && (
        <div className="mb-6 bg-black/30 rounded-lg p-3 max-h-32 overflow-y-auto">
          <div className="text-xs font-mono space-y-1">
            {logs.map((log, idx) => (
              <div key={idx} className={`flex items-start gap-2 ${log.type === 'error' ? 'text-red-400' :
                  log.type === 'success' ? 'text-green-400' : 'text-gray-300'
                }`}>
                <span className="text-gray-500 text-xs">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
                <span>{log.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSelectAll}
            className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-sm text-white transition-colors"
            disabled={scrapedImages.length === 0}
          >
            <Check className="w-4 h-4" />
            {selectedImages.length === scrapedImages.length && scrapedImages.length > 0
              ? 'Deselect All'
              : 'Select All'}
          </button>
          <span className="text-sm text-gray-300">
            {selectedImages.length} of {scrapedImages.length} selected
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={downloadSelectedImages}
            disabled={selectedImages.length === 0 || isScraping}
            className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors ${selectedImages.length === 0 || isScraping
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700'
              }`}
          >
            <Download className="w-4 h-4" />
            Download Selected
          </button>
          <button
            onClick={() => setScrapedImages(prev => prev.filter(img => !img.selected))}
            disabled={selectedImages.length === 0 || isScraping}
            className={`p-2 rounded-lg transition-colors ${selectedImages.length === 0 || isScraping
                ? 'text-gray-600 cursor-not-allowed'
                : 'text-red-400 hover:bg-red-500/20'
              }`}
            title="Remove selected"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {scrapedImages.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {scrapedImages.map((image) => (
            <div key={image.id} className="relative group">
              <div className={`relative bg-white/5 border-2 ${image.selected
                  ? 'border-purple-400 shadow-lg shadow-purple-400/20'
                  : 'border-transparent hover:border-white/30'
                } rounded-xl overflow-hidden transition-all duration-300 hover:scale-105`}>
                <div className="aspect-square bg-gray-800/50 flex items-center justify-center">
                  <img
                    src={image.url}
                    alt={image.name}
                    className="w-full h-full object-contain p-2"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Crect width=\'100%\' height=\'100%\' fill=\'%232d3748\'/%3E%3Ctext x=\'50%\' y=\'50%\' font-family=\'sans-serif\' font-size=\'10\' text-anchor=\'middle\' alignment-baseline=\'middle\' fill=\'%236b7280\'%3EImage %23${image.id}%3C/text%3E%3C/svg%3E';
                    }}
                  />
                </div>
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                  <button
                    className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(image.url, '_blank');
                    }}
                    title="Preview"
                  >
                    <ImageIcon className="w-4 h-4 text-white" />
                  </button>
                  <button
                    className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      const link = document.createElement('a');
                      link.href = image.url;
                      link.download = image.name;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                    title="Download"
                  >
                    <Download className="w-4 h-4 text-white" />
                  </button>
                </div>
                <div
                  className="absolute top-2 left-2 z-10 w-5 h-5 flex items-center justify-center bg-black/50 rounded cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleImageSelection(image.id);
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedImages.includes(image.id)}   // ✅ now uses selectedImages only
                    onChange={() => toggleImageSelection(image.id)}
                    className="w-4 h-4 text-purple-500 rounded border-gray-300 focus:ring-purple-400"
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-2">
                  <p className="text-xs text-white font-medium truncate" title={image.name}>
                    {image.name}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-gray-500">{image.size}</span>
                    <span className="text-[10px] px-1.5 py-0.5 bg-white/10 rounded">
                      {image.name.includes('lifestyle') ? 'Lifestyle' : 'Product'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white/5 rounded-xl border-2 border-dashed border-white/10">
          <ImageIcon className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-300 mb-1">No images found</h3>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            {isScraping
              ? 'Scraping in progress...'
              : 'Enter a product URL and click Start to begin scraping images'}
          </p>
        </div>
      )}
    </div>
  );
};

export default EbayScraper;
