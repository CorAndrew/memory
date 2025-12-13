// Array di classi CSS che rappresentano le immagini disponibili
const immagini = [
    "immagine0", "immagine1", "immagine2", "immagine3", "immagine4", 
    "immagine5", "immagine6", "immagine7", "immagine8", "immagine9"
];

let dimension;              // Numero totale di bottoni
let num;                    // Numero di coppie (dimension / 2)
let coloriAssegnati = [];   // Array che conterrà l'assegnazione finale dei colori (ID Immagine)
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
            dimension = 36;
            break;
        case 'd':
            dimension = 64;
            break;
        default:
            return;
    }
    
    num = dimension / 2;
    coppieTrovate = 0;
    
    // Genera e mischia gli ID delle immagini
    preparaImmagini();
    
    // Crea la griglia (tabella)
    const dimensioneGriglia = Math.sqrt(dimension);
    tabellaDiv.style.gridTemplateColumns = `repeat(${dimensioneGriglia}, 1fr)`;
    tabellaDiv.innerHTML = ''; // Pulisce il contenuto precedente
    
    for (let i = 0; i < dimension; i++) {
        const button = document.createElement('button');
        button.className = 'card';
        button.dataset.colore = coloriAssegnati[i]; // Assegna l'ID dell'immagine
        button.addEventListener('click', gestisciClick);
        tabellaDiv.appendChild(button);
    }
    
    // Pulisce i messaggi precedenti
    const messaggioVittoria = document.getElementById('messaggioVittoria');
    if (messaggioVittoria) {
        messaggioVittoria.remove();
    }
    const resetButton = document.querySelector('button[onclick="resetGame()"]');
    if (resetButton) {
        resetButton.remove();
    }
}

// Prepara l'array con gli ID delle immagini e li mischia
function preparaImmagini() {
    coloriAssegnati = [];
    
    // Crea le coppie di ID immagine
    for (let i = 0; i < num; i++) {
        // Usa l'indice dell'array immagini come ID immagine
        const coloreId = i % immagini.length; 
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

    // Mostra l'immagine
    const coloreId = this.dataset.colore;
    this.classList.add(immagini[coloreId]);
    
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
                // Rimuove la classe immagine (torna al background:black)
                carta1.classList.remove(immagini[carta1.dataset.colore]);
                carta2.classList.remove(immagini[carta2.dataset.colore]);
                
                // Pulisce lo stato per il prossimo turno
                carteGirate = [];
                bloccoClick = false;
            }, 1000);
        }
    }
}

// Funzione che gestisce la schermata di vittoria
function vittoria() {
    const mainContainer = document.querySelector('body'); // Usa body o un contenitore più specifico
    
    // Messaggio di vittoria
    const messaggio = document.createElement('p');
    messaggio.id = 'messaggioVittoria';
    messaggio.textContent = "Complimenti! Hai trovato tutte le coppie!";
    
    // Bottone di reset
    const resetButton = document.createElement('button');
    resetButton.textContent = "Nuova Partita";
    resetButton.onclick = resetGame;
    
    mainContainer.appendChild(messaggio);
    mainContainer.appendChild(resetButton);
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
}