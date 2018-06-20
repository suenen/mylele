$(function () {
  /* 
      表单的校验功能
      bootstrapValidator插件
      1. 依赖与bootstrap
      2. 会自动的进行表单的校验，只需要配置一些校验的规则即可。
      3. 在(表单提交)的时候，以及输入内容的时候自动校验
        3.1 如果校验失败了，阻止你的表单提交
        3.2 如果表单校验成功了，会让表单继续提交
  */

  //1. 初始化表单校验,找到表单，调用bootstrapValidator
  $('form').bootstrapValidator({
    /*2. 配置校验规则  用户名不能为空   用户密码不能为空 用户密码长度：6-12
           
    */
    //  fields 配置校验的字段 密码 用户名
    fields: {
      // username对应了表单中的name属性.没有name属性不能做校验
      username: {
        // validators配置用户名的具体的校验规则
        validators: {
          // notEmpty 校验不能为空
          notEmpty: {
            //  message 提示信息
            message: '用户名不能为空'
          },
          //  stringLength 不能小于多少值或者大于多少值
          stringLength: {
            message: '用户名长度是3-9位',
            min: 3,
            max: 9
          },
          // 属于一种校验  可以指定  用于下边的指定
          callback: {
            message: '用户名不正确'
          }

        }

      },
      // password对应了表单中的name属性.没有name属性不能做校验
      password: {
        validators: {
          notEmpty: {
            message: '密码不能为空'
          },
          stringLength: {
            message: '用户密码是6-12位',
            min: 6,
            max: 12
          },
          callback: {
            message: '密码不正确'
          }

        }
      }
    },
    //配置小图标  feedbackIcons最终显示反馈的一个图标
    feedbackIcons: {
      // valid校验成功的时候 
      valid: ' glyphicon glyphicon-user',
      // invalid 校验失败的时候
      invalid: 'glyphicon glyphicon-remove',
      // 正在校验中 刷新的图标
      validating: 'glyphicon glyphicon-refresh'

    }

  })
  //2. 当表单校验成功的时候，阻止表单的跳转，使用ajax进行数据的提交
  //success.form.bv成功的时候触发
  $('form').on('success.form.bv', function (e) {
    console.log(111);

    // 阻止默认submit的跳转
    e.preventDefault();
    // 发送ajax请求
    $.ajax({
      type: 'post',
      url: '/employee/employeeLogin',
      data: $('form').serialize(),
      success: function (info) {
        console.log(info);
        // 说明登录成功了
        if (info.success === true) {
          //跳转到首页
          location.href = "index.html";

        }
        if (info.error === 1000) {
          //手动让username校验失败       让username失败
          $('form').data('bootstrapValidator').updateStatus("username", "INVALID", 'callback')
          //参数1： 更新哪个字段
          //参数2： 更新为什么状态  INVALID  VALID
        }
        if (info.error === 1001) {
          $('form').data('bootstrapValidator').updateStatus("password", "INVALID", 'callback')
        }


      }



    })




  })
  //3重置表单的样式  属性选择器
  $('[type="reset"]').on('click', function () {

    //获取到表单校验插件的实例data("bootstrapValidator")，通过这个实例就可以调用插件提供的很多方法
    //resetForm(true): 重置表单所有的样式以及内容
    $("form").data("bootstrapValidator").resetForm(true);  // 不传true只会重置样式不会重置内容,传不传都可以  因为自己本身就有reset


  })

});