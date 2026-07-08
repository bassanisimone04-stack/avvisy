# NovaChain — Whitepaper (bozza v0.1)

*Una criptovaluta Proof-of-Stake con un guardiano AI anti-frode.*

---

## 1. Perché

Bitcoin ha dimostrato che si può avere denaro digitale senza una banca centrale.
Ma dopo 15+ anni i suoi limiti tecnici sono chiari e misurabili. NovaChain parte
dalle stesse fondamenta (crittografia a chiave pubblica, catena di blocchi
immutabile, scarsità con tetto massimo) e migliora **tre cose precise**, senza
promesse magiche.

| # | Limite di Bitcoin | Scelta di NovaChain | Beneficio |
|---|---|---|---|
| 1 | Proof-of-Work: enorme consumo energetico, centralizza sui grandi miner | **Proof-of-Stake** deterministico pesato sullo stake | Energia ~0, stessa sicurezza economica |
| 2 | Modello UTXO, difficile da estendere | **Modello ad account** con nonce anti-replay | Basi per smart contract, ragionamento sui saldi semplice |
| 3 | Nessuna difesa nativa contro le frodi | **Guardiano AI** che assegna un risk score e mette in quarantena | Immunità in tempo reale a chiavi rubate / pattern anomali |

## 2. Cosa NON promettiamo (onestà tecnica)

Molti progetti "AI + blockchain" mentono su questo punto, quindi lo diciamo
subito e chiaro:

> **L'AI non governa il consenso.** Il consenso deve essere *deterministico*:
> ogni nodo, con lo stesso input, deve arrivare alla stessa conclusione, altrimenti
> la rete si divide. Le reti neurali non sono deterministiche → non possono
> decidere quali blocchi sono validi. Quindi in NovaChain le regole di validità
> (firme, saldi, nonce, hash) sono pura matematica verificabile. L'AI è un
> **livello di sicurezza avanzato accanto** alla catena, non dentro il motore.

Questa disciplina è ciò che rende NovaChain difendibile invece che marketing.

## 3. Architettura

### 3.1 Crittografia
Firme **ECDSA su secp256k1** (identica a Bitcoin). L'indirizzo è
`nova1` + parte dell'hash SHA-256 della chiave pubblica. Una transazione è valida
solo se: (a) la firma verifica, e (b) l'indirizzo mittente deriva davvero dalla
chiave pubblica allegata — così nessuno può spendere dal conto altrui.

### 3.2 Modello a stato (account)
Ogni account ha `balance` e `nonce`. Il nonce è un contatore per-account che
impedisce il *replay*: la stessa transazione firmata non può essere applicata due
volte. La mempool tiene conto del "pending nonce" così un mittente può accodare
più transazioni nello stesso blocco.

### 3.3 Consenso — Proof-of-Stake
- I validatori bloccano ("stake") delle monete per candidarsi.
- Per ogni altezza, il produttore del blocco è scelto con un **sorteggio pesato
  sullo stake, deterministico**, seminato dall'hash del blocco precedente. Ogni
  nodo onesto calcola lo stesso validatore senza doversi coordinare.
- Il validatore incassa `block reward` + le fee delle transazioni incluse.
- L'emissione rispetta un **tetto massimo** (`21.000.000`) in stile Bitcoin.

*Sicurezza:* attaccare la rete richiede di controllare la maggioranza dello stake,
il che costa capitale reale a rischio (slashing nella versione futura), esattamente
come attaccare Bitcoin richiede la maggioranza dell'hash power — ma senza bruciare
gigawatt.

### 3.4 Il Guardiano AI
Un **rilevatore di anomalie online e non supervisionato**. Per ogni account tiene
una baseline comportamentale aggiornata in tempo reale (algoritmo di Welford per
media/varianza) e combina più segnali in un `risk_score ∈ [0,1]`:

| Segnale | Peso | Intuizione |
|---|---|---|
| Anomalia di importo (z-score) | 0.40 | Un importo molto sopra la media dell'account è sospetto |
| Velocità | 0.25 | Raffiche di transazioni ravvicinate = possibile bot/attacco |
| Nuovo destinatario | 0.15 | Primo invio verso un indirizzo mai visto |
| Svuotamento del conto | 0.20 | Drenare quasi tutto il saldo = firma tipica di chiave rubata |

Transazioni con score ≥ `0.75` finiscono in **quarantena** e non vengono minate,
in attesa di revisione da parte di un livello di policy (o umano). Il guardiano
impara **solo** da transazioni confermate, così non può essere avvelenato da tx
non ancora incluse.

## 4. Tokenomics (bozza)
- **Simbolo:** NOVA
- **Offerta massima:** 21.000.000 (scarsità in stile BTC)
- **Emissione:** ricompensa per blocco ai validatori (decrescente in futuro), non mining
- **Fee:** pagate dai mittenti, incassate dal validatore del blocco

## 5. Roadmap

**Fatto (v0.1 — questo prototipo)**
- ✅ Wallet, firme secp256k1, indirizzi
- ✅ Transazioni ad account con nonce anti-replay
- ✅ Consenso Proof-of-Stake deterministico + ricompense + tetto di offerta
- ✅ Guardiano AI (anomaly detection) con quarantena
- ✅ Suite di test sulle invarianti

**Prossimi passi**
- ⏭️ **Rete P2P**: più nodi, propagazione di blocchi/transazioni, risoluzione dei fork (regola della catena più pesante per stake).
- ⏭️ **Persistenza**: salvare la catena su disco (LevelDB/SQLite).
- ⏭️ **Slashing**: penalizzare i validatori disonesti (doppia firma).
- ⏭️ **Smart contract**: una VM (WASM) sopra il modello ad account.
- ⏭️ **AI v2**: sostituire l'euristica con un modello addestrato (Isolation Forest / autoencoder) su dati storici.
- ⏭️ **AI verificabile (ZKML)**: produrre una *prova crittografica* che il verdetto del modello è corretto, così l'AI diventa verificabile on-chain senza rompere il determinismo. È la frontiera di ricerca reale del "AI dentro la blockchain".
- ⏭️ **Layer 2** per scalabilità (canali di pagamento / rollup).

## 6. Come provarlo
Vedi `README.md`. In breve: `python3 demo.py`.

---

*Documento vivo. Ogni scelta qui è pensata per essere difendibile tecnicamente,
non per fare rumore. Contributi e critiche benvenuti.*
