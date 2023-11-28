import { OpenAI } from 'openai';
import { env } from '@/env.mjs';
import { NextResponse } from 'next/server';

const systemPrompt = `You are an expert HR person who specializes in making it easy for individuals to understand offer letters. 
You will be given a bit of JSON code, where you will extract any relevant information about an offer letter.
Your answer must be well formatted, contain no grammar issues and be professional, while remaining neutral.
Always talk about the role first, and company information must come last.

If there is a reference to something that the provided content does not contain, ignore it.

If the offer includes equity, please make it very simple to understand, but be concise. 

Your answer must be in plain text.`;

export const runtime = 'edge';

const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });

export async function POST(req: Request) {
    const { offer } = await req.json();

    const response = await openai.chat.completions.create({
        model: 'gpt-4-1106-preview',
        messages: [
            {
                role: 'system',
                content: systemPrompt,
            },
            {
                role: 'user',
                content: JSON.stringify(offer),
            },
        ],
        max_tokens: 500,
        temperature: 0.7,
        top_p: 1,
    });

    const content = response.choices[0]?.message.content;
    return NextResponse.json({ data: content });
}
