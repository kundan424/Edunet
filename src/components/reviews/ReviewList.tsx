import { useState } from 'react';
import { useCourseReviews, useCreateReview, useUpdateReview, useDeleteReview } from '../../features/reviews/queries';
import { RatingDisplay, RatingInput } from '../ui/Rating';
import { PillButton } from '../ui/Button';
import { LoadingState, EmptyState } from '../ui/States';
import { useAuth } from '../../auth/AuthProvider';
import type { CourseReviewResponse } from '../../features/reviews/types';

interface ReviewListProps {
  courseId: string;
  isEnrolled: boolean;
}

export function ReviewList({ courseId, isEnrolled }: ReviewListProps) {
  const { user } = useAuth();
  const [page, setPage] = useState(0);
  const { data: pageData, isLoading } = useCourseReviews(courseId, page, 5);

  if (isLoading) return <LoadingState message="Loading reviews..." />;

  const reviews = pageData?.content || [];
  const myReview = reviews.find(r => r.userId === user?.id); // Naive check, ideally backend provides a "my review" endpoint or it's guaranteed to be returned first, but this works for basic pagination if it's on page 0. 

  return (
    <div className="flex flex-col gap-8">
      {isEnrolled && user && (
        <div className="bg-cream-paper border border-midnight-ink p-6">
          <h3 className="font-bold text-xl mb-4">{myReview ? 'Your Review' : 'Write a Review'}</h3>
          <ReviewForm courseId={courseId} existingReview={myReview} />
        </div>
      )}

      <div>
        <h3 className="font-bold text-2xl mb-6 border-b border-midnight-ink pb-4">Student Reviews</h3>
        
        {reviews.length === 0 ? (
          <EmptyState title="No reviews yet" message="Be the first to review this course!" />
        ) : (
          <div className="flex flex-col gap-6">
            {reviews.map(review => (
              <div key={review.id} className="border border-midnight-ink/20 p-6 flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-lg">{review.studentDisplayName}</h4>
                    <span className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                  <RatingDisplay rating={review.rating} size="sm" showText={false} />
                </div>
                {review.comment && <p className="font-usual text-midnight-ink mt-2 whitespace-pre-wrap">{review.comment}</p>}
              </div>
            ))}
          </div>
        )}

        {pageData && pageData.totalPages > 1 && (
          <div className="flex justify-center gap-4 mt-8">
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
    </div>
  );
}

function ReviewForm({ courseId, existingReview }: { courseId: string, existingReview?: CourseReviewResponse }) {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [comment, setComment] = useState(existingReview?.comment || '');
  const [isEditing, setIsEditing] = useState(!existingReview);

  const createRev = useCreateReview(courseId);
  const updateRev = useUpdateReview(courseId);
  const deleteRev = useDeleteReview(courseId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    const payload = { rating, comment };

    if (existingReview) {
      updateRev.mutate({ reviewId: existingReview.id, data: payload }, {
        onSuccess: () => setIsEditing(false)
      });
    } else {
      createRev.mutate(payload, {
        onSuccess: () => setIsEditing(false)
      });
    }
  };

  const handleDelete = () => {
    if (existingReview && window.confirm('Delete your review?')) {
      deleteRev.mutate(existingReview.id, {
        onSuccess: () => {
          setRating(0);
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
        {existingReview.comment && <p className="font-usual text-midnight-ink">{existingReview.comment}</p>}
        <div className="flex gap-4 mt-2">
          <button onClick={() => setIsEditing(true)} className="text-sm font-bold text-signal-blue hover:underline">Edit</button>
          <button onClick={handleDelete} className="text-sm font-bold text-ember-red hover:underline" disabled={deleteRev.isPending}>Delete</button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="block font-bold text-sm mb-2">Rating</label>
        <RatingInput value={rating} onChange={setRating} disabled={createRev.isPending || updateRev.isPending} />
      </div>
      <div>
        <label className="block font-bold text-sm mb-2">Comment (Optional)</label>
        <textarea
          rows={3}
          maxLength={1000}
          value={comment}
          onChange={e => setComment(e.target.value)}
          disabled={createRev.isPending || updateRev.isPending}
          className="w-full border border-midnight-ink p-3 focus:outline-none focus:ring-2 focus:ring-signal-blue"
          placeholder="What did you think of this course?"
        />
      </div>
      <div className="flex gap-4">
        <PillButton type="submit" disabled={createRev.isPending || updateRev.isPending}>
          {createRev.isPending || updateRev.isPending ? 'Saving...' : existingReview ? 'Update Review' : 'Submit Review'}
        </PillButton>
        {existingReview && (
          <button type="button" onClick={() => setIsEditing(false)} className="text-sm font-bold text-gray-500 hover:underline">Cancel</button>
        )}
      </div>
    </form>
  );
}
