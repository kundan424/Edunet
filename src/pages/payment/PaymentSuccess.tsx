import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { SectionHeading, BodyText } from '../../components/ui/Typography';
import { PillButton } from '../../components/ui/Button';
import { CheckCircle } from 'lucide-react';

export function PaymentSuccess() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (courseId) {
      // Invalidate enrollments so they refresh
      queryClient.invalidateQueries({ queryKey: ['enrollments'] });
      queryClient.invalidateQueries({ queryKey: ['course', courseId] });
    }
  }, [queryClient, courseId]);

  return (
    <div className="max-w-2xl mx-auto p-8 mt-12 border-2 border-midnight-ink bg-cream-paper text-center space-y-6">
      <div className="flex justify-center text-signal-blue mb-4">
        <CheckCircle size={64} />
      </div>
      <SectionHeading>Payment Successful</SectionHeading>
      <BodyText>
        Thank you for your purchase! Your checkout has been completed successfully.
      </BodyText>
      <div className="p-4 bg-saffron-yellow/20 border border-midnight-ink text-sm font-usual max-w-md mx-auto">
        <p><strong>Note:</strong> It may take a short moment for your enrollment to become fully active while the server securely verifies your payment.</p>
      </div>
      <div className="pt-6 flex justify-center">
        <PillButton onClick={() => navigate(`/courses/${courseId}`)}>
          Return to Course
        </PillButton>
      </div>
    </div>
  );
}
