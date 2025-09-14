import { PostHog } from 'posthog-node';


export function capturePlanCreated(posthog: PostHog, userId: string, data: {
  kcal_target: number | null,
  week_start: Date,

}) {
  posthog.capture( {
    distinctId: userId,
    properties: data,
    event: 'plan_created',
  });
}