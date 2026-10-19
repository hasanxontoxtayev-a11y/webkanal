'use client';

import React, { useState } from 'react';
import { Product } from '@/types';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { AboutSection } from '@/components/AboutSection';
import { ProductsSection } from '@/components/ProductsSection';
import { ProductQuickViewModal } from '@/components/ProductQuickViewModal';
import { ReviewsSection } from '@/components/ReviewsSection';
import { ContactSection } from '@/components/ContactSection';
import { Footer } from '@/components/Footer';

export default function HomePage() {
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);
  const [selectedProductForOrder, setSelectedProductForOrder] = useState<Product | null>(null);
  const [selectedSizeForOrder, setSelectedSizeForOrder] = useState<string>('L');

  // Modal orqali buyurtma berish bosilganda
  const handleOrderFromModal = (product: Product, size: string) => {
    setSelectedProductForOrder(product);
    setSelectedSizeForOrder(size);
    
    // Anketaga silliq o'tish
    const contactEl = document.getElementById('contact');
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Kartochka ustidagi "Tanlash" tugmasi bosilganda
  const handleDirectOrder = (product: Product) => {
    setSelectedProductForOrder(product);
    setSelectedSizeForOrder(product.sizes[0] || 'L');

    const contactEl = document.getElementById('contact');
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* 1. Header (Navbar) */}
      <Header
        onOrderClick={() => {
          const contactEl = document.getElementById('contact');
          if (contactEl) contactEl.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* 2. Hero & 1-bo'lim: Kompaniya haqida qisqa ma'lumot */}
      <main className="flex-1">
        <Hero />
        <AboutSection />

        {/* 3. 2-bo'lim: 50 ga yaqin mahsulotlar katalogi */}
        <ProductsSection
          onSelectProduct={(product) => setSelectedProductForModal(product)}
          onDirectOrder={handleDirectOrder}
        />

        {/* 4. 3-bo'lim: Mijozlardan kelgan kommentariyalar (Sharhlar) */}
        <ReviewsSection />

        {/* 5. 4-bo'lim: Mijozlar murojaat qilishi uchun Anketa bo'limi */}
        <ContactSection
          selectedProductForOrder={selectedProductForOrder}
          selectedSizeForOrder={selectedSizeForOrder}
          onClearSelectedProduct={() => setSelectedProductForOrder(null)}
        />
      </main>

      {/* 6. Footer */}
      <Footer />

      {/* Mahsulotni tezkor ko'rish (Quick-view) modali */}
      <ProductQuickViewModal
        product={selectedProductForModal}
        onClose={() => setSelectedProductForModal(null)}
        onOrderProduct={handleOrderFromModal}
      />
    </div>
  );
}
