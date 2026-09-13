import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { useAuth } from '../../auth/AuthProvider';
import { DisplayHeading, SectionHeading, BodyText } from '../../components/ui/Typography';
import { PillButton } from '../../components/ui/Button';
import { LoadingState, ErrorState } from '../../components/ui/States';
import { RatingDisplay } from '../../components/ui/Rating';
import { ReviewList } from '../../components/reviews/ReviewList';
import { Curriculum } from '../../components/course/Curriculum';
import type { CourseDetailResponse, Page } from '../../features/courses/types';
import type { EnrollmentResponseDTO } from '../../features/learning/types';

export function CourseDetail() {
  const { courseId } = useParams<{ courseId: string }>();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch Course Detail
  const { data: course, isLoading, error } = useQuery<CourseDetailResponse>({
    queryKey: ['course', courseId],
    queryFn: () => api.get(`/api/v1/courses/${courseId}`),
    enabled: !!courseId
  });

  // Fetch Enrollments (if auth'd)
  const { data: enrollmentsPage } = useQuery<Page<EnrollmentResponseDTO>>({
    queryKey: ['enrollments'],
    queryFn: () => api.get('/api/v1/enrollments'),
    enabled: isAuthenticated
  });

  const isEnrolled = enrollmentsPage?.content?.some(e => e.courseId === courseId);

  // Free Enrollment Mutation
  const enrollMutation = useMutation({
    mutationFn: () => api.post(`/api/v1/courses/${courseId}/enroll`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrollments'] });
      navigate(`/learn/${courseId}`);
    }
  });

  // Paid Checkout Mutation
  const checkoutMutation = useMutation({
    mutationFn: () => api.post<any, { checkoutUrl: string }>(`/api/v1/courses/${courseId}/checkout`),
    onSuccess: (data) => {
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    }
  });

  const handleAction = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (isEnrolled) {
      navigate(`/learn/${courseId}`);
      return;
    }
    
    if (course?.price === 0) {
      enrollMutation.mutate();
    } else {
      checkoutMutation.mutate();
    }
  };

  if (isLoading) return <LoadingState message="Loading course details..." />;
  if (error || !course) return <ErrorState title="Course not found" message="We couldn't load this course." onRetry={() => window.location.reload()} />;

  const isFree = course.price === 0;

  return (
    <div className="flex flex-col gap-12 md:gap-24">
      
      {/* Hero Section */}
      <section className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start border border-midnight-ink bg-cream-paper p-6 sm:p-8 md:p-12">
        <div className="flex flex-col gap-6 flex-grow">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 border border-midnight-ink rounded-full">
              {course.difficulty}
            </span>
            {course.category && (
              <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 border border-midnight-ink rounded-full">
                {course.category}
              </span>
            )}
          </div>
          
          <DisplayHeading className="text-4xl sm:text-5xl md:text-6xl lg:text-[80px] break-words">
            {course.title}
          </DisplayHeading>

          <div className="flex items-center gap-6 mb-8">
            <RatingDisplay rating={course.rating} count={course.studentCount} size="lg" />
          </div>
          
          <BodyText className="text-lg md:text-xl opacity-80" maxWidth={false}>
            {course.description}
          </BodyText>

          <div className="flex flex-wrap items-center gap-6 mt-4 font-bold font-usual border-t border-midnight-ink pt-6">
            <span>By {course.instructorName}</span>
            {course.studentCount !== null && course.studentCount !== undefined && <span>{course.studentCount} enrolled</span>}
          </div>
        </div>

        {/* Enrollment Panel */}
        <div className="flex flex-col gap-6 w-full lg:w-[350px] shrink-0 border-2 border-midnight-ink p-6 md:p-8 bg-saffron-yellow">
          <div className="font-degular-display text-4xl sm:text-5xl font-bold text-center">
            {course.price !== null && course.price !== undefined ? (isFree ? 'Free' : `$${course.price.toFixed(2)}`) : 'Price TBD'}
          </div>
          
          {!isAuthenticated ? (
            <PillButton onClick={() => navigate('/login')} className="w-full justify-center py-4 bg-midnight-ink text-cream-paper hover:bg-signal-blue">
              Login to Enroll
            </PillButton>
          ) : user?.role === 'INSTRUCTOR' || user?.role === 'ADMIN' ? (
            <div className="p-4 bg-white border border-midnight-ink text-center">
              <span className="font-bold text-sm text-midnight-ink">Course purchasing is only available to student accounts.</span>
            </div>
          ) : (
            <>
              <PillButton 
                onClick={handleAction} 
                disabled={enrollMutation.isPending || checkoutMutation.isPending}
                className="w-full justify-center py-4 bg-midnight-ink text-cream-paper hover:bg-signal-blue"
              >
                {isEnrolled ? 'Go to Course' :
                 enrollMutation.isPending || checkoutMutation.isPending ? 'Processing...' :
                 isFree ? 'Enroll Now' : 'Buy Now'}
              </PillButton>
              {enrollMutation.isError && <div className="text-ember-red font-bold text-center text-sm">Failed to enroll. Try again.</div>}
              {checkoutMutation.isError && <div className="text-ember-red font-bold text-center text-sm">Failed to initiate checkout. Try again.</div>}
            </>
          )}
          
          <ul className="flex flex-col gap-3 font-usual text-sm font-bold mt-4">
            <li className="flex items-center gap-2">✓ Full lifetime access</li>
            <li className="flex items-center gap-2">✓ Access on mobile and desktop</li>
            <li className="flex items-center gap-2">✓ Certificate of completion</li>
          </ul>
        </div>
      </section>

      {/* Curriculum Section */}
      <section className="flex flex-col gap-8 max-w-4xl mx-auto w-full">
        <SectionHeading>Course Curriculum</SectionHeading>
        {course.sections && course.sections.length > 0 ? (
          <Curriculum sections={course.sections} />
        ) : (
          <BodyText>Curriculum is currently being developed.</BodyText>
        )}
      </section>

      {/* Instructor Section */}
      <section className="flex flex-col gap-8 max-w-4xl mx-auto w-full border-t border-midnight-ink pt-12">
        <SectionHeading>About the Instructor</SectionHeading>
        <div className="flex flex-col gap-4">
          <h3 className="font-degular-display text-2xl font-bold">{course.instructorName}</h3>
          {course.instructorBio ? (
            <BodyText maxWidth={false}>{course.instructorBio}</BodyText>
          ) : (
            <BodyText>No biography provided.</BodyText>
          )}
        </div>
      </section>
      
      {/* Reviews Section */}
      <section className="flex flex-col gap-8 max-w-4xl mx-auto w-full border-t border-midnight-ink pt-12">
        <ReviewList courseId={course.id} isEnrolled={!!isEnrolled} />
      </section>
      
    </div>
  );
}
