import type { Article } from "../types";
import type { Locale } from "./locale";
import { makeHeadings, makeContentHtml } from "../mock-articles";

type Section = { h2: string; body: string; h3?: { title: string; body: string; image?: { src: string; alt: string } }[] };

interface ArticleTranslation {
  title: string;
  excerpt: string;
  authorRole: string;
  sections: Section[];
  keyTakeaways: string[];
  faqs: { question: string; answer: string }[];
  tags: string[];
  metaTitle?: string;
  metaDescription?: string;
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
      "The Mappa Senza Glutine blog and local associations' social channels are the easiest way to stay updated.",
    ],
    sections: [
      { h2: "National trade fairs", body: "Every year several Italian cities host gluten-free food fairs, with tastings, workshops and meetings with nutritionists open to the public." },
      { h2: "Local information days", body: "AIC's regional offices regularly organize free meetings on diagnosis, nutrition and regulatory updates, a useful occasion for the newly diagnosed and their families." },
      { h2: "Social events and online communities", body: "More and more celiac communities are organizing social dinners and meetups at certified venues, an easy way to discover new trustworthy businesses in your area." },
    ],
    faqs: [
      { question: "How can I stay updated on upcoming events?", answer: "Following the Mappa Senza Glutine blog and local associations' social channels gets you regular updates on scheduled events." },
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
  "art-15": {
    title: "The Best Gluten-Free Restaurants and Pizzerias in Milan: The Complete 2026 Guide",
    excerpt: "Where to eat gluten-free in Milan with confidence: our selection of certified restaurants, pizzerias and bakeries, from dedicated kitchens to scrupulous attention to cross-contamination.",
    authorRole: "Gluten-free food blogger",
    keyTakeaways: [
      "Milan now offers dozens of AIC-certified venues, from restaurants with 100% gluten-free kitchens to pizzerias with dedicated ovens.",
      "Always mention celiac disease when booking, not just at the table, to reduce the risk of mistakes in the kitchen.",
      "Venues with AIC certification and separate kitchens or ovens offer the strongest guarantees against cross-contamination.",
      "Booking ahead is almost mandatory at the most popular venues, especially on weekends.",
    ],
    sections: [
      { h2: "Eating gluten-free in Milan: don't let the fear of contamination hold you back", body: "Anyone with celiac disease knows it well: the hardest part of eating out isn't choosing what to order, it's trusting the venue. The fear of cross-contamination can turn even a simple pizza night with friends into a source of anxiety. The good news is that <strong>Milan is now one of the best-equipped Italian cities for gluten-free dining</strong>: from pizzerias with dedicated ovens to restaurants with fully gluten-free kitchens, gluten-free venues in Milan keep growing. In this guide we've gathered our trusted picks, verified by the Mappa Senza Glutine community, to help you find where to eat gluten-free in Milan without compromising on safety." },
      { h2: "Frequently asked questions about eating gluten-free in Milan", body: "Before we get to the addresses, let's answer the questions we hear most from celiacs planning a dinner or a weekend in the city.", h3: [
        { title: "Where can I eat gluten-free safely in Milan?", body: "The safest venues in Milan are those with AIC certification, a dedicated kitchen or oven, and a good track record with celiac diners, like La Rosa dei Venti or Be Bop. Avoid venues that only offer generic \"gluten-free options\" without specific contamination controls: always check the Mappa Senza Glutine directory before booking." },
        { title: "Is it risky to eat out in Milan if I have celiac disease?", body: "It isn't risky if you choose venues equipped with verified anti-contamination procedures, which are increasingly common in the city. The risk rises at generic restaurants that add \"gluten-free\" dishes to the menu without training staff or separating cooking equipment: checking in advance remains the golden rule." },
        { title: "How can I quickly find a gluten-free restaurant near me in Milan?", body: "The fastest way is to use a geolocated directory with filters for AIC certification and venue category. Searching only on generic Google Maps often returns unverified venues: it's better to rely on sources like ours, which collect real reports from the celiac community." },
      ] },
      { h2: "The best gluten-free pizzerias in Milan", body: "Pizza remains one of the highest cross-contamination risks, since wheat flour spreads easily in a shared oven: that's why we always look for venues with a <strong>separate or dedicated oven</strong> for gluten-free pizzas.", h3: [
        { title: "Be Bop", body: "A short walk from the Navigli, <a href=\"/en/directory/be-bop-milano\">Be Bop</a> is a restaurant and pizzeria open since 1986 that serves pizza and traditional dishes also in gluten-free versions, plus vegan options. A convenient pick for gluten-free pizza in the Navigli area without limiting the rest of the menu.", image: { src: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=75", alt: "Freshly baked gluten-free pizza" } },
      ] },
      { h2: "Gluten-free restaurants in Milan: where you can sit down worry-free", body: "For a more structured dinner, here is the restaurant we recommend to anyone looking for maximum peace of mind about cross-contamination.", h3: [
        { title: "La Rosa dei Venti", body: "In the Sempione/Bullona area, <a href=\"/en/directory/la-rosa-dei-venti-milano\">La Rosa dei Venti</a> is a historic fish restaurant open since 2001, also featured in the Michelin Guide and <strong>AIC certified</strong>: it offers a selection of gluten-free dishes, including bread and pasta made to order.", image: { src: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=75", alt: "Plated dish at an elegant restaurant" } },
      ] },
      { h2: "AIC certification, menus and dedicated kitchens: the technical safety questions", body: "Now that you've seen the venues, it's worth understanding what actually separates a safe experience from a risky one: here are the more technical questions we get about food safety.", h3: [
        { title: "What's the difference between an AIC-certified restaurant and a non-certified one?", body: "An AIC-certified venue has passed annual checks on procedures, suppliers and staff training on cross-contamination. A non-certified venue can still be safe, but the guarantee depends only on the direct experience of those who've tried it: certification reduces the margin for error." },
        { title: "How do I read a gluten-free menu at a restaurant?", body: "A good gluten-free menu clearly marks \"gluten-free\" dishes and specifies whether they're prepared in a dedicated area or with the same equipment as other dishes. If the menu doesn't make this clear, it's always best to ask directly before ordering, rather than assuming." },
        { title: "What does \"dedicated kitchen\" mean and why does it matter so much?", body: "A dedicated kitchen is a separate area used exclusively for gluten-free preparation, with no contact with flour or \"regular\" utensils. It's the element that offers the strongest guarantee against cross-contamination, more than simply having gluten-free dishes on the menu." },
        { title: "Can a \"gluten-free\" dish still get contaminated during cooking?", body: "Yes, if it's cooked in the same water, fryer or grill used for dishes containing gluten, even if the starting ingredient is gluten-free. That's why asking whether cooking is done with dedicated equipment matters more than the label on the dish alone." },
      ] },
      { h2: "Gluten-free bakeries and breakfast spots in Milan", body: "Breakfast can be a moment of relaxation too, not stress: look for labs with a corner or oven entirely dedicated to gluten-free, verified through AIC certification or real community reviews, before choosing where to eat. The Mappa Senza Glutine directory lists Milan's verified bakeries and cafés, updated as new venues are checked." },
      { h2: "Practical tips for eating gluten-free in Milan safely", body: "A few extra precautions help you enjoy the experience without stress: <ul><li><strong>Book ahead</strong>, especially at the most popular venues and on weekends, when the kitchen is at full capacity.</li><li><strong>Always mention celiac disease</strong> when booking, not just at the table, so the staff can prepare in advance.</li><li><strong>Ask whether the kitchen or oven is dedicated</strong> or shared: well-trained staff will answer confidently and without hesitation.</li><li><strong>Check the venue's AIC certification</strong>, an extra guarantee of periodic food-safety checks.</li><li><strong>Always carry a few safe snacks</strong>, useful in case of unexpected delays.</li></ul>" },
      { h2: "Bookings, takeaway and kids: the practical questions before you go out", body: "One last set of practical questions, useful for planning your gluten-free outing in Milan.", h3: [
        { title: "Do I need to book ahead at gluten-free restaurants in Milan?", body: "Yes, it's strongly recommended at the most popular venues, especially on weekends, because the dedicated kitchen can only handle a limited number of gluten-free covers. Booking also lets you mention celiac disease in advance, so staff can prepare before you arrive." },
        { title: "Can I bring celiac children to a gluten-free restaurant in Milan?", body: "Yes, venues with a dedicated kitchen are generally the safest choice for celiac children too, often with menus designed specifically for them. It's still useful to mention this when booking, specifying the child's age for more attentive service." },
        { title: "Are there safe gluten-free takeaway options in Milan?", body: "Yes, many certified venues also offer takeaway prepared with the same dedicated procedures as dine-in service. Always check that the packaging is sealed separately from other orders, to avoid contamination during transport." },
      ] },
    ],
    faqs: [
      { question: "What are the best gluten-free restaurants in Milan?", answer: "In Milan, we'd point to La Rosa dei Venti, an AIC-certified fish restaurant, and Be Bop, a restaurant and pizzeria near the Navigli with gluten-free pizza: both listed in the Mappa Senza Glutine directory." },
      { question: "How can I tell if a restaurant in Milan is really safe for celiacs?", answer: "Check for AIC certification, ask whether the kitchen and oven are dedicated or separate, and rely on verified reviews from other celiacs, like the ones in our directory." },
      { question: "Do I always need to book ahead at gluten-free restaurants in Milan?", answer: "Not always, but it's strongly recommended at the most popular venues and on weekends, when demand is higher and dedicated spots can fill up quickly." },
    ],
    tags: ["milan", "restaurants", "pizzerias", "guides"],
  },
  "art-16": {
    title: "What Can a Celiac Eat? The Complete Guide to Safe and Unsafe Foods",
    excerpt: "Which foods are safe for celiacs and which should always be avoided: a practical guide to grocery shopping and cooking gluten-free without doubts or contamination risks.",
    authorRole: "Nutritionist & biologist",
    keyTakeaways: [
      "Grains like wheat, barley, rye and their derivatives should always be avoided: they're the main sources of gluten in the Italian diet.",
      "Rice, corn, buckwheat, quinoa and legumes are naturally gluten-free and can be eaten freely.",
      "Many processed foods (sauces, stock cubes, cold cuts) can contain hidden gluten: always check the label or the AIC Food Guide.",
      "The Crossed Grain symbol on packaging remains the fastest way to spot a safe product on the shelf.",
    ],
    sections: [
      { h2: "What does \"eating gluten-free\" really mean", body: "Getting a celiac disease diagnosis means rethinking your grocery shopping and kitchen habits from scratch, and in the first weeks the most common question is always the same: <strong>what can I actually eat without risk?</strong> The good news is that there are plenty of naturally gluten-free foods, and the diet can stay varied and enjoyable. The real challenge lies in processed foods, where gluten can hide in ingredients you wouldn't expect, like thickeners, stock cubes or ready-made sauces." },
      { h2: "Foods that are always safe for a celiac", body: "These are the food groups you can rely on without worry, naturally gluten-free.", h3: [
        { title: "Gluten-free grains and flours", body: "Rice, corn, buckwheat, quinoa, amaranth, millet and the flours made from them are naturally gluten-free and form the safe backbone of a celiac's diet, as long as they haven't been contaminated during processing or packaging." },
        { title: "Fresh fruit, vegetables, meat and fish", body: "Fresh fruit and vegetables, meat, fish and plain eggs contain no gluten: the risk only appears if they're breaded, floured, or cooked alongside gluten-containing foods on the same surface." },
        { title: "Legumes and nuts", body: "Legumes such as chickpeas, lentils and beans, as well as plain nuts, are safe and provide an excellent source of plant protein and fiber in a gluten-free diet." },
      ] },
      { h2: "Foods to always avoid", body: "On the other hand, these foods naturally contain gluten and should always be excluded from a celiac's diet.", h3: [
        { title: "Wheat, barley, rye and their derivatives", body: "Wheat, spelt, barley, rye, kamut and their derivatives (bread, pasta, pizza, traditional biscuits) contain gluten and should always be avoided, unless explicitly formulated and certified gluten-free." },
        { title: "Oats: a special case", body: "Oats don't naturally contain gluten, but are often contaminated during growing or processing: only eat oats specifically certified \"gluten-free\" on the packaging." },
      ] },
      { h2: "Hidden-risk foods: when you need to read the label", body: "Some processed products can contain gluten even when you'd least expect it: <ul><li><strong>Ready-made sauces and condiments</strong>, often thickened with wheat flour.</li><li><strong>Stock cubes and soup mixes</strong>, which may contain wheat starch.</li><li><strong>Cold cuts and cured meats</strong>, where gluten can appear as a thickener or flavoring.</li><li><strong>Ice cream and industrial desserts</strong>, due to wafers, crumbled biscuits or wheat-based thickeners.</li><li><strong>Traditional beer</strong>, made with malted barley, unlike certified gluten-free beers.</li></ul> In all these cases, there's only one golden rule: <strong>always check the label</strong> or consult the AIC Food Guide before buying." },
      { h2: "How to recognize a safe product: the Crossed Grain symbol and label wording", body: "The Crossed Grain symbol, managed by AIC, is the fastest way to spot a product verified annually on the shelf. Alternatively, the \"gluten-free\" claim is regulated at the European level and guarantees a content below 20 ppm, the safety threshold recognized even for the most sensitive celiacs." },
    ],
    faqs: [
      { question: "Can a celiac eat rice and corn without any problems?", answer: "Yes, rice and corn are naturally gluten-free and form a safe base for the diet, provided they haven't been processed in facilities at risk of cross-contamination with gluten-containing grains." },
      { question: "Does gluten-free oats really exist?", answer: "Yes, there are oat varieties grown and processed in dedicated supply chains, certified \"gluten-free\" on the label: only these are safe for celiacs, while regular oats should be avoided due to contamination risk." },
      { question: "How can I tell if a processed product contains hidden gluten?", answer: "Always check the ingredient list and look for the \"gluten-free\" claim or the Crossed Grain symbol: when in doubt, the AIC Food Guide is the most reliable tool for checking thousands of products." },
    ],
    tags: ["nutrition", "celiac disease", "guides"],
  },
  "art-17": {
    title: "How Much Does a Gluten-Free Diet Cost? Costs, AIC Vouchers and Tax Deductions",
    excerpt: "How much more people on a gluten-free diet spend, how the AIC card and pharmacy vouchers work, and which tax deductions celiacs are entitled to in Italy.",
    authorRole: "Food safety content specialist",
    keyTakeaways: [
      "Gluten-free products cost on average 2 to 4 times more than their gluten-containing equivalents, especially bread and pasta.",
      "Italy's National Health Service provides a monthly voucher usable at pharmacies and partner stores to buy certified substitute products.",
      "The voucher amount varies by age and gender and is periodically updated by the Ministry of Health.",
      "Some healthcare expenses related to celiac disease are also tax-deductible on your annual tax return.",
    ],
    sections: [
      { h2: "Why a gluten-free diet costs more", body: "Anyone diagnosed with celiac disease soon runs into a practical reality: gluten-free products, especially bread, pasta and baked goods, are on average priced higher than their traditional equivalents, due to dedicated production chains, stricter controls and lower production volumes. Knowing the economic support tools provided by Italy's National Health Service helps manage this expense without giving up quality or food safety." },
      { h2: "The AIC card and the monthly voucher for gluten-free products", body: "Here's how Italy's main economic support tool for celiacs actually works.", h3: [
        { title: "How to get the monthly voucher", body: "After a celiac disease diagnosis, the specialist doctor issues a certification that lets you apply at your local ASL (health authority) for a monthly voucher, usable at pharmacies and partner stores to buy gluten-free substitute products listed in the AIC Food Guide." },
        { title: "How much the voucher is worth and how it works", body: "The amount varies by age and gender brackets, set and updated by the Ministry of Health, and is generally higher for teenagers still growing. The voucher is loaded onto a health card or issued via a paper list, depending on the region of residence, and can only be used for products actually listed in the Food Guide." },
      ] },
      { h2: "Tax deductions related to celiac disease", body: "Besides the monthly voucher, some healthcare expenses closely tied to managing celiac disease, such as specialist visits or diagnostic tests not covered by the National Health Service, may qualify as deductible expenses on your tax return: it's always advisable to keep receipts and check with an accountant or tax assistance center which items are actually deductible for the relevant tax year." },
      { h2: "How to save money without compromising on safety", body: "A few precautions help keep costs down without ever compromising on food safety: <ul><li><strong>Always use the monthly voucher</strong> for staples like bread, pasta and flours, where the savings are greatest.</li><li><strong>Focus on naturally gluten-free foods</strong> like rice, corn, legumes and vegetables, often cheaper than packaged substitute products.</li><li><strong>Compare prices between pharmacies, supermarkets and specialty stores</strong>, which can vary significantly for the same product.</li><li><strong>Cook at home when possible</strong>, such as fresh pasta, to cut the cost of ready-made products.</li></ul>" },
    ],
    faqs: [
      { question: "Who is entitled to the monthly voucher for gluten-free products?", answer: "The voucher is available to anyone diagnosed with celiac disease or dermatitis herpetiformis certified by a specialist, and can be requested at the ASL of residence regardless of age." },
      { question: "Does the voucher cover the entire cost of gluten-free products?", answer: "Not always: the amount is calculated monthly and by age bracket, so it may not cover the full expense, especially for families with higher consumption or specific needs." },
      { question: "Are gluten-free restaurant meals tax-deductible?", answer: "No, the voucher and tax deductions mainly cover substitute products bought at pharmacies or partner stores and certain healthcare expenses, not restaurant meals." },
    ],
    tags: ["celiac disease", "vouchers", "guides", "rights"],
  },
  "art-18": {
    title: "Gluten Sensitivity or Celiac Disease? The Differences You Need to Know",
    excerpt: "Celiac disease, non-celiac gluten sensitivity and wheat allergy aren't the same thing: here's how the symptoms, diagnosis and management of each condition differ.",
    authorRole: "Nutritionist & biologist",
    keyTakeaways: [
      "Celiac disease is an autoimmune condition with documentable intestinal damage; gluten sensitivity is not.",
      "Non-celiac gluten sensitivity causes similar symptoms but without the antibodies or villous damage typical of celiac disease.",
      "Wheat allergy is a third, distinct condition, immune-mediated but not autoimmune, with reactions that can occur quickly after ingestion.",
      "Only a medical diagnosis, not self-assessment of symptoms, can reliably distinguish between the three conditions.",
    ],
    sections: [
      { h2: "Why it's easy to confuse celiac disease and gluten sensitivity", body: "Bloating, fatigue, headaches and intestinal discomfort after eating gluten-containing foods can have very different origins, and it's common for people experiencing them to wonder whether it's celiac disease, simple sensitivity, or something else. Correctly distinguishing between these conditions isn't just a matter of terminology: it radically changes the diagnostic path and day-to-day management." },
      { h2: "Celiac disease: an autoimmune condition with documentable damage", body: "Celiac disease is an autoimmune condition in which gluten triggers an immune response that damages the intestinal villi, damage that can be detected with specific blood tests and confirmed with a duodenal biopsy. It's the only one of the three conditions with an objective, internationally standardized diagnostic path." },
      { h2: "Non-celiac gluten sensitivity: similar symptoms, different mechanism", body: "A real but still less understood condition than celiac disease, which deserves to be carefully distinguished.", h3: [
        { title: "How it shows up", body: "People with non-celiac gluten sensitivity can have symptoms very similar to celiac disease, such as bloating, abdominal pain and fatigue, but without the specific antibodies of celiac disease or the villous damage found on biopsy." },
        { title: "How it's diagnosed", body: "There's no specific test for gluten sensitivity: diagnosis is reached by exclusion, after ruling out celiac disease and wheat allergy with the appropriate tests, then observing symptom improvement on a gluten-free diet." },
      ] },
      { h2: "Wheat allergy: a third condition, not to be confused with the first two", body: "Wheat allergy is an immune reaction mediated by IgE antibodies, similar to other food allergies, which can appear quickly after ingestion with symptoms like hives, swelling or, in more severe cases, breathing difficulties. Unlike celiac disease, it doesn't concern gluten alone but wheat proteins as a whole, and is diagnosed with specific allergy tests such as skin prick tests or specific IgE blood tests." },
      { h2: "Why a medical diagnosis is always essential", body: "Removing gluten from your diet without a clear diagnosis carries more than one concrete risk: <ul><li><strong>It makes a celiac disease diagnosis impossible</strong>, since testing requires gluten to still be present in the diet.</li><li><strong>It can mask other conditions</strong> that require specific treatment beyond diet alone.</li><li><strong>It risks leading to an unbalanced diet</strong> if started without the support of a specialist or nutritionist.</li></ul> That's why, faced with persistent symptoms after eating gluten, the first step should always be a medical evaluation, not removing gluten from your diet on your own." },
    ],
    faqs: [
      { question: "Is gluten sensitivity as dangerous as celiac disease?", answer: "No, non-celiac gluten sensitivity doesn't cause the autoimmune damage to the intestinal villi typical of celiac disease, even though the symptoms experienced can be just as bothersome in daily life." },
      { question: "Can I test for gluten sensitivity on my own?", answer: "No, there's no specific lab test for gluten sensitivity: diagnosis first requires ruling out celiac disease and wheat allergy with the support of a specialist doctor." },
      { question: "Do I need to stop eating gluten before testing if I suspect celiac disease?", answer: "No, it's essential to keep eating gluten until all testing is complete: removing it early can skew the results of blood tests and biopsy." },
    ],
    tags: ["celiac disease", "gluten sensitivity", "health"],
  },
  "art-19": {
    title: "The Best Gluten-Free Restaurants and Pizzerias in Rome: The Complete 2026 Guide",
    excerpt: "Where to eat gluten-free in Rome with confidence: traditional trattorias, pizzerias with dedicated ovens and certified bakeries, from gluten-free cacio e pepe to scrupulous attention to cross-contamination.",
    authorRole: "Gluten-free food blogger",
    keyTakeaways: [
      "Rome now has AIC-certified trattorias and pizzerias able to reinvent classics like cacio e pepe and crispy Roman-style pizza gluten-free.",
      "Mentioning celiac disease when booking, not just at the table, helps staff prepare in advance.",
      "Venues with dedicated kitchens or ovens and AIC certification offer the strongest guarantees against cross-contamination.",
      "On weekends and in the most touristy neighborhoods, booking ahead is almost always necessary.",
    ],
    sections: [
      { h2: "Eating gluten-free in Rome: between classic dishes and the fear of contamination", body: "Cacio e pepe, amatriciana, suppli: Roman cuisine is among Italy's most beloved, but for celiacs it can also seem among the hardest to navigate safely, given how many dishes rely on fresh pasta and shared frying. The good news is that <strong>Rome now counts a growing number of certified venues</strong>, able to reinvent even the most traditional dishes gluten-free. In this guide we've gathered our trusted picks, verified by the Mappa Senza Glutine community, to help you find where to eat gluten-free in Rome without giving up tradition or safety." },
      { h2: "Frequently asked questions about eating gluten-free in Rome", body: "Before we get to the addresses, let's answer the questions we hear most from celiacs visiting or living in the city.", h3: [
        { title: "Where can I eat gluten-free safely in Rome?", body: "The safest venues in Rome are those with AIC certification, a dedicated kitchen or oven, and a good track record with celiac diners, like Il Secchio e l'Olivaro or Fornerie Alessandrino. Avoid venues that only offer generic \"gluten-free options\" without specific contamination controls: always check the Mappa Senza Glutine directory before booking." },
        { title: "Is it risky to eat out in Rome if I have celiac disease?", body: "It isn't risky if you choose venues equipped with verified anti-contamination procedures, increasingly common even in the most touristy neighborhoods. The risk rises at generic trattorias that add \"gluten-free\" dishes to the menu without training staff or separating cooking equipment: checking in advance remains the golden rule." },
        { title: "How can I quickly find a gluten-free restaurant near me in Rome?", body: "The fastest way is to use a geolocated directory with filters for AIC certification and venue category. Searching only on generic Google Maps often returns unverified venues: it's better to rely on sources like ours, which collect real reports from the celiac community." },
      ] },
      { h2: "The best gluten-free pizzerias in Rome", body: "Roman-style pizza, thin and crispy, requires delicate dough handling: that's why we always look for venues with a <strong>separate or dedicated oven</strong> for gluten-free pizzas.", h3: [
        { title: "Il Secchio e l'Olivaro", body: "In the Ostiense district, <a href=\"/en/directory/il-secchio-e-l-olivaro-roma\">Il Secchio e l'Olivaro</a> is a pizzeria and bruschetteria open since 1999, known for its tall <strong>wood-fired</strong> pizzas: it offers a gluten-free menu prepared in a dedicated lab.", image: { src: "https://images.unsplash.com/photo-1594007654729-407eedc4be65?auto=format&fit=crop&w=800&q=75", alt: "Freshly baked tall pizza" } },
      ] },
      { h2: "Gluten-free restaurants and trattorias in Rome: where you can sit down worry-free", body: "For a more structured dinner, here is the restaurant we recommend to anyone looking for maximum peace of mind about cross-contamination.", h3: [
        { title: "Fornerie Alessandrino", body: "In the Alessandrino district, <a href=\"/en/directory/fornerie-alessandrino-roma\">Fornerie Alessandrino</a> combines a restaurant, grill, pizzeria and burger joint with a <strong>kitchen entirely AIC certified</strong> and separate from the rest of the premises: it offers gluten-free pizza, grilled meat and burgers, plus vegan and lactose-free options.", image: { src: "https://images.unsplash.com/photo-1428515613728-6b4607e44363?auto=format&fit=crop&w=800&q=75", alt: "Table with dishes at a restaurant" } },
      ] },
      { h2: "Gluten-free bakeries and breakfast spots in Rome", body: "Breakfast can be a moment of relaxation too, not stress: look for labs with a corner or oven entirely dedicated to gluten-free, verified through AIC certification or real community reviews, before choosing where to eat. The Mappa Senza Glutine directory lists Rome's verified bakeries and cafés, updated as new venues are checked." },
      { h2: "AIC certification, menus and dedicated kitchens: the technical safety questions", body: "Now that you've seen the venues, it's worth understanding what actually separates a safe experience from a risky one in Rome.", h3: [
        { title: "What's the difference between an AIC-certified venue and a non-certified one?", body: "An AIC-certified venue has passed annual checks on procedures, suppliers and staff training on cross-contamination. A non-certified venue can still turn out to be safe, but the guarantee rests only on the direct experience of those who've tried it: certification significantly reduces the margin for error." },
        { title: "How do I read a gluten-free menu at a Roman trattoria?", body: "A good gluten-free menu clearly marks which dishes are \"gluten-free\" and whether they're prepared in a dedicated area or with the same equipment used for other dishes. If it isn't specified, it's better to ask directly before ordering, especially for complex preparations like fresh pasta." },
        { title: "Why is a dedicated kitchen so important for dishes like cacio e pepe?", body: "Dishes like cacio e pepe or carbonara require handmade fresh pasta: without a dedicated work area, the risk of contact with wheat flour while rolling it out is very high. A separate kitchen drastically reduces this risk compared to a simple \"gluten-free\" variant of the traditional dish." },
        { title: "Can a \"gluten-free\" Roman dish still get contaminated during cooking?", body: "Yes, if cooked in the same water, fryer or pan used for gluten-containing dishes, even starting from a gluten-free ingredient. That's why, with dishes like suppli or Roman fried snacks, it's always worth asking whether frying is done in dedicated oil." },
      ] },
      { h2: "Practical tips for eating gluten-free in Rome safely", body: "A few extra precautions help you enjoy the experience without stress, especially in the city's most touristy neighborhoods: <ul><li><strong>Book ahead</strong>, especially near the most touristy areas like the historic center, where tables fill up fast.</li><li><strong>Always mention celiac disease</strong> when booking, not just at the table, so staff can prepare in advance.</li><li><strong>Ask whether the kitchen or oven is dedicated</strong> or shared: well-trained staff will answer confidently and without hesitation.</li><li><strong>Check the venue's AIC certification</strong>, an extra guarantee of periodic food-safety checks.</li><li><strong>Always carry a few safe snacks</strong>, useful for long days spent between sights.</li></ul>" },
      { h2: "Bookings, takeaway and kids: the practical questions before you go out", body: "One last set of practical questions, useful for planning your gluten-free outing in Rome.", h3: [
        { title: "Do I need to book ahead at gluten-free restaurants in Rome?", body: "Yes, it's strongly recommended especially in the most touristy areas and on weekends, because the dedicated kitchen can only handle a limited number of gluten-free covers. Booking also lets you mention celiac disease in advance, so staff can prepare before you arrive." },
        { title: "Can I bring celiac children to a gluten-free restaurant in Rome?", body: "Yes, venues with a dedicated kitchen are generally the safest choice for celiac children too, often with dishes designed just for them. It's still useful to mention this when booking, specifying the child's age for more attentive service." },
        { title: "Are there safe gluten-free takeaway options in Rome?", body: "Yes, many certified venues also offer takeaway prepared with the same dedicated procedures as dine-in service, handy for a quick lunch between sightseeing stops. Always check that the packaging is sealed separately from other orders, to avoid contamination during transport." },
      ] },
    ],
    faqs: [
      { question: "What are the best gluten-free restaurants in Rome?", answer: "In Rome, we'd point to Il Secchio e l'Olivaro in Ostiense, a pizzeria with a dedicated gluten-free menu, and Fornerie Alessandrino, with a kitchen entirely AIC certified: both listed in the Mappa Senza Glutine directory." },
      { question: "How can I tell if a Roman trattoria is really safe for celiacs?", answer: "Check for AIC certification, ask whether the kitchen and oven are dedicated or separate, and rely on verified reviews from other celiacs, like the ones in our directory." },
      { question: "Do I always need to book ahead at gluten-free restaurants in Rome?", answer: "Not always, but it's strongly recommended in the most touristy areas and on weekends, when demand is higher and dedicated spots can fill up quickly." },
    ],
    tags: ["rome", "restaurants", "pizzerias", "guides"],
  },
  "art-20": {
    title: "How to Avoid Cross-Contamination at a Restaurant: The Complete Guide to Eating Gluten-Free Safely",
    excerpt: "How to avoid cross-contamination at a restaurant: the questions to ask staff, the signs of a truly safe venue, and the specific risks at pizzerias, restaurants and bakeries.",
    authorRole: "Content specialist food safety",
    keyTakeaways: [
      "Cross-contamination happens when even minimal traces of gluten come into contact with a gluten-free dish through shared utensils, surfaces or frying oil.",
      "AIC-certified venues have passed checks on procedures, suppliers and staff training, but the absence of certification doesn't automatically mean a venue is unsafe.",
      "A dedicated kitchen or oven, a clear menu and trained staff are the most concrete signs of attention to celiac disease, even at uncertified venues.",
      "Always mentioning celiac disease, not a generic intolerance, remains the most effective way to reduce risk at any type of venue.",
    ],
    sections: [
      { h2: "What cross-contamination is and why it worries people with celiac disease", body: "If you have celiac disease, you probably already know the feeling: sitting at the table, the menu offers a \"gluten-free\" dish, but a doubt remains. Knowing <strong>how to avoid cross-contamination at a restaurant</strong> is the most important question to ask before ordering, because for someone with celiac disease even a minimal amount of gluten, a few crumbs or a utensil used for two different preparations, can trigger an autoimmune reaction, often with no symptoms visible right away. In this guide you'll find the signs of a truly safe venue, the right questions to ask staff, and what to do if something goes wrong." },
      { h2: "How to avoid cross-contamination at a restaurant: the right questions before ordering", body: "Even before looking at the menu, a few questions help you gauge a venue's level of attention to celiac disease right away.", h3: [
        { title: "Is the kitchen or oven dedicated?", body: "Always ask, without worrying about seeming intrusive: a work area or oven used exclusively for gluten-free preparations, separate from the one for traditional dishes, is the most concrete guarantee against cross-contamination. If the answer is vague, that's already a first sign to pay attention to." },
        { title: "How are utensils, cutting boards and work surfaces cleaned?", body: "Wooden cutting boards, pasta strainers and grills are porous surfaces that easily retain flour residue even after washing: an attentive venue generally has dedicated utensils, often a different color so they're easy to spot at a glance, never shared with traditional preparations." },
        { title: "Does staff really understand celiac disease?", body: "A trained server can naturally explain how a gluten-free order is handled, from the kitchen to the table. If the request causes hesitation or gets vaguely passed off to the chef with no further detail, cross-contamination is probably not a priority for the venue." },
        { title: "How does the dish arrive at the table?", body: "A gluten-free dish should be visually recognizable too, for example with a colored marker or a clear description when served, and should never pass through the same tray or fryer as dishes containing gluten. For takeaway too, packaging should be sealed separately from other orders." },
      ] },
      { h2: "The signs that a restaurant is truly safe for celiacs", body: "Beyond direct questions, a few objective elements help assess a venue's reliability even before sitting down.", h3: [
        { title: "AIC certification: what it really guarantees", body: "Venues certified by the Italian Celiac Association have passed periodic checks on suppliers, kitchen procedures and staff training, checks that repeat over time. It isn't a legal requirement, so its absence doesn't automatically mean a venue is unsafe, but the mark significantly reduces the margin of error compared to a venue that simply calls itself \"gluten-free\" with no external checks." },
        { title: "A clear gluten-free menu, not a generic one", body: "A good gluten-free menu specifies which dishes are prepared in a dedicated area and which only share the base ingredient with traditional versions: the difference isn't cosmetic, because in the second case the risk of contamination during cooking remains real even if the starting ingredient is gluten-free." },
        { title: "Reviews and reports from other celiacs", body: "The direct experiences of other people with celiac disease often tell you more than any label: venues repeatedly flagged as safe by the community, gathered in verified directories like <a href=\"/directory\">Mappa Senza Glutine</a>, are a more reliable starting point than a generic Google Maps search." },
      ] },
      { h2: "Pizzerias, à la carte restaurants and bakeries: the risks change by venue type", body: "Not every venue handles cross-contamination the same way: the type of kitchen strongly affects the level of attention required.", h3: [
        { title: "Pizzerias: the shared oven is the main risk", body: "Even with a perfectly gluten-free dough, baking pizza in the same wood-fired oven used for traditional dough exposes it to the risk of residual flour on the refractory base: the most attentive pizzerias have a separate baking area or an electric oven dedicated only to gluten-free pizzas." },
        { title: "À la carte restaurants: watch out for shared fryers and work surfaces", body: "In a restaurant with a large menu, the biggest risk involves single fryers used for fries and other breaded fried foods, plus the work surfaces where fresh pasta is rolled out: wheat flour left in the air or on surfaces can settle even on preparations meant to be gluten-free." },
        { title: "Bakeries and pastry shops: flour flies, literally", body: "In bakery and pastry labs, traditional flour easily becomes airborne during processing, which is why bakeries that are truly safe for celiacs often have a physically separate lab, or work on days and hours dedicated exclusively to gluten-free production." },
      ] },
      { h2: "The essential checklist before sitting down to eat", body: "Before ordering, run through these points mentally: they help you gauge a venue's attention to celiac disease in a few seconds. <ul><li><strong>Ask if the kitchen or oven is dedicated</strong> to gluten-free preparations, not just whether they \"know how to cook gluten-free\".</li><li><strong>Check for AIC certification</strong>, if present, or look for reviews from other celiacs about the venue.</li><li><strong>Ask staff how the order is handled</strong>, from the kitchen through to table service.</li><li><strong>Watch how the dish arrives</strong>: it should be recognizable and shouldn't share trays or utensils with other dishes.</li><li><strong>Always mention celiac disease</strong>, not a generic intolerance, so staff understand the real need for zero contamination.</li></ul>" },
      { h2: "What to do if you suspect contamination after eating out", body: "Even when choosing carefully, you may feel bloating, abdominal pain or fatigue in the hours after a meal out: it doesn't necessarily mean the venue made a mistake, but it's worth reporting. Contacting the venue calmly, explaining the symptoms and the time of your booking, helps staff spot any gaps in their procedure; if the venue is AIC certified, the episode can also be reported to the association, which uses this information for future checks. Isolated symptoms don't necessarily call for an urgent visit, but repeated episodes after eating out are worth discussing with your specialist." },
      { h2: "Frequently asked questions about cross-contamination at restaurants", body: "The most common questions from celiacs who want to eat out safely.", h3: [
        { title: "How do you avoid cross-contamination at a restaurant?", body: "By choosing venues with a dedicated kitchen or oven, asking staff how gluten-free preparations are handled, and checking that utensils and surfaces aren't shared with traditional dishes. None of these precautions alone eliminates the risk, but together they reduce it significantly, especially at a venue used to handling celiac orders regularly." },
        { title: "Are non-AIC-certified restaurants safe for celiacs?", body: "They can be, but safety depends entirely on direct experience and internal procedures, with no periodic external check to guarantee them. AIC certification isn't a legal requirement, so many safe venues simply haven't applied for it: asking about a dedicated kitchen and staff training remains essential either way." },
        { title: "Is it enough to just order the \"gluten-free\" dish from the menu to be safe?", body: "No, not always: a dish labeled \"gluten-free\" can still be contaminated if cooked in the same water, fryer or grill used for gluten-containing food. The label on the menu indicates the absence of gluten among the ingredients, not necessarily the absence of risk during preparation." },
        { title: "How much contamination does it take to feel sick if you have celiac disease?", body: "Minimal amounts, even a few milligrams of gluten, are enough to trigger an immune response in a person with celiac disease, which is why EU regulation sets the \"gluten-free\" threshold at no more than 20 mg/kg (20 ppm) of product. That's why cross-contamination stays dangerous even when it seems negligible, regardless of symptoms felt right away." },
      ] },
    ],
    faqs: [
      { question: "How do you avoid cross-contamination at a restaurant?", answer: "By choosing venues with a dedicated kitchen or oven, asking staff how gluten-free preparations are handled, and checking that utensils and surfaces aren't shared with traditional dishes." },
      { question: "Are non-AIC-certified restaurants safe for celiacs?", answer: "They can be, but without a periodic external check, safety depends only on the venue's direct experience and internal procedures: asking about a dedicated kitchen and staff training remains essential." },
      { question: "Is it enough to just order the \"gluten-free\" dish from the menu to be safe?", answer: "No: a dish labeled \"gluten-free\" can still be contaminated if cooked in the same water, fryer or grill used for gluten-containing food." },
      { question: "How much contamination does it take to feel sick if you have celiac disease?", answer: "Minimal amounts, even a few milligrams of gluten, are enough: EU regulation sets the \"gluten-free\" threshold at no more than 20 mg/kg (20 ppm) of product." },
    ],
    tags: ["cross-contamination", "food safety", "AIC", "gluten-free restaurants"],
  },
  "art-21": {
    title: "Gluten-Free McDonald's in Italy: What a Celiac Can Really Eat",
    excerpt: "Gluten-free McDonald's in Italy: what the Gluten Free Burger actually guarantees, why the chain isn't AIC certified, and which other products carry a cross-contamination risk.",
    authorRole: "Content specialist food safety",
    keyTakeaways: [
      "The Gluten Free Burger, developed with Dr. Schär, is the only item on the McDonald's Italy menu explicitly guaranteed gluten-free.",
      "McDonald's Italy doesn't take part in AIC's Out-of-Home Eating program, so the association doesn't verify its preparation procedures.",
      "Fries, salads and some ice creams don't contain gluten as an ingredient, but McDonald's doesn't guarantee they're free of cross-contamination.",
      "For a meal out with the strongest guarantees, AIC-certified venues or those with a dedicated kitchen remain the safest choice for celiacs.",
    ],
    sections: [
      { h2: "Gluten-free McDonald's in Italy: what the company actually says", body: "People searching for information on gluten-free McDonald's in Italy often find conflicting claims online: some say celiacs can eat there without worry, others advise against it entirely. The reality, checked against official sources from McDonald's Italy and the Italian Celiac Association (AIC), is more nuanced: only one item on the menu is guaranteed gluten-free, while the rest carries a margin of risk the company itself can't rule out." },
      { h2: "The Gluten Free Burger: the only item truly guaranteed", body: "The Gluten Free Burger, developed by McDonald's Italy in collaboration with Dr. Schär, is the only menu item explicitly guaranteed gluten-free: the bun meets the EU threshold for \"gluten-free\" labeling, no more than 20 mg/kg (20 ppm) of product. In terms of the ingredient's composition, it's therefore a verified option for celiacs." },
      { h2: "McDonald's and AIC certification: why there isn't one", body: "Unlike the AIC-certified venues you'll find in our directory, McDonald's Italy doesn't take part in the Italian Celiac Association's Out-of-Home Eating program (AFC). This means AIC doesn't weigh in on the suitability of the food served, the preparation procedures, or staff training at its locations. The company shares information on allergens and product composition on its own, through its website and in restaurants, but without the periodic external check that comes with the AIC mark." },
      { h2: "Fries, salads and ice cream: why they aren't guaranteed even though they don't contain gluten as an ingredient", body: "Several menu items don't contain gluten as an ingredient, but that alone isn't enough to make them safe for a celiac in a shared kitchen environment.", h3: [
        { title: "French fries", body: "McDonald's fries don't contain gluten as an ingredient, but they're fried in a shared kitchen environment: the company itself doesn't guarantee the absence of cross-contamination, especially during periods when the fryers are also used for other breaded products. The official advice is to always ask staff at the location before ordering." },
        { title: "Salads and ice cream", body: "Green salads without chicken and some ice creams also don't contain gluten as an ingredient, but they share surfaces, utensils or equipment with other menu items: for this reason McDonald's can't guarantee they're fully safe for celiacs, the same way it can't with fries." },
      ] },
      { h2: "So is McDonald's safe for a celiac?", body: "It depends on how much risk you're willing to accept. The Gluten Free Burger, on its own, is a verified option in terms of composition. The rest of the menu, including fries, carries a margin of risk that McDonald's itself doesn't eliminate, due to the lack of a dedicated kitchen and AIC certification. Anyone with celiac disease that's particularly sensitive to cross-contamination, or looking for the most reassurance when eating out, will generally find stronger guarantees at AIC-certified venues or those with a dedicated kitchen, like the ones gathered in the <a href=\"/directory\">Mappa Senza Glutine directory</a>." },
      { h2: "Frequently asked questions about McDonald's and the gluten-free diet", body: "The most searched questions about McDonald's and celiac disease in Italy.", h3: [
        { title: "Is McDonald's Gluten Free Burger really gluten-free?", body: "Yes, the bun meets the legal threshold for \"gluten-free\" labeling (no more than 20 mg/kg), thanks to the collaboration between McDonald's Italy and Dr. Schär in developing the product. That said, it only covers the bun's composition, not the whole preparation environment at the location." },
        { title: "Is McDonald's AIC certified?", body: "No, McDonald's Italy doesn't take part in the Italian Celiac Association's Out-of-Home Eating program, so the association doesn't weigh in on the safety of its preparations or staff training at its restaurants." },
        { title: "Are McDonald's fries safe for celiacs?", body: "They aren't guaranteed: while they don't contain gluten as an ingredient, McDonald's itself doesn't rule out cross-contamination during frying in a shared kitchen, especially when the fryers are also used for other breaded products." },
        { title: "Where can I find the allergen list for McDonald's products?", body: "The full list is available on the official McDonald's Italy website, on the allergens page, and at individual locations, updated periodically by the company." },
      ] },
    ],
    faqs: [
      { question: "Is McDonald's Gluten Free Burger really gluten-free?", answer: "Yes, the bun meets the legal threshold for \"gluten-free\" labeling (no more than 20 mg/kg), developed by McDonald's Italy in collaboration with Dr. Schär." },
      { question: "Is McDonald's AIC certified?", answer: "No, McDonald's Italy doesn't take part in the Italian Celiac Association's Out-of-Home Eating program, so its preparation procedures aren't independently verified." },
      { question: "Are McDonald's fries safe for celiacs?", answer: "They aren't guaranteed: they don't contain gluten as an ingredient, but McDonald's doesn't rule out cross-contamination during frying in a shared kitchen." },
      { question: "Where can I find the allergen list for McDonald's products?", answer: "On the official McDonald's Italy website, on the allergens page, and at individual locations." },
    ],
    tags: ["McDonald's", "fast food", "food safety", "AIC"],
  },
  "art-22": {
    title: "Gluten-Free Gelaterias: How to Spot the Ones That Are Truly Free of Cross-Contamination",
    excerpt: "Gluten-free gelaterias: how to tell if scoops, tubs and cones are really safe for a celiac, which flavors to avoid, and why summer raises the risk of cross-contamination.",
    authorRole: "Gluten-free food blogger",
    keyTakeaways: [
      "The main risk at uncertified gelaterias is contamination through scoops and tubs shared between gluten-containing and gluten-free flavors.",
      "Truly safe gelaterias use dedicated scoops for each flavor, or clean them thoroughly between flavors.",
      "Cones, wafers and cups can also be a source of contamination if not certified gluten-free.",
      "AIC-certified gelaterias, or ones flagged as safe in the directory, offer the strongest guarantees, especially in summer months when foot traffic is higher.",
    ],
    sections: [
      { h2: "Why a gelateria can be risky for a celiac", body: "Artisan gelato, on its own, is often naturally gluten-free: milk, cream, sugar and fruit don't contain it. The problem at gluten-free gelaterias is almost never the base ingredient, but cross-contamination during preparation and serving: scoops that go from a cookie flavor to a cream flavor, tubs sitting close together with no separation, uncertified cones. Understanding where the real risk hides is the first step to choosing with confidence." },
      { h2: "Gluten-free gelaterias: what to ask before ordering", body: "A few direct questions to staff help you gauge the gelateria's level of attention right away.", h3: [
        { title: "Are the scoops dedicated or shared?", body: "This is the most important question: if the same scoop is used for a flavor with crushed cookies and then for a \"gluten-free\" flavor, contamination is nearly unavoidable. The most careful gelaterias use a different scoop for each tub, or clean it thoroughly between flavors." },
        { title: "Is the base itself gluten-free?", body: "Some seemingly simple flavors can contain hidden gluten, for example as a thickener or in flavorings: asking staff to confirm, especially for cream-based rather than fruit flavors, avoids surprises." },
        { title: "Are cones, wafers and cups certified?", body: "The traditional cone contains gluten: if no certified gluten-free alternative is offered, a cup is the safer choice — though it's still worth checking it hasn't been in contact with cone crumbs in the same serving area." },
      ] },
      { h2: "The signs of a gelateria that's truly safe for celiacs", body: "A few elements help you spot a trustworthy gelateria even before ordering.", h3: [
        { title: "AIC certification", body: "AIC-certified gelaterias have passed checks on procedures and staff training specific to celiac disease, with periodic reviews over time. It isn't a legal requirement, so its absence doesn't automatically mean risk, but the mark is an extra guarantee." },
        { title: "Physically separated tubs and flavors", body: "The most careful gelaterias dedicate a separate, or at least well-spaced, area to gluten-free flavors, reducing the risk of accidental contact during busy service hours." },
        { title: "Staff who answer without hesitation", body: "A trained staff member answers confidently about scoops, tubs and cones. If the question causes hesitation or gets a vague answer, that's a sign worth noting." },
      ] },
      { h2: "Watch out for the riskiest flavors", body: "Some flavors require more caution than others: those with crushed cookies, wafers, waffle cone pieces or hazelnut crunch carry a higher risk, because solid ingredients can leave residue on the scoop or in the tub later used for other flavors. Malt and some ready-made toppings can also contain gluten: when in doubt, simple fruit or cream flavors, confirmed directly with staff, are the safer bet." },
      { h2: "Why summer raises the risk of contamination", body: "In summer months, gelaterias handle far higher foot traffic than the rest of the year, often with seasonal staff less trained in handling celiac disease. The rush of service during peak hours increases the risk of mistakes with scoops and tubs: this is exactly when it matters most to choose verified venues, like the ones flagged in the <a href=\"/directory?categoria=gelateria\">Mappa Senza Glutine directory</a>, rather than picking a gelateria at random." },
      { h2: "Frequently asked questions about gluten-free gelaterias", body: "The most common questions from celiacs looking for a safe gelato.", h3: [
        { title: "Is fruit gelato always gluten-free?", body: "In most cases yes, but it isn't automatically guaranteed: the main risk remains contamination through scoops or tubs shared with cookie- or wafer-based flavors, regardless of the starting ingredient." },
        { title: "How can I tell if a gelateria is safe for celiacs?", body: "Check whether it's AIC certified, ask staff if scoops are dedicated or cleaned between flavors, and see if gluten-free tubs are physically separated from the others." },
        { title: "Does the traditional cone contain gluten?", body: "Yes, the classic cone is made with wheat flour and contains gluten: if the gelateria doesn't offer a certified alternative, a cup remains the safer choice." },
        { title: "Why is it riskier to eat gluten-free gelato in summer?", body: "Because foot traffic increases and seasonal staff are often less trained: the rush of service during peak hours raises the risk of accidental contamination between scoops and tubs." },
      ] },
    ],
    faqs: [
      { question: "Is fruit gelato always gluten-free?", answer: "In most cases yes, but the main risk remains contamination through scoops or tubs shared with cookie- or wafer-based flavors." },
      { question: "How can I tell if a gelateria is safe for celiacs?", answer: "Check whether it's AIC certified, ask if scoops are dedicated or cleaned between flavors, and check that gluten-free tubs are separated from the others." },
      { question: "Does the traditional cone contain gluten?", answer: "Yes, the classic cone contains wheat flour: if there's no certified alternative, a cup is the safer choice." },
      { question: "Why is it riskier to eat gluten-free gelato in summer?", answer: "Because foot traffic increases and seasonal staff are often less trained, raising the risk of accidental contamination during peak hours." },
    ],
    tags: ["gelaterias", "summer", "cross-contamination", "food safety"],
  },
  "art-23": {
    title: "AIC-Certified Hotels and Resorts for Celiacs: How to Choose a Worry-Free Vacation",
    excerpt: "AIC-certified hotels and resorts: what the certification really guarantees, the difference between breakfast and full board, and how to plan a gluten-free vacation with no surprises.",
    authorRole: "Travel writer",
    keyTakeaways: [
      "An AIC-certified hotel guarantees safe gluten-free breakfast and staff trained on celiac disease, not just generic \"gluten-free-friendly\" claims.",
      "At full-board resorts, certification covers the entire kitchen and meal management, not just breakfast.",
      "Even without certification, some properties offer in-room kitchenettes or arrangements with nearby certified restaurants.",
      "Booking ahead and mentioning celiac disease when you book, not on arrival, remains the golden rule for a surprise-free vacation.",
    ],
    sections: [
      { h2: "AIC-certified hotels: why they make a difference on vacation", body: "On vacation, managing celiac disease changes compared to your routine at home: you don't have your own kitchen, you eat out more often, and often at properties you don't know. Choosing AIC-certified hotels and resorts for celiacs means relying on properties that have passed specific checks on breakfast, kitchen management and staff training, instead of finding out on arrival whether the property is actually equipped. In this guide we look at what the certification really guarantees and how to plan a worry-free vacation." },
      { h2: "What an AIC-certified hotel actually guarantees", body: "The certification isn't a generic label: it covers specific, verifiable aspects of the property.", h3: [
        { title: "Safe gluten-free breakfast", body: "Gluten-free bread, cookies, cereal and pastries prepared or stored separately from other products, to avoid the cross-contamination typical of shared buffets." },
        { title: "Staff trained on celiac disease", body: "Dining room and kitchen staff receive specific training on how to handle gluten-free requests and preparations, reducing the risk of mistakes from carelessness or limited knowledge of the topic." },
        { title: "Kitchen equipped for full meals", body: "At properties with an in-house restaurant, certification can also cover lunch and dinner, with dishes prepared avoiding contact with gluten-containing ingredients." },
      ] },
      { h2: "Full-board resorts: what changes compared to a classic hotel", body: "At full-board resorts, managing celiac disease is more complex, since it covers every meal of the day, often in buffet format.", h3: [
        { title: "The risk of shared buffets", body: "Self-service buffets, typical of resorts, raise the risk of contamination: utensils shared between different trays, crumbs moving from one dish to another. An AIC-certified resort has dedicated stations or staff who serve gluten-free dishes directly." },
        { title: "Themed dinners and show cooking", body: "Themed evenings and show cooking, common at resorts, need extra attention: always check with staff whether gluten-free alternatives are planned for that specific evening, ideally mentioning it at check-in." },
      ] },
      { h2: "How to find AIC-certified hotels and resorts for your vacation", body: "The most reliable way is to check the certification directly on the property's website or ask for confirmation before booking, rather than trusting generic self-declared labels like \"gluten-free friendly\" found on booking platforms. In the <a href=\"/directory?categoria=hotel\">Mappa Senza Glutine directory</a> you'll find verified properties, with a clear indication of whether the certification is confirmed or not." },
      { h2: "What to do if the hotel isn't AIC certified", body: "Even without certification, a gluten-free vacation is possible with a bit more care: check if the room has a kitchenette or a small fridge to store safe snacks and products brought from home, look for AIC-certified restaurants or ones flagged by the community nearby for lunch and dinner, and always bring a stock of gluten-free products for emergencies, especially in less touristy destinations where finding them locally can be difficult." },
      { h2: "Frequently asked questions about gluten-free hotels and resorts", body: "The most common questions from celiacs planning a vacation.", h3: [
        { title: "What does it mean that a hotel is AIC certified?", body: "It means the property has passed specific checks from the Italian Celiac Association on breakfast, any in-house dining and staff training, with periodic reviews over time." },
        { title: "Are full-board resorts safe for celiacs?", body: "They can be if AIC certified or with dedicated buffet procedures: without these guarantees, the risk of cross-contamination in self-service formats is higher than at an à la carte restaurant." },
        { title: "Do I need to tell the hotel about celiac disease before arriving?", body: "Yes, it's strongly recommended to mention it when booking, not at check-in: the kitchen needs time to organize breakfast and meals safely, especially during peak season." },
        { title: "What should I bring on vacation if the hotel isn't certified?", body: "A stock of basic gluten-free products (bread, snacks, pasta) for emergencies, especially if the destination is less touristy: they can be hard to find locally outside major cities." },
      ] },
    ],
    faqs: [
      { question: "What does it mean that a hotel is AIC certified?", answer: "It means the property has passed specific AIC checks on breakfast, any in-house dining and staff training, with periodic reviews." },
      { question: "Are full-board resorts safe for celiacs?", answer: "They can be if AIC certified or with dedicated buffet procedures, otherwise the risk of cross-contamination in self-service formats is higher." },
      { question: "Do I need to tell the hotel about celiac disease before arriving?", answer: "Yes, it's strongly recommended to mention it when booking, not at check-in, so the kitchen can prepare in advance." },
      { question: "What should I bring on vacation if the hotel isn't certified?", answer: "A stock of basic gluten-free products for emergencies, especially in less touristy destinations where finding them locally can be difficult." },
    ],
    tags: ["hotels", "travel", "AIC", "vacation"],
  },
  "art-24": {
    title: "Where to Get Gluten-Free Breakfast: Croissants, Brioches and Dedicated Bakeries",
    excerpt: "Where to get gluten-free breakfast without the risk: the difference between an industrial croissant and a dedicated bakery, what to ask at the counter, and how to plan ahead when out or traveling.",
    authorRole: "Gluten-free food blogger",
    keyTakeaways: [
      "Many traditional cafés only offer a prepackaged industrial croissant: that's not the same as a bakery with a dedicated lab.",
      "100% gluten-free bakeries offer the strongest guarantees against cross-contamination, but they're still mostly concentrated in bigger cities.",
      "Even at cafés with a \"gluten-free corner\", the risk depends on how the products are stored, cut and served.",
      "Bringing your own breakfast or looking for verified bakeries in the directory remains the safest choice when you're out or traveling.",
    ],
    sections: [
      { h2: "Gluten-free breakfast: why the café down the street often isn't enough", body: "For celiacs, breakfast at a café is often one of the most missed rituals: the warm croissant fresh from the oven, the smell at the counter, the routine of breakfast out. Finding where to get gluten-free breakfast safely, though, means looking beyond simply \"they have a gluten-free product\": a packaged croissant kept in the same display case as traditional ones, cut with the same knife or toasted in the same toaster, can easily become contaminated. In this guide we look at where to look and what to ask for a truly safe breakfast." },
      { h2: "Where to get gluten-free breakfast safely", body: "Not every venue offers the same level of guarantee: here are the most reliable options, ranked by safety.", h3: [
        { title: "100% gluten-free dedicated bakeries", body: "The safest option by far: lab, oven and utensils used exclusively for gluten-free products, with no risk of contamination from traditional flours. Still few in number, but growing in bigger cities." },
        { title: "Cafés with a certified gluten-free corner", body: "Many traditional cafés offer a small range of gluten-free products, often packaged by outside suppliers: check that they're stored in a separate display case and not cut or heated with the same tools used for traditional products." },
        { title: "Supermarkets and packaged baked goods", body: "Packaged gluten-free-branded croissants and brioches, found at the supermarket or pharmacy, are a safe alternative for breakfast at home or to bring along, even if less of an \"experience\" than a bakery." },
      ] },
      { h2: "What to ask before ordering a croissant or brioche", body: "Before ordering, a few questions help gauge the venue's level of care: is the product individually packaged or loose? Is it stored separately from other baked goods? Is it heated in a dedicated toaster or oven, or the same one used for traditional croissants? If staff can't answer confidently, an unopened packaged product is the safer bet." },
      { h2: "The hidden risks of breakfast at a café", body: "Even when the starting product is certified gluten-free, a few steps at the counter can compromise it: a shared toaster leaves crumb residue that lands on the next product, a shared display case allows accidental contact between traditional and gluten-free croissants, and staff hands or gloves moving from one product to another without changing are an often underestimated source of contamination." },
      { h2: "Breakfast while traveling: how to plan ahead", body: "Outside your usual city or area, finding a safe breakfast takes a bit more planning: look up verified bakeries and cafés in the <a href=\"/directory?categoria=bar-pasticceria\">Mappa Senza Glutine directory</a> before you leave, and always carry a packaged baked good as a backup for mornings when you can't find a safe option nearby." },
      { h2: "Frequently asked questions about gluten-free breakfast", body: "The most common questions from people looking for a safe café or bakery for breakfast.", h3: [
        { title: "Are packaged gluten-free croissants always safe?", body: "Yes, as long as they stay sealed in the original packaging until eaten: the risk only rises if they're opened, cut or heated in contact with surfaces or utensils used for traditional products." },
        { title: "How do I recognize a bakery that's truly dedicated to gluten-free?", body: "Check whether the lab is entirely dedicated to gluten-free or also makes traditional products: in the first case the contamination risk is nearly zero, in the second it depends on the separation procedures in place." },
        { title: "Can I trust a café that only has one gluten-free croissant on the menu?", body: "It depends on how it's handled: always ask if it's stored separately and handled with dedicated tools before ordering, don't rely just on the product being listed on the menu." },
        { title: "What should I bring if I can't find a safe café while traveling?", body: "Packaged gluten-free baked goods with a certified label, easy to carry and store, useful as a backup for mornings when you can't find a verified option nearby." },
      ] },
    ],
    faqs: [
      { question: "Are packaged gluten-free croissants always safe?", answer: "Yes, as long as they stay sealed until eaten: the risk only rises if they're opened, cut or heated in contact with traditional products." },
      { question: "How do I recognize a bakery that's truly dedicated to gluten-free?", answer: "Check whether the lab is entirely dedicated or also makes traditional products: in the first case the contamination risk is nearly zero." },
      { question: "Can I trust a café that only has one gluten-free croissant on the menu?", answer: "It depends on how it's handled: always ask if it's stored separately and handled with dedicated tools." },
      { question: "What should I bring if I can't find a safe café while traveling?", answer: "Packaged gluten-free baked goods with a certified label, easy to carry as a backup." },
    ],
    tags: ["breakfast", "bakeries", "cross-contamination", "cafés"],
  },
  "art-25": {
    title: "Easy Gluten-Free Cake: The Base Recipe with Ready-Made Cake Mix",
    excerpt: "The go-to cake for when you're short on time: few ingredients, a ready-made flour mix, and a soft, reliable result.",
    authorRole: "Gluten-free food blogger",
    keyTakeaways: [
      "A flour mix made specifically for cakes gives more reliable results than a homemade mix for those new to gluten-free baking.",
      "The base ratios (mix, eggs, sugar, oil, baking powder) stay the same as a traditional cake: only the flour changes.",
      "A conventional oven at 175-180°C for 35-40 minutes is the safest starting point: the toothpick test remains the definitive check.",
      "Schär's all-purpose mix also works for this cake, with a slightly different texture compared to a mix made specifically for cakes.",
    ],
    sections: [
      { h2: "Ingredients for a 22 cm cake", body: "300 g of <a href=\"/en/prodotti/nutrifree-mix-per-dolci-1kg\">Nutrifree cake flour mix</a> (or, alternatively, <a href=\"/en/prodotti/schar-mix-it-universale-1kg\">Schär Mix It! all-purpose mix</a>), 3 eggs, 150 g sugar, 100 ml seed oil or melted butter, 150 ml milk (or plant-based drink), one sachet of gluten-free baking powder, the zest of one lemon." },
      { h2: "Method", body: "Preheat a conventional oven to 175-180°C. Beat the eggs with the sugar until pale and fluffy, then fold in the oil in a thin stream while continuing to mix.", h3: [
        { title: "Adding the dry ingredients", body: "Sift the flour mix with the baking powder and fold it into the egg mixture, alternating with the milk a little at a time to avoid lumps. Finally add the lemon zest." },
        { title: "Baking and the toothpick test", body: "Pour the batter into a buttered and floured pan (using the same mix) and bake for 35-40 minutes. Check doneness by inserting a toothpick in the center: if it comes out dry, the cake is ready." },
      ] },
      { h2: "Variations", body: "For a chocolate version, replace 30 g of the mix with the same amount of unsweetened cocoa; for a more rustic cake, add diced apples or dark chocolate chips to the batter before baking." },
    ],
    faqs: [
      { question: "Can I use loose flours instead of the ready-made mix?", answer: "Yes, but a mix made specifically for cakes already has the starch-to-flour ratios balanced for rising: for beginners it's the safest way to get a soft result." },
      { question: "Does the cake come out drier than a traditional one?", answer: "If you follow the times and temperatures, the result is comparable: gluten-free flours tend to dry out a bit faster, so keep it well covered." },
      { question: "Is Nutrifree's cake flour mix AIC-certified?", answer: "Yes, like all Nutrifree products it carries the Crossed Grain trademark from the Italian Celiac Association." },
    ],
    tags: ["recipes", "desserts", "cakes", "flours"],
  },
  "art-26": {
    title: "Homemade Gluten-Free Pizza: The Dough with All-Purpose Mix",
    excerpt: "The base recipe for a gluten-free pizza dough with the all-purpose mix: few ingredients and a result closer to traditional pizza.",
    authorRole: "Gluten-free food blogger",
    keyTakeaways: [
      "A flour mix designed for pizza and focaccia too gives a more elastic dough than a generic cake mix.",
      "Gluten-free dough should be rolled out between two sheets of parchment paper, since it's stickier than traditional dough.",
      "A blind bake of 8-10 minutes before adding the toppings helps the base avoid staying raw in the center.",
      "Fresh or dry active yeast works just like in traditional dough: just check it's certified gluten-free.",
    ],
    sections: [
      { h2: "Ingredients for 2 medium pizzas", body: "500 g of <a href=\"/en/prodotti/schar-mix-it-universale-1kg\">Schär Mix It! all-purpose mix</a>, 320 ml lukewarm water, 7 g dry active yeast (or 20 g fresh), 2 tablespoons extra virgin olive oil, a teaspoon of salt, a pinch of sugar." },
      { h2: "Method", body: "Dissolve the yeast in the lukewarm water with the sugar and let rest for 10 minutes. In a bowl with the mix and salt, pour in the water with the yeast and the oil, kneading until you get a smooth, even dough, softer than traditional dough.", h3: [
        { title: "Shaping and rising", body: "Spread the dough directly in the oiled pan, using wet hands or a sheet of parchment paper to help: gluten-free dough is stickier and needs this trick. Let it rise for 30-40 minutes somewhere warm." },
        { title: "Baking in two stages", body: "Blind bake the base for 8-10 minutes at 220°C, then add the toppings and finish baking for another 10-12 minutes, until the edges are golden." },
      ] },
      { h2: "Toppings", body: "Tomato, mozzarella and oregano remain the safest base, but you can also use basil pesto instead of tomato for an aromatic white variation." },
    ],
    faqs: [
      { question: "Why should the dough be rolled between two sheets of parchment paper?", answer: "Gluten-free dough is stickier than traditional dough and tends to stick to your hands: spreading it with parchment paper or wet hands makes the job easier." },
      { question: "Can I freeze the dough already shaped?", answer: "Yes, many gluten-free doughs freeze well already spread in the pan, before the final rise: check the mix manufacturer's instructions anyway." },
      { question: "Why blind bake the base before adding toppings?", answer: "It helps the base cook evenly in the center without staying raw under the weight of the toppings, especially with more delicate gluten-free doughs." },
    ],
    tags: ["recipes", "pizza", "dough"],
  },
  "art-27": {
    title: "Gluten-Free School Snacks: 5 Practical Ideas for the Lunchbox",
    excerpt: "What to pack for a safe snack: individually wrapped products, easy to check, easy to send to school.",
    authorRole: "Gluten-free food blogger",
    keyTakeaways: [
      "Individually sealed, single-serve products are the safest choice for a school snack: no handling outside the home.",
      "Always tell the school and teachers about a child's celiac disease, even when the snack comes from home.",
      "Alternating sweet and savory options helps keep the snack varied through the week without boring the child.",
      "A name label on the package prevents accidental swaps with a classmate's snack.",
    ],
    sections: [
      { h2: "Ready single-serve options", body: "<a href=\"/en/prodotti/cereal-buoni-senza-biscotti-con-gocce-di-cioccolato-150g\">Céréal Buoni Senza chocolate chip biscuits</a> and the <a href=\"/en/prodotti/schar-chocolix-110g\">Schär Chocolix</a> bar are individually wrapped: handy to toss in a backpack with no need to divide or wrap them at home." },
      { h2: "The savory alternative", body: "<a href=\"/en/prodotti/cereal-fette-croccanti-150g\">Céréal crisp slices</a> can be prepped the night before with a thin layer of cream cheese and kept in an airtight container for the next day." },
      { h2: "Practical tips for the lunchbox", body: "Choose products in their original sealed package whenever possible, to avoid a child mixing them up with a classmate's. If you prepare something at home, use a dedicated container, washed separately from anything used for gluten-containing food.", h3: [
        { title: "Talking to the school", body: "Even when the snack comes from home, it's useful to inform teachers about the child's celiac disease, to manage any spontaneous food-sharing between classmates during break time." },
      ] },
    ],
    faqs: [
      { question: "Is it better to send a packaged snack or something homemade?", answer: "Both work: an original sealed package minimizes the risk of contamination outside the home, while a homemade snack needs a dedicated container washed separately." },
      { question: "Should I tell the school even if the snack comes from home?", answer: "Yes, it's still useful to inform teachers about the celiac disease, to manage situations like spontaneous food-sharing between children during recess." },
      { question: "How do I prevent my child from swapping snacks with classmates?", answer: "A name label on the package and a short, age-appropriate explanation to the child help prevent accidental swaps." },
    ],
    tags: ["kids", "snacks", "school"],
  },
  "art-28": {
    title: "Gluten-Free Crostini and Canapés for a Dinner with Friends",
    excerpt: "Quick ideas for gluten-free crostini and canapés, with ready-made bases and a handful of fresh ingredients to assemble at the last minute.",
    authorRole: "Gluten-free food blogger",
    keyTakeaways: [
      "Crisp slices and toasted Panfette are ready-made bases for crostini, no need to bake bread at home.",
      "Pesto works as a canapé base just as well as classic spreadable creams.",
      "Assembling crostini only shortly before serving keeps the base from softening and losing crunch.",
      "Varying the bases (crisp or soft) adds more textures to the same platter.",
    ],
    sections: [
      { h2: "The bases", body: "Use <a href=\"/en/prodotti/cereal-fette-croccanti-150g\">Céréal crisp slices</a> as they are for a crunchy base, or lightly toast <a href=\"/en/prodotti/nutrifree-panfette-pane-casereccio-300g\">Nutrifree Panfette</a> for a base that's soft in the middle and golden at the edges." },
      { h2: "Three quick combinations", body: "Try these combinations, ready in just a few minutes.", h3: [
        { title: "Pesto and cherry tomato crostino", body: "A layer of <a href=\"/en/prodotti/sarchio-pesto-bio-130g\">Sarchio organic pesto</a>, half a cherry tomato on top, and a drizzle of oil." },
        { title: "Cream cheese and walnut canapé", body: "Cream cheese, crumbled walnut pieces and a drizzle of honey for a sweet-savory contrast." },
        { title: "Hummus and raw vegetable crostino", body: "A layer of hummus with julienned raw carrot or zucchini, for a lighter option." },
      ] },
    ],
    faqs: [
      { question: "Is it better to prep crostini ahead or right before serving?", answer: "It's better to assemble them shortly before serving: the base tends to soften and lose crunch over time in contact with moist toppings." },
      { question: "Can I use rustic bread instead of crisp slices?", answer: "Yes, lightly toasted it works just as well as a base for crostini and canapés." },
      { question: "Are these bases suitable for a large buffet?", answer: "Yes, since they're already portioned they let you prepare large quantities quickly: plan for 3-4 pieces per person for an aperitivo." },
    ],
    tags: ["recipes", "aperitivo", "dinner"],
  },
  "art-30": {
    title: "Where to Eat Gluten-Free in Naples: Pizza, Sfogliatelle and Babà Without Compromise",
    excerpt: "The guide to eating gluten-free in Naples: from Neapolitan pizza baked in a dedicated oven to gluten-free sfogliatella and babà, between historic addresses and new certified openings.",
    authorRole: "Gluten-free food blogger",
    keyTakeaways: [
      "Naples now has historic pizzerias and new openings with an oven entirely dedicated to gluten-free, so you can enjoy real Neapolitan pizza safely.",
      "Even the great classics of Neapolitan pastry, like babà and sfogliatella, now exist in gluten-free versions thanks to dedicated labs.",
      "AIC certification and a separate oven or counter are the most concrete signs to look for before ordering.",
      "Booking ahead is still advisable on weekends, especially at the best-known pizzerias.",
    ],
    sections: [
      { h2: "Eating gluten-free in Naples: the challenge of real pizza", body: "Neapolitan pizza, babà, sfogliatella: Naples's food tradition is one of Italy's most distinctive, but also one of the most feared by people with celiac disease, given how central leavened dough is. The good news is that <strong>Naples now has historic pizzerias and pastry labs entirely dedicated to gluten-free</strong>, able to recreate the great Neapolitan classics without contamination. In this guide we round up the addresses verified by the Mappa Senza Glutine community." },
      { h2: "Gluten-free pizzerias to try in Naples", body: "Neapolitan pizza requires baking at very high heat in a wood-fired oven: that's why we always look for venues with a <strong>dedicated oven or station</strong> for gluten-free.", h3: [
        { title: "Pizzeria Starita", body: "In the Materdei neighborhood, <a href=\"/en/directory/pizzeria-starita-napoli\">Pizzeria Starita</a> is a historic Neapolitan pizzeria founded in 1901 and run by the same family for generations: every pizza, including the fried one, is available gluten-free, baked in a <strong>separate dedicated oven</strong>.", image: { src: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=75", alt: "Freshly baked Neapolitan pizza" } },
        { title: "Pizzaioli Veraci", body: "With three locations in the city, <a href=\"/en/directory/pizzaioli-veraci-napoli\">Pizzaioli Veraci</a> is AIC-certified and has a counter and oven entirely dedicated to gluten-free preparation: besides pizza, it also offers fried dishes and first courses gluten-free." },
      ] },
      { h2: "Breakfast and pastry: gluten-free babà, sfogliatelle and taralli", body: "Naples's pastry tradition also has a dedicated address today: at <a href=\"/en/directory/leopoldo-cafebar-napoli\">Leopoldo Cafebar</a>, across from the MANN museum, the first-floor lab produces exclusively gluten-free recipes, from the <strong>Neapolitan babà</strong> to sfogliatella, and taralli and pastiera during the holiday season. It's the go-to spot in the city for a worry-free breakfast." },
      { h2: "Frequently asked questions about eating gluten-free in Naples", body: "The most common questions from visitors or residents looking for a safe address.", h3: [
        { title: "Is it easy to find good gluten-free pizza in Naples?", body: "Increasingly so: pizzerias with a dedicated oven and AIC certification now deliver a gluten-free Neapolitan pizza very close to the original, something that was harder to find in the city just a few years ago." },
        { title: "Is gluten-free babà really the same as the original?", body: "Labs entirely dedicated to gluten-free, like those specializing in Neapolitan pastry, manage to reproduce a texture and taste very close to the traditional recipe, thanks to flour blends designed specifically for this." },
        { title: "Is it worth booking ahead at gluten-free pizzerias in Naples?", body: "Yes, especially on weekends: the best-known pizzerias handle a limited number of dedicated gluten-free bakes, so booking and flagging the need ahead of time helps staff prepare." },
      ] },
    ],
    faqs: [
      { question: "What are the best gluten-free pizzerias in Naples?", answer: "Verified addresses include Pizzeria Starita in Materdei, historic since 1901 with a dedicated oven, and Pizzaioli Veraci, AIC-certified with three locations in the city: both listed in the Mappa Senza Glutine directory." },
      { question: "Where can I find gluten-free Neapolitan pastries in Naples?", answer: "Leopoldo Cafebar, across from the MANN, has a lab dedicated exclusively to gluten-free and offers babà, sfogliatella and traditional Neapolitan pastry gluten-free." },
      { question: "Is it safe to eat out in Naples if I have celiac disease?", answer: "Yes, by choosing venues with a dedicated oven or lab and, where possible, AIC certification: the number of verified addresses in the city keeps growing." },
    ],
    tags: ["naples", "pizza", "pastry", "guides"],
  },
  "art-31": {
    title: "Gluten-Free Venice: Where to Eat Between Cicchetti, Pizza and Hotel Breakfast",
    excerpt: "A guide to gluten-free Venice: gelaterie with dedicated cones, pizzerias with separate kitchens, and one of the few AIC-certified hotels in the city for a worry-free breakfast.",
    authorRole: "Food safety content specialist",
    keyTakeaways: [
      "Venice has pizzerias with physically separate kitchens for gluten-free, as well as gelaterie with dedicated cones to reduce cross-contamination.",
      "Finding an AIC-certified hotel for gluten-free breakfast makes a stay in the city much easier.",
      "In the busiest districts, booking ahead is still the most effective strategy on weekends and during peak season.",
      "Always check whether home delivery or takeaway is available in your district, so you're never caught unprepared.",
    ],
    sections: [
      { h2: "Eating gluten-free in Venice: watch out for cicchetti", body: "Between calli and canals, eating gluten-free in Venice requires particular attention to <strong>cicchetti</strong>, the typical small bites served in Venetian bacari, often made with bread or shared frying. The city does have verified addresses, though, that let you enjoy pizza, gelato and even hotel breakfast without risk of contamination." },
      { h2: "Pizzeria and gelateria: safe bets", body: "Two different addresses for two different moments of the day, both verified by the community.", h3: [
        { title: "Pizzeria OKE", body: "At the Zattere, <a href=\"/en/directory/pizzeria-oke-venezia\">Pizzeria OKE</a> was among the first venues in Venice trained by AIC and has <strong>two physically separate kitchens</strong>: one dedicated exclusively to gluten-free preparations, from pizza to first courses. It also offers home delivery in some parts of the city.", image: { src: "https://images.unsplash.com/photo-1548365328-9f547fb0953b?auto=format&fit=crop&w=800&q=75", alt: "Round pizza baked in the oven" } },
        { title: "Grom", body: "In Dorsoduro, the gelateria <a href=\"/en/directory/grom-venezia\">Grom</a> prepares artisanal gelato in <strong>dedicated gluten-free cones</strong> across every location of the brand, reducing the risk of cross-contamination even during the busiest months." },
      ] },
      { h2: "Where to stay: a hotel with gluten-free breakfast", body: "Finding a safe breakfast at a hotel is often the trickiest part of a stay: in Castello, near Piazza San Marco, <a href=\"/en/directory/hotel-al-piave-venezia\">Hotel Al Piave</a> is one of the few AIC-certified hotels in Venice and offers an entirely gluten-free breakfast, with dedicated bread, biscuits and cereals, plus dairy-free options on request." },
      { h2: "Frequently asked questions about gluten-free Venice", body: "The most common questions from visitors dealing with celiac disease.", h3: [
        { title: "Are cicchetti safe for someone with celiac disease?", body: "Not always: many traditional cicchetti are made with bread crostini or fried items shared with other ingredients. It's best to always check with the bacaro staff before ordering, or head to venues with specifically gluten-free options." },
        { title: "Is it worth booking the hotel well ahead if I need gluten-free breakfast?", body: "Yes, especially during peak season: AIC-certified hotels in Venice are still few, so booking well in advance increases your chances of finding availability during the busiest periods." },
        { title: "Do all pizzerias in Venice have a dedicated oven?", body: "No, not all of them: always check whether the pizzeria has a separate kitchen or oven for gluten-free, as at Pizzeria OKE, before considering it a 100% safe choice." },
      ] },
    ],
    faqs: [
      { question: "Where can I eat gluten-free pizza in Venice?", answer: "Pizzeria OKE, at the Zattere, has two physically separate kitchens and was among the first venues in the city trained by AIC: find it in the Mappa Senza Glutine directory." },
      { question: "Is there a hotel in Venice with gluten-free breakfast?", answer: "Yes, Hotel Al Piave in Castello, near Piazza San Marco, is AIC-certified and offers an entirely gluten-free breakfast with dairy-free options on request." },
      { question: "Where can I find safe gelato in Venice?", answer: "The gelateria Grom in Dorsoduro uses dedicated gluten-free cones across every location of the brand, reducing the risk of cross-contamination." },
    ],
    tags: ["venice", "hotel", "pizzerias", "guides"],
  },
  "art-32": {
    title: "Gluten-Free Bari: Focaccia, Panzerotti and Tray Pizza Without Compromise",
    excerpt: "Where to eat gluten-free in Bari: Bari-style focaccia and panzerotti gluten-free, a dedicated lab since 2013, and where to shop for gluten-free groceries in the city.",
    authorRole: "Gluten-free food blogger",
    keyTakeaways: [
      "Bari has a lab entirely dedicated to gluten-free active since 2013, the first of its kind in the city, with products available via a regional health voucher.",
      "Bari-style focaccia and panzerotti, symbols of local cuisine, now also exist in a certified gluten-free version.",
      "A bakery authorized by the Ministry of Health guarantees traceability and controls on gluten-free production.",
      "For tray pizza, always check whether the rice-flour dough is prepared in a separate area.",
    ],
    sections: [
      { h2: "Eating gluten-free in Bari: from focaccia to panzerotti", body: "Bari-style focaccia, panzerotti, orecchiette: Bari's cuisine is built mostly on bread and pasta, two categories that require the utmost care for someone with celiac disease. The city, though, offers verified addresses, from a dedicated bakery to a pizzeria with an alternative dough, to enjoy Puglia's flavors gluten-free." },
      { h2: "Bakery and deli: the city's reference point", body: "Two addresses dedicated to gluten-free baking, each with its own specialty.", h3: [
        { title: "La Gouterie", body: "<a href=\"/en/directory/la-gouterie-bari\">La Gouterie</a> is Bari's first pastry shop and deli entirely dedicated to gluten-free, active since 2013: it offers sweet and savory items, deli food and packaged products, some available <strong>via regional health voucher</strong>." },
        { title: "Panificio Magda", body: "<a href=\"/en/directory/panificio-magda-bari\">Panificio Magda</a> has a lab <strong>authorized by the Ministry of Health</strong> for certified gluten-free production, where you'll find Bari-style focaccia, panzerotti and bread, traceable alongside traditional production.", image: { src: "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&w=800&q=75", alt: "Freshly baked focaccia" } },
      ] },
      { h2: "Gluten-free tray pizza in downtown Bari", body: "On Via Sparano, in the heart of the city, <a href=\"/en/directory/solho-bari\">Solho</a> offers tray pizza with a <strong>rice-flour dough</strong> as a gluten-free alternative, alongside traditional Puglia cuisine: a handy option for anyone visiting the historic center." },
      { h2: "Frequently asked questions about gluten-free Bari", body: "The most common questions from people looking for where to eat gluten-free in the city.", h3: [
        { title: "Where can I find gluten-free Bari-style focaccia?", body: "Panificio Magda produces gluten-free Bari-style focaccia in a lab authorized by the Ministry of Health, with guaranteed traceability compared to traditional production." },
        { title: "Are there products available via health voucher in Bari?", body: "Yes, La Gouterie also offers packaged products available via regional health voucher, alongside daily fresh sweet and savory gluten-free items." },
        { title: "Is gluten-free tray pizza safe for someone with celiac disease?", body: "Always check whether the rice-flour dough is prepared in an area separate from the traditional pizza dough, to rule out the risk of cross-contamination during preparation." },
      ] },
    ],
    faqs: [
      { question: "Where can I eat gluten-free in Bari?", answer: "Verified addresses include La Gouterie, a pastry shop and deli 100% gluten-free since 2013, Panificio Magda with a lab authorized by the Ministry of Health, and Solho for tray pizza with rice-flour dough." },
      { question: "Are there bakeries dedicated to gluten-free in Bari?", answer: "Yes, Panificio Magda has a lab authorized by the Ministry of Health for certified gluten-free production of Bari-style focaccia, panzerotti and bread." },
      { question: "Can I find products available via health voucher in Bari?", answer: "Yes, La Gouterie offers gluten-free packaged products also available via regional health voucher, alongside daily fresh production." },
    ],
    tags: ["bari", "focaccia", "bakery", "guides"],
  },
  "art-33": {
    title: "Gluten-Free Palermo: Pizzerias, Arancini and Gelato in a City Built for Celiacs",
    excerpt: "A guide to gluten-free Palermo: pizzerias entirely dedicated to gluten-free and AIC-certified, fried food with a dedicated fryer, and a historic gelateria since 1976 with no surcharge on gluten-free flavors.",
    authorRole: "Food safety content specialist",
    keyTakeaways: [
      "Palermo has pizzerias that were born entirely dedicated to gluten-free, not just venues that also offer gluten-free options.",
      "Arancini and street-food fried items are gluten-free only where a dedicated fryer exists: always check before ordering.",
      "The city has a historic gelateria since 1976 that offers gluten-free flavors with no surcharge at all.",
      "The northern part of the city hosts a bakery-pastry shop with entirely in-house production and no risk of contamination.",
    ],
    sections: [
      { h2: "Eating gluten-free in Palermo: between street food and tradition", body: "Arancini, panelle, sfincione: Palermo's street food is built mostly on frying and dough, delicate categories for someone with celiac disease. Palermo, though, offers a network of verified venues, some born from the start entirely dedicated to gluten-free, letting you experience Sicilian tradition safely." },
      { h2: "AIC-certified pizzerias and bistros", body: "Two very different addresses, both AIC-certified.", h3: [
        { title: "Pizzicotto", body: "<a href=\"/en/directory/pizzicotto-palermo\">Pizzicotto</a> is a pizzeria born entirely dedicated to gluten-free, not just with a few gluten-free options on the menu: the kitchen, oven and work stations are exclusively reserved for gluten-free preparation, with AIC certification.", image: { src: "https://images.unsplash.com/photo-1590534247854-e97d5e3feef8?auto=format&fit=crop&w=800&q=75", alt: "Round pizza on a wooden table" } },
        { title: "Bistrot 107", body: "In downtown Palermo, <a href=\"/en/directory/bistrot-107-palermo\">Bistrot 107</a> is AIC-certified and offers almost the entire menu gluten-free, including <strong>arancini fried in a dedicated fryer</strong>, plus sandwiches and traditional Sicilian flatbreads." },
      ] },
      { h2: "Dedicated bakery and historic gelato", body: "For daily groceries and a sweet break, two reliable addresses in the city: <a href=\"/en/directory/no-gluten-bakery-palermo\">No Gluten Bakery</a>, in the northern part of town, has a lab entirely dedicated to in-house production of gluten-free brioche, bread, pizza and panelle, while <a href=\"/en/directory/gelato-2-palermo\">Gelato 2</a> is a historic gelateria since 1976 offering gluten-free flavors with <strong>no surcharge at all</strong> compared to the others." },
      { h2: "Frequently asked questions about gluten-free Palermo", body: "The most common questions from visitors or residents dealing with celiac disease.", h3: [
        { title: "Are gluten-free arancini safe in Palermo?", body: "Only where a fryer is dedicated exclusively to gluten-free, as at Bistrot 107: without this guarantee, the risk of cross-contamination in shared frying remains real." },
        { title: "What does it mean for a pizzeria to be born entirely dedicated to gluten-free?", body: "It means that, unlike a venue that adds gluten-free options to a traditional menu, the entire kitchen, oven and work stations are reserved exclusively for gluten-free preparation from the venue's founding, as at Pizzicotto." },
        { title: "Does gluten-free gelato cost more in Palermo?", body: "Not necessarily: at the historic Gelato 2, for example, gluten-free flavors are offered at the same price as the others, with no surcharge." },
      ] },
    ],
    faqs: [
      { question: "What gluten-free pizzerias are there in Palermo?", answer: "Pizzicotto is a pizzeria born entirely dedicated to gluten-free and AIC-certified, while Bistrot 107 in the city center offers almost the entire menu gluten-free, arancini included." },
      { question: "Where can I find a dedicated gluten-free bakery in Palermo?", answer: "No Gluten Bakery, in the northern part of the city, has a lab entirely dedicated to in-house production of gluten-free brioche, bread, pizza and panelle." },
      { question: "Is there a historic gluten-free gelateria in Palermo?", answer: "Yes, Gelato 2 has been active since 1976 and offers gluten-free flavors with no surcharge, with attention to lactose and vegan options too." },
    ],
    tags: ["palermo", "sicily", "arancini", "guides"],
  },
  "art-34": {
    title: "Gluten-Free Genoa: Pizza, Focaccia and a Dedicated Bakery Across the City's Districts",
    excerpt: "Where to eat gluten-free in Genoa: AIC-certified pizzerias in Sampierdarena and Prà, a bakery-pastry shop that recently opened in Sestri Ponente, and alternative doughs worth trying.",
    authorRole: "Gluten-free food blogger",
    keyTakeaways: [
      "Genoa has several AIC-certified pizzerias with a dedicated oven, spread across different districts of the city.",
      "A bakery-pastry shop that opened recently in Sestri Ponente joined the AIC Liguria network with a lab exclusively for gluten-free.",
      "Some pizzerias also offer alternative doughs, like whole wheat or kamut, alongside the gluten-free one.",
      "Always checking for certification and a dedicated oven remains the most reliable way to choose where to eat safely.",
    ],
    sections: [
      { h2: "Eating gluten-free in Genoa: focaccia and pizza among the alleys", body: "Genoese focaccia, pizza, farinata: Ligurian cuisine also revolves heavily around leavened dough. Genoa now offers several AIC-certified pizzerias across different districts, plus a bakery-pastry shop that recently opened, entirely dedicated to gluten-free." },
      { h2: "AIC-certified pizzerias in the city", body: "Two addresses in different districts, both with a dedicated oven and AIC certification.", h3: [
        { title: "Franco Pizzeria", body: "In Sampierdarena, <a href=\"/en/directory/franco-pizzeria-genova\">Franco Pizzeria</a> is AIC-certified with a <strong>dedicated oven</strong> for gluten-free preparation: it offers gluten-free and dairy-free pizzas, plus gluten-free beer and desserts, with home delivery available.", image: { src: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=75", alt: "Round pizza with mozzarella and basil" } },
        { title: "I Due Fratelli", body: "In the Prà district, <a href=\"/en/directory/i-due-fratelli-genova\">I Due Fratelli</a> is an AIC-certified bar-pizzeria offering alternative doughs, including <strong>whole wheat, kamut and gluten-free</strong>, for anyone looking for more options beyond the classic gluten-free choice." },
      ] },
      { h2: "The newest bakery: Sestri Ponente", body: "Opened at the end of 2024, <a href=\"/en/directory/randazzo-gluten-free-genova\">Randazzo Gluten Free</a> in Sestri Ponente is an artisanal lab dedicated exclusively to gluten-free, with dairy-free products too: it offers focaccia, pizza, snacks and desserts, and has joined the AIC Liguria network." },
      { h2: "Frequently asked questions about gluten-free Genoa", body: "The most common questions from people looking for where to eat gluten-free in the city.", h3: [
        { title: "Do all pizzerias in Genoa have a dedicated oven?", body: "No, always check individually: Franco Pizzeria in Sampierdarena and I Due Fratelli in Prà are both AIC-certified with specific attention to gluten-free, but this isn't the rule for every pizzeria in the city." },
        { title: "Where can I find gluten-free focaccia in Genoa?", body: "Randazzo Gluten Free in Sestri Ponente, opened recently, offers gluten-free focaccia in a lab dedicated exclusively to this type of production, with no risk of cross-contamination." },
        { title: "Are there alternative doughs beyond gluten-free in Genoa?", body: "Yes, some pizzerias like I Due Fratelli also offer whole wheat or kamut doughs alongside the gluten-free one, for anyone looking for more variety in their choices." },
      ] },
    ],
    faqs: [
      { question: "Where can I eat gluten-free pizza in Genoa?", answer: "Franco Pizzeria in Sampierdarena and I Due Fratelli in Prà are both AIC-certified with a dedicated oven: find them in the Mappa Senza Glutine directory." },
      { question: "Is there a bakery dedicated to gluten-free in Genoa?", answer: "Yes, Randazzo Gluten Free in Sestri Ponente is an artisanal lab that opened recently, dedicated exclusively to gluten-free and part of the AIC Liguria network." },
      { question: "Do gluten-free pizzerias in Genoa deliver?", answer: "Some do, like Franco Pizzeria: always check availability for your district directly on the website or by phone before ordering." },
    ],
    tags: ["genoa", "pizzerias", "guides"],
  },
  "art-35": {
    title: "Gluten-Free Verona: What to Eat Between the Arena, the Old Town and Specialty Shops",
    excerpt: "A guide to gluten-free Verona: an AIC-certified vegan restaurant, the pizzeria right across from the Arena, a shop with over 100 products partnered with the local health authority, and a gelateria in the AIC network since 2010.",
    authorRole: "Food safety content specialist",
    keyTakeaways: [
      "Verona offers an AIC-certified restaurant with an entirely vegan and gluten-free menu, plus a pizzeria right across from the Arena.",
      "A specialty shop in the city carries over 100 gluten-free products and is partnered with the local health authority for celiac vouchers.",
      "An artisanal gelateria has been part of the AIC network since 2010, among the longest-standing in the city on this front.",
      "For everyday groceries, a dedicated shop can be more convenient than relying only on the supermarket's gluten-free aisle.",
    ],
    sections: [
      { h2: "Eating gluten-free in Verona: from downtown to the Arena", body: "Among Veneto's art cities, Verona now offers a network of verified addresses for people with celiac disease: from an entirely vegan and gluten-free restaurant to a pizzeria right across from the Arena, all the way to a specialty shop for everyday groceries." },
      { h2: "Restaurant and pizzeria in the heart of the city", body: "Two central addresses, both AIC-certified.", h3: [
        { title: "Ristorante Flora", body: "<a href=\"/en/directory/ristorante-flora-verona\">Ristorante Flora</a> has a menu that's entirely <strong>vegan, gluten-free and dairy-free</strong>, AIC-certified: it offers a buffet lunch and an à la carte dinner, in downtown Verona." },
        { title: "La Costa in Bra", body: "Right across from the Arena, <a href=\"/en/directory/la-costa-in-bra-verona\">La Costa in Bra</a> offers gluten-free and dairy-free doughs, AIC-certified, handy for a lunch or dinner break before a show.", image: { src: "https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&w=800&q=75", alt: "Round pizza seen from above" } },
      ] },
      { h2: "Groceries and gelato: the other verified addresses", body: "For everyday groceries, <a href=\"/en/directory/gusto-libero-verona\">Gusto Libero</a> is a specialty shop with <strong>over 100 gluten-free and dairy-free products</strong>, partnered with the Veneto local health authority for celiac vouchers. For gelato, <a href=\"/en/directory/gelateria-artigianale-oasi-verona\">Gelateria Artigianale Oasi</a> has been part of the AIC network since 2010, among the longest-standing in the city on this front." },
      { h2: "Frequently asked questions about gluten-free Verona", body: "The most common questions from visitors or residents dealing with celiac disease.", h3: [
        { title: "Where do I shop for gluten-free groceries in Verona?", body: "Gusto Libero is a specialty shop with over 100 gluten-free and dairy-free products, handy for everyday groceries and partnered with the local health authority for celiac vouchers." },
        { title: "Is there an entirely gluten-free restaurant in Verona?", body: "Yes, Ristorante Flora has a menu that's entirely vegan, gluten-free and dairy-free, AIC-certified, with a buffet format at lunch and à la carte at dinner." },
        { title: "Can I eat gluten-free pizza near the Arena?", body: "Yes, La Costa in Bra is right across from the Arena and offers gluten-free and dairy-free doughs, AIC-certified, handy before or after a show." },
      ] },
    ],
    faqs: [
      { question: "Where can I eat gluten-free near the Arena in Verona?", answer: "La Costa in Bra is right across from the Arena and offers pizza with gluten-free and dairy-free doughs, AIC-certified." },
      { question: "Is there a specialty shop for gluten-free products in Verona?", answer: "Yes, Gusto Libero carries over 100 gluten-free and dairy-free products and is partnered with the Veneto local health authority for celiac vouchers." },
      { question: "Where can I find safe gelato in Verona?", answer: "Gelateria Artigianale Oasi has been part of the AIC network since 2010 and offers a genuine selection dedicated to people with gluten intolerance." },
    ],
    tags: ["verona", "shops", "guides"],
  },
  "art-36": {
    title: "Does a Gluten-Free Diet Help You Lose Weight? What Science Really Says",
    excerpt: "Does a gluten-free diet help you lose weight? The honest answer: early weight loss usually comes from what you remove and add to your plate, not from gluten itself.",
    authorRole: "Nutritionist & biologist",
    metaTitle: "Does Gluten-Free Help You Lose Weight? | Mappa Senza Glutine",
    metaDescription: "Does a gluten-free diet help you lose weight? What science really says: why early weight loss usually comes from what you remove, not gluten itself.",
    keyTakeaways: [
      "There's no scientific evidence that gluten itself causes weight gain or loss in people without celiac disease or gluten sensitivity.",
      "The weight loss often seen when starting a gluten-free diet usually comes from cutting processed foods and paying closer attention to labels, not from gluten itself.",
      "Many packaged gluten-free products make up for texture with more fat or sugar: they aren't automatically 'lighter' than traditional versions.",
      "For people with celiac disease, a gluten-free diet remains a medical necessity for gut health, not a weight-loss strategy.",
    ],
    sections: [
      { h2: "Does a gluten-free diet help you lose weight? The short answer", body: "It's one of the most searched questions online, and the honest answer is: <strong>no, not through any direct mechanism tied to gluten itself</strong>. Gluten is a protein, it doesn't carry more calories than other nutrients, and no study shows a specific weight-loss effect in people without celiac disease or gluten sensitivity. When weight loss does happen, it almost always has other causes worth understanding before starting a gluten-free diet purely to lose weight." },
      { h2: "So why do many people lose weight when they start", body: "The initial weight loss some people notice has simpler explanations than gluten itself.", h3: [
        { title: "Many processed foods get cut automatically", body: "White bread, fast-food pizza, packaged snacks, baked sweets: many of the most calorie-dense, least filling foods in a typical Western diet contain gluten. Removing them naturally lowers overall calorie intake, regardless of gluten as a substance." },
        { title: "You pay more attention to what you eat", body: "Starting a diet with clear rules almost always leads to reading labels more carefully, cooking at home more often and cutting impulsive snacking: a behavioral effect that alone can explain much of the initial weight loss." },
      ] },
      { h2: "The other side of the coin: gluten-free products aren't automatically 'light'", body: "To recreate the soft, elastic texture gluten naturally provides, many packaged gluten-free products (bread, cookies, baked snacks) use more fat, starch or added sugar. The result is that, category for category, a gluten-free product can have an equal or higher calorie count than the traditional version: always reading the nutrition label remains the most informed choice, rather than assuming 'gluten-free' means 'lighter'." },
      { h2: "Frequently asked questions about gluten-free diets and weight", body: "The most searched questions on this controversial topic.", h3: [
        { title: "Should someone without celiac disease cut gluten to lose weight?", body: "There's no scientific evidence to support it: a balanced diet with fewer processed foods, regardless of gluten, delivers the same results without the restrictions and extra costs of a medically unnecessary gluten-free diet." },
        { title: "Is losing weight a sign of celiac disease?", body: "Unintentional weight loss can be one of the symptoms of undiagnosed celiac disease, alongside signs like bloating, fatigue or nutrient deficiencies: if you suspect celiac disease, the right path is talking to a doctor before removing gluten, not starting a DIY diet." },
        { title: "How can I lose weight safely while staying gluten-free, if I have celiac disease?", body: "The same rules that apply to anyone: mind your portions, prefer fresh, unprocessed foods over packaged gluten-free substitutes, and get regular physical activity, ideally with support from a nutritionist familiar with celiac disease." },
      ] },
    ],
    faqs: [
      { question: "Does a gluten-free diet help you lose weight?", answer: "No, not through a direct effect of gluten: the initial weight loss some people notice usually comes from cutting processed foods and paying closer attention to labels." },
      { question: "Are gluten-free products lighter than traditional ones?", answer: "Not necessarily: many packaged gluten-free baked goods contain more fat or added sugar to make up for texture, so they should be judged by reading the nutrition label." },
      { question: "Should a non-celiac person cut gluten to lose weight?", answer: "There's no scientific evidence supporting this choice: a balanced diet with fewer processed foods delivers similar results without the restrictions of a medically unnecessary gluten-free diet." },
    ],
    tags: ["weight loss", "gluten-free diet", "nutrition", "myths"],
  },
  "art-37": {
    title: "Gluten-Free Shopping at Discount Stores: Aldi, Lidl and Eurospin Compared",
    excerpt: "Is gluten-free grocery shopping cheaper at discount stores? Aldi, Lidl and Eurospin's dedicated lines compared, and how to save without giving up on safety.",
    authorRole: "Food safety content specialist",
    metaTitle: "Gluten-Free Shopping at Discount Stores | Mappa Senza Glutine",
    metaDescription: "Gluten-free shopping at discount stores: Aldi, Lidl and Eurospin's dedicated lines compared, and how to save without giving up on AIC certification.",
    keyTakeaways: [
      "Eurospin has its own dedicated line, 'Amo Essere Senza Glutine', with AIC-verified products carrying the Crossed Grain symbol.",
      "Aldi offers the 'Enjoy Free' line, dedicated to gluten-free and dairy-free products.",
      "Lidl offers fresh gluten-free products (like fresh pasta) and some items under its Realforno brand, alongside well-known brands on the shelves.",
      "Real savings should always be checked product by product: not every discount item costs less than a well-known brand on sale.",
    ],
    sections: [
      { h2: "Is gluten-free shopping at discount stores actually worth it?", body: "Anyone living gluten-free every day knows the problem well: certified products often cost more than traditional versions (we cover this in detail in our <a href=\"/en/blog/quanto-costa-la-dieta-senza-glutine-guida-a-costi-buoni-pasto-aic-e-detrazioni-fiscali\">guide to the cost of a gluten-free diet</a>). In recent years, though, Italy's major discount chains have developed dedicated lines: let's see what Eurospin, Aldi and Lidl actually offer." },
      { h2: "The dedicated lines at Italian discount chains", body: "Each chain has a different range in structure and breadth.", h3: [
        { title: "Eurospin: Amo Essere Senza Glutine", body: "Eurospin offers its own line, <strong>Amo Essere Senza Glutine</strong>, with products verified by AIC and the Crossed Grain symbol on the label: pasta, baked goods and snacks under the discount chain's own brand, designed specifically for people on a gluten-free diet." },
        { title: "Aldi: Enjoy Free", body: "Aldi has a dedicated line called <strong>Enjoy Free</strong>, covering both gluten-free and dairy-free products, available at the chain's stores in Italy." },
        { title: "Lidl: fresh products and the Realforno brand", body: "Lidl offers some fresh gluten-free products, like fresh pasta, plus items from its in-house <strong>Realforno</strong> brand available in gluten-free versions, alongside well-known brands placed on dedicated shelves." },
      ] },
      { h2: "How to save without giving up on safety", body: "A few tips for smart gluten-free grocery shopping: <ul><li><strong>Always check for the Crossed Grain symbol</strong> on the label, regardless of price or discount chosen.</li><li><strong>Compare the price per kilo</strong>, not just the package price: discount house-brand lines aren't always cheaper than well-known brands on sale.</li><li><strong>Mix naturally gluten-free fresh foods</strong> (rice, corn, legumes, vegetables) with packaged substitutes, which remain the most expensive category anyway.</li><li><strong>Check availability at your local store</strong>: the range of dedicated lines can vary from store to store.</li></ul>" },
      { h2: "Frequently asked questions about gluten-free shopping at discount stores", body: "The most common questions from people looking to save without giving up on safety.", h3: [
        { title: "Are discount stores' gluten-free products as safe as branded ones?", body: "Yes, if they carry the Crossed Grain symbol or otherwise meet the certification required by European 'gluten-free' labeling rules: the lower price relates to the discount chain's cost structure, not food safety." },
        { title: "Is it always better to choose the discount store's own line over a well-known brand?", body: "Not always: some well-known brands on sale can cost less than dedicated discount lines. It's worth comparing the price per kilo product by product, especially for pasta and bread, the most purchased items." },
        { title: "Do all discount chains in Italy have a dedicated gluten-free line?", body: "The main discount chains have developed their own offering in recent years, but the range varies a lot: it's worth checking directly at your nearest store." },
      ] },
    ],
    faqs: [
      { question: "Which discount stores have gluten-free products in Italy?", answer: "Eurospin has the Amo Essere Senza Glutine line, Aldi has the Enjoy Free line, while Lidl offers fresh gluten-free products and some items under its Realforno brand." },
      { question: "Are discount stores' gluten-free products certified?", answer: "Dedicated lines like Eurospin's Amo Essere Senza Glutine carry the AIC Crossed Grain symbol on the label: always check it before buying, regardless of the store." },
      { question: "Is it worth shopping gluten-free at discount stores?", answer: "It can be worth it for some products, but not always: compare the price per kilo with well-known brands on sale before assuming you're saving money." },
    ],
    tags: ["shopping", "discount", "savings", "supermarkets"],
  },
  "art-38": {
    title: "Gluten-Free Panettone and Colomba: Where to Find Them and What to Choose",
    excerpt: "Gluten-free panettone and colomba for the holidays: Nutrifree and Schär's offerings, where to buy them and what to check on the label before choosing.",
    authorRole: "Gluten-free food blogger",
    metaTitle: "Gluten-Free Panettone and Colomba | Mappa Senza Glutine",
    metaDescription: "Gluten-free panettone and colomba: Nutrifree and Schär's holiday offerings, where to find them and what to check on the label before you buy.",
    keyTakeaways: [
      "Nutrifree offers a classic gluten-free panettone with raisins and candied fruit, born from a collaboration with the Sicilian pastry lab Punto Caldo, plus a chocolate version and a savory one for holiday appetizers.",
      "Nutrifree also makes gluten-free Easter colombas, including a classic version and one with chocolate chips.",
      "Schär offers its own gluten-free panettone, with a soft texture designed to get as close as possible to the traditional treat.",
      "Always check for the Crossed Grain symbol on the label even for seasonal products: availability in stores can vary as the holidays approach.",
    ],
    sections: [
      { h2: "Gluten-free panettone and colomba: the challenge of holiday leavened treats", body: "Panettone and colomba are among the hardest sweets to recreate gluten-free: soft, leavened doughs enriched with butter, eggs and candied fruit, where gluten normally plays a key structural role. In recent years, though, some specialized brands have developed gluten-free recipes that get very close to the tradition." },
      { h2: "The offerings to know for Christmas and Easter", body: "Two specialized brands now offer a wide choice for the holidays.", h3: [
        { title: "Nutrifree: panettone and colomba", body: "<a href=\"/en/prodotti\">Nutrifree</a> offers a classic gluten-free panettone with raisins and candied fruit, born from a collaboration with the Sicilian artisanal lab <strong>Punto Caldo</strong>, plus a chocolate version and a savory panettone gastronomico for holiday appetizers. For Easter, the range includes a classic colomba and one with chocolate chips, both gluten-free and dairy-free." },
        { title: "Schär: the traditional panettone", body: "<strong>Schär</strong> also offers its own gluten-free panettone, with a soft texture designed to get as close as possible to the traditional sweet, enriched with raisins and candied fruit." },
      ] },
      { h2: "Where to buy gluten-free panettone and colomba", body: "Pharmacies with a dedicated section, specialty shops like those in our <a href=\"/en/directory\">directory</a>, and online sales are the most reliable channels, especially close to the holidays when availability at general supermarkets can be limited: it's worth ordering a few weeks ahead to make sure you find the product you want." },
      { h2: "Frequently asked questions about gluten-free panettone and colomba", body: "The most common questions from people looking for gluten-free holiday sweets.", h3: [
        { title: "Does gluten-free panettone taste the same as the traditional one?", body: "Specialized brands like Nutrifree and Schär have developed recipes designed to get very close to the texture and taste of traditional panettone, though perception remains subjective: quality has improved noticeably in recent years." },
        { title: "When is the best time to buy gluten-free panettone and colomba?", body: "It's best to order a few weeks ahead of Christmas or Easter: availability at general stores can be limited in the days right before the holiday, while pharmacies and specialty shops tend to keep more stable stock." },
        { title: "Where can I find these products outside the holiday season?", body: "Some specialty shops and the producers' own online stores keep them available outside the season, but the choice is generally wider close to Christmas and Easter." },
      ] },
    ],
    faqs: [
      { question: "Which brands make gluten-free panettone?", answer: "Nutrifree and Schär are among the specialized brands offering a gluten-free panettone, with recipes designed to get close to the texture of the traditional one." },
      { question: "Is there a gluten-free Easter colomba?", answer: "Yes, Nutrifree offers a gluten-free Easter colomba, available in a classic version and one with chocolate chips." },
      { question: "Where can I buy gluten-free panettone?", answer: "At pharmacies with a dedicated section, at specialty shops in our directory, and online: it's worth ordering ahead, especially close to Christmas." },
    ],
    tags: ["panettone", "colomba", "christmas", "easter", "holiday sweets"],
  },
  "art-39": {
    title: "Gluten-Free Beer: The Brands to Know and What to Know Before Drinking It",
    excerpt: "Gluten-free beer: which brands are AIC-certified, the difference between de-glutenized beers and naturally gluten-free ones, and how much to drink safely.",
    authorRole: "Food safety content specialist",
    metaTitle: "Gluten-Free Beer: Brands to Know | Mappa Senza Glutine",
    metaDescription: "Gluten-free beer: which brands are AIC-certified, how the de-glutenization process works, and how much to drink safely according to AIC.",
    keyTakeaways: [
      "Peroni Senza Glutine is among the most widespread gluten-free beers in Italy, AIC-certified with a gluten content below 10 ppm.",
      "Green's, an English brand brewed in Belgium, is among the gluten-free beers most appreciated by the Italian celiac community.",
      "There are also certified Italian beers like Lol, brewed in Friuli, mostly found in specialty shops.",
      "AIC still recommends moderate consumption of 'gluten-free' beers made from barley malt, since they retain a fixed residue of gluten below the threshold.",
    ],
    sections: [
      { h2: "Why beer is a special case for people with celiac disease", body: "Traditional beer is brewed from cereals like barley and wheat, both containing gluten: that's why, unlike pasta or bread, it's not enough to start from an alternative ingredient — specific production processes are needed to get a beer that's safe for celiacs, verified and certified by AIC with the Crossed Grain symbol on the label." },
      { h2: "De-glutenization or gluten-free cereals: two different paths", body: "There are two main approaches on the market for making gluten-free beer.", h3: [
        { title: "De-glutenized beers from barley malt", body: "These are beers brewed with traditional barley malt, then put through an enzymatic process that breaks down gluten proteins until the content falls below the 20 ppm threshold required by European rules for the 'gluten-free' label." },
        { title: "Beers naturally made without gluten-containing cereals", body: "Other beers are brewed from the start with cereals naturally free of gluten, like rice, corn or sorghum, with no need for a later de-glutenization process." },
      ] },
      { h2: "Gluten-free beer brands to know", body: "Some certified brands, with varying availability on the Italian market.", h3: [
        { title: "Peroni Senza Glutine", body: "<strong>Peroni Senza Glutine</strong> is a lager brewed with a gluten-removal process that doesn't alter the product's taste and aroma, AIC-certified with a gluten content below 10 ppm: among the easiest gluten-free beers to find in Italy." },
        { title: "Green's", body: "<strong>Green's</strong>, an English brand brewed in Belgium, is one of the gluten-free beers most appreciated by the Italian celiac community, mostly found in specialty shops and online." },
        { title: "Lol", body: "<strong>Lol</strong> is an Italian gluten-free beer brewed in Friuli, a homegrown alternative to foreign options, mainly available in specialty shops." },
      ] },
      { h2: "How much to drink safely, according to AIC", body: "The Italian Celiac Association still recommends moderate, occasional consumption of 'gluten-free' beers obtained from barley or wheat malt through de-glutenization, since they retain a fixed residue of gluten, even if below the safety threshold: beers naturally brewed from gluten-free cereals, like rice or corn, don't carry this same limitation." },
      { h2: "Frequently asked questions about gluten-free beer", body: "The most common questions from people who want to drink beer safely as a celiac.", h3: [
        { title: "Are all 'gluten-free' beers the same?", body: "No: some are de-glutenized from traditional barley malt, others are brewed from the start with gluten-free cereals like rice or corn. Both meet the 20 ppm threshold, but AIC recommends more caution with the former." },
        { title: "Where can I buy gluten-free beer in Italy?", body: "Peroni Senza Glutine is commonly found at the supermarket, while brands like Green's or Lol are easier to find at specialty shops or online." },
        { title: "How much gluten-free beer can I drink if I have celiac disease?", body: "AIC recommends moderate, occasional consumption of beers de-glutenized from barley malt: if you're unsure about your individual tolerance, it's best to check with your doctor." },
      ] },
    ],
    faqs: [
      { question: "What are the best gluten-free beer brands?", answer: "Peroni Senza Glutine is among the most widespread and easiest to find in Italy, AIC-certified; Green's and Lol are other certified options, mostly found in specialty shops." },
      { question: "Is gluten-free beer 100% safe for celiacs?", answer: "AIC-certified beers meet the 20 ppm safety threshold, but AIC still recommends moderate consumption of beers de-glutenized from barley malt, which retain a fixed residue of gluten below the threshold." },
      { question: "What's the difference between de-glutenized beer and naturally gluten-free beer?", answer: "De-glutenized beer starts from traditional barley malt put through an enzymatic process; naturally gluten-free beer is brewed from the start with cereals like rice or corn, with no de-glutenization needed." },
    ],
    tags: ["beer", "drinks", "AIC", "products"],
  },
  "art-40": {
    title: "Celiac Disease in Men: Why Diagnosis Comes Later",
    excerpt: "Celiac disease is diagnosed mostly in women, and in men it arrives roughly a decade later: why that happens, which signs get overlooked, and what to ask your doctor.",
    authorRole: "Nutritionist & biologist",
    metaTitle: "Celiac Disease in Men: Later Diagnosis | Mappa Senza Glutine",
    metaDescription: "Why celiac disease is diagnosed later in men: the data on diagnoses, the average delay, and the signs that often get attributed to something else.",
    keyTakeaways: [
      "According to AIC, around 70% of celiac diagnoses in Italy are women: not because men get the condition far less often, but because they reach diagnosis with more difficulty.",
      "The average age at diagnosis in men falls between the fourth and fifth decade of life, against the third-to-fourth in women: about ten years of difference.",
      "An average of eight months passes between the first consultation and diagnosis, and nearly 1 in 5 cases gets a wrong diagnosis first, often irritable bowel syndrome.",
      "Celiac disease is not a 'women's condition': explicitly asking for serology tests when symptoms persist remains the most effective way to shorten the wait.",
    ],
    sections: [
      { h2: "A condition perceived as female", body: "The Italian Celiac Association's data is clear: <strong>around 70% of diagnoses in Italy are women</strong>. That figure often gets read as if celiac disease were a mostly female condition, but a more useful reading is different: a substantial share of celiac men simply never reach a diagnosis, or reach it much later. Understanding why helps avoid postponing testing when symptoms are there." },
      { h2: "Ten years of difference in age at diagnosis", body: "The best-documented difference isn't in symptoms, but in timing.", h3: [
        { title: "When the diagnosis arrives", body: "In women, age at diagnosis typically concentrates between the third and fourth decade of life; in men it shifts to between the fourth and fifth. In practice: about ten more years living with an untreated condition, with the risk of avoidable consequences like nutrient deficiencies or early osteoporosis." },
        { title: "The delay everyone shares", body: "Even once the process starts, timelines stay long for everyone: an average of eight months passes between the first consultation and a definitive diagnosis, and in nearly one case out of five a wrong diagnosis comes first, very often irritable bowel syndrome." },
      ] },
      { h2: "The signs attributed to something else", body: "Recurring bloating, chronic fatigue, iron-deficiency anemia that doesn't resolve with supplements, intermittent abdominal pain: these are signs that, if they persist, deserve specific celiac testing regardless of sex. The problem isn't that they show up radically differently in men, but that they're more readily traced back to stress, poor eating habits or generic gastrointestinal issues, without ever reaching the serology test. You'll find the full symptom picture in our <a href=\"/en/blog/celiachia-cos-e-sintomi-e-come-si-diagnostica\">guide to celiac disease</a>." },
      { h2: "What to do if you suspect celiac disease", body: "The path is the same for everyone and has one rule you must not break: <strong>don't remove gluten before completing the tests</strong>, because it skews the results. <ul><li><strong>Explicitly ask for anti-transglutaminase antibodies</strong> if symptoms have persisted for weeks.</li><li><strong>Mention any family history</strong>: the genetic component makes screening advisable for first-degree relatives.</li><li><strong>Bring a symptom diary</strong>, with duration and frequency: it makes the picture much harder to dismiss as occasional.</li><li><strong>If you get an irritable bowel diagnosis</strong> without celiac disease having been ruled out, ask for it to be ruled out.</li></ul>" },
      { h2: "Frequently asked questions about celiac disease in men", body: "The questions we get asked most on this topic.", h3: [
        { title: "Does celiac disease affect men less?", body: "Female diagnoses are around 70% of the total, but this also reflects different access to the diagnostic pathway: a share of celiac men stays undiagnosed, which is why the diagnosis figure shouldn't be read as an exact measure of how common the condition is in each sex." },
        { title: "Why does diagnosis in men come later?", body: "Both the perception of celiac disease as a female condition and the tendency to attribute recurring gastrointestinal symptoms to other causes before reaching serology testing play a role. The result is an average age at diagnosis about a decade higher." },
        { title: "Which tests should I ask for?", body: "The first step is a blood test for anti-transglutaminase antibodies, followed by an endoscopy with duodenal biopsy if positive. It's essential to keep eating gluten until all testing is complete." },
      ] },
    ],
    faqs: [
      { question: "How many celiac diagnoses in Italy involve men?", answer: "According to the Italian Celiac Association's data, around 70% of diagnoses are women, so slightly under a third involve men: a share that also reflects a generally later diagnosis." },
      { question: "At what age is celiac disease diagnosed in men?", answer: "Age at diagnosis in men typically falls between the fourth and fifth decade of life, against the third-to-fourth in women: about ten years of difference." },
      { question: "How long does it take to get a celiac diagnosis?", answer: "An average of eight months between the first consultation and definitive diagnosis, with nearly one case in five receiving a wrong diagnosis first, often irritable bowel syndrome." },
    ],
    tags: ["celiac disease", "diagnosis", "men", "health"],
  },
  "art-41": {
    title: "Flying Gluten-Free: The GFML Meal and What to Pack",
    excerpt: "How to request the gluten-free meal on a flight (code GFML), by when to do it, what to expect on board and which supplies to bring so you're never left without food.",
    authorRole: "Food safety content specialist",
    metaTitle: "Gluten-Free Meal on a Flight: GFML Guide | Mappa Senza Glutine",
    metaDescription: "How to request a gluten-free meal on a flight: what the GFML code means, when to book it, what to expect on board and which supplies to bring along.",
    keyTakeaways: [
      "The gluten-free in-flight meal is requested using the international code GFML, directly on the airline's website after booking your flight.",
      "It has to be booked ahead: the window runs roughly from 14 days out until 24-72 hours before departure, depending on the airline.",
      "The GFML meal arrives sealed with a visible label and is handed out by crew based on your seat: it's worth reconfirming at check-in.",
      "On short-haul and low-cost flights special meals often don't exist: packing sealed single-portion supplies remains the most reliable solution.",
    ],
    sections: [
      { h2: "What the GFML meal is and why the code matters", body: "Airlines manage special meals with standard international codes, and the gluten-free one is <strong>GFML</strong> (Gluten-Free Meal). Using the right code when you request it avoids misunderstandings: a generic \"wheat-free\" or \"vegetarian\" meal doesn't offer the same guarantees on gluten. Today almost every long-haul scheduled airline offers GFML in its special meal catalogue." },
      { h2: "When and how to request it", body: "The request happens online, not on board, and has a firm deadline.", h3: [
        { title: "The booking window", body: "The GFML meal is requested after buying your ticket, from the \"manage booking\" area of the airline's site. The window generally opens around 14 days before departure and closes between 24 and 72 hours before the flight, depending on the carrier: past that point the galley has already been loaded and nothing can be changed." },
        { title: "Reconfirming at check-in", body: "It's worth asking at the check-in desk whether the GFML request actually shows on your booking. It's the last moment when an error can still be flagged, and it costs thirty seconds." },
      ] },
      { h2: "What to expect on board", body: "The gluten-free meal arrives <strong>sealed and with a visible label</strong> stating its type, and crew hand it out based on the seat tied to the request, usually before the standard meal service. If it doesn't arrive, flag it immediately: recovering it once service has started is much harder. One extra precaution: always check the label before opening the tray, because mix-ups between different special meals are the most common error." },
      { h2: "Short flights, low cost and layovers: bring supplies", body: "On flights of a few hours and on most low-cost carriers, special meal service doesn't exist, and on board you'll only find packaged snacks with no guarantees. In layovers too, the availability of safe options varies enormously from airport to airport. Carrying sealed single-portion packaged products (crackers, crisp slices, bars) remains the simplest solution: you'll find some references among the <a href=\"/en/prodotti\">verified products</a> in the directory. For the rest of the trip, our <a href=\"/en/blog/viaggiare-senza-glutine-7-consigli-per-le-vacanze-sicure\">gluten-free travel guide</a> covers the general advice." },
      { h2: "Frequently asked questions about gluten-free meals on flights", body: "The most common questions from celiac flyers.", h3: [
        { title: "Is the GFML meal safe for a celiac?", body: "GFML meals are prepared by galleys following dedicated protocols and arrive sealed, but the level of guarantee varies from airline to airline. Always checking the label before opening the tray is the minimum precaution, and bringing your own supply anyway avoids going hungry if something goes wrong." },
        { title: "Can I bring gluten-free food in my carry-on?", body: "Packaged solid foods are generally allowed in carry-on baggage; restrictions apply to liquids and spreads over 100 ml. For international flights outside the EU, also check the destination country's customs rules on fresh food and animal-derived products." },
        { title: "What if the GFML meal doesn't arrive?", body: "Flag it to the crew immediately, before the standard meal service is finished: in some cases they can find a sealed alternative on board. If the request was on file and the meal wasn't there, it's worth reporting it to the airline after the flight too." },
      ] },
    ],
    faqs: [
      { question: "How do I request a gluten-free meal on a flight?", answer: "You request it online after booking your flight, from the \"manage booking\" area of the airline's website, selecting the special meal with the code GFML (Gluten-Free Meal)." },
      { question: "By when should I book the GFML meal?", answer: "The window opens roughly 14 days before departure and closes between 24 and 72 hours before the flight, depending on the airline." },
      { question: "Do low-cost airlines offer gluten-free meals?", answer: "In most cases no: on short-haul and low-cost flights special meal service isn't provided, so it's best to bring sealed single-portion supplies." },
    ],
    tags: ["travel", "flying", "GFML", "holidays"],
  },
  "art-42": {
    title: "Gluten-Free Flours: A Guide to Alternatives to Plain Flour",
    excerpt: "Rice, corn, buckwheat, chestnut, almond: how the main gluten-free flours behave in the kitchen, when to use them, and why blends work better than single flours.",
    authorRole: "Gluten-free food blogger",
    metaTitle: "Gluten-Free Flours: A Practical Guide | Mappa Senza Glutine",
    metaDescription: "A guide to gluten-free flours: rice, corn, buckwheat, chestnut and almond compared, how they behave in the kitchen and why a blend is usually the better choice.",
    keyTakeaways: [
      "No gluten-free flour replaces plain flour on its own: what's missing is gluten, which gives dough its structure and elasticity.",
      "Neutral flours (rice, corn) bring lightness but little flavor; characterful ones (buckwheat, chestnut, almond) bring taste but weigh the dough down.",
      "Certified ready-made blends combine starches, flours and binders already balanced: the most reliable choice for bread, pizza and leavened bakes.",
      "Watch out for oats: naturally gluten-free, but safe only when certified and processed in a dedicated supply chain.",
    ],
    sections: [
      { h2: "Why swapping plain flour isn't enough", body: "Gluten isn't just a protein to avoid: in traditional baking it's the structure of the dough itself, what traps the gases of fermentation and makes the network elastic. Removing it means rebuilding that function with other ingredients, which is why <strong>swapping plain flour one-to-one for a gluten-free flour almost never works</strong>: the result is dense, crumbly and dry. Understanding how individual flours behave helps you choose well, or understand what's inside a ready-made blend." },
      { h2: "The neutral flours: rice and corn", body: "They're the base of most gluten-free preparations.", h3: [
        { title: "Rice flour", body: "The most versatile and most used as a base: neutral flavor, light color, suited to cakes, béchamel and coating. On its own it tends to give a dry, slightly sandy result, which is why it's almost always paired with starches or other flours." },
        { title: "Corn flour", body: "Not to be confused with polenta: fine corn flour is excellent for crumbly baked goods like biscuits and shortcrust. It brings golden color and a natural sweetness, but little structure." },
      ] },
      { h2: "The characterful flours: buckwheat, chestnut, almond", body: "They bring flavor and nutritional value, but need careful dosing.", h3: [
        { title: "Buckwheat", body: "Despite the name it has nothing to do with wheat and is naturally gluten-free. Bold, slightly bitter flavor, great for pizzoccheri, savory crepes and rustic bread: it's rarely used above 30-40% of the total, or it dominates the taste." },
        { title: "Chestnut flour", body: "Sweet and fragrant, traditional in preparations like castagnaccio. Very characterful: in a mixed dough it's generally kept under 25%, both for flavor and because it weighs things down." },
        { title: "Almond flour", body: "Rich in good fats, it brings softness and structure to unleavened bakes, from cakes to tart bases. It doesn't rise and isn't used for bread, but it's precious in pastry." },
      ] },
      { h2: "Why ready-made blends remain the simplest choice", body: "A certified blend already combines starches (which bring lightness), flours (which bring structure and flavor) and binders like psyllium or guar gum, which partly mimic gluten's role. That's why, especially for bread, pizza and leavened bakes, a good blend gives more consistent results than any combination improvised at home: in our <a href=\"/en/prodotti\">verified products</a> section you'll find universal and dessert-specific blends, each with its certification checked one by one. If you want to start from a tested recipe, try the <a href=\"/en/blog/pizza-senza-glutine-fatta-in-casa-l-impasto-con-il-mix-universale\">pizza with the universal blend</a> or the <a href=\"/en/blog/torta-senza-glutine-facile-la-ricetta-base-con-il-mix-per-dolci\">basic cake with the dessert blend</a>." },
      { h2: "Frequently asked questions about gluten-free flours", body: "The most common doubts of anyone cooking gluten-free at home.", h3: [
        { title: "Can I swap plain flour for rice flour one-to-one?", body: "No, the result would be dry and structureless: rice flour works as a base but needs to be combined with starches and binders, or replaced with an already balanced blend, especially in leavened bakes." },
        { title: "Can oats be used in gluten-free recipes?", body: "Only if certified gluten-free: oats don't contain gluten themselves, but they're easily contaminated during farming, transport and processing, so a verified dedicated supply chain is needed." },
        { title: "Do gluten-free flours keep like regular ones?", body: "Flours rich in fat, like almond or chestnut, go rancid faster: keep them in airtight containers away from light, and in summer even in the fridge." },
      ] },
    ],
    faqs: [
      { question: "What's the best gluten-free flour for bread?", answer: "No single flour works well alone for bread: you need a blend of starches, flours and binders like psyllium or guar gum, which is why certified ready-made blends give more consistent results." },
      { question: "Does buckwheat contain gluten?", answer: "No, despite the name buckwheat isn't a cereal in the wheat family and is naturally gluten-free: it should still be bought certified to rule out contamination during processing." },
      { question: "How should gluten-free flours be stored?", answer: "In airtight containers away from light; fat-rich ones like almond and chestnut go rancid sooner and in summer are better kept in the fridge." },
    ],
    tags: ["flours", "cooking", "baking", "nutrition"],
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
    metaTitle: tr.metaTitle ?? `${tr.title} | Mappa Senza Glutine`,
    metaDescription: tr.metaDescription ?? tr.excerpt,
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
