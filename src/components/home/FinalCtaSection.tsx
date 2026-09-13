import { Link } from 'react-router-dom';
import { PillButton } from '../ui/Button';
import { useAuth } from '../../auth/AuthProvider';

export function FinalCtaSection() {
  const { user, isAuthenticated } = useAuth();

  const renderActions = () => {
    if (!isAuthenticated || !user) {
      return (
        <>
          <Link to="/courses">
            <PillButton className="px-8 py-3 text-lg">Explore Courses</PillButton>
          </Link>
          <Link to="/register">
            <PillButton className="px-8 py-3 text-lg ">
              Create Account
            </PillButton>
          </Link>
        </>
      );
    }

    switch (user.role) {
      case 'STUDENT':
        return (
          <>
            <Link to="/learn">
              <PillButton className="px-8 py-3 text-lg">Continue Learning</PillButton>
            </Link>
            <Link to="/courses">
              <PillButton className="px-8 py-3 text-lg bg-transparent border-white border-2 text-white hover:bg-white hover:text-signal-blue">
                Explore More
              </PillButton>
            </Link>
          </>
        );
      case 'INSTRUCTOR':
        return (
          <>
            <Link to="/instructor">
              <PillButton className="px-8 py-3 text-lg">Instructor Dashboard</PillButton>
            </Link>
            <Link to="/instructor/courses">
              <PillButton className="px-8 py-3 text-lg bg-transparent border-white border-2 text-white hover:bg-white hover:text-signal-blue">
                Create Course
              </PillButton>
            </Link>
          </>
        );
      case 'ADMIN':
        return (
          <Link to="/admin">
            <PillButton className="px-8 py-3 text-lg">Admin Dashboard</PillButton>
          </Link>
        );
      default:
        return (
          <Link to="/courses">
            <PillButton className="px-8 py-3 text-lg">Explore Courses</PillButton>
          </Link>
        );
    }
  };

  return (
    <section className="py-24 px-4 sm:px-6 md:px-8 w-full mt-12 bg-cream-paper  relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
      
      <div className="max-w-[800px] mx-auto text-center relative z-10 flex flex-col items-center gap-8">
        <h2 className="font-degular-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
          Ready to focus on what matters?
        </h2>
        <p className="font-usual text-lg md:text-xl opacity-90 max-w-2xl">
          Join our community of modern learners and experience education designed for clarity, depth, and results.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-4 w-full sm:w-auto">
          {renderActions()}
        </div>
      </div>
    </section>
  );
}
