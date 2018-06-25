
//  1刷新功能
mui.init({
  pullRefresh: {
    container: ".mui-scroll-wrapper",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
    down: {
      auto: true,//可选,默认false.首次加载自动下拉刷新一次
      callback: function () {
        $.ajax({
          type: 'get',
          url: '/cart/queryCart',
          success: function (info) {
            // 成功假设有一定时间
            setTimeout(function () {
              console.log(info);
              if (info.error) {
                // 用户没有登录.跳转到登录页,需要回跳
                location.href = "login.html?back=" + location.href;
              }

              $('#OA_task_2').html(template('tpl', { info: info }))

              //结束下拉刷新
              mui(".mui-scroll-wrapper").pullRefresh().endPulldownToRefresh();

            }, 1000)

          }
        })
      }
    }
  }
});

// //2删除功能
// 1. 注册事件的注意点： 委托事件  注册tap
// 2. 获取到id，发送ajax请求，删除购物车的信息
// 3. 成功的时候，重新下拉刷新一次即可
$('#OA_task_2').on('tap', '.btn_delete', function () {
  // console.log(123);

  var id = $(this).data('id');
  console.log(id);
  mui.confirm("你确定要删除这件商品吗？", "温馨提示", ["是", "否"], function (e) {
    if (e.index === 0) {
      // 等于0的时候确认删除
      $.ajax({
        type: 'get',
        url: '/cart/deleteCart',
        data: {
          id: [id]
        },
        success: function (info) {
          console.log(info);
          if (info.success) {
            //重新下拉
            mui(".mui-scroll-wrapper").pullRefresh().pulldownLoading();

          }


        }
      })
    }

  })





})

// 计算总金额   不要注册tap事件 触发很快(拿到的是上一次的)
$('#OA_task_2').on('change', '.check', function () {
  //  console.log(123);
  // 合计
  var total = 0;
  // 找到选中的复选框
  // 遍历这个伪数组拿到每个人的金额和双
  $('.check:checked').each(function (i) {
    // 怎么拿双和钱???? 给check存自定义属性双和钱
    total += $(this).data('price') * $(this).data('num');
    // 显示出来
    $('.cart_money span').text(total);

  })






})

/*3修改购物车
1. 给修改按钮注册点击事件
2. 获取到id
3. 根据id获取到原来的信息
4. 把原来的信息显示出来
5. 用户进行修改
6. 发送ajax请求，把数据修改
7. 重新下拉刷新一次即可。
整个列表已经把所有的购物车信息都给我们了
*/
$('#OA_task_2').on('tap', '.btn_edit', function () {
  // console.log(11);
  // 根据id差数据库信息
  var data = this.dataset;//js方法 能拿到所有的存的data自定义属性
  console.log(data);
  // 自己去渲染一个模板 数据是data
  var html = template("tpl2", data);
  console.log(html);//多了一坨的br
  //  需要把html的br干掉 
  html = html.replace(/\n/g, "");

  // 做回显
  mui.confirm(html, '编辑商品', ['确定', '取消'], function (e) {
    // 点击确认的时候 需要修改数据
    if (e.index === 0) {
      // 这里不需要发送ajax请求
      var id = data.id;
      var num = $(".mui-numbox-input").val();
      var size = $(".proSize span.now").text();
      // console.log(size);
      $.ajax({
        type: 'post',
        url: '/cart/updateCart',
        data: {
          id: id,
          num: num,
          size: size
        },
        success: function (info) {
          // console.log(info);
          if (info.success) {
            //重新下拉刷新
            mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();
          }

        }
      })


    }
  })
  // 动态生成,需要初始化
  //能够修改数量
  mui(".mui-numbox").numbox();
  //能够修改尺码
  $(".proSize span").on("click", function () {
    $(this).addClass("now").siblings().removeClass("now");
  });

});



