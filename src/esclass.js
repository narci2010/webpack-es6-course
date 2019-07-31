export default function testEsclass() {
  // JavaScript 语言中，生成实例对象的传统方法是通过构造函数。下面是一个例子。
  function Point(x, y) {
    this.x = x
    this.y = y
  }
  Point.prototype.toString = function() {
    return '(' + this.x + ', ' + this.y + ')'
  }
  var p = new Point(1, 2)
  console.log(p.x + ':' + p.y)
  // 上面这种写法跟传统的面向对象语言（比如 C++ 和 Java）差异很大，很容易让新学习这门语言的程序员感到困惑。

  //   上面这种写法跟传统的面向对象语言（比如 C++ 和 Java）差异很大，很容易让新学习这门语言的程序员感到困惑。
  // ES6 提供了更接近传统语言的写法，引入了 Class（类）这个概念，作为对象的模板。通过class关键字，可以定义类。
  // 基本上，ES6 的class可以看作只是一个语法糖，它的绝大部分功能，ES5 都可以做到，新的class写法只是让对象原型的写法更加清晰、更像面向对象编程的语法而已。
  // 上面的代码用 ES6 的class改写，就是下面这样。
  class Point2 {
    constructor(x, y) {
      this.x = x
      this.y = y
    }
    toString() {
      return '(' + this.x + ', ' + this.y + ')'
    }
  }
  var p2 = new Point2(1, 2)
  console.log(p2.toString())
  // 上面代码定义了一个“类”，可以看到里面有一个constructor方法，这就是构造方法，而this关键字则代表实例对象。
  // 也就是说，ES5 的构造函数Point，对应 ES6 的Point类的构造方法 prototype对象的constructor属性，直接指向“类”的本身，这与 ES5 的行为是一致的。
  console.log(typeof Point2) // "function"
  console.log(Point === Point.prototype.constructor) // true
  // 上面代码表明，类的数据类型就是函数，类本身就指向构造函数。
  // 使用的时候，也是直接对类使用new命令，跟构造函数的用法完全一致。

  //   构造函数的prototype属性，在 ES6 的“类”上面继续存在。事实上，类的所有方法都定义在类的prototype属性上面。
  // class Point {
  //   constructor() {
  //     // ...
  //   }

  //   toString() {
  //     // ...
  //   }

  //   toValue() {
  //     // ...
  //   }
  // }
  // // 等同于
  // Point.prototype = {
  //   constructor() {},
  //   toString() {},
  //   toValue() {},
  // };

  //   在类的实例上面调用方法，其实就是调用原型上的方法。
  class B {}
  let b = new B()
  console.log(b.constructor === B.prototype.constructor) // true
  // 上面代码中，b是B类的实例，它的constructor方法就是B类原型的constructor方法。

  //   由于类的方法都定义在prototype对象上面，所以类的新方法可以添加在prototype对象上面。Object.assign方法可以很方便地一次向类添加多个方法。
  // class Point {
  //   constructor(){
  //     // ...
  //   }
  // }
  // Object.assign(Point.prototype, {
  //   toString(){},
  //   toValue(){}
  // });

  //   另外，类的内部所有定义的方法，都是不可枚举的（non-enumerable）。
  class Point3 {
    constructor(x, y) {
      // ...
    }

    toString() {
      // ...
    }
  }
  console.log(Object.keys(Point3.prototype)) // []
  console.log(Object.getOwnPropertyNames(Point3.prototype)) // ["constructor","toString"]
  // 上面代码中，toString方法是Point类内部定义的方法，它是不可枚举的。这一点与 ES5 的行为不一致。
  var Point4 = function(x, y) {
    // ...
  }
  Point4.prototype.toString = function() {
    // ...
  }
  console.log(Object.keys(Point4.prototype))
  // ["toString"]
  console.log(Object.getOwnPropertyNames(Point4.prototype))
  // ["constructor","toString"]
  //    上面代码采用 ES5 的写法，toString方法就是可枚举的。

  //   constructor 方法
  // constructor方法是类的默认方法，通过new命令生成对象实例时，自动调用该方法。一个类必须有constructor方法，
  // 如果没有显式定义，一个空的constructor方法会被默认添加。
  // class Point {
  // }
  // // 等同于
  // class Point {
  //   constructor() {}
  // }
  //上面代码中，定义了一个空的类Point，JavaScript 引擎会自动为它添加一个空的constructor方法。

  //   constructor方法默认返回实例对象（即this），完全可以指定返回另外一个对象。
  // class Foo {
  //   constructor() {
  //     return Object.create(null);
  //   }
  // }
  // new Foo() instanceof Foo
  // // false
  // 上面代码中，constructor函数返回一个全新的对象，结果导致实例对象不是Foo类的实例。这是不好的设计，编程过程中千万别写这种代码

  //   类必须使用new调用，否则会报错。这是它跟普通构造函数的一个主要区别，后者不用new也可以执行。
  // class Foo {
  //   constructor() {
  //     return Object.create(null);
  //   }
  // }
  // Foo()
  // // TypeError: Class constructor Foo cannot be invoked without 'new'

  //   与 ES5 一样，实例的属性除非显式定义在其本身（即定义在this对象上），否则都是定义在原型上（即定义在class上）。
  // //定义类
  // class Point {
  //   constructor(x, y) {
  //     this.x = x;
  //     this.y = y;
  //   }
  //   toString() {
  //     return '(' + this.x + ', ' + this.y + ')';
  //   }
  // }
  // var point = new Point(2, 3);
  // point.toString() // (2, 3)
  // point.hasOwnProperty('x') // true
  // point.hasOwnProperty('y') // true
  // point.hasOwnProperty('toString') // false
  // point.__proto__.hasOwnProperty('toString') // true
  // 上面代码中，x和y都是实例对象point自身的属性（因为定义在this变量上），
  // 所以hasOwnProperty方法返回true，而toString是原型对象的属性（因为定义在Point类上），
  // 所以hasOwnProperty方法返回false。这些都与 ES5 的行为保持一致。

  //   与 ES5 一样，类的所有实例共享一个原型对象。
  var p1 = new Point(2, 3)
  var p2 = new Point(3, 2)
  console.log(p1.__proto__ === p2.__proto__) //true
  console.log(p1.prototype === p2.prototype) //true
  //true
  // 上面代码中，p1和p2都是Point的实例，它们的原型都是Point.prototype，所以__proto__属性是相等的。
  // 这也意味着，可以通过实例的__proto__属性为“类”添加方法。
  // __proto__ 并不是语言本身的特性，这是各大厂商具体实现时添加的私有属性，
  // 虽然目前很多现代浏览器的 JS 引擎中都提供了这个私有属性，但依旧不建议在生产中使用该属性，
  // 避免对环境产生依赖。生产环境中，我们可以使用 Object.getPrototypeOf 方法来获取实例对象的原型，然后再来为原型添加方法/属性。

  //   取值函数（getter）和存值函数（setter）
  // 与 ES5 一样，在“类”的内部可以使用get和set关键字，对某个属性设置存值函数和取值函数，拦截该属性的存取行为。
  class MyClass {
    constructor() {
      // ...
    }
    get prop() {
      return 'getter'
    }
    set prop(value) {
      console.log('setter: ' + value)
    }
  }
  let inst = new MyClass()
  inst.prop = 123 // setter: 123
  console.log(inst.prop) // 'getter'
  // 上面代码中，prop属性有对应的存值函数和取值函数，因此赋值和读取行为都被自定义了。

  //   存值函数和取值函数是设置在属性的 Descriptor 对象上的。
  class CustomHTMLElement {
    constructor(element) {
      this.element = element
    }
    get html() {
      return this.element.innerHTML
    }
    set html(value) {
      this.element.innerHTML = value
    }
  }
  var descriptor = Object.getOwnPropertyDescriptor(
    CustomHTMLElement.prototype,
    'html'
  )
  console.log('get' in descriptor) // true
  console.log('set' in descriptor) // true
  // 上面代码中，存值函数和取值函数是定义在html属性的描述对象上面，这与 ES5 完全一致。

  //   属性表达式
  // 类的属性名，可以采用表达式。
  let methodName = 'getArea'
  class Square {
    constructor(length) {
      this.length = length
    }
    [methodName]() {
      //  用变量定义函数
      console.log(this.length)
    }
  }
  // 上面代码中，Square类的方法名getArea，是从表达式得到的。
  let sq = new Square(1)
  sq.getArea()
  sq[methodName]() //变量调用函数，也要用[]，而不能用.

  //   Class 表达式
  // 与函数一样，类也可以使用表达式的形式定义。
  const MyClass2 = class Me {
    getClassName() {
      return Me.name
    }
  }
  // 上面代码使用表达式定义了一个类。需要注意的是，这个类的名字是Me，但是Me只在 Class 的内部可用，指代当前类。在 Class 外部，这个类只能用MyClass引用。
  let inst2 = new MyClass2()
  console.log(inst2.getClassName()) // Me
  // Me.name // ReferenceError: Me is not defined
  // 上面代码表示，Me只在 Class 内部有定义。
  // 如果类的内部没用到的话，可以省略Me，也就是可以写成下面的形式。
  // const MyClass = class { /* ... */ };

  //   采用 Class 表达式，可以写出立即执行的 Class。
  let person = new (class {
    constructor(name) {
      this.name = name
    }
    sayName() {
      console.log(this.name)
    }
  })('张三')
  person.sayName() // "张三"
  // 上面代码中，person是一个立即执行的类的实例。

  //   注意点
  // （1）严格模式
  // 类和模块的内部，默认就是严格模式，所以不需要使用use strict指定运行模式。只要你的代码写在类或模块之中，就只有严格模式可用。
  // 考虑到未来所有的代码，其实都是运行在模块之中，所以 ES6 实际上把整个语言升级到了严格模式。
  // （2）不存在提升
  // 类不存在变量提升（hoist），这一点与 ES5 完全不同。
  // new Foo(); // ReferenceError
  // class Foo {}
  // 上面代码中，Foo类使用在前，定义在后，这样会报错，因为 ES6 不会把类的声明提升到代码头部。
  // 这种规定的原因与下文要提到的继承有关，必须保证子类在父类之后定义。
  //   3）name 属性
  // 由于本质上，ES6 的类只是 ES5 的构造函数的一层包装，所以函数的许多特性都被Class继承，包括name属性。
  // class Point {}
  // Point.name // "Point"
  // name属性总是返回紧跟在class关键字后面的类名。
  //   （4）Generator 方法
  // 如果某个方法之前加上星号（*），就表示该方法是一个 Generator 函数。
  class Foo {
    constructor(...args) {
      this.args = args
    }
    *[Symbol.iterator]() {
      for (let arg of this.args) {
        yield arg
      }
    }
  }
  for (let x of new Foo('hello', 'world')) {
    console.log(x)
  }
  // hello
  // world

  //   （5）this 的指向
  // 类的方法内部如果含有this，它默认指向类的实例。但是，必须非常小心，一旦单独使用该方法，很可能报错。
  class Logger {
    printName(name = 'there') {
      this.print(`Hello ${name}`)
    }
    print(text) {
      console.log(text)
    }
  }
  //   const logger = new Logger()
  //   const { printName } = logger //导出logger对象中的printName方法
  //   printName() // TypeError: Cannot read property 'print' of undefined
  // 上面代码中，printName方法中的this，默认指向Logger类的实例。但是，如果将这个方法提取出来单独使用，
  // this会指向该方法运行时所在的环境（由于 class 内部是严格模式，所以 this 实际指向的是undefined），从而导致找不到print方法而报错。
  // 一个比较简单的解决方法是，在构造方法中绑定this，这样就不会找不到print方法了。
  class Logger2 {
    constructor() {
      this.printName2 = this.printName2.bind(this)
    }
    printName2(name = 'there') {
      this.print(`Hello ${name}`)
    }
    print(text) {
      console.log(text)
    }
  }
  const logger2 = new Logger2()
  const { printName2 } = logger2 //导出logger对象中的printName方法
  printName2()

  //   另一种解决方法是使用箭头函数。
  class Obj {
    constructor() {
      this.getThis = () => this
    }
  }
  const myObj = new Obj()
  const { getThis } = myObj
  console.log(getThis() === myObj) // true
  console.log(myObj.getThis() === myObj) // true
  // 箭头函数内部的this总是指向定义时所在的对象。上面代码中，箭头函数位于构造函数内部，它的定义生效的时候，
  // 是在构造函数执行的时候。这时，箭头函数所在的运行环境，肯定是实例对象，所以this会总是指向实例对象。

  //   还有一种解决方法是使用Proxy，获取方法的时候，自动绑定this。
  function selfish(target) {
    const cache = new WeakMap()
    const handler = {
      get(target, key) {
        const value = Reflect.get(target, key)
        if (typeof value !== 'function') {
          return value
        }
        if (!cache.has(value)) {
          cache.set(value, value.bind(target))
        }
        return cache.get(value)
      }
    }
    const proxy = new Proxy(target, handler)
    return proxy
  }
  const logger = selfish(new Logger())
  const { printName } = logger //导出logger对象中的printName方法
  printName()

  //end line
}
