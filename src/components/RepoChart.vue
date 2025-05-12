<template>
    <div class="chart-container">
        <Bar :data="chartData" :options="chartOptions" />
    </div>
</template>

<script>
import { defineComponent, computed } from 'vue';
import { Bar } from 'vue-chartjs';
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale
} from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export default defineComponent({
    components: { Bar },
    props: {
        issues: Array,
        pullRequests: Array,
        commits: Array
    },
    setup(props) {
        const chartData = computed(() => ({
            labels: ['Commits', 'Issues', 'Pull Requests'],
            datasets: [
                {
                    label: $t('cantidad'),
                    data: [props.commits.length, props.issues.length, props.pullRequests.length],
                    backgroundColor: ['#3498db', '#e74c3c', '#2ecc71']
                }
            ]
        }));

        const chartOptions = {
            responsive: true,
            plugins: {
                legend: { display: true },
                title: { display: true, text: t('resumen_repositorio') }
            }
        };

        return { chartData, chartOptions };
    }
});
</script>

<style scoped>
.chart-container {
    max-width: 600px;
    margin: 0 auto;
}

@media (max-width: 600px) {
    .chart-container {
        height: 300px;
    }
}
</style>