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
                <option v-for="repo in authStore.repos" :key="repo.id" :value="repo.name">
                    {{ repo.name }}
                </option>
            </select>

            <div v-if="selectedRepo">
                <h3 class="subtitle">Tickets para <span>{{ selectedRepo }}</span></h3>

                <ul class="ticket-list">
                    <li v-for="(ticket, index) in tickets[selectedRepo] || []" :key="index" class="ticket-card">
                        <div class="ticket-content">
                            <template v-if="editIndex === index">
                                <input v-model="editTitle" class="edit-input" @keyup.enter="saveEdit(index)"
                                    @blur="cancelEdit" />
                            </template>
                            <template v-else>
                                <div class="ticket-title">{{ ticket.title }}</div>
                                <div class="ticket-author">Creado por: <strong>{{ ticket.author }}</strong></div>
                            </template>
                        </div>
                        <div class="ticket-actions">
                            <template v-if="editIndex === index">
                                <button @click="saveEdit(index)" class="btn save">💾</button>
                                <button @click="cancelEdit" class="btn cancel">✖</button>
                            </template>
                            <template v-else>
                                <button @click="startEdit(index, ticket.title)" class="btn edit">✏️</button>
                                <button @click="deleteTicket(index)" class="btn delete">🗑️</button>
                            </template>
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
import { ref, reactive } from "vue";
import { useAuthStore } from "@/stores/authStore";

const authStore = useAuthStore();
const selectedRepo = ref("");
const newTicketTitle = ref("");
const tickets = reactive({});
const editIndex = ref(null);
const editTitle = ref("");

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

function startEdit(index, currentTitle) {
    editIndex.value = index;
    editTitle.value = currentTitle;
}

function saveEdit(index) {
    if (editTitle.value.trim()) {
        tickets[selectedRepo.value][index].title = editTitle.value.trim();
    }
    cancelEdit();
}

function cancelEdit() {
    editIndex.value = null;
    editTitle.value = "";
}

function deleteTicket(index) {
    tickets[selectedRepo.value].splice(index, 1);
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
    background: #fff;
    border: 1px solid #e5e5e5;
    padding: 15px;
    border-radius: 10px;
    display: flex;
    justify-content: space-between;
    gap: 10px;
    align-items: center;
    transition: box-shadow 0.2s ease;
}

.ticket-card:hover {
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
}

.ticket-title {
    font-weight: 600;
    color: #444;
}

.ticket-author {
    font-size: 13px;
    color: #888;
}

.ticket-actions {
    display: flex;
    gap: 8px;
}

.btn {
    border: none;
    padding: 6px 10px;
    cursor: pointer;
    border-radius: 5px;
    font-size: 16px;
}

.btn.edit {
    background-color: #ffd966;
}

.btn.delete {
    background-color: #ff7f7f;
    color: white;
}

.btn.save {
    background-color: #8ad48a;
    color: white;
}

.btn.cancel {
    background-color: #cccccc;
}

.ticket-form {
    display: flex;
    gap: 10px;
}

.form-input {
    flex: 1;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 15px;
}

.btn.add {
    background-color: #f57224;
    color: white;
    font-weight: bold;
}
</style>