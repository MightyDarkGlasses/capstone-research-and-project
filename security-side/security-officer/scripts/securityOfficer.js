// QR CODE SUCCESS

// import * as fire from "../src/index.js";
// import * as fire from "../src/index";



console.log('securityOfficer.js');
function loadSecurityOfficerResult() {
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("content-container").innerHTML =
        this.responseText;
    }
  };

  xhttp.open("GET", "securityOfficer-home-success.html", true);
  xhttp.send();
}

jQuery(function() {
  $('#account-id').on('click', (e) => {
    console.log('My Account');
    loadMyAccount();
  });

  $('#logs-id').on('click', (e) => {
    console.log('Logs');
    loadLogs();
  });

  $('#popup').on('click', () => {
    $("#ex1").modal({
      fadeDuration: 100
    });
  });
})



// VISITOR
function loadAddVisitor() {
  var SearchHide = $("#search-area-id");
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("content-container").innerHTML =
        this.responseText;
      SearchHide.hide();
    }
  };

  xhttp.open("GET", "securityOfficer-visitor.html", true);
  xhttp.send();
}
// MYACCOUNT
function loadMyAccount() {
  var SearchHide = $("#search-area-id");
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("content-container").innerHTML =
        this.responseText;
    }
  };

  xhttp.open("GET", "securityOfficer-myAccount.html", true);
  // xhttp.open("GET", '../security-officer/vehicle.js', true);
  xhttp.send();
}
// LOGS
function loadLogs() {
  var SearchHide = $("#search-area-id");
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("content-container").innerHTML =
        this.responseText;
    }
  };
  xhttp.open("GET", "securityOfficer-logs.html", true);
  xhttp.send();
}


// ########## Account Information ##########
function popName() {
  var popName = $("#pop-name");

  jQuery(function () {
    $("#name-id").ready(function () {
      popName.slideToggle();
    });
  });
}
function popAddress() {
  var popAddress = $("#pop-address");

  jQuery(function () {
    $("#address-id").ready(function () {
      popAddress.slideToggle();
    });
  });
}
function popPhoneNumber() {
  var popPhoneNumber = $("#pop-phonenum");

  jQuery(function () {
    $("#phonenumber-id").ready(function () {
      popPhoneNumber.slideToggle();
    });
  });
}
function popEmail() {
  var popEmail = $(".pop-email");

  jQuery(function () {
    $("#email-id").ready(function () {
      popEmail.slideToggle();
    });
  });
}
function popPassword() {
  var popPassword = $(".pop-password");

  jQuery(function () {
    $("#password-id").ready(function () {
      popPassword.slideToggle();
    });
  });
}

var SearchHide = $("#search-area-id");
let query = window.matchMedia("(max-width: 768px)");

if (query.matches) {
  SearchHide.slideToggle();
}

// document.addEventListener("DOMContentLoaded", (e) => {
//   // let inputs = document.querySelector('select');
//   // inputs.forEach((e) => {
//   //   e.click()
//   // });
//   // console.log(inputs)
  
//   // Perform a default selection.
//   $('#start-button').click();
//   $('option[value="default-style"]').prop( 'selected', 'selected' );
//   $('option[value="original"]').prop( 'selected', 'selected' );
//   $('option[value="environment"]').prop( 'selected', 'selected' );


//   const video = document.getElementById("qr-video");
//   const videoContainer = document.getElementById("video-container");
//   const camHasCamera = document.getElementById("cam-has-camera");
//   const camList = document.getElementById("cam-list");
//   const camHasFlash = document.getElementById("cam-has-flash");
//   const flashToggle = document.getElementById("flash-toggle");
//   const flashState = document.getElementById("flash-state");
//   const camQrResult = document.getElementById("cam-qr-result");
//   const camQrResultTimestamp = document.getElementById(
//     "cam-qr-result-timestamp"
//   );
//   const fileSelector = document.getElementById("file-selector");
//   const fileQrResult = document.getElementById("file-qr-result");
  

//   // setResult if the QR scan was successful
//   function setResult(label, result) {
//     console.log(result.data);
//     label.textContent = result.data;
//     camQrResultTimestamp.textContent = new Date().toString();
//     label.style.color = "teal";
//     clearTimeout(label.highlightTimeout);
//     label.highlightTimeout = setTimeout(
//       () => (label.style.color = "inherit"),
//       100
//     );
//     scanner.stop();
//     document.querySelector("#placeholder").style.display = "flex";
//     document.querySelector("#video-container").style.display = "none";
//   }

//   // ####### Web Cam Scanning #######

//   const scanner = new QrScanner(
//     video,
//     (result) => setResult(camQrResult, result),
//     {
//       onDecodeError: (error) => {
//         camQrResult.textContent = error;
//         camQrResult.style.color = "inherit";
//       },
//       highlightScanRegion: true,
//       highlightCodeOutline: true,
//     }
//   );

//   const updateFlashAvailability = () => {
//     scanner.hasFlash().then((hasFlash) => {
//       camHasFlash.textContent = hasFlash;
//       flashToggle.style.display = hasFlash ? "inline-block" : "none";
//     });
//   };

//   scanner
//     .start()
//     .then(() => {

//       document.querySelector("#video-container").style.display = "grid";
//       document.querySelector("#placeholder").style.display = "none";

//       updateFlashAvailability();
//       // List cameras after the scanner started to avoid listCamera's stream and the scanner's stream being requested
//       // at the same time which can result in listCamera's unconstrained stream also being offered to the scanner.
//       // Note that we can also start the scanner after listCameras, we just have it this way around in the demo to
//       // start the scanner earlier.
//       QrScanner.listCameras(true).then((cameras) =>
//         cameras.forEach((camera) => {
//           const option = document.createElement("option");
//           option.value = camera.id;
//           option.text = camera.label;
//           camList.add(option);
//         })
//       );
//     })
//     .catch((fail) => {
//       console.log("You denied the permission to activate your camera.");
//       console.log(
//         "You can do file upload instead or allow the camera permission on your browser settings."
//       );

//       document.querySelector(
//         ".message"
//       ).innerText = `You denied the permission to activate your camera.
//       You can do file upload instead or allow the camera permission on your browser settings.`;

//       document.querySelector("#camera-icon").style.background =
//         "url('https://api.iconify.design/humbleicons/camera-off.svg?color=white') no-repeat center center / contain";
//       // background: url('https://api.iconify.design/humbleicons/camera-off.svg?color=white') no-repeat center center / contain;
//     });

//   QrScanner.hasCamera().then(
//     (hasCamera) => (camHasCamera.textContent = hasCamera)
//   );

//   // for debugging
//   window.scanner = scanner;


//   document
//     .getElementById("scan-region-highlight-style-select")
//     .addEventListener("change", (e) => {
//       videoContainer.className = e.target.value;
//       scanner._updateOverlay(); // reposition the highlight because style 2 sets position: relative
//     });

//   document
//     .getElementById("show-scan-region")
//     .addEventListener("change", (e) => {
//       const input = e.target;
//       const label = input.parentNode;
//       label.parentNode.insertBefore(scanner.$canvas, label.nextSibling);
//       scanner.$canvas.style.display = input.checked ? "block" : "none";
//     });

//   document
//     .getElementById("inversion-mode-select")
//     .addEventListener("change", (event) => {
//       scanner.setInversionMode(event.target.value);
//     });

//   camList.addEventListener("change", (event) => {
//     scanner.setCamera(event.target.value).then(updateFlashAvailability);
//   });

//   flashToggle.addEventListener("click", () => {
//     scanner
//       .toggleFlash()
//       .then(
//         () => (flashState.textContent = scanner.isFlashOn() ? "on" : "off")
//       );
//   });

//   document.getElementById("start-button").addEventListener("click", () => {
//     scanner.start();
//     document.querySelector("#video-container").style.display = "grid";
//     document.querySelector("#placeholder").style.display = "none";
    
//   });

//   document.getElementById("stop-button").addEventListener("click", () => {
//     scanner.stop();

    
//     document.querySelector("#placeholder").style.display = "flex";
//     document.querySelector("#video-container").style.display = "none";
//   });

//   // document.getElementById("start-button").click();
  
//   // ####### File Scanning #######

//   // fileSelector.addEventListener('change', event => {
//   //     const file = fileSelector.files[0];
//   //     if (!file) {
//   //         return;
//   //     }
//   //     QrScanner.scanImage(file, { returnDetailedScanResult: true })
//   //         .then(result => setResult(fileQrResult, result))
//   //         .catch(e => setResult(fileQrResult, { data: e || 'No QR code found.' }));
//   // });
// }); //end of DOMContentLoaded
