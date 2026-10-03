import { useRef, useState, useEffect, useCallback } from 'react';
import { Star, Home } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { products } from '../data/products';
import { Product } from '../types/product';
import WhatsAppButton from '../components/WhatsAppButton';
import StoryModal, { StoryGroup } from '../components/StoryModal';

/* ---------- Cart Utilities ---------- */

const CART_STORAGE_KEY = 'orzi_cart';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
}

function getCartTotals(items: CartItem[]): { count: number; total: number } {
  return items.reduce(
    (acc, item) => ({
      count: acc.count + item.quantity,
      total: acc.total + item.price * item.quantity,
    }),
    { count: 0, total: 0 }
  );
}

/* ---------- Bracelet Section ---------- */

function BraceletSection({
  product,
  index,
  onAddToCart,
}: {
  product: Product;
  index: number;
  onAddToCart: (product: Product) => void;
}) {
  const [activeImage, setActiveImage] = useState(0);
  const [fading, setFading] = useState(false);
  const [added, setAdded] = useState(false);

  const handleThumb = (i: number) => {
    if (i === activeImage) return;
    setFading(true);
    setTimeout(() => {
      setActiveImage(i);
      setFading(false);
    }, 150);
  };

  const handleAddToCart = () => {
    onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const isReversed = index % 2 === 1;

  return (
    <div>
      <div
        className={`grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center ${
          isReversed ? 'md:grid-flow-col-dense' : ''
        }`}
      >
        <div
          className={`group relative overflow-hidden rounded-sm ${isReversed ? 'md:col-start-2' : ''}`}
          style={{ aspectRatio: '4/5' }}
        >
          <img
            src={product.images[activeImage]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            style={{
              opacity: fading ? 0 : 1,
              transition: 'opacity 0.3s ease, transform 0.7s ease',
            }}
          />
          <div className="absolute inset-0 bg-[#243247] opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
          {product.isNew && (
            <div
              className="absolute top-4 right-4 md:top-6 md:right-6"
              style={{
                animation: 'fadeSlideIn 0.6s ease-out forwards',
              }}
            >
              <span
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: '0.65rem',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  padding: '6px 14px',
                  background: 'linear-gradient(135deg, rgba(36,50,71,0.92) 0%, rgba(36,50,71,0.85) 100%)',
                  color: '#e7ddcc',
                  border: '1px solid rgba(201,169,79,0.35)',
                  boxShadow: '0 2px 8px rgba(36,50,71,0.15), inset 0 1px 0 rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(4px)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  cursor: 'default',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLSpanElement).style.transform = 'scale(1.05)';
                  (e.currentTarget as HTMLSpanElement).style.boxShadow = '0 4px 12px rgba(36,50,71,0.25), inset 0 1px 0 rgba(255,255,255,0.08)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLSpanElement).style.transform = 'scale(1)';
                  (e.currentTarget as HTMLSpanElement).style.boxShadow = '0 2px 8px rgba(36,50,71,0.15), inset 0 1px 0 rgba(255,255,255,0.05)';
                }}
              >
                New
              </span>
            </div>
          )}
        </div>

        <div
          className={`flex flex-col gap-6 ${isReversed ? 'md:col-start-1 md:row-start-1' : ''}`}
          dir="rtl"
        >
          <div>
            <p
              className="text-xs tracking-widest uppercase text-[#243247] mb-3 opacity-50"
              style={{ fontFamily: "'Cinzel', serif", letterSpacing: '0.25em' }}
            >
              ORZI 1998
            </p>
            <h3
              className="text-4xl md:text-5xl font-bold text-[#243247] mb-2"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              {product.name}
            </h3>
            <div className="w-10 h-px bg-[#243247] opacity-30 mb-6" />
          </div>

          <p
            className="text-lg text-[#243247] opacity-70 leading-relaxed"
            style={{ fontFamily: "'Amiri', serif" }}
          >
            {product.descriptionAr}
          </p>

          <div className="space-y-3 py-6 border-t border-b border-[#243247] border-opacity-10">
            <div className="flex justify-between text-sm" style={{ fontFamily: "'Amiri', serif" }}>
              <span className="text-[#243247] opacity-50">الخامة</span>
              <span className="text-[#243247] opacity-80">{product.specs.materialAr}</span>
            </div>
            <div className="flex justify-between text-sm" style={{ fontFamily: "'Amiri', serif" }}>
              <span className="text-[#243247] opacity-50">اللون</span>
              <span className="text-[#243247] opacity-80">{product.specs.colorAr}</span>
            </div>
            <div className="flex justify-between text-sm" style={{ fontFamily: "'Amiri', serif" }}>
              <span className="text-[#243247] opacity-50">المقاس</span>
              <span className="text-[#243247] opacity-80">{product.specs.sizeAr}</span>
            </div>
            <div className="flex justify-between text-sm" style={{ fontFamily: "'Amiri', serif" }}>
              <span className="text-[#243247] opacity-50">السعر</span>
              <span className="text-[#243247]" style={{ opacity: 0.9, fontWeight: 500 }}>{product.price} جنيه</span>
            </div>
          </div>

          <div className="flex gap-3 flex-wrap">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => handleThumb(i)}
                className="w-16 h-16 overflow-hidden flex-shrink-0 transition-all duration-300"
                style={{
                  borderRadius: '2px',
                  border:
                    i === activeImage
                      ? '2px solid #243247'
                      : '2px solid rgba(36,50,71,0.12)',
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-12">
        <button
          onClick={handleAddToCart}
          className="inline-block"
          style={{
            fontFamily: "'Amiri', serif",
            letterSpacing: '0.08em',
            fontSize: '1rem',
            padding: '14px 48px',
            background: added ? '#2d5a3d' : '#243247',
            color: '#e7ddcc',
            border: 'none',
            borderRadius: '4px',
            fontWeight: 600,
            boxShadow: added
              ? '0 2px 12px rgba(45,90,61,0.25)'
              : '0 2px 12px rgba(36,50,71,0.15)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease',
            cursor: 'pointer',
            minWidth: '220px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
          onMouseEnter={(e) => {
            if (!added) {
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-3px)';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 24px rgba(36,50,71,0.25)';
              (e.currentTarget as HTMLButtonElement).style.background = '#1a2b3c';
            }
          }}
          onMouseLeave={(e) => {
            if (!added) {
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 2px 12px rgba(36,50,71,0.15)';
              (e.currentTarget as HTMLButtonElement).style.background = '#243247';
            }
          }}
        >
          {added ? 'تمت الإضافة ✔' : 'أضف إلى السلة'}
        </button>
      </div>
    </div>
  );
}

/* ---------- Sticky Cart Bar ---------- */

function CartBar({ items }: { items: CartItem[] }) {
  const { count, total } = getCartTotals(items);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (count > 0) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [count]);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9000,
        transform: visible ? 'translateY(0)' : 'translateY(100%)',
        opacity: visible ? 1 : 0,
        transition: 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s ease',
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      <div
        style={{
          background: 'rgba(36, 50, 71, 0.82)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderTop: '1px solid rgba(231, 221, 204, 0.15)',
          boxShadow: '0 -4px 24px rgba(0, 0, 0, 0.12)',
          padding: '14px 24px',
        }}
        dir="rtl"
      >
        <div
          className="max-w-6xl mx-auto flex items-center justify-between gap-4"
        >
          {/* Right: Cart icon + count */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div style={{ position: 'relative' }}>
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="#e7ddcc"
                viewBox="0 0 24 24"
                style={{ opacity: 0.9 }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span
                style={{
                  position: 'absolute',
                  top: '-8px',
                  left: '-8px',
                  background: '#e7ddcc',
                  color: '#243247',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  minWidth: '18px',
                  height: '18px',
                  borderRadius: '9px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 5px',
                  fontFamily: "'Cinzel', serif",
                }}
              >
                {count}
              </span>
            </div>
            <span
              className="hidden sm:inline"
              style={{
                fontFamily: "'Amiri', serif",
                color: '#e7ddcc',
                fontSize: '0.9rem',
                opacity: 0.75,
                letterSpacing: '0.03em',
              }}
            >
              السلة
            </span>
          </div>

          {/* Center: Total price */}
          <div className="flex flex-col items-center flex-1 min-w-0">
            <span
              style={{
                fontFamily: "'Cinzel', serif",
                color: '#e7ddcc',
                opacity: 0.5,
                fontSize: '0.65rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
              }}
            >
              Total
            </span>
            <span
              style={{
                fontFamily: "'Amiri', serif",
                color: '#e7ddcc',
                fontSize: '1.1rem',
                fontWeight: 700,
                whiteSpace: 'nowrap',
              }}
            >
              {total.toLocaleString('en-US')} جنيه
            </span>
          </div>

          {/* Left: CTA */}
          <a
            href="/order-bracelets.html"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0"
            style={{
              fontFamily: "'Amiri', serif",
              fontSize: '0.9rem',
              fontWeight: 600,
              letterSpacing: '0.05em',
              padding: '12px 28px',
              background: '#e7ddcc',
              color: '#243247',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              textDecoration: 'none',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              display: 'inline-block',
              boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)';
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 6px 20px rgba(0,0,0,0.25)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)';
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 2px 10px rgba(0,0,0,0.15)';
            }}
          >
            إتمام الطلب
          </a>
        </div>
      </div>
    </div>
  );
}

/* ---------- Highlights Header ---------- */

const reviewsStory: StoryGroup = {
  id: 'reviews',
  title: 'آراء',
  slides: [
    { image: '/rev1.jpg' },
    { image: '/rev2.jpg' },
    { image: '/rev3.jpg' },
    { image: '/rev4.jpg' },
    { image: '/rev5.jpg' },
    { image: '/rev6.jpg' },
    { image: '/rev7.jpg' },
    { image: '/rev8.jpg' },
    { image: '/rev9.jpg' },
    { image: '/rev10.jpg' },
    { image: '/rev11.jpg' },
    { image: '/rev12.jpg' },
  ],
};

interface HeaderCircleProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
}

function HeaderCircle({ icon: Icon, label, onClick }: HeaderCircleProps) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1.5 group"
      style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
    >
      <div className="p-1">
        <div
          className="relative rounded-full transition-all duration-300 group-hover:scale-105"
          style={{
            width: '60px',
            height: '60px',
            padding: '2px',
            background: '#243247',
            border: '1.5px solid #e7ddcc',
            boxShadow: '0 2px 12px rgba(36, 50, 71, 0.12)',
          }}
        >
          <div
            className="w-full h-full rounded-full flex items-center justify-center transition-all duration-300"
            style={{
              background: '#243247',
              border: '1px solid rgba(231, 221, 204, 0.2)',
            }}
          >
            <Icon
              size={18}
              className="transition-transform duration-300 group-hover:scale-110"
              style={{ color: '#e7ddcc', opacity: 0.9 }}
            />
          </div>
          <div
            className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ boxShadow: '0 0 16px rgba(231, 221, 204, 0.25), 0 0 32px rgba(36, 50, 71, 0.08)' }}
          />
        </div>
      </div>
      <span
        className="text-[0.7rem] sm:text-xs font-semibold transition-all duration-300 group-hover:opacity-100"
        style={{ fontFamily: "'Amiri', serif", color: '#243247', opacity: 0.6, letterSpacing: '0.03em' }}
      >
        {label}
      </span>
    </button>
  );
}

/* ---------- Main Page ---------- */

export default function BraceletsPage() {
  const collectionRef = useRef<HTMLDivElement>(null);
  const bracelets = products.filter((p) => p.collection === 'bracelets');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [storyModalOpen, setStoryModalOpen] = useState(false);

  useEffect(() => {
    setCartItems(loadCart());
  }, []);

  const handleAddToCart = useCallback((product: Product) => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'AddToCart', {
        content_name: product.name,
        value: product.price,
        currency: 'EGP',
      });
    }
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      let updated: CartItem[];
      if (existing) {
        updated = prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updated = [
          ...prev,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1,
          },
        ];
      }
      saveCart(updated);
      return updated;
    });
  }, []);

  return (
    <div
      className="min-h-screen"
      style={{
        fontFamily: "'Amiri', serif",
        background: 'rgba(240, 235, 224, 0.85)',
      }}
      dir="rtl"
    >
      {/* MINIMAL NAV HEADER */}
      <header style={{ paddingTop: '3rem' }}>
        <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-center gap-12">
          <HeaderCircle
            icon={Home}
            label="أُورزي ١٩٩٨"
            onClick={() => { window.location.href = '/'; }}
          />
          <HeaderCircle
            icon={Star}
            label="آراء"
            onClick={() => setStoryModalOpen(true)}
          />
        </div>
      </header>

      {/* COLLECTION SHOWCASE */}
      <section ref={collectionRef} className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="text-center mb-20">
            <p
              className="text-xs tracking-widest uppercase text-[#243247] mb-4 opacity-50"
              style={{ fontFamily: "'Cinzel', serif", letterSpacing: '0.25em' }}
            >
              ORZI - Heritage Bracelets
            </p>
            <h2
              className="text-4xl md:text-5xl font-bold text-[#243247]"
              style={{ fontFamily: "'amiri', serif" }}
            >
              التشكيلة الكاملة
            </h2>
            <div className="w-16 h-px bg-[#243247] opacity-30 mx-auto mt-6" />
          </div>

          <div className="space-y-28 md:space-y-36">
            {bracelets.map((product, index) => (
              <BraceletSection
                key={product.id}
                product={product}
                index={index}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </div>
      </section>

      {/* STORY SECTION */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at 70% 50%, rgba(36,50,71,0.04) 0%, transparent 60%)',
          }}
        />
        <div className="relative z-10 max-w-3xl mx-auto px-6 md:px-12 text-center">
          <p
            className="text-xs tracking-widest uppercase text-[#243247] mb-6 opacity-50"
            style={{ fontFamily: "'Cinzel', serif", letterSpacing: '0.25em' }}
          >
            Craftsmanship
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold text-[#243247] mb-12"
            style={{ fontFamily: "'Amiri', serif", lineHeight: '1.7' }}
          >
            وُلِدت من التِراث،<br />صُنِعت للهوية
          </h2>
          <div className="w-16 h-px bg-[#243247] opacity-20 mx-auto mb-12" />
          <div
            className="space-y-8 text-lg text-[#243247] opacity-65 leading-loose font-light"
            style={{ fontFamily: "'Amiri', serif" }}
          >
            <p>
              كل إسورة من تشكيلة ORZI تحمل فلسفة واحدة — أن الأناقة الحقيقية لا تُصرَخ، بل تُشعر.
            </p>
            <p>
              نستلهم من حقبة كان فيها الحضور هادئاً لكنه لا يُنسى، والتفاصيل بسيطة لكنها تترك أثراً دائماً.
            </p>
            <p>
              نحاس مصقول، طلاء مدروس، ومقاس قابل للتعديل — لأن كل معصم يستحق ما يناسبه تماماً.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#243247] text-white py-12 md:py-16 border-t border-[#e7ddcc] border-opacity-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <h4 className="text-lg font-bold mb-4" style={{ fontFamily: "'Amiri', serif" }}>
              تواصل معنا
            </h4>
            <div className="flex gap-4 justify-center">
              <a
                href="https://www.tiktok.com/@orzi.eg"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-[#e7ddcc] text-[#243247] rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                aria-label="TikTok"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/orzi.eg"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-[#e7ddcc] text-[#243247] rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="https://www.facebook.com/orzieg/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-[#e7ddcc] text-[#243247] rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="https://wa.me/201037780651"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-[#e7ddcc] text-[#243247] rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                aria-label="WhatsApp"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8 text-center text-sm text-gray-400">
            <p style={{ fontFamily: "'Cinzel', serif" }}>© {new Date().getFullYear()} Orzi-1998.</p>
            <p className="mt-2" style={{ fontFamily: "'Amiri', serif" }}>.خالد. راقٍ. أصيل</p>
          </div>
        </div>
      </footer>
      <WhatsAppButton />
      <CartBar items={cartItems} />

      <StoryModal
        stories={[reviewsStory]}
        initialStoryIndex={0}
        isOpen={storyModalOpen}
        onClose={() => setStoryModalOpen(false)}
      />
    </div>
  );
}
