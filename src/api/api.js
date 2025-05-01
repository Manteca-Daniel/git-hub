import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:3000', 
    headers: {
        'Content-Type': 'application/json', 
    },
});


export const getTicketsApi = async (urlRepo) => {
    try {
        const response = await apiClient.get(`/ticketsUrl?repo=${urlRepo}`); 
        return response.data;
    } catch (error) {
        console.error('Error al obtener datos:', error);
        throw error;
    }
};

export const putTicketsApi = async (ticket) => {
    try {
        console.log('Ticket a modificar:', ticket); // Log the ticket being modified
        const response = await apiClient.put(
            `/modificarTicket?ticket=${ticket.repo}`, // query param
            {
                encabezado: ticket.encabezado,
                descripcion: ticket.descripcion,
                idf_tipo_ticket: ticket.idf_tipo_ticket,
                idf_tipo_estado: ticket.idf_tipo_estado,
                repositorio: ticket.repositorio,
                owner: ticket.owner
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error al modificar el ticket:', error);
        throw error;
    }
};


export const getTiposTicketsApi = async (urlRepo) => {
    try {
        const response = await apiClient.get(`/tiposticket`); 
        console.log('Response:', response.data); 
        return response.data;
    } catch (error) {
        console.error('Error al obtener datos:', error);
        throw error;
    }
};

export const getEstadosApi = async (urlRepo) => {
    try {
        const response = await apiClient.get(`/estados`); 
        console.log('Response:', response.data); 
        return response.data;
    } catch (error) {
        console.error('Error al obtener datos:', error);
        throw error;
    }
};



export default apiClient;