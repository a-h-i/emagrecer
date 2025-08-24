import Hero from '@/ui/components/landing/Hero';
import Steps from '@/ui/components/landing/Steps';
import UseCases from '@/ui/components/landing/UseCases';
import Features from '@/ui/components/landing/Features';
import Gallery from '@/ui/components/landing/Gallery';
import FAQ from '@/ui/components/landing/FAQ';

export default async function Home() {
  return (
    <main className='mx-auto max-w-6xl px-4 py-12 md:py-16'>
      c
      <Hero />
      <Steps />
      <UseCases />
      <Features />
      <Gallery />
      <FAQ />
    </main>
  );
}
