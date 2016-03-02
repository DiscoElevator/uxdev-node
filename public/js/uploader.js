window.FileUploader = window.FileUploader || {};

(function (FileUploader) {
	"use strict";

	FileUploader.uploadFile = (e) => {
		e.preventDefault();
		var fileElement = document.querySelector("#fileupload");
		if (!fileElement.files.length) {
			return;
		}
		var formData = new FormData();
		var file = fileElement.files[0];
		formData.append("upload", file, file.name);

		fetch("/upload", { // TODO clean form after upload complete
			method: "POST",
			body: formData
		}).then(response => {
			if (response.status === 200) {
				response.json().then(json => {
					FileUploader.appendMessage("File '" + file.name + "' uploaded at url: " + window.location.href + "download/" + json.id);
				}).catch(e => {
					console.log("error parsing json:", e);
				});
			}
		}).catch(e => {
			console.log(e);
		});
	};

	FileUploader.clearMessages = () => {
		var msgEl = document.querySelector("#messages");
		msgEl.innerHTML = "";
	};

	FileUploader.appendMessage = (message) => {
		var msgEl = document.createElement("li");
		msgEl.appendChild(document.createTextNode(message));
		var messagesEl = document.querySelector("#messages");
		messagesEl.appendChild(msgEl);
	};
})(window.FileUploader);