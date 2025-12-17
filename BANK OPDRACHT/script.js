    


//inlog systeem


/*
Dit is een basis inlog-systeem dat checkt of je gegevens kloppen en je dan doorverwijst.

Bewaard 3 testgebruikers in een array met gebruikersnamen en wachtwoorden
Controleert bij inloggen of de ingevoerde gebruikersnaam en wachtwoord overeenkomen met een van de gebruikers
Bij succes: toont een groene melding en stuurt de gebruiker na 1 seconde door naar dashboard.html
Bij fout: toont een rode foutmelding dat de inloggegevens ongeldig zijn

*/


// Vooraf ingestelde gebruikers (in productie: gebruik een backend met gehashte wachtwoorden)
const users = [
    { username: 'gebruiker1', password: 'Abc!' },
    { username: 'gebruiker2', password: 'Def!' },
    { username: 'gebruiker3', password: 'Ghi!' }
];

// Login functie
function login() {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const notification = document.getElementById('notification');

    // Trim whitespace van inputs
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    // Reset notificatie
    notification.textContent = '';

    // Validatie: check of velden niet leeg zijn
    if (!username || !password) {
        showNotification(notification, 'Vul alle velden in.', 'red');
        return;
    }

    // Validatie van de gebruikersinvoer
    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
        showNotification(notification, 'Inloggen succesvol!', 'green');
        
        // Disable login button om dubbele submits te voorkomen
        const loginButton = document.querySelector('button');
        if (loginButton) loginButton.disabled = true;

        // Gebruiker doorsturen naar dashboard
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
    } else {
        showNotification(notification, 'Ongeldige gebruikersnaam of wachtwoord.', 'red');
        
        // Clear password veld na mislukte poging (security best practice)
        passwordInput.value = '';
        passwordInput.focus();
    }
}

// Helper functie voor notificaties
function showNotification(element, message, color) {
    element.style.color = color;
    element.textContent = message;
}

// Event listener voor Enter-toets
document.addEventListener('DOMContentLoaded', function() {
    const passwordInput = document.getElementById('password');
    const usernameInput = document.getElementById('username');
    
    // Login bij Enter in beide velden
    if (passwordInput) {
        passwordInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                login();
            }
        });
    }
    
    if (usernameInput) {
        usernameInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                login();
            }
        });
    }
});
//===================================================================================================================

//rekeningen


let rekeningen = [
    { naam: "Betaalrekening", saldo: 1250.55 },
    { naam: "Spaarrekening", saldo: 3200.00 }
];

document.addEventListener("DOMContentLoaded", () => {
    laadRekeningen();

    const form = document.getElementById("rekening-form");
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        nieuweRekening();
    });
});

// Laat alle rekeningen zien
function laadRekeningen() {
    const lijst = document.getElementById("rekening-lijst");
    lijst.innerHTML = "";

    rekeningen.forEach((rekening, index) => {
        const div = document.createElement("div");
        div.className = "rekening-card";

        div.innerHTML = `
            <h4>${rekening.naam}</h4>
            <p>Saldo: € ${rekening.saldo.toFixed(2)}</p>
            <button onclick="verwijderRekening(${index})">Verwijderen</button>
        `;

        lijst.appendChild(div);
    });
}

// Maak een nieuwe rekening
function nieuweRekening() {
    const naam = document.getElementById("rekeningnaam").value.trim();
    const saldo = Number(document.getElementById("rekeningsaldo").value);

    if (!naam || isNaN(saldo)) return;

    rekeningen.push({ naam, saldo });

    document.getElementById("rekeningnaam").value = "";
    document.getElementById("rekeningsaldo").value = "";

    laadRekeningen();
}

// Verwijder een rekening
function verwijderRekening(index) {
    rekeningen.splice(index, 1);
    laadRekeningen();
}


// ==============================================================================
// Overschrijvingen tussen rekeningen


// Functie om de dropdowns te vullen met alle rekeningen
function updateDropdowns() {
    // Haal de dropdown elementen op
    const vanDropdown = document.getElementById("van-rekening");
    const naarDropdown = document.getElementById("naar-rekening");

    if (!vanDropdown || !naarDropdown) return;

    // Maak de dropdowns leeg voordat we nieuwe opties toevoegen
    vanDropdown.innerHTML = "";
    naarDropdown.innerHTML = "";

    // Voeg elke rekening toe aan beide dropdowns
    rekeningen.forEach((rekening, index) => {
        // Dropdown "van"
        const optieVan = new Option(
            `${rekening.naam} (€${rekening.saldo.toFixed(2)})`,
            index
        );
        vanDropdown.add(optieVan);

        // Dropdown "naar"
        const optieNaar = new Option(rekening.naam, index);
        naarDropdown.add(optieNaar);
    });
}

// Functie om een overschrijving uit te voeren
function overschrijven() {
    const vanIndex = Number(document.getElementById("van-rekening").value);
    const naarIndex = Number(document.getElementById("naar-rekening").value);
    const bedrag = Number(document.getElementById("bedrag").value);
    const notificatie = document.getElementById("overschrijving-notificatie");

    // Maak eerdere notificatie leeg
    notificatie.textContent = "";

    // Helperfunctie om een foutmelding te tonen
    function toonFout(bericht) {
        notificatie.style.color = "red";
        notificatie.textContent = bericht;
    }

    // Helperfunctie om een succesmelding te tonen
    function toonSucces(bericht) {
        notificatie.style.color = "green";
        notificatie.textContent = bericht;
    }

    // Controleer of dezelfde rekening is gekozen
    if (vanIndex === naarIndex) {
        return toonFout("Je kunt niet naar dezelfde rekening overschrijven!");
    }

    // Controleer of het bedrag geldig is
    if (isNaN(bedrag) || bedrag <= 0) {
        return toonFout("Voer een geldig bedrag in.");
    }

    // Controleer of er genoeg saldo is
    if (bedrag > rekeningen[vanIndex].saldo) {
        return toonFout("Niet genoeg op saldo!");
    }

    // Voer de overschrijving uit
    rekeningen[vanIndex].saldo -= bedrag;
    rekeningen[naarIndex].saldo += bedrag;

    // Update de dropdowns zodat de nieuwe saldi zichtbaar zijn
    updateDropdowns();

    // Maak het bedrag-veld leeg
    document.getElementById("bedrag").value = "";

    // Toon succesmelding
    toonSucces(
        `€${bedrag.toFixed(2)} is succesvol overgeschreven van ${rekeningen[vanIndex].naam} naar ${rekeningen[naarIndex].naam}.`
    );
}

// Event listener: zodra de pagina geladen is
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("overschrijving-form");
    if (form) {
        // Vul de dropdowns bij het laden van de pagina
        updateDropdowns();

        // Voeg een submit-event toe aan het formulier
        form.addEventListener("submit", (e) => {
            e.preventDefault(); // voorkom dat de pagina opnieuw laadt
            overschrijven();
        });
    }
});
