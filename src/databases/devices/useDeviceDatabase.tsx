import { useSQLiteContext } from "expo-sqlite";

export type DeviceDatabase = {
    id: string;
    device: string;
    cnpj: string;
}

export function useDeviceDatabase() {
    const database = useSQLiteContext();

    async function createDevice(data: DeviceDatabase) {
        const statement = await database.prepareAsync(
            `INSERT INTO devices (id, device, cnpj) values ($id, $device, $cnpj);`
        );

        try {
            const result = await statement.executeAsync({
                $id: data.id,
                $device: data.device,
                $cnpj: data.cnpj,
            });

            return result;
        } catch (error) {
            throw error;
        } finally {
            await statement.finalizeAsync();
        }
    }

    async function listDevice() {
        try {
            const query = 'SELECT * FROM devices';

            const response = database.getAllAsync<DeviceDatabase>(query);

            return response;
        } catch (error) {
            throw error;
        }
    }

    async function updateDevice(data: DeviceDatabase) {
        const statement = await database.prepareAsync(
            `UPDATE device SET device = $device, cnpj = $cnpj WHERE id = $id`
        );
        try {
            await statement.executeAsync({
                $id: data.id,
                $device: data.device,
                $cnpj: data.cnpj,
            });

        } catch (error) {
            throw error;
        } finally {
            await statement.finalizeAsync();
        }
    }

    return { createDevice, listDevice, updateDevice };
}