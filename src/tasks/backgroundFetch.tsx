import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import * as Notifications from 'expo-notifications';

const FETCH_DATA = "fetch-data"
export function taskFetch() {
    TaskManager.defineTask(FETCH_DATA, async () => {
        try {
            console.log('Teste de fetch');

            await Notifications.scheduleNotificationAsync({
                content: {
                    title: 'Dados Atualizados',
                    body: 'Dados atualizados com sucesso!'
                },
                trigger: null
            });

            return BackgroundFetch.BackgroundFetchResult.NewData;
        } catch (error) {
            console.error('Erro na execução da tarefa de fetch:', error);
            return BackgroundFetch.BackgroundFetchResult.Failed;
        }
    });

    async function registerTask() {
        return BackgroundFetch.registerTaskAsync(FETCH_DATA, {
            minimumInterval: 1 * 60,
            stopOnTerminate: false,
            startOnBoot: true
        });
    }

    async function initBackgroundFetch() {
        const status = await BackgroundFetch.getStatusAsync();
        if (status === BackgroundFetch.BackgroundFetchStatus.Available) {
            await registerTask();
            console.log('Background Fetch registrado com sucesso!');
        } else {
            console.log('Background Fetch não está disponível');
        }
    }

    return initBackgroundFetch();
}
