import Vue from 'vue'
import Router from 'vue-router'
import admin from '@/components/admin'
import Message from '@/components/Message'
import MessageHistory from '@/components/MessageHistory'
import InformationManagement from '@/components/InformationManagement'
import Login from '@/components/Login'
import RecycleBin from '@/components/RecycleBin'
import AllUsersInfo from '@/components/AllUsersInfo'
import AddUser from '@/components/AddUser'
import MyInfo from '@/components/MyInfo'
import user from '@/components/user'
import SearchInfo from '@/components/SearchInfo'
import UserInfo from '@/components/UserInfo'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/Login',
      name: 'Login',
      component: Login
    },
    {
      path: '/user',
      name: 'user',
      component: user,
      meta: {
        login_required: false
      },
      children: [
        {
          path: 'SearchInfo',
          name: 'SearchInfo',
          component: SearchInfo,
          meta: {
            login_required: false
          }
        },
        {
          path: 'UserInfo',
          name: 'UserInfo',
          component: UserInfo,
          meta: {
            login_required: false
          }
        }
      ]
    },
    {
      path: '/admin',
      name: 'admin',
      component: admin,
      meta: {
        login_required: false
      },
      children: [
        {
          path: 'Message',
          name: 'Message',
          component: Message,
          meta: {
            login_required: false
          }
        },
        {
          path: 'MessageHistory',
          name: 'MessageHistory',
          component: MessageHistory,
          meta: {
            login_required: false
          }
        },
        {
          path: 'InformationManagement',
          name: 'InformationManagement',
          component: InformationManagement,

          meta: {
            login_required: false
          }
        },
        {
          path: 'RecycleBin',
          name: 'RecycleBin',
          component: RecycleBin,
          meta: {
            login_required: false
          }
        },
        {
          path: 'AllUsersInfo',
          name: 'AllUsersInfo',
          component: AllUsersInfo,
          mata: {
            login_required: false
          }
        },
        {
          path: 'AddUser',
          name: 'AddUser',
          component: AddUser,
          mata: {
            login_required: false
          }
        },
        {
          path: 'MyInfo',
          name: 'MyInfo',
          component: MyInfo,
          meta: {
            login_required: false
          }
        }
      ]
    }
  ],
  mode: 'history'
})
router.beforeEach((to, from, next) => {
  if (to.meta.login_required) {
    next()
  } else {
    if (to.path === '/Login') {
      next()
    } else {
      let token = localStorage.getItem('Authorization')
      if (token === null || token === undefined) {
        next('/Login')
      } else {
        next()
      }
    }
  }
})
export default router
