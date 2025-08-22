import { getTranslations } from 'next-intl/server';
import Card from '@/ui/components/Card';


export default async function UseCases() {
  const t = await getTranslations('Landing.UseCases');
  return (
    <section className="mt-20">
      <h2 className="text-xl font-semibold md:text-2xl">{t("title")}</h2>
      <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card title={t("c1_t")} description={t("c1_d")} />
        <Card title={t("c2_t")} description={t("c2_d")} />
        <Card title={t("c3_t")} description={t("c3_d")} />
        <Card title={t("c4_t")} description={t("c4_d")} />
      </div>
    </section>
  );
}