import * as fire from "../../../src/index";
import QrScanner from "./qr-scanner.min.js";

if(window.location.pathname.indexOf('securityOfficer-home') > -1) {
    console.log('QrScanner qr.js');

        // Autocomplete data

        let index = 0;
        let availableTags = [];
        async function getVisitorLogsList() {
            const colRef = fire.myCollection(fire.db, "visitor-logs");
            const visitorLogsQuery = fire.doQuery(colRef, fire.doLimit(10));
            const docsSnap = await fire.myGetDocs(visitorLogsQuery);
            

            // var availableTags = [
            //     { label: "Mathematics", value: "MATHS" },
            //     { label: "Chemistry", value: "CHEM" },
            //     { label: "Physics", value: "PHY" },
            //     { label: "English", value: "ENG" },
            //     { label: "Environmental Science", value: "EVS" }
            // ];

            
            docsSnap.forEach(async doc => {
                let visitorInfo = doc.data();
                delete visitorInfo['logs_length'];
                
                console.log('plateNumber: ', doc.id);
                Object.keys(visitorInfo).forEach((element) => {
                    // console.log('visitorInfo: ', visitorInfo);
                    let fullname = `${visitorInfo[element].last_name.trim()}, ${visitorInfo[element].first_name.trim()} ${visitorInfo[element].middle_name.trim()}`;
                    // console.log('fname: ', visitorInfo[element].first_name.trim());
                    // console.log('lname: ', visitorInfo[element].last_name.trim());
                    // console.log('mname: ', visitorInfo[element].middle_name.trim());

                    // const obj = {label: doc.id, value: fullname };
                    // console.log('obj: ', obj);

                    // console.log('some: ', availableTags.some(item => item.fullname === fullname));
                    if(!availableTags.some(item => item.fullname === fullname)) {
                        console.log('element: ', visitorInfo)
                        availableTags.push({label: `${doc.id}, ${fullname}`, 'value': fullname, 'data': visitorInfo[element]});

                    }
                    // fullname = null;
                });
                // visitorInfo.forEach((element) => {
                // });
                index = index + 1;
                if(index == docsSnap.docs.length) {
                    $( "#tags" ).autocomplete({
                        source: availableTags,
                        
                        select: function (event, ui) {
                            const selectedItem = ui.item.data;
                            console.log(selectedItem);
                            $('input[name="guest-add-fname"]').attr({'value': selectedItem.first_name});
                            $('input[name="guest-add-mname"]').attr({'value': selectedItem.middle_name});
                            $('input[name="guest-add-lname"]').attr({'value': selectedItem.last_name});
                            $('input[name="guest-add-vehiclemodel"]').attr({'value': selectedItem.vehicle_model});
                            $('input[name="guest-add-platenum"]').attr({'value': selectedItem.plate_number});



                        }
                    });

                    
                    console.log('availableTags', availableTags);
                }
            });
        }
        getVisitorLogsList();

    


    let isSuccessPersonal = false;
    let isSuccessVehicle = false;
    // const docRefSecurityOfficer = fire.myDoc(fire.db, "security", fire.auth.currentUser.uid);
    // const docSnapSecurityOfficer = await fire.myGetDoc(docRefSecurityOfficer);
    // if (docSnapSecurityOfficer.exists()) {
    //     const setOfficerName = document.querySelector('.name-sg');
    //     const securityOfficerInformation = docSnapSecurityOfficer.data();
    //     console.log('securityOfficerInformation', securityOfficerInformation);
    // }
    // else {
    //     console.log('That security officer does not exist.')
    // }


    
    async function fetchInformation(userUID, plateNumber) {
        console.log('fetchInformation: ', userUID, plateNumber);
        // Success checking
        let isSuccessPersonal = false;
        let isSuccessVehicle = false;

        const vehicleValue = document.querySelector('.user-scanned-vehicle-value');
        const userValue = document.querySelector('.user-scanned-uid-value');
        const dateValue = document.querySelector('.user-scanned-date-value');
        const fullNameValue = document.querySelector('.user-fullname-value');
        const userTypeValue = document.querySelector('.user-type-value');
        const modelValue = document.querySelector('.user-model-value');
        const plateNumValue = document.querySelector('.user-platenum-value');

        // vehicleValue.innerText = '';
        // vehicleValue.src = '';
        userValue.innerText = '';
        dateValue.innerText = '';
        fullNameValue.innerText = '';
        userTypeValue.innerText = '';
        modelValue.innerText = '';
        plateNumValue.innerText = '';

        // Google Firebase
        // console.log('fetchInformation:', userUID, plateNumber)
        console.log('security officer qrscanning.js');
        const docRefAccountInfo = fire.myDoc(fire.db, "account-information", userUID);
        const docRefVehicleInfo = fire.myDoc(fire.db, "vehicle-information", userUID);

        const docSnapAccount = await fire.myGetDoc(docRefAccountInfo);
        const docSnapVehicle = await fire.myGetDoc(docRefVehicleInfo);

        // console.log("Document data:", docSnapVehicle);
        // console.log(userUID, plateNumber)
        // console.log("Document data:", docSnapVehicle.data(), typeof(docSnapVehicle.data()));
        // console.log("Object keys: ", Object.keys(docSnapVehicle.data()));

        // ##### Account Information #####
        // console.log('docSnapAccount:', docSnapAccount.data());
        const specificAccountRetrieve = docSnapAccount.data();
        console.log(`${specificAccountRetrieve.last_name}, ${specificAccountRetrieve.first_name} ${specificAccountRetrieve.middle_name}`);
        // console.log(specificAccountRetrieve)
        // isSuccessPersonal = typeof(specificAccountRetrieve) === undefined ? false : true;
        
        // ##### Personal Information #####
        // Check if the account is undefined
        // console.log(specificAccountRetrieve, typeof(specificAccountRetrieve) !== undefined)
        if(typeof(specificAccountRetrieve) !== 'undefined') {
            userValue.innerText = userUID;
            dateValue.innerText = new Date();
            fullNameValue.innerText = `${specificAccountRetrieve.last_name}, ${specificAccountRetrieve.first_name} ${specificAccountRetrieve.middle_name}`;
            userTypeValue.innerText = typeof(specificAccountRetrieve.user_type) === undefined ? specificAccountRetrieve.user_type : 'Undefined';

            isSuccessPersonal = true;
        }
        else {
            console.log("Account Information: No such document!");
            isSuccessPersonal = false;
        }

        // ##### Vehicle Information #####
        // Check if the vehicle is undefined
        const specificVehicleRetrieve = docSnapVehicle.data();
        // console.log("specificVehicleRetrieve: ", specificVehicleRetrieve)
        // console.log(specificVehicleRetrieve["ABC2233"]["model"][0]);
        if(typeof(specificVehicleRetrieve) !== 'undefined') {
            let objKeys = Object.keys(specificVehicleRetrieve);
            // Check if the document id exist
            if (objKeys.includes(plateNumber)) {
                modelValue.innerText = specificVehicleRetrieve[plateNumber]["model"][0];
                plateNumValue.innerText = plateNumber;
                isSuccessVehicle = true;
            }
            else {
                console.log("No such document!");
                isSuccessVehicle = false;
            }
        }
        else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
            isSuccessVehicle = false;
        }



        await Promise.all([docSnapVehicle, docSnapAccount]).then((success) => {
            // console.log("All done");
            // isSuccessPersonal = false, isSuccessVehicle

            console.log('isSuccessPersonal:', isSuccessPersonal);
            console.log('isSuccessVehicle:', isSuccessVehicle);
            if((isSuccessPersonal && isSuccessVehicle) !== false) {
                //Popup Scanned Information

                addNewLogs(userUID, 
                    specificAccountRetrieve.last_name, 
                    specificAccountRetrieve.first_name, 
                    specificAccountRetrieve.middle_name, 
                    specificVehicleRetrieve[plateNumber]["model"][0], 
                    plateNumber, 
                    fire.auth.currentUser.uid);
                $("#ex1").modal({
                    fadeDuration: 100
                });
            }
            else {
                window.alert(`
                QR Code information does not exist.
                Probable cause:
                    - The user deactivated its account
                    - Fake one
                    etc.
                `);
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
        });
    } // end of function declaration


    //
    async function addNewLogs(userUID, lName, fName, mName, vehicleModel, plateNumber, officerUID) {
        // const dateMS = Date.now();
        const docRefLogs = fire.myDoc(fire.db, "logs", userUID);
        const docSnap = await fire.myGetDoc(docRefLogs);
        //Document logs exists?
        if (docSnap.exists()) {
            const selectedUserLogsData = docSnap.data();
            console.log("Document data:", selectedUserLogsData);
            console.log('currentIndex:', selectedUserLogsData.index);
            console.log('currentIndex:', selectedUserLogsData[selectedUserLogsData.index]);

            if(selectedUserLogsData[selectedUserLogsData.index] === undefined) {
                const docData2 = {
                    [selectedUserLogsData.index]: {
                        first_name: fName,
                        middle_name: mName,
                        last_name: lName,
                        vehicle_model: vehicleModel,
                        plate_number: plateNumber,
                        time_in: {
                            timestamp: new Date().toString(),
                            officer_uid: officerUID,
                            gate_number: $('select[name="select-gate-number"]').val(),
                        },
                        time_out: {
                            timestamp: null,
                            officer_uid: null,
                            gate_number: null,
                        },
                    }
                };
    
                await fire.myUpdateDoc(fire.myDoc(fire.db, "logs", userUID), docData2);
                alert(`${plateNumber}, ${new Date().toString()}: Vehicle Time Out.`)
            }
            else {
                if(selectedUserLogsData[selectedUserLogsData.index].time_out.timestamp === null) {
                    console.log('null', null);
                    
                    selectedUserLogsData[selectedUserLogsData.index]["time_out"] = {
                        timestamp: new Date().toString(),
                        officer_uid: officerUID,
                        gate_number: $('select[name="select-gate-number"]').val(),
                    };

                    selectedUserLogsData["index"] += 1;
                    console.log('updated:', selectedUserLogsData);

                    await fire.myUpdateDoc(docRefLogs, selectedUserLogsData);
                }
                else {
                    console.log('not null')
                }
            }
        }
        else {
            console.log("No such document!");
            console.log("reate a new log.");
            // Create a new visitor logs information object.
            const docData = {
                1: {
                    first_name: fName,
                    middle_name: mName,
                    last_name: lName,
                    vehicle_model: vehicleModel,
                    plate_number: plateNumber,
                    time_in: {
                        timestamp: new Date().toString(),
                        officer_uid: officerUID,
                        gate_number: $('select[name="select-gate-number"]').val(),
                    },
                    time_out: {
                        timestamp: null,
                        officer_uid: null,
                        gate_number: null,
                    },
                },
                index: 1
            };
            await fire.doSetDoc(docRefLogs, docData);
        }
    } //end of function, addNewLogs
    

    // // ### Display Registered User logs
    
    async function displayLogs() {
        const myQuery = fire.doQuery(fire.myCollection(fire.db, 'logs'));
        fire.myOnSnapshot(myQuery, (snapshot) => {     //based on the query, //change this back!
            const unsubCollection = fire.myOnSnapshot(myQuery, (snapshot) => {     //based on the query
                let logs = [];
                let index = 0;
                snapshot.docs.forEach((doc) => {
                    let unpackData = {...doc.data()};
                    let objSize = Object.keys(unpackData).length;
                    Object.entries(unpackData).map((element, index) => {
                        if(objSize-1 !== index) {
                            // let objectDate = new Date();
                            // let day = objectDate.getDate();
                            // let month = objectDate.getMonth() + 1;
                            // let year = objectDate.getFullYear();
                            
                            // let format1 = month + "/" + day + "/" + year;
                            // console.log(format1); // 7/23/2022

                            console.log("time_in", element[1]["time_in"]);
                            console.log("time_out", element[1]["time_out"]);
                            // console.log("time_out", element);

                            element[1]['time_in']['timestamp'] = element[1]['time_in']['timestamp'] === '' ? '' : new Date(element[1]['time_in']['timestamp']).toLocaleString('en-GB',{timeZone:'UTC'})
                            element[1]['time_out']['timestamp'] = element[1]['time_out']['timestamp'] === '' ? '' : new Date(element[1]['time_out']['timestamp']).toLocaleString('en-GB',{timeZone:'UTC'})

                            // console.log(index, element[1]);
                            // element[1]['time_in'] = Date(new Date(0).setUTCSeconds(element[1]['time_in']['seconds']));
                            // element[1]['time_out'] = element[1]['time_out'] === '' ? '' : new Date(element[1]['time_out']).toLocaleString('en-GB',{timeZone:'UTC'})

                            // .format('dddd MMM YYYY HH:mm:ss');
                            
                            index += 1; //increment
                            logs.push(element[1]);
                        }
                    });
                });
                console.log(logs); 

                //Sort the data by time_scanned
                // logs.sort(function(a, b) {
                //     return new Date(a.time_scanned) - new Date(b.time_scanned);
                // });

                // logs.sort(function(a, b) {
                //     return new Date(a.time_in.time_scanned) - new Date(b.time_in.time_scanned);
                // });
                // console.log('sorted:', logs);   //print the result

                jQuery((e) => {
                    console.log("DataTable");
                    $("#table_id").DataTable({
                        scrollX: true,
                        "pageLength": 10,
                        "data": logs,
                        "columns": [
                            {"data": "time_in.timestamp"},
                            {"data": "time_out.timestamp"},
                            {"data": (data, type, dataToSet) => {
                                return data.time_in.gate_number + ", " + data.time_out.gate_number}
                            },
                            // {"data": "time_out.officer_uid"},
                            {"data": (data, type, dataToSet) => {
                                return data.time_in.officer_uid + ", " + data.time_out.officer_uid}
                            },
                            {"data": "first_name"},
                            {"data": "last_name"},
                            {"data": "middle_name"},
                            {"data": "plate_number"},
                            {"data": "vehicle_model"},
                        ],
                        "columnDefs": [{
                            "defaultContent": "-",
                            "targets": "_all"
                        }]
                    });
                }); //jQuery
            }); //end of function
        }); //end of snapshot function
    }


    async function currentlyIn() {
        const myQueryUserLogs = fire.doQuery(fire.myCollection(fire.db, 'logs'), fire.doLimit(5));
        const myQueryVisitorLogs = fire.doQuery(fire.myCollection(fire.db, 'visitor-logs'), fire.doLimit(5));
        let logs = [];
        fire.myOnSnapshot(myQueryUserLogs, (snapshot) => {     //based on the query, //change this back!
        const unsubCollection = fire.myOnSnapshot(myQueryUserLogs, (snapshot) => {     //based on the query
            let index = 0;
            snapshot.docs.forEach((doc) => {
                let unpackData = {...doc.data()};
                let objSize = Object.keys(unpackData).length;
                Object.entries(unpackData).map((element, index) => {
                    if(objSize-1 !== index) {
                        element[1]['time_in']['timestamp'] = element[1]['time_in']['timestamp'] === '' ? '' : new Date(element[1]['time_in']['timestamp']).toLocaleString('en-GB',{timeZone:'UTC'});
                        element[1]['type'] = "Registered";
                        
                        index += 1; //increment
                        logs.push(element[1]);
                    }
                }); //end of foreach
            }); //end of snapshot
        });
        });
    
        // Visitor Logs
        fire.myOnSnapshot(myQueryVisitorLogs, (snapshot) => {     //based on the query, //change this back!
        const unsubCollection2 = fire.myOnSnapshot(myQueryVisitorLogs, (snapshot) => {     //based on the query
            let index = 0;
            snapshot.docs.forEach((doc) => {
                let unpackData = {...doc.data()};
                let objSize = Object.keys(unpackData).length;
                Object.entries(unpackData).map((element, index) => {
                    if(objSize-1 !== index) {
                        element[1]['time_in']['timestamp'] = element[1]['time_in']['timestamp'] === '' ? '' : new Date(element[1]['time_in']['timestamp']).toLocaleString('en-GB',{timeZone:'UTC'});
                        element[1]['type'] = "Visitor";
                        
                        index += 1; //increment
                        logs.push(element[1]);
                    }
                }); //end of foreach
            }); //end of snapshot

            jQuery((e) => {
                console.log("DataTable");
                $("#table_inned").DataTable({
                    scrollX: true,
                    "pageLength": 10,
                    "data": logs,
                    "columns": [
                        {"data": "time_in.timestamp"},
                        {"data": (data, type, dataToSet) => 
                            {
                                return data.time_in.gate_number;
                            }
                        },
                        {"data": (data, type, dataToSet) => 
                            {
                                return data.time_in.officer_uid;
                            }
                        },
                        {"data": "first_name"},
                        {"data": "last_name"},
                        // {"data": "middle_name"},
                        {"data": "plate_number"},
                        {"data": "vehicle_model"},
                        {"data": "type"},
                    ],
                    "columnDefs": [{
                        "defaultContent": "-",
                        "targets": "_all"
                    }]
                });
            }); //jQuery
        });
        });

    }

    // // ### Display Visitor Information logs
    async function displayVisitorLogs() {
        const myQuery = fire.doQuery(fire.myCollection(fire.db, 'visitor-logs'));
        fire.myOnSnapshot(myQuery, (snapshot) => {     //based on the query, //change this back!
            const unsubCollection = fire.myOnSnapshot(myQuery, (snapshot) => {     //based on the query
                let logs = [];
                let index = 0;
                snapshot.docs.forEach((doc) => {
                    let unpackData = {...doc.data()};
                    let objSize = Object.keys(unpackData).length;
                    Object.entries(unpackData).map((element, index) => {
                        if(objSize-1 !== index) {

                            console.log("time_in", element[1]["time_in"]);
                            console.log("time_out", element[1]["time_out"]);

                            element[1]['time_in']['timestamp'] = element[1]['time_in']['timestamp'] === '' ? '' : new Date(element[1]['time_in']['timestamp']).toLocaleString('en-GB',{timeZone:'UTC'})
                            element[1]['time_out']['timestamp'] = element[1]['time_out']['timestamp'] === '' ? '' : new Date(element[1]['time_out']['timestamp']).toLocaleString('en-GB',{timeZone:'UTC'})

                            index += 1; //increment
                            logs.push(element[1]);
                        }
                    });
                });

                jQuery((e) => {
                    console.log("DataTable");
                    $("#table_visitor").DataTable({
                        scrollX: true,
                        "pageLength": 10,
                        "data": logs,
                        "columns": [
                            {"data": "time_in.timestamp"},
                            {"data": "time_out.timestamp"},
                            {"data": (data, type, dataToSet) => {
                                return data.time_in.gate_number + ", " + data.time_out.gate_number}
                            },
                            // {"data": "time_out.officer_uid"},
                            {"data": (data, type, dataToSet) => {
                                return data.time_in.officer_uid + ", " + data.time_out.officer_uid}
                            },
                            {"data": "first_name"},
                            {"data": "last_name"},
                            {"data": "middle_name"},
                            {"data": "plate_number"},
                            {"data": "vehicle_model"},
                        ],
                        "columnDefs": [{
                            "defaultContent": "-",
                            "targets": "_all"
                        }]
                    });
                }); //jQuery
            }); //end of function
        }); //end of snapshot function
    }

    // Add Visitor Information button
    async function addVisitorInformation(officerUID, plateNumber, vehicleModel, fName, mName, lName) {
        plateNumber = plateNumber.trim().replace(" ", "").toUpperCase();
        vehicleModel = vehicleModel.trim();
        fName = fName.trim();
        mName = mName.trim();
        lName = lName.trim();

        const docRefLogs = fire.myDoc(fire.db, "visitor-logs", plateNumber);
        const docSnap = await fire.myGetDoc(docRefLogs);
        //Document logs exists?
        if (docSnap.exists()) {
            console.log("Logs already exists");

            let getVisitorInformation = docSnap.data();
            // console.log('get', getVisitorInformation[getVisitorInformation.logs_length].time_out.timestamp);

            // Check if the index is undefined, new timestamp logs
            if(getVisitorInformation[getVisitorInformation.logs_length] === undefined) {
                console.log('nope');
                const docData = {
                    [getVisitorInformation.logs_length]: {
                        first_name: fName,
                        middle_name: mName,
                        last_name: lName,
                        vehicle_model: vehicleModel,
                        plate_number: plateNumber,
                        time_in: {
                            timestamp: new Date().toString(),
                            officer_uid: officerUID,
                            gate_number: $('select[name="select-gate-number"]').val(),
                        },
                        time_out: {
                            timestamp: null,
                            officer_uid: null,
                            gate_number: null,
                        },
                    }
                };
                await fire.myUpdateDoc(docRefLogs, docData);
            }
            else {
                if(getVisitorInformation[getVisitorInformation.logs_length].time_out.timestamp === null) {
                    console.log('null', null);
    
                    getVisitorInformation[getVisitorInformation.logs_length]["time_out"] = {
                        timestamp: new Date().toString(),
                        officer_uid: officerUID,
                        gate_number: $('select[name="select-gate-number"]').val(),
                    };
                    getVisitorInformation["logs_length"] += 1;
                    console.log('updated:', getVisitorInformation);

                    await fire.myUpdateDoc(docRefLogs, getVisitorInformation);
                }
                else {
                    console.log('not null')
                }
            }

        }
        else {
            console.log("No logs")
            // Create a new visitor logs information object.
            const docData = {
                1: {
                    first_name: fName,
                    middle_name: mName,
                    last_name: lName,
                    vehicle_model: vehicleModel,
                    plate_number: plateNumber,
                    time_in: {
                        timestamp: new Date().toString(),
                        officer_uid: officerUID,
                        gate_number: $('select[name="select-gate-number"]').val(),
                    },
                    time_out: {
                        timestamp: null,
                        officer_uid: null,
                        gate_number: null,
                    },
                },
                logs_length: 1
            };
            await fire.doSetDoc(docRefLogs, docData);
            
        }
        return;
    } // end of function addVisitorInformation
    // addVisitorInformation(fire.auth.currentUser.uid, "AABBCC", "Vehicle Model", "FirstName", "MiddleName", "LastName");
    


     
    // displayLogs(); //display logs
    $('#logs-id').on('click', (e) => {
        console.log('Logs qr.js');
        displayLogs();
        displayVisitorLogs();
        currentlyIn();
    });

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

            // console.log(result.data);
            // console.log(qrResultData);

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

            // Call the fetchInformation() function to get the results.
            fetchInformation(qrResultData.uid, qrResultData.plate_number);
        }
    
        // ####### Web Cam Scanning #######
        
        // If the webcam is scanned.
        const scanner = new QrScanner(
        video,
        (result) => 
            setResult(camQrResult, result), {
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
            ).innerText = `You denied the permission to activate your camera.`;
    
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
        // ##### End of QrScanner #####

        
        // Check if the security officer is existing
        async function checkSecurityOfficerInformation(authentication) {
            // console.log(authentication);
            // console.log("fire.auth: ", fire.auth)
            const docRefSecurityOfficer = fire.myDoc(fire.db, "security", authentication.uid);
            const docSnapSecurityOfficer = await fire.myGetDoc(docRefSecurityOfficer);
            if (docSnapSecurityOfficer.exists()) {
                const securityOfficerInformation = docSnapSecurityOfficer.data();
                console.log('securityOfficerInformation', securityOfficerInformation);

                const setOfficerName = document.querySelector('.name-sg');
                setOfficerName.innerText = 
                `${securityOfficerInformation.lastname}, ${securityOfficerInformation.firstname} ${securityOfficerInformation.middlename}`
            }
            else {
                console.log('That security officer does not exist.')
            }

            console.log('select: ', $('select[name="select-gate-number"]').val());
        }

        // const auth = getAuth();
        fire.getOnAuthStateChanged(fire.auth, (user) => {
            if (user) {
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/firebase.User
                checkSecurityOfficerInformation(user);
                // addNewLogs("wIHQmo7nxwceS5dBgma6ukXl2Py1", "Mandela", "Jackson",  "F", "Vehicle Model", "ABC2233", fire.auth.currentUser.uid);
                // addVisitorInformation(user.uid, "AABBCC", "Vehicle Model", "FirstName", "MiddleName", "LastName");
            } 
            else {
                // User is signed out
                // ...
            }
        });
        
        document.querySelector('#guest-add-information').addEventListener('submit', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log("guest submit:", e);
            
            const fname = $('input[name="guest-add-fname"]').val()
            const mname = $('input[name="guest-add-mname"]').val()
            const lname = $('input[name="guest-add-lname"]').val()
            const vehicleModel = $('input[name="guest-add-vehiclemodel"]').val()
            const plateNum = $('input[name="guest-add-platenum"]').val()

            console.log($('input[name="guest-add-fname"]').val());
            console.log($('input[name="guest-add-lname"]').val());
            console.log($('input[name="guest-add-mname"]').val());
            console.log($('input[name="guest-add-vehiclemodel"]').val());
            console.log($('input[name="guest-add-platenum"]').val());
            
            addVisitorInformation(fire.auth.currentUser.uid, plateNum, vehicleModel, fname, mname, lname);
            window.alert(`${plateNum}: Information added successfully.`)
            
            // $('#ex2').modal().close();

            // click_event = new CustomEvent('click');
            // btn_element = document.querySelector('.close-modal');
            // btn_element.dispatchEvent(click_event);

            document.querySelector('.close-modal').click();
            e.target.reset();
        });
        

        // Search for recent
        // document.querySelector('#guest-search-information').addEventListener('submit', (e) => {
        //     e.preventDefault();
        //     e.stopPropagation();
        //     console.log("search submit:", e);
            

        //     $('input[name="guest-search"]').val();
        //     e.target.reset();
        // });
    }); //end of DOMContentLoaded, QR Scanner


    
}