import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const AnimatedBackground = () => {
  const containerRef = useRef(null);
  const blob1Ref = useRef(null);
  const blob2Ref = useRef(null);
  const blob3Ref = useRef(null);
  const blob4Ref = useRef(null);
  const blob5Ref = useRef(null);
  const blob6Ref = useRef(null);
  const starsRef = useRef(null);
  const cursorFollowerRef = useRef(null);
  const raindropsRef = useRef([]);
  const [raindrops, setRaindrops] = useState([]);

  // Efecto para las animaciones básicas del fondo
  useEffect(() => {
    // Referencias a los elementos
    const container = containerRef.current;
    const blob1 = blob1Ref.current;
    const blob2 = blob2Ref.current;
    const blob3 = blob3Ref.current;
    const blob4 = blob4Ref.current;
    const blob5 = blob5Ref.current;
    const blob6 = blob6Ref.current;
    const stars = starsRef.current;

    // Crear estrellas dinámicamente
    for (let i = 0; i < 100; i++) {
      const star = document.createElement('div');
      const size = Math.random() * 2;
      
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.position = 'absolute';
      star.style.backgroundColor = 'white';
      star.style.borderRadius = '50%';
      star.style.opacity = Math.random() * 0.8 + 0.2;
      
      stars.appendChild(star);

      // Animación de parpadeo para cada estrella
      gsap.to(star, {
        opacity: 0.1,
        duration: 0.5 + Math.random() * 2,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });
    }

    // Animación para blob1
    gsap.to(blob1, {
      x: '+=120',
      y: '+=150',
      scale: 1.2,
      duration: 18,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true
    });
    
    // Animación para blob2
    gsap.to(blob2, {
      x: '-=100',
      y: '+=160',
      scale: 1.3,
      duration: 19,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true
    });
    
    // Animación para blob3
    gsap.to(blob3, {
      x: '+=150',
      y: '-=120',
      scale: 1.4,
      duration: 17,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true
    });
    
    // Animación para blob4
    gsap.to(blob4, {
      x: '-=120',
      y: '-=150',
      scale: 1.1,
      duration: 20,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true
    });
    
    // Animación para blob5
    gsap.to(blob5, {
      x: '+=80',
      y: '+=80',
      scale: 1.2,
      duration: 15,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true
    });
    
    // Animación para blob6
    gsap.to(blob6, {
      x: '-=80',
      y: '-=100',
      scale: 1.3,
      duration: 16,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true
    });

    // Animación de cambio de color para cada blob
    const colors = ['#3ddad7', '#5f72be', '#c084fc', '#99f6e4', '#6366f1', '#f87171'];
    
    [blob1, blob2, blob3, blob4, blob5, blob6].forEach((blob, index) => {
      gsap.to(blob, {
        backgroundColor: () => colors[(index + 1) % colors.length],
        duration: 10 + index * 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
      
      // Animación de opacidad pulsante
      gsap.to(blob, {
        opacity: 0.3,
        duration: 3 + index,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    });

    // Efectos de desplazamiento suave del fondo
    gsap.to(container, {
      backgroundPosition: '100% 100%',
      duration: 60,
      repeat: -1,
      ease: "none",
      yoyo: true
    });

    return () => {
      // Limpiar animaciones cuando el componente se desmonte
      gsap.killTweensOf([blob1, blob2, blob3, blob4, blob5, blob6, stars, container]);
    };
  }, []);

  // Efecto para el seguimiento del ratón
  useEffect(() => {
    const container = containerRef.current;
    const cursorFollower = cursorFollowerRef.current;
    
    if (!container || !cursorFollower) return;

    const handleMouseMove = (e) => {
      // Calculamos posición relativa al contenedor
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Animación suave al seguir el cursor
      gsap.to(cursorFollower, {
        x: x - cursorFollower.offsetWidth / 2,
        y: y - cursorFollower.offsetHeight / 2,
        duration: 0.3,
        ease: "power2.out"
      });
    };

    const handleClick = (e) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Crear un nuevo ID único para la gota
      const id = `raindrop-${Date.now()}`;
      
      // Añadir la nueva gota con su posición
      setRaindrops(prev => [...prev, { id, x, y }]);
      
      // Eliminar la gota después de que termine la animación
      setTimeout(() => {
        setRaindrops(prev => prev.filter(drop => drop.id !== id));
      }, 2000);
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('click', handleClick);
    
    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('click', handleClick);
    };
  }, []);

  // Efecto para animar las gotas de lluvia cuando se crean
  useEffect(() => {
    raindrops.forEach(drop => {
      const element = document.getElementById(drop.id);
      if (element) {
        // Animar la gota expandiéndose y desvaneciéndose
        gsap.fromTo(element, 
          { 
            scale: 0,
            opacity: 0.8
          },
          { 
            scale: 4,
            opacity: 0,
            duration: 1.5,
            ease: "power1.out"
          }
        );
        
        // Animar los círculos concéntricos expandiéndose
        const circles = element.querySelectorAll('.raindrop-circle');
        circles.forEach((circle, index) => {
          gsap.fromTo(circle,
            { 
              scale: 0, 
              opacity: 0.6 
            },
            { 
              scale: 1 + index * 0.5, 
              opacity: 0,
              duration: 1 + index * 0.3,
              delay: index * 0.1,
              ease: "sine.out"
            }
          );
        });
      }
    });
  }, [raindrops]);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 z-[-1] overflow-hidden bg-gradient-to-br from-gray-900 to-black"
      style={{ backgroundSize: '200% 200%' }}
    >
      {/* Capa de estrellas */}
      <div ref={starsRef} className="absolute inset-0"></div>
      
      {/* Burbujas */}
      <div 
        ref={blob1Ref} 
        className="absolute top-[-100px] left-[-100px] w-64 h-64 rounded-full mix-blend-screen filter blur-3xl opacity-50"
        style={{ backgroundColor: '#3ddad7' }}
      ></div>
      
      <div 
        ref={blob2Ref} 
        className="absolute top-[-150px] right-[-50px] w-80 h-80 rounded-full mix-blend-screen filter blur-3xl opacity-50"
        style={{ backgroundColor: '#5f72be' }}
      ></div>
      
      <div 
        ref={blob3Ref} 
        className="absolute bottom-[-120px] left-[-80px] w-72 h-72 rounded-full mix-blend-screen filter blur-3xl opacity-50"
        style={{ backgroundColor: '#c084fc' }}
      ></div>
      
      <div 
        ref={blob4Ref} 
        className="absolute bottom-[-100px] right-[-90px] w-64 h-64 rounded-full mix-blend-screen filter blur-3xl opacity-50"
        style={{ backgroundColor: '#99f6e4' }}
      ></div>
      
      <div 
        ref={blob5Ref} 
        className="absolute top-[30%] left-[20%] w-56 h-56 rounded-full mix-blend-screen filter blur-3xl opacity-40"
        style={{ backgroundColor: '#6366f1' }}
      ></div>
      
      <div 
        ref={blob6Ref} 
        className="absolute bottom-[40%] right-[30%] w-48 h-48 rounded-full mix-blend-screen filter blur-3xl opacity-40"
        style={{ backgroundColor: '#f87171' }}
      ></div>

      {/* Elemento que sigue al cursor */}
      <div 
        ref={cursorFollowerRef}
        className="absolute w-12 h-12 rounded-full pointer-events-none mix-blend-screen filter blur-md"
        style={{ 
          background: 'radial-gradient(circle, rgba(147,197,253,0.7) 0%, rgba(99,102,241,0.2) 80%)',
          transform: 'translate(-100px, -100px)' // Posición inicial fuera de la pantalla
        }}
      ></div>

      {/* Gotas de lluvia que aparecen al hacer clic */}
      {raindrops.map((drop) => (
        <div 
          key={drop.id}
          id={drop.id}
          className="absolute pointer-events-none"
          style={{ 
            left: drop.x, 
            top: drop.y, 
            transform: 'translate(-50%, -50%)'
          }}
        >
          {/* Círculos concéntricos para el efecto de gota */}
          <div className="raindrop-circle absolute w-40 h-40 rounded-full border-2 border-blue-400 opacity-0"></div>
          <div className="raindrop-circle absolute w-32 h-32 rounded-full border-2 border-blue-300 opacity-0"></div>
          <div className="raindrop-circle absolute w-24 h-24 rounded-full border-2 border-blue-200 opacity-0"></div>
          <div className="raindrop-circle absolute w-16 h-16 rounded-full bg-blue-500 opacity-0 mix-blend-screen filter blur-sm"></div>
        </div>
      ))}
    </div>
  );
};

export default AnimatedBackground;