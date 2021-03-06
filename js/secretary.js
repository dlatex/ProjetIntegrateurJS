/**
 * Created by lathd on 26/11/15.
 */
var processdata = require("./processData.js"),
	Gmaps		= require("./ControlPanelInteraction.js");

angular	.module("cabinetMedical",["ngDraggable"])
		.controller("cabinetController", function($http, $scope) {
			var controller = this;	//controleur en cours de construction

			var map			= Gmaps.initMap( function(patient) {controller.updatePatient(patient);} );
			var pointMarker	= Gmaps.initPos();

			this.updatePatient	= function(patient) {
				console.log("controller has to update", patient);
				$scope.patient = patient;
				$scope.$apply(); // Mettre à jour le HTML via Angular
			}
			this.affectation = function(obj, infirmierCible) {
				//console.log("Affecter", obj, infirmierCible);
				infirmierCible.patients.push( obj.patient ); // Ajout
				var L;
				if(obj.infirmier) {
					L = obj.infirmier.patients;
				} else {
					L = this.data.patientSansInfirmiers;
				}
				L.splice( L.indexOf(obj.patient), 1 ); // Retrait

				var aff = {};
				aff.patient = obj.patient.numero;
				aff.infirmier = infirmierCible.id;
				$http.post("/affectation",aff).then(function(obj){console.log(obj);}).catch(function(obj){console.log(obj);});
			}

			$http.get("data/cabinetInfirmier.xml")
			.success(function (str) {
				var parse = new DOMParser();
				var doc = parse.parseFromString(str, "text/xml");
				controller.data = processdata(doc);
			});
			this.addPatient = function(patient){
		//console.log(patient);Martilou lâche un Amen si tu reconnais que je suis bon que toi en Angular 
				$http.post("/addPatient",patient).then(function(obj){console.log(obj);}).catch(function(obj){console.log(obj);});
				var newpatient={};
				newpatient.nom=patient.patientName;
				newpatient.prenom=patient.patientForname;
				newpatient.numero=patient.patientNumber;
				this.data.patientSansInfirmiers.push(newpatient);
				console.log(this.data.patientSansInfirmiers);
				var form = document.getElementById("addPatient");

				form.classList.toggle('hide');
			}
			this.hideShowFormPatient = function() {
				var form = document.getElementById("addPatient");
				form.classList.toggle('hide');
			}
			this.placeMarkeur = function(){
				google.maps.event.addListener(
					map
					,'click'
					,function(evt){
						pointMarker.setPosition(evt.latLng);
						Gmaps.geocoder.geocode(
							{'latLng':evt.latLng}
							,function(results,status){
								if(status==google.maps.GeocoderStatus.OK){
			//console.log(results); //teste pour voir ce qu'il y a dans le resultats
									var address = results[0].address_components;
									//console.log(address);
									var patient = {};
									if(address.length == 6){
										patient.patientStreet = address[0].long_name;
										patient.patientPostalCode = address[5].long_name;
										patient.patientCity = address[1].long_name;
										console.log(address[0].long_name + " " + address[5].long_name + " " + address[1].long_name);
									}else if(address.length == 7){
										patient.patientFloor = address[0].long_name;
										patient.patientStreet = address[1].long_name;
										patient.patientPostalCode = address[6].long_name;
										patient.patientCity = address[2].long_name;
										console.log(address[0].long_name + " " + address[1].long_name + " " + address[6].long_name + " " + address[2].long_name);
									}

								}else{
									console.error("Errorgeocoding:",status);
								}
							}
						);
					}
				);
			}
		})
	/*AIzaSyDXlInfFI5ar5vuYFcnKLGAgtKAaXjwxYc*/
		.directive('patientTemplate',function(){
			return {
				  restrict: 'E'
				, controller: function () {
					 //console.log('patient');
					}
				, controllerAs:'patientItemController'
				, templateUrl: "../patientTemplate.html"
				, scope : {
					patient: "=data"
				}
			}
		})
		.directive('infirmierTemplate',function(){
			return {
				restrict: 'E'
				, controller: function () {
					//console.log('infirmier');
				}
				, controllerAs:'infirmierItemController'
				, templateUrl: "../infirmiereTemplate.html"
				, scope : {
					inf: "=data"
				}
			}
		});

	//Angular App Module and Controller
	angular.module('mapsApp', [])
		.controller('MapCtrl', function ($scope) {

			var mapOptions = {
				zoom: 11,
				center: new google.maps.LatLng(45.193861, 5.768846),
				mapTypeId: google.maps.MapTypeId.TERRAIN
			}

			$scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);
			/* 
			wtf de gulp me crache sur la face avec ces messages d'erreur : partie a demander au prof
			 $scope.markers = [];

			 var infoWindow = new google.maps.InfoWindow();

			 var createMarker = function (info){

			 var marker = new google.maps.Marker({
			 map: $scope.map,
			 position: new google.maps.LatLng(info.lat, info.long),
			 title: info.city
			 });
			 marker.content = '<div class="infoWindowContent">' + info.desc + '</div>';

			 google.maps.event.addListener(marker, 'click', function(){
			 infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
			 infoWindow.open($scope.map, marker);
			 });

			 $scope.markers.push(marker);

			 }

			 for (i = 0; i < cities.length; i++){
			 createMarker(cities[i]);
			 }

			 $scope.openInfoWindow = function(e, selectedMarker){
			 e.preventDefault();
			 google.maps.event.trigger(selectedMarker, 'click');
			 }
			 */
		});
