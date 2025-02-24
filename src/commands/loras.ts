// The loras command should list all available LoRAs in the database
import { Interaction } from 'discord.js';

export const availableLoRAs = [
    { name: '40k-battleship', description: 'Epic space battleships from the Warhammer 40k universe', alias: '40k', category: 'scifi' },
    { name: '77oussam_horror', description: 'Horror-themed illustrations by 77oussam', alias: 'horror77', category: 'horror' },
    { name: 'Anime_style', description: 'Anime-style illustrations, may need to use 1 or more for weight', alias: 'anime', category: 'style' },
    { name: 'Bill_Cosby_Flux', description: 'Flux art style featuring Bill Cosby', alias: 'cosby', category: 'person' },
    { name: 'CPA', description: 'Cyberpunk Anime Style', alias: 'cpa', category: 'style' },
    { name: 'dark_fantasy_lora', description: 'Dark fantasy themed illustrations', alias: 'darkfantasy', category: 'fantasy' },
    { name: 'david-bowie', description: 'Illustrations featuring David Bowie', alias: 'bowie', category: 'person' },
    { name: 'detailed_illustration', description: 'Highly detailed vector illustrations', alias: 'vector', category: 'style' },
    { name: 'Donald_Trump', description: 'Illustrations featuring Donald Trump', alias: 'trump', category: 'person' },
    { name: 'Dwayne_Johnson_FLUX_LoRA-000160_FP8', description: 'Flux art style featuring Dwayne Johnson', alias: 'therock', category: 'person' },
    { name: 'F1D_George-Takei_v01e07', description: 'Illustrations featuring George Takei', alias: 'takei', category: 'person' },
    { name: 'HORROR_2_FLUX', description: 'Second edition of horror-themed Flux art', alias: 'horror2', category: 'horror' },
    { name: 'horrorz', description: 'Horror-themed illustrations', alias: 'horrorz', category: 'horror' },
    { name: 'klingon_FLUX', description: 'Flux art style featuring Klingons', alias: 'klingon', category: 'scifi' },
    { name: 'monster_flux', description: 'Flux art style featuring monsters', alias: 'monster', category: 'horror' },
    { name: 'Multi-layer geometric space', description: 'Geometric space-themed illustrations', alias: 'geospace', category: 'scifi' },
    { name: 'Old Space Station - Flux LoRA - Trigger is ossttn', description: 'Old space station themed Flux art', alias: 'ossttn', category: 'scifi' },
    { name: 'retro-futurism-fashion-flux1-dev-v1-000122', description: 'Retro-futurism fashion themed Flux art', alias: 'retroflux', category: 'style' },
    { name: 'retrograde_80s', description: 'Retro 80s themed illustrations', alias: 'retro80s', category: 'style' },
    { name: 'S1999_FLUX', description: 'Space 1999 themed Flux art', alias: 's1999', category: 'scifi' },
    { name: 'Space_Worlds_01__Poetic_fluxbeta4', description: 'Poetic space worlds themed Flux art', alias: 'spaceworlds', category: 'scifi' },
    { name: 'space-battle', description: 'Epic space battle illustrations', alias: 'spacebattle', category: 'scifi' },
    { name: 'Spacecraft', description: 'Illustrations of various spacecraft', alias: 'spacecraft', category: 'scifi' },
    { name: 'spacemarine-000008', description: 'Space marine themed illustrations', alias: 'spacemarine', category: 'scifi' },
    { name: 'The_Dark_Side_Of_The_Future', description: 'Dark future themed illustrations', alias: 'darkfuture', category: 'style' },
    { name: 'tng_flux-000005', description: 'The Next Generation themed Flux art', alias: 'tngflux', category: 'scifi' },
    { name: 'tos_flux-000005', description: 'The Original Series themed Flux art', alias: 'tosflux', category: 'scifi' },
    { name: 'zy_horror_monsters_flux', description: 'Horror monsters themed Flux art by zy', alias: 'zyhorror', category: 'horror' },
];

// run the command
export const loRAsCommand = async (interaction: Interaction) => {
    // format the list of loras into the name and the alias
    const LoRAsString = '\n' + availableLoRAs.map(lora => `\`<lora:${lora.name}:0.7>\` (${lora.description})`).join('\n');
    // send the string to the channel
    await interaction.editReply(LoRAsString);
}