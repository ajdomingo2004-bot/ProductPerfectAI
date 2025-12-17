export interface MediaData {
  type: 'image' | 'video';
  url: string; // base64 for image, blob url or uri for video
  mimeType: string;
}

export interface ImageData {
  base64: string;
  mimeType: string;
}

export enum AppState {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING',
  EDITING = 'EDITING',
  PROCESSING = 'PROCESSING',
  ERROR = 'ERROR'
}

export type Language = 'en' | 'zh-tw' | 'es' | 'ja' | 'ko' | 'it' | 'ar' | 'hi' | 'tl' | 'de' | 'ru';

export interface ProcessingError {
  message: string;
  code?: string;
}