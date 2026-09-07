export type Post = {
  slug: string;
  title: string;
  description: string;
  category: string;
  readingMinutes: number;
  published: string;
  /**
   * Real last-review date. Google treats a dateModified that never moves as
   * a staleness signal on evergreen pages, so only bump this when the copy
   * actually changes.
   */
  updated: string;
  /** Entities the piece is meant to rank for; emitted as schema keywords. */
  keywords: string[];
  /**
   * Section headings drive the body, the table of contents, and the heading
   * anchors Google uses to build "jump to" links in the result snippet.
   *
   * Paragraphs support inline [label](/path) links. Contextual internal links
   * are how an article passes authority to the city pages that actually
   * convert, so they live in the copy rather than only in a footer CTA.
   */
  sections: { heading: string; paragraphs: string[]; list?: string[] }[];
  /**
   * Article-level FAQs. Answered in 40-50 words with the answer in the first
   * sentence — the shape Google extracts for a paragraph snippet.
   */
  faqs: { question: string; answer: string }[];
};

/** Stable anchor id for a heading, used by the TOC and by deep links. */
export function headingId(heading: string): string {
  return heading
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export const POSTS: Post[] = [
  {
    slug: "mobile-dog-grooming-cost",
    title: "How Much Does Mobile Dog Grooming Cost?",
    description:
      "What US mobile groomers charge, what drives the price up or down, and how to compare quotes without getting surprised at the door.",
    category: "Costs",
    readingMinutes: 6,
    published: "2026-01-15",
    updated: "2026-01-15",
    keywords: [
      "mobile dog grooming cost",
      "mobile dog grooming prices",
      "how much is mobile dog grooming",
      "mobile groomer price list",
      "dog grooming tipping",
    ],
    sections: [
      {
        heading: "The short answer",
        paragraphs: [
          "Most mobile dog grooming appointments in the United States land between $75 and $150 per visit. A small, short-coated dog getting a bath and tidy sits near the bottom of that range. A large double-coated breed needing a full groom sits at the top, and can exceed it.",
          "That is roughly $20 to $40 more than the equivalent service at a traditional salon. You are paying for the van, the fuel, the water, the generator, and the fact that one groomer is handling one dog for the entire appointment instead of rotating between several. Whether that premium is worth it depends on your dog — we compare the two formats in [mobile grooming vs. salon](/blog/mobile-grooming-vs-salon).",
        ],
      },
      {
        heading: "What actually drives the price",
        paragraphs: [
          "Quotes vary more by coat than by breed name, which is why two dogs of the same weight can be priced differently.",
        ],
        list: [
          "Size and weight — more dog means more time, more product, and more drying.",
          "Coat type — doodles, double coats, and anything prone to matting take substantially longer than a smooth coat.",
          "Coat condition — matting is the single biggest surcharge. Severe matting may be billed by the extra half hour, or declined outright on welfare grounds.",
          "Services included — nail grinding, teeth brushing, de-shedding treatments, and anal glands are often add-ons rather than part of the base price.",
          "Your metro area — the same groom costs noticeably more in [Los Angeles](/cities/los-angeles-ca) or [Seattle](/cities/seattle-wa) than in most of [Texas](/cities/houston-tx) or the Midwest.",
          "Travel distance — many vans include a radius in the base price and add a fee beyond it.",
        ],
      },
      {
        heading: "Why matting costs so much",
        paragraphs: [
          "A matted coat cannot be brushed out safely past a certain point. Mats pull on the skin continuously, and the tissue underneath is often inflamed before anyone can see it. Working through severe matting takes hours and risks nicking skin that is already tented and fragile.",
          "This is why a reputable groomer will often shave a badly matted dog rather than de-matting it, and will charge for the time either way. If a quote jumps when the groomer sees your dog, matting is usually the reason. Brushing between appointments is the cheapest thing you can do to control grooming costs.",
        ],
      },
      {
        heading: "Getting a quote you can trust",
        paragraphs: [
          "A useful quote needs your dog's breed or coat type, approximate weight, when it was last groomed, and an honest description of coat condition. Undersell the matting and the price will change on the day.",
          "Ask three things before booking: what the base price includes, what counts as an add-on, and what happens if the coat is worse than described. A groomer who answers all three clearly is usually the one who will not surprise you. [Search by your zip code](/cities) to see which vans actually cover your address, then request quotes from two or three.",
        ],
      },
      {
        heading: "Tipping",
        paragraphs: [
          "Standard tipping for mobile groomers in the US is 15 to 20 percent of the service price, the same as salon grooming. Consider the upper end for a groomer who handled an anxious, senior, or difficult dog well.",
          "Ask how they prefer to receive it — some take cash only, others handle it through their booking app.",
        ],
      },
      {
        heading: "Is it worth the premium?",
        paragraphs: [
          "For a confident, easy-coated dog that travels well, a salon is perfectly fine and cheaper. The mobile premium buys something specific: no car ride, no waiting room, no cage drying, and no other animals present.",
          "That matters most for anxious dogs, senior dogs, dogs recovering from injury, reactive dogs who cannot be around others, and households where getting to a salon during business hours is the actual obstacle. If none of those describe your situation, the premium may not be buying you much.",
        ],
      },
    ],
    faqs: [
      {
        question: "How much does mobile dog grooming cost per visit?",
        answer:
          "Most US mobile grooming appointments cost $75 to $150 per visit. Small short-coated dogs sit near the bottom of that range, large double-coated breeds near the top. That is roughly $20 to $40 more than the same service at a traditional salon.",
      },
      {
        question: "Why is mobile grooming more expensive than a salon?",
        answer:
          "The price covers the van, fuel, onboard water and power, and one groomer working on one dog for the whole appointment rather than rotating between several. You are buying dedicated time and zero cage time, not just the haircut.",
      },
      {
        question: "Do groomers charge extra for matted fur?",
        answer:
          "Yes. Matting is the single biggest surcharge because de-matting takes hours and risks injuring inflamed skin. Severe cases are often billed by the extra half hour, or the coat is shaved instead on welfare grounds. Brushing between appointments avoids it.",
      },
      {
        question: "How much should you tip a mobile dog groomer?",
        answer:
          "Tip 15 to 20 percent of the service price, the same as salon grooming. Consider the upper end when a groomer handled an anxious, senior, or difficult dog well. Ask whether they prefer cash, card, or their booking app.",
      },
    ],
  },
  {
    slug: "first-mobile-grooming-appointment",
    title: "Your First Mobile Grooming Appointment: What to Expect",
    description:
      "Where the van parks, whether it needs your water or power, how long it takes, and how to prepare so the appointment runs smoothly.",
    category: "Guides",
    readingMinutes: 5,
    published: "2026-02-03",
    updated: "2026-02-03",
    keywords: [
      "first mobile grooming appointment",
      "how does mobile dog grooming work",
      "do mobile groomers need water hookup",
      "mobile grooming van setup",
      "how long does mobile dog grooming take",
    ],
    sections: [
      {
        heading: "Before the van arrives",
        paragraphs: [
          "You need one thing: a legal, reasonably level parking spot close to your door. A driveway is ideal. Street parking works in most places, but if you are in a dense neighborhood, an apartment complex, or an HOA with rules about commercial vehicles, check ahead — this is the most common reason a first appointment goes wrong.",
          "Walk your dog beforehand so they arrive relaxed and have already relieved themselves. Skip the meal right before the appointment; a full stomach and a grooming table are a poor combination.",
        ],
      },
      {
        heading: "Do they need your water or power?",
        paragraphs: [
          "Almost always no. A professional mobile grooming van is self-contained: it carries its own fresh water tank, a water heater, and either a generator or a battery and solar system for power. That independence is the entire point of the format.",
          "A small number of operators — usually newer or smaller setups — do ask for an outdoor spigot or an exterior outlet. It is a fair question to ask when booking, and the answer tells you something about how established the operation is. Listings on this directory tag vans that are [solar or generator powered](/cities), so you can filter for self-contained setups before you call.",
        ],
      },
      {
        heading: "How the appointment runs",
        paragraphs: [
          "The groomer will come to your door, meet your dog, and confirm what you want done. Be specific. \"Short\" means different things to different people, and photographs communicate far better than adjectives.",
          "Your dog then goes into the van alone with the groomer. Most owners are not present during the groom — not because anything is hidden, but because dogs are consistently calmer without their owner in sight. A typical sequence is brush-out, bath, dry, haircut, nails and ears, then a final tidy.",
          "Total time is usually 60 to 90 minutes for a standard groom, with express services closer to 45 minutes and heavy double coats running past two hours. That is faster than a salon largely because there is no waiting and no cage time — your dog is worked on continuously from start to finish. See [how the two formats compare](/blog/mobile-grooming-vs-salon) if you are weighing them up.",
        ],
      },
      {
        heading: "What to expect afterwards",
        paragraphs: [
          "The groomer brings your dog back and should walk you through what they found — skin condition, lumps, ear problems, sore spots. Mobile groomers often catch these earlier than anyone else, because they handle the whole animal closely and regularly.",
          "Some dogs are subdued for a few hours afterwards. That is normal; grooming is physically tiring and socially demanding. What is not normal is limping, persistent scratching at a spot, or visible skin irritation, and you should raise any of those with the groomer straight away.",
        ],
      },
      {
        heading: "Setting up a rhythm",
        paragraphs: [
          "Most coats do best on a four to eight week cycle. Doodles and other continuously growing coats sit at the short end; short smooth coats can go considerably longer.",
          "Booking the next appointment before the groomer leaves is worth doing. Good mobile groomers run tight routes built around geography, and their regular slots fill weeks ahead. If you have not found a van yet, [search by zip code](/cities) — coverage is what decides who can actually reach you. Budgeting first? See [what mobile grooming costs](/blog/mobile-dog-grooming-cost).",
        ],
      },
    ],
    faqs: [
      {
        question: "Do mobile groomers need access to my water or electricity?",
        answer:
          "Almost never. Professional vans are self-contained, carrying their own fresh water tank, water heater, and a generator or solar system. A few smaller operators ask for an outdoor spigot or outlet, so confirm when you book.",
      },
      {
        question: "How long does a mobile grooming appointment take?",
        answer:
          "Usually 60 to 90 minutes for a standard groom. Express services run closer to 45 minutes, and heavy double coats can pass two hours. It is faster than a salon because there is no waiting and no cage time.",
      },
      {
        question: "Where does the mobile grooming van park?",
        answer:
          "In your driveway if you have one, otherwise legal street parking near your door. Check ahead if you live in an apartment complex or an HOA with rules about commercial vehicles — parking is the most common reason a first appointment goes wrong.",
      },
      {
        question: "Should I stay with my dog during the groom?",
        answer:
          "Most owners do not, and groomers generally prefer it that way. Dogs are consistently calmer when their owner is out of sight. The groomer brings your dog back afterwards and walks you through anything they found.",
      },
    ],
  },
  {
    slug: "mobile-grooming-vs-salon",
    title: "Mobile Grooming vs. Salon: Which Is Right for Your Dog?",
    description:
      "An honest comparison of van-based and salon grooming, including the cases where a traditional salon is genuinely the better choice.",
    category: "Guides",
    readingMinutes: 6,
    published: "2026-02-20",
    updated: "2026-02-20",
    keywords: [
      "mobile grooming vs salon",
      "is mobile dog grooming worth it",
      "mobile groomer or salon",
      "stress free dog grooming",
      "cage free dog grooming",
    ],
    sections: [
      {
        heading: "The real difference is not location",
        paragraphs: [
          "Both formats wash and cut your dog competently. The meaningful difference is what happens around the grooming itself.",
          "At a salon, a dog is typically dropped off, held in a kennel until their turn, groomed, possibly cage-dried, and held again until pickup. Total time on site is often three to five hours, most of it waiting, surrounded by other animals.",
          "In a van, a dog is collected from the door, worked on continuously, and returned. Nobody else is present. There is no kennel and no cage dryer. Elapsed time is usually 60 to 90 minutes — [here is how the appointment runs](/blog/first-mobile-grooming-appointment).",
        ],
      },
      {
        heading: "Where mobile clearly wins",
        paragraphs: [
          "Some situations point strongly toward a van.",
        ],
        list: [
          "Anxious or noise-sensitive dogs — removing the waiting room removes most of the stress.",
          "Senior or arthritic dogs — no car ride, no stairs, no hours standing in a kennel.",
          "Reactive dogs — one-on-one means no exposure to other animals at all.",
          "Dogs recovering from illness or surgery, where a shared space is a health risk.",
          "Multi-dog households, where getting everyone to a salon is genuinely difficult.",
          "Owners whose real constraint is time — no drop-off, no pickup, no half-day gone.",
        ],
      },
      {
        heading: "Where a salon is genuinely better",
        paragraphs: [
          "This deserves saying plainly, because directories rarely say it. A salon is often the right answer.",
          "It is meaningfully cheaper — see [what the mobile premium actually costs](/blog/mobile-dog-grooming-cost) — and for a confident dog with an easy coat it buys little. Salons also have more equipment, more space, and more hands, which matters for very large breeds, for dogs that need two people to handle safely, and for elaborate breed-standard or show trims.",
          "Salons usually have more availability, including short notice. A good mobile groomer's route is booked out. And if your dog genuinely enjoys the outing and the attention, the stress argument does not apply to them.",
        ],
      },
      {
        heading: "Questions worth asking either way",
        paragraphs: [
          "The format matters less than the individual groomer. Ask the same things regardless.",
        ],
        list: [
          "How long have you been grooming, and what training or certification do you hold?",
          "Are you insured, and licensed if my state or city requires it?",
          "How do you handle a dog that becomes distressed mid-groom?",
          "Do you use cage dryers or heated dryers unattended? (Both carry real risk.)",
          "What is your policy on severe matting?",
          "Can I see recent work on dogs with a coat like mine?",
        ],
      },
      {
        heading: "A reasonable way to decide",
        paragraphs: [
          "If your dog finds the salon experience genuinely stressful, or the logistics of getting there are the thing stopping you from grooming regularly, mobile is worth the extra $20 to $40.",
          "If your dog is relaxed about the whole business and you have a salon you trust, there is no strong reason to switch. Regular grooming by someone competent matters far more than which of the two formats delivers it. If you do want to try a van, [see which ones cover your zip code](/cities), and check our [common questions](/faq) before booking.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is mobile grooming better than a salon?",
        answer:
          "Better for anxious, senior, reactive, or recovering dogs, because it removes the car ride, the waiting room, and all cage time. A salon is often the better choice for confident dogs, giant breeds needing two handlers, and show trims.",
      },
      {
        question: "Is mobile dog grooming worth the extra cost?",
        answer:
          "It is worth roughly $20 to $40 more when your dog finds the salon stressful, or when the logistics of getting there are what stops you grooming regularly. For a relaxed, easy-coated dog, the premium buys little.",
      },
      {
        question: "Do mobile groomers use cage dryers?",
        answer:
          "No. There are no kennels or cage dryers in a grooming van, which is a core reason owners of anxious and senior dogs choose the format. Ask any groomer, mobile or salon, whether they leave dogs unattended under heated dryers.",
      },
      {
        question: "What should I ask a groomer before booking?",
        answer:
          "Ask about their experience and training, insurance and licensing, how they handle a dog that becomes distressed, their policy on severe matting, and whether they use unattended heated dryers. Ask the same questions of mobile and salon groomers alike.",
      },
    ],
  },
];

export function getPost(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug);
}
