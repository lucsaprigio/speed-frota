import { useSQLiteContext } from "expo-sqlite";

export type UserDatabase = {
    id: Number;
    username: String;
    email?: String;
    cnpj: String;
    password: String;
    device: String;
}

export function useUsersDatabase() {
    const database = useSQLiteContext();

    async function create(data: Omit<UserDatabase, "id" >) {
        const statement = await database.prepareAsync(
            'INSERT INTO users (username, password, cnpj, device) VALUES ($username, $password, $cnpj, $device);'
        );

        try {
            const result = await statement.executeAsync({
                $username: data.username,
                $password: data.password,
                $cnpj: data.cnpj,
                $device: data.device,
            });

            const insertedRowId = result.lastInsertRowId.toLocaleString();

            return { insertedRowId };
        } catch (error) {
            throw error;
        } finally {
            await statement.finalizeAsync();
        }
    };

    async function listAll() {
        try {
            const query = 'SELECT * FROM users';

            const response = await database.getAllAsync<UserDatabase>(query);

            return response;
        } catch (error) {
            throw error
        }
    }

    async function findById(id: string) {
        try {
            const query = 'SELECT * FROM users WHERE id = ?';

            const response = await database.getAllAsync<UserDatabase>(query, id);

            return response;
        } catch (error) {
            throw error
        }
    }

    return { create, listAll, findById };
}