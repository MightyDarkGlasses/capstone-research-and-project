import { doc } from "firebase/firestore";
import * as fire from "../src/index";
   

let windowLocation = window.location.pathname;
if(localStorage.getItem("theme") === "light") {
    document.querySelector("#system-theme1").setAttribute("href", "user-home-light.css");
    document.querySelector("#system-theme2").setAttribute("href", "user-home-mods-light.css");
}

//Check if I am on the user-account.html
if(windowLocation.indexOf("user-account") > -1) {
    

    // document.querySelector('.fullname').innerText = localStorage.personal_info_name === '' ? '' : localStorage.personal_info_name;
    // document.querySelector('.category').innerText = 
    //     localStorage.user_type === '' || localStorage.user_type === undefined || localStorage.user_type === null
    //      ? '' : localStorage.personal_info_name;

    console.log("user.js is called.");
    
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));  // convert the JSON from logged user
    let currentUserId = localStorage.getItem('currentUserId');          // get logged user uid
    console.log('currentUser:', currentUser);
    
    
    
    // let colRefAccount = fire.myCollection(fire.db, `account-information/${currentUserId}`);
    const docRefAccount = fire.myDoc(fire.db, "account-information", currentUserId);


    let fullName = document.querySelector(".personal-info-name");
    let userid = document.querySelector(".personal-info-id");
    let category = document.querySelector(".personal-info-usertype");
    let phoneNum = document.querySelector(".personal-info-phonenum");
    let useremail = document.querySelector(".personal-info-email");
    let college = document.querySelector(".personal-info-college");
    //getAccountInformation(colRefAccount);

    if(!isAny(localStorage.getItem("personal_info_name"), localStorage.getItem("personal_info_id"), 
        localStorage.getItem("personal_info_cat"), localStorage.getItem("personal_info_phone", 
        localStorage.getItem("personal_info_email")))) 
    {
        // getAccountInformation(colRefAccount); //get my information
        getAccountInformation(docRefAccount); //get my information
    }
    else {
        displayInformation();
    }

    

    // /const docRef = fire.myDoc(fire.db, "vehicle-information", currentUserId);

    //getDoc()
    function getAccountInformation(docReference) {
        //detect changes in database
        fire.myOnSnapshot(docReference, (doc) => {
            console.log("getAccountInformation", doc.data(), doc.id);
            let accountInformation = {...doc.data()};
            // console.log(accountInformation)

            localStorage.setItem("personal_info_name", `${accountInformation.last_name}, ${accountInformation.first_name} ${accountInformation.middle_name}`);
            localStorage.setItem("personal_info_id",   `${accountInformation.id_number}`);
            localStorage.setItem("personal_info_cat",  `${accountInformation.category}`);
            localStorage.setItem("personal_info_phone",`${accountInformation.phone_num}`);
            localStorage.setItem('personal_info_email', currentUser.email);

            console.log('college: ',accountInformation);
            if(accountInformation.college == null || typeof(accountInformation.college) == 'undefined') {
                localStorage.setItem('personal_info_college', 'Unspecified');
            }
            else {
                localStorage.setItem('personal_info_college', accountInformation.college);
            }
            displayInformation();
            // console.log(localStorage.getItem("personal_info_name"));
            // console.log(localStorage.getItem("personal_info_id"));
            // console.log(localStorage.getItem("personal_info_cat"));
            // console.log(localStorage.getItem("personal_info_phone"));
            // console.log(localStorage.getItem("personal_info_email"));

        });
    }

    function displayInformation() {
        console.log("cookies time, displayInformation()")
        console.log(localStorage.getItem("personal_info_email"))
        fullName.innerText = localStorage.getItem("personal_info_name");
        userid.innerText   = localStorage.getItem("personal_info_id");
        category.innerText = localStorage.getItem("personal_info_cat");
        phoneNum.innerText = localStorage.getItem("personal_info_phone");
        useremail.innerText = localStorage.getItem("personal_info_email");
        college.innerText = localStorage.getItem("personal_info_college");
        $("#form_id").val(localStorage.getItem("personal_info_id"));
        $("#form_phonenum").val(localStorage.getItem("personal_info_phone"));

        // document.getElementById("Mobility").selectedIndex = 12; //Option 10
        // document.querySelector("#college_option").selectedIndex = 0; //Option

        // Select the user type upon opening

        console.log("cate: ", localStorage.getItem("personal_info_cat"));
        if(localStorage.getItem("personal_info_cat") === "FACULTY") {
            document.getElementById("usertype_1").checked = true;
        }
        if(localStorage.getItem("personal_info_cat") === "NAP") {
            document.getElementById("usertype_2").checked = true;
        }
        

        // form_phonenum
        
        
        // Select the college option upon opening
        let colleges = ["CAFA" ,"CAL" ,"CBA" ,"CCJE" ,"CHTM" ,"CICT" ,"CIT" ,"CLaw" ,"CN" ,"COE" ,"COED" ,"CS" ,"CSER" ,"CSSP"];
        const collegeIndex = colleges.indexOf(localStorage.getItem("personal_info_college"));
        console.log(collegeIndex);

        if(collegeIndex >= 0) {
            $('#college_option').val(colleges[collegeIndex]).trigger('change');
        }
    }
    // function getAccountInformation(collectionReference) {
    //     // get collection data
    //     fire.myGetDocs(collectionReference) //JS Promises
    //         .then((snapshot) => {
    //             // console.log(snapshot.docs); //docs, represent the documents
    //             let accountInformation = [];
    //             snapshot.docs.forEach((doc) => {
    //                 accountInformation.push({ ...doc.data(), id: doc.id }); //... -> Spread, get all the data then the id
    //             });
    //             // console.log(accountInformation); //print the book array
    //             // console.log("accountInformation: ", accountInformation);
    //             localStorage.setItem("personal_info_name", `${accountInformation[0].last_name}, ${accountInformation[0].first_name} ${accountInformation[0].middle_name}`);
    //             localStorage.setItem("personal_info_id",   `${accountInformation[0].id_number}`);
    //             localStorage.setItem("personal_info_cat",  `Nothing`);
    //             localStorage.setItem("personal_info_phone",`${accountInformation[0].phone_num}`);
    //             localStorage.setItem('personal_info_email', email)
    //     }).catch(err => {
    //         console.log("Error: ", err);
    //     }); //looks at the collection
    // }  
    

    // fire.getSignInWithEmailAndPassword(fire.auth, "centteedow@gmail.com", "J123456a")
    // .then((cred) => {
    //     console.log("User logged in:", cred.user, cred.user.email); //auth
    //     getAccountInformation(colRefAccount);
    //     // setAccountInformation(cred.user.email);
    // }).catch((err) => {
    //     console.log("Sign in error: ", err);
    // });


    // console.log(localStorage.getItem("asdfasfd")) // return null
    // localStorage.setItem("personal_info_name", name);
    // localStorage.setItem("personal_info_id", id);
    // localStorage.setItem("personal_info_cat", cat);
    // localStorage.setItem("personal_info_phone", phone);


    // function setAccountInformation(email) {
    //     console.log("setAccountInformation was called");

    // }

    function isAny(...args) {
        for (var i = 1; i < arguments.length; ++i)
          if (arguments[i] === null) return false;
        return true;
    }

    let logoutUser = document.querySelector('.util-icon-logout');
    logoutUser.addEventListener('click', () => {
        console.log("this is a test.");
        localStorage.clear();
        window.location = '../index.html';
    });
} //end of link checking, windowLocation.indexOf("user-account") > -1


// My Account - Edit Information
window.addEventListener('DOMContentLoaded', () => {
if(windowLocation.indexOf("user-account") > -1) {

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
                localStorage.setItem("theme", "light");
            }
            else {
                document.querySelector("#system-theme1").setAttribute("href", "user-home.css");
                document.querySelector("#system-theme2").setAttribute("href", "user-home-mods.css");
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

    console.log('My Account - Edit Information');
    const auth = fire.auth;
    console.log("myaccount_auth:", auth);
    console.log('stsTokenManager:', JSON.parse(localStorage.currentUser).stsTokenManager)

    let formFullName = document.querySelector('.form-name');
    let formId = document.querySelector('.form-id');
    let formCategory = document.querySelector('.form-usertype');
    let formPhoneNum = document.querySelector('.form-phonenum');
    let formCollege = document.querySelector('.form-college');
    let formEmail = document.querySelector('.form-email');
    let formPassword = document.querySelector('.form-password');
    let currentUserId = localStorage.getItem('currentUserId');  
    let formresetPassword = document.getElementById('form-reset-password');
    let formresetEmail = document.getElementById('form-reset-email');

    formFullName.addEventListener('submit', (e) => {
        e.preventDefault();
        let fullNameObj = {
            first_name: formFullName.form_name_fname.value,
            middle_name: formFullName.form_name_mname.value,
            last_name: formFullName.form_name_lname.value,
        };

        console.log("formFullName:", currentUserId, fullNameObj, formFullName);
        updatePersonalInformation(currentUserId, fullNameObj, formFullName)
        localStorage.setItem('personal_info_name', `${fullNameObj['last_name']}, ${fullNameObj['first_name']} ${fullNameObj['middle_name']}`)
    });
    formId.addEventListener('submit', (e) => {
        e.preventDefault();
        let idObj = {
            id_number: formId.form_id.value
        }

        console.log("formId:", currentUserId, idObj, formId);
        updatePersonalInformation(currentUserId, idObj, formId);
        localStorage.setItem('personal_info_id', `${idObj['id_number']}`)
    });
    formCategory.addEventListener('submit', (e) => {
        e.preventDefault();
        let categoryObj = {
            category: formCategory.user_type.value
        }
        
        console.log("formCategory:", currentUserId, categoryObj, formFullName);
        updatePersonalInformation(currentUserId, categoryObj, formFullName)
        localStorage.setItem('personal_info_cat', `${categoryObj['category']}`)
    });
    formPhoneNum.addEventListener('submit', (e) => {
        e.preventDefault();
        let phoneNumObj = {
            phone_num: formPhoneNum.form_phonenum.value
        }
                
        console.log("formPhoneNum:", currentUserId, phoneNumObj, formPhoneNum);
        updatePersonalInformation(currentUserId, phoneNumObj, formPhoneNum)
        localStorage.setItem('personal_info_phone', `${phoneNumObj['phone_num']}`)
    });
    formCollege.addEventListener('submit', (e) => {
        e.preventDefault();
        e.stopPropagation();
        let collegeObj = {
            college: formCollege.college_option.value
        }

        updatePersonalInformation(currentUserId, collegeObj, formCollege);
        localStorage.setItem('personal_info_college', `${collegeObj['college']}`)
    });
    formEmail.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log('email change was clicked!');
        console.log('currentAuth', fire.auth);
        console.log('currentUser', fire.auth.currentUser);
        console.log(formEmail.form_email.value);

        let passEmail = formEmail.form_email.value;
        let passUser = fire.auth.currentUser;
        doVerifyEmailBeforeUpdate(passUser, passEmail);
    });
    formresetPassword.addEventListener('click', () => {
        console.log('password reset was clicked!')
        resetPassword();
    });

    function doVerifyEmailBeforeUpdate(user, email) {
        console.log("check email: ", user)
        fire.doVerifyBeforeUpdateEmail(user, email)
        .then(function() {
            swal("Success!", "Verification email sent.\nClicking the link in email will update the email address.", "success").then((e) => {
                // window.location.href = window.location.href; //reload a page in JS
                // location.reload();
            });
        })
        .catch(function(error) {
            console.log(error);
            const errorCode = error.code;
            const errorMessage = error.message;
            swal("Oops", "Something went wrong!\n" + "Error code: " + errorCode + "\nMessage: " + errorMessage, "error").then((e) => {
                // window.location.href = window.location.href; //reload a page in JS
                // location.reload();
            });
        });
    }
    function resetPassword() {
        // console.log('reset-email', fire.auth.currentUser.email)
        let resetEmailAddress = fire.auth.currentUser.email;
        fire.getSendPasswordResetEmail(fire.auth, resetEmailAddress)
        .then(() => {
            swal("Success!", "Verification email sent.\nClicking the link in email will update the email address.", "success").then((e) => {
                // window.location.href = window.location.href; //reload a page in JS
                // location.reload();
            });
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            swal("Oops", "Something went wrong!\n" + "Error code: " + errorCode + "\nMessage: " + errorMessage, "error").then((e) => {
                // window.location.href = window.location.href; //reload a page in JS
                // location.reload();
            });
        });
    }


    function updatePersonalInformation(myId, myObject, myForm) {
        console.log("account updated: ", myObject);
        const docRefAccount = fire.myDoc(fire.db, "account-information", myId);
        
        fire.myUpdateDoc(docRefAccount, myObject)
        .then(() => {    
            swal("Success!", "Account information updated.", "success").then(() => {
                myForm.reset();
                window.location.href = window.location.href; //reload a page in JS
                location.reload();
            });
        });
    }
    function updateEmailInformation(myId, myObject, myForm) {
        updateEmail(auth.currentUser, "user@example.com").then(() => {
            // Email updated!
            // ...
        }).catch((error) => {
            // An error occurred
            // ...
        });

        sendEmailVerification(auth.currentUser)
        .then(() => {
            // Email verification sent!
            // ...
        });
    }
    function detectAccountChanges() {
        fire.getOnAuthStateChanged(fire.auth, (user) => {
            if (user) {
              // User is signed in, see docs for a list of available properties
              // https://firebase.google.com/docs/reference/js/firebase.User
              
              if(user.email !== currentUser.email) {
                alert("You will be logged out")
                fire.logoutUser();
              }
              // ...
            } else {
                console.log('User not found.')
            }
        });
    }

    const formProfile = document.querySelector(".form-userprofile");
    formProfile.addEventListener('submit', (e) => {
        e.preventDefault();
        e.stopPropagation();

        console.log("User get profile form: ", formProfile);
        console.log("formProfile profile: ", formProfile.profile.files);

        updateProfilePicture(formProfile.profile);
    });
    function updateProfilePicture(fileUpload) {
        let fileName = fileUpload.files[0].type;
        console.log('explorer: ', fileName);
        let allowedFileTypes = ["image/png", "image/jpeg", "image/gif", "image/jpeg"];
        
        let fileSize = ((fileUpload.files[0].size/1024)/1024).toFixed(2); // MB
        console.log(fileSize);

        // Check if the file is within the allowed file size limit.
        if(fileSize > 10.0) {
            $('.modal-container-main').html(`
            <p>Failure to drop an image<br/>Please upload a file within the alloted file size limit (10 MB).</p>
            <br/>File size given: <b>${fileSize} MB</b>`);
            $("#error-popup").modal({
                fadeDuration: 100
            });
        }
        else {
            if(allowedFileTypes.includes(fileName)) {
                /** UNCOMMENT THIS IS FOR FILE UPLOAD */
                const storage = fire.myGetStorage();
                const metadata = { 
                    contentType: fileUpload.files[0].type, 
                };
                const storageRef1 = fire.myRef(storage, `account-information/profile_pic/profile`);
                const uploadTask1 = fire.doUploadBytesResumable(storageRef1, fileUpload.files[0], metadata);

                // Upload the profile picture.
                const uploadProfilePromise = uploadTask1.on('state_changed', (snapshot) => {
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
                    fire.myGetDownloadURL(uploadTask1.snapshot.ref).then(async (downloadURL) => {
                        console.log('File available at', downloadURL);

                        const updateProfile = await fire.doUpdateProfile(fire.auth.currentUser, {
                            'photoURL': downloadURL,
                        });
                    });
                } //end of getDownloadURL
                );
            }
            else {
                $('.modal-container-main').html(`
                <p>Failure to drop an image<br/>Only <b>.jpeg, .png, and .gif</b> file extensions are allowed.</p>
                <br/>File extension given: <b>${fileName}</b>`);
                $("#error-popup").modal({
                    fadeDuration: 100
                });
            }
        }


        

        
    }
} //end of link conditional
}); //153, end of DOMContentLoaded function