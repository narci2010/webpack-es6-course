export default function testIterator() {
  var it = makeIterator2(['a', 'b'])

  console.log(it.next()) // { value: "a", done: false }
  console.log(it.next()) // { value: "b", done: false }
  console.log(it.next()) // { value: undefined, done: true }

  // 在 ES6 中，有三类数据结构原生具备 Iterator 接口：数组、某些类似数组的对象、Set 和 Map 结构。
  let arr = ['a', 'b', 'c']
  let iter = arr[Symbol.iterator]()
  console.log(iter.next())
  console.log(iter.next())
  console.log(iter.next())
  console.log(iter.next())

  let aset = new Set([1, 2, 5, 8])
  iter = aset[Symbol.iterator]()
  console.log(iter.next())
  console.log(iter.next())
  console.log(iter.next())
  console.log(iter.next())

  let amap = new Map()
  amap.set('key1', 'value1')
  amap.set('key2', 'value2')
  amap.set(1, 2)
  amap.set(2, 3)
  iter = amap[Symbol.iterator]()
  console.log(iter.next())
  console.log(iter.next())
  console.log(iter.next())
  console.log(iter.next())
  // 对于这三类数据结构，不用自己写遍历器，for…of 循环会自动遍历它们。
  // 除此之外，其他数据结构（主要是对象）的 Iterator 接口，都需要自己在Symbol.iterator属性上面部署，这样才会被 for…of 循环遍历。
  for (var value of range(0, 3)) {
    console.log(value)
  }

  let ao = range(0, 3)
  iter = ao[Symbol.iterator]()
  console.log(iter.next())
  console.log(iter.next())
  console.log(iter.next())
  console.log(iter.next())

  // 指针结构
  var one = new Obj(1)
  var two = new Obj(2)
  var three = new Obj(3)

  one.next = two
  two.next = three

  for (var i of one) {
    console.log(i)
  }
  // 1
  // 2
  // 3

  for (var i of obj) {
    console.log(i)
  }

  //解构赋值
  //对数组和 Set 结构进行解构赋值时，会默认调用 iterator 接口。
  let set = new Set()
    .add('a')
    .add('b')
    .add('c')
  let [x, y] = set
  // x='a'; y='b'
  let [first, ...rest] = set
  // first='a'; rest=['b','c'];
  console.log(x, y, first, rest)

  // 扩展运算符
  // 扩展运算符（…）也会调用默认的 iterator 接口。
  // 例一
  var str = 'hello'
  console.log([...str]) //  ['h','e','l','l','o']
  // 例二
  arr = ['b', 'c']
  console.log(['a', ...arr, 'd'])
  // ['a', 'b', 'c', 'd']

  // 实际上，这提供了一种简便机制，可以将任何部署了
  // iterator 接口的数据结构，转为数组。也就是说，只要某个数据结构部署了 iterator 接口，就可以对它使用扩展运算符，将其转为数组。
  // let arr = [...iterable];

  // ES6 对数组提供 entries()、keys() 和 values() 三个方法，就是返回三个遍历器。
  arr = [1, 5, 7]
  var arrEntries = arr.entries()
  console.log(arrEntries.toString())
  // "[object Array Iterator]"
  console.log(arrEntries === arrEntries[Symbol.iterator]())
  // true

  //字符串是一个类似数组的对象，也原生具有 Iterator 接口。
  var someString = 'hi'
  console.log(typeof someString[Symbol.iterator])
  // "function"
  var iterator = someString[Symbol.iterator]()
  console.log(iterator.next()) // { value: "h", done: false }
  console.log(iterator.next()) // { value: "i", done: false }
  console.log(iterator.next()) // { value: undefined, done: true }

  // 修改系统默认的迭代器
  var str = new String('hi')
  console.log([...str])
  str[Symbol.iterator] = function() {
    return {
      next: function() {
        if (this._first) {
          this._first = false
          return { value: 'bye', done: false }
        } else {
          return { done: true }
        }
      },
      _first: true
    }
  }

  console.log([...str]) // ["bye"]
  console.log(str + '!') // "hi"

  // 部署Symbol.iterator方法的最简单实现，还是使用Generator 函数。

  var myIterable = {}

  myIterable[Symbol.iterator] = function*() {
    yield 1
    yield 2
    yield 3
  }
  console.log([...myIterable]) // [1, 2, 3]

  // 或者采用下面的简洁写法

  let obj2 = {
    *[Symbol.iterator]() {
      yield 'hello'
      yield 'world'
    }
  }

  for (let x of obj2) {
    console.log(x)
  }
  // hello
  // world

  // JavaScript 原有的 for…in 循环，只能获得对象的键名，不能直接获取键值。ES6 提供 for…of 循环，允许遍历获得键值。

  var arr100 = ['a', 'b', 'c', 'd']

  for (let a in arr100) {
    console.log(a) // 0 1 2 3
  }
  for (let a of arr100) {
    console.log(a) // a b c d
  }

  // for…of 循环可以代替数组实例的 forEach 方法。
  const arr101 = ['red', 'green', 'blue']

  arr101.forEach(function(element, index) {
    console.log(element) // red green blue
    console.log(index) // 0 1 2
  })

  let es6 = new Map()
  es6.set('edition', 6)
  es6.set('committee', 'TC39')
  es6.set('standard', 'ECMA-262')
  for (var [name, value] of es6) {
    console.log(name + ': ' + value)
  }

  // arguments对象
  function printArgs() {
    for (let x of arguments) {
      console.log(x)
    }
  }
  printArgs('a', 'b')

  let arrayLike = { length: 3, 0: 'a', 1: 'b', 2: 'w' }

  // 报错 Uncaught TypeError: arrayLike[Symbol.iterator] is not a function
  //   for (let x of arrayLike) {
  //     console.log(x);
  //   }
  // 正确
  for (let x of Array.from(arrayLike)) {
    console.log(x)
  }

  //对于普通的对象，for…of 结构不能直接使用，会报错，必须部署了 iterator 接口后才能使用。但是，这样情况下，for…in 循环依然可以用来遍历键名。
  es6 = {
    edition: 6,
    committee: 'TC39',
    standard: 'ECMA-262'
  }

  for (let e in es6) {
    console.log(e)
  }
  // edition
  // committee
  // standard

  //   for (let e of es6) {
  //     console.log(e);
  //   }
  // TypeError: es6 is not iterable

  //一种解决方法是，使用Object.keys方法将对象的键名生成一个数组，然后遍历这个数组。

  for (var key of Object.keys(es6)) {
    console.log(key + ': ' + es6[key])
  }

  // 另一个方法是使用 Generator 函数将对象重新包装一下。

  function* entries(es6) {
    for (let key of Object.keys(es6)) {
      yield [key, es6[key]]
    }
  }

  for (let [key, value] of entries(es6)) {
    console.log(key, '->', value)
  }
}

function makeIterator(array) {
  var nextIndex = 0
  return {
    next: function() {
      return nextIndex < array.length
        ? { value: array[nextIndex++], done: false }
        : { value: undefined, done: true }
    }
  }
}

function makeIterator2(array) {
  var nextIndex = 0
  return {
    next: function() {
      return nextIndex < array.length
        ? { value: array[nextIndex++] }
        : { done: true }
    }
  }
}

//   S6 规定，默认的 Iterator 接口部署在数据结构的Symbol.iterator属性，或者说，一个数据结构只要具有Symbol.iterator属性，就可以认为是“可遍历的”（iterable）。
//   Symbol.iterator属性本身是一个函数，就是当前数据结构默认的遍历器生成函数。
class RangeIterator {
  constructor(start, stop) {
    this.value = start
    this.stop = stop
  }

  [Symbol.iterator]() {
    return this
  }

  next() {
    var value = this.value
    if (value < this.stop) {
      this.value++
      return { done: false, value: value }
    } else {
      return { done: true, value: undefined }
    }
  }
}

function range(start, stop) {
  return new RangeIterator(start, stop)
}

// 下面是通过遍历器实现指针结构的例子。
function Obj(value) {
  this.value = value
  this.next = null
}

Obj.prototype[Symbol.iterator] = function() {
  var iterator = {
    next: next
  }

  var current = this

  function next() {
    if (current) {
      var value = current.value
      var done = current == null
      current = current.next
      return {
        done: done,
        value: value
      }
    } else {
      return {
        done: true
      }
    }
  }
  return iterator
}
// 另外一种定义对象迭代器方法
let obj = {
  data: ['hello', 'world'],
  [Symbol.iterator]() {
    const self = this
    let index = 0
    return {
      next() {
        if (index < self.data.length) {
          return {
            value: self.data[index++],
            done: false
          }
        } else {
          return { value: undefined, done: true }
        }
      }
    }
  }
}
