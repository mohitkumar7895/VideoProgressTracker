import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, BookOpen, Clock, BarChart3 } from 'lucide-react';

// Utility functions for interval management
const IntervalUtils = {
  // Merge overlapping intervals to get unique watched segments
  mergeIntervals: (intervals) => {
    if (!intervals || intervals.length === 0) return [];
    
    // Sort intervals by start time
    const sorted = [...intervals].sort((a, b) => a.start - b.start);
    const merged = [sorted[0]];
    
    for (let i = 1; i < sorted.length; i++) {
      const current = sorted[i];
      const lastMerged = merged[merged.length - 1];
      
      // If current interval overlaps with the last merged interval
      if (current.start <= lastMerged.end) {
        lastMerged.end = Math.max(lastMerged.end, current.end);
      } else {
        merged.push(current);
      }
    }
    
    return merged;
  },
  
  // Calculate total duration from merged intervals
  getTotalDuration: (intervals) => {
    const merged = IntervalUtils.mergeIntervals(intervals);
    return merged.reduce((total, interval) => total + (interval.end - interval.start), 0);
  },
  
  // Check if a time point has been watched
  hasBeenWatched: (intervals, time) => {
    const merged = IntervalUtils.mergeIntervals(intervals);
    return merged.some(interval => time >= interval.start && time <= interval.end);
  }
};

// Progress tracking hook
const useVideoProgress = (videoId, videoDuration) => {
  const [watchedIntervals, setWatchedIntervals] = useState([]);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [lastSavedPosition, setLastSavedPosition] = useState(0);
  
  // Load progress from memory on component mount
  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem(`video_progress_${videoId}`) || '{}');
    if (savedData.watchedIntervals) {
      setWatchedIntervals(savedData.watchedIntervals);
      setCurrentPosition(savedData.lastPosition || 0);
      setLastSavedPosition(savedData.lastPosition || 0);
    }
  }, [videoId]);
  
  // Save progress to memory
  const saveProgress = (intervals, position) => {
    const progressData = {
      watchedIntervals: intervals,
      lastPosition: position,
      timestamp: Date.now()
    };
    localStorage.setItem(`video_progress_${videoId}`, JSON.stringify(progressData));
  };
  
  // Add a new watched interval
  const addWatchedInterval = (start, end) => {
    if (start >= end) return;
    
    const newInterval = { start: Math.floor(start), end: Math.floor(end) };
    const updatedIntervals = [...watchedIntervals, newInterval];
    
    setWatchedIntervals(updatedIntervals);
    saveProgress(updatedIntervals, end);
  };
  
  // Calculate progress percentage
  const getProgressPercentage = () => {
    if (!videoDuration) return 0;
    const uniqueDuration = IntervalUtils.getTotalDuration(watchedIntervals);
    return Math.min((uniqueDuration / videoDuration) * 100, 100);
  };
  
  // Update current position
  const updatePosition = (position) => {
    setCurrentPosition(position);
    if (Math.abs(position - lastSavedPosition) >= 1) {
      setLastSavedPosition(position);
      saveProgress(watchedIntervals, position);
    }
  };
  
  return {
    watchedIntervals,
    currentPosition,
    lastSavedPosition,
    addWatchedInterval,
    updatePosition,
    getProgressPercentage,
    hasBeenWatched: (time) => IntervalUtils.hasBeenWatched(watchedIntervals, time)
  };
};

// Custom Video Player Component
const VideoPlayer = ({ src, onTimeUpdate, onLoadedMetadata, currentTime, onSeek }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    const handleTimeUpdate = () => {
      onTimeUpdate(video.currentTime);
    };
    
    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      onLoadedMetadata(video.duration);
    };
    
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    
    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [onTimeUpdate, onLoadedMetadata]);
  
  // Seek to specific time
  useEffect(() => {
    if (videoRef.current && currentTime !== undefined) {
      videoRef.current.currentTime = currentTime;
    }
  }, [currentTime]);
  
  const togglePlay = () => {
    const video = videoRef.current;
    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };
  
  const handleSeek = (e) => {
    const video = videoRef.current;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const time = pos * duration;
    video.currentTime = time;
    onSeek(time);
  };
  
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="bg-black rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        src={src}
        className="w-full aspect-video"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      
      <div className="bg-gray-900 p-4">
        <div className="flex items-center gap-4">
          <button
            onClick={togglePlay}
            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition-colors"
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
          
          <div className="flex-1">
            <div
              className="bg-gray-700 h-2 rounded-full cursor-pointer"
              onClick={handleSeek}
            >
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
            </div>
          </div>
          
          <span className="text-white text-sm">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>
      </div>
    </div>
  );
};

// Progress Visualization Component
const ProgressVisualization = ({ intervals, duration, currentTime }) => {
  const mergedIntervals = IntervalUtils.mergeIntervals(intervals);
  
  return (
    <div className="bg-white rounded-lg p-6 shadow-lg">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <BarChart3 className="text-blue-600" size={20} />
        Viewing Progress Visualization
      </h3>
      
      <div className="space-y-4">
        <div className="relative bg-gray-200 h-8 rounded">
          {/* Watched segments */}
          {mergedIntervals.map((interval, index) => (
            <div
              key={index}
              className="absolute bg-green-500 h-8 rounded"
              style={{
                left: `${(interval.start / duration) * 100}%`,
                width: `${((interval.end - interval.start) / duration) * 100}%`
              }}
            />
          ))}
          
          {/* Current position indicator */}
          <div
            className="absolute bg-red-500 w-1 h-8"
            style={{ left: `${(currentTime / duration) * 100}%` }}
          />
        </div>
        
        <div className="flex justify-between text-sm text-gray-600">
          <span>0:00</span>
          <span className="text-center">
            <span className="text-green-600">■</span> Watched &nbsp;
            <span className="text-gray-400">■</span> Unwatched &nbsp;
            <span className="text-red-600">|</span> Current Position
          </span>
          <span>{Math.floor(duration / 60)}:{(Math.floor(duration % 60)).toString().padStart(2, '0')}</span>
        </div>
      </div>
    </div>
  );
};

// Statistics Component
const ProgressStats = ({ intervals, duration, progressPercentage }) => {
  const mergedIntervals = IntervalUtils.mergeIntervals(intervals);
  const totalWatched = IntervalUtils.getTotalDuration(intervals);
  const uniqueSegments = mergedIntervals.length;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="text-blue-600" size={20} />
          <h4 className="font-semibold text-blue-800">Time Watched</h4>
        </div>
        <p className="text-2xl font-bold text-blue-600">
          {Math.floor(totalWatched / 60)}:{(Math.floor(totalWatched % 60)).toString().padStart(2, '0')}
        </p>
        <p className="text-sm text-blue-600">
          out of {Math.floor(duration / 60)}:{(Math.floor(duration % 60)).toString().padStart(2, '0')}
        </p>
      </div>
      
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <BarChart3 className="text-green-600" size={20} />
          <h4 className="font-semibold text-green-800">Progress</h4>
        </div>
        <p className="text-2xl font-bold text-green-600">
          {progressPercentage.toFixed(1)}%
        </p>
        <p className="text-sm text-green-600">Complete</p>
      </div>
      
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="text-purple-600" size={20} />
          <h4 className="font-semibold text-purple-800">Segments</h4>
        </div>
        <p className="text-2xl font-bold text-purple-600">{uniqueSegments}</p>
        <p className="text-sm text-purple-600">Unique watched</p>
      </div>
    </div>
  );
};

// Main Application Component
const VideoProgressTracker = () => {
  const videoId = 'demo-lecture-video';
  const videoSrc = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
  
  const [videoDuration, setVideoDuration] = useState(0);
  const [currentVideoTime, setCurrentVideoTime] = useState(0);
  const [isTracking, setIsTracking] = useState(false);
  const [trackingStart, setTrackingStart] = useState(0);
  
  const {
    watchedIntervals,
    //currentPosition,
    lastSavedPosition,
    addWatchedInterval,
    updatePosition,
    getProgressPercentage,
    //hasBeenWatched
  } = useVideoProgress(videoId, videoDuration);
  
  // Handle video time updates
  const handleTimeUpdate = (time) => {
    setCurrentVideoTime(time);
    updatePosition(time);
    
    // Start tracking if not already tracking
    if (!isTracking) {
      setIsTracking(true);
      setTrackingStart(time);
    }
    
    // If there's a significant jump (> 2 seconds), save the previous interval and start new tracking
    if (Math.abs(time - currentVideoTime) > 2) {
      if (isTracking && trackingStart < currentVideoTime) {
        addWatchedInterval(trackingStart, currentVideoTime);
      }
      setTrackingStart(time);
    }
  };
  
  // Handle video seeking
  const handleSeek = (time) => {
    // Save current tracking interval before seeking
    if (isTracking && trackingStart < currentVideoTime) {
      addWatchedInterval(trackingStart, currentVideoTime);
    }
    
    setCurrentVideoTime(time);
    setTrackingStart(time);
    updatePosition(time);
  };
  
  // Handle video metadata loaded
  const handleLoadedMetadata = (duration) => {
    setVideoDuration(duration);
  };
  
  // Reset progress
  const resetProgress = () => {
    localStorage.removeItem(`video_progress_${videoId}`);
    window.location.reload();
  };
  
  // Resume from last position
  const resumeVideo = () => {
    setCurrentVideoTime(lastSavedPosition);
  };
  
  // Save interval when component unmounts or video pauses
  useEffect(() => {
    return () => {
      if (isTracking && trackingStart < currentVideoTime) {
        addWatchedInterval(trackingStart, currentVideoTime);
      }
    };
  }, [isTracking, trackingStart, currentVideoTime, addWatchedInterval]);
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Smart Video Progress Tracker</h1>
          <p className="text-gray-600 mt-2">Advanced video progress tracking that counts only unique content watched</p>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Player Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Demo Lecture Video</h2>
                <div className="flex gap-2">
                  <button
                    onClick={resumeVideo}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <Play size={16} />
                    Resume
                  </button>
                  <button
                    onClick={resetProgress}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <RotateCcw size={16} />
                    Reset
                  </button>
                </div>
              </div>
              
              <VideoPlayer
                src={videoSrc}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                currentTime={currentVideoTime}
                onSeek={handleSeek}
              />
            </div>
            
            {/* Progress Visualization */}
            {videoDuration > 0 && (
              <ProgressVisualization
                intervals={watchedIntervals}
                duration={videoDuration}
                currentTime={currentVideoTime}
              />
            )}
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Stats */}
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Progress Overview</h3>
              {videoDuration > 0 ? (
                <ProgressStats
                  intervals={watchedIntervals}
                  duration={videoDuration}
                  progressPercentage={getProgressPercentage()}
                />
              ) : (
                <p className="text-gray-500">Loading video...</p>
              )}
            </div>
            
            {/* Watched Intervals Details */}
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Watched Segments</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {IntervalUtils.mergeIntervals(watchedIntervals).length > 0 ? (
                  IntervalUtils.mergeIntervals(watchedIntervals).map((interval, index) => (
                    <div key={index} className="bg-green-50 border border-green-200 rounded p-3">
                      <p className="text-sm font-medium text-green-800">
                        Segment {index + 1}
                      </p>
                      <p className="text-xs text-green-600">
                        {Math.floor(interval.start / 60)}:{(Math.floor(interval.start % 60)).toString().padStart(2, '0')} - {Math.floor(interval.end / 60)}:{(Math.floor(interval.end % 60)).toString().padStart(2, '0')}
                      </p>
                      <p className="text-xs text-green-600">
                        Duration: {Math.floor((interval.end - interval.start) / 60)}:{(Math.floor((interval.end - interval.start) % 60)).toString().padStart(2, '0')}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No segments watched yet</p>
                )}
              </div>
            </div>
            
            {/* Features Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">Smart Features</h3>
              <ul className="space-y-2 text-sm text-blue-700">
                <li>• Only counts unique content watched</li>
                <li>• Prevents progress from skipping</li>
                <li>• Automatically saves and resumes</li>
                <li>• Visual progress tracking</li>
                <li>• Detailed viewing analytics</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoProgressTracker;