# AURA — Concept & Whitepaper sintetico (bozza v0.1)

*Protocollo monetario europeo crypto-native. Moneta stabile elastica (AURA),
token scarso (AUR), governance di lungo periodo (veAUR).*

> **AURA si usa. AUR si custodisce. veAUR si governa.**

> ⚠️ Documento di progettazione, non offerta né sollecitazione. AURA non è
> denaro legale, non è una CBDC, non è un prodotto della BCE, non promette
> rendimento né peg perfetto. Vedi §16 (Rischi) e §10 (MiCA). Nulla qui è
> consulenza finanziaria, di investimento o legale.

---

## 1. Visione

AURA è una **moneta digitale europea decentralizzata**, progettata per offrire
stabilità nel potere d'acquisto, trasparenza, autocustodia e regole monetarie
pubbliche e verificabili on-chain.

Non nasce come promessa aziendale ("fidati che ho le riserve"), ma come
**protocollo**: gli utenti generano AURA depositando collateral verificabile in
smart contract pubblici, sovracollateralizzati e con liquidazioni trasparenti.

**AURA non è:** Tether/USDC/EURC in euro · una CBDC · un prodotto BCE · moneta
legale · una promessa bancaria · una meme coin · uno schema speculativo · una
stablecoin custodiale opaca.

**AURA è:** una moneta europea crypto-native · un protocollo monetario aperto ·
una *stable unit* orientata all'euro · un sistema sovracollateralizzato ·
un'infrastruttura autocustodiale · trasparente e verificabile · una rete per
pagamenti, merchant, fintech e Web3 europea.

**Obiettivo.** Una moneta stabile nel potere d'acquisto, verificabile on-chain,
autocustodiale, resistente agli abusi di potere centrale, non dipendente da
un'unica società emittente.

**Frase chiave.** *AURA non ti chiede fiducia cieca. AURA rende la fiducia
verificabile.*

---

## 2. Differenza fondamentale da Tether

Tether è un modello **custodiale**: una società emette token e *dichiara* di
detenere riserve sufficienti. AURA è un **protocollo**: la moneta esiste solo se
c'è collateral verificabile bloccato in smart contract pubblici.

| Dimensione | Tether (USDT) | AURA |
|---|---|---|
| Da cosa dipende | Un emittente centrale | Smart contract pubblici |
| Fiducia richiesta | Nelle riserve off-chain | Nella verifica on-chain del collateral |
| Riserve | Custodite da entità private | Vault pubblici, collateral trasparente |
| Scopo principale | Trading crypto | Pagamenti, merchant, fintech, Web3 UE |
| Governance | Centralizzata | Progressivamente decentralizzata (veAUR) |
| Fonte della stabilità | "Fidati di noi" | Regole pubbliche + sovracollateralizzazione + liquidazioni trasparenti |

---

## 3. Struttura a tre token

### A. AURA — la moneta stabile (elastica)
Moneta principale: pagamenti, trasferimenti, merchant settlement, uso quotidiano,
risparmio digitale (senza promessa di rendimento), finanza on-chain, creator
economy, marketplace, micro-pagamenti, unità di conto del protocollo.

- **Supply variabile ed elastica.** Nessun tetto massimo.
- **Perché:** una moneta stabile deve poter espandere e contrarre l'offerta.
  Un tetto fisso stile Bitcoin la renderebbe scarsa → speculativa → instabile.
- **Regola:** *AURA è elastica, perché deve essere stabile.*
- **Target:** 1 AURA ≈ 1 EUR di **potere d'acquisto digitale** — non una promessa
  bancaria 1:1 riscattabile da una singola società.

### B. AUR — il token scarso
Ispirato alla scarsità di Bitcoin, ma con funzione diversa (coordina il
protocollo, non è "denaro da spendere").

- **Max supply: 21.000.000 AUR.** Nessun mint arbitrario oltre il tetto.
- Emissione programmata e trasparente, **rilascio graduale in 10 anni**,
  **riduzione ogni 2 anni**, treasury visibile on-chain.
- **Funzioni:** governance (limitata), sicurezza del protocollo, incentivi a
  sviluppatori/auditor/keeper/liquidatori, fondo assicurativo, reputazione,
  accesso a funzioni avanzate, eventuale *buyback & burn* tramite fee **solo se
  legalmente sostenibile**, coordinamento economico dell'ecosistema.
- **AUR non promette rendimento.** Non "compra perché salirà", ma "AUR coordina
  valore, sicurezza e governance".
- **Regola:** *AUR è scarso, perché deve coordinare valore, sicurezza e governance.*

### C. veAUR — la governance non trasferibile
Si ottiene **bloccando AUR** per un periodo. Non trasferibile.

- **Funzioni:** voto sulle proposte, reputazione di lungo periodo, riduzione della
  speculazione, allineamento utenti↔protocollo, controllo dei parametri di
  rischio, distribuzione di incentivi non speculativi, decisioni su collateral,
  fee, oracoli e moduli di sicurezza.
- **Potere di voto crescente col lock:**

  | Lock | Voting power |
  |---|---|
  | 3 mesi | 0,25× |
  | 1 anno | 1× |
  | 2 anni | 2× |
  | 4 anni | 4× |

- **Regola:** *veAUR governa, perché premia chi pensa a lungo termine.*

---

## 4. Tokenomics AUR

**Supply massima: 21.000.000 AUR.**

| Allocazione | Quota | Note |
|---|---|---|
| Community e utenti | 30% | Distribuzione graduale, incentivi non speculativi |
| Treasury protocollo | 25% | Rilascio controllato dalla governance |
| Team e contributor | 15% | 1 anno cliff + 4 anni vesting |
| Investitori strategici | 10% | 1 anno cliff + 4 anni vesting |
| Security fund | 10% | Bloccato, solo emergenze di protocollo |
| Ecosystem grants | 10% | Sviluppo, integrazioni, ricerca |

**Emissione.** 25% disponibile al lancio; 75% rilasciato progressivamente in 10
anni; riduzione ogni 2 anni; **nessuna emissione oltre 21 milioni**.

**Uso delle fee (in ordine di priorità).** 1) riserva di sicurezza; 2) audit, bug
bounty, sviluppo; 3) incentivi a keeper/liquidatori/infrastruttura; 4) *solo in
fase matura*, eventuale buyback & burn di AUR se legalmente sostenibile.
**Nessun dividendo promesso agli holder.**

---

## 5. Modello monetario AURA

AURA evita il modello "1 AURA = 1 euro custodito in banca". È una **stable unit**
con unità di conto in euro, **generata tramite collateralizzazione on-chain**.

**Ciclo di vita.**
1. L'utente deposita collateral in un **vault**.
2. Il protocollo calcola quanta AURA può essere generata (in base al collateral
   ratio del tipo di asset).
3. L'utente **minta** AURA.
4. Il collateral resta bloccato.
5. Per recuperarlo, l'utente **brucia** AURA (repayment).
6. Se il collateral scende sotto soglia → il vault viene **liquidato**.

**Strumenti di stabilità (combinati):** sovracollateralizzazione, mint/burn
automatici, vault pubblici, liquidazioni trasparenti, oracoli multipli, fee
dinamiche, riserva di sicurezza, incentivi di arbitraggio, Peg Stability Module
**limitato**, governance dei parametri via veAUR.

---

## 6. Collateralizzazione

Partenza **prudente**. Collateral e ratio minimi (esempio, governabili via veAUR):

| Collateral | Collateral ratio minimo | Ammesso nell'MVP |
|---|---|---|
| ETH | 200% | ✅ |
| BTC tokenizzato (solo se altamente affidabile) | 220% | ⏳ dopo valutazione |
| Stablecoin euro regolamentata (collateral secondario) | 125% | ✅ (limitato) |
| Tokenized bond UE | 145% | ⏳ dopo valutazione legale |
| Tokenized money market fund UE | (da valutare) | ⏳ fase avanzata |
| Asset RWA sperimentali | — | ❌ non nell'MVP |

**Principio:** *meglio una crescita lenta e robusta che una rapida e fragile.*

---

## 7. Meccanismo di stabilità

- **Sovracollateralizzazione** — ogni AURA è coperta da collateral di valore
  superiore.
- **Liquidazioni automatiche** — i vault rischiosi vengono liquidati *prima*
  dell'insolvenza; penalità di liquidazione a protezione del sistema.
- **Stability fee dinamica** — se AURA < target, la fee sale (riduce la supply);
  se AURA > target, la fee scende (favorisce nuovi mint).
- **Peg Stability Module limitato** — swap con stablecoin euro regolamentate, con
  **cap rigidi** per evitare dipendenza custodiale.
- **Riserva di sicurezza** — parte delle fee alimenta un buffer per eventi
  estremi.
- **Incentivi di arbitraggio** — mint/burn/repayment riportano AURA verso il
  target.
- **Risk parameters governati da veAUR** — aggiornabili con voto + timelock +
  audit.

---

## 8. Architettura tecnica

**Contratti/moduli:** AURA Token · AUR Token · veAUR Locking · Vault Manager ·
Oracle Aggregator · Liquidation Engine · Risk Module · Peg Stability Module ·
Reserve Module · Governance Module · Emergency Module. **Interfacce:** Dashboard
pubblica · Wallet autocustodiale · Merchant API · Developer SDK.

**Requisiti non negoziabili.** Smart contract open source · audit multipli ·
formal verification sui moduli critici · bug bounty permanente · timelock sugli
upgrade · multisig iniziale con firmatari pubblici · decentralizzazione
progressiva · **nessun mint arbitrario di AURA senza collateral** · **nessun mint
di AUR oltre 21M** · dashboard con supply, collateral ratio, liquidazioni,
riserva, fee, vault, treasury, governance e stato oracoli.

---

## 9. Governance

**Via veAUR.** Può decidere: nuovi collateral, collateral ratio, liquidation
penalty, stability fee, limiti del PSM, uso del treasury, bug bounty, parametri
degli oracoli, ecosystem grants, aggiornamenti del protocollo.

**La governance NON può:** mintare AUR oltre 21M · rubare collateral · modificare
saldi utente arbitrariamente · creare AURA senza collateral · eliminare il
timelock · congelare utenti senza processo definito · cambiare regole
fondamentali senza voto e ritardo pubblico.

**Fasi.** 1) multisig + fondazione/protocol company → 2) governance ibrida con
veAUR → 3) decentralizzazione progressiva → 4) governance minima, parametri
stabilizzati.

---

## 10. Compliance UE / MiCA

Progettato considerando **MiCA, AML, Travel Rule** e normative applicabili.

**Strategia:** non presentare AURA come euro ufficiale o CBDC · nessun simbolo o
linguaggio confondibile con BCE/Eurosistema · nessuna redemption bancaria 1:1 da
singolo emittente · nessuna promessa di rendimento · **separazione netta tra
protocollo decentralizzato, interfacce e servizi regolati** · KYC/AML sui punti
fiat on/off ramp · partner regolamentati per SEPA/carte/merchant/conversione euro
· legal opinion prima del lancio · risk disclosure pubblica · whitepaper non
promozionale · governance trasparente · classificazione legale chiara per AURA,
AUR e veAUR.

**Rischi di classificazione (da chiarire con legali UE).**
- **AURA** potrebbe rientrare tra i crypto-asset regolati, o essere valutata come
  *asset-referenced token* (ART) o altra categoria a seconda del design finale.
- **AUR** presenta rischi di classificazione come token di governance con possibili
  aspetti finanziari.
- **veAUR** va progettato **per governance e reputazione, non per rendimento**.

---

## 11. Privacy

**Privacy graduata, non anonimato totale.** Autocustodia · identità non pubblica
on-chain · KYC solo sui punti regolati · zero-knowledge proof dove possibile ·
separazione tra identità reale e attività on-chain · compliance con richieste
legali valide · **nessuna sorveglianza generalizzata nel protocollo** · dashboard
sul *protocollo*, non sorveglianza personale degli utenti.

**Principio:** *privacy per l'utente, trasparenza per il protocollo, compliance
per gli accessi regolati.*

---

## 12. Sicurezza

Audit multipli · bug bounty permanente · formal verification · oracle failover ·
circuit breaker **limitati** · timelock obbligatori · multisig distribuito ·
disaster recovery plan · stress test · simulazioni di liquidazione · testnet
lunga · post-mortem obbligatori · dashboard rischio in tempo reale.

---

## 13. MVP realistico

**Include:** AURA su Ethereum testnet + una Layer 2 · AUR (max 21M) · veAUR
locking · collateral iniziale **solo ETH + una stablecoin euro regolamentata** ·
vault sovracollateralizzati · mint/burn · liquidation engine · oracle aggregator
· dashboard pubblica · wallet demo · whitepaper · legal memo · audit preliminare
· testnet pubblica · governance iniziale con multisig + timelock. **Nessun lancio
retail senza revisione legale.**

**NON include (ancora):** RWA complessi · bridge custom · rendimenti · carte ·
lending · collateral esotici · DAO totale · promessa di peg perfetto · marketing
speculativo.

---

## 14. Roadmap in 4 fasi

1. **Research & legal design** — whitepaper, legal opinion MiCA, architettura,
   tokenomics AUR, modello veAUR, risk framework, scelta giurisdizione UE,
   branding, mockup dashboard/wallet.
2. **Testnet** — contratti, vault, mint/burn, AUR, veAUR, oracoli multipli,
   liquidazioni simulate, dashboard, bug bounty, audit iniziale, community tecnica.
3. **Mainnet controllata** — lancio con limiti di supply e collateral, emissione
   graduale AUR, governance veAUR, partner regolamentati, monitoraggio rischio,
   audit completo, timelock, accesso controllato a early users.
4. **Espansione** — più collateral, Merchant API, integrazione wallet, Layer 2
   aggiuntive, governance progressiva, proof-of-reserves per collateral off-chain,
   partnership fintech, possibile integrazione SEPA tramite soggetti regolati.

---

## 15. Use case

Pagamenti digitali europei · merchant settlement · wallet autocustodiale ·
finanza on-chain europea · creator economy · marketplace · micro-pagamenti ·
treasury on-chain per startup · pagamenti tra app · stable unit per DeFi europea ·
accesso euro-native al Web3.

---

## 16. Rischi (dichiarati) e mitigazioni

| Rischio | Mitigazione |
|---|---|
| **Depeg** | Sovracollateralizzazione, fee dinamiche, arbitraggio, PSM limitato, riserva |
| **Smart contract** | Audit multipli, formal verification, bug bounty, timelock |
| **Oracle** | Oracoli multipli, aggregazione, failover, circuit breaker |
| **Liquidazioni** | Soglie prudenti, aste trasparenti, incentivi keeper, stress test |
| **Collateral volatile** | Ratio elevati, whitelist prudente, limiti per asset |
| **Governance** | Timelock, quorum, limiti di potere, non-custodia dei fondi |
| **Normativo (MiCA)** | Legal opinion, separazione protocollo/servizi, partner regolati |
| **Bassa liquidità** | Rollout graduale, market making, incentivi mirati |
| **Bridge** | Evitare bridge custom nell'MVP, adottare soluzioni auditate |
| **Partner fiat** | Diversificazione, due diligence, ridondanza on/off ramp |
| **Classificazione token** | Design conservativo di AUR/veAUR, legal opinion dedicata |
| **Speculazione su AUR** | Comunicazione non promozionale, nessuna promessa di rendimento |
| **Centralizzazione iniziale** | Roadmap di decentralizzazione, multisig pubblica, timelock |
| **Reputazionale** | Trasparenza, post-mortem, dashboard pubblica, nessun overclaim |

**Nessun "rischio zero".** AURA riduce e rende *verificabili* i rischi; non li
elimina.

---

## 17. Differenziazione

| Progetto | Cos'è | Perché AURA è diversa |
|---|---|---|
| **Tether / USDC / EURC** | Stablecoin custodiali, riserve off-chain | AURA è un protocollo sovracollateralizzato, collateral on-chain verificabile |
| **DAI / MakerDAO (Sky)** | Stablecoin cripto-collateralizzata (parente più vicino) | AURA è **euro-native**, con impostazione MiCA-aware e un modello a 3 token (AURA/AUR/veAUR) orientato all'UE |
| **Bitcoin** | Riserva di valore scarsa, volatile | AURA è **stabile ed elastica**; la scarsità vive in AUR, non nella moneta di spesa |
| **Ethereum** | Piattaforma/gas asset | AURA è una moneta, non una piattaforma; gira *sopra* infrastrutture come Ethereum/L2 |
| **Euro digitale BCE (CBDC)** | Moneta di banca centrale, centralizzata | AURA è **autocustodiale, decentralizzata, non ufficiale**; non è denaro legale |

**Perché AUR può avere scarsità stile BTC senza compromettere AURA:** perché sono
**due token con funzioni separate**. AUR coordina/governa/protegge (scarso); AURA
si spende (elastica). La stabilità della moneta non dipende dalla scarsità del
token di coordinamento.

**Perché veAUR migliora la governance:** lega il potere di voto al *tempo di
impegno*, riducendo la speculazione e premiando chi pensa a lungo termine.
