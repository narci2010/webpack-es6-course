// import { autobind } from 'core-decorators'
export default function testDecorator() {
  // ES7 的 decorator 概念

  //   基本上，装饰器的行为就是下面这样。
  // 装饰器是一个对类进行处理的函数。装饰器函数的第一个参数，就是所要装饰的目标类。
  // 装饰器对类的行为的改变，是代码编译时发生的，而不是在运行时。这意味着，装饰器能在编译阶段运行代码。也就是说，装饰器本质就是编译时执行的函数。
  // @decorator
  // class A {}
  // 等同于
  // class A {}
  // A = decorator(A) || A;

  // (1) 作用在方法上的 decorator
  // 先来看一个简单的类：
  class Dog {
    @readonly
    bark() {
      return 'wang!wang!'
    }
  }
  // 如果我们想让 bark 这个方法成为一个只读的属性，那么可以定义一个readonly 的 decorator：
  // 注意这里的 `target` 是 `Dog.prototype`
  function readonly(target, key, descriptor) {
    descriptor.writable = false
    return descriptor
  }

  let dog = new Dog()
  console.log(dog.bark())
  // dog.bark = 'bark!bark!' //Uncaught TypeError: Cannot assign to read only property 'bark' of object '#<Dog>'

  // ES7 中的 decorator 同样借鉴了这个语法糖，不过依赖于 ES5 的Object.defineProperty 方法 。
  // 关于 Object.defineProperty 的一切（些）
  // defineProperty 所做的事情就是，为一个对象增加新的属性，或者更改对象某个已存在的属性。
  // 调用方式是 Object.defineProperty(obj, prop, descriptor)，这 3 个参数分别代表：
  // obj: 目标对象
  // prop: 属性名
  // descriptor: 针对该属性的描述符
  // 有意思的是 descriptor 参数，它其实也是一个对象，其字段决定了 obj 的prop 属性的一些特性。
  // 比如 enumerable 的真假就能决定目标对象是否可枚举（能够在 for…in 循环中遍历到，或者出现在 Object.keys 方法的返回值中），
  // writable 决定目标对象的属性是否可以更改，等等。完整的描述符可选字段可以参看这里。

  //   @readonly 具体做了什么呢？我们先来看一下 ES6 的 class 在转换为 ES5 代码之后是什么样的，即 Dog 这个 class 等价于：
  // 步骤 1
  // function Dog () {}
  // 步骤 2
  // Object.defineProperty(Dog.prototype, 'bark', {
  //   value: function () { return 'wang!wang!' },
  //   enumerable: true,
  //   configurable: true,
  //   writable: false
  // })

  // (2) 作用在类上的 decorator
  // 作用在方法上的 decorator 接收的第一个参数（target）是类的 prototype；如果把一个 decorator 作用到类上，则它的第一个参数 target 是类本身：
  // 这里的 `target` 是类本身
  function doge(target) {
    target.isDoge = true
  }
  @doge
  class Dog2 {}
  console.log(Dog2.isDoge) // true

  // (3) decorator 也可以是 factory function
  // 如果我们想对不同的目标对象应用同一个 decorator，但同时又需要有一些差别，怎么办？很简单：
  function doge3(isDoge) {
    return function(target) {
      target.isDoge = isDoge
    }
  }
  @doge3(true)
  class Dog3 {}
  console.log(Dog3.isDoge) // true
  @doge3(false)
  class Human {}
  console.log(Human.isDoge) // false

  // 对方法来说也是类似的：
  function enumerable(isEnumerable) {
    return function(target, key, descriptor) {
      descriptor.enumerable = isEnumerable
    }
  }
  class Dog4 {
    bar = 'hello'
    baz = 'world'
    constructor(bar, baz) {
      this.bar = bar
      this.baz = baz
    }
    @enumerable(false)
    eat() {}
  }

  // 高级点的装饰器
  const memory = someClass => {
    const cache = Object.create(null) // 利用闭包的特性，保留一个Object用于缓存函数返回值
    return (target, name, descriptor) => {
      // console.log(A) //undefined
      //method缓存真实的函数
      const method = descriptor.value
      descriptor.value = function(...args) {
        // console.log('mehtod2:' + method)
        const key = args.join('')
        //console.log('key:' + key)
        if (cache[key]) {
          return cache[key]
        }
        //    const ret = method.call(target, ...args)
        //    const obj = Reflect.construct(target)
        //    const ret = method.apply(target, args)
        const ret = method.apply(this, args)
        cache[key] = ret
        //缓存中间计算结果
        //    console.log('cache[key]:' + cache[key])
        return ret
      }
      return descriptor
    }
  }
  class A {
    i = 100
    get [Symbol.toStringTag]() {
      return 'A'
    }
    //     constructor(i) {
    //       this.i = i
    //     }
    //     @autobind
    // 在类A自己内无法访问A，这个跟Java不一样，故此处A是undefined
    @memory(A) // 实际上是memory函数的返回值作为装饰器
    fib(n) {
      console.log('go:' + this.i++)
      if (n === 1) return 1
      if (n === 2) return 1
      return this.fib(n - 1) + this.fib(n - 2)
    }
  }
  //   console.log(A) 能够打印A
  const a = new A(0)
  //   console.log(a)
  console.log(a.fib(150)) // 算的飞快！
  //   let fib = a.fib
  //   fib.apply(a, [10])
  //   fib.call(a, 10)
  //   console.log(a.i)
  //   console.log(a.fib(100)) // 算的飞快！
  //   console.log(a.fib(100)) // 算的飞快！
  //end line here

  function mixins(...list) {
    //...表示多个参数，不定项参数
    return function(target) {
      Object.assign(target.prototype, ...list)
    }
  }
  const Foo1 = {
    a: 10,
    foo1() {
      console.log('foo1:' + this.a)
    }
  }
  const Foo2 = {
    a2: 100,
    foo2() {
      console.log('foo2:' + this.a2)
    }
  }
  @mixins(Foo1, Foo2)
  class MyClass {}
  let obj = new MyClass()
  obj.foo1() // 'foo1'
  obj.foo2() // 'foo1'
}
