import { InfoPageLayout, InfoSection } from '../../components/info/InfoPageLayout';

export function Contact() {
  return (
    <InfoPageLayout 
      title="Contact & Support" 
      subtitle="Get in touch with our engineering and student support team."
    >
      <InfoSection title="Support Inquiries">
        <p>
          If you are experiencing technical issues, have questions regarding your account or course enrollment, or need assistance with a sandbox microVM, please reach out to us directly.
        </p>
        <div className="bg-wash p-6 rounded-[2px] border border-rule mt-4 font-mono text-xs">
          <p className="font-medium text-foreground">Email Support Dispatch:</p>
          <p className="text-ember mt-1">support@edunet.sh</p>
          <p className="text-[11px] text-muted mt-4">
            Response SLA: All technical inquiries are acknowledged within 4–12 hours.
          </p>
        </div>
      </InfoSection>

      <InfoSection title="Instructor Inquiries">
        <p>
          Are you interested in teaching or creating courses on Edunet? You can begin immediately by creating an account and submitting a verification request from your Instructor Dashboard.
        </p>
      </InfoSection>
    </InfoPageLayout>
  );
}
