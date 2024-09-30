import { useSQLiteContext } from "expo-sqlite";

export type TypeServiceDatabase = {
    id: string;
    description: string;
}

export function useTypeServicesDatabase() {
    const database = useSQLiteContext();

    async function createTypeService(data: Omit<TypeServiceDatabase, "id">) {
        const statement = await database.prepareAsync(
            'INSERT INTO type_service (description) VALUES ($description);'
        );
        try {
            const result = await statement.executeAsync({
                $description: data.description
            });

            const lastInsertedRowId = result.lastInsertRowId.toLocaleString();

            return { lastInsertedRowId };

        } catch (error) {
            throw error;
        } finally {
            await statement.finalizeAsync();
        }
    };

    async function updateTypeService(data: TypeServiceDatabase) {
        const statement = await database.prepareAsync(
            `UPDATE type_service SET description = $description WHERE id = $id`
        );


        try {
            await statement.executeAsync({
                $id: data.id,
                $description: data.description,
            });

        } catch (error) {
            throw error;
        } finally {
            await statement.finalizeAsync();
        }
    }

    async function listAllTypeService() {
        try {
            const query = 'SELECT * FROM type_service';

            const response = await database.getAllAsync<TypeServiceDatabase>(query);

            return response;
        } catch (error) {
            throw error
        }
    }

    async function findById(id: string) {
        try {
            const query = 'SELECT * FROM type_service WHERE id = ?';

            const response = await database.getAllAsync<TypeServiceDatabase>(query, id);

            return response;
        } catch (error) {
            throw error
        }
    }

    async function deleteAllTypeService() {
        const statement = await database.prepareAsync(
            'DELETE FROM type_service;'
        );

        try {
            await statement.executeAsync();

        } catch (error) {
            throw error;
        } finally {
            await statement.finalizeAsync();
        }
    }

    return { createTypeService, listAllTypeService, updateTypeService, findById, deleteAllTypeService };
}