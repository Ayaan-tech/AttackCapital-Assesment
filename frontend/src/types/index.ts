export interface Bot {
  uid: string;
  name: string;
  prompt: string;
  first_message?: string;
  voice_provider?: 'Google' | 'ElevenLabs' | 'Azure';
  voice?: string;
  llm_model_name?: 'GPT-3.5-Turbo' | 'GPT-4' | 'Claude-3';
  llm_model_temperature?: number;
}

export interface CallLog {
  sessionId: string;
  timestamp: string;
  status: 'Successful' | 'Failed';
  summary: string;
  transcript: string;
}

export interface BotFormData {
  name: string;
  prompt: string;
  first_message: string;
  voice_provider: string;
  voice: string;
  llm_model_name: string;
  llm_model_temperature: number;
}

export type ThemeMode = 'light' | 'dark';
export type Page = 'bots' | 'logs';