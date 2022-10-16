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
            

            console.log('currentIndexSelectedSubmit', currentIndexSelectedSubmit)

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
                    console.log('test', myObject)
                    linkagesOutput += `<li>Link #${index}: ${myObject[myKeys]}</li>`;
                    //     // Last index for setting the list of linkages
                    //     if(index === myKeys.length-1) { 
                    //         console.log('index === myKeys.length', index === myKeys.length)
                    //         document.querySelector('.vehicle-linkages-list').innerHTML = linkagesOutput;
                    //     }
                });

                document.querySelector('.vehicle-linkages-list').innerHTML = linkagesOutput;
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

    //generateVehicleQRCode
    // async function generateVehicleQRCode(userUID, plateNumber, mySize) {
    //     // let qrCodeLink = "";
    //     let generatedOutput;
    
    //     const generateQRCode = (text, size) => {
    //         const qrcode = new QRCode('qrcode', {
    //             text: text,
    //             width: size,
    //             height: size,
    //             colorDark : "#000000",
    //             colorLight : "#ffffff",
    //             correctLevel : QRCode.CorrectLevel.H
    //         })
    //         generatedOutput = qrcode._oDrawing._elCanvas.toDataURL("image/png");
    //     };
    
    //     let qrCodeDataObject = {
    //         'uid': userUID,
    //         'plate_number': plateNumber.replace(" ", "")
    //     }
    
    //     await generateQRCode(JSON.stringify(qrCodeDataObject), mySize);
    //     const storage = fire.storage;
    //     const storageRef = ref(storage, `vehicle-information/${userUID}/1/qrCode0.PNG`);
    //     let qrCodeBlob = await base64ToBlob((generatedOutput.replace(/^data:image\/(png|jpeg);base64,/, "")), "image/png");
    //     const uploadTask = fire.myUploadBytesResumable(storageRef, qrCodeBlob, "image/png");
        
    //     uploadTask.on('state_changed', 
    //         async (snapshot) => {
    //             // Progress of fileupload
    //             const progress = Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
    //             console.log("Uploading qr code vehicle");
    //             console.log('Upload is ' + progress + '% done');    //progress of upload
    //         }, 
    //         (error) => {
    //             // Handle unsuccessful uploads
    //             console.log(error);
    //         }, 
    //         (success) => {
    //             // If successful, do this.
    //             getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
    //                 console.log('QR Code - File available at', downloadURL);
    //                 console.log('QR Code done.');
    //             });
    //         } //end of getDownloadURL
    //     ); //end of on method
    // }

    // // Convert base64 (generated by FileReader) into Blob (which is supported by Firebase Storage)
    // function base64ToBlob(base64, mime) 
    // {
    //     mime = mime || '';
    //     var sliceSize = 1024;
    //     var byteChars = window.atob(base64);
    //     var byteArrays = [];

    //     for (var offset = 0, len = byteChars.length; offset < len; offset += sliceSize) {
    //         var slice = byteChars.slice(offset, offset + sliceSize);
    //         var byteNumbers = new Array(slice.length);
    //         for (var i = 0; i < slice.length; i++) {
    //             byteNumbers[i] = slice.charCodeAt(i);
    //         }
            
    //         var byteArray = new Uint8Array(byteNumbers);
    //         byteArrays.push(byteArray);
    //     }

    //     return new Blob(byteArrays, {type: mime});
    // }


} // end of window.location.pathname

// console.log(fire.db)


});