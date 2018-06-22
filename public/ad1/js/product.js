$(function () {
  //  发送ajax请求渲染数据
  var page = 1;
  var pageSize = 5;
  var imgs = [];
  render();
  function render() {
    $.ajax({
      type: 'get',
      url: '/product/queryProductDetailList',
      data: {
        page: page,
        pageSize: pageSize
      },
      success: function (info) {
        // console.log(info);
        $('tbody').html(template('tpl', info));
        // 数据渲染出来 调分页功能
        $('#paginator').bootstrapPaginator({
          bootstrapMajorVersion: 3, //指定版本号
          currentPage: page,//当前页
          totalPages: Math.ceil(info.total / info.size),//总页数
          //这个函数的返回值就是按钮的显示的内容
          itemTexts: function (type, page) {
            //console.log(type, page, current);
            switch (type) {
              case "first":
                return "首页";
              case "prev":
                return "上一页";
              case "next":
                return "下一页";
              case "last":
                return "尾页";
              case "page":
                return page;
            }
          },
          // 点击上下页触发的时间
          onPageClicked: function (a, b, c, p) {
            page = p;
            render();

          }

        })

      }

    })

  }
  // 点击添加分类的时候显示模态框
  $('.add').on('click', function () {

    // 显示模态框
    $('#addModal').modal('show');
  })
  // 发送ajax请求 渲染二级分类
  $.ajax({
    type: 'get',
    url: '/category/querySecondCategoryPaging',
    data: {
      page: 1,
      pageSize: 100 //保证都显示出来
    },
    success: function (info) {
      // console.log(info);
      $('.dropdown-menu').html(template('tpl2', info));

    }


  })

  $('.dropdown-menu').on('click', 'a', function () {
    // console.log(111);
    var txt = $(this).text();
    $('.dropdown-text').text(txt);
    //2. 设置隐藏input的val 为了表单校验 后期发送给后台
    var id = $(this).data('id');
    $('[ name="brandId"]').val(id);
    // 手动校验成功
    $("form").data("bootstrapValidator").updateStatus("brandId", "VALID");
  })

  // 图片上传的逻辑
  $("#fileupload").fileupload({
    dataType: "json",
    //e：事件对象
    //data：图片上传后的对象，通过e.result.picAddr可以获取上传后的图片地址
    done: function (e, data) {
      if (imgs.length >= 3) {
        return;
      }

      // console.log(data.result);
      // 因为上传一张图片,done就会执行一次 所以定义一个数组存起来
      imgs.push(data.result);
      // console.log(imgs);
      // 上传一张就往img里添加一张
      $('.img_box').append('<img src="' + data.result.picAddr + '" width="100" alt="">');
      if (imgs.length === 3) {
        $("form").data("bootstrapValidator").updateStatus("tips", "VALID");
      } else {
        $("form").data("bootstrapValidator").updateStatus("tips", "INVALID");
      }
    }

  });

  // 表单校验
  $('form').bootstrapValidator({
    // 校验成功图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    //1. 指定不校验的类型，默认为[':disabled', ':hidden', ':not(:visible)'],可以不设置
    excluded: [],
    fields: {
      brandId: {
        validators: {
          notEmpty: {
            message: '请选择二级分类'
          }
        }
      },
      proName: {
        validators: {
          notEmpty: {
            message: '请输入商品的名称'
          }
        }
      },
      proDesc: {
        validators: {
          notEmpty: {
            message: '请输入商品的描述'
          }
        }
      },
      proDesc: {
        validators: {
          notEmpty: {
            message: '请输入商品的描述'
          }
        }
      },
      num: {
        validators: {
          //非空  必须是数字类型的
          notEmpty: {
            message: '请输入商品的库存'
          },
          //正则校验的
          regexp: {
            //不能0开头，不能超过5位数 1-99999
            regexp: /^[1-9]\d{0,4}$/,
            message: '请输入正确的库存（1-99999）'
          }
        }
      },
      size: {
        validators: {
          notEmpty: {
            message: '请输入商品的尺码'
          },
          //正则校验的 30-50
          regexp: {
            //不能0开头，不能超过5位数 1-99999   
            regexp: /^\d{2}-\d{2}$/,
            message: '请输入正确的尺码范围（xx-xx）'
          }
        }
      },
      oldPrice: {
        validators: {
          notEmpty: {
            message: '请输入商品的原价'
          }
        }
      },
      price: {
        validators: {
          notEmpty: {
            message: '请输入商品的现价'
          }
        }
      },
      tips: {
        validators: {
          notEmpty: {
            message: '请上传三张图片'
          }
        }
      },
    }
  });

  // 表单校验成功的时候 
  $("form").on('success.form.bv', function (e) {
    e.preventDefault();
    // 获取到前边的所有参数
    var param = $("form").serialize();
    param += "&picName1=" + imgs[0].picName + "&picAddr1=" + imgs[0].picAddr;
    param += "&picName2=" + imgs[1].picName + "&picAddr2=" + imgs[1].picAddr;
    param += "&picName3=" + imgs[2].picName + "&picAddr3=" + imgs[2].picAddr;

    //使用ajax提交逻辑
    $.ajax({
      type: 'post',
      url: '/product/addProduct',
      data: param,
      success: function (info) {
        // console.log(info);
        if (info.success) {
          $('#addModal').modal('hide');
          page = 1;
          render();
          // 隐藏模态框

          // 清空数组
          imgs = [];
          // 重置表单
          $("form").data("bootstrapValidator").resetForm(true);
          $(".dropdown-text").text("请选择二级分类");
          $(".img_box img").remove();
        }
      }

    })
  });
})