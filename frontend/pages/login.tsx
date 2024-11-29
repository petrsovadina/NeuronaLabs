import { LoginForm } from '@/components/auth/LoginForm';
import { Container } from '@/components/ui/container';

export default function LoginPage() {
  return (
    <Container size="sm" className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            Přihlášení do systému
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Vítejte zpět v NeuronaLabs
          </p>
        </div>
        <LoginForm />
      </div>
    </Container>
  );
}
