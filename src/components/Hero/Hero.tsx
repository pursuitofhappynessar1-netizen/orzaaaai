import DecorativeIcon from '../DecorativeIcons';

export default function Hero() {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
      {/* High-res background with optimized sizing */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/header.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          imageRendering: 'auto',
        }}
      />

      {/* Dark gradient overlays for text sharpness and depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#e7ddcc] via-transparent to-transparent" />

      {/* Subtle metallic glow accents */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 30% 40%, rgba(231, 221, 204, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 70% 60%, rgba(36, 50, 71, 0.15) 0%, transparent 50%)',
        }}
      />

      <DecorativeIcon icon="crown" position={{ top: '15%', left: '10%' }} delay={0} />
      <DecorativeIcon icon="diamond" position={{ top: '25%', right: '12%' }} delay={1.5} />
      <DecorativeIcon icon="sparkles" position={{ bottom: '30%', left: '8%' }} delay={3} />

      {/* Refined content with luxury spacing */}
      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
        {/* Geometric divider accent */}
        <div className="flex items-center justify-center gap-3 mb-8 opacity-80">
          <div className="w-16 h-px bg-[#e7ddcc]" />
          <div className="w-2 h-2 rounded-full border border-[#e7ddcc]" />
          <div className="w-16 h-px bg-[#e7ddcc]" />
        </div>

        <h1
          className="text-5xl md:text-7xl font-bold mb-16"
          style={{
            color: '#e7ddcc',
            lineHeight: '2.2',
            textShadow: '0 2px 20px rgba(0, 0, 0, 0.5)',
            animation: 'fadeSlideIn 1.2s ease-out',
          }}
        >
          .خالِد. راقٍ. أصيلْ
        </h1>

        <p
          className="text-lg md:text-2xl font-light"
          style={{
            color: '#e7ddcc',
            lineHeight: '2.4',
            textShadow: '0 1px 12px rgba(0, 0, 0, 0.6)',
            animation: 'fadeSlideIn 1.2s ease-out 0.3s both',
          }}
        >
          من أصالة ورقيّ الماضي
        </p>

        {/* Bottom geometric divider */}
        <div className="flex items-center justify-center gap-3 mt-12 opacity-60">
          <div className="w-12 h-px bg-[#e7ddcc]" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#e7ddcc]" />
          <div className="w-12 h-px bg-[#e7ddcc]" />
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex justify-center">
        <svg
          className="w-7 h-7 text-[#e7ddcc] opacity-70 block"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </section>
  );
}
