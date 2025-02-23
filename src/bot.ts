import { CommandInteractionOptionResolver, Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, AttachmentBuilder, Interaction } from 'discord.js';
import dotenv from 'dotenv';
import { generateImage } from "./comfyui";
import fs from 'fs';
import { loRAsCommand, availableLoRAs } from './commands/loras';

dotenv.config();
const allowedGuilds = process.env.ALLOWED_GUILDS?.split(",") || [];

const client = new Client({ intents: [GatewayIntentBits.Guilds] });


const commands = [
  new SlashCommandBuilder()
    .setName('scribble')
    .setDescription('Generates an AI image based on your prompt')
    .setNSFW(true)
    .addStringOption(option =>
      option.setName('prompt')
        .setDescription('Describe what you want the image to be')
        .setRequired(true),
    )
    .addStringOption(option =>
      option
        .setName('scifi')
        .setDescription('Choose a scifi LoRA')
        .setRequired(false)
        .addChoices(
          // map only scifi loras
          ...availableLoRAs.filter(lora => lora.category === 'scifi').map(lora => ({
            name: lora.name,
            value: lora.name
          }))
        )
    ),
  new SlashCommandBuilder()
    .setName('loras')
    .setDescription('List LoRAs available')
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN);

// Clear bot
for (const guildId of allowedGuilds) {
  (async () => {
    try {
      console.log('Removing all guild slash commands...');
      await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, guildId), { body: [] });
      console.log('Successfully removed all commands.');
    } catch (error) {
      console.error(error);
    }
  })();
}




(async () => {
  try {
    console.log("Started refreshing application (/) commands.");

    // Parse allowed guilds from .env

    for (const guildId of allowedGuilds) {
      try {
        await rest.put(
          Routes.applicationGuildCommands(process.env.CLIENT_ID, guildId.trim()), // Trim to avoid spaces
          { body: commands }
        );
        console.log(`Successfully reloaded commands for guild: ${guildId}`);
      }
      catch (error) {
        console.error(`Failed to register commands for guild ${guildId}:`, error);
      }
    }

    console.log("Successfully reloaded application (/) commands for all allowed guilds.");
  } catch (error) {
    console.error(error);
  }
})();

client.on('ready', () => {
  console.log(`Logged in as ${client.user?.tag}!`);
});

client.on('interactionCreate', async (interaction: Interaction) => {
  if (!interaction.isCommand()) {
    // print default message
    console.log(`Received interaction: ${interaction}`);
    return;
  }
  if (!allowedGuilds.includes(interaction.guildId!)) {
    await interaction.reply({ content: "This bot is not authorized for this server.", ephemeral: true });
    return;
  }

  const { commandName } = interaction;
  await interaction.deferReply(); // Let Discord know the bot is processing

  if (commandName === 'loras') {
    await loRAsCommand(interaction);
    return;
  }

  if (commandName === 'scribble') {
    // if prompt has a lora choice, then add it to the prompt
    let prompt = (interaction.options as CommandInteractionOptionResolver).getString('prompt');
    const lora = (interaction.options as CommandInteractionOptionResolver).getString('scifi');
    if (lora) {
      prompt = `<lora:${lora}:0.7>` + prompt;
    }

    // get workflow from prompt... if it starts with "<space>" then use the space.json workflow
    // if it starts with "<lora>" then use the lora.json workflow
    // if it starts with "<negative>" then use the negative.json workflow
    let workflowFile = 'workflow_api_2.json';
    if (prompt.startsWith("<space>")) {
      workflowFile = 'space.json';
    } else if (prompt.startsWith("<horror>")) {
      workflowFile = 'horror.json';
    } else if (prompt.startsWith("<trek>")) {
      workflowFile = 'trek.json';
    }
    try {
      console.log(`Generating image for prompt: ${prompt}`);
      // Generate the image from the provided prompt
      const response = await generateImage({
        prompt: prompt,
        negativePrompt: process.env.NEGATIVE_PROMPT ? process.env.NEGATIVE_PROMPT : "",
        // if prompt starts with "<space>" then use the space.json workflow
        workflowFile: workflowFile
      });
      console.log(response)
      // Convert base64 to Buffer
      const base64Image = response.data;
      const imageBuffer = Buffer.from(base64Image, 'base64');

      // Save image temporarily
      const filePath = `./scribble.png`;
      fs.writeFileSync(filePath, imageBuffer);

      // Create Discord attachment
      const attachment = new AttachmentBuilder(filePath);

      // Reply with the image
      await interaction.editReply({
        content: `${prompt}`,
        files: [attachment]
      });

      // Delete the file after sending (optional)
      fs.unlinkSync(filePath);
    } catch (error) {
      console.error('Error generating image:', error);
      await interaction.editReply("Sorry had a bit of a problem.");
    }
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
