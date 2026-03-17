# Analisi Funzionale — Applicazione di Pianificazione Alimentare

> **Versione:** 1.0
> **Data:** 2026-03-15
> **Stato:** Draft

---

## Indice

1. [Visione Generale](#1-visione-generale)
2. [Attori del Sistema](#2-attori-del-sistema)
3. [Mappa delle Funzionalità](#3-mappa-delle-funzionalità)
4. [Flussi di Lavoro (User Journeys)](#4-flussi-di-lavoro-user-journeys)
5. [Modello dei Dati Funzionale](#5-modello-dei-dati-funzionale)
6. [Regole di Business](#6-regole-di-business)

---

## 1. Visione Generale

L'applicazione è un sistema di **pianificazione alimentare settimanale collaborativo**. Consente agli utenti di organizzare i pasti della settimana corrente selezionando ingredienti da un proprio catalogo personale, e di generare automaticamente una lista della spesa aggregata a partire dai menù pianificati.

Il sistema supporta la **collaborazione tra utenti**: due o più persone possono formare una coppia di collaborazione, rendendo possibile la visualizzazione reciproca dei menù e la generazione di una lista della spesa unificata che riassume le necessità di entrambi.

### Obiettivi funzionali principali

- Gestione di un catalogo personale di ingredienti.
- Composizione di un menù settimanale strutturato per giorno e per tipo di pasto.
- Generazione automatica e aggiornata di una lista della spesa derivata dal menù.
- Integrazione di articoli aggiuntivi non pianificati nel menù (articoli fuori menù).
- Gestione della dispensa per calcolare solo ciò che manca realmente.
- Collaborazione tra utenti con condivisione dei menù e aggregazione della spesa.

---

## 2. Attori del Sistema

### 2.1 Utente Autenticato (Proprietario)

L'attore principale del sistema. È un utente registrato e autenticato che ha accesso completo alle proprie funzionalità.

**Permessi:**
- Gestione completa del proprio catalogo ingredienti (creazione, modifica, eliminazione).
- Composizione e modifica del proprio menù settimanale corrente.
- Accesso in lettura e scrittura alla propria lista della spesa.
- Aggiunta, modifica ed eliminazione di articoli fuori menù nella propria lista.
- Aggiornamento delle giacenze di magazzino per ogni articolo.
- Marcatura degli articoli come acquistati.
- Invio e gestione degli inviti di collaborazione.
- Accesso in sola lettura al menù dei propri collaboratori attivi.

### 2.2 Collaboratore

Un utente autenticato che ha stabilito una relazione di collaborazione attiva con l'Utente Proprietario.

**Permessi:**
- Le stesse funzionalità del proprio account (vedi § 2.1).
- La lista della spesa del Collaboratore è aggregata automaticamente con quella dell'Utente Proprietario.
- L'Utente Proprietario può visualizzare il menù del Collaboratore (in sola lettura).

### 2.3 Utente Non Autenticato (Visitatore)

Utente che non ha effettuato l'accesso.

**Permessi:**
- Accesso alla sola schermata di accesso/registrazione.
- Nessun accesso alle funzionalità operative dell'applicazione.

---

## 3. Mappa delle Funzionalità

```
Applicazione di Pianificazione Alimentare
│
├── 3.1 Autenticazione
│   ├── 3.1.1 Registrazione account
│   └── 3.1.2 Accesso (Login) e Uscita (Logout)
│
├── 3.2 Gestione Ingredienti
│   ├── 3.2.1 Visualizzazione del catalogo con filtri e ordinamento
│   ├── 3.2.2 Creazione di un nuovo ingrediente
│   ├── 3.2.3 Modifica di un ingrediente esistente
│   ├── 3.2.4 Eliminazione (logica) di un ingrediente
│   └── 3.2.5 Consultazione delle categorie disponibili
│
├── 3.3 Menù Settimanale
│   ├── 3.3.1 Visualizzazione del menù della settimana corrente
│   ├── 3.3.2 Aggiunta di un ingrediente a un pasto specifico
│   ├── 3.3.3 Modifica della quantità di un articolo nel menù
│   ├── 3.3.4 Rimozione di un articolo dal menù
│   └── 3.3.5 Visualizzazione del menù di un collaboratore (sola lettura)
│
├── 3.4 Lista della Spesa
│   ├── 3.4.1 Visualizzazione della lista aggregata con filtri e ordinamento
│   ├── 3.4.2 Marcatura di un articolo come acquistato / da acquistare
│   ├── 3.4.3 Aggiornamento della quantità in giacenza (magazzino)
│   ├── 3.4.4 Consultazione del riepilogo per collaboratore (breakdown)
│   ├── 3.4.5 Aggiunta di un articolo fuori menù
│   ├── 3.4.6 Modifica di un articolo fuori menù
│   └── 3.4.7 Eliminazione di un articolo fuori menù
│
└── 3.5 Collaborazione
    ├── 3.5.1 Invio di un invito di collaborazione via indirizzo email
    ├── 3.5.2 Visualizzazione inviti ricevuti e inviati
    ├── 3.5.3 Accettazione di un invito ricevuto
    ├── 3.5.4 Rifiuto di un invito ricevuto
    ├── 3.5.5 Revoca di un invito inviato
    └── 3.5.6 Visualizzazione dei collaboratori attivi
```

---

## 4. Flussi di Lavoro (User Journeys)

---

### 4.1 Registrazione e Primo Accesso

**Precondizioni:** L'utente non possiede un account.

| Passo | Attore | Azione | Esito |
|-------|--------|--------|-------|
| 1 | Utente | Apre l'applicazione e seleziona "Registrati". | Viene visualizzato il modulo di registrazione. |
| 2 | Utente | Inserisce indirizzo email e password (min. 8 caratteri, una lettera maiuscola, un carattere speciale e un numero), conferma. | Il sistema valida i dati. |
| 3 | Sistema | Verifica che l'email non sia già registrata. | Se già esistente, viene mostrato un messaggio di errore. |
| 4 | Sistema | Crea il nuovo account e restituisce le credenziali di sessione. | L'utente viene reindirizzato alla schermata principale (Menù). |

---

### 4.2 Composizione del Catalogo Ingredienti

**Precondizioni:** L'utente è autenticato.

| Passo | Attore | Azione | Esito |
|-------|--------|--------|-------|
| 1 | Utente | Accede alla sezione "Ingredienti". | Viene mostrato il catalogo con i filtri. |
| 2 | Utente | Seleziona "Nuovo Ingrediente" e compila il modulo (nome, categoria, unità di misura, quantità predefinita, eventuale restrizione ai tipi di pasto). | Il modulo è pronto per la conferma. |
| 3 | Utente | Conferma la creazione. | Il sistema valida i dati e aggiunge l'ingrediente al catalogo. |
| 4 | Utente | (Opzionale) Modifica un ingrediente esistente dall'elenco. | Il sistema aggiorna le informazioni. |
| 5 | Utente | (Opzionale) Elimina un ingrediente dall'elenco. | Il sistema lo contrassegna come eliminato (non più disponibile per nuovi menù). |

---

### 4.3 Pianificazione del Menù Settimanale

**Precondizioni:** L'utente è autenticato e ha almeno un ingrediente nel catalogo.

| Passo | Attore | Azione | Esito |
|-------|--------|--------|-------|
| 1 | Utente | Accede alla sezione "Menù". | Il sistema carica il menù della settimana corrente. Se non esiste, ne crea uno nuovo copiando automaticamente i pasti della settimana precedente (se disponibile). |
| 2 | Utente | Seleziona un tipo di pasto per un giorno specifico (es. Pranzo di Lunedì). | Viene visualizzato il contenuto del pasto e l'opzione di aggiunta. |
| 3 | Utente | Seleziona un ingrediente dalla lista e conferma l'aggiunta. | Il sistema precompila la quantità e l'unità di misura predefinite dell'ingrediente. L'articolo viene aggiunto al pasto. |
| 4 | Utente | (Opzionale) Modifica la quantità di un articolo già inserito. | Il sistema aggiorna il valore. |
| 5 | Utente | (Opzionale) Rimuove un articolo dal pasto. | L'articolo viene rimosso dal pasto. |

---

### 4.4 Gestione della Lista della Spesa

**Precondizioni:** L'utente è autenticato.

| Passo | Attore | Azione | Esito |
|-------|--------|--------|-------|
| 1 | Utente | Accede alla sezione "Lista della Spesa". | Il sistema aggrega automaticamente tutti gli ingredienti del menù corrente (dell'utente e dei collaboratori attivi) e li visualizza come lista. |
| 2 | Utente | Consulta la lista e, per ogni articolo, visualizza: nome, quantità totale, unità, quantità in giacenza, quantità da acquistare, e il dettaglio per collaboratore. | L'utente ha una visione completa di cosa acquistare. |
| 3 | Utente | Aggiorna la quantità in giacenza per un articolo (es. ha già in casa 200 gr di pasta). | Il sistema ricalcola automaticamente la quantità da acquistare (Totale − Giacenza). |
| 4 | Utente | Spunta un articolo come "acquistato". | L'articolo viene marcato e visivamente distinto dagli articoli ancora da acquistare. |
| 5 | Utente | (Opzionale) Aggiunge un articolo fuori menù (es. detersivo). | Il sistema aggiunge l'articolo alla lista con fonte "Fuori Menù". |
| 6 | Utente | (Opzionale) Modifica o elimina un articolo fuori menù. | Il sistema aggiorna o rimuove l'articolo. |

---

### 4.5 Gestione della Collaborazione

**Precondizioni:** Entrambi gli utenti sono registrati nel sistema.

| Passo | Attore | Azione | Esito |
|-------|--------|--------|-------|
| 1 | Utente A | Accede alla sezione "Collaborazione" e inserisce l'email dell'Utente B per inviare un invito. | Il sistema crea un invito con stato "In attesa". |
| 2 | Utente B | Accede alla sezione "Collaborazione" e visualizza l'invito ricevuto. | Sono disponibili le opzioni "Accetta" e "Rifiuta". |
| 3 | Utente B | Accetta l'invito. | Lo stato diventa "Accettato". La collaborazione è attiva. |
| 4 | Sistema | Aggiorna la lista della spesa di entrambi gli utenti per includere le reciproche voci di menù. | Le liste della spesa mostrano ora un riepilogo aggregato. |
| 5 | Utente A | Accede alla sezione "Collaborazione" e visualizza il collaboratore attivo. | È disponibile il collegamento per visualizzare il menù dell'Utente B. |
| 6 | Utente A | (Opzionale) Revoca l'invito (se ancora "In attesa") o interrompe la collaborazione. | Lo stato viene aggiornato; la collaborazione cessa. |

---

## 5. Modello dei Dati Funzionale

---

### 5.1 Utente

Rappresenta un account registrato nel sistema.

| Attributo | Tipo | Descrizione |
|-----------|------|-------------|
| Identificativo | Codice univoco | Identificatore interno dell'account. |
| Email | Testo | Indirizzo email univoco, usato come nome utente. |
| Credenziale | Testo (cifrato) | Password protetta, non leggibile dal sistema in chiaro. |
| Data creazione | Data/ora | Momento di registrazione dell'account. |

**Relazioni:**
- Un Utente possiede zero o più **Ingredienti**.
- Un Utente possiede zero o un **Menù Settimanale** per ogni settimana.
- Un Utente possiede zero o più **Articoli della Spesa** per ogni settimana.
- Un Utente può avere zero o più **Inviti di Collaborazione** inviati o ricevuti.

---

### 5.2 Ingrediente

Rappresenta un ingrediente presente nel catalogo personale dell'utente.

| Attributo | Tipo | Descrizione |
|-----------|------|-------------|
| Identificativo | Codice univoco | Identificatore interno. |
| Nome | Testo | Nome dell'ingrediente (es. "Pasta", "Latte"). |
| Categoria | Testo (opzionale) | Raggruppamento libero (es. "Latticini", "Cereali"). |
| Unità predefinita | Enumerazione | Grammi (`gr`), Millilitri (`ml`), Pezzi (`unit`). |
| Quantità predefinita | Numero decimale | Quantità suggerita all'inserimento nel menù. |
| Tipi di pasto consentiti | Elenco (opzionale) | Se valorizzato, limita i pasti in cui l'ingrediente può essere inserito. |
| Stato | Logico | Attivo o Eliminato (eliminazione logica, non fisica). |
| Date di sistema | Data/ora | Date di creazione, ultima modifica ed eventuale eliminazione. |

**Valori ammessi per Tipo di Pasto:** Colazione, Spuntino Mattutino, Pranzo, Spuntino Pomeridiano, Cena, Spuntino Serale

---

### 5.3 Menù Settimanale

Rappresenta la pianificazione dei pasti per una settimana specifica di un utente.

| Attributo | Tipo | Descrizione |
|-----------|------|-------------|
| Identificativo | Codice univoco | Identificatore interno. |
| Data inizio settimana | Data | Lunedì della settimana di riferimento. |
| Giorni | Struttura | Collezione di 7 oggetti **Giorno del Menù**. |

---

### 5.4 Giorno del Menù

Rappresenta i pasti di un singolo giorno all'interno di un Menù Settimanale.

| Attributo | Tipo | Descrizione |
|-----------|------|-------------|
| Giorno della settimana | Numero intero | Da 1 (Lunedì) a 7 (Domenica). |
| Pasti | Struttura | Collezione di fino a 6 oggetti **Pasto**. |

---

### 5.5 Pasto

Rappresenta uno specifico tipo di pasto in un giorno del menù.

| Attributo | Tipo | Descrizione |
|-----------|------|-------------|
| Identificativo | Codice univoco | Identificatore interno. |
| Tipo | Enumerazione | Colazione, Spuntino Mattutino, Pranzo, Spuntino Pomeridiano, Cena, Spuntino Serale. |
| Articoli | Struttura | Elenco di **Articoli del Pasto** (ingredienti con quantità). |

---

### 5.6 Articolo del Pasto

Rappresenta un ingrediente inserito in uno specifico pasto del menù.

| Attributo | Tipo | Descrizione |
|-----------|------|-------------|
| Identificativo | Codice univoco | Identificatore interno. |
| Ingrediente | Riferimento | Collegamento all'ingrediente del catalogo. |
| Quantità | Numero decimale | Quantità prevista per quel pasto. |
| Unità di misura | Enumerazione | Grammi, Millilitri, Pezzi. |

---

### 5.7 Articolo della Spesa

Rappresenta una voce nella lista della spesa settimanale. Può provenire dal menù pianificato oppure essere aggiunto manualmente dall'utente.

| Attributo | Tipo | Descrizione |
|-----------|------|-------------|
| Identificativo | Codice univoco | Identificatore interno. |
| Settimana di riferimento | Data | Lunedì della settimana a cui appartiene la voce. |
| Fonte | Enumerazione | `MENU` (derivato dal menù) oppure `FUORI_MENU` (inserito manualmente). |
| Nome | Testo | Nome dell'articolo. |
| Categoria | Testo (opzionale) | Categoria merceologica. |
| Unità di misura | Enumerazione | Grammi, Millilitri, Pezzi. |
| Quantità totale | Numero decimale | Quantità complessiva necessaria (aggregata da tutti i collaboratori). |
| Quantità in giacenza | Numero decimale | Quantità già disponibile in dispensa (default: 0). |
| Tipo di pasto | Testo (opzionale) | Pasto di provenienza, se derivato da menù. |
| Stato acquisto | Logico | `Acquistato` / `Da acquistare` (default: Da acquistare). |
| Riepilogo collaboratori | Struttura | Dettaglio delle quantità suddiviso per utente. |

---

### 5.8 Invito di Collaborazione

Rappresenta una richiesta di collaborazione tra due utenti.

| Attributo | Tipo | Descrizione |
|-----------|------|-------------|
| Identificativo | Codice univoco | Identificatore interno. |
| Mittente | Riferimento | Utente che ha inviato l'invito. |
| Destinatario | Riferimento | Utente che ha ricevuto l'invito. |
| Stato | Enumerazione | `In attesa`, `Accettato`, `Rifiutato`, `Revocato`. |
| Date di sistema | Data/ora | Date di creazione e ultimo aggiornamento. |

---

### 5.9 Schema delle Relazioni Logiche

```
Utente ──< Ingrediente
Utente ──< Menù Settimanale
  Menù Settimanale ──< Giorno del Menù (7 per settimana)
    Giorno del Menù ──< Pasto (max 6 per giorno)
      Pasto ──< Articolo del Pasto >── Ingrediente
Utente ──< Articolo della Spesa
Utente ──< Invito di Collaborazione (mittente)
Utente ──< Invito di Collaborazione (destinatario)
```

---

## 6. Regole di Business

---

### 6.1 Autenticazione e Account

| ID | Regola |
|----|--------|
| RB-AUTH-01 | L'indirizzo email deve essere nel formato valido `nome@dominio.estensione`. |
| RB-AUTH-02 | La password deve contenere almeno 8 caratteri, una lettera maiuscola, un carattere speciale e un numero. Dev'essere possibile recuperarla e modificarla. |
| RB-AUTH-03 | Non è possibile registrare due account con lo stesso indirizzo email. Il sistema segnala l'errore all'utente. |
| RB-AUTH-04 | Ogni richiesta verso le funzionalità operative richiede una sessione attiva e valida. In caso contrario, l'utente è reindirizzato alla schermata di accesso. |

---

### 6.2 Ingredienti

| ID | Regola |
|----|--------|
| RB-ING-01 | Il **nome** dell'ingrediente è obbligatorio e deve contenere almeno 1 carattere. |
| RB-ING-02 | L'**unità di misura predefinita** è obbligatoria. I valori ammessi sono: `gr` (grammi), `ml` (millilitri), `unit` (pezzi). |
| RB-ING-03 | La **quantità predefinita** è obbligatoria e deve essere un numero positivo maggiore di zero. |
| RB-ING-04 | Il campo **tipi di pasto consentiti** è opzionale. Se valorizzato, limita i pasti in cui l'ingrediente può essere selezionato nel menù. I valori ammessi sono: Colazione, Spuntino Mattutino, Pranzo, Spuntino Pomeridiano, Cena, Spuntino Serale. |
| RB-ING-05 | L'eliminazione di un ingrediente è di tipo **logico**: l'ingrediente viene contrassegnato come eliminato ma non rimosso dall'archivio. Gli articoli di menù già esistenti che lo riferiscono rimangono validi. |
| RB-ING-06 | Un ingrediente che è **referenziato in uno o più pasti attivi del menù** non può essere eliminato fisicamente dal sistema. |
| RB-ING-07 | Gli ingredienti eliminati non sono disponibili per l'inserimento in nuovi pasti. |
| RB-ING-08 | Il catalogo ingredienti è **privato**: ogni utente vede e gestisce solo i propri ingredienti. |

---

### 6.3 Menù Settimanale

| ID | Regola |
|----|--------|
| RB-MENU-01 | Il menù è **settimanale** e copre esattamente 7 giorni, dal Lunedì alla Domenica della settimana corrente. Il giorno di inizio settimana è sempre il **Lunedì**, calcolato rispetto al fuso orario `Europa/Roma`. |
| RB-MENU-02 | Ogni settimana può contenere al massimo **6 tipi di pasto per giorno** (Colazione, Spuntino Mattutino, Pranzo, Spuntino Pomeridiano, Cena, Spuntino Serale), per un totale di 42 slot settimanali. |
| RB-MENU-03 | Se non esiste ancora un menù per la settimana corrente, il sistema ne **crea automaticamente uno nuovo**, copiando tutti gli articoli del menù della settimana precedente (se disponibile). |
| RB-MENU-04 | L'utente può operare **solo sul menù della settimana corrente**. Le settimane passate sono accessibili in sola lettura (tramite la lista della spesa). |
| RB-MENU-05 | Al momento dell'inserimento di un ingrediente in un pasto, la **quantità e l'unità di misura predefinite** dell'ingrediente vengono precaricate automaticamente come valori iniziali. |
| RB-MENU-06 | Se un ingrediente ha il campo **tipi di pasto consentiti** valorizzato, esso può essere inserito **solo nei pasti corrispondenti**. Nei pasti non consentiti, l'ingrediente non è selezionabile. |
| RB-MENU-07 | La **quantità** di ogni articolo del pasto deve essere un numero positivo maggiore di zero. |
| RB-MENU-08 | Il menù di un **collaboratore attivo** è visibile in **sola lettura**: l'utente non può modificare i pasti dell'altro. |

---

### 6.4 Lista della Spesa

| ID | Regola |
|----|--------|
| RB-SHOP-01 | La lista della spesa è **generata automaticamente** a partire dagli articoli del menù corrente dell'utente e di tutti i suoi collaboratori attivi. Non richiede compilazione manuale per le voci derivate dal menù. |
| RB-SHOP-02 | Le voci della lista vengono **aggregate per nome e unità di misura**: se lo stesso ingrediente (stesso nome e stessa unità) compare in più pasti o in più collaboratori, le quantità vengono sommate in un'unica riga. |
| RB-SHOP-03 | Per ogni voce aggregata è disponibile un **riepilogo per collaboratore** (breakdown) che mostra la quota di quantità di ciascun utente. |
| RB-SHOP-04 | La **quantità da acquistare** è calcolata come: `Quantità Totale − Quantità in Giacenza`. Se il risultato è ≤ 0, l'articolo è già coperto dalla dispensa. |
| RB-SHOP-05 | La lista viene **sincronizzata automaticamente** al caricamento della pagina: le voci da menù vengono aggiornate per riflettere l'ultimo stato del menù (aggiunte, modifiche, rimozioni). |
| RB-SHOP-06 | Le voci di tipo `MENU` sono **in sola lettura** nella lista della spesa: non possono essere create, modificate o eliminate manualmente. Le modifiche si effettuano agendo sul menù. |
| RB-SHOP-07 | Le voci di tipo `FUORI_MENU` sono **gestite liberamente** dall'utente: possono essere create, modificate ed eliminate direttamente dalla lista della spesa. |
| RB-SHOP-08 | Un **articolo fuori menù** richiede: nome (obbligatorio), unità di misura (obbligatoria, una tra gr/ml/unit) e quantità (obbligatoria, valore positivo maggiore di zero). La categoria è opzionale. |
| RB-SHOP-09 | La **quantità in giacenza** può essere aggiornata per qualsiasi voce (sia da menù che fuori menù). Il valore deve essere ≥ 0. |
| RB-SHOP-10 | Lo **stato di acquisto** (`Acquistato` / `Da acquistare`) può essere modificato per qualsiasi voce. |

---

### 6.5 Collaborazione

| ID | Regola |
|----|--------|
| RB-COL-01 | Per inviare un invito, l'utente deve specificare l'indirizzo email del destinatario. Il destinatario **deve essere un utente registrato** nel sistema. |
| RB-COL-02 | Un utente **non può invitare sé stesso**. |
| RB-COL-03 | Non possono esistere **due inviti in stato "In attesa" tra la stessa coppia di utenti**. Il sistema blocca l'invio di un secondo invito duplicato. |
| RB-COL-04 | Un invito può transitare nei seguenti stati: `In attesa` → `Accettato` (dal destinatario), oppure `In attesa` → `Rifiutato` (dal destinatario), oppure `In attesa` → `Revocato` (dal mittente). |
| RB-COL-05 | Solo il **destinatario** può accettare o rifiutare un invito. Solo il **mittente** può revocare un invito in stato "In attesa". |
| RB-COL-06 | Una collaborazione è **bidirezionale**: entrambi gli utenti ottengono gli stessi benefici di accesso reciproco. |
| RB-COL-07 | I **benefici della collaborazione attiva** includono: (a) visibilità del menù dell'altro utente (in sola lettura), (b) aggregazione automatica delle voci di menù nella lista della spesa di entrambi. |
| RB-COL-08 | Un utente può avere **più collaboratori attivi simultaneamente**. La lista della spesa aggrega le voci di tutti i collaboratori attivi. |

---

### 6.6 Valori Ammessi (Vocabolari Controllati)

#### Tipi di Pasto

| Codice | Etichetta visualizzata |
|--------|------------------------|
| `BREAKFAST` | Colazione |
| `MORNING_SNACK` | Spuntino Mattutino |
| `LUNCH` | Pranzo |
| `AFTERNOON_SNACK` | Spuntino Pomeridiano |
| `DINNER` | Cena |
| `NIGHT_SNACK` | Spuntino Serale |

#### Unità di Misura

| Codice | Etichetta visualizzata |
|--------|------------------------|
| `gr` | Grammi |
| `ml` | Millilitri |
| `unit` | Pezzi |

#### Stati dell'Invito di Collaborazione

| Codice | Descrizione |
|--------|-------------|
| `pending` | In attesa di risposta da parte del destinatario. |
| `accepted` | Invito accettato — collaborazione attiva. |
| `rejected` | Invito rifiutato dal destinatario. |
| `revoked` | Invito revocato dal mittente prima della risposta. |

---

*Fine del documento.*
