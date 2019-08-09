export default function testEsclassextends() {
  class Point {
    /* ... */
  }
  class ColorPoint extends Point {
    constructor() {
      super() //注释掉，会报错
    }
  }
  let cp = new ColorPoint() // ReferenceError
  // 上面代码中，ColorPoint继承了父类Point，但是它的构造函数没有调用super方法，导致新建实例时报错。

  //   如果子类没有定义constructor方法，这个方法会被默认添加，代码如下。
  //   也就是说，不管有没有显式定义，任何一个子类都有constructor方法。
  // class ColorPoint extends Point {
  // }
  // 等同于
  // class ColorPoint extends Point {
  //   constructor(...args) {
  //     super(...args);
  //   }
  // }

  //   另一个需要注意的地方是，在子类的构造函数中，只有调用super之后，才可以使用this关键字，否则会报错。
  //   这是因为子类实例的构建，基于父类实例，只有super方法才能调用父类实例。
  class Point2 {
    constructor(x, y) {
      this.x = x
      this.y = y
    }
  }
  class ColorPoint2 extends Point2 {
    constructor(x, y, color) {
      //  this.color = color // ReferenceError
      super(x, y)
      this.color = color // 正确
    }
  }
  // 上面代码中，子类的constructor方法没有调用super之前，就使用this关键字，结果报错，而放在super方法之后就是正确的。
  //   下面是生成子类实例的代码。
  let cp2 = new ColorPoint2(25, 8, 'green')
  console.log(cp2 instanceof ColorPoint) // true
  console.log(cp2 instanceof Point) // true
  console.log(cp2.color)

  //   最后，父类的静态方法，也会被子类继承。
  class A {
    static hello() {
      console.log('hello world')
    }
  }
  class B extends A {}
  B.hello() // hello world

  //   Object.getPrototypeOf()
  // Object.getPrototypeOf方法可以用来从子类上获取父类。
  console.log(Object.getPrototypeOf(B) === A) // true
  // 因此，可以使用这个方法判断，一个类是否继承了另一个类。

  //   注意，super虽然代表了父类A的构造函数，但是返回的是子类B的实例，
  //   即super内部的this指的是B的实例，因此super()在这里相当于A.prototype.constructor.call(this)。
  class A2 {
    constructor() {
      console.log(new.target.name)
    }
  }
  class B2 extends A2 {
    constructor() {
      super()
    }
    m() {
      // super()用在B类的m方法之中，就会造成句法错误。
      // super() // 报错
    }
  }
  new A2() // A2
  new B2() // B2
  // 上面代码中，new.target指向当前正在执行的函数。可以看到，在super()执行时，
  // 它指向的是子类B的构造函数，而不是父类A的构造函数。也就是说，super()内部的this指向的是B。

  //   第二种情况，super作为对象时，在普通方法中，指向父类的原型对象；在静态方法中，指向父类。
  class A3 {
    p() {
      return 2
    }
  }
  class B3 extends A3 {
    constructor() {
      super()
      console.log(super.p()) // 2
    }
  }
  let b = new B3()
  // 上面代码中，子类B当中的super.p()，就是将super当作一个对象使用。
  // 这时，super在普通方法之中，指向A.prototype，所以super.p()就相当于A.prototype.p()

  //   这里需要注意，由于super指向父类的原型对象，所以定义在父类实例上的方法或属性，是无法通过super调用的。
  class A5 {
    constructor() {
      this.p = 2
    }
  }

  class B5 extends A5 {
    get m() {
      return super.p
    }
  }

  let b5 = new B5()
  console.log(b5.m) // undefined
  // 上面代码中，p是父类A实例的属性，super.p就引用不到它。

  //   如果属性定义在父类的原型对象上，super就可以取到。
  class A6 {}
  A6.prototype.x = 2

  class B6 extends A6 {
    constructor() {
      super()
      console.log(super.x) // 2
    }
  }
  let b6 = new B6()
  // 上面代码中，属性x是定义在A.prototype上面的，所以super.x可以取到它的值。

  //   ES6 规定，在子类普通方法中通过super调用父类的方法时，方法内部的this指向当前的子类实例。
  class A7 {
    constructor() {
      this.x = 1
    }
    print() {
      console.log(this.x)
    }
  }
  class B7 extends A7 {
    constructor() {
      super()
      this.x = 2
    }
    m() {
      super.print()
    }
  }

  let b7 = new B7()
  b7.m() // 2
  // 上面代码中，super.print()虽然调用的是A.prototype.print()，但是A.prototype.print()内部的this指向子类B的实例，
  // 导致输出的是2，而不是1。也就是说，实际上执行的是super.print.call(this)。

  //   由于this指向子类实例，所以如果通过super对某个属性赋值，这时super就是this，赋值的属性会变成子类实例的属性。
  class A8 {
    constructor() {
      this.x = 1
    }
  }
  class B8 extends A8 {
    constructor() {
      super()
      this.x = 2
      super.x = 3
      console.log(super.x) // undefined
      console.log(this.x) // 3
    }
  }
  let b8 = new B8()
  // 上面代码中，super.x赋值为3，这时等同于对this.x赋值为3。而当读取super.x的时候，读的是A.prototype.x，所以返回undefined。

  //   如果super作为对象，用在静态方法之中，这时super将指向父类，而不是父类的原型对象。
  class Parent {
    static myMethod(msg) {
      console.log('static', msg)
    }
    myMethod(msg) {
      console.log('instance', msg)
    }
  }
  class Child extends Parent {
    static myMethod(msg) {
      super.myMethod(msg)
    }
    myMethod(msg) {
      super.myMethod(msg)
    }
  }
  Child.myMethod(1) // static 1
  var child = new Child()
  child.myMethod(2) // instance 2
  // 上面代码中，super在静态方法之中指向父类，在普通方法之中指向父类的原型对象。

  //   另外，在子类的静态方法中通过super调用父类的方法时，方法内部的this指向当前的子类，而不是子类的实例。
  class A9 {
    constructor() {
      this.x = 1
    }
    static print() {
      console.log(this.x)
    }
  }
  class B9 extends A9 {
    static x = 10
    constructor() {
      super()
      this.x = 2
    }
    static m() {
      super.print()
    }
  }
  // B9.x = 3
  B9.m() // 3 10
  // 上面代码中，静态方法B.m里面，super.print指向父类的静态方法。这个方法里面的this指向的是B，而不是B的实例。

  //   注意，使用super的时候，必须显式指定是作为函数、还是作为对象使用，否则会报错。
  class A10 {}
  class B10 extends A10 {
    constructor() {
      super()
      // console.log(super); // 报错
    }
  }
  // 上面代码中，console.log(super)当中的super，无法看出是作为函数使用，还是作为对象使用，
  // 所以 JavaScript 引擎解析代码的时候就会报错。这时，如果能清晰地表明super的数据类型，就不会报错。

  class A11 {}
  class B11 extends A11 {
    constructor() {
      super()
      console.log(super.valueOf() instanceof B11) // true
    }
  }
  let b11 = new B11()
  //   上面代码中，super.valueOf()表明super是一个对象，因此就不会报错。
  //   同时，由于super使得this指向B的实例，所以super.valueOf()返回的是一个B的实例。

  //   最后，由于对象总是继承其他对象的，所以可以在任意一个对象中，使用super关键字。
  var obj12 = {
    toString() {
      return 'MyObject: ' + super.toString()
    }
  }
  console.log(obj12.toString()) // MyObject: [object Object]

  //   类的 prototype 属性和__proto__属性
  // 大多数浏览器的 ES5 实现之中，每一个对象都有__proto__属性，
  // 指向对应的构造函数的prototype属性。Class 作为构造函数的语法糖，
  // 同时有prototype属性和__proto__属性，因此同时存在两条继承链。
  // （1）子类的__proto__属性，表示构造函数的继承，总是指向父类。
  // （2）子类prototype属性的__proto__属性，表示方法的继承，总是指向父类的prototype属性。
  class A13 {}
  class B13 extends A13 {}
  console.log(B13.__proto__ === A13) // true
  console.log(B13.prototype.__proto__ === A13.prototype) // true
  // 上面代码中，子类B的__proto__属性指向父类A，子类B的prototype属性的__proto__属性指向父类A的prototype属性。
  //   第二种情况，不存在任何继承。
  class A15 {}
  console.log(A15.__proto__ === Function.prototype) // true
  console.log(A15.prototype.__proto__ === Object.prototype) // true
  // 这种情况下，A作为一个基类（即不存在任何继承），就是一个普通函数，所以直接继承Function.prototype。
  // 但是，A调用后返回一个空对象（即Object实例），所以A.prototype.__proto__指向构造函数（Object）的prototype属性。

  //   实例的 __proto__ 属性
  //   子类实例的__proto__属性的__proto__属性，指向父类实例的__proto__属性。也就是说，子类的原型的原型，是父类的原型。
  var p1 = new Point(2, 3)
  var p2 = new ColorPoint(2, 3, 'red')
  console.log(p2.__proto__ === p1.__proto__) // false
  console.log(p2.__proto__.__proto__ === p1.__proto__) // true
  //   上面代码中，ColorPoint继承了Point，导致前者原型的原型是后者的原型。
  //   因此，通过子类实例的__proto__.__proto__属性，可以修改父类实例的行为。
  p2.__proto__.__proto__.printName = function() {
    console.log('Ha')
  }
  p1.printName() // "Ha"
  // 上面代码在ColorPoint的实例p2上向Point类添加方法，结果影响到了Point的实例p1。
  // 这种灵活性，会造成一定的安全性问题(不要乱用)

  //   原生构造函数的继承
  // 原生构造函数是指语言内置的构造函数，通常用来生成数据结构。ECMAScript 的原生构造函数大致有下面这些。
  // Boolean()
  // Number()
  // String()
  // Array()
  // Date()
  // Function()
  // RegExp()
  // Error()
  // Object()
  // 以前，这些原生构造函数是无法继承的，比如，不能自己定义一个Array的子类。
  function MyArray() {
    Array.apply(this, arguments)
  }
  MyArray.prototype = Object.create(Array.prototype, {
    constructor: {
      value: MyArray,
      writable: true,
      configurable: true,
      enumerable: true
    }
  })
  //    上面代码定义了一个继承 Array 的MyArray类。但是，这个类的行为与Array完全不一致。
  var colors = new MyArray()
  colors[0] = 'red'
  console.log(colors.length) // 0
  colors.length = 0
  console.log(colors[0]) // "red"
  //    之所以会发生这种情况，是因为子类无法获得原生构造函数的内部属性，
  //    通过Array.apply()或者分配给原型对象都不行。原生构造函数会忽略apply方法传入的this，
  //    也就是说，原生构造函数的this无法绑定，导致拿不到内部属性。

  //   ES5 是先新建子类的实例对象this，再将父类的属性添加到子类上，由于父类的内部属性无法获取，
  //   导致无法继承原生的构造函数。比如，Array构造函数有一个内部属性[[DefineOwnProperty]]，
  //   用来定义新属性时，更新length属性，这个内部属性无法在子类获取，导致子类的length属性行为不正常。
  // 下面的例子中，我们想让一个普通对象继承Error对象。
  var e = {}
  console.log(Object.getOwnPropertyNames(e))
  console.log(Object.getOwnPropertyNames(Error.call(e))) // [ 'stack' ]
  console.log(Object.getOwnPropertyNames(e)) // []
  var e2 = []
  console.log(Object.getOwnPropertyNames(e2))
  // 上面代码中，我们想通过Error.call(e)这种写法，让普通对象e具有Error对象的实例属性。
  // 但是，Error.call()完全忽略传入的第一个参数，而是返回一个新对象，e本身没有任何变化。
  // 这证明了Error.call(e)这种写法，无法继承原生构造函数。

  //   ES6 允许继承原生构造函数定义子类，因为 ES6 是先新建父类的实例对象this，
  //   然后再用子类的构造函数修饰this，使得父类的所有行为都可以继承。下面是一个继承Array的例子。
  class MyArray2 extends Array {
    constructor(...args) {
      super(...args)
    }
  }
  var arr = new MyArray2()
  arr[0] = 12
  console.log(arr.length) // 1
  arr.length = 0
  console.log(arr[0]) // undefined
  // 上面代码定义了一个MyArray类，继承了Array构造函数，因此就可以从MyArray生成数组的实例。
  // 这意味着，ES6 可以自定义原生数据结构（比如Array、String等）的子类，这是 ES5 无法做到的。

  //   上面这个例子也说明，extends关键字不仅可以用来继承类，还可以用来继承原生的构造函数。
  //   因此可以在原生数据结构的基础上，定义自己的数据结构。下面就是定义了一个带版本功能的数组。
  class VersionedArray extends Array {
    constructor() {
      super()
      this.history = [[]]
    }
    commit() {
      this.history.push(this.slice())
    }
    revert() {
      this.splice(0, this.length, ...this.history[this.history.length - 1])
    }
  }
  var x = new VersionedArray()
  x.push(1)
  x.push(2)
  console.log(x) // [1, 2]
  console.log(x.history) // [[]]
  x.commit()
  console.log(x.history) // [[], [1, 2]]
  x.push(3)
  console.log(x) // [1, 2, 3]
  console.log(x.history) // [[], [1, 2]]
  x.revert()
  console.log(x) // [1, 2]
  console.log(x.history)
  // 上面代码中，VersionedArray会通过commit方法，将自己的当前状态生成一个版本快照，
  // 存入history属性。revert方法用来将数组重置为最新一次保存的版本。
  // 除此之外，VersionedArray依然是一个普通数组，所有原生的数组方法都可以在它上面调用。

  //   下面是一个自定义Error子类的例子，可以用来定制报错时的行为。
  class ExtendableError extends Error {
    constructor(message) {
      super()
      this.message = message
      this.stack = new Error().stack
      this.name = this.constructor.name
    }
  }
  class MyError extends ExtendableError {
    constructor(m) {
      super(m)
    }
  }
  var myerror = new MyError('ll')
  console.log(myerror.message) // "ll"
  myerror instanceof Error // true
  console.log(myerror.name) // "MyError"
  console.log(myerror.stack)
  // Error
  //     at MyError.ExtendableError
  //     ...

  // 注意，继承Object的子类，有一个行为差异。
  class NewObj extends Object {
    constructor() {
      super(...arguments)
    }
  }
  var o = new NewObj({ attr: true })
  console.log(o.attr === true) // false
  // 上面代码中，NewObj继承了Object，但是无法通过super方法向父类Object传参。
  // 这是因为 ES6 改变了Object构造函数的行为，一旦发现Object方法不是通过new Object()这种形式调用，
  // ES6 规定Object构造函数会忽略参数。

  //   Mixin 模式的实现
  // Mixin 指的是多个对象合成一个新的对象，新对象具有各个组成成员的接口。它的最简单实现如下。
  const a18 = {
    a: 'a'
  }
  const b18 = {
    b: 'b'
  }
  const c18 = { ...a18, ...b18 } // {a: 'a', b: 'b'}
  console.log(c18)
  // 上面代码中，c对象是a对象和b对象的合成，具有两者的接口。

  //   下面是一个更完备的实现，将多个类的接口“混入”（mix in）另一个类。
  function mix(...mixins) {
    class Mix {
      constructor() {
        for (let mixin of mixins) {
          copyProperties(this, new mixin()) // 拷贝实例属性
        }
      }
    }
    for (let mixin of mixins) {
      copyProperties(Mix, mixin) // 拷贝静态属性
      copyProperties(Mix.prototype, mixin.prototype) // 拷贝原型属性
    }
    return Mix
  }
  function copyProperties(target, source) {
    for (let key of Reflect.ownKeys(source)) {
      if (key !== 'constructor' && key !== 'prototype' && key !== 'name') {
        let desc = Object.getOwnPropertyDescriptor(source, key)
        Object.defineProperty(target, key, desc)
      }
    }
  }
  class Mix1 {
    a = 100
    static i = 500
    print1() {
      console.log('print1')
    }
    static poke1() {
      console.log('static poke 1')
    }
  }
  class Mix2 {
    b = 200
    static j = 799
    print2() {
      console.log('print2')
    }
    static poke2() {
      console.log('static poke 2')
    }
  }
  // 上面代码的mix函数，可以将多个对象合成为一个类。使用的时候，只要继承这个类即可。
  // 本质上，js的类是函数的语法糖而已，可以继承函数
  class DistributedEdit extends mix(Mix1, Mix2) {
    // ...
  }
  var db = new DistributedEdit()
  console.log(db.a)
  console.log(db.b)
  db.print1()
  db.print2()
  console.log(DistributedEdit.i)
  console.log(DistributedEdit.j)
  DistributedEdit.poke1()
  DistributedEdit.poke2()

  //end line
}
