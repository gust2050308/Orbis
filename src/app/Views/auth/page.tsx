import AuthView from './AuthView'
import { Login2 } from '@/modules/Auth/View/Login2'

export default function AuthPage() {
    return (
        <div className="font-sans flex items-center justify-center min-h-screen p-8 bg-[#256eff]">
            <div className='w-4/5 max-w-6xl'>
                <AuthView />
            </div>
        </div>
    )
}
