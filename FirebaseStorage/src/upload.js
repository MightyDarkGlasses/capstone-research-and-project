// This is for the examples sake, but you need to save the file you give to image() somewhere (e.g. the variable below)
var imageBlob = {};

function image(file, idOfImage) {
    imageBlob = file;
    var fr = new FileReader();
    var imgCar = document.createElement('img');
    imgCar.id = idOfImage;
    fr.onload = function() {
        imgCar.src = fr.result;
    }
    fr.readAsDataURL(file);
    document.body.append(imgCar)

    // <input type="file"/>
    myInput.addEventListener("change", function() {
        file = this.files[0];
    });
}


function uploadImage() {
    // This will get the first uploaded file and upload it to firebase storage
    // All files uploaded are actually blobs (it extends the blob object)

    //input files
    // storage.ref('...').put(input.files[0]);
}