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
      "The Mappa Senza Glutine newsletter and local social channels are the easiest way to stay updated.",
    ],
    sections: [
      { h2: "National trade fairs", body: "Every year several Italian cities host gluten-free food fairs, with tastings, workshops and meetings with nutritionists open to the public." },
      { h2: "Local information days", body: "AIC's regional offices regularly organize free meetings on diagnosis, nutrition and regulatory updates, a useful occasion for the newly diagnosed and their families." },
      { h2: "Social events and online communities", body: "More and more celiac communities are organizing social dinners and meetups at certified venues, an easy way to discover new trustworthy businesses in your area." },
    ],
    faqs: [
      { question: "How can I stay updated on upcoming events?", answer: "Subscribing to the Mappa Senza Glutine newsletter or following local associations' social channels gets you regular updates on scheduled events." },
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
        { title: "Where can I eat gluten-free safely in Milan?", body: "The safest venues in Milan are those with AIC certification, a dedicated kitchen or oven, and reviews verified by the celiac community, like Osteria Senza Confini or Pizzeria La Spiga d'Oro. Avoid venues that only offer generic \"gluten-free options\" without specific contamination controls: always check the Mappa Senza Glutine directory before booking." },
        { title: "Is it risky to eat out in Milan if I have celiac disease?", body: "It isn't risky if you choose venues equipped with verified anti-contamination procedures, which are increasingly common in the city. The risk rises at generic restaurants that add \"gluten-free\" dishes to the menu without training staff or separating cooking equipment: checking in advance remains the golden rule." },
        { title: "How can I quickly find a gluten-free restaurant near me in Milan?", body: "The fastest way is to use a geolocated directory with filters for AIC certification and venue category. Searching only on generic Google Maps often returns unverified venues: it's better to rely on sources like ours, which collect real reports from the celiac community." },
      ] },
      { h2: "The best gluten-free pizzerias in Milan", body: "Pizza remains one of the highest cross-contamination risks, since wheat flour spreads easily in a shared oven: that's why we always look for venues with a <strong>separate or dedicated oven</strong> for gluten-free pizzas.", h3: [
        { title: "Pizzeria La Spiga d'Oro", body: "Just outside Milan, in Monza, <a href=\"/en/directory/pizzeria-la-spiga-d-oro-monza\">Pizzeria La Spiga d'Oro</a> is one of our trusted picks: an <strong>AIC-certified separate oven</strong> and a long-leavened gluten-free dough, cooked strictly in a wood-fired oven. Don't miss the gluten-free margherita and the pan-baked pizza, plus the gluten-free fried starters if you want to begin with something indulgent." },
      ] },
      { h2: "Gluten-free restaurants in Milan: where you can sit down worry-free", body: "For a more structured dinner, here is the restaurant we recommend to anyone looking for maximum peace of mind about cross-contamination.", h3: [
        { title: "Osteria Senza Confini", body: "<a href=\"/en/directory/osteria-senza-confini-milano\">Osteria Senza Confini</a>, in the Tortona area, serves <strong>contemporary Milanese cuisine that's entirely gluten-free</strong>, with an in-house lab dedicated to fresh pasta and a separate oven for bread. Don't miss the beef tagliata and the gluten-free tiramisù." },
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
      { question: "What are the best gluten-free restaurants in Milan?", answer: "Among our trusted picks are Osteria Senza Confini in Milan and Pizzeria La Spiga d'Oro in Monza, both verified by our community and listed in the Mappa Senza Glutine directory." },
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
        { title: "Where can I eat gluten-free safely in Rome?", body: "The safest venues in Rome are those with AIC certification, a dedicated kitchen or oven, and reviews verified by the celiac community, like Trattoria de Roma Senza Glutine or Pizzeria Testaccio Gluten Free. Avoid venues that only offer generic \"gluten-free options\" without specific contamination controls: always check the Mappa Senza Glutine directory before booking." },
        { title: "Is it risky to eat out in Rome if I have celiac disease?", body: "It isn't risky if you choose venues equipped with verified anti-contamination procedures, increasingly common even in the most touristy neighborhoods. The risk rises at generic trattorias that add \"gluten-free\" dishes to the menu without training staff or separating cooking equipment: checking in advance remains the golden rule." },
        { title: "How can I quickly find a gluten-free restaurant near me in Rome?", body: "The fastest way is to use a geolocated directory with filters for AIC certification and venue category. Searching only on generic Google Maps often returns unverified venues: it's better to rely on sources like ours, which collect real reports from the celiac community." },
      ] },
      { h2: "The best gluten-free pizzerias in Rome", body: "Roman-style pizza, thin and crispy, requires delicate dough handling: that's why we always look for venues with a <strong>separate or dedicated oven</strong> for gluten-free pizzas.", h3: [
        { title: "Pizzeria Testaccio Gluten Free", body: "In the Testaccio district, <a href=\"/en/directory/pizzeria-testaccio-gluten-free-roma\">Pizzeria Testaccio Gluten Free</a> is one of our trusted picks: an <strong>AIC-certified separate oven</strong> dedicated to crispy Roman-style gluten-free pizza, plus excellent pizza by the slice and Roman fried snacks prepared in dedicated oil." },
      ] },
      { h2: "Gluten-free restaurants and trattorias in Rome: where you can sit down worry-free", body: "For a more structured dinner, here is the restaurant we recommend to anyone looking for maximum peace of mind about cross-contamination.", h3: [
        { title: "Trattoria de Roma Senza Glutine", body: "In the heart of Trastevere, <a href=\"/en/directory/trattoria-de-roma-senza-glutine-roma\">Trattoria de Roma Senza Glutine</a> serves <strong>Roman classics reinvented gluten-free</strong>, from cacio e pepe to amatriciana, with a dedicated kitchen and suppli fried in reserved oil. Don't miss the gluten-free tiramisù and the house-made fresh pasta." },
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
      { question: "What are the best gluten-free restaurants in Rome?", answer: "Among our trusted picks are Trattoria de Roma Senza Glutine in Trastevere and Pizzeria Testaccio Gluten Free, both verified by our community and listed in the Mappa Senza Glutine directory." },
      { question: "How can I tell if a Roman trattoria is really safe for celiacs?", answer: "Check for AIC certification, ask whether the kitchen and oven are dedicated or separate, and rely on verified reviews from other celiacs, like the ones in our directory." },
      { question: "Do I always need to book ahead at gluten-free restaurants in Rome?", answer: "Not always, but it's strongly recommended in the most touristy areas and on weekends, when demand is higher and dedicated spots can fill up quickly." },
    ],
    tags: ["rome", "restaurants", "pizzerias", "guides"],
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
    metaTitle: `${tr.title} | Mappa Senza Glutine`,
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
