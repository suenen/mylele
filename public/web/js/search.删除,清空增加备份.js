//localStorage中只能存储字符串， 所以localStory存储复杂类型的时候，需要先把复杂类型的数据先转换成 json格式的字符串

//搜索记录的列表功能
//假数据
// var arr = ["埃迪达斯", "耐克", "新百伦" ,'哈哈哈','哈哈哈','哈哈哈','哈哈哈','哈哈哈','哈哈哈','哈哈哈','哈哈哈',]
// var result = localStorage.setItem('lt_history', JSON.stringify(arr))
//   获取到假值    [] 保证空数组 null没有长度不能增加数据,保证得到的数据永远都是一个数组 

// 1获取到本地存储(localStory)的数据
function getHistory() {
  var result = localStorage.getItem('lt_history') || '[]';
  result = JSON.parse(result);
  return result;
}
//2渲染模板
function render() {
  //  2获取到存储在localStory中的数据 key的名字定死lt_history
  var result = getHistory();
  // console.log(result);  result是一个数组 需要转换成对象
  //2.1渲染到模板上
  $('.lt_history').html(template('tpl', { rows: result }));
}
render();
//3. 清空所有的数据功能
//3.1 给清空数据注册点击事件（委托）
//3.2 删除 lt_history的数据
//3.3 重新渲染
$('.lt_history').on('click', '.icon_empty', function () {
  // console.log(123);
  localStorage.removeItem("lt_history");
  render();
})

/*
 4.删除单条历史记录的功能
 4.1 给删除的x注册点击事件（委托）
 4.2 获取到当前x上的下标
 4.3 获取到历史记录的数组(因为删只是删数组中的某一个)
 4.4 删除数组对应下标的某一项
 4.5 数组的值已经发生改变，重新存回localStory(数组删了,localStory的删掉)
 4.6 重新渲染
*/
$('.lt_history').on('click', '.btn_delete', function () {
  // console.log(123);
  //获取下标
  var index = $(this).data("index");
  // 获取历史记录的数组
  var result = getHistory();
  // 删除这个下标 删除1个
  result.splice(index, 1);
  //把数组存回去 = 发送ajax请求告诉后台删掉数据
  localStorage.setItem("lt_history", JSON.stringify(result));
  render();
})
/*5增加功能
5.1 给搜索按钮注册点击事件
5.2 获取到输入的value (目的是把输入的内容存到history里)
5.3 获取到历史记录的数组
5.4 把value存到数组的最前面
5.//要求1：数组最多存10条记录，如果超过了，会把最早的搜索记录删掉
5.//要求2：如果数组中已经有这个历史记录，把这个历史记录放到最前面
5.5 (数组的值改变了)把数组重新存回localStory
5.6 重新渲染
*/
$('.btn_serach').on('click', function () {
  // console.log(111);
  // 获取到输入的val
  var txt = $('.lt_search input').val();
  // console.log(txt);
  // 获取到历史记录的数组
  var result = getHistory();
  result.unshift(txt);
  localStorage.setItem("lt_history", JSON.stringify(result));
  render();

})















