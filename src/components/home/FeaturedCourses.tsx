import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';
import { CourseCard } from '../course/CourseCard';
import { LoadingState, ErrorState } from '../ui/States';
import { PillButton } from '../ui/Button';
import type { Page, CourseSummaryResponse } from '../../features/courses/types';

export function FeaturedCourses() {
  const { data, isLoading, error } = useQuery<Page<CourseSummaryResponse>>({
    queryKey: ['featured-courses'],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: '0',
        size: '4',
        sort: 'newest'
      });
      return api.get(`/api/v1/courses?${params.toString()}`);
    }
  });

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 md:px-8 w-full max-w-300 mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="flex flex-col gap-2">
          <h2 className="font-degular-display text-3xl md:text-4xl font-bold text-midnight-ink">
            Explore Courses
          </h2>
          <p className="font-usual text-midnight-ink/70 max-w-xl">
            Start your learning journey with our most recent additions. Crafted by industry experts to help you master new skills.
          </p>
        </div>
        <Link to="/courses" className="shrink-0 hidden md:block">
          <PillButton className="bg-transparent text-midnight-ink border-2 border-midnight-ink hover:bg-midnight-ink hover:text-white">View All Courses</PillButton>
        </Link>
      </div>

      {isLoading && <LoadingState message="Loading courses..." />}
      {error && <ErrorState message="Failed to load featured courses." />}
      
      {!isLoading && !error && data?.content && data.content.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.content.map(course => (
            <CourseCard 
              key={course.id} 
              id={course.id}
              title={course.title}
              description={course.description}
              difficulty={course.difficulty}
              price={course.price}
              instructorName={course.instructorName}
            />
          ))}
        </div>
      ) : (
        !isLoading && !error && (
          <div className="p-12 border border-midnight-ink/10 rounded-2xl bg-cream-paper/50 text-center text-midnight-ink/70">
            No courses available yet.
          </div>
        )
      )}

      <div className="mt-10 md:hidden flex justify-center">
        <Link to="/courses" className="w-full">
          <PillButton className="bg-transparent text-midnight-ink border-2 border-midnight-ink hover:bg-midnight-ink hover:text-white w-full justify-center">View All Courses</PillButton>
        </Link>
      </div>
    </section>
  );
}
