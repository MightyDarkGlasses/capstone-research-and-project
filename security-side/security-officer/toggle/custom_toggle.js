$(document).ready(function(){
    $('.toggle input[type="checkbox"]').click(function(){
        $(this).parent().toggleClass('on');

        if ($(this).parent().hasClass('on')) {
            console.log('this: ', $(this), 'on');
            // $('.input-row .label').html("Show scan region canvas");
        } else {
            console.log('this: ', $(this), 'off');
            // $('.input-row .label').html("Show scan region canvas");
        }
        // console.log('label: ', $('.input-row .label'))
    }); 


    console.log(`$('#cam-has-camera').val()`, $('#cam-has-camera').text(), 'test');
    if ($('#cam-has-camera').text() === 'true') {
        let checkbox = $('.checkbox input[type="checkbox"]');
        console.log('checkbox:', checkbox)
        checkbox.parent().toggleClass('on');

        if (checkbox.parent().hasClass('on')) {
            checkbox.parent().children('.label').text('On')
        } else {
            checkbox.parent().children('.label').text('Off')
        }
    }


    $("#autocmp").autocomplete({
        source: [
            { label: "Mathematics", value: "MATHS" },
            { label: "Chemistry", value: "CHEM" },
            { label: "Physics", value: "PHY" },
            { label: "English", value: "ENG" },
            { label: "Environmental Science", value: "EVS" }
        ],
        minLength: 5,
    });
    console.log('Autocomplete done.')

    // else {

    // }

    // Semi-radio button
    // $('.checkbox input[type="checkbox"]').click(function(){
    //     $(this).parent().toggleClass('on');

    //     if ($(this).parent().hasClass('on')) {
    //         $(this).parent().children('.label').text('On')
    //     } else {
    //         $(this).parent().children('.label').text('Off')
    //     }
    // });
});