const cloudinary = require('cloudinary').v2

cloudinary.config({
    cloud_name: process.env.CLODINARY_CLOUD_NAME,
    api_key: process.env.CLODINARY_API_KEY,
    api_secret: process.env.CLODINARY_API_SECRET_KEY
})

const uploadImageClodinary = async (image) => {
    if (!image) {
        throw new Error("No image file provided");
    }

    const buffer =
        image.buffer || Buffer.from(await image.arrayBuffer?.());

    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({ folder: "skkart" }, (error, uploadResult) => {
            if (error) return reject(error);
            resolve(uploadResult);
        }).end(buffer);
    });
}
 const deleteImageCloudinaryByUrl = async (imageUrl) => {
  if (!imageUrl) {
    throw new Error("No image URL provided");
  }

  // Extract public ID from URL
  // 1. Remove the part before /upload/
  // 2. Remove version (e.g. v1746870359)
  // 3. Remove file extension

  const urlParts = imageUrl.split('/upload/');
  if (urlParts.length < 2) {
    throw new Error("Invalid Cloudinary URL");
  }

  const afterUpload = urlParts[1]; // e.g. "v1746870359/skkart/hup0umzekepomnhli0c5.png"

  // Remove version (starts with v + digits)
  const afterVersion = afterUpload.replace(/^v\d+\//, ''); // "skkart/hup0umzekepomnhli0c5.png"

  // Remove extension from filename
  const publicId = afterVersion.replace(/\.[^/.]+$/, ""); // "skkart/hup0umzekepomnhli0c5"

  if (!publicId) {
    throw new Error("Unable to extract public ID");
  }

  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
};


module.exports = {
    uploadImageClodinary,
    deleteImageCloudinaryByUrl
}