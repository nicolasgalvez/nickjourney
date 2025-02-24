// The loras command should list all available LoRAs in the database
import { Interaction } from 'discord.js';

export const availableLoRAs = [
    { name: '40k-battleship', description: 'Epic space battleships from the Warhammer 40k universe', alias: '40k', category: 'scifi' },
    { name: '77oussam_horror', description: 'Horror-themed illustrations by 77oussam', alias: 'horror77', category: 'horror' },
    { name: 'Anime_style', description: 'Anime-style illustrations, may need to use 1 or more for weight', alias: 'anime', category: 'style' },
    { name: 'Bill_Cosby_Flux', description: 'Bill Cosby', alias: 'cosby', category: 'person' },
    { name: 'CPA', description: 'Cyberpunk Anime Style', alias: 'cpa', category: 'style' },
    { name: 'dark_fantasy_lora', description: 'Dark fantasy themed illustrations', alias: 'darkfantasy', category: 'fantasy' },
    { name: 'david-bowie', description: 'Illustrations featuring David Bowie', alias: 'bowie', category: 'person' },
    { name: 'detailed_illustration', description: 'Highly detailed vector illustrations', alias: 'vector', category: 'style' },
    { name: 'Donald_Trump', description: 'Illustrations featuring Donald Trump', alias: 'trump', category: 'person' },
    { name: 'Dwayne_Johnson_FLUX_LoRA-000160_FP8', description: 'Dwayne Johnson', alias: 'therock', category: 'person' },
    { name: 'F1D_George-Takei_v01e07', description: 'Illustrations featuring George Takei', alias: 'takei', category: 'person' },
    { name: 'HORROR_2_FLUX', description: 'Second edition of horror-themed Flux art', alias: 'horror2', category: 'horror' },
    { name: 'horrorz', description: 'Horror-themed illustrations', alias: 'horrorz', category: 'horror' },
    { name: 'klingon_FLUX', description: 'Klingons', alias: 'klingon', category: 'scifi' },
    { name: 'monster_flux', description: 'monsters', alias: 'monster', category: 'horror' },
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
    { name: 'Cyber_Room', description: 'Cyber room themed illustrations', alias: 'cyberroom', category: 'scifi' },
    { name: 'Vaporwave_Graphic-e5', description: 'Vaporwave graphic style', alias: 'vaporwave', category: 'style' },
    { name: 'ral-watce-flux', description: 'watches', alias: 'watches', category: 'misc' },
    { name: 'metal_hurlant_v1', description: 'Metal Hurlant comic style', alias: 'metalhurlant', category: 'comic' },
    { name: 'ral-crystalz_flux', description: 'crystals', alias: 'crystals', category: 'misc' },
    { name: 'FL-bailing-24-0906Fire Spirit-000008', description: 'Fire spirit themed illustrations', alias: 'firespirit', category: 'fantasy' },
    { name: 'Illustration_Style_IV', description: 'Watercolorish', alias: 'illustrationiv', category: 'style' },
    { name: 'Cyber_Background', description: 'Cyber backgrounds', alias: 'cyberbackground', category: 'scifi' },
    { name: 'ral-dissolve-flux', description: 'dissolve effects', alias: 'dissolve', category: 'misc' },
    { name: 'zyd232_Ink_Style_Flux1D_v1_1', description: 'Ink', alias: 'inkstyle', category: 'style' },
    { name: 'FLUX_BIG_BULGE', description: 'big bulges, by popular demand', alias: 'bigbulge', category: 'body' },
    { name: '1980s_Big_Hair', description: '1980s big hair style', alias: 'bighair', category: 'style' },
    { name: 'The Dude', description: 'The Dude from The Big Lebowski', alias: 'thedude', category: 'person' },
    { name: 'TalkingHeadsSuit-flux', description: 'Talking Heads suit style', alias: 'talkingheads', category: 'style' },
    { name: 'megalips_flux_v2', description: 'Mega lips style', alias: 'megalips', category: 'body' },
    { name: 'bigbooty-000001', description: 'Big booty style', alias: 'bigbooty', category: 'body' },
    { name: 'roundassv16_FLUX', description: 'Round ass style', alias: 'roundass', category: 'body' },
    { name: 'Sci-fi_env_flux', description: 'Sci-fi environment style', alias: 'scifienv', category: 'scifi' },
    { name: 'papiyan-lora', description: '6 arms Papiyan style', alias: 'papiyan', category: 'body' },
    { name: '4armsfluxv2', description: 'Four arms style', alias: 'fourarms', category: 'body' },
];

// run the command
export const loRAsCommand = async (interaction: Interaction) => {
    // format the list of loras into the name and the alias
    const LoRAsString = '\n' + availableLoRAs.map(lora => `\`<lora:${lora.name}:0.7>\` (${lora.description})`).join('\n');
    // send the string to the channel
    await interaction.editReply(LoRAsString);
}