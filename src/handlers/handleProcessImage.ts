import { Client, GatewayIntentBits } from 'discord.js';
import axios from 'axios';

const bot = new Client({ intents: [GatewayIntentBits.Guilds] });

bot.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'processimage') {
        await interaction.deferReply(); // Prevents timeout issues

        // Get the image URL from the command
        const image = interaction.options.getAttachment('image');

        if (!image || !image.url) {
            return interaction.editReply('❌ No valid image provided.');
        }

        // Send the image URL to ComfyUI
        try {
            const response = await axios.post(
                'http://your-comfyui-server.com/api/process',  // Replace with actual ComfyUI API URL
                { image_url: image.url }
            );

            await interaction.editReply(`✅ Image sent to ComfyUI! Response: ${response.data.message}`);
        } catch (error) {
            console.error('❌ Error sending image to ComfyUI:', error);
            await interaction.editReply('❌ Failed to send image to ComfyUI.');
        }
    }
});

bot.login(process.env.DISCORD_BOT_TOKEN);
