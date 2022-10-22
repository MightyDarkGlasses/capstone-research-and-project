import * as fire from "../src/index";



let windowLocation = window.location.pathname;
window.addEventListener('DOMContentLoaded', () => {
if(windowLocation.indexOf("user-announcement") > -1) {
    console.log('announcement5.js');
}
});