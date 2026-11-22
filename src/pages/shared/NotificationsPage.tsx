import { useState } from 'react';
import { SectionHeading } from '../../components/ui/Typography';
import { PillButton } from '../../components/ui/Button';
import { LoadingState, EmptyState } from '../../components/ui/States';
import { useNotifications, useMarkAllAsRead, useMarkAsRead } from '../../features/notifications/queries';
import { useNavigate } from 'react-router-dom';
import { Bell, CreditCard, BookOpen, Award } from 'lucide-react';


export function NotificationsPage() {
  const [filterUnread, setFilterUnread] = useState(false);
  const [page, setPage] = useState(0);

  const { data: pageData, isLoading } = useNotifications(filterUnread ? true : undefined, page, 20);
  const markAll = useMarkAllAsRead();

  return (
    <div className="max-w-4xl mx-auto w-full flex flex-col gap-8 bg-canvas text-foreground transition-colors duration-150">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-rule pb-4">
        <div>
          <div className="superset-eyebrow mb-1">
            <span className="w-1.5 h-1.5 rounded-none bg-ember" />
            <span>NOTIFICATION DISPATCH</span>
          </div>
          <SectionHeading>Platform Notifications</SectionHeading>
        </div>
        <PillButton 
          onClick={() => markAll.mutate()} 
          disabled={markAll.isPending || !pageData?.content?.some(n => !n.isRead)}
        >
          Mark All as Read
        </PillButton>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-rule pb-1 font-mono text-xs">
        <button 
          onClick={() => { setFilterUnread(false); setPage(0); }} 
          className={`pb-2 border-b-2 transition-colors uppercase tracking-wider cursor-pointer ${
            !filterUnread 
              ? 'border-ember text-ember font-medium' 
              : 'border-transparent text-muted hover:text-foreground'
          }`}
        >
          All Activity
        </button>
        <button 
          onClick={() => { setFilterUnread(true); setPage(0); }} 
          className={`pb-2 border-b-2 transition-colors uppercase tracking-wider cursor-pointer ${
            filterUnread 
              ? 'border-ember text-ember font-medium' 
              : 'border-transparent text-muted hover:text-foreground'
          }`}
        >
          Unread Only
        </button>
      </div>

      {isLoading ? (
        <LoadingState message="Loading notifications..." />
      ) : !pageData || pageData.content.length === 0 ? (
        <EmptyState title="All caught up!" message="You have no notifications." />
      ) : (
        <div className="flex flex-col gap-3">
          {pageData.content.map(notification => (
            <NotificationRow key={notification.id} notification={notification} />
          ))}

          {pageData.totalPages > 1 && (
            <div className="flex justify-center gap-4 mt-6 pt-4 border-t border-rule font-mono text-xs">
              <button 
                disabled={pageData.first} 
                onClick={() => setPage(p => p - 1)} 
                className="text-ember hover:underline disabled:text-muted cursor-pointer"
              >
                ← Previous
              </button>
              <span className="text-muted">Page {pageData.number + 1} of {pageData.totalPages}</span>
              <button 
                disabled={pageData.last} 
                onClick={() => setPage(p => p + 1)} 
                className="text-ember hover:underline disabled:text-muted cursor-pointer"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function NotificationRow({ notification }: { notification: any }) {
  const markRead = useMarkAsRead();
  const navigate = useNavigate();

  const handleAction = () => {
    if (!notification.isRead) markRead.mutate(notification.id);
    
    if (notification.type === 'COURSE_PUBLISHED' && notification.referenceId) {
      navigate(`/courses/${notification.referenceId}`);
    } else if (notification.type === 'ASSIGNMENT_GRADED' && notification.referenceId) {
      navigate('/learn');
    } else if (notification.type === 'COURSE_ENROLLED') {
      navigate('/learn');
    }
  };

  const Icon = () => {
    switch (notification.type) {
      case 'PAYMENT_SUCCESS': 
        return (
          <div className="w-9 h-9 rounded-none bg-wash border border-rule text-emerald-400 flex items-center justify-center shrink-0">
            <CreditCard className="w-4 h-4" />
          </div>
        );
      case 'COURSE_PUBLISHED': 
        return (
          <div className="w-9 h-9 rounded-none bg-wash border border-rule text-ember flex items-center justify-center shrink-0">
            <BookOpen className="w-4 h-4" />
          </div>
        );
      case 'ASSIGNMENT_GRADED': 
        return (
          <div className="w-9 h-9 rounded-none bg-wash border border-rule text-emerald-400 flex items-center justify-center shrink-0">
            <Award className="w-4 h-4" />
          </div>
        );
      default: 
        return (
          <div className="w-9 h-9 rounded-none bg-wash border border-rule text-muted flex items-center justify-center shrink-0">
            <Bell className="w-4 h-4" />
          </div>
        );
    }
  };

  return (
    <div 
      className={`p-4 border rounded-[10px] flex items-start gap-4 cursor-pointer transition-colors ${
        notification.isRead 
          ? 'border-rule bg-card/60 opacity-75' 
          : 'border-ember/40 bg-card hover:border-ember'
      }`} 
      onClick={handleAction}
    >
      <Icon />
      <div className="flex flex-col flex-grow min-w-0">
        <div className="flex justify-between items-start gap-3">
          <h4 className="font-sans text-sm font-medium text-foreground truncate">{notification.title}</h4>
          <span className="text-[11px] font-mono text-muted whitespace-nowrap">{new Date(notification.createdAt).toLocaleDateString()}</span>
        </div>
        <p className="font-sans text-xs text-muted mt-1 leading-relaxed">{notification.message}</p>
      </div>
      {!notification.isRead && (
        <div className="w-2 h-2 rounded-none bg-ember shrink-0 mt-1" />
      )}
    </div>
  );
}
