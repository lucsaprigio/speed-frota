const date = new Date();
const day = date.getDate();
const monthIndex = date.getMonth();
const dayWeek = date.getDay();

export function formatDate() {
    const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    const weekdays = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];

    const month = months[monthIndex];
    const dayOfWeek = weekdays[dayWeek];

    return { day, month, dayOfWeek }
}