import React from 'react'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import LogIn from '@/modules/Auth/View/LogIn'

export default function AuthView() {
  return (
    <div className='w-full max-w-md mx-auto p-6 shadow-lg rounded-lg'>
      <Tabs defaultValue="login" className="w-full">
        <TabsList className='w-full grid grid-cols-2'>
          <TabsTrigger value="login">Log in</TabsTrigger>
          <TabsTrigger value="signin">Sign in</TabsTrigger>
        </TabsList>
        <TabsContent value="login" className="mt-4 px-2">
          <LogIn />
        </TabsContent>
        <TabsContent value="signin" className="mt-4 px-2">
          Change your password here.
        </TabsContent>
      </Tabs>
    </div>
  )
}