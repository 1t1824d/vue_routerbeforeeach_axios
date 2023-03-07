/**
 * Модуль роутера приложения
 */

import Vue from 'vue';
import VueRouter from 'vue-router';
import initListners from './initListners';
import listners from './listners';

Vue.use(VueRouter)

const routes = [{
  path: '/vip',
  name: 'vip',
  component: () => import('../views/VipView.vue'),
  meta:{
    requiresAuth:true,
    title:"Vip"
  }
},
{
  path: '/home',
  name: 'home',
  component: () => import('../views/HomeView.vue'),
  meta:{
    requiresAuth:false,
    title:"Home"
  }
},
{
  path: '/about',
  name: 'about',
  component: () => import('../views/AboutView.vue'),
  meta:{
    requiresAuth:false,
    title:"About"
  }
  
},{
  path: '/404',
  name: '404',
  component: () => import('../views/ErrorView.vue'),
  meta:{
    requiresAuth:false,
    title:"404"
  }
}];

const router = new VueRouter({
 // mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default initListners(router, listners);
