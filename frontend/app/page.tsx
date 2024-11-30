import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] py-12 text-center">
      <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
        Vítejte v NeuronaLabs
      </h1>
      <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400 mt-4">
        Moderní platforma pro neurologickou diagnostiku a správu pacientů
      </p>
      <div className="flex gap-4 mt-8">
        <Link href="/register">
          <Button size="lg">Začít používat</Button>
        </Link>
        <Link href="/about">
          <Button variant="outline" size="lg">
            Zjistit více
          </Button>
        </Link>
      </div>
    </div>
  );
}
