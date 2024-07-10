<template>
    <div class="py-4 container-fluid">
        <div class="row">
            <div class="col-12">
                <div class="card">
                    <div class="card-header d-flex justify-content-between align-items-center pb-0">
                        <h6>Sliders</h6>
                        <button class="btn btn-primary ml-auto" @click="nuevoItem">NUEVO</button>
                    </div>

                    <div class="card-body px-0 pt-0 pb-2">
                        <Preloader :visible="cargando" />
                    </div>
                    <div class="table-responsive p-4">
                        <table class="table align-items-center mb-0" ref="itemtabla">
                            <thead>
                                <tr class="align-middle text-center">
                                    <th class="text-secondary opacity-7">ID</th>
                                    <th class="text-secondary opacity-7">Título</th>
                                    <th class="text-secondary opacity-7">Descripción</th>
                                    <th class="text-secondary opacity-7">Orden</th>
                                    <th class="text-secondary opacity-7">Opciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="slider in sliders" :key="slider.id" class="align-middle text-center">
                                    <td>{{ slider.id }}</td>
                                    <td>{{ slider.titulo }}</td>
                                    <td>{{ slider.descripcion }}</td>
                                    <td>{{ slider.orden }}</td>
                                    <td>
                                        <button @click="verSlider(slider)"
                                            class="badge badge-sm bg-gradient-success"><i class="far fa-eye "
                                                aria-hidden="true"></i>
                                        </button>
                                        <button @click="editarSlider(slider)"
                                            class="badge badge-sm bg-gradient-warning">
                                            <i class="far fa-edit " aria-hidden="true"></i>
                                        </button>
                                        <button @click="desactivarSlider(slider.id)"
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
    </div>
</template>

<script>
import SliderService from '../../services/SliderService';
import Preloader from "@/components/Preloader.vue";
import $ from 'jquery';

export default {
    name: "Sliders",
    components: {
        Preloader
    },
    data() {
        return {
            sliders: [],
            cargando: false,
            formErrors: {},
            currentSlider: null,
        };
    },
    created() {
        this.fetchSliders();
    },
    methods: {
        async fetchSliders() {
            try {
                this.cargando = true;
                const response = await SliderService.getSliders();
                this.sliders = response.data.data;
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
                console.error('Error fetching sliders:', error);
                this.$swal({
                    icon: 'error',
                    title: 'Error',
                    text: 'Hubo un error al cargar los sliders.',
                });
            } finally {
                this.cargando = false;
            }
        },
        verSlider(slider) {
            const detalles = `
                <div style="display: flex; flex-wrap: wrap;">
                    <div style="flex: 1; min-width: 50%; text-align: left; padding-right: 10px;">
                        <p><strong>Título:</strong> ${slider.titulo}</p>
                        <p><strong>Descripción:</strong> ${slider.descripcion}</p>
                        <p><strong>Orden:</strong> ${slider.orden}</p>
                        <p><strong>Activo:</strong> ${slider.activo ? 'Sí' : 'No'}</p>
                    </div>
                    <div style="flex: 1; min-width: 50%; text-align: left; padding-left: 10px;">
                        <p><strong>Imagen URL:</strong> <a :href="slider.imagen_url" target="_blank">${slider.imagen_url}</a></p>
                    </div>
                </div>
            `;
            this.$swal({
                icon: 'info',
                title: 'Detalles del Slider',
                html: detalles,
                customClass: {
                    popup: 'swal-wide'
                },
                width: '600px'
            });
        },
        editarSlider(slider) {
            this.currentSlider = { ...slider }; // Guardar una copia del slider actual

            const formHtml = `
                <form id="editarSliderForm">
                    <div style="display: flex; flex-wrap: wrap;">
                        <div style="flex: 1; min-width: 50%; text-align: left; padding-right: 10px;">
                            <label>Título</label><input type="text" name="titulo" value="${slider.titulo}" class="form-control">
                            <div class="text-danger">${this.formErrors.titulo || ''}</div>
                            <label>Descripción</label><textarea name="descripcion" class="form-control">${slider.descripcion}</textarea>
                            <div class="text-danger">${this.formErrors.descripcion || ''}</div>
                            <label>Imagen URL</label><input type="text" name="imagen_url" value="${slider.imagen_url}" class="form-control">
                            <div class="text-danger">${this.formErrors.imagen_url || ''}</div>
                            <label>Orden</label><input type="number" name="orden" value="${slider.orden}" class="form-control">
                            <div class="text-danger">${this.formErrors.orden || ''}</div>
                            <label>Activo</label><input type="checkbox" name="activo" ${slider.activo ? 'checked' : ''}>
                            <div class="text-danger">${this.formErrors.activo || ''}</div>
                        </div>
                    </div>
                </form>
            `;

            this.$swal({
                title: 'Editar Slider',
                html: formHtml,
                focusConfirm: false,
                showCancelButton: true,
                didOpen: () => {
                    this.formErrors = {}; // Limpiar errores anteriores del formulario
                },
                preConfirm: () => {
                    const form = document.getElementById('editarSliderForm');
                    const formData = new FormData(form);
                    return {
                        titulo: formData.get('titulo')?.toString() || '',
                        descripcion: formData.get('descripcion')?.toString() || '',
                        imagen_url: formData.get('imagen_url')?.toString() || '',
                        orden: formData.get('orden')?.toString() || '',
                        activo: formData.get('activo') === 'on'
                    };
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    this.actualizarSlider(slider.id, result.value);
                }
            });
        },
        actualizarSlider(id, data) {
            SliderService.updateSlider(id, data)
                .then(() => {
                    this.$swal({
                        icon: 'success',
                        title: 'Slider Actualizado',
                        text: `El slider con ID ${id} ha sido actualizado.`,
                    });
                    this.fetchSliders(); // Recargar la lista de sliders
                })
                .catch(error => {
                    if (error.response && error.response.data.errors) {
                        this.formErrors = error.response.data.errors;
                        this.$nextTick(() => {
                            this.editarSlider({ ...this.currentSlider, ...data });
                        });
                    } else {
                        console.error('Error actualizando slider:', error);
                        this.$swal({
                            icon: 'error',
                            title: 'Error',
                            text: 'Hubo un error al actualizar el slider.',
                        });
                    }
                });
        },
        async desactivarSlider(id) {
            try {
                await SliderService.desactivarSlider(id);
                this.$swal({
                    icon: 'success',
                    title: 'Slider Desactivado',
                    text: `El slider con ID ${id} ha sido desactivado.`,
                });
                this.fetchSliders(); // Recargar la lista de sliders
            } catch (error) {
                console.error('Error desactivando slider:', error);
                this.$swal({
                    icon: 'error',
                    title: 'Error',
                    text: 'Hubo un error al desactivar el slider.',
                });
            }
        },
        nuevoItem() {
            this.currentSlider = null;
            const formHtml = `
                <form id="nuevoSliderForm">
                    <div style="display: flex; flex-wrap: wrap;">
                        <div style="flex: 1; min-width: 50%; text-align: left; padding-right: 10px;">
                            <label>Título</label><input type="text" name="titulo" class="form-control">
                            <div class="text-danger">${this.formErrors.titulo || ''}</div>
                            <label>Descripción</label><textarea name="descripcion" class="form-control"></textarea>
                            <div class="text-danger">${this.formErrors.descripcion || ''}</div>
                            <label>Imagen URL</label><input type="text" name="imagen_url" class="form-control">
                            <div class="text-danger">${this.formErrors.imagen_url || ''}</div>
                            <label>Orden</label><input type="number" name="orden" class="form-control">
                            <div class="text-danger">${this.formErrors.orden || ''}</div>
                            <label>Activo</label><input type="checkbox" name="activo" checked>
                            <div class="text-danger">${this.formErrors.activo || ''}</div>
                        </div>
                    </div>
                </form>
            `;
            this.$swal({
                title: 'Nuevo Slider',
                html: formHtml,
                focusConfirm: false,
                showCancelButton: true,
                didOpen: () => {
                    this.formErrors = {}; // Limpiar errores anteriores del formulario
                },
                preConfirm: () => {
                    const form = document.getElementById('nuevoSliderForm');
                    const formData = new FormData(form);
                    return {
                        titulo: formData.get('titulo')?.toString() || '',
                        descripcion: formData.get('descripcion')?.toString() || '',
                        imagen_url: formData.get('imagen_url')?.toString() || '',
                        orden: formData.get('orden')?.toString() || '',
                        activo: formData.get('activo') === 'on'
                    };
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    this.registrarSlider(result.value);
                }
            });
        },
        registrarSlider(data) {
            SliderService.createSlider(data)
                .then(() => {
                    this.$swal({
                        icon: 'success',
                        title: 'Slider Registrado',
                        text: `El slider ha sido registrado exitosamente.`,
                    });
                    this.fetchSliders();
                })
                .catch(error => {
                    if (error.response && error.response.data.errors) {
                        this.formErrors = error.response.data.errors;
                        this.$nextTick(() => {
                            this.nuevoItem(); // Reabrir el formulario con los datos ingresados y errores
                        });
                    } else {
                        console.error('Error registrando slider:', error);
                        this.$swal({
                            icon: 'error',
                            title: 'Error',
                            text: 'Hubo un error al registrar el slider.',
                        });
                    }
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
