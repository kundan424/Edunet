export type QuestionType = 'MCQ_SINGLE' | 'MULTI_SELECT' | 'TRUE_FALSE';
export type AttemptStatus = 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED';

// Instructor DTOs
export interface OptionCreateRequest {
  optionText: string;
  displayOrder: number;
  isCorrect: boolean;
}

export interface QuestionCreateRequest {
  questionText: string;
  questionType: QuestionType;
  points: number;
  displayOrder: number;
  options?: OptionCreateRequest[];
}

export interface QuizCreateRequest {
  title: string;
  description?: string;
  passScore: number;
  attemptsAllowed: number;
  timeLimitSeconds?: number;
}

export interface InstructorOptionResponse {
  id: string;
  optionText: string;
  displayOrder: number;
  isCorrect: boolean;
}

export interface InstructorQuestionResponse {
  id: string;
  questionText: string;
  questionType: QuestionType;
  points: number;
  displayOrder: number;
  options: InstructorOptionResponse[];
}

export interface InstructorQuizResponse {
  id: string;
  lessonId: string;
  title: string;
  description: string | null;
  passScore: number;
  attemptsAllowed: number;
  timeLimitSeconds: number | null;
  questions: InstructorQuestionResponse[];
  createdAt: string;
  updatedAt: string;
}

// Student DTOs
export interface StudentOptionResponse {
  id: string;
  optionText: string;
  displayOrder: number;
}

export interface StudentQuestionResponse {
  id: string;
  questionText: string;
  questionType: QuestionType;
  points: number;
  displayOrder: number;
  options: StudentOptionResponse[];
}

export interface StudentQuizResponse {
  id: string;
  title: string;
  description: string | null;
  passScore: number;
  attemptsAllowed: number;
  timeLimitSeconds: number | null;
  questions: StudentQuestionResponse[];
}

export interface QuizAttemptResponse {
  id: string;
  quizId: string;
  attemptNumber: number;
  status: AttemptStatus;
  score: number | null;
  percentage: number | null;
  passed: boolean | null;
  startedAt: string;
  completedAt: string | null;
}

export interface AnswerSubmission {
  questionId: string;
  selectedOptionIds: string[];
}

export interface QuizSubmitRequest {
  answers: AnswerSubmission[];
}
