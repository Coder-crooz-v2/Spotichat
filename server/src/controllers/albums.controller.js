import { Album } from "../models/album.model.js";

export const getAllAlbums = async (req, res, next) => {
    try {
        const albums = await Album.find();
        res.status(200).json({
            success: true,
            data: albums
        });
    }
    catch (error) {
        console.log("Error in getAllAlbums");
        next(error);
    }
}

export const getAlbumById = async (req, res, next) => {
    try {
        const { albumId } = req.params;
        const album = await Album.findById(albumId).populate('songs');
        if (!album) {
            return res.status(404).json({
                success: false,
                message: "Album not found"
            });
        }

        res.status(200).json({
            success: true,
            data: album
        });
    }
    catch (error) {
        console.log("Error in getAlbumById");
        next(error);
    }
}