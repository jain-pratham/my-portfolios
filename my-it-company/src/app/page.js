import Hero from '@/components/Hero';
import About from '@/components/About';
import Services from '@/components/Services';
import Skills from '@/components/Skills';
import Experience from '@/components/Experience';
import Process from '@/components/Process';
import Portfolio from '@/components/Portfolio';
import Contact from '@/components/Contact';

export default function Home() {
  return (
    <main className="relative">
      <Hero />
      <About />
      <Services />
      <Skills />
      <Experience />
      <Process />
      <Portfolio />
      <Contact />
    </main>
  );
}
