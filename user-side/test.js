console.log("test.js")



window.addEventListener('DOMContentLoaded', () => {
    // jQuery(function() {
        // popup.style.display = "none";
        $("#open-qr-code-modal").on('click', function(event) {
            $("#qr-code-modal").modal({
                fadeDuration: 100,
            });
    
            $(".popup-dropdown").css({
                "display": "none"
            });
            console.log('clicky')
        });
    // })
});