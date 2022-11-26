import * as fire from "../src/index";




let windowLocation = window.location.pathname;
window.addEventListener('DOMContentLoaded', () => {

// console.log(JSON.parse(localStorage.currentUser).uid);

if(windowLocation.indexOf("user-logs") > -1) {

    // DISPLAY THE PROFILE PICTURE...
    fire.getOnAuthStateChanged(fire.auth, (user) => {
        if (user) {

            // Display user profile picture.
            const profilePicture = displayProfile(user.uid).then(evt => { 
                console.log("current user: ", fire.auth.currentUser)
                console.log('evt.profilePicture: ', evt);

                if(fire.auth.currentUser.photoURL !== null) {
                    document.querySelector("#profile-picture").setAttribute('src', fire.auth.currentUser.photoURL);
                }
                else {
                    document.querySelector("#profile-picture").setAttribute('src', "bulsu-logo.png");
                }

                // Set the fullname
                document.querySelector(".fullname").textContent = evt[0];

                // Set the position of user. (NAP or Faculty)
                if(typeof(evt[1]) !== "undefined" || evt[1] !== null) {
                    document.querySelector(".category").textContent = evt[1];
                }
                else {
                    document.querySelector(".category").textContent = "-";
                }
                
            });
            
            // fire.deleteUserData("Vut59fOZ1TflIsqbWgkgEzu2phN2");
            console.log('fire auth: ', fire.auth.currentUser.uid);

            // Did we download the file?
            // console.log("localStorage:", localStorage.getItem("qrCodePlaceholder"));
            if(localStorage.getItem("qrCodePlaceholder") === null || localStorage.getItem("vehicleInformation") === null) {  
                getVehicleInformation(docRefVehicle);
            }
            else {
                // console.log("I did the else.")
                myQRImage.setAttribute("src", JSON.parse(localStorage.getItem("qrCodePlaceholder")));
                myQRImage2.setAttribute("src", JSON.parse(localStorage.getItem("qrCodePlaceholder")));
                saveQR.setAttribute("onclick", `downloadImage("${JSON.parse(localStorage.getItem("qrCodePlaceholder"))}")`);
                // console.log("vehicleInformation:", localStorage.getItem("vehicleInformation"));

                vehi = JSON.parse(localStorage.getItem("vehicleInformation"));
                // console.log('vehicleInformation:', vehi);
                // displayVehicleDropdownList(vehi);
                displayVehicleDropdownList(vehi); //display the dropdown ul list, depend on number of vehicle
                displayLinkagesDropdownList(fire.auth.currentUser.uid);
                addEventsInList(vehi);  //re-add the events

                // let noQrCode = document.querySelector('.no-qr-code');
                let yesQRCode = document.querySelector('.yes-qr-code');
                yesQRCode.style.display = 'flex';
            }
        }
        else {
            window.location = "../login.html";
        }
    });
    async function displayProfile(userUID) {
        const docAccountActivity = fire.myDoc(fire.db, "account-information", userUID);
        const docVSnap = await fire.myGetDoc(docAccountActivity);
        if (docVSnap.exists()) {
            const position = docVSnap.data()["category"];

            console.log("position: ", position);
            console.log("position: ", typeof(position) !== "undefined" || position !== null);
            if(typeof(position) !== "undefined" || position !== null) {
                return [`${docVSnap.data()['last_name']}, ${docVSnap.data()['first_name']}`, position];
            }
        }
        return [`${docVSnap.data()['last_name']}, ${docVSnap.data()['first_name']}`, null];
    }

    // console.log('logs4.js');
    // const docReference = fire.myDoc(fire.db, "logs", JSON.parse(localStorage.currentUser).uid);
    // fire.myOnSnapshot(docReference, (doc) => {
    //     console.log("getLogs", doc.data(), doc.id);
        
    //     let logs = [];
    //     let logsInformation = {...doc.data()};
    //     let objSize = Object.keys(logsInformation).length;

    //     // t.setSeconds(secs);
    //     // console.log(logsInformation);
    //     Object.entries(logsInformation).map((element, index) => {
    //         if(objSize-1 !== index) {
    //             // console.log('time_in:', new Date(element[1]['time_in']['seconds']).toLocaleString('en-GB',{timeZone:'UTC'}));
    //             element[1]['time_in'] = element[1]['time_in']['seconds'];
    //             element[1]['time_out'] = element[1]['time_out'] === '' ? '' : new Date(element[1]['time_out']).toLocaleString('en-GB',{timeZone:'UTC'})
    //             console.log(index, element[1]);
    //             logs.push(element[1]);
    //         }
    //     });
    //     console.log(logs);

    //     jQuery((e) => {
    //         console.log("DataTable");
    //         $("#table_id").DataTable({
    //             scrollX: true,
    //             "data": logs,
    //             "columns": [
    //                 {"data": "time_in"},
    //                 {"data": "time_out"},
    //                 {"data": "plate_number"},
    //                 {"data": "owner"},
    //             ]
    //         });
    //     });
    // });

    // console.log('current logged user id: ', fire.auth);
    // console.log('current logged user id: ', fire.auth.currentUser.uid);

    function displayLogs(currentLoggedUserId) {
        const docReference = fire.myDoc(fire.db, "logs", currentLoggedUserId);
        fire.myOnSnapshot(docReference, (doc) => {     //based on the query, //change this back!
            let logs = [];
            let logsInformation = {...doc.data()};
            let objSize = Object.keys(logsInformation).length;

            Object.entries(logsInformation).map((element, index) => {
                if(objSize-1 !== index) {
                    element[1]['time_in']['timestamp'] = element[1]['time_in']['timestamp'] === '' ? '' : new Date(element[1]['time_in']['timestamp']).toLocaleString('en-GB',{timeZone:'UTC'});
                    element[1]['time_out']['timestamp'] = element[1]['time_out']['timestamp'] === '' ? '' : new Date(element[1]['time_out']['timestamp']).toLocaleString('en-GB',{timeZone:'UTC'});
                    logs.push(element[1]);
                }
            });

            console.log('logsInformation', logsInformation)
            
            jQuery((e) => {
                $("#table_id").DataTable({
                    scrollX: true,
                    "pageLength": 10,
                    "data": logs,
                    "columns": [
                        {"data": "time_in.timestamp"},
                        {"data": "time_out.timestamp"},
                        {"data": (data) => {
                            return data.time_in.gate_number + ", " + data.time_out.gate_number}
                        },
                        {"data": (data) => {
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
            
        }); //end of snapshot function
    }

    async function displayActivityLogs(currentLoggedUserId) {
        // const colRef = fire.myCollection(fire.db, "system-activity");
        // const activityQuery = fire.doQuery(colRef, fire.doLimit(10));
        // const docsSnap = await fire.myGetDocs(activityQuery);

        const docReference = fire.myDoc(fire.db, "system-activity", currentLoggedUserId);

        let activity = [];
        fire.myOnSnapshot(docReference, (doc) => {     //based on the query, //change this back!
            let activityInformation = {...doc.data()};
            let objSize = Object.keys(activityInformation).length;

            Object.entries(activityInformation).map((element, index) => {
                if(objSize-1 !== index) {
                    element[1]['timestamp'] = element[1]['timestamp'] === '' ? '' : new Date(element[1]['timestamp']).toLocaleString('en-GB',{timeZone:'UTC'});
                    element[1]["id"] = index;
                    activity.push(element[1]);
                }
            });

            jQuery((e) => {
                $("#table_id_activity").DataTable({
                    scrollX: true,
                    "pageLength": 10,
                    "data": activity,
                    "columns": [
                        {"data": "id"},
                        {"data": "uid"},
                        {"data": "user_level"},
                        {"data": "timestamp"},
                        {"data": "current_page"},
                        {"data": "context"},
                    ],
                    "columnDefs": [{
                        "defaultContent": "-",
                        "targets": "_all"
                    }]
                });
            }); //jQuery
        });
        console.log("activity: ", activity);

        // let index = 0;
        // let activity = [];
        // docsSnap.forEach(async doc => {
        //     index = index + 1;
        //     let activityInformation = {...doc.data()};
            
        //     let objSize = Object.keys(activityInformation).length;
        //     Object.entries(activityInformation).map((element, index) => {
        //         if(objSize-1 !== index) {
        //             element[1]['timestamp'] = element[1]['timestamp'] === '' ? '' : new Date(element[1]['timestamp']).toLocaleString('en-GB',{timeZone:'UTC'});
        //             element[1]["id"] = index;
        //             activity.push(element[1]);
        //         }
        //     });

            

        //     // console.log('activityInformation', activityInformation);
        //     console.table(activity);
        // });


    }

    fire.getOnAuthStateChanged(fire.auth, (user) => {
        if (user) {
            // console.log('current logged user id: ', fire.auth);
            // console.log('current logged user id: ', fire.auth.currentUser.uid);
            displayLogs(fire.auth.currentUser.uid);
            displayActivityLogs(fire.auth.currentUser.uid); //display logs in the table
        } 
        else {
            // User is signed out
            alert('Error: User is not logged in');
        }
    });

    document.querySelector(".user-activity").style.display = 'none';

    document.querySelector("#site-logs").addEventListener("click", () => {
        document.querySelector(".user-activity").style.display = 'none';
        document.querySelector(".user-logs").style.display = 'block';
    });
    document.querySelector("#site-activities").addEventListener("click", () => {
        document.querySelector(".user-activity").style.display = 'block';
        document.querySelector(".user-logs").style.display = 'none';
    });
    
}
}); //end DOMContentLoaded
