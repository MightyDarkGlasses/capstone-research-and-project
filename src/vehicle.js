const vehicleInfo = document.querySelector(".vehicle-form");

if (vehicleInfo !== null) {
    vehicleInfo.addEventListener('submit', (e) => {
        e.preventDefault();    
        console.log("Bazinga!");
    
        setCookiePersonalInformation();
        window.location = "signup3.html";
    });
    
    function setCookiePersonalInformation() {
        const d = new Date();
        let exdays = 1;
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        let expires = d.toUTCString();
    
        document.cookie = `model=${vehicleInfo.signup_vehiclemodel.value};Set-Cookie: flavor=choco; SameSite=None; Secure`;
        document.cookie = `plate=${vehicleInfo.signup_vehicleplatenum.value};Set-Cookie: flavor=choco; SameSite=None; Secure`;
    
        return;
    }
}

    // let frontView = vehicleInfo.classList.contains('active');
    // let sideView = vehicleInfo.classList.contains('active');
    // let rearView = vehicleInfo.classList.contains('active');

    // if (frontView && sideView && rearView) {
    //     // let front = document.querySelector("#vehicle-front .file-drag-area img");
    //     // let side = document.querySelector("#vehicle-side .file-drag-area img");
    //     // let rear = document.querySelector("#vehicle-back .file-drag-area img");
        
    //     document.cookie = ``;
    // }
