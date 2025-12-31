/**
 * Vue Router 路由配置
 */

import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/stores/user'
import MainLayout from '@/layouts/MainLayout.vue'

// 路由配置
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: {
      title: '登录',
      requiresAuth: false
    }
  },
  {
    path: '/',
    component: MainLayout,
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import('@/views/home/Home.vue'),
        meta: {
          title: '首页',
          requiresAuth: true
        }
      },
      {
        path: 'home/equipment-list',
        name: 'HomeEquipmentList',
        component: () => import('@/views/home/EquipmentList.vue'),
        meta: {
          title: '设备列表',
          requiresAuth: true
        }
      },
      {
        path: 'home/equipment-detail/:id',
        name: 'HomeEquipmentDetail',
        component: () => import('@/views/home/EquipmentDetail.vue'),
        meta: {
          title: '设备详情',
          requiresAuth: true
        }
      },
      {
        path: 'about',
        name: 'About',
        component: () => import('@/views/About.vue'),
        meta: {
          title: '关于',
          requiresAuth: true
        }
      },
      {
        path: 'system/user',
        name: 'SystemUser',
        component: () => import('@/views/system/User.vue'),
        meta: {
          title: '用户管理',
          requiresAuth: true
        }
      },
      {
        path: 'system/role',
        name: 'SystemRole',
        component: () => import('@/views/system/Role.vue'),
        meta: {
          title: '角色管理',
          requiresAuth: true
        }
      },
      {
        path: 'system/menu',
        name: 'SystemMenu',
        component: () => import('@/views/system/Menu.vue'),
        meta: {
          title: '菜单管理',
          requiresAuth: true
        }
      },
      // 预警管理
      {
        path: 'budget/setting',
        name: 'BudgetSetting',
        component: () => import('@/views/budget/BudgetSetting.vue'),
        meta: {
          title: '预警设置',
          requiresAuth: true
        }
      },
      {
        path: 'budget/record',
        name: 'BudgetRecord',
        component: () => import('@/views/budget/BudgetRecord.vue'),
        meta: {
          title: '预警记录',
          requiresAuth: true
        }
      },
      // 实验管理
      {
        path: 'experiment/info',
        name: 'ExperimentInfo',
        component: () => import('@/views/About.vue'),
        meta: {
          title: '实验信息',
          requiresAuth: true
        }
      },
      {
        path: 'experiment/sample',
        name: 'ExperimentSample',
        component: () => import('@/views/experiment/ExperimentSample.vue'),
        meta: {
          title: '实验样品',
          requiresAuth: true
        }
      },
      {
        path: 'experiment/sample/detail/:id',
        name: 'SampleDetail',
        component: () => import('@/views/experiment/SampleDetail.vue'),
        meta: {
          title: '样品详情',
          requiresAuth: true
        }
      },
      {
        path: 'experiment/plan',
        name: 'ExperimentPlan',
        component: () => import('@/views/experiment/ExperimentPlan.vue'),
        meta: {
          title: '实验方案',
          requiresAuth: true
        }
      },
      {
        path: 'experiment/plan/edit/:id',
        name: 'GraphEditor',
        component: () => import('@/views/experiment/GraphEditor/GraphEditor.vue'),
        meta: {
          title: '方案编辑',
          requiresAuth: true
        }
      },
      // 设备管理
      {
        path: 'equipment/management',
        name: 'EquipmentManagement',
        component: () => import('@/views/equipment/EquipmentManagement.vue'),
        meta: {
          title: '实验设备',
          requiresAuth: true
        }
      },
      {
        path: 'equipment/detail/:id',
        name: 'EquipmentDetailManagement',
        component: () => import('@/views/equipment/EquipmentDetailManagement.vue'),
        meta: {
          title: '设备详情',
          requiresAuth: true
        }
      },
      {
        path: 'equipment/maintenance',
        name: 'EquipmentMaintenance',
        component: () => import('@/views/equipment/MaintenanceRecord.vue'),
        meta: {
          title: '保养记录',
          requiresAuth: true
        }
      },
      {
        path: 'equipment/detection',
        name: 'EquipmentDetection',
        component: () => import('@/views/About.vue'),
        meta: {
          title: '检测记录',
          requiresAuth: true
        }
      },
      {
        path: 'equipment/robot',
        name: 'EquipmentRobot',
        component: () => import('@/views/About.vue'),
        meta: {
          title: '智能机器人',
          requiresAuth: true
        }
      },
      {
        path: 'equipment/door',
        name: 'EquipmentDoor',
        component: () => import('@/views/About.vue'),
        meta: {
          title: '智能门禁',
          requiresAuth: true
        }
      },
      // 其他设置
      {
        path: 'other/system',
        name: 'OtherSystem',
        component: () => import('@/views/About.vue'),
        meta: {
          title: '系统设置',
          requiresAuth: true
        }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
    meta: {
      title: '404'
    }
  }
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

// 全局前置守卫
router.beforeEach((to, _from, next) => {
  const userStore = useUserStore()

  // 设置页面标题
  if (to.meta.title) {
    document.title = `${to.meta.title} - Vue3 Admin`
  }

  // 判断是否需要登录
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    // 需要登录但未登录，跳转到登录页
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  } else if (to.path === '/login' && userStore.isLoggedIn) {
    // 已登录用户访问登录页，跳转到首页
    next({ path: '/home' })
  } else {
    next()
  }
})

// 全局后置钩子
router.afterEach(() => {
  // 可以在这里添加页面加载完成后的逻辑
})

export default router
