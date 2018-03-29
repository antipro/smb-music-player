import Vue from 'vue'
import Router from 'vue-router'
import Player from '@/modules/Player'
import Library from '@/modules/Library'
import Setting from '@/modules/Setting'
import About from '@/modules/About'
import Auth from '@/modules/Auth'
import Directory from '@/modules/Directory'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'player',
      component: Player
    },
    {
      path: '/library',
      name: 'library',
      component: Library
    },
    {
      path: '/auth',
      name: 'auth',
      component: Auth
    },
    {
      path: '/directory',
      name: 'directory',
      component: Directory
    },
    {
      path: '/about',
      name: 'about',
      component: About
    },
    {
      path: '/setting',
      name: 'setting',
      component: Setting
    }
  ]
})
