import express from 'express';
import dotenv from 'dotenv';
import { clerkMiddleware } from '@clerk/express';
import fileUpload from 'express-fileupload';
import path from "path";
import cors from 'cors';
import cron from 'node-cron';
import fs from 'fs';

import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import adminRoutes from './routes/admin.route.js';
import songRoutes from './routes/songs.route.js';
import albumRoutes from './routes/albums.route.js';
import statsRoutes from './routes/stats.route.js';
import { connectDB } from './lib/db.js';
import { createServer } from 'http';
import { initializeSocket } from './lib/socket.js';

dotenv.config();

const PORT = process.env.PORT || 8000;
const app = express();
const __dirname = path.resolve();

const httpServer = createServer(app);
initializeSocket(httpServer);

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));
app.use(express.json());
app.use(clerkMiddleware());
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, 'tmp'),
    createParentPath: true,
    limits: { fileSize: 15 * 1024 * 1024 }
}));

const tempdir = path.join(process.cwd(), 'tmp');
cron.schedule('0 * * * *', async () => {
    if(fs.existsSync(tempdir)) {
        fs.readdir(tempdir, (err, files) => {
            if(err) {
                console.error(err);
                return;
            }
            for(const file of files) {
                fs.unlink(path.join(tempdir, file), err => {
                    if(err) {
                        console.error(err);
                    }
                });
            }
        });
    }
});


app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/songs', songRoutes);
app.use('/api/albums', albumRoutes);
app.use('/api/stats', statsRoutes);

if(process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../client/dist/index.html'));
    });
}

app.use((err, req, res, next) => {
    res.status(500).json({
        success: false,
        message: process.env.NODE_ENV === 'production' ?  'Internal server error' : err.message
    });
});

httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
})