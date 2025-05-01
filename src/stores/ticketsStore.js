import { defineStore } from "pinia";
import { ref } from "vue";
import {getTicketsApi, putTicketsApi} from "@/api/api" // Adjust the import path as necessary

const useTicketsStore = defineStore("tickets", () => {
    const tickets = ref([]);
    const loading = ref(false);
    const error = ref(null);

    const getTickets = async (urlRepo) => {
        loading.value = true;
        error.value = null;
        try {
            const data = await getTicketsApi(urlRepo);
            tickets.value = data;
        } catch (err) {
            error.value = err.message;
        } finally {
            loading.value = false;
        }
    };

    const modificarTicket = async (updatedTicket) => {
        console.log('Modificando ticket:', updatedTicket); // Log the ticket being modified
        await putTicketsApi(updatedTicket); 
        
    };
    

    return { tickets, loading, error, getTickets, modificarTicket };
});
export default useTicketsStore;