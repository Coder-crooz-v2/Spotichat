import { Album } from '../models/album.model.js';
import { Song } from '../models/song.model.js';
import cloudinary from '../lib/cloudinary.js';

const uploadToCloudinary = async (file) => {
    try {
        const result = await cloudinary.uploader.upload(file.tempFilePath, {
            resource_type: 'auto',
        });

        return result.secure_url;
    } catch (error) {
        console.log("Error in uploadToCloudinary", error);
        throw new Error("Error in uploading to cloudinary");
    }
}

export const createSong = async (req, res, next) => {
    try {
        if(!req.files || !req.files.audioFile || !req.files.imageFile) {
            return res.status(400).json({
                success: false,
                message: 'Audio file and image file are required'
            });
        }

        const { title, artist, albumId, duration } = req.body;
        const audioFile = req.files.audioFile;
        const imageFile = req.files.imageFile;

        const audioUrl = await uploadToCloudinary(audioFile);
        const imageUrl = await uploadToCloudinary(imageFile);

        const song = new Song({
            title,
            artist, 
            audioUrl,
            imageUrl,
            duration,
            albumId: albumId || null
        })

        await song.save();

        if (albumId) {
            await Album.findByIdAndUpdate(albumId, {
                $push: { songs: song._id }
            }, 
            { 
                new: true
            });
            res.status(201).json({
                success: true,
                message: 'Song created successfully',
                song: song
            });
        }
    } catch (error) {
        next(error)
    }
};

export const deleteSong = async (req, res, next) => {
    try {
        const { id } = req.params;

        const song = await Song.findById(id);

        if(song.albumId) {
            await Album.findByIdAndUpdate(song.albumId, {
                $pull: { songs: id }
            });
        }

        await Song.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            message: 'Song deleted successfully'
        });
    }
    catch (error) {
        console.log("Error in deleteSong");
        next(error);
    }
}

export const createAlbum = async (req, res, next) => {
    try {
        if(!req.files || !req.files.imageFile) {
            return res.status(400).json({
                success: false,
                message: 'Image file is required'
            });
        }

        const { title, artist, releaseYear } = req.body;
        const imageFile = req.files.imageFile;

        const imageUrl = await uploadToCloudinary(imageFile);

        const album = new Album({
            title,
            artist,
            imageUrl,
            releaseYear
        });

        await album.save();

        res.status(201).json({
            success: true,
            message: 'Album created successfully',
            album: album
        });
    } catch (error) {
        console.log("Error in createAlbum");
        next(error)
    }
};

export const deleteAlbum = async (req, res, next) => {
    try {
        const { id } = req.params;

        await Album.findByIdAndDelete(id);
        await Song.deleteMany({ albumId: id });

        res.status(200).json({
            success: true,
            message: 'Album deleted successfully'
        });
    }
    catch (error) {
        console.log("Error in deleteAlbum");
        next(error);
    }
}

export const checkAdmin = async (req, res, next) => {
    try {
        res.status(200).json({
            success: true,
            message: 'Admin route'
        });
    } catch (error) {
        console.log("Error in checkAdmin");
        next(error);
    }
}