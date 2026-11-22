import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../auth/AuthProvider';
import { 
  Menu, 
  X, 
  Bell, 
  ChevronDown, 
  BookOpen, 
  LogOut,
  User as UserIcon,
  LayoutDashboard,
  ShieldAlert,
  Terminal,
  Globe,
  Share2
} from 'lucide-react';

import { useUnreadNotifications } from '../../features/notifications/queries';
import { ThemeSwitcher } from '../../components/ui/ThemeSwitcher';

/**
 * Superset 65px Sticky Navigation
 * - 65px height, backdrop blur (8px), 1px translucent hairline border
 * - Compact wordmark, Inter 13px links, IBM Plex Mono conversion action
 * - Integrated Theme Switcher (Dark / Light)
 */
export function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const location = useLocation();

  const accountMenuRef = useRef<HTMLDivElement>(null);
  const prevPathRef = useRef(location.pathname);
  const { data: unreadData } = useUnreadNotifications(isAuthenticated);
  const unreadCount = unreadData?.totalElements || 0;

  useEffect(() => {
    if (prevPathRef.current !== location.pathname) {
      prevPathRef.current = location.pathname;
      setIsMobileMenuOpen(false);
      setIsAccountMenuOpen(false);
    }
  }, [location.pathname]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setIsAccountMenuOpen(false);
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsAccountMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const isCurrent = (path: string) => location.pathname === path;
  const isCourses = isCurrent('/courses') && !location.search.includes('Certificate') && !location.search.includes('Degree');
  const isCertificates = location.search.includes('Certificate');

  return (
    <header className="sticky top-0 z-50 w-full h-[65px] bg-canvas/85 backdrop-blur-md border-b border-rule transition-colors duration-150">
      <div className="max-w-[1280px] mx-auto h-full px-4 sm:px-8 flex items-center justify-between">
        
        {/* Brand Mark & Name */}
        <div className="flex items-center gap-8 shrink-0">
          <Link 
            to="/" 
            className="flex items-center gap-2.5 group focus:outline-none"
            aria-label="Edunet Home"
          >
            <div className="w-7 h-7 bg-foreground text-canvas flex items-center justify-center font-mono text-xs font-bold transition-transform duration-150 group-hover:scale-105">
              <span>E</span>
            </div>
            <span className="font-sans text-[17px] font-medium text-foreground tracking-[-0.025em]">
              Edunet
            </span>
          </Link>

          {/* Desktop Navigation Links (Inter 400 · 13px · tracking 0.01em) */}
          <nav className="hidden lg:flex items-center gap-1 text-[13px] tracking-[0.01em]">
            <Link
              to="/courses"
              className={`px-3 py-1.5 transition-colors ${
                isCourses 
                  ? 'text-foreground font-medium' 
                  : 'text-muted hover:text-foreground'
              }`}
            >
              All Courses
            </Link>
            <Link
              to="/courses?search=Certificate"
              className={`px-3 py-1.5 transition-colors ${
                isCertificates 
                  ? 'text-foreground font-medium' 
                  : 'text-muted hover:text-foreground'
              }`}
            >
              Certificates
            </Link>
            <a
              href="/#capabilities"
              className="px-3 py-1.5 text-muted hover:text-foreground transition-colors"
            >
              Capabilities
            </a>
            <a
              href="/#voices"
              className="px-3 py-1.5 text-muted hover:text-foreground transition-colors"
            >
              Voices
            </a>
            <a
              href="/#reassurance"
              className="px-3 py-1.5 text-muted hover:text-foreground transition-colors"
            >
              Standards
            </a>
            <a
              href="/#faq"
              className="px-3 py-1.5 text-muted hover:text-foreground transition-colors"
            >
              FAQ
            </a>
            {isAuthenticated && (
              <Link
                to="/dashboard"
                className={`px-3 py-1.5 transition-colors ${
                  isCurrent('/dashboard')
                    ? 'text-foreground font-medium'
                    : 'text-muted hover:text-foreground'
                }`}
              >
                Dashboard
              </Link>
            )}
          </nav>
        </div>

        {/* Right Section: Theme Switcher & Actions */}
        <div className="flex items-center gap-3 shrink-0">
          
          {/* Theme Switcher Toggle */}
          <ThemeSwitcher />

          {!isAuthenticated ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <Link 
                to="/login"
                className="text-muted hover:text-foreground text-[13px] font-sans px-3 py-1.5 transition-colors"
              >
                Sign In
              </Link>
              <Link 
                to="/register"
                className="btn-superset-compact"
              >
                Get Started
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Notifications */}
              <Link
                to="/notifications"
                className="relative p-2 text-muted hover:text-foreground border border-transparent hover:border-rule transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-ember" />
                )}
              </Link>

              {/* Account Dropdown */}
              <div className="relative" ref={accountMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                  className="flex items-center gap-2 p-1.5 border border-rule hover:border-foreground/30 transition-colors cursor-pointer"
                  aria-expanded={isAccountMenuOpen}
                >
                  <div className="w-6 h-6 bg-muted-surface text-foreground text-xs font-mono font-medium flex items-center justify-center">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="hidden sm:inline text-[13px] text-foreground max-w-[120px] truncate">
                    {user?.name}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-muted transition-transform ${isAccountMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isAccountMenuOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-card border border-rule py-1 z-50 shadow-2xl">
                    <div className="px-4 py-3 border-b border-rule">
                      <p className="font-mono text-[10px] uppercase text-muted tracking-wider">Signed in as</p>
                      <p className="text-sm font-medium text-foreground truncate mt-0.5">{user?.name}</p>
                      <span className="inline-block mt-1 font-mono text-[10px] uppercase px-1.5 py-0.5 bg-muted-surface text-ember border border-rule">
                        {user?.role}
                      </span>
                    </div>

                    <div className="py-1">
                      {user?.role === 'STUDENT' && (
                        <>
                          <Link
                            to="/dashboard"
                            onClick={() => setIsAccountMenuOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-xs text-foreground hover:bg-muted-surface transition-colors"
                          >
                            <LayoutDashboard className="w-3.5 h-3.5 text-muted" />
                            <span>Dashboard</span>
                          </Link>
                          <Link
                            to="/learn"
                            onClick={() => setIsAccountMenuOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-xs text-foreground hover:bg-muted-surface transition-colors"
                          >
                            <BookOpen className="w-3.5 h-3.5 text-muted" />
                            <span>My Learning Workspace</span>
                          </Link>
                        </>
                      )}

                      {user?.role === 'INSTRUCTOR' && (
                        <>
                          <Link
                            to="/dashboard"
                            onClick={() => setIsAccountMenuOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-xs text-foreground hover:bg-muted-surface transition-colors"
                          >
                            <LayoutDashboard className="w-3.5 h-3.5 text-muted" />
                            <span>Instructor Dashboard</span>
                          </Link>
                          <Link
                            to="/instructor/courses"
                            onClick={() => setIsAccountMenuOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-xs text-foreground hover:bg-muted-surface transition-colors"
                          >
                            <BookOpen className="w-3.5 h-3.5 text-muted" />
                            <span>Manage Courses</span>
                          </Link>
                        </>
                      )}

                      {user?.role === 'ADMIN' && (
                        <>
                          <Link
                            to="/dashboard"
                            onClick={() => setIsAccountMenuOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-xs text-foreground hover:bg-muted-surface transition-colors"
                          >
                            <LayoutDashboard className="w-3.5 h-3.5 text-muted" />
                            <span>Admin Overview</span>
                          </Link>
                          <Link
                            to="/admin/courses"
                            onClick={() => setIsAccountMenuOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-xs text-foreground hover:bg-muted-surface transition-colors"
                          >
                            <BookOpen className="w-3.5 h-3.5 text-muted" />
                            <span>Course Moderation</span>
                          </Link>
                          <Link
                            to="/admin/instructors"
                            onClick={() => setIsAccountMenuOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-xs text-foreground hover:bg-muted-surface transition-colors"
                          >
                            <ShieldAlert className="w-3.5 h-3.5 text-muted" />
                            <span>Instructor Applications</span>
                          </Link>
                        </>
                      )}

                      <Link
                        to="/profile"
                        onClick={() => setIsAccountMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs text-foreground hover:bg-muted-surface transition-colors"
                      >
                        <UserIcon className="w-3.5 h-3.5 text-muted" />
                        <span>Profile Settings</span>
                      </Link>
                    </div>

                    <div className="pt-1 border-t border-rule">
                      <button
                        type="button"
                        onClick={() => {
                          logout();
                          setIsAccountMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer text-left"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-foreground border border-rule hover:border-foreground/30 transition-colors"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-rule bg-canvas px-4 py-4 flex flex-col gap-2">
          <Link to="/courses" className="text-sm py-2 px-3 text-foreground hover:bg-wash">
            All Courses
          </Link>
          <Link to="/courses?search=Certificate" className="text-sm py-2 px-3 text-foreground hover:bg-wash">
            Certificates
          </Link>
          <a href="/#capabilities" className="text-sm py-2 px-3 text-muted hover:text-foreground">
            Capabilities
          </a>
          <a href="/#voices" className="text-sm py-2 px-3 text-muted hover:text-foreground">
            Voices
          </a>
          <a href="/#reassurance" className="text-sm py-2 px-3 text-muted hover:text-foreground">
            Standards
          </a>
          <a href="/#faq" className="text-sm py-2 px-3 text-muted hover:text-foreground">
            FAQ
          </a>
          <div className="pt-3 border-t border-rule flex flex-col gap-2">
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="w-full py-2.5 text-center text-xs font-mono uppercase tracking-wider border border-rule text-foreground hover:bg-wash">
                  Sign In
                </Link>
                <Link to="/register" className="w-full py-2.5 text-center text-xs font-mono uppercase tracking-wider bg-action-bg text-action-text hover:bg-ember hover:text-white transition-colors">
                  Get Started
                </Link>
              </>
            ) : (
              <button
                type="button"
                onClick={() => {
                  logout();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full py-2 text-center text-xs text-red-500 hover:bg-red-500/10"
              >
                Sign Out
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

/**
 * Superset Directory Footer:
 * - 80px vertical padding, border-top hairline
 * - Asymmetric brand block + 4 directory link columns with 64px gaps
 * - IBM Plex Mono status indicator and circular trust mark
 */
export function Footer() {
  return (
    <footer className="w-full bg-canvas text-foreground border-t border-rule py-20 transition-colors duration-150">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8">
        
        {/* Main Directory Split */}
        <div className="flex flex-col lg:flex-row justify-between gap-12 lg:gap-16 pb-16 border-b border-rule">
          
          {/* Left Brand Area */}
          <div className="max-w-[360px] space-y-5 shrink-0">
            <Link to="/" className="inline-flex items-center gap-2.5 group">
              <div className="w-7 h-7 bg-foreground text-canvas flex items-center justify-center font-mono text-xs font-bold">
                <span>E</span>
              </div>
              <span className="font-sans text-[18px] font-medium tracking-[-0.025em] text-foreground">
                Edunet
              </span>
            </Link>
            
            <p className="text-[14px] text-muted leading-relaxed font-sans">
              Developer-minded e-learning platform with stage lighting and interactive worktrees. Master full-stack software development, distributed systems, and AI through real working sandbox states.
            </p>

            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 border border-rule bg-wash text-[12px] font-mono text-muted">
              <span className="w-1.5 h-1.5 bg-ember" />
              <span>STAGE RUNTIME: ACTIVE // ZERO RUNTIME ERRORS</span>
            </div>

            {/* Social & Utility Links */}
            <div className="flex items-center gap-3 pt-2">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="w-8 h-8 border border-rule flex items-center justify-center text-muted hover:text-foreground hover:border-ember transition-colors" aria-label="GitHub">
                <Globe className="w-4 h-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-8 h-8 border border-rule flex items-center justify-center text-muted hover:text-foreground hover:border-ember transition-colors" aria-label="Twitter">
                <Share2 className="w-4 h-4" />
              </a>
              <a href="/courses" className="w-8 h-8 border border-rule flex items-center justify-center text-muted hover:text-foreground hover:border-ember transition-colors" aria-label="Terminal">
                <Terminal className="w-4 h-4" />
              </a>
            </div>

          </div>

          {/* Right: Four Directory Columns (64px gaps) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-16">
            
            <div>
              <h4 className="font-sans font-medium text-[14px] text-foreground mb-4">
                Curriculums
              </h4>
              <ul className="space-y-3 text-[14px]">
                <li>
                  <Link to="/courses" className="text-muted hover:text-foreground transition-colors">
                    All Courses
                  </Link>
                </li>
                <li>
                  <Link to="/courses?search=Development" className="text-muted hover:text-foreground transition-colors">
                    Full-Stack Systems
                  </Link>
                </li>
                <li>
                  <Link to="/courses?search=AI" className="text-muted hover:text-foreground transition-colors">
                    Artificial Intelligence
                  </Link>
                </li>
                <li>
                  <Link to="/courses?search=Distributed" className="text-muted hover:text-foreground transition-colors">
                    Distributed Consensus
                  </Link>
                </li>
                <li>
                  <Link to="/courses?search=Certificate" className="text-muted hover:text-foreground transition-colors">
                    Verified Certificates
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-sans font-medium text-[14px] text-foreground mb-4">
                Workspace
              </h4>
              <ul className="space-y-3 text-[14px]">
                <li>
                  <Link to="/learn" className="text-muted hover:text-foreground transition-colors">
                    Terminal Sandbox
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard" className="text-muted hover:text-foreground transition-colors">
                    Progress Matrix
                  </Link>
                </li>
                <li>
                  <Link to="/instructor/courses" className="text-muted hover:text-foreground transition-colors">
                    Instructor Studio
                  </Link>
                </li>
                <li>
                  <Link to="/profile" className="text-muted hover:text-foreground transition-colors">
                    Account Profile
                  </Link>
                </li>
                <li>
                  <a href="/#faq" className="text-muted hover:text-foreground transition-colors">
                    Documentation
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-sans font-medium text-[14px] text-foreground mb-4">
                Architecture
              </h4>
              <ul className="space-y-3 text-[14px]">
                <li>
                  <a href="/#capabilities" className="text-muted hover:text-foreground transition-colors">
                    Worktree Isolation
                  </a>
                </li>
                <li>
                  <a href="/#capabilities" className="text-muted hover:text-foreground transition-colors">
                    Automated Quizzes
                  </a>
                </li>
                <li>
                  <a href="/#reassurance" className="text-muted hover:text-foreground transition-colors">
                    Verifiable Credentials
                  </a>
                </li>
                <li>
                  <a href="/#voices" className="text-muted hover:text-foreground transition-colors">
                    Voices &amp; Reviews
                  </a>
                </li>
                <li>
                  <Link to="/about" className="text-muted hover:text-foreground transition-colors">
                    Faculty Standards
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-sans font-medium text-[14px] text-foreground mb-4">
                Organization
              </h4>
              <ul className="space-y-3 text-[14px]">
                <li>
                  <Link to="/about" className="text-muted hover:text-foreground transition-colors">
                    About Edunet
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="text-muted hover:text-foreground transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-muted hover:text-foreground transition-colors">
                    Terms &amp; Security
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-muted hover:text-foreground transition-colors">
                    System Status &amp; Help
                  </Link>
                </li>
              </ul>
            </div>

          </div>

        </div>

        {/* Lower Row: Inter 400 · 14px/20px */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-[14px] text-muted">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-ember font-medium">SYS-2026</span>
            <span>© 2026 Edunet Technologies Inc. All rights reserved.</span>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
            <Link to="/about" className="hover:text-foreground transition-colors">Accreditation</Link>
            <Link to="/contact" className="hover:text-foreground transition-colors">Support</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
