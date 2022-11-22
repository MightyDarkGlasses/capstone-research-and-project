console.log('script_users/account.js is called');

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

    $('.personal-info-college').on('click', () => {
        $('.pop-college').animate({
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