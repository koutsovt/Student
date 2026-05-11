import { Hero } from './sections/Hero';
import { Problem } from './sections/Problem';
import { PatternsGrid } from './sections/PatternsGrid';
import { Architecture } from './sections/Architecture';
import { MatrixGrid } from './sections/MatrixGrid';
import { PersonasRow } from './sections/PersonasRow';
import { HowToDemo } from './sections/HowToDemo';
import { CTAStrip } from './sections/CTAStrip';
import { Footer } from './sections/Footer';

type Props = {
  onOpenDemo: () => void;
};

export function Landing({ onOpenDemo }: Props) {
  return (
    <main className="min-h-screen bg-white">
      <Hero onOpenDemo={onOpenDemo} />
      <Problem />
      <PatternsGrid />
      <Architecture />
      <MatrixGrid />
      <PersonasRow />
      <HowToDemo />
      <CTAStrip onOpenDemo={onOpenDemo} />
      <Footer />
    </main>
  );
}
