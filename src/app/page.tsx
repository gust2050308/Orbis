import Image from "next/image";
import AuthView from './Views/auth/AuthView'

export default function Home() {
  return (
    <div className="font-sans flex items-center justify-center min-h-screen p-8">
      <div className='w-full max-w-md'>
        <AuthView />
      </div>
    </div>
  );
}