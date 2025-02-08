# Discord-Invoke AI adapter
I set up InvokeAI on my old PC. Right now my girlfriend connects via LAN but she misses the Midjourney Discord bot experience.

The first version will use a single command to generate an image from a prompt.

I will scale it up to include more features like selecting the model, LoRAs, multiple results, etc.

# Usage
`/invoke <prompt>` (or something like that)

# Building/Running

Create a `.env` file with your discord info

Run `npm run start` after cloning. That should get you going.

## Coolify

Add this to the Configuration > General > Start Command field:
`npx tsx src/index.ts`

## Invoke Server
Use a cloudflare tunnel to connect to your home server, it's not a good idea to expose your port or IP to the world.
