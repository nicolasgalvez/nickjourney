import {
  CommandInteractionOptionResolver,
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder,
  AttachmentBuilder,
  Interaction,
} from 'discord.js'
import dotenv from 'dotenv'
import { generateImage } from './comfyui'
import fs from 'fs'
import { command as LorasCommand } from './commands/loras'
import { generatePrompt } from './llm'
import { command as ProcessImage } from './commands/processimage'

dotenv.config()
const allowedGuilds = process.env.ALLOWED_GUILDS?.split(',') || []

const client = new Client({ intents: [GatewayIntentBits.Guilds] })
// loop over availableLoRAs and build a new command for each category
const lorabyCategory = LorasCommand.availableLoRAs.reduce(
  (acc, lora) => {
    if (!acc[lora.category]) {
      acc[lora.category] = []
    }
    acc[lora.category].push(lora)
    return acc
  },
  {} as { [key: string]: any[] }
)
const processimage = new SlashCommandBuilder()
  .setName('processimage')
  .setDescription('Send an image to ComfyUI for processing')
  .addAttachmentOption(option =>
    option
      .setName('image')
      .setDescription('Upload an image')
      .setRequired(true),
  )
const vibble = new SlashCommandBuilder()
  .setName('vibble')
  .setDescription('Generate a video')
  .addStringOption((option) =>
    option
      .setName('prompt')
      .setDescription('Describe what you want the video to be')
      .setRequired(true)
  )
const scrble = new SlashCommandBuilder()
  .setName('scrble')
  .setDescription('Generates an AI image based on your terrible short prompt')
  .addStringOption((option) =>
    option
      .setName('prompt')
      .setDescription('Describe what you want the image to be')
      .setRequired(false)
  )
const scribble = new SlashCommandBuilder()
  .setName('scribble')
  .setDescription('Generates an AI image based on your prompt')
  .addStringOption((option) =>
    option
      .setName('prompt')
      .setDescription('Describe what you want the image to be')
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName('aspect')
      .setDescription('Choose an aspect ratio')
      .setRequired(false)
      .addChoices(
        { name: 'Portrait', value: 'portrait' },
        { name: 'Landscape', value: 'landscape' },
        { name: '2x Tall', value: 'tall' },
        { name: '2x Wide', value: 'wide' }
      )
  )
  .addStringOption((option) =>
    option
      .setName('guidance')
      .setDescription('How creative should the image be?')
      .setRequired(false)
      .addChoices(
        { name: 'Normal', value: '3.5' },
        { name: 'Creative', value: '1.5' },
        { name: 'Loose', value: '1' },
        { name: 'Crazy', value: '0.2' }
      )
  )
  .addBooleanOption((option) =>
    option
      .setName('lazy')
      .setDescription('Are you a lazy person?')
      .setRequired(false)
  )

Object.keys(lorabyCategory).map((category) => {
  scribble.addStringOption((option) =>
    option
      .setName(category)
      .setDescription(`Choose a ${category} LoRA`)
      .setRequired(false)
      .addChoices(
        ...lorabyCategory[category].map((lora) => ({
          name: lora.name + ' - ' + lora.description,
          value: lora.name,
        }))
      )
  )
})

const commandsList = [
  vibble,
  scribble,
  scrble,
  processimage,
  new SlashCommandBuilder()
    .setName('loras')
    .setDescription('List LoRAs available'),
  // group loras by category and add a string option for each group addStringOption
]
commandsList.map((command) => command.toJSON())

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN)

  // Clear bot
  // for (const guildId of allowedGuilds) {
  //   (async () => {
  //     try {
  //       console.log('Removing all guild slash commands...');
  //       await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, guildId), { body: [] });
  //       console.log('Successfully removed all commands.');
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   })();
  // }

  ; (async () => {
    try {
      console.log('Started refreshing application (/) commands.')

      // Parse allowed guilds from .env

      for (const guildId of allowedGuilds) {
        try {
          await rest.put(
            Routes.applicationGuildCommands(
              process.env.CLIENT_ID,
              guildId.trim()
            ), // Trim to avoid spaces
            { body: commandsList }
          )
          console.log(`Successfully reloaded commands for guild: ${guildId}`)
        } catch (error) {
          console.error(
            `Failed to register commands for guild ${guildId}:`,
            error
          )
        }
      }

      console.log(
        'Successfully reloaded application (/) commands for all allowed guilds.'
      )
    } catch (error) {
      console.error(error)
    }
  })()

client.on('ready', () => {
  console.log(`Logged in as ${client.user?.tag}!`)
})

client.on('interactionCreate', async (interaction: Interaction) => {
  if (!interaction.isCommand()) {
    // print default message
    console.log(`Received interaction: ${interaction}`)
    return
  }
  if (!allowedGuilds.includes(interaction.guildId!)) {
    await interaction.reply({
      content: 'This bot is not authorized for this server.',
      ephemeral: true,
    })
    return
  }

  const { commandName } = interaction
  await interaction.deferReply() // Let Discord know the bot is processing

  if (commandName === 'loras') {
    await LorasCommand.command(interaction)
    return
  }
  await ProcessImage.command(interaction)

  if (commandName === 'scribble' || commandName === 'scrble' || commandName == 'vibble') {
    // if prompt has a lora choice, then add it to the prompt
    let prompt = (
      interaction.options as CommandInteractionOptionResolver
    ).getString('prompt')

    // loop through lora options and add them to the prompt if they exist
    Object.keys(lorabyCategory).map((category) => {
      const lora = (
        interaction.options as CommandInteractionOptionResolver
      ).getString(category)
      if (lora) {
        prompt = `<lora:${lora}:0.7>` + prompt
      }
    })
    if (commandName === 'scrble') {
      // Generate a prompt from the input
      prompt = await generatePrompt(prompt || '') // if prompt is null, use empty string
    }

    // get workflow from prompt... if it starts with "<space>" then use the space.json workflow
    // if it starts with "<lora>" then use the lora.json workflow
    // if it starts with "<negative>" then use the negative.json workflow
    let workflowFile = 'workflow_api_2.json'
    let filePath = `./scribble.png`
    if (prompt.startsWith('<space>')) {
      workflowFile = 'space.json'
    } else if (prompt.startsWith('<horror>')) {
      workflowFile = 'horror.json'
    } else if (prompt.startsWith('<trek>')) {
      workflowFile = 'trek.json'
    }
    if (commandName === 'vibble') {
      // Generate a prompt from the input
      workflowFile = 'vibble.json'
      filePath = `./vibble.webp`
    }
    try {
      console.log(`Generating image for prompt: ${prompt}`)
      // Generate the image from the provided prompt
      const response = await generateImage({
        prompt: prompt,
        negativePrompt: process.env.NEGATIVE_PROMPT
          ? process.env.NEGATIVE_PROMPT
          : '',
        // if prompt starts with "<space>" then use the space.json workflow
        workflowFile: workflowFile,
        interaction: interaction,
      })
      console.log(response)
      // Convert base64 to Buffer
      const base64Image = response.data
      const imageBuffer = Buffer.from(base64Image, 'base64')

      // Save image temporarily
      fs.writeFileSync(filePath, imageBuffer)

      // Create Discord attachment
      const attachment = new AttachmentBuilder(filePath)

      // Reply with the image
      await interaction.editReply({
        content: `${prompt}`,
        files: [attachment],
      })

      // Delete the file after sending (optional)
      fs.unlinkSync(filePath)
    } catch (error) {
      console.error('Error generating image:', error)
      await interaction.editReply('Sorry had a bit of a problem.')
    }
  }

})

client.login(process.env.DISCORD_BOT_TOKEN)
