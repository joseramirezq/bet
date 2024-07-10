<template>
    <div class="py-4 container-fluid">
        <div class="row">
            <div class="col-12">
                <div class="card">
                    <div class="card-header d-flex justify-content-between align-items-center pb-0">
                        <h6>Ganadores</h6>
                        <button class="btn btn-primary ml-auto" @click="nuevoGanador">NUEVO</button>
                    </div>
                    <div class="card-body px-0 pt-0 pb-2">
                        <Preloader :visible="cargando" />
                    </div>
                    <div class="table-responsive p-4">
                        <table class="table align-items-center mb-0" ref="itemtabla">
                            <thead>
                                <tr class="align-middle text-center">
                                    <th class="text-secondary opacity-7">ID</th>
                                    <th class="text-secondary opacity-7">Usuario</th>
                                    <th class="text-secondary opacity-7">Sorteo</th>
                                    <th class="text-secondary opacity-7">Premio</th>
                                    <th class="text-secondary opacity-7">Fecha Ganado</th>
                                    <th class="text-secondary opacity-7">Estado</th>
                                    <th class="text-secondary opacity-7">Opciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="ganador in ganadores" :key="ganador.id" class="align-middle text-center">
                                    <td>{{ ganador.id }}</td>
                                    <td>{{ ganador.usuario ? ganador.usuario.nombres : 'N/A' }}</td>
                                    <td>{{ ganador.sorteo ? ganador.sorteo.fecha_sorteo : 'N/A' }}</td>
                                    <td>{{ ganador.premio ? ganador.premio.nombre_premio : 'N/A' }}</td>
                                    <td>{{ ganador.fecha_ganado }}</td>
                                    <td>{{ ganador.estado ? 'Sí' : 'No' }}</td>
                                    <td>
                                        <button @click="verGanador(ganador)"
                                            class="badge badge-sm bg-gradient-success"><i class="far fa-eye"
                                                aria-hidden="true"></i>
                                        </button>
                                        <button @click="editarGanador(ganador)"
                                            class="badge badge-sm bg-gradient-warning">
                                            <i class="far fa-edit" aria-hidden="true"></i>
                                        </button>
                                        <button @click="desactivarGanador(ganador.id)"
                                            class="badge badge-sm bg-gradient-danger">
                                            <i class="far fa-trash-alt" aria-hidden="true"></i>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal -->
        <div class="modal fade" id="ganadorModal" tabindex="-1" aria-labelledby="ganadorModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="ganadorModalLabel">{{ modalTitle }}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="closeModal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="ganadorForm">
                            <div class="mb-3">
                                <label for="id_usuario" class="form-label">Usuario</label>
                                <v-select
                                    :options="usuarios"
                                    label="nombres"
                                    :reduce="usuario => usuario.id"
                                    v-model="form.id_usuario"
                                ></v-select>
                                <div class="text-danger">{{ formErrors.id_usuario }}</div>
                            </div>
                            <div class="mb-3">
                                <label for="id_sorteo" class="form-label">Sorteo</label>
                                <v-select
                                    :options="sorteos"
                                    label="fecha_sorteo"
                                    :reduce="sorteo => sorteo.id"
                                    v-model="form.id_sorteo"
                                ></v-select>
                                <div class="text-danger">{{ formErrors.id_sorteo }}</div>
                            </div>
                            <div class="mb-3">
                                <label for="id_premio" class="form-label">Premio</label>
                                <v-select
                                    :options="premios"
                                    label="nombre_premio"
                                    :reduce="premio => premio.id"
                                    v-model="form.id_premio"
                                ></v-select>
                                <div class="text-danger">{{ formErrors.id_premio }}</div>
                            </div>
                            <div class="mb-3">
                                <label for="fecha_ganado" class="form-label">Fecha Ganado</label>
                                <input type="datetime-local" class="form-control" id="fecha_ganado" v-model="form.fecha_ganado">
                                <div class="text-danger">{{ formErrors.fecha_ganado }}</div>
                            </div>
                            <div class="mb-3">
                                <label for="estado" class="form-label">Estado</label>
                                <input type="checkbox" id="estado" v-model="form.estado">
                                <div class="text-danger">{{ formErrors.estado }}</div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="closeModal">Cerrar</button>
                        <button type="button" class="btn btn-primary" @click="guardarGanador">Guardar</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import GanadorService from '../../services/GanadorService';
import UsuarioService from '../../services/UsuarioService';
import SorteoService from '../../services/SorteoService';
import PremioService from '../../services/PremioService';
import Preloader from "@/components/Preloader.vue";
import $ from 'jquery';

export default {
    name: "Ganadores",
    components: {
        Preloader
    },
    data() {
        return {
            ganadores: [],
            usuarios: [],
            sorteos: [],
            premios: [],
            cargando: false,
            formErrors: {},
            form: {
                id_usuario: '',
                id_sorteo: '',
                id_premio: '',
                fecha_ganado: '',
                estado: false
            },
            modalTitle: '',
            currentGanadorId: null
        };
    },
    created() {
        this.fetchGanadores();
        this.fetchUsuarios();
        this.fetchSorteos();
        this.fetchPremios();
    },
    methods: {
        async fetchGanadores() {
            try {
                this.cargando = true;
                const response = await GanadorService.getGanadores();
                this.ganadores = response.data.data;
                this.$nextTick(() => {
                    if ($.fn.dataTable.isDataTable(this.$refs.itemtabla)) {
                        $(this.$refs.itemtabla).DataTable().destroy();
                    }
                    this.dataTable = $(this.$refs.itemtabla).DataTable({
                        order: [[0, 'desc']],
                        pageLength: 20
                    });
                });
            } catch (error) {
                console.error('Error fetching ganadores:', error);
                this.$swal({
                    icon: 'error',
                    title: 'Error',
                    text: 'Hubo un error al cargar los ganadores.',
                });
            } finally {
                this.cargando = false;
            }
        },
        async fetchUsuarios() {
            try {
                const response = await UsuarioService.getUsuarios();
                this.usuarios = response.data.data;
            } catch (error) {
                console.error('Error fetching usuarios:', error);
            }
        },
        async fetchSorteos() {
            try {
                const response = await SorteoService.getSorteos();
                this.sorteos = response.data.data;
            } catch (error) {
                console.error('Error fetching sorteos:', error);
            }
        },
        async fetchPremios() {
            try {
                const response = await PremioService.getPremios();
                this.premios = response.data.data;
            } catch (error) {
                console.error('Error fetching premios:', error);
            }
        },
        verGanador(ganador) {
            const detalles = `
                <div style="display: flex; flex-wrap: wrap;">
                    <div style="flex: 1; min-width: 50%; text-align: left; padding-right: 10px;">
                        <p><strong>Usuario:</strong> ${ganador.usuario ? ganador.usuario.nombres : 'N/A'}</p>
                        <p><strong>Sorteo:</strong> ${ganador.sorteo ? ganador.sorteo.fecha_sorteo : 'N/A'}</p>
                        <p><strong>Premio:</strong> ${ganador.premio ? ganador.premio.nombre_premio : 'N/A'}</p>
                        <p><strong>Fecha Ganado:</strong> ${ganador.fecha_ganado}</p>
                        <p><strong>Estado:</strong> ${ganador.estado ? 'Sí' : 'No'}</p>
                    </div>
                </div>
            `;
            this.$swal({
                icon: 'info',
                title: 'Detalles del Ganador',
                html: detalles,
                customClass: {
                    popup: 'swal-wide'
                },
                width: '600px'
            });
        },
        nuevoGanador() {
            this.modalTitle = 'Nuevo Ganador';
            this.currentGanadorId = null;
            this.form = {
                id_usuario: '',
                id_sorteo: '',
                id_premio: '',
                fecha_ganado: '',
                estado: false
            };
            this.showModal();
        },
        editarGanador(ganador) {
            this.modalTitle = 'Editar Ganador';
            this.currentGanadorId = ganador.id;
            this.form = {
                id_usuario: ganador.id_usuario,
                id_sorteo: ganador.id_sorteo,
                id_premio: ganador.id_premio,
                fecha_ganado: ganador.fecha_ganado,
                estado: ganador.estado
            };
            this.showModal();
        },
        async guardarGanador() {
            try {
                if (this.currentGanadorId) {
                    await GanadorService.updateGanador(this.currentGanadorId, this.form);
                    this.$swal({
                        icon: 'success',
                        title: 'Ganador Actualizado',
                        text: `El ganador ha sido actualizado exitosamente.`,
                    });
                } else {
                    await GanadorService.createGanador(this.form);
                    this.$swal({
                        icon: 'success',
                        title: 'Ganador Registrado',
                        text: `El ganador ha sido registrado exitosamente.`,
                    });
                }
                this.fetchGanadores();
                this.closeModal();
            } catch (error) {
                if (error.response && error.response.data.errors) {
                    this.formErrors = error.response.data.errors;
                } else {
                    console.error('Error guardando ganador:', error);
                    this.$swal({
                        icon: 'error',
                        title: 'Error',
                        text: 'Hubo un error al guardar el ganador.',
                    });
                }
            }
        },
        async desactivarGanador(id) {
            try {
                await GanadorService.deleteGanador(id);
                this.$swal({
                    icon: 'success',
                    title: 'Ganador Desactivado',
                    text: `El ganador ha sido desactivado.`,
                });
                this.fetchGanadores();
            } catch (error) {
                console.error('Error desactivando ganador:', error);
                this.$swal({
                    icon: 'error',
                    title: 'Error',
                    text: 'Hubo un error al desactivar el ganador.',
                });
            }
        },
        showModal() {
            const modal = document.getElementById('ganadorModal');
            modal.classList.add('show');
            modal.style.display = 'block';
            modal.setAttribute('aria-modal', 'true');
            modal.removeAttribute('aria-hidden');
        },
        closeModal() {
            const modal = document.getElementById('ganadorModal');
            modal.classList.remove('show');
            modal.style.display = 'none';
            modal.setAttribute('aria-hidden', 'true');
            modal.removeAttribute('aria-modal');
        }
    }
};
</script>

<style scoped>
.text-danger {
    color: red;
}
</style>
