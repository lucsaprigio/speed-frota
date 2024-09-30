import { useSQLiteContext } from "expo-sqlite";

export type FleetDatabase = {
    id: number;
    description: string;
    price: number;
    vehicle_id: number;
    provider?: string;
    obs?: string
    image?: string,
    sent: string,
    license_plate?: string;
    model?: string;
}

export function useFleetsDatabase() {
    const database = useSQLiteContext();

    async function createFleet(data: Omit<FleetDatabase, "id">) {
        const statement = await database.prepareAsync(
            'INSERT INTO fleets (description, price, vehicle_id, obs, image, provider, sent) VALUES ($description, $price, $vehicle_id, $obs, $image, $provider, $sent);'
        );

        try {
            const result = await statement.executeAsync({
                $description: data.description,
                $price: data.price,
                $vehicle_id: data.vehicle_id,
                $obs: data.obs,
                $image: null,
                $provider: data.provider,
                $sent: 'N'
            });

            const lastInsertedRowId = result.lastInsertRowId.toLocaleString();

            return { lastInsertedRowId };

        } catch (error) {
            throw error;
        } finally {
            await statement.finalizeAsync();
        }
    };

    async function updateFleet(data: FleetDatabase) {
        const statement = await database.prepareAsync(
            `UPDATE fleets SET description = $description, price =  $price, vehicle_id = $vehicle_id, obs = $obs, sent = $sent, provider = $provider WHERE id = $id`
        );


        try {
            await statement.executeAsync({
                $id: data.id,
                $description: data.description,
                $price: data.price,
                vehicle_id: data.vehicle_id,
                $obs: data.obs,
                $sent: data.sent,
                $provider: data.provider
            });

        } catch (error) {
            throw error;
        } finally {
            await statement.finalizeAsync();
        }
    }

    async function setSent(id: string[]) {
        console.log(id)
        const statement = await database.prepareAsync(
            `UPDATE fleets SET sent = 'S' WHERE id IN (${id})`
        );

        try {
            await statement.executeAsync();
        } catch (error) {
            throw error;
        } finally {
            await statement.finalizeAsync();

        }
    }

    async function listFleetsNotSent() {
        try {
            const query = `SELECT * FROM fleets WHERE sent = 'N'`;

            const response = await database.getAllAsync<FleetDatabase>(query);

            return response;
        } catch (error) {

        }
    }

    async function listAllFleets() {
        try {
            const query = `
             SELECT 
                fleets.id, description, price, obs, sent, provider, vehicle_id,
                vehicles.license_plate, vehicles.model
             FROM fleets
             INNER JOIN vehicles on vehicles.id = fleets.vehicle_id
             `;

            const response = await database.getAllAsync<FleetDatabase>(query);

            return response;
        } catch (error) {
            throw error
        }
    }

    async function findById(id: string) {
        try {
            const query = 'SELECT * FROM fleets WHERE id = ?';

            const response = await database.getAllAsync<FleetDatabase>(query, id);

            return response;
        } catch (error) {
            throw error
        }
    }

    async function deleteAllFleets() {
        const statement = await database.prepareAsync(
            'DELETE FROM fleets;'
        );

        try {
            await statement.executeAsync();

        } catch (error) {
            throw error;
        } finally {
            await statement.finalizeAsync();
        }
    }

    return { createFleet, listAllFleets, updateFleet, findById, deleteAllFleets, listFleetsNotSent, setSent };
}