import { type SQLiteDatabase } from 'expo-sqlite';

export async function initializeDatabase(database: SQLiteDatabase) {
    try {
        await database.execAsync(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY,
                username TEXT NOT NULL,
                password TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS vehicles (
                id INTEGER NOT NULL,
                license_plate TEXT NOT NULL,
                model TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS services (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                description TEXT NOT NULL,
                price REAL NOT NULL,
                vehicle_id INTEGER NOT NULL,
                obs TEXT NOT NULL,
                sent TEXT,
                FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
            );
            CREATE TABLE IF NOT EXISTS session (
                id INTEGER NOT NULL,
                device TEXT,
                user_id INTEGER NOT NULL,
                sessionEnd TEXT,
                FOREIGN KEY (user_id) REFERENCES users(id)
            );
            CREATE TABLE IF NOT EXISTS devices (
                id INTEGER NOT NULL,
                device,
                cnpj
            );
        `)
    } catch (error) {
        throw error
    }
}