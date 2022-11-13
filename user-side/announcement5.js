import * as fire from "../src/index";



let windowLocation = window.location.pathname;
window.addEventListener('DOMContentLoaded', async () => {
if(windowLocation.indexOf("user-announcement") > -1) {
    console.log('announcement5.js');
    
    
    const colRef = fire.myCollection(fire.db, "announcements");
    const linkagesQuery = fire.doQuery(colRef, fire.doLimit(10));
    const docsSnap = await fire.myGetDocs(linkagesQuery);

    let index = 0;
    docsSnap.forEach(async doc => {
        index = index + 1;
        let myData = doc.data();
        console.log("data", myData, index);
        
        const announcements = document.querySelector('.announcements');
        const toggleAnnouncement = 
        `<div class="toggle-announcements" data="announcements-toggle${index}">
            <div class="toggle-title">
                <div class="circle"></div>
                <p>${myData.title}</p>
            </div>
            <div>
                <p>${myData.posted_on}</p>
                <div class="dropdown"></div>
            </div>
        </div>
        `;
        // announcements.insertAdjacentElement('beforeend', toggleAnnouncement);
        $('.announcements').append(toggleAnnouncement)

        let listOfSources = '';
        myData.sources.forEach((data) => {
            listOfSources += `<li><a href="${data}">${data}</a></li>`
        });
        
        let listOfFiles = '';
        myData.files.forEach((data) => {
            let httpsReference = fire.myRef(fire.storage, data).name;
            listOfFiles += `<li><a href="${data}">${httpsReference}</a></li>`
        });
        console.log(listOfSources);
        console.log(listOfFiles);
        
        const toggleAnnouncementDetails =
        `
        <div class="announcements-info" id="announcements-toggle${index}" style="display: none;">
            <div>
                <div class="announcement-priority">${myData.priority}</div>
                <p class="announcements-headline">${myData.title}</p>
                <p class="announcements-timestamp">${myData.posted_on}</p>
                <p class="announcements-person">${myData.posted_by}</p>
            </div>
            <div class="annoucements-main-container">
                <div class="announcements-container">
                        <p class="announcements-message">
                            ${myData.message}
                        </p>
                        <ul class="announcements-sources">
                           ${listOfSources}
                        </ul>
                        <ul class="announcements-file">
                            ${listOfFiles}
                        </ul>
                </div>
                <div>
                    <img class="announcement-thumbnail" src="${myData.thumbnail}" alt="announcement thumbnail">
                </div>
            </div>
        </div>
        `;
        $('.announcements').append(toggleAnnouncementDetails);


        

        
        // const priorityNode = document.createElement("div");
        // const priorityAttr = document.createAttribute("class");
        // priorityAttr.value = "announcement-priority";
        // priorityNode.setAttribute(priorityAttr);

        // const headlineNode = document.createElement("p");
        // const headlineAttr = document.createAttribute("class");
        // headlineAttr.value = "announcement-headline";
        // headlineNode.setAttribute(headlineAttr);

        // const timestampNode = document.createElement("p");
        // const timestampAttr = document.createAttribute("class");
        // timestampAttr.value = "announcement-timestamp";
        // timestampNode.setAttribute(timestampAttr);
        
        // const personNode = document.createElement("p");
        // const personAttr = document.createAttribute("class");
        // personAttr.value = "announcement-person";
        // personNode.setAttribute(personAttr);

    });

    document.querySelectorAll('.toggle-announcements').forEach((element) => {
        // console.log(element.getAttribute("data"));
        const attr = element.getAttribute("data");
        console.log(attr);
        element.addEventListener('click', () => {
            $('#' + attr).animate({
                opacity: "toggle",
                height: "toggle"
            }, 250, 'linear', () => {
                // animation complete
            });
            console.log(attr)
        });
    });

    $(`#announcements-toggle1`).on('click', () => {
        console.log(`toggle1`);
    });
    $(`#announcements-toggle2`).on('click', () => {
        console.log(`toggle2`);
    });

    // const colRef = fire.myCollection(fire.db, "vehicle-information");
    // const vehicleQuery = fire.doQuery(colRef, fire.doLimit(10));

    // const docsSnap = await fire.myGetDocs(vehicleQuery);
    // docsSnap.forEach(doc => {
    //     let myData = doc.data();
    //     // console.log("data", doc.id);

    //     const vehicle = Object.keys(myData)
    //         .filter((key) => key !== "vehicle_length")
    //         // .filter((key) => key.includes("Name"))
    //         .reduce((obj, key) => {
    //             return Object.assign(obj, {
    //             [key]: myData[key]
    //         });
    //     }, 
    //     {});

    //     const vehicleKeys = Object.keys(myData);
    //     vehicleKeys.forEach((data, index) => {
    //         if(data !== "vehicle_length") {
    //             const entry = vehicle[data];
    //             // Id, Plate, Vehicle Owner, Vehicle(Images), Model, QR Code, Use Types

    //             if(typeof(entry.qrCode) === "object") {
    //                 entry.qrCode = entry.qrCode.toString();
    //             }
    //             console.table([doc.id, data, entry.images[1], entry.model[0], entry.qrCode, entry.use_types]);
    //         }
    //     });    
    // });


    
   
    // var obje = {
    //     "vehicle_length": 3,
    //     "BBC3355": {
    //         "model": [
    //             "Random Model"
    //         ],
    //         "use_types": "Private",
    //         "qrCode": "https://firebasestorage.googleapis.com/v0/b/bulsu---pms.appspot.com/o/vehicle-information%2FwIHQmo7nxwceS5dBgma6ukXl2Py1%2F5%2FqrCode0.PNG?alt=media&token=d109a02f-03e0-4234-b964-0009a9894b21",
    //         "images": [
    //             "https://firebasestorage.googleapis.com/v0/b/bulsu---pms.appspot.com/o/vehicle-information%2FwIHQmo7nxwceS5dBgma6ukXl2Py1%2F5%2FvehicleFront.PNG?alt=media&token=b6f7b624-d734-4d6e-837a-522b6deceaed",
    //             "https://firebasestorage.googleapis.com/v0/b/bulsu---pms.appspot.com/o/vehicle-information%2FwIHQmo7nxwceS5dBgma6ukXl2Py1%2F5%2FvehicleRear.PNG?alt=media&token=66171e74-42b2-46b4-a3a6-36335fb92d63"
    //         ],
    //         "createdAt": {
    //             "seconds": 1666692389,
    //             "nanoseconds": 158000000
    //         }
    //     },
    //     "ABC2233": {
    //         "qrCode": "https://firebasestorage.googleapis.com/v0/b/bulsu---pms.appspot.com/o/vehicle-information%2FwIHQmo7nxwceS5dBgma6ukXl2Py1%2F2%2FqrCode0.PNG?alt=media&token=e3fc2013-2b7c-4ec1-ae25-69204f3805d5",
    //         "use_types": "Private",
    //         "images": [
    //             "https://firebasestorage.googleapis.com/v0/b/bulsu---pms.appspot.com/o/vehicle-information%2FwIHQmo7nxwceS5dBgma6ukXl2Py1%2F2%2FvehicleFront.PNG?alt=media&token=70a35486-83e3-48bf-a7c8-9d10ec5df8cb",
    //             "https://firebasestorage.googleapis.com/v0/b/bulsu---pms.appspot.com/o/vehicle-information%2FwIHQmo7nxwceS5dBgma6ukXl2Py1%2F2%2FvehicleRear.PNG?alt=media&token=e1960eae-438d-452c-b7eb-6e166d1ad326",
    //             "https://firebasestorage.googleapis.com/v0/b/bulsu---pms.appspot.com/o/vehicle-information%2FwIHQmo7nxwceS5dBgma6ukXl2Py1%2F2%2FvehicleSide.PNG?alt=media&token=fbaf17d8-2ee3-423d-a359-dc55edec783f"
    //         ],
    //         "createdAt": {
    //             "seconds": 1666678432,
    //             "nanoseconds": 113000000
    //         },
    //         "model": [
    //             "Random Model"
    //         ]
    //     },
    //     "BCD1133": {
    //         "use_types": "Private",
    //         "createdAt": {
    //             "seconds": 1666691576,
    //             "nanoseconds": 221000000
    //         },
    //         "model": [
    //             "Random Model"
    //         ],
    //         "qrCode": "https://firebasestorage.googleapis.com/v0/b/bulsu---pms.appspot.com/o/vehicle-information%2FwIHQmo7nxwceS5dBgma6ukXl2Py1%2F4%2FqrCode0.PNG?alt=media&token=30f6520b-7621-45f7-9701-c362565ba138",
    //         "images": [
    //             "https://firebasestorage.googleapis.com/v0/b/bulsu---pms.appspot.com/o/vehicle-information%2FwIHQmo7nxwceS5dBgma6ukXl2Py1%2F4%2FvehicleFront.PNG?alt=media&token=ac97e8fa-9ab0-43d9-850d-2faebe628fe0",
    //             "https://firebasestorage.googleapis.com/v0/b/bulsu---pms.appspot.com/o/vehicle-information%2FwIHQmo7nxwceS5dBgma6ukXl2Py1%2F4%2FvehicleRear.PNG?alt=media&token=9746c04b-5737-4082-ac42-a049e27f9010",
    //             "https://firebasestorage.googleapis.com/v0/b/bulsu---pms.appspot.com/o/vehicle-information%2FwIHQmo7nxwceS5dBgma6ukXl2Py1%2F4%2FvehicleSide.png?alt=media&token=53c4277d-523a-4f77-9df6-4acae1414425"
    //         ]
    //     }
    // }
    
    // const vehicle = Object.keys(obje)
    //     .filter((key) => key !== "vehicle_length")
    //     .reduce((obj, key) => {
    //         return Object.assign(obj, {
    //         [key]: obje[key]
    //     });
    // }, 
    // {});
}
});