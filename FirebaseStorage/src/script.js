import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { 
    getStorage, 
    ref,
    uploadBytes,
    uploadBytesResumable,
    getDownloadURL
} 
from "firebase/storage";



// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA5rA17z-ncVOEgiB3oO-wdGCYfq6VjKRs",
    authDomain: "fir-tutorial-54bcc.firebaseapp.com",
    projectId: "fir-tutorial-54bcc",
    storageBucket: "fir-tutorial-54bcc.appspot.com",
    messagingSenderId: "490596693746",
    appId: "1:490596693746:web:c49b30f3a819bc616cc26b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// <input type="file"/>
let file;
let blobbyblobbyblobbyblobbyblobbyblobby;

const fileInput = document.getElementById("image-upload"); // <input type="file" />

// When the DOM was loaded
document.addEventListener("DOMContentLoaded", () => {
  const vehicleFront = localStorage.getItem('vehicle-front');

  if (vehicleFront) {
    // console.log(document.getElementById("display-image").src);


    document.getElementById("display-image").setAttribute("src", vehicleFront);

    // const reader = new FileReader(); //read blob (or even File)
    // reader.addEventListener("load", function() {
    //   console.log(result);
    // });

    // console.log(typeof(blobbyblobbyblobbyblobbyblobbyblobby))
    // reader.readAsDataURL(blobbyblobbyblobbyblobbyblobbyblobby); //read the blob
  }
});


// https://stackoverflow.com/questions/50537735/convert-blob-to-image-file
// Local Storage and Session Storage only support strings.
fileInput.addEventListener("change", function() {
  const reader = new FileReader();  //convert the file into data URL.
  file = this.files[0]; //this -> fileInput
  console.log(file)
  // const convertToBlob = new Blob([file], {type: file.type});
  // console.log(convertToBlob);

  // Acess dataURL using load event
  reader.addEventListener("load", function() {
    console.log(reader.result); //print the Blob
      const jpegFile64 = reader.result.replace(/^data:image\/(png|jpeg);base64,/, "");
      blobbyblobbyblobbyblobbyblobbyblobby = base64ToBlob(jpegFile64, file.type);  
      console.log("imageBlob:", blobbyblobbyblobbyblobbyblobbyblobby);

      // document.getElementById("display-image").setAttribute("src", reader);
      // const blobReader = new FileReader();
      // blobReader.addEventListener("load", () => {
      //   document.getElementById("display-image").setAttribute("src", blobReader.result);
      //   console.log("Does it work?");
      // });
      // blobReader.readAsDataURL(blobbyblobbyblobbyblobbyblobbyblobby);

    //storing data in LocalStorage
    // setItem(key, blob);
    localStorage.setItem("vehicle-front", reader.result); 
  });

  reader.readAsDataURL(file);
});

// This function is used to convert base64 encoding to mime type (blob)
function base64ToBlob(base64, mime) 
{
    mime = mime || '';
    var sliceSize = 1024;
    var byteChars = window.atob(base64);
    var byteArrays = [];

    for (var offset = 0, len = byteChars.length; offset < len; offset += sliceSize) {
        var slice = byteChars.slice(offset, offset + sliceSize);
        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, {type: mime});
}

const uploadButton = document.getElementById("upload_btn");
uploadButton.addEventListener('click', (event) => {
    event.preventDefault(); //prevent submission of form
    console.log("Upload button was clicked!");

    const storage = getStorage();

    const uploadedImageFile = document.getElementById("image-upload").files[0];
    const uploadFileName = uploadedImageFile.name;
    const uploadFileType = uploadedImageFile.type;


    const reader = new FileReader();
    reader.addEventListener("load", function() {
      const jpegFile64 = reader.result.replace(/^data:image\/(png|jpeg);base64,/, "");
      blobbyblobbyblobbyblobbyblobbyblobby = base64ToBlob(jpegFile64, file.type);  
      console.log("imageBlob:", blobbyblobbyblobbyblobbyblobbyblobby);

      const metadata = {
        contentType: uploadedImageFile.type,
      };
      // uploadBytes -> accepts a Blob
      // const storageRef = ref(storage, `test/${uploadFileName}`);
      const storageRef = ref(storage, `test/${uploadFileName}`);
      console.log("type: " + uploadedImageFile.type, "metadata: " + metadata);
      const uploadTask = uploadBytesResumable(storageRef, blobbyblobbyblobbyblobbyblobbyblobby, metadata);
      uploadTask.on('state_changed', (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log('Upload is ' + progress + '% done');    //progress of upload
          }, 
          (error) => {
              // Handle unsuccessful uploads
              console.log(error);
          }, 
          () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              console.log('File available at', downloadURL);
              console.log(typeof(downloadURL))
              document.getElementById("display-image").setAttribute("src", downloadURL);
          });
        }
      ); 
    });
    reader.readAsDataURL(uploadedImageFile);
    
    // console.log(uploadedImageFile);
    // console.log(uploadFileType);
    // const filePath = document.getElementById("image-upload").value;
    // console.log("filePath:", filePath)
    // Get a reference to the storage service, which is used to create references in your storage bucket
    
    

    // Create a storage reference from our storage service
    // const storageRef = ref(storage);
    //const storageRef = ref(storage);

    //ref(storage, file_name)
    // const storageRef = ref(storage, uploadFileName);

    // const metadata = {
    //   contentType: uploadedImageFile.type,
    // };
    // uploadBytes -> accepts a Blob
    // const storageRef = ref(storage, `test/${uploadFileName}`);
    // const storageRef = ref(storage, `test/${uploadFileName}`);
    // const uploadedImageBlob = localStorage.getItem('vehicle-front');
    // console.log("type: " + uploadedImageFile.type, "metadata: " + metadata);
    // const uploadTask = uploadBytesResumable(storageRef, uploadedImageFile, metadata);
    // const uploadTask = uploadBytesResumable(storageRef, uploadedImageBlob, metadata);
    // uploadTask.on('state_changed', (snapshot) => {
    //         // Observe state change events such as progress, pause, and resume
    //         // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    //         const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    //         console.log('Upload is ' + progress + '% done');    //progress of upload

    //     }, 
    //     (error) => {
    //       // Handle unsuccessful uploads
    //       console.log(error);
    //     }, 
    //     () => {
    //     getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
    //         console.log('File available at', downloadURL);
    //         console.log(typeof(downloadURL))


    //         document.getElementById("display-image").setAttribute("src", reader);
    //         // const reader = new FileReader();  //convert the file into data URL.
    //         // // Acess dataURL using load event
    //         // reader.addEventListener("load", function() {
    //         //   document.getElementById("display-image").setAttribute("src", reader);
    //         // });
    //         // reader.readAsDataURL(downloadURL);
    //         // const display = ;
    //         // console.log("filePath:", filePath, typeof(filePath));
    //         // document.getElementById("display-image").src = "" + downloadURL;    
    //         // console.log(document.getElementById("display-image").src);
    //     });
    //   }
    // ); //end of uploadTask callback method


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

    // Create file metadata including the content type
    /** @type {any} */
    // const metadata = {
    //     contentType: uploadedImageFile.type //you can add more metadata parameter
    // };
    // Upload the file and metadata
    // const uploadTask = uploadBytesResumable(storageRef, uploadFileName, metadata);



    // let uploadTask = storageRef.child(uploadFileName).put(uploadedImageFile, metadata);
    // uploadTask.then(snapshot => snapshot.ref.getDownloadURL())
    //     .then(url => {
    //         console.log(url);
    //     }); //nested JS Promises
}); //closing for click listener