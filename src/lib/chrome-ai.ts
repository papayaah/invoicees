// Chrome Built-in AI integration

interface LanguageConfig {
  type: 'text' | 'image';
  languages?: string[];
}

interface SessionOptions {
  systemPrompt?: string;
  temperature?: number;
  topK?: number;
  expectedInputs?: LanguageConfig[];
  expectedOutputs?: LanguageConfig[];
}

interface AILanguageModelSession {
  prompt: (message: string) => Promise<string>;
  promptStreaming?: (message: string) => ReadableStream;
  destroy: () => void;
}

interface LanguageModel {
  availability: (config?: { expectedInputs?: LanguageConfig[]; expectedOutputs?: LanguageConfig[] }) => Promise<'available' | 'after-download' | 'no'>;
  create: (options?: SessionOptions) => Promise<AILanguageModelSession>;
}

declare global {
  interface Window {
    LanguageModel?: LanguageModel;
  }
}

export interface ChatSessionOptions {
  systemPrompt?: string;
  temperature?: number;
  topK?: number;
  enableMultimodal?: boolean;
}

let globalSession: AILanguageModelSession | null = null;

/**
 * Check if Chrome's built-in AI is available
 */
export async function checkAIAvailability(): Promise<boolean> {
  try {
    console.log('🔍 Checking Chrome AI availability...');
    
    // Check if window.LanguageModel exists
    if (typeof window === 'undefined' || !window.LanguageModel) {
      console.error('❌ Chrome AI not detected (window.LanguageModel not found)');
      console.log('Enable these flags:');
      console.log('• chrome://flags/#prompt-api-for-gemini-nano');
      console.log('• chrome://flags/#optimization-guide-on-device-model');
      return false;
    }

    console.log('✅ window.LanguageModel found');

    // Check availability with proper language settings
    console.log('🔍 Checking availability status...');
    const availability = await window.LanguageModel.availability({
      expectedInputs: [
        { type: 'text', languages: ['en'] },
        { type: 'image' }
      ],
      expectedOutputs: [
        { type: 'text', languages: ['en'] }
      ]
    });

    console.log('📊 Availability status:', availability);

    // Handle different availability states
    if (availability === 'no') {
      console.error('❌ Device does not support Gemini Nano');
      return false;
    }
    
    if (availability === 'after-download') {
      console.warn('⏳ Gemini Nano is downloading. Keep Chrome open and try again.');
      return false;
    }

    if (availability === 'available') {
      console.log('✅ Chrome AI is available and ready!');
      return true;
    }

    console.error('❌ Chrome AI not ready. Status:', availability);
    return false;
  } catch (error) {
    console.error('❌ AI availability check failed with error:', error);
    return false;
  }
}

/**
 * Create a new AI chat session
 */
export async function createChatSession(
  options: ChatSessionOptions = {}
): Promise<AILanguageModelSession> {
  console.log('🚀 Creating AI chat session...');
  
  if (!window.LanguageModel) {
    console.error('❌ window.LanguageModel not available');
    throw new Error('Chrome AI is not available');
  }

  const sessionOptions: SessionOptions = {
    expectedInputs: [
      { type: 'text', languages: ['en'] },
      { type: 'image' }
    ],
    expectedOutputs: [
      { type: 'text', languages: ['en'] }
    ]
  };
  
  if (options.systemPrompt) {
    sessionOptions.systemPrompt = options.systemPrompt;
    console.log('📝 Using system prompt (length:', options.systemPrompt.length, ')');
  }

  // Temperature and topK must be set together
  if (options.temperature !== undefined && options.topK !== undefined) {
    sessionOptions.temperature = options.temperature;
    sessionOptions.topK = options.topK;
    console.log('🌡️ Temperature:', options.temperature, 'TopK:', options.topK);
  }

  try {
    console.log('🔧 Creating session with options:', JSON.stringify({
      hasSystemPrompt: !!sessionOptions.systemPrompt,
      hasTemperature: !!sessionOptions.temperature,
      hasTopK: !!sessionOptions.topK,
    }));
    
    const session = await window.LanguageModel.create(sessionOptions);
    globalSession = session;
    
    console.log('✅ AI session created successfully!');
    return session;
  } catch (error) {
    console.error('❌ Failed to create AI session:', error);
    throw new Error('AI model not available — this feature requires active local AI processing.');
  }
}

/**
 * Send a message to the AI session
 */
export async function sendMessage(
  session: AILanguageModelSession,
  message: string
): Promise<string> {
  try {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📤 FULL PROMPT SENT TO AI:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(message);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    const response = await session.prompt(message);
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📥 FULL AI RESPONSE:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(response);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    return response;
  } catch (error) {
    console.error('❌ Failed to send message:', error);
    
    // Check if it's an AbortError
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        console.error('⚠️ Request was cancelled. Try sending a shorter message or recreate the session.');
      }
      throw error;
    }
    
    throw new Error('AI model not available — this feature requires active local AI processing.');
  }
}

/**
 * Destroy the AI session
 */
export function destroySession(session?: AILanguageModelSession): void {
  const sessionToDestroy = session || globalSession;
  if (sessionToDestroy) {
    sessionToDestroy.destroy();
    if (sessionToDestroy === globalSession) {
      globalSession = null;
    }
  }
}

/**
 * Get the global session (if exists)
 */
export function getGlobalSession(): AILanguageModelSession | null {
  return globalSession;
}

