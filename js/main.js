// 1. Create a map object.
var mymap = L.map('map', {
    //center: [44.13, -119.93],
    center: [38.987682, -97.125537],
    zoom: 4.5,
    maxZoom: 10,
    minZoom: 3,
    detectRetina: true});

// 2. Add a base map.
L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png').addTo(mymap);

// 3. Add cell towers GeoJSON Data
// Null variable that will hold cell tower data
var airports = null;
var state = null;

// 4. build up a set of colors from colorbrewer's Set1 category
var colors = chroma.scale('Set1').mode('lch').colors(9);

// 5. dynamically append style classes to this page. This style classes will be used for colorize the markers.
for (i = 0; i < 9; i++) {
    $('head').append($("<style> .marker-color-" + (i + 1).toString() + " { color: " + colors[i] + "; font-size: 15px; text-shadow: 0 0 3px #ffffff;} </style>"));
}


// Get GeoJSON and put on it on the map when it loads
airports= L.geoJson.ajax("assets/airports.geojson", {
    // assign a function to the onEachFeature parameter of the airports object.
    // Then each (point) feature will bind a popup window.
    // The content of the popup window is the value of `feature.properties.company`
    onEachFeature: function (feature, layer) {
          if(feature.properties.CNTL_TWR == 'Y') {
            layer.bindPopup("<b>Airport Name: </b>"+
            feature.properties.AIRPT_NAME+
            "<br/><b>City: </b>"+feature.properties.CITY+
            "<br/><b>State: </b>"+feature.properties.STATE+
            "<br/><b>Has an air traffic control tower: </b> Yes")
          } else {
            layer.bindPopup("<b>Airport Name: </b>"+
            feature.properties.AIRPT_NAME+
            "<br/><b>City: </b>"+feature.properties.CITY+
            "<br/><b>State: </b>"+feature.properties.STATE+
            "<br/><b>Has an air traffic control tower: </b> No")
          }
        },
    pointToLayer: function (feature, latlng) {
        if (feature.properties.CNTL_TWR == "N") {
          return L.marker(latlng, {icon: L.divIcon({className: 'fa fa-times-circle marker-color-1'})}) ;
        }else {
          return L.marker(latlng, {icon: L.divIcon({className: 'fa fa-rss marker-color-2'})});
        } // "Salem Cellular"
    },
    attribution: 'Airports Data &copy; Data.Gov | US-States &copy; Mike Bostock of D3 | Base Map &copy; CartoDB | Made By Yihang Sun'
}).addTo(mymap);


// 6. Set function for color ramp
colors = chroma.scale('OrRd').colors(5); //colors = chroma.scale('RdPu').colors(5);

function setColor(count) {
    var id = 0;
    if (count > 20) { id = 4; }
    else if (count > 15 && count <= 20) { id = 3; }
    else if (count > 9 && count <= 15) { id = 2; }
    else if (count > 4 &&  count <= 9) { id = 1; }
    else  { id = 0; }
    return colors[id];
}

// 7. Set style function that sets fill color.md property equal to cell tower count
function style(feature) {
    return {
        fillColor: setColor(feature.properties.count),
        fillOpacity: 0.4,
        weight: 2,
        opacity: 1,
        color: '#b4b4b4',
        dashArray: '4'
    };
}

// 8. Add county polygons
// create states variable, and assign null to it.
var states = null;
states = L.geoJson.ajax("assets/us-states.geojson", {
    style: style,
    onEachFeature: function (feature, layer) {
          layer.bindPopup(feature.properties.name+" has "+feature.properties.count+" airports.")
    },
    pointToLayer: function(feature, latlng){
      return L.marker(latlng);
    }
}).addTo(mymap);

// 9. Create Leaflet Control Object for Legend
var legend = L.control({position: 'topright'});

// 10. Function that runs when legend is added to map
legend.onAdd = function () {

    // Create Div Element and Populate it with HTML
    var div = L.DomUtil.create('div', 'legend');
    div.innerHTML += '<b># Airports</b><br />';
    div.innerHTML += '<i style="background: ' + colors[4] + '; opacity: 0.5"></i><p>21+</p>';
    div.innerHTML += '<i style="background: ' + colors[3] + '; opacity: 0.5"></i><p>16-20</p>';
    div.innerHTML += '<i style="background: ' + colors[2] + '; opacity: 0.5"></i><p>11-15</p>';
    div.innerHTML += '<i style="background: ' + colors[1] + '; opacity: 0.5"></i><p> 6-10</p>';
    div.innerHTML += '<i style="background: ' + colors[0] + '; opacity: 0.5"></i><p> 0- 5</p>';
    div.innerHTML += '<hr><b>Company<b><br />';
    div.innerHTML += '<i class="fa fa-times-circle marker-color-1"></i><p> NO Air Traffic Control Tower</p>';
    div.innerHTML += '<i class="fa fa-rss marker-color-2"></i><p> HAS Air Traffic COntrol Tower</p>';
    // Return the Legend div containing the HTML content
    return div;
};

// 11. Add a legend to m
legend.addTo(mymap);

// 12. Add a scale bar to map
L.control.scale({position: 'bottomleft'}).addTo(mymap);
