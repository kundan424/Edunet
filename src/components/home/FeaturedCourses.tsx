import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { CourseCard } from '../course/CourseCard';
import { LoadingState } from '../ui/States';
import { ArrowRight, Search } from 'lucide-react';
import type { Page, CourseSummaryResponse } from '../../features/courses/types';

export function FeaturedCourses() {
  const [activeTab, setActiveTab] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');
  const [catalogSearch, setCatalogSearch] = useState('');
  const navigate = useNavigate();

  // Query live courses from backend API
  const { data, isLoading } = useQuery<Page<CourseSummaryResponse>>({
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

  const fallbackCourses = [
    {
      id: 'demo-1',
      title: 'Full-Stack Web Architecture with React & Spring Boot',
      description: 'Master modern full-stack web applications, REST APIs, database indexing, and state management.',
      difficulty: 'INTERMEDIATE',
      price: 0,
      thumbnailUrl: null,
      instructorName: 'Dr. Sarah Lin',
      rating: 4.9,
      studentCount: 3240,
      duration: '8 weeks · Self-paced',
      credentialType: 'Professional Certificate',
      tags: ['React', 'TypeScript', 'Spring Boot']
    },
    {
      id: 'demo-2',
      title: 'Foundations of Computer Science & Data Structures',
      description: 'Understand essential algorithms, memory management, algorithmic complexity, and clean code principles.',
      difficulty: 'BEGINNER',
      price: 49.00,
      thumbnailUrl: null,
      instructorName: 'Prof. David Thorne',
      rating: 4.95,
      studentCount: 5120,
      duration: '6 weeks · 4 hrs/wk',
      credentialType: 'Verified Certificate',
      tags: ['Algorithms', 'Python', 'Data Structures']
    },
    {
      id: 'demo-3',
      title: 'Distributed Systems & Cloud-Native Microservices',
      description: 'Design fault-tolerant services with consensus protocols, event streaming, Docker, and Kubernetes.',
      difficulty: 'ADVANCED',
      price: 89.00,
      thumbnailUrl: null,
      instructorName: 'Elena Rostova',
      rating: 4.88,
      studentCount: 1890,
      duration: '10 weeks · Masterclass',
      credentialType: 'Specialization Track',
      tags: ['Distributed Systems', 'Docker', 'Go']
    }
  ];

  const displayedCourses = realCourses.length > 0 
    ? realCourses 
    : fallbackCourses;

  const filteredCourses = displayedCourses.filter(course => {
    if (activeTab === 'all') return true;
    if (activeTab === 'beginner') return course.difficulty === 'BEGINNER';
    if (activeTab === 'intermediate') return course.difficulty === 'INTERMEDIATE';
    if (activeTab === 'advanced') return course.difficulty === 'ADVANCED';
    return true;
  });

  return (
    <section className="py-20 lg:py-28 border-b border-rule w-full bg-canvas transition-colors duration-150" id="courses">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <div className="superset-eyebrow mb-3">
              <span className="w-1.5 h-1.5 rounded-none bg-ember" />
              <span>FEATURED CURRICULUMS</span>
            </div>
            <h2 className="font-sans text-3xl sm:text-4xl lg:text-[42px] leading-[1.1] tracking-[-0.025em] text-foreground font-medium">
              Accredited courses and specializations.
            </h2>
          </div>
          <p className="font-sans text-[15px] text-muted max-w-sm leading-relaxed">
            Taught by experienced industry practitioners and university faculty with verified certificate milestones.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8">
          
          {/* Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 font-mono text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-2 rounded-none transition-colors cursor-pointer border ${
                activeTab === 'all'
                  ? 'bg-action-bg text-action-text border-action-border'
                  : 'bg-wash text-muted border-rule hover:text-foreground hover:border-ember'
              }`}
            >
              ALL LEVELS
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('beginner')}
              className={`px-3.5 py-2 rounded-none transition-colors cursor-pointer border ${
                activeTab === 'beginner'
                  ? 'bg-action-bg text-action-text border-action-border'
                  : 'bg-wash text-muted border-rule hover:text-foreground hover:border-ember'
              }`}
            >
              BEGINNER FRIENDLY
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('intermediate')}
              className={`px-3.5 py-2 rounded-none transition-colors cursor-pointer border ${
                activeTab === 'intermediate'
                  ? 'bg-action-bg text-action-text border-action-border'
                  : 'bg-wash text-muted border-rule hover:text-foreground hover:border-ember'
              }`}
            >
              INTERMEDIATE
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('advanced')}
              className={`px-3.5 py-2 rounded-none transition-colors cursor-pointer border ${
                activeTab === 'advanced'
                  ? 'bg-action-bg text-action-text border-action-border'
                  : 'bg-wash text-muted border-rule hover:text-foreground hover:border-ember'
              }`}
            >
              ADVANCED TRACKS
            </button>
          </div>

          {/* Quick Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={catalogSearch}
              onChange={(e) => setCatalogSearch(e.target.value)}
              placeholder="Search courses or topics..."
              className="w-full bg-wash text-foreground text-xs pl-9 pr-4 py-2.5 rounded-none border border-rule focus:border-ember transition-colors outline-none placeholder:text-muted"
            />
          </form>

        </div>

        {/* Course Cards Grid */}
        {isLoading && <LoadingState message="Loading catalog..." />}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {filteredCourses.map(course => (
            <CourseCard
              key={course.id}
              id={course.id}
              title={course.title}
              description={course.description}
              difficulty={course.difficulty}
              price={course.price}
              thumbnailUrl={course.thumbnailUrl}
              rating={course.rating}
              studentCount={course.studentCount}
              duration={'duration' in course ? (course as { duration?: string }).duration : undefined}
              credentialType={'credentialType' in course ? (course as { credentialType?: string }).credentialType : undefined}
              tags={'tags' in course ? (course as { tags?: string[] }).tags : undefined}
            />
          ))}
        </div>

        {/* View All Action */}
        <div className="mt-14 text-center">
          <Link
            to="/courses"
            className="btn-superset-primary"
          >
            <span>Explore All Courses in Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
