import { Star, Info, Clock, Sparkles, Crown, Diamond, Watch, Scissors } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface HighlightItem {
  id: string;
  title: string;
  icon: 'reviews' | 'info' | 'products' | 'upcoming';
  action: 'modal' | 'link';
  storyId?: string;
  link?: string;
}

const storyHighlights: HighlightItem[] = [
  { id: 'reviews', title: 'آراء', icon: 'reviews', action: 'modal', storyId: 'reviews' },
  { id: 'info', title: 'معلومات عنا', icon: 'info', action: 'modal', storyId: 'info' },
  { id: 'upcoming', title: 'إصدارات قادمة', icon: 'upcoming', action: 'modal', storyId: 'upcoming' },
];

const productHighlight: HighlightItem = {
  id: 'products',
  title: 'منتجات حالية',
  icon: 'products',
  action: 'link',
  link: '/bracelets.html',
};

const iconMap: Record<HighlightItem['icon'], LucideIcon> = {
  reviews: Star,
  info: Info,
  products: Clock,
  upcoming: Sparkles,
};

const floatingIcons = [
  // Left flank
  { Icon: Crown, top: '18%', left: '5%', size: 16, delay: 0 },
  { Icon: Sparkles, top: '55%', left: '4%', size: 12, delay: 2.5 },
  { Icon: Star, top: '80%', left: '7%', size: 14, delay: 4.5 },
  // Right flank
  { Icon: Diamond, top: '22%', right: '4%', size: 14, delay: 1.2 },
  { Icon: Crown, top: '65%', right: '6%', size: 13, delay: 3.5 },
  // Background gap
  { Icon: Watch, top: '42%', left: '45%', size: 11, delay: 2 },
];

interface HighlightsSectionProps {
  onStoryOpen: (storyId: string) => void;
}

export default function HighlightsSection({ onStoryOpen }: HighlightsSectionProps) {
  const handleClick = (h: HighlightItem) => {
    if (h.action === 'link' && h.link) {
      window.open(h.link, '_blank', 'noopener,noreferrer');
    } else if (h.action === 'modal' && h.storyId) {
      onStoryOpen(h.storyId);
    }
  };

  const renderCircle = (h: HighlightItem) => {
    const Icon = iconMap[h.icon];
    return (
      <button
        key={h.id}
        onClick={() => handleClick(h)}
        className="flex flex-col items-center gap-2 md:gap-3 group flex-shrink-0"
        style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
      >
        <div className="p-1.5 md:p-2">
          <div
            className="relative rounded-full transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl w-[100px] h-[100px] md:w-[130px] md:h-[130px] lg:w-[144px] lg:h-[144px]"
            style={{
              padding: '4px',
              background: '#243247',
              border: '2px solid #e7ddcc',
              boxShadow: '0 6px 24px rgba(36, 50, 71, 0.18)',
              animation: 'shimmerGlow 4s ease-in-out infinite',
            }}
          >
            <div
              className="w-full h-full rounded-full flex items-center justify-center transition-all duration-300"
              style={{
                background: '#243247',
                border: '1px solid rgba(231, 221, 204, 0.25)',
              }}
            >
              <Icon
                size={32}
                className="md:!w-[38px] md:!h-[38px] transition-transform duration-300 group-hover:scale-110"
                style={{ color: '#e7ddcc', opacity: 0.9 }}
              />
            </div>

            <div
              className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                boxShadow: '0 0 32px rgba(231, 221, 204, 0.3), 0 0 60px rgba(36, 50, 71, 0.12)',
              }}
            />
          </div>
        </div>

        <span
          className="text-xs md:text-sm lg:text-base font-semibold transition-all duration-300 group-hover:opacity-100 text-center whitespace-nowrap"
          style={{
            fontFamily: "'Amiri', serif",
            color: '#243247',
            opacity: 0.85,
            letterSpacing: '0.03em',
          }}
        >
          {h.title}
        </span>
      </button>
    );
  };

  return (
    <section
      className="relative py-12 md:py-32"
      style={{
        background:
          'linear-gradient(180deg, #e7ddcc 0%, #f0ebe0 25%, #f5f0e8 55%, #f0ebe0 85%, #e7ddcc 100%)',
      }}
      dir="rtl"
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {floatingIcons.map(({ Icon, top, left, right, size, delay }, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              top,
              left,
              right,
              opacity: 0.04,
              animation: `floatIcon 7s ease-in-out infinite`,
              animationDelay: `${delay}s`,
            }}
          >
            <Icon size={size} className="text-[#243247]" />
          </div>
        ))}
      </div>

      {/* Top geometric divider */}
      <div className="relative z-10 flex items-center justify-center gap-3 mb-8 md:mb-12 opacity-30">
        <div className="w-12 h-px bg-[#243247]" />
        <div className="w-1.5 h-1.5 rotate-45 border border-[#243247]" />
        <div className="w-12 h-px bg-[#243247]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4">
        {/* Mobile: circles stacked vertically, each full width */}
        <div className="flex flex-col w-full gap-6 py-4 items-center sm:hidden animate-luxury-fade-up">
          {storyHighlights.map(renderCircle)}
          {renderCircle(productHighlight)}
        </div>

        {/* Desktop: 4 circles centered together in a row */}
        <div className="hidden sm:flex flex-wrap justify-center items-center gap-8 lg:gap-12 py-8 mx-auto animate-luxury-fade-up">
          {storyHighlights.map(renderCircle)}
          {renderCircle(productHighlight)}
        </div>
      </div>

      {/* Bottom geometric divider */}
      <div className="relative z-10 flex items-center justify-center gap-3 mt-8 md:mt-12 opacity-30">
        <div className="w-12 h-px bg-[#243247]" />
        <div className="w-1.5 h-1.5 rotate-45 border border-[#243247]" />
        <div className="w-12 h-px bg-[#243247]" />
      </div>
    </section>
  );
}
