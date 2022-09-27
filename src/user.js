// personal-info
const personalInfo = document.querySelector('.personal-info')
if (personalInfo !== null && personalInfo !== undefined) {
    personalInfo.addEventListener('submit', (e) => {
        e.preventDefault();
        setCookiePersonalInformation();
        console.log("Nice one! Nom nom nom");
    
        //Proceed to the next page
        // console.log(personalInfo.signup_id.value)
        window.location = "signup2.html";
        
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

