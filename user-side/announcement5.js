import * as fire from "../src/index";



let windowLocation = window.location.pathname;
window.addEventListener('DOMContentLoaded', async () => {
if(windowLocation.indexOf("user-announcement") > -1) {

    if(localStorage.getItem("theme") === "light") {
        document.querySelector("#system-theme1").setAttribute("href", "user-home-light.css");
        document.querySelector("#system-theme2").setAttribute("href", "user-home-mods-light.css");
        document.querySelector("#system-theme3").setAttribute("href", "user-announcement.css");
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
            console.log("my theme clicked", localStorage.getItem("theme"));
            if(localStorage.getItem("theme") == "dark") {
                console.log("my theme clicked", `localStorage.getItem("theme") == "light"`);
                document.querySelector("#system-theme1").setAttribute("href", "user-home-light.css");
                document.querySelector("#system-theme2").setAttribute("href", "user-home-mods-light.css");
                document.querySelector("#system-theme3").setAttribute("href", "user-announcement.css");
                localStorage.setItem("theme", "light");
            }
            else if(localStorage.getItem("theme") == "light" || localStorage.getItem("theme") === null) {
                console.log("my theme clicked", `localStorage.getItem("theme") == "dark" or null`);
                document.querySelector("#system-theme1").setAttribute("href", "user-home.css");
                document.querySelector("#system-theme2").setAttribute("href", "user-home-mods.css");
                document.querySelector("#system-theme3").setAttribute("href", "user-announcement-light.css");
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



    let index = 0;

    async function displayAnnouncement() {
        console.log("first first first first")
        const colRef = fire.myCollection(fire.db, "announcements");
        const linkagesQuery = fire.doQuery(colRef, fire.doLimit(10));
        const docsSnap = await fire.myGetDocs(linkagesQuery);
        const announcements = document.querySelector('.announcements');
        

        console.log("index::::::::::", docsSnap.size);
        docsSnap.forEach(async (doc) => {
            
            console.log(`id="announcements-toggle${index}"`)
            let myData = doc.data();
            console.log("data", myData.title, index);
    
            const imageRef = fire.myRef(fire.storage, `announcements/thumbnail/${myData.title}/profilepic.jpg`);
            fire.myGetDownloadURL(imageRef).then((url) => {
                index = index + 1;
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
    
                let listOfSources = myData.sources;
                // If there are no sources given
                if(listOfSources === '' || listOfSources === null || listOfSources.length === undefined) {
                    listOfSources = "<p style='color: rgba(255,255,255,.75)><i>No sources.</i></p>"
                    listOfSources = "<p><i>No sources.</i></p>"
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
                    <div class="annoucements-main-container">
                        <div class="announcements-container">
                                <p class="announcements-message">
                                    ${myData.message}
                                </p>
                                <ul class="announcements-sources">
                                ${listOfSources}
                                </ul>
                        </div>
                        <div>
                            <img class="announcement-thumbnail" src="${url}" alt="announcement thumbnail">
                        </div>
                    </div>
                </div>`;
    
                $('.announcements').append(toggleAnnouncementDetails);
                
            });
        }); //end of foreach

        let timeout;
        let num = 0;
        function fun() {
            timeout = setInterval(() => {
                if(document.querySelectorAll('.toggle-announcements').length == docsSnap.size) {
                    console.log("stooped")
                    console.log(document.querySelectorAll('.toggle-announcements'));
                    document.querySelectorAll('.toggle-announcements').forEach((element, index) => {
                        console.log(element.getAttribute("data"));
                        const attr = element.getAttribute("data");
                        console.log(attr);
                        element.addEventListener('click', () => {
                            $(`#announcements-toggle${index+1}`).animate({
                                opacity: "toggle",
                                height: "toggle"
                            }, 250, 'linear', () => {
                                // animation complete
                            });
                            console.log(attr);
                
                        });
                    });

                    stop();
                }
                else {
                    console.log("watig")
                }
            }, 100);
        }

        function stop() {
            clearInterval(timeout);
        }
        fun();
        // console.log(document.querySelectorAll('.toggle-announcements'));
    }
    // displayAnnouncement();

    
    
}


// ### Display User Information Table
if(windowLocation.indexOf("user-announcement") > -1) {
    console.log('announcement5.js');

    let dataVehicle = [];
    const colRef = fire.myCollection(fire.db, "vehicle-information");
    const vehicleQuery = fire.doQuery(colRef);

    let currentIndex = 0;
    let countVehicle = 1;

    const docsSnap = await fire.myGetDocs(vehicleQuery);
    docsSnap.forEach(async doc => {
        
        let vehicleData = {...doc.data()};
        let appendData = {'a': ''};

        let vehicle = Object.keys(vehicleData)
            .filter((key) => key !== "vehicle_length")
            // .filter((key) => key.includes("Name"))
            .reduce((obj, key) => {
                return Object.assign(obj, {
                [key]: vehicleData[key]
            });
        }, 
        {});

        // vehicle.filter((data) => {
        //     return data.is_vehicle_verified !== null || data.is_vehicle_verified !== undefined
        // });
        // console.log("vehicle list: ", vehicle)

        let ownerFullName = '';
        let ownerProfilePic = '';

        await getAccountInformationOwner(doc.id).then(evt => {
            // If middle name is undefined
            if(typeof(evt['middle_name']) === 'undefined' || evt['middle_name'].trim() === '') {
                console.log(true)
                evt['middle_name'] = ' ';
            }

            // appendData['vehicle_owner'] = `${evt['last_name']} ${evt['first_name']} ${evt['middle_name'][0]}`;
            ownerFullName = `${evt['last_name']} ${evt['first_name']} ${evt['middle_name'][0]}`;

            // Check the profile picture.
            if(typeof(evt['profile_pic']) === 'undefined' || evt['profile_pic'] === null) {
                // appendData['profile_pic'] = 'https://firebasestorage.googleapis.com/v0/b/bulsu---pms.appspot.com/o/placeholders%2Fprofile-circled.svg?alt=media&token=5d172c80-6cc4-4ddd-841b-8877a6813010';
                ownerProfilePic = 'https://firebasestorage.googleapis.com/v0/b/bulsu---pms.appspot.com/o/placeholders%2Fprofile-circled.svg?alt=media&token=5d172c80-6cc4-4ddd-841b-8877a6813010';
            }
            else {
                // appendData['profile_pic'] = evt['profile_pic'];
                ownerProfilePic = evt['profile_pic'];
            }
        });


        
        const vehicleKeys = Object.keys(vehicleData);
        // console.log('vehicleKeys', vehicleKeys);
        vehicleKeys.forEach((data, index) => {
            if(data !== "vehicle_length") {
                const entry = vehicle[data];
                // console.log('current entry: ', entry, ownerFullName);
                // console.log('current entry: ', ownerFullName);
                // Id, Plate, Vehicle Owner, Vehicle(Images), Model, QR Code, Use Types

                if(typeof(entry.qrCode) === "object") {
                    entry.qrCode = entry.qrCode.toString();
                }

                console.log("isVehicleVerified: ", typeof(entry.is_vehicle_verified) !== "undefined");
                // Check if the vehicle has sent verification
                if(typeof(entry.is_vehicle_verified) !== "undefined") {

                    if(entry.is_vehicle_verified === true) {
                        entry.is_vehicle_verified = "Approved";
                    }
                    else {
                        entry.is_vehicle_verified = "Rejected";
                    }

                    appendData = {
                        'index': index,
                        uid: doc.id,
                        'vehicle_owner': ownerFullName,
                        'profile_pic': ownerProfilePic,
                        'plate_number': data,
                        'model': entry.model[0],
                        'qrCode': entry.qrCode,
                        'entry': entry.use_types,
                        'verify_kyc': entry.verification_kyc,
                        'verify_receipt': entry.verification_receipt,
                        'status': entry.is_vehicle_verified,
                        'registration_date': entry.createdAt.toDate()
                    }
    
                    // Check the vehicle image
                    if(typeof(entry.images[1]) === 'undefined' || entry.images[1] === null) {
                        appendData['image'] = 'https://firebasestorage.googleapis.com/v0/b/bulsu---pms.appspot.com/o/placeholders%2Fvehicle-car-16-filled.svg?alt=media&token=8bb41423-816c-4de8-8a4c-22f597fd2b04';
                    }
                    else {
                        appendData['image'] = entry.images[1];
                    }
                    // console.log('appendData', appendData);
    
                    appendData['action'] = ''
                    appendData['index'] = countVehicle;
                    countVehicle += 1;
                    dataVehicle.push(appendData);
                }

            }
        });
        appendData = null; //delete from memory
        
        // Display the table after all the neccessary are ready.
        currentIndex = currentIndex + 1;
        // console.log('::', currentIndex, docsSnap.docs);

        console.log("dataVehicle", dataVehicle)
        if(currentIndex === docsSnap.docs.length) {
            // console.log('HAHAHA');
            // console.log('final vehicleInformation: ', dataVehicle);
            jQuery((e) => {
                console.log("DataTable");
                $("#table_vehicles").DataTable({
                    scrollX: true,
                    "data": dataVehicle,
                    "columns": [
                        {"data": "index"},
                        {"data": "uid"},
                        {
                            data: (data, type, dataToSet) => {
                                return `<img src="${data.profile_pic}" alt="profile picture" width="20" height="20">
                                ${data.vehicle_owner}`;
                            },
                        },
                        {"data": "plate_number"},
                        {
                            data: (data, type, dataToSet) => {
                                return `<img src="${data.image}" alt="profile picture" width="20" height="20">
                                ${data.model}`;
                            },
                        },
                        {"data": "registration_date"},
                        {"data": "status"},
                        {
                            data: (data, type, dataToSet) => {
                                return `
                                <button class="view-verification" receipt="${data.verify_kyc}" kyc="${data.verify_receipt}" plate="${data.plate_number}" data-key="${data.uid}">View</button>`;
                                // return `
                                // <button class="view-verification" receipt="${data.verify_kyc}" kyc="${data.verify_receipt}" plate="${data.plate_number}" data-key="${data.uid}">View</button>
                                // <button class="accept-verification" plate="${data.plate_number}" data-key="${data.uid}">Accept</button>
                                // <button class="deny-verification" plate="${data.plate_number}" data-key="${data.uid}">Deny</button>`;
                            },
                        },
                    ]
                });

                const viewVerification = document.querySelectorAll(".view-verification");
                const acceptVerification = document.querySelectorAll(".accept-verification");
                const denyVerification = document.querySelectorAll(".deny-verification");

                viewVerification.forEach((view, index) => {
                    view.addEventListener("click", () => {
                        console.log("View button: ", view.getAttribute("data-key"), " : ", view.getAttribute("plate"));

                        Swal.fire({
                            // icon: 'error',
                            title: 'Vehicle Verification',
                            // text: 'Something went wrong!',
                            html: `
                            <div class="popup-verification">
                                <div>
                                    <p>Official Receipt / Certificate of Registration</p>
                                    <img src="${view.getAttribute("kyc")}" alt="kyc"/>
                                </div> 
                                <div>
                                    <p>KYC Verification</p>
                                    <img src="${view.getAttribute("receipt")}" alt="kyc"/>
                                </div> 
                            </div>
                            `,
                            showConfirmButton: false,
                            footer: 
                            `<div>
                                <button class="popup-accept">Accept</button>
                                <button class="popup-deny">Deny</button>
                            </div>
                            `
                        });

                        
                        document.querySelector(".popup-accept").addEventListener("click", () => {
                            console.log("popup-accept");
                            console.log("uid: ", view.getAttribute("data-key"));
                            console.log("plate: ", view.getAttribute("plate"));

                            const docRefAccount = fire.myDoc(fire.db, "vehicle-information", view.getAttribute("data-key"));
                            fire.myUpdateDoc(docRefAccount, {
                                [`${view.getAttribute("plate")}.is_vehicle_verified`]: true,
                                [`${view.getAttribute("plate")}.is_vehicle_date`]: fire.getServerTimestamp()
                            }).then(() => {
                                Swal.fire({
                                    icon: 'success',
                                    title: 'Verification accepted.',
                                    // text: 'Something went wrong!',
                                });
                            });
                
                            swal.close();
                        });
                        document.querySelector(".popup-deny").addEventListener("click", () => {
                            console.log("popup-deny");
                            console.log("uid: ", view.getAttribute("data-key"));
                            console.log("plate: ", view.getAttribute("plate"));

                            const docRefAccount = fire.myDoc(fire.db, "vehicle-information", view.getAttribute("data-key"));
                            fire.myUpdateDoc(docRefAccount, {
                                [`${view.getAttribute("plate")}.is_vehicle_verified`]: fire.doDeleteField(),
                                [`${view.getAttribute("plate")}.is_vehicle_date`]: fire.getServerTimestamp()
                            }).then(() => {
                                Swal.fire({
                                    icon: 'success',
                                    title: 'Verification rejected.',
                                    // text: 'Something went wrong!',
                                });
                            });

                            swal.close();
                        });
                    })
                });

                
                // acceptVerification.forEach((accept, index) => {
                //     accept.addEventListener("click", () => {
                //         console.log("Accept button: ", accept.getAttribute("data-key"), " : ", accept.getAttribute("plate"));
                //     })
                // });
                // denyVerification.forEach((deny, index) => {
                //     deny.addEventListener("click", () => {
                //         console.log("Delete button: ", deny.getAttribute("data-key"), " : ", deny.getAttribute("plate"));
                //     })
                // });
            });
        }
        else {
            // console.log('currentIndex: ' + currentIndex)
            // console.log('currentIndex: ' + currentIndex)
        }
        // console.log(doc.id, Object.keys(vehicleData).toString(), vehicle);        
    }); //end of docSnap
    

    async function getAccountInformationOwner(userUID) {
        let vehicle = undefined;
        const docVehicleActivity = fire.myDoc(fire.db, "account-information", userUID);
        const docVSnap = await fire.myGetDoc(docVehicleActivity);
        if (docVSnap.exists()) {
            // vehicle = Object.keys(docVSnap.data()).filter((e) => {
            //     if(e !== 'vehicle_length') {
            //         return e;
            //     }
            // }).toString();
            return {...docVSnap.data()};
        }
        else {
            vehicle = "N/A";
        }
        return vehicle;
    }
    console.log(dataVehicle);
}
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