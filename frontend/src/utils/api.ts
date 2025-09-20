import type { Bot, CallLog, BotFormData } from '../types';

const BASE_URL = 'https://6f81ddabab81.ngrok-free.app'

const commonHeaders = {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
}

// Bot API functions
export async function createBot(botData: BotFormData): Promise<Bot> {
  const response = await fetch(`${BASE_URL}/openmic/v1/bots`, {
    method: 'POST',
    headers: commonHeaders,
    body: JSON.stringify(botData),
  });

  if (!response.ok) {
    throw new Error(`Failed to create bot: ${response.statusText}`);
  }

  const result = await response.json();
  return result.data;
}

export async function getBots(): Promise<Bot[]> {
  const response = await fetch(`${BASE_URL}/openmic/v1/bots`, {
    headers: commonHeaders,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch bots: ${response.statusText}`);
  }

  return response.json();
}

export async function updateBot(uid: string, botData: Partial<BotFormData>): Promise<Bot> {
  const response = await fetch(`${BASE_URL}/openmic/v1/bots/${uid}`, {
    method: 'PATCH',
    headers: commonHeaders,
    body: JSON.stringify(botData),
  });

  if (!response.ok) {
    throw new Error(`Failed to update bot: ${response.statusText}`);
  }

  return response.json();
}

export async function deleteBot(uid: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/openmic/v1/bots/${uid}`, {
    method: 'DELETE',
    headers: commonHeaders,
  });

  if (!response.ok) {
    throw new Error(`Failed to delete bot: ${response.statusText}`);
  }
}

// Call Logs API functions
export async function getCallLogs(): Promise<CallLog[]> {
  const response = await fetch(`${BASE_URL}/v1/call-summary`,{
    headers: commonHeaders,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch call logs: ${response.statusText}`);
  }

  return response.json();
}