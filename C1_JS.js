let parkingState = [];
function initialiserParking() {
    if (parkingState.length === 0) {
        parkingState = [
            { id: 1, libre: true, avecBorne: true, puissance: "11 kW", localisation: "Niveau 0", modèleApproprié: "Citadine" },
            { id: 2, libre: true, avecBorne: true, puissance: "11 kW", localisation: "Niveau 0", modèleApproprié: "Citadine" },
            { id: 3, libre: true, avecBorne: false, localisation: "Niveau -1", modèleApproprié: "SUV" },
            { id: 4, libre: true, avecBorne: true, puissance: "22 kW", localisation: "Niveau -1", modèleApproprié: "Citadine" },
            { id: 5, libre: true, avecBorne: true, puissance: "22 kW", localisation: "Niveau -1", modèleApproprié: "SUV" },
            { id: 6, libre: true, avecBorne: false, localisation: "Niveau -2", modèleApproprié: "Citadine" },
            { id: 7, libre: true, avecBorne: true, puissance: "22 kW", localisation: "Niveau -2", modèleApproprié: "SUV" },
            { id: 8, libre: true, avecBorne: true, puissance: "22 kW", localisation: "Niveau -2", modèleApproprié: "SUV" },
        ];
    }
    return parkingState;
}

function createElementPlace(place) {
    let placeDiv = document.createElement('div');
    placeDiv.classList.add('place');
    let borneText = place.avecBorne ? `Avec Borne (${place.puissance})` : 'Sans Borne';
    let détailsSupplémentaires = `Localisation : ${place.localisation}, Modèle approprié : ${place.modèleApproprié}`;

    let statusText = place.libre 
        ? `Libre (${borneText}) - ${détailsSupplémentaires}`
        : `Occupée (${borneText} - ${détailsSupplémentaires}) ${place.heureFin ? `jusqu'à ${place.heureFin.toLocaleTimeString()}` : ''}`;

    placeDiv.textContent = `Place ${place.id} - ${statusText}`;
    placeDiv.style.backgroundColor = place.libre ? 'lightgreen' : 'lightgoldenrodyellow';

    let button = document.createElement('button');
    button.textContent = place.libre ? 'Réserver' : 'Libérer';
    button.addEventListener('click', () => place.libre ? préparerRéservation(place) : libérerPlace(place.id));
    placeDiv.appendChild(button);

    return placeDiv;
}

function préparerRéservation(place) {
    Swal.fire({
        title: 'Durée de la réservation',
        input: 'number',
        inputValue: 5,
        inputAttributes: {
            min: 5,
            max: 240, // Maximum de 4 heures
            step: 5
        },
        showCancelButton: true,
        confirmButtonText: 'Réserver',
        cancelButtonText: 'Annuler',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        position: 'middle-center',
        icon: 'info',
        iconColor: 'lightgreen',
        inputValidator: (value) => {
            const minutes = parseInt(value);
            if (!minutes || minutes <= 0) {
                return 'Veuillez entrer une durée valide.';
            }
            if (minutes < 60 && minutes % 5 !== 0) {
                return 'Durée < 1h : multiple de 5 min.';
            } else if (minutes >= 60 && minutes % 15 !== 0) {
                return 'Durée ≥ 1h : multiple de 15 min.';
            }
            return null;
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const durationInMinutes = parseInt(result.value);
            confirmerRéservation(place.id, durationInMinutes);
        }
    });
}
    
    function confirmerRéservation(placeId, durée) {
        const duréeFormatée = durée >= 60 
            ? `${Math.floor(durée / 60)}h${durée % 60 ? (durée % 60 + 'min') : ''}`
            : `${durée} min`;
    
        Swal.fire({
            title: 'Confirmer la réservation',
            text: `Voulez-vous réserver la place ${placeId} pour ${duréeFormatée} ?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Confirmer',
            cancelButtonText: 'Annuler'
        }).then((result) => {
            if (result.isConfirmed) {
                réserverPlace(placeId, durée);
                Swal.fire('Réservé !', `Place ${placeId} réservée pour ${durée} minutes.`, 'success');
            } else {
                préparerRéservation({ id: placeId }); 
            }
        });
}
    
  function réserverPlace(id, duréeMinutes) {
    const place = parkingState.find(p => p.id === id);
    if (place && place.libre) {
        place.libre = false;
        const heureFin = new Date();
        heureFin.setMinutes(heureFin.getMinutes() + duréeMinutes);
        place.heureFin = heureFin;

        afficherParking();

        setTimeout(() => {
            libérerPlace(id);
            alert(`La réservation de la place ${id} a expiré`);
        }, duréeMinutes * 60 * 1000);
    } else {
        alert('La place est déjà occupée');
    }
}

function libérerPlace(id) {
    const place = parkingState.find(p => p.id === id);
    if (place && !place.libre) {
        place.libre = true;
        place.heureFin = null;
        afficherParking();
    } else {
        alert('La place est déjà libre');
    }
}

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