import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, FastForward, Shield } from 'lucide-react';

interface LaunchSplashScreenProps {
  onComplete: () => void;
  durationSeconds?: number;
}

export const LaunchSplashScreen: React.FC<LaunchSplashScreenProps> = ({
  onComplete,
  durationSeconds = 8,
}) => {
  const [timeLeft, setTimeLeft] = useState(durationSeconds);
  const [isMuted, setIsMuted] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [bootStatus, setBootStatus] = useState('INITIALIZING CORE SYSTEM...');
  const videoRef = useRef<HTMLVideoElement>(null);

  // Status message sequence aligned with 8 seconds
  useEffect(() => {
    const statuses = [
      { time: 8, text: 'INITIALIZING CIPHER-X SECURE KERNEL...' },
      { time: 6, text: 'LOADING MULTI-VENDOR AST PARSING ENGINES (CISCO, JUNIPER, FORTINET)...' },
      { time: 4, text: 'SYNCHRONIZING CIS, NIST 800-53 & DISA STIG CONTROL LIBRARIES...' },
      { time: 2, text: 'ESTABLISHING SHA-256 IMMUTABLE LEDGER & NEURAL MAPPING...' },
      { time: 1, text: 'SYSTEM OPERATIONAL · LAUNCHING WORKSPACE...' },
    ];

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          triggerExit();
          return 0;
        }
        const nextTime = prev - 1;
        const currentStatus = statuses.find(s => s.time >= nextTime)?.text;
        if (currentStatus) setBootStatus(currentStatus);
        return nextTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [durationSeconds]);

  // Attempt video play
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(err => {
        console.warn('Autoplay prevented, video will play muted:', err);
      });
    }
  }, []);

  const triggerExit = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      onComplete();
    }, 800); // 800ms smooth fade transition
  };

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      const nextMuted = !videoRef.current.muted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
    }
  };

  const progressPercent = Math.min(100, Math.max(0, ((durationSeconds - timeLeft) / durationSeconds) * 100));

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: '#0a0d0c',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        opacity: isFadingOut ? 0 : 1,
        transition: 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
        pointerEvents: isFadingOut ? 'none' : 'auto',
      }}
    >
      {/* Background Launch Video */}
      <video
        ref={videoRef}
        src="/launch-video.mp4"
        autoPlay
        playsInline
        muted={isMuted}
        loop
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: 'brightness(0.9) contrast(1.08)',
        }}
      />

      {/* Cybernetic Ambient Vignette & Scanline Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, rgba(16, 22, 20, 0.2) 0%, rgba(10, 13, 12, 0.85) 85%, #080a09 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Top HUD Bar */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          padding: '24px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 10,
          background: 'linear-gradient(180deg, rgba(8, 10, 9, 0.85) 0%, transparent 100%)',
        }}
      >
        {/* Brand & Platform Identifier */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <img
            src="/app-logo.png"
            alt="Cipher-X Logo"
            style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              objectFit: 'contain',
              boxShadow: '0 0 20px rgba(255, 107, 0, 0.5)',
              border: '1.5px solid rgba(255, 107, 0, 0.5)',
            }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 18, fontWeight: 800, color: '#fff', letterSpacing: '0.08em', fontFamily: "'Inter', sans-serif" }}>
                CIPHER-X
              </span>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: 'var(--cx-orange, #ff6b00)',
                  background: 'rgba(255, 107, 0, 0.15)',
                  padding: '2px 8px',
                  borderRadius: 4,
                  border: '1px solid rgba(255, 107, 0, 0.3)',
                  letterSpacing: '0.05em',
                }}
              >
                ENTERPRISE
              </span>
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255, 255, 255, 0.55)', letterSpacing: '0.04em', marginTop: 2 }}>
              Network Security & Automated Compliance Engine
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            aria-label={isMuted ? 'Unmute video audio' : 'Mute video audio'}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: 8,
              padding: '8px 12px',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              cursor: 'pointer',
              backdropFilter: 'blur(8px)',
              fontSize: 12,
              fontWeight: 500,
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.18)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)')}
          >
            {isMuted ? <VolumeX size={15} color="rgba(255,255,255,0.7)" /> : <Volume2 size={15} color="#ff6b00" />}
            <span>{isMuted ? 'Muted' : 'Audio On'}</span>
          </button>

          {/* Skip Button */}
          <button
            onClick={triggerExit}
            style={{
              background: 'rgba(255, 107, 0, 0.2)',
              border: '1px solid rgba(255, 107, 0, 0.5)',
              borderRadius: 8,
              padding: '8px 16px',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              cursor: 'pointer',
              backdropFilter: 'blur(8px)',
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '0.04em',
              boxShadow: '0 0 15px rgba(255, 107, 0, 0.25)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'var(--cx-orange, #ff6b00)';
              e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 107, 0, 0.5)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255, 107, 0, 0.2)';
              e.currentTarget.style.boxShadow = '0 0 15px rgba(255, 107, 0, 0.25)';
            }}
          >
            <span>Skip Intro ({timeLeft}s)</span>
            <FastForward size={14} />
          </button>
        </div>
      </div>

      {/* Bottom Telemetry & Bootstrap HUD */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '24px 32px 32px',
          background: 'linear-gradient(0deg, rgba(8, 10, 9, 0.95) 0%, rgba(8, 10, 9, 0.6) 60%, transparent 100%)',
          zIndex: 10,
        }}
      >
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          {/* Status Text & Countdown */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 12,
              fontSize: 12,
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span
                style={{
                  display: 'inline-block',
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: 'var(--cx-orange, #ff6b00)',
                  boxShadow: '0 0 8px #ff6b00',
                  animation: 'pulse 1.2s infinite',
                }}
              />
              <span style={{ color: 'rgba(255, 255, 255, 0.9)', letterSpacing: '0.04em' }}>
                {bootStatus}
              </span>
            </div>
            <div style={{ color: 'rgba(255, 255, 255, 0.5)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>BOOT_TIME:</span>
              <span style={{ color: 'var(--cx-orange, #ff6b00)', fontWeight: 700 }}>
                00:0{timeLeft}s
              </span>
            </div>
          </div>

          {/* Glowing Animated Progress Bar */}
          <div
            style={{
              width: '100%',
              height: 4,
              background: 'rgba(255, 255, 255, 0.12)',
              borderRadius: 2,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <div
              style={{
                width: `${progressPercent}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #ff4500, #ff6b00, #ff9e00)',
                boxShadow: '0 0 12px #ff6b00',
                transition: 'width 1s linear',
              }}
            />
          </div>

          {/* Quick Specifications */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: 10,
              fontSize: 10,
              color: 'rgba(255, 255, 255, 0.4)',
              letterSpacing: '0.05em',
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            <span>COMPLIANCE: CIS · NIST · DISA STIG · ISO 27001</span>
            <span>AST PARSER: CISCO IOS-XE / JUNOS / FORTIOS / PAN-OS</span>
            <span>INTEGRITY: MERKLE TREE SHA-256</span>
          </div>
        </div>
      </div>
    </div>
  );
};
