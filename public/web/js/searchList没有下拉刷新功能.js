$(function () {
  var page = 1;//page定死第一页当前页
  var pageSize = 10; //只显示10张

  //获取地址栏中的参数 getSearch()能够得到一个对象 ??
  var key = getSearch().key;
  console.log(key);

  //设置给input框 key地址栏的key
  $(".lt_search input").val(key);
  //2发送ajax请求，获取搜索到商品数据
  // proName 就是key
  render();
  /*3点击搜索按钮
3.1 3.1点击搜索按钮，渲染
3.2给按钮注册点击事
3.3获取到文本框的值
3.4重新渲染
*/
  $('.btn_serach').on('click', function () {

    // 点击按钮之前需要把样式重置(因为不重置上次搜索的比如升序 新页面也会按照升序来排)
    // 把所有的li的now 全部清掉  把所有的li的下的span的箭头全部向下
    $(".lt_sort li").removeClass("now")
    $(".lt_sort span").removeClass("fa-angle-up").addClass("fa-angle-down");


    // console.log(123); key 地址栏的参数
    // 获取到文本的value值设置给key 因为是搜索框渲染的时候
    key = $(".lt_search input").val();
    // console.log(key);
    render();
  })

  /*4 点击排序的按钮（价格或者是库存），重新发送ajax请求
如果点了价格进行排序，需要多传一个参数，price: 1或者是2 1升序  下箭头降序
如果点了库存进行排序，需要多传一个参数，num: 1或者是2
如果当前的li没有now这个类，让当前的li有now这个类，并且让其他的li没有now这个类,让所有的span的箭头都初始向下
如果当前li有now这个类，修改当前li下的span的箭头的类 */
  //给有[data-type]的li里注册事件
  $('.lt_sort li[data-type]').on('click', function () {

    var $this = $(this);
    if (!$this.hasClass('now')) {
      // 没有now这个类的时候 让当前li有now这个类.其他的清除
      $(this).addClass("now").siblings().removeClass("now");
      $(".lt_sort li span").addClass("fa-angle-down").removeClass("fa-angle-up");
    } else {
      // 永远都会有fa-angle-down下 或者fa-angle-up上  点一下发现有down就取消了
      $(this).find("span").toggleClass("fa-angle-down").toggleClass("fa-angle-up");
    }
    // 直接render不可以 因为没传后台要的num 和price
    render()

  })
  // 封装render
  function render() {
    //每次需要重新渲染数据的时候，先把内容替换成loading
    $(".lt_product").html('<div class="loading"></div>');
    var obj = {
      proName: key,
      page: page,
      pageSize: pageSize,
    };
    // 判断是否需要添加num price  (因为库存和价格有now了)
    // 选中的 
    var $select = $('.lt_sort li.now');
    if ($select.length > 0) {
      console.log("需要排序");
      // type为 num price
      var type = $select.data("type");
      // console.log(type);
      // 判断span(箭头)是否有向下得类 2降序 或者上序
      var value = $select.find("span").hasClass("fa-angle-down") ? 2 : 1;
      //   //给参数增加了一个属性，属性可以能是price，也可以能是num
      obj[type] = value;


    } else {
      console.log("不需要排序");

    }

    $.ajax({
      type: 'get',
      url: '/product/queryProduct',
      data: obj,
      success: function (info) {
        console.log(info);
        setTimeout(function () {
          $('.lt_product').html(template('tpl', info))

        }, 1000)


      }

    })
  }

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
      var k = e.split("=")[0];
      var v = e.split("=")[1];
      // console.log(k, v); v是值
      obj[k] = v;
    })
    return obj;
  }



})