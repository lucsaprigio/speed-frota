import { useSQLiteContext } from "expo-sqlite";

export type DeviceDatabase = {
    id: string;
    device: string;
    cnpj: string;
    ip_api: string;
}

export function useDeviceDatabase() {
    const database = useSQLiteContext();

    async function createDevice(data: DeviceDatabase) {
        const statement = await database.prepareAsync(
            `INSERT INTO devices (id, device, cnpj, ip_api) values ($id, $device, $cnpj, $ip_api);`
        );

        try {
            const result = await statement.executeAsync({
                $id: data.id,
                $device: data.device,
                $cnpj: data.cnpj,
                $ip_api: data.ip_api
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

    async function deleteAllDevices() {
        const statement = await database.prepareAsync(
            `DELETE FROM devices;`
        );
        try {
            await statement.executeAsync();

        } catch (error) {
            throw error;
        } finally {
            await statement.finalizeAsync();
        }
    }

    return { createDevice, listDevice, updateDevice, deleteAllDevices };
}