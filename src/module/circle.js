// 模块的整体加载
// 除了指定加载某个输出值，还可以使用整体加载，即用星号（*）指定一个对象，所有输出值都加载在这个对象上面。
// 下面是一个circle.js文件，它输出两个方法area和circumference。
// circle.js
export function area(radius) {
  return Math.PI * radius * radius
}
export function circumference(radius) {
  return 2 * Math.PI * radius
}
