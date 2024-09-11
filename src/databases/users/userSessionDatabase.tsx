import { useSQLiteContext } from "expo-sqlite";

export type UserSessionDatabase = {
    id: string;
    device: string;
    user_id: string;

}
export function userSessionDatabase() {
    const database = useSQLiteContext();

    async function create(data: UserSessionDatabase) {
        const statement = await database.prepareAsync(
            'INSERT INTO session (id, device, user_id) VALUES ($id, $device, $user_id)'
        );

        try {

            const result = await statement.executeAsync({
                $id: data.id,
                $device: data.device,
                $user_id: data.user_id,
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
            'UPDATE session SET device = $device, user_id = $user_id, id = 1 WHERE id = $id'
        );

        try {

            await statement.executeAsync({
                $id: data.id,
                $device: data.device,
                $user_id: data.user_id,
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

    return { create, update, find };
}