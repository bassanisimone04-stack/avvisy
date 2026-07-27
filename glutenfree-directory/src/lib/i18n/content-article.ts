import type { Article } from "../types";
import type { Locale } from "./locale";
import { makeHeadings, makeContentHtml } from "../mock-articles";

type Section = { h2: string; body: string; h3?: { title: string; body: string }[] };

interface ArticleTranslation {
  title: string;
  excerpt: string;
  authorRole: string;
  sections: Section[];
  keyTakeaways: string[];
  faqs: { question: string; answer: string }[];
  tags: string[];
}

export const ARTICLE_EN: Record<string, ArticleTranslation> = {
  "art-1": {
    title: "Celiac Disease: What It Is, Symptoms and How It's Diagnosed",
    excerpt: "A complete guide to celiac disease: causes, the most common symptoms in adults and children, the diagnostic path, and what to do after diagnosis.",
    authorRole: "Nutritionist & biologist",
    keyTakeaways: [
      "Celiac disease is an autoimmune condition triggered by gluten, not a food allergy or intolerance.",
      "Diagnosis requires blood tests and a duodenal biopsy: don't remove gluten from your diet before completing them.",
      "The only treatment is a lifelong gluten-free diet, which allows symptoms to go into remission.",
      "Screening is recommended for first-degree relatives too, given the genetic component of the disease.",
    ],
    sections: [
      { h2: "What is celiac disease", body: "Celiac disease is an autoimmune condition triggered by ingesting gluten, the protein found in wheat, barley and rye. In genetically predisposed people, gluten triggers an immune response that damages the intestinal villi, impairing nutrient absorption." },
      { h2: "The most common symptoms", body: "Symptoms vary widely from person to person and can appear at any age.", h3: [
        { title: "Gastrointestinal symptoms", body: "Bloating, abdominal pain, alternating diarrhea and constipation, and nausea are the most frequent signs, especially in children." },
        { title: "Extraintestinal symptoms", body: "Chronic fatigue, iron-deficiency anemia, dermatitis herpetiformis, recurring mouth ulcers and early osteoporosis are typical in adults." },
      ] },
      { h2: "How diagnosis works", body: "Diagnosis is based on blood tests for anti-transglutaminase antibodies, followed by an endoscopy with duodenal biopsy to confirm damage to the intestinal villi. It's essential not to remove gluten from the diet before completing all tests." },
      { h2: "After diagnosis: the gluten-free diet", body: "The only effective treatment available today is a strictly gluten-free diet for life. Over time the intestinal lining regenerates and symptoms subside. Relying on AIC-certified venues and products helps avoid cross-contamination in everyday life." },
    ],
    faqs: [
      { question: "Can celiac disease be cured?", answer: "No, there is no definitive cure: management consists of strictly following a gluten-free diet for life." },
      { question: "How long does it take to feel better after diagnosis?", answer: "Symptoms generally improve within a few weeks of removing gluten, while the intestinal lining can take months or years to fully regenerate." },
      { question: "Should family members of a celiac get tested?", answer: "Yes, celiac disease has a genetic component: screening is recommended for first-degree relatives even without obvious symptoms." },
    ],
    tags: ["celiac disease", "diagnosis", "health"],
  },
  "art-2": {
    title: "How to Read Food Labels If You Have Celiac Disease",
    excerpt: "A practical guide to spotting risky ingredients on labels, the Crossed Grain symbol, and the wording you should always check.",
    authorRole: "Food safety content specialist",
    keyTakeaways: [
      "The Crossed Grain symbol is the fastest way to spot an AIC-verified product on the shelf.",
      "Starch, flavorings and yeast can hide gluten: check the AIC Food Guide whenever you're unsure.",
      "The 'gluten-free' claim is regulated in Europe and guarantees a content below 20 ppm.",
      "Even a certified product can get contaminated at home: use dedicated utensils for gluten-free prep.",
    ],
    sections: [
      { h2: "The Crossed Grain symbol", body: "The Crossed Grain is the trademark registered by the Italian Celiac Association (AIC) that identifies products subject to strict annual auditing. It's the fastest and most reliable way to recognize a safe product on the shelf." },
      { h2: "Ingredients to watch out for", body: "Some ingredients require attention because they can hide gluten even in unsuspected products.", h3: [
        { title: "Starch and modified starch", body: "If the source isn't specified (corn, rice), starch may come from wheat: in Europe regulations still require gluten to be declared as an allergen, but checking remains important." },
        { title: "Flavorings and yeast", body: "Yeast and barley malt extract can contain gluten: always check for the 'gluten-free' wording or the AIC Food Guide if in doubt." },
      ] },
      { h2: "The AIC Food Guide: how to use it", body: "The Food Guide is the app and yearly volume that lists thousands of products verified by AIC, updated monthly. It's the most complete tool for shopping safely, even for brands that don't carry the logo on the label." },
      { h2: "Watch out for cross-contamination in the kitchen", body: "Even a certified product can be contaminated if handled with non-dedicated utensils. In the kitchen it helps to have a cutting board, toaster and set of pots reserved exclusively for gluten-free preparation." },
    ],
    faqs: [
      { question: "What does 'may contain traces of gluten' mean?", answer: "It indicates a risk of cross-contamination during production: for celiacs it's best to avoid these products, even if gluten isn't a direct ingredient." },
      { question: "Are 'gluten-free' products automatically safe for celiacs?", answer: "In Europe the 'gluten-free' claim is regulated and means a content below 20 ppm, the limit considered safe for most celiacs." },
      { question: "Where can I find the updated AIC Food Guide?", answer: "It's available as the official AIC app for smartphones, updated monthly with newly verified products." },
    ],
    tags: ["labels", "guides", "food safety"],
  },
  "art-3": {
    title: "Recipe: Homemade Gluten-Free Fresh Pasta",
    excerpt: "The step-by-step method for making elastic, tasty gluten-free fresh pasta, with the right flour blend.",
    authorRole: "Gluten-free food blogger",
    keyTakeaways: [
      "A good bread-and-pasta flour blend based on rice, potato and corn starch gets closest to traditional pasta.",
      "Gluten-free dough is more delicate: work it gently and roll it between two sheets of baking paper.",
      "Gluten-free pasta cooks faster than traditional pasta, so check it often while boiling.",
      "A pinch of xanthan gum and 30 minutes of resting noticeably improve the dough's elasticity.",
    ],
    sections: [
      { h2: "Ingredients for 4 people", body: "250 g of gluten-free flour blend for bread and pasta, 2 whole eggs, 1 tablespoon of extra virgin olive oil, a pinch of salt, lukewarm water as needed." },
      { h2: "Method", body: "Knead flour, eggs, oil and salt until you get a smooth mixture, adding lukewarm water one tablespoon at a time. Unlike traditional dough, gluten-free dough is more delicate and should be worked gently.", h3: [
        { title: "Rolling it out", body: "Roll the dough between two sheets of baking paper to keep it from sticking, using a rolling pin or pasta machine, to the desired thickness." },
        { title: "Cooking", body: "Cook in plenty of salted water for 3-4 minutes: gluten-free pasta cooks faster than traditional pasta, so check it often." },
      ] },
      { h2: "Tips to get it right", body: "Letting the dough rest wrapped in plastic wrap for at least 30 minutes before rolling makes it easier to work with. A teaspoon of xanthan gum can further improve elasticity." },
    ],
    faqs: [
      { question: "Which flour blend works best?", answer: "Blends specifically made for bread and pasta, based on rice flour, potato starch and corn starch, generally give results closest to traditional pasta." },
      { question: "Can you freeze fresh gluten-free pasta?", answer: "Yes, freeze it raw, well floured and spaced apart, and cook it straight from frozen adding one extra minute of cooking time." },
    ],
    tags: ["recipes", "pasta", "cooking"],
  },
  "art-4": {
    title: "Traveling Gluten-Free: 7 Tips for a Safe Holiday",
    excerpt: "How to plan a trip in Italy and abroad as a celiac, from useful apps to translation cards and safe bookings.",
    authorRole: "Travel writer",
    keyTakeaways: [
      "Look up certified restaurants and hotels at your destination before you leave and save them to a shared map.",
      "The multilingual AIC card helps you explain celiac disease to restaurant staff abroad.",
      "Request gluten-free airline meals at least 48 hours ahead, and always pack safe snacks as backup.",
      "Local directories and online communities are the most reliable resource off the beaten tourist path.",
    ],
    sections: [
      { h2: "Before you leave", body: "Looking up certified restaurants and hotels at your destination ahead of time, saving addresses to a shared map, reduces stress during the trip." },
      { h2: "The celiac translation card", body: "AIC provides a card explaining celiac disease translated into several languages, extremely useful for communicating with restaurant staff abroad." },
      { h2: "On planes and trains", body: "Many airlines offer gluten-free meals on request, to be booked at least 48 hours in advance. It's still wise to always carry safe snacks just in case." },
      { h2: "Finding safe places on the spot", body: "Local directories and online communities dedicated to celiacs are the most reliable resource for discovering verified businesses even off the main tourist routes." },
    ],
    faqs: [
      { question: "What is the AIC card for traveling celiacs?", answer: "It's a multilingual document explaining celiac disease and its dietary needs, useful to show restaurant and hotel staff abroad." },
      { question: "Do airlines always guarantee gluten-free meals?", answer: "Availability depends on the airline: you need to request it when booking or with enough notice before the flight." },
    ],
    tags: ["travel", "holidays", "tips"],
  },
  "art-5": {
    title: "Celiac Kids at School: Managing Cafeterias and Field Trips",
    excerpt: "Practical advice for parents on organizing the school cafeteria, field trips and birthday parties for a celiac child.",
    authorRole: "Nutritionist & biologist",
    keyTakeaways: [
      "A gluten-free school meal is a legal right in Italy, at no extra cost for the family.",
      "A medical certificate submitted to the school office is enough to agree on the menu with catering.",
      "Informing teachers ahead of time and packing safe snacks prevents issues during field trips.",
      "Involving your child in choosing gluten-free treats to share helps them enjoy socializing without feeling different.",
    ],
    sections: [
      { h2: "The school cafeteria", body: "Italian law guarantees the right to a gluten-free meal in school cafeterias: it's enough to submit the medical certificate to the school office and agree on the menu with the catering service." },
      { h2: "Field trips and school outings", body: "Informing teachers ahead of time and, if needed, providing safe snacks to bring along prevents uncomfortable situations during outings away from school." },
      { h2: "Birthday parties and socializing", body: "Involving the child in choosing gluten-free sweets and snacks to share with classmates helps them enjoy social life without feeling different." },
    ],
    faqs: [
      { question: "Is the gluten-free school meal free of charge?", answer: "Yes, Italian regulations state that a gluten-free meal in school cafeterias must not involve extra costs for the family." },
      { question: "Do I need a medical certificate for the school cafeteria?", answer: "Yes, you need to submit the diagnosis certification issued by the specialist reference center." },
    ],
    tags: ["kids", "school", "celiac disease"],
  },
  "art-6": {
    title: "Gluten-Free Products: The Most Interesting Novelties of 2026",
    excerpt: "A roundup of the most innovative gluten-free products that hit the shelves this year, from flours to snacks and bread substitutes.",
    authorRole: "Gluten-free food blogger",
    keyTakeaways: [
      "The latest buckwheat- and teff-based mixes come much closer to traditional bread.",
      "Protein snacks made from certified legumes are on the rise, great for a healthy snack on the go.",
      "Frozen fresh gluten-free bread is increasingly available even in large retail chains.",
      "New products can be found in supermarkets with a dedicated corner, specialty shops and online.",
    ],
    sections: [
      { h2: "New flours and bread mixes", body: "The latest generation of mixes based on buckwheat and teff flour offer a richer flavor and a structure closer to traditional bread compared to classic starch-based mixes." },
      { h2: "Gluten-free protein snacks", body: "Protein snacks based on certified legumes are on the rise, designed for those looking for healthy, practical options on the go." },
      { h2: "Fresh bread substitutes", body: "Several artisan bakeries are introducing frozen fresh gluten-free bread lines, now also distributed in large retail chains, widening the available options." },
    ],
    faqs: [
      { question: "Where can I find these new products?", answer: "They're available in supermarkets with a dedicated corner, in specialty shops and, in many cases, online on individual producers' websites." },
    ],
    tags: ["products", "new arrivals", "shopping"],
  },
  "art-7": {
    title: "Gluten-Free Events and Trade Fairs in 2026",
    excerpt: "The calendar of major trade fairs, markets and information days dedicated to celiac disease and gluten-free living in Italy.",
    authorRole: "Food safety content specialist",
    keyTakeaways: [
      "Several Italian cities host gluten-free food fairs every year, with tastings and workshops open to the public.",
      "AIC's regional offices run free meetings on diagnosis and regulatory news for the newly diagnosed.",
      "Celiac communities are increasingly organizing social dinners at certified venues.",
      "The GlutenFree Directory newsletter and local social channels are the easiest way to stay updated.",
    ],
    sections: [
      { h2: "National trade fairs", body: "Every year several Italian cities host gluten-free food fairs, with tastings, workshops and meetings with nutritionists open to the public." },
      { h2: "Local information days", body: "AIC's regional offices regularly organize free meetings on diagnosis, nutrition and regulatory updates, a useful occasion for the newly diagnosed and their families." },
      { h2: "Social events and online communities", body: "More and more celiac communities are organizing social dinners and meetups at certified venues, an easy way to discover new trustworthy businesses in your area." },
    ],
    faqs: [
      { question: "How can I stay updated on upcoming events?", answer: "Subscribing to the GlutenFree Directory newsletter or following local associations' social channels gets you regular updates on scheduled events." },
    ],
    tags: ["events", "trade fairs", "community"],
  },
  "art-8": {
    title: "Gluten-Free Diet and Sports: What to Know for Performance",
    excerpt: "How to plan sports nutrition when following a gluten-free diet, covering carbohydrates, supplementation and practical ideas.",
    authorRole: "Nutritionist & biologist",
    keyTakeaways: [
      "Rice, quinoa, buckwheat and sweet potatoes are ideal complex carbs for pre-race fueling and recovery.",
      "An unbalanced gluten-free diet can be low in fiber and iron: vary the whole grains you eat.",
      "Many energy bars use gluten as a thickener: always choose certified products.",
      "Periodically monitor iron, vitamin D and B vitamins with your doctor or nutritionist.",
    ],
    sections: [
      { h2: "Gluten-free carbohydrates for energy", body: "Rice, quinoa, buckwheat and sweet potatoes are excellent sources of complex carbohydrates, perfect for pre-race fueling and post-workout recovery." },
      { h2: "Watch out for nutritional gaps", body: "A poorly balanced gluten-free diet can be low in fiber and iron: it's important to vary the whole gluten-free grains available and periodically monitor blood values." },
      { h2: "Supplementation and safe bars", body: "Many energy bars contain gluten as a thickener: always choosing certified products avoids unpleasant surprises during races and intense training." },
    ],
    faqs: [
      { question: "Do celiac athletes need specific supplements?", answer: "Not necessarily, but it's useful to monitor iron, vitamin D and B vitamins with your doctor or nutritionist." },
    ],
    tags: ["sports", "health", "nutrition"],
  },
  "art-9": {
    title: "A Balanced Gluten-Free Diet: A Guide to Macronutrients",
    excerpt: "How to build a varied, balanced gluten-free diet, avoiding an excess of industrial substitute products.",
    authorRole: "Nutritionist & biologist",
    keyTakeaways: [
      "Rice, corn, buckwheat, quinoa, legumes and vegetables are naturally gluten-free and should be the base of your diet.",
      "Whole rice and corn versions help cover the fiber intake often lacking in refined gluten-free products.",
      "A simple, repeatable meal plan reduces reliance on industrial substitutes.",
      "Not all industrial gluten-free products are equal: they often have a higher glycemic index and less fiber.",
    ],
    sections: [
      { h2: "Not just industrial substitutes", body: "Rice, corn, buckwheat, quinoa, legumes and vegetables are naturally gluten-free and should form the basis of the diet, more so than packaged substitute products." },
      { h2: "Fiber and gluten-free whole grains", body: "Choosing whole versions of rice and corn, together with legumes and seeds, helps maintain adequate fiber intake, often lacking in diets based on refined gluten-free products." },
      { h2: "A sample day of eating", body: "Breakfast with buckwheat flakes and fruit, lunch with whole grains and lean protein, a light dinner with vegetables and legumes: a simple routine you can repeat every day." },
    ],
    faqs: [
      { question: "Do industrial gluten-free products make you gain more weight?", answer: "Not necessarily, but they often have a higher glycemic index and less fiber: it's good to alternate them with naturally gluten-free grains." },
    ],
    tags: ["nutrition", "diet", "health"],
  },
  "art-10": {
    title: "2026 Regulatory Updates: What Changes for Celiacs in Italy",
    excerpt: "The latest news on reimbursements, food vouchers and regulations for people with celiac disease in Italy, updated for 2026.",
    authorRole: "Food safety content specialist",
    keyTakeaways: [
      "The monthly spending cap for gluten-free products provided by Italy's health service is reviewed periodically.",
      "Always check the updated amounts directly with your local health authority (ASL).",
      "Several regions are updating HACCP guidelines for celiac-friendly restaurant certification.",
      "The voucher can be used at pharmacies and participating retailers after presenting your diagnosis.",
    ],
    sections: [
      { h2: "Monthly food voucher update", body: "The monthly spending cap provided by the National Health Service for gluten-free products is periodically reviewed: it's advisable to check the updated amounts with your local health authority (ASL)." },
      { h2: "New guidelines for the restaurant industry", body: "Several Italian regions are updating HACCP guidelines for restaurants, with stricter requirements for venues seeking celiac certification." },
    ],
    faqs: [
      { question: "Where do I collect the gluten-free product voucher?", answer: "The voucher is issued by your local health authority (ASL) after presenting the diagnosis and can be used at pharmacies and participating retailers." },
    ],
    tags: ["news", "regulation", "aic"],
  },
  "art-11": {
    title: "Perfect Gluten-Free Pizza: Secrets for a Light, Crispy Crust",
    excerpt: "The secrets to a light, elastic, crispy gluten-free pizza dough, with proofing and baking times for a true pizzeria result.",
    authorRole: "Gluten-free food blogger",
    keyTakeaways: [
      "A blend of rice flour, potato starch and corn starch gives an elastic, well-rising base.",
      "A long cold proof (12-24h) improves the flavor and digestibility of gluten-free dough.",
      "Baking on a preheated pizza stone or hot tray helps you get a crispy crust.",
      "A teaspoon of honey in the dough encourages browning and rising.",
    ],
    sections: [
      { h2: "The right flour blend", body: "A successful gluten-free pizza dough starts with a good flour blend: rice, potato starch and corn starch in balanced proportions give elasticity and an airy structure, avoiding a gummy or overly crumbly result." },
      { h2: "The dough and proofing", body: "Knead flour, lukewarm water, yeast, oil and a pinch of salt into a smooth, sticky mixture, typical of gluten-free flours. A long proof, even 12-24 hours in the fridge, improves flavor, structure and digestibility.", h3: [
        { title: "Resting at room temperature", body: "Before rolling out the dough, let it come back to room temperature for at least an hour: it will be easier to work with and bake more evenly." },
        { title: "Shaping without breaking the dough", body: "Shape it directly on a lightly oiled tray or baking paper, using wet hands: gluten-free dough tears easily if rolled out with a pin." },
      ] },
      { h2: "The perfect bake", body: "Baking on a preheated pizza stone, or on an already hot tray in a static oven at maximum temperature, helps you get a crispy crust and an even bake in just a few minutes." },
      { h2: "Tips for light toppings", body: "Avoid overloading the pizza with too many wet ingredients, which can make the base soggy: simple, balanced toppings work best, adding any vegetables already cooked." },
    ],
    faqs: [
      { question: "Why is gluten-free dough stickier?", answer: "Gluten-free flours absorb water differently and lack the gluten network that gives structure: it's normal for the dough to be softer and need wet hands to work with." },
      { question: "Can gluten-free pizza dough be frozen?", answer: "Yes, freeze it already shaped into a base, ready to be topped and baked straight from frozen with a few extra minutes of baking time." },
    ],
    tags: ["recipes", "pizza", "cooking"],
  },
  "art-12": {
    title: "Cross-Contamination in the Kitchen: Golden Rules for a Safe Home",
    excerpt: "Best practices for avoiding gluten cross-contamination in a kitchen shared with non-celiac family members, from the pantry to the stove.",
    authorRole: "Nutritionist & biologist",
    keyTakeaways: [
      "Even a few milligrams of gluten can trigger a reaction in celiacs: crumbs or shared utensils are enough.",
      "Cutting boards, toasters and colanders should always be dedicated, or washed thoroughly before use.",
      "In the pantry, keep gluten-free products in closed, clearly labeled containers, separate from the rest.",
      "Wash hands, work surfaces and utensils between preparing gluten and gluten-free dishes.",
    ],
    sections: [
      { h2: "Why cross-contamination is dangerous", body: "For a celiac, even trace amounts of gluten equal to a few crumbs can trigger an immune response and damage the intestinal villi: that's why cross-contamination needs the same attention as removing gluten directly from the diet." },
      { h2: "The riskiest utensils", body: "Some kitchen tools easily trap flour or crumb residue and need particular care.", h3: [
        { title: "Toasters and grills", body: "The toaster is one of the riskiest items: it's best to have one dedicated exclusively to gluten-free bread, or use dedicated toaster bags." },
        { title: "Cutting boards and colanders", body: "Wooden cutting boards and pasta colanders easily trap gluten residue in their pores: it's best to have dedicated versions, perhaps a different color so they're easy to spot at a glance." },
      ] },
      { h2: "Organizing the pantry", body: "Storing gluten-free products in closed, clearly labeled containers, ideally on a separate shelf, reduces the risk of accidental contact with traditional flour or bread, especially in a kitchen shared with non-celiac family members." },
      { h2: "Good daily habits", body: "Always washing hands, work surfaces and utensils thoroughly between preparing a dish with gluten and one without, and cooking gluten-free food first when sharing the same stove, are simple habits that dramatically reduce the risk." },
    ],
    faqs: [
      { question: "Is thoroughly washing a utensil enough to make it safe?", answer: "In most cases a thorough wash with hot water and soap is enough, but for porous items like wood or scratched plastic it's safer to have dedicated versions." },
      { question: "Can the oven be shared between gluten and gluten-free bread?", answer: "Yes, but it's important to clean the racks well and bake gluten-free bread on its own tray, avoiding direct contact with surfaces that have baked gluten-containing products." },
    ],
    tags: ["guides", "food safety", "celiac disease"],
  },
  "art-13": {
    title: "Celiac Disease and Pregnancy: What to Know for a Smooth Journey",
    excerpt: "How to manage a gluten-free diet during pregnancy, covering increased nutritional needs, routine checks and myths worth debunking.",
    authorRole: "Nutritionist & biologist",
    keyTakeaways: [
      "A well-balanced gluten-free diet carries no extra risk in pregnancy compared to a diet with gluten.",
      "Pregnancy increases the need for iron, folic acid and calcium: choose adequate gluten-free sources.",
      "Undiagnosed celiac disease, on the other hand, is linked to a higher risk of complications, hence the importance of screening.",
      "It's worth consulting a nutritionist for a personalized meal plan throughout the nine months.",
    ],
    sections: [
      { h2: "Gluten-free diet and pregnancy: no extra risk", body: "A correctly balanced gluten-free diet carries no particular risk for pregnancy: what matters is ensuring an adequate intake of all necessary nutrients, just like for any other pregnancy." },
      { h2: "Nutrients to keep an eye on", body: "Pregnancy increases the need for some key nutrients, which need to come from safe sources for those on a gluten-free diet.", h3: [
        { title: "Iron and folic acid", body: "Legumes, leafy greens and fortified gluten-free cereals are good sources, to be supplemented as directed by your obstetrician." },
        { title: "Calcium and vitamin D", body: "Dairy, fortified plant-based drinks and oily fish help meet the requirement, particularly important in the third trimester." },
      ] },
      { h2: "Undiagnosed celiac disease: the risks to know", body: "Undiagnosed celiac disease, unlike celiac disease properly managed with diet, is linked to a higher risk of complications such as anemia, preterm birth and low birth weight: this is why timely diagnosis matters, including when planning a pregnancy." },
      { h2: "The support of a nutritionist", body: "Consulting a nutritionist experienced in celiac disease makes it possible to build a personalized meal plan for the nine months, taking into account any prior deficiencies and the specific needs of each trimester." },
    ],
    faqs: [
      { question: "Can celiac disease first be discovered during pregnancy?", answer: "Yes, in some cases symptoms appear or worsen specifically during pregnancy, leading to a diagnosis that hadn't surfaced before." },
      { question: "Do celiac women need special supplementation during pregnancy?", answer: "The standard supplements recommended in pregnancy (folic acid, iron, vitamin D) still apply: it's important to choose certified gluten-free formulations and check with your doctor." },
    ],
    tags: ["celiac disease", "pregnancy", "health"],
  },
  "art-14": {
    title: "The Best Italian Cities for a Gluten-Free Vacation",
    excerpt: "From Bologna to Milan to Puglia: an overview of the Italian destinations with the highest density of certified venues for celiacs.",
    authorRole: "Travel writer",
    keyTakeaways: [
      "Emilia-Romagna and Lombardy are among the regions with the most AIC-certified venues per capita.",
      "Many art cities now offer gluten-free food trails designed specifically for celiac tourists.",
      "Booking ahead at the most popular restaurants helps you avoid waits or being turned away on weekends.",
      "Local directories remain the most up-to-date tool for discovering newly certified venues.",
    ],
    sections: [
      { h2: "Bologna and Emilia-Romagna", body: "Bologna, historically the capital of Italian food tradition, has seen a growing number of restaurants and artisan pasta shops specializing in gluten-free preparations, often with menus dedicated to homemade fresh pasta." },
      { h2: "Milan, between restaurants and street food", body: "Milan offers one of the highest concentrations of certified venues in Italy, from gluten-free pizzerias to gourmet restaurants, plus a growing offer of street food and dedicated bakeries downtown and in nearby neighborhoods." },
      { h2: "Puglia and southern Italy", body: "Southern Italy too, led by Puglia and Sicily, has expanded its range of certified accommodations and restaurants in recent years, making it easier to plan a seaside vacation without dietary compromises." },
      { h2: "Practical tips for planning the trip", body: "Booking ahead at the most popular venues, especially on weekends and during high season, and checking up-to-date directories with verified reviews helps you build a safe, surprise-free food itinerary." },
    ],
    faqs: [
      { question: "Which Italian regions have the most certified venues for celiacs?", answer: "Emilia-Romagna, Lombardy and Lazio are generally among the regions with the highest concentration of certified venues, but the offer is growing quickly across all of Italy." },
      { question: "Is it always necessary to book ahead?", answer: "Not always, but at well-known venues and on weekends it's advisable to book to make sure you get a table and avoid waiting." },
    ],
    tags: ["travel", "italy", "restaurants"],
  },
};

const COMMENT_EN: Record<string, string> = {
  "Sara V.": "Very clear article, it helped me a lot right after my diagnosis. Thank you!",
  "Paolo N.": "Extremely useful, sharing it in the support group I follow.",
  "Ilaria C.": "Finally an explanation without too much jargon, well done.",
};

export function getLocalizedArticle(article: Article, locale: Locale): Article {
  if (locale === "it") return article;
  const tr = ARTICLE_EN[article.id];
  if (!tr) return article;
  return {
    ...article,
    title: tr.title,
    metaTitle: `${tr.title} | GlutenFree Directory`,
    metaDescription: tr.excerpt,
    excerpt: tr.excerpt,
    authorRole: tr.authorRole,
    headings: makeHeadings(tr.sections),
    contentHtml: makeContentHtml(tr.sections),
    keyTakeaways: tr.keyTakeaways,
    faqs: tr.faqs,
    tags: tr.tags,
    comments: article.comments.map((c) => ({ ...c, body: COMMENT_EN[c.author] ?? c.body })),
  };
}
