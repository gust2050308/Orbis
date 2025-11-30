'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useRouter } from 'next/navigation'
import {
  Globe,
  Plane,
  Hotel,
  Users,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  Star,
  ArrowRight,
  Check,
  Search,
  Sparkles,
  Mountain,
  Palmtree,
  Building2
} from 'lucide-react'

// Simulación de datos de excursiones
const mockExcursions = [
  {
    id: 1,
    title: "CDMX - Puebla",
    description: "Dos de las mejores ciudades de México",
    price: 8000.00,
    min_deposit: 2000.00,
    duration_days: 3,
    available_seats: 30,
    start_date: "2025-11-28",
    end_date: "2025-11-30",
    image: "https://images.unsplash.com/photo-1518638150340-f706e86654de?w=800&q=80"
  },
  {
    id: 2,
    title: "CDMX",
    description: "La Capital del mejor país",
    price: 4000.00,
    min_deposit: 1000.00,
    duration_days: 2,
    available_seats: 10,
    start_date: "2025-11-28",
    end_date: "2025-11-29",
    image: "https://images.unsplash.com/photo-1555217851-6141535bd771?w=800&q=80"
  },
  {
    id: 3,
    title: "Puebla",
    description: "La gastronomía de este lugar es inigualable.",
    price: 4000.00,
    min_deposit: 1500.00,
    duration_days: 2,
    available_seats: 15,
    start_date: "2025-11-28",
    end_date: "2025-11-30",
    image: "https://images.unsplash.com/photo-1612438482614-75b6c26e0e64?w=800&q=80"
  }
]

export default function TravelLandingPage() {
  const router = useRouter()

  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [email, setEmail] = useState('')

  const testimonials = [
    {
      name: "María González",
      location: "Ciudad de México",
      text: "La mejor experiencia de viaje que he tenido. Todo perfectamente organizado y los destinos increíbles.",
      rating: 5,
      avatar: "https://i.pravatar.cc/150?img=1"
    },
    {
      name: "Carlos Ramírez",
      location: "Guadalajara",
      text: "Orbis Travel superó todas mis expectativas. Guías profesionales y atención de primera clase.",
      rating: 5,
      avatar: "https://i.pravatar.cc/150?img=3"
    },
    {
      name: "Ana Martínez",
      location: "Monterrey",
      text: "Cada detalle cuidado al máximo. Definitivamente volveré a viajar con ellos.",
      rating: 5,
      avatar: "https://i.pravatar.cc/150?img=5"
    }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      {/* Header con efecto glassmorphism */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-200/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" className='h-9 w-9 text-[#07BEB8]' width={48} height={48} viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="m9.474 16l9.181 3.284a1.1 1.1 0 0 0 1.462-.887L21.99 4.239c.114-.862-.779-1.505-1.567-1.13L2.624 11.605c-.88.42-.814 1.69.106 2.017l2.44.868l1.33.467M13 17.26l-1.99 3.326c-.65.808-1.959.351-1.959-.683V17.24a2 2 0 0 1 .53-1.356l3.871-4.2"></path></svg>
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-[#256EFF] to-[#07BEB8] bg-clip-text text-transparent">
                  Orbis Travel
                </span>
                <p className="text-xs text-slate-500">Explora el mundo</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <a href="#excursions" className="text-slate-700 hover:text-[#256EFF] font-medium transition-colors">
                Excursiones
              </a>
              <a href="#why-us" className="text-slate-700 hover:text-[#256EFF] font-medium transition-colors">
                Por qué elegirnos
              </a>
              <a href="#testimonials" className="text-slate-700 hover:text-[#256EFF] font-medium transition-colors">
                Testimonios
              </a>
              <Button className="bg-gradient-to-r from-[#256EFF] to-[#07BEB8] hover:opacity-90 text-white shadow-lg shadow-[#256EFF]/25"
                onClick={() => router.push('/Views/auth')}>
                Iniciar sesión
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section con diseño impactante */}
      {/* Hero Section con diseño impactante */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Elementos decorativos de fondo con animación */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          {/* Luz 1 - Azul - Flotación lenta */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#256EFF]/10 rounded-full blur-3xl animate-float-slow"></div>

          {/* Luz 2 - Cyan - Flotación media */}
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#07BEB8]/10 rounded-full blur-3xl animate-float-medium"></div>

          {/* Luz 3 - Violeta - Flotación rápida */}
          <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl animate-float-fast"></div>

          {/* Luz 4 - Rosa - Flotación retardada */}
          <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-pink-500/5 rounded-full blur-3xl animate-float-delayed"></div>

          {/* Luz 5 - Amarillo - Pulso lento */}
          <div className="absolute bottom-1/4 left-1/2 w-56 h-56 bg-yellow-400/5 rounded-full blur-3xl animate-pulse-slow"></div>

          {/* Luz 6 - Verde - Pulso medio */}
          <div className="absolute top-3/4 right-1/3 w-48 h-48 bg-green-400/5 rounded-full blur-3xl animate-pulse-medium"></div>
        </div>

        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#256EFF]/10 to-[#07BEB8]/10 rounded-full border border-[#256EFF]/20">
              <Sparkles className="h-4 w-4 text-[#256EFF]" />
              <span className="text-sm font-semibold text-[#256EFF]">Ofertas exclusivas disponibles</span>
            </div>

            <h1 className="text-6xl md:text-7xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-[#102542] via-[#256EFF] to-[#07BEB8] bg-clip-text text-transparent">
                Descubre México
              </span>
              <br />
              <span className="text-slate-800">como nunca antes</span>
            </h1>

            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Excursiones cuidadosamente diseñadas para que vivas experiencias inolvidables.
              Desde la vibrante CDMX hasta la encantadora Puebla.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-[#256EFF] to-[#07BEB8] hover:opacity-90 text-white px-8 py-6 text-lg rounded-xl shadow-2xl shadow-[#256EFF]/30 group"
              >
                Explorar excursiones
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-6 text-lg rounded-xl border-2 border-[#256EFF] text-[#256EFF] hover:bg-[#256EFF]/5"
              >
                Ver ofertas especiales
              </Button>
            </div>

            {/* Stats destacadas */}
            <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto pt-12">
              {[
                { icon: Users, value: "5000+", label: "Viajeros felices" },
                { icon: MapPin, value: "50+", label: "Destinos" },
                { icon: Star, value: "4.9/5", label: "Calificación" }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-[#256EFF]/10 to-[#07BEB8]/10 mb-3">
                    <stat.icon className="h-6 w-6 text-[#256EFF]" />
                  </div>
                  <p className="text-3xl font-bold text-slate-800">{stat.value}</p>
                  <p className="text-sm text-slate-600">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* Barra de búsqueda flotante */}
      <section className="px-6 -mt-8 relative z-10">
        <div className="container mx-auto max-w-4xl">
          <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input
                    placeholder="¿A dónde quieres ir?"
                    className="pl-10 py-6 text-lg border-slate-200 focus:border-[#256EFF]"
                  />
                </div>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input
                    type="date"
                    className="pl-10 py-6 border-slate-200 focus:border-[#256EFF]"
                  />
                </div>
                <Button className="bg-gradient-to-r from-[#256EFF] to-[#07BEB8] hover:opacity-90 text-white px-8 py-6 text-lg">
                  Buscar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Excursiones destacadas */}
      <section id="excursions" className="py-24 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-[#07BEB8]/10 text-[#07BEB8] hover:bg-[#07BEB8]/20">
              Nuestras mejores ofertas
            </Badge>
            <h2 className="text-5xl font-bold text-slate-800 mb-4">
              Excursiones que te enamorarán
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Paquetes todo incluido con los mejores precios del mercado
            </p>
          </div>

          <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {mockExcursions.map((exc) => (
              <Card
                key={exc.id}
                className="group overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer"
                onMouseEnter={() => setHoveredCard(exc.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Imagen con overlay */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={exc.image}
                    alt={exc.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Badge de oferta */}
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-[#07BEB8] text-white shadow-lg">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Oferta especial
                    </Badge>
                  </div>

                  {/* Precio destacado */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-xl transform group-hover:scale-105 transition-transform">
                      <p className="text-xs text-slate-600 font-medium mb-1">Desde</p>
                      <div className="flex items-baseline gap-2">
                        <p className="text-4xl font-bold bg-gradient-to-r from-[#256EFF] to-[#07BEB8] bg-clip-text text-transparent">
                          ${exc.price.toFixed(2)}
                        </p>
                        <p className="text-sm text-slate-500">MXN</p>
                      </div>
                    </div>
                  </div>
                </div>

                <CardHeader className="pb-3">
                  <CardTitle className="text-2xl font-bold text-slate-800 group-hover:text-[#256EFF] transition-colors">
                    {exc.title}
                  </CardTitle>
                  <CardDescription className="text-base text-slate-600">
                    {exc.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Badges informativos */}
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {exc.duration_days} días
                    </Badge>
                    <Badge
                      className={`flex items-center gap-1 ${exc.available_seats > 10
                        ? 'bg-green-500/10 text-green-700'
                        : 'bg-orange-500/10 text-orange-700'
                        }`}
                    >
                      <Users className="w-3 h-3" />
                      {exc.available_seats} lugares
                    </Badge>
                  </div>

                  {/* Detalles */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-slate-600">
                      <DollarSign className="w-4 h-4 text-[#07BEB8]" />
                      <span>Depósito desde ${exc.min_deposit.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Calendar className="w-4 h-4 text-[#07BEB8]" />
                      <span>
                        {new Date(exc.start_date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                        {' - '}
                        {new Date(exc.end_date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="pt-4 border-t">
                  <Button
                    className="w-full bg-gradient-to-r from-[#256EFF] to-[#07BEB8] hover:opacity-90 text-white group"
                  >
                    Ver detalles
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-[#256EFF] text-[#256EFF] hover:bg-[#256EFF]/5 px-8"
            >
              Ver todas las excursiones
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Por qué elegirnos */}
      <section id="why-us" className="py-24 px-6 bg-gradient-to-br from-slate-50 to-white">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-[#256EFF]/10 text-[#256EFF]">
              Nuestra promesa
            </Badge>
            <h2 className="text-5xl font-bold text-slate-800 mb-4">
              La experiencia Orbis Travel
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Más que un viaje, una experiencia transformadora
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Hotel className="h-8 w-8" />,
                title: "Alojamiento Premium",
                description: "Hoteles 4 y 5 estrellas cuidadosamente seleccionados para tu máximo confort.",
                color: "from-blue-500 to-cyan-500"
              },
              {
                icon: <Users className="h-8 w-8" />,
                title: "Guías Expertos",
                description: "Profesionales certificados que conocen cada secreto de los destinos.",
                color: "from-purple-500 to-pink-500"
              },
              {
                icon: <DollarSign className="h-8 w-8" />,
                title: "Mejor Precio Garantizado",
                description: "Encontramos el mismo paquete más barato y te devolvemos la diferencia.",
                color: "from-green-500 to-emerald-500"
              },
              {
                icon: <Phone className="h-8 w-8" />,
                title: "Soporte 24/7",
                description: "Estamos contigo en cada momento de tu aventura, día y noche.",
                color: "from-orange-500 to-red-500"
              },
              {
                icon: <MapPin className="h-8 w-8" />,
                title: "Itinerarios Flexibles",
                description: "Personaliza tu viaje según tus preferencias y ritmo.",
                color: "from-indigo-500 to-blue-500"
              },
              {
                icon: <Sparkles className="h-8 w-8" />,
                title: "Experiencias Únicas",
                description: "Acceso exclusivo a lugares y actividades que otros no ofrecen.",
                color: "from-yellow-500 to-orange-500"
              }
            ].map((feature, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 group overflow-hidden"
              >
                <CardContent className="p-8 relative">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} text-white mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#256EFF]/5 to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonios */}
      <section id="testimonials" className="py-24 px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-[#07BEB8]/10 text-[#07BEB8]">
              Testimonios
            </Badge>
            <h2 className="text-5xl font-bold text-slate-800 mb-4">
              Lo que dicen nuestros viajeros
            </h2>
          </div>

          <Card className="border-0 shadow-2xl overflow-hidden">
            <CardContent className="p-12">
              <div className="flex flex-col items-center text-center">
                <img
                  src={testimonials[currentTestimonial].avatar}
                  alt={testimonials[currentTestimonial].name}
                  className="w-20 h-20 rounded-full mb-6 ring-4 ring-[#07BEB8]/20"
                />
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-2xl text-slate-700 mb-8 leading-relaxed max-w-2xl italic">
                  "{testimonials[currentTestimonial].text}"
                </p>
                <p className="font-bold text-slate-800 text-lg">
                  {testimonials[currentTestimonial].name}
                </p>
                <p className="text-slate-600">
                  {testimonials[currentTestimonial].location}
                </p>
              </div>
              <div className="flex justify-center gap-2 mt-8">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`h-2 rounded-full transition-all ${index === currentTestimonial
                      ? 'w-8 bg-[#256EFF]'
                      : 'w-2 bg-slate-300'
                      }`}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 px-6 bg-gradient-to-r from-[#256EFF] to-[#07BEB8] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30" />

        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <Sparkles className="h-12 w-12 text-white mx-auto mb-6" />
          <h2 className="text-5xl font-bold text-white mb-6">
            ¿Listo para tu próxima aventura?
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Suscríbete a nuestro newsletter y recibe ofertas exclusivas,
            descuentos especiales y las mejores recomendaciones de viaje.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 py-6 text-lg bg-white/95 border-0"
            />
            <Button
              size="lg"
              className="bg-white text-[#256EFF] hover:bg-white/90 px-8 py-6 text-lg font-semibold shadow-xl"
            >
              Suscribirme
            </Button>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-6 text-white/80">
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5" />
              <span>Sin spam</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5" />
              <span>Ofertas exclusivas</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5" />
              <span>Cancela cuando quieras</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer premium */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Globe className="h-8 w-8 text-[#07BEB8]" />
                <span className="text-2xl font-bold">Orbis Travel</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Creando experiencias de viaje inolvidables desde 2020.
                Tu próxima aventura comienza aquí.
              </p>
              <div className="flex gap-4 mt-6">
                {/* Social icons placeholder */}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">Destinos</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Ciudad de México</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Puebla</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Oaxaca</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Ver todos</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">Compañía</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Sobre nosotros</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Trabaja con nosotros</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Prensa</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">Contacto</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-slate-400">
                  <Mail className="h-5 w-5 text-[#07BEB8]" />
                  <span>info@orbistravel.com</span>
                </li>
                <li className="flex items-center gap-3 text-slate-400">
                  <Phone className="h-5 w-5 text-[#07BEB8]" />
                  <span>+52 123 456 7890</span>
                </li>
                <li className="flex items-center gap-3 text-slate-400">
                  <MapPin className="h-5 w-5 text-[#07BEB8]" />
                  <span>México</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-slate-400 text-sm">
                © 2025 Orbis Travel. Todos los derechos reservados.
              </p>
              <div className="flex gap-6 text-sm">
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  Términos y Condiciones
                </a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  Política de Privacidad
                </a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  Cookies
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}