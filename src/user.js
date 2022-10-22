// personal-info

document.addEventListener('DOMContentLoaded', function(e) {
const personalInfo = document.querySelector('.personal-info');

    let signup_cpassword = document.querySelector('input[name="signup_cpassword"]');
    setPredefinedValue();
    $('#signup_password').on('click', () => {
        // console.log('hey hey hey')
        console.log($('#signup_password').val());
    });
    $('#signup_cpassword').on('click', () => {
        // console.log('hey hey hey')
        console.log($('#signup_cpassword').val());
    });


    if (personalInfo !== null && personalInfo !== undefined) {
        personalInfo.addEventListener('submit', (e) => {
            e.preventDefault();
            
            window.location = "signup2.html";

            if($('#signup_password').val() === $('#signup_cpassword').val()) {
                setCookiePersonalInformation();
                console.log('Next page.');
            }
            else {
                console.log('Re-check the password');
            }
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
            
            //We can encrypt the password here...
            document.cookie = `pass=${personalInfo.signup_cpassword.value};expires=${expires};Set-Cookie: flavor=choco; SameSite=None; Secure`;
            console.log("Cookie", document.cookie);
            
            return;
        }
    }


    function setPredefinedValue() {
        let cachedInfoData = getCookie();
        if(cachedInfoData !== {}) {
            console.log(cachedInfoData);

            $('#signup_id').val(cachedInfoData['id'])
            $('#signup_fname').val(cachedInfoData['fname'])
            $('#signup_mname').val(cachedInfoData['mname'])
            $('#signup_lname').val(cachedInfoData['lname'])
            $('#signup_email').val(cachedInfoData['email'])
            $('#signup_phone').val(cachedInfoData['phone'])
            $('#signup_password').val(cachedInfoData['pass'])
            // $('#signup_cpassword').val(cachedInfoData['']);
        }
    }
    

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
    }

}); //end of DOMContentLoaded