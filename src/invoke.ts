import axios from 'axios'
import dotenv from 'dotenv'
import { join } from 'path'

dotenv.config()

const { IMAGE_API_URL, CLOUDFLARE_CLIENT_ID, CLOUDFLARE_CLIENT_SECRET } =
  process.env

if (!IMAGE_API_URL || !CLOUDFLARE_CLIENT_ID || !CLOUDFLARE_CLIENT_SECRET) {
  throw new Error('❌ Missing Cloudflare Service Token credentials in .env')
}

const SD_API_URL = join(IMAGE_API_URL, 'sdapi/v1/txt2img')

interface GenerateImageOptions {
  prompt: string
  negative_prompt?: string
  width?: number
  height?: number
  steps?: number
  cfg_scale?: number
  seed?: number
}

interface SDResponse {
  images: string[] // Base64-encoded images
}

/**
 * Generates an image using the InvokeAI API with Cloudflare Service Authentication.
 * The request includes the Cloudflare Service Token in headers.
 */
export async function generateImage(
  options: GenerateImageOptions
): Promise<SDResponse> {
  const {
    prompt,
    negative_prompt = '',
    width = 512,
    height = 512,
    steps = 50,
    cfg_scale = 7,
    seed = -1,
  } = options

  try {
    const requestData = {
      prompt,
      negative_prompt,
      seed,
      sampler_name: 'Euler a',
      batch_size: 1,
      n_iter: 1,
      steps,
      cfg_scale,
      width,
      height,
      restore_faces: false,
      tiling: false,
      send_images: true,
      save_images: false,
    }

    const response = await axios.post<SDResponse>(SD_API_URL, requestData, {
      headers: {
        'Content-Type': 'application/json',
        'CF-Access-Client-Id': CLOUDFLARE_CLIENT_ID, // ✅ Required for Service Authentication
        'CF-Access-Client-Secret': CLOUDFLARE_CLIENT_SECRET, // ✅ Required for Service Authentication
      },
    })

    return response.data
  } catch (error) {
    console.error('❌ Error generating image:', error)
    throw new Error('Image generation failed')
  }
}
