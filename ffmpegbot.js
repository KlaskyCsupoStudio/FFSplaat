const { Client, GatewayIntentBits, AttachmentBuilder } = require('discord.js');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const got = require('got');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

const OUTPUT_DIR = './output';
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR);

const FILTERS = {
  "negate": {t:"vf",v:"negate"},
  "hflip": {t:"vf",v:"hflip"},
  "vflip": {t:"vf",v:"vflip"},
  "swapuv": {t:"vf",v:"swapuv"},
  "hue": {t:"vf",v:"hue"},
  "curves": {t:"vf",v:"curves"},
  "vignette": {t:"vf",v:"vignette"},
  "smartblur": {t:"vf",v:"smartblur"},
  "unsharp": {t:"vf",v:"unsharp"},
  "eq": {t:"vf",v:"eq"},
  "colorbalance": {t:"vf",v:"colorbalance"},
  "gamma": {t:"vf",v:"gamma"},
  "lut": {t:"vf",v:"lut"},
  "lut3d": {t:"vf",v:"lut3d"},
  "colorkey": {t:"vf",v:"colorkey"},
  "chromakey": {t:"vf",v:"chromakey"},
  "drawbox": {t:"vf",v:"drawbox"},
  "drawtext": {t:"vf",v:"drawtext"},
  "rotate": {t:"vf",v:"rotate"},
  "transpose": {t:"vf",v:"transpose"},
  "crop": {t:"vf",v:"crop"},
  "scale": {t:"vf",v:"scale"},
  "zoompan": {t:"vf",v:"zoompan"},
  "fade": {t:"vf",v:"fade"},
  "deflicker": {t:"vf",v:"deflicker"},
  "deshake": {t:"vf",v:"deshake"},
  "detelesine": {t:"vf",v:"detelesine"},
  "dejudder": {t:"vf",v:"dejudder"},
  "owdenoise": {t:"vf",v:"owdenoise"},
  "nlmeans": {t:"vf",v:"nlmeans"},
  "hqdn3d": {t:"vf",v:"hqdn3d"},
  "removegrain": {t:"vf",v:"removegrain"},
  "bitplanenoise": {t:"vf",v:"bitplanenoise"},
  "yadif": {t:"vf",v:"yadif"},
  "bwdif": {t:"vf",v:"bwdif"},
  "mcdeint": {t:"vf",v:"mcdeint"},
  "w3fdif": {t:"vf",v:"w3fdif"},
  "nnedi": {t:"vf",v:"nnedi"},
  "hstack": {t:"vf",v:"hstack"},
  "vstack": {t:"vf",v:"vstack"},
  "xstack": {t:"vf",v:"xstack"},
  "overlay": {t:"vf",v:"overlay"},
  "blend": {t:"vf",v:"blend"},
  "tblend": {t:"vf",v:"tblend"},
  "format": {t:"vf",v:"format"},
  "geq": {t:"vf",v:"geq"},

  "wave": {t:"dynamic",b:async(i)=>{const w=execSync(`ffprobe -v error -select_streams v:0 -show_entries stream=width -of default=nw=1:nk=1 "\( {i}"`).toString().trim();const h=execSync(`ffprobe -v error -select_streams v:0 -show_entries stream=height -of default=nw=1:nk=1 " \){i}"`).toString().trim();return `format=yuv444p,negate,scale=640:480,geq='p(X-((sin((T*5*0+(0*15))+(Y/H)*(PI*0)))*(-15*0)),Y-((sin((T*5*0+(-0.8*15))+(X/W)*(PI*10)))*(-15*1.2)))',scale=\( {w}: \){h},format=yuv420p`}},

  "acompressor": {t:"af",v:"acompressor"},
  "acontrast": {t:"af",v:"acontrast"},
  "acrusher": {t:"af",v:"acrusher"},
  "acrossover": {t:"af",v:"acrossover"},
  "adeclick": {t:"af",v:"adeclick"},
  "adeclip": {t:"af",v:"adeclip"},
  "adelay": {t:"af",v:"adelay"},
  "aecho": {t:"af",v:"aecho"},
  "aemphasis": {t:"af",v:"aemphasis"},
  "aeval": {t:"af",v:"aeval"},
  "afftdn": {t:"af",v:"afftdn"},
  "afftfilt": {t:"af",v:"afftfilt"},
  "afir": {t:"af",v:"afir"},
  "aformat": {t:"af",v:"aformat"},
  "agate": {t:"af",v:"agate"},
  "alimiter": {t:"af",v:"alimiter"},
  "allpass": {t:"af",v:"allpass"},
  "aloop": {t:"af",v:"aloop"},
  "amerge": {t:"af",v:"amerge"},
  "amix": {t:"af",v:"amix"},
  "anequalizer": {t:"af",v:"anequalizer"},
  "anlmdn": {t:"af",v:"anlmdn"},
  "aphaser": {t:"af",v:"aphaser"},
  "apulsator": {t:"af",v:"apulsator"},
  "aresample": {t:"af",v:"aresample"},
  "arubberband": {t:"af",v:"rubberband"},
  "astats": {t:"af",v:"astats"},
  "atempo": {t:"af",v:"atempo"},
  "atrim": {t:"af",v:"atrim"},
  "bandpass": {t:"af",v:"bandpass"},
  "bandreject": {t:"af",v:"bandreject"},
  "bass": {t:"af",v:"bass"},
  "biquad": {t:"af",v:"biquad"},
  "chorus": {t:"af",v:"chorus"},
  "compand": {t:"af",v:"compand"},
  "deesser": {t:"af",v:"deesser"},
  "dynaudnorm": {t:"af",v:"dynaudnorm"},
  "earwax": {t:"af",v:"earwax"},
  "equalizer": {t:"af",v:"equalizer"},
  "extrastereo": {t:"af",v:"extrastereo"},
  "flanger": {t:"af",v:"flanger"},
  "highpass": {t:"af",v:"highpass"},
  "highshelf": {t:"af",v:"highshelf"},
  "loudnorm": {t:"af",v:"loudnorm"},
  "lowpass": {t:"af",v:"lowpass"},
  "lowshelf": {t:"af",v:"lowshelf"},
  "pan": {t:"af",v:"pan"},
  "silenceremove": {t:"af",v:"silenceremove"},
  "surround": {t:"af",v:"surround"},
  "tremolo": {t:"af",v:"tremolo"},
  "vibrato": {t:"af",v:"vibrato"},
  "volume": {t:"af",v:"volume"},

  "pitch_high": {t:"complex",v:"[0:a]rubberband=pitch=1.5[aout]"},
  "pitch_low": {t:"complex",v:"[0:a]rubberband=pitch=0.8[aout]"},
  "multi_pitch": {t:"complex",v:"[0:a]rubberband=formant=712923000:pitch=2^(0/12)[a1];[0:a]rubberband=formant=712923000:pitch=2^(12/12)[a2];[a1][a2]amix=2,volume=2[outa]"}
};

client.on('ready', () => console.log(`Bot online: ${client.user.tag}`));

client.on('messageCreate', async message => {
  if (!message.content.startsWith('!ffmpeg')) return;
  const args = message.content.slice(9).trim().split(/\s+/);
  const effect = args[0]?.toLowerCase();
  if (!message.attachments.size) return message.reply('Attach a file!');
  if (!FILTERS[effect]) return message.reply('Unknown effect.');

  const attachment = message.attachments.first();
  const inputPath = path.join(OUTPUT_DIR, `in_\( {Date.now()} \){path.extname(attachment.name)}`);
  const outputPath = path.join(OUTPUT_DIR, `out_\( {Date.now()} \){path.extname(attachment.name)}`);

  try {
    const buffer = await got(attachment.url).buffer();
    fs.writeFileSync(inputPath, buffer);

    const f = FILTERS[effect];
    let cmd = `ffmpeg -i "${inputPath}"`;

    if (f.t === "vf") cmd += ` -vf "${f.v}" -c:a copy`;
    else if (f.t === "af") cmd += ` -af "${f.v}" -c:v copy`;
    else if (f.t === "complex") cmd += ` -filter_complex "${f.v}" -map 0:v? -map "[aout]"`;
    else if (f.t === "dynamic") {
      const vf = await f.b(inputPath);
      cmd += ` -vf "${vf}" -c:a copy`;
    }

    cmd += ` -y "${outputPath}"`;
    execSync(cmd, {stdio:'pipe'});

    if (fs.existsSync(outputPath)) {
      await message.reply({ files: [new AttachmentBuilder(outputPath)] });
    }
  } catch (e) {
    message.reply('Error processing file.');
  } finally {
    [inputPath, outputPath].forEach(p => { if (fs.existsSync(p)) fs.unlinkSync(p); });
  }
});

client.login('YOUR_BOT_TOKEN_HERE');
