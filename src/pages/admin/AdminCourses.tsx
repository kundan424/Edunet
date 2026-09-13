import { useState } from 'react';
import { SectionHeading } from '../../components/ui/Typography';
import { AdminNav } from '../../layouts/components/AdminNav';
import { usePendingCourses } from '../../features/admin/queries';
import { LoadingState, ErrorState, EmptyState } from '../../components/ui/States';
import { PillButton } from '../../components/ui/Button';
import { Link } from 'react-router-dom';

export function AdminCourses() {
  const [page, setPage] = useState(0);

  const { data: pageData, isLoading, error } = usePendingCourses(page, 20);

  if (isLoading) return <LoadingState message="Loading pending courses..." />;
  if (error || !pageData) return <ErrorState message="Failed to load course moderation list." />;

  const courses = pageData.content;

  return (
    <div className="w-full flex flex-col gap-6">
      <SectionHeading>Course Moderation</SectionHeading>
      <AdminNav />

      {courses.length === 0 ? (
        <EmptyState 
          title="All Caught Up" 
          message="No courses awaiting moderation." 
        />
      ) : (
        <div className="flex flex-col gap-4">
          <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 border-b-2 border-midnight-ink font-bold text-sm tracking-wider uppercase">
            <div className="col-span-5">Course Title</div>
            <div className="col-span-3">Instructor</div>
            <div className="col-span-2">Price</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>
          
          {courses.map(course => (
            <div key={course.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border border-midnight-ink bg-white items-center">
              <div className="col-span-1 md:col-span-5 flex flex-col">
                <span className="font-bold text-lg">{course.title}</span>
                <span className="text-xs uppercase tracking-widest text-signal-blue">{course.category || 'Uncategorized'}</span>
              </div>
              
              <div className="col-span-1 md:col-span-3 flex flex-col">
                <span className="text-xs uppercase tracking-wider text-gray-500 md:hidden">Instructor</span>
                <span className="font-semibold text-midnight-ink/80">{course.instructorName || 'Unknown'}</span>
              </div>
              
              <div className="col-span-1 md:col-span-2 flex flex-col">
                <span className="text-xs uppercase tracking-wider text-gray-500 md:hidden">Price</span>
                <span className="font-bold">{course.price === 0 || course.price === null ? 'Free' : `$${course.price.toFixed(2)}`}</span>
              </div>

              <div className="col-span-1 md:col-span-2 flex md:justify-end mt-2 md:mt-0">
                <Link to={`/admin/courses/${course.id}/review`} className="w-full md:w-auto">
                  <PillButton className="w-full justify-center">Review</PillButton>
                </Link>
              </div>
            </div>
          ))}

          {pageData.totalPages > 1 && (
            <div className="flex justify-center gap-4 mt-8 border-t border-midnight-ink pt-6">
              <button 
                disabled={pageData.first} 
                onClick={() => setPage(p => p - 1)}
                className="font-bold text-signal-blue disabled:text-gray-400 hover:underline"
              >
                Previous
              </button>
              <span className="font-bold text-sm flex items-center">Page {pageData.number + 1} of {pageData.totalPages}</span>
              <button 
                disabled={pageData.last} 
                onClick={() => setPage(p => p + 1)}
                className="font-bold text-signal-blue disabled:text-gray-400 hover:underline"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
