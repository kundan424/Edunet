import { useState } from 'react';
import { SectionHeading } from '../../components/ui/Typography';
import { PillButton } from '../../components/ui/Button';
import { LoadingState, EmptyState } from '../../components/ui/States';
import { useNotifications, useMarkAllAsRead, useMarkAsRead } from '../../features/notifications/queries';
import { useNavigate } from 'react-router-dom';

export function NotificationsPage() {
  const [filterUnread, setFilterUnread] = useState(false);
  const [page, setPage] = useState(0);

  const { data: pageData, isLoading } = useNotifications(filterUnread ? true : undefined, page, 20);
  const markAll = useMarkAllAsRead();

  return (
    <div className="max-w-4xl mx-auto w-full flex flex-col gap-8">
      <div className="flex justify-between items-center border-b border-midnight-ink pb-4">
        <SectionHeading>Notifications</SectionHeading>
        <PillButton onClick={() => markAll.mutate()} disabled={markAll.isPending || !pageData?.content?.some(n => !n.isRead)}>
          Mark All as Read
        </PillButton>
      </div>

      <div className="flex gap-4 border-b border-midnight-ink/20 pb-2">
        <button 
          onClick={() => { setFilterUnread(false); setPage(0); }} 
          className={`font-bold pb-2 border-b-2 transition-colors ${!filterUnread ? 'border-midnight-ink text-midnight-ink' : 'border-transparent text-gray-400 hover:text-midnight-ink'}`}
        >
          All
        </button>
        <button 
          onClick={() => { setFilterUnread(true); setPage(0); }} 
          className={`font-bold pb-2 border-b-2 transition-colors ${filterUnread ? 'border-midnight-ink text-midnight-ink' : 'border-transparent text-gray-400 hover:text-midnight-ink'}`}
        >
          Unread
        </button>
      </div>

      {isLoading ? (
        <LoadingState message="Loading notifications..." />
      ) : !pageData || pageData.content.length === 0 ? (
        <EmptyState title="All caught up!" message="You have no notifications." />
      ) : (
        <div className="flex flex-col gap-4">
          {pageData.content.map(notification => (
            <NotificationRow key={notification.id} notification={notification} />
          ))}

          {pageData.totalPages > 1 && (
            <div className="flex justify-center gap-4 mt-6">
              <button disabled={pageData.first} onClick={() => setPage(p => p - 1)} className="font-bold text-signal-blue disabled:text-gray-400">Previous</button>
              <span className="font-bold text-sm">Page {pageData.number + 1} of {pageData.totalPages}</span>
              <button disabled={pageData.last} onClick={() => setPage(p => p + 1)} className="font-bold text-signal-blue disabled:text-gray-400">Next</button>
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
    
    // Navigate based on type
    if (notification.type === 'COURSE_PUBLISHED' && notification.referenceId) {
      navigate(`/courses/${notification.referenceId}`);
    } else if (notification.type === 'ASSIGNMENT_GRADED' && notification.referenceId) {
      // Assuming referenceId is the lessonId, we can send them to learn
      // (Backend might send courseId or assignmentId, let's just send to dashboard for now if missing full context)
      navigate('/learn');
    } else if (notification.type === 'COURSE_ENROLLED') {
      navigate('/learn');
    }
  };

  const Icon = () => {
    switch (notification.type) {
      case 'PAYMENT_SUCCESS': return <div className="w-10 h-10 bg-signal-blue text-white flex items-center justify-center font-bold">$$</div>;
      case 'COURSE_PUBLISHED': return <div className="w-10 h-10 bg-saffron-yellow border border-midnight-ink flex items-center justify-center font-bold">📚</div>;
      case 'ASSIGNMENT_GRADED': return <div className="w-10 h-10 bg-ember-red flex items-center justify-center font-bold text-white">A+</div>;
      default: return <div className="w-10 h-10 bg-black/10 border border-midnight-ink flex items-center justify-center font-bold">🔔</div>;
    }
  };

  return (
    <div className={`p-4 border ${notification.isRead ? 'border-midnight-ink/20 bg-black/5 opacity-70' : 'border-signal-blue bg-white'} flex gap-4 cursor-pointer hover:shadow-sm transition-shadow`} onClick={handleAction}>
      <Icon />
      <div className="flex flex-col flex-grow">
        <div className="flex justify-between items-start">
          <h4 className="font-bold">{notification.title}</h4>
          <span className="text-xs font-bold text-gray-500 whitespace-nowrap">{new Date(notification.createdAt).toLocaleDateString()}</span>
        </div>
        <p className="font-usual text-sm text-midnight-ink mt-1">{notification.message}</p>
      </div>
      {!notification.isRead && (
        <div className="w-3 h-3 rounded-full bg-signal-blue shrink-0 mt-1"></div>
      )}
    </div>
  );
}
