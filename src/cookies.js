// function setCookiePersonalInformation(id, fname, mname, lname, email, address, phone, password) {

// document.cookie = "";
// function setCookiePersonalInformation(id, fname, mname, lname) {
//     const d = new Date();
//     let exdays = 1;
//     d.setTime(d.getTime() + (exdays*24*60*60*1000));
//     let expires = d.toUTCString();

//     // console.log("Date: ", d);
//     // console.log("Expires: ", expires);
//     // var cks = `id=${id}; fname=${fname}; mname=${mname}; lname=${lname}; expires=${expires}; path=/`;
//     // console.log("cks: ", cks);
//     // document.cookie = cks;

//     document.cookie = `fname=${fname};expires=${expires};Set-Cookie: flavor=choco; SameSite=None; Secure`;
//     document.cookie = `lname=${lname};expires=${expires};Set-Cookie: flavor=choco; SameSite=None; Secure`;

//     let cookies = document.cookie; 
//     console.log("Cookie: ", cookies);
//     return;
// }

// function displayCookies() {
//     console.log(document.cookie);
//     return;
// }

// function clearCookies() {
//     //Delete the Cookie
//     document.cookie = "expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; Set-Cookie: flavor=choco; SameSite=None; Secure";
//     return;
// }

function getCookie(cookieName) {
    let cookies = document.cookie.trim();
    let ca = cookies.split(';');
    let startIndex = cookieName.length+1;
    
    // console.log(startIndex)
    for (let counter = 0; counter < ca.length; counter++) {
        let element = ca[counter].trim();
        if (element.indexOf(cookieName) === 0) {
            return element.substring(startIndex);
        }
    }
    return "";
}

