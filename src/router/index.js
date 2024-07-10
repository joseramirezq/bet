import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "../views/Dashboard.vue";
import Tables from "../views/Tables.vue";
import Billing from "../views/Billing.vue";
import VirtualReality from "../views/VirtualReality.vue";
import RTL from "../views/Rtl.vue";
import Profile from "../views/Profile.vue";
import Signup from "../views/Signup.vue";
import Signin from "../views/Signin.vue";


import Inicio from "../views/web/Inicio.vue";


import UsuariosList from '@/views/dashboard/UsuariosList.vue';
import Premios from '@/views/dashboard/Premios.vue';
import Ganadores from '@/views/dashboard/Ganadores.vue';
import Pagos from '@/views/dashboard/Pagos.vue';
import Sliders from '@/views/dashboard/Sliders.vue';
import Sorteos from '@/views/dashboard/Sorteos.vue';
import Suscripciones from '@/views/dashboard/Suscripciones.vue';
import Administradores from '@/views/dashboard/Administradores.vue';

const routes = [
  {
    path: "/",
    name: "Inicio",
    component: Inicio,
  },
  /*{
    path: "/",
    name: "/",
    redirect: "/dashboard-default",
  },*/
  {
    path: '/usuarios',
    name: 'Usuarios',
    component: UsuariosList,
    meta: { requiresAuth: true }
  },
  {
    path: '/premios',
    name: 'Premios',
    component: Premios,
    meta: { requiresAuth: true }
  },
  {
    path: '/ganadores',
    name: 'Ganadores',
    component: Ganadores,
    meta: { requiresAuth: true }
  },
  {
    path: '/pagos',
    name: 'Pagos',
    component: Pagos,
    meta: { requiresAuth: true }
  },
  {
    path: '/sliders',
    name: 'Sliders',
    component: Sliders,
    meta: { requiresAuth: true }
  },
  {
    path: '/sorteos',
    name: 'Sorteos',
    component: Sorteos,
    meta: { requiresAuth: true }
  },
  {
    path: '/suscripciones',
    name: 'Suscripciones',
    component: Suscripciones,
    meta: { requiresAuth: true }
  },
  {
    path: '/administradores',
    name: 'Administradores',
    component: Administradores,
    meta: { requiresAuth: true }
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: "/tables",
    name: "Tables",
    component: Tables,
    meta: { requiresAuth: true }
  },
  {
    path: "/billing",
    name: "Billing",
    component: Billing,
  },
  {
    path: "/virtual-reality",
    name: "Virtual Reality",
    component: VirtualReality,
  },
  {
    path: "/rtl-page",
    name: "RTL",
    component: RTL,
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
  },
  {
    path: "/signin",
    name: "Signin",
    component: Signin,
  },
  {
    path: "/signup",
    name: "Signup",
    component: Signup,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkActiveClass: "active",
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // Aquí verifica si el usuario está autenticado
    const isAuthenticated = !!localStorage.getItem('authToken'); // Ajusta esto según tu lógica de autenticación
    if (!isAuthenticated) {
      next({ name: 'Signin' });
    } else {
      next();
    }
  } else {
    next();
  }
});
export default router;
