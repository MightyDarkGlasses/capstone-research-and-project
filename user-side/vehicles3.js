import * as fire from "../src/index";
import e from "./script_users/qr-scanner.min.js";
import QrScanner from './script_users/qr-scanner.min.js'; 
// import swal from 'sweetalert';

let vehicleForm = document.querySelector('.vehicle-form');



let windowLocation = window.location.pathname;
window.addEventListener('DOMContentLoaded', () => {

if(windowLocation.indexOf("user-vehicle") > -1) {
    if(localStorage.getItem("theme") === "light") {
        document.querySelector("#system-theme1").setAttribute("href", "user-home-light.css");
        document.querySelector("#system-theme2").setAttribute("href", "user-home-mods-light.css");
        document.querySelector("#system-theme3").setAttribute("href", "user-account-light.css");
    }


    // DISPLAY THE PROFILE PICTURE...
    fire.getOnAuthStateChanged(fire.auth, (user) => {
        if (user) {
            // Display user profile picture.
            document.querySelector("#profile-picture").setAttribute("src", localStorage.getItem("profile-picture"));
            document.querySelector(".fullname").textContent = localStorage.getItem("profile-owner");
            document.querySelector(".category").textContent = localStorage.getItem("profile-category");

            showVehicleList(vehicleInformation);  // display the list
            showLinkagesList(fire.auth.currentUser.uid); // display the linkages
            clickableVehicleList();
        } 
        else {
            window.location = "../login.html";
        }
    });
    
    localStorage.removeItem("vehicle-front");
    localStorage.removeItem("vehicle-front-filetype");
    localStorage.removeItem("vehicle-front-filename");

    localStorage.removeItem("vehicle-side");
    localStorage.removeItem("vehicle-side-filetype");
    localStorage.removeItem("vehicle-side-filename");

    localStorage.removeItem("vehicle-rear");
    localStorage.removeItem("vehicle-rear-filetype");
    localStorage.removeItem("vehicle-rear-filename");
    

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
                document.querySelector("#system-theme3").setAttribute("href", "user-account-light.css");
                localStorage.setItem("theme", "light");
            }
            else {
                document.querySelector("#system-theme1").setAttribute("href", "user-home.css");
                document.querySelector("#system-theme2").setAttribute("href", "user-home-mods.css");
                document.querySelector("#system-theme3").setAttribute("href", "user-account.css");
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
    

    //JSON

    // let vehi = JSON.parse(localStorage.getItem("vehicleInformation"));
    let vehicleInformation = JSON.parse(localStorage.getItem("vehicleInformation"));
    console.log("checkVehicle: ", vehicleInformation);
    
    // vehicleForm.addEventListener('submit', (e) => {
    //     e.preventDefault();
    //     console.log('This is a test.')
    // });

    let listOfVehiclesTags = '';
    let currentIndexSelectedSubmit = undefined;
    function showVehicleList(vehicle) {
        if(vehicle == null || vehicle.vehicle_length == 0) {
            // document.querySelectorAll('.right-container ~ .header').forEach((element) => element.style.display = 'none')
            let abc = document.querySelectorAll('.right-container ~ .header');
            console.log(abc)
            document.querySelector('.vehicle-dropdown').style.display = 'none';
            document.querySelectorAll('.title-with-add').forEach((e) => e.style.display = 'none');
            document.querySelector('.vehicle-information').style.display = 'none';
            document.querySelector('.linkages-box').style.display = 'none';
        }
        else {
            let vehicleKeys = Object.keys(JSON.parse(localStorage.vehicleInformation)).sort();
            console.log("vehicleKeys: ", vehicleKeys)
            // console.log("Vehicle keys: ", vehicleKeys);
            let iterator = 1; // count the number of vehicle list
            let isFirstTime = false;
            for (let index=0; index<vehicleKeys.length; index++) {
                console.log('iterating index: ', index);
                // console.log('index:', index);
                // console.log('vehicleInformation[index]:', vehicleInformation[index]);
                // console.log('vehicleKeysLength:', vehicleKeys[index]);
                
                if(vehicleKeys[index] !== 'vehicle_length') {
                    // console.log('true', vehicleInformation[vehicleKeys[index]])

                    const preSelectedVehicleKey = vehicleInformation[vehicleKeys[index]];
                    console.log('preSelectedVehicleKey: ', preSelectedVehicleKey);
                    if(!typeof(preSelectedVehicleKey["model"]) === 'undefined') {
                        listOfVehiclesTags += `<li data-key="${vehicleKeys[index]}">Vehicle ${iterator} | ${preSelectedVehicleKey["model"][0]}, ${vehicleKeys[index]}</li>`;
                        document.querySelector('.personal-info-model').innerText = preSelectedVehicleKey["model"][0];
                    }
                    else {
                        listOfVehiclesTags += `<li data-key="${vehicleKeys[index]}">Vehicle ${iterator} | ${preSelectedVehicleKey["model"]}, ${vehicleKeys[index]}</li>`;
                        document.querySelector('.personal-info-model').innerText = preSelectedVehicleKey["model"];
                    }

                    document.getElementById('vehicle-placeholder').innerHTML = `<p>Vehicle #${vehicleKeys.length-1}</p>`;
                    document.querySelector('.personal-info-plate').innerText = vehicleKeys[index];
                    
                    // First time of execution?
                    // if(!isFirstTime) {
                    //     console.log("First time of execution.")
                        // Classification
                        if(typeof(preSelectedVehicleKey["classification"]) === 'undefined' || preSelectedVehicleKey["classification"] === null) {
                            preSelectedVehicleKey["classification"] = "Unspecified.";
                        }
                        else {
                            const listOfClassifications = ["Private" ,"For Hire" ,"Government" ,"Exempt"];
                            const listGetIndex = listOfClassifications.indexOf(preSelectedVehicleKey["classification"].trim());
                            
                            console.log("listGetIndex:", listGetIndex, document.querySelector("#classification").selectedIndex);
                            if(listGetIndex >= 0) {
                                // document.querySelector("#classification").selectedIndex = listGetIndex;
                                // $("#classification").val("val", listOfClassifications[listGetIndex]);
                                // $('#classification').select2('data', {id: listGetIndex, a_key: listOfClassifications[listGetIndex]});
                                $('#classification').val(listOfClassifications[listGetIndex]).trigger('change');
                            }
                        }
    
                        // Vehicle Color
                        if(typeof(preSelectedVehicleKey["color"]) === 'undefined' || preSelectedVehicleKey["color"] === null) {
                            preSelectedVehicleKey["color"] = "Unspecified.";
                        }
                        else {
                            document.querySelector("#form_color").setAttribute("value", preSelectedVehicleKey["color"]);
                        }
    
                        // Year
                        if(typeof(preSelectedVehicleKey["year"]) === 'undefined' || preSelectedVehicleKey["year"] === null) {
                            preSelectedVehicleKey["year"] = "Unspecified.";
                        }
                        else {
                            document.querySelector("#form_year").setAttribute("value", preSelectedVehicleKey["year"]);
                        }
    
                        // License Code and Vehicle Category
                        if(typeof(preSelectedVehicleKey["license_code"]) === 'undefined' || preSelectedVehicleKey["license_code"] === null) {
                            preSelectedVehicleKey["license_code"] = "Unspecified";
                        }
                        else {
                            const listOfLicenses = ["A", "A1", "B", "B1", "B2", "C", "D", "BE", "CE"];
                            const listGetIndex = listOfLicenses.indexOf(preSelectedVehicleKey["license_code"].trim());
                            
                            console.log("listGetIndex", listOfLicenses[listGetIndex]);
                            $('#vehicle_classification').val(listOfLicenses[listGetIndex]).trigger('change');
                        }
                        if(typeof(preSelectedVehicleKey["code_category"]) === 'undefined' || preSelectedVehicleKey["code_category"] === null) {
                            preSelectedVehicleKey["code_category"] = "Unspecified";
                        }
                        else {
                            const listOfCategories = 
                            ["L1", "L2" ,"L3" ,"L5" ,"L6" ,"L7" ,"M1" ,"M2" ,"M3" ,"N2, N3" ,"M3" ,"01" ,"02" ,"03, 04"];
                            const listGetIndex = listOfCategories.indexOf(preSelectedVehicleKey["code_category"].trim());
                            
                            console.log("listGetIndex", listOfCategories[listGetIndex]);
                            $('#vehicle_categories').val(listOfCategories[listGetIndex]).trigger('change');
                        }
                        
                        // Remarks
                        if(typeof(preSelectedVehicleKey["remarks"]) === 'undefined' || preSelectedVehicleKey["remarks"] === null) {
                            preSelectedVehicleKey["remarks"] = "Unspecified";
                            document.querySelector('.personal-info-remarks').innerText = preSelectedVehicleKey["remarks"];
                            console.log('Remarks is null or unspecified.', typeof(preSelectedVehicleKey["remarks"]) === 'undefined' || preSelectedVehicleKey["remarks"] === null)
                        }
                        else {
                            document.querySelector('.personal-info-remarks').innerText = "";
                            document.querySelector('#form_remarks').value = preSelectedVehicleKey["remarks"];
                        }
    
                        console.log('preSelectedVehicleKey: ', preSelectedVehicleKey["color"]);
                        document.querySelector('.personal-info-classification').innerText = preSelectedVehicleKey["classification"];
                        document.querySelector('.personal-info-color').innerText = preSelectedVehicleKey["color"];
                        document.querySelector('.personal-info-year').innerText = preSelectedVehicleKey["year"];
                        document.querySelector('#license-code').innerText = preSelectedVehicleKey["license_code"];
                        document.querySelector('#my-vehicle-categories').innerText = preSelectedVehicleKey["code_category"];
                        isFirstTime = true;
                    // } //end of isFirstTime

                    iterator += 1;
                    // if(x === 1) { //will be used for placeholder
                    //     document.getElementById('vehicle-placeholder').innerHTML = `<p>Vehicle #1</p>`;
                    //     document.querySelector('.personal-info-plate').innerText = vehicleInformation.registered_vehicle.plate[0];
                    //     document.querySelector('.personal-info-model').innerText = vehicleInformation.registered_vehicle.model[0];
                    // }
                }
            }
            

            console.log('currentIndexSelectedSubmit', currentIndexSelectedSubmit)
            document.querySelector('.no-vehicle-box').style.display = 'none';
            document.getElementById('vehicle-list').innerHTML = listOfVehiclesTags;
            console.log(listOfVehiclesTags)
        }
    }
    function showLinkagesList(userUID) {
        console.log("showLinkagesList")
        const docRef = fire.myDoc(fire.db, "linkages", userUID.trim());
        // console.log("showLinkagesList userUID", userUID)
        // const docRef = fire.myDoc(fire.db, "linkages", userUID);

        fire.myOnSnapshot(docRef, async (doc) => {
            // console.log("linkages", doc.data(), doc.id);
            let linkagesList = {...doc.data()};

            console.log("linkagesList: ", linkagesList)
            let listLinkagesKeys = Object.keys(linkagesList);
            let linkagesDataLI = ``;
            
            if(!doc.exists()) {
                console.log('There are no linked vehicle data.')
            }
            else {
                if(Object.keys(linkagesList).length) {
                    listLinkagesKeys.forEach(async (data, index) => {

                        console.log("listLinkagesKeys: ", listLinkagesKeys)
                        console.log("linkagesList[data][orig_uid]: ", linkagesList[data]["orig_uid"]);

                        let ownerFullName = undefined;
                        let ownerVehicleModel = undefined;
                        await getAccountInformationOwner(linkagesList[data]["orig_uid"]).then(evt => {
                            // console.log('event: ', evt)

                            // if(typeof(evt['middle_name']) === "undefined") {
                            //     evt['middle_name'] = " ";
                            //     ${evt['middle_name'][0]}
                            // }
                            ownerFullName = `${evt['last_name']} ${evt['first_name']} `;
                        });
                        await getVehicleInformationModel(linkagesList[data]["orig_uid"]).then(evt => {
                            console.log('event: ', evt, data)

                            if(evt[data]['model'][0] === undefined) {
                                ownerVehicleModel = "-";
                            }
                            ownerVehicleModel = evt[data]['model'][0];
                        });

                        linkagesDataLI += 
                        `<tr>
                            <td>${ownerVehicleModel}</td>
                            <td>${data}</td>
                            <td>${ownerFullName}</td>
                            <td>
                                <button data-key="${data}" class="remove-linkages">Remove</button>
                            </td>
                        </tr>`;
                        // console.log("linkages: ", linkagesDataLI, index);
                        if(index+1 === Object.keys(linkagesList).length) {
                            // Set the linkages data.
                            $(".linkages-data-body").html(linkagesDataLI);
                            addRemoveLinkagesButton();
                        }
                    });
                }
            }

            
        });
            
        // if(vehicle !== null) {
        // //const docRefVehicle = fire.myDoc(fire.db, "vehicle-information", currentUserId);
            
        //     let myObject = vehicle.registered_vehicle.vehicles.linkages;
        //     let myKeys = Object.keys(myObject);

        //     if(myKeys.length > 0) {
        //         console.log('Linkages detected!');
                
        //         let linkagesOutput = '';
                
        //         myKeys.forEach((element, index) => {
        //             console.log('test', myObject)
        //             linkagesOutput += `<li>Link #${index}: ${myObject[myKeys]}</li>`;
        //             //     // Last index for setting the list of linkages
        //             //     if(index === myKeys.length-1) { 
        //             //         console.log('index === myKeys.length', index === myKeys.length)
        //             //         document.querySelector('.vehicle-linkages-list').innerHTML = linkagesOutput;
        //             //     }
        //         });

        //         document.querySelector('.vehicle-linkages-list').innerHTML = linkagesOutput;
        //         console.log('myKeys:', myKeys);
        //         console.log('linkageOutput:', linkagesOutput);
        //     }
        //     else {
        //         console.log('No linked yet.');
        //     }
        //     console.log('linkages:', vehicle.registered_vehicle.vehicles.linkages);
        //     console.log('linkages:', Object.keys(vehicle.registered_vehicle.vehicles.linkages).length);
        // }
    }
    async function getAccountInformationOwner(userUID) {
        let vehicle = undefined;
        const docVehicleActivity = fire.myDoc(fire.db, "account-information", userUID);
        const docVSnap = await fire.myGetDoc(docVehicleActivity);
        if (docVSnap.exists()) {
            return {...docVSnap.data()};
        }
        else {
            vehicle = "N/A";
        }
        return vehicle;
    }
    async function getVehicleInformationModel(userUID) {
        let vehicle = undefined;
        const docVehicleActivity = fire.myDoc(fire.db, "vehicle-information", userUID);
        const docVSnap = await fire.myGetDoc(docVehicleActivity);
        if (docVSnap.exists()) {
            return {...docVSnap.data()};
        }
        else {
            vehicle = "N/A";
        }
        return vehicle;
    }

    // Event for selecting a list of vehicles
    function clickableVehicleList() {
        let myLists = document.querySelectorAll('#vehicle-list > li');
        const personalInfoPlate = document.querySelector('.personal-info-plate').textContent;
        const personalInfoModel = document.querySelector('.personal-info-model').textContent;
        myLists.forEach((element, index) => {
            element.addEventListener('click', (e) => {
                document.querySelector(".popup-dropdown").style.display = 'none'; //toggle out popup
                console.log('getAttribute', element.getAttribute('data-key'));

                let getSelectedAttrKey = element.getAttribute('data-key'),
                personalInfoPlate = vehicleInformation[getSelectedAttrKey],
                personalInfoModel = vehicleInformation[getSelectedAttrKey]["model"][0],
                personalInfoClassification = vehicleInformation[getSelectedAttrKey]["classification"],
                personalInfoColor = vehicleInformation[getSelectedAttrKey]["color"],
                personalInfoYear = vehicleInformation[getSelectedAttrKey]["year"],
                personalInfoLicense = vehicleInformation[getSelectedAttrKey]["license_code"],
                personalInfoCategory = vehicleInformation[getSelectedAttrKey]["code_category"],
                personalInfoRemarks = vehicleInformation[getSelectedAttrKey]["remarks"];
                
                // console.log('personalInfoPlate:', personalInfoPlate);

                // Classification
                if(typeof(personalInfoClassification) === 'undefined' || personalInfoClassification === null) {
                    personalInfoClassification = "Unspecified.";
                }
                else {
                    const listOfClassifications = ["Private" ,"For Hire" ,"Government" ,"Exempt"];
                    const listGetIndex = listOfClassifications.indexOf(personalInfoClassification.trim());
                    
                    console.log("listGetIndex:", listGetIndex, document.querySelector("#classification").selectedIndex);
                    if(listGetIndex >= 0) {
                        // document.querySelector("#classification").selectedIndex = listGetIndex;
                        // $("#classification").val("val", listOfClassifications[listGetIndex]);
                        // $('#classification').select2('data', {id: listGetIndex, a_key: listOfClassifications[listGetIndex]});
                        $('#classification').val(listOfClassifications[listGetIndex]).trigger('change');
                    }
                }

                // Vehicle Color
                console.log("vehicle color: ", personalInfoColor);
                if(typeof(personalInfoColor) === 'undefined' || personalInfoColor === null) {
                    personalInfoColor = "Unspecified.";
                }
                else {
                    document.querySelector("#form_color").setAttribute("value", personalInfoColor);
                }

                // Year
                if(typeof(personalInfoYear) === 'undefined' || personalInfoYear === null) {
                    personalInfoYear = "Unspecified.";
                }
                else {
                    document.querySelector("#form_year").setAttribute("value", personalInfoYear);
                }

                // License Code and Vehicle Category
                if(typeof(personalInfoLicense) === 'undefined' || personalInfoLicense === null) {
                    personalInfoLicense = "Unspecified";
                }
                else {
                    const listOfLicenses = ["A", "A1", "B", "B1", "B2", "C", "D", "BE", "CE"];
                    const listGetIndex = listOfLicenses.indexOf(personalInfoLicense.trim());
                    
                    console.log("listGetIndex", listOfLicenses[listGetIndex]);
                    $('#vehicle_classification').val(listOfLicenses[listGetIndex]).trigger('change');

                    if(typeof(personalInfoCategory) === 'undefined' || personalInfoCategory === null) {
                        personalInfoCategory = "Unspecified";
                    }
                    else {
                        const listOfCategories = 
                        ["L1", "L2" ,"L3" ,"L5" ,"L6" ,"L7" ,"M1" ,"M2" ,"M3" ,"N2, N3" ,"M3" ,"01" ,"02" ,"03, 04"];
                        const listGetIndex = listOfCategories.indexOf(personalInfoCategory.trim());
                        
                        console.log("listGetIndex", listOfCategories[listGetIndex]);
                        $('#vehicle_categories').val(listOfCategories[listGetIndex]).trigger('change');
                    }
                }
                

                
                // Remarks
                if(typeof(personalInfoRemarks) === 'undefined' || personalInfoRemarks === null) {
                    personalInfoRemarks = "Unspecified";
                }
                else {
                    document.querySelector(".personal-info-remarks").innerText = ""
                }

                document.querySelector('.personal-info-plate').innerText = getSelectedAttrKey;
                document.querySelector('.personal-info-model').innerText = personalInfoModel;
                document.querySelector('#vehicle-placeholder').innerHTML = `<p>Vehicle #${index+1}</p>`;
                document.querySelector('.personal-info-classification').innerHTML = personalInfoClassification;
                document.querySelector('.personal-info-color').innerHTML = personalInfoColor;
                document.querySelector('.personal-info-year').innerHTML = personalInfoYear;
                document.querySelector('#license-code').innerHTML = personalInfoLicense;
                document.querySelector('#my-vehicle-categories').innerHTML = personalInfoCategory;
                document.querySelector('#form_remarks').innerHTML = personalInfoRemarks;

                // currentIndexSelectedSubmit = index;
                // console.log('currentIndexSelectedSubmit', currentIndexSelectedSubmit);
                // if(vehicleInformation['linkages'] === undefined || vehicleInformation["linkages"] == null) {
                //     document.querySelector('.vehicle-linkages-list').textContent = 'None';
                // }
            });
        });
    }


    function addRemoveLinkagesButton() {
        document.querySelectorAll('.remove-linkages').forEach((element) => {
            element.addEventListener('click', async (e) => {
                const dataKey = element.getAttribute('data-key');
                await fire.doUpdateDoc(fire.myDoc(fire.db, "linkages", fire.auth.currentUser.uid), {
                    [dataKey]: fire.doDeleteField(),
                }).then((e) => {
                    Swal.fire(
                        'Success!',
                        'Linked vehicle deleted.',
                        'success'
                    ).then(() => {
                        window.location.href = window.location.href; //reload a page in JS
                        location.reload();
                    });
                });
            });
        });
    }


    let currentUserId = localStorage.getItem('currentUserId');   
    const formPlate = document.querySelector('.form-plate');
    const formModel = document.querySelector('.form-model');

    const formClassification = document.querySelector('.form-classification');
    const formColor = document.querySelector('.form-color');
    const formYear = document.querySelector('.form-year');
    const formLicense_Category = document.querySelector('.form-category');
    const formRemarks = document.querySelector('.form-remarks');
    const getPlateNumber = document.querySelector('.personal-info-plate');
    formPlate.addEventListener('submit', (e) => {
        e.preventDefault();
        e.stopPropagation();
        let plateNumber = formPlate.form_plate.value;
        // updateVehiclePlateNumber(currentUserId, plateNumber, formPlate);
        // getVehicleInformation(currentUserId);
    });
    formModel.addEventListener('submit', (e) => {
        e.preventDefault();
        e.stopPropagation();
        let plateModel = formModel.form_model.value;
        // updateVehicleModelNumber(currentUserId, plateModel, formModel)
        // getVehicleInformation(currentUserId);
    });
    formClassification.addEventListener('submit', (e) => {
        e.preventDefault();
        e.stopPropagation();
        let classificationObj = {
            [`${getPlateNumber.textContent}.classification`]: formClassification.classification.value,
        }

        console.log('getPlateNumber: ', getPlateNumber.textContent, formClassification.classification.value, classificationObj);
        updateVehicleInformation(currentUserId, classificationObj, formClassification);
        getVehicleInformation(currentUserId);
    });
    formColor.addEventListener('submit', (e) => {
        e.preventDefault();
        e.stopPropagation();
        let colorObj = {
            [`${getPlateNumber.textContent}.color`]: formColor.form_color.value
        }
        
        console.log(colorObj, formColor.form_color.value);
        updateVehicleInformation(currentUserId, colorObj, formColor);
        getVehicleInformation(currentUserId);
    });
    formYear.addEventListener('submit', (e) => {
        e.preventDefault();
        e.stopPropagation();
        let yearObj = {
            [`${getPlateNumber.textContent}.year`]: formYear.form_year.value
        }

        console.log('year: ', getPlateNumber.textContent, formYear.form_year.value, yearObj);
        updateVehicleInformation(currentUserId, yearObj, formYear);
        getVehicleInformation(currentUserId);
    });
    formLicense_Category.addEventListener('submit', (e) => {
        e.preventDefault();
        e.stopPropagation();
        let license_category = {
            [`${getPlateNumber.textContent}.license_code`]: formLicense_Category.vehicle_classification.value,
            [`${getPlateNumber.textContent}.code_category`]: formLicense_Category.vehicle_categories.value,
        }

        updateVehicleInformation(currentUserId, license_category, formLicense_Category);
        getVehicleInformation(currentUserId);
    });
    formRemarks.addEventListener('submit', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const getRemarks = document.querySelector('#form_remarks').value;
        console.log(getRemarks === '')
        if(getRemarks !== '') {

            let remarksObj = {
                [`${getPlateNumber.textContent}.remarks`]: getRemarks
            }
            console.log('remarks: ', remarksObj, getRemarks);
            updateVehicleInformation(currentUserId, remarksObj, formRemarks);
            getVehicleInformation(currentUserId);
        }
        else {
            window.alert('Please fill up remarks.');
        }
    });

    
    function changeListOfVehicleCategory() {
        console.log("college_option: ", document.querySelector("#college_option"));
        document.querySelector("#college_option").addEventListener("change", (e) => {
            console.log("college_option: ", e);
        });
    }
    
    // document.querySelector("#college_option").addEventListener("change", (e) => {
    //     console.log("college_option: ", e);
    // });

    function updateVehicleInformation(myId, myObject, myForm) {
        console.log("vehicle updated: ", myObject);
        const docRefAccount = fire.myDoc(fire.db, "vehicle-information", myId);
        
        fire.myUpdateDoc(docRefAccount, myObject)
        .then(() => {    

            Swal.fire(
                'Success!',
                'Vehicle information updated.',
                'success'
            ).then(() => {
                myForm.reset();
                window.location.href = window.location.href; //reload a page in JS
                location.reload();
            });

            // swal("Success!", "Vehicle information updated.", "success").then(() => {
            //     myForm.reset();
            //     window.location.href = window.location.href; //reload a page in JS
            //     location.reload();
            // });
        });
    }

    // swal("Success!", "Vehicle informatioinformationn updated.", "success");

    async function getVehicleInformation(userUID) {
        console.log('getVehicleInformation function is called.');
        const docVehicleActivity = fire.myDoc(fire.db, "vehicle-information", userUID);
        const docVSnap = await fire.myGetDoc(docVehicleActivity);
        if (docVSnap.exists()) {
            console.log('Vehicle information updated.');
            

            let vehicleInformation = {...docVSnap.data()};
            // console.log('docVSnap', docVSnap.data());
            localStorage.setItem("vehicleInformation", JSON.stringify(vehicleInformation));
            vehicleInformation = null;
        }
    }
    // https://firebase.google.com/docs/firestore/manage-data/add-data#update_elements_in_an_array
    // Update fields in nested objects
    function updateVehicleModelNumber(myId, updateValue, myForm) {
        console.log("vehicle info. updated: ", updateValue);
        let storeModel = [];

        const updateDocumentRef = fire.myDoc(fire.db, 'vehicle-information', myId);
        const docRef = fire.myDoc(fire.db, "vehicle-information", myId);
        fire.myOnSnapshot(docRef, (doc) => {
            // console.log("vehicleInformation", doc.data(), doc.id);
            let vehicleInfo = {...doc.data()};
            localStorage.setItem("vehicleInformation", JSON.stringify({...doc.data()}));

            console.log('vehicleInfo:', vehicleInfo.registered_vehicle.model);
            storeModel = vehicleInfo.registered_vehicle.model;

            console.log('before:', storeModel)
            storeModel[currentIndexSelectedSubmit] = updateValue; //replace the array value
            console.log('after:', storeModel)

            fire.myUpdateDoc(updateDocumentRef, {
                'registered_vehicle.model': storeModel
            })
            .then(() => {
                myForm.reset();
                location.reload();
            });
        });
    }

    function updateVehiclePlateNumber(myId, updateValue, myForm) {
        console.log("vehicle info. updated: ", updateValue);
        let storePlates = [];

        const updateDocumentRef = fire.myDoc(fire.db, 'vehicle-information', myId);
        const docRef = fire.myDoc(fire.db, "vehicle-information", myId);
        fire.myOnSnapshot(docRef, (doc) => {
            // console.log("vehicleInformation", doc.data(), doc.id);
            let vehicleInfo = {...doc.data()};
            localStorage.setItem("vehicleInformation", JSON.stringify({...doc.data()}));

            console.log('vehicleInfo:', vehicleInfo.registered_vehicle.plate);
            storePlates = vehicleInfo.registered_vehicle.plate;

            console.log('before:', storePlates)
            console.log('update task', currentIndexSelectedSubmit, updateValue)
            storePlates[currentIndexSelectedSubmit] = updateValue; //replace the array value
            console.log('after:', storePlates)

            fire.myUpdateDoc(updateDocumentRef, {
                'registered_vehicle.plate': storePlates
            })
            .then(() => {
                // generateVehicleQRCode(myId, updateValue, 500);  

                // console.log(myId, updateValue, 500)
                fire.exportGenerateVehicleQRCode(myId, updateValue, 500, currentIndexSelectedSubmit);
                myForm.reset();
                location.reload();
            });
        });
    }

    // ### Linkages: Adding new entry
    function checkLinkageDuplication(scannedQRUserUID, plateNumber) {
        const docRefOthers = fire.myDoc(fire.db, "vehicle-information", scannedQRUserUID);
        const docRefSelf = fire.myDoc(fire.db, "vehicle-information", fire.auth.currentUser.uid);
        const docRefLinkages = fire.myDoc(fire.db, "linkages", fire.auth.currentUser.uid);
        // let currentLengthOfLinkages = -1;

        // Check if the linkages collection table exists in the Firestore.
        fire.myOnSnapshot(docRefLinkages, (doc) => {
            // currentLengthOfLinkages =  Object.keys(doc.data()).length;
            
            if(doc.exists()) {
                console.log('currentLengthOfLinkagesDAAAATA', doc.data());
                console.log('currentLengthOfLinkages', Object.keys(doc.data()).length);
            }
            // console.log('currentLengthOfLinkages', currentLengthOfLinkages);
        });
        
        // Check if the plate number is already registered on its personal account.
        fire.myOnSnapshot(docRefSelf, (doc) => {
            let currentPlateNumberKeysRegistered = Object.keys(doc.data());
            console.log('currentPlateNumberKeysRegistered', currentPlateNumberKeysRegistered);

            if(currentPlateNumberKeysRegistered.includes(plateNumber)) {
                $('#error-popup .modal-container-main').html(
                    `<p>You cannot add the plate number to your linkages</p>
                    <p class="note">Note: The plate number is already registered on your own account.</p>`
                    );
                $("#error-popup").modal({
                    fadeDuration: 100
                });
                return;
            }
            else {
                // Check if the plate number exists on the scanned user id.
                fire.myOnSnapshot(docRefOthers, (doc) => {

                    console.log("check datta datta: ", doc.data());
                    let currentPlateNumberKeysRegistered = Object.keys(doc.data());


                    // console.log('doc.data', doc.data())
                    // const fullName = 
                    //     `${doc.data()[plateNumber]['last_name']}, ${doc.data()[plateNumber]['first_name']} ${doc.data()[plateNumber]['middle_name']}`;
                    // console.log('fullName: ', fullName);
        
                    console.log('currentPlateNumberKeysRegistered', currentPlateNumberKeysRegistered);
                    if(!currentPlateNumberKeysRegistered.includes(plateNumber)) {
                        // console.log('You cannot add that plate number to your linkages. Reason: Already registered on your vehicle list.');
        
                        $('#error-popup .modal-container-main').html(
                            `<p>You cannot add the plate number to your linkages</p>
                            <p class="note">Note: The plate number does not exist or is not yet registered on the scanned user id.</p>`
                            );
                        $("#error-popup").modal({
                            fadeDuration: 100
                        });
        
                        return;
                    }
                    else {
                        const linkUserScannedUserUID = document.querySelector('.user-scanned-uid-value');
                        const linkUserScannedDate = document.querySelector('.user-scanned-date-value');
                        const linkUserScannedPlateNum = document.querySelector('.guest-platenum-caption-value');
                        const linkUserScannedVehicleModel = document.querySelector('.guest-model-caption-value');
                        // const linkUserScannedVehicleOwner = document.querySelector('.guest-fullname-caption-value');
                        currentPlateNumberKeysRegistered = doc.data()[plateNumber];
        
                        console.log('currentPlateNumberKeysRegistered', currentPlateNumberKeysRegistered);
                        linkUserScannedUserUID.innerText = (scannedQRUserUID);
                        linkUserScannedDate.innerText = (new Date());
                        linkUserScannedPlateNum.innerText = (plateNumber);
                        linkUserScannedVehicleModel.innerText = (currentPlateNumberKeysRegistered.model);
                        
                        $("#popup-linkages-modal").modal({
                            fadeDuration: 100
                        });    
                        $('.mobile-sidebar').css('opacity', 0);
        
                        document.querySelector('#confirmation-yes').addEventListener('click', () => {
                            addNewLinkages(scannedQRUserUID, plateNumber);
                        });
                        
                        document.querySelector('#confirmation-no').addEventListener('click', () => {
                            document.querySelector('#close-linkages-confirmation').click();
                            $('.mobile-sidebar').css('opacity', 1);
                        });
        
                        $('#popup-linkages-modal').on($.modal.CLOSE, () => {
                            
                        });
                    }
                });
            }
        });

    }
    function addNewLinkages(scannedQRUserUID, plateNumber) {
        console.log('addNewLinkages')
        const docRef = fire.myDoc(fire.db, "linkages", fire.auth.currentUser.uid);
        
        fire.myOnSnapshot(docRef, (doc) => {
            if(!doc.exists()) {
                console.info('Nope.');
                generateLinkagesQRCode(fire.auth.currentUser.uid, scannedQRUserUID, plateNumber, 500, 0, true);
            }
            else {
                const currentLinkagesKeysRegistered = Object.keys(doc.data());
                console.log('data: ', currentLinkagesKeysRegistered);
                console.log(currentLinkagesKeysRegistered, plateNumber);
                
                if(currentLinkagesKeysRegistered.includes(plateNumber)) {
                    // console.log('You cannot add that plate number to your linkages. Reason: Already added to your linkages list. ');
    
                    // $('#error-popup .modal-container-main').html(
                    //     `<p>You cannot add the plate number to your linkages</p>
                    //     <p class="note">Note: Already added to your linkages list. </p>`
                    //     );
                    // $("#error-popup").modal({
                    //     fadeDuration: 100
                    // });
                    // $("#error-popup").on($.modal.CLOSE, () => {
                    //     $('.mobile-sidebar').css('opacity', 1);
                    // });
                }
                else {
                    console.log('All unique.')
                    // console.log(fire.auth.currentUser.uid);
                    
                    generateLinkagesQRCode(fire.auth.currentUser.uid, scannedQRUserUID, plateNumber, 500, Object.keys(doc.data()).length, false);
                }
            }

        });

        
    }
    // ### Linkages: Adding new entry


    // ### Linkages: Adding new entry, generating QR code upon registration
    // Generate a new QR code dedicated to the linked vehicle information
    async function generateLinkagesQRCode(userUID, scannedQRUserUID, plateNumber, mySize, index, isNewEntry) {
        // Check if the index parameter is given, if not then given it a default value
        if (typeof(index)==='undefined') index = "1";

        index += 1;
        let generatedOutput;
        const generateQRCode = (text, size) => {
            const qrcode = new QRCode('qrcode', {
                text: text,
                width: size,
                height: size,
                colorDark : "#000000",
                colorLight : "#ffffff",
                correctLevel : QRCode.CorrectLevel.H,
                addQuietZone: true
            });
            generatedOutput = qrcode._oDrawing._elCanvas.toDataURL("image/png");
        };
    
        let qrCodeDataObject = {
            'uid': userUID,
            'linked_uid': scannedQRUserUID,
            'plate_number': plateNumber.replace(" ", "")
        }
    
        await generateQRCode(JSON.stringify(qrCodeDataObject), mySize);

        // # Generate QR Code, linkages folder
        const storage = fire.storage;
        const storageRef = fire.myRef(storage, `linkages/${userUID}/${index}/linkagesQRCode.PNG`);
        let qrCodeBlob = await base64ToBlob((generatedOutput.replace(/^data:image\/(png|jpeg);base64,/, "")), "image/png");
        const uploadTask = fire.doUploadBytesResumable(storageRef, qrCodeBlob, "image/png");
        
        uploadTask.on('state_changed', 
            async (snapshot) => {
                // Progress of fileupload
                const progress = Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                console.log("Uploading qr code vehicle");
                console.log('Upload is ' + progress + '% done');    //progress of upload
            }, 
            (error) => {
                // Handle unsuccessful uploads
                console.log(error);
            }, 
            (success) => {
                // If successful, do this.
                // Add the linkages data into the list
                fire.myGetDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    console.log('QR code URL: ', downloadURL);

                    const updateDocumentRef = fire.myDoc(fire.db, 'linkages', fire.auth.currentUser.uid);

                    if(isNewEntry) {
                        console.log('myAddDoc', true);
                        fire.doSetDoc(updateDocumentRef, {
                            [plateNumber]: {
                                'account_ref': fire.myDoc(fire.db, '/account-information/' + scannedQRUserUID),
                                'vehicle_ref': fire.myDoc(fire.db, '/vehicle-information/' + scannedQRUserUID),
                                'qr': downloadURL,
                                'orig_uid': scannedQRUserUID,
                            }
                        }).then((success) => {
                            console.log("Done");
                            location.reload();
                        });
                    }
                    else {
                        console.log('doUpdateDoc', false);
                        fire.myUpdateDoc(updateDocumentRef, {
                            [plateNumber]: {
                                'account_ref': fire.myDoc(fire.db, '/account-information/' + scannedQRUserUID),
                                'vehicle_ref': fire.myDoc(fire.db, '/vehicle-information/' + scannedQRUserUID),
                                'qr': downloadURL,
                                'orig_uid': scannedQRUserUID,
                            }
                        }).then((success) => {
                            console.log("Done");
                            location.reload();
                        });
                    }
                });
            } //end of getDownloadURL
        ); //end of uploadTask
    }
    function base64ToBlob(base64, mime) {
        mime = mime || '';
        var sliceSize = 1024;
        var byteChars = window.atob(base64);
        var byteArrays = [];

        for (var offset = 0, len = byteChars.length; offset < len; offset += sliceSize) {
            var slice = byteChars.slice(offset, offset + sliceSize);
            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            
            var byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }

        return new Blob(byteArrays, {type: mime});
    }
    // ### Linkages: Adding new entry, generating QR code upon registration

    // Display all of the linkages in the logged in user.
    function getLinkagesInfo(currentLoggedUserId) {
        let listOfLinkedData = {};  //store all of the linked data here...
        let listOfLinkedDataTable = ``;

        const docRef = fire.myDoc(fire.db, "linkages", currentLoggedUserId);
        fire.myOnSnapshot(docRef, async (doc) => {
            // console.log("linkages", doc.data(), doc.id);

            console.log('linkagesList', doc.data())
            let linkagesList = {...doc.data()};
            let listLinkagesKeys = Object.keys(linkagesList);

            // let listOfLinkagesData = [];
            console.log('linkagesList', Object.keys(linkagesList).length);
            
            let tempPlateNumber = '';
            if(!doc.exists()) {
                console.log('There are no linked vehicle data.')
            }
            else {
                if(Object.keys(linkagesList).length) {
                    listLinkagesKeys.forEach(async (data, index) => {

                        tempPlateNumber = data;
                        data = linkagesList[data];

                        console.log('data: ', data, 'index: ', index);

                        console.log(data.vehicle_ref)
                        console.log(data.account_ref)
                        // console.log(data.plate_number)
                        console.log(tempPlateNumber)
        
                        const vehicleRef = data.vehicle_ref;
                        const accountRef = data.account_ref;
        
        
                        const docSnap1 = await fire.myGetDoc(vehicleRef);
                        const docSnap2 = await fire.myGetDoc(accountRef);
                        
                        if (docSnap1.exists()) {
                            console.log("Vehicle data:", docSnap1.data()[tempPlateNumber]);
                            // Run the if statement to get the exisiting data (plate number as the object id), else print "false"
                            if(docSnap1.data()[tempPlateNumber]) {
        
                                let referredVehicleInfo = docSnap1.data()[tempPlateNumber];
                                console.log(true);
                                // };
        
                                listOfLinkedDataTable += `
                                    <td>${referredVehicleInfo.model[0]}</td>
                                    <td>${tempPlateNumber}</td>
                                    <td>${docSnap2.exists() ? `${docSnap2.data()['last_name']}, ${docSnap2.data()['first_name']} ${docSnap2.data()['middle_name'][0]}.` : 'Unknown owner.'}</td>
                                    <td><a href="">X</a></td>`;
        
                                console.log(listOfLinkedDataTable);
                            }
                            else {
                                console.log(false);
                            }
                            document.querySelector('.linkages-data-body').innerHTML = listOfLinkedDataTable;
                        } else {
                            console.log("No such document!");
                        }
                    });
                }
            }

        });

        console.log('listOfLinkedData', listOfLinkedData);
        console.log('listOfLinkedDataTable', listOfLinkedDataTable);
        // 
    } // end of function getLinkagesInfo()


    // ####### Linkages: Read QR by Upload
    const fileSelector = document.getElementById('file-selector');
    fileSelector.addEventListener('change', event => {
        const file = fileSelector.files[0];
        if (!file) {
            return;
        }
        else {
            qrScanFileUpload(file)
        }
    });
    const dropZoneElement = document.getElementById('drop-zone');
    dropZoneElement.addEventListener("drop", (e) => {
		e.preventDefault();
        const file = fileSelector.files[0];
        if (!file) {
            return;
        }
        else {
            qrScanFileUpload(file)
        }
    });
    function qrScanFileUpload(file) {
        QrScanner.scanImage(file, { returnDetailedScanResult: true })
        .then(result => {
            // setResult(fileQrResult, result);
            const scannedQRConvertToRawString = JSON.parse(result.data);
            console.info('Result: ', result, scannedQRConvertToRawString.uid, scannedQRConvertToRawString.plate_number);
            
            // Call the addNewLinkages() function
            checkLinkageDuplication(scannedQRConvertToRawString.uid, scannedQRConvertToRawString.plate_number);
        })
        .catch(e => {
            // setResult(fileQrResult, { data: e || 'No QR code found.' })

            // swal("Oops", e , "error");
            console.log("linkage qr error: ", e)
            Swal.fire(
                'Oops!',
                "The user may have submiited an forfeited QR code. Please upload another one.",
                'error'
            );
            // console.info('No QR code found.', e)
        });
    }
    // ####### Linkages: Read QR by Upload


    // Get the uid of the currently logged in user.
    // fire.getOnAuthStateChanged(fire.auth, (user) => {
    //     if (user) {
    //         console.log("Currently logged user: ", user.uid);
    //         getLinkagesInfo(user.uid);
    //     } 
    //     else {
    //         console.error("No user was logged in.");
    //     }
    // });
    
    
    
} // end of window.location.pathname

// console.log(fire.db)


}); //end of DOMContentLoaded event