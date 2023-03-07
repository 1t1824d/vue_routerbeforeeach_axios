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

