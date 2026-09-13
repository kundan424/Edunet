import { InfoPageLayout, InfoSection } from '../../components/info/InfoPageLayout';

export function About() {
  return (
    <InfoPageLayout 
      title="About Us" 
      subtitle="Focused learning, structured for your success."
    >
      <InfoSection title="Our Mission">
        <p>
          We believe that technical education should be clear, structured, and free from distraction. Our platform is built to provide an editorial learning environment where students can master new skills without compromise.
        </p>
      </InfoSection>

      <InfoSection title="What We Do">
        <p>
          We provide a curated environment for instructors to build high-quality courses, and for students to learn them efficiently. By replacing cluttered dashboards with clean, poster-like layouts, every lesson, quiz, and assignment is crafted to let the content breathe.
        </p>
        <ul className="list-disc pl-6 space-y-2 mt-2">
          <li><strong>Structured curriculum:</strong> Follow clear, step-by-step learning paths.</li>
          <li><strong>Practical skill development:</strong> Learn through quizzes and assignments.</li>
          <li><strong>Focused environment:</strong> No pop-ups, no endless feeds—just learning.</li>
        </ul>
      </InfoSection>

      <InfoSection title="For Students and Instructors">
        <p>
          Whether you are here to learn or to teach, the platform adapts to your needs. Students get a distraction-free experience, while instructors receive robust tools to structure their courses, grade assignments, and verify their expertise.
        </p>
      </InfoSection>
    </InfoPageLayout>
  );
}
