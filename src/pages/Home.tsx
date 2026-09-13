import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { DisplayHeading, BodyText } from '../components/ui/Typography';
import { PillButton, GhostLink } from '../components/ui/Button';
import { Search } from 'lucide-react';

export function Home() {
  const { user, isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const renderCTAs = () => {
    if (!isAuthenticated || !user) {
      return (
        <>
          <Link to="/courses" className="w-full sm:w-auto">
            <PillButton className="w-full justify-center">Explore Courses</PillButton>
          </Link>
          <div className="flex justify-center sm:block">
            <GhostLink href="/register">Become an Instructor</GhostLink>
          </div>
        </>
      );
    }

    switch (user.role) {
      case 'STUDENT':
        return (
          <>
            <Link to="/learn" className="w-full sm:w-auto">
              <PillButton className="w-full justify-center">Continue Learning</PillButton>
            </Link>
            <div className="flex justify-center sm:block">
              <GhostLink href="/courses">Explore More</GhostLink>
            </div>
          </>
        );
      case 'INSTRUCTOR':
        return (
          <>
            <Link to="/instructor" className="w-full sm:w-auto">
              <PillButton className="w-full justify-center">Instructor Dashboard</PillButton>
            </Link>
            <div className="flex justify-center sm:block">
              <GhostLink href="/instructor/courses">Manage Courses</GhostLink>
            </div>
          </>
        );
      case 'ADMIN':
        return (
          <Link to="/admin" className="w-full sm:w-auto">
            <PillButton className="w-full justify-center">Admin Dashboard</PillButton>
          </Link>
        );
      default:
        return (
          <Link to="/courses" className="w-full sm:w-auto">
            <PillButton className="w-full justify-center">Explore Courses</PillButton>
          </Link>
        );
    }
  };

  return (
    <div className="flex flex-col gap-20 md:gap-24">
      {/* Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
        <div className="flex flex-col gap-6 md:gap-8 order-2 lg:order-1">
          <DisplayHeading>
            <span className="block">Learn without</span>
            <span className="block text-signal-blue">compromise.</span>
          </DisplayHeading>
          
          <BodyText maxWidth>
            Master the skills of tomorrow in a focused, editorial learning environment designed to remove friction and emphasize deep understanding.
          </BodyText>

          {/* Hero Search */}
          <form onSubmit={handleSearchSubmit} className="relative w-full max-w-lg mt-2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-midnight-ink/50" />
            <input 
              type="text" 
              placeholder="What do you want to learn?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border-2 border-midnight-ink bg-cream-paper py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-signal-blue font-usual text-base font-bold placeholder:font-normal"
              aria-label="Search courses"
            />
          </form>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-6 sm:gap-8 mt-2 md:mt-4">
            {renderCTAs()}
          </div>
        </div>

        {/* Bauhaus Geometric Visual */}
        <div className="aspect-square bg-cream-paper relative overflow-hidden border-2 border-midnight-ink hidden md:block order-1 lg:order-2 w-full max-w-[360px] mx-auto">
          <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-signal-blue"></div>
          <div className="absolute top-1/4 right-1/4 w-1/2 h-1/2 rounded-full bg-ember-red z-10"></div>
          <div className="absolute bottom-0 right-0 w-1/2 h-1/2 border-l-2 border-t-2 border-midnight-ink grid grid-cols-4 grid-rows-4">
            {/* Checkerboard pattern */}
            {[...Array(16)].map((_, i) => (
              <div key={i} className={`w-full h-full ${(i + Math.floor(i / 4)) % 2 === 0 ? 'bg-midnight-ink' : 'bg-cream-paper'}`}></div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
        <div className="aspect-square bg-saffron-yellow relative border-2 border-midnight-ink hidden md:flex items-center justify-center w-full max-w-[360px] mx-auto">
           <div className="w-2/3 h-2/3 bg-cream-paper rounded-full border-2 border-midnight-ink"></div>
           <div className="absolute w-1/3 h-1/3 bg-signal-blue border-2 border-midnight-ink bottom-8 left-8"></div>
        </div>
        <div className="flex flex-col gap-6">
          <h2 className="font-degular-display text-[32px] sm:text-[40px] md:text-heading-sm font-bold text-midnight-ink leading-tight tracking-heading-sm break-words">
            Structured for clarity.
          </h2>
          <BodyText>
            Our curriculum replaces cluttered dashboards with clean, poster-like layouts. Every lesson, quiz, and assignment is crafted to let the content breathe.
          </BodyText>
        </div>
      </section>
    </div>
  );
}
