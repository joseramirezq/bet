<template>
    <div class="py-4 container-fluid">
        <div class="row">
            <div class="col-12">
                <div class="card">
                    <div class="card-header d-flex justify-content-between align-items-center pb-0">
                        <h6>Administradores</h6>
                        <button class="btn btn-primary ml-auto" @click="nuevoItem">NUEVO</button>
                    </div>

                    <div class="card-body px-0 pt-0 pb-2">
                        <Preloader :visible="cargando" />
                    </div>
                    <div class="table-responsive p-4">
                        <table class="table align-items-center mb-0" ref="itemtabla">
                            <thead>
                                <tr class="align-middle ">
                                    <th class="text-secondary opacity-7">ID</th>
                                    <th class="text-secondary opacity-7">DNI</th>
                                    <th class="text-secondary opacity-7">Nombres</th>
                                    <th class="text-secondary opacity-7">Departamento</th>
                                    <th class="text-secondary opacity-7">Opciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="usuario in usuarios" :key="usuario.id" class="align-middle">
                                    <td>{{ usuario.id }}</td>
                                    <td>{{ usuario.numero_documento }}</td>
                                    <td>{{ usuario.nombres }} {{ usuario.apellido_paterno }} {{ usuario.apellido_materno
                                        }}</td>
                                    <td>{{ usuario.departamento }}</td>
                                    <td>
                                        <button @click="verUsuario(usuario)" class="badge badge-sm bg-gradient-success">
                                            <i class="far fa-eye " aria-hidden="true"></i>
                                        </button>
                                        <button @click="editarUsuario(usuario)"
                                            class="badge badge-sm bg-gradient-warning">
                                            <i class="far fa-edit " aria-hidden="true"></i>
                                        </button>
                                        <button @click="desactivarUsuario(usuario.id)"
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
        <div class="modal fade" id="usuarioModal" tabindex="-1" aria-labelledby="usuarioModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="usuarioModalLabel">{{ modalTitle }}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"
                            @click="closeModal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="usuarioForm">
                            <div class="mb-3">
                                <label for="tipoDocumento" class="form-label">Tipo de Documento</label>
                                <select class="form-control" id="tipoDocumento" v-model="form.tipo_documento">
                                    <option value="DNI" selected>DNI</option>
                                    <option value="CARNET DE EXTRANJERÍA">CARNET DE EXTRANJERÍA</option>
                                </select>
                                <div class="text-danger">{{ formErrors.tipo_documento }}</div>
                            </div>
                            <div class="mb-3">
                                <label for="numeroDocumento" class="form-label">DNI</label>
                                <input type="text" class="form-control" id="numeroDocumento"
                                    v-model="form.numero_documento">
                                <div class="text-danger">{{ formErrors.numero_documento }}</div>
                            </div>
                            <div class="mb-3">
                                <label for="email" class="form-label">Email</label>
                                <input type="email" class="form-control" id="email" v-model="form.email">
                                <div class="text-danger">{{ formErrors.email }}</div>
                            </div>
                            <div class="mb-3">
                                <label for="nombres" class="form-label">Nombres</label>
                                <input type="text" class="form-control" id="nombres" v-model="form.nombres">
                                <div class="text-danger">{{ formErrors.nombres }}</div>
                            </div>
                            <div class="mb-3">
                                <label for="apellidoPaterno" class="form-label">Apellido Paterno</label>
                                <input type="text" class="form-control" id="apellidoPaterno"
                                    v-model="form.apellido_paterno">
                                <div class="text-danger">{{ formErrors.apellido_paterno }}</div>
                            </div>
                            <div class="mb-3">
                                <label for="apellidoMaterno" class="form-label">Apellido Materno</label>
                                <input type="text" class="form-control" id="apellidoMaterno"
                                    v-model="form.apellido_materno">
                                <div class="text-danger">{{ formErrors.apellido_materno }}</div>
                            </div>
                            <div class="mb-3">
                                <label for="telefono" class="form-label">Teléfono</label>
                                <input type="text" class="form-control" id="telefono" v-model="form.telefono">
                                <div class="text-danger">{{ formErrors.telefono }}</div>
                            </div>
                            <div class="mb-3">
                                <label for="fechaNacimiento" class="form-label">Fecha de Nacimiento</label>
                                <input type="date" class="form-control" id="fechaNacimiento"
                                    v-model="form.fecha_nacimiento">
                                <div class="text-danger">{{ formErrors.fecha_nacimiento }}</div>
                            </div>
                            <div class="mb-3">
                                <label for="genero" class="form-label">Género</label>
                                <input type="text" class="form-control" id="genero" v-model="form.genero">
                                <div class="text-danger">{{ formErrors.genero }}</div>
                            </div>
                            <div class="mb-3">
                                <label for="direccion" class="form-label">Dirección</label>
                                <input type="text" class="form-control" id="direccion" v-model="form.direccion">
                                <div class="text-danger">{{ formErrors.direccion }}</div>
                            </div>
                            <div class="mb-3">
                                <label for="distrito" class="form-label">Distrito</label>
                                <input type="text" class="form-control" id="distrito" v-model="form.distrito">
                                <div class="text-danger">{{ formErrors.distrito }}</div>
                            </div>
                            <div class="mb-3">
                                <label for="provincia" class="form-label">Provincia</label>
                                <input type="text" class="form-control" id="provincia" v-model="form.provincia">
                                <div class="text-danger">{{ formErrors.provincia }}</div>
                            </div>
                            <div class="mb-3">
                                <label for="departamento" class="form-label">Departamento</label>
                                <input type="text" class="form-control" id="departamento" v-model="form.departamento">
                                <div class="text-danger">{{ formErrors.departamento }}</div>
                            </div>
                            <div class="mb-3">
                                <label for="pais" class="form-label">País</label>
                                <input type="text" class="form-control" id="pais" v-model="form.pais">
                                <div class="text-danger">{{ formErrors.pais }}</div>
                            </div>
                            <div class="mb-3">
                                <label for="password" class="form-label">Password</label>
                                <input type="password" class="form-control" id="password" v-model="form.password">
                                <div class="text-danger">{{ formErrors.password }}</div>
                            </div>
                            <div class="mb-3">
                                <label for="password_confirmation" class="form-label">Confirmar Password</label>
                                <input type="password" class="form-control" id="password_confirmation"
                                    v-model="form.password_confirmation">
                                <div class="text-danger">{{ formErrors.password_confirmation }}</div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"
                            @click="closeModal">Cerrar</button>
                        <button type="button" class="btn btn-primary" @click="guardarUsuario">Guardar</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import UsuarioService from '../../services/UsuarioService';
import Preloader from "@/components/Preloader.vue";
import $ from 'jquery';

export default {
    name: "Usuarios",
    components: {
        Preloader
    },
    data() {
        return {
            usuarios: [],
            cargando: false,
            formErrors: {},
            form: {
                tipo_documento: 'DNI',
                numero_documento: '',
                email: '',
                codigo: '-',
                nombres: '',
                apellido_paterno: '',
                apellido_materno: '',
                telefono: '',
                fecha_nacimiento: '',
                genero: '',
                direccion: '',
                distrito: '',
                provincia: '',
                departamento: '',
                pais: '',
                password: '',
                password_confirmation: '',
                estado: 1,
                suscripcion_activa:true,
            },
            modalTitle: '',
            currentUsuarioId: null
        };
    },
    created() {
        this.fetchUsuariosActivos();
    },
    methods: {
        async fetchUsuariosActivos() {
            try {
                this.cargando = true;
                const response = await UsuarioService.getUsuariosAdministradores();
                this.usuarios = response.data.data;
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
                console.error('Error fetching users:', error);
                this.$swal({
                    icon: 'error',
                    title: 'Error',
                    text: 'Hubo un error al cargar los usuarios.',
                });
            } finally {
                this.cargando = false;
            }
        },
        verUsuario(usuario) {
            const detalles = `
          <div style="display: flex; flex-wrap: wrap;">
            <div style="flex: 1; min-width: 50%; text-align: left; padding-right: 10px;">
              <p><strong>DNI:</strong> ${usuario.numero_documento}</p>
              <p><strong>Email:</strong> ${usuario.email}</p>
              <p><strong>Nombres:</strong> ${usuario.nombres} ${usuario.apellido_paterno} ${usuario.apellido_materno}</p>
              <p><strong>Teléfono:</strong> ${usuario.telefono}</p>
              <p><strong>Fecha de Nacimiento:</strong> ${usuario.fecha_nacimiento}</p>
              <p><strong>Género:</strong> ${usuario.genero}</p>
              <p><strong>Dirección:</strong> ${usuario.direccion}</p>
            </div>
            <div style="flex: 1; min-width: 50%; text-align: left; padding-left: 10px;">
              <p><strong>Distrito:</strong> ${usuario.distrito}</p>
              <p><strong>Provincia:</strong> ${usuario.provincia}</p>
              <p><strong>Departamento:</strong> ${usuario.departamento}</p>
              <p><strong>País:</strong> ${usuario.pais}</p>
              <p><strong>Rol:</strong> ${usuario.rol}</p>
              <p><strong>Creado:</strong> ${usuario.created_at}</p>
              <p><strong>Actualizado:</strong> ${usuario.updated_at}</p>
            </div>
          </div>
        `;
            this.$swal({
                icon: 'info',
                title: 'Detalles del Usuario',
                html: detalles,
                customClass: {
                    popup: 'swal-wide'
                },
                width: '600px'
            });
        },
        nuevoItem() {
            this.modalTitle = 'Nuevo Usuario';
            this.currentUsuarioId = null;
            this.form = {
                tipo_documento: '',
                numero_documento: '',
                email: '',
                codigo: '-',
                nombres: '',
                apellido_paterno: '',
                apellido_materno: '',
                telefono: '',
                fecha_nacimiento: '',
                genero: '',
                direccion: '',
                distrito: '',
                provincia: '',
                departamento: '',
                pais: '',
                password: '',
                rol: 'admin',
                password_confirmation: '',
                estado: 1,
                suscripcion_activa:true
            };
            this.showModal();
        },
        editarUsuario(usuario) {
            this.modalTitle = 'Editar Usuario';
            this.currentUsuarioId = usuario.id;
            this.form = {
                tipo_documento: usuario.tipo_documento,
                numero_documento: usuario.numero_documento,
                email: usuario.email,
                codigo: usuario.numero_documento,
                nombres: usuario.nombres,
                apellido_paterno: usuario.apellido_paterno,
                apellido_materno: usuario.apellido_materno,
                telefono: usuario.telefono,
                fecha_nacimiento: usuario.fecha_nacimiento,
                genero: usuario.genero,
                direccion: usuario.direccion,
                distrito: usuario.distrito,
                provincia: usuario.provincia,
                departamento: usuario.departamento,
                pais: usuario.pais,
                password: '',
                rol: 'admin',
                password_confirmation: '',
                estado: 1,
                suscripcion_activa:true
            };
            this.showModal();
        },
        async guardarUsuario() {
            if (this.form.password !== this.form.password_confirmation) {
                this.$swal({
                    icon: 'error',
                    title: 'Error',
                    text: 'Las contraseñas no coinciden.',
                });
                return;
            }

            try {
                if (this.currentUsuarioId) {
                    await UsuarioService.updateUsuario(this.currentUsuarioId, this.form);
                    this.$swal({
                        icon: 'success',
                        title: 'Usuario Actualizado',
                        text: `El usuario ha sido actualizado exitosamente.`,
                    });
                } else {
                    await UsuarioService.createUsuario(this.form);
                    this.$swal({
                        icon: 'success',
                        title: 'Usuario Registrado',
                        text: `El usuario ha sido registrado exitosamente.`,
                    });
                }
                location.reload();
                this.closeModal();
            } catch (error) {
                if (error.response && error.response.data.errors) {
                    this.formErrors = error.response.data.errors;
                } else {
                    console.error('Error guardando usuario:', error);
                    this.$swal({
                        icon: 'error',
                        title: 'Error',
                        text: 'Hubo un error al guardar el usuario.',
                    });
                }
            }
        },
        async desactivarUsuario(id) {
            try {
                await UsuarioService.desactivarUsuario(id);
                this.$swal({
                    icon: 'success',
                    title: 'Usuario Desactivado',
                    text: `El usuario con ID ${id} ha sido desactivado.`,
                }).then(() => {
                    location.reload();
                });
            } catch (error) {
                console.error('Error desactivando usuario:', error);
                this.$swal({
                    icon: 'error',
                    title: 'Error',
                    text: 'Hubo un error al desactivar el usuario.',
                });
            }
        },
        showModal() {
            const modal = document.getElementById('usuarioModal');
            modal.classList.add('show');
            modal.style.display = 'block';
            modal.setAttribute('aria-modal', 'true');
            modal.removeAttribute('aria-hidden');
        },
        closeModal() {
            const modal = document.getElementById('usuarioModal');
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
