$(function () {


  //  发送ajax 
  var page = 1; //显示的当前页码;
  var pageSize = 8; //显示多少页码

  render();
  function render() {

    $.ajax({
      type: 'get',
      url: '/user/queryUser',
      data: {
        page: page,
        pageSize: pageSize,
      },
      success: function (info) {
        console.log(info);
        var html = template('tpl', info);
        $('tbody').html(html);
        //数据渲染完成就应该设置分页
        //分页功能
        $("#paginator").bootstrapPaginator({
          bootstrapMajorVersion: 3, //指定bootstrap的版本
          currentPage: page,//指定当前页数
          totalPages: Math.ceil(info.total / info.size),//设置总页数
          size: 'small', //调整分页控件的尺寸
          //点击分页按钮会触发的事件 4个参数 只要最后一个
          onPageClicked: function (a, b, c, p) {
            //这里最后一个参数用p 是因为局部变量自己有 访问不到外边的page
            page = p; // 
            render();

          }
        })

      }
    })
  };
   
  //给启用按钮或者禁用按钮注册事件 btn两个共有的类 委托事件
  $('tbody').on('click', '.btn', function () {
    //显示模态框
    // console.log(123);
    $('#userModal').modal('show');
    //获取到禁用的id 首先静态页面时需要存一个id
    var id = $(this).parent().data('id');
    // 是否启停  判断是否有启用这个类 有的话就禁用 反之启动
    var isDelete = $(this).hasClass('btn-success') ? 1 : 0;
    // console.log(id); off 清除上边的点击事件带来的事件影响
    $('.btn_update').off().on('click', function () {
      $.ajax({
        type: 'post',
        url: '/user/updateUser',
        data: {
          id: id,
          isDelete: isDelete

        },
        success: function (info) {
          // console.log(info);
          if (info.success) {
            //让模态框隐藏
            $('#userModal').modal('hide');
            // 重新渲染数据
            render();
          }

        }
      })



    })


   





  })











});