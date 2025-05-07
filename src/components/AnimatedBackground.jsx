import React from 'react';

const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-modern-black"></div>
      <div className="absolute top-[-100px] left-[-100px] w-96 h-96 bg-modern-purple rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute top-[-100px] right-[-100px] w-96 h-96 bg-modern-blue rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-100px] left-[-100px] w-96 h-96 bg-modern-red rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
      <div className="absolute bottom-[-100px] right-[-100px] w-96 h-96 bg-modern-purple rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-blob animation-delay-6000"></div>
    </div>
  );
};

export default AnimatedBackground;