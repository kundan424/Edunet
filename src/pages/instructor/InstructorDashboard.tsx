import { SectionHeading, BodyText, DisplayHeading } from '../../components/ui/Typography';
import { InstructorNav } from '../../layouts/components/InstructorNav';
import { useInstructorDashboard } from '../../features/instructor/queries';
import { LoadingState, ErrorState } from '../../components/ui/States';
import { Link } from 'react-router-dom';
import { CourseStatusBadge } from '../../components/instructor/CourseStatusBadge';

export function InstructorDashboard() {
  const { data: dashboard, isLoading, error } = useInstructorDashboard();

  if (isLoading) return <LoadingState message="Loading your dashboard..." />;
  if (error || !dashboard) return <ErrorState message="Failed to load dashboard data." />;

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex justify-between items-end">
        <SectionHeading>Instructor Dashboard</SectionHeading>
      </div>
      <InstructorNav />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Students" value={dashboard.totalEnrolledStudents} />
        <StatCard title="Total Revenue" value={dashboard.totalRevenue !== null ? `$${dashboard.totalRevenue.toFixed(2)}` : '$0.00'} />
        <StatCard title="Total Courses" value={dashboard.totalCoursesOwned} />
        <StatCard title="Avg Rating" value={dashboard.averageRating > 0 ? dashboard.averageRating.toFixed(1) : 'New'} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Recent Courses */}
        <section className="flex flex-col gap-4">
          <div className="flex justify-between items-center border-b border-midnight-ink pb-2">
            <h3 className="font-bold text-xl">Recent Courses</h3>
            <Link to="/instructor/courses" className="text-sm font-bold text-signal-blue hover:underline">View All</Link>
          </div>
          {dashboard.recentCourses.length === 0 ? (
            <BodyText className="text-gray-600 italic">No courses yet. Start building!</BodyText>
          ) : (
            <div className="flex flex-col gap-4">
              {dashboard.recentCourses.map(course => (
                <Link 
                  key={course.id} 
                  to={`/instructor/courses/${course.id}`}
                  className="flex justify-between items-center p-4 border border-midnight-ink hover:bg-black/5 transition-colors bg-white"
                >
                  <div className="flex flex-col gap-1">
                    <span className="font-bold">{course.title}</span>
                    <span className="text-sm text-gray-600">{course.studentCount} Students</span>
                  </div>
                  <CourseStatusBadge status={course.publishStatus} />
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Recent Activity */}
        <section className="flex flex-col gap-4">
          <div className="flex justify-between items-center border-b border-midnight-ink pb-2">
            <h3 className="font-bold text-xl">Recent Activity</h3>
          </div>
          {dashboard.recentEnrollments.length === 0 && dashboard.recentReviews.length === 0 ? (
            <BodyText className="text-gray-600 italic">No recent activity.</BodyText>
          ) : (
            <div className="flex flex-col gap-4">
              {dashboard.recentEnrollments.map(activity => (
                <div key={`enroll-${activity.id}`} className="flex justify-between items-center p-4 border border-midnight-ink bg-cream-paper">
                  <div className="flex flex-col gap-1">
                    <span className="font-bold">{activity.studentName} <span className="font-normal text-sm text-midnight-ink/70">enrolled in</span></span>
                    <span className="text-sm font-semibold text-signal-blue">{activity.courseTitle}</span>
                  </div>
                  <span className="text-xs font-mono">{new Date(activity.timestamp).toLocaleDateString()}</span>
                </div>
              ))}
              {dashboard.recentReviews.map(review => (
                <div key={`review-${review.id}`} className="flex justify-between items-start p-4 border border-midnight-ink bg-white">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{review.studentName}</span>
                      <span className="text-saffron-yellow tracking-widest text-sm">{'★'.repeat(review.rating)}{'☆'.repeat(5-review.rating)}</span>
                    </div>
                    <span className="text-sm font-semibold text-signal-blue">{review.courseTitle}</span>
                    {review.comment && <span className="text-sm italic mt-1 text-midnight-ink/80 truncate max-w-xs">{review.comment}</span>}
                  </div>
                  <span className="text-xs font-mono">{new Date(review.createdAt).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

const StatCard = ({ title, value }: { title: string; value: string | number }) => (
  <div className="p-6 border border-midnight-ink flex flex-col gap-2 bg-white">
    <span className="text-sm font-bold uppercase tracking-wider">{title}</span>
    <DisplayHeading className="text-4xl! text-signal-blue">{value}</DisplayHeading>
  </div>
);
