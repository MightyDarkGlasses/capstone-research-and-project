import * as fire from "../src/index";




let windowLocation = window.location.pathname;
window.addEventListener('DOMContentLoaded', () => {

// console.log(JSON.parse(localStorage.currentUser).uid);

if(windowLocation.indexOf("user-logs") > -1) {
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

    fire.getOnAuthStateChanged(fire.auth, (user) => {
        if (user) {
            // console.log('current logged user id: ', fire.auth);
            // console.log('current logged user id: ', fire.auth.currentUser.uid);
            displayLogs(fire.auth.currentUser.uid);
        } 
        else {
            // User is signed out
            alert('Error: User is not logged in');
        }
    });

    
}
}); //end DOMContentLoaded
