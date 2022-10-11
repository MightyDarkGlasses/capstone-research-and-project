console.log('script_users/account.js is called');

// let profile = document.querySelector(".personal-info-profile");
// let name = document.querySelector(".personal-info-name");
// let id = document.querySelector(".personal-info-id");
// let usertype = document.querySelector(".personal-info-usertype");
// let phonenum = document.querySelector(".personal-info-phonenum");
// .personal-info-email
// .personal-info-password
// $( document ).ready(function() {
//     // Handler for .ready() called.
// });

jQuery(function() {
    // $('.personal-info-name').on('click', () => {
    //     $('.pop-name').css({
    //         "display": "block"
    //     });
    // })

    $('.personal-info-name').on('click', () => {
        $('.pop-name').animate({
            opacity: "toggle",
            height: "toggle"
        }, 250, 'linear', () => {
            // animation complete
        });
    });

    $('.personal-info-id').on('click', () => {
        $('.pop-id').animate({
            opacity: "toggle",
            height: "toggle"
        }, 250, 'linear', () => {
            // animation complete
        });
        
    });
    
    $('.personal-info-usertype').on('click', () => {
        $('.pop-usertype').animate({
            opacity: "toggle",
            height: "toggle"
        }, 250, 'linear', () => {
            // animation complete
        });
    });

    $('.personal-info-phonenum').on('click', () => {
        $('.pop-phonenum').animate({
            opacity: "toggle",
            height: "toggle"
        }, 250, 'linear', () => {
            // animation complete
        });
    });

    $('.personal-info-email').on('click', () => {
        $('.pop-email').animate({
            opacity: "toggle",
            height: "toggle"
        }, 250, 'linear', () => {
            // animation complete
        });
    });
    
    $('.personal-info-password').on('click', () => {
        $('.pop-password').animate({
            opacity: "toggle",
            height: "toggle"
        }, 250, 'linear', () => {
            // animation complete
        });
    });
    
    

    

})