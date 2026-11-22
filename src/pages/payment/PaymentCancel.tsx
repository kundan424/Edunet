import { useParams, useNavigate } from 'react-router-dom';
import { SectionHeading, BodyText } from '../../components/ui/Typography';
import { PillButton } from '../../components/ui/Button';
import { XCircle } from 'lucide-react';

export function PaymentCancel() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto p-8 mt-12 border border-rule bg-card rounded-[10px] text-center space-y-6 shadow-none">
      <div className="flex justify-center text-red-500 mb-4">
        <XCircle size={56} />
      </div>
      <SectionHeading>Checkout Cancelled</SectionHeading>
      <BodyText>
        You have cancelled the checkout process. No charges were made, and no enrollment was created.
      </BodyText>
      <div className="pt-6 flex justify-center">
        <PillButton onClick={() => navigate(`/courses/${courseId}`)}>
          Return to Course Details
        </PillButton>
      </div>
    </div>
  );
}
