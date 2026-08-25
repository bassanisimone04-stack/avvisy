"use client";

import { NOME_RUOLO, ORDINE_RUOLI } from "@/lib/players";
import { useAsta } from "@/lib/store";
import type { Ruolo } from "@/lib/types";
import { Avviso } from "./ui";

/**
 * Il dataset interno copre i giocatori che contano davvero all'asta, non i
 * ~500 nomi del listone ufficiale. In una lega numerosa questo può non bastare
 * a riempire tutti gli slot: meglio dirlo prima dell'asta che scoprirlo al
 * momento di comprare il sesto attaccante.
 */
export default function CoperturaListone() {
  const { state, listone, pronto } = useAsta();
  if (!pronto) return null;

  const disponibili: Record<Ruolo, number> = { P: 0, D: 0, C: 0, A: 0 };
  for (const p of listone) disponibili[p.r]++;

  const partecipanti = state.fantallenatori.length;
  const scoperti = ORDINE_RUOLI.map((r) => ({
    ruolo: r,
    servono: state.lega.slot[r] * partecipanti,
    ci_sono: disponibili[r],
  })).filter((x) => x.ci_sono < x.servono);

  if (scoperti.length === 0) return null;

  return (
    <Avviso livello="attenzione">
      <strong>Il listone caricato non copre tutti gli slot della lega.</strong>{" "}
      {scoperti
        .map(
          (x) =>
            `${NOME_RUOLO[x.ruolo].toLowerCase()}: ${x.ci_sono} disponibili su ${x.servono} necessari`
        )
        .join(" · ")}
      . Con {partecipanti} squadre qualcuno resterà con caselle vuote: importa il listone ufficiale
      dalla pagina Listone, oppure riduci gli slot in Lega.
    </Avviso>
  );
}
