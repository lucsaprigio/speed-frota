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
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                license_plate TEXT NOT NULL,
                model TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS fleets (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                description TEXT NOT NULL,
                price REAL NOT NULL,
                vehicle_id INTEGER NOT NULL,
                provider TEXT,
                obs TEXT NOT NULL,
                image BLOB,
                sent TEXT,
                FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
            );
            CREATE TABLE IF NOT EXISTS type_service (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                description TEXT
            );
            CREATE TABLE IF NOT EXISTS session (
                id INTEGER NOT NULL,
                device TEXT,
                user_id INTEGER NOT NULL,
                username TEXT,
                sessionEnd TEXT,
                FOREIGN KEY (user_id) REFERENCES users(id)
            );
            CREATE TABLE IF NOT EXISTS devices (
                id INTEGER NOT NULL,
                device,
                cnpj,
                ip_api TEXT
            );
            CREATE TABLE IF NOT EXISTS providers (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                providerName TEXT NOT NULL
            );
        `);
    } catch (error) {
        throw error
    }
}