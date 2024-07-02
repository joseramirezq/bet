<template>
    <div class="py-4 container-fluid">
        <div class="row">
            <div class="col-12">
                <div class="card">
                    <div class="card-header d-flex justify-content-between align-items-center pb-0">
                        <h6>Usuarios</h6>
                        <button class="btn btn-primary ml-auto" @click="nuevoItem">NUEVO</button>
                    </div>

                    <div class="card-body px-0 pt-0 pb-2">
                        <Preloader :visible="cargando" /> <!-- Usar el componente del preloader -->
                    </div>
                    <div class="table-responsive p-4">
                        <table class="table align-items-center mb-0" ref="itemtabla">
                            <thead>
                                <tr class="align-middle text-center">
                                    <th class="text-secondary opacity-7">ID</th>
                                    <th class="text-secondary opacity-7">DNI</th>
                                    <th class="text-secondary opacity-7">Nombres</th>
                                    <th class="text-secondary opacity-7">Apellidos</th>
                                    <th class="text-secondary opacity-7">Departamento</th>
                                    <th class="text-secondary opacity-7">Fecha de Nacimiento</th>
                                    <th class="text-secondary opacity-7">Opciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="usuario in usuarios" :key="usuario.id" class="align-middle text-center">
                                    <td>{{ usuario.id }}</td>
                                    <td>{{ usuario.numero_documento }}</td>
                                    <td>{{ usuario.nombres }}</td>
                                    <td>{{ usuario.apellido_paterno }} {{ usuario.apellido_materno }}</td>
                                    <td>{{ usuario.departamento }}</td>
                                    <td>{{ usuario.fecha_nacimiento }}</td>
                                    <td>
                                        <button @click="verUsuario(usuario)"
                                            class="badge badge-sm bg-gradient-success">Ver</button>
                                        <button @click="editarUsuario(usuario)"
                                            class="badge badge-sm bg-gradient-warning">Editar</button>
                                        <button @click="desactivarUsuario(usuario.id)"
                                            class="badge badge-sm bg-gradient-danger">
                                            <i class="far fa-trash-alt me-2" aria-hidden="true"></i>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
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
    components: {
        Preloader
    },
    data() {
        return {
            usuarios: [],
            cargando: false,
            dataTable: null,
            formErrors: {},
            currentUsuario: null,
        };
    },
    created() {
        this.fetchUsuariosActivos();
    },
    methods: {
        fetchUsuariosActivos() {
            this.cargando = true;
            UsuarioService.getUsuariosActivos()
                .then(response => {
                    this.usuarios = response.data.data;
                    this.$nextTick(() => {
                        this.$nextTick(() => {
                            this.dataTable = $(this.$refs.itemtabla).DataTable();
                        });
                    });
                    this.cargando = false;
                })
                .catch(error => {
                    this.cargando = false;
                    console.error('Error fetching users:', error);
                    this.$swal({
                        icon: 'error',
                        title: 'Error',
                        text: 'Hubo un error al cargar los usuarios.',
                    });
                });
        },
        verUsuario(usuario) {
            const detalles = `
                <div style="display: flex; flex-wrap: wrap;">
                    <div style="flex: 1; min-width: 50%; text-align: left; padding-right: 10px;">
                        <p><strong>DNI:</strong> ${usuario.numero_documento}</p>
                        <p><strong>Email:</strong> ${usuario.email}</p>
                        <p><strong>Código:</strong> ${usuario.codigo}</p>
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
                        <p><strong>Suscripción Activa:</strong> ${usuario.suscripcion_activa ? 'Sí' : 'No'}</p>
                        <p><strong>Rol:</strong> ${usuario.rol}</p>
                        <p><strong>Estado:</strong> ${usuario.estado ? 'Activo' : 'Inactivo'}</p>
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
        editarUsuario(usuario) {
            this.currentUsuario = { ...usuario }; // Guardar una copia del usuario actual

            const formHtml = `
                <form id="editarUsuarioForm">
                    <div style="display: flex; flex-wrap: wrap;">
                        <div style="flex: 1; min-width: 50%; text-align: left; padding-right: 10px;">
                            <label>DNI</label><input type="text" name="numero_documento" value="${usuario.numero_documento}" class="form-control">
                            <div class="text-danger">${this.formErrors.numero_documento || ''}</div>
                            <label>Código</label><input type="text" name="codigo" value="${usuario.codigo}" class="form-control">
                            <div class="text-danger">${this.formErrors.codigo || ''}</div>
                            <label>Nombres</label><input type="text" name="nombres" value="${usuario.nombres}" class="form-control">
                            <div class="text-danger">${this.formErrors.nombres || ''}</div>
                            <label>Apellido Paterno</label><input type="text" name="apellido_paterno" value="${usuario.apellido_paterno}" class="form-control">
                            <div class="text-danger">${this.formErrors.apellido_paterno || ''}</div>
                            <label>Apellido Materno</label><input type="text" name="apellido_materno" value="${usuario.apellido_materno}" class="form-control">
                            <div class="text-danger">${this.formErrors.apellido_materno || ''}</div>
                            <label>Email</label><input type="email" name="email" value="${usuario.email}" class="form-control">
                            <div class="text-danger">${this.formErrors.email || ''}</div>
                            <label>Teléfono</label><input type="text" name="telefono" value="${usuario.telefono}" class="form-control">
                            <div class="text-danger">${this.formErrors.telefono || ''}</div>
                        </div>
                        <div style="flex: 1; min-width: 50%; text-align: left; padding-left: 10px;">
                            <label>Fecha de Nacimiento</label><input type="date" name="fecha_nacimiento" value="${usuario.fecha_nacimiento}" class="form-control">
                            <div class="text-danger">${this.formErrors.fecha_nacimiento || ''}</div>
                            <label>Género</label><input type="text" name="genero" value="${usuario.genero}" class="form-control">
                            <div class="text-danger">${this.formErrors.genero || ''}</div>
                            <label>Dirección</label><input type="text" name="direccion" value="${usuario.direccion}" class="form-control">
                            <div class="text-danger">${this.formErrors.direccion || ''}</div>
                            <label>Distrito</label><input type="text" name="distrito" value="${usuario.distrito}" class="form-control">
                            <div class="text-danger">${this.formErrors.distrito || ''}</div>
                            <label>Provincia</label><input type="text" name="provincia" value="${usuario.provincia}" class="form-control">
                            <div class="text-danger">${this.formErrors.provincia || ''}</div>
                            <label>Departamento</label><input type="text" name="departamento" value="${usuario.departamento}" class="form-control">
                            <div class="text-danger">${this.formErrors.departamento || ''}</div>
                            <label>País</label><input type="text" name="pais" value="${usuario.pais}" class="form-control">
                            <div class="text-danger">${this.formErrors.pais || ''}</div>
                            <label>Suscripción Activa</label><input type="checkbox" name="suscripcion_activa" ${usuario.suscripcion_activa ? 'checked' : ''}>
                            <div class="text-danger">${this.formErrors.suscripcion_activa || ''}</div>
                            <label>Rol</label><input type="text" name="rol" value="${usuario.rol}" class="form-control">
                            <div class="text-danger">${this.formErrors.rol || ''}</div>
                            <label>Estado</label><input type="checkbox" name="estado" ${usuario.estado ? 'checked' : ''}>
                            <div class="text-danger">${this.formErrors.estado || ''}</div>
                        </div>
                    </div>
                </form>
            `;

            this.$swal({
                title: 'Editar Usuario',
                html: formHtml,
                focusConfirm: false,
                showCancelButton: true,
                preConfirm: () => {
                    const formData = new FormData(document.getElementById('editarUsuarioForm'));
                    return {
                        numero_documento: formData.get('numero_documento')?.toString() || '',
                        email: formData.get('email')?.toString() || '',
                        codigo: formData.get('codigo')?.toString() || '',
                        nombres: formData.get('nombres')?.toString() || '',
                        apellido_paterno: formData.get('apellido_paterno')?.toString() || '',
                        apellido_materno: formData.get('apellido_materno')?.toString() || '',
                        telefono: formData.get('telefono')?.toString() || '',
                        fecha_nacimiento: formData.get('fecha_nacimiento')?.toString() || '',
                        genero: formData.get('genero')?.toString() || '',
                        direccion: formData.get('direccion')?.toString() || '',
                        distrito: formData.get('distrito')?.toString() || '',
                        provincia: formData.get('provincia')?.toString() || '',
                        departamento: formData.get('departamento')?.toString() || '',
                        pais: formData.get('pais')?.toString() || '',
                        suscripcion_activa: formData.get('suscripcion_activa') === 'on',
                        rol: formData.get('rol')?.toString() || '',
                        estado: formData.get('estado') === 'on'
                    };
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    this.actualizarUsuario(usuario.id, result.value);
                }
            });
        },
        actualizarUsuario(id, data) {
            UsuarioService.updateUsuario(id, data)
                .then(() => {
                    this.$swal({
                        icon: 'success',
                        title: 'Usuario Actualizado',
                        text: `El usuario con ID ${id} ha sido actualizado.`,
                    });
                    this.fetchUsuariosActivos(); // Recargar la lista de usuarios activos
                })
                .catch(error => {
                    if (error.response && error.response.data.errors) {
                        this.formErrors = error.response.data.errors;
                        this.$nextTick(() => {
                            this.editarUsuario({ ...this.currentUsuario, ...data }); // Reabrir el formulario con los datos ingresados y errores
                        });
                    } else {
                        console.error('Error actualizando usuario:', error);
                        this.$swal({
                            icon: 'error',
                            title: 'Error',
                            text: 'Hubo un error al actualizar el usuario.',
                        });
                    }
                });
        },
        desactivarUsuario(id) {
            UsuarioService.desactivarUsuario(id)
                .then(() => {
                    this.$swal({
                        icon: 'success',
                        title: 'Usuario Desactivado',
                        text: `El usuario con ID ${id} ha sido desactivado.`,
                    }).then(() => {
                        location.reload(); // Recargar la página después de desactivar el usuario
                    });
                })
                .catch(error => {
                    console.error('Error desactivando usuario:', error);
                    this.$swal({
                        icon: 'error',
                        title: 'Error',
                        text: 'Hubo un error al desactivar el usuario.',
                    });
                });
        },
        nuevoItem() {
            this.$swal({
                icon: 'info',
                title: 'Nuevo Usuario',
                text: 'Implementar la lógica para agregar un nuevo usuario.',
            });
        }
    },
};
</script>

<style scoped>
.text-danger {
    color: red;
}
</style>
