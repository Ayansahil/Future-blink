import Flow from '../models/flow.model.js';

// POST /api/ask-ai
export const askAI = async (req, res) => {
  const { prompt } = req.body;
  if (!prompt?.trim()) return res.status(400).json({ error: 'Prompt required' });

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:5173',
        'X-Title': 'AIFlow',
      },
      body: JSON.stringify({
        model: 'google/gemma-3-12b-it:free',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1000,
      }),


    });

    const data = await response.json();
    console.log('OpenRouter response:', JSON.stringify(data, null, 2));

    if (data.error) throw new Error(data.error.message || 'OpenRouter error');

    const answer = data.choices?.[0]?.message?.content || 'No response';
    res.json({ answer });

  } catch (err) {
    console.error('askAI error:', err.message);
    res.status(500).json({ error: err.message });
  }
};


// POST /api/save
export const saveFlow = async (req, res) => {
  const { prompt, response } = req.body;

  if (!prompt || !response) {
    return res.status(400).json({ error: 'Prompt and response are required' });
  }

  try {
    const flow = await Flow.create({ prompt, response });
    res.json({ success: true, flow });
  } catch (err) {
    console.error('saveFlow error:', err.message);
    res.status(500).json({ error: err.message });
  }
};