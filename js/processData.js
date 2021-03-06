
//Donnée par le prof avec un exemple que nous devons adapter à notre cas de figure

/*
 *  Ce fichier represente un module
 * ce module est chargé de produire une representation JSOn du cabinet medicale à partir de la
 * representation xml de ce meme cabinet
 * La representation xml du cabinet medical se trouve dans data/cabinetMedical.xml
 * Le format de sorti JSON sera le suivant {  ListePatientNOmAffectes:[]//contient des patients
 *                                            infirmiers:{}tableau associatif qui contient des infirmiers qui sont indexes par leur id
 *                                          }
 *Objet Patient:{nom,prenom,numero,.....}
 * Objet Infirmier{nom,prenom,photo,id,PatientsAffectes[]//contient des patients}
 * */
var infirmiers={};
var patientSansInfirmiers=[];

function initPatient(nodePatients){
    for (var i = 0; i < nodePatients.length; i++) {
        var nodePatient = nodePatients[i];
        var patient={};
        var patientIntervenant=nodePatient.querySelector('visite').getAttribute('intervenant');
        patient.nom=nodePatient.querySelector('nom').textContent;
        patient.prenom=nodePatient.querySelector('prénom').textContent;
        // patient.sexe=nodePatient.querySelector('sexe');
        // patient.naissance=nodePatient.querySelector('naissance');
        patient.numero=nodePatient.querySelector('numéro').textContent;

        if(patientIntervenant!==null){
            infirmiers[patientIntervenant].patients.push(patient);
        }else{
            patientSansInfirmiers.push(patient);
        }
    }
}


function initInf(nodeInfirmiers){
    for (var i = 0; i < nodeInfirmiers.length; i++) {
        var infirmier = nodeInfirmiers[i];

        infirmiers[infirmier.getAttribute("id")] = {
            'nom': infirmier.querySelector('nom').textContent,
            'prenom': infirmier.querySelector('prénom').textContent,
            'id': infirmier.getAttribute("id"),
            'photo': infirmier.querySelector('photo').textContent,
            'patients':[]
        };
    }
}


module.exports= function (doc) {
    var nodeInfirmiers;
    var nodePatients;

    nodeInfirmiers = doc.querySelectorAll('infirmiers > infirmier');
    nodePatients = doc.querySelectorAll('patients > patient');
   // patientReload=doc.querySelector('patients>patient>visite:not[intervenant]');
    initInf(nodeInfirmiers);
    initPatient(nodePatients);
    return {
        patientSansInfirmiers: patientSansInfirmiers,
        infirmiers: infirmiers,

    };
}







