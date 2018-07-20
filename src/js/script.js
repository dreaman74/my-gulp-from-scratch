// Importo la classe App
import App from './modules/app.js';

// Creo Oggetto ( Istanza della classe App )
const app = new App();

// alert('Prova');

// Non funziona con 'async' e 'defer'
document.write('<p class="paragrafo">Testo stampato a video utilizzando document.write</p>');

// Funziona con 'async' e 'defer'
// Utilizzare document.createElement()
var paragrafo = document.createElement("p");
var testoParagrafo = document.createTextNode("testo stampato a video utilizzando document.createElement");
paragrafo.appendChild(testoParagrafo); // Aggiunge testo al paragrafo <p>*</p>
paragrafo.setAttribute("class","testo-grande blu");
document.body.appendChild(paragrafo); // Aggiunge il <p> nel <body>