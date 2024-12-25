import { MongoClient } from 'mongodb';

let database;

export const connectToDatabase = async () => {
    try {
        const client = await MongoClient.connect('mongodb://127.0.0.1:27017', {
            connectTimeoutMS: 30000
        });

        database = client.db('eventDB');
        console.log("Database connected successfully");
        return database;
    } catch (error) {
        console.error("Error connecting to database:", error.message);
        throw new Error('Could not connect to the database');
    }
};

export const getDatabase = () => {
    if (!database) {
        throw new Error("Database connection not established. Please call connectToDatabase first.");
    }
    return database;
};