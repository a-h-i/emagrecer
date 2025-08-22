import { getTranslations } from 'next-intl/server';
import FAQQuestion from '@/ui/components/landing/FAQQuestion';


export default async function FAQ() {
  const t = await getTranslations('Landing.FAQ');

  return (
    <section className="mt-20">
      <h2 className="text-xl font-semibold md:text-2xl">FAQ</h2>
      <div className="mt-6 divide-y divide-neutral-200 rounded-2xl border">
        <FAQQuestion summary={t('q1')} body={t("a1")} />
        <FAQQuestion summary={t("q2")} body={t("a2")} />
        <FAQQuestion summary={t("q3")} body={t("a3")} />
      </div>
    </section>
  );
}