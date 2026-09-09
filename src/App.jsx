import React, { useState, useEffect } from 'react';
import { Cake, Gift, Heart, Sparkles } from 'lucide-react';

export default function BirthdayCelebration() {
  const [currentSection, setCurrentSection] = useState(0);
  const [showCakeModal, setShowCakeModal] = useState(false);
  const [balloons, setBalloons] = useState([
    { id: 1, x: 10, y: 50, color: '#FF1493', popped: false },
    { id: 2, x: 25, y: 45, color: '#FFD700', popped: false },
    { id: 3, x: 45, y: 48, color: '#00FF7F', popped: false },
    { id: 4, x: 65, y: 46, color: '#1E90FF', popped: false },
    { id: 5, x: 82, y: 52, color: '#FF69B4', popped: false }
  ]);
  const [showCard, setShowCard] = useState(false);
  const [confetti, setConfetti] = useState([]);
  const [candleFlames, setCandleFlames] = useState([true, true, true]);
  
  // Carousel states
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // 6 Romantic love-themed images from Unsplash
  const images = [
    'https://images.unsplash.com/photo-1518568814500-bf0f8d125f46?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bG92ZSUyMGNvdXBsZXxlbnwwfHwwfHx8MA%3D%3D&w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bG92ZSUyMGNvdXBsZXxlbnwwfHwwfHx8MA%3D%3D&w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bG92ZSUyMGNvdXBsZXxlbnwwfHwwfHx8MA%3D%3D&w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bG92ZSUyMWNvdXBsZXxlbnwwfHwwfHx8MA%3D%3D&w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1529254479751-fbacb4c3b7c8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGxvdmUlMjBjb3VwbGV8ZW58MHx8MHx8fDA%3D&w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGxvdmUlMjBjb3VwbGV8ZW58MHx8MHx8fDA%3D&w=600&h=600&fit=crop'
  ];

  // Enhanced greeting card image
  const greetingCardImage = 'https://images.unsplash.com/photo-1511895426328-dc8714191300?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGxvdmUlMjBsZXR0ZXJ8ZW58MHx8MHx8fDA%3D&w=800&h=600&fit=crop';

  // Carousel animation - automatic rotation
  useEffect(() => {
    if (currentSection === 3) {
      const interval = setInterval(() => {
        setIsAnimating(true);
        setTimeout(() => {
          setCurrentImageIndex((prev) => (prev + 1) % images.length);
          setIsAnimating(false);
        }, 500);
      }, 3000); // Change image every 3 seconds

      return () => clearInterval(interval);
    }
  }, [currentSection, images.length]);

  // Enhanced background stars with twinkling effect
  useEffect(() => {
    const stars = document.querySelectorAll('.star');
    stars.forEach(star => {
      star.style.animationDelay = `${Math.random() * 5}s`;
    });
  }, []);

  // Candle flickering effect
  useEffect(() => {
    if (currentSection === 1) {
      const interval = setInterval(() => {
        setCandleFlames(prev => prev.map(() => Math.random() > 0.3));
      }, 300);
      return () => clearInterval(interval);
    }
  }, [currentSection]);

  const popBalloon = (id) => {
    setBalloons(prev => prev.map(b => 
      b.id === id ? { ...b, popped: true } : b
    ));
    createMiniConfetti();
  };

  const createConfetti = () => {
    const newConfetti = [];
    for (let i = 0; i < 150; i++) {
      newConfetti.push({
        id: i,
        x: Math.random() * 100,
        y: -10,
        rotation: Math.random() * 360,
        color: ['#FF69B4', '#FFD700', '#90EE90', '#87CEEB', '#FF6347', '#DA70D6'][Math.floor(Math.random() * 6)],
        size: Math.random() * 12 + 5,
        shape: ['circle', 'square', 'triangle'][Math.floor(Math.random() * 3)],
        duration: Math.random() * 2 + 2
      });
    }
    setConfetti(newConfetti);
    setTimeout(() => setConfetti([]), 4000);
  };

  const createMiniConfetti = () => {
    const newConfetti = [];
    for (let i = 0; i < 30; i++) {
      newConfetti.push({
        id: Date.now() + i,
        x: Math.random() * 100,
        y: Math.random() * 50,
        rotation: Math.random() * 360,
        color: ['#FF69B4', '#FFD700', '#90EE90', '#87CEEB'][Math.floor(Math.random() * 4)],
        size: Math.random() * 8 + 3,
        shape: ['circle', 'square'][Math.floor(Math.random() * 2)],
        duration: Math.random() * 1 + 1
      });
    }
    setConfetti(newConfetti);
    setTimeout(() => setConfetti([]), 2000);
  };

  const celebrateCake = () => {
    setShowCakeModal(true);
    createConfetti();
    // Blow out candles
    setCandleFlames([false, false, false]);
    setTimeout(() => setShowCakeModal(false), 3000);
  };

  const FloatingHearts = () => (
    <div className="absolute inset-0 pointer-events-none">
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          className="absolute text-pink-400 opacity-60"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `floatUp ${8 + Math.random() * 4}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`,
            fontSize: `${Math.random() * 20 + 10}px`
          }}
        >
          ❤️
        </div>
      ))}
    </div>
  );

  const getImagePosition = (index) => {
    const totalImages = images.length;
    const relativePosition = (index - currentImageIndex + totalImages) % totalImages;
    
    switch (relativePosition) {
      case 0: // Current Center Image
        return {
          opacity: 1,
          transform: 'scale(1.1) translateX(0)',
          zIndex: 20,
          filter: 'blur(0px) brightness(1)',
          transition: 'all 0.5s ease-out'
        };
      
      case 1: // Next Image (Right Side)
        return {
          opacity: 0.8,
          transform: 'scale(0.9) translateX(120px)',
          zIndex: 15,
          filter: 'blur(1px) brightness(0.8)',
          transition: 'all 0.5s ease-out'
        };
      
      case 2: // Far Right Image
        return {
          opacity: 0.6,
          transform: 'scale(0.8) translateX(200px)',
          zIndex: 10,
          filter: 'blur(2px) brightness(0.6)',
          transition: 'all 0.5s ease-out'
        };
      
      case totalImages - 1: // Previous Image (Left Side)
        return {
          opacity: 0.8,
          transform: 'scale(0.9) translateX(-120px)',
          zIndex: 15,
          filter: 'blur(1px) brightness(0.8)',
          transition: 'all 0.5s ease-out'
        };
      
      case totalImages - 2: // Far Left Image
        return {
          opacity: 0.6,
          transform: 'scale(0.8) translateX(-200px)',
          zIndex: 10,
          filter: 'blur(2px) brightness(0.6)',
          transition: 'all 0.5s ease-out'
        };
      
      default: // Hidden Images
        return {
          opacity: 0,
          transform: 'scale(0.7)',
          zIndex: 5,
          filter: 'blur(3px) brightness(0.4)',
          transition: 'all 0.5s ease-out'
        };
    }
  };

  // Manual navigation
  const goToNext = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
        setIsAnimating(false);
      }, 300);
    }
  };

  const goToPrev = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
        setIsAnimating(false);
      }, 300);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Enhanced Animated Stars Background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="star absolute w-1 h-1 bg-white rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `twinkle ${3 + Math.random() * 4}s ease-in-out infinite`
            }}
          />
        ))}
      </div>

      <FloatingHearts />

      {/* Enhanced Colorful Bunting */}
      <div className="absolute top-0 left-0 right-0 flex justify-around z-10">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="w-6 h-10 transform transition-transform duration-300 hover:scale-125"
            style={{
              background: ['#FF1493', '#FFD700', '#00FF7F', '#1E90FF', '#FF69B4', '#DA70D6'][i % 6],
              clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
              animation: `swing ${2 + (i % 3)}s ease-in-out infinite`,
              animationDelay: `${i * 0.1}s`
            }}
          />
        ))}
      </div>

      {/* Enhanced Confetti */}
      {confetti.map(c => (
        <div
          key={c.id}
          className={`absolute ${
            c.shape === 'circle' ? 'rounded-full' : 
            c.shape === 'triangle' ? 'triangle' : 'rounded-sm'
          }`}
          style={{
            left: `${c.x}%`,
            top: `${c.y}%`,
            width: `${c.size}px`,
            height: `${c.size}px`,
            backgroundColor: c.color,
            animation: `confettiFall ${c.duration}s ease-out forwards`,
            transform: `rotate(${c.rotation}deg)`,
            opacity: 0.9
          }}
        />
      ))}

      {/* Section 0: Welcome Screen */}
      {currentSection === 0 && (
        <div className="min-h-screen flex flex-col items-center justify-center animate-fadeIn px-4">
          {/* Enhanced Cute Character */}
          <div className="relative mb-8 animate-float">
            <div className="w-40 h-40 rounded-full bg-gradient-to-br from-pink-300 to-purple-300 flex items-center justify-center shadow-2xl border-4 border-white relative overflow-hidden">
              <div className="text-7xl">🥰</div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shine"></div>
            </div>
            <div className="absolute -top-4 -right-4 animate-spin-slow">
              <Sparkles className="w-12 h-12 text-yellow-300" />
            </div>
            <div className="absolute -bottom-4 -left-4 animate-heartbeat">
              <Heart className="w-10 h-10 text-red-400" fill="currentColor" />
            </div>
          </div>

          {/* Enhanced Title with Gradient */}
          <div className="text-center space-y-4 mb-8">
            <h1 className="text-6xl font-black bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent animate-gradient mb-2">
              A Cutiepie
            </h1>
            <h2 className="text-5xl font-bold text-white mb-4 animate-slideUp">
              was born today,
            </h2>
            <div className="text-7xl font-black bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent animate-pulse">
              20 Years Ago!
            </div>
          </div>

          {/* Enhanced Date Badge */}
          <div className="bg-white/10 backdrop-blur-md px-8 py-4 rounded-full border-2 border-white/20 mb-12 animate-bounceIn">
            <p className="text-pink-300 text-xl font-semibold">
              ✨ Nov 08, 2005 | A little sunshine arrives ✨
            </p>
          </div>

          {/* Enhanced CTA Button */}
          <button
            onClick={() => setCurrentSection(1)}
            className="group relative bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white px-12 py-5 rounded-full text-2xl font-bold hover:scale-110 transform transition-all duration-300 shadow-2xl hover:shadow-pink-500/50 overflow-hidden animate-pulse"
          >
            <span className="relative z-10 flex items-center gap-3">
              🎂 Happy Birthday
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shine"></div>
          </button>

          {/* Enhanced Floating Elements */}
          <div className="absolute top-1/4 left-10 text-4xl animate-float-slow">🎈</div>
          <div className="absolute top-1/3 right-10 text-4xl animate-float-slow" style={{animationDelay: '1s'}}>🎁</div>
          <div className="absolute bottom-1/4 left-20 text-4xl animate-float-slow" style={{animationDelay: '2s'}}>⭐</div>
          <div className="absolute bottom-1/3 right-20 text-4xl animate-float-slow" style={{animationDelay: '1.5s'}}>🎊</div>
        </div>
      )}

      {/* Section 1: Enhanced Birthday Cake */}
      {currentSection === 1 && (
        <div className="min-h-screen flex flex-col items-center justify-center animate-fadeIn">
          <h2 className="text-5xl font-bold text-transparent bg-gradient-to-r from-yellow-300 to-pink-400 bg-clip-text mb-12 animate-pulse">
            Make a Wish! 🌟
          </h2>
          
          <div 
            className="cursor-pointer transform transition-all duration-500 hover:scale-110 hover:rotate-3 animate-float"
            onClick={celebrateCake}
          >
            {/* Cake component remains the same */}
            <div className="relative">
              {/* Enhanced Plate */}
              <div className="w-80 h-4 bg-gradient-to-b from-gray-200 to-gray-400 rounded-full mx-auto shadow-xl border-2 border-gray-500 mb-2"></div>
              
              {/* Enhanced Cake Base */}
              <div className="w-72 h-28 bg-gradient-to-b from-amber-800 via-amber-900 to-amber-950 rounded-lg relative shadow-2xl border-4 border-amber-950 mx-auto overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-600/20 via-transparent to-transparent"></div>
                <div className="absolute inset-x-4 top-3 h-1 bg-yellow-600 rounded-full"></div>
                <div className="absolute inset-x-8 bottom-3 h-1 bg-amber-950 rounded-full"></div>
                {/* Cream Dripping */}
                <div className="absolute -top-2 inset-x-0 h-6 bg-gradient-to-b from-yellow-100 to-yellow-200 border-2 border-yellow-300 rounded-t-lg">
                  <div className="absolute -bottom-4 left-8 w-8 h-6 bg-yellow-100 rounded-b-full"></div>
                  <div className="absolute -bottom-4 right-12 w-6 h-5 bg-yellow-100 rounded-b-full"></div>
                  <div className="absolute -bottom-4 left-20 w-10 h-7 bg-yellow-100 rounded-b-full"></div>
                </div>
              </div>
              
              {/* Enhanced Middle Layer */}
              <div className="w-60 h-24 bg-gradient-to-b from-pink-400 via-pink-500 to-pink-600 rounded-lg relative -mt-1 mx-auto shadow-xl border-4 border-pink-700 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-pink-300/20 via-transparent to-transparent"></div>
                <div className="absolute top-3 left-6 right-6 h-1 bg-pink-300 rounded-full"></div>
                <div className="absolute bottom-3 left-8 right-8 h-1 bg-pink-700 rounded-full"></div>
                {/* Sprinkles */}
                <div className="absolute top-6 left-8 w-2 h-2 bg-red-600 rounded-full"></div>
                <div className="absolute top-10 right-12 w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="absolute bottom-8 left-16 w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="absolute top-12 left-12 w-2 h-2 bg-yellow-400 rounded-full"></div>
                {/* Cream Dripping */}
                <div className="absolute -top-2 inset-x-0 h-4 bg-gradient-to-b from-white to-yellow-100 border-2 border-yellow-200 rounded-t-lg">
                  <div className="absolute -bottom-3 left-10 w-6 h-4 bg-white rounded-b-full"></div>
                  <div className="absolute -bottom-3 right-16 w-5 h-3 bg-white rounded-b-full"></div>
                </div>
              </div>
              
              {/* Enhanced Top Layer */}
              <div className="w-48 h-20 bg-gradient-to-b from-yellow-100 via-yellow-200 to-yellow-300 rounded-lg relative -mt-1 mx-auto shadow-xl border-4 border-yellow-400 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-300/30 via-transparent to-transparent"></div>
                <div className="absolute top-3 left-4 right-4 h-1 bg-white/60 rounded-full"></div>
                <div className="absolute bottom-3 left-6 right-6 h-1 bg-yellow-400 rounded-full"></div>
              </div>
              
              {/* Enhanced Frosting Top */}
              <div className="w-48 h-8 bg-gradient-to-b from-pink-300 via-pink-400 to-pink-500 relative -mt-1 mx-auto border-4 border-pink-600 rounded-t-full border-b-0 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-pink-200/30 via-transparent to-transparent"></div>
                {/* Frosting waves */}
                <div className="absolute bottom-0 left-0 right-0 flex justify-around">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="w-6 h-4 bg-pink-400 rounded-t-full"></div>
                  ))}
                </div>
              </div>
              
              {/* Enhanced Cherry on top */}
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 flex flex-col items-center animate-bounce-slow">
                <div className="w-1 h-4 bg-green-600 rounded-t-full"></div>
                <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-700 rounded-full shadow-2xl border-2 border-red-800 relative">
                  <div className="absolute top-1 left-1 w-2 h-2 bg-red-300 rounded-full"></div>
                </div>
              </div>
              
              {/* Enhanced Candles with better flames */}
              <div className="absolute -top-24 left-1/2 transform -translate-x-1/2 flex gap-6">
                {[0, 1, 2].map((index) => (
                  <div key={index} className="relative">
                    <div className={`w-4 h-16 bg-gradient-to-b from-red-400 via-red-500 to-red-600 rounded-t-lg border-2 border-red-700 shadow-lg transition-all duration-300 ${
                      !candleFlames[index] ? 'opacity-70' : ''
                    }`}>
                      <div className="absolute inset-x-1 top-2 h-1 bg-red-300 rounded-full"></div>
                    </div>
                    {candleFlames[index] && (
                      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
                        <div className="relative">
                          <div className="w-8 h-12 bg-gradient-to-t from-orange-500 via-yellow-400 to-yellow-200 rounded-full animate-flicker opacity-80 blur-sm"></div>
                          <div className="absolute inset-0 w-6 h-10 bg-gradient-to-t from-orange-400 to-yellow-300 rounded-full animate-flicker mx-auto mt-1" style={{animationDelay: '0.2s'}}></div>
                          <div className="absolute inset-0 w-4 h-8 bg-gradient-to-t from-yellow-300 to-yellow-200 rounded-full animate-flicker mx-auto mt-2" style={{animationDelay: '0.4s'}}></div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Enhanced Decorative elements */}
              <div className="absolute -left-12 top-1/2 text-4xl animate-float-slow">🎀</div>
              <div className="absolute -right-12 top-1/2 text-4xl animate-float-slow" style={{animationDelay: '0.5s'}}>🎀</div>
            </div>
            
            <p className="text-center mt-12 text-pink-300 text-xl font-semibold animate-pulse">
              👆 Click the cake to make a wish!
            </p>
          </div>
          
          <button
            onClick={() => setCurrentSection(2)}
            className="mt-12 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-full hover:scale-110 transition-all font-bold text-lg shadow-lg relative z-50 animate-bounceIn"
          >
            Next Adventure →
          </button>
        </div>
      )}

      {/* Enhanced Cake Celebration Modal */}
      {showCakeModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 animate-fadeIn bg-black/50 backdrop-blur-sm">
          <div className="text-center animate-scaleIn">
            <div className="text-9xl mb-6 animate-popIn">🎂</div>
            <h2 className="text-7xl font-black bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-400 bg-clip-text text-transparent mb-4 animate-pulse">
              Wish Granted! ✨
            </h2>
            <div className="flex justify-center gap-4 text-6xl">
              <span className="animate-bounce">🎉</span>
              <span className="animate-bounce" style={{animationDelay: '0.2s'}}>🎊</span>
              <span className="animate-bounce" style={{animationDelay: '0.4s'}}>🎈</span>
              <span className="animate-bounce" style={{animationDelay: '0.6s'}}>✨</span>
            </div>
          </div>
        </div>
      )}

      {/* Section 2: Pop the Balloons */}
      {currentSection === 2 && (
        <div className="min-h-screen flex flex-col items-center justify-center animate-fadeIn px-4">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-4 animate-slideUp">
              Pop All 5 Balloons! 🎈
            </h2>
            <p className="text-pink-300 text-xl animate-fadeIn">Hover and click each balloon to pop it!</p>
          </div>
          
          <div className="relative w-full max-w-6xl h-96">
            {balloons.map(balloon => (
              <div
                key={balloon.id}
                className={`absolute cursor-pointer transition-all duration-300 ${
                  balloon.popped ? 'opacity-0 scale-0' : 'hover:scale-125 animate-float-slow'
                }`}
                style={{
                  left: `${balloon.x}%`,
                  top: `${balloon.y}%`,
                  animationDelay: `${balloon.id * 0.5}s`
                }}
                onClick={() => popBalloon(balloon.id)}
              >
                {!balloon.popped && (
                  <>
                    <div
                      className="relative w-24 h-32 rounded-full shadow-2xl transition-transform duration-300 hover:rotate-6"
                      style={{
                        background: `linear-gradient(135deg, ${balloon.color} 0%, ${balloon.color}dd 100%)`,
                        boxShadow: `0 10px 40px ${balloon.color}66`
                      }}
                    >
                      <div className="absolute top-4 left-4 w-8 h-12 bg-white/40 rounded-full blur-sm animate-shine"></div>
                      <div 
                        className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3 h-4 rounded-b-full"
                        style={{ backgroundColor: balloon.color }}
                      ></div>
                    </div>
                    <div 
                      className="absolute top-full left-1/2 transform -translate-x-1/2 w-0.5 h-24 bg-gradient-to-b from-gray-400 to-transparent"
                      style={{
                        animation: `swing ${2 + balloon.id * 0.3}s ease-in-out infinite`
                      }}
                    ></div>
                  </>
                )}
                
                {balloon.popped && (
                  <div className="text-6xl animate-popIn">💥</div>
                )}
              </div>
            ))}
          </div>
          
          <button
            onClick={() => setCurrentSection(3)}
            disabled={balloons.some(b => !b.popped)}
            className={`mt-12 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-full transition-all font-bold text-lg shadow-lg relative z-50 ${
              balloons.some(b => !b.popped) 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:scale-110 animate-bounceIn'
            }`}
          >
            {balloons.some(b => !b.popped) ? 'Pop all balloons first!' : 'Sweet Memories →'}
          </button>
        </div>
      )}

      {/* Section 3: Enhanced Carousel Animation */}
      {currentSection === 3 && (
        <div className="min-h-screen flex flex-col items-center justify-center animate-fadeIn px-4">
          <h2 className="text-5xl font-bold bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent mb-8 animate-pulse">
            Our Beautiful Journey 💝
          </h2>
          
          <p className="text-pink-300 text-xl mb-12 text-center animate-fadeIn">
            Watch our memories flow like a beautiful river of love... 🌊
          </p>
          
          <div className="relative w-full max-w-6xl h-96 flex items-center justify-center">
            {/* Navigation Buttons */}
            <button
              onClick={goToPrev}
              disabled={isAnimating}
              className="absolute left-4 z-30 bg-white/20 backdrop-blur-md rounded-full p-4 hover:bg-white/30 transition-all disabled:opacity-50"
            >
              <span className="text-3xl text-white">←</span>
            </button>
            
            <button
              onClick={goToNext}
              disabled={isAnimating}
              className="absolute right-4 z-30 bg-white/20 backdrop-blur-md rounded-full p-4 hover:bg-white/30 transition-all disabled:opacity-50"
            >
              <span className="text-3xl text-white">→</span>
            </button>

            {/* Images Container */}
            <div className="relative w-full h-80 flex items-center justify-center">
              {images.map((img, index) => (
                <div
                  key={index}
                  className="absolute w-64 h-80 rounded-2xl shadow-2xl border-4 border-white/80 overflow-hidden cursor-pointer transition-all duration-500 ease-out"
                  style={getImagePosition(index)}
                  onClick={() => !isAnimating && goToNext()}
                >
                  <img
                    src={img}
                    alt={`Memory ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <p className="text-white text-center font-bold text-lg">
                      Beautiful Memory {index + 1}
                    </p>
                    <p className="text-white/80 text-center text-sm mt-1">
                      Click anywhere to continue
                    </p>
                  </div>
                  
                  {/* Shine effect on center image */}
                  {((index - currentImageIndex + images.length) % images.length) === 0 && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shine rounded-2xl"></div>
                  )}
                </div>
              ))}
            </div>

            {/* Progress Dots */}
            <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 flex gap-3">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => !isAnimating && setCurrentImageIndex(index)}
                  className={`w-4 h-4 rounded-full transition-all duration-300 ${
                    index === currentImageIndex 
                      ? 'bg-pink-500 scale-125' 
                      : 'bg-white/50 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>

            {/* Current Image Counter */}
            <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 text-center">
              <p className="text-pink-300 text-xl font-semibold animate-pulse">
                Memory {currentImageIndex + 1} of {images.length} 💖
              </p>
            </div>
          </div>

          {/* Auto-play indicator */}
          <div className="mt-20 text-center">
            <p className="text-purple-300 text-lg animate-pulse">
              ✨ Images automatically change every 3 seconds ✨
            </p>
          </div>
          
          <button
            onClick={() => setCurrentSection(4)}
            className="mt-12 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white px-12 py-4 rounded-full hover:scale-110 transition-all font-bold text-xl shadow-2xl relative z-50 animate-pulse"
          >
            🎁 Open Special Message
          </button>
        </div>
      )}

      {/* Section 4: Enhanced Special Message Card with Love Theme */}
      {currentSection === 4 && (
        <div className="min-h-screen flex flex-col items-center justify-center animate-fadeIn px-4">
          <h2 className="text-5xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-12 animate-pulse">
            A Special Message 💌
          </h2>
          
          {!showCard ? (
            <div 
              className="cursor-pointer transform transition-all duration-500 hover:scale-105 hover:rotate-2 animate-float"
              onClick={() => {
                setShowCard(true);
                createConfetti();
              }}
            >
              <div className="w-80 h-[500px] bg-gradient-to-br from-purple-600 via-pink-500 to-purple-600 rounded-3xl shadow-2xl flex flex-col items-center justify-center p-8 relative overflow-hidden border-4 border-white/20">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent"></div>
                <div className="absolute top-0 left-0 w-full h-full opacity-20">
                  <div className="absolute top-10 left-10 w-20 h-20 border-4 border-white rounded-full animate-ping"></div>
                  <div className="absolute bottom-10 right-10 w-16 h-16 border-4 border-white rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
                </div>
                
                <div className="relative z-10 text-center">
                  <div className="text-8xl mb-8 animate-bounce">💌</div>
                  <h3 className="text-4xl font-bold text-white mb-3 animate-slideUp">A Special</h3>
                  <h3 className="text-6xl font-black text-yellow-300 mb-8 animate-pulse">MESSAGE</h3>
                  <div className="text-5xl mb-6 animate-float-slow">💝✨🎀</div>
                  <p className="text-white/90 text-lg font-semibold animate-pulse">
                    👆 Click to open your message
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full max-w-6xl animate-scaleIn">
              <div className="bg-gradient-to-br from-white to-pink-50 rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-500 border-4 border-purple-200 hover:shadow-3xl">
                <div className="flex flex-col lg:flex-row">
                  {/* Left side - Romantic Image */}
                  <div 
                    className="w-full lg:w-2/5 bg-cover bg-center relative min-h-[500px]"
                    style={{ backgroundImage: `url(${greetingCardImage})` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-900/70 to-pink-900/50"></div>
                    <div className="relative z-10 h-full flex flex-col items-center justify-center p-8 text-center">
                      <div className="text-8xl mb-6 animate-bounce">💝</div>
                      <Heart className="w-24 h-24 text-pink-300 mx-auto animate-heartbeat mb-4" fill="currentColor" />
                      <h3 className="text-4xl font-bold text-white mb-4">My Dearest</h3>
                      <div className="text-6xl animate-pulse">🥰</div>
                      <Sparkles className="w-20 h-20 text-yellow-400 mx-auto animate-spin-slow mt-6" />
                    </div>
                  </div>
                  
                  {/* Right side - Enhanced Message */}
                  <div className="w-full lg:w-3/5 p-8 lg:p-12 bg-gradient-to-br from-white to-purple-50">
                    <div className="space-y-6 animate-slideInRight">
                      <h3 className="text-4xl font-bold text-purple-900 mb-6 text-center">
                        To My Beautiful Cutiepie 💕
                      </h3>
                      
                      <div className="space-y-4 text-lg leading-relaxed">
                        <p className="text-gray-800 animate-fadeIn" style={{animationDelay: '0.1s'}}>
                          On this magical day that brought you into the world, I want you to know that you're the most <span className="text-pink-600 font-bold">incredible person</span> I've ever known. Your smile is my favorite sight, and your laughter is the melody that fills my heart with joy. ✨
                        </p>
                        
                        <p className="text-gray-800 animate-fadeIn" style={{animationDelay: '0.3s'}}>
                          Every moment with you feels like a beautiful dream come true. You've brought so much <span className="text-purple-600 font-bold">love and happiness</span> into my life, and I'm endlessly grateful for every memory we've created together. 🌟
                        </p>
                        
                        <p className="text-gray-800 animate-fadeIn" style={{animationDelay: '0.5s'}}>
                          Your kindness, intelligence, and beautiful spirit inspire me every single day. Watching you grow and shine has been the greatest privilege of my life. 🌈
                        </p>
                        
                        <div className="bg-pink-50 p-6 rounded-2xl border-2 border-pink-200 animate-fadeIn" style={{animationDelay: '0.7s'}}>
                          <p className="text-pink-700 text-2xl font-bold text-center mb-2">
                            Happy 20th Birthday, My Love! 🎉
                          </p>
                          <p className="text-purple-700 text-lg text-center">
                            May this year bring you endless joy, success in all your dreams, and all the love your beautiful heart can hold! 
                          </p>
                        </div>
                        
                        <p className="text-gray-800 animate-fadeIn" style={{animationDelay: '0.9s'}}>
                          Here's to many more years of laughter, adventures, and growing together. You make every day brighter just by being you! 💖
                        </p>
                      </div>
                      
                      <div className="pt-6 border-t-2 border-pink-200 animate-fadeIn" style={{animationDelay: '1.1s'}}>
                        <p className="text-pink-600 text-2xl font-bold text-center">
                          With all my love, forever and always! 💞
                        </p>
                        <p className="text-purple-600 text-lg text-center mt-2 italic">
                          Your biggest admirer... 💫
                        </p>
                      </div>
                      
                      <div className="flex gap-4 mt-8 text-4xl justify-center animate-bounceIn" style={{animationDelay: '1.3s'}}>
                        <span className="animate-bounce">🎂</span>
                        <span className="animate-bounce" style={{animationDelay: '0.2s'}}>🎈</span>
                        <span className="animate-bounce" style={{animationDelay: '0.4s'}}>🎁</span>
                        <span className="animate-bounce" style={{animationDelay: '0.6s'}}>💝</span>
                        <span className="animate-bounce" style={{animationDelay: '0.8s'}}>✨</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.8) rotate(-5deg); }
          to { opacity: 1; transform: scale(1) rotate(0deg); }
        }
        
        @keyframes swing {
          0%, 100% { transform: rotate(-8deg); }
          50% { transform: rotate(8deg); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(2deg); }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        
        @keyframes floatUp {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
        }
        
        @keyframes confettiFall {
          to {
            transform: translateY(120vh) rotate(1080deg);
            opacity: 0;
          }
        }
        
        @keyframes flicker {
          0%, 100% { opacity: 1; transform: scale(1); }
          25% { opacity: 0.8; transform: scale(1.1); }
          50% { opacity: 0.9; transform: scale(0.9); }
          75% { opacity: 0.7; transform: scale(1.05); }
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        
        @keyframes shine {
          0% { transform: translateX(-100%) rotate(45deg); }
          100% { transform: translateX(200%) rotate(45deg); }
        }
        
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          25% { transform: scale(1.1); }
          50% { transform: scale(1); }
          75% { transform: scale(1.05); }
        }
        
        @keyframes bounceIn {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); opacity: 1; }
        }
        
        @keyframes popIn {
          0% { transform: scale(0); opacity: 0; }
          70% { transform: scale(1.2); }
          100% { transform: scale(1); opacity: 1; }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 1s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.8s ease-out;
        }
        
        .animate-slideInRight {
          animation: slideInRight 0.8s ease-out;
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.8s ease-out;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-float-slow {
          animation: float-slow 4s ease-in-out infinite;
        }
        
        .animate-flicker {
          animation: flicker 1.5s ease-in-out infinite;
        }
        
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        
        .animate-shine {
          animation: shine 2s ease-in-out infinite;
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        
        .animate-heartbeat {
          animation: heartbeat 2s ease-in-out infinite;
        }
        
        .animate-bounceIn {
          animation: bounceIn 0.8s ease-out;
        }
        
        .animate-popIn {
          animation: popIn 0.5s ease-out;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
        
        .triangle {
          clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .hover\\:shadow-3xl:hover {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </div>
  );
}