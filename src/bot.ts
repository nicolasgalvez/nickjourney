import { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, AttachmentBuilder, CommandInteraction } from 'discord.js';
import dotenv from 'dotenv';
import { generateImage } from './invoke';
import fs from 'fs';

dotenv.config();


const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const commands = [
  new SlashCommandBuilder()
    .setName('scribble')
    .setDescription('Generates an AI image based on your prompt')
    .addStringOption(option =>
      option.setName('prompt')
        .setDescription('Describe what you want the image to be')
        .setRequired(true)
    )
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: commands }
    );
    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();

client.on('ready', () => {
  console.log(`Logged in as ${client.user?.tag}!`);
});

client.on('interactionCreate', async (interaction: CommandInteraction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (commandName === 'scribble') {
    await interaction.deferReply(); // Let Discord know the bot is processing

    const prompt = interaction.options.getString('prompt') || "a cool futuristic robot with glowing eyes, highly detailed, cinematic lighting";

    try {
      console.log(`Generating image for prompt: ${prompt}`);
      // Generate the image from the provided prompt
      const response = await generateImage({ prompt,negative_prompt: process.env.NEGATIVE_PROMPT ? process.env.NEGATIVE_PROMPT : "" });

      // Convert base64 to Buffer
      const base64Image = response.images[0];
      const imageBuffer = Buffer.from(base64Image, 'base64');

      // Save image temporarily
      const filePath = `./scribble.png`;
      fs.writeFileSync(filePath, imageBuffer);

      // Create Discord attachment
      const attachment = new AttachmentBuilder(filePath);

      // Reply with the image
      await interaction.editReply({ files: [attachment] });

      // Delete the file after sending (optional)
      fs.unlinkSync(filePath);
    } catch (error) {
      console.error('Error generating image:', error);
      await interaction.editReply("An error occurred while generating the image.");
    }
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
