import { ChatInputCommandInteraction } from 'discord.js'
import { CommandInterface } from './CommandInterface'

interface LoRA {
  name: string
  description: string
  alias: string
  category: string
}

class LorasCommand implements CommandInterface {
  name = 'loras'
  description = 'List of available LoRAs'
  availableLoRAs: LoRA[]

  constructor() {
    this.availableLoRAs = [
      {
        name: '40k-battleship',
        description: 'Warhammer',
        alias: '40k',
        category: 'scifi',
      },
      {
        name: '77oussam_horror',
        description: 'Horror',
        alias: 'horror77',
        category: 'horror',
      },
      {
        name: 'Anime_style',
        description: 'Anime-style',
        alias: 'anime',
        category: 'style',
      },
      {
        name: 'Bill_Cosby_Flux',
        description: 'Bill Cosby',
        alias: 'cosby',
        category: 'person',
      },
      {
        name: 'CPA',
        description: 'Cyberpunk Anime',
        alias: 'cpa',
        category: 'style',
      },
      {
        name: 'dark_fantasy_lora',
        description: 'Dark fantasy theme',
        alias: 'darkfantasy',
        category: 'fantasy',
      },
      {
        name: 'david-bowie',
        description: 'David Bowie',
        alias: 'bowie',
        category: 'person',
      },
      {
        name: 'detailed_illustration',
        description: 'detailed vector',
        alias: 'vector',
        category: 'style',
      },
      {
        name: 'Donald_Trump',
        description: 'Donald Trump',
        alias: 'trump',
        category: 'person',
      },
      {
        name: 'Dwayne_Johnson_FLUX_LoRA-000160_FP8',
        description: 'Dwayne Johnson',
        alias: 'therock',
        category: 'person',
      },
      {
        name: 'F1D_George-Takei_v01e07',
        description: 'George Takei',
        alias: 'takei',
        category: 'person',
      },
      {
        name: 'HORROR_2_FLUX',
        description: 'Horror',
        alias: 'horror2',
        category: 'horror',
      },
      {
        name: 'horrorz',
        description: 'Horror',
        alias: 'horrorz',
        category: 'horror',
      },
      {
        name: 'klingon_FLUX',
        description: 'Klingons',
        alias: 'klingon',
        category: 'scifi',
      },
      {
        name: 'monster_flux',
        description: 'monsters',
        alias: 'monster',
        category: 'horror',
      },
      {
        name: 'Multi-layer geometric space',
        description: 'Geometric space',
        alias: 'geospace',
        category: 'scifi',
      },
      {
        name: 'Old Space Station - Flux LoRA - Trigger is ossttn',
        description: 'Old space station',
        alias: 'ossttn',
        category: 'scifi',
      },
      {
        name: 'retro-futurism-fashion-flux1-dev-v1-000122',
        description: 'Retro-futurism fashion',
        alias: 'retroflux',
        category: 'style',
      },
      {
        name: 'retrograde_80s',
        description: 'Retro 80s',
        alias: 'retro80s',
        category: 'style',
      },
      {
        name: 'S1999_FLUX',
        description: 'Space 1999',
        alias: 's1999',
        category: 'scifi',
      },
      {
        name: 'Space_Worlds_01__Poetic_fluxbeta4',
        description: 'Poetic space worlds',
        alias: 'spaceworlds',
        category: 'scifi',
      },
      {
        name: 'space-battle',
        description: 'Epic space battle',
        alias: 'spacebattle',
        category: 'scifi',
      },
      {
        name: 'Spacecraft',
        description: 'various spacecraft',
        alias: 'spacecraft',
        category: 'scifi',
      },
      {
        name: 'spacemarine-000008',
        description: 'Space marine',
        alias: 'spacemarine',
        category: 'scifi',
      },
      {
        name: 'The_Dark_Side_Of_The_Future',
        description: 'Dark future',
        alias: 'darkfuture',
        category: 'style',
      },
      {
        name: 'tng_flux-000005',
        description: 'The Next Generation',
        alias: 'tngflux',
        category: 'scifi',
      },
      {
        name: 'tos_flux-000005',
        description: 'The Original Series',
        alias: 'tosflux',
        category: 'scifi',
      },
      {
        name: 'zy_horror_monsters_flux',
        description: 'Horror monsters by zy',
        alias: 'zyhorror',
        category: 'horror',
      },
      {
        name: 'Cyber_Room',
        description: 'Cyber room',
        alias: 'cyberroom',
        category: 'scifi',
      },
      {
        name: 'Vaporwave_Graphic-e5',
        description: 'Vaporwave graphic',
        alias: 'vaporwave',
        category: 'style',
      },
      {
        name: 'ral-watce-flux',
        description: 'Water effect',
        alias: 'liquid',
        category: 'fantasy',
      },
      {
        name: 'metal_hurlant_v1',
        description: 'Metal Hurlant comic',
        alias: 'metalhurlant',
        category: 'comic',
      },
      {
        name: 'ral-crystalz_flux',
        description: 'crystals',
        alias: 'crystals',
        category: 'fantasy',
      },
      {
        name: 'FL-bailing-24-0906Fire Spirit-000008',
        description: 'Fire spirit',
        alias: 'firespirit',
        category: 'fantasy',
      },
      {
        name: 'Illustration_Style_IV',
        description: 'Watercolorish',
        alias: 'illustrationiv',
        category: 'style',
      },
      {
        name: 'Cyber_Background',
        description: 'Cyber backgrounds',
        alias: 'cyberbackground',
        category: 'scifi',
      },
      {
        name: 'ral-dissolve-flux',
        description: 'Dissolving object',
        alias: 'dissolve',
        category: 'fantasy',
      },
      {
        name: 'zyd232_Ink_Style_Flux1D_v1_1',
        description: 'Ink',
        alias: 'inkstyle',
        category: 'style',
      },
      {
        name: 'FLUX_BIG_BULGE',
        description: 'Big bulges',
        alias: 'bigbulge',
        category: 'body',
      },
      {
        name: '1980s_Big_Hair',
        description: '1980s big hair',
        alias: 'bighair',
        category: 'style',
      },
      {
        name: 'The Dude',
        description: 'The Dude',
        alias: 'thedude',
        category: 'person',
      },
      {
        name: 'TalkingHeadsSuit-flux',
        description: 'Talking Heads suit',
        alias: 'talkingheads',
        category: 'style',
      },
      {
        name: 'megalips_flux_v2',
        description: 'Mega lips',
        alias: 'megalips',
        category: 'body',
      },
      {
        name: 'bigbooty-000001',
        description: 'Big booty',
        alias: 'bigbooty',
        category: 'body',
      },
      {
        name: 'roundassv16_FLUX',
        description: 'Round ass',
        alias: 'roundass',
        category: 'body',
      },
      {
        name: 'Sci-fi_env_flux',
        description: 'Sci-fi environment',
        alias: 'scifienv',
        category: 'scifi',
      },
      {
        name: 'papiyan-lora',
        description: '6 arms Papiyan',
        alias: 'papiyan',
        category: 'body',
      },
      {
        name: '4armsfluxv2',
        description: 'Four arms',
        alias: 'fourarms',
        category: 'body',
      },
      {
        name: 'CharacterDesignSheetQuiron_FLUX',
        description: 'Character design',
        alias: 'quiron',
        category: 'character',
      },
      {
        name: 'Shrek',
        description: 'Shrek',
        alias: 'shrek',
        category: 'character',
      },
      {
        name: 'Unsettling_V2dot0-000008',
        description: 'Unsettling',
        alias: 'unsettling',
        category: 'horror',
      },
      {
        name: 'Ghibli',
        description: 'Nausicaä',
        alias: 'nausicaa',
        category: 'style',
      },
      {
        name: 'Xenomorph',
        description: 'Aliens',
        alias: 'xenomorph',
        category: 'scifi',
      },
      {
        name: 'flux-kirk',
        description: 'Character design',
        alias: 'characterdesign',
        category: 'style',
      },
      {
        name: 'Optimazed-TurboFLUX-Accelerater_PAseer',
        description: '?',
        alias: 'optimized',
        category: 'tools',
      },
      {
        name: 'Furry Enhancer Flux NSFW Mode V1',
        description: 'Anthropomorphic',
        alias: 'anthropomorphic',
        category: 'body',
      },
      {
        name: 'Afrofuturism-000001',
        description: 'Afrofuturism 1',
        alias: 'Afrofuturism1',
        category: 'scifi',
      },
      {
        name: 'dvr-afrofuturism-flux',
        description: 'Afrofuturism 2',
        alias: 'Afrofuturism2',
        category: 'scifi',
      },
      {
        name: 'Steampunk Concept Art - XL Pony V1.0',
        description: 'Steampunk art',
        alias: 'steampunkart',
        category: 'steampunk',
      },
      {
        name: 'Clothing - SteamPunk Armor',
        description: 'Steampunk armor',
        alias: 'steampunkmen',
        category: 'steampunk',
      },
      {
        name: 'edgSteampunk',
        description: 'Steampunk women',
        alias: 'steampunkwomen',
        category: 'steampunk',
      },
      {
        name: 'flux-kirk',
        description: 'Kirk',
        alias: 'kirk',
        category: 'character',
      },
    ]
  }

  async command(interaction: ChatInputCommandInteraction) {
    // format the list of loras into the name and the alias
    const LoRAsString =
      '\n' +
      this.availableLoRAs
        .map((lora) => `\`<lora:${lora.name}:0.7>\` (${lora.description})`)
        .join('\n')
    // send the string to the channel
    if (LoRAsString.length > 2000) {
      const messages = this.splitMessage(LoRAsString)
      try {
        await interaction.editReply(messages[0]) // First message replaces the original interaction response
        for (let i = 1; i < messages.length; i++) {
          await interaction.followUp(messages[i]) // Send additional chunks as follow-ups
        }
      } catch (error) {
        console.error('Error sending LoRAs message:', error)
      }

      return
    }
    await interaction.editReply(LoRAsString)
  }
  splitMessage(message, maxLength = 2000) {
    if (message.length <= maxLength) return [message]

    const parts = []
    const partMessage = 'Part no. '
    let chunk = ''

    for (const line of message.split('\n')) {
      if ((chunk + line).length > maxLength) {
        parts.push(chunk.trim())
        chunk = ''
      }
      chunk += line + '\n'
    }
    // push the parts with the prepended part no. string
    parts.push(chunk)
    parts.forEach((part, index) => {
      parts[index] = `${partMessage}${index + 1}/${parts.length}\n${part}`
    })

    return parts
  }
}

export const command = new LorasCommand()
