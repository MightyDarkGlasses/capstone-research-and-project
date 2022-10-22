document.querySelectorAll(".drop-zone__input").forEach((inputElement) => {
	const dropZoneElement = inputElement.closest(".drop-zone");
	// const dropZoneInfo = document.querySelector('.drop-zone-info');
	// console.log('dropZoneElement:', dropZoneElement)
	

	dropZoneElement.addEventListener("click", (e) => {
		inputElement.click();
	});

	// Clicked
	inputElement.addEventListener("change", (e) => {
		if (inputElement.files.length) {
			// console.log('file index change', e.target.getAttribute('name'))
			updateThumbnail(dropZoneElement, inputElement.files[0]);
			const doName = e.target.getAttribute('name');
			doStoreVehicleData(inputElement.files[0], doName, `${doName}-filename`, `${doName}-filetype`);
			document.querySelector(`.${doName}-drop-info`).style.display = 'none';
			// console.log(doName, doName+'-drop-info', document.querySelector(`.${doName}-drop-info`))
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

	// Dropped
	dropZoneElement.addEventListener("drop", (e) => {
		e.preventDefault();

		if (e.dataTransfer.files.length) {
			// console.log('file index dropped', e.target.getAttribute('name'))
			inputElement.files = e.dataTransfer.files;
			updateThumbnail(dropZoneElement, e.dataTransfer.files[0]);
			const doName = e.target.getAttribute('name');
			doStoreVehicleData(e.dataTransfer.files[0], doName, `${doName}-filename`, `${doName}-filetype`);
			document.querySelector(`.${doName}-drop-info`).style.display = 'none';
		}
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
      console.log(reader.result); //print the Blob
      localStorage.setItem(vOrientation, reader.result); 
      localStorage.setItem(vName, file.name);
      localStorage.setItem(vType, file.type);
    });
    reader.readAsDataURL(file);
}