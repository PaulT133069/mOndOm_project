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
        } else {
            préparerRéservation({ id: placeId }); // Retour au premier pop-up si annulé
        }
    });
}

function réserverPlace(placeId, durée) {
    // Votre logique de réservation ici
    Swal.fire('Réservé !', `Place ${placeId} réservée pour ${durée} minutes.`, 'success');
}