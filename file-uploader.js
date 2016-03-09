const multer = require("multer");
const shortid = require("shortid");
const fs = require("fs");

function createDiskStorage(uploadDirPath) {
	var path = uploadDirPath || __dirname + "/uploads/";
	return multer.diskStorage({
		destination(req, file, callback) {
			var id = shortid.generate();
			var dirname = path + id;
			fs.mkdir(dirname, () => {
				req.__fileId = id;
				callback(null, dirname);
			});
		},
		filename(req, file, callback) {
			callback(null, file.originalname);
		}
	});
}

var FileUploader = {
	createUploadFunction: function (dirPath, fieldName, limits) {
		var uploader = multer({
			storage: createDiskStorage(dirPath),
			limits: limits
		});
		var upload = uploader.single(fieldName);

		return function (req, res, next) {
			upload(req, res, err => {
				if (err) {
					next(err);
				}
			});
		};
	}
};
module.exports = FileUploader;
