# Foto e diritti: come mostrare immagini senza rischi evitabili

> Non sono un avvocato e questo non è un parere legale. Se pubblichi immagini di film in modo commerciale (affiliazioni, pubblicità), fai valutare il tuo caso da un legale esperto di diritto d'autore negli USA.

## Perché il sito parte senza fotogrammi

- Un fotogramma è un'opera protetta (di solito dallo studio), e il volto dell'attore può avere diritti propri (in USA, *right of publicity*).
- Il *fair use* americano è una difesa valutata caso per caso (scopo, natura, quantità, effetto sul mercato), non un permesso. Un sito commerciale con link affiliati lo ha più difficile di un commento non commerciale.
- Se altri siti usano fotogrammi, non sappiamo con quali diritti: potrebbero avere licenze, tollerare richieste di rimozione (DMCA) o semplicemente correre il rischio. Non è un precedente su cui basarsi.

Per questo le pagine usano illustrazioni generate (dichiarate come tali) finché non registri foto con diritti provabili.

## Le strade praticabili (dalla più sicura)

1. **Foto prodotto tue.** Compra un paio dei modelli principali e fotografalo su fondo neutro: nessun problema di diritti, ottimo per le schede. Tipo di licenza: *Scatto nostro*.
2. **Immagini dei programmi affiliati.** Reti e negozi (eBay Partner Network, marchi) forniscono feed con immagini prodotto, spesso utilizzabili per promuovere i loro articoli. **Leggi i termini del programma**: devono consentire di mostrare le immagini. Tipo: *Immagine da feed affiliato*, con link ai termini.
3. **Materiale stampa dei marchi** (Ray-Ban/EssilorLuxottica, Persol, Oliver Goldsmith, Tom Ford…). Le aree stampa hanno immagini prodotto con termini d'uso: spesso solo per editoriale. Tipo: *Materiale stampa*, con link ai termini.
4. **Wikimedia Commons.** File con licenza Creative Commons o di pubblico dominio. Verifica pagina per pagina: licenza, autore, obblighi di attribuzione; per locandine e fotogrammi lo stato dipende dal film e dal paese. Tipo: *Creative Commons* o *Pubblico dominio*, con link alla pagina del file.
5. **Licenze editoriali a pagamento** (Getty, Alamy, Shutterstock). Controlla che la licenza copra il web e il contesto commerciale del sito. Tipo: *Licenza acquistata*, con link alla ricevuta/licenza.
6. **Permesso scritto** dello studio o dell'ufficio stampa del film, conservato insieme al link o alla mail.

## Come funziona nell'admin

*Admin → Fotografie autorizzate*:

- Carichi il file su Supabase Storage (bucket pubblico `photos`) e incolli l'URL https.
- Scegli **Tipo**: *Prodotto* (card, scheda, dati strutturati) o *Scena* (pagina film, articolo, sezione "On screen" della scheda).
- Scegli **come hai ottenuto i diritti** e incolla il **link alla prova**. Tutto tranne "Scatto nostro" richiede il link.
- Collega la foto a un modello, un film o un articolo.
- Spunta **Diritti verificati: pubblica**. Il salvataggio è rifiutato se manca il testo alternativo (≥ 10 caratteri), il credito, il tipo di licenza o la prova.
- Una foto non approvata non appare mai sul sito. Il credito e il tipo di licenza compaiono sotto ogni immagine.

Sul database la stessa regola è imposta da un vincolo (`photos`: non si può approvare senza prova dei diritti, tranne per gli scatti propri).

## Se scegli comunque di usare fotogrammi ("fair use dichiarato")

È una scelta tua e il rischio è tuo. Il sito la rende possibile con questi paletti, pensati per ridurre il rischio e permetterti di reagire in fretta:

- **Tipo di licenza "Fair use dichiarato (NON è una licenza)".** Vale solo per immagini di tipo *Scena* (mai foto prodotto).
- **Motivazione scritta obbligatoria** (almeno 40 caratteri): perché l'uso è commento/identificazione e come lo limiti.
- **Pagina di origine obbligatoria** e **credito** a chi detiene i diritti (lo studio). Sotto l'immagine compaiono "Still © …", il link alla fonte e la pagina `/copyright`.
- **Ospita tu l'immagine.** Con Supabase configurato, un'immagine in fair use deve stare sul tuo storage: il sito rifiuta il collegamento diretto (hotlink) a siti altrui.
- **Pagina /copyright** con la procedura di segnalazione (modello da far rivedere). Compila i dati dell'agente designato.
- **Interruttore di emergenza:** nella dashboard compare un avviso con il numero di foto in fair use e il pulsante **"Ritira tutte subito"**, che le toglie dal sito senza cancellarle.

Buone pratiche che aiutano, ma non garantiscono nulla:

- immagini piccole (es. 1280 px sul lato lungo), una o due per scheda, mai come sfondo o decorazione;
- l'immagine sta accanto a un'analisi originale (prove, fonti, grado di identificazione): è ciò che rende l'uso "commento";
- non usare immagini ad alta risoluzione ritagliate da trailer/materiali coperti da accordi particolari;
- rispondi subito a ogni richiesta di rimozione e conserva la corrispondenza;
- negli USA, per la tutela prevista dal DMCA (safe harbor) serve registrare un **agente designato** presso il Copyright Office (comporta una piccola tassa) e rispettare la procedura di notifica e rimozione;
- fai valutare il caso a un legale: pubblicità e link affiliati rendono l'uso più "commerciale" e indeboliscono l'argomento.

Alternative più sicure per le scene: link o incorporamento del trailer ufficiale, oppure immagini del presskit con termini che le consentono.
