import fetch from 'node-fetch';
import { REDDIT_COMMAND } from './commands.js';

const token = process.env.DISCORD_TOKEN;
const applicationId = process.env.DISCORD_APPLICATION_ID;
const testGuildId = process.env.DISCORD_TEST_GUILD_ID;

if (!token) {
    throw new Error('You need DISCORD_TOKEN silly')
}
if (!applicationId) {
    throw new Error('You need DISCORD_APPLICATION_ID silly')
}
/**
 * Register all commands with a specific guild/server. Useful during initial
 * development and testing.
 */
// eslint-disable-next-line no-unused-vars
async function registerGuildCommands() {
    if (!testGuildId) {
      throw new Error(
        'The DISCORD_TEST_GUILD_ID environment variable is required.'
      );
    }
    const url = `https://discord.com/api/v10/applications/${applicationId}/guilds/${testGuildId}/commands`;
    const res = await registerCommands(url);
    const json = await res.json();
    console.log(json);
    // @ts-ignore
    json.forEach(async (cmd) => {
      const response = await fetch(
        `https://discord.com/api/v10/applications/${applicationId}/guilds/${testGuildId}/commands/${cmd.id}`
      );
      if (!response.ok) {
        console.error(`Problem removing command ${cmd.id}`);
      }
    });
  }
  
  /**
   * Register all commands globally.  This can take o(minutes), so wait until
   * you're sure these are the commands you want.
   */
  // eslint-disable-next-line no-unused-vars
  async function registerGlobalCommands() {
    const url = `https://discord.com/api/v10/applications/${applicationId}/commands`;
    await registerCommands(url);
  }
  
  async function registerCommands(url) {
    console.log(JSON.stringify(REDDIT_COMMAND))
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bot ${token}`,
      },
      method: 'POST',
      body: JSON.stringify(REDDIT_COMMAND),
    });
  
    if (response.ok) {
      console.log('Registered all commands');
    } else {
      console.error('Error registering commands');
      const text = await response.text();
      console.error(text);
    }
    return response;
  }
  
  await registerGlobalCommands();
  // await registerGuildCommands();