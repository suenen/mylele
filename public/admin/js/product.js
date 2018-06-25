$(function () {

  var page = 1;
  var pageSize = 5;
  // 用于存放上传图片的结果()
  var img = [];
  render();
  function render() {
    // 发送ajax请求
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
        // 数据渲染出来 设置分页
        $('#paginator').bootstrapPaginator({
          bootstrapMajorVersion: 3, //版本号
          currentPage: page,  //当前页
          totalPages: Math.ceil(info.total / info.size
          ),
          size: "small",
          // 点击前后页的时候会触发
          onPageClicked: function (a, b, c, p) {
            page = p;
            render();


          },
          // 设置首页尾页等,这个函数的返回值就是按钮要显示的内容
          itemTexts: function (type, page) {
            switch (type) {
              case 'first':
                return '首页';
              case 'prev':
                return '上一页';
              case 'next':
                return '下一页';
              case 'last':
                return '尾页';
              case 'page':
                return page;
            }
          },
          // Bootstrap内置的提示功能
          useBootstrapTooltip: true,
          // 控制title的显示方向
          bootstrapTooltipOptions: {
            placement: 'bottom'
          },
          //设置操作按钮的title属性 提示功能
          tooltipTitles: function (type, page) {
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
        })



      }
    })



  }
  // 点击添加分类按钮.显示模态框
  $('.btn_add').on('click', function () {
    $('#addModal').modal('show');

    //发送ajax请求，获取所有的二级分类(要找到获取二级分类的地址获取到)
    $.ajax({
      type: 'get',
      url: '/category/querySecondCategoryPaging',
      data: {
        page: 1,
        pageSize: 100
      },
      success: function (info) {
        // console.log(info);
        $('.dropdown-menu').html(template('tpl2', info));
      }


    })
  })

  // 给二级分类的a注册事件 委托事件
  $('.dropdown-menu').on('click', 'a', function () {
    // 获取到a的value给 input
    var txt = $(this).text();
    $('.dropdown-text').text(txt);
    var id = $(this).data('id');
    console.log(id);
    // 给name设置id 发送后台
    $('[name="brandId"]').val(id);
    // 手动的让二级分类校验
    $("form").data("bootstrapValidator").updateStatus("brandId", "VALID");

  })


  //图片上传的功能
  $("#fileupload").fileupload({
    done: function (e, data) {
      // 一开始就判断大于等于3 就不让上传照片了
      if (img.length >= 3) {
        return;

      }
      console.log(data.result);
      /* 上传结果拿到图片的picName 和 picAddr 名字和地址
 
       每张图片上传成功 done就会执行一次
        图片上传成功需要把图片显示出来
        每次成功往imgbox加一张图片就好,就不用管是那张图片
           每次上传成功 就往imgsbox里添加一张img
         */
      $('.img_box').append('<img src="' + data.result.picAddr + '" width="100" alt="">')
      /*
      把data存起来
      */

      img.push(data.result);
      if (img.length === 3) {
        // 等于3张就手动变成成功
        $("form").data("bootstrapValidator").updateStatus("without", "VALID");

      } else {
        $("form").data("bootstrapValidator").updateStatus("without", "INVALID");
      }


    }


  })
  // 表单校验
  $('form').bootstrapValidator({
    // 所以设置空表示表示所有的类型都校验
    //1. 它指定不校验的类型，默认为[':disabled', ':hidden', ':not(:visible)'],可以不设置
    excluded: [],
    // 字体图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-thumbs-up',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    //指定校验字段
    fields: {
      //校验用户名，对应name表单的name属性
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
      num: {
        validators: {
          notEmpty: {
            message: '请输入商品的库存'
          },
          // 校验正则 不能0开头 只能是到4位 最大9999
          regexp: {
            regexp: /^[1-9]\d{0,4}$/,
            message: '请输入正确的库存（1-99999）'
          }
        }

      },
      size: {
        validators: {
          notEmpty: {
            message: '请输入商品的尺寸'
          },
          // 校验正则 
          regexp: {
            regexp: /^\d{2}-\d{2}$/,
            message: '请输入正确的尺码(30-55)'
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
      // 图片的校验 这个校验永远都会失败,因为没值
      without: {
        validators: {
          notEmpty: {
            message: '请上传3张图片'
          }
        }

      },



    }


  })

  // 表单校验成功的时候
  $('form').on('success.form.bv', function (e) {
    // 阻止跳转 (自己跳转会被看到显示到最上边的状态栏)发送ajax请求
    e.preventDefault();
    var param = $("form").serialize();


    //  把data图片上传的结果放到数组里边  (手动把六个参数拼上来)
    /* 
   //图片如何发送后台(发送地址)
   //还需要6个参数
   &picName1="1.jpg"&picAddr1="images/1.jpg"
   &picName2="2.jpg"&picAddr2="images/2.jpg"
   &picName3="3.jpg"&picAddr3="images/3.jpg"

*/
    // console.log(param);  //所有的后台要的参数名 
    // &picName1 后端要的参数名   img[0].picName传给后端的参数值
    param += '&picName1=' + img[0].picName + '&picAddr1=' + img[0].picAddr;
    param += '&picName2=' + img[1].picName + '&picAddr2=' + img[1].picAddr;
    param += '&picName3=' + img[2].picName + '&picAddr3=' + img[2].picAddr;
    $.ajax({
      type: 'post',
      url: '/product/addProduct',
      data: param,
      success: function (info) {
        // console.log(info);
        if (info.success) {
          //隐藏模态框
          $("#addModal").modal('hide');
          //重新渲染
          page = 1;
          render();
          // 重置表单 resetForm(true)重置样式和内容
          $("form").data("bootstrapValidator").resetForm(true);

          //清空数组
          img = [];

          //text的内容记得改回来
          $('.dropdown-text').text('请选择二级分类')
          //图片删除
          $(".img_box img").remove();
        }

      }


    })






  })

})