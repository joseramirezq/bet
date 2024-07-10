<template>
    <div class="py-4 container-fluid">
        <div class="row">
            <div class="col-12">
                <div class="card">
                    <div class="card-header d-flex justify-content-between align-items-center pb-0">
                        <h6>Premios</h6>
                        <button class="btn btn-primary ml-auto" @click="nuevoItem">NUEVO</button>
                    </div>

                    <div class="card-body px-0 pt-0 pb-2">
                        <Preloader :visible="cargando" />
                    </div>
                    <div class="table-responsive p-4">
                        <table class="table align-items-center mb-0" ref="itemtabla">
                            <thead>
                                <tr class="align-middle">
                                    <th class="text-secondary opacity-7">ID</th>
                                    <th class="text-secondary opacity-7">Nombre</th>
                                    <th class="text-secondary opacity-7">Descripción</th>
                                    <th class="text-secondary opacity-7">Opciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="premio in premios" :key="premio.id" class="align-middle">
                                    <td>{{ premio.id }}</td>
                                    <td>{{ premio.nombre_premio }}</td>
                                    <td>{{ premio.descripcion }}</td>
                                   
                                    <td>
                                        <button @click="verPremio(premio)" class="badge badge-sm bg-gradient-success">
                                            <i class="far fa-eye " aria-hidden="true"></i>
                                        </button>
                                        <button @click="editarPremio(premio)"
                                            class="badge badge-sm bg-gradient-warning">
                                            <i class="far fa-edit " aria-hidden="true"></i>
                                        </button>
                                        <button @click="desactivarPremio(premio.id)"
                                            class="badge badge-sm bg-gradient-danger">
                                            <i class="far fa-trash-alt " aria-hidden="true"></i>
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
        <div class="modal fade" id="premioModal" tabindex="-1" aria-labelledby="premioModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="premioModalLabel">{{ modalTitle }}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"
                            @click="closeModal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="premioForm">
                            <div class="mb-3">
                                <label for="nombre_premio" class="form-label">Nombre del Premio</label>
                                <input type="text" class="form-control" id="nombre_premio" v-model="form.nombre_premio">
                                <div class="text-danger">{{ formErrors.nombre_premio }}</div>
                            </div>
                            <div class="mb-3">
                                <label for="descripcion" class="form-label">Descripción</label>
                                <textarea class="form-control" id="descripcion" v-model="form.descripcion"></textarea>
                                <div class="text-danger">{{ formErrors.descripcion }}</div>
                            </div>
                            <div class="mb-3">
                                <label for="imagen_url" class="form-label">Imagen</label>
                                <input type="file" class="form-control" @change="handleFileUpload">
                                <div class="text-danger">{{ formErrors.imagen_url }}</div>
                                <div v-if="form.imagen_url">
                                    <img :src="form.imagen_url" alt="Imagen del Premio" width="100">
                                </div>
                            </div>


                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"
                            @click="closeModal">Cerrar</button>
                        <button type="button" class="btn btn-primary" @click="guardarPremio">Guardar</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import PremioService from '../../services/PremioService';
import Preloader from "@/components/Preloader.vue";
import $ from 'jquery';

export default {
    name: "Premios",
    components: {
        Preloader
    },
    data() {
        return {
            premios: [],
            cargando: false,
            formErrors: {},
            completa:'',
            form: {
                nombre_premio: '',
                descripcion: '',
                imagen_url: '',
                estado: 1
            },
            file: null, // Agregado para manejar el archivo
            modalTitle: '',
            currentPremioId: null
        };
    },
    created() {
        this.fetchPremiosActivos();
    },
    methods: {
        async fetchPremiosActivos() {
            try {
                this.cargando = true;
                const response = await PremioService.getPremiosActivos();
                this.premios = response.data.data;
                this.$nextTick(() => {
                    if ($.fn.dataTable.isDataTable(this.$refs.itemtabla)) {
                        $(this.$refs.itemtabla).DataTable().destroy();
                    }
                    this.dataTable = $(this.$refs.itemtabla).DataTable({
                        order: [[0, 'desc']],
                        pageLength: 20 // Mostrar 20 filas por página
                    });
                });
            } catch (error) {
                console.error('Error fetching premios:', error);
                this.$swal({
                    icon: 'error',
                    title: 'Error',
                    text: 'Hubo un error al cargar los premios.',
                });
            } finally {
                this.cargando = false;
            }
        },
        verPremio(premio) {
            const imagenUrl = process.env.VUE_APP_API_URL + '' + premio.imagen_url;
      
            const detalles = `
      <div style="display: flex; flex-wrap: wrap;">
        <div style="flex: 1; min-width: 50%; text-align: left; padding-right: 10px;">
          <p><strong>Nombre:</strong> ${premio.nombre_premio}</p>
          <p><strong>Descripción:</strong> ${premio.descripcion}</p>
          <p><strong>Imagen URL:</strong> <img src="${imagenUrl}" alt="${premio.nombre_premio}" width="100"></p>
        </div>
        <div style="flex: 1; min-width: 50%; text-align: left; padding-left: 10px;">
          <p><strong>Estado:</strong> ${premio.estado ? 'Activo' : 'Inactivo'}</p>
          <p><strong>Creado:</strong> ${premio.created_at}</p>
          <p><strong>Actualizado:</strong> ${premio.updated_at}</p>
        </div>
      </div>
    `;
            this.$swal({
                icon: 'info',
                title: 'Detalles del Premio',
                html: detalles,
                customClass: {
                    popup: 'swal-wide'
                },
                width: '600px'
            });
        },
        nuevoItem() {
            this.modalTitle = 'Nuevo Premio';
            this.currentPremioId = null;
            this.form = {
                nombre_premio: '',
                descripcion: '',
                imagen_url: '',
                estado: 1
            };
            this.showModal();
        },
        editarPremio(premio) {
            const imagenUrl = process.env.VUE_APP_API_URL + '' + premio.imagen_url;
            this.modalTitle = 'Editar Premio';
            this.currentPremioId = premio.id;
            this.form = {
                nombre_premio: premio.nombre_premio,
                descripcion: premio.descripcion,
                imagen_url: imagenUrl,
                estado: premio.estado
            };
            this.showModal();
        },
        handleFileUpload(event) {
            this.file = event.target.files[0];
        },
        async guardarPremio() {
            const formData = new FormData();
            formData.append('nombre_premio', this.form.nombre_premio);
            formData.append('descripcion', this.form.descripcion);
            formData.append('imagen_url', this.file); // Asumiendo que el backend maneja este campo correctamente
            formData.append('estado', this.form.estado);

            try {
                if (this.currentPremioId) {
                    formData.append('_method', 'PUT'); // Si es una actualización, se usa PUT
                    await PremioService.updatePremio(this.currentPremioId, formData);
                    this.$swal({
                        icon: 'success',
                        title: 'Premio Actualizado',
                        text: `El premio ha sido actualizado exitosamente.`,
                    });
                } else {
                    await PremioService.createPremio(formData);
                    this.$swal({
                        icon: 'success',
                        title: 'Premio Registrado',
                        text: `El premio ha sido registrado exitosamente.`,
                    });
                }
                location.reload();
                this.closeModal();
            } catch (error) {
                if (error.response && error.response.data.errors) {
                    this.formErrors = error.response.data.errors;
                } else {
                    console.error('Error guardando premio:', error);
                    this.$swal({
                        icon: 'error',
                        title: 'Error',
                        text: 'Hubo un error al guardar el premio.',
                    });
                }
            }
        },
        async desactivarPremio(id) {
            try {
                await PremioService.desactivarPremio(id);
                this.$swal({
                    icon: 'success',
                    title: 'Premio Desactivado',
                    text: `El premio con ID ${id} ha sido desactivado.`,
                }).then(() => {
                    location.reload();
                });
            } catch (error) {
                console.error('Error desactivando premio:', error);
                this.$swal({
                    icon: 'error',
                    title: 'Error',
                    text: 'Hubo un error al desactivar el premio.',
                });
            }
        },
        showModal() {
            const modal = document.getElementById('premioModal');
            modal.classList.add('show');
            modal.style.display = 'block';
            modal.setAttribute('aria-modal', 'true');
            modal.removeAttribute('aria-hidden');
        },
        closeModal() {
            const modal = document.getElementById('premioModal');
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
