import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';

export type Quiz = {
  _id: string;
  title: string;
  description: string;
  duration: number;
  questions?: { questionText:string; options:string[]; correctOption:number }[];
};

@Injectable({ providedIn:'root' })
export class ApiService {
  private base = '/api';
  quizzes = signal<Quiz[]>([]);

  constructor(private http: HttpClient, private auth: AuthService){}

  private headers(){
    const token = this.auth.token();
    return token ? { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) } : {};
  }

  listQuizzes(){ 
    return this.http.get<Quiz[]>(`${this.base}/quizzes`, this.headers()).subscribe(q=>this.quizzes.set(q)); 
  }

  getQuiz(id:string){ return this.http.get<Quiz>(`${this.base}/quizzes/${id}`, this.headers()); }

  createQuiz(q:Partial<Quiz>){
    return this.http.post<Quiz>(`${this.base}/quizzes`, q, this.headers());
  }

  updateQuiz(id:string, q:Partial<Quiz>){
    return this.http.put<Quiz>(`${this.base}/quizzes/${id}`, q, this.headers());
  }

  deleteQuiz(id:string){
    return this.http.delete(`${this.base}/quizzes/${id}`, this.headers());
  }

  submitQuiz(id:string, answers:{questionIndex:number; selectedOption:number}[]){
    return this.http.post<{score:number; total:number; responseId:string}>(`${this.base}/quizzes/${id}/submit`, { answers }, this.headers());
  }

  myResults(){ return this.http.get<any[]>(`${this.base}/my/results`, this.headers()); }
  allResults(){ return this.http.get<any[]>(`${this.base}/results`, this.headers()); }
}
