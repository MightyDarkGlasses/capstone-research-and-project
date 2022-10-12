import { doc } from "firebase/firestore";
import * as fire from "../src/index";

let vehicleForm = document.querySelector('.vehicle-form');


let windowLocation = window.location.pathname;
window.addEventListener('DOMContentLoaded', () => {

if(windowLocation.indexOf("user-vehicle") > -1) {
    let logoutUser = document.querySelector('.util-icon-logout');
    logoutUser.addEventListener('click', () => {
        console.log("this is a test.");
        localStorage.clear();
        window.location = '../index.html';
    });


    //JSON

    // let vehi = JSON.parse(localStorage.getItem("vehicleInformation"));
    let vehicleInformation = JSON.parse(localStorage.getItem("vehicleInformation"));
    
    
    vehicleForm.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log('This is a test.')
    });

    let listOfVehiclesTags = '';
    let currentIndexSelectedSubmit = undefined;
    function showVehicleList(vehicle) {

        if(vehicle == null || vehicle.vehicle_length == 0) {
            // document.querySelectorAll('.right-container ~ .header').forEach((element) => element.style.display = 'none')
            let abc = document.querySelectorAll('.right-container ~ .header');
            console.log(abc)
            document.querySelector('.vehicle-dropdown').style.display = 'none';
            document.querySelectorAll('.title-with-add').forEach((e) => e.style.display = 'none');
            document.querySelector('.vehicle-information').style.display = 'none';
            document.querySelector('.linkages-box').style.display = 'none';
        }
        else {
            currentIndexSelectedSubmit = 0;
            for (let x=0; x<vehicle.vehicle_length; x++) {
                console.log('x:', x);
        
                // <li>Vehicle #1 | Toyota Raize 2022, Private</li>
                //id="vehicle-list"
                //vehicle-placeholder
                listOfVehiclesTags += `<li>Vehicle ${x+1} | ${vehicle.registered_vehicle.model[x]}, ${vehicle.registered_vehicle.use_types[x]}</li>`
    
                
    
                // console.log('vehicle.registered_vehicle.model[0]', vehicle.registered_vehicle.model[0])
                // console.log('vehicle.registered_vehicle.plate[0]', vehicle.registered_vehicle.plate[0])
    
                if(x === 0) { //will be used for placeholder
                    document.getElementById('vehicle-placeholder').innerHTML = `<p>Vehicle #1</p>`;
                    document.querySelector('.personal-info-plate').innerText = vehicleInformation.registered_vehicle.plate[0];
                    // document.querySelector('.personal-info-plate').innerText = '123';
                    document.querySelector('.personal-info-model').innerText = vehicleInformation.registered_vehicle.model[0];
                    // document.querySelector('.personal-info-model').innerText = '456';
                }
            }
            

            document.querySelector('.no-vehicle-box').style.display = 'none';
            document.getElementById('vehicle-list').innerHTML = listOfVehiclesTags;
            console.log(listOfVehiclesTags)
        }
    }
    function showLinkagesList(vehicle) {
        if(vehicle !== null) {
        //const docRefVehicle = fire.myDoc(fire.db, "vehicle-information", currentUserId);
            
            let myObject = vehicle.registered_vehicle.vehicles.linkages;
            let myKeys = Object.keys(myObject);

            if(myKeys.length > 0) {
                console.log('Linkages detected!');
                
                let linkagesOutput = '';
                
                myKeys.forEach((element, index) => {
                    // console.log('test', myObject[element][0], myObject[element][1])

                    const docRef = fire.myDoc(fire.db, "account-information", myObject[element][0]);
                    fire.myOnSnapshot(docRef, (doc) => {
                        // console.log("vehicleInformation", doc.data(), doc.id);
                        let accountInformation = {...doc.data()};
                        let fullName = `${accountInformation.last_name}, ${accountInformation.first_name} ${accountInformation.middle_name}`
                        console.log('fullName', fullName);
                        linkagesOutput += `<li>${fullName} - ${myObject[element][1].toUpperCase()}</li>`
                        

                        // Last index for setting the list of linkages
                        if(index === myKeys.length-1) {
                            console.log('index === myKeys.length', index === myKeys.length)
                            document.querySelector('.vehicle-linkages-list').innerHTML = linkagesOutput;
                        }
                    });
                });
                console.log('myKeys:', myKeys);
                console.log('linkageOutput:', linkagesOutput);
            }
            else {
                console.log('No linked yet.');
            }
            console.log('linkages:', vehicle.registered_vehicle.vehicles.linkages);
            console.log('linkages:', Object.keys(vehicle.registered_vehicle.vehicles.linkages).length);
        }
    }


    
    function clickableVehicleList() {
        let myLists = document.querySelectorAll('#vehicle-list > li');

        myLists.forEach((element, index) => {
            element.addEventListener('click', (e) => {
                document.querySelector(".popup-dropdown").style.display = 'none'; //toggle out popup

                document.querySelector('.personal-info-plate').textContent = vehicleInformation.registered_vehicle.plate[index];
                document.querySelector('.personal-info-model').textContent = vehicleInformation.registered_vehicle.model[index];
                
                console.log('working', index);
                console.log('vehicleInfo:', vehicleInformation);

                currentIndexSelectedSubmit = index;
                console.log('currentIndexSelectedSubmit', currentIndexSelectedSubmit);
                if(vehicleInformation['linkages'] === undefined || vehicleInformation["linkages"] == null) {
                    document.querySelector('.vehicle-linkages-list').textContent = 'None';
                }
            });
        });
    }
    showVehicleList(vehicleInformation);  // display the list
    showLinkagesList(vehicleInformation); // display the linkages
    clickableVehicleList();

    let currentUserId = localStorage.getItem('currentUserId');   
    const formPlate = document.querySelector('.form-plate');
    const formModel = document.querySelector('.form-model');

    formPlate.addEventListener('submit', (e) => {
        e.preventDefault();
        let plateNumber = formPlate.form_plate.value;
        updateVehiclePlateNumber(currentUserId, plateNumber, formPlate);
    });

    formModel.addEventListener('submit', (e) => {
        e.preventDefault();
        let plateModel = formModel.form_model.value;
        updateVehicleModelNumber(currentUserId, plateModel, formModel)
    });


    // https://firebase.google.com/docs/firestore/manage-data/add-data#update_elements_in_an_array
    // Update fields in nested objects
    function updateVehicleModelNumber(myId, updateValue, myForm) {
        console.log("vehicle info. updated: ", updateValue);
        let storeModel = [];

        const updateDocumentRef = fire.myDoc(fire.db, 'vehicle-information', myId);
        const docRef = fire.myDoc(fire.db, "vehicle-information", myId);
        fire.myOnSnapshot(docRef, (doc) => {
            // console.log("vehicleInformation", doc.data(), doc.id);
            let vehicleInfo = {...doc.data()};
            localStorage.setItem("vehicleInformation", JSON.stringify({...doc.data()}));

            console.log('vehicleInfo:', vehicleInfo.registered_vehicle.model);
            storeModel = vehicleInfo.registered_vehicle.model;

            console.log('before:', storeModel)
            storeModel[currentIndexSelectedSubmit] = updateValue; //replace the array value
            console.log('after:', storeModel)

            fire.myUpdateDoc(updateDocumentRef, {
                'registered_vehicle.model': storeModel
            })
            .then(() => {
                myForm.reset();
                location.reload();
            });
        });
    }

    function updateVehiclePlateNumber(myId, updateValue, myForm) {
        console.log("vehicle info. updated: ", updateValue);
        let storePlates = [];

        const updateDocumentRef = fire.myDoc(fire.db, 'vehicle-information', myId);
        const docRef = fire.myDoc(fire.db, "vehicle-information", myId);
        fire.myOnSnapshot(docRef, (doc) => {
            // console.log("vehicleInformation", doc.data(), doc.id);
            let vehicleInfo = {...doc.data()};
            localStorage.setItem("vehicleInformation", JSON.stringify({...doc.data()}));

            console.log('vehicleInfo:', vehicleInfo.registered_vehicle.plate);
            storePlates = vehicleInfo.registered_vehicle.plate;

            console.log('before:', storePlates)
            console.log('update task', currentIndexSelectedSubmit, updateValue)
            storePlates[currentIndexSelectedSubmit] = updateValue; //replace the array value
            console.log('after:', storePlates)

            fire.myUpdateDoc(updateDocumentRef, {
                'registered_vehicle.plate': storePlates
            })
            .then(() => {    
                myForm.reset();
                location.reload();
            });
        });
    }
}

});