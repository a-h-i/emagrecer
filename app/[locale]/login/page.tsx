import { getLocale, getTranslations } from 'next-intl/server';
import { auth, signIn } from '@/auth';
import { redirect } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import Button from '@/ui/components/Button';

export default async function Login({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const t = await getTranslations('SignIn');
  const params = await searchParams;
  const locale = await getLocale();
  const callbackUrl = typeof params?.callbackUrl === "string" ? params.callbackUrl : `/${locale}/plan`;
  const session = await auth();
  if (session?.user != null) {
    redirect(callbackUrl);
  }
  async function handleSignIn() {
    'use server';
    await signIn('google', {redirectTo: callbackUrl});
  }

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4">
      <div className="rounded-2xl border p-6 shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
        <p className="mt-2 text-sm text-neutral-600">{t("subtitle")}</p>


        <form action={handleSignIn} className="mt-6">
          <Button
            type="submit"
            variant='primary'
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl"
          >
            <div className="h-6 w-6 relative">
              <Image src='/icons/Google.svg' alt='google' fill />
            </div>
            {t("google")}
          </Button>
        </form>


        <p className="mt-4 text-xs text-neutral-500">
          {t("footnote")} {" "}
          <Link href="/privacy" className="underline underline-offset-2">{t("privacy")}</Link>
        </p>
      </div>
    </main>
  );
}
