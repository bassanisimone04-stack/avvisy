"use client";

import { useState, useTransition } from "react";
import { useFormAction } from "./useFormAction";
import { checkAddressAction, publishAction, type AddressCheck } from "@/app/actions";
import { CONTRATTI, REGIONI, TIPOLOGIE } from "@/lib/italy";

const euro = new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
const toInt = (s: string) => (/^\d+$/.test(s.replace(/[.\s€]/g, "")) ? Number(s.replace(/[.\s€]/g, "")) : 0);

type Addr = { regione: string; comune: string; via: string; civico: string; interno: string; cap: string };

export function PublishForm({ role }: { role: "private" | "agency" }) {
  const [addr, setAddr] = useState<Addr>({ regione: "", comune: "", via: "", civico: "", interno: "", cap: "" });
  const [check, setCheck] = useState<AddressCheck | null>(null);
  const [checking, startCheck] = useTransition();
  const [quartiere, setQuartiere] = useState("");
  const [costs, setCosts] = useState({ canone: "", spese: "", cauzione: "", commissione: role === "private" ? "0" : "" });
  const { state, onSubmit, pending } = useFormAction(publishAction);

  const setA = (k: keyof Addr) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setAddr({ ...addr, [k]: e.target.value });
    setCheck(null); // l'indirizzo è cambiato: va riverificato
  };
  const verify = () =>
    startCheck(async () => {
      const r = await checkAddressAction(addr);
      setCheck(r);
      if (r.ok && r.suggestedQuartiere && !quartiere) setQuartiere(r.suggestedQuartiere);
    });

  const sameUnit = check?.ok ? check.matches.find((m) => m.same_unit) : undefined;
  const sameBuilding = check?.ok ? check.matches.filter((m) => !m.same_unit) : [];
  const total = toInt(costs.canone) + toInt(costs.spese) + toInt(costs.cauzione) + toInt(costs.commissione);

  return (
    <form onSubmit={onSubmit} className="stack" style={{ gap: 18 }}>
      <fieldset className="stack">
        <legend>1. Indirizzo esatto</legend>
        <p className="small muted" style={{ margin: 0 }}>
          L&apos;indirizzo identifica l&apos;immobile in modo univoco. Se è già presente su TrovaImmobile, il tuo annuncio verrà collegato alla sua scheda (con lo storico prezzi) invece di creare un doppione.
        </p>
        <div className="grid grid-2">
          <div className="field">
            <label htmlFor="regione">Regione</label>
            <select id="regione" name="regione" value={addr.regione} onChange={setA("regione")} required>
              <option value="">Seleziona…</option>
              {REGIONI.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="comune">Comune</label>
            <input id="comune" name="comune" className="input" value={addr.comune} onChange={setA("comune")} autoComplete="address-level2" required />
          </div>
          <div className="field">
            <label htmlFor="via">Via / piazza</label>
            <input id="via" name="via" className="input" value={addr.via} onChange={setA("via")} placeholder="Es. Via Mazzini" autoComplete="address-line1" required />
          </div>
          <div className="grid" style={{ gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            <div className="field">
              <label htmlFor="civico">Civico</label>
              <input id="civico" name="civico" className="input" value={addr.civico} onChange={setA("civico")} required />
            </div>
            <div className="field">
              <label htmlFor="interno">Interno</label>
              <input id="interno" name="interno" className="input" value={addr.interno} onChange={setA("interno")} />
            </div>
            <div className="field">
              <label htmlFor="cap">CAP</label>
              <input id="cap" name="cap" className="input" inputMode="numeric" pattern="\d{5}" value={addr.cap} onChange={setA("cap")} autoComplete="postal-code" />
            </div>
          </div>
        </div>
        <span className="hint">L&apos;interno distingue appartamenti diversi nello stesso palazzo. Non viene mostrato come dato di contatto.</span>
        <button type="button" className="btn" onClick={verify} disabled={checking || !addr.regione || !addr.comune || !addr.via || !addr.civico}>
          {checking ? "Verifica in corso…" : "Verifica indirizzo"}
        </button>

        {check && !check.ok && <div className="alert alert-danger">{check.error}</div>}
        {check?.ok && (
          <div className="stack" style={{ gap: 8 }}>
            <div className={`alert ${check.precision === "exact" ? "alert-ok" : "alert-warn"}`}>
              <strong>{check.precision === "exact" ? "Indirizzo trovato" : "Via trovata, civico non mappato"}</strong>
              {check.displayName}
            </div>
            {sameUnit ? (
              <div className="alert alert-info">
                <strong>Questo immobile è già schedato (scheda n. {sameUnit.id})</strong>
                {sameUnit.tipologia}, {sameUnit.mq} m², {sameUnit.locali} locali · {sameUnit.total_listings} annunci nello storico
                {sameUnit.active_listings > 0 && `, ${sameUnit.active_listings} attivi ora`}. Il tuo annuncio verrà agganciato a questa scheda: caratteristiche e storico restano quelli esistenti.
                <a href={`/immobili/${sameUnit.id}`} target="_blank" rel="noreferrer" style={{ display: "block", marginTop: 4 }}>
                  Apri la scheda →
                </a>
              </div>
            ) : (
              <div className="alert alert-ok">Nessuna scheda esistente per questo immobile: ne verrà creata una nuova.</div>
            )}
            {sameBuilding.length > 0 && (
              <div className="alert alert-warn">
                <strong>Allo stesso civico ci sono già {sameBuilding.length} immobili schedati</strong>
                {sameBuilding.map((m) => `interno ${m.interno ?? "non indicato"} (${m.tipologia}, ${m.mq} m²)`).join("; ")}. Se il tuo è uno di questi, indica lo stesso interno per agganciarti alla sua scheda.
              </div>
            )}
          </div>
        )}
        <div className="field">
          <label htmlFor="quartiere">Quartiere / zona</label>
          <input id="quartiere" name="quartiere" className="input" value={quartiere} onChange={(e) => setQuartiere(e.target.value)} placeholder="Facoltativo, es. Navigli" />
        </div>
      </fieldset>

      <fieldset className="stack" disabled={!check?.ok}>
        <legend>2. Immobile</legend>
        {sameUnit && <p className="small muted" style={{ margin: 0 }}>Caratteristiche già registrate nella scheda: vengono mantenute.</p>}
        <div className="grid grid-2">
          <div className="field">
            <label htmlFor="tipologia">Tipologia</label>
            <select id="tipologia" name="tipologia" required defaultValue={sameUnit?.tipologia ?? ""} key={`t${sameUnit?.id}`}>
              <option value="">Seleziona…</option>
              {TIPOLOGIE.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="piano">Piano</label>
            <input id="piano" name="piano" className="input" defaultValue={sameUnit?.piano ?? ""} key={`p${sameUnit?.id}`} placeholder="Es. 3° con ascensore" />
          </div>
          <div className="grid" style={{ gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            <div className="field">
              <label htmlFor="mq">m²</label>
              <input id="mq" name="mq" className="input" inputMode="numeric" required defaultValue={sameUnit?.mq ?? ""} key={`m${sameUnit?.id}`} />
            </div>
            <div className="field">
              <label htmlFor="locali">Locali</label>
              <input id="locali" name="locali" className="input" inputMode="numeric" required defaultValue={sameUnit?.locali ?? ""} key={`l${sameUnit?.id}`} />
            </div>
            <div className="field">
              <label htmlFor="bagni">Bagni</label>
              <input id="bagni" name="bagni" className="input" inputMode="numeric" required defaultValue={sameUnit?.bagni ?? ""} key={`b${sameUnit?.id}`} />
            </div>
          </div>
          <div className="field">
            <label htmlFor="contratto">Contratto</label>
            <select id="contratto" name="contratto" required defaultValue="">
              <option value="">Seleziona…</option>
              {CONTRATTI.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="disponibile_dal">Disponibile dal</label>
            <input id="disponibile_dal" name="disponibile_dal" type="date" className="input" />
          </div>
          <label className="check" style={{ alignSelf: "end" }}>
            <input type="checkbox" name="arredato" /> Arredato
          </label>
        </div>
      </fieldset>

      <fieldset className="stack" disabled={!check?.ok}>
        <legend>3. Costo totale d&apos;ingresso</legend>
        <p className="small muted" style={{ margin: 0 }}>
          Tutti i campi sono obbligatori (scrivi 0 se una voce non c&apos;è). Il totale viene mostrato su ogni risultato di ricerca, prima del contatto.
        </p>
        <div className="grid grid-2">
          {(
            [
              ["canone", "Canone mensile (€)"],
              ["spese", "Spese condominiali mensili (€)"],
              ["cauzione", "Cauzione (€)"],
              ["commissione", "Commissione agenzia (€)"],
            ] as const
          ).map(([k, label]) => (
            <div className="field" key={k}>
              <label htmlFor={k}>{label}</label>
              <input
                id={k}
                name={k}
                className="input"
                inputMode="numeric"
                required
                value={costs[k]}
                readOnly={k === "commissione" && role === "private"}
                onChange={(e) => setCosts({ ...costs, [k]: e.target.value })}
              />
              {k === "commissione" && <span className="hint">{role === "private" ? "I privati non applicano commissioni." : "Dovuta solo alla firma del contratto. Mai prima della visita."}</span>}
            </div>
          ))}
        </div>
        <div className="cost cost-compact">
          <span className="total">Costo totale d&apos;ingresso</span>
          <span className="total">{euro.format(total)}</span>
        </div>
      </fieldset>

      <fieldset className="stack" disabled={!check?.ok}>
        <legend>4. Annuncio</legend>
        <div className="field">
          <label htmlFor="title">Titolo</label>
          <input id="title" name="title" className="input" minLength={10} maxLength={90} required placeholder="Es. Bilocale luminoso vicino alla metro" />
        </div>
        <div className="field">
          <label htmlFor="description">Descrizione</label>
          <textarea id="description" name="description" minLength={40} required />
          <span className="hint">Non chiedere caparre o pagamenti anticipati: gli annunci che lo fanno vengono rifiutati.</span>
        </div>
        <div className="field">
          <label htmlFor="photos">Foto (JPG, PNG o WebP, max 10 × 6 MB)</label>
          <input id="photos" name="photos" type="file" accept="image/jpeg,image/png,image/webp" multiple className="input" />
        </div>
      </fieldset>

      {state?.error && <div className="alert alert-danger">{state.error}</div>}
      <button className="btn btn-primary" disabled={!check?.ok || pending}>
        {pending ? "Pubblicazione…" : "Pubblica annuncio"}
      </button>
    </form>
  );
}
