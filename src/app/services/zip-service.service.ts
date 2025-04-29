import { Injectable, signal } from '@angular/core';
import JSZip from 'JSZip'
import { ActiveChannel, ArchiveInfo, FileInfo, LogData, Message } from '../interfaces';
import { timestamp } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ZipServiceService {

  zip: JSZip | undefined;
  zipFiles = new Map();
  archiveInfo = signal<ArchiveInfo | undefined>(undefined);
  archiveStartDate = signal<Date | undefined>(undefined);
  archiveEndDate = signal<Date | undefined>(undefined);
  activeChannel = signal<ActiveChannel | undefined>(undefined);
  zipName = signal<string | undefined>(undefined);



  constructor() { }


  async loadZip(zipFile: File) {
      // Load the zip
      this.zip = await JSZip.loadAsync(zipFile);
      this.zipName.set(zipFile.name);

      // Get the archive info
      const archiveInfoFile = this.zip.file('archive-info.json');
      this.archiveInfo.set(JSON.parse(await archiveInfoFile?.async('string') || "") as ArchiveInfo);

      // Get the start and end dates 
      const {startDate, endDate} = this.getArchiveRange(this.archiveInfo()?.contents);
      this.archiveStartDate.set(startDate);
      this.archiveEndDate.set(endDate);
    

      // Get the info for the first channel
      // This will be the active channel when the log first loads
      this.activeChannel.set(await this.getChannelData(this.archiveInfo()?.channels[0].channelName))

  }


  async setChannel(channelName: string): Promise<void> {
    this.activeChannel.set(await this.getChannelData(channelName));
  }

  getReply(timeStamp: string): Message | undefined {
    return this.activeChannel()?.messages.replies?.find(message => message.timeStamp == timeStamp)
  }

  getArchiveRange(contents: LogData[] | undefined) {
    let startDate;
    let endDate;

    if (!contents) {
      return {startDate: undefined, endDate: undefined}
    }
    
    for (let archiveInfo of contents) {
        let archiveStartDate = new Date(archiveInfo.startDate)
        let archiveEndDate = new Date(archiveInfo.endDate)

        if (!startDate || archiveStartDate < startDate) {
            startDate = archiveStartDate;
        }

        if (!endDate || archiveEndDate > endDate) {
            endDate = archiveEndDate;
        }
    }

    return {
        startDate,
        endDate
    } 
}


  async getChannelData(channelName: string | undefined): Promise<ActiveChannel | undefined> {

    if (!channelName) {
      return undefined;
    }

    // Load the messages log
    const logFile = this.zip?.file(`logs/${channelName}-messages.json`);
    const messages = JSON.parse(await logFile?.async('string') || "") as {messages: Message[], replies: Message[]};

    const files = new Map();

    // Load all the file names from the messages in the log
    const logFiles = ([...messages.messages, ...messages.replies]).reduce((acc: FileInfo[], cur: Message) => [...acc, ...cur?.files || []], [])

    const filePromises = logFiles.map(async (file) =>  {
      // Load the file 
      const zipFile = this.zip?.file(`files/${file.fileName}`)

      if (zipFile) {
        const blob = await zipFile.async("blob")
        const urlCreator = window.URL || window.webkitURL;
        const imageUrl = urlCreator.createObjectURL( blob );

        return {
          fileName: file.fileName, 
          blob: blob,
          url: imageUrl
        }
      }

      return undefined;
    })

    // Wait for the promises to resolve
    const loadedFiles = await Promise.all(filePromises);

    // Add the files to zipFiles set
    for (let file of loadedFiles) {
      if (file) {
        files.set(file.fileName, {
          blob: file.blob,
          url: file.url
        }) 
      }
    }

    return {
      channelName: channelName,
      messages: messages,
      files: files
    }
    
  }


}
