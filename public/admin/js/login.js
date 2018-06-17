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
      username: {
        // validators
        validators: {
          for
        }

      },
      password: {

      }
    }

  })



});