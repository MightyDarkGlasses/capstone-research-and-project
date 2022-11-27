import * as fire from "../../src/index";
// .personal-info-vehicle-photo
// .personal-info-plate
// .personal-info-model

// Events for popups and editing information

if(window.location.pathname.indexOf('user-vehicle') > -1) {
jQuery(function() {
    $('.personal-info-vehicle-photo').on('click', () => {
        $('.pop-photo').animate({
            opacity: "toggle",
            height: "toggle"
        }, 250, 'linear', () => {
            // animation complete
        });
    });

    // $('.personal-info-plate').on('click', () => {
    //     $('.pop-plate').animate({
    //         opacity: "toggle",
    //         height: "toggle"
    //     }, 250, 'linear', () => {
    //         // animation complete
    //     });
    // });

    // $('.personal-info-model').on('click', () => {
    //     $('.pop-model').animate({
    //         opacity: "toggle",
    //         height: "toggle"
    //     }, 250, 'linear', () => {
    //         // animation complete
    //     });
    // });


    // Select2
    $('#classification').select2();
    // $('#manufacturer').select2();
    $('#vehicle_classification').select2();
    $('#vehicle_categories').select2();
    $('#vehicle_classification').on("change", (e) => {
        console.log($("#vehicle_classification").prop('selectedIndex'));

        let currentIndex = $("#vehicle_classification").prop('selectedIndex');
        switch(currentIndex) {
            case 0: {
                // A
                $("#vehicle_categories").html(`<option value="L1">L1 - Two wheels; Maximum Speed: does not exceed to 50 kph</option>
                <option value="L2">L2 - Three wheels; Maximum Speed: does not exceed to 50 kph</option>
                <option value="L3">L3 - Two wheels; Maximum Speed: exceeds to 50 kph</option>`);
                break;
            }
            case 1: {
                // A1
                $("#vehicle_categories").html(`<option value="L4">L4 - With sidecars; Maximum Speed: does not exceeds to 50 kph</option>
                <option value="L5">L5 - Three wheels symmetrically arranged; Maximum Speed: exceeds to 50 kph</option>
                <option value="L6">L6 - Four wheels; Mass: not more than 350 kg; Maximum Speed: exceeds to 45 kph</option>
                <option value="L7">L7 - Four wheels; Mass: not more than 550 kg; Maximum Speed: does not exceeds 45 kph</option>`);
                break;
            }
            case 2: 
            case 3: 
            case 4: {
                // B, B1, B2
                $("#vehicle_categories").html(`<option value="M1">M1 - Mass: up to 5,000 kgs (GVW); Seats: not more than 8 passenger seats.</option>
                <option value="M2">M2 - Mass: up to 5,000 kgs (GVW); Seats: more than 8 passenger seats.</option>
                <option value="M3">M3 - Mass: up to 3,500 kgs (GVW); Only for carrying of goods.</option>`);
                break;
            }
            case 5: {
                // C
                $("#vehicle_categories").html(`<option value="N2, N3" selected>N2, N3 - Vehicles exceeding 3,500 kgs GVW for the carriage of goods.</option>`);
                break;
            }
            case 6: {
                // D
                $("#vehicle_categories").html(`<option value="M3" selected>M3 - Vehicles above 5,000 kgs GVW with more than 8 passenger seats.</option>`);
                break;
            }
            case 7: {
                // BE
                $("#vehicle_categories").html(`<option value="01">01 - Does not exceed to 750 kgs GVW</option>
                <option value="02">02 - Do exceed up to 3,500 kgs GVW</option>`);
                break;
            }
            case 8: {
                // CE
                $("#vehicle_categories").html(`<option value="03, 04" selected>03, 04 - Does not exceed to 3,500 kgs GVW</option>`);
                break;
            }
            default: {
                $("#vehicle_categories").html(`<option value="L1">L1 - Two wheels; Maximum Speed: does not exceed to 50 kph</option>
                <option value="L2">L2 - Three wheels; Maximum Speed: does not exceed to 50 kph</option>
                <option value="L3">L3 - Two wheels; Maximum Speed: exceeds to 50 kph</option>`);
            }
        }
    });

    

    $('.personal-info-manufacturer').on('click', () => {
        $('.pop-manufacturer').animate({
            opacity: "toggle",
            height: "toggle"
        }, 250, 'linear', () => {
            // animation complete
        });
    });
    $('.personal-info-classification').on('click', () => {
        $('.pop-classification').animate({
            opacity: "toggle",
            height: "toggle"
        }, 250, 'linear', () => {
            // animation complete
        });
    });
    $('.personal-info-color').on('click', () => {
        $('.pop-color').animate({
            opacity: "toggle",
            height: "toggle"
        }, 250, 'linear', () => {
            // animation complete
        });
    });
    $('.personal-info-year').on('click', () => {
        $('.pop-year').animate({
            opacity: "toggle",
            height: "toggle"
        }, 250, 'linear', () => {
            // animation complete
        });
    });
    $('.personal-info-category').on('click', () => {
        $('.pop-category').animate({
            opacity: "toggle",
            height: "toggle"
        }, 250, 'linear', () => {
            // animation complete
        });
    });

    // $('.personal-info-type').on('click', () => {
    //     $('.pop-type').animate({
    //         opacity: "toggle",
    //         height: "toggle"
    //     }, 250, 'linear', () => {
    //         // animation complete
    //     });
    // });
    $('.personal-info-remarks').on('click', () => {
        $('.pop-remarks').animate({
            opacity: "toggle",
            height: "toggle"
        }, 250, 'linear', () => {
            // animation complete
        });
    });


    // Vehicle list dropdown
    // .vehicle-list-dropdown-clickable
    $('.vehicle-list-dropdown-clickable').on('click', () => {
        $('.popup-dropdown').animate({
            opacity: "toggle",
            height: "toggle"
        }, 250, 'linear', () => {
            // animation complete
        });
    });

    // Modals
    $('#add-new-vehicle').on('click', () => {
        $("#add-vehicle-modal").modal({
            fadeDuration: 100
        });    

        $('.mobile-sidebar').css('opacity', 0);
    });
    // $('#add-new-vehicle').on($.modal.AFTER_CLOSE, () => {
    //     // $('.mobile-sidebar').css('opacity', 1);
    //     console.log('asfdasdf')
    // });

    
    $('#add-new-vehicle2').on('click', () => {
        $("#add-vehicle-modal").modal({
            fadeDuration: 100
        });    
    });

    
    // $('a[rel="modal:close"]').on('click', () => {
    //     $("#add-linkages-modal").modal({
    //         fadeDuration: 100
    //     });
    // });
    // $('.close-modal ').on('change', () => {
    //     console.log('This window is closed.')
    // });

    
    //Checking the current authenticated user.
    fire.getOnAuthStateChanged(fire.auth, (user) => {
        if (user) {
            const uid = user.uid;
            console.log('getOnAuthStateChanged: ', uid)
        } else {
            // User is signed out
        }
    });

    // Add Vehicles
    $('#add-vehicle-modal').on($.modal.CLOSE, () => {
        console.log('Removed all of the uploaded QR Code');
        $('.mobile-sidebar').css('opacity', 1);
        localStorage.removeItem('vehicle-front-filetype');
        localStorage.removeItem('vehicle-front-filename');
        localStorage.removeItem('vehicle-front');

        localStorage.removeItem('vehicle-side-filetype');
        localStorage.removeItem('vehicle-side-filename');
        localStorage.removeItem('vehicle-side');

        localStorage.removeItem('vehicle-rear-filetype');
        localStorage.removeItem('vehicle-rear-filename');
        localStorage.removeItem('vehicle-rear');
    });

    
    $('.modal-vehicle-form').on('submit', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('.modal-vehicle-form', e)


        async function checkExistingPlateNumber(plateNumber) {
            const docRefLogs = fire.myDoc(fire.db, "vehicle-information", fire.auth.currentUser.uid);
            const docSnap = await fire.myGetDoc(docRefLogs);
            const listOfRegisteredVehicleData =  Object.keys(docSnap.data());

            console.log('Object.keys()', Object.keys(docSnap.data()));
            //Document logs exists?
            if (listOfRegisteredVehicleData.includes(plateNumber)) {
                console.log('This plate number ALREADY EXISTS.');
            }
            else {
                console.log('This is a UNIQUE PLATE NUMBER.');

                console.log('getVehicleInformation()', );
                console.log($('#vehicle-platenum').val().trim().replace(" ", "").toUpperCase());
                if(checkExistingPlateNumber($('#vehicle-platenum').val().trim().replace(" ", "").toUpperCase()) === false) {
                    console.log('checkExistingPlateNumber() true');
                }
                else {
                    console.log('checkExistingPlateNumber() false');
                }
                const a = localStorage.getItem('vehicle-front'),
                b = localStorage.getItem('vehicle-side'),
                c = localStorage.getItem('vehicle-rear');
                
                const vehicleModel = 
                console.log([a, b, c]);
                if([a, b, c].includes(null)) {
                    console.log('null');
                    console.log('vehicle-model: ', $('#vehicle-model').val())
                    console.log('vehicle-platenum: ', $('#vehicle-platenum').val())
                }
                else {
                    console.log('all done!');
                    console.log('Submitted');

                    console.log('vehicle-model: ', $('#vehicle-model').val())
                    console.log('vehicle-platenum: ', $('#vehicle-platenum').val())
                    console.log('currentUser: ', fire.auth.currentUser.uid);

                    const model = $('#vehicle-model').val();
                    const plateNum = $('#vehicle-platenum').val();
                    const vehicleLength = JSON.parse(localStorage.vehicleInformation)['vehicle_length'];

                    // Create a new vehicle image data.
                    createVehicleImageData(fire.auth.currentUser.uid, vehicleLength, plateNum, model);
                    // generateVehicleQRCode(fire.auth.currentUser.uid, plateNum, 500, vehicleLength+1);
                }

            }
            return Object.keys(docSnap.data());
        }

        checkExistingPlateNumber(
            $('#vehicle-platenum').val().trim().replace(" ", "").toUpperCase())
            .then((result) => {
                console.log('result', result);
            })


        
        

        async function createVehicleImageData(userId, vehicleLength, plateNumber, model) {
            let imageLinks = [];
            vehicleLength += 1;
            // let generatedQRCodeLink = fire.exportGenerateVehicleQRCode(userId, plateNumber, 500, vehicleLength);


            if(localStorage.getItem("vehicle-front") === null || localStorage.getItem("vehicle-side") === null || localStorage.getItem("vehicle-rear") === null) {
                console.log("Skipped, no image was uploaded");
            }
            else {
                let fileNameFront = localStorage.getItem("vehicle-front-filename");
                let fileNameSide = localStorage.getItem("vehicle-side-filename");
                let fileNameRear = localStorage.getItem("vehicle-rear-filename");
                let vehicle_front = [localStorage.getItem("vehicle-front").replace(/^data:image\/(png|jpeg);base64,/, ""), 
                "vehicleFront"+fileNameFront.substring(fileNameFront.lastIndexOf(".")), localStorage.getItem("vehicle-front-filetype")];
                let vehicle_side = [localStorage.getItem("vehicle-side").replace(/^data:image\/(png|jpeg);base64,/, ""), 
                "vehicleSide"+fileNameSide.substring(fileNameSide.lastIndexOf(".")), localStorage.getItem("vehicle-side-filetype")];
                let vehicle_rear = [localStorage.getItem("vehicle-rear").replace(/^data:image\/(png|jpeg);base64,/, ""), 
                "vehicleRear"+fileNameRear.substring(fileNameRear.lastIndexOf(".")), localStorage.getItem("vehicle-rear-filetype")];
                
                const storage = fire.storage;
                let blobVehicleFront, blobVehicleSide, blobVehicleRear;
                blobVehicleFront = base64ToBlob(vehicle_front[0], vehicle_front[2]);  
                blobVehicleSide = base64ToBlob(vehicle_side[0], vehicle_side[2]);  
                blobVehicleRear = base64ToBlob(vehicle_rear[0], vehicle_rear[2]);  
            
                const metadataFront = { contentType: vehicle_front[2], };
                const metadataSide = { contentType: vehicle_side[2], };
                const metadataRear = { contentType: vehicle_rear[2], };
            
                const storageRef1 = fire.myRef(storage, `vehicle-information/${userId}/${vehicleLength}/${vehicle_front[1]}`);
                const storageRef2 = fire.myRef(storage, `vehicle-information/${userId}/${vehicleLength}/${vehicle_side[1]}`);
                const storageRef3 = fire.myRef(storage, `vehicle-information/${userId}/${vehicleLength}/${vehicle_rear[1]}`);
                
                const uploadTask1 = fire.doUploadBytesResumable(storageRef1, blobVehicleFront, metadataFront);
                const uploadTask2 = fire.doUploadBytesResumable(storageRef2, blobVehicleSide, metadataSide);
                const uploadTask3 = fire.doUploadBytesResumable(storageRef3, blobVehicleRear, metadataRear);
                
                console.log('uploadTask1:', uploadTask1);
                console.log('uploadTask2:', uploadTask2);
                console.log('uploadTask3:', uploadTask3);
                // Upload image (front view)
                var promise1 = uploadTask1.on('state_changed', (snapshot) => {
                        // Progress of fileupload
                        const progress = Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                        console.log("Uploading vehicle front.");
                        console.log('Upload is ' + progress + '% done');    //progress of upload
                    }, 
                    (error) => {
                        // Handle unsuccessful uploads
                        console.log(error);
                    }, 
                    (success) => {
                        // If successful, do this.
                        fire.myGetDownloadURL(uploadTask1.snapshot.ref).then((downloadURL) => {
                            console.log('File available at', downloadURL);
                            console.log(typeof(downloadURL))
                            imageLinks.push(downloadURL); //append the user link (vehicle)
                            // localStorage.setItem('uploadImage1', downloadURL);
                        });
                    } //end of fire.myGetDownloadURL
                ); //end of on method
                var promise2 = uploadTask2.on('state_changed', (snapshot) => {
                        const progress = Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                        console.log("Uploading vehicle side.");
                        console.log('Upload is ' + progress + '% done');    //progress of upload
                    }, 
                    (error) => {
                        // Handle unsuccessful uploads
                        console.log(error);
                    }, 
                    (success) => {
                        fire.myGetDownloadURL(uploadTask2.snapshot.ref).then((downloadURL) => {
                            console.log('File available at', downloadURL);
                            console.log(typeof(downloadURL))
                            imageLinks.push(downloadURL); //append the user link (vehicle)
                        });
                    } //end of fire.myGetDownloadURL
                ); //end of on method  
                var promise3 = uploadTask3.on('state_changed', (snapshot) => {
                        const progress = Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                        console.log("Uploading vehicle rear.");
                        console.log('Upload is ' + progress + '% done');    //progress of upload 
                    }, 
                    (error) => {
                        // Handle unsuccessful uploads
                        console.log(error);
                    }, 
                    (success) => {
                        fire.myGetDownloadURL(uploadTask3.snapshot.ref).then((downloadURL) => {
                            console.log('File available at', downloadURL);
                            console.log(typeof(downloadURL));
                            imageLinks.push(downloadURL); //append the user link (vehicle)
                        });
                    } //end of fire.myGetDownloadURL
                ); //end of on method
                
                //Wait for everything to be uploaded.
                Promise.all([uploadTask1, uploadTask2, uploadTask3]).then((output) => {
                    console.log("All uploaded done.")
                    console.log(output);
                    
                    console.log("imageLinks:", imageLinks);

                    generateVehicleQRCode(userId, plateNumber, 500, vehicleLength, model, imageLinks);
                    // console.log("generatedQRCodeLink:", generatedQRCodeLink);
                });
                console.log("BeforeReturn_Image Links: ", imageLinks);
            }


            // Add the new vehicle information
            // const promiseVehicle = fire.doUpdateDoc(fire.myDoc(fire.db, "vehicle-information", userId), {
            // [plateNumber.replace(" ", "")]: {
            //     qrCode: "qr-code-link",
            //     images: imageLinks,
            //     model: [model],
            //     use_types: 'Private',
            //     createdAt: fire.getServerTimestamp()
            // },
            // }).then(() => {
            //     console.log("Vehicle Information was added in the collection");
            // });
            

            // increment the vehicle length
            // fire.doUpdateDoc(fire.myDoc(db, "vehicle-information", userId), {
            //     vehicle_length: fire.doIncrement(1)
            // });

            return; //return the image link of the provided image
        } // end of function declaration

        async function generateVehicleQRCode(userUID, plateNumber, mySize, index, model, imageLinks) {
            // Check if the index parameter is given, if not then given it a default value
            if (typeof(index)==='undefined') index = "1";
            let generatedOutput;
            let strDownloadURL = "";

            const generateQRCode = (text, size) => {
                const qrcode = new QRCode('qrcode', {
                    text: text,
                    width: size,
                    height: size,
                    colorDark : "#000000",
                    colorLight : "#ffffff",
                    correctLevel : QRCode.CorrectLevel.H,
                    quietZone: true
                });
                generatedOutput = qrcode._oDrawing._elCanvas.toDataURL("image/png");
            };
        
            let qrCodeDataObject = {
                'uid': userUID,
                'plate_number': plateNumber.replace(" ", "")
            }
        
            await generateQRCode(JSON.stringify(qrCodeDataObject), mySize);
            const storage = fire.storage;
            const storageRef = fire.myRef(storage, `vehicle-information/${userUID}/${index}/qrCode0.PNG`);
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
                    fire.myGetDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        console.log('QR Code - File available at', downloadURL);
                        // strDownloadURL = downloadURL;

                        console.log('Check for qr code link')
                        // Add the new vehicle information
                        const promiseVehicle = fire.doUpdateDoc(fire.myDoc(fire.db, "vehicle-information", userUID), {
                        [plateNumber.replace(" ", "")]: {
                            qrCode: downloadURL,
                            images: imageLinks,
                            model: [model],
                            use_types: 'Private',
                            createdAt: fire.getServerTimestamp(),
                            classification: null,
                            manufacturer: null,
                            color: null,
                            year: null,
                            license_code: null,
                            code_category: null,
                            remarks: null,
                        },
                        }).then(() => {
                            console.log("Vehicle Information was added in the collection");
                        });
                        
                        // increment the vehicle length
                        fire.doUpdateDoc(fire.myDoc(fire.db, "vehicle-information", userUID), {
                            vehicle_length: fire.doIncrement(1)
                        }).then((success) => {
                            // localStorage.removeItem("vehicleInformation");
                            window.location.reload();
                        });
                    });
                } //end of getDownloadURL
            ); //end of uploadTask
            

            // Promise.all([uploadTask]).then((output) => {
                
            // });
        }

        // function addNewVehicleInformation() {
        //     console.log('Check for qr code link')
        //     // Add the new vehicle information
        //     const promiseVehicle = fire.doUpdateDoc(fire.myDoc(fire.db, "vehicle-information", userUID), {
        //     [plateNumber.replace(" ", "")]: {
        //         qrCode: strDownloadURL,
        //         images: imageLinks,
        //         model: [model],
        //         use_types: 'Private',
        //         createdAt: fire.getServerTimestamp()
        //     },
        //     }).then(() => {
        //         console.log("Vehicle Information was added in the collection");
        //     });
            
        //     // increment the vehicle length
        //     fire.doUpdateDoc(fire.myDoc(fire.db, "vehicle-information", userUID), {
        //         vehicle_length: fire.doIncrement(1)
        //     }).then((success) => {
        //         // window.location.reload();
        //     });
        // }
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
        
        
    }); //end of JQuery submit event
    
    // Linkages
    $('#add-new-linkages').on('click', () => {
        $("#add-linkages-modal").modal({
            fadeDuration: 100
        });
    });
    $('#add-linkages-modal').on($.modal.CLOSE, () => {
        console.log('closed linkages');
    });

    }); //end of document.ready / jQuery function


    // $('option').on('click', function(e){
    //     let parentNode = this.parentNode;
    //     for (let i=0; i < this.parentNode.options.length; i++) {
    //         if (parentNode.options[i] == this) {
    //           console.log('Clicked item with index', i);
    //           break;
    //         }
    //     }
    // });
    
    console.log('option');
    $('#vehicle-classification').on('change', function(e){
        let value = $(this).val();
        console.log('value', value);
        // console.log('clicked!')

        if(value === 'A') {
            $('#vehicle-categories').html(`<option value="L1">L1 - Two wheels; Maximum Speed: does not exceed to 50 kph</option>
            <option value="L2">L2 - Three wheels; Maximum Speed: does not exceed to 50 kph</option>
            <option value="L3">L3 - Two wheels; Maximum Speed: exceeds to 50 kph</option>`);
        }
        else if(value === 'A1') {
            $('#vehicle-categories').html(`<option value="L4">L4 - With sidecars; Maximum Speed: does not exceeds to 50 kph</option>
            <option value="L5">L5 - Three wheels symmetrically arranged; Maximum Speed: exceeds to 50 kph</option>
            <option value="L6">L6 - Four wheels; Mass: not more than 350 kg; Maximum Speed: exceeds to 45 kph</option>
            <option value="L7">L7 - Four wheels; Mass: not more than 550 kg; Maximum Speed: does not exceeds 45 kph</option>`);
        }
        else if(value === 'B' || value === 'B1' || value === 'B2') {
            $('#vehicle-categories').html(`option value="M1">M1 - Mass: up to 5,000 kgs (GVW); Seats: not more than 8 passenger seats.</option>
            <option value="M2">M2 - Mass: up to 5,000 kgs (GVW); Seats: more than 8 passenger seats.</option>
            <option value="M3">M3 - Mass: up to 3,500 kgs (GVW); Only for carrying of goods.</option>`);
        }
        else if(value === 'C') {
            $('#vehicle-categories').html(`<option value="N2, N3">N2, N3 - Vehicles exceeding 3,500 kgs GVW for the carriage of goods.</option>`);
        }
        else if(value === 'D') {
            $('#vehicle-categories').html(`<option value="M3">M3 - Vehicles above 5,000 kgs GVW with more than 8 passenger seats.</option>`);
        }
        else if(value === 'BE') {
            $('#vehicle-categories').html(`<option value="01">01 - Does not exceed to 750 kgs GVW</option>
            <option value="02">02 - Do exceed up to 3,500 kgs GVW</option>`);
        }
        else if(value === 'CE') {
            $('#vehicle-categories').html(`<option value="03, 04">03, 04 - Does not exceed to 3,500 kgs GVW</option>`);
        }

    });


    

    $('#open-confirmation').on('click', () => {

        $('#error-popup .modal-container-main').html(
            `<p>You cannot add the plate number to your linkages</p>
            <p class="note">Already registered on your vehicle list.</p>`
            );
        $("#error-popup").modal({
            fadeDuration: 100
        });
    });




    // Popup for linkages
    
    
}   //end of pathname checking