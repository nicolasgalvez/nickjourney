// Connect to ollama and generate a prompt from the input
import axios from 'axios'
import dotenv from 'dotenv'
// load environment variables from .env file

dotenv.config()

const ollamaServer = process.env.OLLAMA_API_URL || 'localhost:11434'
const model = process.env.OLLAMA_MODEL || 'llama2'

export async function generatePrompt(
    input: string
): Promise<string> {
    try {
        const response = await axios.post(
            `${ollamaServer}/v1/chat/completions`,
            {
                "model": model,
                "messages": [{ "role": "user", "content": `Create a flux prompt from the given text: ${input}` }]
            }
        )
        // return the message content
        console.log('Generated prompt:', response.data.choices[0].message.content)
        return response.data.choices[0].message.content
    } catch (error) {
        console.error('Error generating prompt:', error)
        return input
    }
}
/**
 * response from ollama
 * {"id":"chatcmpl-696","object":"chat.completion","created":1740723390,"model":"poluramus/llama-3.2ft_flux-prompting_v0.5","system_fingerprint":"fp_ollama","choices":[{"index":0,"message":{"role":"assistant","content":"Hello! Is there something I can help you with or would you like to chat?"},"finish_reason":"stop"}],"usage":{"prompt_tokens":12,"completion_tokens":18,"total_tokens":30}}
 */