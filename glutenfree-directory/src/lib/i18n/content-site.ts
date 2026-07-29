import type { FaqItem, Testimonial } from "../types";
import type { Locale } from "./locale";

const TESTIMONIAL_EN: Record<string, { role: string; quote: string }> = {
  t1: { role: "Celiac since 2015", quote: "Since I started using Mappa Senza Glutine I never improvise anymore: I find trustworthy places wherever I go in Italy, even in the smallest towns." },
  t2: { role: "Father of a celiac daughter", quote: "Community-verified reviews helped me discover safe pizzerias for my daughter even while on holiday." },
  t3: { role: "Gluten-free content creator", quote: "The products section is always up to date and saves me time every time I go grocery shopping." },
  t4: { role: "Celiac since 2019", quote: "Filters for AIC certification and real-time opening hours: exactly what you need when traveling for work." },
  t5: { role: "Nutritionist", quote: "I recommend the site to my newly diagnosed patients: the articles are clear and scientifically accurate." },
  t6: { role: "Celiac and food blogger", quote: "The blog has become my first source for discovering new restaurants before I even leave home." },
};

export function getLocalizedTestimonial(t: Testimonial, locale: Locale): Testimonial {
  if (locale === "it") return t;
  const tr = TESTIMONIAL_EN[t.id];
  if (!tr) return t;
  return { ...t, role: tr.role, quote: tr.quote };
}

export const HOME_FAQS_EN: FaqItem[] = [
  { question: "How do I know if a restaurant is really safe for celiacs?", answer: "Every listing on Mappa Senza Glutine shows whether the venue is AIC-certified, whether it has a dedicated kitchen or oven, and verified reviews from the celiac community, so you can judge how safe it is before booking." },
  { question: "What is AIC certification and why does it matter?", answer: "It's the trademark awarded by the Italian Celiac Association to venues that follow a strict protocol on purchasing, storage and preparation of gluten-free meals, verified through periodic audits." },
  { question: "What can't a celiac eat?", answer: "A celiac must avoid wheat, barley, rye, spelt and kamut and all their derivatives (bread, pasta, traditional pizza), plus processed products that can contain hidden gluten like thickeners or stock cubes." },
  { question: "What does gluten contamination mean and how dangerous is it?", answer: "It's accidental contact between a gluten-free food and residue from flour or non-dedicated equipment: even a few crumbs can trigger a reaction in celiacs, which is why dedicated kitchens and ovens are the most important safeguard." },
  { question: "How much more does gluten-free grocery shopping cost?", answer: "Gluten-free products, especially bread and pasta, cost on average 2 to 4 times more than their traditional equivalents: Italy's National Health Service monthly voucher helps cover part of the expense." },
  { question: "How do I find gluten-free restaurants near me?", answer: "Use the interactive map and directory on Mappa Senza Glutine: filter by AIC certification, category and distance to find verified nearby venues in seconds." },
];
