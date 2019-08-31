const { log } = console
// Set
// 基本用法
// ES6 提供了新的数据结构 Set。它类似于数组，但是成员的值都是唯一的，没有重复的值。
// Set本身是一个构造函数，用来生成 Set 数据结构。
const s = new Set()
;[2, 3, 5, 4, 5, 2, 2].forEach(x => s.add(x))
for (let i of s) {
  console.log(i)
}
// 2 3 5 4
// 上面代码通过add()方法向 Set 结构加入成员，结果表明 Set 结构不会添加重复的值。

// Set 实例的属性和方法
// Set 结构的实例有以下属性。
// Set.prototype.constructor：构造函数，默认就是Set函数。
// Set.prototype.size：返回Set实例的成员总数。
// Set 实例的方法分为两大类：操作方法（用于操作数据）和遍历方法（用于遍历成员）。下面先介绍四个操作方法。
// add(value)：添加某个值，返回 Set 结构本身。
// delete(value)：删除某个值，返回一个布尔值，表示删除是否成功。
// has(value)：返回一个布尔值，表示该值是否为Set的成员。

// 遍历操作
// Set 结构的实例有四个遍历方法，可以用于遍历成员。
// keys()：返回键名的遍历器
// values()：返回键值的遍历器
// entries()：返回键值对的遍历器
// forEach()：使用回调函数遍历每个成员
// 需要特别指出的是，Set的遍历顺序就是插入顺序。这个特性有时非常有用，比如使用 Set 保存一个回调函数列表，调用时就能保证按照添加顺序调用。
let set = new Set([1, 4, 9])
set.forEach((value, key) => console.log(key + ' : ' + value))
// 1 : 1
// 4 : 4
// 9 : 9

// WeakSet
// 含义
// WeakSet 结构与 Set 类似，也是不重复的值的集合。但是，它与 Set 有两个区别。
// 首先，WeakSet 的成员只能是对象，而不能是其他类型的值。
// const ws = new WeakSet();
// ws.add(1)
// // TypeError: Invalid value used in weak set
// ws.add(Symbol())
// // TypeError: invalid value used in weak set
// 上面代码试图向 WeakSet 添加一个数值和Symbol值，结果报错，因为 WeakSet 只能放置对象。
// 其次，WeakSet 中的对象都是弱引用，即垃圾回收机制不考虑 WeakSet 对该对象的引用，也就是说，如果其他对象都不再引用该对象，
// 那么垃圾回收机制会自动回收该对象所占用的内存，不考虑该对象还存在于 WeakSet 之中。
// 这是因为垃圾回收机制依赖引用计数，如果一个值的引用次数不为0，垃圾回收机制就不会释放这块内存。结束使用该值之后，有时会忘记取消引用，
// 导致内存无法释放，进而可能会引发内存泄漏。WeakSet 里面的引用，都不计入垃圾回收机制，所以就不存在这个问题。因此，WeakSet 适合临时存放一组对象，
// 以及存放跟对象绑定的信息。只要这些对象在外部消失，它在 WeakSet 里面的引用就会自动消失。
// 由于上面这个特点，WeakSet 的成员是不适合引用的，因为它会随时消失。另外，由于 WeakSet 内部有多少个成员，取决于垃圾回收机制有没有运行，
// 运行前后很可能成员个数是不一样的，而垃圾回收机制何时运行是不可预测的，因此 ES6 规定 WeakSet 不可遍历。

// Map
// 含义和基本用法
// JavaScript 的对象（Object），本质上是键值对的集合（Hash 结构），但是传统上只能用字符串当作键。这给它的使用带来了很大的限制。
const m = new Map()
const o = { p: 'Hello World' }
m.set(o, 'content')
log(m.get(o)) // "content"
log(m.has(o)) // true
log(m.delete(o)) // true
log(m.has(o)) // false

// （1）size 属性
// size属性返回 Map 结构的成员总数。
// const map = new Map()
// map.set('foo', true);
// map.set('bar', false);
// map.size // 2
// （2）set(key, value)
// set方法设置键名key对应的键值为value，然后返回整个 Map 结构。如果key已经有值，则键值会被更新，否则就新生成该键。
// const m = new Map();
// m.set('edition', 6)       // 键是字符串
// m.set(262, 'standard')     // 键是数值
// m.set(undefined, 'nah')    // 键是 undefined
// set方法返回的是当前的Map对象，因此可以采用链式写法。
// let map = new Map()
//   .set(1, 'a')
//   .set(2, 'b')
//   .set(3, 'c');
// （3）get(key)
// get方法读取key对应的键值，如果找不到key，返回undefined。
// const m = new Map();
// const hello = function() {console.log('hello');};
// m.set(hello, 'Hello ES6!') // 键是函数
// m.get(hello)  // Hello ES6!
// （4）has(key)
// has方法返回一个布尔值，表示某个键是否在当前 Map 对象之中。
// const m = new Map();
// m.set('edition', 6);
// m.set(262, 'standard');
// m.set(undefined, 'nah');
// m.has('edition')     // true
// m.has('years')       // false
// m.has(262)           // true
// m.has(undefined)     // true
// （5）delete(key)
// delete方法删除某个键，返回true。如果删除失败，返回false。
// const m = new Map();
// m.set(undefined, 'nah');
// m.has(undefined)     // true
// m.delete(undefined)
// m.has(undefined)       // false
// （6）clear()
// clear方法清除所有成员，没有返回值。
// let map = new Map();
// map.set('foo', true);
// map.set('bar', false);
// map.size // 2
// map.clear()
// map.size // 0

// 遍历方法
// Map 结构原生提供三个遍历器生成函数和一个遍历方法。
// keys()：返回键名的遍历器。
// values()：返回键值的遍历器。
// entries()：返回所有成员的遍历器。
// forEach()：遍历 Map 的所有成员。
// 需要特别注意的是，Map 的遍历顺序就是插入顺序。

// 与其他数据结构的互相转换
// （1）Map 转为数组
// 前面已经提过，Map 转为数组最方便的方法，就是使用扩展运算符（...）。
const myMap = new Map().set(true, 7).set({ foo: 3 }, ['abc'])
log([...myMap])
// [ [ true, 7 ], [ { foo: 3 }, [ 'abc' ] ] ]
// （2）数组 转为 Map
// 将数组传入 Map 构造函数，就可以转为 Map。
const mymap2 = new Map([[true, 7], [{ foo: 3 }, ['abc']]])
log(mymap2)
// Map {
//   true => 7,
//   Object {foo: 3} => ['abc']
// }
// （3）Map 转为对象
// 如果所有 Map 的键都是字符串，它可以无损地转为对象。
function strMapToObj(strMap) {
  let obj = Object.create(null)
  for (let [k, v] of strMap) {
    obj[k] = v
  }
  return obj
}
const myMap2 = new Map()
  .set('yes', true)
  .set('no', false)
  .set(15, 100)
log(strMapToObj(myMap2))
// { yes: true, no: false }
// 如果有非字符串的键名，那么这个键名会被转成字符串，再作为对象的键名。
// （4）对象转为 Map
function objToStrMap(obj) {
  let strMap = new Map()
  for (let k of Object.keys(obj)) {
    strMap.set(k, obj[k])
  }
  return strMap
}
log(objToStrMap({ yes: true, no: false }))
// Map {"yes" => true, "no" => false}

// 5）Map 转为 JSON
// Map 转为 JSON 要区分两种情况。一种情况是，Map 的键名都是字符串，这时可以选择转为对象 JSON。
function strMapToJson(strMap) {
  return JSON.stringify(strMapToObj(strMap))
}
let myMap3 = new Map().set('yes', true).set('no', false)
log(strMapToJson(myMap3))
// '{"yes":true,"no":false}'
// 另一种情况是，Map 的键名有非字符串，这时可以选择转为数组 JSON。
function mapToArrayJson(map) {
  return JSON.stringify([...map])
}
let myMap4 = new Map().set(true, 7).set({ foo: 3 }, ['abc'])
log(mapToArrayJson(myMap4))
// '[[true,7],[{"foo":3},["abc"]]]'

// （6）JSON 转为 Map
// JSON 转为 Map，正常情况下，所有键名都是字符串。
function jsonToStrMap(jsonStr) {
  return objToStrMap(JSON.parse(jsonStr))
}
log(jsonToStrMap('{"yes": true, "no": false}'))
// Map {'yes' => true, 'no' => false}
// 但是，有一种特殊情况，整个 JSON 就是一个数组，且每个数组成员本身，又是一个有两个成员的数组。这时，它可以一一对应地转为 Map。
// 这往往是 Map 转为数组 JSON 的逆操作。
function jsonToMap(jsonStr) {
  return new Map(JSON.parse(jsonStr))
}
log(jsonToMap('[[true,7],[{"foo":3},["abc"]]]'))
// Map {true => 7, Object {foo: 3} => ['abc']}

// WeakMap
// 含义
// WeakMap结构与Map结构类似，也是用于生成键值对的集合。
// WeakMap与Map的区别有两点。
// 首先，WeakMap只接受对象作为键名（null除外），不接受其他类型的值作为键名。
// const map = new WeakMap();
// map.set(1, 2)
// // TypeError: 1 is not an object!
// map.set(Symbol(), 2)
// // TypeError: Invalid value used as weak map key
// map.set(null, 2)
// // TypeError: Invalid value used as weak map key
// 其次，WeakMap的键名所指向的对象，不计入垃圾回收机制。
// WeakMap的设计目的在于，有时我们想在某个对象上面存放一些数据，但是这会形成对于这个对象的引用。请看下面的例子。
// const e1 = document.getElementById('foo');
// const e2 = document.getElementById('bar');
// const arr = [
//   [e1, 'foo 元素'],
//   [e2, 'bar 元素'],
// ];
// 上面代码中，e1和e2是两个对象，我们通过arr数组对这两个对象添加一些文字说明。这就形成了arr对e1和e2的引用。
// 一旦不再需要这两个对象，我们就必须手动删除这个引用，否则垃圾回收机制就不会释放e1和e2占用的内存。
// // 不需要 e1 和 e2 的时候
// // 必须手动删除引用
// arr [0] = null;
// arr [1] = null;
// 上面这样的写法显然很不方便。一旦忘了写，就会造成内存泄露。
// WeakMap 就是为了解决这个问题而诞生的，它的键名所引用的对象都是弱引用，即垃圾回收机制不将该引用考虑在内。
// 因此，只要所引用的对象的其他引用都被清除，垃圾回收机制就会释放该对象所占用的内存。
// 也就是说，一旦不再需要，WeakMap 里面的键名对象和所对应的键值对会自动消失，不用手动删除引用。
// 基本上，如果你要往对象上添加数据，又不想干扰垃圾回收机制，就可以使用 WeakMap。
// 一个典型应用场景是，在网页的 DOM 元素上添加数据，就可以使用WeakMap结构。当该 DOM 元素被清除，其所对应的WeakMap记录就会自动被移除。
