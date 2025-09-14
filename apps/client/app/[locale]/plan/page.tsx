import { auth } from '@/auth';
import { unauthorized } from 'next/navigation';
import { getMonday, getOrCreatePlan } from '@emagrecer/control';
import { getDS } from '@/lib/getDS';
import getPostHogClient from '@/lib/postHogClient';
import { capturePlanCreated } from '@/lib/analytics/capturePlanCreated';
import { getTranslations } from 'next-intl/server';
import WeekSwitcher from '@/ui/components/planner/WeekSwitcher';

export const dynamic = 'force-dynamic';

export default async function Plan(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  params: Promise<{locale: string}>
}) {
  const session = await auth();
  if (session?.user?.id == null) {
    return unauthorized();
  }

  const searchParams = await props.searchParams;
  const searchWeek = Array.isArray(searchParams.week) ? searchParams.week[0] : searchParams.week;
  const weekStart = getMonday(searchWeek);
  const source = await getDS();
  const {plan, created} = await getOrCreatePlan(source, session?.user?.id, weekStart);
  if (created) {
    const posthog = getPostHogClient();
    capturePlanCreated(posthog, session.user.id, {
      kcal_target: plan.kcal_target,
      week_start: plan.week_start,
    });
    await posthog.shutdown();
  }

  const {locale} = await props.params;

  const t = await getTranslations('Planner');

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 md:py-10 grid gap-6 lg:grid-cols-[1fr_340px]">
      <section>
        <header className="mb-4 flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-semibold">{t('title')}</h1>
          <WeekSwitcher currentWeek={plan.week_start} locale={locale} />
        </header>
        <MacroSummary  />
        <PlanGrid   />
      </section>
      <aside className="lg:sticky lg:top-6 h-fit">
        <RecipePanel  />
      </aside>
    </main>
  );



}
