import { getTranslations } from 'next-intl/server';
import Step from '@/ui/components/landing/Step';


export default async function Steps() {
  const t = await getTranslations('Landing.Steps');
  return (
    <section className="mt-20">
      <h2 className="text-xl font-semibold md:text-2xl">{t("title")}</h2>
      <div className="mt-6 grid gap-6 md:grid-cols-3">
        <Step title={t("s1_t")} description={t("s1_d")} icon="goals" />
        <Step title={t("s2_t")} description={t("s2_d")} icon="calendar" />
        <Step title={t("s3_t")} description={t("s3_d")} icon="cart" />
      </div>
    </section>
  );
}