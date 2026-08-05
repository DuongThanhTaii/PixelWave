"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImage = void 0;
const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            res.status(400).json({ success: false, message: 'No image uploaded' });
            return;
        }
        // The file is automatically uploaded to Cloudinary by the multer middleware.
        // The resulting URL is available in req.file.path
        res.status(200).json({
            success: true,
            data: {
                url: req.file.path
            }
        });
    }
    catch (error) {
        console.error('uploadImage error:', error);
        res.status(500).json({ success: false, message: 'Image upload failed' });
    }
};
exports.uploadImage = uploadImage;
