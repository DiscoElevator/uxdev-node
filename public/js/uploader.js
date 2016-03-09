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
			response.json().then(json => {
				if (json.err) {
					FileUploader.appendMessage(getErrorMessage(json.err));
				} else {
					FileUploader.appendMessage("File '" + file.name + "' uploaded at url: " + window.location.href + "download/" + json.id);
				}
			}).catch(e => {
				console.log("error parsing json:", e);
			});
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

	function getErrorMessage(error) {
		if (!error) {
			return null;
		}
		var result = "";
		if ("LIMIT_FILE_SIZE" === error.code) {
			result = "File size should not be > 10MB";
		}
		return result;
	}
})(window.FileUploader);