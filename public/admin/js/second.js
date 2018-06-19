$(function () {
  //1封装ajax渲染模板

  var page = 1;  //当前页数
  var pageSize = 5;  //要显示多少页数
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
        console.log(info);
        $("tbody").html(template("tpl", info));
        $("#paginator").bootstrapPaginator({
          bootstrapMajorVersion: 3,
          currentPage: page,
          totalPages: Math.ceil(info.total / info.size),
          size: 'small',
          onPageClicked: function (a, b, c, p) {
            page = p;
            render();
          }
        });

      }

    })

  }
  // 点击二级分类的添加分类 ,显示 添加的模态框
  $('.btn_add').on('click', function () {
    $('#addModal').modal('show');

  })
  //发送ajax请求，获取所有的一级分类的数据
  // 一级分类接口没有  page写死1 pageSize 100 可以把所有的一级分类拿下来 ,不需要
  $.ajax({
    type: 'get',
    url: '/category/querySecondCategoryPaging',
    data: {
      page: 1,
      pageSize: 100
    },
    success: function (info) {
      // console.log(info);
      $('.dropdown-menu').html(template('tpl2', info))

    }



  })
  //让一级分类能够选择 给所有的a 注册点击事件(委托事件 a是后期生成的)
  $('.dropdown-menu').on('click', 'a', function () {
    //把a的text给button
    var txt = $(this).text();
    $('.dropdown-text').text(txt);
    //- 获取a标签的id，设置给隐藏的input框，categoryId,目的是能够发送到后台
    //- 表单校验的时候，需要让categoryId通过
    var id = $(this).data('id')
    //获取到id，设置给categoryId这个隐藏域 
    // 把input的vlaue值赋值给[name='categoryId']
    $("[name='categoryId']").val(id);
  })
  // 图片的异步上传
  ////图片上传功能,获取上传后的结果 找到inout框 调fileupload方法
  $('#fileupload').fileupload({
    dataType: 'json', //返回的结果的类型是json
    // 图片上传后的回调函数  e事件对象,data图片上传后的地址
    done: function (e, data) {
      // console.log(data); data里有个 
      //result 里包含地址 {picAddr: "/upload/brand/7b853bb0-73c9-11e8-95b4-bf4e006b11c7.png"}
      console.log(data.result.picAddr);
      //修改img_box下的img的src
      $(".img_box img").attr("src", data.result.picAddr);
      // //给brandLogo赋值
      $('[name="brandLogo"]').val(data.result.picAddr);

      // 点击的不是表单的东西,点击的是li 校验不知道
      //让brandLogo校验通过
      $("form").data("bootstrapValidator").updateStatus("categoryId", "VALID");
    }
  })

  //表单校验功能
  $("form").bootstrapValidator({
    //excluded:指定不校验的类型，[]让所有的类型都校验
    excluded: [],
    feedbackIcons: {
      valid: 'glyphicon glyphicon-thumbs-up',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    fields: {
      categoryId: {
        validators: {
          notEmpty: {
            message: '请选择一级分类'
          }
        }
      },
      brandName: {
        validators: {
          notEmpty: {
            message: '请输入二级分类的名称'
          }
        }
      },
      brandLogo: {
        validators: {
          notEmpty: {
            message: '请上传二级分类的图片'
          }
        }
      }
    }
  });
  //给表单注册校验成功的事件，阻止表单的提交，使用ajax提交
  $("form").on("success.form.bv", function (e) {
    e.preventDefault();
    $.ajax({
      type: 'post',
      url: '/category/addSecondCategory',
      data: $("form").serialize(),
      success: function (info) {
        console.log(info);
        if(info.success){
          $("#addModal").modal("hide");
          //重新渲染第一页
          page = 1;
          render();
          // 重置表单
          $("form").data("bootstrapValidator").resetForm(true);
          $(".dropdown-text").text("请选择一级分类");
          $(".img_box img").attr("src", "images/none.png");
        }


      }

    })


  })

});
