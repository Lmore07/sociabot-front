import { ModuleResponse } from './modules.interface';

export interface FormsRequest {
  name: string;
  questionsAndAnswers: QuestionsAndAnswers[];
  startDate: boolean;
  endDate: Date;
}

export interface QuestionsAndAnswers {
  questions: Object;
  answers: Object;
}

export interface FormsResponse {
  name: string;
  questionsAndAnswers: QuestionsAndAnswers;
  id: string;
  startDate: boolean;
  endDate: Date;
  status: boolean;
  module: ModuleResponse;
}
