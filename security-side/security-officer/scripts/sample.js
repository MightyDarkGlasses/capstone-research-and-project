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
   
    const render = () => {
    generateQr();       
    }

    function generateQr () {
        const qrContaier = document.querySelector("#qrcode");
        const qrcode = new QRCode(document.querySelector("#qrcode"));
        let data = userName.value; 
        const meeco = user(data); 
        if(data === ""){
            alert("Please enter something!")
        }
        else {
            qrcode.makeCode(meeco.name);
        }
        
        users.push(meeco.name);
        console.log(users);
        const info = document.createElement("div"); 
        qrContaier.appendChild(info)
        info.classList.add("info")
        info.textContent = data; 
    }
    return {render}
})();

// create.render()