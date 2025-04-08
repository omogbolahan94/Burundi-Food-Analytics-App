let mainMap = null;

// keep the id of an activated textbox that is detected 
let currentElement = "";
 
$("input[type=textbox]").focus(function() {
    currentElement = $(this).attr("id");
});
 
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

    // event listener that detects click on the map
    // extract the coordinates from the event listener if there is a clicekd point on map
    mainMap.on('click', function(evt) {
        let val = evt.coordinate[0].toString() + "," + evt.coordinate[1].toString();
        if (currentElement != ""){
            $("#" + currentElement).val(val); // If a textbox is selected, the coordinates are displayed on it.
        }
    })
 
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


// hide element with the .panel and .alert class selector
function hidePanels(){
    $(".panel").hide();
    $(".alert").hide();
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