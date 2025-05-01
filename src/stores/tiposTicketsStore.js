import { defineStore } from "pinia";
import { ref, onMounted } from "vue";
import {getTiposTicketsApi} from "@/api/api" // Adjust the import path as necessary

const useTiposTicketsStore = defineStore("tiposTickets", () => {
    const tiposTickets = ref([]);
    const loading = ref(false);
    const error = ref(null);

    const getTiposTickets = async (urlRepo) => {
        loading.value = true;
        error.value = null;
        try {
            const data = await getTiposTicketsApi(urlRepo);
            tiposTickets.value = data;
        } catch (err) {
            error.value = err.message;
        } finally {
            loading.value = false;
        }
    };

    onMounted(async() => {
        await getTiposTickets();
    });
    

    return { tiposTickets, loading, error, getTiposTickets };
});
export default useTiposTicketsStore;