let mainMap = null;
 
function init(){
    // Define the map view
    let mainView = new ol.View({
        extent: [3124925,-599644, 3537136, -158022],
        center: [3336467, -385622],
        minZoom: 6,
        maxZoom: 14,
        zoom: 9
    });    
    
    // Initialize the map
    mainMap = new ol.Map({
        controls: [],
        target: 'map', /* Set the target to the ID of the map*/
        view: mainView,
        controls: []
    });
    
    let baseLayer = new ol.layer.Tile({
        name: "base",
        source: new ol.source.TileImage({
            url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
            attributions: ''
        })
    });
    
    mainMap.addLayer(baseLayer);
 
}