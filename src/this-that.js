export default function testThis() {
  // 1 . this
  // 什么是this ？在讨论this绑定前，我们得先搞清楚this代表什么。
  // this是JavaScript的关键字之一。它是 对象 自动生成的一个内部对象，只能在 对象 内部使用。随着函数使用场合的不同，this的值会发生变化。
  // this指向什么，完全取决于 什么地方以什么方式调用，而不是 创建时。（比较多人误解的地方）（它非常语义化，this在英文中的含义就是这，
  // 这个 ，但这其实起到了一定的误导作用，因为this并不是一成不变的，并不一定一直指向当前 这个）

  //   2 . this 绑定规则
  // 掌握了下面介绍的4种绑定的规则，那么你只要看到函数调用就可以判断 this 的指向了。
  // 2 .1 默认绑定
  // 考虑下面代码:
  //window.a = 10
  // var a = 10
  // console.log(this.a) // 非严格模式下全局的var a==window.a
  function foo() {
    var a = 1
    console.log(this) //严格模式(use strict)下 是undefined，非严格模式是window
  }
  foo()
  // 这种就是典型的默认绑定，我们看看foo调用的位置，”光杆司令“，像 这种直接使用而不带任何修饰的函数调用 ，就 默认且只能 应用 默认绑定。
  // 那默认绑定到哪呢，一般是window上，严格模式(use strict)下 是undefined。

  //   2 .2 隐性绑定
  // 代码说话:
  function foo2() {
    console.log(this.a)
  }
  var obj = {
    a: 10,
    foo2: foo2
  }
  obj.foo2() // ?
  // foo2() // 严格模式下无法通过编译
  // 答案 :  10 undefined
  // foo()的这个写法熟悉吗，就是我们刚刚写的默认绑定,等价于打印window.a,故输出undefined ,
  // 下面obj.foo()这种大家应该经常写，这其实就是我们马上要讨论的 隐性绑定 。
  // 函数foo执行的时候有了上下文对象，即 obj。这种情况下，函数里的this默认绑定为上下文对象，等价于打印obj.a,故输出10 。
  // 如果是链性的关系，比如 xx.yy.obj.foo();, 上下文取函数的直接上级，即紧挨着的那个，或者说对象链的最后一个。

  //   2 .3 显性绑定
  // 2 .3 .1 隐性绑定的限制
  // 在我们刚刚的 隐性绑定中有一个致命的限制，就是上下文必须包含我们的函数 ，例：var obj = { foo : foo },
  // 如果上下文不包含我们的函数用隐性绑定明显是要出错的，不可能每个对象都要加这个函数 ,
  // 那样的话扩展,维护性太差了，我们接下来聊的就是直接 给函数强制性绑定this。
  // 2 .3 .2 call apply bind
  // 这里我们就要用到 js 给我们提供的函数 call 和 apply，它们的作用都是改变函数的this指向，第一个参数都是 设置this对象。
  // 两个函数的区别：
  // call从第二个参数开始所有的参数都是 原函数的参数。
  // apply只接受两个参数，且第二个参数必须是数组，这个数组代表原函数的参数列表。
  // 例如：
  function foo3(a, b) {
    console.log('this:' + this + ' params:' + a + b)
  }
  foo3.call(null, '海洋', '饼干') // 海洋饼干  这里this指向不重要就写null了
  foo3.apply(window, ['海洋', '饼干']) // 海洋饼干
  // window.foo3(5, 1)  //Uncaught TypeError: window.foo3 is not a function
  // 除了 call，apply函数以外，还有一个改变this的函数 bind ，它和call,apply都不同。
  // bind只有一个函数，且不会立刻执行，只是将一个值绑定到函数的this上,并将绑定好的函数返回。例:
  function foo4() {
    console.log(this.a)
  }
  var obj2 = { a: 10 }
  foo4 = foo4.bind(obj2)
  foo4() // 10
  // 2 .3 .2 显性绑定
  // 开始正题，上代码，就用上面隐性绑定的例子 :
  function foo5() {
    console.log(this.a)
  }
  var obj3 = {
    a: 10 //去掉里面的foo
  }
  foo5.call(obj3) // 10
  // 我们将隐性绑定例子中的 上下文对象 里的函数去掉了，显然现在不能用 上下文.函数 这种形式来调用函数，
  // 大家看代码里的显性绑定代码foo.call(obj)，看起来很怪，和我们之前所了解的函数调用不一样。
  // 其实call 是 foo 上的一个函数,在改变this指向的同时执行这个函数。

  //   2 .4 new 绑定
  // 2 .4 .1 什么是 new
  // 学过面向对象的小伙伴对new肯定不陌生，js的new和传统的面向对象语言的new的作用都是创建一个新的对象，但是他们的机制完全不同。
  // 创建一个新对象少不了一个概念，那就是构造函数，传统的面向对象 构造函数 是类里的一种特殊函数，
  // 要创建对象时使用new 类名()的形式去调用类中的构造函数，而js中就不一样了。
  // js中的只要用new修饰的 函数就是'构造函数'，准确来说是 函数的构造调用，因为在js中并不存在所谓的'构造函数'。
  // 那么用new 做到函数的构造调用后，js帮我们做了什么工作呢:
  // 创建一个新对象。
  // 把这个新对象的__proto__属性指向 原函数的prototype属性。(即继承原函数的原型)
  // 将这个新对象绑定到 此函数的this上 。
  // 返回新对象，如果这个函数没有返回其他对象。
  // 第三条就是我们下面要聊的new绑定
  // 2 .4 .2 new 绑定
  // 不哔哔，看代码:
  function foo6() {
    this.a = 10
    console.log(this)
  }
  var obj = new foo6() // foo{ a : 10 }  创建的新对象的默认名为函数名
  // 然后等价于 foo { a : 10 };  var obj = foo;
  console.log(obj.a) // 10    new绑定
  // 使用new调用函数后，函数会 以自己的名字 命名 和 创建 一个新的对象，并返回。
  //   特别注意 : 如果原函数返回一个对象类型，那么将无法返回新对象,你将丢失绑定this的新对象，例:
  function foo7() {
    this.a = 10
    return new String('捣蛋鬼')
  }
  var obj7 = new foo7()
  console.log(obj7.a) // undefined
  console.log(obj7) // "捣蛋鬼"

  //   2 .5 this绑定优先级
  // new 绑定 > 显示绑定 > 隐式绑定 > 默认绑定

  //   总结
  // 如果函数被new 修饰
  // this绑定的是新创建的对象，例:var bar = new foo(); 函数 foo 中的 this 就是一个叫foo的新创建的对象 ,
  // 然后将这个对象赋给bar , 这样的绑定方式叫 new绑定 .
  // 如果函数是使用call,apply,bind来调用的
  // this绑定的是 call,apply,bind 的第一个参数.例: foo.call(obj); , foo 中的 this 就是 obj , 这样的绑定方式叫 显性绑定 .
  // 如果函数是在某个 上下文对象 下被调用
  // this绑定的是那个上下文对象，例 : var obj = { foo : foo }; obj.foo(); foo 中的 this 就是 obj . 这样的绑定方式叫 隐性绑定 .
  // 如果都不是，即使用默认绑定
  //    例:function foo(){...} foo() ,foo 中的 this 就是 window.(严格模式下默认绑定到undefined).
  //    这样的绑定方式叫 默认绑定 .

  //   4 . 面试题解析
  // 1.
  var x = 10
  var obj = {
    x: 20,
    f: function() {
      console.log(this.x) // ?
      var foo = function() {
        console.log(this) //严格模式undefined
      }
      foo() // ?
    }
  }
  obj.f()
  // -----------------------答案---------------------
  // 答案 ： 20 undefined
  // 解析 ：考点 1. this默认绑定 2. this隐性绑定

  //   2.
  function foo8(arg) {
    this.a = arg
    return this
  }
  var a = new foo8(1)
  //   var b = foo8(10) //没有new不会创建对象，没有this
  console.log(a.a) // ?
  // console.log(b.a) // ?

  //3. 压轴题了
  function foo9() {
    getName = function() {
      console.log(1)
    }
    return this
  }
  foo9.getName = function() {
    //这个getName和上面的不同，是直接添加到foo上的
    console.log(2)
  }
  foo9.prototype.getName = function() {
    // 这个getName直接添加到foo的原型上，在用new创建新对象时将直接添加到新对象上
    console.log(3)
  }
  var getName = function() {
    // 和foo函数里的getName一样, 将创建到全局window上 严格模式下不绑定到window对象
    console.log(4)
  }
  function getName() {
    // 同上，但是这个函数不会被使用，因为函数声明的提升优先级最高，所以上面的函数表达式将永远替换
    // 这个同名函数，除非在函数表达式赋值前去调用getName()，但是在本题中，函数调用都在函数表达式
    // 之后，所以这个函数可以忽略了
    console.log(5)
  }
  foo9.getName() // 2
  getName() // 4
  // foo9().getName() // foo9返回的this，严格模式下undefined
  getName() // 4
  new foo9.getName() // 2
  new foo9().getName() // 3
  new new foo9().getName() // 3
  // 哈哈，这个看上去很吓人，让我们来分解一下：
  // var obj = new foo();
  // var obj1 = new obj.getName();
  // 好了，仔细看看, 这不就是上两题的合体吗,obj 有getName 3, 即输出3
  // obj 是一个函数名为 foo的对象,obj1是一个函数名为obj.getName的对象

  //   5 . 箭头函数的this绑定 (2017.9.18更新)
  // 箭头函数，一种特殊的函数，不使用function关键字，而是使用=>，学名 胖箭头(2333),它和普通函数的区别：
  // 箭头函数不使用我们上面介绍的四种绑定，而是完全根据外部作用域来决定this。(它的父级是使用我们的规则的哦)
  // 箭头函数的this绑定无法被修改 (这个特性非常爽（滑稽）)
  // 先看个代码巩固一下：
  function foo10() {
    return () => {
      console.log(this.a)
    }
  }
  foo10.a = 10
  // 1. 箭头函数关联父级作用域this
  // var bar = foo10() // foo默认绑定
  // bar() // undefined 哈哈，是不是有小伙伴想当然了
  var baz = foo10.call(foo10) // foo 显性绑定
  baz() // 10
  // 2. 箭头函数this不可修改 这里我们使用上面的已经绑定了foo 的 baz
  var obj10 = {
    a: 999
  }
  baz.call(obj10) // 10

  //   多层调用链
  function foo12() {
    console.log(this.a12)
  }
  var obj1 = {
    a12: 4,
    foo: foo12
  }
  var obj2 = {
    a12: 3,
    obj1: obj1
  }
  // 这里原则是获取最后一层调用的上下文对象，即obj2，所以结果显然是4（obj2.a12）。
  obj2.obj1.foo() //?

  //   隐式丢失（函数别名）
  // 注意：这里存在一个陷阱，大家在分析调用过程时，要特别小心
  // 先看个代码：
  function foo13() {
    console.log(this.a13)
  }
  // var a13 = 2
  var obj = {
    a13: 3,
    foo: foo13
  }
  //   var bar = obj.foo
  var bar = obj.foo
  // bar() 默认绑定，window，Uncaught TypeError: Cannot read property 'a13' of undefined
  obj.foo() //隐式绑定
  new bar() //undifined，new绑定foo13对象
  bar.call(obj) //3 显示绑定

  class TestMe {
    a = 100
    print() {
      console.log(this.a)
    }
  }
  let tm = new TestMe()
  tm.print()
  Object.defineProperty(TestMe.prototype, 'print', {
    value: function() {
      console.log('testmeII.' + this.a) //100
    },
    enumerable: true,
    configurable: true,
    writable: true
  })
  tm.print()
}
