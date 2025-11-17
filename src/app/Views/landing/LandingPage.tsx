'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ChevronLeft, ChevronRight } from 'lucide-react'
export default function TravelLandingPage() {
  // Imágenes para el carrusel
  const carouselImages = [
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    "https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    "https://images.unsplash.com/photo-1530789253388-582c481c54b0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  ]
  // Estado para el carrusel
  const [currentImage, setCurrentImage] = useState(0)
  // Cambiar imagen automáticamente cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % carouselImages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])
  // Funciones para navegar manualmente
  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % carouselImages.length)
  }
  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + carouselImages.length) % carouselImages.length)
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F7F5FB] to-white">
      {/* Encabezado con logo y nombre en negro */}
      <header className="bg-[#07BEB8] shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width={32} height={32} viewBox="0 0 24 24" className="text-white">
              <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m9.474 16l9.181 3.284a1.1 1.1 0 0 0 1.462-.887L21.99 4.239c.114-.862-.779-1.505-1.567-1.13L2.624 11.605c-.88.42-.814 1.69.106 2.017l2.44.868l1.33.467M13 17.26l-1.99 3.326c-.65.808-1.959.351-1.959-.683V17.24a2 2 0 0 1 .53-1.356l3.871-4.2" />
            </svg>
            <span className="text-xl font-bold text-white">Orbis Travel</span>
          </div>
          <nav className="flex items-center gap-6">
            <Link href="#" className="text-white hover:text-gray-200 font-medium">Invitado</Link>
            <Link href="/auth">
              <Button variant="default" className="bg-white text-[#07BEB8] hover:bg-gray-100">
                Iniciar sesión
              </Button>
            </Link>
          </nav>
        </div>
      </header>
      {/* Hero Section con color principal */}
      <section className="container mx-auto px-6 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-6">
            Descubre el mundo con Orbis
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Los mejores paquetes turísticos a los destinos más increíbles del planeta
          </p>
        </div>
      </section>
      {/* Carrusel con fondo del color principal */}
      <section className="bg-[#256EFF] text-white py-16 relative">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-8">¿Listo para tu próxima aventura?</h2>
          <p className="text-xl mb-12 max-w-2xl mx-auto">
            Reserva ahora y obtén un 10% de descuento en tu primer viaje
          </p>
          {/* Carrusel de imágenes */}
          <div className="relative max-w-4xl mx-auto mb-12">
            <div className="overflow-hidden rounded-lg shadow-2xl h-64 md:h-80">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentImage * 100}%)` }}
              >
                {carouselImages.map((image, index) => (
                  <div key={index} className="w-full flex-shrink-0">
                    <img
                      src={image}
                      alt={`Destino ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              {/* Controles del carrusel */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-2 text-white"
                aria-label="Imagen anterior"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-2 text-white"
                aria-label="Imagen siguiente"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
              {/* Indicadores */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {carouselImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImage(index)}
                    className={`h-2 w-2 rounded-full ${index === currentImage ? 'bg-white' : 'bg-white/50'}`}
                    aria-label={`Ir a imagen ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
         
        </div>
      </section>
      {/* Sección de paquetes destacados */}
      <section className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-black">
          Paquetes destacados
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Aventura en Costa Rica",
              description: "7 días explorando playas y selvas exuberantes",
              price: "$1,200",
              image: "https://images.unsplash.com/photo-1505118380757-91f5f5632df0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
            },
            {
              title: "Cultura en Japón",
              description: "10 días en Tokio y Kioto con guía local",
              price: "$2,500",
              image: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
            },
            {
              title: "Relax en Maldivas",
              description: "5 días en resorts de lujo todo incluido",
              price: "$3,000",
              image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
            },
          ].map((packageItem, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden transition hover:shadow-lg">
              <div className="h-48 overflow-hidden">
                <img
                  src={packageItem.image}
                  alt={packageItem.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-black">{packageItem.title}</h3>
                <p className="text-gray-600 mb-4">{packageItem.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-[#256EFF]">{packageItem.price}</span>
                  <Button variant="outline" className="border-[#256EFF] text-[#256EFF] hover:bg-[#256EFF] hover:text-white transition">
                    Reservar
                  </Button>
                </div>
              </div>
            </div>
            ))}
        </div>
      </section>
      {/* Pie de página */}
      <footer className="bg-black text-white py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" className="text-[#256EFF]">
                <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m9.474 16l9.181 3.284a1.1 1.1 0 0 0 1.462-.887L21.99 4.239c.114-.862-.779-1.505-1.567-1.13L2.624 11.605c-.88.42-.814 1.69.106 2.017l2.44.868l1.33.467M13 17.26l-1.99 3.326c-.65.808-1.959.351-1.959-.683V17.24a2 2 0 0 1 .53-1.356l3.871-4.2" />
              </svg>
              <span className="text-xl font-bold">Orbis Travel</span>
            </div>
            <p className="text-gray-300">© 2025 Orbis Travel. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}