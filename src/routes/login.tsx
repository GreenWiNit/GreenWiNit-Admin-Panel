import { LoginForm } from '@/components/login-form'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/login')({
  component: Login,
})

function Login() {
  return (
    <div className="flex w-full items-center justify-center">
      <LoginForm />
    </div>
  )
}
