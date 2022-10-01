///@ts-nocheck

import { getChannel } from "./discord";


export async function handleSubredditCommand(env, message) {
    const results = await getRedditURL(message.data.options[0].value);
    const data = {embeds: results, content: "test"}
    const headers = new Headers();
    headers.append('Content-Type', 'application/json')
    const response = await fetch(`https://discord.com/api/v10/webhooks/${env.DISCORD_APPLICATION_ID}/${message.token}`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: headers
     })

    console.log(await response.json())
}
   
export async function getRedditURL(subreddit) {
    const params = new URLSearchParams();
    params.append('limit', 9)
    const response = await fetch(`https://api.reddit.com/r/${subreddit}/hot.json?${params}`, {
        headers: {
            'User-Agent': 'diamondmcpro:discordbot:v1.0.0 (by /u/diamondbro',
        },
    });
    const data = await response.json();
    const posts = data.data.children
        .map((post) => {
            return {title: `"${post.data?.title}"`, description: 'description', author: {name: post.data?.author}, url: `https://reddit.com${post.data?.permalink}` };
        })
        console.log(posts)
        return posts;
}
export async function getSubredditAutocomplete(search, channel) {
    const channelData = await getChannel(channel);
    const params = new URLSearchParams();
    params.append('query', search);
    params.append('include_over_18', channelData.nsfw)
    params.append('limit', 10)
    params.append('include_profiles', false)
    const response = await fetch(`https://api.reddit.com/api/subreddit_autocomplete_v2.json?${params}`, {
        headers: {
            'User-Agent': 'diamondmcpro:discordbot:v1.0.0 (by /u/diamondbro',
        },
    });
    const data = await response.json();
    const subreddits = data.data.children
        .map((subreddit) => {
            return {name: subreddit.data?.display_name, value: subreddit.data?.display_name}
        })
    return subreddits;
}