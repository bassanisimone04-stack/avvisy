/** Voci della checklist per il ristorante: usate dalla pagina /checklist-ristorante e dal PDF della guida. */
export type ChecklistItem = { it: string; en: string };

export const CHECKLIST_BEFORE: ChecklistItem[] = [
  { it: "Dico che sono celiaco/a, non che «preferisco il senza glutine».", en: "I say I have celiac disease, not that I «prefer gluten-free»." },
  { it: "Il locale ha un menu senza glutine?", en: "Does the venue have a gluten-free menu?" },
  { it: "Hanno una cucina o un forno dedicati, oppure cucinano nello stesso spazio?", en: "Do they have a dedicated kitchen or oven, or do they cook in the same space?" },
  { it: "La friggitrice è separata?", en: "Is the fryer separate?" },
  { it: "La pasta senza glutine si cuoce in acqua separata?", en: "Is the gluten-free pasta cooked in separate water?" },
  { it: "Le farine senza glutine sono conservate a parte, in contenitori chiusi?", en: "Are the gluten-free flours stored apart, in sealed containers?" },
  { it: "Aderiscono al programma AIC Alimentazione Fuori Casa?", en: "Do they take part in the AIC Alimentazione Fuori Casa program?" },
];
export const CHECKLIST_TABLE: ChecklistItem[] = [
  { it: "Il piatto che arriva è quello senza glutine? Lo chiedo prima di mangiare.", en: "Is the plate that arrives the gluten-free one? I ask before eating." },
  { it: "Il pane è confezionato o servito a parte, non dal cestino comune?", en: "Is the bread packaged or served apart, not from the shared basket?" },
  { it: "Salse, condimenti e contorni: sono senza glutine o li hanno preparati con altro?", en: "Sauces, dressings and sides: are they gluten-free, or made with something else?" },
  { it: "Posate e piatti puliti, senza briciole.", en: "Clean cutlery and plates, with no crumbs." },
];
export const CHECKLIST_FLAGS: ChecklistItem[] = [
  { it: "Risposte vaghe o esitanti su forno, friggitrice, acqua di cottura.", en: "Vague or hesitant answers about the oven, fryer, cooking water." },
  { it: "«Un po' di glutine non fa male».", en: "«A little gluten won't hurt»." },
  { it: "Nessuno sa dire come viene preparato il piatto.", en: "Nobody can say how the dish is prepared." },
];
