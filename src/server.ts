import app from './app';
import { env } from './config/env';
import { connectDB } from './config/db';
import { initJobs } from './jobs';

const startServer = async () => {
    // Connect to Database
    connectDB();

    // Initialize Cron Jobs
    initJobs();

    const PORT = 5000;

    app.listen(PORT, () => {
        console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
};

startServer();
