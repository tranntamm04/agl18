import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {

  private API_URL = 'http://localhost:8080/api/chatbot/chat';

  constructor(private http: HttpClient) {}

  chat(sessionId: string, question: string): Observable<string> {
    return this.http.post(
      this.API_URL,
      {
        sessionId: sessionId,
        question: question
      },
      { responseType: 'text' }
    );
  }
}
