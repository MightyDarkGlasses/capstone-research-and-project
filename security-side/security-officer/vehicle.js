console.log('script_users/vehicle.js is called');


// .personal-info-vehicle-photo
// .personal-info-plate
// .personal-info-model

jQuery(function() {
    console.log('document is ready')
    // Clickable element
    $('.name-id').on('click', () => {
        //Form to be popped out
        $('.pop-name').animate({
            opacity: "toggle",
            height: "toggle"
        }, 250, 'linear', () => {
            // animation complete
        });
    });

    // document.querySelector('.name-id').addEventListener('click', () => {
    //     //expressions
    // });
    // document.getElementsByClassName('name-id')[0].addEventListener('click', () => {
    //     //expressions
    // });
});