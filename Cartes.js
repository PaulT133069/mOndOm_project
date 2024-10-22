function createElementPlace(place) {
    let placeDiv = document.createElement('div');
    placeDiv.classList.add('place');

    let idText = `Place ${place.id}`;
    let borneText = place.avecBorne ? `Avec Borne (${place.puissance.replace('.', '')})` : 'Sans Borne';
    let détailsSupplémentaires = `Localisation : ${place.localisation}, Modèle approprié : ${place.modèleApproprié}`;

    let statusText = place.libre 
        ? `Libre (${borneText}) - ${détailsSupplémentaires}`
        : `Occupée (${borneText} - ${détailsSupplémentaires}) ${place.heureFin ? `jusqu'à ${place.heureFin.toLocaleTimeString()}` : ''}`;

    let iconeBorne = place.avecBorne ? '<i class="fas fa-charging-station"></i>' : '<i class="fas fa-car"></i>';
    let iconeStatut = place.libre ? '<i class="fas fa-parking"></i>' : '<i class="fas fa-ban"></i>';
    
    placeDiv.innerHTML = `${iconeStatut} ${idText} - ${statusText} ${iconeBorne}`;

    placeDiv.style.backgroundColor = place.libre ? 'lightgreen' : 'lightgoldenrodyellow';

    let button = document.createElement('button');
    button.textContent = place.libre ? 'Réserver' : 'Libérer';
    button.addEventListener('click', () => place.libre ? préparerRéservation(place) : libérerPlace(place.id));
    placeDiv.appendChild(button);

    return placeDiv;
}

afficherParking(); 

function afficherParking() {
    const parking = initialiserParking();
    const parkingDiv = document.getElementById('parking'); 
    parkingDiv.innerHTML = '';  

    const searchText = document.getElementById('search').value.toLowerCase();

    parking.forEach(place => {
        if (place.id.toString().includes(searchText)) {
            const placeDiv = createElementPlace(place);
            parkingDiv.appendChild(placeDiv);
        }
    });
}

document.getElementById('search').addEventListener('input', afficherParking);

afficherParking();