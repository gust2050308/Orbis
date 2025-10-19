import Image from "next/image";
import AuthView from './Views/auth/AuthView'

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <div className='w-full h-full'>
        <AuthView />
      </div>
    </div>
  );
}
