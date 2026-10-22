import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Shuffle,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Maximize,
  Minimize,
  Info,
  Clock,
  LayoutGrid,
  ArrowLeft,
  Check,
  Sparkles,
  ExternalLink,
  SlidersHorizontal,
} from 'lucide-react';
import { useSEO } from '@/hooks/useSEO';

// Real Cloudinary image set from account 'mongotise'
export interface CloudinaryWallpaper {
  url: string;
  publicId: string;
  title: string;
  category: 'Oktopuse' | 'Corporate' | 'Estates' | 'Web Assets';
  resolution?: string;
}

const CLOUDINARY_WALLPAPERS: CloudinaryWallpaper[] = [
  {
    url: 'https://res.cloudinary.com/mongotise/image/upload/v1791955351/Mongotise/Triumphant_Sunrise__You_ve_Got_This_srs4gm.png',
    publicId: 'Mongotise/Triumphant_Sunrise__You_ve_Got_This_srs4gm',
    title: 'Triumphant Sunrise | You\'ve Got This',
    category: 'Oktopuse',
    resolution: '1920 × 1080',
  },
  {
    url: 'https://res.cloudinary.com/mongotise/image/upload/v1791955347/Mongotise/Nine-panel_motivational_inspiration_collage_1_n7y3h4.png',
    publicId: 'Mongotise/Nine-panel_motivational_inspiration_collage_1_n7y3h4',
    title: 'Keep Going Forward',
    category: 'Corporate',
    resolution: '3840 × 2160',
  },
  {
    url: 'https://res.cloudinary.com/mongotise/image/upload/v1791955347/Mongotise/Nine-panel_motivational_inspiration_collage_3_ryf81t.png',
    publicId: 'Mongotise/Nine-panel_motivational_inspiration_collage_3_ryf81t',
    title: 'You Matter',
    category: 'Oktopuse',
    resolution: '1920 × 1028',
  },
  {
    url: 'https://res.cloudinary.com/mongotise/image/upload/v1791955347/Mongotise/Nine-panel_motivational_inspiration_collage_2_mdfmvs.png',
    publicId: 'Mongotise/Nine-panel_motivational_inspiration_collage_2_mdfmvs',
    title: 'Stay Focused',
    category: 'Corporate',
    resolution: '3840 × 2160',
  },
  {
    url: 'https://res.cloudinary.com/mongotise/image/upload/v1791955347/Mongotise/Nine-panel_motivational_inspiration_collage_4_cnjhk0.png',
    publicId: 'Mongotise/Nine-panel_motivational_inspiration_collage_4_cnjhk0',
    title: 'Keep the Momentum',
    category: 'Oktopuse',
    resolution: '1920 × 1080',
  },
  {
    url: 'https://res.cloudinary.com/mongotise/image/upload/v1791955347/Mongotise/Nine-panel_motivational_inspiration_collage_5_nv6d7l.png',
    publicId: 'Mongotise/Nine-panel_motivational_inspiration_collage_5_nv6d7l',
    title: 'Keep Shining',
    category: 'Oktopuse',
    resolution: '1920 × 1080',
  },
  {
    url: 'https://res.cloudinary.com/mongotise/image/upload/v1791955346/Mongotise/Nine-panel_motivational_inspiration_collage_7_wmwnma.png',
    publicId: 'Mongotise/Nine-panel_motivational_inspiration_collage_7_wmwnma',
    title: 'Brilliant Work',
    category: 'Oktopuse',
    resolution: '1920 × 1080',
  },
  {
    url: 'https://res.cloudinary.com/mongotise/image/upload/v1791955346/Mongotise/Nine-panel_motivational_inspiration_collage_6_trfmfx.png',
    publicId: 'Mongotise/Nine-panel_motivational_inspiration_collage_6_trfmfx',
    title: 'Keep Growing',
    category: 'Oktopuse',
    resolution: '1920 × 1080',
  },

  {
    url: 'https://res.cloudinary.com/mongotise/image/upload/v1792551270/Mongotise/Small_Steps_Big_Results_so8fsx.png',
    publicId: 'Mongotise/Nine-panel_motivational_inspiration_collage_5_nv6d7l',
    title: 'Small Steps, Big Results',
    category: 'Oktopuse',
    resolution: '1920 × 1080',
  },
  {
    url: 'https://res.cloudinary.com/mongotise/image/upload/v1792551270/Mongotise/Keep_Up_the_Great_Work_Desk_gfzlob.png',
    publicId: 'Mongotise/Nine-panel_motivational_inspiration_collage_7_wmwnma',
    title: 'Keep Up the Great Work',
    category: 'Oktopuse',
    resolution: '1920 × 1080',
  },
  {
    url: 'https://res.cloudinary.com/mongotise/image/upload/v1792551270/Mongotise/You_re_Doing_Great_Mountain_Sunrise_osnpdr.png',
    publicId: 'Mongotise/You_re_Doing_Great_Mountain_Sunrise_osnpdr',
    title: 'You\'re Doing Great',
    category: 'Oktopuse',
    resolution: '1920 × 1080',
  },






  {
    url: 'https://res.cloudinary.com/mongotise/image/upload/v1792636763/Mongotise/wallpaper_9_qchmwm.png',
    publicId: 'Mongotise/wallpaper_9_qchmwm',
    title: 'Stay Consistent',
    category: 'Oktopuse',
    resolution: '1920 × 1080',
  },
  {
    url: 'https://res.cloudinary.com/mongotise/image/upload/v1792636763/Mongotise/wallpaper_8_u5twwz.png',
    publicId: 'Mongotise/Nine-panel_motivational_inspiration_collage_7_wmwnma',
    title: 'Progress Not Perfection',
    category: 'Oktopuse',
    resolution: '1920 × 1080',
  },
  {
    url: 'https://res.cloudinary.com/mongotise/image/upload/v1792636767/Mongotise/wallpaper_6_sdw4c4.png',
    publicId: 'Mongotise/wallpaper_6_sdw4c4',
    title: 'Stay Curious',
    category: 'Oktopuse',
    resolution: '1920 × 1080',
  },


  {
    url: 'https://res.cloudinary.com/mongotise/image/upload/v1792636766/Mongotise/wallpaper_5_xuuiex.png',
    publicId: 'Mongotise/wallpaper_5_vav3bn',
    title: 'Stay Curious',
    category: 'Oktopuse',
    resolution: '1920 × 1080',
  },
  {
    url: 'https://res.cloudinary.com/mongotise/image/upload/v1792636769/Mongotise/wallpaper_4_mtdroy.png',
    publicId: 'Mongotise/wallpaper_4_mtdroy',
    title: 'Focus on the Goal',
    category: 'Oktopuse',
    resolution: '1920 × 1080',
  },

  {
    url: 'https://res.cloudinary.com/mongotise/image/upload/v1792636770/Mongotise/wallpaper_3_uq5zob.png',
    publicId: 'Mongotise/wallpaper_3_uq5zob',
    title: 'Stay Curious',
    category: 'Oktopuse',
    resolution: '1920 × 1080',
  },

  {
    url: 'https://res.cloudinary.com/mongotise/image/upload/v1792636772/Mongotise/wallpaper_1_hmcec9.png',
    publicId: 'Mongotise/wallpaper_1_hmcec9',
    title: 'Stay Focused',
    category: 'Oktopuse',
    resolution: '1920 × 1080',
  },
  {
    url: 'https://res.cloudinary.com/mongotise/image/upload/v1792636770/Mongotise/wallpaper_2_guh4co.png',
    publicId: 'Mongotise/wallpaper_2_guh4co',
    title: 'Keep it Going',
    category: 'Oktopuse',
    resolution: '1920 × 1080',
  },



];

// Randomization interval options in seconds
const INTERVAL_OPTIONS = [
  { label: '10 sec (Demo)', seconds: 10 },
  { label: '1 min', seconds: 60 },
  { label: '5 min', seconds: 300 },
  { label: '10 min', seconds: 600 },
  { label: '20 min (Default)', seconds: 1200 },
  { label: '30 min', seconds: 1800 },
  { label: '1 hour', seconds: 3600 },
];

export default function MongotiseWallpaperPage() {
  useSEO({
    title: 'Mongotise Wallpapers | Oktopuse',
    description:
      'Immersive Cloudinary wallpaper showcase automatically randomizing every 20 minutes with high-definition property and architectural scenes.',
  });

  const wallpapers = CLOUDINARY_WALLPAPERS;

  // Category filtering
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const categories = useMemo(() => {
    return ['All', 'Oktopuse', 'Corporate', 'Estates', 'Web Assets'];
  }, []);

  const filteredWallpapers = useMemo(() => {
    if (selectedCategory === 'All') return wallpapers;
    return wallpapers.filter((w) => w.category === selectedCategory);
  }, [wallpapers, selectedCategory]);

  // Active wallpaper state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayedUrl, setDisplayedUrl] = useState<string>(
    CLOUDINARY_WALLPAPERS[0].url
  );
  const [previousUrl, setPreviousUrl] = useState<string>('');
  const [isCrossfading, setIsCrossfading] = useState(false);

  // Timer & Controls
  const [intervalSeconds, setIntervalSeconds] = useState(1200); // 20 minutes default (1200 seconds)
  const [secondsRemaining, setSecondsRemaining] = useState(1200);
  const [isPaused, setIsPaused] = useState(false);
  const [fitMode, setFitMode] = useState<'cover' | 'contain'>('cover');
  const [showGallery, setShowGallery] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [justRandomized, setJustRandomized] = useState(false);

  const hideControlsTimeout = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentWallpaper = filteredWallpapers[currentIndex] || wallpapers[0];

  // Smooth crossfade to a new image
  const applyWallpaper = useCallback(
    (newIndex: number) => {
      const nextW = filteredWallpapers[newIndex] || wallpapers[0];
      if (!nextW || nextW.url === displayedUrl) return;

      setPreviousUrl(displayedUrl);
      setDisplayedUrl(nextW.url);
      setCurrentIndex(newIndex);
      setIsCrossfading(true);
      setSecondsRemaining(intervalSeconds);

      // Preload next image
      const img = new Image();
      img.src = nextW.url;

      setTimeout(() => {
        setIsCrossfading(false);
      }, 1000);
    },
    [filteredWallpapers, wallpapers, displayedUrl, intervalSeconds]
  );

  // Randomize to a different image
  const randomizeWallpaper = useCallback(() => {
    if (filteredWallpapers.length <= 1) return;
    let nextIdx = currentIndex;
    let attempts = 0;
    while (nextIdx === currentIndex && attempts < 10) {
      nextIdx = Math.floor(Math.random() * filteredWallpapers.length);
      attempts++;
    }
    applyWallpaper(nextIdx);
    setJustRandomized(true);
    setTimeout(() => setJustRandomized(false), 2000);
  }, [filteredWallpapers, currentIndex, applyWallpaper]);

  // Next / Prev navigation
  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % filteredWallpapers.length;
    applyWallpaper(nextIdx);
  };

  const handlePrev = () => {
    const prevIdx =
      (currentIndex - 1 + filteredWallpapers.length) % filteredWallpapers.length;
    applyWallpaper(prevIdx);
  };

  // 20-minute automatic countdown & randomizer
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          randomizeWallpaper();
          return intervalSeconds;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, intervalSeconds, randomizeWallpaper]);

  // Interval adjustment
  const handleIntervalChange = (newSecs: number) => {
    setIntervalSeconds(newSecs);
    setSecondsRemaining(newSecs);
  };

  // Fullscreen support
  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await containerRef.current?.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) {
      console.warn('Fullscreen error:', err);
    }
  };

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () =>
      document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        setIsPaused((p) => !p);
      }
      if (e.key.toLowerCase() === 'r') randomizeWallpaper();
      if (e.key.toLowerCase() === 'f') toggleFullscreen();
      if (e.key.toLowerCase() === 'g') setShowGallery((g) => !g);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, randomizeWallpaper]);

  // Auto-hide controls during inactivity
  const resetHideTimer = useCallback(() => {
    setControlsVisible(true);
    if (hideControlsTimeout.current) clearTimeout(hideControlsTimeout.current);
    hideControlsTimeout.current = setTimeout(() => {
      if (!showGallery && !showInfo) {
        setControlsVisible(false);
      }
    }, 4500);
  }, [showGallery, showInfo]);

  useEffect(() => {
    window.addEventListener('mousemove', resetHideTimer);
    window.addEventListener('touchstart', resetHideTimer);
    resetHideTimer();
    return () => {
      window.removeEventListener('mousemove', resetHideTimer);
      window.removeEventListener('touchstart', resetHideTimer);
      if (hideControlsTimeout.current) clearTimeout(hideControlsTimeout.current);
    };
  }, [resetHideTimer]);

  // Format MM:SS
  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Progress percentage (0 - 100)
  const progressPercent = Math.min(
    100,
    Math.max(0, ((intervalSeconds - secondsRemaining) / intervalSeconds) * 100)
  );

  return (
    <div
      ref={containerRef}
      className='relative w-screen h-screen overflow-hidden bg-black select-none font-sans'
    >
      {/* AMBIENT BLURRED BACKDROP (for contain mode or ultra-wide images) */}
      <div
        className='absolute inset-0 bg-cover bg-center scale-110 blur-3xl opacity-40 transition-all duration-1000 transform'
        style={{ backgroundImage: `url(${displayedUrl})` }}
      />

      {/* PREVIOUS WALLPAPER (crossfade) */}
      {isCrossfading && previousUrl && (
        <div
          className='absolute inset-0 z-0 transition-opacity duration-1000 opacity-0'
          style={{
            backgroundImage: `url(${previousUrl})`,
            backgroundPosition: 'center',
            backgroundSize: fitMode === 'cover' ? 'cover' : 'contain',
            backgroundRepeat: 'no-repeat',
          }}
        />
      )}

      {/* CURRENT ACTIVE WALLPAPER */}
      <div
        className='absolute inset-0 z-0 transition-opacity duration-1000 opacity-100'
        style={{
          backgroundImage: `url(${displayedUrl})`,
          backgroundPosition: 'center',
          backgroundSize: fitMode === 'cover' ? 'cover' : 'contain',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* VIGNETTE GRADIENTS FOR CRISP UI LEGIBILITY */}
      <div className='absolute inset-0 z-10 pointer-events-none bg-gradient-to-t from-black/75 via-transparent to-black/60' />

      {/* RANDOMIZED TOAST NOTIFICATION */}
      {justRandomized && (
        <div className='absolute top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-white flex items-center gap-2.5 shadow-2xl animate-in fade-in zoom-in-95 duration-200'>
          <Sparkles className='w-4 h-4 text-amber-400 animate-spin' />
          <span className='text-xs sm:text-sm font-medium tracking-wide'>
            Wallpaper Randomized! Next rotation in {formatTimer(intervalSeconds)}
          </span>
        </div>
      )}

      {/* TOP HEADER BAR */}
      <header
        className={`absolute top-0 inset-x-0 z-40 p-4 sm:p-6 flex items-center justify-between transition-all duration-500 ${controlsVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 -translate-y-4 pointer-events-none'
          }`}
      >
        {/* Brand & Return Navigation */}
        <div className='flex items-center gap-3'>
          <Link
            to='/'
            className='flex items-center gap-2 px-3.5 py-2 rounded-xl bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/15 text-white/90 hover:text-white transition-colors duration-200 text-xs sm:text-sm font-medium shadow-lg group'
          >
            <ArrowLeft className='w-4 h-4 group-hover:-translate-x-0.5 transition-transform' />
            <span>Oktopuse</span>
          </Link>

          <div className='hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-white/80 text-xs font-medium'>
            <span className='inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse' />
            <span>Mongotise Cloudinary Wallpapers</span>
          </div>
        </div>

        {/* 20-Minute Countdown Clock Widget */}
        <div className='flex items-center gap-3'>
          <div className='flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-black/50 backdrop-blur-md border border-white/15 text-white shadow-xl'>
            {/* Circular Mini Progress Ring */}
            <div className='relative w-5 h-5 flex items-center justify-center'>
              <svg className='w-5 h-5 -rotate-90 transform' viewBox='0 0 36 36'>
                <path
                  className='text-white/20'
                  strokeWidth='3.5'
                  stroke='currentColor'
                  fill='none'
                  d='M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831'
                />
                <path
                  className='text-amber-400 transition-all duration-1000'
                  strokeDasharray={`${progressPercent}, 100`}
                  strokeWidth='3.5'
                  strokeLinecap='round'
                  stroke='currentColor'
                  fill='none'
                  d='M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831'
                />
              </svg>
            </div>

            <div className='flex flex-col text-left leading-tight'>
              <span className='text-[10px] text-white/60 font-medium uppercase tracking-wider'>
                {isPaused ? 'Paused' : 'Randomizes In'}
              </span>
              <span className='text-xs sm:text-sm font-semibold tracking-mono'>
                {formatTimer(secondsRemaining)}
              </span>
            </div>

            <button
              onClick={() => setIsPaused((p) => !p)}
              className='ml-1 p-1 rounded-md hover:bg-white/10 text-white/80 hover:text-white transition-colors'
              title={isPaused ? 'Resume countdown' : 'Pause countdown'}
            >
              {isPaused ? (
                <Play className='w-3.5 h-3.5' />
              ) : (
                <Pause className='w-3.5 h-3.5' />
              )}
            </button>
          </div>

          {/* Info Modal Button */}
          <button
            onClick={() => setShowInfo((i) => !i)}
            className={`p-2.5 rounded-xl backdrop-blur-md border transition-all ${showInfo
              ? 'bg-white text-black border-white'
              : 'bg-black/40 hover:bg-black/60 border-white/15 text-white/80 hover:text-white'
              }`}
            title='Image Details'
          >
            <Info className='w-4 h-4' />
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className='p-2.5 rounded-xl bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/15 text-white/80 hover:text-white transition-all hidden sm:block'
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen (F)'}
          >
            {isFullscreen ? (
              <Minimize className='w-4 h-4' />
            ) : (
              <Maximize className='w-4 h-4' />
            )}
          </button>
        </div>
      </header>

      {/* METADATA INFO POPUP */}
      {showInfo && (
        <div className='absolute top-20 right-4 sm:right-6 z-40 w-80 max-w-[calc(100vw-2rem)] rounded-2xl bg-black/80 backdrop-blur-xl border border-white/20 p-5 text-white shadow-2xl animate-in fade-in slide-in-from-top-4 duration-200'>
          <div className='flex items-center justify-between pb-3 border-b border-white/10 mb-3'>
            <div className='flex items-center gap-2'>
              <Sparkles className='w-4 h-4 text-amber-400' />
              <h3 className='font-semibold text-sm'>Cloudinary Asset</h3>
            </div>
            <button
              onClick={() => setShowInfo(false)}
              className='text-white/60 hover:text-white text-xs'
            >
              Close
            </button>
          </div>

          <div className='space-y-2.5 text-xs'>
            <div>
              <span className='text-white/50 block'>Title</span>
              <p className='font-medium text-white/95 mt-0.5'>
                {currentWallpaper?.title || 'Wallpaper'}
              </p>
            </div>

            <div className='grid grid-cols-2 gap-2'>
              <div>
                <span className='text-white/50 block'>Category</span>
                <span className='inline-block px-2 py-0.5 rounded bg-white/10 text-white/90 font-mono mt-0.5 text-[11px]'>
                  {currentWallpaper?.category || 'General'}
                </span>
              </div>
              <div>
                <span className='text-white/50 block'>Resolution</span>
                <span className='inline-block font-mono text-white/90 mt-0.5 text-[11px]'>
                  {currentWallpaper?.resolution || 'High Definition'}
                </span>
              </div>
            </div>

            <div>
              <span className='text-white/50 block'>Cloudinary Account</span>
              <span className='font-mono text-amber-300'>mongotise</span>
            </div>

            <div>
              <span className='text-white/50 block'>Cycle Duration</span>
              <div className='flex flex-wrap gap-1.5 mt-1'>
                {INTERVAL_OPTIONS.map((opt) => (
                  <button
                    key={opt.seconds}
                    onClick={() => handleIntervalChange(opt.seconds)}
                    className={`px-2 py-1 rounded-md text-[10px] font-medium transition-colors ${intervalSeconds === opt.seconds
                      ? 'bg-amber-400 text-black font-semibold'
                      : 'bg-white/10 hover:bg-white/20 text-white/80'
                      }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className='pt-2 flex items-center gap-2 border-t border-white/10'>
              <a
                href={currentWallpaper?.url}
                target='_blank'
                rel='noopener noreferrer'
                className='flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors'
              >
                <ExternalLink className='w-3.5 h-3.5' />
                <span>Open Original</span>
              </a>
              <button
                onClick={() =>
                  setFitMode((m) => (m === 'cover' ? 'contain' : 'cover'))
                }
                className='px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors'
              >
                Fit: {fitMode === 'cover' ? 'Fill' : 'Fit'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BOTTOM FLOATING CONTROLS DOCK */}
      <div
        className={`absolute bottom-6 inset-x-0 z-40 flex flex-col items-center gap-3 px-4 transition-all duration-500 ${controlsVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-4 pointer-events-none'
          }`}
      >
        {/* Main Dock Pill */}
        <div className='flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/20 text-white shadow-2xl'>
          {/* Previous */}
          <button
            onClick={handlePrev}
            className='p-2 sm:p-2.5 rounded-xl hover:bg-white/10 text-white/80 hover:text-white transition-colors'
            title='Previous Wallpaper (Left Arrow)'
          >
            <ChevronLeft className='w-5 h-5' />
          </button>

          {/* Randomize Action Button (Hero) */}
          <button
            onClick={randomizeWallpaper}
            className='flex items-center gap-2 px-4 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-semibold text-xs sm:text-sm shadow-lg shadow-amber-500/25 active:scale-95 transition-all'
            title='Randomize Now (R)'
          >
            <Shuffle className='w-4 h-4' />
            <span>Randomize</span>
          </button>

          {/* Next */}
          <button
            onClick={handleNext}
            className='p-2 sm:p-2.5 rounded-xl hover:bg-white/10 text-white/80 hover:text-white transition-colors'
            title='Next Wallpaper (Right Arrow)'
          >
            <ChevronRight className='w-5 h-5' />
          </button>

          <div className='w-px h-6 bg-white/15 mx-1' />

          {/* Gallery Drawer Toggle */}
          <button
            onClick={() => setShowGallery((g) => !g)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${showGallery
              ? 'bg-white text-black'
              : 'hover:bg-white/10 text-white/80 hover:text-white'
              }`}
            title='Browse Wallpapers (G)'
          >
            <LayoutGrid className='w-4 h-4' />
            <span className='hidden sm:inline'>
              {filteredWallpapers.length} Wallpapers
            </span>
          </button>

          {/* Fit Mode Toggle */}
          <button
            onClick={() =>
              setFitMode((m) => (m === 'cover' ? 'contain' : 'cover'))
            }
            className='p-2 sm:p-2.5 rounded-xl hover:bg-white/10 text-white/80 hover:text-white transition-colors hidden sm:block'
            title={`Display mode: ${fitMode === 'cover' ? 'Fill screen' : 'Fit aspect ratio'
              }`}
          >
            <SlidersHorizontal className='w-4 h-4' />
          </button>
        </div>

        {/* Current Image Caption */}
        <div className='flex items-center gap-2 text-white/70 text-xs text-center drop-shadow-md'>
          <span className='font-medium text-white/90'>
            {currentWallpaper?.title || 'Mongotise Wallpaper'}
          </span>
          <span>•</span>
          <span className='text-white/60'>
            {currentIndex + 1} of {filteredWallpapers.length}
          </span>
        </div>
      </div>

      {/* BOTTOM THUMBNAIL DRAWER / GALLERY STRIP */}
      {showGallery && (
        <div className='absolute bottom-0 inset-x-0 z-50 bg-black/90 backdrop-blur-2xl border-t border-white/15 p-4 sm:p-6 text-white animate-in slide-in-from-bottom duration-300'>
          <div className='max-w-7xl mx-auto'>
            {/* Gallery Header & Category Tabs */}
            <div className='flex flex-wrap items-center justify-between gap-3 mb-4'>
              <div className='flex items-center gap-2'>
                <LayoutGrid className='w-4 h-4 text-amber-400' />
                <h3 className='font-semibold text-sm'>
                  Mongotise Cloudinary Wallpapers ({filteredWallpapers.length})
                </h3>
              </div>

              {/* Category Filter Tabs */}
              <div className='flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full'>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setCurrentIndex(0);
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${selectedCategory === cat
                      ? 'bg-white text-black'
                      : 'bg-white/10 hover:bg-white/20 text-white/80'
                      }`}
                  >
                    {cat}
                  </button>
                ))}
                <button
                  onClick={() => setShowGallery(false)}
                  className='ml-2 text-xs text-white/60 hover:text-white px-2 py-1'
                >
                  Close ✕
                </button>
              </div>
            </div>

            {/* Horizontal Scrollable Thumbnails */}
            <div className='flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/20'>
              {filteredWallpapers.map((w, idx) => {
                const isSelected = idx === currentIndex;
                return (
                  <button
                    key={w.publicId || idx}
                    onClick={() => {
                      applyWallpaper(idx);
                    }}
                    className={`group relative flex-shrink-0 w-36 sm:w-48 h-24 sm:h-32 rounded-xl overflow-hidden border-2 transition-all duration-200 transform ${isSelected
                      ? 'border-amber-400 ring-2 ring-amber-400/50 scale-[1.02]'
                      : 'border-white/15 opacity-70 hover:opacity-100 hover:border-white/40'
                      }`}
                  >
                    <img
                      src={w.url}
                      alt={w.title || `Wallpaper ${idx + 1}`}
                      className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                      loading='lazy'
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-2 text-left'>
                      <p className='text-[11px] font-medium text-white truncate leading-tight'>
                        {w.title}
                      </p>
                      <span className='text-[9px] text-white/60 font-mono'>
                        {w.resolution || w.category}
                      </span>
                    </div>

                    {isSelected && (
                      <div className='absolute top-2 right-2 w-5 h-5 rounded-full bg-amber-400 text-black flex items-center justify-center shadow'>
                        <Check className='w-3 h-3 stroke-[3]' />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
