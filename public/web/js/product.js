//1. 获取地址栏中的productId的值
//2. 发送ajax请求，获取商品的数据
//3. 结合模版渲染
$(function () {
  var productId = getSearch().productId;
  // console.log(productId);
  $.ajax({
    type: 'get',
    url: '/product/queryProductDetail',
    data: {
      id: productId,
    },
    success: function (info) {
      // console.log(info);
      $('.lt_center').html(template('tpl', info))
      //  因为muijs动态生成需要重新初始化 .初始化轮播图
      mui(".mui-slider").slider({
        interval: 3000
      });
      //初始化mui的区域滚动
      mui('.mui-scroll-wrapper').scroll({
        indicators: false, //不显示滚动条
      });
      // 支持尺码选择功能
      $('.size span').on('click', function () {
        $(this).addClass('now').siblings().removeClass("now");

      })
      //初始化numbox 因为是动态添加
      mui(".mui-numbox").numbox()
    }
  });

  //加入购物车的功能
  //1. 给加入购物车按钮注册点击事件
  //2. 获取产品id，数量，尺码，发送ajax请求
  $('.join_cart').on('click', function () {
    // console.log(123);
    // 获取到span的val
    var num = $(".mui-numbox-input").val();
    var size = $('size span.now').text();

    $.ajax({
      type: 'post',
      url: '/cart/addCart',
      data: {
        productId: productId,
        num: num,
        size: size
      },
      success: function (info) {
        console.log(info);
        //如果用户没有登录，跳转到登录页面,给一个回跳的地址
        if (info.error === 400) {
          window.location.href = "login.html?back=" + location.href;

        }
        if (info.success) {
          //如果用户登录了，给用户一个提示，加入购物车成功
          mui.confirm("添加成功", "温馨提示", ["去购物车", "继续浏览"], function (e) {
            // 这个是点击了去购物车就跳转到购物车
            if (e.index === 0) {

              location.href = "cart.html";
            }
          });
        }


      }

    })

  })


})



