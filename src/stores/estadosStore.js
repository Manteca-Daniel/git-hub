import { defineStore } from "pinia";
import { onMounted, ref } from "vue";
import {getEstadosApi} from "@/api/api" // Adjust the import path as necessary

const useEstadosStore = defineStore("estados", () => {
    const estados = ref([]);
    const loading = ref(false);
    const error = ref(null);

    const getTickets = async (urlRepo) => {
        loading.value = true;
        error.value = null;
        try {
            const data = await getEstadosApi(urlRepo);
            estados.value = data;
            console.log('Estados:', estados); // Log the response data
        } catch (err) {
            error.value = err.message;
        } finally {
            loading.value = false;
        }
    };

    onMounted(async() => {
        await getTickets();
    });
    

    return { estados, loading, error, getTickets };
});
export default useEstadosStore;