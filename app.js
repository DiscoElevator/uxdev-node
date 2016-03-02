var express = require("express");
var multer = require("multer");
var shortid = require("shortid");
var fs = require("fs");

const UPLOAD_DIR_PATH = __dirname + "/uploads/";

var diskStorage = multer.diskStorage({
	destination(req, file, callback) {
		var id = shortid.generate();
		var dirname = UPLOAD_DIR_PATH + id;
		fs.mkdirSync(dirname); // TODO existence check, async
		req.__fileId = id; // TODO is there a better way to pass id?
		callback(null, dirname);
	},
	filename(req, file, callback) {
		callback(null, file.originalname);
	}
});

var uploader = multer({storage: diskStorage});
var app = express();


app.use("/", express.static(__dirname + "/public"));

app.post("/upload", uploader.single("upload"), (req, res, next) => {
	res.status(200).json({
		id: req.__fileId
	});
});
app.get("/download/:fileId", (req, res, next) => {
	var dirName = UPLOAD_DIR_PATH + req.params.fileId;
	fs.readdir(dirName, (err, files) => {
		if (files && (files.length === 1)) {
			res.download(dirName + "/" + files[0]); // TODO redirect to DL page
		} else {
			res.sendStatus(404); // TODO 404 page
		}
	});
});

fs.access(UPLOAD_DIR_PATH, fs.F_OK, err => {
	if (err) {
		fs.mkdir(UPLOAD_DIR_PATH, startServer);
	} else {
		startServer();
	}
});

function startServer() {
	app.listen(3000, () => {
		console.log("FileEx listening on port 3000!");
	});
}