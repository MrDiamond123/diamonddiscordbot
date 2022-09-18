///@ts-nocheck

export async function getRedditURL(subreddit) {
    const response = await fetch(`https://api.reddit.com/r/${subreddit}/hot.json`, {
        headers: {
            'User-Agent': 'diamondmcpro:discordbot:v1.0.0 (by /u/diamondbro',
        },
    });
    const data = await response.json();
    const posts = data.data.children
        .map((post) => {
            if (post.is_gallery) {
                return '';
            }
            return (
                post.data?.media?.reddit_video?.fallback_url ||
                post.data?.secure_media?.reddit_video?.fallback_url ||
                post.data?.url
            );
        })
        .filter((post) => !!post);
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