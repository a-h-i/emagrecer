import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';


export default async function BottomCTA() {
  const t = await getTranslations('Landing.CTA');
  return (
    <section className="mt-20 rounded-2xl bg-neutral-50 p-8">
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div>
          <h3 className="text-lg font-semibold md:text-xl">{t("title")}</h3>
        </div>
        <Link
          href="/plan"
          className="rounded-xl bg-neutral-900 px-5 py-3 text-sm font-medium text-white shadow hover:opacity-90"
        >
          {t("primary")}
        </Link>
      </div>
    </section>
  );
}