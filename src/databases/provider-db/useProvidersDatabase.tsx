import { useSQLiteContext } from "expo-sqlite";

export type ProviderDatabase = {
    id: number;
    providerName: string;
}

export function useProvidersDatabase() {
    const database = useSQLiteContext();

    async function create(data: ProviderDatabase) {
        const statement = await database.prepareAsync(
            'INSERT INTO providers (id, providerName) VALUES ($id, $providerName);'
        );

        try {
            await statement.executeAsync({
                $id: data.id,
                $providerName: data.providerName,
            });

        } catch (error) {
            throw error;
        } finally {
            await statement.finalizeAsync();
        }
    };

    async function update(data: ProviderDatabase) {
        const statement = await database.prepareAsync(
            `UPDATE providers SET providerName = $providerName WHERE id = $id`
        );

        try {
            await statement.executeAsync({
                $id: data.id,
                $providerName: data.providerName,
            });

        } catch (error) {
            throw error;
        } finally {
            await statement.finalizeAsync();
        }
    }

    async function listAll() {
        try {
            const query = 'SELECT * FROM providers';

            const response = await database.getAllAsync<ProviderDatabase>(query);

            return response;
        } catch (error) {
            throw error
        }
    }

    async function findById(id: string) {
        try {
            const query = 'SELECT * FROM providers WHERE id = ?';

            const response = await database.getAllAsync<ProviderDatabase>(query, id);

            return response;
        } catch (error) {
            throw error
        }
    }

    async function deleteAllProviders() {
        const statement = await database.prepareAsync(
            'DELETE FROM providers;'
        );

        try {
            await statement.executeAsync();

        } catch (error) {
            throw error;
        } finally {
            await statement.finalizeAsync();
        }
    }

    return { create, listAll, update, findById, deleteAllProviders };
}