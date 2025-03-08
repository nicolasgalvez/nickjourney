import { REST, Routes, SlashCommandBuilder, Interaction } from 'discord.js';
import { CommandInterface } from './CommandInterface'
import { Client, GatewayIntentBits } from 'discord.js';
import axios from 'axios';

class ProcessImage implements CommandInterface {
    name = 'processimage'
    description = 'Process an image to a video'
    constructor() {
        const commands = [
            new SlashCommandBuilder()
                .setName('processimage')
                .setDescription('Send an image to ComfyUI for processing')
                .addAttachmentOption(option =>
                    option
                        .setName('image')
                        .setDescription('Upload an image')
                        .setRequired(true),
                ),
        ].map(command => command.toJSON());

        const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN!);

        (async () => {
            try {
                console.log('Registering commands...');
                await rest.put(
                    Routes.applicationGuildCommands(process.env.CLIENT_ID!, process.env.GUILD_ID!),
                    { body: commands },
                );
                console.log('✅ Commands registenhhred successfully!');
            } catch (error) {
                console.error('❌ Error registering commands:', error);
            }

        })
    }
    command(interaction: Interaction) {
        if (interaction.commandName === 'processimage') {

            // Get the image URL from the command
            const image = interaction.options.getAttachment('image');

            if (!image || !image.url) {
                return interaction.editReply('❌ No valid image provided.');
            }
            (async () => {
                // Send the image URL to ComfyUI
                try {
                    const { COMFYUI_SERVER } = process.env
                    const response = await axios.post(
                        COMFYUI_SERVER,  // Replace with actual ComfyUI API URL
                        { image_url: image.url }
                    );

                    await interaction.editReply(`✅ Image sent to ComfyUI! Response: ${response.data.message}`);
                } catch (error) {
                    console.error('❌ Error sending image to ComfyUI:', error);
                    await interaction.editReply('❌ Failed to send image to ComfyUI.');
                }
            })
        }
    }
}
export const command = new ProcessImage()