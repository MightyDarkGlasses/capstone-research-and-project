//see the cookie.js for getCookie() function
let idnum = getCookie("id");
let fname = getCookie("fname");
let mname = getCookie("mname");
let lname = getCookie("lname");
let email = getCookie("email");
let phone = getCookie("phone");
let pass = getCookie("pass");
let model = getCookie("model");
let plate = getCookie("plate");

console.log("Cookie: ", document.cookie);
// console.log();
console.log("id", idnum);
document.getElementById("preview_fullname").innerText = `${lname}, ${fname} ${mname}`;
document.getElementById("preview_idnum").innerText = idnum;
document.getElementById("preview_email").innerText = email;
document.getElementById("preview_phonenum").innerText = phone;
document.getElementById("preview_vehiclemodel").innerText = model;
document.getElementById("preview_vehicleplate").innerText = plate;



