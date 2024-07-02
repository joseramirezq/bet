<script setup>
import { onBeforeUnmount, onBeforeMount } from "vue";
import { useStore } from "vuex";

const body = document.getElementsByTagName("body")[0];

const store = useStore();
onBeforeMount(() => {
  store.state.hideConfigButton = true;
  store.state.showNavbar = false;
  store.state.showSidenav = false;
  store.state.showFooter = false;
  body.classList.remove("bg-gray-100");
});
onBeforeUnmount(() => {
  store.state.hideConfigButton = false;
  store.state.showNavbar = true;
  store.state.showSidenav = true;
  store.state.showFooter = true;
  body.classList.add("bg-gray-100");
});
</script>

<template>
  <div style="background-color:#070C2E ;">
    <AppMenu />
    <!--CARRUSEL-->
    <div class="justify-content-center">
      <div class="col-12">
        <div id="carouselExample" class="carousel slide" data-bs-ride="carousel">
            <!-- Indicators -->
          <div class="carousel-indicators">
            <button type="button" data-bs-target="#carouselExample" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
            <button type="button" data-bs-target="#carouselExample" data-bs-slide-to="1" aria-label="Slide 2"></button>
            <button type="button" data-bs-target="#carouselExample" data-bs-slide-to="2" aria-label="Slide 3"></button>
          </div>
          <div class="carousel-inner">
            <!-- Slide 1 -->
            <div class="carousel-item active">
              <div class="container-fluid slider-content d-flex align-items-center">
                <div class="container">
                  <div class="row bgslider">
                    <div class="col-md-6 text-content d-flex justify-content-center align-items-center">
                      <h1 class="text-center">¡Suscríbete y Gana un Samsung Galaxy A55!</h1>
                    </div>
                    <div class="col-md-6 image-content">
                      <img src="https://via.placeholder.com/600x400" class="d-block w-100" alt="Slide 1">
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- Slide 2 -->
            <div class="carousel-item">
              <div class="container-fluid slider-content d-flex align-items-center">
                <div class="container bac">
                  <div class="row bgslider">
                    <div class="col-md-6 text-content d-flex justify-content-center align-items-center">
                      <h1>Slide 2</h1>
                      <p>Texto para el segundo slide</p>
                    </div>
                    <div class="col-md-6 image-content">
                      <img src="https://via.placeholder.com/600x400" class="d-block w-100" alt="Slide 2">
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- Slide 3 -->
            <div class="carousel-item">
              <div class="container-fluid slider-content d-flex align-items-center">
                <div class="container bac">
                  <div class="row bgslider">
                    <div class="col-md-6 text-content d-flex justify-content-center align-items-center">
                      <h1>Slide 3</h1>
                      <p>Texto para el tercer slide</p>
                    </div>
                    <div class="col-md-6 image-content">
                      <img src="https://via.placeholder.com/600x400" class="d-block w-100" alt="Slide 3">
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>          
        </div>
      </div>
    </div>
    <!--PROMOCION-->
    <div class="container">
        <div class="row">
            <div class="col-3 text-center">
                <p class="" style="color:#0FBC57; font-size:2em;font-w">24 Junio</p>
                <p style="">Televisor</p>
                <img src="" alt="" srcset="">
                <p style="">TV Sansung 65”</p>
                <button style="">Suscribirse</button>
            </div>
            <div class="col-3">asd</div>
            <div class="col-6">asd</div>
        </div>
       
    </div>
  </div>
</template>

<script>
import AppMenu from '../components/AppMenu.vue';
export default {
  components: {
    AppMenu
  },
}
</script>

<style scoped>
body {
  overflow-x: hidden; /* Evitar el desplazamiento horizontal */
  background-color: #0E133B;
}

.slider-content {
  background-color: #0E133B; /* Color de fondo */
  height: 450px; /* Altura del slider */
  display: flex;
  align-items: center;
}

.image-content img {
  object-fit: cover; /* Asegurar que la imagen cubra su contenedor */
  height: 100%; /* Asegurar que la imagen ocupe todo el espacio vertical */
}

.bgslider {
  border-radius: 20px;
  background: linear-gradient(90deg, #07E536, #EFD16F);
}

.container-fluid {
  padding: 0;
}


</style>
