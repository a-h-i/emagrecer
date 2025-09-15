'use client';

import { useTranslations } from 'next-intl';
import { useSelector } from 'react-redux';
import {
  selectDayTotals,
  selectPlan,
  selectWeekTotals,
} from '@/lib/redux/plan/plan-slice';
import { computeDailyTargets } from '@/lib/plan/computeDailyTargets';
import MacroSummaryCard from '@/ui/components/planner/MacroSummaryCard';

export default function MacroSummary() {
  const t = useTranslations('Planner');
  const { selectedDay, kcalTarget, macroSplit } = useSelector(selectPlan);
  const dayTotals = useSelector(selectDayTotals(selectedDay));
  const weekTotals = useSelector(selectWeekTotals);

  const dailyTargets = computeDailyTargets({
    kcal: kcalTarget,
    split: macroSplit,
  });

  const weekTargets = dailyTargets
    ? {
        kcal: dailyTargets.kcal * 7,
        protein_g: dailyTargets.protein_g * 7,
        carbs_g: dailyTargets.carbs_g * 7,
        fat_g: dailyTargets.fat_g * 7,
      }
    : null;

  return (
    <section className='grid gap-4 md:grid-cols-2'>
      <MacroSummaryCard
        title={t('summary.titleDay')}
        metrics={[
          {
            label: `${t('summary.kcal')} (${t('summary.kcalUnit')})`,
            value: dayTotals.kcal,
            target: dailyTargets?.kcal,
            unit: 'kcal',
          },
          {
            label: t('summary.protein'),
            value: dayTotals.protein,
            target: dailyTargets?.protein_g,
            unit: 'g',
          },
          {
            label: t('summary.carbs'),
            value: dayTotals.carbs,
            target: dailyTargets?.carbs_g,
            unit: 'g',
          },
          {
            label: t('summary.fat'),
            value: dayTotals.fat,
            target: dailyTargets?.fat_g,
            unit: 'g',
          },
        ]}
      />

      <MacroSummaryCard
        title={t('summary.titleWeek')}
        metrics={[
          {
            label: `${t('summary.kcal')} (${t('summary.kcalUnit')})`,
            value: weekTotals.kcal,
            target: weekTargets?.kcal,
            unit: 'kcal',
          },
          {
            label: t('summary.protein'),
            value: weekTotals.protein,
            target: weekTargets?.protein_g,
            unit: 'g',
          },
          {
            label: t('summary.carbs'),
            value: weekTotals.carbs,
            target: weekTargets?.carbs_g,
            unit: 'g',
          },
          {
            label: t('summary.fat'),
            value: weekTotals.fat,
            target: weekTargets?.fat_g,
            unit: 'g',
          },
        ]}
      />
    </section>
  );
}
