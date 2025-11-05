import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
dotenv.config();

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.once('ready', () => {
  console.log(`Estimator AI V5 is online as ${client.user.tag}`);
});

client.on('messageCreate', async message => {
  if (!message.content.startsWith('!') || message.author.bot) return;

  const args = message.content.slice(1).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  switch (command) {
    case 'design':
      message.reply('🧩 Designing your truss system...');
      break;
    case 'estimate':
      message.reply('📊 Running estimation model...');
      break;
    case 'takeoff':
      message.reply('📦 Generating material takeoff...');
      break;
    case 'breakdown':
      message.reply('💰 Preparing cost breakdown...');
      break;
    default:
      message.reply('⚙️ Command not recognized. Try !help');
  }
});

client.login(process.env.DISCORD_TOKEN);
