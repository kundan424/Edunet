import { InfoPageLayout, InfoSection } from '../../components/info/InfoPageLayout';

export function Contact() {
  return (
    <InfoPageLayout 
      title="Contact" 
      subtitle="Get in touch with our support team."
    >
      <InfoSection title="Support">
        <p>
          If you are experiencing technical issues, have questions about your account, or need assistance with a course, please review our documentation or reach out to us directly.
        </p>
        <div className="bg-cream-paper p-6 rounded-xl border border-midnight-ink/10 mt-4">
          <p className="font-bold text-midnight-ink">Email Support:</p>
          <p className="text-signal-blue mt-1">support@edtech-platform.example.com</p>
          <p className="text-sm mt-4 italic">
            Note: We currently respond to all inquiries within 2-3 business days.
          </p>
        </div>
      </InfoSection>

      <InfoSection title="Instructor Inquiries">
        <p>
          Are you interested in teaching on our platform? You can begin the process immediately by registering an account and submitting a verification request from your Instructor Dashboard.
        </p>
      </InfoSection>
    </InfoPageLayout>
  );
}
