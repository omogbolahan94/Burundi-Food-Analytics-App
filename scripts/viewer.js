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
    // target property: HTML container with id='map'
    mainMap = new ol.Map({
        controls: [],
        target: 'map', 
        view: mainView,
        controls: []
    });
    
    let baseLayer = getBaseMap("osm");
    
    mainMap.addLayer(baseLayer);
 
}


function getBaseMap(name){
    let baseMaps = {
        "osm": {
            url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
            attributions: ''
        },
        "otm": {
            url: 'https://b.tile.opentopomap.org/{z}/{x}/{y}.png',
            attributions: 'Kartendaten: © OpenStreetMap-Mitwirkende, SRTM | Kartendarstellung: © OpenTopoMap (CC-BY-SA)'
        },
        "esri_wtm": {
            url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
            attributions: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
        },
        "esri_natgeo": {
            url: 'https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}',
            attributions: 'Tiles &copy; Esri &mdash; National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC'
        },
        "own": {
            url: 'b_tiles/{z}/{x}/{y}.png'    
        }
    }
 
    layer = baseMaps[name];
    if (layer === undefined) {
        layer = baseMaps["osm"]
    }
 
    return (
        new ol.layer.Tile({
            name: "base",
            source: new ol.source.TileImage(layer)
        })
    )
}


// hide element with the .panel class selector
function hidePanels(){
    $(".panel").hide();
}
 

// id is the id of the html element to hide or show based on onclick event listener 
// that call this function on the basemap navbar button
function showPanel(id){
    hidePanels();
    $("#" + id).show();
}
 

// This jQuery snippet that defines an event handler that hides a .card element 
// when a .close-icon inside it is clicked.
$('.close-icon').on('click',function() {
    $(this).closest('.card').fadeOut();
})

function removeLayerByName(map, layer_name){
    let layerToRemove = null;
    map.getLayers().forEach(function (layer) {
        if (layer.get('name') != undefined && layer.get('name') === layer_name) {
            layerToRemove = layer;
        }
    });
 
    map.removeLayer(layerToRemove);
}
 
$("input[name=basemap]").click(function(evt){
    removeLayerByName(mainMap, "base");
    let baseLayer = getBaseMap(evt.target.value);
    mainMap.addLayer(baseLayer);    
})