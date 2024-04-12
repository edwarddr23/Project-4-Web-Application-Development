const { json } = require('body-parser');
const express = require('express');
const router = express.Router();
const geo = require('node-geocoder');
const geocoder = geo({ provider: 'openstreetmap' });

let markers = [];

router.get('/', async (req, res) => {
    const places = await req.db.findPlaces();
    res.json({ places: places });
});

router.put('/', async (req, res) => {
    const results = await geocoder.geocode(req.body.address);
    let final_result;
    if (results.length > 0) {
        console.log(`Multiple results found for ${req.body.address}:`);
        if(results.length > 1){
            for(result of results) {
                // console.log(`result: ${JSON.stringify(result)}`)
                console.log(`${result.latitude}/${result.longitude}`)
            }
        }
        else{
            console.log(`results: ${results}`);
            console.log(`The location of this is ${results[0].latitude}/${results[0].longitude}`);
        }
        final_result = results[0];
        final_result = {
            ...final_result,
            label: req.body.label
        }
        // console.log(`final_result: ${JSON.stringify(final_result)}`)
    }
    if (results.length === 0){
        console.log(`No results found for address: ${req.body.address}`);
        final_result = {
            label: req.body.label,
            formattedAddress: '',
            latitude: 0,
            longitude: 0
        }
    }
    console.log(`final_result: ${JSON.stringify(final_result)}`)
    const id = await req.db.createPlace(final_result.label, final_result.formattedAddress, final_result.latitude, final_result.longitude);
    res.json({ id: id, label: final_result.label, address: final_result.formattedAddress, lat: final_result.latitude, lng: final_result.longitude });
});

router.delete('/:id', async (req, res) => {
    await req.db.deletePlace(req.params.id);
    res.status(200).send();
})

module.exports = router;