import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  Image as ImageIcon, 
  ExternalLink, 
  Download, 
  Check, 
  Trash2, 
  Zap, 
  Clock, 
  AlertCircle 
} from 'lucide-react';

const Ebay = () => {
  // State for scraping inputs
  const [url, setUrl] = useState('');
  const [maxProducts, setMaxProducts] = useState(30);
  const [workers, setWorkers] = useState(8);
  const [ignoreSSL, setIgnoreSSL] = useState(true);
  
  // State for scraping process
  const [isScrapingActive, setIsScrapingActive] = useState(false);
  const [scrapingComplete, setScrapingComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState([]);
  const [scrapedImages, setScrapedImages] = useState([]); // Formatted images with URLs
  const [selectedImages, setSelectedImages] = useState([]);
  const [stats, setStats] = useState({ products: 0, images: 0, downloaded: 0, errors: 0 });
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  
  // Refs for scrolling
  const logsEndRef = useRef(null);

  // Constants
  const API_BASE_URL = 'http://127.0.0.1:8000';
  const STATIC_PATH = 'static/ebay'; // Backend static mount

  // Auto scroll logs to bottom
  const scrollToBottom = () => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [logs]);

  // Add log message
  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
    const logEntry = {
      id: Date.now() + Math.random(),
      timestamp: `[${timestamp}]`,
      message,
      type
    };
    setLogs(prev => [...prev, logEntry]);
  };

  // Toggle image selection
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

  // Select/deselect all
  const toggleSelectAll = () => {
    if (selectedImages.length === scrapedImages.length && scrapedImages.length > 0) {
      setSelectedImages([]);
      setScrapedImages(prev => prev.map(img => ({ ...img, selected: false })));
    } else {
      const allIds = scrapedImages.map(img => img.id);
      setSelectedImages(allIds);
      setScrapedImages(prev => prev.map(img => ({ ...img, selected: true })));
    }
  };

  // Clear selections
  const clearSelections = () => {
    setSelectedImages([]);
    setScrapedImages(prev => prev.map(img => ({ ...img, selected: false })));
  };

  // Remove selected images
  const removeSelectedImages = () => {
    if (selectedImages.length === 0) return;
    setScrapedImages(prev => prev.filter(img => !img.selected));
    setSelectedImages([]);
    addLog(`🗑️ Removed ${selectedImages.length} selected images`, 'info');
  };

  // Download selected as ZIP
  const downloadSelectedImages = async () => {
    if (selectedImages.length === 0) {
      addLog('⚠️ No images selected for download', 'warning');
      return;
    }

    setIsDownloading(true);
    setDownloadProgress(0);
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
        `${API_BASE_URL}/api/scrapers/download-zip`,
        { 
          files: selectedFiles,
          platform: 'ebay'
        },
        { 
          responseType: 'blob',
          headers: { 'Content-Type': 'application/json' },
          onDownloadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setDownloadProgress(percentCompleted);
            }
          }
        }
      );

      const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', `ebay-images-${new Date().toISOString().split('T')[0]}.zip`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      addLog('✅ ZIP download started!', 'success');
    } catch (error) {
      console.error('Error downloading ZIP:', error);
      addLog('❌ Failed to create ZIP. Attempting individual downloads...', 'error');

      // Fallback: Individual downloads
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
      addLog('✅ Individual downloads initiated!', 'success');
    } finally {
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  };

  // Start the scraping process
  const startScraping = async () => {
    if (isScrapingActive || !url.trim()) {
      if (!url.trim()) {
        addLog('❌ Please enter a valid eBay URL', 'error');
      }
      return;
    }
    
    setIsScrapingActive(true);
    setScrapingComplete(false);
    setProgress(0);
    setLogs([]);
    setScrapedImages([]);
    setSelectedImages([]);
    setStats({ products: 0, images: 0, downloaded: 0, errors: 0 });
    
    addLog('🚀 Starting eBay image scraper...', 'info');
    addLog(`🌐 Scraping URL: ${url}`, 'info');
    addLog(`⚙️ Settings: Max Products=${maxProducts}, Workers=${workers}, Ignore SSL=${ignoreSSL ? 'Yes' : 'No'}`, 'info');

    try {
      // Simulate initial progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = Math.min(prev + Math.random() * 10, 90);
          if (newProgress % 20 === 0) {
            addLog(`🔍 Processing... ${Math.round(newProgress)}% complete`, 'info');
          }
          return newProgress;
        });
      }, 1500);

      const requestPayload = {
        url: url.trim(),
        max_products: maxProducts || 30,
        workers: workers || 8,
        ignore_ssl: ignoreSSL,
        headless: true
      };

      addLog('📡 Sending request to backend...', 'info');
      const response = await axios.post(`${API_BASE_URL}/api/scrapers/ebay`, requestPayload, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 300000 // 5 minutes
      });

      clearInterval(progressInterval);
      setProgress(100);

      const { products = 0, images = 0, downloaded = 0, errors = 0, image_paths = [] } = response.data;

      // Update stats
      setStats({ products, images, downloaded, errors });

      if (image_paths && image_paths.length > 0) {
        // Format images with full URLs
        const formattedImages = image_paths.map((imgPath, index) => {
          const normalizedPath = imgPath.replace(/\\/g, '/');
          const filename = normalizedPath.split('/').pop() || `image-${index}.webp`;
          const imageUrl = `${API_BASE_URL}/${STATIC_PATH}/${filename}`;
          
          return {
            id: `ebay-${Date.now()}-${index}`,
            url: imageUrl,
            name: filename,
            size: 'Unknown',
            selected: false,
            platform: 'ebay'
          };
        });

        setScrapedImages(formattedImages);
        addLog(`✨ Successfully scraped ${formattedImages.length} unique images!`, 'success');
        
        // Store in localStorage for View page
        localStorage.setItem('scrapedImages', JSON.stringify(formattedImages));
      } else {
        addLog('ℹ️ No images found or downloaded', 'warning');
      }

      addLog(`✅ Scraping completed: ${products} products scanned, ${images} images found, ${downloaded} downloaded, ${errors} errors`, 'success');
      
      if (errors > 0) {
        addLog(`⚠️ ${errors} errors encountered during scraping`, 'warning');
      }
      
      setScrapingComplete(true);
    } catch (error) {
      console.error('Scraping error:', error);
      const errorMessage = error.response?.data?.detail || error.response?.data?.message || error.message || 'An unknown error occurred';
      addLog(`❌ Scraping failed: ${errorMessage}`, 'error');
      
      // Handle partial results if available
      if (error.response?.data?.image_paths && error.response.data.image_paths.length > 0) {
        const imageFiles = error.response.data.image_paths;
        const partialImages = imageFiles.map((imgPath, index) => {
          const normalizedPath = imgPath.replace(/\\/g, '/');
          const filename = normalizedPath.split('/').pop() || `partial-${index}.webp`;
          const imageUrl = `${API_BASE_URL}/${STATIC_PATH}/${filename}`;
          
          return {
            id: `ebay-partial-${index}`,
            url: imageUrl,
            name: filename,
            size: 'Unknown',
            selected: false,
            platform: 'ebay'
          };
        });
        setScrapedImages(partialImages);
        addLog(`ℹ️ Loaded ${partialImages.length} partial images`, 'info');
        localStorage.setItem('scrapedImages', JSON.stringify(partialImages));
      }
    } finally {
      setIsScrapingActive(false);
    }
  };

  // Stop scraping (simulated, as backend may not support cancellation)
  const stopScraping = () => {
    setIsScrapingActive(false);
    addLog('⏹️ Scraping stopped by user', 'warning');
  };

  // Clear logs
  const clearLogs = () => {
    setLogs([]);
  };

  // Download all as ZIP
  const downloadAllImages = async () => {
    if (scrapedImages.length === 0) {
      addLog('⚠️ No images available to download', 'warning');
      return;
    }

    setIsDownloading(true);
    setDownloadProgress(0);
    addLog(`📦 Preparing ZIP for ${scrapedImages.length} images...`, 'info');

    try {
      const allFiles = scrapedImages.map(img => ({
        url: img.url,
        filename: img.name
      }));

      const response = await axios.post(
        `${API_BASE_URL}/api/scrapers/download-zip`,
        { 
          files: allFiles,
          platform: 'ebay'
        },
        { 
          responseType: 'blob',
          headers: { 'Content-Type': 'application/json' },
          onDownloadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setDownloadProgress(percentCompleted);
            }
          }
        }
      );

      const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', `ebay-images-${new Date().toISOString().split('T')[0]}.zip`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      addLog('✅ ZIP download started!', 'success');
    } catch (error) {
      console.error('Download failed:', error);
      addLog('❌ Download failed. Please try again.', 'error');
    } finally {
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  };

  // Navigate to View page
  const navigateToView = () => {
    if (scrapedImages.length > 0) {
      // Already stored in localStorage during scraping
      window.location.href = '/view';
    } else {
      addLog('⚠️ No images available to view', 'warning');
    }
  };

  // Render gallery
  const renderGallery = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {scrapedImages.map((image) => (
        <div key={image.id} className="relative group">
          <div className={`relative bg-white/5 border-2 rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 ${
            image.selected ? 'border-purple-400 shadow-lg shadow-purple-400/20' : 'border-transparent hover:border-white/30'
          }`}>
            <div className="aspect-square bg-gray-800/50 flex items-center justify-center">
              <img
                src={image.url}
                alt={image.name}
                className="w-full h-full object-contain p-2"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzJkMzc0OCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgYWxpZ25tZW50LWJhc2VsaW5lPSJtaWRkbGUiIGZpbGw9IiM2YjcyODAiPkltYWdlICMqe2ltYWdlLmlkfTwvdGV4dD48L3N2Zz4=';
                  addLog(`❌ Failed to load: ${image.name}`, 'error');
                }}
              />
            </div>
            
            {/* Hover overlay */}
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
            
            {/* Selection checkbox */}
            <div 
              className="absolute top-2 left-2 z-10 w-5 h-5 flex items-center justify-center bg-black/50 rounded cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                toggleImageSelection(image.id);
              }}
            >
              <input
                type="checkbox"
                checked={image.selected}
                onChange={() => {}}
                className="w-4 h-4 text-purple-500 rounded border-gray-300 focus:ring-purple-400"
              />
            </div>
            
            {/* Footer */}
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
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-blue-800">
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
        
        <div className="relative z-10 min-h-screen container mx-auto flex flex-col items-center justify-center px-4 sm:px-6 py-8">
          
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                </svg>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
                eBay Image{" "}
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 bg-clip-text text-transparent">
                  Scraper
                </span>
              </h1>
            </div>
            <p className="text-gray-300 text-lg mb-2">Fast concurrent scraping with real-time logs & gallery preview</p>
            <div className="flex items-center justify-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-green-400 text-sm">Backend Connected</span>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-8 w-full max-w-7xl">
            
            {/* Left Column - Controls & Gallery */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-6 lg:p-8 space-y-6">
              <div className="flex items-center gap-3">
                <Zap className="w-6 h-6 text-purple-400" />
                <h2 className="text-xl font-bold text-white">Scrape Controls</h2>
              </div>

              <div className="space-y-4">
                {/* URL Input */}
                <div>
                  <label className="text-white font-medium mb-2 block">eBay URL</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 pr-10 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
                      placeholder="https://www.ebay.com/itm/..."
                      disabled={isScrapingActive}
                    />
                    <ExternalLink className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
                  </div>
                </div>

                {/* Settings */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-white font-medium mb-2 block text-sm">Max Products</label>
                    <input
                      type="number"
                      value={maxProducts}
                      onChange={(e) => setMaxProducts(parseInt(e.target.value) || 30)}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
                      disabled={isScrapingActive}
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="text-white font-medium mb-2 block text-sm">Workers</label>
                    <input
                      type="number"
                      value={workers}
                      onChange={(e) => setWorkers(parseInt(e.target.value) || 8)}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
                      disabled={isScrapingActive}
                      min="1"
                    />
                  </div>
                </div>

                {/* SSL Toggle */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="ignoreSSL"
                    checked={ignoreSSL}
                    onChange={(e) => setIgnoreSSL(e.target.checked)}
                    className="w-4 h-4 text-purple-500 bg-white/10 border-white/20 rounded focus:ring-purple-400"
                    disabled={isScrapingActive}
                  />
                  <label htmlFor="ignoreSSL" className="text-white text-sm cursor-pointer select-none">
                    Ignore SSL errors
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={startScraping}
                    disabled={isScrapingActive || !url.trim()}
                    className={`flex-1 py-3 px-6 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 ${
                      isScrapingActive || !url.trim()
                        ? 'bg-gray-600 cursor-not-allowed text-gray-400'
                        : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
                    }`}
                  >
                    {isScrapingActive ? (
                      <>
                        <Clock className="w-4 h-4 animate-spin" />
                        Scraping...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4" />
                        Start Scrape
                      </>
                    )}
                  </button>
                  <button
                    onClick={stopScraping}
                    disabled={!isScrapingActive}
                    className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
                      !isScrapingActive
                        ? 'bg-gray-600 cursor-not-allowed text-gray-400'
                        : 'bg-red-500 hover:bg-red-600 text-white transform hover:scale-105'
                    }`}
                  >
                    Stop
                  </button>
                </div>

                {/* Progress Bar */}
                {(isScrapingActive || scrapingComplete) && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-bold text-sm">
                        {isScrapingActive ? 'SCRAPING IN PROGRESS' : 'SCRAPING COMPLETED'}
                      </span>
                      <span className="text-purple-400 font-bold">{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-300 ease-out rounded-full"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-300 mt-2">
                      Products: {stats.products} | Images: {stats.images} | Downloaded: {stats.downloaded} | Errors: {stats.errors}
                    </div>
                  </div>
                )}
              </div>

              {/* Gallery - Only show if images exist */}
              {scrapingComplete && scrapedImages.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white">Image Gallery ({scrapedImages.length} images)</h3>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={toggleSelectAll}
                        className="px-3 py-1 text-xs bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-colors"
                        disabled={scrapedImages.length === 0}
                      >
                        {selectedImages.length === scrapedImages.length && scrapedImages.length > 0 ? 'Deselect All' : 'Select All'}
                      </button>
                      <span className="text-xs text-gray-300">
                        {selectedImages.length} selected
                      </span>
                    </div>
                  </div>
                  {renderGallery()}
                  <div className="flex gap-4 mt-4">
                    <button
                      onClick={downloadSelectedImages}
                      disabled={selectedImages.length === 0 || isDownloading}
                      className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors ${
                        selectedImages.length === 0 || isDownloading
                          ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700'
                      }`}
                    >
                      <Download className="w-4 h-4" />
                      {isDownloading ? 'Preparing...' : `Download Selected (${selectedImages.length})`}
                    </button>
                    <button
                      onClick={removeSelectedImages}
                      disabled={selectedImages.length === 0}
                      className={`px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors ${
                        selectedImages.length === 0
                          ? 'text-gray-600 cursor-not-allowed'
                          : 'text-red-400 hover:bg-red-500/20'
                      }`}
                    >
                      <Trash2 className="w-4 h-4" />
                      Remove Selected
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Real-time Logs */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-6 lg:p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-6 h-6 text-purple-400" />
                  <h2 className="text-xl font-bold text-white">Real-time Logs</h2>
                </div>
                <button
                  onClick={clearLogs}
                  className="text-red-400 hover:text-red-300 font-medium text-sm transition-colors"
                  disabled={logs.length === 0}
                >
                  Clear
                </button>
              </div>

              <div className="bg-black/50 rounded-xl p-4 h-96 overflow-y-auto font-mono text-xs space-y-1">
                {logs.length === 0 ? (
                  <div className="text-gray-400 text-center py-8 flex items-center justify-center gap-2">
                    <Clock className="w-5 h-5 animate-pulse" />
                    <span>Logs will appear here when scraping starts...</span>
                  </div>
                ) : (
                  <>
                    {logs.map((log) => (
                      <div key={log.id} className="flex gap-2">
                        <span className="text-blue-400 min-w-[80px]">{log.timestamp}</span>
                        <span className={`flex-1 ${
                          log.type === 'success' ? 'text-green-400' :
                          log.type === 'warning' ? 'text-yellow-400' :
                          log.type === 'error' ? 'text-red-400' :
                          'text-gray-300'
                        }`}>
                          {log.message}
                        </span>
                      </div>
                    ))}
                    <div ref={logsEndRef} />
                  </>
                )}
              </div>

              {/* Auto-scroll toggle */}
              <div className="flex items-center gap-2 mt-4">
                <input
                  type="checkbox"
                  id="auto-scroll"
                  defaultChecked
                  className="w-4 h-4 text-purple-500 bg-white/10 border-white/20 rounded focus:ring-purple-400"
                />
                <label htmlFor="auto-scroll" className="text-gray-300 text-sm cursor-pointer select-none">
                  Auto-scroll to bottom
                </label>
              </div>
            </div>
          </div>

          {/* Download & View Actions - Always visible */}
          <div className="mt-12 w-full max-w-7xl">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div className="text-center sm:text-left">
                <h3 className="text-lg font-bold text-white mb-2">Ready to Download or View?</h3>
                <p className="text-gray-300 text-sm">Scraped {scrapedImages.length} high-quality images</p>
              </div>
              <div className="flex gap-4 flex-wrap justify-center sm:justify-end">
                <button 
                  onClick={downloadAllImages}
                  disabled={!scrapingComplete || scrapedImages.length === 0 || isDownloading}
                  className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-all duration-300 transform hover:scale-105 ${
                    !scrapingComplete || scrapedImages.length === 0 || isDownloading
                      ? 'bg-gray-600 cursor-not-allowed text-gray-400'
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
                  }`}
                >
                  {isDownloading ? (
                    <>
                      <Download className="w-4 h-4 animate-pulse" />
                      Downloading... ({downloadProgress}%)
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Download All ({scrapedImages.length})
                    </>
                  )}
                </button>
                <button
                  onClick={navigateToView}
                  disabled={!scrapingComplete || scrapedImages.length === 0}
                  className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-all duration-300 transform hover:scale-105 ${
                    !scrapingComplete || scrapedImages.length === 0
                      ? 'bg-gray-600 cursor-not-allowed text-gray-400'
                      : 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:from-blue-700 hover:to-cyan-600'
                  }`}
                >
                  <ImageIcon className="w-4 h-4" />
                  View Gallery
                </button>
              </div>

              {/* Global Download Progress */}
              {isDownloading && (
                <div className="w-full mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-bold text-sm">Download Progress</span>
                    <span className="text-purple-400">{downloadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-400 to-pink-500 transition-all duration-300 rounded-full"
                      style={{ width: `${downloadProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* No Images Placeholder */}
      {!scrapingComplete && scrapedImages.length === 0 && (
        <section className="py-20 px-6 md:px-12">
          <div className="max-w-7xl mx-auto text-center">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-12">
              <ImageIcon className="w-16 h-16 text-gray-500 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">Ready to Scrape eBay Images</h3>
              <p className="text-gray-300 text-lg max-w-md mx-auto mb-8">
                Enter an eBay product, store, or search URL above and click Start to extract high-quality product images.
              </p>
              <div className="text-sm text-gray-400 space-y-1">
                <div>✅ Supports single items, search results, and stores</div>
                <div>✅ Concurrent downloading for speed</div>
                <div>✅ Automatic duplicate removal</div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Ebay;