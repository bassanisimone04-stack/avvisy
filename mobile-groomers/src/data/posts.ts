export type Post = {
  slug: string;
  title: string;
  description: string;
  category: string;
  readingMinutes: number;
  published: string;
  /** Section headings drive both the article body and its table of contents. */
  sections: { heading: string; paragraphs: string[]; list?: string[] }[];
};

export const POSTS: Post[] = [
  {
    slug: "mobile-dog-grooming-cost",
    title: "How Much Does Mobile Dog Grooming Cost?",
    description:
      "What US mobile groomers charge, what drives the price up or down, and how to compare quotes without getting surprised at the door.",
    category: "Costs",
    readingMinutes: 6,
    published: "2026-01-15",
    sections: [
      {
        heading: "The short answer",
        paragraphs: [
          "Most mobile dog grooming appointments in the United States land between $75 and $150 per visit. A small, short-coated dog getting a bath and tidy sits near the bottom of that range. A large double-coated breed needing a full groom sits at the top, and can exceed it.",
          "That is roughly $20 to $40 more than the equivalent service at a traditional salon. You are paying for the van, the fuel, the water, the generator, and the fact that one groomer is handling one dog for the entire appointment instead of rotating between several.",
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
          "Your metro area — the same groom costs noticeably more in Los Angeles or Seattle than in most of Texas or the Midwest.",
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
          "Ask three things before booking: what the base price includes, what counts as an add-on, and what happens if the coat is worse than described. A groomer who answers all three clearly is usually the one who will not surprise you.",
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
  },
  {
    slug: "first-mobile-grooming-appointment",
    title: "Your First Mobile Grooming Appointment: What to Expect",
    description:
      "Where the van parks, whether it needs your water or power, how long it takes, and how to prepare so the appointment runs smoothly.",
    category: "Guides",
    readingMinutes: 5,
    published: "2026-02-03",
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
          "A small number of operators — usually newer or smaller setups — do ask for an outdoor spigot or an exterior outlet. It is a fair question to ask when booking, and the answer tells you something about how established the operation is.",
        ],
      },
      {
        heading: "How the appointment runs",
        paragraphs: [
          "The groomer will come to your door, meet your dog, and confirm what you want done. Be specific. \"Short\" means different things to different people, and photographs communicate far better than adjectives.",
          "Your dog then goes into the van alone with the groomer. Most owners are not present during the groom — not because anything is hidden, but because dogs are consistently calmer without their owner in sight. A typical sequence is brush-out, bath, dry, haircut, nails and ears, then a final tidy.",
          "Total time is usually 60 to 90 minutes for a standard groom, with express services closer to 45 minutes and heavy double coats running past two hours. That is faster than a salon largely because there is no waiting and no cage time — your dog is worked on continuously from start to finish.",
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
          "Booking the next appointment before the groomer leaves is worth doing. Good mobile groomers run tight routes built around geography, and their regular slots fill weeks ahead.",
        ],
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
    sections: [
      {
        heading: "The real difference is not location",
        paragraphs: [
          "Both formats wash and cut your dog competently. The meaningful difference is what happens around the grooming itself.",
          "At a salon, a dog is typically dropped off, held in a kennel until their turn, groomed, possibly cage-dried, and held again until pickup. Total time on site is often three to five hours, most of it waiting, surrounded by other animals.",
          "In a van, a dog is collected from the door, worked on continuously, and returned. Nobody else is present. There is no kennel and no cage dryer. Elapsed time is usually 60 to 90 minutes.",
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
          "It is meaningfully cheaper, and for a confident dog with an easy coat the premium buys little. Salons also have more equipment, more space, and more hands — which matters for very large breeds, for dogs that need two people to handle safely, and for elaborate breed-standard or show trims.",
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
          "If your dog is relaxed about the whole business and you have a salon you trust, there is no strong reason to switch. Regular grooming by someone competent matters far more than which of the two formats delivers it.",
        ],
      },
    ],
  },
];

export function getPost(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug);
}
