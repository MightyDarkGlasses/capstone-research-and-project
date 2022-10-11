console.log('script_users/vehicle.js is called');


// .personal-info-vehicle-photo
// .personal-info-plate
// .personal-info-model

jQuery(function() {
    $('.personal-info-vehicle-photo').on('click', () => {
        $('.pop-photo').animate({
            opacity: "toggle",
            height: "toggle"
        }, 250, 'linear', () => {
            // animation complete
        });
    });

    $('.personal-info-plate').on('click', () => {
        $('.pop-plate').animate({
            opacity: "toggle",
            height: "toggle"
        }, 250, 'linear', () => {
            // animation complete
        });
    });

    $('.personal-info-model').on('click', () => {
        $('.pop-model').animate({
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
    });

    // $("#add-vehicle-modal").modal({
    //     fadeDuration: 100
    // });  
    $('#add-new-linkages').on('click', () => {
        $("#add-linkages-modal").modal({
            fadeDuration: 100
        });
    });
});