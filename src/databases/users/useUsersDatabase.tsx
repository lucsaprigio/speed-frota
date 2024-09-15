import { useSQLiteContext } from "expo-sqlite";

export type UserDatabase = {
    id: Number;
    username: String;
    email?: String;
    cnpj?: String;
    password: String;
    device?: String;
}

export function useUsersDatabase() {
    const database = useSQLiteContext();

    async function create(data: UserDatabase) {
        const statement = await database.prepareAsync(
            'INSERT INTO users (id, username, password, cnpj, device) VALUES ($id, $username, $password, $cnpj, $device);'
        );

        try {
            await statement.executeAsync({
                $id: data.id,
                $username: data.username,
                $password: data.password
            });

            console.log(`Usuário ${data.username} cadastrado.`);

        } catch (error) {
            throw error;
        } finally {
            await statement.finalizeAsync();
        }
    };

    async function update(data: UserDatabase) {
        const statement = await database.prepareAsync(
            `UPDATE users SET username = $username, password = $password WHERE id = $id`
        );

        try {
            await statement.executeAsync({
                $id: data.id,
                $username: data.username,
                $password: data.password,
            });

            console.log(`Usuário ${data.username} atualizado.`);
        } catch (error) {
            throw error;
        } finally {
            await statement.finalizeAsync();
        }
    }

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

    async function deleteAllUsers() {
        const statement = await database.prepareAsync(
            'DELETE FROM users;'
        );

        try {
            await statement.executeAsync();

        } catch (error) {
            throw error;
        } finally {
            await statement.finalizeAsync();
        }
    }

    return { create, listAll, update, findById, deleteAllUsers };
}