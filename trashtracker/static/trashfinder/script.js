

console.log("Currently is using your location to draw markers on map. Since the markers would appear on setHacks members' homes, this may be less than ideal. If you judges would like us to change this, please just contact us. Instead, we would randomly generated coordinates in Manila, Philippines, where Joe presumably lives.")

function arandomLat(){
    return (Math.random()-0.5)/10+14.6;
}
function arandomLng(){
    return (Math.random()-0.5)/10+121.03;
}
function arandomOneDeci(){
    return Math.round(Math.random()*10)/10
}
var lat;
var long;
navigator.geolocation.getCurrentPosition(function (position) {
lat = position.coords.latitude;
long = position.coords.longitude;

//pythagorean formula should work right - no need to convert into metres or anything
function getDistance(long1,lat1,long2,lat2){
    return Math.sqrt((long1-long2)**2 + (lat1-lat2)**2);
}

//loops thru all markers, calculates distance, returns the minimum marker (via a object key)
mapboxgl.accessToken =
'REDACTED';
function getClosestMarker(testmarkers,long,lat){
    var minDistance, minKey;
    var minlong, minlat;
    for(i = 0;i<testmarkers.length;i++){
        //console.log("a",testmarkers[i])
        if (minDistance == undefined){
            minDistance = getDistance(testmarkers[i][0],testmarkers[i][1],long,lat);

            minlong = testmarkers[i][0];
            minlat = testmarkers[i][1];

            minKey = testmarkers[i][0];
        }
        else{
            var currDistance = getDistance(testmarkers[i][0],testmarkers[i][1],long,lat);
            if(currDistance<minDistance){
                minDistance = currDistance;
                minKey = testmarkers[i][0];

                minlong = testmarkers[i][0];
                minlat = testmarkers[i][1];
            }
        }
    }
    //console.log(minDistance,minlong,minlat,long,lat)
    //console.log(minKey)
    //0.4 is roughly 500m
    if(minDistance<0.004){
        return [minKey,minlong,minlat];
    }
    //if no marker within range, then do not remove a marker
    return [null,minlong,minlat];
}

//this in theory should remove the marker from the map
function removeMarker(key){
    if(key!=null){
        allMarkers[key].remove();
    }
}

function findElement(markers,marker){
    for(i=0;i<markers.length;i++){
        if(marker[0] == markers[i][0] && marker[1] == markers[i][1]){
            return i
        }
    }
    return -1
}
names = ["Fan Yang", "Emily Zhang", "Julien Liang", "Senthan Sivatharan"];

$(document).ready(function(){
    names.sort(() => Math.random() - 0.5)
    $('#footer').html("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TrashTracker&#169; Created by " + names[0] +", " + names[1] + ", " + names[2] + ", and " + names [3]);

    //orange button
    $("#foundTrashButton").click(function(){
      //currently uses randomly generated coordinates since otherwise the markers would only appear on setHacks members' homes, which would be less than ideal
      //randomly generated coordinates are in Manila, Philippines, where Joe presumably lives

      /*Code for getting locaation
        simply use global vars lat,long on lines 13,14 instead of longitude and latitude
      */


      /* DCL - chose to not use because of inconsistency
        This was intended to be used for calculating the nearest marker by comparing distances of all markers to user's location
      WORK FUNCTION 
        function workFn(index,long,lat,markers){
          
          if(Object.keys(markers).length==0){
            return null;
          }
          function getDistance(long1,lat1,long2,lat2){
            return Math.sqrt((long1-long2)**2 + (lat1-lat2)**2);
          }
            var minMarker=[100000,10000];
            var minDistance=1000000000;
            for (index=0; index<markers.length; index+=1){
              currDistance = getDistance(long,lat,markers[index][0],markers[index][1]
              if (currDistance<minDistance)){
                minDistance=currDistance;
                minMarker=markers[index];
              }
            }
            return minMarker;
        }

        async function deploy(){
            const compute = dcp.compute;
            let job = compute.for(0, Object.keys(markers).length-1), workFn, [long,lat,markers]);
            job.public.name = "TrashTrackerDistanceCalc";
            job.computeGroups = [{ joinKey: 'jkuat-edge', joinSecret: 'Wd7h2zpPCd' }];
            job.on('accepted', () => {
                console.log(`SUCCESS, id: ${job.id}`);
          }); 
          
          let resultMarker = await job.exec();
          allMarkers(resultMarker[0]).remove();
          $.post("map",
            {
            'type': "remove",
            'removed': 'yes',
            'long': resultMarker[0].toString(),
            'lat': resultMarker[1].toString()
            },
            function(data,status){
            });
      */
      
        $("#foundTrashButton").prop('disabled',true);
        setTimeout(function(){
          $("#foundTrashButton").prop('disabled',false);
        },5000); //prevent malicious spammers 
        var longitude=arandomLng(); //for manila purposes
        var latitude=arandomLat();
        longitude = long; //or just use user location
        latitude = lat;
        var currMarker = new mapboxgl.Marker({
            color: color_scale(arandomOneDeci()).hex()
        })
            .setLngLat([longitude, latitude])
            .addTo(map);
        allMarkers[longitude] = currMarker;
        markers.push([longitude,latitude])
        $.post("map",
        {
            'type': "add",
            'long': longitude.toString(),
            'lat': latitude.toString()
        },
        function(data,status){
        });
    });
    //green button
    $("#removedTrashButton").click(function(){
      $("#removedTrashButton").prop('disabled',true);
      setTimeout(function(){
        $("#removedTrashButton").prop('disabled',false);
      },5000); //prevent malicious spammers
        var longitude=arandomLng();
        var latitude=arandomLat();
        longitude = long;
        latitude = lat;
        //alert(long,lat)
        //console.log(longitude,latitude)
        var values = getClosestMarker(markers,longitude,latitude);
        //console.log(values)
        //console.log(markers)
        //remove marker from the map only if minDistance of less than 0.4 was returned
        if(values[0]!=null){
            removeMarker(values[0]);
            
            //remove marker from the markers array
            var index = findElement(markers,[values[1],values[2]]);
            //console.log("index",index);

            markers.splice(index,1);
            
            //remove marker from backend data @python
        }
            $.post("map",
            {
            'type': "remove",
            'removed': String(values[0]),
            'long': values[1].toString(),
            'lat': values[2].toString()
            },
            function(data,status){
            });
        
    });

  });

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10',
    center: [long, lat],
    zoom: 18 //ah yes, lets all see our own house
});

//stores every longitude, marker pair
var allMarkers = {}
var color_scale = chroma.scale(['yellow', 'red']);

map.on('load', () => {
    //console.log(markers);
    for (i = 0;i<markers.length;i++){
        //console.log(markers[i])
        //create new markers for data stored in views.py
        var currMarker = new mapboxgl.Marker({
            color: color_scale(arandomOneDeci()).hex()
        })
            .setLngLat([markers[i][0], markers[i][1]])
            .addTo(map);
        //console.log(currMarker)
        //add marker to allMarkers
        allMarkers[markers[i][0]] = currMarker;
    }
        

});
});
