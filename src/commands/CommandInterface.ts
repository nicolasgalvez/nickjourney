import { Interaction } from 'discord.js'
// The interface for the Command class
export interface CommandInterface {
  // The name of the command
  name: string
  // The description of the command
  description: string
  // The function to execute when the command is called
  command: (interaction: Interaction) => void
}
