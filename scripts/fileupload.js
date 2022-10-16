const dragArea = document.querySelectorAll(".file-drag-area");
const dragText = document.querySelectorAll(".drag-caption");


let button = document.querySelectorAll(".file-drag-area .button");
let input = document.querySelectorAll(".file-drag-area input");

// FileReader and Blob
let file;
let blobVehicleFront;
let blobVehicleSide;
let blobVehicleRear;
//When file is inside the drag area
// Give each of it an event to listen to
for (let dragAreas = 1; dragAreas <= 3; dragAreas++) {
    fileExplorer_Events(button[dragAreas-1], input[dragAreas-1], dragArea[dragAreas-1], dragAreas);
    fileDragArea_Events(dragArea[dragAreas-1], dragText[dragAreas-1], dragAreas)
}

/**
 * Drag area
 */



// Responsible for caching the data of uploaded vehicle
//v means vehicle
function doStoreVehicleData(file, vOrientation, vName, vType) {
    const reader = new FileReader();  //convert the file into data URL.
    reader.addEventListener("load", function() {
      console.log(reader.result); //print the Blob
      localStorage.setItem(vOrientation, reader.result); 
      localStorage.setItem(vName, file.name);
      localStorage.setItem(vType, file.type);
    });
    reader.readAsDataURL(file);
}

function fileExplorer_Events(myButton, myInput, myDragArea, index) {
    myButton.addEventListener("click", () => {
        console.log("Explorer is clicked!");
        myInput.click(); //if the button is click, make "input" clicked also
    });
    myInput.addEventListener("change", function(e) {
        file = this.files[0];
        myDragArea.classList.add("active");
        displayFile(file, myDragArea);


        console.log('change explorer');
        //Check whether if the file was uploaded under Front, Side, or Rear vehicle container
        switch(index) {
            case 1: {
                doStoreVehicleData(file, "vehicle-front", "vehicle-front-filename", "vehicle-front-filetype");
                break;
            }
            case 2: {
                doStoreVehicleData(file, "vehicle-side", "vehicle-side-filename", "vehicle-side-filetype");
                break;
            }
            case 3: {
                doStoreVehicleData(file, "vehicle-rear", "vehicle-rear-filename", "vehicle-rear-filetype");
                break;
            }
        }
        
    });
}

function fileDragArea_Events(myDragArea, mDragText, index) {
    console.log("events:", myDragArea);

    // When the file drag over (natapat pa lang)
    myDragArea.addEventListener("dragover", (event) => {
        console.log("File is inside the drag area.");
        event.preventDefault(); //prevent image in opening a new tab
        myDragArea.textContent = "Release to upload.";
        mDragText.classList.add("active"); //add active style
    });
    
    
    // When file leaves the drag area
    myDragArea.addEventListener("dragleave", () => {
        console.log("The file left the drag area.");
        dragText.textContent = "Drag and Drop";
        dragArea.classList.remove("active"); //remove active style
    })
    
    // When the file is drop in the dragArea
    myDragArea.addEventListener("drop", (event) => {
        console.log("This is dropped inside the drag area.");
        event.preventDefault(); //prevent image in opening a new tab
    
        
        file = event.dataTransfer.files[0]; //access first file when multiple is selected
        console.log(file);
        console.log(file.type)
    
        displayFile(file, myDragArea);
        //Check whether if the file was uploaded under Front, Side, or Rear vehicle container
        switch(index) {
            case 1: {
                doStoreVehicleData(event.dataTransfer.files[0], "vehicle-front", "vehicle-front-filename", "vehicle-front-filetype");
                break;
            }
            case 2: {
                doStoreVehicleData(event.dataTransfer.files[0], "vehicle-side", "vehicle-side-filename", "vehicle-side-filetype");
                break;
            }
            case 3: {
                doStoreVehicleData(event.dataTransfer.files[0], "vehicle-rear", "vehicle-rear-filename", "vehicle-rear-filetype");
                break;
            }
        }
    });
}

function displayFile(file, dragArea) {
    console.log("displayFile() is called");
    let validFileExt = ["image/jpeg", "image/jpg", "image/png"];
    //Is the file extension valid?
    const reader = new FileReader();
    
    if(validFileExt.includes(file.type)) {
        reader.addEventListener('load', (event) => {
            const result = event.target.result;
            let imageTag = 
            `<img src="${result}" alt="dropped file">`;
            dragArea.innerHTML = imageTag;
            // Do something with result
        });
    }
    reader.readAsDataURL(file);

    // reader.addEventListener('progress', (event) => {
    //     if (event.loaded && event.total) {
    //     const percent = (event.loaded / event.total) * 100;
    //     console.log(`Progress: ${Math.round(percent)}`);
    //     }
    // });
}




// function displayFile(file, dragArea) {
//     console.log("displayFile() is called");
//     let validFileExt = ["image/jpeg", "image/jpg", "image/png"];


//     //Is the file extension valid?
//     if(validFileExt.includes(file.type)) {
//         let fileReader = new FileReader();
//         fileReader.onload = () => {
//             let fileURL = fileReader.result;
//             // console.log(fileURL);
//             let imageTag = 
//             `<img src="${fileURL}" alt="dropped file">`;
//             dragArea.innerHTML = imageTag;
//         };
//         fileReader.readAsDataURL(file);
//     }
//     else {
//         alert("The file is not an image or has an invalid file extension");
//     }
// }


// function displayFile2(file, dragArea) {
//     console.log("displayFile() is called");
//     let validFileExt = ["image/jpeg", "image/jpg", "image/png"];
//     //Is the file extension valid?
//     if(validFileExt.includes(file.type)) {
//         let fileReader = new FileReader();
//         fileReader.onload = () => {
//             let fileURL = fileReader.result;
//             // console.log(fileURL);
//             let imageTag = 
//             `<img src="${fileURL}" alt="dropped file">`;
//             dragArea.innerHTML = imageTag;
//         };
//         fileReader.readAsDataURL(file);
//     }
//     else {
//         alert("The file is not an image or has an invalid file extension");
//     }
// }