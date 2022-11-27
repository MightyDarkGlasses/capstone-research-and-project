import { getAuth } from "firebase/auth";
import * as fire from "../src/index";
// import { initializeApp, applicationDefault } from 'firebase-admin/app';

// import { getAuth, logout } from 'auth';

if(window.location.pathname.indexOf('security-side/security_panel.html') > -1) {
    console.log('security.js', fire.auth);

    // const defaultApp = initializeApp(defaultAppConfig);
    // console.log(defaultApp.name);
    
    

    const securityLoginForm = document.querySelector('#security-officer-form');
    securityLoginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // console.log($('#admin_user').val());
        // console.log($('#admin_pass').val());
        const email = $('#admin_user').val();
        const password = $('#admin_pass').val();
        console.log(email, password);

        // if(email === 'ethoharon@duck.com' || email === 'admin@local.com') {    
            fire.doSignInWithEmailAndPassword(fire.auth, email, password)
            .then(async (cred) => {
                console.log("User logged in:", cred.user);
                

                // if(cred.user.uid === "aqkfBzQp1YTxXVohFDSkCXO2esR2") {
                //     console.log("match")

                    
                    // fire.doUpdateProfile(cred.user, {
                    //     disabled: true
                    // });

                    // getAuth().updateCurrentUser(cred.user.uid, {
                    //     disabled: true,
                    // }).then((e) => {
                    //     console.log("User updated");
                    // });
                // }

                const myRef = fire.myDoc(fire.db, 'security', cred.user.uid); 
                await fire.myGetDoc(myRef).then((snapshot) => { 
                    console.log(snapshot.data(), snapshot.id);

                    if(snapshot.data() === undefined) {
                        fire.getSignOut(fire.auth)
                        .then(() => {
                            console.log("Done checking auth.");
                        }).catch((err) => {
                        });

                        $('.modal-container-main').html(`<p>User is not found. Please re-check your email address.</p>`);
                        $('.modal-container-title').html('Error');
                        $('.modal-container-header').css({
                            'backgroundColor': 'red'
                        })
                        $("#error-popup").modal({
                            fadeDuration: 100
                        });
                    }
                    else {
                        window.location = 'security-officer/securityOfficer-home.html';
                    }
                });
                
            }).catch((error) => {
                console.log('error: ', error);
                switch (error.code) {
                    case 'auth/wrong-password': {
                        $('.modal-container-main').html(`<p>User credentials is wrong.<br/>Consider re-checking and enter the correct and valid input.</p>`);
                        $('.modal-container-title').html('Error');
                        $('.modal-container-header').css({
                            'backgroundColor': 'red'
                        })
                        $("#error-popup").modal({
                            fadeDuration: 100
                        });
                        break;
                    }
                    case 'auth/user-not-found': {
                        $('.modal-container-main').html(`<p>User is not found. Please re-check your email address.</p>`);
                        $('.modal-container-title').html('Error');
                        $('.modal-container-header').css({
                            'backgroundColor': 'red'
                        })
                        $("#error-popup").modal({
                            fadeDuration: 100
                        });
                        break;
                    }
                    default: {
                        $('.modal-container-main').html(`<p>${error.code}</p>`);
                        $('.modal-container-title').html('Error');
                        $('.modal-container-header').css({
                            'backgroundColor': 'red'
                        })
                        $("#error-popup").modal({
                            fadeDuration: 100
                        });
                    }
                }
            });
        // } // end if condition
    });


    // Check if the user is already logged in.
    // fire.getOnAuthStateChanged(fire.auth, async (user) => {
    //     if (user) {
    //         const myRef = fire.myDoc(fire.db, 'security', user.uid); 
    //         await fire.myGetDoc(myRef).then((snapshot) => { 
    //             console.log(snapshot.data(), snapshot.id);

    //             if(snapshot.data() !== undefined) {
    //                 window.location = 'security-officer/securityOfficer-home.html';
    //             }
    //         });
    //     }
    // });
}