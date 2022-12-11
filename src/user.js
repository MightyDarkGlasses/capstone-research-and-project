import * as fire from './index.js';


let windowLocation = window.location.pathname;

if(windowLocation.indexOf("signup1.html") > -1) {
console.log('signup1.js loaded')


// document.querySelector("#reg-goto-page2").addEventListener('click', function() {
// });


document.addEventListener('DOMContentLoaded', function(e) {
    // document.querySelector('input[name="user_type"]:checked').value;

    const phoneInputField = document.querySelector("#signup_phone");
    const phoneInput = window.intlTelInput(phoneInputField, {
        utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
        initialCountry: "ph",
        allowDropdown: false,
    });

    function checkPhoneNumber() {
        const phoneNumber = phoneInput.getNumber();
        if (phoneInput.isValidNumber()) {
            // alert(`Phone number in E.164 format: ${phoneNumber}`);
            return phoneNumber;
        } 
        return null;
    }


    const personalInfo = document.querySelector('.personal-info');
    let signup_cpassword = document.querySelector('input[name="signup_cpassword"]');
    setPredefinedValue();

    
    if (personalInfo !== null && personalInfo !== undefined) {
        personalInfo.addEventListener('submit', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            let phoneNumber = checkPhoneNumber();
            console.log("checkPhoneNumber: ", phoneNumber);
            if(phoneNumber !== null) {
                $("#signup_phone").val(phoneNumber);
                
                if($('#signup_password').val() === $('#signup_cpassword').val()) {
                    setCookiePersonalInformation();
                    console.log('Next page.');
    
                    fire.doSignInWithEmailAndPassword(fire.auth, 
                        $('#signup_email').val(), 'password')
                    .then((e) => {
                        //pass;
                    }).catch((error) => {
                        console.log('error: ', error);
                        switch (error.code) {
                            case 'auth/wrong-password': {
                                $('.modal-container-main').html(`<p>This email address already exist. Please use another one.</p>`);
                                $("#error-popup").modal({
                                    fadeDuration: 100
                                });
                                console.log('signup err code: ', error.code)
                                console.log('signup err message: ', error.message);
                                break;
                            }
                            case 'auth/user-not-found': {
                                console.log('Unique user!');
                                window.location = "signup2.html";
                                break;
                            }
                        }
                    });
                    
                }
                else {
                    console.log('Re-check the password');
                    $('.modal-container-main').html(`<p>Password mismatch.</p>
                    <p>Please re-check your password input.</p>`);
                    $("#error-popup").modal({
                        fadeDuration: 100
                    });
                }
            }
            else {
                console.log('Phone number is invalid.');
                $('.modal-container-main').html(`<p>Invalid phone number format.</p>
                <p>Please follow the given format in phone number.</p>`);
                $("#error-popup").modal({
                    fadeDuration: 100
                });
            }

            
        
            //J123456a
            
            return;
        });
        function setCookiePersonalInformation() {
            const d = new Date();
            let exdays = 1;
            d.setTime(d.getTime() + (exdays*24*60*60*1000));
            let expires = d.toUTCString();
        
            // let personal1 = document.getElementById("signup_id").innerHTML;
            // let personal2 = document.getElementById("signup_fname").innerHTML;
            // let personal3 = document.getElementById("signup_mname").innerHTML;
            // let personal4 = document.getElementById("signup_lname").innerHTML;
            // let personal5 = document.getElementById("signup_email").innerHTML;
            // let personal6 = document.getElementById("signup_phone").innerHTML;
            // let personal7 = document.getElementById("signup_cpassword").innerHTML;
        
            document.cookie = `expires=${expires}; Set-Cookie: flavor=choco; SameSite=None; Secure`
            document.cookie = `id=${personalInfo.signup_id.value};Set-Cookie: flavor=choco; SameSite=None; Secure`;
            document.cookie = `fname=${personalInfo.signup_fname.value};Set-Cookie: flavor=choco; SameSite=None; Secure`;
            document.cookie = `mname=${personalInfo.signup_mname.value};Set-Cookie: flavor=choco; SameSite=None; Secure`;
            document.cookie = `lname=${personalInfo.signup_lname.value};Set-Cookie: flavor=choco; SameSite=None; Secure`;
            document.cookie = `email=${personalInfo.signup_email.value};Set-Cookie: flavor=choco; SameSite=None; Secure`;
            document.cookie = `phone=${personalInfo.signup_phone.value};Set-Cookie: flavor=choco; SameSite=None; Secure`;
            document.cookie = `usertype=${personalInfo.user_type.value};Set-Cookie: flavor=choco; SameSite=None; Secure`;
            
            //We can encrypt the password here...
            document.cookie = `pass=${personalInfo.signup_cpassword.value};expires=${expires};Set-Cookie: flavor=choco; SameSite=None; Secure`;
            console.log("Cookie", document.cookie);
            
            return;
        }
    }
    else {

    }


    function setPredefinedValue() {
        let cachedInfoData = getCookie();
        if(cachedInfoData !== {}) {
            console.log(cachedInfoData);

            $('#signup_id').val(cachedInfoData['id']);
            $('#signup_fname').val(cachedInfoData['fname']);
            $('#signup_mname').val(cachedInfoData['mname']);
            $('#signup_lname').val(cachedInfoData['lname']);
            $('#signup_email').val(cachedInfoData['email']);
            $('#signup_phone').val(cachedInfoData['phone']);
            $('#signup_password').val(cachedInfoData['pass']);

            // console.log(cachedInfoData['usertype'])
            if(cachedInfoData['usertype'] === "FACULTY") {
                document.querySelector("#usertype_1").checked = true;
            }
            if(cachedInfoData['usertype'] === "NAP") {
                document.querySelector("#usertype_2").checked = true;
            }
            // $('#signup_cpassword').val(cachedInfoData['']);
        }
    } //end function setPredefinedValue()
    

    function getCookie() {
        let cookieData = {};
        let cookies = document.cookie.trim().replace("\"", '');
        let ca = cookies.split(';');
        
        // console.log(startIndex)
        for (let counter = 0; counter < ca.length; counter++) {
            if(ca[counter].indexOf('pass=') > -1) {
                // cookieData.push(ca[counter].slice(6));
                cookieData['pass'] = ca[counter].slice(6);
            }   
            else {
                console.log('presliced: ', ca[counter]);
                let element = ca[counter].trim().split("=");
                // cookieData.push(element[1]);
                cookieData[element[0]] = element[1];
            }
            // console.log(element[1])
        }
        return cookieData;
    } // end function cookie()
    
}); //end of DOMContentLoaded
}
