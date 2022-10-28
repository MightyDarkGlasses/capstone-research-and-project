import * as fire from "../src/index";
import QrScanner from './script_users/qr-scanner.min.js'; 

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
    
    
    // vehicleForm.addEventListener('submit', (e) => {
    //     e.preventDefault();
    //     console.log('This is a test.')
    // });

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
            let vehicleKeys= Object.keys(JSON.parse(localStorage.vehicleInformation));
            let iterator = 1; // count the number of vehicle list
            for (let index=0; index<vehicleKeys.length; index++) {
                console.log('iterating index: ', index);
                // console.log('index:', index);
                // console.log('vehicleInformation[index]:', vehicleInformation[index]);
                // console.log('vehicleKeysLength:', vehicleKeys[index]);
                
                if(vehicleKeys[index] !== 'vehicle_length') {
                    // console.log('true', vehicleInformation[vehicleKeys[index]])

                    const preSelectedVehicleKey = vehicleInformation[vehicleKeys[index]];
                    listOfVehiclesTags += `<li data-key="${vehicleKeys[index]}">Vehicle ${iterator} | ${preSelectedVehicleKey["model"][0]}, ${vehicleKeys[index]}</li>`;
                    document.getElementById('vehicle-placeholder').innerHTML = `<p>Vehicle #1</p>`;
                    document.querySelector('.personal-info-plate').innerText = vehicleKeys[index];
                    document.querySelector('.personal-info-model').innerText = preSelectedVehicleKey["model"][0];
                    iterator += 1;
                    // if(x === 1) { //will be used for placeholder
                    //     document.getElementById('vehicle-placeholder').innerHTML = `<p>Vehicle #1</p>`;
                    //     document.querySelector('.personal-info-plate').innerText = vehicleInformation.registered_vehicle.plate[0];
                    //     document.querySelector('.personal-info-model').innerText = vehicleInformation.registered_vehicle.model[0];
                    // }
                }
            }
            

            console.log('currentIndexSelectedSubmit', currentIndexSelectedSubmit)
            document.querySelector('.no-vehicle-box').style.display = 'none';
            document.getElementById('vehicle-list').innerHTML = listOfVehiclesTags;
            console.log(listOfVehiclesTags)
        }
    }
    function showLinkagesList(vehicle) {
        // if(vehicle !== null) {
        // //const docRefVehicle = fire.myDoc(fire.db, "vehicle-information", currentUserId);
            
        //     let myObject = vehicle.registered_vehicle.vehicles.linkages;
        //     let myKeys = Object.keys(myObject);

        //     if(myKeys.length > 0) {
        //         console.log('Linkages detected!');
                
        //         let linkagesOutput = '';
                
        //         myKeys.forEach((element, index) => {
        //             console.log('test', myObject)
        //             linkagesOutput += `<li>Link #${index}: ${myObject[myKeys]}</li>`;
        //             //     // Last index for setting the list of linkages
        //             //     if(index === myKeys.length-1) { 
        //             //         console.log('index === myKeys.length', index === myKeys.length)
        //             //         document.querySelector('.vehicle-linkages-list').innerHTML = linkagesOutput;
        //             //     }
        //         });

        //         document.querySelector('.vehicle-linkages-list').innerHTML = linkagesOutput;
        //         console.log('myKeys:', myKeys);
        //         console.log('linkageOutput:', linkagesOutput);
        //     }
        //     else {
        //         console.log('No linked yet.');
        //     }
        //     console.log('linkages:', vehicle.registered_vehicle.vehicles.linkages);
        //     console.log('linkages:', Object.keys(vehicle.registered_vehicle.vehicles.linkages).length);
        // }
    }


    
    function clickableVehicleList() {
        let myLists = document.querySelectorAll('#vehicle-list > li');
        const personalInfoPlate = document.querySelector('.personal-info-plate').textContent;
        const personalInfoModel = document.querySelector('.personal-info-model').textContent;
        myLists.forEach((element, index) => {
            element.addEventListener('click', (e) => {
                document.querySelector(".popup-dropdown").style.display = 'none'; //toggle out popup
                console.log('getAttribute', element.getAttribute('data-key'));

                const getSelectedAttrKey = element.getAttribute('data-key'),
                personalInfoPlate = vehicleInformation[getSelectedAttrKey],
                personalInfoModel = vehicleInformation[getSelectedAttrKey]["model"][0];
                
                // console.log('personalInfoPlate:', personalInfoPlate);
                document.querySelector('.personal-info-plate').innerText = getSelectedAttrKey;
                document.querySelector('.personal-info-model').innerText = personalInfoModel;
                document.querySelector('#vehicle-placeholder').innerHTML = `<p>Vehicle #${index+1}</p>`;

                // currentIndexSelectedSubmit = index;
                // console.log('currentIndexSelectedSubmit', currentIndexSelectedSubmit);
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
                // generateVehicleQRCode(myId, updateValue, 500);  

                // console.log(myId, updateValue, 500)
                fire.exportGenerateVehicleQRCode(myId, updateValue, 500, currentIndexSelectedSubmit);
                myForm.reset();
                location.reload();
            });
        });
    }

    // ########## LINKAGES ###########
    const fileQrResult = document.getElementById('file-qr-result');
    const fileSelector = document.getElementById('file-selector');

    // ####### Result #######
    function setResult(label, result) {
        console.log(result.data);
        label.textContent = result.data;
        // camQrResultTimestamp.textContent = new Date().toString();
        label.style.color = 'teal';
        clearTimeout(label.highlightTimeout);
        label.highlightTimeout = setTimeout(() => label.style.color = 'inherit', 100);
    
        // scanner.stop();
    }

    // ####### File Scanning #######
    fileSelector.addEventListener('change', event => {
        const file = fileSelector.files[0];
        if (!file) {
            return;
        }
        QrScanner.scanImage(file, { returnDetailedScanResult: true })
            .then(result => {
                // setResult(fileQrResult, result);
                addNewLinkages(result);
            }).catch(e => setResult(fileQrResult, { data: e || 'No QR code found.' }));
    });
    document.querySelectorAll(".drop-zone__input").forEach((inputElement) => {
        console.log('drop-zone hey hey hey')
        const dropZoneElement = inputElement.closest(".drop-zone");

        dropZoneElement.addEventListener("drop", (e) => {
            e.preventDefault();

            if (e.dataTransfer.files.length) {
                let myFile = e.dataTransfer.files[0];

                const file = fileSelector.files[0];
                if (!file) {
                    return;
                }
                QrScanner.scanImage(file, { returnDetailedScanResult: true })
                    .then(result => {
                        // setResult(fileQrResult, result)
                        addNewLinkages(result);
                    }).catch(e => setResult(fileQrResult, { data: e || 'No QR code found.' }));
            }
        });
    });

    function addNewLinkages(info) {
        console.log(info.data)
        let parseData = JSON.parse(info.data);
        console.log(parseData);
        
        let currentCount = -1;
        

        const docRef = fire.myDoc(fire.db, "vehicle-information", parseData.uid);
        fire.myOnSnapshot(docRef, (doc) => {
            // console.log("vehicleInformation", doc.data(), doc.id);
            let vehicleInfo = {...doc.data()};

            if(Object.keys(vehicleInfo).length > 0) {
                let arr = vehicleInfo.registered_vehicle.plate;
                console.log('vehicleInfo...', vehicleInfo);
                console.log('vehicleInfo...', Object.keys(vehicleInfo).length < 0);
                console.log('vehicleInfo...', arr.findIndex((element) => element === parseData.plate_number) > 0);
                console.log('vehicleInfo...', arr.findIndex((element) => element === parseData.plate_number));

                if(arr.findIndex((element) => element === parseData.plate_number) === -1) {

                    let linkages = vehicleInformation.registered_vehicle.vehicles.linkages;
                    let lengthOfLinkages = Object.keys(linkages).length;
                    // console.log(vehicleInformation.registered_vehicle.vehicles.linkages);
                    // console.log(Object.keys(linkages).length);
                    
                    
                    let storeLinkages = vehicleInfo.registered_vehicle.vehicles.linkages;
                    console.log('before:', storeLinkages);
                    storeLinkages[lengthOfLinkages-1] = parseData.plate_number; //replace the array value
                    console.log('after:', storeLinkages);

                    const updateDocumentRef = fire.myDoc(fire.db, 'vehicle-information', currentUserId);
                    fire.myUpdateDoc(updateDocumentRef, {
                        'registered_vehicle.vehicles.linkages': storeLinkages
                    }).then((success) => {
                        console.log("Done");
                        location.reload();
                    });
                }
            }
            else {
                console.log('Imbento na qr code');
            }
            

            // Fix: Real-time counting for current size of linkages

            // console.log('fetched!', vehicleInfo);
            // console.log('plate_number', parseData.plate_number, typeof(parseData.plate_number));
            // console.log('findIndex', arr.findIndex((element) => element === parseData.plate_number));

            // Non-exising
            
        });
    }
} // end of window.location.pathname

// console.log(fire.db)


}); //end of DOMContentLoaded event