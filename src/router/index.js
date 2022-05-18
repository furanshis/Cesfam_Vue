import { createRouter, createWebHistory } from 'vue-router'
import store from '../store'

import HomeView from '../views/HomeView.vue'
import Remedios from  '../views/Remedios.vue'
import Detalle_remedio from '../views/Detalle_remedio.vue'
import Categoria from '../views/Categoria.vue'
import Search from '../views/Search.vue'
import Carrito from '../views/Carrito.vue'
import Registro from '../views/Registro.vue'
import IniciarSesion from '../views/IniciarSesion.vue'
import Cuenta from '../views/Cuenta.vue'
import Pago from '../views/Pago.vue'
import PagoFinalizado from '../views/PagoFinalizado.vue'
import nosotros from '../views/nosotros.vue' 
import contacto from '../views/contacto.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/Search',
    name: 'Search',
    component: Search
  },
  {
    path: '/carrito/pago',
    name: 'Pago',
    component: Pago,
    meta: {
      requireLogin: true
    }
  },
  {
    path: '/carrito/pago_finalizado',
    name: 'PagoFinalizado',
    component: PagoFinalizado
  },
  {
    path: '/carrito',
    name: 'Carrito',
    component: Carrito
  },
  {
    path: '/remedios',
    name: 'Remedios',
    component: Remedios
  },
  {
    path: '/:categoria_slug/:remedio_slug/',
    name: 'Detalle_remedio',
    component: Detalle_remedio
  },
  {
    path: '/:categoria_slug/',
    name: 'Categoria',
    component: Categoria
  },
  {
    path: '/registro',
    name: 'Registro',
    component: Registro
  },
  {
    path: '/iniciar-sesion',
    name: 'IniciarSesion',
    component: IniciarSesion
  },
  {
    path: '/cuenta',
    name: 'Cuenta',
    component: Cuenta,
    meta: {
      requireLogin: true
    }
  },
  {
    path: '/nosotros',
    name: 'nosotros',
    component: nosotros
  },
  {
    path: '/contacto',
    name: 'contacto',
    component: contacto
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requireLogin) && !store.state.isAuthenticated) { ///Esta función es para ver si es requerido logearse y además no se tiene una autenticacion enviara a la pagina de login
    next ({name: 'IniciarSesion', query: {to: to.path} });
  } else {
    next()
  }
})

export default router
