import { useParams, useNavigate } from 'react-router-dom';
import { SectionHeading, BodyText } from '../../components/ui/Typography';
import { PillButton } from '../../components/ui/Button';
import { XCircle } from 'lucide-react';

export function PaymentCancel() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto p-8 mt-12 border-2 border-midnight-ink bg-cream-paper text-center space-y-6">
      <div className="flex justify-center text-ember-red mb-4">
        <XCircle size={64} />
      </div>
      <SectionHeading>Checkout Cancelled</SectionHeading>
      <BodyText>
        You have cancelled the checkout process. You have not been charged, and no enrollment was created.
      </BodyText>
      <div className="pt-6 flex justify-center">
        <PillButton onClick={() => navigate(`/courses/${courseId}`)}>
          Return to Course
        </PillButton>
      </div>
    </div>
  );
}
