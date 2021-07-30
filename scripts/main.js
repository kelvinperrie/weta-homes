
var map = null;


function SetupWetahouseLocations(locations) {

    // defines a style for our locations to follow
    const iconStyle = new ol.style.Style({
        image: new ol.style.Icon({
            src: 'images/feature-icon.png',
            scale: 1.5,
        }),
        fill: new ol.style.Fill({ color: [255,0,0,1] }),
        stroke: new ol.style.Stroke({ color: [255,0,0,1] }),
        radius: 5
    }); 

    var features = [];
    for(var i = 0; i < locations.length; i++) {
        var thisLocation = locations[i];
        var newFeature = new ol.Feature({
                        geometry: new ol.geom.Point(ol.proj.fromLonLat(thisLocation.latLong))
                    });
        newFeature.title = thisLocation.title;
        newFeature.description = thisLocation.description;
        newFeature.setStyle(iconStyle);
        features.push(newFeature);
    }

    var layer = new ol.layer.Vector({
        source: new ol.source.Vector({
            features: features
        })
    });
    map.addLayer(layer);
}

function SetupPopupLayer() {
    var container = document.getElementById('popup');
    var content = document.getElementById('popup-content');
    var closer = document.getElementById('popup-closer');

    var overlay = new ol.Overlay({
        element: container,
        autoPan: true,
        autoPanAnimation: {
            duration: 250
        }
    });
    map.addOverlay(overlay);

    // handler for the X on the popup
    closer.onclick = function() {
        overlay.setPosition(undefined);
        closer.blur();
        return false;
    };

    // handler for clicking on the map somewhere
    map.on('singleclick', function (event) {

        console.log("These are the clicked on coordinates:")
        console.log(ol.proj.transform(event.coordinate, 'EPSG:3857', 'EPSG:4326'));

        // if a feature was just clicked on then show a popup with its details, otherwise close existing popup
        if (map.hasFeatureAtPixel(event.pixel) === true) {

            var feature = map.forEachFeatureAtPixel(event.pixel,
                function(feature) {
                    return feature;
            });

            var coordinate = event.coordinate;

            content.innerHTML = feature.description;
            overlay.setPosition(coordinate);
        } else {
            overlay.setPosition(undefined);
            closer.blur();
        }
    });
}

function Initialize() {
    map = new ol.Map({
        target: 'map',
        layers: [
            new ol.layer.Tile({
            source: new ol.source.OSM()
            })
        ],
        view: new ol.View({
            center: ol.proj.fromLonLat([173.95,-39.115]),
            zoom: 16
        })
    });
    SetupWetahouseLocations(houseLocations);
    SetupPopupLayer();
}
Initialize();