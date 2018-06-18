//  所有通用的js功能
//开启进度条
//ajaxStartajax 发送之前要开始的时候触发
$(document).ajaxStart(function () {
  console.log("开始啦......");
  //开启进度条
  NProgress.start();
});

//ajax发送成功结束事件
$(document).ajaxStop(function () {
  setTimeout(function () {
    //关闭进度条    接口跑的太快 所以延时5秒
    NProgress.done();
  }, 500);
});
