const { log } = console
// 属性的简洁表示法
// ES6 允许直接写入变量和函数，作为对象的属性和方法。这样的书写更加简洁。
const foo = 'bar'
const baz = { foo }
log(baz) // {foo: "bar"}
// 等同于
// const baz = {foo: foo};

// 上面代码表明，ES6 允许在对象之中，直接写变量。这时，属性名为变量名, 属性值为变量的值。下面是另一个例子。
function f(x, y) {
  return { x, y }
}
// 等同于
// function f(x, y) {
//   return {x: x, y: y};
// }
log(f(1, 2)) // Object {x: 1, y: 2}

// 除了属性简写，方法也可以简写。
const o = {
  method() {
    return 'Hello!'
  }
}
// // 等同于
// const o = {
//   method: function() {
//     return "Hello!";
//   }
// };
log(o.method())

// 如果某个方法的值是一个 Generator 函数，前面需要加上星号。
// const obj = {
//   * m() {
//     yield 'hello world';
//   }

// 属性名表达式
// JavaScript 定义对象的属性，有两种方法。
// 方法一
let obj = {}
obj.foo = true
// 方法二
obj['a' + 'bc'] = 123
// 上面代码的方法一是直接用标识符作为属性名，方法二是用表达式作为属性名，这时要将表达式放在方括号之内。
log(obj)

// 但是，如果使用字面量方式定义对象（使用大括号），在 ES5 中只能使用方法一（标识符）定义属性。
// {
//   foo: true,
//   abc: 123
// };
// ES6 允许字面量定义对象时，用方法二（表达式）作为对象的属性名，即把表达式放在方括号内。
let propKey = 'foo'
let obj2 = {
  [propKey]: true,
  ['a' + 'bc']: 123
}
log(obj2)

// 注意，属性名表达式与简洁表示法，不能同时使用，会报错。
// // 报错
// const foo = 'bar';
// const bar = 'abc';
// const baz = { [foo] };
// // 正确
// const foo = 'bar';
// const baz = { [foo]: 'abc'};

// 注意，属性名表达式如果是一个对象，默认情况下会自动将对象转为字符串[object Object]，这一点要特别小心。
const keyA = { a: 1 }
const keyB = { b: 2 }
const myObject = {
  [keyA]: 'valueA',
  [keyB]: 'valueB'
}
log(myObject) // Object {[object Object]: "valueB"}
// 上面代码中，[keyA]和[keyB]得到的都是[object Object]，所以[keyB]会把[keyA]覆盖掉，而myObject最后只有一个[object Object]属性。

// 方法的 name 属性
// 函数的name属性，返回函数名。对象方法也是函数，因此也有name属性。
// const person = {
//   sayName() {
//     console.log('hello!');
//   },
// };
// person.sayName.name   // "sayName"
// 上面代码中，方法的name属性返回函数名（即方法名）。
// 如果对象的方法使用了取值函数（getter）和存值函数（setter），则name属性不是在该方法上面，
// 而是该方法的属性的描述对象的get和set属性上面，返回值是方法名前加上get和set。
const obj15 = {
  get foo() {},
  set foo(x) {}
}
// obj.foo.name
// TypeError: Cannot read property 'name' of undefined
const descriptor = Object.getOwnPropertyDescriptor(obj15, 'foo')
log(descriptor.get.name) // "get foo"
log(descriptor.set.name) // "set foo"

// 有两种特殊情况：bind方法创造的函数，name属性返回bound加上原函数的名字；Function构造函数创造的函数，name属性返回anonymous。
// (new Function()).name // "anonymous"
// var doSomething = function() {
//   // ...
// };
// doSomething.bind().name // "bound doSomething"
// 如果对象的方法是一个 Symbol 值，那么name属性返回的是这个 Symbol 值的描述。
// const key1 = Symbol('description');
// const key2 = Symbol();
// let obj = {
//   [key1]() {},
//   [key2]() {},
// };
// obj[key1].name // "[description]"
// obj[key2].name // ""
// 上面代码中，key1对应的 Symbol 值有描述，key2没有。

// 属性的可枚举性和遍历
// 可枚举性
// 对象的每个属性都有一个描述对象（Descriptor），用来控制该属性的行为。Object.getOwnPropertyDescriptor方法可以获取该属性的描述对象。
let obj22 = { foo: 123 }
log(Object.getOwnPropertyDescriptor(obj22, 'foo'))
//  {
//    value: 123,
//    writable: true,
//    enumerable: true,
//    configurable: true
//  }
// 描述对象的enumerable属性，称为“可枚举性”，如果该属性为false，就表示某些操作会忽略当前属性。

// 目前，有四个操作会忽略enumerable为false的属性。
// for...in循环：只遍历对象自身的和继承的可枚举的属性。
// Object.keys()：返回对象自身的所有可枚举的属性的键名。
// JSON.stringify()：只串行化对象自身的可枚举的属性。
// Object.assign()： 忽略enumerable为false的属性，只拷贝对象自身的可枚举的属性。
// 这四个操作之中，前三个是 ES5 就有的，最后一个Object.assign()是 ES6 新增的。
// 其中，只有for...in会返回继承的属性，其他三个方法都会忽略继承的属性，只处理对象自身的属性。实际上，引入“可枚举”（enumerable）这个概念的最初目的，
// 就是让某些属性可以规避掉for...in操作，不然所有内部属性和方法都会被遍历到。
// 比如，对象原型的toString方法，以及数组的length属性，就通过“可枚举性”，从而避免被for...in遍历到。
log(Object.getOwnPropertyDescriptor(Object.prototype, 'toString').enumerable)
// false
log(Object.getOwnPropertyDescriptor([], 'length').enumerable)
// false
// 上面代码中，toString和length属性的enumerable都是false，因此for...in不会遍历到这两个继承自原型的属性。

// 另外，ES6 规定，所有 Class 的原型的方法都是不可枚举的。
log(
  Object.getOwnPropertyDescriptor(
    class {
      foo() {}
    }.prototype,
    'foo'
  ).enumerable
)
// false
// 总的来说，操作中引入继承的属性会让问题复杂化，大多数时候，我们只关心对象自身的属性。所以，尽量不要用for...in循环，而用Object.keys()代替。

// 属性的遍历
// ES6 一共有 5 种方法可以遍历对象的属性。
// （1）for…in
// for...in循环遍历对象自身的和继承的可枚举属性（不含 Symbol 属性）。
// （2）Object.keys(obj)
// Object.keys返回一个数组，包括对象自身的（不含继承的）所有可枚举属性（不含 Symbol 属性）的键名。
// （3）Object.getOwnPropertyNames(obj)
// Object.getOwnPropertyNames返回一个数组，包含对象自身的所有属性（不含 Symbol 属性，但是包括不可枚举属性）的键名。
// （4）Object.getOwnPropertySymbols(obj)
// Object.getOwnPropertySymbols返回一个数组，包含对象自身的所有 Symbol 属性的键名。
// （5）Reflect.ownKeys(obj)
// Reflect.ownKeys返回一个数组，包含对象自身的所有键名，不管键名是 Symbol 或字符串，也不管是否可枚举。
// 以上的 5 种方法遍历对象的键名，都遵守同样的属性遍历的次序规则。
// 首先遍历所有数值键，按照数值升序排列。
// 其次遍历所有字符串键，按照加入时间升序排列。
// 最后遍历所有 Symbol 键，按照加入时间升序排列。
log(Reflect.ownKeys({ [Symbol()]: 0, b: 0, 10: 0, 2: 0, a: 0 }))
// ['2', '10', 'b', 'a', Symbol()]
// 上面代码中，Reflect.ownKeys方法返回一个数组，包含了参数对象的所有属性。这个数组的属性次序是这样的，
// 首先是数值属性2和10，其次是字符串属性b和a，最后是 Symbol 属性。

// super 关键字
// 我们知道，this关键字总是指向函数所在的当前对象，ES6 又新增了另一个类似的关键字super，指向当前对象的原型对象。
const proto = {
  foo: 'hello'
}
const obj55 = {
  foo: 'world',
  find() {
    return super.foo
  }
}
log(Object.setPrototypeOf(obj55, proto))
log(obj55.find()) // "hello"
// 上面代码中，对象obj.find()方法之中，通过super.foo引用了原型对象proto的foo属性。

// 注意，super关键字表示原型对象时，只能用在对象的方法之中，用在其他地方都会报错。
// 报错
// const obj81 = {
//   foo: super.foo
// }
// 报错
// const obj82 = {
//   foo: () => super.foo
// }
// 报错
// const obj83 = {
//   foo: function() {
//     return super.foo
//   }
// }
// 上面三种super的用法都会报错，因为对于 JavaScript 引擎来说，这里的super都没有用在对象的方法之中。
// 第一种写法是super用在属性里面，第二种和第三种写法是super用在一个函数里面，然后赋值给foo属性。
// 目前，只有对象方法的简写法可以让 JavaScript 引擎确认，定义的是对象的方法。

// JavaScript 引擎内部，super.foo等同于Object.getPrototypeOf(this).foo（属性）或Object.getPrototypeOf(this).foo.call(this)（方法）。
const proto2 = {
  x: 'hello',
  foo() {
    console.log(this.x)
  }
}
const obj91 = {
  x: 'world',
  foo() {
    super.foo()
  }
}
Object.setPrototypeOf(obj91, proto2)
obj91.foo() // "world"
// 上面代码中，super.foo指向原型对象proto的foo方法，但是绑定的this却还是当前对象obj，因此输出的就是world。
