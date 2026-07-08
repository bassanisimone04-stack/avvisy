# NovaChain ⚡

Un prototipo funzionante di criptovaluta ispirata a Bitcoin, ma **sensibilmente
migliorata** su tre fronti concreti:

1. **Proof-of-Stake** invece di Proof-of-Work → consumo energetico ~0 (niente mining).
2. **Modello ad account** (come Ethereum) invece di UTXO → più semplice ed estendibile a smart contract.
3. **Guardiano AI anti-frode** → ogni transazione riceve un *risk score* e quelle
   ostili vengono messe in quarantena **prima** di finire in un blocco. Bitcoin non ha nulla di simile.

> ⚠️ È un prototipo **didattico**, pensato per imparare e sperimentare. Non è
> denaro reale e non è ancora pronto per la produzione. Vedi `WHITEPAPER.md` per
> il design completo e la roadmap.

## Come si prova

```bash
pip install -r requirements.txt
python3 demo.py                   # demo end-to-end (wallet, stake, blocchi, frode bloccata dall'AI, confronto energia)
python3 -m novachain.energy       # solo il confronto energetico vs Bitcoin (~2000x meno energia)
python3 tests/test_novachain.py   # suite di test
```

📄 **Da leggere:** [`docs/CRITICITA_BTC_E_SOLUZIONI.md`](docs/CRITICITA_BTC_E_SOLUZIONI.md)
— ogni criticità di Bitcoin mappata alla soluzione di NovaChain, con la realtà
regolatoria europea (MiCA). Onesto su cosa risolve l'architettura e cosa l'AI.

## Cosa vedi nella demo

- Creazione di wallet con chiavi **secp256k1** (la stessa curva di Bitcoin).
- Allocazione iniziale (genesis) di monete.
- Uno **staker** che blocca monete per diventare validatore.
- Transazioni normali che entrano in un blocco tramite Proof-of-Stake — **zero mining**.
- Il guardiano AI che impara il comportamento normale e poi **cattura una frode**
  ("svuota tutto il conto verso un indirizzo nuovo", la firma tipica di una chiave rubata).

## Struttura

```
novachain/
├── crypto.py         # chiavi, firme, hashing (secp256k1) — 100% deterministico
├── transaction.py    # transazioni firmate, modello ad account + nonce anti-replay
├── block.py          # blocchi (nessun puzzle di mining)
├── blockchain.py     # ledger, consenso Proof-of-Stake, stato, quarantena
├── ai_guardian.py    # rilevamento anomalie/frodi (online, non supervisionato)
└── wallet.py         # wallet: tiene le chiavi e costruisce transazioni firmate
demo.py               # dimostrazione end-to-end
tests/                # invarianti del protocollo
```

## Il principio guida sull'AI

Il **cuore del consenso resta deterministico** (firme, saldi, nonce): ogni nodo,
dato lo stesso input, calcola lo stesso risultato — è ciò che tiene insieme la
rete. L'AI **non decide** quali blocchi sono validi (romperebbe il consenso).
L'AI lavora *accanto* alla catena come rete di sicurezza: annota il rischio e mette
in quarantena le transazioni sospette. Questo è il modo onesto e corretto di usare
l'AI in una blockchain.
