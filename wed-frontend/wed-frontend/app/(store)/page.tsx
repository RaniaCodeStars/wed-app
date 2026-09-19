import Hero from "@/components/Hero";
import ScrollBanner from "@/components/ScrollBanner";
import CategoryPills from "@/components/CategoryPills";
import ProductsSection from "@/components/ProductsSection";
import Reassurance from "@/components/Reassurance";
import SizeHelp from "@/components/SizeHelp";
import Testimonials from "@/components/Testimonials";
import Story from "@/components/Story";
import AnimatedSection from "@/components/AnimatedSection";
import { serverFetch } from "@/lib/server-api";
import type { LandingContent } from "@/lib/types";
import BrandVideosSection from "@/components/BrandVideosSection";

// Page d'accueil : Server Component (SEO + ISR via lib/data.ts), les sections animées
// sont enveloppées individuellement dans le petit Client Component AnimatedSection.
export default async function LandingPage() {
  const content = await serverFetch<LandingContent>("/landing/", { revalidate: 60 }).catch(() => null);

  return (
    <div className="flex flex-col space-y-16 pb-16">
      <AnimatedSection><Hero title={content?.hero_title} subtitle={content?.hero_subtitle} /></AnimatedSection>
      <AnimatedSection><ScrollBanner /></AnimatedSection>
      <AnimatedSection><CategoryPills /></AnimatedSection>
      <AnimatedSection><ProductsSection /></AnimatedSection>
      <AnimatedSection><BrandVideosSection /></AnimatedSection>
      <AnimatedSection><Reassurance /></AnimatedSection>
      <AnimatedSection><SizeHelp /></AnimatedSection>
      <AnimatedSection><Testimonials /></AnimatedSection>
      <AnimatedSection><Story /></AnimatedSection>
    </div>
  );
}
