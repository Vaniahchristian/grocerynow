import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { LoginForm } from '@/components/auth/login-form'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* <Header /> */}
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <LoginForm />
        </div>
      </main>
      {/* <Footer /> */}
    </div>
  )
}
