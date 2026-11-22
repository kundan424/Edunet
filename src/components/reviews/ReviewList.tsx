import { useState } from 'react';
import { useCourseReviews, useCreateReview, useUpdateReview, useDeleteReview } from '../../features/reviews/queries';
import { RatingDisplay, RatingInput } from '../ui/Rating';
import { LoadingState } from '../ui/States';
import { useAuth } from '../../auth/AuthProvider';
import type { CourseReviewResponse } from '../../features/reviews/types';
import { ShieldCheck, CheckCircle2, MessageSquare } from 'lucide-react';

interface ReviewListProps {
  courseId: string;
  isEnrolled: boolean;
}

export function ReviewList({ courseId, isEnrolled }: ReviewListProps) {
  const { user } = useAuth();
  const [page, setPage] = useState(0);
  const [filterRating, setFilterRating] = useState<number | 'ALL'>('ALL');
  const { data: pageData, isLoading } = useCourseReviews(courseId, page, 6);

  if (isLoading) return <LoadingState message="Loading peer feedback..." />;

  const backendReviews = pageData?.content || [];
  const myReview = backendReviews.find(r => r.userId === user?.id);

  const totalReviews = pageData?.totalElements ?? backendReviews.length;
  const hasReviews = totalReviews > 0;

  // Compute actual dynamic statistics from real reviews
  const avgRating = hasReviews
    ? (backendReviews.reduce((sum, r) => sum + r.rating, 0) / backendReviews.length).toFixed(1)
    : '0.0';

  const starBreakdowns = [5, 4, 3, 2, 1].map(stars => {
    const count = backendReviews.filter(r => Math.round(r.rating) === stars).length;
    const pct = backendReviews.length > 0 ? Math.round((count / backendReviews.length) * 100) : 0;
    return { stars: `${stars} Stars`, pct: `${pct}%`, width: `${pct}%`, count };
  });

  const filteredReviews = filterRating === 'ALL'
    ? backendReviews
    : backendReviews.filter(r => Math.round(r.rating) === filterRating);

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Overall Ratings & Review Statistics Header */}
      <div className="bg-card rounded-[10px] p-6 sm:p-7 border border-rule shadow-none flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="flex flex-col items-center justify-center bg-canvas border border-rule rounded-lg p-4 w-28 h-28 shrink-0">
            <span className="font-sans text-4xl font-bold text-foreground">
              {hasReviews ? avgRating : '—'}
            </span>
            <div className="flex text-ember text-xs mt-1">
              {hasReviews ? '★'.repeat(Math.min(5, Math.max(1, Math.round(Number(avgRating))))) : '☆☆☆☆☆'}
            </div>
            <span className="text-[10px] font-mono text-muted mt-1">
              {hasReviews ? 'Out of 5.0' : 'No ratings yet'}
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground">Student Satisfaction &amp; Ratings</span>
              {hasReviews && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-wash text-ember border border-rule font-medium">
                  Verified Real Reviews
                </span>
              )}
            </div>
            <p className="font-sans text-xs text-muted leading-relaxed max-w-md">
              {hasReviews 
                ? 'Feedback and reviews submitted directly by enrolled students who completed this course.'
                : 'Enrolled students can submit their course reviews and feedback upon completing coursework.'}
            </p>
            <div className="flex items-center gap-4 text-xs font-mono text-muted mt-1">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-ember" />
                {totalReviews} Verified Review{totalReviews === 1 ? '' : 's'}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
                100% Enrolled Students
              </span>
            </div>
          </div>
        </div>

        {/* Rating Breakdown Bars */}
        <div className="flex flex-col gap-1.5 w-full md:w-56 shrink-0 text-xs">
          {starBreakdowns.map(row => (
            <div key={row.stars} className="flex items-center gap-2 font-mono text-[11px] text-muted">
              <span className="w-12 shrink-0">{row.stars}</span>
              <div className="flex-1 bg-[#E2E8F0] h-1.5 rounded-full overflow-hidden">
                <div className="bg-ember h-full rounded-full transition-all" style={{ width: row.width }} />
              </div>
              <span className="w-7 text-right shrink-0">{row.pct}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Write a Review for Enrolled Students */}
      {isEnrolled && user && (
        <div className="bg-card rounded-[10px] border border-rule p-6 shadow-none">
          <div className="flex items-center justify-between pb-4 border-b border-rule mb-5">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-ember" />
              <h3 className="font-sans text-lg font-semibold text-foreground">
                {myReview ? 'Your Course Review' : 'Write a Course Review'}
              </h3>
            </div>
            <span className="text-xs font-mono text-muted">
              Signed in as {user.name || user.email}
            </span>
          </div>
          <ReviewForm courseId={courseId} existingReview={myReview} />
        </div>
      )}

      {/* Filter Tabs if multiple reviews */}
      {hasReviews && (
        <div className="flex items-center gap-2 pb-2 border-b border-rule overflow-x-auto">
          <button
            type="button"
            onClick={() => setFilterRating('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              filterRating === 'ALL'
                ? 'bg-ember text-white'
                : 'text-muted hover:text-foreground hover:bg-canvas'
            }`}
          >
            All Reviews ({totalReviews})
          </button>
          {[5, 4, 3, 2, 1].map(stars => {
            const count = backendReviews.filter(r => Math.round(r.rating) === stars).length;
            if (count === 0 && filterRating !== stars) return null;
            return (
              <button
                key={stars}
                type="button"
                onClick={() => setFilterRating(stars)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  filterRating === stars
                    ? 'bg-ember text-white'
                    : 'text-muted hover:text-foreground hover:bg-canvas'
                }`}
              >
                {stars} Stars ({count})
              </button>
            );
          })}
        </div>
      )}

      {/* Real Reviews from Backend */}
      {hasReviews && filteredReviews.length > 0 ? (
        <div className="flex flex-col gap-4">
          {filteredReviews.map(review => (
            <div 
              key={review.id} 
              className="bg-card rounded-[10px] border border-rule p-5 sm:p-6 shadow-none flex flex-col gap-3"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-wash text-ember border border-rule flex items-center justify-center font-sans font-bold text-sm shrink-0">
                    {(review.studentDisplayName || 'S').charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-sans text-base font-semibold text-foreground">
                        {review.studentDisplayName || 'Enrolled Student'}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-wash text-ember border border-rule">
                        Verified Enrolled
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-muted">
                      {new Date(review.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>

                <RatingDisplay rating={review.rating} size="sm" showText={false} />
              </div>

              {review.comment && (
                <p className="font-sans text-sm text-muted leading-relaxed whitespace-pre-wrap mt-1">
                  {review.comment}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : hasReviews ? (
        <div className="bg-card rounded-[10px] border border-rule p-8 text-center flex flex-col items-center justify-center gap-2 shadow-none">
          <p className="font-sans text-xs text-muted">
            No reviews match the selected filter.
          </p>
        </div>
      ) : (
        <div className="bg-card rounded-[10px] border border-rule p-8 sm:p-12 text-center flex flex-col items-center justify-center gap-3 shadow-none">
          <div className="w-12 h-12 rounded-lg bg-wash flex items-center justify-center text-ember">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h4 className="font-sans text-base font-semibold text-foreground">
            No Student Reviews Yet
          </h4>
          <p className="font-sans text-xs text-muted max-w-md leading-relaxed">
            There are no student reviews submitted for this course yet. Enroll in this course to be the first to leave verified feedback!
          </p>
        </div>
      )}

      {/* Pagination for backend reviews */}
      {pageData && pageData.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-4">
          <button 
            disabled={pageData.first} 
            onClick={() => setPage(p => p - 1)}
            className="px-4 py-2 rounded-lg border border-rule text-xs font-medium text-foreground disabled:opacity-40 hover:bg-canvas transition-colors cursor-pointer"
          >
            Previous
          </button>
          <span className="text-xs font-mono text-muted">
            Page {pageData.number + 1} of {pageData.totalPages}
          </span>
          <button 
            disabled={pageData.last} 
            onClick={() => setPage(p => p + 1)}
            className="px-4 py-2 rounded-lg border border-rule text-xs font-medium text-foreground disabled:opacity-40 hover:bg-canvas transition-colors cursor-pointer"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

function ReviewForm({ courseId, existingReview }: { courseId: string; existingReview?: CourseReviewResponse }) {
  const [rating, setRating] = useState(existingReview?.rating || 5);
  const [comment, setComment] = useState(existingReview?.comment || '');
  const [isEditing, setIsEditing] = useState(!existingReview);

  const createRev = useCreateReview(courseId);
  const updateRev = useUpdateReview(courseId);
  const deleteRev = useDeleteReview(courseId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (existingReview) {
      updateRev.mutate({ reviewId: existingReview.id, data: { rating, comment } }, {
        onSuccess: () => setIsEditing(false)
      });
    } else {
      createRev.mutate({ rating, comment }, {
        onSuccess: () => {
          setIsEditing(false);
          setComment('');
        }
      });
    }
  };

  const handleDelete = () => {
    if (existingReview && window.confirm('Delete your review?')) {
      deleteRev.mutate(existingReview.id, {
        onSuccess: () => {
          setRating(5);
          setComment('');
          setIsEditing(true);
        }
      });
    }
  };

  if (!isEditing && existingReview) {
    return (
      <div className="flex flex-col gap-3">
        <RatingDisplay rating={existingReview.rating} />
        {existingReview.comment && (
          <p className="font-sans text-sm text-muted leading-relaxed">{existingReview.comment}</p>
        )}
        <div className="flex gap-4 mt-2">
          <button 
            onClick={() => setIsEditing(true)} 
            className="text-xs font-medium text-ember underline hover:text-[#3730A3] transition-colors cursor-pointer"
          >
            Edit Review
          </button>
          <button 
            onClick={handleDelete} 
            className="text-xs font-medium text-[#DC2626] underline hover:opacity-80 transition-opacity cursor-pointer" 
            disabled={deleteRev.isPending}
          >
            Delete
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="block text-xs font-mono uppercase tracking-wider text-muted font-medium mb-1.5">
          Rating
        </label>
        <RatingInput value={rating} onChange={setRating} disabled={createRev.isPending || updateRev.isPending} />
      </div>
      <div>
        <label className="block text-xs font-mono uppercase tracking-wider text-muted font-medium mb-1.5">
          Review &amp; Feedback (Optional)
        </label>
        <textarea
          rows={3}
          maxLength={1000}
          value={comment}
          onChange={e => setComment(e.target.value)}
          disabled={createRev.isPending || updateRev.isPending}
          className="w-full rounded-lg border border-rule p-3 text-sm font-sans bg-canvas text-foreground placeholder:text-muted focus:outline-none focus:border-ember transition-colors"
          placeholder="Share your feedback on the curriculum, lessons, assignments, and learning outcomes..."
        />
      </div>
      <div className="flex items-center gap-3">
        <button 
          type="submit" 
          disabled={createRev.isPending || updateRev.isPending}
          className="px-5 py-2.5 rounded-lg bg-ember hover:bg-ember/90 text-white text-xs font-medium transition-colors shadow-none cursor-pointer disabled:opacity-50"
        >
          {createRev.isPending || updateRev.isPending ? 'Saving...' : existingReview ? 'Update Feedback' : 'Submit Peer Feedback'}
        </button>
        {existingReview && (
          <button 
            type="button" 
            onClick={() => setIsEditing(false)} 
            className="text-xs font-medium text-muted hover:text-foreground transition-colors cursor-pointer"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
