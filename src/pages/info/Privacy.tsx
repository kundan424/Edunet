import { InfoPageLayout, InfoSection } from '../../components/info/InfoPageLayout';

export function Privacy() {
  return (
    <InfoPageLayout 
      title="Privacy Policy" 
      subtitle="How we collect, use, and protect your data."
    >
      <InfoSection title="Account Information">
        <p>
          When you register, we collect basic information such as your name, email address, and role. This information is used solely to provide and secure your account access.
        </p>
      </InfoSection>

      <InfoSection title="Course & Enrollment Information">
        <p>
          We track your progress, quiz scores, assignment submissions, and overall course enrollments. This data is used to provide you with your learning dashboard and is shared with your course instructors so they can grade your assignments and support your learning.
        </p>
      </InfoSection>

      <InfoSection title="Payment Processing">
        <p>
          We use secure third-party payment processors (Stripe) to handle transactions. We do not store your full credit card numbers or sensitive payment details on our servers.
        </p>
      </InfoSection>

      <InfoSection title="Notifications & Emails">
        <p>
          We use your email to send essential account notifications, receipts, and platform updates. You may adjust your email preferences from your profile settings.
        </p>
      </InfoSection>

      <InfoSection title="Third-Party Services">
        <p>
          We may use trusted third-party services for hosting, analytics, and content delivery (e.g., video hosting). These services only access data necessary to perform their functions and are bound by strict confidentiality agreements.
        </p>
      </InfoSection>
    </InfoPageLayout>
  );
}
