import React from 'react'
import Image from 'next/image'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import LogIn from '@/modules/Auth/View/LogIn'
import SignIn from '@/modules/Auth/View/SignIn'
import ViewPage from '@/assets/ViewPage.png'

export default function AuthView() {
  return (
    <div className='w-full mx-auto shadow-xl rounded-lg overflow-hidden flex flex-row'>
      {/* Sección de Tabs */}
      <div className='flex flex-col w-1/2 p-6'>
        <Tabs defaultValue="login" className="w-full h-full">
          <TabsList className='w-full grid grid-cols-2 bg-gray-200'>
            <TabsTrigger value="login" className='cursor-pointer'>Log in</TabsTrigger>
            <TabsTrigger value="signin" className='cursor-pointer'>Sign in</TabsTrigger>
          </TabsList>
          <TabsContent value="login" className="mt-4 px-2">
            <LogIn />
          </TabsContent>
          <TabsContent value="signin" className="mt-4 px-2">
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