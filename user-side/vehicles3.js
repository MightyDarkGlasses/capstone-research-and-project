import * as fire from "../src/index";
import e from "./script_users/qr-scanner.min.js";
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
                // if(vehicleInformation['linkages'] === undefined || vehicleInformation["linkages"] == null) {
                //     document.querySelector('.vehicle-linkages-list').textContent = 'None';
                // }
            });
        });
    }
    showVehicleList(vehicleInformation);  // display the list
    // showLinkagesList(vehicleInformation); // display the linkages
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

    // ### Linkages: Adding new entry
    function checkLinkageDuplication(scannedQRUserUID, plateNumber) {
        const docRefOthers = fire.myDoc(fire.db, "vehicle-information", scannedQRUserUID);
        const docRefSelf = fire.myDoc(fire.db, "vehicle-information", fire.auth.currentUser.uid);
        const docRefLinkages = fire.myDoc(fire.db, "linkages", fire.auth.currentUser.uid);
        // let currentLengthOfLinkages = -1;

        // Check if the linkages collection table exists in the Firestore.
        fire.myOnSnapshot(docRefLinkages, (doc) => {
            // currentLengthOfLinkages =  Object.keys(doc.data()).length;
            
            if(doc.exists()) {
                console.log('currentLengthOfLinkagesDAAAATA', doc.data());
                console.log('currentLengthOfLinkages', Object.keys(doc.data()).length);
            }
            // console.log('currentLengthOfLinkages', currentLengthOfLinkages);
        });
        
        // Check if the plate number is already registered on its personal account.
        fire.myOnSnapshot(docRefSelf, (doc) => {
            let currentPlateNumberKeysRegistered = Object.keys(doc.data());
            console.log('currentPlateNumberKeysRegistered', currentPlateNumberKeysRegistered);

            if(currentPlateNumberKeysRegistered.includes(plateNumber)) {
                $('#error-popup .modal-container-main').html(
                    `<p>You cannot add the plate number to your linkages</p>
                    <p class="note">Note: The plate number is already registered on your own account.</p>`
                    );
                $("#error-popup").modal({
                    fadeDuration: 100
                });
                return;
            }
            else {
                // Check if the plate number exists on the scanned user id.
                fire.myOnSnapshot(docRefOthers, (doc) => {
                    let currentPlateNumberKeysRegistered = Object.keys(doc.data());
                    // console.log('doc.data', doc.data())
                    // const fullName = 
                    //     `${doc.data()[plateNumber]['last_name']}, ${doc.data()[plateNumber]['first_name']} ${doc.data()[plateNumber]['middle_name']}`;
                    // console.log('fullName: ', fullName);
        
                    console.log('currentPlateNumberKeysRegistered', currentPlateNumberKeysRegistered);
                    if(!currentPlateNumberKeysRegistered.includes(plateNumber)) {
                        // console.log('You cannot add that plate number to your linkages. Reason: Already registered on your vehicle list.');
        
                        $('#error-popup .modal-container-main').html(
                            `<p>You cannot add the plate number to your linkages</p>
                            <p class="note">Note: The plate number does not exist or is not yet registered on the scanned user id.</p>`
                            );
                        $("#error-popup").modal({
                            fadeDuration: 100
                        });
        
                        return;
                    }
                    else {
                        const linkUserScannedUserUID = document.querySelector('.user-scanned-uid-value');
                        const linkUserScannedDate = document.querySelector('.user-scanned-date-value');
                        const linkUserScannedPlateNum = document.querySelector('.guest-platenum-caption-value');
                        const linkUserScannedVehicleModel = document.querySelector('.guest-model-caption-value');
                        // const linkUserScannedVehicleOwner = document.querySelector('.guest-fullname-caption-value');
                        currentPlateNumberKeysRegistered = doc.data()[plateNumber]
        
                        console.log('currentPlateNumberKeysRegistered', currentPlateNumberKeysRegistered)
                        linkUserScannedUserUID.innerText = (scannedQRUserUID);
                        linkUserScannedDate.innerText = (new Date());
                        linkUserScannedPlateNum.innerText = (plateNumber);
                        linkUserScannedVehicleModel.innerText = (currentPlateNumberKeysRegistered.model);
                        
                        $("#popup-linkages-modal").modal({
                            fadeDuration: 100
                        });    
                        $('.mobile-sidebar').css('opacity', 0);
        
                        document.querySelector('#confirmation-yes').addEventListener('click', () => {
                            addNewLinkages(scannedQRUserUID, plateNumber);
                        });
                        
                        document.querySelector('#confirmation-no').addEventListener('click', () => {
                            document.querySelector('#close-linkages-confirmation').click();
                            $('.mobile-sidebar').css('opacity', 1);
                        });
        
                        $('#popup-linkages-modal').on($.modal.CLOSE, () => {
                            
                        });
                    }
                });
            }
        });

    }
    function addNewLinkages(scannedQRUserUID, plateNumber) {
        console.log('addNewLinkages')
        const docRef = fire.myDoc(fire.db, "linkages", fire.auth.currentUser.uid);
        
        fire.myOnSnapshot(docRef, (doc) => {
            if(!doc.exists()) {
                console.info('Nope.');
                generateLinkagesQRCode(fire.auth.currentUser.uid, scannedQRUserUID, plateNumber, 500, 0, true);
            }
            else {
                const currentLinkagesKeysRegistered = Object.keys(doc.data());
                console.log('data: ', currentLinkagesKeysRegistered);
                console.log(currentLinkagesKeysRegistered, plateNumber);
                
                if(currentLinkagesKeysRegistered.includes(plateNumber)) {
                    // console.log('You cannot add that plate number to your linkages. Reason: Already added to your linkages list. ');
    
                    $('#error-popup .modal-container-main').html(
                        `<p>You cannot add the plate number to your linkages</p>
                        <p class="note">Note: Already added to your linkages list. </p>`
                        );
                    $("#error-popup").modal({
                        fadeDuration: 100
                    });
                    $("#error-popup").on($.modal.CLOSE, () => {
                        $('.mobile-sidebar').css('opacity', 1);
                    });
                }
                else {
                    console.log('All unique.')
                    // console.log(fire.auth.currentUser.uid);
                    
                    generateLinkagesQRCode(fire.auth.currentUser.uid, scannedQRUserUID, plateNumber, 500, Object.keys(doc.data()).length, false);
                }
            }

        });

        
    }
    // ### Linkages: Adding new entry


    // ### Linkages: Adding new entry, generating QR code upon registration
    // Generate a new QR code dedicated to the linked vehicle information
    async function generateLinkagesQRCode(userUID, scannedQRUserUID, plateNumber, mySize, index, isNewEntry) {
        // Check if the index parameter is given, if not then given it a default value
        if (typeof(index)==='undefined') index = "1";

        index += 1;
        let generatedOutput;
        const generateQRCode = (text, size) => {
            const qrcode = new QRCode('qrcode', {
                text: text,
                width: size,
                height: size,
                colorDark : "#000000",
                colorLight : "#ffffff",
                correctLevel : QRCode.CorrectLevel.H,
                quietZone: true
            });
            generatedOutput = qrcode._oDrawing._elCanvas.toDataURL("image/png");
        };
    
        let qrCodeDataObject = {
            'uid': userUID,
            'linked_uid': scannedQRUserUID,
            'plate_number': plateNumber.replace(" ", "")
        }
    
        await generateQRCode(JSON.stringify(qrCodeDataObject), mySize);

        // # Generate QR Code, linkages folder
        const storage = fire.storage;
        const storageRef = fire.myRef(storage, `linkages/${userUID}/${index}/linkagesQRCode.PNG`);
        let qrCodeBlob = await base64ToBlob((generatedOutput.replace(/^data:image\/(png|jpeg);base64,/, "")), "image/png");
        const uploadTask = fire.doUploadBytesResumable(storageRef, qrCodeBlob, "image/png");
        
        uploadTask.on('state_changed', 
            async (snapshot) => {
                // Progress of fileupload
                const progress = Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                console.log("Uploading qr code vehicle");
                console.log('Upload is ' + progress + '% done');    //progress of upload
            }, 
            (error) => {
                // Handle unsuccessful uploads
                console.log(error);
            }, 
            (success) => {
                // If successful, do this.
                // Add the linkages data into the list
                fire.myGetDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    console.log('QR code URL: ', downloadURL);

                    const updateDocumentRef = fire.myDoc(fire.db, 'linkages', fire.auth.currentUser.uid);

                    if(isNewEntry) {
                        console.log('myAddDoc', true);
                        fire.doSetDoc(updateDocumentRef, {
                            [plateNumber]: {
                                'account_ref': fire.myDoc(fire.db, '/account-information/' + scannedQRUserUID),
                                'vehicle_ref': fire.myDoc(fire.db, '/vehicle-information/' + scannedQRUserUID),
                                'qr': downloadURL,
                            }
                        }).then((success) => {
                            console.log("Done");
                            location.reload();
                        });
                    }
                    else {
                        console.log('doUpdateDoc', false);
                        fire.myUpdateDoc(updateDocumentRef, {
                            [plateNumber]: {
                                'account_ref': fire.myDoc(fire.db, '/account-information/' + scannedQRUserUID),
                                'vehicle_ref': fire.myDoc(fire.db, '/vehicle-information/' + scannedQRUserUID),
                                'qr': downloadURL,
                            }
                        }).then((success) => {
                            console.log("Done");
                            location.reload();
                        });
                    }
                });
            } //end of getDownloadURL
        ); //end of uploadTask
    }
    function base64ToBlob(base64, mime) {
        mime = mime || '';
        var sliceSize = 1024;
        var byteChars = window.atob(base64);
        var byteArrays = [];

        for (var offset = 0, len = byteChars.length; offset < len; offset += sliceSize) {
            var slice = byteChars.slice(offset, offset + sliceSize);
            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            
            var byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }

        return new Blob(byteArrays, {type: mime});
    }
    // ### Linkages: Adding new entry, generating QR code upon registration

    // Display all of the linkages in the logged in user.
    function getLinkagesInfo(currentLoggedUserId) {
        let listOfLinkedData = {};  //store all of the linked data here...
        let listOfLinkedDataTable = ``;

        const docRef = fire.myDoc(fire.db, "linkages", currentLoggedUserId);
        fire.myOnSnapshot(docRef, async (doc) => {
            // console.log("linkages", doc.data(), doc.id);

            console.log('linkagesList', doc.data())
            let linkagesList = {...doc.data()};
            let listLinkagesKeys = Object.keys(linkagesList);

            // let listOfLinkagesData = [];
            console.log('linkagesList', Object.keys(linkagesList).length);
            
            let tempPlateNumber = '';
            if(!doc.exists()) {
                console.log('There are no linked vehicle data.')
            }
            else {
                if(Object.keys(linkagesList).length) {
                    listLinkagesKeys.forEach(async (data, index) => {

                        tempPlateNumber = data;
                        data = linkagesList[data];

                        console.log('data: ', data, 'index: ', index);

                        console.log(data.vehicle_ref)
                        console.log(data.account_ref)
                        // console.log(data.plate_number)
                        console.log(tempPlateNumber)
        
                        const vehicleRef = data.vehicle_ref;
                        const accountRef = data.account_ref;
        
        
                        const docSnap1 = await fire.myGetDoc(vehicleRef);
                        const docSnap2 = await fire.myGetDoc(accountRef);
                        
                        if (docSnap1.exists()) {
                            console.log("Vehicle data:", docSnap1.data()[tempPlateNumber]);
                            // Run the if statement to get the exisiting data (plate number as the object id), else print "false"
                            if(docSnap1.data()[tempPlateNumber]) {
        
                                let referredVehicleInfo = docSnap1.data()[tempPlateNumber];
                                console.log(true);
        
                                // listOfLinkedData[data.plate_number] = {
                                //     "model": referredVehicleInfo.model[0],
                                //     "owner": docSnap2.exists() ? `${docSnap2.data()['last_name']}, ${docSnap2.data()['first_name']} ${docSnap2.data()['middle_name'][0]}.` : 'Uknown owner.',
                                //     "registration_date": referredVehicleInfo.createdAt,
                                // };
        
                                listOfLinkedDataTable += `
                                    <td>${referredVehicleInfo.model[0]}</td>
                                    <td>${tempPlateNumber}</td>
                                    <td>${docSnap2.exists() ? `${docSnap2.data()['last_name']}, ${docSnap2.data()['first_name']} ${docSnap2.data()['middle_name'][0]}.` : 'Uknown owner.'}</td>
                                    <td><a href="">X</a></td>`;
        
                                console.log(listOfLinkedDataTable);
                            }
                            else {
                                console.log(false);
                            }
                            document.querySelector('.linkages-data-body').innerHTML = listOfLinkedDataTable;
                        } else {
                            console.log("No such document!");
                        }
                    });
                }
            }

        });

        console.log('listOfLinkedData', listOfLinkedData);
        console.log('listOfLinkedDataTable', listOfLinkedDataTable);
        // 
    } // end of function getLinkagesInfo()


    // ####### Linkages: Read QR by Upload
    const fileSelector = document.getElementById('file-selector');
    fileSelector.addEventListener('change', event => {
        const file = fileSelector.files[0];
        if (!file) {
            return;
        }
        else {
            qrScanFileUpload(file)
        }
    });
    const dropZoneElement = document.getElementById('drop-zone');
    dropZoneElement.addEventListener("drop", (e) => {
		e.preventDefault();
        const file = fileSelector.files[0];
        if (!file) {
            return;
        }
        else {
            qrScanFileUpload(file)
        }
    });
    function qrScanFileUpload(file) {
        QrScanner.scanImage(file, { returnDetailedScanResult: true })
        .then(result => {
            // setResult(fileQrResult, result);
            const scannedQRConvertToRawString = JSON.parse(result.data);
            console.info('Result: ', result, scannedQRConvertToRawString.uid, scannedQRConvertToRawString.plate_number);
            
            // Call the addNewLinkages() function
            checkLinkageDuplication(scannedQRConvertToRawString.uid, scannedQRConvertToRawString.plate_number);
        })
        .catch(e => {
            // setResult(fileQrResult, { data: e || 'No QR code found.' })
            console.info('No QR code found.', e)
        });
    }
    // ####### Linkages: Read QR by Upload


    // Get the uid of the currently logged in user.
    fire.getOnAuthStateChanged(fire.auth, (user) => {
        if (user) {
            console.log("Currently logged user: ", user.uid);
            getLinkagesInfo(user.uid);
        } 
        else {
            console.error("No user was logged in.");
        }
    });
    
    
    
} // end of window.location.pathname

// console.log(fire.db)


}); //end of DOMContentLoaded event