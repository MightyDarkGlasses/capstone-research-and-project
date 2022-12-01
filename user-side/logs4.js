import * as fire from "../src/index";




let windowLocation = window.location.pathname;

window.addEventListener('DOMContentLoaded', () => {

// console.log(JSON.parse(localStorage.currentUser).uid);

if(windowLocation.indexOf("user-logs") > -1) {
    console.log("theme: ", localStorage.getItem("theme"));
    console.log("theme undefined: ", localStorage.getItem("theme") === null);

    if(localStorage.getItem("theme") === "light") {
        document.querySelector("#system-theme1").setAttribute("href", "user-home-light.css");
        document.querySelector("#system-theme2").setAttribute("href", "user-home-mods-light.css");
        document.querySelector("#system-theme3").setAttribute("href", "user-logs-light.css");
    }
    if(localStorage.getItem("theme") === null) {
        document.querySelector("#system-theme3").setAttribute("href", "user-logs-light.css");
    }

    // DISPLAY THE PROFILE PICTURE AND LOGS
    fire.getOnAuthStateChanged(fire.auth, (user) => {
        if (user) {
            document.querySelector("#profile-picture").setAttribute("src", localStorage.getItem("profile-picture"));
            document.querySelector(".fullname").textContent = localStorage.getItem("profile-owner");
            document.querySelector(".category").textContent = localStorage.getItem("profile-category");

            displayLogs(fire.auth.currentUser.uid);
            displayActivityLogs(fire.auth.currentUser.uid); //display logs in the table
        }
        else {
            window.location = "../login.html";
        }
    });

    // Notification, Full Screen, Logout, etc.
    function topButtons() {        
        const notif = document.querySelector(".util-icon-notif");
        const themes = document.querySelector(".util-icon-theme");
        const fullScreen = document.querySelector(".util-icon-fullscr");
        const settings = document.querySelector(".util-icon-settings");
        const logout = document.querySelector(".util-icon-logout");
        const elem = document.querySelector("html");

        fullScreen.addEventListener("click", () => {
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            } else if (elem.webkitRequestFullscreen) { /* Safari */
                elem.webkitRequestFullscreen();
            } else if (elem.msRequestFullscreen) { /* IE11 */
                elem.msRequestFullscreen();
            }
        });

        themes.addEventListener("click", () => {
            if(localStorage.getItem("theme") === "dark") {
                document.querySelector("#system-theme1").setAttribute("href", "user-home.css");
                document.querySelector("#system-theme2").setAttribute("href", "user-home-mods.css");
                document.querySelector("#system-theme3").setAttribute("href", "user-logs-light.css");
                localStorage.setItem("theme", "light");
            }
            else {
                document.querySelector("#system-theme1").setAttribute("href", "user-home-light.css");
                document.querySelector("#system-theme2").setAttribute("href", "user-home-mods-light.css");
                document.querySelector("#system-theme3").setAttribute("href", "user-logs.css");
                localStorage.setItem("theme", "dark");
            }
        });

        logout.addEventListener('click', () => {
            // console.log("this is a test.");
            // Add activity when user is logged out.
            fire.addActivity(fire.auth.currentUser.uid, fire.listOfUserLevels[0], fire.listOfPages["auth_login"], fire.listOfActivityContext["user_logout"])
            .then((success) => {
                fire.logoutUser();
                localStorage.clear();
                window.location = '../login.html';
            });
        });
    }
    topButtons();

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
                    element[1]['time_in']['timestamp'] = element[1]['time_in']['timestamp'] === '' ? '' : element[1]['time_in']['timestamp'].toDate().toLocaleString() + " Gate #" + element[1]['time_in']['gate_number'];
                    element[1]['time_out']['timestamp'] = element[1]['time_out']['timestamp'] === '' ? '' : element[1]['time_out']['timestamp'].toDate().toLocaleString() + " Gate #" + element[1]['time_in']['gate_number'];
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


    // document.querySelector(".user-activity").style.display = 'none';
    // $('.user-activity').animate({
    //     opacity: "toggle",
    //     height: "toggle"
    // }, 250, 'linear', () => {
    //     // animation complete
    // });

    // document.querySelector("#site-logs").addEventListener("click", () => {
    //     // document.querySelector(".user-activity").style.display = 'none';
    //     // document.querySelector(".user-logs").style.display = 'block';

    //     $('.user-activity').animate({
    //         opacity: "toggle",
    //         height: "toggle"
    //     }, 250, 'linear', () => {
    //         // animation complete
    //     });

    //     $('.user-logs').animate({
    //         opacity: "toggle",
    //         height: "toggle"
    //     }, 250, 'linear', () => {
    //         // animation complete
    //     });
    // });
    // document.querySelector("#site-activities").addEventListener("click", () => {
    //     // document.querySelector(".user-activity").style.display = 'block';
    //     // document.querySelector(".user-logs").style.display = 'none';

    //     $('.user-activity').animate({
    //         opacity: "toggle",
    //         height: "toggle"
    //     }, 250, 'linear', () => {
    //         // animation complete
    //     });

    //     $('.user-logs').animate({
    //         opacity: "toggle",
    //         height: "toggle"
    //     }, 250, 'linear', () => {
    //         // animation complete
    //     });
    // });
    
}
}); //end DOMContentLoaded
