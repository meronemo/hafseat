import { PostHog } from 'posthog-node'

export default function PostHogClient() {
  const posthogClient = new PostHog(
    'phc_3GU0S9g1XAv9T0UPfqOgge9IkiPZK4KhgVLFIted73p',
    {
      host: 'https://us.i.posthog.com',
      flushAt: 1,
      flushInterval: 0
    }
  )
  return posthogClient
}
