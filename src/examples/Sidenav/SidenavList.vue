<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

import SidenavItem from "./SidenavItem.vue";

const store = useStore();
const isRTL = computed(() => store.state.isRTL);

const getRoute = () => {
  const route = useRoute();
  const routeArr = route.path.split("/");
  return routeArr[1];
};
</script>
<template>
  <div
    class="collapse navbar-collapse w-auto h-auto h-100"
    id="sidenav-collapse-main"
  >
    <ul class="navbar-nav">
      <li class="nav-item">
        <sidenav-item
          to="/dashboard"
          :class="getRoute() === 'dashboard-default' ? 'active' : ''"
          :navText="isRTL ? 'لوحة القيادة' : 'Dashboard'"
        >
          <template v-slot:icon>
            <i class="fas fa-tachometer-alt text-primary text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>
      <li class="nav-item">
        <sidenav-item
          to="/usuarios"
          :class="getRoute() === 'usuarios' ? 'active' : ''"
          :navText="isRTL ? 'لوحة القيادة' : 'Usuarios'"
        >
          <template v-slot:icon>
            <i class="fas fa-users text-primary text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>
      <li class="nav-item">
        <sidenav-item
          to="/premios"
          :class="getRoute() === 'premios' ? 'active' : ''"
          :navText="isRTL ? 'لوحة القيادة' : 'Premios'"
        >
          <template v-slot:icon>
            <i class="fas fa-trophy text-primary text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>
      <li class="nav-item">
        <sidenav-item
          to="/ganadores"
          :class="getRoute() === 'ganadores' ? 'active' : ''"
          :navText="isRTL ? 'لوحة القيادة' : 'Ganadores'"
        >
          <template v-slot:icon>
            <i class="fas fa-medal text-primary text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>
   
      <li class="nav-item">
        <sidenav-item
          to="/sorteos"
          :class="getRoute() === 'sorteos' ? 'active' : ''"
          :navText="isRTL ? 'لوحة القيادة' : 'Sorteos'"
        >
          <template v-slot:icon>
            <i class="fas fa-random text-primary text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>
      <li class="nav-item">
        <sidenav-item
          to="/suscripciones"
          :class="getRoute() === 'suscripciones' ? 'active' : ''"
          :navText="isRTL ? 'لوحة القيادة' : 'Suscripciones'"
        >
          <template v-slot:icon>
            <i class="fas fa-envelope-open-text text-primary text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>
      <li class="nav-item">
        <sidenav-item
          to="/sliders"
          :class="getRoute() === 'sliders' ? 'active' : ''"
          :navText="isRTL ? 'لوحة القيادة' : 'Sliders'"
        >
          <template v-slot:icon>
            <i class="fas fa-images text-primary text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>
      <li class="nav-item">
        <sidenav-item
          to="/administradores"
          :class="getRoute() === 'administradores' ? 'active' : ''"
          :navText="isRTL ? 'لوحة القيادة' : 'Administrador'"
        >
          <template v-slot:icon>
            <i class="fas fa-images text-primary text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>
    </ul>
  </div>

  <div class="pt-3 mx-3 mt-3 sidenav-footer">
   
  </div>
</template>
