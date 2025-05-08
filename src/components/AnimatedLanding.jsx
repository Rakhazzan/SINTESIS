import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Registramos ScrollTrigger con GSAP
gsap.registerPlugin(ScrollTrigger);

const AnimatedLanding = ({ onAnimationComplete }) => {
    const mainRef = useRef(null);
    const listRef = useRef(null);
    const itemsRef = useRef([]);
    const titleRef = useRef(null);
    const finalSectionRef = useRef(null);
    
    const [config, setConfig] = useState({
        theme: 'dark',
        animate: true,
        snap: true,
        start: Math.floor(Math.random() * 100),
        end: Math.floor(Math.random() * 100) + 900,
        scroll: true,
        debug: false,
    });

    // Efecto para la tecla Enter
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Enter') {
                onAnimationComplete();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onAnimationComplete]);

    // Efecto para las animaciones con GSAP y ScrollTrigger
    useEffect(() => {
        if (!mainRef.current || !listRef.current) return;

        // Animación para cada elemento de la lista
        itemsRef.current.forEach((item, index) => {
            gsap.fromTo(
                item,
                { 
                    opacity: 0.2,
                    y: 20 
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    scrollTrigger: {
                        trigger: item,
                        start: 'top center+=100',
                        end: 'bottom center-=100',
                        toggleActions: 'play none none reverse',
                        scrub: 1,
                    }
                }
            );
        });

        // Animación para el título principal
        if (titleRef.current) {
            gsap.fromTo(
                titleRef.current,
                { 
                    opacity: 0.5,
                },
                {
                    opacity: 1,
                    scrollTrigger: {
                        trigger: mainRef.current,
                        start: 'top top',
                        end: 'bottom center',
                        scrub: true,
                    }
                }
            );
        }

        // Animación para la sección final
        if (finalSectionRef.current) {
            gsap.fromTo(
                finalSectionRef.current.querySelector('h2'),
                { 
                    scale: 0.8,
                    opacity: 0.5 
                },
                {
                    scale: 1,
                    opacity: 1,
                    duration: 1,
                    scrollTrigger: {
                        trigger: finalSectionRef.current,
                        start: 'top bottom',
                        end: 'center center',
                        scrub: true
                    }
                }
            );
        }

        // Cleanup
        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, [config.animate]);

    return (
        <>
          <style jsx global>{`
            @import url('https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap');
            @import url('https://unpkg.com/normalize.css') layer(normalize);

            @layer normalize, base, demo, stick, effect, srollbar, debug;

            @layer debug {
              [data-debug='true'] li {
                outline: 0.05em dashed currentColor;
              }
              [data-debug='true'] :is(h2, li:last-of-type) {
                outline: 0.05em dashed canvasText;
              }
            }

            @layer scrollbar {
              @property --hue {
                initial-value: 0;
                syntax: '<number>';
                inherits: false;
              }
              @property --chroma {
                initial-value: 0;
                syntax: '<number>';
                inherits: true;
              }

              [data-sync-scrollbar='true'] {
                scrollbar-color: oklch(var(--lightness) var(--chroma) var(--hue)) #0000;
              }
              @supports (animation-timeline: scroll()) and (animation-range: 0% 100%) {
                [data-sync-scrollbar='true'][data-animate='true'] {
                  timeline-scope: --list;
                  scrollbar-color: oklch(var(--lightness) var(--chroma, 0) var(--hue)) #0000;
                  animation-name: change, chroma-on, chroma-off;
                  animation-fill-mode: both;
                  animation-timing-function: linear;
                  animation-range: entry 50% exit 50%, entry 40% entry 50%,
                    exit 30% exit 40%;
                  animation-timeline: --list;
                  ul {
                    view-timeline: --list;
                  }
                }
              }

              @keyframes change {
                to {
                  --hue: var(--end);
                }
              }
              @keyframes chroma-on {
                to {
                  --chroma: 0.3;
                }
              }
              @keyframes chroma-off {
                to {
                  --chroma: 0;
                }
              }
            }

            @layer effect {
              :root {
                --start: 0;
                --end: 360;
                --lightness: 65%;
                --base-chroma: 0.3;
              }
              [data-theme='dark'] {
                --lightness: 75%;
              }
              [data-theme='light'] {
                --lightness: 65%;
              }
              @media (prefers-color-scheme: dark) {
                --lightness: 75%;
              }
              ul {
                --step: calc((var(--end) - var(--start)) / (var(--count) - 1));
              }
              li:not(:last-of-type) {
                color: oklch(
                  var(--lightness) var(--base-chroma)
                    calc(var(--start) + (var(--step) * var(--i)))
                );
              }
            }

            @layer stick {
              section:first-of-type {
                --font-level: 6;
                display: flex;
                line-height: 1.25;
                width: 100%;
                padding-left: 5rem;
                padding-top: 10vh;
              }
              section:last-of-type {
                min-height: 100vh;
                display: flex;
                place-items: center;
                width: 100%;
                justify-content: center;

                h2 {
                  --font-level: 6;
                }
              }
              main {
                width: 100%;
              }
              section:first-of-type h2 {
                position: sticky;
                top: calc(50% - 0.5lh);
                font-size: inherit;
                margin: 0;
                display: inline-block;
                height: fit-content;
                font-weight: 500;
              }
              ul {
                font-weight: 600;
                padding-inline: 0;
                margin: 0;
                list-style-type: none;
              }

              [data-snap='true'] {
                scroll-snap-type: y proximity;

                li {
                  scroll-snap-align: center;
                }
              }

              h2,
              li:last-of-type {
                background: linear-gradient(
                  canvasText 50%,
                  color-mix(in oklch, canvas, canvasText 25%)
                );
                background-clip: text;
                color: #0000;
              }
            }

            @layer demo {
              footer {
                padding-block: 2rem;
                opacity: 0.5;
              }
            }

            @layer base {
              :root {
                --font-size-min: 14;
                --font-size-max: 20;
                --font-ratio-min: 1.1;
                --font-ratio-max: 1.33;
                --font-width-min: 375;
                --font-width-max: 1500;
              }

              html {
                color-scheme: light dark;
              }

              [data-theme='light'] {
                color-scheme: light only;
              }

              [data-theme='dark'] {
                color-scheme: dark only;
              }

              :where(.fluid) {
                --fluid-min: calc(
                  var(--font-size-min) * pow(var(--font-ratio-min), var(--font-level, 0))
                );
                --fluid-max: calc(
                  var(--font-size-max) * pow(var(--font-ratio-max), var(--font-level, 0))
                );
                --fluid-preferred: calc(
                  (var(--fluid-max) - var(--fluid-min)) /
                    (var(--font-width-max) - var(--font-width-min))
                );
                --fluid-type: clamp(
                  (var(--fluid-min) / 16) * 1rem,
                  ((var(--fluid-min) / 16) * 1rem) -
                    (((var(--fluid-preferred) * var(--font-width-min)) / 16) * 1rem) +
                    (var(--fluid-preferred) * var(--variable-unit, 100vi)),
                  (var(--fluid-max) / 16) * 1rem
                );
                font-size: var(--fluid-type);
              }

              *,
              *:after,
              *:before {
                box-sizing: border-box;
              }

              body {
                display: grid;
                place-items: center;
                background: light-dark(white, black);
                min-height: 100vh;
                font-family: 'Geist', 'SF Pro Text', 'SF Pro Icons', 'AOS Icons',
                  'Helvetica Neue', Helvetica, Arial, sans-serif, system-ui;
              }

              body::before {
                --size: 45px;
                --line: color-mix(in hsl, canvasText, transparent 70%);
                content: '';
                height: 100vh;
                width: 100vw;
                position: fixed;
                background: linear-gradient(
                      90deg,
                      var(--line) 1px,
                      transparent 1px var(--size)
                    )
                    50% 50% / var(--size) var(--size),
                  linear-gradient(var(--line) 1px, transparent 1px var(--size)) 50% 50% /
                    var(--size) var(--size);
                mask: linear-gradient(-20deg, transparent 50%, white);
                top: 0;
                transform-style: flat;
                pointer-events: none;
                z-index: -1;
              }

              .med-link {
                color: canvasText;
                position: fixed;
                top: 1rem;
                left: 1rem;
                width: 48px;
                aspect-ratio: 1;
                display: grid;
                place-items: center;
                opacity: 0.8;
              }

              :where(.x-link, .med-link):is(:hover, :focus-visible) {
                opacity: 1;
              }

              .med-link svg {
                width: 75%;
              }

              /* Utilities */
              .sr-only {
                position: absolute;
                width: 1px;
                height: 1px;
                padding: 0;
                margin: -1px;
                overflow: hidden;
                clip: rect(0, 0, 0, 0);
                white-space: nowrap;
                border-width: 0;
              }
            }
          `}</style>
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
          <main ref={mainRef} data-theme={config.theme} data-snap={config.snap} data-animate={config.animate} data-sync-scrollbar={config.scroll} data-debug={config.debug}>
            <section className="content fluid">
              <h2 ref={titleRef}>
                <span aria-hidden="true">podemos&nbsp;</span>
                <span className="sr-only">podemos ayudarte con tu salud.</span>
              </h2>
              <ul ref={listRef} aria-hidden="true" style={{ "--count": 21 }}>
                {Array.from({ length: 21 }, (_, i) => {
                  const words = [
                    "diagnosticar", "prevenir", "curar", "rehabilitar", "acompañar",
                    "escuchar", "orientar", "monitorear", "analizar", "educar",
                    "investigar", "innovar", "operar", "vacunar", "tratar",
                    "cuidar", "servir", "atender", "mejorar", "sanar", "ayudarte"
                  ];
                  return (
                    <li 
                      key={i} 
                      style={{ "--i": i }} 
                      ref={el => (itemsRef.current[i] = el)}
                    >
                      {words[i]}.
                    </li>
                  );
                })}
              </ul>
            </section>
            <section ref={finalSectionRef}>
              <h2 className="fluid">Press Enter.</h2>
            </section>
          </main>
          <footer>M.AKHAZZAN &copy; 2025</footer>
        </>
    );
};

export default AnimatedLanding;