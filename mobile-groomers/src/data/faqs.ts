export type Faq = { question: string; answer: string };

/**
 * Core FAQ set used on the homepage and city pages, and mirrored into
 * FAQPage JSON-LD (see lib/schema.ts) so answers are eligible for
 * Google's featured snippet / FAQ rich result.
 */
export const CORE_FAQS: Faq[] = [
  {
    question: "How much does mobile dog grooming cost?",
    answer:
      "Mobile dog grooming typically costs $75–$150 per visit, depending on breed, coat condition, and size. Small dogs and express grooms run lower; large or heavily matted breeds and full spa packages run higher. Most vans post transparent per-breed pricing before booking.",
  },
  {
    question: "What's the difference between a mobile groomer and a salon?",
    answer:
      "A mobile groomer brings a self-contained van to your home, so your dog gets one-on-one attention with zero cage time and no other animals nearby. A salon groom involves drop-off, drying/holding cages, and shared space with other pets, which can add stress for anxious dogs.",
  },
  {
    question: "Do mobile grooming vans need my home's water or power hookup?",
    answer:
      "No. Most professional mobile grooming vans are fully self-contained with onboard water tanks, generators, or solar power. This means the groomer can serve your driveway or curb without connecting to your house at all — ask before booking if you're unsure.",
  },
  {
    question: "Are there size or weight limits for mobile grooming vans?",
    answer:
      "Most mobile vans comfortably groom dogs from toy breeds up to 100+ lbs, and many vans advertise \"large breed welcome\" for giant breeds. Weight limits vary by van and lift equipment, so check the groomer's listed capabilities or call ahead for breeds over 90 lbs.",
  },
  {
    question: "How much should I tip a mobile dog groomer?",
    answer:
      "Standard tipping etiquette in the US is 15–20% of the service price, similar to salon grooming. Tip more for exceptional handling of a difficult or anxious dog, and confirm whether tipping is accepted in cash, card, or through the booking app.",
  },
  {
    question: "Do mobile groomers offer cat grooming too?",
    answer:
      "Yes — many mobile grooming vans offer cat grooming, including baths, de-shedding, and sanitary trims. Because there's no barking or other animals in a waiting room, mobile grooming is often less stressful for cats than a traditional salon. Look for the \"Cat Friendly\" tag on a listing to confirm.",
  },
];
