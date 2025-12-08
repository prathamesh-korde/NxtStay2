mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map',
    style:"mapbox://styles/mapbox/streets-v12",
    center: Listing.geometry.coordinates,
    zoom: 9
});


const marker = new mapboxgl.Marker({color:"red"})
    .setLngLat(Listing.geometry.coordinates)
    .setPopup(new mapboxgl.Popup({offset: 25})
    .setHTML(`<h3>${Listing.title}</h3><p>Exact Location will be provided after booking</p>`))
    .addTo(map);


     

// map.on('load', () => {
//         // Load an image from an external URL.
//         map.loadImage(
//             'https://img.freepik.com/premium-vector/red-pin-location_1256222-1037.jpg',
//             (error, image) => {
//                 if (error) throw error;

//                 // Add the image to the map style.
//                 map.addImage('cat', image);

//                 // Add a data source containing one point feature.
//                 map.addSource('point', {
//                     'type': 'geojson',
//                     'data': {
//                         'type': 'FeatureCollection',
//                         'features': [
//                             {
//                                 'type': 'Feature',
//                                 'geometry': {
//                                     'type': 'Point',
//                                     'coordinates':Listing.geometry.coordinates 
//                                 }
//                             }
//                         ]
//                     }
//                 });

//                 // Add a layer to use the image to represent the data.
//                 map.addLayer({
//                     'id': 'points',
//                     'type': 'symbol',
//                     'source': 'point', // reference the data source
//                     'layout': {
//                         'icon-image': 'cat', // reference the image
//                         'icon-size': 0.25
//                     }
//                 });
//             }
//         );

//        map.on('click', 'points', (e) => {
//                 const coordinates = e.features[0].geometry.coordinates.slice();
//                 const title = e.features[0].properties.title;

//                 new mapboxgl.Popup({ offset: 25 })
//                     .setLngLat(coordinates)
//                     .setHTML(`<h3>${Listing.title}</h3><p>Exact Location will be provided after booking</p>`)
//                     .addTo(map);
//             });

//              map.on('mouseenter', 'points', () => {
//                 map.getCanvas().style.cursor = 'pointer';
//             });

//             map.on('mouseleave', 'points', () => {
//                 map.getCanvas().style.cursor = '';
//             });
//     });

