'use client'

export default function ErrorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFEFBB] to-[#f5e6a8] flex items-center justify-center p-5">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-[#FFEFBB] p-8 text-center border-b border-[#f5e6a8]">
          <div className="flex items-center justify-center gap-2 mb-5">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
              <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="m9.474 16l9.181 3.284a1.1 1.1 0 0 0 1.462-.887L21.99 4.239c.114-.862-.779-1.505-1.567-1.13L2.624 11.605c-.88.42-.814 1.69.106 2.017l2.44.868l1.33.467M13 17.26l-1.99 3.326c-.65.808-1.959.351-1.959-.683V17.24a2 2 0 0 1 .53-1.356l3.871-4.2"/>
            </svg>
            <span className="text-3xl font-normal text-gray-800 tracking-wide" style={{ fontFamily: 'Jost, sans-serif' }}>
              Orbis
            </span>
          </div>
          
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-lg">
            <svg className="w-10 h-10 text-gray-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="p-10 text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4" style={{ fontFamily: 'Jost, sans-serif' }}>
            Algo salió mal
          </h2>
          <p className="text-base text-gray-600 leading-relaxed mb-8" style={{ fontFamily: 'Jost, sans-serif' }}>
            Lo sentimos, hemos encontrado un problema inesperado. Por favor, intenta nuevamente o contacta con nuestro equipo de soporte.
          </p>
          
          <button 
            onClick={() => window.location.reload()}
            className="w-full bg-gray-800 text-white py-4 px-10 rounded-lg text-base font-medium transition-all duration-300 hover:bg-gray-700 hover:-translate-y-0.5 hover:shadow-xl"
            style={{ fontFamily: 'Jost, sans-serif' }}
          >
            Intentar de nuevo
          </button>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 bg-gray-50 text-center border-t border-gray-200">
          <p className="text-sm text-gray-400 m-0" style={{ fontFamily: 'Jost, sans-serif' }}>
            Si el problema persiste, contáctanos
          </p>
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500;600&display=swap');
      `}</style>
    </div>
  )
}