import type { Actor, Brand, Character, Merchant, Movie } from "@/lib/types";

const m = (id: string, title: string, year: number, kind: "film" | "series", genre: string, synopsis: string): Movie =>
  ({ id, slug: id, title, year, kind, genre, synopsis });

export const movies: Movie[] = [
  m("top-gun", "Top Gun", 1986, "film", "Action", "Naval aviators compete at the US Navy's elite fighter weapons school."),
  m("top-gun-maverick", "Top Gun: Maverick", 2022, "film", "Action", "Maverick returns to train a new generation of Top Gun graduates."),
  m("risky-business", "Risky Business", 1983, "film", "Comedy", "A suburban Chicago teenager is left home alone and his house becomes the setting of a chaotic weekend."),
  m("the-blues-brothers", "The Blues Brothers", 1980, "film", "Comedy", "Two brothers put their band back together to save the orphanage where they grew up."),
  m("breakfast-at-tiffanys", "Breakfast at Tiffany's", 1961, "film", "Romance", "A New York socialite, Holly Golightly, forms a bond with her new neighbor."),
  m("men-in-black", "Men in Black", 1997, "film", "Sci-Fi", "Agents of a secret organization police extraterrestrial life on Earth."),
  m("the-thomas-crown-affair-1968", "The Thomas Crown Affair", 1968, "film", "Crime", "A wealthy businessman plans a bank robbery for the thrill of it."),
  m("the-terminator", "The Terminator", 1984, "film", "Sci-Fi", "A cyborg assassin is sent back in time to 1984 to kill Sarah Connor."),
  m("taxi-driver", "Taxi Driver", 1976, "film", "Drama", "A Vietnam veteran works night shifts as a New York City cab driver."),
  m("fear-and-loathing-in-las-vegas", "Fear and Loathing in Las Vegas", 1998, "film", "Comedy", "A journalist and his attorney take a drug-fuelled road trip to Las Vegas."),
  m("leon-the-professional", "Léon: The Professional", 1994, "film", "Thriller", "A professional hitman takes in a 12-year-old girl who has lost her family."),
  m("the-matrix", "The Matrix", 1999, "film", "Sci-Fi", "A hacker discovers that reality is a simulation."),
  m("quantum-of-solace", "Quantum of Solace", 2008, "film", "Spy", "Daniel Craig's second outing as James Bond."),
  m("skyfall", "Skyfall", 2012, "film", "Spy", "Daniel Craig's third outing as James Bond."),
  m("spectre", "Spectre", 2015, "film", "Spy", "Daniel Craig's fourth outing as James Bond."),
  m("f1-the-movie", "F1", 2025, "film", "Sports", "A veteran driver joins a struggling Formula 1 team."),
  m("the-devil-wears-prada-2", "The Devil Wears Prada 2", 2026, "film", "Comedy", "The sequel to the 2006 fashion-world comedy-drama."),
  m("miami-vice", "Miami Vice", 1984, "series", "Crime", "TV crime series following two Miami detectives; it aired from 1984 to 1990."),
];

const a = (name: string, bio?: string): Actor => ({
  id: name.toLowerCase().normalize("NFD").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
  slug: name.toLowerCase().normalize("NFD").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
  name, bio,
});
export const actors: Actor[] = [
  a("Tom Cruise"), a("Val Kilmer"), a("Miles Teller"), a("John Belushi"), a("Dan Aykroyd"),
  a("Audrey Hepburn"), a("Will Smith"), a("Tommy Lee Jones"), a("Steve McQueen"),
  a("Arnold Schwarzenegger"), a("Robert De Niro"), a("Johnny Depp"), a("Jean Reno"),
  a("Keanu Reeves"), a("Carrie-Anne Moss"), a("Laurence Fishburne"), a("Daniel Craig"),
  a("Brad Pitt"), a("Anne Hathaway"), a("Meryl Streep"), a("Don Johnson"),
];

const c = (id: string, name: string, actorId: string, movieId: string): Character => ({ id, name, actorId, movieId });
export const characters: Character[] = [
  c("maverick-1986", "Maverick", "tom-cruise", "top-gun"),
  c("maverick-2022", "Maverick", "tom-cruise", "top-gun-maverick"),
  c("rooster", "Rooster", "miles-teller", "top-gun-maverick"),
  c("iceman", "Iceman", "val-kilmer", "top-gun-maverick"),
  c("joel-goodsen", "Joel Goodsen", "tom-cruise", "risky-business"),
  c("jake-blues", "Jake Blues", "john-belushi", "the-blues-brothers"),
  c("elwood-blues", "Elwood Blues", "dan-aykroyd", "the-blues-brothers"),
  c("holly-golightly", "Holly Golightly", "audrey-hepburn", "breakfast-at-tiffanys"),
  c("agent-j", "Agent J", "will-smith", "men-in-black"),
  c("agent-k", "Agent K", "tommy-lee-jones", "men-in-black"),
  c("thomas-crown", "Thomas Crown", "steve-mcqueen", "the-thomas-crown-affair-1968"),
  c("t-800", "The Terminator (T-800)", "arnold-schwarzenegger", "the-terminator"),
  c("travis-bickle", "Travis Bickle", "robert-de-niro", "taxi-driver"),
  c("raoul-duke", "Raoul Duke", "johnny-depp", "fear-and-loathing-in-las-vegas"),
  c("leon", "Léon", "jean-reno", "leon-the-professional"),
  c("neo", "Neo", "keanu-reeves", "the-matrix"),
  c("trinity", "Trinity", "carrie-anne-moss", "the-matrix"),
  c("morpheus", "Morpheus", "laurence-fishburne", "the-matrix"),
  c("bond-qos", "James Bond", "daniel-craig", "quantum-of-solace"),
  c("bond-skyfall", "James Bond", "daniel-craig", "skyfall"),
  c("bond-spectre", "James Bond", "daniel-craig", "spectre"),
  c("sonny-hayes", "Sonny Hayes", "brad-pitt", "f1-the-movie"),
  c("andy-sachs", "Andy Sachs", "anne-hathaway", "the-devil-wears-prada-2"),
  c("miranda-priestly", "Miranda Priestly", "meryl-streep", "the-devil-wears-prada-2"),
  c("sonny-crockett", "Sonny Crockett", "don-johnson", "miami-vice"),
];

const b = (name: string, country: string, description: string, website?: string): Brand => ({
  id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
  slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
  name, country, description, website,
});
export const brands: Brand[] = [
  b("Ray-Ban", "United States (founded 1937)", "Founded in 1937 as part of Bausch & Lomb, Ray-Ban is the brand behind the Aviator and Wayfarer, the two designs most often seen in film.", "https://www.ray-ban.com"),
  b("Persol", "Italy", "Italian eyewear brand known for its folding 714 model and the 649.", "https://www.persol.com"),
  b("Oliver Goldsmith", "United Kingdom", "British eyewear house whose Manhattan model is linked to Breakfast at Tiffany's.", "https://www.olivergoldsmith.com"),
  b("Tom Ford", "United States", "Fashion house whose eyewear line has been reported on screen in several Daniel Craig Bond films.", "https://www.tomfordfashion.com"),
  b("Gargoyles", "United States", "American brand known for rugged ANSI-rated sunglasses; its Classics model is linked to The Terminator.", undefined),
  b("S.T. Dupont", "France", "French luxury house whose vintage eyewear has surfaced in costume research for F1 (2025).", undefined),
  b("Blinde Design", "Not verified", "Eyewear designer reported to have created custom frames for the lead cast of The Matrix.", undefined),
  b("American Optical", "United States", "One of the oldest US eyewear makers; its Original Pilot is a long-running military-style aviator.", "https://aoeyewear.com"),
  b("Randolph Engineering", "United States", "US maker of military-specification aviators.", "https://www.randolphusa.com"),
  b("Oakley", "United States", "American performance and lifestyle eyewear brand.", "https://www.oakley.com"),
  b("Knockaround", "United States", "US value-priced sunglasses brand.", "https://www.knockaround.com"),
  b("Goodr", "United States", "US value-priced sport sunglasses brand.", "https://goodr.com"),
  b("Quay", "Australia", "Australian fashion sunglasses brand with accessible price points.", "https://www.quayaustralia.com"),
  b("Dita", "United States", "Los Angeles luxury eyewear brand.", "https://dita.com"),
  b("Oliver Peoples", "United States", "Los Angeles luxury eyewear brand.", "https://www.oliverpeoples.com"),
  b("Barton Perreira", "United States", "Luxury eyewear brand from California.", undefined),
  b("L.G.R", "Not verified", "Eyewear brand whose Karthoum model is cited in coverage of The Devil Wears Prada 2.", undefined),
  b("Jimmy Choo", "United Kingdom", "Luxury fashion house with an eyewear line.", undefined),
  b("Magnoli Clothiers", "United States", "Maker of film-inspired replica sunglasses.", undefined),
];

export const merchants: Merchant[] = [
  { id: "ebay", slug: "ebay", name: "eBay", network: "eBay Partner Network (not yet configured)", domain: "ebay.com", searchUrlTemplate: "https://www.ebay.com/sch/i.html?_nkw={q}", affiliateParams: "", estimatedEpc: 0, active: true },
  { id: "google-shopping", slug: "google-shopping", name: "Google Shopping", network: "None (price-free search link)", domain: "google.com", searchUrlTemplate: "https://www.google.com/search?tbm=shop&q={q}", affiliateParams: "", estimatedEpc: 0, active: true },
];
