# -*- coding: utf-8 -*-
"""
Costruisce il PDF "Vivere Senza Glutine" (IT e EN) dai contenuti del sito.

    npx tsx guida/export-content.ts      # scrive guida/content.json
    python3 guida/build.py               # scrive guida/out/*.pdf, src/lib/guide-meta.json, public/images/guida/*

Richiede: Python 3 con pypdf e pypdfium2 (+ Pillow), Node con Playwright (vedi render.js).
Tutto il testo dei capitoli arriva dagli articoli del sito; qui ci sono solo i testi fissi
(copertina, avvertenze, schede finali).
"""
import html as H
import json
import re
import subprocess
import sys
from datetime import date
from pathlib import Path

from pypdf import PdfReader, PdfWriter

ROOT = Path(__file__).resolve().parent
SITE = ROOT.parent
OUT = ROOT / "out"
OUT.mkdir(exist_ok=True)

MONTHS = {
    "it": ["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"],
    "en": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
}
today = date.today()
EDITION = {l: f"{MONTHS[l][today.month - 1]} {today.year}" for l in ("it", "en")}
COMPILED = {"it": f"{today.day} {MONTHS['it'][today.month - 1]} {today.year}", "en": f"{today.day} {MONTHS['en'][today.month - 1]} {today.year}"}
FILE_TAG = f"{today.year}-{today.month:02d}"

T = {
    "it": {
        "lang": "it",
        "title": "Vivere Senza Glutine",
        "subtitle": "La guida di riferimento per chi è celiaco: dalla diagnosi alla vita di ogni giorno",
        "edition": "Edizione",
        "chapters": "capitoli",
        "tools": "schede da stampare",
        "toc": "Indice",
        "part": "PARTE", "chapter": "CAPITOLO", "appendix": "APPENDICE",
        "remember": "Da ricordare",
        "online": "Versione online sempre aggiornata: mappasenzaglutine.it/blog",
        "legal_h": "Prima di iniziare",
        "legal_what": "Questa guida raccoglie e mette in ordine gli articoli di mappasenzaglutine.it pubblicati e controllati al {compiled}. Ogni affermazione viene da fonti verificate, in particolare dall'Associazione Italiana Celiachia (AIC) e dalla normativa europea; dove le fonti non concordano o non bastano, lo diciamo, invece di dare una risposta secca.",
        "legal_warn": "<strong>Non è una guida medica.</strong> Non sostituisce il parere del medico, del gastroenterologo o del nutrizionista. Se sospetti di essere celiaco, non eliminare il glutine prima degli esami: gli esami funzionano solo se stai ancora mangiando glutine. Parlane prima con il medico.",
        "legal_upd": "<strong>Aggiornamenti.</strong> Normative, prodotti e locali cambiano. La versione sempre aggiornata di ogni capitolo è sul blog (mappasenzaglutine.it/blog): questa edizione non si aggiorna da sola.",
        "legal_c": "© {year} Mappa Senza Glutine. Tutti i diritti riservati. Il file è per uso personale: non ridistribuirlo né rivenderlo.",
        "how_h": "Come usare questa guida",
        "how": [
            "<strong>Cinque parti, un percorso</strong>: dalla comprensione della celiachia alla vita pratica. Puoi leggerla in ordine o saltare al capitolo che ti serve.",
            "<strong>Il riquadro «Da ricordare»</strong> chiude ogni capitolo con i punti essenziali.",
            "<strong>Le appendici sono fatte per essere stampate</strong>: la scheda rapida sì/no, la checklist per il ristorante e la tessera di traduzione. In formato A5 si stampano due per foglio A4.",
            "<strong>Da telefono</strong> usa i segnalibri del lettore PDF e l'indice cliccabile per saltare ai capitoli.",
        ],
        "app_a_h": "Scheda rapida: sì, con attenzione, no",
        "app_a_yes": ("Sì, naturalmente senza glutine", [
            "Riso", "Mais e polenta*", "Quinoa, amaranto, miglio, grano saraceno*", "Legumi", "Patate, verdure e frutta",
            "Carne, pesce e uova freschi", "Lievito di birra secco, liofilizzato o fresco", "Aceto balsamico DOP e IGP"]),
        "app_a_care": ("Con attenzione: dipende dal prodotto", [
            "Avena: solo con la dicitura «senza glutine»", "Amido di frumento deglutinato: solo nei prodotti dichiarati senza glutine",
            "Tamari: solo «senza glutine»", "Lievito madre e lievito fresco liquido", "Gelatina e agar agar: verifica il Prontuario AIC",
            "Gelato: la base sì; coni, wafer e biscotti no", "Dadi, salse, panature e prodotti pronti: leggi l'etichetta"]),
        "app_a_no": ("No: contengono glutine", [
            "Frumento (grano), orzo, segale", "Farro e kamut", "Cous cous tradizionale, bulgur, seitan",
            "Salsa di soia tradizionale", "Amido di frumento comune", "Pane, pasta e dolci tradizionali"]),
        "app_a_foot": "* Con la dicitura «senza glutine»: questi cereali sono spesso lavorati negli stessi impianti del frumento. «Senza glutine» in etichetta significa meno di 20 mg di glutine per chilo (Regolamento UE 828/2014).",
        "app_b_h": "Checklist per il ristorante",
        "app_b_before": "Prima di andare (telefonata di un minuto)", "app_b_table": "Al tavolo", "app_b_flags": "Segnali di allarme", "app_b_notes": "Appunti",
        "app_b_foot": "Se vedi i segnali di allarme puoi scegliere un altro locale: una scelta prudente costa meno di una contaminazione. È una guida generale, non una garanzia.",
        "app_c_h": "Tessera di traduzione",
        "app_c_intro": "Ritaglia la tessera o mostrala dal telefono: una frase chiara, nella lingua del posto, da consegnare al personale.",
        "app_d_h": "Glossario",
        "gloss": [
            ("Celiachia", "Malattia autoimmune in cui il glutine danneggia i villi dell'intestino tenue."),
            ("Glutine", "Insieme di proteine presenti in frumento, orzo, segale e nei loro derivati."),
            ("Contaminazione crociata", "Contatto accidentale con il glutine, per esempio tramite briciole, acqua di cottura, olio di frittura o utensili in comune."),
            ("AIC", "Associazione Italiana Celiachia."),
            ("AFC (Alimentazione Fuori Casa)", "Programma dell'AIC per i locali: formazione del personale e procedure condivise con l'associazione. Tecnicamente non è una certificazione in senso stretto."),
            ("Spiga Barrata", "Marchio dell'AIC che garantisce il rispetto del limite di 20 mg di glutine per chilo."),
            ("Prontuario AIC", "Elenco degli alimenti dell'AIC, da consultare per i prodotti che non dichiarano «senza glutine»."),
            ("20 ppm", "Uguale a 20 mg di glutine per chilo di prodotto: il limite per poter scrivere «senza glutine» in etichetta."),
            ("HACCP", "Piano di autocontrollo di un locale: per il programma AFC il glutine va inserito come punto critico."),
            ("Buono per celiaci", "Misura del Servizio Sanitario Nazionale per l'acquisto di prodotti senza glutine."),
        ],
        "app_e_h": "Dove verificare e approfondire",
        "res": [
            "<strong>AIC, Associazione Italiana Celiachia</strong> (celiachia.it): programma Alimentazione Fuori Casa e relativo elenco dei locali (controlla le condizioni di accesso), marchio Spiga Barrata, Prontuario degli alimenti.",
            "<strong>Mappa Senza Glutine</strong>: mappa dei ristoranti AIC (mappasenzaglutine.it/mappa-ristoranti-aic), directory dei locali (mappasenzaglutine.it/directory), normativa (mappasenzaglutine.it/normativa), checklist stampabile (mappasenzaglutine.it/checklist-ristorante), blog (mappasenzaglutine.it/blog).",
            "<strong>Il tuo medico o gastroenterologo</strong>, per tutto ciò che riguarda la salute.",
        ],
        "blog_path": "",
    },
    "en": {
        "lang": "en",
        "title": "Live Gluten-Free",
        "subtitle": "The reference guide for living with celiac disease: from diagnosis to everyday life",
        "edition": "Edition",
        "chapters": "chapters",
        "tools": "printable sheets",
        "toc": "Contents",
        "part": "PART", "chapter": "CHAPTER", "appendix": "APPENDIX",
        "remember": "Key points",
        "online": "Always up-to-date online version: mappasenzaglutine.it/en/blog",
        "legal_h": "Before you start",
        "legal_what": "This guide collects and puts in order the articles on mappasenzaglutine.it published and checked as of {compiled}. Every statement comes from verified sources, in particular the Italian Celiac Association (AIC) and European rules; where sources disagree or aren't enough, we say so instead of giving a flat answer.",
        "legal_warn": "<strong>This is not a medical guide.</strong> It doesn't replace the advice of a doctor, gastroenterologist or dietitian. If you suspect you have celiac disease, don't cut out gluten before testing: tests only work if you're still eating gluten. Talk to your doctor first.",
        "legal_upd": "<strong>Updates.</strong> Rules, products and venues change. The always up-to-date version of each chapter is on the blog (mappasenzaglutine.it/en/blog): this edition doesn't update itself.",
        "legal_c": "© {year} Mappa Senza Glutine. All rights reserved. This file is for personal use: please don't redistribute or resell it.",
        "how_h": "How to use this guide",
        "how": [
            "<strong>Five parts, one path</strong>: from understanding celiac disease to practical life. Read it in order or jump to the chapter you need.",
            "<strong>The «Key points» box</strong> closes every chapter with the essentials.",
            "<strong>The appendices are made to be printed</strong>: the yes/no quick sheet, the restaurant checklist and the Italian phrasebook. At A5 size you can print two per A4 sheet.",
            "<strong>On a phone</strong> use your PDF reader's bookmarks and the clickable contents to jump to chapters.",
        ],
        "app_a_h": "Quick sheet: yes, with care, no",
        "app_a_yes": ("Yes, naturally gluten-free", [
            "Rice", "Corn and polenta*", "Quinoa, amaranth, millet, buckwheat*", "Legumes", "Potatoes, vegetables and fruit",
            "Fresh meat, fish and eggs", "Dry, freeze-dried or fresh baker's yeast", "DOP and IGP balsamic vinegar"]),
        "app_a_care": ("With care: it depends on the product", [
            "Oats: only labelled «gluten-free»", "Deglutinated wheat starch: only in products declared gluten-free",
            "Tamari: only «gluten-free»", "Sourdough and fresh liquid yeast", "Gelatin and agar: check the AIC Prontuario",
            "Gelato: the base yes; cones, wafers and biscuits no", "Stock cubes, sauces, breading and ready meals: read the label"]),
        "app_a_no": ("No: they contain gluten", [
            "Wheat, barley, rye", "Farro and kamut", "Traditional couscous, bulgur, seitan",
            "Traditional soy sauce", "Ordinary wheat starch", "Traditional bread, pasta and cakes"]),
        "app_a_foot": "* Labelled «gluten-free»: these grains are often processed in the same plants as wheat. «Gluten-free» on a label means less than 20 mg of gluten per kilo (EU Regulation 828/2014).",
        "app_b_h": "Restaurant checklist",
        "app_b_before": "Before you go (a one-minute call)", "app_b_table": "At the table", "app_b_flags": "Warning signs", "app_b_notes": "Notes",
        "app_b_foot": "If you see the warning signs you can choose another venue: a cautious choice costs less than contamination. This is general guidance, not a guarantee.",
        "app_c_h": "Italian phrasebook",
        "app_c_intro": "Show these on your phone or say them out loud. The pronunciation is an approximate English-style respelling; capital letters mark the stressed syllable.",
        "app_d_h": "Glossary",
        "gloss": [
            ("Celiac disease", "An autoimmune disease in which gluten damages the villi of the small intestine."),
            ("Gluten", "A group of proteins found in wheat, barley, rye and their derivatives."),
            ("Cross-contamination", "Accidental contact with gluten, for example through crumbs, cooking water, frying oil or shared utensils."),
            ("AIC", "Associazione Italiana Celiachia, the Italian Celiac Association."),
            ("AFC (Alimentazione Fuori Casa)", "AIC's program for venues: staff training and procedures agreed with the association. Technically it is not a certification in the strict sense."),
            ("Crossed Grain (Spiga Barrata)", "AIC's mark guaranteeing the limit of 20 mg of gluten per kilo is respected."),
            ("AIC Prontuario", "AIC's food handbook, to consult for products that don't declare «gluten-free»."),
            ("20 ppm", "Equal to 20 mg of gluten per kilo of product: the limit for writing «gluten-free» on a label."),
            ("HACCP", "A venue's self-control plan: for the AFC program gluten must be listed as a critical point."),
            ("Celiac voucher", "A measure of the Italian National Health Service for buying gluten-free products."),
        ],
        "app_e_h": "Where to check and learn more",
        "res": [
            "<strong>AIC, the Italian Celiac Association</strong> (celiachia.it): the Alimentazione Fuori Casa program and its list of venues (check the access conditions), the Crossed Grain mark, the food handbook (Prontuario).",
            "<strong>Mappa Senza Glutine</strong>: AIC restaurants map (mappasenzaglutine.it/en/mappa-ristoranti-aic), venue directory (mappasenzaglutine.it/en/directory), rules (mappasenzaglutine.it/en/normativa), printable checklist (mappasenzaglutine.it/en/checklist-ristorante), blog (mappasenzaglutine.it/en/blog).",
            "<strong>Your own doctor or gastroenterologist</strong>, for anything about your health.",
        ],
    },
}

# Tessera di traduzione (edizione italiana): frasi semplici in 5 lingue.
CARDS = [
    ("ITALIANO", "Sono celiaco/a. Non posso mangiare glutine (frumento, orzo, segale). Anche piccole tracce mi danneggiano. Per favore usate utensili puliti e acqua di cottura nuova."),
    ("ENGLISH", "I have celiac disease. I cannot eat gluten (wheat, barley, rye). Even small traces are harmful to me. Please use clean utensils and fresh cooking water."),
    ("DEUTSCH", "Ich habe Zöliakie. Ich darf kein Gluten essen (Weizen, Gerste, Roggen). Schon kleine Spuren sind schädlich für mich. Bitte verwenden Sie saubere Utensilien und frisches Kochwasser."),
    ("FRANÇAIS", "Je suis cœliaque. Je ne peux pas manger de gluten (blé, orge, seigle). Même de petites traces sont nocives pour moi. Merci d'utiliser des ustensiles propres et de l'eau de cuisson neuve."),
    ("ESPAÑOL", "Soy celíaco/a. No puedo comer gluten (trigo, cebada, centeno). Incluso pequeñas trazas son perjudiciales para mí. Por favor, usen utensilios limpios y agua de cocción nueva."),
]
CARD_EN_IT = ("ITALIANO", "Sono celiaco/a. Non posso mangiare glutine (frumento, orzo, segale). Anche piccole tracce mi danneggiano. Per favore usate utensili puliti e acqua di cottura nuova.",
              "I have celiac disease. I cannot eat gluten (wheat, barley, rye). Even small traces are harmful to me. Please use clean utensils and fresh cooking water.")
WORDS_GF = "senza glutine · gluten-free · glutenfrei · sans gluten · sin gluten"


def esc(s: str) -> str:
    return H.escape(s, quote=False)


def clean(html: str) -> str:
    """Prepara l'HTML di un articolo per il libro: niente immagini né link, titoli ribassati di un livello."""
    h = re.sub(r"<img[^>]*>", "", html)
    h = re.sub(r"<a\s[^>]*>(.*?)</a>", r"\1", h, flags=re.S)
    h = re.sub(r"<h3[^>]*>", "<h4>", h)
    h = h.replace("</h3>", "</h4>")
    h = re.sub(r"<h2[^>]*>", "<h3>", h)
    h = h.replace("</h2>", "</h3>")
    return h


def words(h: str) -> int:
    return len(re.sub(r"<[^>]+>", " ", h).split())


def letter(i: int) -> str:
    return "ABCDE"[i]


def body_html(loc: str, content: dict, pages: dict) -> tuple[str, dict]:
    t = T[loc]
    parts = content[loc]["parts"]
    n_chapters = sum(len(p["chapters"]) for p in parts)
    meta = {"parts": len(parts), "chapters": n_chapters, "words": 0}
    pg = lambda key: pages.get(key, "·")

    out = [f'<!doctype html><html lang="{t["lang"]}"><head><meta charset="utf-8"><link rel="stylesheet" href="style.css"><title>{esc(t["title"])}</title></head><body>']

    # frontespizio
    out.append(f'<section class="titlepage"><div class="mark">MSG</div><h1>{esc(t["title"])}</h1><div class="sub">{esc(t["subtitle"])}</div>'
               f'<div class="ed">{t["edition"]} {EDITION[loc]}<br/>Mappa Senza Glutine · mappasenzaglutine.it</div></section>')

    # avvertenze + come usare
    legal = [
        f'<section class="legal page-break"><h2>{esc(t["legal_h"])}</h2><p>{esc(t["legal_what"].format(compiled=COMPILED[loc]))}</p>',
        f'<div class="note warn">{t["legal_warn"]}</div><div class="note">{t["legal_upd"]}</div>',
        f'<h2 style="margin-top:8mm">{esc(t["how_h"])}</h2><ul>' + "".join(f"<li>{x}</li>" for x in t["how"]) + "</ul>",
        f'<p style="margin-top:8mm">{esc(t["legal_c"].format(year=today.year))}</p></section>',
    ]
    out.extend(legal)

    # indice
    toc = [f'<section class="toc page-break"><h2 class="sect">{esc(t["toc"])}</h2>']
    n = 0
    for pi, p in enumerate(parts):
        toc.append(f'<div class="grp"><div class="part">{t["part"].capitalize()} {pi + 1} · {esc(p["title"])}</div><ol>')
        for c in p["chapters"]:
            n += 1
            toc.append(f'<li><span class="n">{n}</span><span class="t">{esc(c["title"])}</span><span class="dots"></span><span class="pg">{pg(f"c{n}")}</span></li>')
        toc.append("</ol></div>")
    toc.append(f'<div class="grp"><div class="part">{t["appendix"].capitalize()}</div><ol>')
    app_titles = [t["app_a_h"], t["app_b_h"], t["app_c_h"], t["app_d_h"], t["app_e_h"]]
    for i, title in enumerate(app_titles):
        toc.append(f'<li><span class="n">{letter(i)}</span><span class="t">{esc(title)}</span><span class="dots"></span><span class="pg">{pg(f"a{i}")}</span></li>')
    toc.append("</ol></div></section>")
    out.extend(toc)

    # parti e capitoli
    n = 0
    for pi, p in enumerate(parts):
        out.append(f'<section class="part-opener"><div class="pn">{t["part"]} {pi + 1}</div><h2>{esc(p["title"])}</h2><div class="intro">{esc(p["intro"])}</div><ol>')
        for c in p["chapters"]:
            out.append(f"<li>{esc(c['title'])}</li>")
        out.append("</ol></section>")
        for c in p["chapters"]:
            n += 1
            body = clean(c["html"])
            meta["words"] += words(body)
            box = ""
            if c.get("takeaways"):
                box = f'<div class="remember"><div class="rt">{esc(t["remember"])}</div><ul>' + "".join(f"<li>{esc(x)}</li>" for x in c["takeaways"]) + "</ul></div>"
            out.append(f'<section class="chapter"><div class="label">{t["chapter"]} {n}</div><h2>{esc(c["title"])}</h2>{body}{box}<div class="online">{esc(t["online"])}</div></section>')

    # appendice A: scheda rapida
    def card(css: str, data: tuple) -> str:
        return f'<div class="card {css}"><h3>{esc(data[0])}</h3><ul>' + "".join(f"<li>{esc(x)}</li>" for x in data[1]) + "</ul></div>"

    out.append(f'<section class="appendix"><div class="label">{t["appendix"]} A</div><h2>{esc(t["app_a_h"])}</h2><div class="cols3">'
               f'{card("yes", t["app_a_yes"])}{card("care", t["app_a_care"])}{card("no", t["app_a_no"])}</div><div class="foot">{esc(t["app_a_foot"])}</div></section>')

    # appendice B: checklist
    ck = content["checklist"]
    li = lambda items, css="": f'<ul class="check {css}">' + "".join(f"<li>{esc(x[loc])}</li>" for x in items) + "</ul>"
    out.append(f'<section class="appendix"><div class="label">{t["appendix"]} B</div><h2>{esc(t["app_b_h"])}</h2>'
               f'<div class="h-small">1. {esc(t["app_b_before"])}</div>{li(ck["before"])}'
               f'<div class="h-small">2. {esc(t["app_b_table"])}</div>{li(ck["table"])}'
               f'<div class="h-small">3. {esc(t["app_b_flags"])}</div>{li(ck["flags"], "flags")}'
               f'<div class="h-small">{esc(t["app_b_notes"])}</div><div class="lines"></div><div class="foot">{esc(t["app_b_foot"])}</div></section>')

    # appendice C: tessera di traduzione (IT) / frasario (EN)
    if loc == "it":
        cards = "".join(f'<div class="tcard"><div class="lang">{lang}</div>{esc(txt)}</div>' for lang, txt in CARDS)
        out.append(f'<section class="appendix"><div class="label">{t["appendix"]} C</div><h2>{esc(t["app_c_h"])}</h2><p>{esc(t["app_c_intro"])}</p>{cards}'
                   f'<div class="foot">«{esc(WORDS_GF)}»</div></section>')
    else:
        ph = "".join(f'<div class="phr"><div class="it">{esc(x["it"])}</div><div class="say">say: {esc(x["say"])}</div><div class="en">{esc(x["en"])}</div></div>' for x in content["phrases"])
        lang, txt, tr = CARD_EN_IT
        out.append(f'<section class="appendix appc"><div class="label">{t["appendix"]} C</div><h2>{esc(t["app_c_h"])}</h2><p>{esc(t["app_c_intro"])}</p>{ph}'
                   f'<div class="tcard"><div class="lang">{lang} · CARD TO SHOW</div>{esc(txt)}<br/><span style="color:#5d6c64">{esc(tr)}</span></div></section>')

    # appendice D: glossario, E: risorse
    gl = "<dl class='gl'>" + "".join(f"<dt>{esc(a)}</dt><dd>{esc(b)}</dd>" for a, b in t["gloss"]) + "</dl>"
    out.append(f'<section class="appendix"><div class="label">{t["appendix"]} D</div><h2>{esc(t["app_d_h"])}</h2>{gl}</section>')
    out.append(f'<section class="appendix"><div class="label">{t["appendix"]} E</div><h2>{esc(t["app_e_h"])}</h2><ul class="res">' + "".join(f"<li>{x}</li>" for x in t["res"]) + "</ul></section>")

    out.append("</body></html>")
    return "".join(out), meta


def cover_html(loc: str, n_chapters: int) -> str:
    t = T[loc]
    return (f'<!doctype html><html lang="{t["lang"]}"><head><meta charset="utf-8"><link rel="stylesheet" href="style.css"><style>@page {{ margin: 0 }}</style></head><body>'
            f'<div class="cover"><div class="c1"></div><div class="c2"></div><div class="mark">MSG</div>'
            f'<h1>{esc(t["title"])}</h1><div class="sub">{esc(t["subtitle"])}</div><div class="rule"></div>'
            f'<div class="meta">{t["edition"]} {EDITION[loc]}<br/>{n_chapters} {t["chapters"]} · {t["tools"]}</div>'
            f'<div class="brand">Mappa Senza Glutine · mappasenzaglutine.it</div></div></body></html>')


def render(html_path: Path, pdf_path: Path, mode: str) -> None:
    subprocess.run(["node", str(ROOT / "render.js"), str(html_path), str(pdf_path), mode], check=True)


def locate(pdf_path: Path, loc: str, parts: list) -> dict:
    """Trova la pagina (1 = prima pagina del corpo) di ogni capitolo e appendice, leggendo il testo del PDF."""
    t = T[loc]
    reader = PdfReader(str(pdf_path))
    texts = [re.sub(r"\s+", " ", (p.extract_text() or "")) for p in reader.pages]
    flat = [re.sub(r"\s+", "", tx) for tx in texts]  # le etichette hanno spaziatura tra le lettere
    pages: dict = {}
    n_total = sum(len(p["chapters"]) for p in parts)
    titles = [c["title"] for p in parts for c in p["chapters"]]
    for n in range(1, n_total + 1):
        # etichetta + inizio del titolo: distingue "CAPITOLO 1" da "CAPITOLO 17" anche se il titolo inizia con una cifra
        head = re.sub(r"\s+", "", titles[n - 1])[:14]
        rx = re.compile(re.escape(f"{t['chapter']}{n}{head}"))
        for i, tx in enumerate(flat):
            if rx.search(tx):
                pages[f"c{n}"] = i + 1
                break
    for j, tx in enumerate(texts):
        if tx.startswith(t["toc"]):
            pages["toc"] = j + 1
            break
    for i in range(5):
        for j, tx in enumerate(flat):
            if re.search(rf"{t['appendix']}{letter(i)}(?![a-z])", tx):
                pages[f"a{i}"] = j + 1
                break
    for pi in range(len(parts)):
        for j, tx in enumerate(flat):
            if re.search(rf"{t['part']}{pi + 1}(?!\d)", tx):
                pages[f"p{pi + 1}"] = j + 1
                break
    return pages


def build(loc: str, content: dict) -> dict:
    t = T[loc]
    parts = content[loc]["parts"]
    body_html_path = ROOT / f"_body_{loc}.html"
    body_pdf = OUT / f"_body_{loc}.pdf"
    pages: dict = {}
    for attempt in range(4):
        html, meta = body_html(loc, content, pages)
        body_html_path.write_text(html, encoding="utf-8")
        render(body_html_path, body_pdf, "body")
        found = locate(body_pdf, loc, parts)
        if found == pages:
            break
        pages = found
    else:
        raise RuntimeError("i numeri di pagina dell'indice non si stabilizzano")
    expected = meta["chapters"] + 5 + meta["parts"] + 1
    if len(pages) != expected:
        raise RuntimeError(f"pagine trovate {len(pages)} su {expected}: {sorted(pages)}")

    cover_path = ROOT / f"_cover_{loc}.html"
    cover_pdf = OUT / f"_cover_{loc}.pdf"
    cover_path.write_text(cover_html(loc, meta["chapters"]), encoding="utf-8")
    render(cover_path, cover_pdf, "cover")

    # unione: copertina + corpo, segnalibri, etichette di pagina, metadati
    w = PdfWriter()
    w.append(PdfReader(str(cover_pdf)))
    w.append(PdfReader(str(body_pdf)))
    total = len(w.pages)
    w.add_outline_item(t["title"], 0)
    w.add_outline_item(t["toc"], pages["toc"])
    n = 0
    for pi, p in enumerate(parts):
        parent = w.add_outline_item(f"{t['part'].capitalize()} {pi + 1} · {p['title']}", pages[f"p{pi + 1}"])
        for c in p["chapters"]:
            n += 1
            w.add_outline_item(f"{n}. {c['title']}", pages[f"c{n}"], parent=parent)
    app = w.add_outline_item(t["appendix"].capitalize(), pages["a0"])
    for i, title in enumerate([t["app_a_h"], t["app_b_h"], t["app_c_h"], t["app_d_h"], t["app_e_h"]]):
        w.add_outline_item(f"{letter(i)}. {title}", pages[f"a{i}"], parent=app)
    try:
        w.set_page_label(0, 0, prefix="Cop. " if loc == "it" else "Cover ")
        w.set_page_label(1, total - 1, style="/D", start=1)
    except Exception as exc:  # le etichette sono un di piu': non bloccano la build
        print("etichette di pagina non impostate:", exc)
    w.add_metadata({
        "/Title": f"{t['title']} - {t['subtitle']}",
        "/Author": "Mappa Senza Glutine",
        "/Subject": f"{t['edition']} {EDITION[loc]}",
        "/Keywords": "celiachia, senza glutine, AIC" if loc == "it" else "celiac disease, gluten-free, AIC",
    })
    final = OUT / f"Vivere-Senza-Glutine-{loc.upper()}-{FILE_TAG}.pdf"
    with open(final, "wb") as f:
        w.write(f)
    return {"file": final, "pages": total, "toc_pages": pages, **meta}


def previews(pdf_path: Path, loc: str, toc_pages: dict) -> None:
    """Anteprime JPG per la landing: pagine vere del PDF (copertina, indice, un capitolo, scheda, checklist)."""
    import pypdfium2 as pdfium
    dest = SITE / "public" / "images" / "guida"
    dest.mkdir(parents=True, exist_ok=True)
    pdf = pdfium.PdfDocument(str(pdf_path))
    # indice 0 = copertina; la pagina stampata N e' all'indice N (le etichette partono da 1 dopo la copertina)
    chosen = {"cover": 0, "indice": toc_pages["toc"], "capitolo": toc_pages["c1"] + 1, "scheda": toc_pages["a0"], "checklist": toc_pages["a1"]}
    for name, idx in chosen.items():
        img = pdf[idx].render(scale=2.2).to_pil().convert("RGB")
        img.save(dest / f"{loc}-{name}.jpg", quality=82, optimize=True, progressive=True)


if __name__ == "__main__":
    content = json.loads((ROOT / "content.json").read_text(encoding="utf-8"))
    result = {}
    for loc in ("it", "en"):
        r = build(loc, content)
        print(loc, "->", r["file"].name, "| pagine:", r["pages"], "| capitoli:", r["chapters"], "| parole:", r["words"])
        tp = r["toc_pages"]
        toc, n = [], 0
        for pi, p in enumerate(content[loc]["parts"]):
            chs = []
            for c in p["chapters"]:
                n += 1
                chs.append({"n": n, "title": c["title"], "page": tp[f"c{n}"]})
            toc.append({"title": p["title"], "intro": p["intro"], "chapters": chs})
        previews(r["file"], loc, tp)
        result[loc] = {"pages": r["pages"], "chapters": r["chapters"], "parts": r["parts"], "words": r["words"],
                       "file": r["file"].name, "edition": EDITION[loc], "toc": toc}
    (SITE / "src" / "lib" / "guide-meta.json").write_text(json.dumps(result, ensure_ascii=False, indent=1), encoding="utf-8")
    print("scritto src/lib/guide-meta.json e anteprime in public/images/guida")
