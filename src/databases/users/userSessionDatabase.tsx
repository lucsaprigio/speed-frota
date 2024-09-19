import { useSQLiteContext } from "expo-sqlite";

export type UserSessionDatabase = {
    id: number;
    username: string;
    device: string;
    user_id: string;
    sessionEnd: string;
}

export function userSessionDatabase() {
    const database = useSQLiteContext();

    async function create(data: UserSessionDatabase) {
        const statement = await database.prepareAsync(
            'INSERT INTO session (id, device, username, user_id, sessionEnd) VALUES ($id, $device, $username, $user_id, $sessionEnd)'
        );

        try {

            const result = await statement.executeAsync({
                $id: data.id,
                $device: data.device,
                $username: data.username,
                $user_id: data.user_id,
                $sessionEnd: data.sessionEnd
            });

            return result;
        } catch (error) {
            throw error
        } finally {
            await statement.finalizeAsync();
        }
    }

    async function update(data: UserSessionDatabase) {
        const statement = await database.prepareAsync(
            'UPDATE session SET device = $device, user_id = $user_id, id = 1, sessionEnd = $sessionEnd WHERE id = $id'
        );

        try {

            await statement.executeAsync({
                $id: data.id,
                $device: data.device,
                $user_id: data.user_id,
                $sessionEnd: data.sessionEnd
            });

        } catch (error) {
            throw error
        } finally {
            await statement.finalizeAsync();
        }
    }

    async function find() {
        try {
            const query = 'SELECT * FROM session';

            const response = await database.getAllAsync<UserSessionDatabase>(query);

            return response;
        } catch (error) {
            throw error
        }
    }

    async function deleteSession() {
        const statement = await database.prepareAsync('DELETE FROM session');

        try {
            await statement.executeAsync();
        } catch (error) {
            throw error;
        } finally {
            await statement.finalizeAsync();
        }
    }

    return { create, update, find , deleteSession};
}