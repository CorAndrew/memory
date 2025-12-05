// Array di classi CSS che rappresentano i colori disponibili
const COLOR_CLASSES = [
    'color-0', 'color-1', 'color-2', 'color-3', 'color-4', 
    'color-5', 'color-6', 'color-7', 'color-8'
];

let dimension;              // Numero totale di bottoni
let num;                    // Numero di coppie (dimension / 2)
let coloriAssegnati = [];   // Array che conterrà l'assegnazione finale dei colori
let carteGirate = [];       // Array temporaneo per tenere traccia delle carte girate (massimo 2)
let coppieTrovate = 0;      // Contatore delle coppie trovate
let bloccoClick = false;    // Flag per bloccare i click durante il timeout di controllo

// Funzione principale chiamata dal bottone
function genera() {
    // Legge la difficoltà scelta
    const scelta = document.getElementById('scelta').value;
    const tabellaDiv = document.getElementById('tabella');
    
    // Determina la dimensione in base alla difficoltà
    switch (scelta) {
        case 'f':
            dimension = 16;
            break;
        case 'm':
            dimension = 16;
            break;
        case 'd':
            dimension = 36;
            break;
        default:
            return;
    }
    
    num = dimension / 2;
    coppieTrovate = 0;
    
    // Genera e mischia i colori
    preparaColori();
    
    // Crea la griglia (tabella)
    const dimensioneGriglia = Math.sqrt(dimension);
    tabellaDiv.style.gridTemplateColumns = `repeat(${dimensioneGriglia}, 1fr)`;
    tabellaDiv.innerHTML = ''; // Pulisce il contenuto precedente
    
    for (let i = 0; i < dimension; i++) {
        const button = document.createElement('button');
        button.className = 'card';
        button.dataset.colore = coloriAssegnati[i]; // Assegna l'ID del colore
        button.addEventListener('click', gestisciClick);
        tabellaDiv.appendChild(button);
    }
    
    // Pulisce messaggi precedenti
    document.getElementById('messaggioVittoria').remove();
}

// Prepara l'array con i colori e li mischia
function preparaColori() {
    coloriAssegnati = [];
    
    // Crea le coppie di colori
    for (let i = 0; i < num; i++) {
        // Usa l'indice dell'array COLOR_CLASSES come ID colore
        const coloreId = i % COLOR_CLASSES.length; 
        coloriAssegnati.push(coloreId, coloreId);
    }
    
    // Mischia l'array
    for (let i = coloriAssegnati.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [coloriAssegnati[i], coloriAssegnati[j]] = [coloriAssegnati[j], coloriAssegnati[i]];
    }
}

// Funzione che gestisce il click di una carta
function gestisciClick() {
    if (bloccoClick || this.classList.contains('matched') || this === carteGirate[0]) {
        return; // Ignora se bloccato, già accoppiato, o se è la stessa carta cliccata due volte
    }

    // Mostra il colore
    const coloreId = this.dataset.colore;
    this.classList.add(COLOR_CLASSES[coloreId]);
    
    // Aggiungi la carta all'array delle carte girate
    carteGirate.push(this);
    
    // Controlla se sono state girate due carte
    if (carteGirate.length == 2) {
        bloccoClick = true; // Blocca ulteriori click
        
        const carta1 = carteGirate[0];
        const carta2 = carteGirate[1];
        
        // Verifica la coppia
        if (carta1.dataset.colore === carta2.dataset.colore) {
            
            // Imposta lo stato 'matched'
            carta1.classList.add('matched');
            carta2.classList.add('matched');
            
            // Rimuovi l'event listener per evitare ulteriori interazioni
            carta1.removeEventListener('click', gestisciClick);
            carta2.removeEventListener('click', gestisciClick);
            
            coppieTrovate++;
            
            // Pulisce lo stato per il prossimo turno
            carteGirate = [];
            bloccoClick = false;
            
            // Controlla la vittoria
            if (coppieTrovate === num) {
                vittoria();
            }
            
        } else {
            
            // Dopo 1 secondo, nasconde le carte
            setTimeout(() => {
                // Rimuove la classe colore (tornano nere)
                carta1.classList.remove(COLOR_CLASSES[carta1.dataset.colore]);
                carta2.classList.remove(COLOR_CLASSES[carta2.dataset.colore]);
                
                // Pulisce lo stato per il prossimo turno
                carteGirate = [];
                bloccoClick = false;
            }, 1000);
        }
    }
}

// Funzione che gestisce la schermata di vittoria
function vittoria() {
    const body = document.body;
    
    // Messaggio di vittoria
    const messaggio = document.createElement('p');
    messaggio.id = 'messaggioVittoria';
    messaggio.textContent = "Complimenti! Hai trovato tutte le coppie!";
    
    // Bottone di reset
    const resetButton = document.createElement('button');
    resetButton.textContent = "Nuova Partita";
    resetButton.onclick = resetGame;
    
    body.appendChild(messaggio);
    body.appendChild(resetButton);
}

// Funzione che resetta il gioco
function resetGame() {
    // Pulisce l'area di gioco e il messaggio di vittoria
    document.getElementById('tabella').innerHTML = '';
    const vittoriaElement = document.getElementById('messaggioVittoria');
    if (vittoriaElement) vittoriaElement.remove();
    
    const resetButton = document.querySelector('button[onclick="resetGame()"]');
    if (resetButton) resetButton.remove();
    
    // Resetta lo stato del gioco
    carteGirate = [];
    coppieTrovate = 0;
    bloccoClick = false;
    
    // Riabilita la selezione difficoltà e il bottone 'Genera'
    document.getElementById('scelta').disabled = false;
    document.querySelector('button[onclick="genera()"]').disabled = false;
}