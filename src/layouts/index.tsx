import { Outlet, useLocation } from 'react-router-dom';
import { Header, Footer } from './components/Shared';

export function PublicLayout() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-foreground font-sans antialiased selection:bg-ember selection:text-white transition-colors duration-150">
      <Header />
      <main className={`flex-grow w-full ${isHomePage ? '' : 'max-w-[1280px] mx-auto px-4 sm:px-8 pt-8 sm:pt-10 pb-20'}`}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export function AuthenticatedLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-canvas text-foreground font-sans antialiased selection:bg-ember selection:text-white transition-colors duration-150">
      <Header />
      <main className="flex-grow w-full max-w-[1280px] mx-auto px-4 sm:px-8 pt-8 sm:pt-10 pb-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
