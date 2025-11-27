'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Globe, Plane, Hotel, Users, Mail, Phone, MapPin } from 'lucide-react'

export default function TravelLandingPage() {
  const [currentImage, setCurrentImage] = useState(0)
  const carouselImages = [
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    "https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % carouselImages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % carouselImages.length)
  const prevImage = () => setCurrentImage((prev) => (prev - 1 + carouselImages.length) % carouselImages.length)

  return (
    <div className="min-h-screen bg-white">
      {/* Nueva barra de navegación minimalista */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Globe className="h-8 w-8 text-[#07BEB8]" />
            <span className="text-xl font-bold text-gray-800">Orbis Travel</span>
          </div>
          <nav className="flex items-center gap-6">
            <Link href="#" className="text-gray-600 hover:text-[#07BEB8] font-medium">Inicio</Link>
            <Link href="#" className="text-gray-600 hover:text-[#07BEB8] font-medium">Destinos</Link>
            <Link href="#" className="text-gray-600 hover:text-[#07BEB8] font-medium">Acerca de</Link>
            <Link href="#" className="text-gray-600 hover:text-[#07BEB8] font-medium">Contacto</Link>
            <Link href="/Views/auth">
              <Button className="bg-[#07BEB8] hover:bg-[#059a94] text-white">
                Iniciar sesión
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section con diseño moderno y limpio */}
      <section className="container mx-auto px-6 py-24 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-[#f0f9ff] rounded-full text-[#07BEB8] font-medium">
            <Plane className="h-4 w-4" />
            <span>Descubre el mundo</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Viajes que inspiran
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Experimenta destinos increíbles con paquetes turísticos diseñados para crear recuerdos inolvidables.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/Views/destinations">
              <Button className="bg-[#07BEB8] hover:bg-[#059a94] text-white px-8 py-6 text-lg rounded-lg">
                Explorar destinos
              </Button>
            </Link>

          </div>
        </div>
      </section>

      {/* Sección de características con iconos */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: <Globe className="h-10 w-10 text-[#07BEB8]" />,
                title: "Destinos globales",
                description: "Más de 100 destinos en todo el mundo para que elijas tu próxima aventura."
              },
              {
                icon: <Hotel className="h-10 w-10 text-[#07BEB8]" />,
                title: "Alojamiento premium",
                description: "Hoteles cuidadosamente seleccionados para garantizar tu comodidad."
              },
              {
                icon: <Users className="h-10 w-10 text-[#07BEB8]" />,
                title: "Guías expertos",
                description: "Equipo de guías locales que conocen cada rincón de los destinos."
              }
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Carrusel de imágenes con diseño limpio */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Destinos populares</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Descubre los lugares más buscados por nuestros viajeros.
            </p>
          </div>
          <div className="relative max-w-5xl mx-auto">
            <div className="overflow-hidden rounded-xl shadow-lg">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentImage * 100}%)` }}
              >
                {carouselImages.map((image, index) => (
                  <div key={index} className="w-full flex-shrink-0">
                    <img
                      src={image}
                      alt={`Destino ${index + 1}`}
                      className="w-full h-96 object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center gap-4 mt-6">
              {carouselImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImage(index)}
                  className={`h-3 w-3 rounded-full ${index === currentImage ? 'bg-[#07BEB8]' : 'bg-gray-300'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sección "Acerca de nosotros" con diseño moderno */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">¿Por qué elegirnos?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              En Orbis Travel nos dedicamos a crear experiencias de viaje excepcionales.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                title: "Experiencia personalizada",
                description: "Cada viaje es diseñado según tus preferencias y necesidades.",
                icon: <Users className="h-8 w-8 text-[#07BEB8]" />
              },
              {
                title: "Atención 24/7",
                description: "Nuestro equipo está disponible para ti en todo momento durante tu viaje.",
                icon: <Phone className="h-8 w-8 text-[#07BEB8]" />
              },
              {
                title: "Precios transparentes",
                description: "Sin costos ocultos. Sabrás exactamente lo que pagas por cada servicio.",
                icon: <MapPin className="h-8 w-8 text-[#07BEB8]" />
              }
            ].map((item, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-xl text-center">
                <div className="flex justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* Pie de página minimalista */}
      <footer className="w-full bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Globe className="h-6 w-6 text-[#07BEB8]" />
                <span className="text-xl font-bold">Orbis Travel</span>
              </div>
              <p className="text-gray-400">
                Creando experiencias de viaje inolvidables desde 2020.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Enlaces rápidos</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="text-gray-400 hover:text-white">Inicio</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white">Destinos</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white">Acerca de</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white">Contacto</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Contacto</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-[#07BEB8]" />
                  <span className="text-gray-400">info@orbistravel.com</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-[#07BEB8]" />
                  <span className="text-gray-400">+52 123 456 7890</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Suscríbete</h3>
              <p className="text-gray-400 mb-4">Recibe nuestras mejores ofertas.</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Tu correo electrónico"
                  className="flex-1 px-4 py-2 rounded-lg text-gray-900"
                />

              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>© 2025 Orbis Travel. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}