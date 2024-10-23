import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { MessageServiceEnum } from './message-service-enum';

interface Toast {
  summary: string;
  detail: string;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private messageService: MessageService) { }

  public success({ summary, detail }: Toast): void {
    this.messageService.add({ severity: MessageServiceEnum.SUCCESS, summary, detail});
  }

  public warn({ summary, detail }: Toast): void {
    this.messageService.add({ severity: MessageServiceEnum.WARN, summary, detail});
  }

  public info({ summary, detail }: Toast): void {
    this.messageService.add({ severity: MessageServiceEnum.INFO, summary, detail});
  }

  public error({ summary, detail }: Toast): void {
    this.messageService.add({ severity: MessageServiceEnum.ERROR, summary, detail});
  }
}
