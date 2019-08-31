// 概述
// Proxy 用于修改某些操作的默认行为，等同于在语言层面做出修改，所以属于一种“元编程”（meta programming），即对编程语言进行编程。
// Proxy 可以理解成，在目标对象之前架设一层“拦截”，外界对该对象的访问，都必须先通过这层拦截，因此提供了一种机制，可以对外界的访问进行过滤和改写。
// Proxy 这个词的原意是代理，用在这里表示由它来“代理”某些操作，可以译为“代理器”。
const { log } = console
var obj = new Proxy(
  {},
  {
    get: function(target, key, receiver) {
      console.log(`getting ${key}!`)
      return Reflect.get(target, key, receiver)
    },
    set: function(target, key, value, receiver) {
      console.log(`setting ${key}!`)
      return Reflect.set(target, key, value, receiver)
    }
  }
)
// 上面代码对一个空对象架设了一层拦截，重定义了属性的读取（get）和设置（set）行为。这里暂时先不解释具体的语法，只看运行结果。
// 对设置了拦截行为的对象obj，去读写它的属性，就会得到下面的结果。
obj.count = 1
//  setting count!
log(++obj.count)
//  getting count!
//  setting count!
//  2
// 上面代码说明，Proxy 实际上重载（overload）了点运算符，即用自己的定义覆盖了语言的原始定义。

// ES6 原生提供 Proxy 构造函数，用来生成 Proxy 实例。
// var proxy = new Proxy(target, handler);
// Proxy 对象的所有用法，都是上面这种形式，不同的只是handler参数的写法。其中，new Proxy()表示生成一个Proxy实例，target参数表示所要拦截的目标对象，
// handler参数也是一个对象，用来定制拦截行为。
// 下面是另一个拦截读取属性行为的例子。
var proxy = new Proxy(
  {},
  {
    get: function(target, property) {
      return 35
    }
  }
)
log(proxy.time) // 35
log(proxy.name) // 35
log(proxy.title) // 35
// 上面代码中，作为构造函数，Proxy接受两个参数。第一个参数是所要代理的目标对象（上例是一个空对象），即如果没有Proxy的介入，操作原来要访问的就是这个对象；
// 第二个参数是一个配置对象，对于每一个被代理的操作，需要提供一个对应的处理函数，该函数将拦截对应的操作。比如，上面代码中，
// 配置对象有一个get方法，用来拦截对目标对象属性的访问请求。get方法的两个参数分别是目标对象和所要访问的属性。
// 可以看到，由于拦截函数总是返回35，所以访问任何属性都得到35。
// 注意，要使得Proxy起作用，必须针对Proxy实例（上例是proxy对象）进行操作，而不是针对目标对象（上例是空对象）进行操作。

// Proxy 实例也可以作为其他对象的原型对象。
let obj2 = Object.create(proxy)
log(obj2.time) // 35
// 上面代码中，proxy对象是obj对象的原型，obj对象本身并没有time属性，所以根据原型链，会在proxy对象上读取该属性，导致被拦截。

// 同一个拦截器函数，可以设置拦截多个操作。
var handler = {
  get: function(target, name) {
    if (name === 'prototype') {
      return Object.prototype
    }
    return 'Hello, ' + name
  },
  apply: function(target, thisBinding, args) {
    return args[0]
  },
  construct: function(target, args) {
    return { value: args[1] }
  }
}
var fproxy = new Proxy(function(x, y) {
  return x + y
}, handler)
log(fproxy(1, 2)) // 1
log(new fproxy(1, 2)) // {value: 2}
log(fproxy.prototype === Object.prototype) // true
log(fproxy.foo === 'Hello, foo') // true
// 对于可以设置、但没有设置拦截的操作，则直接落在目标对象上，按照原先的方式产生结果。

// 下面是 Proxy 支持的拦截操作一览，一共 13 种。
// get(target, propKey, receiver)：拦截对象属性的读取，比如proxy.foo和proxy['foo']。
// set(target, propKey, value, receiver)：拦截对象属性的设置，比如proxy.foo = v或proxy['foo'] = v，返回一个布尔值。
// has(target, propKey)：拦截propKey in proxy的操作，返回一个布尔值。
// deleteProperty(target, propKey)：拦截delete proxy[propKey]的操作，返回一个布尔值。
// ownKeys(target)：拦截Object.getOwnPropertyNames(proxy)、Object.getOwnPropertySymbols(proxy)、Object.keys(proxy)、for...in循环，返回一个数组。
// 该方法返回目标对象所有自身的属性的属性名，而Object.keys()的返回结果仅包括目标对象自身的可遍历属性。
// getOwnPropertyDescriptor(target, propKey)：拦截Object.getOwnPropertyDescriptor(proxy, propKey)，返回属性的描述对象。
// defineProperty(target, propKey, propDesc)：拦截Object.defineProperty(proxy, propKey, propDesc）、Object.defineProperties(proxy, propDescs)，返回一个布尔值。
// preventExtensions(target)：拦截Object.preventExtensions(proxy)，返回一个布尔值。
// getPrototypeOf(target)：拦截Object.getPrototypeOf(proxy)，返回一个对象。
// isExtensible(target)：拦截Object.isExtensible(proxy)，返回一个布尔值。
// setPrototypeOf(target, proto)：拦截Object.setPrototypeOf(proxy, proto)，返回一个布尔值。如果目标对象是函数，那么还有两种额外操作可以拦截。
// apply(target, object, args)：拦截 Proxy 实例作为函数调用的操作，比如proxy(...args)、proxy.call(object, ...args)、proxy.apply(...)。
// construct(target, args)：拦截 Proxy 实例作为构造函数调用的操作，比如new proxy(...args)。

// 下面的例子使用get拦截，实现数组读取负数的索引。
function createArray(...elements) {
  let handler = {
    get(target, propKey, receiver) {
      let index = Number(propKey)
      if (index < 0) {
        propKey = String(target.length + index)
      }
      return Reflect.get(target, propKey, receiver)
    }
  }
  let target = []
  target.push(...elements)
  return new Proxy(target, handler)
}
let arr = createArray('a', 'b', 'c')
log(arr[-1]) // c
// 上面代码中，数组的位置参数是-1，就会输出数组的倒数第一个成员。

// set()
// set方法用来拦截某个属性的赋值操作，可以接受四个参数，依次为目标对象、属性名、属性值和 Proxy 实例本身，其中最后一个参数可选。
// 假定Person对象有一个age属性，该属性应该是一个不大于 200 的整数，那么可以使用Proxy保证age的属性值符合要求。
let validator = {
  set: function(obj, prop, value) {
    if (prop === 'age') {
      if (!Number.isInteger(value)) {
        throw new TypeError('The age is not an integer')
      }
      if (value > 200) {
        throw new RangeError('The age seems invalid')
      }
    }
    // 对于满足条件的 age 属性以及其他属性，直接保存
    obj[prop] = value
  }
}
let person = new Proxy({}, validator)
person.age = 100
log(person.age) // 100
// person.age = 'young' // 报错
// person.age = 300 // 报错
// 上面代码中，由于设置了存值函数set，任何不符合要求的age属性赋值，都会抛出一个错误，这是数据验证的一种实现方法。
// 利用set方法，还可以数据绑定，即每当对象发生变化时，会自动更新 DOM。

// apply()
// apply方法拦截函数的调用、call和apply操作。
// apply方法可以接受三个参数，分别是目标对象、目标对象的上下文对象（this）和目标对象的参数数组。
// var handler = {
//   apply (target, ctx, args) {
//     return Reflect.apply(...arguments);
//   }
// };
var twice = {
  apply(target, ctx, args) {
    return Reflect.apply(...arguments) * 2
  }
}
function sum(left, right) {
  return left + right
}
var proxy = new Proxy(sum, twice)
log(proxy(1, 2)) // 6
log(proxy.call(null, 5, 6)) // 22
log(proxy.apply(null, [7, 8])) // 30
//    上面代码中，每当执行proxy函数（直接调用或call和apply调用），就会被apply方法拦截。
//       另外，直接调用Reflect.apply方法，也会被拦截。
log(Reflect.apply(proxy, null, [9, 10])) // 38

// has()
// has方法用来拦截HasProperty操作，即判断对象是否具有某个属性时，这个方法会生效。典型的操作就是in运算符。
// has方法可以接受两个参数，分别是目标对象、需查询的属性名。
// 下面的例子使用has方法隐藏某些属性，不被in运算符发现。
var handler = {
  has(target, key) {
    if (key[0] === '_') {
      return false
    }
    return key in target
  }
}
var target = { _prop: 'foo', prop: 'foo' }
var proxy = new Proxy(target, handler)
log('_prop' in proxy) // false
// 上面代码中，如果原对象的属性名的第一个字符是下划线，proxy.has就会返回false，从而不会被in运算符发现。

// construct()
// construct方法用于拦截new命令，下面是拦截对象的写法。
// var handler = {
//   construct (target, args, newTarget) {
//     return new target(...args);
//   }
// };
// construct方法可以接受两个参数。
// target：目标对象
// args：构造函数的参数对象
// newTarget：创造实例对象时，new命令作用的构造函数（下面例子的p）
var p = new Proxy(function() {}, {
  construct: function(target, args) {
    console.log('called: ' + args.join(', '))
    return { value: args[0] * 10 }
  }
})
log(new p(1).value)
// "called: 1"
// 10
// construct方法返回的必须是一个对象，否则会报错。
// var p = new Proxy(function() {}, {
//   construct: function(target, argumentsList) {
//     return 1;
//   }
// });
// new p() // 报错
// // Uncaught TypeError: 'construct' on proxy: trap returned non-object ('1')

// Reflect对象与Proxy对象一样，也是 ES6 为了操作对象而提供的新 API。Reflect对象的设计目的有这样几个。
// （1） 将Object对象的一些明显属于语言内部的方法（比如Object.defineProperty），放到Reflect对象上。现阶段，某些方法同时在Object和Reflect对象上部署，
// 未来的新方法将只部署在Reflect对象上。也就是说，从Reflect对象上可以拿到语言内部的方法。
// （2） 修改某些Object方法的返回结果，让其变得更合理。比如，Object.defineProperty(obj, name, desc)在无法定义属性时，会抛出一个错误，
// 而Reflect.defineProperty(obj, name, desc)则会返回false。
// // 老写法
// try {
//   Object.defineProperty(target, property, attributes);
//   // success
// } catch (e) {
//   // failure
// }
// // 新写法
// if (Reflect.defineProperty(target, property, attributes)) {
//   // success
// } else {
//   // failure
// }
// （3） 让Object操作都变成函数行为。某些Object操作是命令式，比如name in obj和delete obj[name]，而Reflect.has(obj, name)和Reflect.deleteProperty(obj, name)
// 让它们变成了函数行为。
// // 老写法
// 'assign' in Object // true
// // 新写法
// Reflect.has(Object, 'assign') // true
// （4）Reflect对象的方法与Proxy对象的方法一一对应，只要是Proxy对象的方法，就能在Reflect对象上找到对应的方法。
// 这就让Proxy对象可以方便地调用对应的Reflect方法，完成默认行为，作为修改行为的基础。也就是说，不管Proxy怎么修改默认行为，你总可以在Reflect上获取默认行为。
// Proxy(target, {
//   set: function(target, name, value, receiver) {
//     var success = Reflect.set(target, name, value, receiver);
//     if (success) {
//       console.log('property ' + name + ' on ' + target + ' set to ' + value);
//     }
//     return success;
//   }
// });
// 上面代码中，Proxy方法拦截target对象的属性赋值行为。它采用Reflect.set方法将值赋值给对象的属性，确保完成原有的行为，然后再部署额外的功能。
// 下面是另一个例子。
// var loggedObj = new Proxy(obj, {
//   get(target, name) {
//     console.log('get', target, name);
//     return Reflect.get(target, name);
//   },
//   deleteProperty(target, name) {
//     console.log('delete' + name);
//     return Reflect.deleteProperty(target, name);
//   },
//   has(target, name) {
//     console.log('has' + name);
//     return Reflect.has(target, name);
//   }
// });
// 上面代码中，每一个Proxy对象的拦截操作（get、delete、has），内部都调用对应的Reflect方法，保证原生行为能够正常执行。添加的工作，就是将每一个操作输出一行日志。
// 有了Reflect对象以后，很多操作会更易读。
// 老写法
log(Function.prototype.apply.call(Math.floor, undefined, [1.75])) // 1
// 新写法
log(Reflect.apply(Math.floor, undefined, [1.75])) // 1

// 静态方法
// Reflect对象一共有 13 个静态方法。
// Reflect.apply(target, thisArg, args)
// Reflect.construct(target, args)
// Reflect.get(target, name, receiver)
// Reflect.set(target, name, value, receiver)
// Reflect.defineProperty(target, name, desc)
// Reflect.deleteProperty(target, name)
// Reflect.has(target, name)
// Reflect.ownKeys(target)
// Reflect.isExtensible(target)
// Reflect.preventExtensions(target)
// Reflect.getOwnPropertyDescriptor(target, name)
// Reflect.getPrototypeOf(target)
// Reflect.setPrototypeOf(target, prototype)
// 上面这些方法的作用，大部分与Object对象的同名方法的作用都是相同的，而且它与Proxy对象的方法是一一对应的。下面是对它们的解释。

// Reflect.get(target, name, receiver)
// Reflect.get方法查找并返回target对象的name属性，如果没有该属性，则返回undefined。
var myObject = {
  foo: 1,
  bar: 2,
  get baz() {
    return this.foo + this.bar
  }
}
log(Reflect.get(myObject, 'foo')) // 1
log(Reflect.get(myObject, 'bar')) // 2
log(Reflect.get(myObject, 'baz')) // 3
// 如果name属性部署了读取函数（getter），则读取函数的this绑定receiver。
var myReceiverObject = {
  foo: 4,
  bar: 4
}
log(Reflect.get(myObject, 'baz', myObject))
log(Reflect.get(myObject, 'baz', myReceiverObject)) // 8
// 如果第一个参数不是对象，Reflect.get方法会报错。
// Reflect.get(1, 'foo') // 报错
// Reflect.get(false, 'foo') // 报错

// Reflect.set(target, name, value, receiver)
// Reflect.set方法设置target对象的name属性等于value。
var myObject2 = {
  foo: 1,
  set bar(value) {
    return (this.foo = value)
  }
}
log(myObject2.foo) // 1
Reflect.set(myObject2, 'foo', 2)
log(myObject2.foo) // 2
Reflect.set(myObject2, 'bar', 3)
log(myObject2.foo) // 3
// 如果name属性设置了赋值函数，则赋值函数的this绑定receiver。
var myReceiverObject2 = {
  foo: 0
}
Reflect.set(myObject2, 'bar', 1, myReceiverObject2) //修改了receiver，target没修改到
log(myObject2.foo) // 3
log(myReceiverObject2.foo) // 1

// 注意，如果 Proxy对象和 Reflect对象联合使用，前者拦截赋值操作，后者完成赋值的默认行为，而且传入了receiver，那么Reflect.set会触发Proxy.defineProperty拦截。

// let p = {
//   a: 'a'
// };

// let handler = {
//   set(target, key, value, receiver) {
//     console.log('set');
//     Reflect.set(target, key, value, receiver)
//   },
//   defineProperty(target, key, attribute) {
//     console.log('defineProperty');
//     Reflect.defineProperty(target, key, attribute);
//   }
// };

// let obj = new Proxy(p, handler);
// obj.a = 'A';
// // set
// // defineProperty
// 上面代码中，Proxy.set拦截里面使用了Reflect.set，而且传入了receiver，导致触发Proxy.defineProperty拦截。这是因为Proxy.set的receiver参数总是指向当前的
// Proxy实例（即上例的obj），而Reflect.set一旦传入receiver，就会将属性赋值到receiver上面（即obj），导致触发defineProperty拦截。
// 如果Reflect.set没有传入receiver，那么就不会触发defineProperty拦截。

// let p = {
//   a: 'a'
// };

// let handler = {
//   set(target, key, value, receiver) {
//     console.log('set');
//     Reflect.set(target, key, value)
//   },
//   defineProperty(target, key, attribute) {
//     console.log('defineProperty');
//     Reflect.defineProperty(target, key, attribute);
//   }
// };

// let obj = new Proxy(p, handler);
// obj.a = 'A';
// // set
// 如果第一个参数不是对象，Reflect.set会报错。

// Reflect.set(1, 'foo', {}) // 报错
// Reflect.set(false, 'foo', {}) // 报错
// Reflect.has(obj, name)
// Reflect.has方法对应name in obj里面的in运算符。

// var myObject = {
//   foo: 1,
// };

// // 旧写法
// 'foo' in myObject // true

// // 新写法
// Reflect.has(myObject, 'foo') // true
// 如果Reflect.has()方法的第一个参数不是对象，会报错。

// Reflect.deleteProperty(obj, name)
// Reflect.deleteProperty方法等同于delete obj[name]，用于删除对象的属性。

// const myObj = { foo: 'bar' };

// // 旧写法
// delete myObj.foo;

// // 新写法
// Reflect.deleteProperty(myObj, 'foo');
// 该方法返回一个布尔值。如果删除成功，或者被删除的属性不存在，返回true；删除失败，被删除的属性依然存在，返回false。

// 如果Reflect.deleteProperty()方法的第一个参数不是对象，会报错。

// Reflect.construct(target, args)
// Reflect.construct方法等同于new target(...args)，这提供了一种不使用new，来调用构造函数的方法。

// function Greeting(name) {
//   this.name = name;
// }

// // new 的写法
// const instance = new Greeting('张三');

// // Reflect.construct 的写法
// const instance = Reflect.construct(Greeting, ['张三']);
// 如果Reflect.construct()方法的第一个参数不是函数，会报错。

// Reflect.getPrototypeOf(obj)
// Reflect.getPrototypeOf方法用于读取对象的__proto__属性，对应Object.getPrototypeOf(obj)。

// const myObj = new FancyThing();

// // 旧写法
// Object.getPrototypeOf(myObj) === FancyThing.prototype;

// // 新写法
// Reflect.getPrototypeOf(myObj) === FancyThing.prototype;
// Reflect.getPrototypeOf和Object.getPrototypeOf的一个区别是，如果参数不是对象，Object.getPrototypeOf会将这个参数转为对象，
// 然后再运行，而Reflect.getPrototypeOf会报错。

// Object.getPrototypeOf(1) // Number {[[PrimitiveValue]]: 0}
// Reflect.getPrototypeOf(1) // 报错
// Reflect.setPrototypeOf(obj, newProto)
// Reflect.setPrototypeOf方法用于设置目标对象的原型（prototype），对应Object.setPrototypeOf(obj, newProto)方法。它返回一个布尔值，表示是否设置成功。

// const myObj = {};

// // 旧写法
// Object.setPrototypeOf(myObj, Array.prototype);

// // 新写法
// Reflect.setPrototypeOf(myObj, Array.prototype);

// myObj.length // 0
// 如果无法设置目标对象的原型（比如，目标对象禁止扩展），Reflect.setPrototypeOf方法返回false。

// Reflect.setPrototypeOf({}, null)
// // true
// Reflect.setPrototypeOf(Object.freeze({}), null)
// // false
// 如果第一个参数不是对象，Object.setPrototypeOf会返回第一个参数本身，而Reflect.setPrototypeOf会报错。

// Object.setPrototypeOf(1, {})
// // 1

// Reflect.setPrototypeOf(1, {})
// // TypeError: Reflect.setPrototypeOf called on non-object
// 如果第一个参数是undefined或null，Object.setPrototypeOf和Reflect.setPrototypeOf都会报错。

// Object.setPrototypeOf(null, {})
// // TypeError: Object.setPrototypeOf called on null or undefined

// Reflect.setPrototypeOf(null, {})
// // TypeError: Reflect.setPrototypeOf called on non-object
// Reflect.apply(func, thisArg, args)
// Reflect.apply方法等同于Function.prototype.apply.call(func, thisArg, args)，用于绑定this对象后执行给定函数。

// 一般来说，如果要绑定一个函数的this对象，可以这样写fn.apply(obj, args)，但是如果函数定义了自己的apply方法，
// 就只能写成Function.prototype.apply.call(fn, obj, args)，采用Reflect对象可以简化这种操作。

// const ages = [11, 33, 12, 54, 18, 96];

// // 旧写法
// const youngest = Math.min.apply(Math, ages);
// const oldest = Math.max.apply(Math, ages);
// const type = Object.prototype.toString.call(youngest);

// // 新写法
// const youngest = Reflect.apply(Math.min, Math, ages);
// const oldest = Reflect.apply(Math.max, Math, ages);
// const type = Reflect.apply(Object.prototype.toString, youngest, []);
// Reflect.defineProperty(target, propertyKey, attributes)
// Reflect.defineProperty方法基本等同于Object.defineProperty，用来为对象定义属性。未来，后者会被逐渐废除，请从现在开始就使用Reflect.defineProperty代替它。

// function MyDate() {
//   /*…*/
// }

// // 旧写法
// Object.defineProperty(MyDate, 'now', {
//   value: () => Date.now()
// });

// // 新写法
// Reflect.defineProperty(MyDate, 'now', {
//   value: () => Date.now()
// });
// 如果Reflect.defineProperty的第一个参数不是对象，就会抛出错误，比如Reflect.defineProperty(1, 'foo')。

// 这个方法可以与Proxy.defineProperty配合使用。

// const p = new Proxy({}, {
//   defineProperty(target, prop, descriptor) {
//     console.log(descriptor);
//     return Reflect.defineProperty(target, prop, descriptor);
//   }
// });

// p.foo = 'bar';
// // {value: "bar", writable: true, enumerable: true, configurable: true}

// p.foo // "bar"
// 上面代码中，Proxy.defineProperty对属性赋值设置了拦截，然后使用Reflect.defineProperty完成了赋值。

// Reflect.getOwnPropertyDescriptor(target, propertyKey)
// Reflect.getOwnPropertyDescriptor基本等同于Object.getOwnPropertyDescriptor，用于得到指定属性的描述对象，将来会替代掉后者。

// var myObject = {};
// Object.defineProperty(myObject, 'hidden', {
//   value: true,
//   enumerable: false,
// });

// // 旧写法
// var theDescriptor = Object.getOwnPropertyDescriptor(myObject, 'hidden');

// // 新写法
// var theDescriptor = Reflect.getOwnPropertyDescriptor(myObject, 'hidden');
// Reflect.getOwnPropertyDescriptor和Object.getOwnPropertyDescriptor的一个区别是，如果第一个参数不是对象，Object.getOwnPropertyDescriptor(1, 'foo')不报错，
// 返回undefined，而Reflect.getOwnPropertyDescriptor(1, 'foo')会抛出错误，表示参数非法。

// Reflect.isExtensible (target)
// Reflect.isExtensible方法对应Object.isExtensible，返回一个布尔值，表示当前对象是否可扩展。

// const myObject = {};

// // 旧写法
// Object.isExtensible(myObject) // true

// // 新写法
// Reflect.isExtensible(myObject) // true
// 如果参数不是对象，Object.isExtensible会返回false，因为非对象本来就是不可扩展的，而Reflect.isExtensible会报错。

// Object.isExtensible(1) // false
// Reflect.isExtensible(1) // 报错
// Reflect.preventExtensions(target)
// Reflect.preventExtensions对应Object.preventExtensions方法，用于让一个对象变为不可扩展。它返回一个布尔值，表示是否操作成功。

// var myObject = {};

// // 旧写法
// Object.preventExtensions(myObject) // Object {}

// // 新写法
// Reflect.preventExtensions(myObject) // true
// 如果参数不是对象，Object.preventExtensions在 ES5 环境报错，在 ES6 环境返回传入的参数，而Reflect.preventExtensions会报错。

// // ES5 环境
// Object.preventExtensions(1) // 报错

// // ES6 环境
// Object.preventExtensions(1) // 1

// // 新写法
// Reflect.preventExtensions(1) // 报错
// Reflect.ownKeys (target)
// Reflect.ownKeys方法用于返回对象的所有属性，基本等同于Object.getOwnPropertyNames与Object.getOwnPropertySymbols之和。

// var myObject = {
//   foo: 1,
//   bar: 2,
//   [Symbol.for('baz')]: 3,
//   [Symbol.for('bing')]: 4,
// };

// // 旧写法
// Object.getOwnPropertyNames(myObject)
// // ['foo', 'bar']

// Object.getOwnPropertySymbols(myObject)
// //[Symbol(baz), Symbol(bing)]

// // 新写法
// Reflect.ownKeys(myObject)
// // ['foo', 'bar', Symbol(baz), Symbol(bing)]
// 如果Reflect.ownKeys()方法的第一个参数不是对象，会报错。

// 实例：使用 Proxy 实现观察者模式
// 观察者模式（Observer mode）指的是函数自动观察数据对象，一旦对象有变化，函数就会自动执行。
// 下面，使用 Proxy 写一个观察者模式的最简单实现，即实现observable和observe这两个函数。思路是observable函数返回一个原始对象的 Proxy 代理，
// 拦截赋值操作，触发充当观察者的各个函数。
const queuedObservers = new Set()
const observe = fn => queuedObservers.add(fn)
const observable = obj => new Proxy(obj, { set })
function set(target, key, value, receiver) {
  const result = Reflect.set(target, key, value, receiver)
  queuedObservers.forEach(observer => observer())
  log('result:' + result)
  return result
}
// 上面代码中，先定义了一个Set集合，所有观察者函数都放进这个集合。然后，observable函数返回原始对象的代理，拦截赋值操作。拦截函数set之中，会自动执行所有观察者。
const test = {
  name: '张三',
  age: 20
}
const person2 = observable(test)

function print() {
  console.log(`${person2.name}, ${person2.age}`)
}
observe(print)
person2.name = '李四'
// 输出
// 李四, 20
// 上面代码中，数据对象person是观察目标，函数print是观察者。一旦数据对象发生变化，print就会自动执行。
person2.name = 'tocean'
person2.age = 107
log(person2.age)
log(test.age)
