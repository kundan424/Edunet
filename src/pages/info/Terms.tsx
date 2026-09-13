import { InfoPageLayout, InfoSection } from '../../components/info/InfoPageLayout';

export function Terms() {
  return (
    <InfoPageLayout 
      title="Terms of Service" 
      subtitle="The rules governing the use of our platform."
    >
      <InfoSection title="1. Acceptance of Terms">
        <p>
          By creating an account or accessing the platform, you agree to be bound by these Terms of Service. If you do not agree to all the terms and conditions, you may not access the platform.
        </p>
      </InfoSection>

      <InfoSection title="2. Account Responsibilities">
        <p>
          You are responsible for maintaining the security of your account and password. You are fully responsible for all activities that occur under the account and any other actions taken in connection with it.
        </p>
      </InfoSection>

      <InfoSection title="3. Content and Conduct">
        <p>
          Instructors are responsible for the quality, accuracy, and legality of the courses they publish. Students agree to interact respectfully in assignments, quizzes, and reviews. We reserve the right to moderate, reject, or remove any content or user that violates these standards.
        </p>
      </InfoSection>

      <InfoSection title="4. Payments and Refunds">
        <p>
          Course enrollments are processed via standard payment gateways (e.g., Stripe). Access to purchased courses is granted immediately upon successful payment. Refund policies depend on individual course settings and platform guarantees.
        </p>
      </InfoSection>

      <InfoSection title="5. Platform Rights">
        <p>
          We reserve the right to modify or terminate the platform or any part of it for any reason, without notice, at any time.
        </p>
      </InfoSection>
    </InfoPageLayout>
  );
}
