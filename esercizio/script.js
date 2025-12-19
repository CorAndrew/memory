// Elenco delle classi CSS disponibili
const immagini = [
    'immagine0', 'immagine1', 'immagine2', 'immagine3', 'immagine4', 
    'immagine5', 'immagine6', 'immagine7', 'immagine8', 'immagine9'
];

let dimensione;              // Numero totale di bottoni
let num;                    // Numero di coppie
let matriceGioco = [];      // matrice che conterrà gli ID delle immagini
let carteGirate = [];       
let coppieTrovate = 0;      
let bloccoClick = false;    

function genera() {
    const scelta = document.getElementById('scelta').value;
    const tabellaDiv = document.getElementById('tabella');
    
    switch (scelta) {
        case 'f': dimensione = 16; break;
        case 'm': dimensione = 36; break;
        case 'd': dimensione = 64; break;
        default: return;
    }
    
    num = dimensione / 2;
    coppieTrovate = 0;
    
    // Preparazione della matrice
    preparaMatrice();
    
    // Creazione della griglia
    const dimensioneGriglia = Math.sqrt(dimensione); // Es: 4 per la difficoltà 'f'
    tabellaDiv.style.gridTemplateColumns = `repeat(${dimensioneGriglia}, 1fr)`;
    tabellaDiv.innerHTML = ''; 
    
    for (let i = 0; i < dimensioneGriglia; i++) {
        for (let j = 0; j < dimensioneGriglia; j++) {
            const button = document.createElement('button');
            button.className = 'card';
            
            // Assegnazione del valore prendendolo dalla matrice [riga][colonna]
            const immagineId = matriceGioco[i][j];
            button.dataset.colore = immagineId; 
            button.addEventListener('click', gestisciClick);
            tabellaDiv.appendChild(button);
        }
    }
    
    puliziaMessaggi();
}

function preparaMatrice() {
    const lato = Math.sqrt(dimensione);
    matriceGioco = []; // Reset della matrice
    
    // Creiamo prima un array normale con le coppie
    let arrayTemporaneo = [];
    for (let i = 0; i < num; i++) {
        const idImmagine = i % immagini.length;
        arrayTemporaneo.push(idImmagine, idImmagine);
    }
    
    // Mischiamo l'array normale
    for (let i = arrayTemporaneo.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arrayTemporaneo[i], arrayTemporaneo[j]] = [arrayTemporaneo[j], arrayTemporaneo[i]];
    }
    
    // Trasformazione dell' array temporaneo in matrice
    let index = 0;
    for (let i = 0; i < lato; i++) {
        matriceGioco[i] = []; // Iniziallizzazione della riga
        for (let j = 0; j < lato; j++) {
            matriceGioco[i][j] = arrayTemporaneo[index];
            index++;
        }
    }
}

function gestisciClick() {
    if (bloccoClick || this.classList.contains('matched') || this === carteGirate[0]) {
        return;
    }

    const immagineId = this.dataset.colore;
    // Si usa l'ID per recuperare il nome della classe dall'array delle classi
    this.classList.add(immagini[immagineId]);
    carteGirate.push(this);
    
    if (carteGirate.length == 2) {
        bloccoClick = true;
        const carta1 = carteGirate[0];
        const carta2 = carteGirate[1];
        
        if (carta1.dataset.colore === carta2.dataset.colore) {
            carta1.classList.add('matched');
            carta2.classList.add('matched');
            coppieTrovate++;
            carteGirate = [];
            bloccoClick = false;
            if (coppieTrovate === num) vittoria();
        } else {
            setTimeout(() => {
                carta1.classList.remove(immagini[carta1.dataset.colore]);
                carta2.classList.remove(immagini[carta2.dataset.colore]);
                carteGirate = [];
                bloccoClick = false;
            }, 1000);
        }
    }
}

function vittoria() {
    const messaggio = document.createElement('p');
    messaggio.id = 'messaggioVittoria';
    messaggio.textContent = "HAI VINTO";
    const resetButton = document.createElement('button');
    resetButton.textContent = "Nuova Partita";
    resetButton.onclick = resetGame;
    document.body.appendChild(messaggio);
    document.body.appendChild(resetButton);
}

function resetGame() {
    document.getElementById('tabella').innerHTML = '';
    document.getElementById("messaggioVittoria").innerHTML= "";
    carteGirate = [];
    coppieTrovate = 0;
    bloccoClick = false;
}