import { Link } from 'react-router-dom';
import { SectionHeading } from '../../components/ui/Typography';
import { PillButton } from '../../components/ui/Button';
import { LoadingState, ErrorState, EmptyState } from '../../components/ui/States';
import { useStudentDashboard } from '../../features/dashboard/queries';

export function MyLearning() {
  const { data: dashboard, isLoading, error, refetch } = useStudentDashboard();

  if (isLoading) return <LoadingState message="Loading your dashboard..." />;
  if (error) return <ErrorState title="Failed to load dashboard" message="We couldn't retrieve your learning data." onRetry={() => refetch()} />;

  if (!dashboard || dashboard.totalEnrolledCourses === 0) {
    return (
      <EmptyState 
        title="No courses yet" 
        message="You haven't enrolled in any courses. Start exploring our catalog to begin your learning journey." 
        actionLabel="Browse Courses"
        onAction={() => window.location.href = '/courses'}
      />
    );
  }

  return (
    <div className="flex flex-col gap-12 w-full">
      <SectionHeading>Student Dashboard</SectionHeading>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <StatCard label="Enrolled Courses" value={dashboard.totalEnrolledCourses} />
        <StatCard label="Completed Courses" value={dashboard.completedCourses} />
        <StatCard label="Avg Quiz Score" value={`${dashboard.averageQuizScore.toFixed(0)}%`} />
        <StatCard label="Avg Assignment" value={`${dashboard.averageAssignmentScore.toFixed(0)}%`} />
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-end border-b border-midnight-ink pb-4">
          <h2 className="font-bold text-2xl">Continue Learning</h2>
          <Link to="/courses" className="font-bold text-sm text-signal-blue hover:underline">Explore More →</Link>
        </div>

        {dashboard.continueLearning.length === 0 ? (
          <div className="p-8 border border-midnight-ink bg-cream-paper text-center">
            You don't have any active courses to continue.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboard.continueLearning.map((cl) => (
              <Link 
                key={cl.courseId}
                to={`/learn/${cl.courseId}`}
                className="group flex flex-col border border-midnight-ink bg-cream-paper hover:bg-midnight-ink hover:text-cream-paper transition-colors duration-300 p-6 flex-grow"
              >
                <div className="flex flex-col h-full">
                  <h3 className="font-degular-display text-xl md:text-2xl font-bold mb-2 line-clamp-2">
                    {cl.courseTitle}
                  </h3>
                  
                  {cl.lastLessonTitle && (
                    <span className="text-sm font-usual mb-4 opacity-80 truncate">
                      Up next: {cl.lastLessonTitle}
                    </span>
                  )}

                  <div className="mt-auto flex flex-col gap-3 pt-6 border-t border-midnight-ink group-hover:border-cream-paper">
                    <div className="w-full h-2 bg-black/10 group-hover:bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-signal-blue" style={{ width: `${cl.progressPercentage}%` }}></div>
                    </div>
                    <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider">
                      <span>{cl.progressPercentage.toFixed(0)}% Complete</span>
                      <span className="text-signal-blue group-hover:text-cream-paper">Resume →</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
        <div className="border border-midnight-ink p-6 md:p-8 bg-white flex flex-col items-center text-center gap-4">
          <h3 className="font-bold text-xl">Updates & Activity</h3>
          <p className="text-midnight-ink/70 text-sm">You have {dashboard.unreadNotificationCount} unread notifications.</p>
          <Link to="/notifications">
            <PillButton className="mt-2">View Notifications</PillButton>
          </Link>
        </div>
        <div className="border border-midnight-ink p-6 md:p-8 bg-saffron-yellow flex flex-col items-center text-center gap-4">
          <h3 className="font-bold text-xl">Discover New Skills</h3>
          <p className="text-midnight-ink/70 text-sm">Expand your knowledge with our latest courses.</p>
          <Link to="/courses">
            <PillButton className="mt-2 bg-midnight-ink text-white hover:bg-signal-blue">Explore More</PillButton>
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string, value: string | number }) {
  return (
    <div className="border border-midnight-ink p-4 md:p-6 bg-white flex flex-col gap-1">
      <span className="text-xs md:text-sm font-bold uppercase text-gray-500 tracking-wider">{label}</span>
      <span className="font-degular-display text-3xl md:text-4xl font-bold text-signal-blue">{value}</span>
    </div>
  );
}
