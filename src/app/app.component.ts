import { Component, effect } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ZipServiceService } from './services/zip-service.service';
import { MessageComponent } from './message/message.component';
import { CommonModule, DatePipe, TitleCasePipe} from '@angular/common';
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-root',
  imports: [CommonModule, MessageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [TitleCasePipe, DatePipe],
})
export class AppComponent {
  title = 'slack-transcript-viewer';
  transcript: any;

  constructor(
    public zs: ZipServiceService,
    private ts: Title, 
    private titleCasePipe: TitleCasePipe, 
    private datePipe: DatePipe
  ){

    effect(() => {
      if (this.zs.activeChannel()) {
        const title = `${this.zs.activeChannel()?.channelName}-${this.formatDateForFileName(this.zs.archiveStartDate())}-${this.formatDateForFileName(this.zs.archiveEndDate())}`
        this.ts.setTitle(title);
      }

    })


  }

  async handleZipUpload(e: Event) {
    const element = e.target as HTMLInputElement;
    const files = element.files;

    if (files) {
      this.transcript = await this.zs.loadZip(files[0])
      
    }
  }

  async changeChannel(e: any) {
    const channel = e.target.value;

    // Update the log using the service
    await this.zs.setChannel(channel);

  }

  formatDateForFileName(date: Date | undefined): string {
    if (!date) {
      return ""
    }

    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}${month}${day}`;
}

}
