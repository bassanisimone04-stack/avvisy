export type Faq = { question: string; answer: string };

/**
 * Core FAQ set used on the homepage and the /faq page, and mirrored into
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
  {
    question: "How do I find a mobile dog groomer near me?",
    answer:
      "Search by zip code or city to see which vans actually cover your address — service-area maps on a business's own site are often broader than what a single van can realistically reach in a day. Browse listings by metro area to compare who's available.",
  },
  {
    question: "Is mobile dog grooming safe for puppies and senior dogs?",
    answer:
      "Yes, and it's often gentler than a salon for both. Puppies get a calmer first experience without a waiting room full of other animals, and senior dogs avoid a car ride and standing in a kennel. Mention your dog's age and any health conditions when booking.",
  },
  {
    question: "What happens if my dog's coat is severely matted?",
    answer:
      "Severe matting usually means the groomer shaves the coat rather than brushing it out, since de-matting a badly matted coat risks nicking already-inflamed skin. Expect an extra charge for the added time, and tell the groomer about matting honestly when booking so the quote is accurate.",
  },
  {
    question: "Are mobile dog groomers licensed and insured?",
    answer:
      "Licensing requirements vary by state and city — some require a grooming license, most don't — but liability insurance is close to universal among established operators. Ask directly about insurance, and about a license if your area requires one, before booking.",
  },
];
