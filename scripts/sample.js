let button = document.getElementById("increment");
let counter = document.getElementById("score");

let currentCounter = 0;
button.addEventListener("click", (e) => {
    console.log(e); //Display the target

    counter.innerText = ++currentCounter; 
})


//factory function. 
const user = (name) => {
    // const sayName = ()=> {
    //     console.log(name);
    // }
    return {name}
} 


//module pattern.
const create = (()=>{
    let users = []
    let userName  = document.querySelector("#name"); 
    // let lastName = document.querySelector("#lastName");   
    const qrcode = new QRCode(document.querySelector("#qrcode"));
    const render = () => {
        generateQr();       
        function generateQr () {
            let data = userName.value; 
            const meeco = user(data); 
            qrcode.makeCode(meeco.name);
            users.push(meeco.name);
            console.log(users);
        }
    }
    return {render}
})();

// create.render()
