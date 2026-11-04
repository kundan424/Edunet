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
      <div className="bg-[#efeeeb]/60 rounded-2xl p-6 sm:p-7 border border-[#e7e6e1] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="flex flex-col items-center justify-center bg-[#ffffff] border border-[#e7e6e1] rounded-xl p-4 shadow-xs w-28 h-28 shrink-0">
            <span className="font-heading text-4xl font-bold text-[#121212]">
              {hasReviews ? avgRating : '—'}
            </span>
            <div className="flex text-[#d97757] text-xs mt-1">
              {hasReviews ? '★'.repeat(Math.min(5, Math.max(1, Math.round(Number(avgRating))))) : '☆☆☆☆☆'}
            </div>
            <span className="text-[10px] font-mono text-[#7b7974] mt-1">
              {hasReviews ? 'Out of 5.0' : 'No ratings yet'}
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-[#121212]">Student Satisfaction &amp; Ratings</span>
              {hasReviews && (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#ffffff] text-[#3c8254] border border-[#e7e6e1] font-medium">
                  Verified Real Reviews
                </span>
              )}
            </div>
            <p className="font-body text-xs text-[#7b7974] leading-relaxed max-w-md">
              {hasReviews 
                ? 'Feedback and reviews submitted directly by enrolled students who completed this course.'
                : 'Enrolled students can submit their course reviews and feedback upon completing coursework.'}
            </p>
            <div className="flex items-center gap-4 text-xs font-mono text-[#373734] mt-1">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#d97757]" />
                {totalReviews} Verified Review{totalReviews === 1 ? '' : 's'}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#3c8254]" />
                100% Enrolled Students
              </span>
            </div>
          </div>
        </div>

        {/* Rating Breakdown Bars */}
        <div className="flex flex-col gap-1.5 w-full md:w-56 shrink-0 text-xs">
          {starBreakdowns.map(row => (
            <div key={row.stars} className="flex items-center gap-2 font-mono text-[11px] text-[#7b7974]">
              <span className="w-12 shrink-0">{row.stars}</span>
              <div className="flex-1 bg-[#e7e6e1] h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#121212] h-full rounded-full transition-all" style={{ width: row.width }} />
              </div>
              <span className="w-7 text-right shrink-0">{row.pct}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Write a Review for Enrolled Students */}
      {isEnrolled && user && (
        <div className="bg-[#ffffff] rounded-2xl border border-[#e7e6e1] p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-[#e7e6e1] mb-5">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#d97757]" />
              <h3 className="font-heading text-lg font-semibold text-[#121212]">
                {myReview ? 'Your Course Review' : 'Write a Course Review'}
              </h3>
            </div>
            <span className="text-xs font-mono text-[#7b7974]">
              Signed in as {user.name || user.email}
            </span>
          </div>
          <ReviewForm courseId={courseId} existingReview={myReview} />
        </div>
      )}

      {/* Filter Tabs if multiple reviews */}
      {hasReviews && (
        <div className="flex items-center gap-2 pb-2 border-b border-[#e7e6e1] overflow-x-auto">
          <button
            type="button"
            onClick={() => setFilterRating('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              filterRating === 'ALL'
                ? 'bg-[#121212] text-[#f8f8f6]'
                : 'text-[#7b7974] hover:text-[#121212] hover:bg-[#efeeeb]'
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
                    ? 'bg-[#121212] text-[#f8f8f6]'
                    : 'text-[#7b7974] hover:text-[#121212] hover:bg-[#efeeeb]'
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
              className="bg-[#ffffff] rounded-2xl border border-[#e7e6e1] p-5 sm:p-6 shadow-xs flex flex-col gap-3"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#121212] text-[#f8f8f6] font-serif flex items-center justify-center font-bold text-sm shrink-0">
                    {(review.studentDisplayName || 'S').charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-heading text-base font-semibold text-[#121212]">
                        {review.studentDisplayName || 'Enrolled Student'}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#efeeeb] text-[#373734] border border-[#e7e6e1]">
                        Verified Enrolled
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-[#7b7974]">
                      {new Date(review.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>

                <RatingDisplay rating={review.rating} size="sm" showText={false} />
              </div>

              {review.comment && (
                <p className="font-body text-sm text-[#373734] leading-relaxed whitespace-pre-wrap mt-1">
                  {review.comment}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : hasReviews ? (
        <div className="bg-[#ffffff] rounded-2xl border border-[#e7e6e1] p-8 text-center flex flex-col items-center justify-center gap-2 shadow-xs">
          <p className="font-body text-xs text-[#7b7974]">
            No reviews match the selected filter.
          </p>
        </div>
      ) : (
        <div className="bg-[#ffffff] rounded-2xl border border-[#e7e6e1] p-8 sm:p-12 text-center flex flex-col items-center justify-center gap-3 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-[#efeeeb] flex items-center justify-center text-[#7b7974]">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h4 className="font-heading text-base font-semibold text-[#121212]">
            No Student Reviews Yet
          </h4>
          <p className="font-body text-xs text-[#7b7974] max-w-md leading-relaxed">
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
            className="px-4 py-2 rounded-lg border border-[#e7e6e1] text-xs font-medium text-[#121212] disabled:opacity-40 hover:bg-[#efeeeb] transition-colors cursor-pointer"
          >
            Previous
          </button>
          <span className="text-xs font-mono text-[#7b7974]">
            Page {pageData.number + 1} of {pageData.totalPages}
          </span>
          <button 
            disabled={pageData.last} 
            onClick={() => setPage(p => p + 1)}
            className="px-4 py-2 rounded-lg border border-[#e7e6e1] text-xs font-medium text-[#121212] disabled:opacity-40 hover:bg-[#efeeeb] transition-colors cursor-pointer"
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
          <p className="font-body text-sm text-[#373734] leading-relaxed">{existingReview.comment}</p>
        )}
        <div className="flex gap-4 mt-2">
          <button 
            onClick={() => setIsEditing(true)} 
            className="text-xs font-medium text-[#121212] underline hover:text-[#d97757] transition-colors cursor-pointer"
          >
            Edit Review
          </button>
          <button 
            onClick={handleDelete} 
            className="text-xs font-medium text-[#ba1a1a] underline hover:opacity-80 transition-opacity cursor-pointer" 
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
        <label className="block text-xs font-mono uppercase tracking-wider text-[#7b7974] font-medium mb-1.5">
          Rating
        </label>
        <RatingInput value={rating} onChange={setRating} disabled={createRev.isPending || updateRev.isPending} />
      </div>
      <div>
        <label className="block text-xs font-mono uppercase tracking-wider text-[#7b7974] font-medium mb-1.5">
          Review &amp; Feedback (Optional)
        </label>
        <textarea
          rows={3}
          maxLength={1000}
          value={comment}
          onChange={e => setComment(e.target.value)}
          disabled={createRev.isPending || updateRev.isPending}
          className="w-full rounded-xl border border-[#e7e6e1] p-3 text-sm font-body bg-[#f8f8f6]/50 text-[#121212] placeholder:text-[#9c9a92] focus:outline-none focus:ring-1 focus:ring-[#121212] focus:border-[#121212] transition-all"
          placeholder="Share your feedback on the curriculum, lessons, assignments, and learning outcomes..."
        />
      </div>
      <div className="flex items-center gap-3">
        <button 
          type="submit" 
          disabled={createRev.isPending || updateRev.isPending}
          className="px-5 py-2.5 rounded-xl bg-[#121212] hover:bg-[#000000] text-[#f8f8f6] text-xs font-medium transition-colors shadow-xs cursor-pointer disabled:opacity-50"
        >
          {createRev.isPending || updateRev.isPending ? 'Saving...' : existingReview ? 'Update Feedback' : 'Submit Peer Feedback'}
        </button>
        {existingReview && (
          <button 
            type="button" 
            onClick={() => setIsEditing(false)} 
            className="text-xs font-medium text-[#7b7974] hover:text-[#121212] transition-colors cursor-pointer"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
