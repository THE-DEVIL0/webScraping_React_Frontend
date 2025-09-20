import React, { useState, useEffect, useRef } from 'react';

const Amazon = () => {
  const [url, setUrl] = useState('');
  const [maxProducts, setMaxProducts] = useState(30);
  const [workers, setWorkers] = useState(8);
  const [ignoreSSL, setIgnoreSSL] = useState(true);
  const [isScrapingActive, setIsScrapingActive] = useState(false);
  const [scrapingComplete, setScrapingComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState([]);
  const [downloadedImages, setDownloadedImages] = useState([]);
  const [stats, setStats] = useState({ products: 0, images: 0, downloaded: 0, errors: 0 });
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const logsEndRef = useRef(null);

  // Auto scroll logs to bottom
  const scrollToBottom = () => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [logs]);

  // Simulate scraping process
  const startScraping = () => {
    if (isScrapingActive) return;
    
    setIsScrapingActive(true);
    setScrapingComplete(false);
    setProgress(0);
    setLogs([]);
    setDownloadedImages([]);
    setStats({ products: 0, images: 0, downloaded: 0, errors: 0 });
    
    // Add initial log
    addLog('🚀 Starting Amazon image scraper...', 'info');
    addLog('📡 Connecting to Amazon servers...', 'info');
    
    // Simulate progress
    simulateScrapingProgress();
  };

  const stopScraping = () => {
    setIsScrapingActive(false);
    addLog('⏹️ Scraping stopped by user', 'warning');
  };

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

  const simulateScrapingProgress = () => {
    let currentProgress = 0;
    let downloadCount = 0;
    
    const interval = setInterval(() => {
      if (!isScrapingActive) {
        clearInterval(interval);
        return;
      }
      
      currentProgress += Math.random() * 3;
      
      if (currentProgress >= 100) {
        currentProgress = 100;
        setProgress(100);
        setIsScrapingActive(false);
        setScrapingComplete(true);
        addLog('✅ Scraping completed! Results panel shown', 'success');
        clearInterval(interval);
        
        // Generate some sample downloaded images
        const sampleImages = [
          'https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
          'https://images.unsplash.com/photo-1560769629-975ec94e6a86?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
          'https://images.unsplash.com/photo-1606778303242-8787b2b45be9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
          'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
          'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
          'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
          'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
          'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80'
        ];
        setDownloadedImages(sampleImages);
        return;
      }
      
      setProgress(currentProgress);
      
      // Add random log entries
      if (Math.random() > 0.7) {
        const progressPercent = Math.floor(currentProgress);
        addLog(`📊 Progress: ${progressPercent}/95 (${(progressPercent/95*100).toFixed(1)}%)`, 'info');
      }
      
      if (Math.random() > 0.8) {
        downloadCount++;
        const fileName = `amz-${2450 + downloadCount}.webp`;
        const time = (Math.random() * 2).toFixed(2);
        addLog(`⬇️ Downloaded ${fileName} in ${time}s`, 'success');
        setStats(prev => ({ ...prev, downloaded: downloadCount }));
      }
      
      // Update stats
      setStats(prev => ({
        ...prev,
        products: Math.min(Math.floor(currentProgress / 10), maxProducts),
        images: Math.floor(currentProgress * 0.95)
      }));
      
    }, 200 + Math.random() * 300);
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const downloadZip = () => {
    setIsDownloading(true);
    setDownloadProgress(0);
    
    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsDownloading(false);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-900 via-orange-900 to-amber-800">
      {/* Hero Section */}
      <section className="relative min-h-screen w-full overflow-hidden text-white pt-16 sm:pt-20 md:pt-24">
        {/* Base solid background */}
        <div className="absolute inset-0 bg-[#0A0A0A]"></div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-amber-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-10 w-96 h-96 bg-orange-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-amber-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
        </div>
        
        {/* Readability layer */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#6B4E1E] from-10% via-[#6B4E1E]/60 via-60% to-transparent"></div>
        
        <div className="relative z-10 min-h-screen container mx-auto flex flex-col items-center justify-center px-4 sm:px-6 py-8">
          
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                </svg>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
                Amazon Image{" "}
                <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-600 bg-clip-text text-transparent">
                  Scraper
                </span>
              </h1>
            </div>
            <p className="text-gray-300 text-lg mb-2">Fast concurrent scraping with real-time logs</p>
            <div className="flex items-center justify-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-green-400 text-sm">BackgroundRemover: Available</span>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-8 w-full max-w-7xl">
            
            {/* Left Column - Controls */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-6 lg:p-8">
              <div className="flex items-center gap-3 mb-6">
                <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
                <h2 className="text-xl font-bold text-white">Start Scraping</h2>
              </div>

              <div className="space-y-6">
                {/* URL Input */}
                <div>
                  <label className="text-white font-medium mb-2 block">Amazon Product or Search URL</label>
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
                    placeholder="https://www.amazon.com/dp/..."
                  />
                  <div className="flex items-center gap-2 mt-2 text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                    <span className="text-sm">~95 images available</span>
                  </div>
                </div>

                {/* Settings Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-white font-medium mb-2 block">Max Products</label>
                    <input
                      type="number"
                      value={maxProducts}
                      onChange={(e) => setMaxProducts(parseInt(e.target.value) || 30)}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
                    />
                  </div>
                  <div>
                    <label className="text-white font-medium mb-2 block">Workers</label>
                    <input
                      type="number"
                      value={workers}
                      onChange={(e) => setWorkers(parseInt(e.target.value) || 8)}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
                    />
                  </div>
                </div>

                {/* SSL Checkbox */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="ssl"
                    checked={ignoreSSL}
                    onChange={(e) => setIgnoreSSL(e.target.checked)}
                    className="w-4 h-4 text-amber-500 bg-white/10 border-white/20 rounded focus:ring-amber-400 focus:ring-2"
                  />
                  <label htmlFor="ssl" className="text-white">Ignore SSL errors (recommended)</label>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                  <button
                    onClick={startScraping}
                    disabled={isScrapingActive}
                    className={`flex-1 ${isScrapingActive 
                      ? 'bg-gray-600 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
                    } text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1M9 16h1m4 0h1m-7 4h8a2 2 0 002-2V6a2 2 0 00-2-2H8a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                    {isScrapingActive ? 'Starting...' : 'Start Scrape'}
                  </button>

                  <button
                    onClick={stopScraping}
                    disabled={!isScrapingActive}
                    className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${!isScrapingActive 
                      ? 'bg-gray-600 cursor-not-allowed text-gray-400' 
                      : 'bg-red-500 hover:bg-red-600 text-white transform hover:scale-105'
                    }`}
                  >
                    Stop
                  </button>
                </div>

                {/* Progress Bar */}
                {(isScrapingActive || scrapingComplete) && (
                  <div className="pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-bold">
                        {isScrapingActive ? 'SCRAPING' : 'SCRAPING COMPLETED'}
                      </span>
                      <span className="text-amber-400 font-bold">{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-green-400 to-amber-500 transition-all duration-300 ease-out rounded-full"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <div className="text-sm text-gray-300 mt-2">
                      Products: {stats.products} | Images: {stats.images} | Downloaded: {stats.downloaded} | Errors: {stats.errors}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Real-time Logs */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-6 lg:p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                  <h2 className="text-xl font-bold text-white">Real-time Logs</h2>
                </div>
                <button
                  onClick={clearLogs}
                  className="text-red-400 hover:text-red-300 font-medium text-sm transition-colors"
                >
                  Clear Logs
                </button>
              </div>

              <div className="bg-black/50 rounded-xl p-4 h-96 overflow-y-auto font-mono text-sm">
                {logs.length === 0 ? (
                  <div className="text-gray-400 text-center py-8">
                    Logs will appear here when scraping starts...
                  </div>
                ) : (
                  <>
                    {logs.map((log) => (
                      <div key={log.id} className="flex gap-2 mb-1">
                        <span className="text-blue-400">{log.timestamp}</span>
                        <span className={`${
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

              {/* Auto-scroll checkbox */}
              <div className="flex items-center gap-2 mt-4">
                <input
                  type="checkbox"
                  id="auto-scroll"
                  defaultChecked
                  className="w-4 h-4 text-amber-500 bg-white/10 border-white/20 rounded focus:ring-amber-400"
                />
                <label htmlFor="auto-scroll" className="text-gray-300 text-sm">Auto-scroll</label>
              </div>
            </div>
          </div>

          {/* Download Section */}
          <div className="mt-12 w-full max-w-7xl">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                </svg>
                <h2 className="text-xl font-bold text-white">Download Section</h2>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={downloadZip}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-3 px-8 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                  </svg>
                  Download ZIP
                </button>
                <a
                  href="/view"
                  className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold py-3 px-8 rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                  View Gallery
                </a>
              </div>

              {/* Download Progress */}
              {isDownloading && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-bold">DOWNLOADING</span>
                    <span className="text-amber-400 font-bold">{downloadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-400 to-amber-500 transition-all duration-300 ease-out rounded-full"
                      style={{ width: `${downloadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Downloaded Images Section */}
      {scrapingComplete && downloadedImages.length > 0 && (
        <section className="py-20 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 md:p-12">
              <div className="flex items-center gap-3 mb-8">
                <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                <h2 className="text-2xl md:text-3xl font-bold text-white">Downloaded Images</h2>
              </div>

              {/* Image Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {downloadedImages.map((image, index) => (
                  <div key={index} className="bg-white/10 border border-white/20 rounded-xl p-4 group hover:bg-white/15 transition-all duration-300">
                    <div className="aspect-square rounded-lg overflow-hidden mb-3">
                      <img
                        src={image}
                        alt={`Downloaded ${index + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="text-gray-300 text-sm text-center">
                      amz-{2450 + index}.webp
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center mt-8 text-gray-300">
                {downloadedImages.length} images successfully downloaded
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Amazon;