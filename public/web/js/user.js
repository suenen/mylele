// 发送ajax请求获取用户信息
$(function () {
  $.ajax({
    type: 'get',
    url: '/user/queryUserMessage',
    success: function (info) {
      // console.log(info);
      if (info.error) {
        // 如果没有登录,就跳转到login页面
        location.href = 'login.html';
      }
      // 成功了就显示数据
      $('.userinfo').html(template('tpl', info))
    }
  });
  // 点击退出按钮的时候
  //发送ajax请求，如果成功，跳转到登录页
  $(".btn_logout").on("click", function () {
    $.ajax({
      type: "get",
      url: "/user/logout",
      success: function (info) {
        //console.log(info);
        if (info.success) {
          location.href = "login.html";
        }
      }
    })
  });


})