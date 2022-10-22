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