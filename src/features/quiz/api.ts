import { api } from '../../lib/api';
import type { 
  InstructorQuizResponse, QuizCreateRequest, InstructorQuestionResponse, QuestionCreateRequest,
  StudentQuizResponse, QuizAttemptResponse, QuizSubmitRequest
} from './types';

// Instructor Authoring
export const getInstructorQuiz = (courseId: string, lessonId: string) =>
  api.get<any, InstructorQuizResponse>(`/api/v1/instructors/courses/${courseId}/lessons/${lessonId}/quiz`);

export const createQuiz = (courseId: string, lessonId: string, data: QuizCreateRequest) =>
  api.post<any, InstructorQuizResponse>(`/api/v1/instructors/courses/${courseId}/lessons/${lessonId}/quiz`, data);

export const updateQuiz = (courseId: string, lessonId: string, data: QuizCreateRequest) =>
  api.put<any, InstructorQuizResponse>(`/api/v1/instructors/courses/${courseId}/lessons/${lessonId}/quiz`, data);

export const addQuestion = (courseId: string, lessonId: string, data: QuestionCreateRequest) =>
  api.post<any, InstructorQuestionResponse>(`/api/v1/instructors/courses/${courseId}/lessons/${lessonId}/quiz/questions`, data);

export const updateQuestion = (courseId: string, lessonId: string, questionId: string, data: QuestionCreateRequest) =>
  api.put<any, InstructorQuestionResponse>(`/api/v1/instructors/courses/${courseId}/lessons/${lessonId}/quiz/questions/${questionId}`, data);

export const deleteQuestion = (courseId: string, lessonId: string, questionId: string) =>
  api.delete<any, void>(`/api/v1/instructors/courses/${courseId}/lessons/${lessonId}/quiz/questions/${questionId}`);

// Student Taking
export const getStudentQuizDetails = (courseId: string, quizId: string) =>
  api.get<any, StudentQuizResponse>(`/api/v1/courses/${courseId}/quizzes/${quizId}/details`);

export const startQuizAttempt = (courseId: string, quizId: string) =>
  api.post<any, QuizAttemptResponse>(`/api/v1/courses/${courseId}/quizzes/${quizId}/attempts`);

export const getActiveAttempt = (courseId: string, quizId: string) =>
  api.get<any, QuizAttemptResponse>(`/api/v1/courses/${courseId}/quizzes/${quizId}/attempts/active`);

export const submitQuizAttempt = (courseId: string, quizId: string, attemptId: string, data: QuizSubmitRequest) =>
  api.post<any, QuizAttemptResponse>(`/api/v1/courses/${courseId}/quizzes/${quizId}/attempts/${attemptId}/submit`, data);

export const getAttemptHistory = (courseId: string, quizId: string) =>
  api.get<any, QuizAttemptResponse[]>(`/api/v1/courses/${courseId}/quizzes/${quizId}/attempts`);
