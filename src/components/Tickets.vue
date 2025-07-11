<template>
    <div class="tickets-container">
        <h2 class="title">🎫 {{  $t('gestion_tickets') }}</h2>

        <div v-if="authStore.repos.length === 0">
            <p class="no-repos">{{ $t('no_repos_disponibles') }}</p>
        </div>

        <div v-else>
          <div v-if="!selectedRepo">
            <div class="repo-select-visual">
              <label class="label">{{ $t('select_repo') }}:</label>
              <div class="filter-group">
                  <label class="filter-label">{{ $t('lenguaje') }}</label>
                  <select v-model="languageFilter" class="select filter-select">
                    <option value="">{{ $t('all') }}</option>
                    <option v-for="lang in uniqueLanguages" :key="lang" :value="lang">
                      {{ lang }}
                    </option>
                  </select>
                </div>
              <div class="repo-grid">
                <div
                  v-for="repo in filteredRepos"
                  :key="repo.id"
                  :class="['repo-card', { selected: selectedRepo && selectedRepo.id === repo.id }]"
                  @click="selectRepo(repo)"
                  tabindex="0"
                  @keydown.enter="selectRepo(repo)"
                >
                  <div class="repo-card-header">
                    <span class="repo-icon">📦</span>
                    <span
                      class="repo-name"
                      :title="repo.name"
                    >{{ repo.name }}</span>
                  </div>
                  <div class="repo-meta">
                    <span
                      class="repo-visibility"
                      :class="repo.private ? 'private' : 'public'"
                    >
                      <span v-if="repo.private">🔒 Private</span>
                      <span v-else>🌐 Public</span>
                    </span>
                    
                  </div>
                  <div
                      v-if="repo.language"
                      class="repo-language"
                      :title="repo.language"
                    >
                    <div class="repo-lang-icon">
                      <span class="lang-dot" :style="{ background: languageColor(repo.language) }"></span>
                      {{ repo.language }}
                    </div>
                    </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="selectedRepo">
            <button class="btn volver-btn" @click="selectedRepo = ''">
              <span class="volver-icon-svg" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M12.5 16L7.5 10L12.5 4" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </span>
              {{ $t('volver_a_repos') }}
            </button>
            <div class="ticket-header">
                <h3 class="subtitle">{{ $t('tickets_para') }} <span>{{ selectedRepo.name }}</span></h3>
                <button class="btn add-ticket-btn" @click="showAddTicket = true">
                  <span class="add-icon">➕</span> {{ $t('add_ticket') }}
                </button>
                <div v-if="showAddTicket" class="modal-overlay">
                    <div class="modal modern-modal">
                        <div class="modal-header">
                            <h3>📝 {{ $t('new_ticket') }}</h3>
                            <button class="modal-close" @click="showAddTicket = false">✖</button>
                        </div>
                        <div class="modal-body">
                            <div class="modal-field">
                                <label>{{ $t('encabezado') }}</label>
                                <input v-model="newTicket.encabezado" class="edit-input" :placeholder="$t('encabezado')" />
                            </div>
                            <div class="modal-field">
                                <label>{{ $t('descripcion_issue') }}</label>
                                <textarea v-model="newTicket.descripcion" class="edit-input" :placeholder="$t('descripcion_issue')" rows="3"></textarea>
                            </div>
                            <div class="modal-field">
                                <label>{{ $t('propietario') }}</label>
                                <select v-model="newTicket.owner" class="edit-input">
                                    <option value="" disabled>{{ $t('select_propietario') }}</option>
                                    <option v-for="colaborador in authStore.collaborators.value" :key="colaborador.login" :value="colaborador.login">
                                        {{ colaborador.login }}
                                    </option>
                                </select>
                            </div>
                            <div class="modal-field">
                                <label>{{ $t('tipo_ticket') }}</label>
                                <select v-model="newTicket.idf_tipo_ticket" class="edit-input">
                                    <option value="" disabled>{{ $t('select_tipo_ticket') }}</option>
                                    <option v-for="tipoTicket in tiposTicketsStore.tiposTickets" :key="tipoTicket.id_tipo_ticket" :value="tipoTicket.id_tipo_ticket">
                                        {{ tipoTicket.descripcion }}
                                    </option>
                                </select>
                            </div>
                            <div class="modal-field">
                                <label>{{ $t('estado') }}</label>
                                <select v-model="newTicket.idf_tipo_estado" class="edit-input">
                                    <option value="" disabled>{{ $t('select_estado') }}</option>
                                    <option v-for="estado in estadosStore.estados" :key="estado.id_estado" :value="estado.id_estado">
                                        {{ estado.descripcion }}
                                    </option>
                                </select>
                            </div>
                        </div>
                        <div class="modal-actions">
                            <button class="btn save" @click="addNewTicket">{{ $t('guardar') }}</button>
                            <button class="btn cancel" @click="showAddTicket = false">{{ $t('cancelar') }}</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="ticket-filters modern-filters">
              <div class="filters-row">
                <div class="filter-group">
                  <label class="filter-label">{{ $t('user') }}</label>
                  <select v-model="userFilter" class="select filter-select">
                    <option value="">{{ $t('all') }}</option>
                    <option v-for="colaborador in authStore.collaborators.value" :key="colaborador.login" :value="colaborador.login">
                      {{ colaborador.login }}
                    </option>
                  </select>
                </div>
                <div class="filter-group">
                  <label class="filter-label">{{ $t('estado') }}</label>
                  <div class="estado-checkbox-group modern-checkbox-group">
                    <label v-for="estado in estadosStore.estados" :key="estado.id_estado" class="checkbox-label modern-checkbox">
                      <input type="checkbox" :value="estado.id_estado" v-model="estadoRepoFilter" />
                      <span class="checkmark"></span>
                      {{ estado.descripcion }}
                    </label>
                  </div>
                </div>
                <div class="filter-group">
                  <label class="filter-label">{{ $t('ordenar_por') }}</label>
                  <select v-model="orderBy" class="select filter-select">
                    <option value="">{{ $t('sin_orden') }}</option>
                    <option value="estado">{{ $t('estado') }}</option>
                    <option value="encabezado">{{ $t('encabezado') }}</option>
                    <option value="usuario">{{ $t('user') }}</option>
                  </select>
                </div>
                <div class="filter-group">
                  <label class="filter-label">{{ $t('filtrar_encabezado') }}</label>
                  <input
                    v-model="encabezadoFilter"
                    type="text"
                    class="edit-input"
                  />
                </div>
              </div>
              <div class="filters-actions">
                <button class="btn reset-filters" @click="resetFilters">🔄 {{ $t('restablecer_flitros') }}</button>
              </div>
            </div>
            <ul class="ticket-list">
              <template v-if="filteredTickets.length === 0">
                <li class="no-results">{{ $t('no_tickets_flitros') }}</li>
              </template>
              <template v-else>
                <li v-for="(ticket, index) in filteredTickets" :key="index" :class="['ticket-card', estadoColorClase(ticket.idf_tipo_estado)]">
                    <div class="ticket-content">
                        <template v-if="editIndex === index">
                            <template v-if="editIndex === index">
                            <input v-model="editTicket.encabezado" class="edit-input" :placeholder="$t('encabezado')" />
                            <input v-model="editTicket.descripcion" class="edit-input" :placeholder="$t('descripcion_issue')" />
                            <select v-model="editTicket.owner" class="edit-input" :placeholder="$t('propietario')">
                                <option v-for="colaborador in authStore.collaborators.value" :key="colaborador.login" :value="colaborador.login">
                                    {{ colaborador.login }}
                                </option>
                            </select>
                        </template>
    
                        </template>
                        <template v-else>
                            <div class="ticket-title">
                                <h3><strong>{{ ticket.encabezado }}</strong></h3> 
                            </div>
                            <div class="ticket-description">
                                <strong>{{ $t('descripcion_issue') }}:</strong> {{ ticket.descripcion }}
                            </div>
                            <div class="ticket-author">
                                <strong>{{ $t('creado_por') }}:</strong>
                                <span class="user-icon" title="Asignado">
                                  <template v-if="ticket.owner === 'franxu99'">⭐</template>
                                  <template v-else-if="ticket.owner === 'Manteca-Daniel'">🦸‍♂️</template>
                                  <template v-else>👤</template>
                                </span>
                                {{ ticket.owner }}
                            </div>
                            <div class="ticket-repo">
                                <strong>{{ $t('repo') }}:</strong> {{ ticket.repositorio }}
                            </div>
                        </template>
                    </div>
                    
                    <div class="ticket-actions">
                        <template v-if="editIndex === index">
                        </template>
                        <template v-else>
                            <div class="ticket-details">
                                <select v-model="ticket.idf_tipo_estado" :class="['select-estado', estadoColorClase(ticket.idf_tipo_estado)]" @change="$event.target.blur(), onEstadoChange(ticket, index)">
                                    <option value="" disabled>{{ $t('select_un_estado') }}</option>
                                    <option v-for="estado in estadosStore.estados" :key="estado.id_estado" :value="estado.id_estado">
                                        {{ estado.descripcion }}
                                    </option>
                                </select>
                                <select v-model="ticket.idf_tipo_ticket" class="select-tipo-ticket" @change="$event.target.blur(), startEdit(index, ticket), saveEdit(ticket.id_ticket)">
                                    <option value="" disabled>{{ $t('select_tipo_tickets') }}</option>
                                    <option v-for="tipoTicket in tiposTicketsStore.tiposTickets" :key="tipoTicket.id_tipo_ticket" :value="tipoTicket.id_tipo_ticket">
                                        {{ tipoTicket.descripcion }}
                                    </option>
                                </select>
                            </div>
                        </template>
                        <div class="ticket-actions-buttons">
                            <template v-if="editIndex === index">
                                <button @click="saveEdit(ticket.id_ticket)" class="btn save">💾</button>
                                <button @click="cancelEdit" class="btn cancel">✖</button>
                            </template>
                            <template v-else>
                                <button @click="startEdit(index, ticket)" class="btn edit">✏️</button>
                                <button @click="deleteTicket(index)" class="btn delete">🗑️</button>
                            </template>
                        </div>
                    </div>
                </li>
              </template>
            </ul>
          </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, watch, computed, onMounted } from "vue";
import { useAuthStore } from "@/stores/authStore";
import  useTicketsStore  from "@/stores/ticketsStore"; 
import useTiposTicketsStore from "@/stores/tiposTicketsStore";
import useEstadosStore from "@/stores/estadosStore";
import { useI18n } from 'vue-i18n';

const tiposTicketsStore = useTiposTicketsStore();
const estadosStore = useEstadosStore();
const authStore = useAuthStore();
const ticketsStore = useTicketsStore(); 

const { t: $t } = useI18n();

const showAddTicket = ref(false);
const newTicket = ref({
    encabezado: '',
    descripcion: '',
    owner: '',
    idf_tipo_ticket: '',
    idf_tipo_estado: ''
});

async function addNewTicket() {
    if (!newTicket.value.encabezado || !newTicket.value.descripcion || !newTicket.value.owner || !newTicket.value.idf_tipo_ticket || !newTicket.value.idf_tipo_estado) {
        alert($t('rellene_todos_campos'));
        return;
    }
    try {
        await ticketsStore.addTicket({
            ...newTicket.value,
            repositorio: selectedRepo.value.url,
            repo: selectedRepo.value.name
        });
        await ticketsStore.getTickets(selectedRepo.value.url);
        showAddTicket.value = false;
        newTicket.value = { encabezado: '', descripcion: '', owner: '', idf_tipo_ticket: '', idf_tipo_estado: '' };
    } catch (err) {
        console.log(err);
        alert('Error al crear el ticket');
    }
}
const selectedRepo = ref("");
const newTicketTitle = ref("");
const tickets = reactive({});
const editIndex = ref(null);
const editTicket = ref({
    encabezado: "",
    descripcion: "",
    owner: ""
});
const userFilter = ref("");
const estadoRepoFilter = ref([]);
const orderBy = ref("");
const languageFilter = ref("");
const encabezadoFilter = ref("");

const filteredRepos = computed(() => {
  let repos = authStore.repos;
  if (languageFilter.value) {
    repos = repos.filter(repo => repo.language === languageFilter.value);
  }
  return repos;
});

const filteredTickets = computed(() => {
  let filtered = ticketsStore.tickets || [];
  if (estadoRepoFilter.value.length > 0) {
    filtered = filtered.filter(ticket => estadoRepoFilter.value.includes(ticket.idf_tipo_estado));
  }
  if (userFilter.value) {
    filtered = filtered.filter(ticket => ticket.owner === userFilter.value);
  }
  if (encabezadoFilter.value) {
    filtered = filtered.filter(ticket => ticket.encabezado.toLowerCase().includes(encabezadoFilter.value.toLowerCase()));
  }
  // Ordenar
  if (orderBy.value === "estado") {
    filtered = [...filtered].sort((a, b) => a.idf_tipo_estado - b.idf_tipo_estado);
  } else if (orderBy.value === "encabezado") {
    filtered = [...filtered].sort((a, b) => a.encabezado.localeCompare(b.encabezado));
  } else if (orderBy.value === "usuario") {
    filtered = [...filtered].sort((a, b) => (a.owner || '').localeCompare(b.owner || ''));
  }
  return filtered;
});

function toggleDropdown(e) {
  const select = e.target;
  if (select.size === 1) {
    select.size = estadosStore.estados.length > 4 ? 4 : estadosStore.estados.length;
  } else {
    select.size = 1;
  }
}

const uniqueLanguages = computed(() => {
  const langs = authStore.repos
    .map(repo => repo.language)
    .filter(lang => !!lang); // Elimina null/undefined
  console.log(langs);
  return [...new Set(langs)];
});

async function loadTickets(urlRepo) {
    try {
        await ticketsStore.getTickets(urlRepo);
        tickets[urlRepo] = [...ticketsStore.tickets]; 
    } catch (error) {
        console.error("Error al cargar los tickets:", error);
    }
}

watch(selectedRepo, async (newRepo) => {
    loadTickets(newRepo.url);
    await loadCollaborators(); 
});


function startEdit(index, ticket) {
    editIndex.value = index;
    editTicket.value = { ...ticket }; 
}

async function saveEdit(id_ticket) {
    const originalTicket = ticketsStore.getTicketById(id_ticket);
    const updatedTicket = {
        ...editTicket.value,
        id_ticket: originalTicket.id_ticket,
        idf_tipo_ticket: originalTicket.idf_tipo_ticket,
        idf_tipo_estado: originalTicket.idf_tipo_estado,
        repositorio: originalTicket.repositorio,
        repo: originalTicket.repositorio 
    };

    try {
        await ticketsStore.modificarTicket(updatedTicket);
        await ticketsStore.getTickets(selectedRepo.value.url); // Recarga lista
    } catch (err) {
        console.error("Error al guardar el ticket:", err);
    }

    cancelEdit();
}

async function loadCollaborators() {
    try {
        await authStore.fetchCollaboratorsRepo(selectedRepo.value.name);
    } catch (error) {
        console.error("Error al cargar los colaboradores:", error);
    }
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
    if (confirm($t('eliminar_ticket_confirmacion'))) {
        const ticketToDelete = ticketsStore.tickets[index];
        ticketsStore.eliminarTicketPorId(ticketToDelete.id_ticket)
            .then(() => {
                ticketsStore.getTickets(selectedRepo.value.url);
            })
            .catch(err => {
                console.error("Error al eliminar el ticket:", err);
            });
    }
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

function resetFilters() {
  userFilter.value = "";
  estadoRepoFilter.value = [];
  orderBy.value = "";
  languageFilter.value = "";
  encabezadoFilter.value = "";
}

function onEstadoChange(ticket, index) {
    // Guarda el id_ticket antes de que el computed regenere la lista
    editTicketId.value = ticket.id_ticket;
    startEdit(index, ticket);
    saveEdit();
}

function selectRepo(repo) {
  selectedRepo.value = repo;
}

function languageColor(lang) {
  const colors = {
    JavaScript: "#f1e05a",
    Python: "#3572A5",
    Java: "#b07219",
    TypeScript: "#3178c6",
    HTML: "#e34c26",
    CSS: "#563d7c",
    Vue: "#41b883",
    C: "#1f6feb",
    'C#': "#1f6feb",
    CSharp: "#178600",
    Go: "#00ADD8",
    PHP: "#4F5D95",
    Ruby: "#701516",
    Shell: "#89e051",
    Swift: "#ffac45",
    Kotlin: "#A97BFF",
    Dart: "#00B4AB",
    // ...añade más si quieres
  };
  return colors[lang] || "#bbb";
}

</script>

<style scoped>
.tickets-container {
    max-width: 95%;
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

.ticket-header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
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

.ticket-details > select {
  cursor: pointer ;
}

.ticket-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  list-style: none;
  padding: 0;
  margin-bottom: 25px;
}
@media (max-width: 1870px) {
  .ticket-list {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 1250px) {
  .ticket-list {
    grid-template-columns: repeat(1, 1fr);
  }
}
@media (max-width: 1100px) {
  .ticket-card {
    padding: 22px;
  }
}

@media (max-width: 900px) {
  .tickets-container {
    padding: 10px;
  }
  .ticket-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  .modal {
    min-width: 90vw;
    padding: 0;
  }
  .modal-header,
  .modal-body,
  .modal-actions {
    padding-left: 10px;
    padding-right: 10px;
  }
  .modern-filters {
    padding: 12px 8px 8px 8px;
  }
}

@media (max-width: 700px) {
  .ticket-list {
    grid-template-columns: 1fr;
    gap: 14px;
  }
  .ticket-card {
    flex-direction: column;
    align-items: stretch;
    padding: 14px;
    min-width: 0;
  }
  .ticket-actions {
    min-width: unset;
    width: 100%;
    align-items: stretch;
    gap: 10px;
    margin-top: 12px;
  }
  .ticket-details {
    flex-direction: column;
    gap: 6px;
    width: 100%;
  }
  .modal {
    min-width: 98vw;
    max-width: 100vw;
    border-radius: 8px;
    padding: 0;
  }
  .modal-header,
  .modal-body,
  .modal-actions {
    padding-left: 6px;
    padding-right: 6px;
  }
  .modern-filters {
    padding: 8px 4px 4px 4px;
  }
  .filters-row {
    flex-direction: column;
    gap: 10px;
  }
  .filter-group {
    min-width: 100%;
  }
}

@media (max-width: 500px) {
  .tickets-container {
    padding: 2px;
  }
  .title {
    font-size: 1.1rem;
  }
  .subtitle {
    font-size: 1rem;
  }
  .ticket-card {
    padding: 8px;
    font-size: 0.97rem;
  }
  .modal-header h3 {
    font-size: 1.05rem;
  }
  .btn {
    font-size: 0.95rem;
    padding: 5px 8px;
  }
}
.ticket-card {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-left: 6px solid #3182ce;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.03);
    transition: all 0.3s ease;
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
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

.volver-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: linear-gradient(90deg, #3182ce 0%, #1f6feb 100%);
  color: #fff;
  font-weight: 700;
  font-size: 1.08rem;
  border: none;
  border-radius: 10px;
  box-shadow: 0 2px 12px rgba(31,111,235,0.10);
  cursor: pointer;
  transition: background 0.2s, transform 0.13s, box-shadow 0.2s;
  padding: 10px 26px 10px 18px;
  margin-bottom: 18px;
  margin-top: 8px;
  letter-spacing: 0.2px;
}

.volver-btn:hover {
  background: linear-gradient(90deg, #1f6feb 0%, #3182ce 100%);
  transform: translateY(-2px) scale(1.04);
  box-shadow: 0 4px 18px rgba(31,111,235,0.18);
}

.volver-icon-svg {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #eb741f;
  border-radius: 50%;
  width: 2em;
  height: 2em;
  margin-right: 6px;
  box-shadow: 0 1px 4px rgba(31,111,235,0.13);
}

.volver-icon-svg svg {
  display: block;
  margin: auto;
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
    padding: 8px 12px;
}

.btn.save {
    background-color: #34d399;
    color: #fff;
    padding: 8px 12px;
}

.btn.cancel {
    background-color: #a0aec0;
    color: #fff;
}

.btn.add-ticket-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(90deg, #1f6feb 60%, #3182ce 100%);
  color: #fff;
  font-weight: 700;
  font-size: 1.08rem;
  border: none;
  border-radius: 10px;
  box-shadow: 0 2px 12px rgba(31,111,235,0.10);
  cursor: pointer;
  transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
  margin-bottom: 18px;
  margin-top: 8px;
}
.add-ticket-btn:hover {
  background: linear-gradient(90deg, #3182ce 60%, #1f6feb 100%);
  transform: translateY(-2px) scale(1.04);
  box-shadow: 0 4px 18px rgba(31,111,235,0.18);
}
.add-icon {
  font-size: 1.3em;
  display: flex;
  align-items: center;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0,0,0,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}
.modal {
    background: #fff;
    padding: 0;
    border-radius: 18px;
    box-shadow: 0 8px 32px rgba(31, 111, 235, 0.18);
    min-width: 35vw;
    max-width: 95vw;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    animation: modalPop .25s cubic-bezier(.4,2,.6,1) 1;
}
@keyframes modalPop {
  0% { transform: scale(0.95); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: transparent;
  color: #222;
  padding: 18px 24px 12px 24px;
  border-bottom: 1px solid #e5eaf2;
  box-shadow: none;
}
.modal-header h3 {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  color: #1f6feb;
}
.modal-close {
  background: none;
  border: none;
  color: #888;
  font-size: 1.3rem;
  cursor: pointer;
  transition: color 0.2s;
}
.modal-close:hover {
  color: #f87171;
}
.modal-body {
  padding: 22px 24px 22px 24px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.modal-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.modal-field label {
  font-size: 0.98rem;
  font-weight: 500;
  color: #1f6feb;
}
.modal-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  padding: 18px 24px 18px 24px;
  background: #f7fafd;
  border-top: 1px solid #e5eaf2;
}
.edit-input {
  border: 1px solid #d1d5db;
  border-radius: 7px;
  padding: 10px 12px;
  font-size: 1rem;
  background: #f8fafc;
  transition: border-color 0.2s;
}
.edit-input:focus {
  border-color: #1f6feb;
  background: #fff;
  outline: none;
}
textarea.edit-input {
  resize: vertical;
  min-height: 60px;
  max-height: 180px;
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

.ticket-filters {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 18px;
}
.ticket-filters label {
  font-weight: 500;
  color: #1f6feb;
}

.ticket-filters .select[multiple] {
  min-width: 160px;
  max-width: 220px;
  height: auto;
  cursor: pointer;
}

.estado-checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-left: 10px;
}
.checkbox-label {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.98rem;
  color: #1f6feb;
  font-weight: 500;
  background: #f4f8ff;
  border-radius: 6px;
  padding: 4px 10px;
  cursor: pointer;
  user-select: none;
  transition: background 0.2s;
}
.checkbox-label input[type="checkbox"] {
  accent-color: #1f6feb;
}
.modern-filters {
  display: flex;
  flex-direction: column;
  gap: 0;
  background: #f7fafd;
  border-radius: 14px;
  padding: 18px 24px 10px 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 12px rgba(31,111,235,0.06);
}
.filters-row {
  display: flex;
  flex-wrap: wrap;
  gap: 32px;
  width: 100%;
  margin-bottom: 8px;
}
.filter-group {
  margin-bottom: 18px;
  min-width: 180px;
  position: relative;
}

.filter-label {
  font-weight: 600;
  color: #1f6feb;
  margin-bottom: 4px;
  display: block;
}

.filter-select {
  padding: 10px 38px 10px 14px;
  border-radius: 10px;
  border: 1.5px solid #e2e8f0;
  font-size: 1rem;
  background: #f7fafd url('data:image/svg+xml;utf8,<svg fill="none" stroke="%231f6feb" stroke-width="2" viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg"><path d="M19 9l-7 7-7-7"/></svg>') no-repeat right 12px center/20px 20px;
  color: #222;
  transition: border 0.2s, box-shadow 0.2s;
  box-shadow: 0 1px 4px rgba(31,111,235,0.07);
  appearance: none;
  cursor: pointer;
}

.filter-select:focus {
  border-color: #3182ce;
  outline: none;
  box-shadow: 0 0 0 2px #c3e0fa;
}

.filters-actions {
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  width: 100%;
  margin-top: 0;
}
@media (max-width: 900px) {
  .filters-row {
    flex-direction: column;
    gap: 18px;
  }
  .filter-group {
    min-width: 100%;
  }
}
.reset-filters {
  align-self: flex-end;
  margin-left: 18px;
  padding: 8px 18px;
  border-radius: 8px;
  border: none;
  background: #eaf2fb;
  color: #1f6feb;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  box-shadow: 0 1px 4px rgba(31,111,235,0.07);
}
.reset-filters:hover {
  background: #1f6feb;
  color: #fff;
}
.container-reset-filters{
    display: flex;
    justify-content: flex-end;
    width: 100%;
    margin-top: 10px;
}
.no-results {
  grid-column: 1 / -1;
  text-align: center;
  color: #888;
  font-size: 1.1rem;
  padding: 32px 0 24px 0;
  background: #f7fafd;
  border-radius: 12px;
  font-weight: 500;
}
.modern-checkbox {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1rem;
  color: #1f6feb;
  font-weight: 500;
  background: #eaf2fb;
  border-radius: 8px;
  padding: 7px 18px 7px 36px;
  cursor: pointer;
  user-select: none;
  transition: background 0.2s, box-shadow 0.2s;
  box-shadow: 0 1px 4px rgba(31,111,235,0.07);
  margin-bottom: 4px;
}
.modern-checkbox input[type="checkbox"] {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0;
  width: 20px;
  height: 20px;
  cursor: pointer;
  z-index: 2;
}
.modern-checkbox .checkmark {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  height: 20px;
  width: 20px;
  background-color: #fff;
  border: 2px solid #1f6feb;
  border-radius: 6px;
  transition: background 0.2s, border-color 0.2s;
  box-shadow: 0 1px 4px rgba(31,111,235,0.10);
}
.modern-checkbox input[type="checkbox"]:checked ~ .checkmark {
  background: linear-gradient(135deg, #1f6feb 60%, #3182ce 100%);
  border-color: #1f6feb;
}
.modern-checkbox .checkmark:after {
  content: "";
  position: absolute;
  display: none;
}
.modern-checkbox input[type="checkbox"]:checked ~ .checkmark:after {
  display: block;
}
.modern-checkbox .checkmark:after {
  left: 6px;
  top: 2.5px;
  width: 5px;
  height: 11px;
  border: solid #fff;
  border-width: 0 3px 3px 0;
  transform: rotate(45deg);
  content: "";
  position: absolute;
}
.modern-checkbox:hover .checkmark {
  border-color: #3182ce;
  box-shadow: 0 2px 8px rgba(31,111,235,0.13);
}
.user-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  justify-items: center;
  margin-right: 6px;
  font-size: 1.1em;
  color: #1f6feb;
  vertical-align: middle;
}
.repo-select-visual {
  margin-bottom: 24px;
}
.repo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
}
.repo-card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  position: relative;
}
.repo-card.selected {
  border-color: #3182ce;
  box-shadow: 0 4px 12px rgba(31, 111, 235, 0.15);
}
.repo-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.repo-card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  min-width: 0;
}

.repo-name {
    font-size: 1.1rem;
    font-weight: 600;
    color: #2d3748;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
    display: inline-block;
    vertical-align: middle;
}

.repo-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  margin-top: 4px;
}

.repo-language {
  font-size: 1.1rem;
    font-weight: 600;
    color: #2d3748;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
    display: inline-block;
    vertical-align: middle;
}

.repo-lang-icon{
  width: 100%;
  padding: 2px 4px;
  display: flex;
  gap: 2px;
  align-items: center;
  /* justify-content: right; */
}

.lang-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 5px;
  border: 1.5px solid #fff;
  box-shadow: 0 1px 2px #eee;
}

@media (max-width: 700px) {
  .repo-name {
    max-width: 60vw;
    font-size: 1rem;
  }
}
</style>

