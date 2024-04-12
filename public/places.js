let markers = [];

const addPlace = async () => {
    const label = document.querySelector("#label").value;
    const address = document.querySelector("#address").value;
    await axios.put('/places', { label: label, address: address });
    await loadPlaces();
}

const deletePlace = async (id) => {
    await axios.delete(`/places/${id}`);
    await loadPlaces();
}

const loadPlaces = async () => {
    const response = await axios.get('/places');
    console.log(`response: ${JSON.stringify(response)}`);
    const tbody = document.querySelector('tbody');
    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }
    for (var i = 0; i < markers.length; i++){
        map.removeLayer(markers[i]);
    }

    const on_row_click = (e) => {
        console.log(`e.target: ${e.target}`);
        let row = e.target;
        if (e.target.tagName.toUpperCase() === 'TD'){ 
            row = e.target.parentNode; 
            const lat = row.dataset.lat;
            const lng = row.dataset.lng;
            map.flyTo(new L.LatLng(lat, lng));
        }
    }

    if (response && response.data && response.data.places) {
        for (const place of response.data.places) {
            console.log(`place: ${JSON.stringify(place)}`);
            marker = L.marker([place.lat, place.lng]).addTo(map).bindPopup(`<b>${place.label}</b><br/>${place.address}`);
            markers.push(marker);
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${place.label}</td>
                <td>${place.address}</td>
                <td>
                    <button class='btn btn-danger' onclick='deletePlace(${place.id})'>Delete</button>
                </td>
            `;
            tr.dataset.lat = place.lat;
            tr.dataset.lng = place.lng;
            tr.onclick = on_row_click;
            tbody.appendChild(tr);
        }
    }
}