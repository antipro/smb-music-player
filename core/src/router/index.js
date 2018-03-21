import Vue from 'vue'
import Router from 'vue-router'
import Player from '@/modules/Player'
import Library from '@/modules/Library'
import About from '@/modules/About'

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
      path: '/about',
      name: 'about',
      component: About
    }
  ]
})
