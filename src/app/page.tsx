import Image from "next/image";
import AuthView from './Views/auth/AuthView'
import DestinationForm from './maps/CrearDestinos'
import CheckoutButton from '././maps/CheckoutButton';


export default function Home() {
  return (
    <div className="font-sans flex items-center justify-center min-h-screen p-8">
      <div className='w-3/5'>
        <AuthView />
      </div>
    </div>
  );
}