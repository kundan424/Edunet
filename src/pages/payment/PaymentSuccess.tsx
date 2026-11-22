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
      queryClient.invalidateQueries({ queryKey: ['enrollments'] });
      queryClient.invalidateQueries({ queryKey: ['course', courseId] });
    }
  }, [queryClient, courseId]);

  return (
    <div className="max-w-2xl mx-auto p-8 mt-12 border border-rule bg-card rounded-[10px] text-center space-y-6 shadow-none">
      <div className="flex justify-center text-emerald-400 mb-4">
        <CheckCircle size={56} />
      </div>
      <SectionHeading>Payment Verified</SectionHeading>
      <BodyText>
        Thank you for your enrollment. Your checkout has been processed and your microVM sandbox workspace is initializing.
      </BodyText>
      <div className="p-4 bg-wash border border-rule text-xs font-mono text-muted max-w-md mx-auto">
        <p><strong>Status:</strong> Enrollment verified. Course access credentials active across your student workspace.</p>
      </div>
      <div className="pt-6 flex justify-center">
        <PillButton onClick={() => navigate(`/courses/${courseId}`)}>
          Launch Course Workspace
        </PillButton>
      </div>
    </div>
  );
}
