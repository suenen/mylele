$(function () {

  //1封装ajax渲染模板

  var page = 1;  //当前页数
  var pageSize = 5;  //要显示多少页数
  render();
  function render() {
    $.ajax({
      type: 'get',
      url: '/category/queryTopCategoryPaging',
      data: {
        page: page, //第一个page后台要的page
        pageSize: pageSize,

      },
      success: function (info) {
        // console.log(info);
        var html = template('tpl', info)
        $('tbody').html(html);
        // 分页功能
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

  //2 给添加分类注册点击事件
  $('.btn_add').on('click', function () {
    //显示添加的模态框
    $('#addModal').modal('show');
  })
  //表单校验功能  不需要给模态框的确认按钮注册点击事件
  $('form').bootstrapValidator({
    //配置小图标  feedbackIcons最终显示反馈的一个图标
    feedbackIcons: {
      // valid校验成功的时候 
      valid: ' glyphicon glyphicon-user',
      // invalid 校验失败的时候
      invalid: 'glyphicon glyphicon-remove',
      // 正在校验中 刷新的图标
      validating: 'glyphicon glyphicon-refresh'

    },
    fields: {
      categoryName: {
        validators: {
          notEmpty: {
            message: '一级分类的类名不能为空'
          }

        }
      }

    }
  });
  // "success.form.bv"表单校验成功触发事件
  $('form').on("success.form.bv", function (e) {
    //通常我们需要禁止表单的自动提交，使用ajax进行表单的提交。
    e.preventDefault();
    $.ajax({
      type: 'post',
      url: '/category/addTopCategory',
      data: $('form').serialize(),
      success: function (info) {
        console.log(info);
        if (info.success) {
          page = 1;
          $('#addModal').modal('hide');
          render();
          // 重置表单
          $("form").data("bootstrapValidator").resetForm(true);
        }


      }

    })



  })



});