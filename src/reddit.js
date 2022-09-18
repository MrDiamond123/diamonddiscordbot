///@ts-nocheck

export async function handleSubredditCommand(env, message) {
    console.log("handling it after that happens")
    const results = await getRedditURL(message.data.options[0].value);
    const response = await fetch(`https://discord.com/api/v10/webhooks/${env.DISCORD_APPLICATION_ID}/${message.token}`, {
        method: 'POST',
        body: {
                'content': "test"
            }
        })
    console.log(response.json)
}
   
export async function getRedditURL(subreddit) {
    const params = new URLSearchParams();
    params.append('limit', 10)
    const response = await fetch(`https://api.reddit.com/r/${subreddit}/hot.json?${params}`, {
        headers: {
            'User-Agent': 'diamondmcpro:discordbot:v1.0.0 (by /u/diamondbro',
        },
    });
    const data = await response.json();
    const posts = data.data.children
        .map((post) => {
            return {title: post.data?.title};
        })
        console.log(posts)
        return posts;
}
export async function getSubredditAutocomplete(search) {
    const params = new URLSearchParams();
    params.append('query', search);
    params.append('include_over_18', true)
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