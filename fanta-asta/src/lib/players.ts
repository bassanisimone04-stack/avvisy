import type { Player, PlayerTag, Ruolo, RuoloMantra, TeamCode } from "./types";

/**
 * LISTONE DI PARTENZA — Serie A Enilive 2026/27
 *
 * ATTENZIONE ALLA NATURA DEL DATO:
 * quotazioni (`qt`, base 500) e fantavalori (`fvm`, base 1000) sono STIME
 * ricostruite dalle guide all'asta pubblicate ad agosto 2026, non i numeri
 * ufficiali del listone Leghe Fantacalcio. Servono a far girare il motore di
 * valutazione da subito, con un ordine di grandezza corretto.
 *
 * Per lavorare sui numeri esatti usa l'import CSV in /listone: sovrascrive
 * questo dataset mantenendo tag, note e valutazioni.
 *
 * Formato riga:
 *   nome|team|ruolo|ruoliMantra|qt|fvm|fascia|fm|gol|assist|presenze|tags|nota
 */
const RAW = `
Svilar|ROM|P|Por|20|130|1|6.5||||titolare,top|Supertop assoluto del reparto: la Roma di Gasperini è la difesa più solida del campionato, ideale per il modificatore.
Carnesecchi|ATA|P|Por|17|100|1|||||titolare,top|Nome da primo slot: posto garantito e con Sarri le difese subiscono pochi gol.
Maignan|MIL|P|Por|16|95|1|||||titolare,top|Tra i migliori della scorsa stagione per fantamedia e clean sheet.
Butez|COM|P|Por|15|88|2|6.2|||36|titolare,top|Miglior portiere 2025/26 per fantamedia (6.2) e recordman di clean sheet: 19.
Di Gregorio|JUV|P|Por|13|62|2|||||titolare,lowcost|Il modo per evitare la guerra su Svilar e Carnesecchi restando su un titolare da prima fascia.
Josep Martinez|INT|P|Por|12|58|2|||||titolare|Nettamente favorito su Provedel dopo l'addio di Sommer: nuovo possibile top del reparto.
Meret|NAP|P|Por|10|42|2|||||ballottaggio|Unica seconda fascia subito a ridosso dei top, ma il ballottaggio con Milinkovic-Savic resta aperto.
Caprile|CAG|P|Por|9|34|3|||||titolare|Top della media fascia: tra i migliori per media voto nell'ultima stagione.
Falcone|LEC|P|Por|8|30|3|||||titolare|Insieme a Caprile il riferimento della media fascia per media voto.
Skorupski|BOL|P|Por|8|28|3|||||titolare|Titolare affidabile in una squadra che concede poco.
Mandas|LAZ|P|Por|7|24|3|||||titolare|
De Gea|FIO|P|Por|9|32|3|||||titolare|
Milinkovic-Savic|NAP|P|Por|8|26|3|||||ballottaggio|Ballottaggio aperto con Meret: attenzione prima di investirci.
Suzuki|PAR|P|Por|6|18|4|||||titolare|
Leali|GEN|P|Por|6|16|4|||||titolare|
Israel|TOR|P|Por|5|14|4|||||ballottaggio|
Okoye|UDI|P|Por|5|14|4|||||ballottaggio|
Muric|SAS|P|Por|4|10|4|||||titolare|
Stankovic|VEN|P|Por|4|10|5|||||titolare,neopromossa,scommessa|Può essere la grande sorpresa tra i pali, specie nelle leghe numerose.
Palmisani|FRO|P|Por|3|8|5|||||titolare,neopromossa|
Lamanna|MON|P|Por|3|8|5|||||titolare,neopromossa|
Provedel|INT|P|Por|3|8|5|||||riserva,rischio|Alle spalle di Josep Martinez: solo terzo portiere di scorta.
Perin|JUV|P|Por|3|8|5|||||riserva|Vice di Di Gregorio: solo terzo portiere di scorta.
Sava|UDI|P|Por|3|8|5|||||riserva|
Paleari|TOR|P|Por|3|8|5|||||riserva|
Dimarco|INT|D|E,Ds|22|190|1|7.5|7|17|34|titolare,top,piazzati|Top assoluto del reparto e record di Serie A: 7 gol e 17 assist. Resta difensore al listone nonostante la stagione monstre.
Bremer|JUV|D|Dc|15|92|1|6.7||||titolare,top|Tra i difensori con la miglior fantamedia della scorsa stagione.
Wesley|ROM|D|E,Dd|14|86|1|||||titolare,bug|Difensore al listone ma esterno a tutti gli effetti nel 3-4-2-1 di Gasperini: garantisce un buon numero di bonus.
Bisseck|INT|D|Dc|13|76|2|6.6||||ballottaggio|Ottima fantamedia, ma Chivu lo alterna con Stones.
Mancini|ROM|D|Dc|12|70|2|||||titolare,piazzati|Uomo da bonus sui piazzati nella difesa più solida del campionato.
Ostigard|GEN|D|Dc|12|68|2|6.6|5||| titolare|Uno dei migliori difensori della scorsa Serie A: 5 gol realizzati.
Cambiaso|JUV|D|E,Ds|12|66|2|||||titolare|Segnalato come uno dei migliori rapporti qualità-prezzo del reparto.
Di Lorenzo|NAP|D|Dd|12|64|2|||||titolare|Ottimo rapporto qualità-prezzo, gioca sempre.
Pavlovic|MIL|D|Dc|11|56|2|||||titolare|Tra i difensori più prolifici in zona gol.
Hermoso|ROM|D|Dc|11|54|2|||||titolare|Con Gasperini è tornato ai livelli visti all'Atletico Madrid: affidabile nella difesa a tre.
Bastoni|INT|D|Dc|11|52|2|||||titolare|
Scalvini|ATA|D|Dc|10|46|3|||||titolare|Ottimo rapporto qualità-prezzo nella difesa di Sarri.
Akanji|INT|D|Dc|9|40|3|||||titolare|
Stones|INT|D|Dc|9|38|3|||||ballottaggio|Arrivato per avere grande spazio, ma Chivu lo alterna con Bisseck.
Ndicka|ROM|D|Dc|9|38|3|||||titolare|
Gabbia|MIL|D|Dc|8|34|3|||||titolare|
Gila|MIL|D|Dc|8|32|3|||||titolare|
Kalulu|JUV|D|Dc,Dd|8|30|3|||||ballottaggio|
Kelly|JUV|D|Dc|7|26|3|||||titolare|
Bellanova|ATA|D|E,Dd|9|38|3|||||ballottaggio|
Zortea|BOL|D|Dd,E|8|30|3|||||titolare|
Miranda|BOL|D|Ds,E|7|26|3|||||titolare|
Spinazzola|NAP|D|Ds,E|8|30|3|||||titolare|
Beukema|NAP|D|Dc|8|28|3|||||titolare|
Rrahmani|NAP|D|Dc|8|28|3|||||titolare|
Dodo|FIO|D|Dd,E|8|30|3|||||titolare|
Nuno Tavares|LAZ|D|Ds,E|7|26|4|||||ballottaggio|
Marusic|LAZ|D|Dd,Dc|6|20|4|||||ballottaggio|
Doekhi|LAZ|D|Dc|6|20|4|||||titolare|
Provstgaard|LAZ|D|Dc|5|14|4|||||titolare|
Bartesaghi|MIL|D|Ds,E|6|20|4|||||titolare|
Hien|ATA|D|Dc|7|24|4|||||titolare|
Kolasinac|ATA|D|Dc|6|18|4|||||ballottaggio|
Ahanor|ATA|D|Ds,Dc|6|18|4|||||ballottaggio|
Zappacosta|ATA|D|E,Dd|6|18|4|||||ballottaggio|
Celik|ROM|D|Dd,E|6|18|4|||||ballottaggio|
Rensch|ROM|D|Dd,E|5|14|4|||||ballottaggio|
Lucumi|BOL|D|Dc|7|24|4|||||titolare|
Heggem|BOL|D|Dc|6|20|4|||||titolare|
Vitik|BOL|D|Dc|5|14|4|||||ballottaggio|
Dragusin|FIO|D|Dc|6|20|4|||||titolare|
Pongracic|FIO|D|Dc|5|16|4|||||ballottaggio|
Viti|FIO|D|Dc|4|12|4|||||ballottaggio|
Fortini|FIO|D|Ds,E|4|12|4|||||ballottaggio|
Jimenez|FIO|D|Ds,E|5|16|4|||||ballottaggio|
Zappa|CAG|D|Dd,E|5|14|4|||||titolare|
Palestra|CAG|D|Dd,E|5|14|4|||||ballottaggio|
Mina|CAG|D|Dc|5|14|4|||||titolare|
Luperto|CAG|D|Dc|4|12|4|||||titolare|
Obert|CAG|D|Dc,Ds|4|10|4|||||titolare|
Vasquez|GEN|D|Dc|5|14|4|||||titolare|
Marcandalli|GEN|D|Dc|4|10|5|||||titolare,lowcost|Tappabuchi ideale insieme a Walukiewicz.
Mitaj|GEN|D|Ds,E|4|10|5|||||titolare,lowcost|Può essere una bella intuizione a pochi crediti.
Norton-Cuffy|GEN|D|Dd,E|5|14|4|||||titolare|
Walukiewicz|SAS|D|Dc,Dd|4|10|5|||||titolare,lowcost|Il tappabuchi ideale: gioca sempre e costa pochissimo.
Muharemovic|SAS|D|Dc|4|10|5|||||titolare|
Idzes|SAS|D|Dc|4|10|5|||||titolare|
Doig|SAS|D|Ds,E|4|12|5|||||titolare|
Coco|TOR|D|Dc|4|12|4|||||titolare|
Maripan|TOR|D|Dc|4|10|5|||||titolare|
Masina|TOR|D|Dc,Ds|3|8|5|||||ballottaggio|
Biraghi|TOR|D|Ds,E|4|12|5|||||titolare|
Pedersen|TOR|D|Dd,E|4|12|5|||||titolare|
Solet|UDI|D|Dc|5|16|4|||||titolare|
Kristensen|UDI|D|Dc,Dd|4|10|5|||||titolare|
Kabasele|UDI|D|Dc|3|8|5|||||titolare|
Zemura|UDI|D|Ds,E|4|12|5|||||titolare|
Zanoli|UDI|D|Dd,E|4|10|5|||||ballottaggio|
Delprato|PAR|D|Dc,Dd|4|12|5|||||titolare|
Circati|PAR|D|Dc|4|10|5|||||titolare|
Valenti|PAR|D|Dc|3|8|5|||||titolare|
Valeri|PAR|D|Ds,E|4|10|5|||||titolare|
Correia|VEN|D|Dd,E|4|12|5|||||titolare,neopromossa,bug,lowcost|Tra i migliori rapporti qualità-prezzo delle neopromosse: difensore al listone ma può giocare da esterno più avanzato.
Sverko|VEN|D|Dc|3|8|5|||||titolare,neopromossa|
Schingtienne|VEN|D|Dc|3|8|5|||||titolare,neopromossa|
Haps|VEN|D|Ds,E|3|8|5|||||titolare,neopromossa|
Bracaglia|FRO|D|Ds,E|4|10|5|||||titolare,neopromossa,lowcost|Indicato come il miglior rapporto qualità-prezzo tra i titolari delle neopromosse.
Monterisi|FRO|D|Dc|3|8|5|||||titolare,neopromossa|
Elphege|FRO|D|Dd,E|3|8|5|||||titolare,neopromossa,lowcost|
Mangas|MON|D|Ds,Dc|3|8|5|||||titolare,neopromossa,lowcost|Difensore consigliato tra i titolari a basso costo.
Birindelli|MON|D|Dd,E|3|8|5|||||titolare,neopromossa,lowcost|Ottimo titolare a basso costo: gioca sempre, spinge sulla fascia e ogni tanto porta a casa un bonus.
Izzo|MON|D|Dc|3|8|5|||||titolare,neopromossa|
Ravanelli|MON|D|Dc|3|8|5|||||titolare,neopromossa|
Carboni|MON|D|E,Ds|3|8|5|||||ballottaggio,neopromossa|
Valle|COM|D|Ds,E|5|16|4|||||titolare|
Kempf|COM|D|Dc|4|10|5|||||ballottaggio|
Diego Carlos|COM|D|Dc|4|10|5|||||titolare|
Smolcic|COM|D|Dd,Dc|3|8|5|||||ballottaggio|
Vojvoda|COM|D|Dd,E|4|10|5|||||ballottaggio|
McTominay|NAP|C|M,C|26|250|1|7.2||||titolare,top|La prima chiamata assoluta del reparto dopo la doppia cifra dello scorso campionato.
Nico Paz|COM|C|T,W|25|240|1|7.2||||titolare,top,piazzati|Andato in doppia cifra: primo slot vero su cui spendere una fetta importante di budget.
Orsolini|BOL|C|W,A|24|228|1|||||titolare,top,rig1,piazzati|Doppia cifra e rigori del Bologna: centrocampista al Classic, W/A al Mantra.
Pulisic|MIL|C|T,A|22|206|1|||||titolare,top,bug|Il bug di listone più citato: centrocampista al Classic ma trequartista nel 3-4-2-1 di Amorim. Con Amorim può tornare vicino alla doppia-doppia.
Calhanoglu|INT|C|M,C|21|188|1|7.5|9|4||titolare,top,rig1,piazzati|Il top del reparto come media voto: 9 gol e 4 assist, rigorista dell'Inter.
De Bruyne|NAP|C|C,T|20|172|2|||||titolare,piazzati,rig2|Rigorista in assenza di Lukaku e uomo assist del Napoli di Allegri.
Rabiot|MIL|C|M,C|17|132|2|||||titolare|Con Allegri era stato il migliore del reparto: 6 gol e 4 assist.
Zaccagni|LAZ|C|W,A|16|126|2|||||titolare,rig1,piazzati|Capitano e rigorista: resta centrocampista al Classic e W/A al Mantra.
Barella|INT|C|M,C|15|112|2|||||titolare|
Jesus Rodriguez|COM|C|W,A|15|110|2|||||titolare,bug|Cambio ruolo del listone: da attaccante a centrocampista. Diventa un jolly di prima fascia.
Soule|ROM|C|T,W|15|110|2|||||titolare,piazzati,rig3|Terza opzione dal dischetto dietro Malen e Dybala.
Samardzic|ATA|C|C,T|14|100|2|||||ballottaggio,rig2,piazzati|Secondo rigorista dell'Atalanta (2/2) e uomo dei piazzati.
Ederson|ATA|C|M,C|13|92|2|||||titolare,rig3|
Pasalic|ATA|C|C,T|12|84|3|||||ballottaggio|Il più classico dei jolly di centrocampo: 3 gol e 3 assist in 31 partite a voto.
Modric|MIL|C|M,C|12|82|3|||||titolare,piazzati|
Saelemaekers|MIL|C|E,W|12|80|3|||||titolare|
Zielinski|INT|C|C,M|10|62|3|||||ballottaggio|
Frattesi|INT|C|M,C|9|52|3|||||riserva|
Luis Henrique|INT|C|E,W|9|50|3|||||ballottaggio|Esterno del 3-5-2 di Chivu: ruolo di listone da verificare.
Sucic|INT|C|M,C|7|36|4|||||ballottaggio|
Yildiz|JUV|C|T,W|24|210|1|||||titolare,top,rig1,piazzati|Sarà decisivo, ma la mancata costanza in zona gol lo tiene fuori dai primissimi slot. Rigorista bianconero.
Alajbegovic|JUV|C|T,W|10|60|3|||||titolare,bug,scommessa|Bug di listone: centrocampista al Classic ma trequartista/esterno offensivo nella Juve di Spalletti.
Locatelli|JUV|C|M|7|32|4|||||ballottaggio|
Douglas Luiz|JUV|C|M,C|7|32|4|||||ballottaggio|
K. Thuram|JUV|C|M|8|38|4|||||titolare|
McKennie|JUV|C|C,M|8|40|4|||||ballottaggio|
Conceicao|JUV|C|W,T|11|70|3|||||ballottaggio|
Rovella|LAZ|C|M|7|32|4|||||titolare,lowcost|Titolare praticamente certo: slot di centrocampo a costo contenuto.
Dele-Bashiru|LAZ|C|M,C|6|26|4|||||ballottaggio|
Taylor|LAZ|C|C,M|6|24|4|||||titolare|
Isaksen|LAZ|C|W,A|9|48|3|||||ballottaggio|
Cancellieri|LAZ|C|W,A|8|40|4|||||ballottaggio|
Lobotka|NAP|C|M|7|32|4|||||titolare|
Anguissa|NAP|C|M,C|9|48|3|||||titolare|
Politano|NAP|C|W,T|11|70|3|||||titolare,piazzati|
Gaetano|ATA|C|C,T|8|40|4|||||titolare,scommessa|Può trasformarsi nella grande intuizione dell'asta: titolare nel centrocampo di Sarri.
L. Ferguson|BOL|C|M,C|9|50|3|||||ballottaggio|
Odgaard|BOL|C|T,C|10|58|3|||||ballottaggio|
Moro|BOL|C|M,C|7|30|4|||||titolare,piazzati,lowcost|Batte anche i piazzati e avrà parecchio spazio dopo l'addio di Freuler.
El Azzouzi|BOL|C|M,C|5|18|5|||||ballottaggio|
Bernardeschi|BOL|C|T,W|10|58|3|||||titolare,rig2,piazzati|Prima alternativa a Orsolini dal dischetto.
Rowe|BOL|C|W,A|11|68|3|||||titolare,bug|Tra i centrocampisti che possono rendere quasi come un attaccante.
Gudmundsson|FIO|C|T,A|13|88|2|||||titolare,piazzati,rig2|
Mastantuono|FIO|C|T,W|12|78|3|||||titolare,scommessa|
Fagioli|FIO|C|C,M|7|30|4|||||ballottaggio|
Mandragora|FIO|C|M,C|6|26|4|||||ballottaggio,piazzati|
Atta|FIO|C|C,M|8|38|4|||||titolare|
Oulai|FIO|C|M|5|16|5|||||titolare|
Cristante|ROM|C|M,C|7|30|4|||||titolare|
Kone|ROM|C|M,C|10|56|3|||||titolare|
El Aynaoui|ROM|C|C,M|6|24|4|||||ballottaggio|
Da Cunha|COM|C|C,M|11|70|3|||||titolare,rig1|Ha scavalcato Nico Paz come primo rigorista del Como.
Addai|COM|C|W,E|8|38|4|||||titolare,bug,scommessa|Esterno offensivo nel 4-2-3-1 di Fabregas ma centrocampista al listone.
Perrone|COM|C|M|5|16|5|||||titolare|
Adopo|CAG|C|M,C|5|18|5|||||titolare,lowcost|Titolare praticamente certo a pochi crediti.
Prati|CAG|C|M|5|16|5|||||titolare|
Folorunsho|CAG|C|C,M|7|30|4|||||ballottaggio|
Deiola|CAG|C|M,C|4|12|5|||||ballottaggio|
Malinovskyi|GEN|C|T,C|10|58|3|||||titolare,rig1,piazzati|Riferimento dal dischetto e sui calci piazzati del Genoa.
Frendrup|GEN|C|M|5|16|5|||||titolare|
Masini|GEN|C|M,C|4|12|5|||||titolare|
Vlasic|TOR|C|T,C|9|46|3|||||titolare,rig1,piazzati|
Casadei|TOR|C|M,C|7|30|4|||||titolare|
Ilic|TOR|C|M,C|5|16|5|||||ballottaggio|
Gineitis|TOR|C|M|4|10|5|||||ballottaggio|
Zaniolo|UDI|C|T,W|10|56|3|||||titolare,rig1|Rendimento discontinuo ma prezzo contenuto: verifica il ruolo esatto sul listone ufficiale.
Ekkelenkamp|UDI|C|C,T|6|24|4|||||titolare|
Karlstrom|UDI|C|M|4|10|5|||||titolare|
Piotrowski|UDI|C|M,C|4|12|5|||||ballottaggio|
Bernabe|PAR|C|C,M|8|38|4|||||titolare,rig2,piazzati|Alternativa a Pellegrino dal dischetto, se dovesse restare.
Ondrejka|PAR|C|W,E|6|24|5|||||titolare,lowcost|Segnalato tra i centrocampisti low cost da bonus.
Oristanio|PAR|C|T,W|6|24|5|||||ballottaggio|
Sorensen|PAR|C|T,C|5|16|5|||||ballottaggio|
Keita|PAR|C|M|4|10|5|||||titolare|
Lipani|SAS|C|M,C|4|12|5|||||titolare,lowcost|Chiamata low cost interessante nel centrocampo neroverde.
Adzic|SAS|C|C,T|5|16|5|||||ballottaggio,scommessa|La classica scommessa da fare all'asta.
Matic|SAS|C|M|4|10|5|||||titolare|
Berisha|LEC|C|C,M|5|16|5|||||titolare,lowcost|Il rientrante del Lecce: nome low cost capace di portare bonus.
Ramadani|LEC|C|M|4|10|5|||||titolare|
Coulibaly|LEC|C|M,C|4|10|5|||||ballottaggio|
Pierotti|LEC|C|W,E|6|22|5|||||titolare,rig2|
Banda|LEC|C|W,A|6|22|5|||||ballottaggio|
Pessina|MON|C|C,M|7|30|4|||||titolare,neopromossa,rig1,piazzati|Capitano e primo rigorista: riferimento assoluto del centrocampo.
Colpani|MON|C|T,W|8|38|4|||||titolare,neopromossa|Agirà con grande libertà tra le linee.
Bianco|MON|C|M|3|8|5|||||titolare,neopromossa|
Keita Balde|MON|C|T,A|5|16|5|||||ballottaggio,neopromossa|Alternativa valida, utilizzabile da trequartista o seconda punta.
Basic|VEN|C|M,C|4|10|5|||||titolare,neopromossa,lowcost|Posto fisso nel centrocampo del Venezia.
Busio|VEN|C|C,M|5|16|5|||||titolare,neopromossa,rig1,piazzati|Primo rigorista del Venezia.
Duncan|VEN|C|M,C|3|8|5|||||titolare,neopromossa|
Calo|FRO|C|M,C|4|12|5|||||titolare,neopromossa,rig1,piazzati,lowcost|Segnalato tra i centrocampisti low cost da bonus, batte i piazzati.
Cichella|FRO|C|M|3|8|5|||||titolare,neopromossa|
Koutsoupias|FRO|C|C,M|3|8|5|||||ballottaggio,neopromossa|
Kvernadze|FRO|C|W,A|4|12|5|||||titolare,neopromossa,scommessa|
Gelli|FRO|C|M,C|3|8|5|||||titolare,neopromossa|
Cacciamani|FRO|C|E,W|3|8|5|||||ballottaggio,neopromossa,lowcost|Citato tra i nomi low cost da bonus.
Lautaro Martinez|INT|A|Pc,A|38|340|1||17|6|30|titolare,top,rig2|Il giocatore più costoso della maggior parte delle aste: capocannoniere con 17 gol e 6 assist in 30 partite.
Malen|ROM|A|A,Pc|33|318|1||14|||titolare,top,rig1|Primo slot per antonomasia insieme a Lautaro: 14 gol e ora anche i rigori della Roma.
M. Thuram|INT|A|Pc,A|31|288|1||13|6||titolare,top|Un gradino sotto i primissimi ma resta primo slot: 13 gol e 6 assist, con meno problemi fisici può migliorare.
Goncalo Ramos|MIL|A|Pc|28|258|1|||||titolare,rig1|Quasi un primissimo slot: al PSG e col Portogallo ha sempre fatto il suo.
Kean|FIO|A|Pc,A|26|218|2||8|1||titolare,rig1|Crollo lo scorso anno (8 gol e 1 assist): non è più tra i 2-3 più cari, ma ci si aspetta il riscatto totale.
Kolo Muani|JUV|A|Pc,A|23|192|2|||||titolare,rig2|Sarà decisivo, ma va evitata l'etichetta di primo slot.
Hojlund|NAP|A|Pc|22|182|2|||||titolare,rig3|
Scamacca|ATA|A|Pc|22|176|2|||||titolare,rig1|Atteso da protagonista totale con Sarri. Perfetto dal dischetto: 3 su 3 lo scorso anno.
Berardi|SAS|A|W,A|20|168|2|||||titolare,rig1,piazzati|Promosso in seconda fascia: è il rigorista principe del Sassuolo.
Dybala|ROM|A|T,A|20|162|2|||||titolare,rig2,piazzati|Promosso in seconda fascia, pronto a ritrovare continuità fisica e bonus.
Leao|MIL|A|A,W|19|156|2|||||titolare|
Lukaku|NAP|A|Pc|17|132|2|||||ballottaggio,rig1|Rigorista quando è in campo: il nodo resta la continuità.
Nkunku|MIL|A|A,T|16|124|2|||||ballottaggio,rig2|Infallibile dal dischetto lo scorso anno, ora in gerarchia con Goncalo Ramos.
Dovbyk|BOL|A|Pc|16|118|3|||||titolare,scommessa|Possibile grande rivelazione del reparto: costa meno della metà di Lautaro e Malen dopo una stagione disastrosa alla Roma.
De Ketelaere|ATA|A|T,A|16|120|2|||||titolare|Scelta sicura tra i top del reparto offensivo dell'Atalanta.
Douvikas|COM|A|Pc|14|100|3|||||titolare,rig2|
Krstovic|ATA|A|Pc|13|92|3|||||ballottaggio|
Raspadori|ATA|A|A,T|12|82|3|||||ballottaggio|Inserito tra i nomi capaci di flirtare con la doppia cifra.
Pinamonti|SAS|A|Pc|12|80|3|||||titolare|Tra gli attaccanti di terza fascia da doppia cifra.
Lauriente|SAS|A|A,W|12|78|3|||||titolare|
Alisson Santos|NAP|A|A,W|12|78|3|||||titolare|Tra i nomi di terza fascia capaci di flirtare con la doppia cifra.
Castro|BOL|A|Pc|11|70|3|||||ballottaggio|
Boga|GEN|A|A,W|10|58|3|||||ballottaggio|
Noslin|LAZ|A|Pc,A|10|56|3|||||ballottaggio|
Colombo|MON|A|Pc|10|56|3|||||titolare,neopromossa|Favorito per affiancare Pessina nel progetto offensivo del Monza.
Pellegrino|PAR|A|Pc|11|66|3|||||titolare,rig1|Primo rigorista del Parma e nome da terza fascia con potenziale doppia cifra.
Esposito S.|CAG|A|A,Pc|10|58|3|||||titolare|
Piccoli|CAG|A|Pc|11|64|3|||||titolare,rig1|
David|JUV|A|Pc,A|13|88|3|||||ballottaggio|
Esposito P.|INT|A|Pc,A|9|48|4|||||riserva|Alle spalle della coppia Lautaro-Thuram, ma le guide citano "gli Esposito" tra i nomi da doppia cifra potenziale.
Lucca|NAP|A|Pc|8|38|4|||||ballottaggio|Alternativa a Hojlund nel centravanti del Napoli di Allegri.
Dia|LAZ|A|Pc,A|8|40|4|||||ballottaggio|
Ratkov|LAZ|A|Pc|7|32|4|||||ballottaggio|
Cutrone|MON|A|Pc|7|30|4|||||ballottaggio,neopromossa,rig2|Secondo rigorista del Monza, pronto in assenza di Pessina.
Dany Mota|MON|A|A,Pc|6|24|4|||||ballottaggio,neopromossa|Leggero vantaggio nelle gerarchie offensive.
Petagna|MON|A|Pc|4|10|5|||||riserva,neopromossa,rig3|Terza scelta dal dischetto.
Stulic|LEC|A|Pc|7|30|4|||||titolare,rig1|Primo rigorista del Lecce.
Adams|TOR|A|Pc,A|9|46|4|||||titolare,rig2|
Ngonge|TOR|A|A,W|7|30|4|||||ballottaggio|
Zapata|TOR|A|Pc|6|22|5|||||riserva,rischio|Rientro da valutare: solo scommessa a fine asta.
Davis|UDI|A|Pc|8|38|4|||||titolare,rig2|
Bravo|UDI|A|A,W|6|22|5|||||ballottaggio|
Vitinha|GEN|A|Pc,A|7|30|4|||||ballottaggio|
Ekuban|GEN|A|Pc|5|16|5|||||ballottaggio|
Luvumbo|CAG|A|A,W|7|30|4|||||ballottaggio|
Yeboah|VEN|A|A,W|5|16|5|||||titolare,neopromossa|
Adorante|VEN|A|Pc|4|12|5|||||titolare,neopromossa|
Ghedjemis|FRO|A|A,W|5|16|5|||||titolare,neopromossa,scommessa|Ha dominato la Serie B lo scorso anno: la scommessa low cost del reparto offensivo.
Raimondo|FRO|A|Pc|4|12|5|||||titolare,neopromossa|
`;

const TEAM_CODES = new Set<string>([
  "ATA", "BOL", "CAG", "COM", "FIO", "FRO", "GEN", "INT", "JUV", "LAZ",
  "LEC", "MIL", "MON", "NAP", "PAR", "ROM", "SAS", "TOR", "UDI", "VEN",
]);

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function num(value: string): number | undefined {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  const parsed = Number(trimmed.replace(",", "."));
  return Number.isFinite(parsed) ? parsed : undefined;
}

function parseRow(row: string): Player | null {
  const parts = row.split("|").map((p) => p.trim());
  if (parts.length < 12) return null;
  const [nome, team, r, rm, qt, fvm, fascia, fm, gol, assist, presenze, tags, nota] =
    parts;
  if (!nome || !TEAM_CODES.has(team)) return null;

  const fasciaNum = Number(fascia);
  return {
    id: `${slugify(nome)}-${team.toLowerCase()}`,
    nome,
    team: team as TeamCode,
    r: r as Ruolo,
    rm: rm.split(",").map((x) => x.trim()).filter(Boolean) as RuoloMantra[],
    qt: num(qt) ?? 1,
    fvm: num(fvm) ?? 1,
    fascia: (fasciaNum >= 1 && fasciaNum <= 5 ? fasciaNum : 5) as 1 | 2 | 3 | 4 | 5,
    fm: num(fm),
    gol: num(gol),
    assist: num(assist),
    presenze: num(presenze),
    tags: tags.split(",").map((x) => x.trim()).filter(Boolean) as PlayerTag[],
    nota: nota || undefined,
  };
}

export const LISTONE: Player[] = RAW.trim()
  .split("\n")
  .map((row) => parseRow(row))
  .filter((p): p is Player => p !== null);

export const ORDINE_RUOLI: Ruolo[] = ["P", "D", "C", "A"];

export const NOME_RUOLO: Record<Ruolo, string> = {
  P: "Portiere",
  D: "Difensore",
  C: "Centrocampista",
  A: "Attaccante",
};

export const COLORE_RUOLO: Record<Ruolo, string> = {
  P: "#f2a516",
  D: "#3ba55d",
  C: "#3b82f6",
  A: "#ef4444",
};

/** Data dell'ultimo aggiornamento manuale del dataset. */
export const LISTONE_AGGIORNATO_AL = "10 agosto 2026";
