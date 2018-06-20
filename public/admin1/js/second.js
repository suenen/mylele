$(function () {
  //发送ajax 请求 动态渲染出模板
  var page = 1;
  var pageSize = 5;
  render();
  function render() {
    $.ajax({
      type: 'get',
      url: '/category/querySecondCategoryPaging',
      data: {
        page: page,
        pageSize: pageSize
      },
      success: function (info) {
        // console.log(info);
        $('tbody').html(template('tpl', info));
        // 页面渲染完成就需要设置分页
        $('#paginator').bootstrapPaginator({
          bootstrapMajorVersion: 3,
          currentPage: page,
          totalPages: Math.ceil(info.total / info.size),
          size: 'small',
          onPageClicked: function (a, b, c, p) {
            page = p;   //把点击的页数p赋值给page.重新渲染page
            render();
          }
        })



      }




    })

  }
















  //点击添加分类按钮
  $('.add').on('click', function () {
    $('#addModal').modal('show')

  })

  //发送ajax请求让一级菜单数据显示出来 能够选
  $.ajax({
    type: "get",
    url: '/category/queryTopCategoryPaging',
    data: {
      page: 1, //只显示
      pageSize: 100 //目的让所有的都显示出来
    },
    success: function (info) {
      console.log(info);
      $('.dropdown-menu').html(template('tpl2', info));

    }

  })
  // 让二级分类能够选择 需要注册委托事件 给所有的文本注册
  $('.dropdown-menu').on('click', 'a', function () {
    // console.log(123);
    //把a的内容给到input框的文本
    var txt = $(this).text();
    $('.dropdown-text').text(txt)
    var id = $(this).data('id');
    console.log(id);  ///获取a标签的id
    $('[ name="categoryId"]').val(id);
  })


  $('#fileupload').fileupload({
    dataType: 'json',  //返回的结果类型
    done: function (e, data) {   //data指上传成功后的回调函数
      console.log(data.result.picAddr);   //图片的地址
      // 修改ing的src
      $(".img_box img").attr("src", data.result.picAddr);
      // 让
      $('[name="brandLogo"]').val(data.result.picAddr)  //让brandLogo赋值.发送给后台
  
    }


  })

});