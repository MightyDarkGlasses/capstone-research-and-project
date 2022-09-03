const dragArea = document.querySelector(".drag-area");
const dragText = document.querySelector(".header");


let button = document.querySelector(".button");
let input = document.querySelector("input");

let file;
//When file is inside the drag area

button.addEventListener("click", () => {
    console.log("Explorer is clicked!");
    input.click(); //if the button is click, make "input" clicked also
});
input.addEventListener("change", function() {
    file = this.files[0];
    dragArea.classList.add("active");
    displayFile(file);
});



/**
 * Drag area
 */

dragArea.addEventListener("dragover", (event) => {
    console.log("File is inside the drag area.");
    event.preventDefault(); //prevent image in opening a new tab
    dragText.textContent = "Release to upload.";
    dragArea.classList.add("active"); //add active style
});


// When file leaves the drag area
dragArea.addEventListener("dragleave", () => {
    console.log("The file left the drag area.");
    dragText.textContent = "Drag and Drop";
    dragArea.classList.remove("active"); //remove active style
})

// When the file is drop in the dragArea
dragArea.addEventListener("drop", (event) => {
    console.log("This is dropped inside the drag area.");
    event.preventDefault(); //prevent image in opening a new tab


    file = event.dataTransfer.files[0]; //access first file when multiple is selected
    console.log(file);

    console.log(file.type)

    displayFile(file);
});


function displayFile(file) {
    let validFileExt = ["image/jpeg", "image/jpg", "image/png"];


    //Is the file extension valid?
    if(validFileExt.includes(file.type)) {
        let fileReader = new FileReader();
        fileReader.onload = () => {
            let fileURL = fileReader.result;
            // console.log(fileURL);
            let imageTag = 
            `<img src="${fileURL}" alt="dropped file">`;
            dragArea.innerHTML = imageTag;
        };
        fileReader.readAsDataURL(file);
    }
    else {
        alert("The file is not an image or has an invalid file extension");
    }
}