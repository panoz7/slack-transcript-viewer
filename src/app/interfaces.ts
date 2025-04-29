export interface Message {
    date: string,
    timeStamp: string,
    userId: string,
    displayName: string,
    text: string, 
    replies?: string,
    files?: FileInfo[] | []
}

export interface FileInfo {
    fileName: string,
    fileType: string
}

export interface LogData {
    startDate: string, 
    endDate: string,
    generationDate: string,
    skipFIles: string
}

export interface ChannelData {
    channelName: string,
    file: string,
}

export interface UserData {
    [key: string]: string;
}

export interface ArchiveInfo {
    contents: LogData[],
    channels: ChannelData[],
    users: UserData
}

export interface ActiveChannel {
    channelName: string,
    messages: {
        messages: Message[] | undefined,
        replies: Message[] | undefined
    }
    files: Map<string, {
        fileName: string,
        blob: Blob,
        url: string
    }>
}

export interface ZipFile {}