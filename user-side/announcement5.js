import * as fire from "../src/index";



let windowLocation = window.location.pathname;
window.addEventListener('DOMContentLoaded', async () => {
if(windowLocation.indexOf("user-announcement") > -1) {

    if(localStorage.getItem("theme") === "light") {
        document.querySelector("#system-theme1").setAttribute("href", "user-home-light.css");
        document.querySelector("#system-theme2").setAttribute("href", "user-home-mods-light.css");
        document.querySelector("#system-theme3").setAttribute("href", "user-announcement-light.css");
    }

    console.log('announcement5.js');
    // DISPLAY THE PROFILE PICTURE...
    fire.getOnAuthStateChanged(fire.auth, (user) => {
        if (user) {
            document.querySelector("#profile-picture").setAttribute("src", localStorage.getItem("profile-picture"));
            document.querySelector(".fullname").textContent = localStorage.getItem("profile-owner");
            document.querySelector(".category").textContent = localStorage.getItem("profile-category");
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
                document.querySelector("#system-theme1").setAttribute("href", "user-home-light.css");
                document.querySelector("#system-theme2").setAttribute("href", "user-home-mods-light.css");
                document.querySelector("#system-theme3").setAttribute("href", "user-announcement-light.css");
                localStorage.setItem("theme", "light");
            }
            else {
                document.querySelector("#system-theme1").setAttribute("href", "user-home.css");
                document.querySelector("#system-theme2").setAttribute("href", "user-home-mods.css");
                document.querySelector("#system-theme3").setAttribute("href", "user-announcement.css");
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
                <p>${myData.createdAt.toDate().toLocaleString()}</p>
                <div class="dropdown"></div>
            </div>
        </div>
        `;
        // announcements.insertAdjacentElement('beforeend', toggleAnnouncement);
        $('.announcements').append(toggleAnnouncement)

        let listOfSources = "<br/>" + myData.sources;
        // myData.sources.forEach((data) => {
        //     listOfSources += `<li><a href="${data}">${data}</a></li>`
        // });
        
        let listOfFiles = '';
        // myData.files.forEach((data) => {
        //     let httpsReference = fire.myRef(fire.storage, data).name;
        //     listOfFiles += `<li><a href="${data}">${httpsReference}</a></li>`
        // });
        console.log(listOfSources);
        console.log(listOfFiles);


        
        // If there are no sources given
        if(listOfSources === '') {
            listOfSources = "<p style='color: rgba(255,255,255,.75)><i>No sources.</i></p>"
            listOfSources = "<p><i>No sources.</i></p>"
        }
        

        const imageRef = fire.myRef(fire.storage, `announcements/thumbnail/${myData.title}/profilepic.jpg`);
        const fileRef1 = fire.myRef(fire.storage, `announcements/files/${myData.title}/file1`);
        const fileRef2 = fire.myRef(fire.storage, `announcements/files/${myData.title}/file2`);
        const fileRef3 = fire.myRef(fire.storage, `announcements/files/${myData.title}/file3`);

        const w = fire.myGetDownloadURL(imageRef).then((url) => {
            console.log(url);
            return url;
        });
        const x = fire.myGetDownloadURL(fileRef1).then((url) => {
            console.log("url1", url);
            return url;
        });
        const y = fire.myGetDownloadURL(fileRef2).then((url) => {
            console.log("url2", url);
            return url;
        });
        const z = fire.myGetDownloadURL(fileRef3).then((url) => {
            console.log("url3", url);
            return url;
        });

        // Isang kuhanan lang...
        z.then((returnedData) => {
            console.log("returnedData z: ", returnedData);
        });
        
        // Sabay-sabay
        Promise.all([w, x, y, z]).then((links) => {
            console.log("downloadURL: ", links);

            links.forEach((data, index) => {
                if(data !== null || typeof(data) !== "undefined" || index !== 0) {
                    listOfFiles += `<li><a href="${data}">File #${index}</a></li>`
                }
            });

            // If there are no files uplaoded
            if(listOfFiles === '') {
                listOfFiles = "<p style='color: rgba(255,255,255,.75);'><i>No files.</i></p>"
                listOfFiles = "<p><i>No files.</i></p>"
            }
            

            const toggleAnnouncementDetails =
            `
            <div class="announcements-info" id="announcements-toggle${index}" style="display: none;">
                <div>
                    <div class="announcement-priority">${myData.priority}</div>
                    <p class="announcements-headline">${myData.title}</p>
                    <p class="announcements-timestamp">${myData.createdAt.toDate().toLocaleString()}</p>
                    <p class="announcements-person">${myData.posted_by}</p>
                </div>
                <br/>
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
                        <img class="announcement-thumbnail" src="${links[0]}" alt="announcement thumbnail">
                    </div>
                </div>
            </div>
            `;
            $('.announcements').append(toggleAnnouncementDetails);
        });

        



        // console.log("imageRef: ", imageRef);
        // fire.myGetDownloadURL(imageRef).then((url) => {
        //     console.log(url);

        //     const toggleAnnouncementDetails =
        //     `
        //     <div class="announcements-info" id="announcements-toggle${index}" style="display: none;">
        //         <div>
        //             <div class="announcement-priority">${myData.priority}</div>
        //             <p class="announcements-headline">${myData.title}</p>
        //             <p class="announcements-timestamp">${myData.createdAt.toDate().toLocaleString()}</p>
        //             <p class="announcements-person">${myData.posted_by}</p>
        //         </div>
        //         <div class="annoucements-main-container">
        //             <div class="announcements-container">
        //                     <p class="announcements-message">
        //                         ${myData.message}
        //                     </p>
        //                     <ul class="announcements-sources">
        //                        ${listOfSources}
        //                     </ul>
        //                     <ul class="announcements-file">
        //                         <li>${listOfFiles}</li>
        //                     </ul>
        //             </div>
        //             <div>
        //                 <img class="announcement-thumbnail" src="${url}" alt="announcement thumbnail">
        //             </div>
        //         </div>
        //     </div>
        //     `;
        //     $('.announcements').append(toggleAnnouncementDetails);
        // }).catch((e) => {
        //     console.error("error: ", e);
        //     const toggleAnnouncementDetails =
        //     `
        //     <div class="announcements-info" id="announcements-toggle${index}" style="display: none;">
        //         <div>
        //             <div class="announcement-priority">${myData.priority}</div>
        //             <p class="announcements-headline">${myData.title}</p>
        //             <p class="announcements-timestamp">${myData.createdAt.toDate().toLocaleString()}</p>
        //             <p class="announcements-person">${myData.posted_by}</p>
        //         </div>
        //         <div class="annoucements-main-container">
        //             <div class="announcements-container">
        //                     <p class="announcements-message">
        //                         ${myData.message}
        //                     </p>
        //                     <ul class="announcements-sources">
        //                        ${listOfSources}
        //                     </ul>
        //                     <ul class="announcements-file">
        //                         ${listOfFiles}
        //                     </ul>
        //             </div>
        //             <div>
        //                 <img class="announcement-thumbnail" src="bulsu-logo.png" alt="announcement thumbnail">
        //             </div>
        //         </div>
        //     </div>
        //     `;
        //     $('.announcements').append(toggleAnnouncementDetails);
        // });



        

        
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
}


// // ### Display User Information Table
// if(windowLocation.indexOf("user-announcement") > -1) {
//     console.log('announcement5.js');

//     let dataVehicle = [];
//     const colRef = fire.myCollection(fire.db, "vehicle-information");
//     const vehicleQuery = fire.doQuery(colRef);

//     let currentIndex = 0;
//     let countVehicle = 1;

//     const docsSnap = await fire.myGetDocs(vehicleQuery);
//     docsSnap.forEach(async doc => {
        
//         let vehicleData = {...doc.data()};
//         let appendData = {'a': ''};

//         const vehicle = Object.keys(vehicleData)
//             .filter((key) => key !== "vehicle_length")
//             // .filter((key) => key.includes("Name"))
//             .reduce((obj, key) => {
//                 return Object.assign(obj, {
//                 [key]: vehicleData[key]
//             });
//         }, 
//         {});


//         let ownerFullName = '';
//         let ownerProfilePic = '';

//         await getAccountInformationOwner(doc.id).then(evt => {
//             // console.log('event: ', evt)
//             // If middle name is undefined
//             if(typeof(evt['middle_name']) === 'undefined' || evt['middle_name'].trim() === '') {
//                 console.log(true)
//                 evt['middle_name'] = ' ';
//             }

//             // appendData['vehicle_owner'] = `${evt['last_name']} ${evt['first_name']} ${evt['middle_name'][0]}`;
//             ownerFullName = `${evt['last_name']} ${evt['first_name']} ${evt['middle_name'][0]}`;


//             // Check the profile picture.
//             if(typeof(evt['profile_pic']) === 'undefined' || evt['profile_pic'] === null) {
//                 // appendData['profile_pic'] = 'https://firebasestorage.googleapis.com/v0/b/bulsu---pms.appspot.com/o/placeholders%2Fprofile-circled.svg?alt=media&token=5d172c80-6cc4-4ddd-841b-8877a6813010';
//                 ownerProfilePic = 'https://firebasestorage.googleapis.com/v0/b/bulsu---pms.appspot.com/o/placeholders%2Fprofile-circled.svg?alt=media&token=5d172c80-6cc4-4ddd-841b-8877a6813010';
//             }
//             else {
//                 // appendData['profile_pic'] = evt['profile_pic'];
//                 ownerProfilePic = evt['profile_pic'];
//             }
//         });


        
//         const vehicleKeys = Object.keys(vehicleData);
//         console.log('vehicleKeys', vehicleKeys);
//         vehicleKeys.forEach((data, index) => {
//             if(data !== "vehicle_length") {
//                 const entry = vehicle[data];
//                 // console.log('current entry: ', entry, ownerFullName);
//                 console.log('current entry: ', ownerFullName);
//                 // Id, Plate, Vehicle Owner, Vehicle(Images), Model, QR Code, Use Types

//                 if(typeof(entry.qrCode) === "object") {
//                     entry.qrCode = entry.qrCode.toString();
//                 }

//                 appendData = {
//                     'index': index,
//                     uid: doc.id,
//                     'vehicle_owner': ownerFullName,
//                     'profile_pic': ownerProfilePic,
//                     'plate_number': data,
//                     'model': entry.model[0],
//                     'qrCode': entry.qrCode,
//                     'entry': entry.use_types,
//                     'registration_date': entry.createdAt.toDate()
//                 }

//                 // Check the vehicle image
//                 if(typeof(entry.images[1]) === 'undefined' || entry.images[1] === null) {
//                     appendData['image'] = 'https://firebasestorage.googleapis.com/v0/b/bulsu---pms.appspot.com/o/placeholders%2Fvehicle-car-16-filled.svg?alt=media&token=8bb41423-816c-4de8-8a4c-22f597fd2b04';
//                 }
//                 else {
//                     appendData['image'] = entry.images[1];
//                 }
//                 console.log('appendData', appendData);

//                 appendData['action'] = ''
//                 appendData['index'] = countVehicle;
//                 countVehicle += 1;
//                 dataVehicle.push(appendData);
//             }
//         });
//         appendData = null; //delete from memory
        
//         // Display the table after all the neccessary are ready.
//         currentIndex = currentIndex + 1;
//         // console.log('::', currentIndex, docsSnap.docs);
//         if(currentIndex === docsSnap.docs.length) {
//             // console.log('HAHAHA');
//             // console.log('final vehicleInformation: ', dataVehicle);
//             jQuery((e) => {
//                 console.log("DataTable");
//                 $("#table_vehicles").DataTable({
//                     scrollX: true,
//                     "data": dataVehicle,
//                     "columns": [
//                         {"data": "index"},
//                         {"data": "uid"},
//                         {
//                             data: (data, type, dataToSet) => {
//                                 return `<img src="${data.profile_pic}" alt="profile picture" width="20" height="20">
//                                 ${data.vehicle_owner}`;
//                             },
//                         },
//                         {"data": "plate_number"},
//                         {
//                             data: (data, type, dataToSet) => {
//                                 return `<img src="${data.image}" alt="profile picture" width="20" height="20">
//                                 ${data.model}`;
//                             },
//                         },
//                         {"data": "registration_date"},
//                         {"data": "action"},
//                     ]
//                 });
//             });
//         }
//         else {
//             // console.log('currentIndex: ' + currentIndex)
//             // console.log('currentIndex: ' + currentIndex)
//         }
//         // console.log(doc.id, Object.keys(vehicleData).toString(), vehicle);        
//     }); //end of docSnap
    

//     async function getAccountInformationOwner(userUID) {
//         let vehicle = undefined;
//         const docVehicleActivity = fire.myDoc(fire.db, "account-information", userUID);
//         const docVSnap = await fire.myGetDoc(docVehicleActivity);
//         if (docVSnap.exists()) {
//             // vehicle = Object.keys(docVSnap.data()).filter((e) => {
//             //     if(e !== 'vehicle_length') {
//             //         return e;
//             //     }
//             // }).toString();
//             return {...docVSnap.data()};
//         }
//         else {
//             vehicle = "N/A";
//         }
//         return vehicle;
//     }

//     console.log(dataVehicle);
// }
/**
    <table
        id="table_vehicles"
        class="display"
        style="width: 100%">
        <thead>
            <tr>
                <th>Index</th>
                <th>ID</th>
                <th>Vehicle Owner</th>
                <th>Plate Number</th>
                <th>Model</th>
                <th>Registration Date</th>
                <th>Actions</th>
            </tr>
        </thead>
    </table>
 */




});