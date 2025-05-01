<template>
    <div class="tickets-container">
        <h2 class="title">🎫 Gestión de Tickets</h2>

        <div v-if="authStore.repos.length === 0">
            <p class="no-repos">No tienes repositorios disponibles.</p>
        </div>

        <div v-else>
            <label class="label">Selecciona un repositorio:</label>
            <select v-model="selectedRepo" class="select">
                <option disabled value="">-- Selecciona un repositorio --</option>
                <option v-for="repo in authStore.repos" :key="repo.id" :value="repo.url">
                    {{ repo.name }}
                </option>
            </select>

            <div v-if="selectedRepo">
                <h3 class="subtitle">Tickets para <span>{{ selectedRepo }}</span></h3>

                <ul class="ticket-list">
                    <li v-for="(ticket, index) in ticketsStore.tickets || []" :key="index" :class="['ticket-card', estadoColorClase(ticket.idf_tipo_estado)]">
                        <div class="ticket-content">
                            <template v-if="editIndex === index">
                                <template v-if="editIndex === index">
                                <input v-model="editTicket.encabezado" class="edit-input" placeholder="Encabezado" />
                                <input v-model="editTicket.descripcion" class="edit-input" placeholder="Descripción" />
                                <input v-model="editTicket.owner" class="edit-input" placeholder="Creador" />
                                </template>
    
                            </template>
                            <template v-else>
                                <div class="ticket-title">
                                    <h3><strong>{{ ticket.encabezado }}</strong></h3> 
                                </div>
                                <div class="ticket-description">
                                    <strong>Descripción:</strong> {{ ticket.descripcion }}
                                </div>
                                <div class="ticket-author">
                                    <strong>Creado por:</strong> {{ ticket.owner }}
                                </div>
                                <div class="ticket-repo">
                                    <strong>Repositorio:</strong> {{ ticket.repositorio }}
                                </div>
                            </template>
                        </div>
                        
                        <div class="ticket-actions">
                            <template v-if="editIndex === index">
                            </template>
                            <template v-else>
                                <div class="ticket-details">
                                    <select v-model="ticket.idf_tipo_estado" :class="['select-estado', estadoColorClase(ticket.idf_tipo_estado)]" @change="$event.target.blur()">
                                        <option value="" disabled>Selecciona un estado</option>
                                        <option v-for="estado in estadosStore.estados" :key="estado.id_estado" :value="estado.id_estado">
                                            {{ estado.descripcion }}
                                        </option>
                                    </select>
                                    <select v-model="ticket.idf_tipo_ticket" class="select-tipo-ticket">
                                        <option value="" disabled>Selecciona tipo tickets</option>
                                        <option v-for="tipoTicket in tiposTicketsStore.tiposTickets" :key="tipoTicket.id_tipo_ticket" :value="tipoTicket.id_tipo_ticket">
                                            {{ tipoTicket.descripcion }}
                                        </option>
                                    </select>
                                </div>
                            </template>
                            <div class="ticket-actions-buttons">
                                <template v-if="editIndex === index">
                                    <button @click="saveEdit(index)" class="btn save">💾</button>
                                    <button @click="cancelEdit" class="btn cancel">✖</button>
                                </template>
                                <template v-else>
                                    <button @click="startEdit(index, ticket)" class="btn edit">✏️</button>
                                    <button @click="deleteTicket(index)" class="btn delete">🗑️</button>
                                </template>
                            </div>
                        </div>
                    </li>
                </ul>

                <form @submit.prevent="addTicket" class="ticket-form">
                    <input v-model="newTicketTitle" placeholder="Título del ticket" class="form-input" required />
                    <button type="submit" class="btn add">Añadir Ticket</button>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, watch } from "vue";
import { useAuthStore } from "@/stores/authStore";
import  useTicketsStore  from "@/stores/ticketsStore"; 
import useTiposTicketsStore from "@/stores/tiposTicketsStore";
import useEstadosStore from "@/stores/estadosStore";
const tiposTicketsStore = useTiposTicketsStore();
const estadosStore = useEstadosStore();
const authStore = useAuthStore();
const ticketsStore = useTicketsStore(); 
const selectedRepo = ref("");
const newTicketTitle = ref("");
const tickets = reactive({});
const editIndex = ref(null);
const editTicket = ref({
    encabezado: "",
    descripcion: "",
    owner: ""
});

async function loadTickets(urlRepo) {
    try {
        console.log("Cargando tickets para el repositorio:", urlRepo);
        await ticketsStore.getTickets(urlRepo);
        tickets[urlRepo] = [...ticketsStore.tickets]; 
        console.log("Tickets cargados:", tickets[urlRepo]);
    } catch (error) {
        console.error("Error al cargar los tickets:", error);
    }
}

watch(selectedRepo, async (newRepo) => {
    loadTickets(newRepo); 
});

function addTicket() {
    if (!tickets[selectedRepo.value]) {
        tickets[selectedRepo.value] = [];
    }
    tickets[selectedRepo.value].push({
        title: newTicketTitle.value,
        author: authStore.user?.login || "anónimo",
    });
    newTicketTitle.value = "";
}

function startEdit(index, ticket) {
    editIndex.value = index;
    editTicket.value = { ...ticket }; 
    console.log("Editando ticket:", editTicket.value);
}

async function saveEdit(index) {
    const originalTicket = ticketsStore.tickets[index];

    const updatedTicket = {
        ...editTicket.value,
        idf_tipo_ticket: originalTicket.idf_tipo_ticket,
        idf_tipo_estado: originalTicket.idf_tipo_estado,
        repositorio: originalTicket.repositorio,
        repo: originalTicket.repositorio // requerido por la query param del backend
    };

    try {
        await ticketsStore.modificarTicket(updatedTicket);
        await ticketsStore.getTickets(selectedRepo.value); // Recarga lista
    } catch (err) {
        console.error("Error al guardar el ticket:", err);
    }

    cancelEdit();
}


function cancelEdit() {
    editIndex.value = null;
    editTicket.value = {
        encabezado: "",
        descripcion: "",
        owner: ""
    };
}

function deleteTicket(index) {
    tickets[selectedRepo.value].splice(index, 1);
}

function estadoColorClase(estadoId) {
    switch (estadoId) {
        case 1: return 'estado-listo';   // Por ejemplo: estado "Abierto"
        case 2: return 'estado-pendiente-produccion';
        case 3: return 'estado-pruebas';
        case 4: return 'estado-desarrollo';
        case 5: return 'estado-paralizado';
        case 6: return 'estado-pendiente';
        default: return 'estado-default'; // Por defecto
    }
}

</script>

<style scoped>
.tickets-container {
    max-width: 700px;
    margin: 30px auto;
    padding: 20px;
    font-family: 'Segoe UI', sans-serif;
    background: #fdfdfd;
    border-radius: 12px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
}

.title {
    font-size: 28px;
    margin-bottom: 20px;
    color: #333;
}

.subtitle {
    font-size: 20px;
    margin-bottom: 15px;
    color: #f57224;
}

.label {
    font-weight: 600;
    margin-bottom: 6px;
    display: block;
}

.select {
    padding: 10px;
    width: 100%;
    margin-bottom: 25px;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 16px;
}

.ticket-list {
    list-style: none;
    padding: 0;
    margin-bottom: 25px;
}
.ticket-card {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-left: 6px solid #3182ce;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.03);
    transition: all 0.3s ease;
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    gap: 20px;
    align-items: flex-start;
}

.ticket-card:hover {
    border-left-color: #2b6cb0;
    transform: translateY(-2px);
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08);
}

.ticket-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.ticket-title h3 {
    font-size: 18px;
    font-weight: 600;
    color: #2d3748;
    margin: 0;
}

.ticket-description,
.ticket-author,
.ticket-repo {
    font-size: 14px;
    color: #4a5568;
    line-height: 1.4;
}

.ticket-description strong,
.ticket-author strong,
.ticket-repo strong {
    color: #2d3748;
    margin-right: 4px;
}

.ticket-actions {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: space-between;
    min-width: 180px;
    gap: 15px;
}

.ticket-details {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
}

.ticket-details select {
    padding: 8px;
    border-radius: 6px;
    border: 1px solid #cbd5e0;
    font-size: 14px;
    transition: border-color 0.2s;
}

.ticket-details select:focus {
    border-color: #3182ce;
    outline: none;
}

.ticket-actions-buttons {
    display: flex;
    gap: 8px;
}

.btn {
    padding: 6px 10px;
    font-size: 13px;
    font-weight: 500;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    transition: background-color 0.2s ease;
}

.btn.edit {
    background-color: #facc15;
    color: #1a202c;
}

.btn.delete {
    background-color: #f87171;
    color: #fff;
}

.btn.save {
    background-color: #34d399;
    color: #fff;
}

.btn.cancel {
    background-color: #a0aec0;
    color: #fff;
}

.edit-input {
    width: 100%;
    padding: 10px;
    font-size: 14px;
    border-radius: 6px;
    border: 1px solid #cbd5e0;
    background: #f9fafb;
    transition: border-color 0.2s ease;
}

.edit-input:focus {
    outline: none;
    border-color: #3182ce;
    background-color: #fff;
}

.estado-listo {
  border-left-color: #38a169 !important;
}

.estado-pendiente-produccion {
  border-left-color: #d69e2e !important;
}

.estado-pruebas {
  border-left-color: #3182ce !important;
}

.estado-desarrollo {
  border-left-color: #dd6b20 !important;
}

.estado-paralizado {
  border-left-color: #e53e3e !important;
}

.estado-pendiente {
  border-left-color: #805ad5 !important;
}

.estado-default {
  border-left-color: #a0aec0 !important;
}

select.estado-desarrollo:not(:focus) {
  background-color: #dd6b20 !important;
  color: #fff !important;
}

select.estado-paralizado:not(:focus) {
  background-color: #e53e3e !important;
  color: #fff !important;
}

select.estado-pendiente:not(:focus) {
  background-color: #805ad5 !important;
  color: #fff !important;
}

select.estado-listo:not(:focus) {
  background-color: #38a169 !important;
  color: #fff !important;
}

select.estado-pendiente-produccion:not(:focus) {
  background-color: #d69e2e !important;
  color: #fff !important;
}

select.estado-pruebas:not(:focus) {
  background-color: #3182ce !important;
  color: #fff !important;
}

select.estado-default:not(:focus) {
  background-color: #a0aec0 !important;
  color: #fff !important;
}

</style>