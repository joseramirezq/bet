<template>
    <div class="py-4 container-fluid">
        <div class="row">
            <div class="col-12">
                <div class="card">
                    <div class="card-header d-flex justify-content-between align-items-center pb-0">
                        <h6>Suscripciones</h6>
                        <button class="btn btn-primary ml-auto" @click="nuevaSuscripcion">NUEVO</button>
                    </div>
                    <div class="card-body px-0 pt-0 pb-2">
                        <Preloader :visible="cargando" />
                    </div>
                    <div class="table-responsive p-4">
                        <table class="table align-items-center mb-0" ref="itemtabla">
                            <thead>
                                <tr class="align-middle ">
                                    <th class="text-secondary opacity-7">ID</th>
                                    <th class="text-secondary opacity-7">Suscripción</th>
                                    <th class="text-secondary opacity-7">Usuario</th>
                                    <th class="text-secondary opacity-7">F. Inicio</th>
                                    <th class="text-secondary opacity-7">F. Final</th>
                                    <th class="text-secondary opacity-7">Estado</th>
                                    <th class="text-secondary opacity-7">Monto Pagado</th>
                                    <th class="text-secondary opacity-7">Método de Pago</th>
                                    <th class="text-secondary opacity-7">Fecha de Pago</th>
                                    <th class="text-secondary opacity-7">Estado</th>
                                    <th class="text-secondary opacity-7">Opciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="suscripcion in suscripciones" :key="suscripcion.id" class="align-middle">
                                    <td>{{ suscripcion.id }}</td>
                                    <td>{{ mostrarNombrePeriodo(suscripcion.periodo) }}</td>
                                    <td>{{ suscripcion.usuario.nombres }} {{ suscripcion.usuario.apellido_paterno }} {{
                                        suscripcion.usuario.apellido_materno }}</td>
                                    <td>{{ suscripcion.fecha_inicio }}</td>
                                    <td :style="{ color: obtenerColorEstado(suscripcion.fecha_fin) }">
                                        {{ suscripcion.fecha_fin }}
                                    </td>
                                    <td :style="{ color: obtenerColorEstado(suscripcion.fecha_fin) }">
                                        {{ obtenerEstadoSuscripcion(suscripcion.fecha_fin) }}
                                    </td>
                                    <td>{{ suscripcion.monto_pagado }}</td>
                                    <td>{{ obtenerMetodoPago(suscripcion.pagos) }}</td>
                                    <td>{{ obtenerFechaPago(suscripcion.pagos) }}</td>
                                    <td :style="{ color: obtenerColorEstadoSuscripcion(suscripcion.estado) }">
                                        {{ obtenerEstadoSuscripcionTexto(suscripcion.estado) }}
                                    </td>
                                    <td>
                                        <button @click="verSuscripcion(suscripcion)"
                                            class="badge badge-sm bg-gradient-success">
                                            <i class="far fa-eye" aria-hidden="true"></i>
                                        </button>
                                        <button @click="editarSuscripcion(suscripcion)"
                                            class="badge badge-sm bg-gradient-warning">
                                            <i class="far fa-edit" aria-hidden="true"></i>
                                        </button>
                                        <button @click="eliminarSuscripcion(suscripcion.id)"
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
        <div class="modal fade" id="suscripcionModal" tabindex="-1" aria-labelledby="suscripcionModalLabel"
            aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="suscripcionModalLabel">{{ modalTitle }}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"
                            @click="closeModal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="suscripcionForm">
                            <div class="mb-3">
                                <label for="idUsuario" class="form-label">Usuario</label>
                                <v-select :options="usuarios" label="label" :reduce="usuario => usuario.id"
                                    v-model="form.id_usuario" placeholder="Seleccione un usuario"></v-select>
                                <div class="text-danger">{{ formErrors.id_usuario }}</div>
                            </div>
                            <div class="mb-3">
                                <label for="plan" class="form-label">Plan</label>
                                <select class="form-control" id="plan" v-model="form.periodo"
                                    @change="actualizarFechas">
                                    <option value="" disabled>Seleccione un plan</option>
                                    <option value="30">Fintero - 30 días</option>
                                    <option value="90">Chocolatero - 90 días</option>
                                    <option value="180">Crack - 180 días</option>
                                </select>
                                <div class="text-danger">{{ formErrors.periodo }}</div>
                            </div>
                            <div class="mb-3">
                                <label for="fechaInicio" class="form-label">Fecha de Inicio</label>
                                <input type="datetime-local" class="form-control" id="fechaInicio"
                                    v-model="form.fecha_inicio">
                                <div class="text-danger">{{ formErrors.fecha_inicio }}</div>
                            </div>
                            <div class="mb-3">
                                <label for="fechaFin" class="form-label">Fecha de Fin</label>
                                <input type="datetime-local" class="form-control" id="fechaFin"
                                    v-model="form.fecha_fin">
                                <div class="text-danger">{{ formErrors.fecha_fin }}</div>
                            </div>
                            <div class="mb-3">
                                <label for="tipoPago" class="form-label">Tipo de Pago</label>
                                <select class="form-control" id="tipoPago" v-model="form.tipo_pago">
                                    <option value="" disabled>Seleccione una opción</option>
                                    <option value="Tarjeta">Tarjeta</option>
                                    <option value="Efectivo">Efectivo</option>
                                    <option value="Yape">Yape</option>
                                    <option value="Plim">Plim</option>
                                </select>
                                <div class="text-danger">{{ formErrors.tipo_pago }}</div>
                            </div>
                            <div class="mb-3">
                                <label for="montoPagado" class="form-label">Monto Pagado</label>
                                <input type="number" class="form-control" id="montoPagado" v-model="form.monto_pagado">
                                <div class="text-danger">{{ formErrors.monto_pagado }}</div>
                            </div>
                            <div class="mb-3">
                                <label for="estado" class="form-label">Estado</label>
                                <select class="form-control" id="estado" v-model="form.estado">
                                    <option value="1">Activo</option>
                                    <option value="0">Inactivo</option>
                                </select>
                                <div class="text-danger">{{ formErrors.estado }}</div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"
                            @click="closeModal">Cerrar</button>
                        <button type="button" class="btn btn-primary" @click="guardarSuscripcion">Guardar</button>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import SuscripcionService from '../../services/SuscripcionService';
import UsuarioService from '../../services/UsuarioService';
import Preloader from "@/components/Preloader.vue";
import $ from 'jquery';

export default {
    name: "Suscripciones",
    components: {
        Preloader
    },
    data() {
        return {
            suscripciones: [],
            usuarios: [],
            cargando: false,
            formErrors: {},
            form: {
                id_usuario: '',
                fecha_inicio: '',
                fecha_fin: '',
                monto_pagado: 0,
                tipo_pago: 'Tarjeta',
                estado: 1
            },
            modalTitle: '',
            currentSuscripcionId: null
        };
    },
    created() {
        this.fetchSuscripciones();
        this.fetchUsuarios();
    },
    methods: {
        async fetchSuscripciones() {
            try {
                this.cargando = true;
                const response = await SuscripcionService.getSuscripciones();
                this.suscripciones = response.data.data;
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
                console.error('Error fetching suscripciones:', error);
                this.$swal({
                    icon: 'error',
                    title: 'Error',
                    text: 'Hubo un error al cargar las suscripciones.',
                });
            } finally {
                this.cargando = false;
            }
        },
        async fetchUsuarios() {
            try {
                const response = await UsuarioService.getUsuarios();
                this.usuarios = response.data.data.map(usuario => {
                    return {
                        ...usuario,
                        label: `${usuario.numero_documento} - ${usuario.nombres} ${usuario.apellido_paterno}`
                    };
                });
            } catch (error) {
                console.error('Error fetching usuarios:', error);
            }
        },
        actualizarFechas() {
            const today = new Date();
            this.form.fecha_inicio = today.toISOString().slice(0, 16); // Formato para datetime-local
            const fechaFin = new Date(today);
            fechaFin.setDate(today.getDate() + parseInt(this.form.periodo));
            this.form.fecha_fin = fechaFin.toISOString().slice(0, 16); // Formato para datetime-local
        },
        obtenerColorEstado(fechaFin) {
            const today = new Date();
            const fechaFinDate = new Date(fechaFin);
            return fechaFinDate < today ? 'red' : 'green';
        },
        obtenerEstadoSuscripcion(fechaFin) {
            const today = new Date();
            const fechaFinDate = new Date(fechaFin);
            return fechaFinDate < today ? 'Vencido' : 'En curso';
        },
        obtenerColorEstadoSuscripcion(estado) {
            return estado === 1 ? 'green' : 'red';
        },
        obtenerEstadoSuscripcionTexto(estado) {
            return estado === 1 ? 'Activo' : 'Desactivado';
        },
        obtenerMetodoPago(pagos) {
            return pagos.length > 0 ? pagos[0].metodo_pago : 'No registrado';
        },
        obtenerFechaPago(pagos) {
            return pagos.length > 0 ? pagos[0].fecha_pago : 'No registrada';
        },
        mostrarNombrePeriodo(periodo) {
            if (periodo === 30) {
                return 'Fintero - 30 días';
            } else if (periodo === 90) {
                return 'Chocolarero - 90 días';
            } else if (periodo === 180) {
                return 'Crack - 180 días';
            } else {
                return 'Periodo desconocido';
            }
        },
        verSuscripcion(suscripcion) {
            const detalles = `
          <div style="display: flex; flex-wrap: wrap;">
            <div style="flex: 1; min-width: 50%; text-align: left; padding-right: 10px;">
              <p><strong>ID de Usuario:</strong> ${suscripcion.usuario.nombres} ${suscripcion.usuario.apellido_paterno} ${suscripcion.usuario.apellido_materno}</p>
              <p><strong>Suscripción:</strong> ${this.mostrarNombrePeriodo(suscripcion.periodo)}</p>
              <p><strong>Fecha de Inicio:</strong> ${suscripcion.fecha_inicio}</p>
              <p><strong>Fecha de Fin:</strong> ${suscripcion.fecha_fin}</p>
              <p><strong>Estado:</strong> ${suscripcion.estado ? 'Activo' : 'Inactivo'}</p>
              <p><strong>Monto Pagado:</strong> ${suscripcion.monto_pagado}</p>
              <p><strong>Método de Pago:</strong> ${this.obtenerMetodoPago(suscripcion.pagos)}</p>
              <p><strong>Fecha de Pago:</strong> ${this.obtenerFechaPago(suscripcion.pagos)}</p>
              <p><strong>Estado Suscripción:</strong> ${this.obtenerEstadoSuscripcion(suscripcion.fecha_fin)}</p>
            </div>
          </div>
        `;
            this.$swal({
                icon: 'info',
                title: 'Detalles de la Suscripción',
                html: detalles,
                customClass: {
                    popup: 'swal-wide'
                },
                width: '600px'
            });
        },
        nuevaSuscripcion() {
            this.modalTitle = 'Nueva Suscripción';
            this.currentSuscripcionId = null;
            this.form = {
                id_usuario: '',
                fecha_inicio: '',
                fecha_fin: '',
                monto_pagado: 0,
                estado: 1
            };
            this.showModal();
        },
        editarSuscripcion(suscripcion) {
            this.modalTitle = 'Editar Suscripción';
            this.currentSuscripcionId = suscripcion.id;
            this.form = {
                id_usuario: suscripcion.id_usuario,
                periodo: suscripcion.periodo,
                fecha_inicio: suscripcion.fecha_inicio,
                fecha_fin: suscripcion.fecha_fin,
                monto_pagado: suscripcion.pagos[0] ? suscripcion.pagos[0].monto : 0,
                tipo_pago: suscripcion.pagos[0] ? suscripcion.pagos[0].metodo_pago : '',
                estado: suscripcion.estado
            };
            this.showModal();
        },
        async guardarSuscripcion() {
            try {
                if (this.currentSuscripcionId) {
                    await SuscripcionService.updateSuscripcion(this.currentSuscripcionId, this.form);
                    this.$swal({
                        icon: 'success',
                        title: 'Suscripción Actualizada',
                        text: `La suscripción ha sido actualizada exitosamente.`,
                    });
                } else {
                    await SuscripcionService.createSuscripcion(this.form);
                    this.$swal({
                        icon: 'success',
                        title: 'Suscripción Registrada',
                        text: `La suscripción ha sido registrada exitosamente.`,
                    });
                }
                location.reload();
                this.closeModal();
            } catch (error) {
                if (error.response && error.response.data.errors) {
                    this.formErrors = error.response.data.errors;
                } else {
                    console.error('Error guardando suscripción:', error);
                    this.$swal({
                        icon: 'error',
                        title: 'Error',
                        text: 'Hubo un error al guardar la suscripción.',
                    });
                }
            }
        },
        async eliminarSuscripcion(id) {
            try {
                await SuscripcionService.desactivarSuscripcion(id);
                this.$swal({
                    icon: 'success',
                    title: 'Suscripción Desactivada',
                    text: `La suscripción ha sido Desactivada.`,
                });
                this.fetchSuscripciones();
            } catch (error) {
                console.error('Error desactivar suscripción:', error);
                this.$swal({
                    icon: 'error',
                    title: 'Error',
                    text: 'Hubo un error al desactivar la suscripción.',
                });
            }
        },
        showModal() {
            const modal = document.getElementById('suscripcionModal');
            modal.classList.add('show');
            modal.style.display = 'block';
            modal.setAttribute('aria-modal', 'true');
            modal.removeAttribute('aria-hidden');
        },
        closeModal() {
            const modal = document.getElementById('suscripcionModal');
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