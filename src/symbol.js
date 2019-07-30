// ES6 引入了一种新的原始数据类型Symbol，表示独一无二的值。它是 JavaScript 语言的第七种数据类型，
// 前六种是：undefined、null、布尔值（Boolean）、字符串（String）、数值（Number）、对象（Object）。
// Symbol 值通过Symbol函数生成。这就是说，对象的属性名现在可以有两种类型，一种是原来就有的字符串，另一种就是新增的 Symbol 类型。
// 凡是属性名属于 Symbol 类型，就都是独一无二的，可以保证不会与其他属性名产生冲突。
export default function testSymbol() {
  let s = Symbol()
  console.log(typeof s) // "symbol"

  // 注意，Symbol函数前不能使用new命令，否则会报错。
  // 这是因为生成的 Symbol 是一个原始类型的值，不是对象。
  // 也就是说，由于 Symbol 值不是对象，所以不能添加属性。基本上，它是一种类似于字符串的数据类型。

  // Symbol函数可以接受一个字符串作为参数，表示对 Symbol 实例的描述，主要是为了在控制台显示，或者转为字符串时，比较容易区分。
  let s1 = Symbol('foo')
  let s2 = Symbol('bar')
  let s3 = Symbol('bar')
  console.log(s1) // Symbol(foo)
  console.log(s2) // Symbol(bar)
  console.log(s2 == s3) // false
  console.log(s1.toString()) // "Symbol(foo)"
  console.log(s2.toString()) // "Symbol(bar)"
  console.log(s3.toString()) // "Symbol(bar)"

  //   如果 Symbol 的参数是一个对象，就会调用该对象的toString方法，将其转为字符串，然后才生成一个 Symbol 值。
  let obj = {
    toString() {
      return 'abc'
    }
  }
  let sym = Symbol(obj)
  console.log(sym) // Symbol(abc)

  // Symbol 值不能与其他类型的值进行运算，会报错。
  //   let sym = Symbol('My symbol')
  //   console.log('your symbol is ' + sym`your symbol is ${sym}`)
  // TypeError: can't convert symbol to string

  //   但是，Symbol 值可以显式转为字符串。
  sym = Symbol('My symbol')
  console.log(String(sym)) // 'Symbol(My symbol)'
  console.log(sym.toString()) // 'Symbol(My symbol)'
  // 另外，Symbol 值也可以转为布尔值，但是不能转为数值。
  sym = Symbol()
  console.log(Boolean(sym)) // true
  console.log(!sym) // false
  //   console.log(Number(sym)) // TypeError
  //   console.log(sym + 2) // TypeError

  //   上面的用法不是很方便。ES2019 提供了一个实例属性description，直接返回 Symbol 的描述。
  sym = Symbol('foo-new')
  console.log(sym.description) // "foo-new"

  //   作为属性名的 Symbol
  // 由于每一个 Symbol 值都是不相等的，这意味着 Symbol 值可以作为标识符，用于对象的属性名，
  // 就能保证不会出现同名的属性。这对于一个对象由多个模块构成的情况非常有用，能防止某一个键被不小心改写或覆盖。
  let mySymbol = Symbol()
  // 第一种写法
  let a1 = {}
  a1[mySymbol] = 'Hello!'
  // 第二种写法
  let a2 = {
    //同理，在对象的内部，使用 Symbol 值定义属性时，Symbol 值必须放在方括号之中。
    [mySymbol]: 'Hello!'
  }
  // 第三种写法
  let a3 = {}
  Object.defineProperty(a3, mySymbol, { value: 'Hello!' })
  // 以上写法都得到同样结果
  console.log(a1[mySymbol]) // "Hello!"
  console.log(a2[mySymbol]) // "Hello!"
  console.log(a3[mySymbol]) // "Hello!"

  //   注意，Symbol 值作为对象属性名时，不能用点运算符。
  mySymbol = Symbol()
  let a = {}
  a.mySymbol = 'Hello!' //对象.后面的是对象的字符串属性
  console.log(a[mySymbol]) // undefined
  console.log(a['mySymbol']) // "Hello!"

  //   同理，在对象的内部，使用 Symbol 值定义属性时，Symbol 值必须放在方括号之中。
  s = Symbol()
  obj = {
    [s]: function(arg) {
      console.log(arg)
    }
  }
  obj[s](123)
  // 上面代码中，如果s不放在方括号中，该属性的键名就是字符串s，而不是s所代表的那个 Symbol 值。
  // 采用增强的对象写法，上面代码的obj对象可以写得更简洁一些。
  obj = {
    [s](arg) {
      console.log(arg * 2)
    }
  }
  obj[s](123)

  //   Symbol 类型还可以用于定义一组常量，保证这组常量的值都是不相等的。
  let log = {}
  log.levels = {
    DEBUG: Symbol('debug'),
    INFO: Symbol('info'),
    WARN: Symbol('warn')
  }
  console.log(log.levels.DEBUG, 'debug message')
  console.log(log.levels.INFO, 'info message')

  //   下面是另外一个例子。
  const COLOR_RED = Symbol('red')
  const COLOR_GREEN = Symbol('green')
  function getComplement(color) {
    switch (color) {
      case COLOR_RED:
        return COLOR_GREEN
      case COLOR_GREEN:
        return COLOR_RED
      default:
        throw new Error('Undefined color')
    }
  }
  console.log(getComplement(COLOR_GREEN))
  // 常量使用 Symbol 值最大的好处，就是其他任何值都不可能有相同的值了，因此可以保证上面的switch语句会按设计的方式工作。
  // 还有一点需要注意，Symbol 值作为属性名时，该属性还是公开属性，不是私有属性。

  //   属性名的遍历
  // Symbol 作为属性名，该属性不会出现在for...in、for...of循环中，
  // 也不会被Object.keys()、Object.getOwnPropertyNames()、JSON.stringify()返回。但是，它也不是私有属性，有一个Object.getOwnPropertySymbols方法，可以获取指定对象的所有 Symbol 属性名。
  // Object.getOwnPropertySymbols方法返回一个数组，成员是当前对象的所有用作属性名的 Symbol 值。
  obj = {}
  a = Symbol('a')
  let b = Symbol('b')
  obj[a] = 'Hello'
  obj[b] = 'World'
  const objectSymbols = Object.getOwnPropertySymbols(obj)
  console.log(objectSymbols) // [Symbol(a), Symbol(b)]

  //   另一个新的 API，Reflect.ownKeys方法可以返回所有类型的键名，包括常规键名和 Symbol 键名。
  obj = {
    [Symbol('my_key')]: 1,
    enum: 2,
    nonEnum: 3
  }
  console.log(Reflect.ownKeys(obj)) //  ["enum", "nonEnum", Symbol(my_key)]

  //   Symbol.for()，Symbol.keyFor()
  // 有时，我们希望重新使用同一个 Symbol 值，Symbol.for方法可以做到这一点。
  // 它接受一个字符串作为参数，然后搜索有没有以该参数作为名称的 Symbol 值。
  // 如果有，就返回这个 Symbol 值，否则就新建并返回一个以该字符串为名称的 Symbol 值。
  s1 = Symbol.for('foo')
  s2 = Symbol.for('foo')
  console.log(s1 === s2) // true

  //   Symbol.keyFor方法返回一个已登记的 Symbol 类型值的key。
  s1 = Symbol.for('foo')
  console.log(Symbol.keyFor(s1)) // "foo"
  s2 = Symbol('foo')
  console.log(Symbol.keyFor(s2)) // undefined

  //   需要注意的是，Symbol.for为 Symbol 值登记的名字，是全局环境的，可以在不同的 iframe 或 service worker 中取到同一个值。
  let iframe = document.createElement('iframe')
  iframe.src = String(window.location)
  document.body.appendChild(iframe)
  console.log(iframe.contentWindow.Symbol.for('foo') === Symbol.for('foo'))
  // true
  // 上面代码中，iframe 窗口生成的 Symbol 值，可以在主页面得到。

  //   内置的 Symbol 值
  // 除了定义自己使用的 Symbol 值以外，ES6 还提供了 11 个内置的 Symbol 值，指向语言内部使用的方法。
  // （1） Symbol.hasInstance
  // 对象的Symbol.hasInstance属性，指向一个内部方法。当其他对象使用instanceof运算符，
  // 判断是否为该对象的实例时，会调用这个方法。比如，foo instanceof Foo在语言内部，实际调用的是Foo[Symbol.hasInstance](foo)。)
  class MyClass {
    [Symbol.hasInstance](foo) {
      return foo instanceof Array
    }
  }
  console.log([1, 2, 3] instanceof new MyClass()) // true
  //   下面是另一个例子。
  // class Even {
  //   static [Symbol.hasInstance](obj) {
  //     return Number(obj) % 2 === 0;
  //   }
  // }
  // 等同于
  const Even = {
    [Symbol.hasInstance](obj) {
      return Number(obj) % 2 === 0
    }
  }
  console.log(1 instanceof Even) // false
  console.log(2 instanceof Even) // true
  console.log(12345 instanceof Even) // false

  //  (2) Symbol.isConcatSpreadable
  // 对象的Symbol.isConcatSpreadable属性等于一个布尔值，表示该对象用于Array.prototype.concat()时，是否可以展开。
  let arr1 = ['c', 'd']
  console.log(['a', 'b'].concat(arr1, 'e')) // ['a', 'b', 'c', 'd', 'e']
  console.log(arr1[Symbol.isConcatSpreadable]) // undefined 数组默认可以展开
  let arr2 = ['c', 'd']
  arr2[Symbol.isConcatSpreadable] = false //设置不可展开
  console.log(['a', 'b'].concat(arr2, 'e')) // ['a', 'b', ['c','d'], 'e']
  obj = { length: 2, 0: 'c', 1: 'd' }
  console.log(obj[Symbol.isConcatSpreadable]) // undefined 对象默认不可以展开
  console.log(['a', 'b'].concat(obj, 'e')) // ['a', 'b', obj, 'e']
  obj[Symbol.isConcatSpreadable] = true //需要设置为true才能展开
  console.log(['a', 'b'].concat(obj, 'e')) // ['a', 'b', 'c', 'd', 'e
  //   Symbol.isConcatSpreadable属性也可以定义在类里面。
  class A1 extends Array {
    constructor(args) {
      super(args)
      this[Symbol.isConcatSpreadable] = true
    }
  }
  class A2 extends Array {
    constructor(args) {
      super(args)
    }
    get [Symbol.isConcatSpreadable]() {
      return false
    }
  }
  a1 = new A1()
  a1[0] = 3
  a1[1] = 4
  a2 = new A2()
  a2[0] = 5
  a2[1] = 6
  console.log([1, 2].concat(a1).concat(a2))
  // [1, 2, 3, 4, [5, 6]]
  // 上面代码中，类A1是可展开的，类A2是不可展开的，所以使用concat时有不一样的结果。
  // 注意，Symbol.isConcatSpreadable的位置差异，A1是定义在实例上，A2是定义在类本身，效果相同。

  //  (3) Symbol.species
  // 对象的Symbol.species属性，指向一个构造函数。创建衍生对象时，会使用该属性。
  class MyArray extends Array {}
  a = new MyArray(1, 2, 3)
  b = a.map(x => x)
  let c = a.filter(x => x > 1)
  console.log(b instanceof MyArray) // true
  console.log(c instanceof MyArray) // true
  // 上面代码中，子类MyArray继承了父类Array，a是MyArray的实例，b和c是a的衍生对象。
  // 你可能会认为，b和c都是调用数组方法生成的，所以应该是数组（Array的实例），但实际上它们也是MyArray的实例。
  //   Symbol.species属性就是为了解决这个问题而提供的。现在，我们可以为MyArray设置Symbol.species属性。
  class MyArray2 extends Array {
    static get [Symbol.species]() {
      return Array
    }
  }
  a = new MyArray2(1, 2, 3)
  b = a.map(x => x)
  c = a.filter(x => x > 1)
  console.log(b instanceof MyArray) // false
  console.log(c instanceof MyArray) // false
  console.log(b instanceof Array) // true
  console.log(c instanceof Array) // true
  // 上面代码中，由于定义了Symbol.species属性，创建衍生对象时就会使用这个属性返回的函数，作为构造函数。
  // 这个例子也说明，定义Symbol.species属性要采用get取值器。默认的Symbol.species属性等同于下面的写法。
  // static get [Symbol.species]() {
  //   return this;
  // }

  // (4)Symbol.match
  // 对象的Symbol.match属性，指向一个函数。当执行str.match(myObject)时，如果该属性存在，会调用它，返回该方法的返回值。
  //   String.prototype.match(regexp)
  // 等同于
  //   regexp[Symbol.match](this)
  class MyMatcher {
    [Symbol.match](string) {
      return 'hello world'.indexOf(string)
    }
  }
  console.log('d'.match(new MyMatcher())) // 10(index)

  // (5)Symbol.replace
  // 对象的Symbol.replace属性，指向一个方法，当该对象被String.prototype.replace方法调用时，会返回该方法的返回值。
  // String.prototype.replace(searchValue, replaceValue)
  // 等同于
  // searchValue[Symbol.replace](this, replaceValue)
  // 下面是一个例子。
  let x = {}
  let tmpStr = 'Narci Hello'
  x[Symbol.replace] = (...s) => {
    //["Narci Hello", "World"]
    console.log(s)
    return s[0].replace('Hello', s[1])
  }
  // replace创建了新的对象，不会修改原来的对象的值
  console.log(tmpStr.replace('Hello', 'World')) // Narci World
  console.log(tmpStr) //Narci Hello
  console.log(tmpStr.replace(x, 'World')) //Narci World
  // Symbol.replace方法会收到两个参数，第一个参数是replace方法正在作用的对象，上面例子是Hello，第二个参数是替换后的值，上面例子是World。

  //  (6) Symbol.search
  // 对象的Symbol.search属性，指向一个方法，当该对象被String.prototype.search方法调用时，会返回该方法的返回值。
  // String.prototype.search(regexp) 找不到返回-1，否则返回index
  // 等同于
  // regexp[Symbol.search](this)
  class MySearch {
    constructor(value) {
      this.value = value
    }
    [Symbol.search](string) {
      return string.indexOf(this.value)
    }
  }
  console.log('foobar'.search(new MySearch('foo'))) // 0

  // (7)Symbol.split
  // 对象的Symbol.split属性，指向一个方法，当该对象被String.prototype.split方法调用时，会返回该方法的返回值。
  // String.prototype.split(separator, limit)
  // 等同于
  // separator[Symbol.split](this, limit)
  // 下面是一个例子。
  class MySplitter {
    constructor(value) {
      this.value = value
    }
    [Symbol.split](string) {
      let index = string.indexOf(this.value)
      if (index === -1) {
        return string
      }
      return [string.substr(0, index), string.substr(index + this.value.length)]
    }
  }
  console.log('foobar'.split(new MySplitter('foo')))
  // ['', 'bar']
  console.log('foobar'.split(new MySplitter('bar')))
  // ['foo', '']
  console.log('foobar'.split(new MySplitter('baz')))
  // 'foobar'
  // 上面方法使用Symbol.split方法，重新定义了字符串对象的split方法的行为，

  //(8)Symbol.iterator
  // 对象的Symbol.iterator属性，指向该对象的默认遍历器方法。
  // 对象进行for...of循环时，会调用Symbol.iterator方法，返回该对象的默认遍历器
  const myIterable = {}
  myIterable[Symbol.iterator] = function*() {
    yield 1
    yield 2
    yield 3
  }
  console.log([...myIterable]) // [1, 2, 3]

  //   (9)Symbol.toPrimitive
  // 对象的Symbol.toPrimitive属性，指向一个方法。该对象被转为原始类型的值时，会调用这个方法，返回该对象对应的原始类型值。
  // Symbol.toPrimitive被调用时，会接受一个字符串参数，表示当前运算的模式，一共有三种模式。
  // Number：该场合需要转成数值
  // String：该场合需要转成字符串
  // Default：该场合可以转成数值，也可以转成字符串
  obj = {
    [Symbol.toPrimitive](hint) {
      switch (hint) {
        case 'number':
          return 123
        case 'string':
          return 'str'
        case 'default':
          return 'default'
        default:
          throw new Error()
      }
    }
  }
  console.log(2 * obj) // 246
  console.log(3 + obj) // '3default'
  console.log(obj == 'default') // true
  console.log(String(obj)) // 'str'

  // (10)Symbol.toStringTag
  // 对象的Symbol.toStringTag属性，指向一个方法。在该对象上面调用Object.prototype.toString方法时，
  // 如果这个属性存在，它的返回值会出现在toString方法返回的字符串之中，表示对象的类型。
  // 也就是说，这个属性可以用来定制[object Object]或[object Array]中object后面的那个字符串。
  // 例一
  console.log({ [Symbol.toStringTag]: 'Foo' }.toString())
  // "[object Foo]"
  // 例二
  class Collection {
    get [Symbol.toStringTag]() {
      return 'xxx'
    }
  }
  x = new Collection()
  console.log(Object.prototype.toString.call(x))
  console.log(x.toString()) // "[object xxx]"
  // ES6 新增内置对象的Symbol.toStringTag属性值如下。
  // JSON[Symbol.toStringTag]：’JSON’
  // Math[Symbol.toStringTag]：’Math’
  // Module 对象M[Symbol.toStringTag]：’Module’
  // ArrayBuffer.prototype[Symbol.toStringTag]：’ArrayBuffer’
  // DataView.prototype[Symbol.toStringTag]：’DataView’
  // Map.prototype[Symbol.toStringTag]：’Map’
  // Promise.prototype[Symbol.toStringTag]：’Promise’
  // Set.prototype[Symbol.toStringTag]：’Set’
  // %TypedArray%.prototype[Symbol.toStringTag]：’Uint8Array’等
  // WeakMap.prototype[Symbol.toStringTag]：’WeakMap’
  // WeakSet.prototype[Symbol.toStringTag]：’WeakSet’
  // %MapIteratorPrototype%[Symbol.toStringTag]：’Map Iterator’
  // %SetIteratorPrototype%[Symbol.toStringTag]：’Set Iterator’
  // %StringIteratorPrototype%[Symbol.toStringTag]：’String Iterator’
  // Symbol.prototype[Symbol.toStringTag]：’Symbol’
  // Generator.prototype[Symbol.toStringTag]：’Generator’
  // GeneratorFunction.prototype[Symbol.toStringTag]：’GeneratorFunction’

  //  (11) Symbol.unscopables
  // 对象的Symbol.unscopables属性，指向一个对象。该对象指定了使用with关键字时，哪些属性会被with环境排除。
  // 没有 unscopables 时
  //   class MyClass8 {
  //     foo() {
  //       return 1
  //     }
  //   }
  //   var foo = function() {
  //     return 2
  //   }
  //   with (MyClass8.prototype) {
  //     foo() // 1
  //   }
  //   // 有 unscopables 时
  //   class MyClass9 {
  //     foo() {
  //       return 1
  //     }
  //     get [Symbol.unscopables]() {
  //       return { foo: true }
  //     }
  //   }
  //   with (MyClass9.prototype) {
  //     foo() // 2
  //   }
  // 上面代码通过指定Symbol.unscopables属性，使得with语法块不会在当前作用域寻找foo属性，即foo将指向外层作用域的变量。

  //end line
}
