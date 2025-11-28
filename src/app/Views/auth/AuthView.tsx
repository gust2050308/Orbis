'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LogIn from '@/modules/Auth/View/LogIn';
import SignIn from '@/modules/Auth/View/SignIn';
import ViewPage from '@/assets/ViewPage.png';

export default function AuthView() {
  const searchParams = useSearchParams();

  // Mostrar errores de recuperación de contraseña si existen
  useEffect(() => {
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    if (error && errorDescription) {
      toast.error(errorDescription, {
        duration: 5000,
      });
    }
  }, [searchParams]);

  return (
    <div className='mx-auto shadow-sm hover:shadow-xl w-250 hover:w-252 transition-all duration-300 rounded-lg overflow-hidden flex flex-row bg-gray-50'>
      {/* Sección de Tabs */}
      <div className='flex flex-col w-1/2 p-6'>
        <Tabs defaultValue="login" className="w-full h-full transition-all duration-300 ease-in-out">
          <TabsList className='w-full grid grid-cols-2 bg-gray-200'>
            <TabsTrigger value="login" className='cursor-pointer'>Log in</TabsTrigger>
            <TabsTrigger value="signin" className='cursor-pointer'>Sign in</TabsTrigger>
          </TabsList>
          <TabsContent value="login" className="mt-4 px-2 transition-all duration-300 ease-in-out">
            <LogIn />
          </TabsContent>

          <TabsContent value="signin" className="mt-4 px-2 transition-all duration-300 ease-in-out">
            <SignIn />
          </TabsContent>

        </Tabs>
      </div>

      {/* Sección de Imagen */}
      <div className='relative w-1/2'>
        <Image
          src={ViewPage}
          alt="View Page"
          fill
          className="object-cover"
          priority
        />
      </div>
    </div>
  )
}