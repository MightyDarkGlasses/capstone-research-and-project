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
    // let vehi = JSON.parse(localStorage.getItem("vehicleInformation"));
    let vehicleInformation = JSON.parse(localStorage.getItem("vehicleInformation"));
    
    vehicleForm.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log('This is a test.')
    });

    let listOfVehiclesTags = '';


    
    function showVehicleList(vehicle) {
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

        document.getElementById('vehicle-list').innerHTML = listOfVehiclesTags;
        console.log(listOfVehiclesTags)
    }



    let currentIndexSelectedSubmit = undefined;
    function clickableVehicleList() {
        let myLists = document.querySelectorAll('#vehicle-list > li');

        myLists.forEach((element, index) => {
            element.addEventListener('click', (e) => {
                document.querySelector(".popup-dropdown").style.display = 'none'; //toggle out popup

                document.querySelector('.personal-info-plate').textContent = vehicleInformation.registered_vehicle.plate[index];
                document.querySelector('.personal-info-model').textContent = vehicleInformation.registered_vehicle.model[index];
                
                console.log('working', index);
                console.log('vehicleInfo:', vehicleInformation);


                if(vehicleInformation['linkages'] === undefined || vehicleInformation["linkages"] == null) {
                    document.querySelector('.vehicle-linkages-list').textContent = 'None';
                }
            });
        });
    }
    showVehicleList(vehicleInformation);  // display the list
    clickableVehicleList();

    let currentUserId = localStorage.getItem('currentUserId');   
    const formPlate = document.querySelector('.form-plate');
    const formModel = document.querySelector('.form-model');

    formPlate.addEventListener('submit', (e) => {
        e.preventDefault();
        let plateNumber = formPlate.form_plate.value;

        let updateObj = {
            registered_vehicle: {
                model: {
                    currentIndexSelectedSubmit: plateNumber
                }
            }
        };
        // console.log("formPhoneNum:", currentUserId, phoneNumObj, formPhoneNum);
        updateVehicleInformation(currentUserId, updateObj, formPlate);
    });

    formModel.addEventListener('submit', (e) => {
        let plateModel = formModel.form_model.value;

        let updateObj = {
            registered_vehicle: {
                plate: {
                    currentIndexSelectedSubmit: plateModel
                }
            }
        };
        // console.log("formPhoneNum:", currentUserId, phoneNumObj, formPhoneNum);
        updateVehicleInformation(currentUserId, updateObj, formModel);
    });

    function updateVehicleInformation(myId, myObject, myForm) {
        console.log("vehicle info. updated: ", myObject);
        const docRefAccount = fire.myDoc(fire.db, "vehicle-information", myId);

        // console.log(fire.myUpdateDoc(docRefAccount))
        fire.myUpdateDoc(docRefAccount, myObject)
        .then(() => {    
            myForm.reset();
            // window.location.href = window.location.href; //reload a page in JS
            location.reload();
        })

        // updateDoc(docRef, {
        //     title: "Updated title.",    //I can use input later
        //     authors: "Updated authors"
        // }).then(() => {
        //     updateForm.reset();
        // });
    }
}

});