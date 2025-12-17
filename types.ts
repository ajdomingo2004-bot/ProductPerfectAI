export interface ImageData {
  base64: string;
  mimeType: string;
  width?: number;
  height?: number;
}

export enum AppState {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING',
  EDITING = 'EDITING',
  PROCESSING = 'PROCESSING',
  ERROR = 'ERROR'
}

export interface ProcessingError {
  message: string;
  code?: string;
}
