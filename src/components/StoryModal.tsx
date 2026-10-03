import { useState, useRef, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence, type PanInfo } from 'framer-motion';

export interface StorySlide {
  image: string;
  label?: string;
}

export interface StoryGroup {
  id: string;
  title: string;
  slides: StorySlide[];
}

interface StoryModalProps {
  stories: StoryGroup[];
  initialStoryIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

const STORY_DURATION = 6000;

export default function StoryModal({
  stories,
  initialStoryIndex,
  isOpen,
  onClose,
}: StoryModalProps) {
  const [storyIndex, setStoryIndex] = useState(initialStoryIndex);
  const [slideIndex, setSlideIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const rafRef = useRef<number>(0);
  const lastTickRef = useRef<number>(0);
  const imageCacheRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (isOpen) {
      setStoryIndex(initialStoryIndex);
      setSlideIndex(0);
      setProgress(0);
    }
  }, [isOpen, initialStoryIndex]);

  const preloadNext = useCallback(() => {
    const next = slideIndex + 1;
    const slides = stories[storyIndex]?.slides ?? [];
    if (next < slides.length && !imageCacheRef.current.has(slides[next].image)) {
      const img = new Image();
      img.src = slides[next].image;
      imageCacheRef.current.add(slides[next].image);
    }
  }, [slideIndex, storyIndex, stories]);

  useEffect(() => {
    if (!isOpen) return;
    lastTickRef.current = performance.now();
    const tick = (now: number) => {
      const elapsed = now - lastTickRef.current;
      lastTickRef.current = now;
      setProgress((prev) => {
        const next = prev + (elapsed / STORY_DURATION) * 100;
        if (next >= 100) {
          handleNext();
          return 0;
        }
        return next;
      });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, storyIndex, slideIndex]);

  useEffect(() => {
    if (isOpen) {
      const slides = stories[storyIndex]?.slides ?? [];
      if (slideIndex < slides.length) {
        const img = slides[slideIndex].image;
        if (!imageCacheRef.current.has(img)) {
          const i = new Image();
          i.src = img;
          imageCacheRef.current.add(img);
        }
      }
      preloadNext();
    }
  }, [isOpen, storyIndex, slideIndex, stories, preloadNext]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, storyIndex, slideIndex]);

  const currentStory = stories[storyIndex];
  const currentSlides = currentStory?.slides ?? [];
  const currentImage = currentSlides[slideIndex]?.image ?? '';

  const handleNext = useCallback(() => {
    setSlideIndex((prevSlide) => {
      if (prevSlide + 1 < currentSlides.length) {
        return prevSlide + 1;
      }
      if (storyIndex + 1 < stories.length) {
        setStoryIndex(storyIndex + 1);
        return 0;
      }
      onClose();
      return prevSlide;
    });
    setProgress(0);
  }, [currentSlides.length, storyIndex, stories.length, onClose]);

  const handlePrev = useCallback(() => {
    setSlideIndex((prevSlide) => {
      if (prevSlide > 0) {
        return prevSlide - 1;
      }
      if (storyIndex > 0) {
        const prevStory = stories[storyIndex - 1];
        setStoryIndex(storyIndex - 1);
        return prevStory.slides.length - 1;
      }
      return 0;
    });
    setProgress(0);
  }, [storyIndex, stories]);

  const handleDragEnd = (_e: unknown, info: PanInfo) => {
    if (info.offset.y > 120 || info.velocity.y > 300) {
      onClose();
    }
  };

  const handleImageError = (src: string) => {
    setImageErrors((prev) => new Set(prev).add(src));
  };

  return (
    <AnimatePresence>
      {isOpen && currentStory && (
        <motion.div
          className="fixed inset-0 z-[10000] flex items-center justify-center"
          style={{
            background: 'rgba(10, 14, 20, 0.92)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
        >
          {/* Story Container (9:16) with drag gesture */}
          <motion.div
            className="relative"
            style={{
              height: '100vh',
              maxHeight: '900px',
              aspectRatio: '9/16',
              maxWidth: '100vw',
            }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.7 }}
            onDragEnd={handleDragEnd}
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ y: window.innerHeight, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {/* Drag indicator pill */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 z-[40] w-12 h-1.5 bg-white/40 rounded-full mx-auto my-2 pointer-events-none"
            />

            {/* Image */}
            <img
              src={currentImage}
              alt={currentStory.title}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ borderRadius: '0' }}
              onError={() => handleImageError(currentImage)}
              draggable={false}
            />

            {/* Fallback if image fails */}
            {imageErrors.has(currentImage) && (
              <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ background: 'linear-gradient(160deg, #243247 0%, #1a2b3c 100%)' }}>
                <span style={{ fontFamily: "'Cinzel', serif", fontSize: '2rem', color: '#e7ddcc', letterSpacing: '0.1em' }}>
                  ORZI
                </span>
                <span style={{ fontFamily: "'Amiri', serif", fontSize: '1rem', color: '#e7ddcc', opacity: 0.5, marginTop: '8px' }}>
                  {currentStory.title}
                </span>
              </div>
            )}

            {/* Gradient overlays */}
            <div className="absolute inset-x-0 top-0 h-32" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)' }} />
            <div className="absolute inset-x-0 bottom-0 h-24" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)' }} />

            {/* Progress bars */}
            <div className="absolute top-0 left-0 right-0 p-3 flex gap-1" style={{ zIndex: 30 }}>
              {currentSlides.map((_, i) => (
                <div
                  key={i}
                  className="flex-1 h-0.5 rounded-full overflow-hidden"
                  style={{ background: 'rgba(255,255,255,0.3)' }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      background: 'rgba(255,255,255,0.95)',
                      width: i < slideIndex ? '100%' : i === slideIndex ? `${progress}%` : '0%',
                      transition: i === slideIndex ? 'none' : 'width 0.2s ease',
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Header: title + close */}
            <div className="absolute top-6 left-0 right-0 px-4 flex items-center justify-between" style={{ zIndex: 25 }}>
              <span
                style={{
                  fontFamily: "'Amiri', serif",
                  color: '#fff',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  textShadow: '0 1px 6px rgba(0,0,0,0.5)',
                }}
              >
                {currentStory.title}
              </span>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full transition-transform hover:scale-110"
                style={{ background: 'rgba(0,0,0,0.3)' }}
                aria-label="إغلاق"
              >
                <X size={20} color="#fff" />
              </button>
            </div>

            {/* Desktop navigation arrows */}
            <button
              onClick={(e) => { e.stopPropagation(); handlePrev(); }}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full hidden md:block"
              style={{ background: 'rgba(0,0,0,0.25)', zIndex: 20 }}
              aria-label="السابق"
            >
              <ChevronLeft size={28} color="#fff" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleNext(); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full hidden md:block"
              style={{ background: 'rgba(0,0,0,0.25)', zIndex: 20 }}
              aria-label="التالي"
            >
              <ChevronRight size={28} color="#fff" />
            </button>

            {/* Tap zones for mobile (left = prev, right = next in RTL) */}
            <button
              onClick={(e) => { e.stopPropagation(); handlePrev(); }}
              className="absolute left-0 top-16 bottom-16 w-1/3 md:hidden"
              style={{ zIndex: 15 }}
              aria-label="السابق"
            />
            <button
              onClick={(e) => { e.stopPropagation(); handleNext(); }}
              className="absolute right-0 top-16 bottom-16 w-1/3 md:hidden"
              style={{ zIndex: 15 }}
              aria-label="التالي"
            />

            {/* Slide counter */}
            <div
              className="absolute bottom-4 left-1/2 -translate-x-1/2"
              style={{ zIndex: 20 }}
            >
              <span style={{ fontFamily: "'Cinzel', serif", color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', letterSpacing: '0.1em' }}>
                {slideIndex + 1} / {currentSlides.length}
              </span>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
