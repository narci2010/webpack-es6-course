// 函数参数的默认值
// 基本用法
// ES6 之前，不能直接为函数的参数指定默认值，只能采用变通的方法。
function log(x, y) {
  y = y || 'World'
  console.log(x, y)
}
log('Hello') // Hello World
log('Hello', 'China') // Hello China
log('Hello', '') // Hello World
// 上面代码检查函数log的参数y有没有赋值，如果没有，则指定默认值为World。
// 这种写法的缺点在于，如果参数y赋值了，但是对应的布尔值为false，则该赋值不起作用。
// 就像上面代码的最后一行，参数y等于空字符，结果被改为默认值。
// 为了避免这个问题，通常需要先判断一下参数y是否被赋值，如果没有，再等于默认值。
// if (typeof y === 'undefined') {s
//   y = 'World';
// }

// ES6 允许为函数的参数设置默认值，即直接写在参数定义的后面。
// function log(x, y = 'World') {
//   console.log(x, y);
// }
// log('Hello') // Hello World
// log('Hello', 'China') // Hello China
// log('Hello', '') // Hello
// 可以看到，ES6 的写法比 ES5 简洁许多，而且非常自然。下面是另一个例子。
// function Point(x = 0, y = 0) {
//   this.x = x;
//   this.y = y;
// }
// const p = new Point();
// p // { x: 0, y: 0 }
// 除了简洁，ES6 的写法还有两个好处：首先，阅读代码的人，可以立刻意识到哪些参数是可以省略的，
// 不用查看函数体或文档；其次，有利于将来的代码优化，即使未来的版本在对外接口中，彻底拿掉这个参数，
// 也不会导致以前的代码无法运行。
// 参数变量是默认声明的，所以不能用let或const再次声明。
// function foo(x = 5) {
//   let x = 1; // error
//   const x = 2; // error
// }
// 上面代码中，参数变量x是默认声明的，在函数体中，不能用let或const再次声明，否则会报错。
// 使用参数默认值时，函数不能有同名参数。
// // 不报错
// function foo(x, x, y) {
//   // ...
// }

// // 报错
// function foo(x, x, y = 1) {
//   // ...
// }
// // SyntaxError: Duplicate parameter name not allowed in this context
// 另外，一个容易忽略的地方是，参数默认值不是传值的，而是每次都重新计算默认值表达式的值。
// 也就是说，参数默认值是惰性求值的。
// let x = 99;
// function foo(p = x + 1) {
//   console.log(p);
// }
// foo() // 100
// x = 100;
// foo() // 101
// 上面代码中，参数p的默认值是x + 1。这时，每次调用函数foo，都会重新计算x + 1，而不是默认p等于 100。

// 与解构赋值默认值结合使用
// 参数默认值可以与解构赋值的默认值，结合起来使用。
function foo({ x, y = 5 }) {
  console.log(x, y)
}
foo({}) // undefined 5
foo({ x: 1 }) // 1 5
foo({ x: 1, y: 2 }) // 1 2
//foo() // TypeError: Cannot read property 'x' of undefined
// 上面代码只使用了对象的解构赋值默认值，没有使用函数参数的默认值。
// 只有当函数foo的参数是一个对象时，变量x和y才会通过解构赋值生成。
// 如果函数foo调用时没提供参数，变量x和y就不会生成，从而报错。
// 通过提供函数参数的默认值，就可以避免这种情况。
function foo2({ x, y = 5 } = {}) {
  console.log(x, y)
}
foo2() // undefined 5
// 上面代码指定，如果没有提供参数，函数foo的参数默认为一个空对象。

// 下面是另一个解构赋值默认值的例子。
// function fetch(url, { body = '', method = 'GET', headers = {} }) {
//   console.log(method);
// }
// fetch('http://example.com', {})
// // "GET"
// fetch('http://example.com')
// // 报错
// 上面代码中，如果函数fetch的第二个参数是一个对象，就可以为它的三个属性设置默认值。
// 这种写法不能省略第二个参数，如果结合函数参数的默认值，就可以省略第二个参数。这时，就出现了双重默认值。
function fetch(url, { body = '', method = 'GET', headers = {} } = {}) {
  console.log(method)
}
fetch('http://example.com') // "GET"
// 上面代码中，函数fetch没有第二个参数时，函数参数的默认值就会生效，然后才是解构赋值的默认值生效，变量method才会取到默认值GET。

// 写法一
function m1({ x = 0, y = 0 } = {}) {
  console.log([x, y])
}
// 写法二
function m2({ x, y } = { x: 0, y: 0 }) {
  console.log([x, y])
}
//    上面两种写法都对函数的参数设定了默认值，区别是写法一函数参数的默认值是空对象，
//    但是设置了对象解构赋值的默认值；写法二函数参数的默认值是一个有具体属性的对象，但是没有设置对象解构赋值的默认值。
// 函数没有参数的情况
m1() // [0, 0]
m2() // [0, 0]
// x 和 y 都有值的情况
m1({ x: 3, y: 8 }) // [3, 8]
m2({ x: 3, y: 8 }) // [3, 8]
// x 有值，y 无值的情况
m1({ x: 3 }) // [3, 0]
m2({ x: 3 }) // [3, undefined]
// x 和 y 都无值的情况
m1({}) // [0, 0];
m2({}) // [undefined, undefined]
m1({ z: 3 }) // [0, 0]
m2({ z: 3 }) // [undefined, undefined]

// 参数默认值的位置
// 通常情况下，定义了默认值的参数，应该是函数的尾参数。因为这样比较容易看出来，到底省略了哪些参数。
// 如果非尾部的参数设置默认值，实际上这个参数是没法省略的。
// 例一
function f(x = 1, y) {
  console.log([x, y])
}
f() // [1, undefined]
f(2) // [2, undefined])
// f(, 1) // 报错
f(undefined, 1) // [1, 1]
// 例二
function f2(x, y = 5, z) {
  return [x, y, z]
}
f2() // [undefined, 5, undefined]
f2(1) // [1, 5, undefined]
// f2(1, ,2) // 报错
f2(1, undefined, 2) // [1, 5, 2]
// 上面代码中，有默认值的参数都不是尾参数。这时，无法只省略该参数，
// 而不省略它后面的参数，除非显式输入undefined。
// 如果传入undefined，将触发该参数等于默认值，null则没有这个效果。
function foo3(x = 5, y = 6) {
  console.log(x, y)
}
foo3(undefined, null) // 5 null
// 上面代码中，x参数对应undefined，结果触发了默认值，y参数等于null，就没有触发默认值。

// 函数的 length 属性
// 指定了默认值以后，函数的length属性，将返回没有指定默认值的参数个数。也就是说，指定了默认值后，length属性将失真。
console.log(function(a) {}.length) // 1
console.log(function(a = 5) {}.length) // 0
console.log(function(a, b, c = 5) {}.length) // 2
// 上面代码中，length属性的返回值，等于函数的参数个数减去指定了默认值的参数个数。比如，上面最后一个函数，
// 定义了 3 个参数，其中有一个参数c指定了默认值，因此length属性等于3减去1，最后得到2。
// 这是因为length属性的含义是，该函数预期传入的参数个数。某个参数指定默认值以后，预期传入的参数个数就不包括这个参数了。
// 同理，后文的 rest 参数也不会计入length属性。
console.log(function(...args) {}.length) // 0
// 如果设置了默认值的参数不是尾参数，那么length属性也不再计入后面的参数了。
console.log(function(a = 0, b, c) {}.length) // 0
console.log(function(a, b = 1, c) {}.length) // 1

// 作用域
// 一旦设置了参数的默认值，函数进行声明初始化时，参数会形成一个单独的作用域（context）。
// 等到初始化结束，这个作用域就会消失。这种语法行为，在不设置参数默认值时，是不会出现的。
var x1 = 1
function f1(x1, y1 = x1) {
  console.log(y1)
}
f1(2) // 2
// 上面代码中，参数y的默认值等于变量x。调用函数f时，参数形成一个单独的作用域。
// 在这个作用域里面，默认值变量x指向第一个参数x，而不是全局变量x，所以输出是2。
// 再看下面的例子。
let x2 = 1
function f3(y2 = x2) {
  let x2 = 2
  console.log(y2)
}
f3() // 1
// 上面代码中，函数f调用时，参数y = x形成一个单独的作用域。这个作用域里面，
// 变量x本身没有定义，所以指向外层的全局变量x。函数调用时，函数体内部的局部变量x影响不到默认值变量x。
// 如果此时，全局变量x不存在，就会报错。
// function f(y = x) {
//   let x = 2;
//   console.log(y);
// }
// f() // ReferenceError: x is not defined
// 下面这样写，也会报错。
// var x = 1;
// function foo(x = x) {
//   // ...
// }
// foo() // ReferenceError: x is not defined
// 上面代码中，参数x = x形成一个单独作用域。实际执行的是let x = x，由于暂时性死区的原因，这行代码会报错”x 未定义“。

// 如果参数的默认值是一个函数，该函数的作用域也遵守这个规则。请看下面的例子。
// let foo = 'outer';
// function bar(func = () => foo) {
//   let foo = 'inner';
//   console.log(func());
// }
// bar(); // outer
// 上面代码中，函数bar的参数func的默认值是一个匿名函数，返回值为变量foo。函数参数形成的单独作用域里面，
// 并没有定义变量foo，所以foo指向外层的全局变量foo，因此输出outer。
// 如果写成下面这样，就会报错。
// function bar(func = () => foo) {
//   let foo = 'inner';
//   console.log(func());
// }
// bar() // ReferenceError: foo is not defined
// 上面代码中，匿名函数里面的foo指向函数外层，但是函数外层并没有声明变量foo，所以就报错了。

// 下面是一个更复杂的例子。
// var x = 1;
// function foo(x, y = function() { x = 2; }) {
//   var x = 3;
//   y();
//   console.log(x);
// }
// foo() // 3
// x // 1
// 上面代码中，函数foo的参数形成一个单独作用域。这个作用域里面，首先声明了变量x，
// 然后声明了变量y，y的默认值是一个匿名函数。这个匿名函数内部的变量x，指向同一个作用域的第一个参数x。
// 函数foo内部又声明了一个内部变量x，该变量与第一个参数x由于不是同一个作用域，所以不是同一个变量，
// 因此执行y后，内部变量x和外部全局变量x的值都没变。
// 如果将var x = 3的var去除，函数foo的内部变量x就指向第一个参数x，与匿名函数内部的x是一致的，所以最后输出的就是2，
// 而外层的全局变量x依然不受影响。
var x8 = 1
function foo8(
  x8,
  y8 = function() {
    x8 = 2
  }
) {
  x8 = 3
  y8()
  console.log(x8)
}
foo8() // 2
console.log(x8) // 1

// 应用
// 利用参数默认值，可以指定某一个参数不得省略，如果省略就抛出一个错误。
// function throwIfMissing() {
//   throw new Error('Missing parameter')
// }
// function foo9(mustBeProvided = throwIfMissing()) {
//   return mustBeProvided
// }
// foo9()
// Error: Missing parameter
// 上面代码的foo函数，如果调用的时候没有参数，就会调用默认值throwIfMissing函数，从而抛出一个错误。
// 从上面代码还可以看到，参数mustBeProvided的默认值等于throwIfMissing函数的运行结果（注意函数名throwIfMissing之后有一对圆括号），
// 这表明参数的默认值不是在定义时执行，而是在运行时执行。如果参数已经赋值，默认值中的函数就不会运行。
// 另外，可以将参数默认值设为undefined，表明这个参数是可以省略的。
// function foo(optional = undefined) { ··· }

// rest 参数
// ES6 引入 rest 参数（形式为...变量名），用于获取函数的多余参数，这样就不需要使用arguments对象了。
// rest 参数搭配的变量是一个数组，该变量将多余的参数放入数组中。
function add(...values) {
  let sum = 0
  for (var val of values) {
    sum += val
  }
  return sum
}
console.log(add(2, 5, 3)) // 10
// 上面代码的add函数是一个求和函数，利用 rest 参数，可以向该函数传入任意数目的参数。

// 下面是一个 rest 参数代替arguments变量的例子。
// // arguments变量的写法
// function sortNumbers() {
//   return Array.prototype.slice.call(arguments).sort();
// }
// // rest参数的写法
// const sortNumbers = (...numbers) => numbers.sort();
// 上面代码的两种写法，比较后可以发现，rest 参数的写法更自然也更简洁。

// arguments对象不是数组，而是一个类似数组的对象。所以为了使用数组的方法，必须使用Array.prototype.slice.call先将其转为数组。
// rest 参数就不存在这个问题，它就是一个真正的数组，数组特有的方法都可以使用。下面是一个利用 rest 参数改写数组push方法的例子。
// function push(array, ...items) {
//   items.forEach(function(item) {
//     array.push(item);
//     console.log(item);
//   });
// }
// var a = [];
// push(a, 1, 2, 3)
// 注意，rest 参数之后不能再有其他参数（即只能是最后一个参数），否则会报错。
// // 报错
// function f(a, ...b, c) {
//   // ...
// }
// 函数的length属性，不包括 rest 参数。
// (function(a) {}).length  // 1
// (function(...a) {}).length  // 0
// (function(a, ...b) {}).length  // 1

// 严格模式
// 从 ES5 开始，函数内部可以设定为严格模式。
function doSomething(a, b) {
  'use strict'
  console.log(a, b)
}
doSomething(1, 2)
// ES2016 做了一点修改，规定只要函数参数使用了默认值、解构赋值、或者扩展运算符，那么函数内部就不能显式设定为严格模式，否则会报错。
// 报错
// function doSomething2(a, b = a) {
//   'use strict'
//   console.log(a, b)
// }

// 箭头函数
// 基本用法
// ES6 允许使用“箭头”（=>）定义函数。
var ff = v => v
var value = ff(100)
console.log(value)
// 等同于
// var f = function (v) {
//   return v;
// };

// 如果箭头函数不需要参数或需要多个参数，就使用一个圆括号代表参数部分。
// var f = () => 5;
// // 等同于
// var f = function () { return 5 };
// var sum = (num1, num2) => num1 + num2;
// // 等同于
// var sum = function(num1, num2) {
//   return num1 + num2;
// };

// 由于大括号被解释为代码块，所以如果箭头函数直接返回一个对象，必须在对象外面加上括号，否则会报错。
// 报错
// let getTempItem1 = id => { id: id, name: "Temp" };
// 不报错
let getTempItem2 = id => ({ id: id, name: 'Temp' })
console.log(getTempItem2(100))

// 下面是一种特殊情况，虽然可以运行，但会得到错误的结果。
let foo100 = () => {
  a: 1
}
console.log(foo100()) // undefined
// 上面代码中，原始意图是返回一个对象{ a: 1 }，但是由于引擎认为大括号是代码块，所以执行了一行语句a: 1。
// 这时，a可以被解释为语句的标签，因此实际执行的语句是1;，然后函数就结束了，没有返回值。

// 箭头函数可以与变量解构结合使用。
// const full = ({ first, last }) => first + ' ' + last;
// // 等同于
// function full(person) {
//   return person.first + ' ' + person.last;
// }
// 箭头函数使得表达更加简洁。
// const isEven = n => n % 2 === 0;
// const square = n => n * n;
// 上面代码只用了两行，就定义了两个简单的工具函数。如果不用箭头函数，可能就要占用多行，而且还不如现在这样写醒目。

// 箭头函数的一个用处是简化回调函数。
// 正常函数写法
// [1,2,3].map(function (x) {
//   return x * x;
// });
// 箭头函数写法
console.log([1, 2, 3].map(x => x * x))

// 使用注意点
// 箭头函数有几个使用注意点。
// （1）函数体内的this对象，就是定义时所在的对象，而不是使用时所在的对象。
// （2）不可以当作构造函数，也就是说，不可以使用new命令，否则会抛出一个错误。
// （3）不可以使用arguments对象，该对象在函数体内不存在。如果要用，可以用 rest 参数代替。
// （4）不可以使用yield命令，因此箭头函数不能用作 Generator 函数。
// 上面四点中，第一点尤其值得注意。this对象的指向是可变的，但是在箭头函数中，它是固定的。
function foo501() {
  setTimeout(() => {
    console.log('id:', this.id)
  }, 100)
}
var id = 21
foo501.call({ id: 42 })
// id: 42

// 不适用场合
// 由于箭头函数使得this从“动态”变成“静态”，下面两个场合不应该使用箭头函数。
// 第一个场合是定义对象的方法，且该方法内部包括this。
// const cat = {
//   lives: 9,
//   jumps: () => {
//     this.lives--;
//   }
// }
// 上面代码中，cat.jumps()方法是一个箭头函数，这是错误的。调用cat.jumps()时，如果是普通函数，该方法内部的this指向cat；
// 如果写成上面那样的箭头函数，使得this指向全局对象，因此不会得到预期结果。这是因为对象不构成单独的作用域，
// 导致jumps箭头函数定义时的作用域就是全局作用域。
// 第二个场合是需要动态this的时候，也不应使用箭头函数。
// var button = document.getElementById('press');
// button.addEventListener('click', () => {
//   this.classList.toggle('on');
// });
// 上面代码运行时，点击按钮会报错，因为button的监听函数是一个箭头函数，导致里面的this就是全局对象。
// 如果改成普通函数，this就会动态指向被点击的按钮对象。
// 另外，如果函数体很复杂，有许多行，或者函数内部有大量的读写操作，不单纯是为了计算值，这时也不应该使用箭头函数，
// 而是要使用普通函数，这样可以提高代码可读性。
