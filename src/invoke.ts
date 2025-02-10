import axios from "axios";
// load image api from .env file`
const {IMAGE_API_URL} = process.env

const SD_API_URL = IMAGE_API_URL + "/sdapi/v1/txt2img";

interface GenerateImageOptions {
  prompt: string;
  negative_prompt?: string;
  width?: number;
  height?: number;
  steps?: number;
  cfg_scale?: number;
  seed?: number;
}

interface SDResponse {
  images: string[]; // Base64-encoded images
}

/**
 * Generates an image using the Stable Diffusion API.
 * @param {GenerateImageOptions} options - The parameters for image generation.
 * @returns {Promise<SDResponse>} - A promise resolving to the generated image data.
 */
export async function generateImage(options: GenerateImageOptions): Promise<SDResponse> {
  const {
    prompt,
    negative_prompt = "",
    width = 512,
    height = 512,
    steps = 50,
    cfg_scale = 7,
    seed = -1,
  } = options;

  try {
    const requestData = {
      prompt,
      negative_prompt,
      seed,
      sampler_name: "Euler a",
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
    };

    const response = await axios.post<SDResponse>(SD_API_URL, requestData, {
      headers: { "Content-Type": "application/json" },
    });

    return response.data;
  } catch (error) {
    console.error("Error generating image:", error);
    throw new Error("Image generation failed");
  }
}
