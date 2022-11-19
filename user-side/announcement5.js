import * as fire from "../src/index";



let windowLocation = window.location.pathname;
window.addEventListener('DOMContentLoaded', async () => {
// if(windowLocation.indexOf("user-announcement") > -1) {
//     console.log('announcement5.js');
    
    
//     const colRef = fire.myCollection(fire.db, "announcements");
//     const linkagesQuery = fire.doQuery(colRef, fire.doLimit(10));
//     const docsSnap = await fire.myGetDocs(linkagesQuery);

//     let index = 0;
//     docsSnap.forEach(async doc => {
//         index = index + 1;
//         let myData = doc.data();
//         console.log("data", myData, index);
        
//         const announcements = document.querySelector('.announcements');
//         const toggleAnnouncement = 
//         `<div class="toggle-announcements" data="announcements-toggle${index}">
//             <div class="toggle-title">
//                 <div class="circle"></div>
//                 <p>${myData.title}</p>
//             </div>
//             <div>
//                 <p>${myData.posted_on}</p>
//                 <div class="dropdown"></div>
//             </div>
//         </div>
//         `;
//         // announcements.insertAdjacentElement('beforeend', toggleAnnouncement);
//         $('.announcements').append(toggleAnnouncement)

//         let listOfSources = '';
//         myData.sources.forEach((data) => {
//             listOfSources += `<li><a href="${data}">${data}</a></li>`
//         });
        
//         let listOfFiles = '';
//         myData.files.forEach((data) => {
//             let httpsReference = fire.myRef(fire.storage, data).name;
//             listOfFiles += `<li><a href="${data}">${httpsReference}</a></li>`
//         });
//         console.log(listOfSources);
//         console.log(listOfFiles);
        
//         const toggleAnnouncementDetails =
//         `
//         <div class="announcements-info" id="announcements-toggle${index}" style="display: none;">
//             <div>
//                 <div class="announcement-priority">${myData.priority}</div>
//                 <p class="announcements-headline">${myData.title}</p>
//                 <p class="announcements-timestamp">${myData.posted_on}</p>
//                 <p class="announcements-person">${myData.posted_by}</p>
//             </div>
//             <div class="annoucements-main-container">
//                 <div class="announcements-container">
//                         <p class="announcements-message">
//                             ${myData.message}
//                         </p>
//                         <ul class="announcements-sources">
//                            ${listOfSources}
//                         </ul>
//                         <ul class="announcements-file">
//                             ${listOfFiles}
//                         </ul>
//                 </div>
//                 <div>
//                     <img class="announcement-thumbnail" src="${myData.thumbnail}" alt="announcement thumbnail">
//                 </div>
//             </div>
//         </div>
//         `;
//         $('.announcements').append(toggleAnnouncementDetails);


        

        
//         // const priorityNode = document.createElement("div");
//         // const priorityAttr = document.createAttribute("class");
//         // priorityAttr.value = "announcement-priority";
//         // priorityNode.setAttribute(priorityAttr);

//         // const headlineNode = document.createElement("p");
//         // const headlineAttr = document.createAttribute("class");
//         // headlineAttr.value = "announcement-headline";
//         // headlineNode.setAttribute(headlineAttr);

//         // const timestampNode = document.createElement("p");
//         // const timestampAttr = document.createAttribute("class");
//         // timestampAttr.value = "announcement-timestamp";
//         // timestampNode.setAttribute(timestampAttr);
        
//         // const personNode = document.createElement("p");
//         // const personAttr = document.createAttribute("class");
//         // personAttr.value = "announcement-person";
//         // personNode.setAttribute(personAttr);

//     });

//     document.querySelectorAll('.toggle-announcements').forEach((element) => {
//         // console.log(element.getAttribute("data"));
//         const attr = element.getAttribute("data");
//         console.log(attr);
//         element.addEventListener('click', () => {
//             $('#' + attr).animate({
//                 opacity: "toggle",
//                 height: "toggle"
//             }, 250, 'linear', () => {
//                 // animation complete
//             });
//             console.log(attr)
//         });
//     });

//     $(`#announcements-toggle1`).on('click', () => {
//         console.log(`toggle1`);
//     });
//     $(`#announcements-toggle2`).on('click', () => {
//         console.log(`toggle2`);
//     });
// }

if(windowLocation.indexOf("user-announcement") > -1) {
    console.log('announcement5.js');

    const colRef = fire.myCollection(fire.db, "account-information");
    const linkagesQuery = fire.doQuery(colRef, fire.doLimit(10));
    const docsSnap = await fire.myGetDocs(linkagesQuery);

    let index = 0;
    let acc = [];

    console.log('docsSnap: ', docsSnap.docs.length)
    docsSnap.forEach(async doc => {
        let accInfo = {...doc.data()};
        let objSize = Object.keys(accInfo).length;
        // console.log('accountInformation', accInfo);
        // console.log('accountInformation', accInfo.createdAt);

        
        accInfo['uid'] = doc.id;

        // If middle name is undefined
        console.log(accInfo['middle_name'])
        if(typeof(accInfo['middle_name']) === 'undefined' || accInfo['middle_name'].trim() === '') {
            console.log(true)
            accInfo['middle_name'] = ' ';
        }
        else {
            console.log(false)
        }

        accInfo['full_name'] = `${accInfo['last_name']} ${accInfo['first_name']} ${accInfo['middle_name'][0]}`;

        accInfo['last_login'] = accInfo['last_login'] === '' ? '' : new Date(accInfo['last_login']).toLocaleString('en-GB',{timeZone:'UTC'});
        accInfo['createdAt'] = accInfo['createdAt'] === '' ? '' : new Date(accInfo['createdAt']).toLocaleString('en-GB',{timeZone:'UTC'});


        // If there is no user type given
        // console.log(accInfo['user_type'])
        if(typeof(accInfo['user_type']) === 'undefined' || accInfo['user_type'] === null) {
            accInfo['user_type'] = 'N/A';
        }
        
        // If there is no e-mail address added
        // console.log(typeof(accInfo['email']) === 'undefined')
        if(typeof(accInfo['email']) === 'undefined') {
            accInfo['email'] = 'N/A';
        }

        accInfo['owned_vehicles'] = "";
        accInfo['linkages'] = "";

        await getVehicleInformationList(doc.id).then(evt => {
            console.log('event: ', evt)
            accInfo['owned_vehicles'] = evt;
        });

        await getLinkagesInformationList(doc.id).then(evt => {
            console.log('event linkages: ', evt)
            accInfo['linkages'] = evt;
        });
        
        acc.push(accInfo);
        index = index + 1;
        accInfo['index'] = index;
        // console.table(acc)
        // console.log(index);

        if(index == docsSnap.docs.length) {
            // accInfo = []
            jQuery((e) => {
                console.log("DataTable");
                $("#table_id").DataTable({
                    scrollX: true,
                    "data": acc,
                    "columns": [
                        {"data": "index"},
                        {"data": "uid"},
                        {"data": "full_name"},
                        {"data": "user_type"},
                        {"data": "email"},
                        {"data": "phone_num"},
                        {"data": "owned_vehicles"},
                        {"data": "linkages"},
                        {"data": "createdAt"},
                    ]
                });
            });
        }
    }); 

    async function getVehicleInformationList(userUID) {
        let vehicle = undefined;
        const docVehicleActivity = fire.myDoc(fire.db, "vehicle-information", userUID);
        const docVSnap = await fire.myGetDoc(docVehicleActivity);
        if (docVSnap.exists()) {
            vehicle = Object.keys(docVSnap.data()).filter((e) => {
                if(e !== 'vehicle_length') {
                    return e;
                }
            }).toString();
        }
        else {
            vehicle = "N/A";
        }
        return vehicle;
    }
    async function getLinkagesInformationList(userUID) {
        let linkages = undefined;

        const docVehicleActivity = fire.myDoc(fire.db, "linkages", userUID);
        const docVSnap = await fire.myGetDoc(docVehicleActivity);
        if (docVSnap.exists()) {
            linkages = Object.keys(docVSnap.data()).filter((e) => {
                if(e !== 'vehicle_length') {
                    return e;
                }
            }).toString();
        }
        else {
            linkages = "N/A";
        }
        return linkages;
    }
    
    
}




});