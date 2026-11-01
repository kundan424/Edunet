import { Outlet, useLocation } from 'react-router-dom';
import { Header, Footer } from './components/Shared';

export function PublicLayout() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f8f6] text-[#121212] font-['Inter',sans-serif]">
      <Header />
      <main className={`flex-grow w-full ${isHomePage ? '' : 'max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12'}`}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export function AuthenticatedLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8f8f6] text-[#121212] font-['Inter',sans-serif]">
      <Header />
      <main className="flex-grow w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
