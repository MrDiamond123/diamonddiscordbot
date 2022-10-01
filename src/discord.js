export async function getChannel(channel) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json')
    const response = await fetch(`https://discord.com/api/v10/channels/${channel}`, {
        method: 'GET',
        headers: headers
     })
     return response.json()
}