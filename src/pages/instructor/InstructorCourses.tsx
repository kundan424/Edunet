import { SectionHeading } from '../../components/ui/Typography';
import { PillButton } from '../../components/ui/Button';
import { InstructorNav } from '../../layouts/components/InstructorNav';
import { useInstructorCourses } from '../../features/instructor/queries';
import { LoadingState, ErrorState, EmptyState } from '../../components/ui/States';
import { useNavigate } from 'react-router-dom';
import { CourseStatusBadge } from '../../components/instructor/CourseStatusBadge';

export function InstructorCourses() {
  const { data: courses, isLoading, error } = useInstructorCourses();
  const navigate = useNavigate();

  if (isLoading) return <LoadingState message="Loading your courses..." />;
  if (error || !courses) return <ErrorState message="Failed to load courses." />;

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <SectionHeading>My Courses</SectionHeading>
        <PillButton onClick={() => navigate('/instructor/courses/create')}>
          + Create Course
        </PillButton>
      </div>
      <InstructorNav />

      {courses.length === 0 ? (
        <EmptyState 
          title="No courses yet" 
          message="Create your first course to start sharing your knowledge."
          actionLabel="Create Course"
          onAction={() => navigate('/instructor/courses/create')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="border border-midnight-ink flex flex-col bg-white overflow-hidden group hover:border-signal-blue transition-colors">
              <div className="h-40 bg-black/5 flex items-center justify-center border-b border-midnight-ink relative overflow-hidden">
                {course.thumbnailUrl ? (
                  <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover" />
                ) : (
                  <span className="font-bold text-gray-400">No Image</span>
                )}
                <div className="absolute top-4 left-4">
                  <CourseStatusBadge status={course.publishStatus} />
                </div>
              </div>
              <div className="p-6 flex flex-col gap-4 flex-grow">
                <h3 className="font-bold text-xl line-clamp-2">{course.title}</h3>
                <div className="flex flex-col gap-1 text-sm">
                  <div className="flex justify-between">
                    <span className="font-bold">Price</span>
                    <span>{course.price !== null && course.price !== undefined ? (course.price === 0 ? 'Free' : `$${course.price.toFixed(2)}`) : 'TBD'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold">Students</span>
                    <span>{course.studentCount}</span>
                  </div>
                </div>
              </div>
              <div className="p-4 border-t border-midnight-ink bg-cream-paper grid grid-cols-2 gap-2">
                <PillButton onClick={() => navigate(`/instructor/courses/${course.id}`)} className="bg-transparent hover:bg-black/10 w-full justify-center !py-2 !text-sm">
                  Edit
                </PillButton>
                <PillButton onClick={() => navigate(`/courses/${course.id}`)} className="w-full justify-center !py-2 !text-sm">
                  Preview
                </PillButton>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
