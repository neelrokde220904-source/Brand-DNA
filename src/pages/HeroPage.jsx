import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ArrowRight } from 'lucide-react';

const MARQUEE_BRANDS = ['Phantom', 'Aether', 'Luma', 'Solace', 'Vantage', 'Meridian'];

export default function HeroPage() {
  const navigate = useNavigate();
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let rafId;
    const FADE_DURATION = 0.5; // seconds

    const tick = () => {
      const t = video.currentTime;
      const d = video.duration;
      if (!d || isNaN(d)) {
        rafId = requestAnimationFrame(tick);
        return;
      }

      if (t < FADE_DURATION) {
        video.style.opacity = (t / FADE_DURATION).toString();
      } else if (t > d - FADE_DURATION) {
        video.style.opacity = ((d - t) / FADE_DURATION).toString();
      } else {
        video.style.opacity = '1';
      }
      rafId = requestAnimationFrame(tick);
    };

    const onEnded = () => {
      video.style.opacity = '0';
      cancelAnimationFrame(rafId);
      setTimeout(() => {
        video.currentTime = 0;
        video.play().then(() => {
          rafId = requestAnimationFrame(tick);
        }).catch(() => {});
      }, 100);
    };

    video.addEventListener('ended', onEnded);
    video.play().then(() => {
      rafId = requestAnimationFrame(tick);
    }).catch(() => {});

    return () => {
      cancelAnimationFrame(rafId);
      video.removeEventListener('ended', onEnded);
    };
  }, []);

  return (
    <div className="relative overflow-hidden min-h-screen">
      <video
        ref={videoRef}
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_065045_c44942da-53c6-4804-b734-f9e07fc22e08.mp4"
        autoPlay
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: 0 }}
      />

      <div className="relative z-10 min-h-screen flex flex-col">
        <nav className="w-full py-5 px-8 flex flex-row justify-between items-center">
          <div className="flex items-center gap-2">
            <div
              className="liquid-glass rounded-lg w-8 h-8 flex items-center justify-center text-xs font-bold text-white/80"
              style={{ fontFamily: 'General Sans' }}
            >
              D
            </div>
            <span
              style={{ fontFamily: 'General Sans' }}
              className="font-bold text-lg text-white"
            >
              DNA
            </span>
          </div>

          <div className="flex items-center gap-8">
            <button className="text-white/90 hover:text-white text-sm transition-colors flex items-center gap-1">
              Features
            </button>
            <button className="text-white/90 hover:text-white text-sm transition-colors">
              How It Works
            </button>
            <button className="text-white/90 hover:text-white text-sm transition-colors flex items-center gap-1">
              Benchmark <ChevronDown size={14} />
            </button>
            <button className="text-white/90 hover:text-white text-sm transition-colors">
              Pricing
            </button>
          </div>

          <button
            onClick={() => navigate('/app')}
            className="liquid-glass rounded-full px-4 py-2 text-sm text-white/90 hover:text-white transition-colors"
          >
            Get Early Access
          </button>
        </nav>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent mt-[3px]" />

        <main className="flex-1 flex items-center justify-center overflow-visible relative px-8">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[984px] h-[527px] bg-gray-950 blur-[82px] opacity-90 pointer-events-none" />

          <div className="relative z-10 max-w-5xl w-full">
            <h1
              style={{
                fontFamily: 'General Sans',
                fontSize: 'clamp(80px,12vw,180px)',
                fontWeight: 400,
                lineHeight: 1.02,
                letterSpacing: '-0.024em',
              }}
            >
              <span className="text-white block">Brand</span>
              <span
                className="block bg-clip-text text-transparent"
                style={{
                  backgroundImage: 'linear-gradient(to left, #6366f1, #a855f7, #fcd34d)',
                }}
              >
                DNA
              </span>
            </h1>

            <p
              className="text-lg leading-8 max-w-md mt-[9px] opacity-80"
              style={{ color: 'hsl(var(--hero-sub))' }}
            >
              Decode any brand's geometry, surface language<br />
              and CMF direction — in seconds.
            </p>

            <button
              onClick={() => navigate('/app')}
              className="liquid-glass rounded-full flex items-center gap-2 text-white font-medium mt-[25px] hover:text-white transition-colors"
              style={{ padding: '18px 29px' }}
            >
              Analyze a Brand <ArrowRight size={16} />
            </button>
          </div>
        </main>

        <div className="pb-10">
          <div className="max-w-5xl mx-auto flex flex-row items-center gap-12 px-8">
            <p className="text-white/50 text-sm leading-6 shrink-0">
              Trusted by designers<br />at world-class brands
            </p>

            <div className="overflow-hidden flex-1">
              <div className="flex gap-16 animate-marquee">
                {[...MARQUEE_BRANDS, ...MARQUEE_BRANDS].map((b, i) => (
                  <div key={i} className="flex items-center gap-2 shrink-0">
                    <div className="liquid-glass w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold text-white/80">
                      {b.charAt(0)}
                    </div>
                    <span className="text-base font-semibold text-white">{b}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
