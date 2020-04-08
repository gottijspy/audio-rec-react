const express = require("express");
const server = express();
const cors = require("cors");
const upload = require("./upload");
const multer = require("multer");

var corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};

/* Static storage location for face id images */
const audioStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./static/audio/");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, "") + file.originalname);
  },
});

/* reject an image if not of type jpeg or png. */
const audioFilter = (req, file, cb) => {
  if (file.mimetype === "audio/mp3" || file.mimetype === "audio/wav") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

/* File/image upload setting using multer */
const audioUpload = multer({
  storage: audioStorage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  //fileFilter: audioFilter,
});

server.use(cors(corsOptions));

server.post("/upload", audioUpload.single("coughAudio"), function (req, res) {
  console.log(req.file);
  res.json({ message: "Couch record saved successfully!" });
});

server.listen(8000, () => {
  console.log("Server started at port 8000!");
});
