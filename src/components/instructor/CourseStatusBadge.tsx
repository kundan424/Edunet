
import type { PublishStatus } from '../../features/courses/types';
import { clsx } from 'clsx';

export const CourseStatusBadge = ({ status, className }: { status: PublishStatus; className?: string }) => {
  const statusStyles: Record<PublishStatus, string> = {
    DRAFT: 'bg-cream-paper text-midnight-ink border-midnight-ink',
    PENDING_APPROVAL: 'bg-saffron-yellow text-midnight-ink border-midnight-ink',
    PUBLISHED: 'bg-signal-blue text-cream-paper border-signal-blue',
    ARCHIVED: 'bg-midnight-ink text-cream-paper border-midnight-ink',
  };

  const statusLabels: Record<PublishStatus, string> = {
    DRAFT: 'Draft',
    PENDING_APPROVAL: 'Pending Approval',
    PUBLISHED: 'Published',
    ARCHIVED: 'Archived',
  };

  return (
    <span 
      className={clsx(
        'px-3 py-1 text-xs font-bold border uppercase tracking-wider',
        statusStyles[status],
        className
      )}
    >
      {statusLabels[status]}
    </span>
  );
};
