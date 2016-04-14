/**
 * Created by lathd on 26/11/15.
 */
/***
 * Une partie du listener avait été fournit et nous devions gerer les recuperations d'adresse de Google APi avec une clé de
 * connexion
 * 
 * /
var map;
var pointMarker;
var geocoder;


function initMap( cb_click ) {
    var divMap = document.getElementById('map');
    map = new google.maps.Map(divMap, {
        center: new google.maps.LatLng(45.193861, 5.768846),
        zoom: 11
    });


  //   initPos();
    listenerMap( cb_click );

    return map;
}

function initPos(){
    return pointMarker = new google.maps.Marker(
        {position :new google.maps.LatLng(45.193861, 5.768846)
            ,map :map
            ,title :"Jesuisici!"
        });
}

function listenerMap( cb_click ) {
    google.maps.event.addListener(
        map
        ,'click'
        ,function(evt){
            pointMarker.setPosition(evt.latLng);
            geocoder.geocode(
                {'latLng':evt.latLng}
                ,function(results,status){
                    if(status==google.maps.GeocoderStatus.OK){
                        //console.log(results);
                        var address = results[0]["address_components"];
                        //console.log(address);
                        var patient = {};
                        if(address.length == 6){
                            patient.patientStreet = address[0]["long_name"];
                            patient.patientPostalCode = address[5]["long_name"];
                            patient.patientCity = address[1]["long_name"];
                            console.log(address[0]["long_name"] + " " + address[5]["long_name"] + " " + address[1]["long_name"]);
                        }else if(address.length == 7){
                            patient.patientFloor = address[0]["long_name"];
                            patient.patientStreet = address[1]["long_name"];
                            patient.patientPostalCode = address[6]["long_name"];
                            patient.patientCity = address[2]["long_name"];
                            console.log(address[0]["long_name"] + " " + address[1]["long_name"] + " " + address[6]["long_name"] + " " + address[2]["long_name"]);
                        }
                        cb_click( patient );
                    }else{
                        console.error("Errorgeocoding:",status);
                    }
                }
            );
        }
    );
}


module.exports = {
    initMap: initMap,
    initPos : initPos,
    geocoder: geocoder = new google.maps.Geocoder()
};
