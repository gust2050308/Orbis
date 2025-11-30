'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Plane,
  MapPin,
  Compass
} from 'lucide-react';
import LogIn from '@/modules/Auth/View/LogIn';
import SignUp from '@/modules/Auth/View/SignIn';

export default function AuthView() {
  const [activeTab, setActiveTab] = useState('login');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/30 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Fondo con patrón de mapa */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      {/* Elementos decorativos tipo "rutas de viaje" */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <svg className="absolute top-10 left-10 w-96 h-96 opacity-[0.08]" viewBox="0 0 200 200">
          <path d="M 10 100 Q 50 50 100 100 T 190 100" stroke="#07BEB8" strokeWidth="2" fill="none" strokeDasharray="5,5">
            <animate attributeName="stroke-dashoffset" from="0" to="20" dur="2s" repeatCount="indefinite" />
          </path>
        </svg>
        <svg className="absolute bottom-10 right-10 w-96 h-96 opacity-[0.08]" viewBox="0 0 200 200">
          <path d="M 10 100 Q 50 150 100 100 T 190 100" stroke="#256EFF" strokeWidth="2" fill="none" strokeDasharray="5,5">
            <animate attributeName="stroke-dashoffset" from="20" to="0" dur="2s" repeatCount="indefinite" />
          </path>
        </svg>
      </div>

      <div className="w-full max-w-6xl mx-auto relative">
        {/* Logo flotante arriba */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-md px-6 py-3 rounded-full border border-slate-200 shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className='h-8 w-8 text-[#07BEB8]' viewBox="0 0 24 24">
              <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="m9.474 16l9.181 3.284a1.1 1.1 0 0 0 1.462-.887L21.99 4.239c.114-.862-.779-1.505-1.567-1.13L2.624 11.605c-.88.42-.814 1.69.106 2.017l2.44.868l1.33.467M13 17.26l-1.99 3.326c-.65.808-1.959.351-1.959-.683V17.24a2 2 0 0 1 .53-1.356l3.871-4.2"></path>
            </svg>
            <span className="text-xl font-bold bg-gradient-to-r from-[#256EFF] to-[#07BEB8] bg-clip-text text-transparent">
              Orbis Travel
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-[400px_1fr] gap-6">
          
          {/* Sidebar creativa con cards apiladas */}
          <div className="hidden lg:block space-y-4">
            {/* Card 1 - Rotada y superpuesta */}
            <Card className="bg-gradient-to-br from-[#256EFF] to-[#1557d8] border-0 p-6 transform -rotate-2 hover:rotate-0 transition-transform duration-300 shadow-xl">
              <div className="flex items-start gap-3 text-white">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <Plane className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold mb-1">Viaja sin límites</p>
                  <p className="text-sm text-white/90">Más de 50 destinos en México</p>
                </div>
              </div>
            </Card>

            {/* Card 2 - Normal */}
            <Card className="bg-white border-slate-200 p-6 transform hover:scale-105 transition-transform duration-300 shadow-lg">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-[#07BEB8]/10 rounded-lg">
                  <MapPin className="w-5 h-5 text-[#07BEB8]" />
                </div>
                <div>
                  <p className="font-semibold mb-1 text-slate-800">Experiencias únicas</p>
                  <p className="text-sm text-slate-600">Guías expertos en cada destino</p>
                </div>
              </div>
            </Card>

            {/* Card 3 - Rotada opuesta */}
            <Card className="bg-gradient-to-br from-[#07BEB8] to-[#059a95] border-0 p-6 transform rotate-2 hover:rotate-0 transition-transform duration-300 shadow-xl">
              <div className="flex items-start gap-3 text-white">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold mb-1">Tu aventura, tu ritmo</p>
                  <p className="text-sm text-white/90">Itinerarios flexibles</p>
                </div>
              </div>
            </Card>

            {/* Badge testimonial */}
            <div className="pt-4">
              <Badge className="bg-white border-slate-200 text-slate-700 px-4 py-2 shadow-md">
                <span className="mr-2">⭐⭐⭐⭐⭐</span>
                4.9/5 - 5,000+ viajeros
              </Badge>
            </div>
          </div>

          {/* Main Auth Card - Diseño asimétrico */}
          <Card className="bg-white/95 backdrop-blur-xl border-slate-200 overflow-hidden relative shadow-2xl">
            {/* Decoración angular en esquina */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#256EFF]/10 to-transparent" 
                 style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}>
            </div>

            <div className="px-8 relative z-10">
              {/* Header minimalista */}
              <div className="mb-8">
                <h3 className="text-3xl font-bold text-slate-800 mb-2">
                  {activeTab === 'login' ? '¡Hola de nuevo!' : '¡Empecemos!'}
                </h3>
                <p className="text-slate-600">
                  {activeTab === 'login' 
                    ? 'Ingresa para continuar tu aventura' 
                    : 'Crea tu cuenta en segundos'}
                </p>
              </div>

              {/* Tabs con estilo único */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="w-full grid grid-cols-2 mb-8 bg-slate-100 p-1 h-12 border border-slate-200">
                  <TabsTrigger 
                    value="login" 
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#256EFF] data-[state=active]:to-[#1557d8] data-[state=active]:text-white text-slate-600 font-medium transition-all data-[state=active]:shadow-md"
                  >
                    Iniciar sesión
                  </TabsTrigger>
                  <TabsTrigger 
                    value="signup" 
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#07BEB8] data-[state=active]:to-[#059a95] data-[state=active]:text-white text-slate-600 font-medium transition-all data-[state=active]:shadow-md"
                  >
                    Crear cuenta
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="mt-0">
                  <LogIn />
                </TabsContent>

                <TabsContent value="signup" className="mt-0">
                  <SignUp />
                </TabsContent>
              </Tabs>

              {/* Footer simple */}
              
            </div>

            {/* Barra inferior de acento */}
            <div className="h-2 bg-gradient-to-r from-[#256EFF] via-[#07BEB8] to-[#256EFF]"></div>
          </Card>
        </div>

        {/* Términos */}
        <p className="text-center text-xs text-slate-600 mt-6">
          Al continuar, aceptas nuestros{' '}
          <a href="#" className="text-[#07BEB8] hover:underline font-medium">Términos</a>
          {' '}y{' '}
          <a href="#" className="text-[#07BEB8] hover:underline font-medium">Privacidad</a>
        </p>
      </div>
    </div>
  );
}