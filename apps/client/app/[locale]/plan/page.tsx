import { auth } from '@/auth';
import { unauthorized } from 'next/navigation';
import { getMonday, getOrCreatePlan } from '@emagrecer/control';
import { getDS } from '@/lib/getDS';
import getPostHogClient from '@/lib/postHogClient';
import { capturePlanCreated } from '@/lib/analytics/capturePlanCreated';
import { getTranslations } from 'next-intl/server';
import WeekSwitcher from '@/ui/components/planner/WeekSwitcher';
import PlanWrapper from '@/ui/components/planner/PlanWrapper';

export const dynamic = 'force-dynamic';

export default async function Plan(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  params: Promise<{ locale: string }>;
}) {
  const session = await auth();
  if (session?.user?.id == null) {
    return unauthorized();
  }

  const searchParams = await props.searchParams;
  const searchWeek = Array.isArray(searchParams.week)
    ? searchParams.week[0]
    : searchParams.week;
  const weekStart = getMonday(searchWeek);
  const source = await getDS();
  const { plan, created } = await getOrCreatePlan(
    source,
    session?.user?.id,
    weekStart,
  );
  if (created) {
    const posthog = getPostHogClient();
    capturePlanCreated(posthog, session.user.id, {
      kcal_target: plan.kcal_target,
      week_start: plan.week_start,
    });
    await posthog.shutdown();
  }

  const { locale } = await props.params;

  const t = await getTranslations('Planner');

  return (
    <main className='mx-auto max-w-[90dvw] px-4 py-6 md:py-10'>
      <header className='mb-4 flex items-center justify-between'>
        <h1 className='text-xl font-semibold md:text-2xl'>{t('title')}</h1>
        <WeekSwitcher locale={locale} currentWeek={plan.week_start} />
      </header>
      <PlanWrapper weekStart={plan.week_start} />
    </main>
  );
}
