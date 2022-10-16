import * as fire from "../src/index";

console.log('logs4.js');


let windowLocation = window.location.pathname;
window.addEventListener('DOMContentLoaded', () => {

// console.log(JSON.parse(localStorage.currentUser).uid);

if(windowLocation.indexOf("user-logs") > -1) {
    // const myQuery = fire.doQuery(fire.myCollection(fire.db, 'logs', JSON.parse(localStorage.currentUser).uid));
    const docReference = fire.myDoc(fire.db, "logs", JSON.parse(localStorage.currentUser).uid);

    fire.myOnSnapshot(docReference, (doc) => {
        console.log("getLogs", doc.data(), doc.id);
        
        let logs = [];
        let logsInformation = {...doc.data()};
        let objSize = Object.keys(logsInformation).length;

        // t.setSeconds(secs);
        // console.log(logsInformation);
        Object.entries(logsInformation).map((element, index) => {
            if(objSize-1 !== index) {
                // console.log('time_in:', new Date(element[1]['time_in']['seconds']).toLocaleString('en-GB',{timeZone:'UTC'}));
                element[1]['time_in'] = new Date(element[1]['time_in']['seconds']).toLocaleString('en-GB',{timeZone:'UTC'})

                
                element[1]['time_out'] = element[1]['time_out'] === '' ? '' : new Date(element[1]['time_out']).toLocaleString('en-GB',{timeZone:'UTC'})
                console.log(index, element[1]);
                logs.push(element[1]);
            }
        });
        console.log(logs);

        jQuery((e) => {
            console.log("DataTable");
            $("#table_id").DataTable({
                scrollX: true,
                "data": logs,
                "columns": [
                    {"data": "time_in"},
                    {"data": "time_out"},
                    {"data": "plate_number"},
                    {"data": "owner"},
                ]
            });
        });
    });


    // fire.myOnSnapshot(myQuery, (snapshot) => {     //based on the query, //change this back!
    // const unsubCollection = fire.myOnSnapshot(myQuery, (snapshot) => {     //based on the query
    //     let logs = [];
    //     let index = 0;
    //     snapshot.docs.forEach((doc) => {
    //         let unpackData = {...doc.data()};
    //         let objSize = Object.keys(unpackData).length;
    //         Object.entries(unpackData).map((element, index) => {
    //             if(objSize-1 !== index) {
    //                 console.log(index, element[1]);
    //                 index += 1; //increment
    //                 logs.push(element[1]);
    //             }
    //         });
    //     });
    //     console.log(logs); 
    
    //     //Sort the data by time_scanned
    //     logs.sort(function(a, b) {
    //         return new Date(a.time_scanned) - new Date(b.time_scanned);
    //     });
    //     console.log('sorted:', logs);   //print the result
    
    
    
    //     let textFileGenerator = '';
    
    //     jQuery((e) => {
    //         console.log("DataTable");
    //         $("#table_id").DataTable({
    //             scrollX: true,
    //             "data": logs,
    //             "columns": [
    //                 {"data": "time_in"},
    //                 {"data": "time_out"},
    //             ]
    //         });
    //     });
    
    
    
    //     }); //end of function
    // }); //end of snapshot function
    
}
}); //end DOMContentLoaded
