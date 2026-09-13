import { SectionHeading, DisplayHeading } from '../../components/ui/Typography';
import { AdminNav } from '../../layouts/components/AdminNav';
import { useAdminDashboard } from '../../features/admin/queries';
import { LoadingState, ErrorState } from '../../components/ui/States';
import { PillButton } from '../../components/ui/Button';
import { Link } from 'react-router-dom';

export function AdminDashboard() {
  const { data: dashboard, isLoading, error } = useAdminDashboard();

  if (isLoading) return <LoadingState message="Loading admin dashboard..." />;
  if (error || !dashboard) return <ErrorState message="Failed to load dashboard data." />;

  return (
    <div className="w-full flex flex-col gap-6">
      <SectionHeading>Admin Dashboard</SectionHeading>
      <AdminNav />

      {/* Main KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Users" value={dashboard.users.total} />
        <StatCard title="Total Revenue" value={dashboard.payments.totalAmount > 0 ? `$${dashboard.payments.totalAmount.toFixed(2)}` : '$0.00'} />
        <StatCard title="Total Courses" value={dashboard.courses.total} />
        <StatCard title="Avg Course Rating" value={dashboard.reviews.averageRating > 0 ? dashboard.reviews.averageRating.toFixed(1) : 'No Ratings'} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Action Required Board */}
        <section className="flex flex-col gap-6">
          <div className="flex justify-between items-center border-b border-midnight-ink pb-2">
            <h3 className="font-bold text-2xl text-ember-red">Action Required</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 border border-midnight-ink bg-saffron-yellow flex flex-col items-center text-center gap-4">
              <h4 className="font-bold text-xl uppercase tracking-wider">Instructor Verification</h4>
              <DisplayHeading className="!text-5xl text-midnight-ink">{dashboard.instructors.pending}</DisplayHeading>
              <span className="text-sm font-bold opacity-80">Pending Requests</span>
              <Link to="/admin/instructors">
                <PillButton className="mt-4 bg-midnight-ink text-white hover:bg-signal-blue w-full">Review Profiles</PillButton>
              </Link>
            </div>
            
            <div className="p-6 border border-midnight-ink bg-signal-blue flex flex-col items-center text-center gap-4">
              <h4 className="font-bold text-xl uppercase tracking-wider text-white">Course Moderation</h4>
              <DisplayHeading className="!text-5xl text-white">{dashboard.courses.pendingApproval}</DisplayHeading>
              <span className="text-sm font-bold text-white/80">Pending Approvals</span>
              <Link to="/admin/courses">
                <PillButton className="mt-4 w-full justify-center">Review Courses</PillButton>
              </Link>
            </div>
          </div>
        </section>

        {/* Recent Activity (Platform-wide) */}
        <section className="flex flex-col gap-4">
          <div className="flex justify-between items-center border-b border-midnight-ink pb-2">
            <h3 className="font-bold text-2xl">Platform Activity</h3>
          </div>
          {dashboard.recentActivity && dashboard.recentActivity.length > 0 ? (
            <div className="flex flex-col gap-4">
              {dashboard.recentActivity.map(activity => (
                <div key={`act-${activity.id}`} className="flex justify-between items-start p-4 border border-midnight-ink bg-cream-paper">
                  <div className="flex flex-col gap-1">
                    <span className="font-bold">{activity.studentName} <span className="font-normal text-sm text-midnight-ink/70">{activity.activityType}</span></span>
                    <span className="text-sm font-semibold text-signal-blue">{activity.courseTitle}</span>
                  </div>
                  <span className="text-xs font-mono">{new Date(activity.timestamp).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 border border-midnight-ink bg-white text-center text-midnight-ink/70 italic">
              No recent activity recorded.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

const StatCard = ({ title, value }: { title: string; value: string | number }) => (
  <div className="p-6 border border-midnight-ink flex flex-col gap-2 bg-white">
    <span className="text-sm font-bold uppercase tracking-wider text-gray-500">{title}</span>
    <DisplayHeading className="!text-4xl text-midnight-ink">{value}</DisplayHeading>
  </div>
);
