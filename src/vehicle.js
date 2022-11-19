const vehicleInfo = document.querySelector(".vehicle-form");

if (vehicleInfo !== null && vehicleInfo !== undefined) {


    document.addEventListener('DOMContentLoaded', () => {

        //remove the recent uploads
        localStorage.removeItem("vehicle-front");
        localStorage.removeItem("vehicle-front-filetype");
        localStorage.removeItem("vehicle-front-filename");

        localStorage.removeItem("vehicle-side");
        localStorage.removeItem("vehicle-side-filetype");
        localStorage.removeItem("vehicle-side-filename");

        localStorage.removeItem("vehicle-rear");
        localStorage.removeItem("vehicle-rear-filetype");
        localStorage.removeItem("vehicle-rear-filename");

        vehicleInfo.addEventListener('submit', (e) => {
            e.preventDefault();    

    
            if((localStorage.getItem('vehicle-front') === null) ||
                (localStorage.getItem('vehicle-side') === null) ||
                localStorage.getItem('vehicle-rear') === null) {
                

                let missingImages = '<br/>';
                localStorage.getItem('vehicle-front') === null ? missingImages+="<li style='display: list-item;'><b>Front view</b></li>" : "";
                localStorage.getItem('vehicle-side') === null ? missingImages+="<li style='display: list-item;'><b>Side view</b></li>" : "";
                localStorage.getItem('vehicle-rear') === null ? missingImages+="<li style='display: list-item;'><b>Rear view</b></li>" : "";

                $('.modal-container-main').html(`
                <p>A set of images is required to completely submit the form.</p>
                <p>Missing Image/s: </p><ul style='list-style-position: inside;'>${missingImages}</ul>`);
                $("#error-popup").modal({
                    fadeDuration: 100
                });
            }
            else {
                setCookiePersonalInformation();
                window.location = "signup3.html";
            }
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
    });
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
