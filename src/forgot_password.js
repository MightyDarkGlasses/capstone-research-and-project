import * as fire from "./index";

let windowLocation = window.location.pathname;
window.addEventListener('DOMContentLoaded', async () => {
if(windowLocation.indexOf("forgot_password.html") > -1) {

    document.querySelector(".forgot").addEventListener("submit",  (e) => {
        e.preventDefault();
        e.stopPropagation();

        fire.doSignInWithEmailAndPassword(fire.auth, 
            $('#forgot_email').val(), 'password')
        .then((e) => {
            //pass;
        }).catch((error) => {
            console.log('error: ', error);
            switch (error.code) {
                case 'auth/wrong-password': {
                    resetPassword($('#forgot_email').val());
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
            }
        }); //end of catch block
    }); //end of submit event

    function resetPassword(resetEmailAddress) {
        fire.getSendPasswordResetEmail(fire.auth, resetEmailAddress)
        .then(() => {
            // alert("Password reset email was sent");
            $('.modal-container-main').html(`<p>A reset email link is sent.<br/>You can check it on the <b>Spam</b> section.</p>`);
            $('.modal-container-title').html('Success');
            $('.modal-container-header').css({
                'backgroundColor': '#ef7900'
            })
            $("#error-popup").modal({
                fadeDuration: 100
            });
            console.log('signup err code: ', error.code)
            console.log('signup err message: ', error.message);
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
        });
    }
}
});
