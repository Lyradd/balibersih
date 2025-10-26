import React, { useState, useRef, useEffect } from 'react';
// Mengganti ikon agar sesuai dengan konten baru
import { 
  Menu, X, Wind, Trash2, 
  AlertTriangle, ShieldCheck, ListChecks, HeartHandshake 
} from 'lucide-react';

/**
 * ====================================================================
 * Hook Kustom untuk Animasi Scroll
 * ====================================================================
 * Menggunakan IntersectionObserver untuk mendeteksi kapan elemen masuk
 * ke viewport, lalu memicu animasi.
 */
const useScrollAnimate = (options = { threshold: 0.1 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      }
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(ref.current);
      }
    };
  }, [options]);

  return [ref, isVisible];
};

/**
 * ====================================================================
 * Komponen Simulasi Shadcn/UI
 * ====================================================================
 * Dibuat ulang hanya dengan React & Tailwind agar sesuai
 * dengan batasan satu file.
 */

// --- Button ---
const Button = React.forwardRef(({ className = '', variant = 'default', size = 'default', asChild = false, ...props }, ref) => {
  const Comp = asChild ? 'span' : 'button';
  // Varian gaya
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-600/90",
    destructive: "bg-red-600 text-white hover:bg-red-600/90",
    outline: "border border-gray-300 bg-transparent hover:bg-gray-100",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-200/80",
    ghost: "hover:bg-gray-100",
  };
  
  // Ukuran
  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
  };

  return (
    <Comp
      className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none
        ${variants[variant]} ${sizes[size]} ${className}`}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = "Button";

// --- Card Components ---
const Card = React.forwardRef(({ className = '', ...props }, ref) => (
  <div
    ref={ref}
    className={`rounded-xl border bg-card text-card-foreground shadow-sm ${className}`}
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef(({ className = '', ...props }, ref) => (
  <div ref={ref} className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props} />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef(({ className = '', ...props }, ref) => (
  <h3
    ref={ref}
    className={`text-lg font-semibold leading-none tracking-tight ${className}`}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardContent = React.forwardRef(({ className = '', ...props }, ref) => (
  <div ref={ref} className={`p-6 pt-0 ${className}`} {...props} />
));
CardContent.displayName = "CardContent";

// --- Mobile Sheet (Menu) Components ---
const Sheet = ({ open, onOpenChange, children }) => {
  if (!open) return null;

  return (
    // Portal-like structure
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div 
        onClick={() => onOpenChange(false)} 
        className="fixed inset-0 bg-black/50 transition-opacity duration-300 ease-in-out opacity-100"
      ></div>
      {/* Content */}
      {children}
    </div>
  );
};

const SheetContent = ({ open, onOpenChange, children }) => {
  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 h-full w-3/4 sm:w-3/4 border-r bg-background p-6 shadow-lg transition-transform duration-300 ease-in-out
        ${open ? 'translate-x-0' : '-translate-x-full'}`}
    >
      <div className="flex justify-end">
        <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      {children}
    </div>
  );
};

/**
 * ====================================================================
 * Komponen Tambahan
 * ====================================================================
 */

// --- ImageWithFallback ---
const ImageWithFallback = ({ src, fallbackText, alt, className = "", ...props }) => {
  const handleError = (e) => {
    e.target.src = `https://placehold.co/800x600/E0E0E0/707070?text=${encodeURIComponent(fallbackText)}`;
  };
  
  return (
    <img 
      src={src} 
      alt={alt} 
      onError={handleError} 
      className={`object-cover ${className}`} 
      {...props} 
    />
  );
};

// --- SectionCard (Kartu untuk setiap seksi dengan animasi) ---
const SectionCard = ({ icon: Icon, title, content, imageUrl, alt }) => {
  const [ref, isVisible] = useScrollAnimate();

  return (
    <Card
      ref={ref}
      className={`flex flex-col overflow-hidden transition-all duration-700 ease-out 
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
        w-full`} // MEMBUAT KARTU MENJADI FULL-WIDTH
    >
      <ImageWithFallback
        src={imageUrl}
        fallbackText={alt}
        alt={alt}
        className="w-full h-96" /* DIPERBESAR DARI h-48 MENJADI h-96 */
      />
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Icon className="h-5 w-5 text-blue-600" />
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* MEMPERBESAR FONT KONTEN KARTU */}
        <p className="text-base text-foreground/80 leading-relaxed">
          {content}
        </p>
      </CardContent>
    </Card>
  );
};


/**
 * ====================================================================
 * Komponen Utama Aplikasi
 * ====================================================================
 */
export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Data untuk navigasi (DIPERBARUI)
  const navItems = [
    { id: 'latar-belakang', title: 'Latar Belakang' },
    { id: 'permasalahan', title: 'Permasalahan' },
    { id: 'dampak-penyebab', title: 'Dampak & Penyebab' },
    { id: 'usaha-solusi', title: 'Usaha & Solusi' },
    { id: 'rencana-aksi', title: 'Rencana Aksi' },
    { id: 'ajakan', title: 'Ajakan' },
  ];

  // Data konten seksi (DIPERBARUI DENGAN KONTEN BARU & GAMBAR BARU)
  const sections = [
    {
      id: 'latar-belakang',
      title: 'Latar Belakang Krisis',
      content: "Bali dikenal sebagai 'Pulau Dewata' namun menghadapi tantangan serius: pengelolaan sampah. Pulau ini memproduksi sekitar 3.436 ton sampah setiap hari. Saat musim hujan, saluran air dan sungai sering tersumbat oleh plastik, memicu banjir lokal dan merusak ekosistem.",
      imageUrl: 'https://images.unsplash.com/photo-1572186356950-6818b663adea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      alt: 'Pemandangan sawah terasering di Bali',
      icon: Wind
    },
    {
      id: 'permasalahan',
      title: 'Permasalahan Utama',
      content: "Sampah plastik seperti botol, kantong, dan saset sering tersangkut di gorong-gorong dan sungai. Ini menghambat aliran air dan menyebabkan banjir. Plastik yang terbawa ke laut juga mencemari pantai, merusak terumbu karang, dan mengancam biota laut.",
      imageUrl: 'https://images.unsplash.com/photo-1570296499315-a0386c431636?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      alt: 'Botol plastik di pantai',
      icon: Trash2
    },
    {
      id: 'dampak-penyebab',
      title: 'Dampak & Penyebab',
      content: "Pantai ikonik seperti Kuta dapat menerima hingga 60 ton sampah plastik. Faktor penyebab utamanya adalah budaya plastik sekali pakai, infrastruktur pengelolaan yang belum memadai, serta pariwisata massal yang meningkatkan konsumsi tanpa diimbangi sistem daur ulang.",
      imageUrl: 'https://images.unsplash.com/photo-1542159881-3487f1053b1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      alt: 'Pantai Kuta yang ramai',
      icon: AlertTriangle // Ikon baru
    },
    {
      id: 'usaha-solusi',
      title: 'Usaha & Solusi',
      content: "Pemerintah Provinsi Bali telah mengambil langkah membatasi plastik sekali pakai. Selain itu, banyak komunitas lokal, sekolah, dan organisasi lingkungan yang secara rutin melakukan aksi bersih pantai, sungai, serta memberikan edukasi kepada masyarakat.",
      imageUrl: 'https://images.unsplash.com/photo-1621451537084-4E5b33104d41?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      alt: 'Relawan membersihkan pantai',
      icon: ShieldCheck // Ikon baru
    },
    {
      id: 'rencana-aksi',
      title: 'Rencana Aksi',
      content: "Rencana ke depan meliputi peningkatan sistem pemilahan sampah di tingkat rumah tangga dan hotel, pemasangan saringan sampah di sungai, penguatan peraturan lokal yang lebih tegas, dan kampanye massal untuk mengubah perilaku.",
      imageUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      alt: 'Diskusi perencanaan',
      icon: ListChecks // Ikon baru
    },
    {
      id: 'ajakan',
      title: 'Ajakan untuk Semua',
      content: "Bali adalah warisan dunia. Satu tindakan kecil dari banyak orang—seperti membawa botol sendiri, menolak plastik, atau ikut bersih-bersih—akan membawa perubahan besar. Mari bergandeng tangan untuk Bali yang lebih bersih dan lestari.",
      imageUrl: 'https://images.unsplash.com/photo-1605399222191-c53360b46736?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      alt: 'Tangan memegang tanaman',
      icon: HeartHandshake // Ikon baru
    }
  ];

  return (
    <div className="bg-background text-foreground font-sans antialiased">
      {/* Tag <style> ini menyuntikkan variabel CSS (tema) Shadcn/UI
        sehingga kelas Tailwind seperti 'bg-background' dan 'bg-card' berfungsi.
      */}
      <style>{`
        /* MENAMBAHKAN SMOOTH SCROLL BEHAVIOR */
        html {
          scroll-behavior: smooth;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }

        :root {
          --background: 255 255 255; /* white */
          --foreground: 20 20 20;   /* near black */
          --card: 255 255 255;       /* white */
          --card-foreground: 20 20 20;
          --popover: 255 255 255;
          --popover-foreground: 20 20 20;
          --primary: 37 99 235; /* blue-600 */
          --primary-foreground: 255 255 255;
          --border: 229 231 235; /* gray-200 */
          --radius: 0.75rem; /* 12px */
        }
        
        .dark {
          /* TODO: Add dark mode colors if needed */
        }
        
        /* Utility classes dari CSS variables */
        .bg-background { background-color: rgb(var(--background)); }
        .text-foreground { color: rgb(var(--foreground)); }
        .bg-card { background-color: rgb(var(--card)); }
        .text-card-foreground { color: rgb(var(--card-foreground)); }
        .border { border-color: rgb(var(--border)); }
        .rounded-xl { border-radius: var(--radius); }
        .rounded-md { border-radius: calc(var(--radius) - 4px); }
      `}</style>
      
      {/* --- Navbar --- */}
      <nav className="bg-background/95 backdrop-blur-sm shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <a href="#" className="text-2xl font-bold text-blue-600">
              Bali<span className="text-green-500">Bersih</span>
            </a>
            
            {/* Navigasi Desktop (DIPERBARUI) */}
            <div className="hidden md:flex md:space-x-1">
              {navItems.map((item) => (
                <Button variant="ghost" asChild key={item.id}>
                  <a href={`#${item.id}`}>{item.title}</a>
                </Button>
              ))}
            </div>
            
            {/* Tombol Hamburger (Mobile) */}
            <div className="flex md:hidden">
              <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(true)}>
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>
      
      {/* --- Menu Mobile (Sheet) (DIPERBARUI) --- */}
      <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <SheetContent open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <nav className="flex flex-col space-y-2 mt-8">
            {navItems.map((item) => (
              <Button 
                variant="ghost" 
                className="justify-start text-lg" 
                asChild 
                key={item.id} 
                onClick={() => setIsMenuOpen(false)}
              >
                <a href={`#${item.id}`}>{item.title}</a>
              </Button>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
      
      {/* --- Hero Section --- */}
      <header className="relative h-[70vh] md:h-[80vh] w-full overflow-hidden">
        {/* Latar Belakang Gambar */}
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1598454448512-2f3d36219b13?ixlib=rb-4.0.3&q=80&w=1600&h=900&fit=crop"
            fallbackText="Pantai Bali"
            alt="Pemandangan pantai Bali"
            className="w-full h-full"
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        
        {/* Konten Hero */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center items-center text-center relative z-10">
          <h1 
            className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-4 animate-fadeIn"
            style={{ animationDelay: '0.2s' }}
          >
            Atasi Krisis Sampah Plastik
          </h1>
          <p 
            className="text-xl md:text-2xl text-gray-200 font-light max-w-2xl mb-8 animate-fadeIn"
            style={{ animationDelay: '0.4s' }}
          >
            Mulai dari Bali, kita ciptakan lautan bersih dan masa depan berkelanjutan untuk Indonesia.
          </p>
          <div 
            className="animate-fadeIn"
            style={{ animationDelay: '0.6s' }}
          >
            <Button size="lg" asChild>
              {/* Memperbarui href agar sesuai dengan ID baru */}
              <a href="#permasalahan">Lihat Masalahnya</a>
            </Button>
          </div>
        </div>
      </header>

      {/* --- Main Content (Sections Grid) --- */}
      {/* MENGHAPUS 'container' & 'mx-auto' TAPI MENJAGA 'px' (padding horizontal) */}
      <main className="px-4 sm:px-6 lg:px-8">
        {/* Judul Seksi */}
        {/* MENGHAPUS 'pt' (padding top) DARI SINI */}
        <div className="text-center mb-12 container mx-auto pt-16 md:pt-24">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Tantangan & Solusi Kita
          </h2>
          <p className="text-lg text-foreground/70 max-w-3xl mx-auto">
            Memahami masalah adalah langkah pertama untuk menyelesaikannya. Berikut adalah pilar-pilar aksi kita.
          </p>
        </div>
        
        {/* Grid Konten (DIPERBARUI) */}
        {/* MENGHAPUS 'max-w-4xl' & 'mx-auto' */}
        <div className="grid grid-cols-1">
          {/* Memperbarui loop untuk membungkus Card dengan <section> 
            agar anchor link dari Navbar berfungsi.
          */}
          {sections.map((section, index) => (
            // MENGHAPUS 'py' (padding vertikal) & MENAMBAHKAN PADDING ATAS HANYA UNTUK ELEMEN PERTAMA
            <section 
              id={section.id} 
              key={section.id} 
              className={`scroll-mt-20 min-h-screen flex items-center justify-center ${index === 0 ? 'pt-16 md:pt-24' : ''}`}
            >
              <SectionCard
                icon={section.icon}
                title={section.title}
                content={section.content}
                imageUrl={section.imageUrl}
                alt={section.alt}
              />
            </section>
          ))}
        </div>
      </main>
      
      {/* --- Footer --- */}
      <footer className="bg-gray-900 text-gray-400 p-8 mt-16">
        {/* MENGHAPUS 'container mx-auto' AGAR KONSISTEN FULL-WIDTH */}
        <div className="text-center px-4 sm:px-6 lg:px-8">
          <p className="text-lg font-bold text-white mb-2">
            Bali<span className="text-green-500">Bersih</span>
          </p>
          <p className="text-sm">
            Sebuah inisiatif untuk Indonesia yang lebih bersih dan bebas sampah plastik.
          </p>
          <p className="text-xs mt-4">
            &copy; 2025. Dibuat dengan React & Tailwind CSS.
          </p>
        </div>
      </footer>
    </div>
  );
}

