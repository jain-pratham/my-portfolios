import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackgroundFX from "@/components/BackgroundFX";
import HeroSection from "@/sections/HeroSection";
import AboutSection from "@/sections/AboutSection";
import ServicesSection from "@/sections/ServicesSection";
import ProjectsSection from "@/sections/ProjectsSection";
import TestimonialsSection from "@/sections/TestimonialsSection";
import TechStackSection from "@/sections/TechStackSection";
import ExperienceSection from "@/sections/ExperienceSection";
import BlogSection from "@/sections/BlogSection";
import ContactSection from "@/sections/ContactSection";

export default function HomePage() {
  return (
    <div className="min-h-screen transition-colors">
      <BackgroundFX />
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <ProjectsSection />
        <TestimonialsSection />
        <TechStackSection />
        <ExperienceSection />
        <BlogSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
