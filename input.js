// Definiere die Anzahl der Reihen und Spalten
var rows = 9;
var cols = 9;

// Wähle das Container-Element aus
var container = document.querySelector('.inputs-container');
// Schleife zur Erstellung des 9x9 Felds
for (var i = 0; i < rows; i++) {
    for (var j = 0; j < cols; j++) {
        var input = document.createElement('input');
        input.type = 'text';
        input.maxLength = 1;
        input.style.width = '20px';
        input.style.height = '20px';
        input.addEventListener('input', moveToNextField); // Eventlistener für Eingabe hinzufügen
        container.appendChild(input);
    }
}

function moveToNextField(event) { // Funktion zum Bewegen zum nächsten Feld
    var target = event.target;
    if (target.value.length === 1) {
        var nextInput = target.nextElementSibling;
        if (nextInput && nextInput.tagName === 'INPUT') {
            nextInput.focus();
        }
    }
}