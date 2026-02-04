import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterModule } from '@angular/router';
import { ChatbotService } from '../services/chatbot.service';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, RouterLink],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent {

  isOpen = false;
  userMessage = '';
  loading = false;

  sessionId = crypto.randomUUID();

  messages: {
    from: 'user' | 'bot';
    text?: string;
    textLines?: string[];
    suggests?: string[];
    products?: {
      id: number;
      name: string;
      price: string;
    }[];
    time: string;
  }[] = [];

  constructor(private chatbotService: ChatbotService) {}

  toggleChat() {
    this.isOpen = !this.isOpen;

    if (this.isOpen && this.messages.length === 0) {
      this.addBotMessage('Xin chào! Tôi có thể tư vấn điện thoại và phụ kiện cho bạn.');
    }
  }
  
sendSuggestion(text: string) {
  if (this.loading) return;

  // hiển thị như user vừa chat
  this.messages.push({
    from: 'user',
    textLines: [text],
    time: this.now()
  });

  this.loading = true;

  this.chatbotService.chat(this.sessionId, text).subscribe({
    next: (res) => {
      this.addBotMessage(res);
      this.loading = false;
      this.scrollToBottom();
    },
    error: () => {
      this.addBotMessage('Có lỗi xảy ra, vui lòng thử lại.');
      this.loading = false;
    }
  });
}



  send() {
    const msg = this.userMessage.trim();
    if (!msg || this.loading) return;

    this.messages.push({
      from: 'user',
      textLines: [msg],
      time: this.now()
    });

    this.userMessage = '';
    this.loading = true;

    this.chatbotService.chat(this.sessionId, msg).subscribe({
      next: (res) => {
        this.addBotMessage(res);
        this.loading = false;
        this.scrollToBottom();
      },
      error: () => {
        this.addBotMessage('Có lỗi xảy ra, vui lòng thử lại.');
        this.loading = false;
      }
    });
  }

private addBotMessage(text: string) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

  const products: any[] = [];
  const textLines: string[] = [];
  const suggests: string[] = [];

  for (const line of lines) {

    if (line.includes('| ID=')) {
      const [left, right] = line.split('| ID=');
      const id = Number(right.trim());
      const [name, price] = left.split(' - ');

      products.push({
        id,
        name: name.trim(),
        price: price.trim()
      });
    }

    else if (line.startsWith('[SUGGEST]')) {
      const value = line
        .replace('[SUGGEST]', '')
        .replace('[/SUGGEST]', '')
        .trim();
      suggests.push(value);
    }

    else {
      textLines.push(line);
    }
  }

  this.messages.push({
    from: 'bot',
    textLines,
    suggests: suggests.length ? suggests : undefined,
    products: products.length ? products : undefined,
    time: this.now()
  });
}



  private now() {
    return new Date().toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  private scrollToBottom() {
    setTimeout(() => {
      const box = document.querySelector('.messages');
      if (box) box.scrollTop = box.scrollHeight;
    }, 50);
  }

  trackByIndex(i: number) {
    return i;
  }
}
