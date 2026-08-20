const multer = require("multer");

const maxImageSizeMb = Number(
  process.env.MAX_IMAGE_SIZE_MB || 5
);

const allowedMimeTypes = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);

const imageUpload = multer({
  // Temporarily hold the image in memory.
  // The image is not saved permanently to the server.
  storage: multer.memoryStorage(),

  limits: {
    fileSize: maxImageSizeMb * 1024 * 1024,
    files: 1,
  },

  fileFilter: (req, file, callback) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      return callback(
        new Error(
          "Only JPG, JPEG, PNG and WEBP images are allowed."
        )
      );
    }

    callback(null, true);
  },
});

module.exports = imageUpload;