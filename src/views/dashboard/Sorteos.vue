<template>
    <div class="py-4 container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center pb-0">
              <h6>Sorteos</h6>
              <button class="btn btn-primary ml-auto" @click="nuevoSorteo">NUEVO</button>
            </div>
            <div class="card-body px-0 pt-0 pb-2">
              <Preloader :visible="cargando" />
            </div>
            <div class="table-responsive p-4">
              <table class="table align-items-center mb-0" ref="itemtabla">
                <thead>
                  <tr class="align-middle text-center">
                    <th class="text-secondary opacity-7">ID</th>
                    <th class="text-secondary opacity-7">Fecha de Sorteo</th>
                    <th class="text-secondary opacity-7">Estado</th>
                    <th class="text-secondary opacity-7">Activo</th>
                    <th class="text-secondary opacity-7">Premios</th>
                    <th class="text-secondary opacity-7">Opciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="sorteo in sorteos" :key="sorteo.id" class="align-middle text-center">
                    <td>{{ sorteo.id }}</td>
                    <td>{{ sorteo.fecha_sorteo }}</td>
                    <td>{{ sorteo.estado }}</td>
                    <td>{{ sorteo.activo ? 'Sí' : 'No' }}</td>
                    <td>
                      <ul>
                        <li v-for="premio in sorteo.premios" :key="premio.id">
                          {{ premio.nombre_premio }}
                        </li>
                      </ul>
                    </td>
                    <td>
                      <button @click="verSorteo(sorteo)" class="badge badge-sm bg-gradient-success">
                        <i class="far fa-eye" aria-hidden="true"></i>
                      </button>
                      <button @click="editarSorteo(sorteo)" class="badge badge-sm bg-gradient-warning">
                        <i class="far fa-edit" aria-hidden="true"></i>
                      </button>
                      <button @click="desactivarSorteo(sorteo.id)" class="badge badge-sm bg-gradient-danger">
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
      <div class="modal fade" id="sorteoModal" tabindex="-1" aria-labelledby="sorteoModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="sorteoModalLabel">{{ modalTitle }}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="closeModal"></button>
            </div>
            <div class="modal-body">
              <form id="sorteoForm">
                <div class="mb-3">
                  <label for="fechaSorteo" class="form-label">Fecha de Sorteo</label>
                  <input type="datetime-local" class="form-control" id="fechaSorteo" v-model="form.fecha_sorteo">
                  <div class="text-danger">{{ formErrors.fecha_sorteo }}</div>
                </div>
                <div class="mb-3">
                  <label for="estado" class="form-label">Estado</label>
                  <select class="form-control" id="estado" v-model="form.estado">
                    <option value="Proximo">Próximo</option>
                    <option value="Pendiente">Pendiente</option>
                    <option value="Realizado">Realizado</option>
                  </select>
                  <div class="text-danger">{{ formErrors.estado }}</div>
                </div>
                <div class="mb-3">
                  <label for="activo" class="form-label">Activo</label>
                  <input type="checkbox" id="activo" v-model="form.activo">
                  <div class="text-danger">{{ formErrors.activo }}</div>
                </div>
                <div class="mb-3">
                  <label for="premios" class="form-label">Premios</label>
                  <v-select
                  :options="premios"
                  label="nombre_premio"
                  :reduce="premio => premio.id"
                  v-model="form.premios"
                  multiple
                  :close-on-select="false"
                ></v-select>
                  <div class="text-danger">{{ formErrors.premios }}</div>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="closeModal">Cerrar</button>
              <button type="button" class="btn btn-primary" @click="guardarSorteo">Guardar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import SorteoService from '../../services/SorteoService';
  import PremioService from '../../services/PremioService';
  import Preloader from "@/components/Preloader.vue";
  import $ from 'jquery';
  
import "vue-select/dist/vue-select.css";
  export default {
    name: "Sorteos",
    components: {
      Preloader
    },
    data() {
      return {
        sorteos: [],
        premios: [],
        cargando: false,
        formErrors: {},
        form: {
          fecha_sorteo: '',
          estado: 'Proximo',
          activo: false,
          premios: []
        },
        modalTitle: '',
        currentSorteoId: null
      };
    },
    created() {
      this.fetchSorteos();
      this.fetchPremios();
    },
    methods: {
      async fetchSorteos() {
        try {
          this.cargando = true;
          const response = await SorteoService.getSorteos();
          this.sorteos = response.data.data;
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
          console.error('Error fetching sorteos:', error);
          this.$swal({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un error al cargar los sorteos.',
          });
        } finally {
          this.cargando = false;
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
      verSorteo(sorteo) {
        const detalles = `
          <div style="display: flex; flex-wrap: wrap;">
            <div style="flex: 1; min-width: 50%; text-align: left; padding-right: 10px;">
              <p><strong>Fecha de Sorteo:</strong> ${sorteo.fecha_sorteo}</p>
              <p><strong>Estado:</strong> ${sorteo.estado}</p>
              <p><strong>Activo:</strong> ${sorteo.activo ? 'Sí' : 'No'}</p>
              <p><strong>Premios:</strong></p>
              <ul>
                ${sorteo.premios.map(premio => `<li>${premio.nombre_premio}</li>`).join('')}
              </ul>
            </div>
          </div>
        `;
        this.$swal({
          icon: 'info',
          title: 'Detalles del Sorteo',
          html: detalles,
          customClass: {
            popup: 'swal-wide'
          },
          width: '600px'
        });
      },
      nuevoSorteo() {
        this.modalTitle = 'Nuevo Sorteo';
        this.currentSorteoId = null;
        this.form = {
          fecha_sorteo: '',
          estado: 'Proximo',
          activo: false,
          premios: []
        };
        this.showModal();
      },
      editarSorteo(sorteo) {
        this.modalTitle = 'Editar Sorteo';
        this.currentSorteoId = sorteo.id;
        this.form = {
          fecha_sorteo: sorteo.fecha_sorteo,
          estado: sorteo.estado,
          activo: sorteo.activo,
          premios: sorteo.premios.map(premio => premio.id)
        };
        this.showModal();
      },
      async guardarSorteo() {
        try {
          if (this.currentSorteoId) {
            await SorteoService.updateSorteo(this.currentSorteoId, this.form);
            this.$swal({
              icon: 'success',
              title: 'Sorteo Actualizado',
              text: `El sorteo ha sido actualizado exitosamente.`,
            });
          } else {
            await SorteoService.createSorteo(this.form);
            this.$swal({
              icon: 'success',
              title: 'Sorteo Registrado',
              text: `El sorteo ha sido registrado exitosamente.`,
            });
          }
          location.reload();
          //this.fetchSorteos();
          this.closeModal();
        } catch (error) {
          if (error.response && error.response.data.errors) {
            this.formErrors = error.response.data.errors;
          } else {
            console.error('Error guardando sorteo:', error);
            this.$swal({
              icon: 'error',
              title: 'Error',
              text: 'Hubo un error al guardar el sorteo.',
            });
          }
        }
      },
      async desactivarSorteo(id) {
        try {
          await SorteoService.deleteSorteo(id);
          this.$swal({
            icon: 'success',
            title: 'Sorteo Desactivado',
            text: `El sorteo ha sido desactivado.`,
          });
          this.fetchSorteos();
        } catch (error) {
          console.error('Error desactivando sorteo:', error);
          this.$swal({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un error al desactivar el sorteo.',
          });
        }
      },
      showModal() {
        const modal = document.getElementById('sorteoModal');
        modal.classList.add('show');
        modal.style.display = 'block';
        modal.setAttribute('aria-modal', 'true');
        modal.removeAttribute('aria-hidden');
      },
      closeModal() {
        const modal = document.getElementById('sorteoModal');
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
  