import { Outlet } from 'react-router-dom';
import { Header, Footer } from './components/Shared';

export function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-cream-paper text-midnight-ink font-usual">
      <Header />
      <main className="flex-grow w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-12">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export function AuthenticatedLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-cream-paper text-midnight-ink font-usual">
      <Header />
      <main className="flex-grow w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-12">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
