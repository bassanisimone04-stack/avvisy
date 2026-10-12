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
      "mobile dog grooming cost per visit",
      "average cost of mobile dog grooming",
      "mobile grooming rates",
      "cost of mobile pet grooming",
      "dog grooming price by breed",
      "mobile dog groomer pricing",
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
      {
        question: "Does mobile dog grooming cost more in some cities than others?",
        answer:
          "Yes. Prices run noticeably higher in expensive metro areas like Los Angeles or Seattle than in most of Texas or the Midwest, largely tracking local cost of living and fuel costs rather than the service itself changing.",
      },
      {
        question: "Are add-ons like nail grinding or teeth brushing included in the price?",
        answer:
          "Usually not. Nail grinding, teeth brushing, de-shedding treatments, and anal gland expression are typically priced as add-ons rather than bundled into the base groom, so ask what's included before booking.",
      },
    ],
  },
  {
    slug: "first-mobile-grooming-appointment",
    title: "First Mobile Dog Grooming Appointment: What to Expect",
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
      "what to expect mobile dog grooming",
      "mobile dog groomer first visit",
      "mobile grooming appointment tips",
      "preparing dog for mobile groomer",
      "mobile grooming van parking",
      "mobile dog groomer checklist",
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
      {
        question: "Can I request a specific time window for my appointment?",
        answer:
          "Most mobile groomers give a window rather than an exact time, since travel between stops varies with traffic and how long the previous appointment ran. Ask how tight their windows typically are when booking.",
      },
      {
        question: "What if my dog has never been groomed before?",
        answer:
          "Tell the groomer in advance. A first-time groom is often shorter and more cautious than a routine one, focused on building a calm association rather than completing a full cut in one sitting.",
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
      "mobile dog grooming pros and cons",
      "benefits of mobile dog grooming",
      "mobile pet grooming vs salon grooming",
      "at home dog grooming vs salon",
      "best grooming option for anxious dogs",
      "mobile dog grooming advantages",
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
      {
        question: "Is mobile grooming safe for puppies?",
        answer:
          "Yes, and skipping the waiting room full of other animals can make it a gentler first experience than a salon. See [a puppy's first grooming appointment](/blog/puppy-first-grooming-appointment) for the right age to start.",
      },
      {
        question: "Can I switch between mobile and salon grooming?",
        answer:
          "Yes, there's no rule against alternating. Some owners use mobile grooming for routine maintenance and a salon for an occasional elaborate trim that needs more equipment or two groomers.",
      },
    ],
  },
  {
    slug: "mobile-cat-grooming",
    title: "Mobile Cat Grooming: What to Expect and What It Costs",
    description:
      "Mobile grooming works especially well for cats. What a visit covers, how much it costs, and how it differs from grooming a dog.",
    category: "Guides",
    readingMinutes: 5,
    published: "2026-03-10",
    updated: "2026-03-10",
    keywords: [
      "mobile cat grooming",
      "cat grooming near me",
      "mobile cat groomer cost",
      "at home cat grooming",
      "cat grooming without carrier",
      "cat grooming for long haired cats",
      "mobile grooming for cats cost",
      "cat lion cut grooming",
      "cat de-matting groomer",
      "stress free cat grooming",
      "do cats need professional grooming",
    ],
    sections: [
      {
        heading: "Why mobile grooming suits cats particularly well",
        paragraphs: [
          "Most of the stress in a cat's grooming visit happens before the groomer ever touches them: the carrier, the car ride, and a waiting room that usually smells like dog. A mobile van skips all three. The cat stays on familiar territory, there is no carrier confrontation, and no other animals are present at any point.",
          "This is not a minor convenience. Cats regulate stress largely through scent-marked territory and predictable routine, and a clinic or salon visit disrupts both at once. Groomers who work with cats mobile-only often report that cats who fight the carrier at home settle within minutes once the groom starts in the driveway — the hard part was getting there, not the grooming itself.",
        ],
      },
      {
        heading: "What a mobile cat grooming visit includes",
        paragraphs: [
          "Core services are a bath, blow-dry, brush-out, nail trim, and sanitary trim (hygiene clipping around the tail and hindquarters, which matters more for cats than people expect). Long-haired breeds — Persians, Maine Coons, Ragdolls — often need a full de-shedding treatment or a partial lion-cut if matting has set in.",
          "Cats mat differently from dogs: it tends to concentrate behind the ears, under the arms, and around the collar, rather than across the whole coat. A groomer experienced with cats checks those spots first rather than assuming a dog-style brush-out will work.",
        ],
      },
      {
        heading: "How much it costs",
        paragraphs: [
          "Mobile cat grooming typically runs $75 to $130, close to the lower half of the [range for mobile dog grooming](/blog/mobile-dog-grooming-cost) — cats are smaller and faster to bathe, but handling a stressed cat safely takes real skill, which keeps the price from dropping much further. A lion-cut or de-matting shave for a severely matted long-hair runs toward the top of that range or above it.",
          "Not every mobile groomer takes cats. Check the listing's tags or ask directly — handling an unhappy cat safely is a different skill set from dogs, and a van that does not regularly groom cats may decline rather than risk an injury to the cat or themselves.",
        ],
      },
      {
        heading: "Preparing your cat for the visit",
        paragraphs: [
          "Withhold food for a couple of hours beforehand if your cat tends toward nausea with handling — check with the groomer, since this is not universal advice. Keep your cat in a single room shortly before the appointment so you are not chasing them through the house when the van arrives; a cat that senses a chase is already harder to groom calmly twenty minutes later.",
          "Mention any history of biting, prior vet visits that went badly, or medical conditions (heart murmurs, arthritis, recent surgery) before the groomer starts. A cat groomer who knows in advance will adjust handling and pacing; one who finds out mid-groom has to stop and reassess, which is harder on the cat.",
        ],
      },
      {
        heading: "Signs a cat should see a vet instead of — or before — a groomer",
        paragraphs: [
          "Severe matting that pulls visibly on the skin, open sores under mats, or a cat that cannot be safely handled at all are reasons to involve a veterinarian, who can sedate for a medical shave when a conscious groom is not safe. A responsible mobile groomer will tell you this rather than attempt it anyway — ask how they handle a cat that turns out to be too distressed to continue.",
        ],
      },
    ],
    faqs: [
      {
        question: "Do mobile groomers groom cats, not just dogs?",
        answer:
          "Many do, but not all — cat handling is a distinct skill, so check a listing's tags or ask directly before booking. A groomer experienced with cats will ask about bite or scratch history in advance rather than finding out mid-groom.",
      },
      {
        question: "How much does mobile cat grooming cost?",
        answer:
          "Typically $75 to $130 per visit, slightly below the low end of mobile dog grooming. A lion-cut or de-matting shave for a severely matted long-haired cat runs toward the top of that range or higher.",
      },
      {
        question: "Is mobile grooming less stressful for cats than a salon?",
        answer:
          "Usually, yes. Most of a cat's grooming stress comes from the carrier, the car ride, and the smell of other animals in a waiting room — a mobile van removes all three, so the cat is groomed in a space that still smells like home.",
      },
      {
        question: "Do I need to do anything before the groomer arrives for my cat?",
        answer:
          "Keep your cat in one room shortly beforehand so there's no chase through the house, and tell the groomer about any bite history, medical conditions, or past bad grooming experiences before they start handling your cat.",
      },
      {
        question: "Can mobile groomers handle a cat with no grooming history?",
        answer:
          "Experienced cat groomers can, but they'll usually go slower and ask more questions upfront — bite or scratch history, past vet visits, temperament — to adjust pacing rather than assuming the cat is used to handling.",
      },
      {
        question: "Do indoor cats need professional grooming?",
        answer:
          "Short-haired indoor cats often self-groom adequately, but long-haired breeds and any cat prone to matting still benefit from periodic professional grooming, especially around the hindquarters and behind the ears where mats form first.",
      },
    ],
  },
  {
    slug: "how-to-choose-a-mobile-dog-groomer",
    title: "How to Choose a Mobile Dog Groomer (Questions to Ask)",
    description:
      "A practical checklist for vetting a mobile groomer before you book — licensing, insurance, equipment, and the questions that reveal how they actually work.",
    category: "Guides",
    readingMinutes: 6,
    published: "2026-03-24",
    updated: "2026-03-24",
    keywords: [
      "how to choose a mobile dog groomer",
      "best mobile dog groomer near me",
      "mobile dog groomer questions to ask",
      "is my mobile groomer licensed",
      "mobile dog grooming red flags",
      "mobile dog groomer insurance",
      "vetting a mobile dog groomer",
      "mobile pet groomer reviews",
      "mobile dog grooming licensing requirements",
      "how to find a good mobile groomer",
      "mobile dog groomer certification",
    ],
    sections: [
      {
        heading: "Start with what the van actually is",
        paragraphs: [
          "\"Mobile grooming\" covers two very different setups: a fully self-contained van with its own water tank, water heater, and generator or solar power, and a smaller operation that asks to use your outdoor spigot or an exterior outlet. Neither is automatically wrong, but you want to know which one is showing up. Ask directly — [most professional vans are self-contained](/blog/first-mobile-grooming-appointment) and the answer tells you how established the operation is.",
          "If you have narrowed it down to a few options, [search your zip code](/cities) to see which vans actually list your area rather than guessing from a website's service-area map, which is often broader than what a single van realistically covers in a day.",
        ],
      },
      {
        heading: "Licensing and insurance",
        paragraphs: [
          "Requirements vary by state and city — some require a cosmetology-adjacent pet grooming license, most require none at all, but liability insurance is close to universal among legitimate operators because a single claim (a nicked skin fold, a slipped harness) can otherwise end a small business. Ask whether they carry liability insurance and, if your state licenses groomers, whether they hold that license. A groomer with nothing to show for either question is not automatically unsafe, but it removes a layer of protection if something goes wrong.",
        ],
      },
      {
        heading: "Questions about the groom itself",
        paragraphs: [
          "These separate a careful operator from one who is just fast.",
        ],
        list: [
          "How long have you been grooming professionally, and did you train formally or apprentice?",
          "What is your plan if my dog becomes distressed mid-groom — do you stop, or push through?",
          "Do you use cage dryers or leave a dog under a heated dryer unattended? (Reputable mobile groomers generally do not, since there is no cage to begin with.)",
          "What is your policy on matting — do you charge extra, decline, or shave it out, and at what point?",
          "Can you handle my breed and size? Giant breeds and double coats take meaningfully longer.",
          "Do you perform expression of anal glands, and is it included or an add-on?",
        ],
      },
      {
        heading: "Reading reviews without being misled by them",
        paragraphs: [
          "A handful of five-star reviews says little; look for reviews that describe specifics — how a groomer handled an anxious or reactive dog, whether they called about unexpected matting before shaving, whether pricing matched the quote. A string of reviews praising the same groomer by name inside a multi-groomer operation tells you which individual to request, which matters more than the business's overall rating.",
          "Pay closer attention to how a business responds to a negative review than to the negative review itself. A defensive or dismissive reply is a worse sign than the original complaint.",
        ],
      },
      {
        heading: "What a transparent quote looks like",
        paragraphs: [
          "A groomer who gives a confident flat price over the phone without asking your dog's breed, approximate weight, coat condition, and when it was last groomed is guessing — and the price will likely change at the door once they see a matted or oversized coat in person. A groomer who asks those questions before quoting, and tells you upfront what triggers an add-on fee, is the one less likely to surprise you.",
        ],
      },
      {
        heading: "Red flags worth walking away from",
        paragraphs: [
          "No visible business name on the van, reluctance to answer how long they have been grooming, dismissiveness about matting or distress policies, and pressure to book immediately without answering your questions are all reasons to keep looking. A groomer confident in their own work generally welcomes the questions above rather than treating them as an inconvenience.",
        ],
      },
    ],
    faqs: [
      {
        question: "What's the most important question to ask a mobile groomer?",
        answer:
          "How they handle a dog that becomes distressed mid-groom. The answer reveals more about their actual practice than years of experience or reviews — a groomer who stops and reassesses is a better sign than one who says they \"push through.\"",
      },
      {
        question: "Do mobile dog groomers need to be licensed?",
        answer:
          "It depends on the state and city — some require a grooming license, most do not. Liability insurance is close to universal among established operators, so ask about insurance even where a license isn't legally required.",
      },
      {
        question: "How do I know if a mobile grooming quote is accurate?",
        answer:
          "A trustworthy quote comes after the groomer asks about your dog's breed, weight, coat condition, and last groom date — not a flat price given blind. If the price changes significantly at the door, ask what specifically triggered the change before agreeing to it.",
      },
      {
        question: "Should I pick a groomer based on reviews alone?",
        answer:
          "Read for specifics rather than star counts — how a groomer handled an anxious dog, whether they warned about matting before shaving, whether the price matched the quote. How a business responds to negative reviews is often more revealing than the reviews themselves.",
      },
      {
        question: "How do I verify a mobile groomer's insurance?",
        answer:
          "Ask directly for the name of their insurance provider or a certificate of insurance — a legitimate operator can usually produce one without hesitation. Vague answers or reluctance are worth treating as a caution sign.",
      },
      {
        question: "Is a lower price always a red flag?",
        answer:
          "Not automatically, but a price far below everyone else's in the same area is worth asking about directly — it can mean less experience, no insurance, or corners cut on time per dog. Compare what's included, not just the number.",
      },
    ],
  },
  {
    slug: "mobile-grooming-anxious-senior-reactive-dogs",
    title: "Mobile Grooming for Anxious, Senior, and Reactive Dogs",
    description:
      "A practical guide to grooming dogs who find the process hardest: what to tell the groomer, how to prepare, and the warning signs to watch for.",
    category: "Guides",
    readingMinutes: 6,
    published: "2026-04-07",
    updated: "2026-04-07",
    keywords: [
      "mobile grooming anxious dog",
      "grooming senior dog at home",
      "reactive dog grooming",
      "fear free dog grooming",
      "stress free grooming for dogs",
      "grooming aggressive dog safely",
      "senior dog grooming tips",
      "anxious dog grooming tips",
      "fear free certified groomer",
      "grooming a dog that hates the groomer",
      "sedated dog grooming",
    ],
    sections: [
      {
        heading: "Why these dogs are different, not just \"harder\"",
        paragraphs: [
          "An anxious, senior, or reactive dog is not simply a more difficult version of an easy dog — the grooming process itself needs to change, not just the groomer's patience. A senior dog with arthritis cannot stand on a table as long as a younger dog regardless of temperament. A reactive dog is not being managed well if it is merely tolerated in a room with other animals; it needs to never encounter them. [Mobile grooming removes the waiting room and the car ride](/blog/mobile-grooming-vs-salon) by default, which handles a lot of this — but the groomer's actual technique still matters.",
        ],
      },
      {
        heading: "What to tell the groomer before they start",
        paragraphs: [
          "Specifics help far more than a general warning. \"He's nervous\" tells a groomer little; \"he panics when his back paws are touched and has nipped once when startled there\" tells them exactly where to go slowly. The same applies to seniors: name the joints that are sore, whether they can stand unsupported for the full groom, and whether they need breaks.",
          "Mention medications, since some affect temperature regulation or bleeding risk (common in older dogs on NSAIDs), and mention any recent vet visits — a dog in quiet pain from an ear infection or a sore tooth can present as sudden reactivity that has nothing to do with the groomer.",
        ],
      },
      {
        heading: "What fear-free handling actually looks like",
        paragraphs: [
          "Some groomers advertise \"fear free\" training (a real certification, not just a marketing phrase) — it covers reading early stress signals, working at the dog's pace rather than a fixed schedule, and stopping before a dog escalates rather than after. In practice this looks like short sessions with breaks for a very anxious dog, or a groom split across two visits rather than forced into one.",
          "Ask directly whether they will stop if your dog shows real distress, versus completing the groom regardless once started. The honest answer from a good groomer is that an unfinished, calmer groom beats a finished, traumatic one — and that a second shorter visit is sometimes the right call.",
        ],
      },
      {
        heading: "Senior dogs: the physical side",
        paragraphs: [
          "Ask whether the van has a lift table or ramp, since lifting a large senior dog by hand is harder on both the dog and the groomer than a working lift. Standing time matters — ask whether the groomer can work with a dog lying down for parts of the groom rather than standing the whole time, and whether they check paw pads and nails more frequently (older dogs often wear nails unevenly from changed gait, which needs attention most owners don't think to flag).",
        ],
      },
      {
        heading: "Building tolerance over repeat visits",
        paragraphs: [
          "For a dog that is anxious but not reactive to the point of risk, the single most effective thing is staying with the same groomer every time rather than switching. Familiarity compounds — a dog who was tense on the first visit is often visibly calmer by the third, provided nothing traumatic happened in between. This is one more reason a short, deliberately incomplete first groom (just a bath and a brush-out, nothing more) can be worth proposing to the groomer for a dog you know will struggle.",
        ],
      },
      {
        heading: "When to involve your vet first",
        paragraphs: [
          "A dog whose reactivity is severe enough to risk a bite, or a senior dog with conditions that make standing or restraint genuinely risky, may need a vet-supervised sedated groom rather than a conscious one. This is not a failure on the groomer's or owner's part — it is the safer and often kinder option, and a good mobile groomer will say so rather than attempt a groom that is not safe for the dog, themselves, or both.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is mobile grooming better for anxious dogs than a salon?",
        answer:
          "Usually, yes — removing the car ride, the waiting room, and other animals addresses most of what triggers anxiety in the first place. The groomer's individual technique still matters, so ask how they handle a dog that becomes distressed rather than assuming the format alone solves it.",
      },
      {
        question: "What is fear-free grooming?",
        answer:
          "A real certification (not just marketing language) covering how to read early stress signals, work at the dog's pace, and stop before a dog escalates rather than after. Ask a groomer directly whether they hold this training if it matters to you.",
      },
      {
        question: "Can a senior dog with arthritis still be groomed in a van?",
        answer:
          "Yes, with adjustments — ask whether the van has a lift table or ramp, and whether the groomer can work with the dog lying down for part of the session instead of standing the whole time. Older dogs also need more frequent paw and nail checks due to changed gait.",
      },
      {
        question: "What if my dog is too reactive to groom safely while conscious?",
        answer:
          "A vet-supervised sedated groom is sometimes the safer and kinder option. A responsible mobile groomer will say this directly rather than attempt a groom that risks injury to the dog or themselves — ask in advance how they handle a dog that turns out to be unsafe to continue.",
      },
      {
        question: "Should I sedate my dog for grooming at home?",
        answer:
          "Only under veterinary guidance, never with over-the-counter or human medication. A vet can prescribe an appropriate sedative for a dog whose anxiety or reactivity makes a conscious groom unsafe, and should be consulted on the plan.",
      },
      {
        question: "How do I find a groomer experienced with reactive dogs?",
        answer:
          "Ask directly rather than guessing from a website — specifically whether they've worked with reactive dogs before and what their plan is if a dog shows aggression. [Search groomers by zip code](/cities) and call a few before booking.",
      },
    ],
  },
  {
    slug: "dog-grooming-schedule-by-breed",
    title: "How Often Should You Groom Your Dog? By Coat Type",
    description:
      "How grooming frequency actually depends on coat type rather than breed size, with realistic schedules for smooth, double, curly, and wire coats.",
    category: "Guides",
    readingMinutes: 6,
    published: "2026-04-21",
    updated: "2026-04-21",
    keywords: [
      "dog grooming schedule",
      "how often to groom a dog",
      "how often should dogs be groomed",
      "dog grooming frequency by breed",
      "how often to brush dog",
      "grooming schedule by coat type",
      "how often to groom a double coated dog",
      "how often to groom a poodle",
      "dog grooming interval",
      "puppy grooming schedule",
      "how often to groom a doodle",
    ],
    sections: [
      {
        heading: "Coat type decides the schedule, not breed size",
        paragraphs: [
          "Owners usually ask \"how often for my breed,\" but the honest answer sorts by coat type, not breed. A Chihuahua and a Doberman have nearly identical grooming needs because both have smooth, short coats. A Shih Tzu and a Poodle also match each other closely, despite looking nothing alike, because both have continuously growing hair that mats without regular attention.",
          "That means the schedules below are organized by coat, and you place your dog into whichever one matches regardless of what the breed standard says.",
        ],
      },
      {
        heading: "Smooth, short coats (Labradors, Beagles, Boxers, most short-haired breeds)",
        paragraphs: [
          "These coats shed continuously in small amounts and rarely mat. A full groom every 8 to 12 weeks is usually enough, with a weekly brush at home in between to manage shedding on furniture and floors.",
          "The main reason to book sooner is nails and ears, not the coat itself — both need attention on a shorter cycle than the coat does, which is part of why a professional groom is worth keeping on a schedule even for a low-maintenance coat.",
        ],
      },
      {
        heading: "Double coats (Huskies, Golden Retrievers, German Shepherds, Corgis)",
        paragraphs: [
          "Double-coated dogs carry a soft undercoat beneath a coarser outer layer, and they blow that undercoat seasonally rather than shedding evenly year-round. A groom every 6 to 8 weeks, timed around spring and fall coat blows, keeps the undercoat from matting against the skin.",
          "Never shave a healthy double coat down to the skin expecting it to help with heat or shedding — the double coat regulates temperature in both directions, and shaving it can cause patchy, abnormal regrowth. A de-shedding treatment that removes loose undercoat without cutting the guard hairs is the right tool here, not a close shave.",
        ],
      },
      {
        heading: "Curly and continuously-growing coats (Poodles, Doodles, Bichons)",
        paragraphs: [
          "These coats do not shed out on their own the way a double coat does — loose hair gets trapped in the curl instead of falling to the floor, which is exactly what turns into mats if left alone. A groom every 4 to 6 weeks is the realistic minimum, and daily or near-daily brushing at home is not optional the way it is for other coat types.",
          "This is the coat type where skipping an appointment has compounding cost: a coat that goes 10 weeks instead of 5 is rarely just \"a bit shaggier\" — it is often matted enough that the groomer has to shave it short rather than trim it, which is why [matting drives mobile grooming prices](/blog/mobile-dog-grooming-cost) more than almost anything else.",
        ],
      },
      {
        heading: "Wire and broken coats (Terriers, Schnauzers)",
        paragraphs: [
          "Wire coats are typically clipped or hand-stripped every 6 to 8 weeks. Clipping is faster and far more common with mobile and salon groomers alike; hand-stripping preserves the wiry texture and color better but takes considerably longer and costs more, and not every groomer offers it. Ask specifically which technique a groomer uses before booking if coat texture matters to you for a show or working dog.",
        ],
      },
      {
        heading: "Signs you have waited too long, whatever the schedule says",
        paragraphs: [
          "Schedules are a starting point, not a rule. Run your fingers through the coat down to the skin, not just over the surface — if you feel resistance, tangles that do not pull apart easily, or felted patches, book sooner regardless of how many weeks it has been. Puppies, dogs who swim or play outdoors often, and dogs recovering from an injury that limited normal brushing all tend to need shorter intervals than their coat type alone would suggest.",
          "If you are not sure which category your dog falls into, [search groomers in your area](/cities) and ask directly — most will tell you honestly whether your dog's coat needs a 5-week or a 10-week cycle rather than quoting a one-size-fits-all number.",
        ],
      },
    ],
    faqs: [
      {
        question: "How often should I groom my dog?",
        answer:
          "It depends on coat type more than breed: smooth short coats every 8 to 12 weeks, double coats every 6 to 8 weeks, curly or continuously-growing coats every 4 to 6 weeks, and wire coats every 6 to 8 weeks. Daily or weekly home brushing is still needed between visits for most coats.",
      },
      {
        question: "Do short-haired dogs need professional grooming?",
        answer:
          "Yes, even though their coats rarely mat. A groom every 8 to 12 weeks still covers nail trimming, ear cleaning, and shedding control, which matter regardless of coat length.",
      },
      {
        question: "Should I shave my double-coated dog in summer?",
        answer:
          "No. A double coat regulates temperature in both hot and cold weather, and shaving it can cause patchy, abnormal regrowth. A de-shedding treatment that removes loose undercoat without cutting the guard hairs is the right approach instead.",
      },
      {
        question: "What happens if I skip a grooming appointment for a curly-coated dog?",
        answer:
          "Loose hair that would normally be brushed out gets trapped in the curl and mats. A coat left twice as long as usual is often matted enough to need a full shave rather than a trim, which is why curly and doodle coats are the least forgiving to skip.",
      },
      {
        question: "Do puppies need grooming on the same schedule as adult dogs?",
        answer:
          "Not exactly — puppies with continuously-growing coats often visit every 3 to 4 weeks for short, gentle sessions focused on building comfort with handling, moving to the normal adult interval once grown. See [a puppy's first grooming appointment](/blog/puppy-first-grooming-appointment).",
      },
      {
        question: "Does grooming frequency change with the seasons?",
        answer:
          "For double-coated breeds, yes — book around the spring and fall coat blow for a de-shedding treatment. Other coat types generally stay on the same year-round interval.",
      },
    ],
  },
  {
    slug: "deshedding-treatment-double-coated-dogs",
    title: "De-Shedding Treatments for Double-Coated Dogs",
    description:
      "What a professional de-shedding treatment does differently from a regular bath and brush, which breeds benefit most, and why shaving isn't the answer.",
    category: "Guides",
    readingMinutes: 5,
    published: "2026-05-05",
    updated: "2026-05-05",
    keywords: [
      "de-shedding treatment for dogs",
      "dog undercoat removal",
      "husky shedding treatment",
      "double coat grooming",
      "dog shedding treatment cost",
      "deshedding treatment cost",
      "how to stop dog shedding",
      "undercoat rake for dogs",
      "golden retriever shedding treatment",
      "should I shave my husky",
      "dog coat blow season",
    ],
    sections: [
      {
        heading: "What a de-shedding treatment actually is",
        paragraphs: [
          "A de-shedding treatment is a bath and brush-out built specifically to pull loose, dead undercoat out before it works its way free on its own — onto your floors, furniture, and clothes. It typically involves a de-shedding shampoo and conditioner designed to loosen the undercoat, followed by high-velocity drying that blows loose hair out of the coat, and a thorough brush-out with an undercoat rake or similar tool.",
          "This is different from a routine bath, which cleans the coat but does not aggressively pull undercoat the way a dedicated treatment does. It is also different from clipping — nothing is cut short. The guard hairs (the coarser outer layer) stay at full length; only the loose, dead undercoat underneath is removed.",
        ],
      },
      {
        heading: "Which dogs actually benefit",
        paragraphs: [
          "Double-coated breeds are the clearest case: Huskies, Golden and Labrador Retrievers, German Shepherds, Corgis, Akitas, and similar breeds carry a dense undercoat that they shed seasonally in large amounts, commonly called \"blowing coat.\" A de-shedding treatment timed around spring and fall shedding seasons is the most effective single thing an owner can do to manage the volume of loose hair around the house.",
          "Single-coated and smooth-coated dogs shed too, but more evenly and in smaller amounts, so a de-shedding treatment helps less dramatically for them — a regular brush at home usually keeps pace. If you are unsure which category your dog falls into, [our breed-by-breed grooming schedule guide](/blog/dog-grooming-schedule-by-breed) walks through how to tell the difference by coat, not breed name.",
        ],
      },
      {
        heading: "Why shaving is the wrong solution",
        paragraphs: [
          "It is a common instinct to shave a heavily-shedding dog down to the skin, especially before summer, expecting less shedding and a cooler dog. Both assumptions are usually wrong. A double coat insulates against heat as well as cold, and shaving it removes that protection along with real risk of sunburn on exposed skin.",
          "Shaving a double coat can also trigger uneven regrowth — patchy areas, or a texture change where the undercoat grows back disproportionately thick relative to the guard hairs, sometimes described as \"coat funk\" or post-clipping alopecia. It does not reliably reduce shedding either, since the dog still produces and sheds undercoat; it is simply shorter hair falling out instead of longer hair. A de-shedding treatment achieves the actual goal — less loose hair around the house — without the downsides.",
        ],
      },
      {
        heading: "What it costs and how often to book it",
        paragraphs: [
          "A de-shedding treatment is usually offered as an add-on to a standard groom rather than a separate visit, adding roughly $20 to $40 to the base price depending on coat density and how overdue the dog is — see [general mobile grooming pricing](/blog/mobile-dog-grooming-cost) for how the base price itself is set. Twice a year, timed around the spring and fall coat blow, is enough for most double-coated dogs; a dog that sheds heavily year-round may benefit from a treatment every grooming visit instead.",
        ],
      },
      {
        heading: "What you can do between visits",
        paragraphs: [
          "An undercoat rake or de-shedding brush used at home two or three times a week during shedding season meaningfully reduces how much comes out on its own between professional visits. Regular brushing also makes the professional treatment faster and less uncomfortable for the dog, since the groomer is not working through weeks of accumulated loose undercoat all at once.",
        ],
      },
    ],
    faqs: [
      {
        question: "What does a dog de-shedding treatment involve?",
        answer:
          "A de-shedding shampoo and conditioner to loosen the undercoat, high-velocity drying to blow loose hair free, and a thorough brush-out with an undercoat rake. Nothing is cut — only loose, dead undercoat is removed, while the outer guard hairs stay full length.",
      },
      {
        question: "Does shaving a dog reduce shedding?",
        answer:
          "Not reliably, and it removes the coat's natural insulation against both heat and cold. Shaving a double coat can also cause patchy, uneven regrowth. A de-shedding treatment removes the loose undercoat without those risks.",
      },
      {
        question: "How often should a double-coated dog get a de-shedding treatment?",
        answer:
          "Twice a year, timed around the spring and fall coat blow, is enough for most double-coated dogs. A dog that sheds heavily year-round may benefit from having it done at every grooming visit instead.",
      },
      {
        question: "How much does a de-shedding treatment cost?",
        answer:
          "It is usually an add-on to a standard groom rather than a separate visit, typically adding $20 to $40 to the base price depending on coat density and how overdue the dog is.",
      },
      {
        question: "Can I de-shed my dog myself at home?",
        answer:
          "Partially. A home undercoat rake used two or three times a week during shedding season helps a lot, but a professional treatment with proper shampoo, drying, and tools reaches undercoat a home brush alone usually can't fully clear.",
      },
      {
        question: "Will a de-shedding treatment stop my dog from shedding completely?",
        answer:
          "No treatment stops shedding entirely — it's a natural, ongoing process. A de-shedding treatment reduces the volume of loose hair released around your home by removing what's already dead and ready to fall out.",
      },
    ],
  },
  {
    slug: "puppy-first-grooming-appointment",
    title: "Puppy's First Grooming Appointment: When to Start",
    description:
      "The right age to start professional grooming, what a puppy's first visit should actually cover, and how to make it a good experience rather than a stressful one.",
    category: "Guides",
    readingMinutes: 5,
    published: "2026-05-19",
    updated: "2026-05-19",
    keywords: [
      "puppy first grooming appointment",
      "when to start grooming a puppy",
      "puppy grooming age",
      "first time puppy groom",
      "puppy grooming tips",
      "puppy grooming checklist",
      "how to prepare puppy for grooming",
      "puppy grooming vaccination requirements",
      "best age to groom a puppy",
      "puppy grooming near me",
      "puppy first bath and trim",
    ],
    sections: [
      {
        heading: "When to start",
        paragraphs: [
          "Most groomers recommend a first visit between 12 and 16 weeks old, once a puppy has completed their core vaccination series — many mobile groomers and salons ask for proof of vaccination before the first appointment, since the dog will be handled closely and may encounter other animals' scent even in a one-on-one van setting. Check this when booking rather than assuming it is not required.",
          "Breeds that need grooming early for coat reasons — Poodles, Doodles, Shih Tzus, and other continuously-growing coats — benefit from starting at the early end of that window, since their coat can begin matting well before a dog is full grown. Smooth-coated puppies have more flexibility and can start a little later without consequence.",
        ],
      },
      {
        heading: "Why starting early matters more than the coat",
        paragraphs: [
          "The biggest reason to groom a puppy early has little to do with the coat itself: it is about building a calm association with being handled, bathed, brushed, and having paws, ears, and a muzzle touched by someone other than the owner. A puppy's first few grooming experiences shape how they respond to every one after that, for the rest of their life.",
          "This is why a puppy's first visit is usually shorter and gentler than a full adult groom — often just a bath, a light brush, a very light trim if needed, and nail clipping, deliberately stopping well short of a complete groom. The goal of the first appointment is a good experience, not a finished haircut.",
        ],
      },
      {
        heading: "What to tell the groomer in advance",
        paragraphs: [
          "Mention that it's a first visit, your puppy's age, and anything unusual about their temperament — unusually nervous, mouthy, or completely unbothered by handling so far. A good groomer adjusts pace and session length based on this rather than running every puppy through the same routine.",
          "If your puppy has not been regularly handled at home — paws touched, ears lifted, muzzle held gently — mention that too. A groomer who knows this in advance will go slower and build trust gradually rather than assuming a puppy is used to handling it has never actually experienced.",
        ],
      },
      {
        heading: "Preparing at home beforehand",
        paragraphs: [
          "In the weeks before the appointment, handle your puppy's paws, ears, and mouth briefly and positively every day — a few seconds at a time, paired with praise or a treat, is enough to build familiarity without it becoming a battle. A short, calm car ride or two (if visiting a salon rather than booking mobile) also helps if that is part of the routine ahead.",
          "For mobile appointments specifically, there is no car ride to prepare for, which removes one common source of puppy stress entirely — [see how a mobile appointment runs](/blog/first-mobile-grooming-appointment) for what to expect regardless of age.",
        ],
      },
      {
        heading: "Setting up the next few visits",
        paragraphs: [
          "Plan on a groom roughly every 3 to 4 weeks through the first six months for continuously-growing coats, mostly for brief, low-stress exposure rather than because the coat strictly needs it that often — it is the association-building that matters most at this age. Once your puppy reaches the coat type's normal adult schedule, you can move to [the regular interval for that coat type](/blog/dog-grooming-schedule-by-breed).",
          "Keeping the same groomer for these early visits, rather than switching each time, speeds up how quickly your puppy settles — familiarity compounds for puppies the same way it does for anxious adult dogs.",
        ],
      },
    ],
    faqs: [
      {
        question: "At what age should a puppy have their first grooming appointment?",
        answer:
          "Most groomers recommend 12 to 16 weeks old, once core vaccinations are complete. Breeds with continuously-growing coats, like Poodles and Doodles, benefit from starting at the earlier end of that window since their coat can mat before they're full grown.",
      },
      {
        question: "What happens at a puppy's first grooming visit?",
        answer:
          "Usually a bath, a light brush, nail clipping, and at most a light trim — deliberately shorter and gentler than a full adult groom. The goal is building a calm association with handling, not finishing a complete haircut.",
      },
      {
        question: "Does my puppy need all their vaccinations before grooming?",
        answer:
          "Most groomers require the core vaccination series to be complete, since the puppy will be closely handled and may encounter other animals' scent. Confirm this with the specific groomer when booking rather than assuming it isn't required.",
      },
      {
        question: "How often should a puppy be groomed?",
        answer:
          "Roughly every 3 to 4 weeks through the first six months for continuously-growing coats, mainly for gentle, repeated exposure rather than strict coat need. Move to the normal adult schedule for that coat type once your puppy is grown.",
      },
      {
        question: "What if my puppy is scared during their first grooming visit?",
        answer:
          "A good groomer slows down, shortens the session, or stops rather than pushing through — the goal of a first visit is a calm experience, not a complete groom. Mention any nervousness you've noticed at home before the appointment starts.",
      },
      {
        question: "Should I be present during my puppy's first grooming appointment?",
        answer:
          "Most groomers prefer handling the puppy without the owner present, since puppies, like adult dogs, are often calmer without their owner in sight. Ask the groomer's preference when booking.",
      },
    ],
  },
];

export function getPost(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug);
}
