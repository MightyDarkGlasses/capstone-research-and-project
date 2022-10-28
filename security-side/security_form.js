import * as fire from "../src/index";

if(window.location.pathname.indexOf('security-side/security_panel.html') > -1) {
    console.log('security.js', fire.auth);

    const securityLoginForm = document.querySelector('#security-officer-form');
    securityLoginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // console.log($('#admin_user').val());
        // console.log($('#admin_pass').val());
        const email = $('#admin_user').val();
        const password = $('#admin_pass').val();
        console.log(email, password);

        if(email === 'ethoharon@duck.com') {    
            fire.doSignInWithEmailAndPassword(fire.auth, email, password)
            .then((cred) => {
                console.log("User logged in:", cred.user);
    
                
                // Remove the signOut method later.
                // fire.getSignOut(fire.auth)
                // .then(() => {
                //     console.log('check logged user:', fire.auth)
                //     console.log("User signed out.")
                //     window.location = 'security-officer/securityOfficer-home.html';
                // }).catch((err) => {
                //     console.log("Logout error message: ", err);
                // });
                window.location = 'security-officer/securityOfficer-home.html';
            }).catch((err) => {
                console.log("Sign in error: ", err);
            });
        }
    });
}