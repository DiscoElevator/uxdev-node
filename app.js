const express = require("express");
const multer = require("multer");
const shortid = require("shortid");
const fs = require("fs");

const UPLOAD_DIR_PATH = __dirname + "/uploads/";

const diskStorage = multer.diskStorage({
	destination(req, file, callback) {
		var id = shortid.generate();
		var dirname = UPLOAD_DIR_PATH + id;
		fs.mkdir(dirname, () => {
			req.__fileId = id;
			callback(null, dirname);
		});
	},
	filename(req, file, callback) {
		callback(null, file.originalname);
	}
});

const uploader = multer({
	storage: diskStorage,
	limits: {
		fileSize: 1048576
	}
});
const app = express();

app.use("/", express.static(__dirname + "/public"));

var upload = uploader.single("upload");
app.post("/upload", upload, (req, res, next) => {
	res.status(200).json({
		id: req.__fileId
	});
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

function uploadFile(req, res, next) {
	upload(req, res, err => {
		if (err) {
			next(err);
		}
	});
}