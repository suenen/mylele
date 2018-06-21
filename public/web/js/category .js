$(function () {
  //发送ajax请求，获取一级分类的数据
  $.ajax({
    type: 'get',
    url: '/category/queryTopCategory',
    success: function (info) {
      // console.log(info);
      $('.category_left ul').html(template('tpl', info));

      //获取到一级分类之后，渲染了第一个一级分类对应的二级分类
      //  拿到数组 第0个 的id  不能写死1 
      // 渲染第一个运动馆对应的二级分类
      renderSecond(info.rows[0].id);

    }

  })
  // id 是一级分类的id
  function renderSecond(id) {
    // 发送ajax渲染数据
    $.ajax({
      type: 'get',
      url: '/category/querySecondCategory',
      // 二级分类的id通过形参传过来了
      data: {
        id: id
      },
      success: function (info) {
        console.log(info);
        $('.category_right ul').html(template('tpl2', info))

      }
    })

  }

  // 给a注册点击事件 注册委托事件 
  $('.category_left').on('click', 'li', function () {
    // console.log(111);
    $(this).addClass('now').siblings().removeClass('now');
    var id = $(this).data('id')
    renderSecond(id);
    // 让右边的容器滚到00的位置
    // 不然出不来
    mui('.category_right .mui-scroll-wrapper').scroll().scrollTo(0, 0, 1000);//100毫秒滚动到顶




  })





});