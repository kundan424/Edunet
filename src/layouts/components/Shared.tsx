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
  ShieldAlert
} from 'lucide-react';
import { useUnreadNotifications } from '../../features/notifications/queries';

/**
 * Anthropic 4-spoke radial-spike mark defined in DESIGN.md
 */
export function ClaudeSpikeMark({ className = "w-4 h-4 text-[#121212]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 0C11.2 6.5 6.5 11.2 0 12C6.5 12.8 11.2 17.5 12 24C12.8 17.5 17.5 12.8 24 12C17.5 11.2 12.8 6.5 12 0Z" />
    </svg>
  );
}

/**
 * Top Navigation implementing Lumina Warm Editorial design:
 * - Canvas background: Bone Parchment (#f8f8f6)
 * - Hairline bottom border: Chalk (#e7e6e1)
 * - Brand: Monogram L + Lumina Learning Platform
 * - Catalog dropdown with academic faculties
 * - Navigation links: Degrees, Certificates, Enterprise
 * - Auth controls: Log in, Join for Free, User account menu
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

  return (
    <header className="sticky top-0 z-50 bg-[#f8f8f6]/95 backdrop-blur-md border-b border-[#e7e6e1]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Brand & Catalog Dropdown */}
        <div className="flex items-center gap-4 lg:gap-6 shrink-0">
          <Link 
            to="/" 
            className="flex items-center gap-2.5 group"
            aria-label="Lumina Home"
          >
            <div className="w-8 h-8 rounded-full bg-[#121212] text-[#f8f8f6] flex items-center justify-center font-heading text-lg font-semibold group-hover:bg-[#000000] transition-colors">
              L
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-[22px] text-[#121212] tracking-tight leading-none">
                Lumina
              </span>
              <span className="text-[9px] font-mono tracking-widest text-[#7b7974] uppercase mt-0.5">
                Learning Platform
              </span>
            </div>
          </Link>

          {/* Explore Catalog Dropdown */}
      
        </div>

        {/* Top Links & Auth CTAs */}
        <div className="flex items-center gap-3 sm:gap-5 shrink-0">
          <nav className="hidden lg:flex items-center gap-4 text-[13.5px]">
            <Link 
              to="/courses?search=Degree" 
              className="text-[#373734] hover:text-[#121212] font-medium transition-colors"
            >
              Degrees
            </Link>
            <Link 
              to="/courses?search=Certificate" 
              className="text-[#373734] hover:text-[#121212] font-medium transition-colors"
            >
              Certificates
            </Link>
            <a 
              href="/#enterprise-section" 
              className="text-[#373734] hover:text-[#121212] font-medium transition-colors"
            >
              For Enterprise
            </a>
            <Link 
              to="/courses" 
              className={`font-medium transition-colors ${isCurrent('/courses') ? 'text-[#121212]' : 'text-[#373734] hover:text-[#121212]'}`}
            >
              All Courses
            </Link>
          </nav>

          <div className="h-4 w-px bg-[#e7e6e1] hidden lg:block"></div>

          {!isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link 
                to="/login"
                className="text-[#373734] hover:text-[#121212] font-medium text-[13.5px] px-2 py-1 transition-colors"
              >
                Log In
              </Link>
              <Link 
                to="/register"
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-[#121212] text-[#f8f8f6] font-medium text-[13.5px] hover:bg-[#000000] transition-colors shadow-sm"
              >
                Join for Free
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Notifications */}
              <Link
                to="/notifications"
                className="relative p-2 text-[#373734] hover:text-[#121212] hover:bg-[#efeeeb] rounded-lg transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-4.5 h-4.5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#d97757]"></span>
                )}
              </Link>

              {/* User Dropdown */}
              <div className="relative" ref={accountMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-[#efeeeb] transition-colors cursor-pointer"
                  aria-expanded={isAccountMenuOpen}
                >
                  <div className="w-8 h-8 rounded-full bg-[#efeeeb] border border-[#e7e6e1] text-[#121212] text-xs font-semibold flex items-center justify-center">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="hidden sm:inline text-sm font-medium text-[#121212] max-w-[120px] truncate">
                    {user?.name}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-[#7b7974] transition-transform ${isAccountMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isAccountMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-[#ffffff] border border-[#e7e6e1] rounded-xl shadow-xl py-2 z-50 animate-in fade-in duration-150">
                    <div className="px-3.5 py-2 border-b border-[#e7e6e1]">
                      <p className="text-xs text-[#7b7974]">Signed in as</p>
                      <p className="text-sm font-medium text-[#121212] truncate mt-0.5">{user?.name}</p>
                      <span className="inline-block mt-1 text-[11px] font-mono uppercase px-2 py-0.5 rounded bg-[#efeeeb] text-[#373734]">
                        {user?.role}
                      </span>
                    </div>

                    <div className="py-1">
                      {user?.role === 'STUDENT' && (
                        <Link
                          to="/learn"
                          className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-[#373734] hover:text-[#121212] hover:bg-[#efeeeb] transition-colors"
                        >
                          <BookOpen className="w-4 h-4 text-[#7b7974]" />
                          <span>My Learning</span>
                        </Link>
                      )}

                      {user?.role === 'INSTRUCTOR' && (
                        <>
                          <Link
                            to="/instructor"
                            className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-[#373734] hover:text-[#121212] hover:bg-[#efeeeb] transition-colors"
                          >
                            <LayoutDashboard className="w-4 h-4 text-[#7b7974]" />
                            <span>Instructor Dashboard</span>
                          </Link>
                          <Link
                            to="/instructor/courses"
                            className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-[#373734] hover:text-[#121212] hover:bg-[#efeeeb] transition-colors"
                          >
                            <BookOpen className="w-4 h-4 text-[#7b7974]" />
                            <span>My Courses</span>
                          </Link>
                        </>
                      )}

                      {user?.role === 'ADMIN' && (
                        <>
                          <Link
                            to="/admin"
                            className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-[#373734] hover:text-[#121212] hover:bg-[#efeeeb] transition-colors"
                          >
                            <ShieldAlert className="w-4 h-4 text-[#7b7974]" />
                            <span>Admin Hub</span>
                          </Link>
                          <Link
                            to="/admin/courses"
                            className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-[#373734] hover:text-[#121212] hover:bg-[#efeeeb] transition-colors"
                          >
                            <BookOpen className="w-4 h-4 text-[#7b7974]" />
                            <span>Moderation</span>
                          </Link>
                        </>
                      )}

                      <Link
                        to="/profile"
                        className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-[#373734] hover:text-[#121212] hover:bg-[#efeeeb] transition-colors"
                      >
                        <UserIcon className="w-4 h-4 text-[#7b7974]" />
                        <span>Profile Settings</span>
                      </Link>
                    </div>

                    <div className="pt-1 border-t border-[#e7e6e1]">
                      <button
                        type="button"
                        onClick={() => {
                          logout();
                          setIsAccountMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-[#c24141] hover:bg-[#efeeeb] transition-colors cursor-pointer text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-[#121212] hover:bg-[#efeeeb] rounded-lg transition-colors cursor-pointer"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Panel */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#ffffff] border-b border-[#e7e6e1] p-5 shadow-lg flex flex-col gap-4 animate-in fade-in duration-150">
          <nav className="flex flex-col gap-1 text-sm font-medium">
            <Link
              to="/courses"
              className="px-3 py-2 rounded-lg text-[#373734] hover:text-[#121212] hover:bg-[#efeeeb] transition-colors"
            >
              All Courses
            </Link>
            <Link
              to="/courses?search=Degree"
              className="px-3 py-2 rounded-lg text-[#373734] hover:text-[#121212] hover:bg-[#efeeeb] transition-colors"
            >
              Degrees &amp; MicroMasters
            </Link>
            <Link
              to="/courses?search=Certificate"
              className="px-3 py-2 rounded-lg text-[#373734] hover:text-[#121212] hover:bg-[#efeeeb] transition-colors"
            >
              Professional Certificates
            </Link>
            <a
              href="/#enterprise-section"
              className="px-3 py-2 rounded-lg text-[#373734] hover:text-[#121212] hover:bg-[#efeeeb] transition-colors"
            >
              Lumina for Enterprise
            </a>

            {isAuthenticated && user?.role === 'STUDENT' && (
              <Link to="/learn" className="px-3 py-2 rounded-lg text-[#373734] hover:text-[#121212] hover:bg-[#efeeeb]">
                My Learning
              </Link>
            )}

            {isAuthenticated && user?.role === 'INSTRUCTOR' && (
              <>
                <Link to="/instructor" className="px-3 py-2 rounded-lg text-[#373734] hover:text-[#121212] hover:bg-[#efeeeb]">
                  Instructor Dashboard
                </Link>
                <Link to="/instructor/courses" className="px-3 py-2 rounded-lg text-[#373734] hover:text-[#121212] hover:bg-[#efeeeb]">
                  My Courses
                </Link>
              </>
            )}

            {isAuthenticated && user?.role === 'ADMIN' && (
              <>
                <Link to="/admin" className="px-3 py-2 rounded-lg text-[#373734] hover:text-[#121212] hover:bg-[#efeeeb]">
                  Admin Hub
                </Link>
                <Link to="/admin/courses" className="px-3 py-2 rounded-lg text-[#373734] hover:text-[#121212] hover:bg-[#efeeeb]">
                  Moderation
                </Link>
              </>
            )}
          </nav>

          <div className="pt-3 border-t border-[#e7e6e1] flex flex-col gap-2.5">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className="w-full h-10 border border-[#e7e6e1] bg-[#f8f8f6] hover:bg-[#efeeeb] text-[#121212] text-sm font-medium rounded-lg flex items-center justify-center transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="w-full h-10 bg-[#121212] hover:bg-[#000000] text-[#f8f8f6] text-sm font-medium rounded-lg flex items-center justify-center transition-colors shadow-sm"
                >
                  Join for Free
                </Link>
              </>
            ) : (
              <button
                type="button"
                onClick={() => {
                  logout();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full h-10 bg-[#efeeeb] text-[#c24141] hover:bg-[#e7e6e1] text-sm font-medium rounded-lg flex items-center justify-center transition-colors cursor-pointer"
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
 * 10. Comprehensive Academic Footer (5-column directory style from Stitch DESIGN.md)
 * - Canvas: Obsidian (#000000)
 * - Text: Bone Parchment (#f8f8f6) and Ashen (#7b7974)
 */
export function Footer() {
  return (
    <footer className="w-full bg-[#000000] text-[#f8f8f6] pt-16 pb-12 border-t border-[#121212]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 5-Column Directory Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 pb-12 border-b border-[#373734]/40">
          
          {/* Col 1: Online Degrees */}
          <div>
            <h4 className="font-mono text-[11px] uppercase tracking-wider text-[#9c9a92] mb-4">
              Online Degrees
            </h4>
            <ul className="space-y-2.5 text-[13px] text-[#7b7974]">
              <li>
                <Link to="/courses?search=Degree" className="hover:text-[#f8f8f6] transition-colors">
                  Master of Computer Science
                </Link>
              </li>
              <li>
                <Link to="/courses?search=AI" className="hover:text-[#f8f8f6] transition-colors">
                  Master of Science in AI Systems
                </Link>
              </li>
              <li>
                <Link to="/courses?search=Distributed" className="hover:text-[#f8f8f6] transition-colors">
                  MicroMasters in Distributed Runtimes
                </Link>
              </li>
              <li>
                <Link to="/courses?search=Cryptography" className="hover:text-[#f8f8f6] transition-colors">
                  Postgraduate Diploma in Cryptography
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#f8f8f6] transition-colors">
                  Credit Transfer Evaluation
                </Link>
              </li>
              <li>
                <a href="/#enterprise-section" className="hover:text-[#f8f8f6] transition-colors">
                  Scholarship &amp; Financial Aid
                </a>
              </li>
            </ul>
          </div>

          {/* Col 2: Popular Specializations */}
          <div>
            <h4 className="font-mono text-[11px] uppercase tracking-wider text-[#9c9a92] mb-4">
              Popular Specializations
            </h4>
            <ul className="space-y-2.5 text-[13px] text-[#7b7974]">
              <li>
                <Link to="/courses?search=Transformer" className="hover:text-[#f8f8f6] transition-colors">
                  Transformer Architectures &amp; RLHF
                </Link>
              </li>
              <li>
                <Link to="/courses?search=Rust" className="hover:text-[#f8f8f6] transition-colors">
                  Rust Systems &amp; eBPF Observability
                </Link>
              </li>
              <li>
                <Link to="/courses?search=Formal" className="hover:text-[#f8f8f6] transition-colors">
                  TLA+ &amp; Formal Software Invariants
                </Link>
              </li>
              <li>
                <Link to="/courses?search=Database" className="hover:text-[#f8f8f6] transition-colors">
                  Distributed Database Engines
                </Link>
              </li>
              <li>
                <Link to="/courses?search=Quantum" className="hover:text-[#f8f8f6] transition-colors">
                  Quantum Algorithm Verification
                </Link>
              </li>
              <li>
                <Link to="/courses" className="hover:text-[#f8f8f6] transition-colors">
                  Free Introductory Masterclasses
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Institutional Partners */}
          <div>
            <h4 className="font-mono text-[11px] uppercase tracking-wider text-[#9c9a92] mb-4">
              Partner Universities
            </h4>
            <ul className="space-y-2.5 text-[13px] text-[#7b7974]">
              <li><Link to="/courses?search=MIT" className="hover:text-[#f8f8f6] transition-colors">MIT CSAIL</Link></li>
              <li><Link to="/courses?search=Stanford" className="hover:text-[#f8f8f6] transition-colors">Stanford University</Link></li>
              <li><Link to="/courses?search=Cambridge" className="hover:text-[#f8f8f6] transition-colors">University of Cambridge</Link></li>
              <li><Link to="/courses?search=Carnegie" className="hover:text-[#f8f8f6] transition-colors">Carnegie Mellon University</Link></li>
              <li><Link to="/courses?search=ETH" className="hover:text-[#f8f8f6] transition-colors">ETH Zürich</Link></li>
              <li><Link to="/courses?search=Oxford" className="hover:text-[#f8f8f6] transition-colors">University of Oxford</Link></li>
            </ul>
          </div>

          {/* Col 4: Platform & Solutions */}
          <div>
            <h4 className="font-mono text-[11px] uppercase tracking-wider text-[#9c9a92] mb-4">
              Enterprise &amp; Campus
            </h4>
            <ul className="space-y-2.5 text-[13px] text-[#7b7974]">
              <li><a href="/#enterprise-section" className="hover:text-[#f8f8f6] transition-colors">Lumina for Enterprise</a></li>
              <li><a href="/#enterprise-section" className="hover:text-[#f8f8f6] transition-colors">Lumina for Higher Education</a></li>
              <li><Link to="/about" className="hover:text-[#f8f8f6] transition-colors">Automated Grading API</Link></li>
              <li><Link to="/about" className="hover:text-[#f8f8f6] transition-colors">LMS Integration (Canvas/LTI)</Link></li>
              <li><Link to="/about" className="hover:text-[#f8f8f6] transition-colors">Research Monograph Archive</Link></li>
              <li><Link to="/about" className="hover:text-[#f8f8f6] transition-colors">System Benchmarks</Link></li>
            </ul>
          </div>

          {/* Col 5: Platform & Governance */}
          <div>
            <h4 className="font-mono text-[11px] uppercase tracking-wider text-[#9c9a92] mb-4">
              Platform Governance
            </h4>
            <ul className="space-y-2.5 text-[13px] text-[#7b7974]">
              <li><Link to="/about" className="hover:text-[#f8f8f6] transition-colors">About Lumina Platform</Link></li>
              <li><Link to="/about" className="hover:text-[#f8f8f6] transition-colors">Academic Advisory Council</Link></li>
              <li><Link to="/about" className="hover:text-[#f8f8f6] transition-colors">Accreditation &amp; ECTS Standards</Link></li>
              <li><Link to="/terms" className="hover:text-[#f8f8f6] transition-colors">Honor Code &amp; Academic Integrity</Link></li>
              <li><Link to="/contact" className="hover:text-[#f8f8f6] transition-colors">Careers at Lumina</Link></li>
              <li><Link to="/contact" className="hover:text-[#f8f8f6] transition-colors">Press &amp; University Inquiries</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Attribution & Legal */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[#7b7974] text-[12px]">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-[#f8f8f6] text-[#121212] flex items-center justify-center font-heading text-xs font-semibold">
              L
            </div>
            <span>© 2026 Lumina Learning Platform Inc. All rights reserved.</span>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <Link to="/privacy" className="hover:text-[#f8f8f6] transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-[#f8f8f6] transition-colors">Terms of Use</Link>
            <Link to="/about" className="hover:text-[#f8f8f6] transition-colors">Accreditation Disclosures</Link>
            <Link to="/about" className="hover:text-[#f8f8f6] transition-colors">Accessibility</Link>
            <Link to="/about" className="hover:text-[#f8f8f6] transition-colors">System Status</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
