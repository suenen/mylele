
// 区域滚动初始化
mui('.mui-scroll-wrapper').scroll({
  indicators: false, //不显示滚动条
});





  //1 专门用来获取地址栏的参数
  function getSearch() {


    // 获取到地址栏中的key对应的值，把这个值放到搜索框中
    var search = location.search;
    // console.log(search);

    // 地址栏会对中文进行转码 ,客户不认识.所以我们需要自己转码
    search = decodeURI(search);
    // console.log(search);
    //  去掉? 从1开始第一个给切掉   //字符串还有sutstr  substring
    search = search.slice(1);
    var arr = search.split('&');
    // console.log(arr);
    var obj = {};
    arr.forEach(function (e, i) {
      console.log(e); 
      var k = e.split("=")[0];
      var v = e.split("=")[1];
      // v是值
      obj[k] = v;
      console.log(obj);
      
    })
    return obj;
  }