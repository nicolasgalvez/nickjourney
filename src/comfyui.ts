import axios from "axios";
import WebSocket from "ws";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

// define a Workflow type that is any kind of json object
type Workflow = { [key: string]: any };

// ✅ Convert `import.meta.url` to `__dirname`
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// mkdir /tmp/store if not exists
if (!fs.existsSync("/tmp/store")) {
  fs.mkdirSync("/tmp/store");
}

dotenv.config();

const { COMFYUI_SERVER } = process.env;
if (!COMFYUI_SERVER) {
  throw new Error("❌ Missing COMFYUI_SERVER in .env");
}

const WORKFLOW_PATH = path.join(__dirname, "workflows");

interface GenerateImageOptions {
  prompt: string;
  negativePrompt?: string;
  workflowFile?: string;
  loras?: string[];
  interaction?: any;
}

export async function generateImage(options: GenerateImageOptions): Promise<string | null> {
  const clientId = uuidv4();
  const ws = new WebSocket(`ws://${COMFYUI_SERVER}/ws?clientId=${clientId}`);

  return new Promise((resolve, reject) => {
    ws.on("open", async () => {
      try {
        console.log("✅ WebSocket connected to ComfyUI");

        // Load and update the workflow JSON
        const workflow = loadWorkflow(path.join(WORKFLOW_PATH, options.workflowFile)) as Workflow;

        const aspectRatio = options.interaction.options.getString("aspect");
        // update aspect ratio
        if (aspectRatio) {
          updateAspectRatio(workflow, aspectRatio);
        }

        updateWorkflow(workflow, options.prompt);
        console.log(`using workflow ${options.workflowFile}`);
        // save modified workflow for debugging to ./history, create if not exists and append timestamp
        if (!fs.existsSync("./history")) {
          fs.mkdirSync("./history");
        }
        fs.writeFileSync(`./history/${Date.now()}${options.workflowFile}.json`, JSON.stringify(workflow, null, 2));

        // Send the workflow request
        const promptResponse = await queuePrompt(workflow, clientId);
        const promptId = promptResponse?.prompt_id;

        if (!promptId) {
          throw new Error("❌ Failed to get a valid prompt ID from ComfyUI.");
        }

        console.log(`🔄 Tracking progress for prompt ID: ${promptId}`);

        // Track generation progress
        trackProgress(ws, promptId)
          .then(async () => {
            console.log("✅ Generation completed. Fetching image...");
            const imageUrl = await fetchGeneratedImage(promptId);
            resolve(imageUrl);
          })
          .catch((err) => reject(err));
      } catch (error) {
        console.error("❌ Error in WebSocket:", error);
        reject(error);
      }
    });

    ws.on("error", (err) => {
      console.error("❌ WebSocket error:", err);
      reject(err);
    });

    ws.on("close", () => {
      console.log("🔌 WebSocket closed.");
    });
  });
}

function loadWorkflow(workflowPath: string): any {
  return JSON.parse(fs.readFileSync(workflowPath, "utf-8"));
}

function updateAspectRatio(workflow: Workflow, aspectRatio: 'portrait' | 'landscape' | 'tall' | 'wide'): void {
  const idToClassType = Object.fromEntries(
    Object.entries(workflow).map(([id, details]: [string, any]) => [id, details.class_type])
  );
  // we need to update 2 nodes EmptySD3LatentImage, and ModelSamplingFlux
  const emptySD3LatentImage = Object.keys(idToClassType).find((key) => idToClassType[key] === "EmptySD3LatentImage");
  const modelSamplingFlux = Object.keys(idToClassType).find((key) => idToClassType[key] === "ModelSamplingFlux");
  // options are portrait and landscape
  if (aspectRatio === "portrait") {
    workflow[emptySD3LatentImage]["inputs"]["height"] = workflow[emptySD3LatentImage]["inputs"]["height"] * 1.5;
    workflow[modelSamplingFlux]["inputs"]["height"] = workflow[modelSamplingFlux]["inputs"]["height"] * 1.5;
  }
  if (aspectRatio === "landscape") {
    workflow[emptySD3LatentImage]["inputs"]["width"] = workflow[emptySD3LatentImage]["inputs"]["width"] * 1.5;
    workflow[modelSamplingFlux]["inputs"]["width"] = workflow[modelSamplingFlux]["inputs"]["width"] * 1.5;
  }
  if (aspectRatio === "tall") {
    workflow[emptySD3LatentImage]["inputs"]["height"] = workflow[emptySD3LatentImage]["inputs"]["height"] * 2;
    workflow[modelSamplingFlux]["inputs"]["height"] = workflow[modelSamplingFlux]["inputs"]["height"] * 2;
  }
  if (aspectRatio === "wide") {
    workflow[emptySD3LatentImage]["inputs"]["width"] = workflow[emptySD3LatentImage]["inputs"]["width"] * 2;
    workflow[modelSamplingFlux]["inputs"]["width"] = workflow[modelSamplingFlux]["inputs"]["width"] * 2;
  }
  console.log(workflow[emptySD3LatentImage]["inputs"]["width"], workflow[emptySD3LatentImage]["inputs"]["height"]);
  console.log(workflow[modelSamplingFlux]["inputs"]["width"], workflow[modelSamplingFlux]["inputs"]["height"]);

}

function updateWorkflow(workflow: Workflow, positivePrompt: string): void {
  const idToClassType = Object.fromEntries(
    Object.entries(workflow).map(([id, details]: [string, any]) => [id, details.class_type])
  );

  const kSampler = Object.keys(idToClassType).find((key) => idToClassType[key] === "KSampler");
  const LoraTagLoader = Object.keys(idToClassType).find((key) => idToClassType[key] === "LoraTagLoader");

  if (LoraTagLoader) {
    workflow[LoraTagLoader]["inputs"]["text"] = positivePrompt;
  } else if (kSampler) {
    workflow[kSampler]["inputs"]["seed"] = Math.floor(Math.random() * 10 ** 15);
    const textPrompt = workflow[kSampler]["inputs"]["positive"][0];
    workflow[textPrompt]["inputs"]["text"] = positivePrompt;
  } else {
    throw new Error("❌ No KSampler or LoraTagLoader node found in the workflow.");
  }
}


async function queuePrompt(workflow: any, clientId: string): Promise<any> {
  const response = await axios.post(`http://${COMFYUI_SERVER}/prompt`, {
    prompt: workflow,
    client_id: clientId,
  });

  return response.data;
}

function trackProgress(ws: WebSocket, promptId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    ws.on("message", (data) => {
      try {
        const message = JSON.parse(data.toString());

        if (message.type === "progress") {
          console.log(`📈 Progress: ${message.data.value}/${message.data.max}`);
        } else if (message.type === "executing") {
          console.log(`🛠️ Executing node: ${message.data.node}`);
        } else if (message.type === "execution_cached") {
          console.log(`📦 Cached execution: ${message.data}`);
        }

        if (message.type === "executed" && message.data.prompt_id === promptId) {
          console.log("✅ Image generation completed.");
          resolve();
        }
      } catch (error) {
        console.error("❌ Error processing WebSocket message:", error);
        reject(error);
      }
    });
  });
}

async function fetchGeneratedImage(promptId: string): Promise<string> {
  const historyResponse = await axios.get(`http://${COMFYUI_SERVER}/history/${promptId}`);
  const history = historyResponse.data;
  const outputs = history[promptId]?.outputs;

  if (!outputs) throw new Error("❌ No outputs found for the given prompt ID.");

  for (const nodeId in outputs) {
    const nodeOutput = outputs[nodeId];
    if (nodeOutput.images?.length) {
      const imageDetails = nodeOutput.images[0];
      const imageResponse = await axios.get(`http://${COMFYUI_SERVER}/view`, {
        params: {
          filename: imageDetails.filename,
          subfolder: imageDetails.subfolder,
          type: imageDetails.type,
        },
        responseType: "arraybuffer",
      });
      // save image
      const filePath = path.join("/tmp/store", `generated_${Date.now()}.png`);
      fs.writeFileSync(filePath, Buffer.from(imageResponse.data));
      // create a new object to store the image response data along with the image ID
      const result = {
        data: imageResponse.data,
        imageId: promptId,
      };
      return result;
    }
  }

  throw new Error("❌ No image found in the outputs.");
}
