import { defineStore } from "pinia";
import { ref } from "vue";
import {getTicketsApi, putTicketsApi, addTicketsApi, deleteTicketApi} from "@/api/api" // Adjust the import path as necessary

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
    

    const addTicket = async (ticket) => {
        console.log('Creando ticket:', ticket); // Log the ticket being created
        try {
            const response = await addTicketsApi(ticket);
            tickets.value.push(response);
        } catch (err) {
            error.value = err.message;
        }
    }

    const eliminarTicketPorId = async (id_ticket) => {
        try {
            const result = await deleteTicketApi(id_ticket);
            tickets.value = tickets.value.filter(ticket => ticket.id !== id_ticket);
            return result;
        } catch (error) {
            console.error('Error al eliminar el ticket desde el store:', error);
            throw error;
        }
    }

    const getTicketById = (id_ticket) => {
        return tickets.value.find(ticket => ticket.id_ticket === id_ticket);
    };

    return { tickets, loading, error, getTickets, modificarTicket, addTicket, eliminarTicketPorId, getTicketById };
});
export default useTicketsStore;