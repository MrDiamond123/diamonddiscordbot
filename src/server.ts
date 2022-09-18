//@ts-nocheck
import { Router } from 'itty-router'
import {
  InteractionResponseType,
  InteractionType,
  verifyKey,
} from 'discord-interactions';
import { getRedditURL, getSubredditAutocomplete } from './reddit';

class JsonResponse extends Response {
  constructor(body?: BodyInit | null | undefined, init?: ResponseInit | Response | undefined) {
    const jsonBody = JSON.stringify(body);
    init = init || {
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
    };
    super(jsonBody, init);
  }
}

const router = Router();

router.get('/', (request, env) => {
  return new Response(`You did it! ${env.DISCORD_APPLICATION_ID}`)
});

router.post('/', async (request, env) => {
  const message = await request.json();
  console.log(message);
  switch (message.type) {
    case InteractionType.PING:
      console.log('Ping!')
      return new JsonResponse({
        type: InteractionResponseType.PONG,
      });
    
    case InteractionType.APPLICATION_COMMAND:
      switch (message.data.name.toLowerCase()) {
        case 'reddit':
          console.log('reddit moment')
          const posts = await getRedditURL(message.data.options[0].value)
          return new JsonResponse({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              embeds: JSON.stringify(posts),
            }
          })
        default:
          console.error('oh no unknown command')
          return new JsonResponse({error: 'Unknown Type'}, {status: 400})
      }
    
    case InteractionType.APPLICATION_COMMAND_AUTOCOMPLETE:
      switch (message.data.name.toLowerCase()) {
        case 'reddit':
            const subreddits = await getSubredditAutocomplete(message.data.options[0].value)
            return new JsonResponse({
              type: InteractionResponseType.APPLICATION_COMMAND_AUTOCOMPLETE_RESULT,
              data: {
                choices: subreddits,
              }
            })
      }
    default:
      console.error('oh no unknown type')
      return new JsonResponse({error: 'Unknown Type'}, {status: 400})
  }
})
router.all('*', () => new Response('Not Found.', { status: 404}))

export default {
  async fetch(request, env) {
    if (request.method === 'POST') {
      const signature = request.headers.get('x-signature-ed25519')
      const timestamp = request.headers.get('x-signature-timestamp')
      console.log(signature, timestamp, env.DISCORD_PUBLIC_KEY)

      const body = await request.clone().arrayBuffer();
      const isValidRequest = verifyKey(body, signature, timestamp, env.DISCORD_PUBLIC_KEY);
      if (!isValidRequest) {
        console.error('Invalid Request')
        return new Response('Bad request signature', { status: 401 })
      }
    }
    return router.handle(request, env)
  },
}