import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthProvider';
import { ArrowRight } from 'lucide-react';

export function FinalCtaSection() {
  const { user, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setTimeout(() => {
        navigate(`/register?email=${encodeURIComponent(email.trim())}`);
      }, 600);
    }
  };

  return (
    <section className="py-16 lg:py-24 w-full">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full bg-[#ffffff] rounded-[24px] p-8 sm:p-14 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-[#e7e6e1] text-center max-w-[840px] mx-auto">
          
          {/* Clay Accent Dot */}
          <span className="w-2.5 h-2.5 rounded-full bg-[#d97757] inline-block mb-3.5"></span>
          
          {/* Headline */}
          <h2 className="font-heading text-2xl sm:text-3xl leading-tight text-[#121212] mb-2 font-semibold">
            Start learning with top faculties today.
          </h2>
          
          {/* Subtitle */}
          <p className="font-body text-[#373734] text-xs sm:text-sm max-w-[520px] mx-auto mb-6 leading-relaxed">
            Join over 140,000 engineers and researchers advancing their craft. Create an account to access free lectures, syllabus previews, and admission schedules.
          </p>

          {!isAuthenticated ? (
            <div>
              <form 
                onSubmit={handleEmailSubmit}
                className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-[480px] mx-auto w-full"
              >
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your academic or work email" 
                  required 
                  className="w-full px-4 py-3 rounded-lg bg-[#efeeeb] text-[#121212] text-[14px] placeholder:text-[#7b7974] outline-none border border-transparent focus:border-[#b7b7b5] focus:bg-[#ffffff] transition-all"
                />
                <button 
                  type="submit" 
                  className="w-full sm:w-auto shrink-0 px-6 py-3 rounded-lg bg-[#121212] text-[#f8f8f6] text-[14px] font-medium hover:bg-[#000000] transition-colors shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>{submitted ? 'Redirecting...' : 'Join for Free'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {submitted && (
                <p className="text-[#d97757] text-[12px] mt-3 font-medium animate-in fade-in">
                  Welcome to Lumina. Redirecting to complete your profile...
                </p>
              )}

              <p className="text-[11.5px] text-[#7b7974] mt-4">
                Free forever to audit. No credit card required. Transferable credits certified upon enrollment.
              </p>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
              {user?.role === 'STUDENT' && (
                <>
                  <Link 
                    to="/learn"
                    className="px-6 py-3 rounded-lg bg-[#121212] text-[#f8f8f6] text-[14px] font-medium hover:bg-[#000000] transition-colors shadow-sm flex items-center gap-2"
                  >
                    <span>Continue Learning</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link 
                    to="/courses"
                    className="px-6 py-3 rounded-lg bg-[#efeeeb] hover:bg-[#e7e6e1] text-[#121212] text-[14px] font-medium transition-colors border border-[#e7e6e1]"
                  >
                    Explore More Pathways
                  </Link>
                </>
              )}

              {user?.role === 'INSTRUCTOR' && (
                <>
                  <Link 
                    to="/instructor"
                    className="px-6 py-3 rounded-lg bg-[#121212] text-[#f8f8f6] text-[14px] font-medium hover:bg-[#000000] transition-colors shadow-sm flex items-center gap-2"
                  >
                    <span>Instructor Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link 
                    to="/instructor/courses"
                    className="px-6 py-3 rounded-lg bg-[#efeeeb] hover:bg-[#e7e6e1] text-[#121212] text-[14px] font-medium transition-colors border border-[#e7e6e1]"
                  >
                    Create New Course
                  </Link>
                </>
              )}

              {user?.role === 'ADMIN' && (
                <Link 
                  to="/admin"
                  className="px-6 py-3 rounded-lg bg-[#121212] text-[#f8f8f6] text-[14px] font-medium hover:bg-[#000000] transition-colors shadow-sm flex items-center gap-2"
                >
                  <span>Admin Hub &amp; Moderation</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
