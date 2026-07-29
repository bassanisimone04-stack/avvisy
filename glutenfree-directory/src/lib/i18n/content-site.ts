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
  { question: "Can I report an error on a business or product?", answer: "Yes, from your user profile you can report outdated information: our team reviews every report within 48 business hours." },
  { question: "Is the site free for users?", answer: "Yes, search, reviews and reading articles are completely free for all users, registered or not." },
  { question: "How are the recommended products selected?", answer: "The products shown are certified or declared gluten-free by the manufacturer, and are ranked based on ratings and reviews from the community." },
  { question: "Can I add my business to the directory?", answer: "Of course, businesses can request a listing through the dedicated panel: after a requirements check, the listing is published for free." },
];
