# vue_routerbeforeeach_axios

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


## 1.配置路由
 ```
  路由配置中添加，如下配置：

  meta:{
    requiresAuth:true,

    title:"Vip"

  }

requiresAuth表示是否需要访问权限，值为true，需要访问权限，值为false,不需要访问权限。title为标题。
```

<img src="https://img-blog.csdnimg.cn/a79d22743b974c32bddf809082a1d5b6.png"/>

```
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
```

##  2.权限控制

```
按目录src/routerbeforeeach/index.js 新建文件夹或文件
```
<img src="https://img-blog.csdnimg.cn/dbb5024e50664de79a46959f1db16b8f.png"/>

```
import router from '@/router'
import sha1 from 'js-sha1'
/* *******************导航守卫******************* */
let queryURLParams = (URL) => {
  let obj = {}; // 声明参数对象
  if (URL.includes("?")) {
    // const url = location.search; // 项目中可直接通过search方法获取url中"?"符后的字串
    let url = URL.split("?")[1];
    let arr = url.split("&"); // 以&符号分割为数组
    for (let i = 0; i < arr.length; i++) {
      let arrNew = arr[i].split("="); // 以"="分割为数组
      obj[arrNew[0]] = decodeURIComponent(arrNew[1]);
    }
  } else {
    obj = {
      VODACC: "",
      STAMP: null,
      SSOKEY: null,
    }
  }
  return obj;
}
let URL = window.location.href //"http://192.168.1.183:8080/#/vip?SSOKEY=ad1b8114fc8702169244e1c9e60358e618f29aef&STAMP=31558673374&VODACC=vz"// 
console.log(queryURLParams(URL))
let queryURLParamsObj = queryURLParams(URL)
/*取 VODACC 1、用户名*/
let VODACC = queryURLParamsObj.VODACC
/*取 STAMP ,登录时间戳（精确到秒）,时间戳验证，时间戳超过5分钟则判定过期,限制登录*/
let STAMP = queryURLParamsObj.STAMP//Date.parse(new Date()) - 60//;
/*取 SSOKEY SHA1(链接秘钥+loginid+stamp)的值等于token，即视为合法*/
let SSOKEY = queryURLParamsObj.SSOKEY;
let TokenState = sha1("VOD$&!" + VODACC + STAMP)
let timestamp = Date.parse(new Date()) / 1000
let DelayState = (timestamp - Number(STAMP)) > (5 * 60) ? false : true
console.log("TokenState:", TokenState)
console.log("DelayState:", timestamp, STAMP, (timestamp - Number(STAMP)), DelayState)
console.log("VODACC && STAMP && SSOKEY && timestamp - STAMP < 5 * 60:", !!VODACC && !!STAMP && !!SSOKEY && DelayState)
 
router.beforeEach((to, from, next) => {
  if (!to.meta.requiresAuth) {
    next()
  } else {
    if (VODACC && STAMP && SSOKEY && DelayState) {//&& timestamp - STAMP < 5 * 60
      if (SSOKEY == TokenState) {
        if (to.path !== '/vip') {
          next({ path: '/vip' })
        } else {
          next()
        }
      } else {
 
        // 如果没有权限，则跳转到 404 页面
        if (to.path === '/404') {
          next()
        } else {
          next({ path: '/404' })
 
 
        }
      }
 
    } else {
      // 如果没有权限，则跳转到 404 页面
      if (to.path === '/404') {
        next()
      } else {
        next({ path: '/404' })
 
 
      }
    }
  }
 
 
 
})
 
/* *******************导航守卫******************* */
 
router.afterEach((to) => {
  // 根据路由 meta 设置标题
  if (to.meta && to.meta.title) {
    document.title = to.meta.title
  } else {
    document.title = '默认标题'
  }
})
 
// 错误处理
router.onError((error) => {
 
  const pattern = /Loading chunk (\d)+ failed/g;
 
  const isChunkLoadFailed = error.message.match(pattern);
 
  const targetPath = router.history.pending.fullPath;
 
  if (isChunkLoadFailed) {
 
    router.replace(targetPath);
 
  }
 
})
 
```

*** 或者 ***

```
import router from '@/router'
import sha1 from 'js-sha1'
/* *******************导航守卫******************* */
let queryURLParams = (URL) => {
  let obj = {}; // 声明参数对象
  if (URL.includes("?")) {
    // const url = location.search; // 项目中可直接通过search方法获取url中"?"符后的字串
    let url = URL.split("?")[1];
    let arr = url.split("&"); // 以&符号分割为数组
    for (let i = 0; i < arr.length; i++) {
      let arrNew = arr[i].split("="); // 以"="分割为数组
      obj[arrNew[0]] = decodeURIComponent(arrNew[1]);
    }
  } else {
    obj = {
      VODACC: "",
      STAMP: null,
      SSOKEY: null,
    }
  }
  return obj;
}
let URL = window.location.href //"http://192.168.1.180:8082/#/home?SSOKEY=4455559c84204a184e08c96b1aafb4227&STAMP=4075505785&VODACC=vz"// 
console.log(queryURLParams(URL))
let queryURLParamsObj = queryURLParams(URL)
/*取 VODACC 1、用户名*/
let VODACC = queryURLParamsObj.VODACC
/*取 STAMP ,登录时间戳（精确到秒）,时间戳验证，时间戳超过5分钟则判定过期,限制登录*/
let STAMP = queryURLParamsObj.STAMP//Date.parse(new Date()) - 60//;
/*取 SSOKEY SHA1(链接秘钥+loginid+stamp)的值等于token，即视为合法*/
let SSOKEY = queryURLParamsObj.SSOKEY;
let TokenState = sha1("VOD$&!" + VODACC + STAMP)
let timestamp = Date.parse(new Date()) / 1000
let DelayState = (timestamp - Number(STAMP)) > (5 * 60) ? false : true
console.log("DelayState:", timestamp, STAMP, (timestamp - Number(STAMP)), DelayState)
console.log("VODACC && STAMP && SSOKEY && timestamp - STAMP < 5 * 60:", !!VODACC && !!STAMP && !!SSOKEY && DelayState)
 
router.beforeEach((to, from, next) => {
  if (to.path === '/about') {
    next()
  } else {
    if (VODACC && STAMP && SSOKEY && DelayState) {//&& timestamp - STAMP < 5 * 60
      if (SSOKEY == TokenState) {
        if (to.path !== '/home') {
          next({ path: '/home' })
        } else {
          next()
        }
      } else {
 
        // 如果没有权限，则跳转到 404 页面
        if (to.path === '/404') {
          next()
        } else {
          next({ path: '/404' })
 
 
        }
      }
 
    } else {
      // 如果没有权限，则跳转到 404 页面
      if (to.path === '/404') {
        next()
      } else {
        next({ path: '/404' })
 
 
      }
    }
  }
 
 
 
})
 
/* *******************导航守卫******************* */
 
router.afterEach((to) => {
  // 根据路由 meta 设置标题
  if (to.meta && to.meta.title) {
    document.title = to.meta.title
  } else {
    document.title = '默认标题'
  }
})
 
// 错误处理
router.onError((error) => {
 
  const pattern = /Loading chunk (\d)+ failed/g;
 
  const isChunkLoadFailed = error.message.match(pattern);
 
  const targetPath = router.history.pending.fullPath;
 
  if (isChunkLoadFailed) {
 
    router.replace(targetPath);
 
  }
 
})
 
```

## 3.在main.js里引入

<img src="https://img-blog.csdnimg.cn/6a2fd861162c4849924699e2b30b1319.png"/>

```
import './routerbeforeeach/index'
```

*** main.js ***

```
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './routerbeforeeach/index'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);
import moment from "moment";
Vue.prototype.$moment = moment;
 
 
 
Vue.config.productionTip = false
 
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
```

## 4.时间戳获取

```
时间戳获取:https://www.beijing-time.org/shijianchuo/
```

<img src="https://img-blog.csdnimg.cn/0778e9616bf348ccb0b0728dcd5744ac.png"/>

## 5.效果图

<img src="https://img-blog.csdnimg.cn/41be0f2eeeb44e69bccae33f363f6cbc.png"/>
<img src="https://img-blog.csdnimg.cn/72ce8b45c1d945be9d87ec7ca9341b94.png"/>
<img src="https://img-blog.csdnimg.cn/cdd8886031e04ab99e13391e6dae6a92.png"/>
