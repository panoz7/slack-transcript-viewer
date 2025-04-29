import { Component, input } from '@angular/core';
import { ActiveChannel, LogData, Message, ZipFile } from '../interfaces';
import { CommonModule, DatePipe, JsonPipe, UpperCasePipe } from '@angular/common';
import { ZipServiceService } from '../services/zip-service.service';


@Component({
  selector: 'app-message',
  imports: [DatePipe, UpperCasePipe],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss'
})
export class MessageComponent {

  constructor(public zs: ZipServiceService){}

  message = input<Message>();
  files = input<ActiveChannel["files"]>();


}
