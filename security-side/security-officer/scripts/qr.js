import QrScanner from "./qr-scanner.min.js";
import * as fire from "../../../src/index";
import e from "./qr-scanner.min.js";

if(window.location.pathname.indexOf('securityOfficer-home') > -1) {
    console.log('QrScanner qr.js');

    let isSuccessPersonal = false;
    let isSuccessVehicle = false;
    async function fetchInformation(userUID, plateNumber) {
        // Google Firebase
        console.log('fetchInformation:', userUID, plateNumber)
        
        console.log('security officer qrscanning.js');
        const docRefAccountInfo = fire.myDoc(fire.db, "account-information", userUID);
        const docRefVehicleInfo = fire.myDoc(fire.db, "vehicle-information", userUID);
        //one-time listener

        const docSnap = await fire.myGetDoc(docRefAccountInfo);
        let isSuccessPersonal = false, isSuccessVehicle = false;
        // let accInfoData = '', vehInfoData = '';
        if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());

            localStorage.setItem('docPersonal', JSON.stringify(docSnap.data()));
            isSuccessPersonal = true;
        }
        else {
            console.log("No such document!");
        }

        const docSnap2 = await fire.myGetDoc(docRefVehicleInfo);
        if (docSnap2.exists()) {
            console.log("Document data:", docSnap2.data());
            
            localStorage.setItem('docVehicle', JSON.stringify(docSnap2.data()));
            isSuccessVehicle = true;
        }
        else {
            console.log("No such document!");
        }
        
        /*
            let accountInformation = undefined, 
                vehicleInformation = undefined;
            const promiseScannedAccount = fire.myOnSnapshot(docRefAccountInfo, (doc) => {
                accountInformation = {...doc.data()};
                console.log("getAccountInformation", accountInformation, doc.id);
            });
            const promiseScannedVehicle = fire.myOnSnapshot(docRefVehicleInfo, (doc) => {
                vehicleInformation = {...doc.data()};
                console.log("getVehicleInformation", vehicleInformation, doc.id)
            });
        */
        
        const vehicleValue = document.querySelector('.user-scanned-vehicle-value')
        const userValue = document.querySelector('.user-scanned-uid-value')
        const dateValue = document.querySelector('.user-scanned-date-value')
        const fullNameValue = document.querySelector('.user-fullname-value')
        const userTypeValue = document.querySelector('.user-type-value')
        const modelValue = document.querySelector('.user-model-value')
        const plateNumValue = document.querySelector('.user-platenum-value')

        // vehicleValue.innerText = '';
        vehicleValue.src = '';
        userValue.innerText = '';
        dateValue.innerText = '';
        fullNameValue.innerText = '';
        userTypeValue.innerText = '';
        modelValue.innerText = '';
        plateNumValue.innerText = '';

        await Promise.all([docSnap, docSnap2]).then((success) => {
            console.log("All done");
            // isSuccessPersonal = false, isSuccessVehicle

            console.log('isSuccessPersonal:', isSuccessPersonal);
            console.log('isSuccessVehicle:', isSuccessVehicle);
            if((isSuccessPersonal && isSuccessVehicle) === false) {
                alert(`
                QR Code information does not exist.
                Probable cause:
                    - The user deactivated its account
                    - Fake one
                    etc.
                `);
                isSuccessPersonal = isSuccessVehicle = false;
            }
            else {
                // get Information
                const docPersonal = JSON.parse(localStorage.getItem('docPersonal'));
                const docVehicle = JSON.parse(localStorage.getItem('docVehicle'));

                console.log('docPersonal:', docPersonal);
                console.log('docVehicle:', docVehicle);
                
                console.log('docVehicle.registered_vehicle.plate:', docVehicle.registered_vehicle.plate);
                console.log('plateNumber:', plateNumber);
                
                let vehicleIndexPosition = 
                    docVehicle.registered_vehicle.plate.findIndex(e => e === plateNumber);

                console.log('vehicleIndexPosition:', vehicleIndexPosition);
                if(vehicleIndexPosition > -1) {
                    // vehicleValue.src = `${docVehicle.registered_vehicle.vehicles[vehicleIndexPosition].images[1]}`;
                    userValue.innerText = `${userUID}`;
                    dateValue.innerText = new Date().toString();
                    fullNameValue.innerText = `${docPersonal.last_name}, ${docPersonal.first_name} ${docPersonal.middle_name}`;
                    userTypeValue.innerText = docPersonal.user_type === undefined ? 'Personnel' : `${docPersonal.user_type}`;
                    // modelValue.innerText = `${docVehicle.registered_vehicle.model[vehicleIndexPosition]}`;
                    plateNumValue.innerText = `${plateNumber}`;

                    addNewLogs(userUID, 
                        `${docPersonal.last_name}, ${docPersonal.first_name} ${docPersonal.middle_name}`,
                        `${plateNumber}`);
                }
                else {
                    alert('no no no');
                }

                localStorage.removeItem('docPersonal');
                localStorage.removeItem('docVehicle');
                isSuccessPersonal = isSuccessVehicle = false;
            }
            
        }).catch((fail) => {
            console.log('cause of failure:', fail)
            alert(`
            QR Code information does not exist.
            Probable cause:
                - The user deactivated its account
                - Fake one
                etc.
            `);
            isSuccessPersonal = isSuccessVehicle = false;
        });
    } // end of function declaration

    async function addNewLogs(userUID, fullName, plateNumber) {
        const dateMS = Date.now();
        // const docData = {
        //     0: {   
        //         "userUID": userUID,
        //         "time_scanned": new Date().toString(),
        //         "time_in": fire.getServerTimestamp(),
        //         "time_out": '',
        //         "owner": fullName,
        //         "plate_number": plateNumber
        //     },
        //     'is_timeout': [false],
        //     'index': 0
        // };


        const myQuery = fire.doQuery(fire.myCollection(fire.db, 'logs'));
        fire.myOnSnapshot(myQuery, (snapshot) => {     //based on the query, //change this back!
        const unsubCollection = fire.myOnSnapshot(myQuery, (snapshot) => {     //based on the query
            // let logs = {};
            let logs = [];

            let index = 0;
            snapshot.docs.forEach((doc) => {
                let unpackData = {...doc.data()};
                let objSize = Object.keys(unpackData).length;
                Object.entries(unpackData).map((element, index) => {
                    if(objSize-1 !== index) {
                        console.log(index, element[1]);
                        index += 1; //increment
                        logs.push(element[1]);
                    }
                });
            });
            console.log(logs); 

            //Sort the data by time_scanned
            logs.sort(function(a, b) {
                return new Date(a.time_scanned) - new Date(b.time_scanned);
            });
            console.log('sorted:', logs);   //print the result

            }); //end of function
        }); //end of snapshot function
        
        // const querySnapshot = await fire.myGetDocs(q);
        // console.log('Do the querySnapshot:', querySnapshot)
        // querySnapshot.forEach((doc) => {
        //     // doc.data() is never undefined for query doc snapshots
        //     console.log(doc.id, " => ", doc.data());
        // });


        // const myQuery = query(colRef, where("authors", "==", "Rick Astley"));
        // onSnapshot(myQuery, (snapshot) => {     //based on the query, //change this back!
        // const unsubCollection = onSnapshot(myQuery, (snapshot) => {     //based on the query
        // let books = [];
        //     snapshot.docs.forEach((doc) => {
        //     books.push({ ...doc.data(), id: doc.id }); //... -> Spread, get all the data then the id
        // });
        // console.log(books); //print the book array




        // const docRefLogs = fire.myDoc(fire.db, "logs", userUID);
        // const docSnap = await fire.myGetDoc(docRefLogs);
        // //Document logs exists?
        // if (docSnap.exists()) {
        //     const selectedUserLogsData = docSnap.data();
        //     console.log("Document data:", selectedUserLogsData);
        //     console.log('currentIndex:', selectedUserLogsData.index);
        //     console.log('currentIndex:', selectedUserLogsData[selectedUserLogsData.index]);

        //     if(selectedUserLogsData[selectedUserLogsData.index] === undefined) {
        //         const docData2 = {
        //             [selectedUserLogsData.index]: {   
        //                 "userUID": userUID,
        //                 "time_scanned": new Date().toString(),
        //                 "time_in": fire.getServerTimestamp(),
        //                 "time_out": '',
        //                 "owner": fullName,
        //                 "plate_number": plateNumber
        //             },
        //         };
    
        //         await fire.myUpdateDoc(fire.myDoc(fire.db, "logs", userUID), docData2);
        //     }
        //     else {
        //         if(selectedUserLogsData[selectedUserLogsData.index].time_out === "") {
        //             // Update the time out.
    
        //             // Atomically increment the population of the city by 50.
        //             const name = `${selectedUserLogsData.index}.time_out`;
        //             console.log('name:', name)
        //             await fire.myUpdateDoc(docRefLogs, {
        //                 // `${selectedUserLogsData.index}.time_out`: new Date().toString();
        //                 [name]: new Date().toString(),
        //                 index: fire.doIncrement(1)
        //             });
        //         }
        //         // await fire.myUpdateDoc(fire.myDoc(fire.db, "logs", userUID), docData);
        //     }
        // }
        // else {
        //     console.log("No such document!");

        //     const docData = {
        //         0: {   
        //             "userUID": userUID,
        //             "time_scanned": new Date().toString(),
        //             "time_in": fire.getServerTimestamp(),
        //             "time_out": '',
        //             "owner": fullName,
        //             "plate_number": plateNumber
        //         },
        //         'index': 0
        //     };

        //     await fire.doSetDoc(fire.myDoc(fire.db, "logs", userUID), docData);
        // }




        // await fire.myAddDoc(fire.myCollection(fire.db, "logs", userUID), docData);
        // await fire.myAddDoc(fire.myCollection(fire.db, "logs", userUID), docData);

        // const docRef = fire.myDoc(fire.db, "logs", userUID, "time_out", dateMS);
        // await fire.doSetDoc(docRef, { 
        //     "userUID": userUID,
        //     "time_scanned": new Date().toString(),
        //     "time_in": fire.getServerTimestamp(),
        //     "owner": fullName,
        //     "plate_number": plateNumber
        // });

        // ##### Subcollection implementation #####
        // const docRef = fire.myDoc(fire.db, "logs", userUID);
        // await fire.myUpdateDoc(docRef, {
        //     operations: fire.doArrayUnion(0)
        // });

        // const colRef = fire.myCollection(docRef, "time-in");
        // fire.myAddDoc(colRef, {
        //     [dateMS]: {
        //         "userUID": userUID,
        //         "time_scanned": new Date().toString(),
        //         "time_in": fire.getServerTimestamp(),
        //         "owner": fullName,
        //         "plate_number": plateNumber
        //     }
        // });
        // const colRef2 = fire.myCollection(docRef, "time-out");
        // fire.myAddDoc(colRef2, {
        // });

        // await fire.myUpdateDoc(fire.myDoc(fire.db, "logs", userUID), docData);
        console.log(Date.now())

        // Add a new document with a generated id.
        // const dateMS = Date.now();
        // const docRef = await fire.myAddDoc(fire.myCollection(fire.db, "logs", userUID), {
        //     [dateMS]: {   
        //         "userUID": [userUID],
        //         "time_scanned": new Date().toString(),
        //         "time_in": fire.getServerTimestamp(),
        //         "time_out": '',
        //         "owner": fullName,
        //         "plate_number": plateNumber
        //     }
        // });
        // console.log("Document written with ID: ", docRef.id);
    } //end of function, addNewLogs

    // QR Scanner
    document.addEventListener("DOMContentLoaded", (e) => {
        $('option[value="default-style"]').prop( 'selected', 'selected' );
        $('option[value="original"]').prop( 'selected', 'selected' );
        $('option[value="environment"]').prop( 'selected', 'selected' );
    
    
        const video = document.getElementById("qr-video");
        const videoContainer = document.getElementById("video-container");
        const camHasCamera = document.getElementById("cam-has-camera");
        const camList = document.getElementById("cam-list");
        const camHasFlash = document.getElementById("cam-has-flash");
        const flashToggle = document.getElementById("flash-toggle");
        const flashState = document.getElementById("flash-state");
        const camQrResult = document.getElementById("cam-qr-result");
        const camQrResultTimestamp = document.getElementById(
        "cam-qr-result-timestamp"
        );
        const fileSelector = document.getElementById("file-selector");
        const fileQrResult = document.getElementById("file-qr-result");
        
    
        // setResult if the QR scan was successful
        function setResult(label, result) {
            let qrResultData = JSON.parse(result.data); //turn it into JSON hehehe

            console.log(result.data);
            console.log(qrResultData);

            label.textContent = result.data;
            camQrResultTimestamp.textContent = new Date().toString();
            label.style.color = "teal";
            clearTimeout(label.highlightTimeout);
            label.highlightTimeout = setTimeout(
                () => (label.style.color = "inherit"),
                100
            );
            scanner.stop();
            document.querySelector("#placeholder").style.display = "flex";
            document.querySelector("#video-container").style.display = "none";

            fetchInformation(qrResultData.uid, qrResultData.plate_number);
        }
    
        // ####### Web Cam Scanning #######
    
        const scanner = new QrScanner(
        video,
        (result) => setResult(camQrResult, result),
        {
            onDecodeError: (error) => {
            camQrResult.textContent = error;
            camQrResult.style.color = "inherit";
            },
            highlightScanRegion: true,
            highlightCodeOutline: true,
        }
        );
    
        const updateFlashAvailability = () => {
        scanner.hasFlash().then((hasFlash) => {
            camHasFlash.textContent = hasFlash;
            flashToggle.style.display = hasFlash ? "inline-block" : "none";
        });
        };
    
        scanner.start().then(() => {
    
            document.querySelector("#video-container").style.display = "grid";
            document.querySelector("#placeholder").style.display = "none";
    
            updateFlashAvailability();
            // List cameras after the scanner started to avoid listCamera's stream and the scanner's stream being requested
            // at the same time which can result in listCamera's unconstrained stream also being offered to the scanner.
            // Note that we can also start the scanner after listCameras, we just have it this way around in the demo to
            // start the scanner earlier.
            QrScanner.listCameras(true).then((cameras) =>
            cameras.forEach((camera) => {
                const option = document.createElement("option");
                option.value = camera.id;
                option.text = camera.label;
                camList.add(option);
            })
            );
        })
        .catch((fail) => {
            console.log("You denied the permission to activate your camera.");
            console.log(
            "You can do file upload instead or allow the camera permission on your browser settings."
            );
    
            document.querySelector(
            ".message"
            ).innerText = `You denied the permission to activate your camera.
            You can do file upload instead or allow the camera permission on your browser settings.`;
    
            document.querySelector("#camera-icon").style.background =
            "url('https://api.iconify.design/humbleicons/camera-off.svg?color=white') no-repeat center center / contain";
            // background: url('https://api.iconify.design/humbleicons/camera-off.svg?color=white') no-repeat center center / contain;
        });
    
        QrScanner.hasCamera().then(
        (hasCamera) => (camHasCamera.textContent = hasCamera)
        );
    
        // for debugging
        window.scanner = scanner;
    
    
        document.getElementById("scan-region-highlight-style-select")
        .addEventListener("change", (e) => {
            videoContainer.className = e.target.value;
            scanner._updateOverlay(); // reposition the highlight because style 2 sets position: relative
        });
    
        document.getElementById("show-scan-region").addEventListener("change", (e) => {
            const input = e.target;
            const label = input.parentNode;
            label.parentNode.insertBefore(scanner.$canvas, label.nextSibling);
            scanner.$canvas.style.display = input.checked ? "block" : "none";
        });
    
        document.getElementById("inversion-mode-select").addEventListener("change", (event) => {
            scanner.setInversionMode(event.target.value);
        });
    
        camList.addEventListener("change", (event) => {
            scanner.setCamera(event.target.value).then(updateFlashAvailability);
        });
    
        flashToggle.addEventListener("click", () => { 
            scanner.toggleFlash().then(() => 
                (flashState.textContent = scanner.isFlashOn() ? "on" : "off")
            );
        });
    
        document.getElementById("start-button").addEventListener("click", () => {
            scanner.start();
            document.querySelector("#video-container").style.display = "grid";
            document.querySelector("#placeholder").style.display = "none";
        });
    
        document.getElementById("stop-button").addEventListener("click", () => {
            scanner.stop();    
            document.querySelector("#placeholder").style.display = "flex";
            document.querySelector("#video-container").style.display = "none";
        });
    
        // document.getElementById("start-button").click();
        
        // ####### File Scanning #######
    
        // fileSelector.addEventListener('change', event => {
        //     const file = fileSelector.files[0];
        //     if (!file) {
        //         return;
        //     }
        //     QrScanner.scanImage(file, { returnDetailedScanResult: true })
        //         .then(result => setResult(fileQrResult, result))
        //         .catch(e => setResult(fileQrResult, { data: e || 'No QR code found.' }));
        // });
    }); //end of DOMContentLoaded, QR Scanner





}

