import { useSQLiteContext } from "expo-sqlite";

export type VehiclesDatabase = {
    id: number;
    license_plate: string;
    model: string;
}

export function useVehiclesDatabase() {
    const database = useSQLiteContext();

    async function create(data: VehiclesDatabase) {
        const statement = await database.prepareAsync(
            'INSERT INTO vehicles (id, license_plate, model) VALUES ($id, $license_plate, $model);'
        );

        try {
            await statement.executeAsync({
                $id: data.id,
                $license_plate: data.license_plate,
                $model: data.model
            });

        } catch (error) {
            throw error;
        } finally {
            await statement.finalizeAsync();
        }
    };

    async function createAuto(data: Omit<VehiclesDatabase, "id">) {
        const statement = await database.prepareAsync(
            'INSERT INTO vehicles (license_plate, model) VALUES ($license_plate, $model);'
        );

        try {
            const result = await statement.executeAsync({
                $license_plate: data.license_plate,
                $model: data.model
            });

            const lastInsertedRowId = result.lastInsertRowId.toLocaleString();

            return { lastInsertedRowId };

        } catch (error) {
            throw error;
        } finally {
            await statement.finalizeAsync();
        }
    }

    async function update(data: VehiclesDatabase) {
        const statement = await database.prepareAsync(
            `UPDATE vehicles SET model = $model, license_plate = $license_plate WHERE id = $id`
        );

        try {
            await statement.executeAsync({
                $id: data.id,
                $model: data.model,
                $license_plate: data.license_plate,
            });

        } catch (error) {
            throw error;
        } finally {
            await statement.finalizeAsync();
        }
    }

    async function listAll() {
        try {
            const query = 'SELECT * FROM vehicles';

            const response = await database.getAllAsync<VehiclesDatabase>(query);

            return response;
        } catch (error) {
            throw error
        }
    }

    async function findById(id: string) {
        try {
            const query = 'SELECT * FROM vehicles WHERE id = ?';

            const response = await database.getAllAsync<VehiclesDatabase>(query, id);

            return response;
        } catch (error) {
            throw error
        }
    }

    async function deleteAll() {
        const statement = await database.prepareAsync(
            'DELETE FROM vehicles;'
        );

        try {
            await statement.executeAsync();

        } catch (error) {
            throw error;
        } finally {
            await statement.finalizeAsync();
        }
    }

    return { create, listAll, update, findById, deleteAll, createAuto };
}