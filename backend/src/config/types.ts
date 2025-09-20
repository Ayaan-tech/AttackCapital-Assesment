export type CreateBotRequest = {
  name: string;
  prompt: string;
  first_message?: string;
  knowledge_base_id?: number;
  voice_provider?: string;
  voice?: string;
  voice_model?: string;
  voice_speed?: number;
  llm_model_name?: string;
  llm_model_temperature?: number;
  stt_provider?: string;
  stt_model?: string;
};

export type UpdateBotRequest = Partial<CreateBotRequest>;