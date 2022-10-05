console.log("test.js")
jQuery(function() {
    // $('#manual-ajax').click(function(event) {
    //     event.preventDefault();
    //     this.blur(); // Manually remove focus from clicked link.
    //     $.get(this.href, function(html) {
    //       $(html).appendTo('body').modal();
    //     });
    // });
    popup.style.display = "none";
    $("#open-qr-code-modal").on('click', function(event) {
        $("#qr-code-modal").modal({
            fadeDuration: 100,
        });

        $(".popup-dropdown").css({
            "display": "none"
        });
        console.log('clicky')
    });
})