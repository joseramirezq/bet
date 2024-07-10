<script setup>
import { ref, onBeforeUnmount, onBeforeMount } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import AuthService from "@/services/AuthService";
import ArgonInput from "@/components/ArgonInput.vue";
import ArgonButton from "@/components/ArgonButton.vue";

const email = ref('');
const password = ref('');
const rememberMe = ref(false);
const store = useStore();
const router = useRouter();
const body = document.getElementsByTagName("body")[0];

const login = async () => {
  try {
    const response = await AuthService.login({
      email: email.value,
      password: password.value,
      remember: rememberMe.value,
    });
    localStorage.setItem('authToken', response.data.token);
    router.push({ name: 'Dashboard' });
  } catch (error) {
    alert('Error al iniciar sesión: ' + (error.response?.data?.message || error.message));
  }
};

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
  <div class="container top-0 position-sticky z-index-sticky">
    <div class="row">
      <div class="col-12">
        <navbar
          isBlur="blur border-radius-lg my-3 py-2 start-0 end-0 mx-4 shadow"
          v-bind:darkMode="true"
          isBtn="bg-gradient-success"
        />
      </div>
    </div>
  </div>
  <main class="mt-0 main-content">
    <section>
      <div class="page-header min-vh-100">
        <div class="container">
          <div class="row">
            <div class="mx-auto col-xl-4 col-lg-5 col-md-7 d-flex flex-column mx-lg-0">
              <div class="card card-plain">
                <div class="pb-0 card-header text-start">
                  <h4 class="font-weight-bolder">Inicio de Sesión</h4>
                  <p class="mb-0">Ingrese Email y Contraseña</p>
                </div>
                <div class="card-body">
                  <form @submit.prevent="login">
                    <div class="mb-3">
                      <argon-input
                        id="email"
                        type="email"
                        placeholder="Email"
                        name="email"
                        size="lg"
                        v-model="email"
                      />
                    </div>
                    <div class="mb-3">
                      <argon-input
                        id="password"
                        type="password"
                        placeholder="Contraseña"
                        name="password"
                        size="lg"
                        v-model="password"
                      />
                    </div>
                    <div class="text-center">
                      <argon-button
                        class="mt-4"
                        variant="gradient"
                        color="success"
                        fullWidth
                        size="lg"
                        type="submit"
                      >
                        Iniciar Sesión
                      </argon-button>
                    </div>
                  </form>
                </div>
                <div class="px-1 pt-0 text-center card-footer px-lg-2">
                  <p class="mx-auto mb-4 text-sm">
                    <a
                      href="javascript:;"
                      class="text-success text-gradient font-weight-bold"
                      >Olvidé mi contraseña</a
                    >
                  </p>
                </div>
              </div>
            </div>
            <div class="top-0 my-auto text-center col-6 d-lg-flex d-none h-100 pe-0 position-absolute end-0 justify-content-center flex-column">
              <div
                class="position-relative bg-gradient-primary h-100 m-3 px-7 border-radius-lg d-flex flex-column justify-content-center overflow-hidden"
                style="background-size: cover;"
              >
                <span class="mask bg-gradient-success opacity-6"></span>
                <h4 class="mt-5 text-white font-weight-bolder position-relative">
                  <img src="@/assets/img/logos/logo-betgol.webp" alt="Logo">
                </h4>
                <p class="text-white position-relative">
                  Sistema de Administración de Sorteos
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
