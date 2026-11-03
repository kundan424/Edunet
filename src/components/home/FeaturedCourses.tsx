import { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { CourseCard } from '../course/CourseCard';
import { LoadingState, ErrorState } from '../ui/States';
import { ArrowRight, Search, ChevronDown, Terminal, Cpu, Network, ShieldCheck, Sigma } from 'lucide-react';
import type { Page, CourseSummaryResponse } from '../../features/courses/types';

export function FeaturedCourses() {
  const [activeTab, setActiveTab] = useState<'specializations' | 'certificates' | 'degrees' | 'mastertracks'>('specializations');
  const [catalogSearch, setCatalogSearch] = useState('');
  const [isFacultyMenuOpen, setIsFacultyMenuOpen] = useState(false);
  const facultyMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (facultyMenuRef.current && !facultyMenuRef.current.contains(event.target as Node)) {
        setIsFacultyMenuOpen(false);
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsFacultyMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  // Query live courses from backend API
  const { data, isLoading, error } = useQuery<Page<CourseSummaryResponse>>({
    queryKey: ['featured-courses'],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: '0',
        size: '6',
        sort: 'newest'
      });
      return api.get(`/api/v1/courses?${params.toString()}`);
    }
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (catalogSearch.trim()) {
      navigate(`/courses?search=${encodeURIComponent(catalogSearch.trim())}`);
    } else {
      navigate('/courses');
    }
  };

  const realCourses = data?.content || [];
  const hasBackendCourses = !isLoading && !error && realCourses.length > 0;

  // Filter real backend courses by tab if category matches, or show all
  const filteredCourses = realCourses.filter(course => {
    if (activeTab === 'specializations') return true;
    if (activeTab === 'certificates') return course.difficulty === 'BEGINNER' || course.difficulty === 'INTERMEDIATE';
    if (activeTab === 'degrees') return course.difficulty === 'ADVANCED';
    if (activeTab === 'mastertracks') return course.difficulty === 'ADVANCED' || course.difficulty === 'INTERMEDIATE';
    return true;
  });

  return (
    <section className="py-16 lg:py-24 border-b border-[#e7e6e1] w-full" id="courses">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#7b7974] mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d97757]"></span>
              <span>Catalog Pathways</span>
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl text-[#121212] font-semibold">
              Accredited Programs &amp; Specializations
            </h2>
          </div>
          <p className="font-body text-[#373734] text-[14px] mt-2 sm:mt-0 max-w-[360px]">
            From foundational 4-week short courses to full accredited Master of Science degree paths.
          </p>
        </div>

        {/* Coursera/Lumina Catalog Search & Faculties Filter */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6 pt-2">
          {/* Quick Search */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-[560px]">
            <Search className="w-4 h-4 text-[#7b7974] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              value={catalogSearch}
              onChange={(e) => setCatalogSearch(e.target.value)}
              placeholder="Search 450+ university programs, specializations, degrees..."
              className="w-full bg-[#efeeeb]/80 hover:bg-[#efeeeb] focus:bg-[#ffffff] text-[#121212] text-[13.5px] pl-10 pr-16 py-2.5 rounded-xl border border-[#e7e6e1] focus:border-[#b7b7b5] transition-all outline-none shadow-xs"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-[#9c9a92] bg-[#e7e6e1]/60 px-1.5 py-0.5 rounded">
              ⌘K
            </span>
          </form>

          {/* Academic Faculties Dropdown */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="relative" ref={facultyMenuRef}>
              <button 
                type="button"
                onClick={() => setIsFacultyMenuOpen(!isFacultyMenuOpen)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#efeeeb] hover:bg-[#e7e6e1] text-[#121212] text-[13px] font-medium transition-all border border-[#e7e6e1] cursor-pointer"
                aria-expanded={isFacultyMenuOpen}
                aria-label="Explore Catalog by academic faculty"
              >
                <Terminal className="w-4 h-4 text-[#d97757]" />
                <span>Explore Catalog</span>
                <ChevronDown className={`w-3.5 h-3.5 text-[#7b7974] transition-transform ${isFacultyMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isFacultyMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] bg-[#ffffff] rounded-xl shadow-2xl border border-[#e7e6e1] p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-[#7b7974] px-2 py-1">
                    Academic Faculties
                  </div>
                  <Link 
                    to="/courses?search=Systems" 
                    onClick={() => setIsFacultyMenuOpen(false)}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-[#efeeeb] transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Terminal className="w-4 h-4 text-[#d97757]" />
                      <span className="text-[13px] font-medium text-[#121212]">Computer Science &amp; Systems</span>
                    </div>
                    <span className="text-[11px] text-[#7b7974]">84 programs</span>
                  </Link>
                  <Link 
                    to="/courses?search=AI" 
                    onClick={() => setIsFacultyMenuOpen(false)}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-[#efeeeb] transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Cpu className="w-4 h-4 text-[#d97757]" />
                      <span className="text-[13px] font-medium text-[#121212]">Data Science &amp; Foundational AI</span>
                    </div>
                    <span className="text-[11px] text-[#7b7974]">62 programs</span>
                  </Link>
                  <Link 
                    to="/courses?search=Distributed" 
                    onClick={() => setIsFacultyMenuOpen(false)}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-[#efeeeb] transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Network className="w-4 h-4 text-[#d97757]" />
                      <span className="text-[13px] font-medium text-[#121212]">Distributed Systems &amp; Runtimes</span>
                    </div>
                    <span className="text-[11px] text-[#7b7974]">45 programs</span>
                  </Link>
                  <Link 
                    to="/courses?search=Security" 
                    onClick={() => setIsFacultyMenuOpen(false)}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-[#efeeeb] transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-[#d97757]" />
                      <span className="text-[13px] font-medium text-[#121212]">Formal Verification &amp; Security</span>
                    </div>
                    <span className="text-[11px] text-[#7b7974]">31 programs</span>
                  </Link>
                  <Link 
                    to="/courses?search=Mathematics" 
                    onClick={() => setIsFacultyMenuOpen(false)}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-[#efeeeb] transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Sigma className="w-4 h-4 text-[#d97757]" />
                      <span className="text-[13px] font-medium text-[#121212]">Applied Mathematics &amp; Crypto</span>
                    </div>
                    <span className="text-[11px] text-[#7b7974]">38 programs</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Pathway Tabs Switcher */}
        <div className="flex flex-wrap items-center gap-2 pb-6 border-b border-[#e7e6e1] mb-8 overflow-x-auto">
          <button 
            type="button"
            onClick={() => setActiveTab('specializations')}
            className={`px-4 py-2 rounded-full text-[13px] font-medium transition-colors cursor-pointer ${
              activeTab === 'specializations' 
                ? 'bg-[#121212] text-[#f8f8f6] shadow-xs' 
                : 'bg-[#efeeeb] text-[#373734] hover:text-[#121212] hover:bg-[#e7e6e1]'
            }`}
          >
            Popular Specializations
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab('certificates')}
            className={`px-4 py-2 rounded-full text-[13px] font-medium transition-colors cursor-pointer ${
              activeTab === 'certificates' 
                ? 'bg-[#121212] text-[#f8f8f6] shadow-xs' 
                : 'bg-[#efeeeb] text-[#373734] hover:text-[#121212] hover:bg-[#e7e6e1]'
            }`}
          >
            Professional Certificates
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab('degrees')}
            className={`px-4 py-2 rounded-full text-[13px] font-medium transition-colors cursor-pointer ${
              activeTab === 'degrees' 
                ? 'bg-[#121212] text-[#f8f8f6] shadow-xs' 
                : 'bg-[#efeeeb] text-[#373734] hover:text-[#121212] hover:bg-[#e7e6e1]'
            }`}
          >
            University Degrees &amp; MicroMasters
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab('mastertracks')}
            className={`px-4 py-2 rounded-full text-[13px] font-medium transition-colors cursor-pointer ${
              activeTab === 'mastertracks' 
                ? 'bg-[#121212] text-[#f8f8f6] shadow-xs' 
                : 'bg-[#efeeeb] text-[#373734] hover:text-[#121212] hover:bg-[#e7e6e1]'
            }`}
          >
            MasterTracks &amp; Labs
          </button>
        </div>

        {/* Live Course Cards Grid */}
        {isLoading && <LoadingState message="Loading catalog programs..." />}
        {error && <ErrorState message="Could not fetch live catalog programs. Please check back later." />}

        {/* Show live backend courses */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hasBackendCourses ? (
            filteredCourses.map(course => (
              <CourseCard
                key={course.id}
                id={course.id}
                title={course.title}
                description={course.description}
                difficulty={course.difficulty}
                price={course.price}
                instructorName={course.instructorName}
                rating={course.rating}
                studentCount={course.studentCount}
              />
            ))
          ) : !isLoading && !error ? (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 p-12 text-center flex flex-col items-center justify-center gap-4 bg-[#ffffff] border border-[#e7e6e1] rounded-2xl shadow-xs">
              <div className="w-12 h-12 rounded-full bg-[#efeeeb] flex items-center justify-center text-[#7b7974]">
                <Terminal className="w-6 h-6" />
              </div>
              <div className="flex flex-col gap-1 max-w-md">
                <h3 className="font-heading text-lg font-semibold text-[#121212]">Catalog Courses Coming Soon</h3>
                <p className="font-body text-xs text-[#7b7974] leading-relaxed">
                  Instructors are currently publishing courses in the system. Check back shortly or view our complete catalog page.
                </p>
              </div>
              <Link
                to="/courses"
                className="mt-2 px-5 py-2.5 rounded-xl bg-[#121212] text-[#f8f8f6] text-xs font-medium hover:bg-black/80 transition-colors"
              >
                Explore Catalog
              </Link>
            </div>
          ) : null}
        </div>

        {/* Footer Link to Full Catalog */}
        <div className="mt-10 text-center">
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#efeeeb] hover:bg-[#e7e6e1] text-[#121212] font-medium text-[14px] transition-colors border border-[#e7e6e1]"
          >
            <span>Explore all 450+ courses and degrees in the catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
