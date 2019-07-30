// 其实细看可以看出规律，因为 +-!~ 这些具有极高的优先级，
// 所以右边的函数声明加上括号的部分（实际上就是函数执行的写法）就直接执行了。当然，这样的写法，没有什么区别，纯粹看装逼程度。
export default function testAnony() {
  // !function(){}();
  // +function(){}();
  // -function(){}();
  // ~function(){}();
  // ~(function(){})();
  // void function(){}();
  // (function(){}());  正统版本 vscode会自动把上面非正统版本转化为这个版本
  !(function() {
    console.log('hi-1')
  })()
  ;+(function() {
    console.log('hi-2')
  })()
  ;-(function() {
    console.log('hi-3')
  })()
  ~(function() {
    console.log('hi-4')
  })()
  ~(function() {
    console.log('hi-5')
  })()
  void (function() {
    console.log('hi-6')
  })()
  ;(function() {
    console.log('hi-7')
  })()
}
