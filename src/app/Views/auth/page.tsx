import AuthView from './AuthView'

export default function AuthPage() {
    return (
        <div className="font-sans flex items-center justify-center min-h-screen p-8 bg-gray-50">
            <div className='w-4/5 max-w-6xl'>
                <AuthView />
            </div>
        </div>
    )
}
