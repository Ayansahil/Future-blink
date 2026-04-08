import Flow from '../models/flow.model.js';

const extractAnswer = (data) => {
  const message = data?.choices?.[0]?.message;

  if (!message) return null;

  if (typeof message.content === 'string' && message.content.trim()) {
    return message.content.trim();
  }

  if (Array.isArray(message.content)) {
    const textParts = message.content
      .map((part) => {
        if (typeof part === 'string') return part;
        if (part?.type === 'text' && part?.text) return part.text;
        return '';
      })
      .filter(Boolean)
      .join('\n')
      .trim();

    if (textParts) return textParts;
  }

  return null;
};

// POST /api/ask-ai
export const askAI = async (req, res) => {
  const { prompt } = req.body;

  if (!prompt?.trim()) {
    return res.status(400).json({ error: 'Prompt required' });
  }

  if (!process.env.GOOGLE_API_KEY) {
    return res.status(500).json({ error: 'GOOGLE_API_KEY is missing on server' });
  }

  try {
    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.GOOGLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gemini-3-flash-preview',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          max_tokens: 1000,
        }),
      }
    );

    const data = await response.json();

    console.log('Google AI status:', response.status);
    console.log('Google AI raw response:', JSON.stringify(data, null, 2));

    if (!response.ok) {
      return res.status(response.status).json({
        error: data?.error?.message || 'Google provider error',
      });
    }

    const answer = extractAnswer(data);

    if (!answer) {
      return res.status(500).json({
        error: 'Model returned empty content',
        raw: data,
      });
    }

    return res.json({ answer });
  } catch (err) {
    console.error('askAI error:', err);
    return res.status(500).json({
      error: err.message || 'Internal server error',
    });
  }
};

// POST /api/save
export const saveFlow = async (req, res) => {
  const { prompt, response } = req.body;

  if (!prompt || !response) {
    return res.status(400).json({
      error: 'Prompt and response are required',
    });
  }

  try {
    const flow = await Flow.create({ prompt, response });

    return res.json({
      success: true,
      flow,
    });
  } catch (err) {
    console.error('saveFlow error:', err);
    return res.status(500).json({
      error: err.message || 'Failed to save flow',
    });
  }
};