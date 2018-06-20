//  所有通用的js功能




//五 每个页面一加载，就需要发送一个ajax请求，判断当前用户是否登录
//如果当前用户没有登录，需要跳转登录页面
//如果是login页面，是不需要判断有没有登录  
//indexOf("login.html") == -1 不存在不在的意思 不在login页面的话 才发送请求 判断用户是否登录
if (location.href.indexOf("login.html") == -1) {
  $.ajax({
    type: 'get',
    url: '/employee/checkRootLogin',
    success: function (info) {
      // 失败了
      if (info.error) {
        location.href = "login.html";
      }
    }
  });
}


//一开启进度条
//ajaxStartajax 发送之前要开始的时候触发
$(document).ajaxStart(function () {
  // console.log("开始啦......");
  //开启进度条
  NProgress.start();
});

//ajax发送成功结束事件
$(document).ajaxStop(function () {
  setTimeout(function () {
    //关闭进度条    接口跑的太快 所以延时5秒
    NProgress.done();
  }, 500);
});


//二级分类的显示与隐藏
//1. 点击分类管理
//2. 让分类管理下二级菜单显示或者隐藏
$(".child").prev().on("click", function () {
  $(this).next().slideToggle();
});

/* 
  点击切换按钮，显示隐藏侧边栏
  1. 找到切换按钮
  2. 切换
*/
$(".icon_menu").on("click", function () {
  $(".lt_aslide").toggleClass("now");
  $(".lt_main").toggleClass("now");
});


/* 
  三退出功能
    1. 点击退出按钮 
    2. 显示退出的模态框
    3. 点击退出模态框中确认按钮，退出即可。需要发送ajax请求，告诉服务端，需要退出
*/
$('.icon_logout').on('click', function () {
  $('#logoutModal').modal('show');
  // 为什么每次每个页面需要发送ajax请求 判断用户是否登录
  // 浏览器不知道 因为只有服务器知道到底用户有没有登录 (但服务器即便知道用户没有登录,但也没办法跳到登录页面,因为login.html的地址 服务器不知道 ,因为可以随便改)  所以跳转工作交给浏览器,浏览器不知道登没登录,所以需要发送ajax请求
  //前端访问某一页面的时候.需要先发送请求告诉问后后端有没有登录,
  //结果是 登或不登  如果没登跳到登录页  如果登了 后边操作//继续
})

$('.btn_logout').on('click', function () {
  $.ajax({
    type: 'get',
    url: '/employee/employeeLogout',
    success: function (info) {
      console.log(info);
      if (info.success === true) {
        location.href = 'login.html';
      }

    }

  })


})
