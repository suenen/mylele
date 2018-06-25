//1设置地址栏参数
var search = getSearch().key;
$(".lt_search input").val(search);
page = 1;
pageSize = 5;
var key = search;

//2 点击搜索 显示数据
$('.')



/*ajax的封装*/
function render() {
  //2发送ajax请求
  $.ajax({
    type: 'get',
    url: '/product/queryProduct',
    data: {
      page: page,
      pageSize: pageSize,
      proName: key,
    },
    success: function (info) {
      // console.log(info);
      $('.lt_product').html(template('tpl', info))

    }
  })
}


/*
获取地址栏的参数
*/
function getSearch() {
  var search = location.search;
  search = decodeURI(search);
  search = search.slice(1);
  var arr = search.split('&');
  // console.log(arr);
  var obj = {};
  arr.forEach(function (e, i) {
    var k = e.split('=')[0];
    var v = e.split('=')[1];
    // console.log(k, v);
    obj[k] = v;

  });
  return obj;

}













  /*3点击搜索按钮
3.1 3.1点击搜索按钮，渲染
3.2给按钮注册点击事
3.3获取到文本框的值
3.4重新渲染
*/


  /*4 点击排序的按钮（价格或者是库存），重新发送ajax请求
如果点了价格进行排序，需要多传一个参数，price: 1或者是2 1升序  下箭头降序
如果点了库存进行排序，需要多传一个参数，num: 1或者是2
如果当前的li没有now这个类，让当前的li有now这个类，并且让其他的li没有now这个类,让所有的span的箭头都初始向下
如果当前li有now这个类，修改当前li下的span的箭头的类 */
  //给有[data-type]的li里注册事件

