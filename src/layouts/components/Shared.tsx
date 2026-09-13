import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthProvider';
import { GhostLink, PillButton } from '../../components/ui/Button';
import { Menu, X, Bell, Search, ChevronDown } from 'lucide-react';
import { useUnreadNotifications } from '../../features/notifications/queries';

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const { data: unreadData } = useUnreadNotifications(isAuthenticated);
  const unreadCount = unreadData?.totalElements || 0;

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsAccountMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setIsAccountMenuOpen(false);
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsAccountMenuOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsMobileMenuOpen(false);
      navigate(`/courses?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const renderLinks = () => (
    <>
      {isAuthenticated && user?.role === 'STUDENT' && (
        <GhostLink href="/learn">My Learning</GhostLink>
      )}
      {isAuthenticated && user?.role === 'INSTRUCTOR' && (
        <>
          <GhostLink href="/instructor">Dashboard</GhostLink>
          <GhostLink href="/instructor/courses">My Courses</GhostLink>
          <GhostLink href="/instructor/profile">Profile</GhostLink>
        </>
      )}
      {isAuthenticated && user?.role === 'ADMIN' && (
        <>
          <GhostLink href="/admin">Admin Hub</GhostLink>
          <GhostLink href="/admin/courses">Moderation</GhostLink>
        </>
      )}
    </>
  );

  return (
    <header className="border-b-2 border-midnight-ink bg-cream-paper sticky top-0 z-50">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 py-2 md:py-2 flex items-center justify-between gap-6 lg:gap-8">
        
        {/* Logo / Brand */}
        <div className="flex items-center gap-6 lg:gap-8 shrink-0">
          <Link to="/" className="font-degular-display text-2xl md:text-[32px] leading-none font-bold tracking-heading-sm text-midnight-ink z-[60]">
            EdTech
          </Link>
        </div>

        {/* Desktop User Actions */}
        <div className="hidden md:flex items-center gap-6 shrink-0 relative justify-end">
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="font-usual font-bold text-midnight-ink hover:text-signal-blue transition-colors">
                Login
              </Link>
              <Link to="/register">
                <PillButton className="py-2.5 px-6">Register</PillButton>
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-6">
              <Link to="/notifications" className="relative p-2 hover:bg-black/5 rounded-full transition-colors group cursor-pointer flex items-center justify-center" aria-label="Notifications">
                <Bell size={24} className="text-midnight-ink group-hover:text-signal-blue transition-colors" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 w-5 h-5 bg-ember-red rounded-full flex items-center justify-center text-[10px] font-bold text-white border-2 border-cream-paper shadow-sm">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>

              <div className="relative" ref={accountMenuRef}>
                <button 
                  onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                  className="flex items-center gap-3 focus:outline-none group hover:opacity-80 transition-opacity"
                  title={user?.name}
                  aria-expanded={isAccountMenuOpen}
                >
                  <div className="w-10 h-10 rounded-full bg-saffron-yellow border-2 border-midnight-ink flex items-center justify-center font-degular-display text-lg font-bold text-midnight-ink shrink-0 group-hover:border-signal-blue transition-colors">
                    {user?.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-usual text-sm font-bold text-midnight-ink max-w-[120px] truncate">
                      {user?.name}
                    </span>
                    <ChevronDown size={16} className={`text-midnight-ink transition-transform duration-200 ${isAccountMenuOpen ? 'rotate-180' : ''}`} />
                  </div>
                </button>
                
                {isAccountMenuOpen && (
                  <div className="absolute right-0 mt-4 w-56 bg-white border-2 border-midnight-ink shadow-[4px_4px_0px_rgba(0,0,0,1)] z-50 flex flex-col py-2">
                    <div className="px-4 py-3 border-b border-midnight-ink/20 mb-2 flex flex-col">
                      <span className="font-bold text-midnight-ink truncate">{user?.name}</span>
                      <span className="text-xs uppercase tracking-wider text-signal-blue font-bold">{user?.role}</span>
                    </div>

                    {user?.role === 'STUDENT' && <Link to="/learn" className="px-4 py-2.5 text-sm font-bold hover:bg-cream-paper transition-colors">My Learning</Link>}
                    {user?.role === 'INSTRUCTOR' && (
                      <>
                        <Link to="/instructor" className="px-4 py-2.5 text-sm font-bold hover:bg-cream-paper transition-colors">Instructor Dashboard</Link>
                        <Link to="/instructor/courses" className="px-4 py-2.5 text-sm font-bold hover:bg-cream-paper transition-colors">My Courses</Link>
                        <Link to="/instructor/profile" className="px-4 py-2.5 text-sm font-bold hover:bg-cream-paper transition-colors">Profile</Link>
                      </>
                    )}
                    {user?.role === 'ADMIN' && (
                      <>
                        <Link to="/admin" className="px-4 py-2.5 text-sm font-bold hover:bg-cream-paper transition-colors">Admin Dashboard</Link>
                        <Link to="/admin/courses" className="px-4 py-2.5 text-sm font-bold hover:bg-cream-paper transition-colors">Course Moderation</Link>
                      </>
                    )}
                    <div className="border-t border-midnight-ink/20 my-2"></div>
                    <button 
                      onClick={logout}
                      className="px-4 py-2.5 text-sm font-bold text-left text-ember-red hover:bg-ember-red/10 transition-colors w-full"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center gap-4 ml-auto">
          {isAuthenticated && (
            <Link to="/notifications" className="relative p-2" aria-label="Notifications">
              <Bell size={24} className="text-midnight-ink" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-ember-red rounded-full flex items-center justify-center text-[10px] font-bold text-white border border-midnight-ink">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>
          )}
          <button 
            className="p-2 -mr-2 text-midnight-ink z-[60] focus:outline-none" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 h-[calc(100vh-72px)] bg-cream-paper z-50 flex flex-col border-t-2 border-midnight-ink overflow-y-auto">
          
          <div className="p-6 flex flex-col flex-grow">
            <form onSubmit={handleSearchSubmit} className="relative w-full mb-8">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-midnight-ink/50" />
              <input 
                type="text" 
                placeholder="Search courses..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border-2 border-midnight-ink bg-white py-3 pl-10 pr-4 font-usual text-base focus:outline-none focus:ring-2 focus:ring-signal-blue"
              />
            </form>

            <nav className="flex flex-col gap-6 items-start">
              {renderLinks()}
            </nav>
            
            <div className="mt-auto pt-8 border-t-2 border-midnight-ink/10 flex flex-col gap-6">
              {!isAuthenticated ? (
                <>
                  <Link to="/login" className="font-usual font-bold text-xl text-midnight-ink hover:text-signal-blue transition-colors text-center py-2">
                    Login
                  </Link>
                  <Link to="/register" className="w-full">
                    <PillButton className="w-full justify-center py-3">Register</PillButton>
                  </Link>
                </>
              ) : (
                <div className="flex flex-col gap-6">
                  <div className="flex items-center gap-4 p-4 border-2 border-midnight-ink bg-white">
                    <div className="w-12 h-12 rounded-full bg-saffron-yellow border-2 border-midnight-ink flex items-center justify-center font-degular-display text-xl font-bold text-midnight-ink shrink-0">
                      {user?.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-usual text-lg font-bold text-midnight-ink leading-tight truncate max-w-[200px]">
                        {user?.name}
                      </span>
                      <span className="text-xs uppercase tracking-wider text-signal-blue font-bold mt-1">{user?.role}</span>
                    </div>
                  </div>
                  <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="w-full font-usual text-lg font-bold text-ember-red text-center py-3 border-2 border-ember-red hover:bg-ember-red hover:text-white transition-colors">
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t-2 border-midnight-ink bg-midnight-ink text-cream-paper py-12 md:py-20 mt-12 md:mt-24">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 md:gap-8">
        
        {/* Brand Column */}
        <div className="flex flex-col gap-4">
          <Link to="/" className="font-degular-display text-2xl md:text-[32px] leading-none font-bold tracking-heading-sm">
            EdTech
          </Link>
          <p className="font-usual text-sm opacity-70 mt-2">
            Empowering modern learners with curated, high-quality technical education.
          </p>
        </div>

        {/* Platform Column */}
        <div className="flex flex-col gap-4">
          <h3 className="font-degular-display text-lg font-bold uppercase tracking-widest text-saffron-yellow">Platform</h3>
          <Link to="/courses" className="font-usual text-sm hover:text-signal-blue transition-colors w-fit">Browse Courses</Link>
        </div>

        {/* Roles Column */}
        <div className="flex flex-col gap-4">
          <h3 className="font-degular-display text-lg font-bold uppercase tracking-widest text-blush-pink">For You</h3>
          <Link to="/learn" className="font-usual text-sm hover:text-signal-blue transition-colors w-fit">My Learning</Link>
          <Link to="/instructor" className="font-usual text-sm hover:text-signal-blue transition-colors w-fit">Instructor Dashboard</Link>
          <Link to="/register" className="font-usual text-sm hover:text-signal-blue transition-colors w-fit">Become an Instructor</Link>
        </div>

        {/* Company Column */}
        <div className="flex flex-col gap-4">
          <h3 className="font-degular-display text-lg font-bold uppercase tracking-widest text-signal-blue">Company</h3>
          <span className="font-usual text-sm opacity-50 w-fit cursor-pointer hover:opacity-100 transition-opacity">About Us</span>
          <span className="font-usual text-sm opacity-50 w-fit cursor-pointer hover:opacity-100 transition-opacity">Contact</span>
          <span className="font-usual text-sm opacity-50 w-fit cursor-pointer hover:opacity-100 transition-opacity">Terms & Privacy</span>
        </div>
      </div>
      
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 mt-12 pt-8 border-t border-cream-paper/20">
        <div className="font-usual text-sm opacity-50 text-center md:text-left">
          © {new Date().getFullYear()} Earlydog Design Lab / EdTech Platform. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
