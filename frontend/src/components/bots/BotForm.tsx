import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/TextArea';
import { Select } from '../ui/Select';
import { Slider } from '../ui/Slider';
import type { Bot, BotFormData } from '../../types';

interface BotFormProps {
  editingBot: Bot | null;
  onSubmit: (data: BotFormData, isUpdate: boolean) => void;
  onClear: () => void;
  loading: boolean;
}

const voiceProviderOptions = [
  { value: '', label: 'Select provider...' },
  { value: 'Google', label: 'Google' },
  { value: 'ElevenLabs', label: 'ElevenLabs' },
  { value: 'Azure', label: 'Azure' },
];

const llmModelOptions = [
  { value: '', label: 'Select model...' },
  { value: 'GPT-3.5-Turbo', label: 'GPT-3.5-Turbo' },
  { value: 'GPT-4', label: 'GPT-4' },
  { value: 'Claude-3', label: 'Claude-3' },
];

const initialFormData: BotFormData = {
  name: '',
  prompt: '',
  first_message: '',
  voice_provider: '',
  voice: '',
  llm_model_name: '',
  llm_model_temperature: 0.7,
};

export function BotForm({ editingBot, onSubmit, onClear, loading }: BotFormProps) {
  const [formData, setFormData] = useState<BotFormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<BotFormData>>({});

  useEffect(() => {
    if (editingBot) {
      setFormData({
        name: editingBot.name,
        prompt: editingBot.prompt,
        first_message: editingBot.first_message || '',
        voice_provider: editingBot.voice_provider || '',
        voice: editingBot.voice || '',
        llm_model_name: editingBot.llm_model_name || '',
        llm_model_temperature: editingBot.llm_model_temperature || 0.7,
      });
    } else {
      setFormData(initialFormData);
    }
    setErrors({});
  }, [editingBot]);

  const handleChange = (field: keyof BotFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<BotFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Bot name is required';
    }

    if (!formData.prompt.trim()) {
      newErrors.prompt = 'Prompt is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData, !!editingBot);
    }
  };

  const handleClear = () => {
    setFormData(initialFormData);
    setErrors({});
    onClear();
  };

  const isUpdate = !!editingBot;
  const isFormValid = formData.name.trim() && formData.prompt.trim();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
        {isUpdate ? `Update Bot: ${editingBot.name}` : 'Create New Bot'}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Bot Name"
          placeholder="e.g., Medical Intake Agent"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          error={errors.name}
          required
        />

        <Textarea
          label="System Prompt"
          placeholder="Describe the bot's role, personality, and instructions..."
          value={formData.prompt}
          onChange={(e) => handleChange('prompt', e.target.value)}
          error={errors.prompt}
          rows={8}
          required
        />

        <Textarea
          label="First Message"
          placeholder="e.g., Hi, this is the automated assistant for Healing Hands Medical Center. How can I help you?"
          value={formData.first_message}
          onChange={(e) => handleChange('first_message', e.target.value)}
          rows={3}
        />

        <Select
          label="Voice Provider"
          options={voiceProviderOptions}
          value={formData.voice_provider}
          onChange={(e) => handleChange('voice_provider', e.target.value)}
        />

        <Input
          label="Voice Name"
          placeholder="e.g., en-US-Wavenet-D"
          value={formData.voice}
          onChange={(e) => handleChange('voice', e.target.value)}
        />

        <Select
          label="LLM Model Name"
          options={llmModelOptions}
          value={formData.llm_model_name}
          onChange={(e) => handleChange('llm_model_name', e.target.value)}
        />

        <Slider
          label="LLM Temperature"
          value={formData.llm_model_temperature}
          onChange={(value) => handleChange('llm_model_temperature', value)}
          min={0}
          max={1}
          step={0.1}
        />

        <div className="flex gap-3 pt-4">
          {!isUpdate && (
            <Button
              type="submit"
              disabled={!isFormValid}
              loading={loading}
            >
              Create Bot
            </Button>
          )}
          
          {isUpdate && (
            <Button
              type="submit"
              loading={loading}
            >
              Update Bot
            </Button>
          )}

          <Button
            type="button"
            variant="secondary"
            onClick={handleClear}
            disabled={loading}
          >
            Clear Form
          </Button>
        </div>
      </form>
    </div>
  );
}