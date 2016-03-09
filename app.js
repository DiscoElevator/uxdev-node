const express = require("express");
const fs = require("fs");
const async = require("async");
const FileUploader = require("./file-uploader.js");

const UPLOAD_DIR_PATH = __dirname + "/uploads/";
const FILE_LIFETIME = 1000 * 3600 * 48;
const MAX_FILE_SIZE = 1048576;

const app = express();

app.use("/", express.static(__dirname + "/public"));

const upload = FileUploader.createUploadFunction(UPLOAD_DIR_PATH, "upload", {fileSize: MAX_FILE_SIZE});
app.post("/upload", upload, (req, res, next) => {
	res.status(200).json({
		id: req.__fileId
	});
	setTimeout(() => {
		deleteOldFile(req.__fileId);
	}, FILE_LIFETIME);
});
app.get("/download/:fileId", (req, res, next) => {
	var dirName = UPLOAD_DIR_PATH + req.params.fileId;
	fs.readdir(dirName, (err, files) => {
		if (files && (files.length === 1)) {
			res.download(dirName + "/" + files[0]);
		} else {
			res.sendStatus(404).send("No file found");
		}
	});
});
app.use((err, req, res, next) => {
	res.status(500).json({
		err: err
	});
});

fs.mkdir(UPLOAD_DIR_PATH, startServer);

function startServer() {
	app.listen(3000, () => {
		console.log("FileEx listening on port 3000!");
	});
}

function deleteOldFile(fileId) {
	var dirName = UPLOAD_DIR_PATH + fileId;
	fs.readdir(dirName, (err, files) => {
		if (!files) {
			fs.rmdir(dirName);
		}
		var filesToDelete = files.map(file => {
			return dirName + "/" + file;
		});
		async.each(filesToDelete, fs.unlink, err => {
			if (!err) {
				fs.rmdir(dirName);
			} else {
				console.log(err);
			}
		});
	});
}