document.querySelectorAll(".drop-zone__input").forEach((inputElement) => {
	const dropZoneElement = inputElement.closest(".drop-zone");

	dropZoneElement.addEventListener("click", (e) => {
		inputElement.click();
	});

	inputElement.addEventListener("change", (e) => {
		if (inputElement.files.length) {

			
			let fileName = inputElement.files[0].type;
			console.log('explorer: ', fileName);
			let allowedFileTypes = ["image/png", "image/jpeg", "image/gif", "image/jpeg"];
			
			let fileSize = ((inputElement.files[0].size/1024)/1024).toFixed(2); // MB
			console.log(fileSize);

			// Check if the file is within the allowed file size limit.
			if(fileSize > 10.0) {
				$('.modal-container-main').html(`
				<p>Failure to drop an image<br/>Please upload a file within the alloted file size limit (10 MB).</p>
				<br/>File size given: <b>${fileSize} MB</b>`);
				$("#error-popup").modal({
					fadeDuration: 100
				});
			}
			else {
				if(allowedFileTypes.includes(fileName)) {
					updateThumbnail(dropZoneElement, inputElement.files[0]);
					
					if(!dropZoneElement.classList.contains('drop-qr-code')) {
						const doName = e.target.getAttribute('name');
						doStoreVehicleData(inputElement.files[0], doName, `${doName}-filename`, `${doName}-filetype`);
						document.querySelector(`.${doName}-drop-info`).style.display = 'none';	
					}
				}
				else {
					$('.modal-container-main').html(`
					<p>Failure to drop an image<br/>Only <b>.jpeg, .png, and .gif</b> file extensions are allowed.</p>
					<br/>File extension given: <b>${fileName}</b>`);
					$("#error-popup").modal({
						fadeDuration: 100
					});
				}
			}
		}
	});

	dropZoneElement.addEventListener("dragover", (e) => {
		e.preventDefault();
		dropZoneElement.classList.add("drop-zone--over");
	});

	["dragleave", "dragend"].forEach((type) => {
		dropZoneElement.addEventListener(type, (e) => {
			dropZoneElement.classList.remove("drop-zone--over");
		});
	});

	dropZoneElement.addEventListener("drop", (e) => {
		e.preventDefault();

		let fileName = e.dataTransfer.files[0].type;
		console.log('drop: ', fileName);
		let allowedFileTypes = ["image/png", "image/jpeg", "image/gif", "image/jpeg"];

		let fileSize = ((e.dataTransfer.files[0].size/1024)/1024).toFixed(2); // MB
		console.log(fileSize);

		// Check if the file is within the allowed file size limit.
		if(fileSize > 10.0) {
			$('.modal-container-main').html(`
			<p>Failure to drop an image<br/>Please upload a file within the alloted file size limit (10 MB).</p>
			<br/>File size given: <b>${fileSize} MB</b>`);
			$("#error-popup").modal({
				fadeDuration: 100
			});
		}
		else {
			// Check if the file is within the accepted file type.
			if(allowedFileTypes.includes(fileName)) {
				if (e.dataTransfer.files.length) {
					inputElement.files = e.dataTransfer.files;
					updateThumbnail(dropZoneElement, e.dataTransfer.files[0]);
					
					const doName = inputElement.getAttribute('name');
					console.log('drop doName: ', doName);
					doStoreVehicleData(e.dataTransfer.files[0], doName, `${doName}-filename`, `${doName}-filetype`);
					document.querySelector(`.${doName}-drop-info`).style.display = 'none';
				}
			}
			else {
				$('.modal-container-main').html(`
				<p>Failure to drop an image<br/>Only <b>.jpeg, .png, and .gif</b> file extensions are allowed.</p>
				<br/>File extension given: <b>${fileName}</b>`);
				$("#error-popup").modal({
					fadeDuration: 100
				});
			}
		} //end of if
		dropZoneElement.classList.remove("drop-zone--over");
	});

	
});

/**
 * Updates the thumbnail on a drop zone element.
 *
 * @param {HTMLElement} dropZoneElement
 * @param {File} file
 */
function updateThumbnail(dropZoneElement, file) {
	let thumbnailElement = dropZoneElement.querySelector(".drop-zone__thumb");

	// First time - remove the prompt
	if (dropZoneElement.querySelector(".drop-zone__prompt")) {
		dropZoneElement.querySelector(".drop-zone__prompt").remove();
	}

	// First time - there is no thumbnail element, so lets create it
	if (!thumbnailElement) {
		thumbnailElement = document.createElement("div");
		thumbnailElement.classList.add("drop-zone__thumb");
		dropZoneElement.appendChild(thumbnailElement);
	}

	thumbnailElement.dataset.label = file.name;

	// Show thumbnail for image files
	if (file.type.startsWith("image/")) {
		const reader = new FileReader();

		reader.readAsDataURL(file);
		reader.onload = () => {
			thumbnailElement.style.backgroundImage = `url('${reader.result}')`;
		};
	} else {
		thumbnailElement.style.backgroundImage = null;
	}
}
/*
	file = this.files[0];
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
 */
function doStoreVehicleData(file, vOrientation, vName, vType) {
    const reader = new FileReader();  //convert the file into data URL.
    reader.addEventListener("load", function() {
    //   console.log(reader.result); //print the Blob
      localStorage.setItem(vOrientation, reader.result); 
      localStorage.setItem(vName, file.name);
      localStorage.setItem(vType, file.type);
    });
    reader.readAsDataURL(file);
}

