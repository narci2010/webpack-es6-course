export default function testGenerator() {
  const getIterator = function*() {
    yield 'A'
    yield 'B'
    yield 'C'
  }
  const iterator = getIterator()
  console.log(iterator.next()) //{done: false, value: "A"}
  console.log(iterator.next()) //{done: false, value: "B"}
  console.log(iterator.next()) //{done: false, value: "C"}
  console.log(iterator.next()) //{done: true, value: undefined}
  console.log(iterator.next()) //{done: true, value: undefined}

  // 生成器本质上是一个返回迭代器的函数。
  // function *()来表示这个函数，
  // yield相当于return，每调用一次就会结束使用掉一个“return”
  // yield只能在 生成器内部使用
  const getIterator2 = function*() {
    console.log('第1次执行next')
    yield 'A'
    console.log('第2次执行next')
    yield 'B'
    console.log('第3次执行next')
    yield 'C'
  }
  const iterator2 = getIterator2()
  console.log(iterator2.next()) //第1次执行next {done: false, value: "A"}
  console.log(iterator2.next()) //第2次执行next {done: false, value: "B"}
  console.log(iterator2.next()) //第3次执行next {done: false, value: "C"}
  console.log(iterator2.next()) //{done: true, value: undefined} 难怪后面返回的是 undefined 可能是因为最后一次“yeild”返回的是undefined

  //   不能使用lambda创建生成器,如：
  // const getIterator =  *(array) => {
  //    yield 1
  // }

  // return 会终止迭代,提前结束迭代 vs yield
  const getIterator3 = function*() {
    console.log('第1次执行next')
    yield 'A'
    console.log('第2次执行next')
    return 'B'
    console.log('第3次执行next')
    yield 'C'
  }
  const iterator3 = getIterator3()
  console.log(iterator3.next()) //第1次执行next {value: "A", done: false}
  console.log(iterator3.next()) //第2次执行next {value: "B", done: true}
  console.log(iterator3.next()) //第3次执行next {value: undefined, done: true}

  // 可迭代对象都可以使用for-of进行循环。
  // 所有集合（Array、Set、Map）和字符串都是可迭代对象
  // 因为这些对象内部实现了
  // Array.prototype[Symbol.iterator] = *function(){
  //     for(let data in this){
  //         yeild data
  //     }
  // }
  // 迭代器都可以用for-of 来循环：
  const getIterator4 = function*() {
    yield 'A'
    yield 'B'
    yield 'C'
  }
  const iterator4 = getIterator4()
  for (let a of iterator4) {
    console.log(a)
  }
  // A B C

  // 迭代器都可以用for-of 来循环，每次循环前都会检查下是不是可迭代的内容。
  // 校验的逻辑类似于：
  const isIterator = Clazz => {
    return typeof new Clazz()[Symbol.iterator] === 'function'
  }
  const myArray = function(array) {
    this[Symbol.iterator] = function*() {
      //迭代器方法是放在对象里面，而不是原型链上，但是它确实是可迭代对象
      for (let data in array) {
        yield data
      }
    }
  }
  console.log(isIterator(myArray)) //true

  //   迭代器传参
  // next方法传参的值会替换上次 yield返回的值：
  // 第一次next方法无论如何传入啥都会被丢弃
  let getIterator5 = function*() {
    console.log('第1次执行next')
    let first = yield 'A'
    console.log('第2次执行next')
    let second = yield first + 'B'
  }
  let iterator5 = getIterator5()
  console.log(iterator5.next()) //{value: "A", done: false}
  console.log(iterator5.next()) //{value: "undefinedB", done: false}
  console.log(iterator5.next()) //{value: undefined, done: true}

  iterator5 = getIterator5()
  console.log(iterator5.next(1)) //{value: "A", done: false}
  console.log(iterator5.next(2)) //{value: "2B", done: false}
  console.log(iterator5.next(3)) //{value: undefined, done: true}

  let getIterator6 = function*() {
    console.log('第1次执行next')
    let first = yield 'A'
    console.log('第2次执行next')
    let second = yield first + 'B'
    yield second + 'C'
  }
  let iterator6 = getIterator6()
  console.log(iterator6.next(1)) //{value: "A", done: false}
  console.log(iterator6.next(2)) //{value: "2B", done: false}
  console.log(iterator6.next(3)) //{value: "3C", done: true}
  // 内部执行顺序大概是：
  // iterator.next(1) =>  console.log("第1次执行next"); yield "A"
  // iterator.next(2) =>  console.log("第2次执行next");let first = 2; yield first + "B";
  // iterator.next(3) =>  console.log("第3次执行next");let second  = 3; yield second + "C"

  let getIterator7 = function*() {
    // 如果不保持yield的返回值，则迭代器的next函数的参数就没任何意义了
    console.log('第1次执行next')
    yield 'A'
    console.log('第2次执行next')
    yield 'B'
    yield 'C'
  }
  let iterator7 = getIterator7()
  console.log(iterator7.next(1)) //{value: "A", done: false}
  console.log(iterator7.next(2)) //{value: "2B", done: false}
  console.log(iterator7.next(3)) //{value: "3C", done: true}

  //   注入错误，强行阻止往下迭代：
  const getIterator8 = function*() {
    yield 'A'
    yield 'B'
    yield 'C'
  }
  const iterator8 = getIterator8()
  console.log(iterator8.next()) //{value: "A", done: false}
  // console.log(iterator8.throw(new Error('Boom Sakalaka'))) //Uncaught Error: Boom Sakalaka，终止js文件后面全部代码，因为异常没捕获处理
  //以下代码不执行
  console.log(iterator8.next())
  //如果此时还能拿到iterator，这时候 iterator.next() {value: undefined, done: true}
  // iterator.next() =>  yield "A"
  // iterator.throw(new Error("Boom Sakalaka")) => error,在 yield "B"之前抛出错误

  //   迭代捕获
  const getIterator9 = function*() {
    let message = ''
    yield 'A'
    try {
      yield 'B'
    } catch (e) {
      message = e.toString()
    }
    yield message + 'C'
  }
  let iterator9 = getIterator9()
  console.log(iterator9.next()) //{value: "A", done: false}
  console.log(iterator9.next()) //{value: "B", done: false}
  // 因为异常做了处理，故不会终止程序执行
  console.log(iterator9.throw(new Error('Boom Sakalaka'))) //{value: "Error: Boom SakalakaC", done: false}
  // throw也是一次迭代，也是在正常的next方法执行返回值 yield value 之前抛出错误，如果错误没有被处理则直接终止迭代。
  console.log(iterator9.next()) //{value: undefined, done: true}

  //   9等价于10(注意throw的位置):
  const getIterator10 = function*() {
    let message = ''
    yield 'A'
    try {
      yield 'B'
      throw new Error('Boom Sakalaka')
    } catch (e) {
      message = e.toString()
    }
    yield message + 'C'
  }
  let iterator10 = getIterator10()
  console.log(iterator10.next()) //{value: "A", done: false}
  console.log(iterator10.next()) //{value: "B", done: false}
  console.log(iterator10.next()) //{value: "Error: Boom SakalakaC", done: false}
  console.log(iterator10.next()) //{value: undefined, done: true}

  //   委托生成器
  // 有些时候多个生成器需要合并成一个。
  // 语法：
  // getIteratorFunc =  function*() {
  //     yield * 【新的迭代器】
  // }
  // 幼儿园发水果：苹果3个，香蕉2根，在两个篮子。发完了苹果，才能发香蕉。
  // 这时候老师只能拿一个篮子，把苹果和香蕉放一个篮子，问题解决。
  let getAppleIterator = function*() {
    yield '苹果1'
    yield '苹果2'
    yield '苹果3'
  }
  let getBananaIterator = function*() {
    yield '香蕉1'
    yield '香蕉2'
  }
  let apple = getAppleIterator()
  console.log(apple.next()) //{value: "苹果1", done: false}
  console.log(apple.next()) //{value: "苹果2", done: false}
  console.log(apple.next()) //{value: "苹果3", done: false}

  let banana = getBananaIterator()
  console.log(banana.next()) //{value: "香蕉1", done: false}
  console.log(banana.next()) //{value: "香蕉2", done: false}

  //  可以写成这样：

  let getFruitIterator = function*() {
    yield* getAppleIterator()
    yield* getBananaIterator()
  }
  let fruit = getFruitIterator()
  console.log(fruit.next()) //{value: "苹果1", done: false}
  console.log(fruit.next()) //{value: "苹果2", done: false}
  console.log(fruit.next()) //{value: "苹果3", done: false}
  console.log(fruit.next()) //{value: "香蕉1", done: false}
  console.log(fruit.next()) //{value: "香蕉2", done: false}

  //   高端委托：利用生成器返回值处理复杂任务
  let getAppleIterator2 = function*() {
    yield '苹果1'
    yield '苹果2'
    return 1
  }
  let getBananaIterator2 = function*(count) {
    yield `香蕉${count}`
  }
  let getFruitIterator2 = function*() {
    const count = yield* getAppleIterator2()
    yield* getBananaIterator2(count)
  }
  let fruit2 = getFruitIterator2()
  console.log(fruit2.next()) //{value: "苹果1", done: false}
  console.log(fruit2.next()) //{value: "苹果2", done: false}
  console.log(fruit2.next()) //{value: "香蕉1", done: false}
  console.log(fruit2.next()) //{value: undefined, done: true}

  //   可委托迭代
  // 字符串、数组啥的都可以迭代出来：
  let getIterator11 = function*() {
    yield* '123'
  }
  let it11 = getIterator11()
  console.log(it11.next()) //{value: "1", done: false}
  console.log(it11.next()) //{value: "2", done: false}
  console.log(it11.next()) //{value: "3", done: false}
  console.log(it11.next()) //{value: undefined, done: true}
  let getIterator12 = function*() {
    yield* [1, 2, 3]
  }
  let it12 = getIterator12()
  console.log(it12.next()) //{value: 1, done: false}
  console.log(it12.next()) //{value: 2, done: false}
  console.log(it12.next()) //{value: 3, done: false}
  console.log(it12.next()) //{value: undefined, done: true}

  //异步任务执行
  //   yield 会暂停函数执行过程，等待下次next的迭代：
  // 在迭代器next传入参数会被下一个next执行操作捕获；
  // 一般来说我们会想到在业务里面使用生成器，给我们可以迭代的数据。
  // 我们亦可以反其道行之：生成器里面写业务，由一个迭代工具（任务执行工具）帮我们迭代。不关注什么时候next。
  let requestIteratorCreator = function*() {
    const result = yield 2
    console.log(result) //3
    const r2 = yield result + 1
    console.log(r2) //5
  }
  let run = function(aCreator) {
    let task = aCreator()
    let result = task.next()
    let doTask = function() {
      if (!result.done) {
        result = task.next(result.value + 1)
        doTask()
      }
    }
    doTask()
  }

  //   run(function*() {
  //     const result = yield 1 //
  //     console.log(result) //1
  //   })
  run(requestIteratorCreator)

  //   ES7的async-await带我们走向光明
  let fetchRequest = function(url) {
    return new Promise((resolve, reject) => {
      setTimeout(function() {
        resolve(`成功返回${url}的数据`)
      }, 1000)
    })
  }
  async function runFetchDemo() {
    const loginInfo = await fetchRequest('/user/login')
    console.log(loginInfo)
    const userInfo = await fetchRequest('/user/userInfo')
    console.log(userInfo)
  }
  runFetchDemo()
  //成功返回/user/login的数据
  //成功返回/user/userInfo的数据

  let getFetchIterator = function*() {
    yield fetchRequest('/user/login2')
    yield fetchRequest('/user/userInfo2')
  }
  async function runFetchDemo2() {
    let asyncIterator = getFetchIterator()
    const loginInfo = await asyncIterator.next()
    console.log(loginInfo)
    const userInfo = await asyncIterator.next()
    console.log(userInfo)
    // 瞬间输出两个 padding的Promise，很明显不是我们要的

    asyncIterator = getFetchIterator()
    for await (const item of asyncIterator) {
      console.log(item)
    }
    //成功返回/user/login的数据
    //成功返回/user/userInfo的数据
  }
  runFetchDemo2()

  // 异步任务的封装
  //   下面看看如何使用 Generator 函数，执行一个真实的异步任务。
  // npm i node-fetch -D

  var fetch = require('node-fetch')

  function* gen() {
    var url = 'https://api.github.com/users/github'
    var result = yield fetch(url)
    console.log('gen:' + result)
    console.log('gen:' + result.bio)
  }
  var g = gen()
  var result = g.next()

  result.value
    .then(function(data) {
      return data.json()
    })
    .then(function(data) {
      console.log('fetch:' + JSON.stringify(data))
      g.next(data) //此处如果g.next() 则gen生成器的console.log('gen:' + result.bio) 会报错，因为result相当于被重置为undefined
    })

  //Thunk 函数的定义，它是“传名调用”的一种实现策略，用来替换某个表达式。
  //   JavaScript 语言是传值调用，它的 Thunk 函数含义有所不同。在 JavaScript 语言中，Thunk 函数替换的不是表达式，
  //而是多参数函数，将其替换成一个只接受回调函数作为参数的单参数函数。
  // // 正常版本的readFile（多参数版本）
  // fs.readFile(fileName, callback);
  // Thunk版本的readFile（单参数版本）
  // var Thunk = function (fileName) {
  //   return function (callback) {
  //     return fs.readFile(fileName, callback);
  //   };
  // };
  // var readFileThunk = Thunk(fileName);
  // readFileThunk(callback);

  //下面是一个简单的 Thunk 函数转换器。
  // ES6版本
  const Thunk = function(fn) {
    return function(...args) {
      // arguments
      // 1
      return function(callback) {
        // console.log
        return fn.call(this, ...args, callback)
      }
    }
  }
  function f(a, cb) {
    cb(a)
  }
  const ft = Thunk(f)
  ft(1)(console.log) // 1

  // 你可能会问， Thunk 函数有什么用？回答是以前确实没什么用，但是 ES6 有了 Generator 函数，
  // Thunk 函数现在可以用于 Generator 函数的自动流程管理。Generator 函数可以自动执行。
  function* gen2() {
    // ...
    //     yield 1000
    //     yield 1001
    // 下面是一个异步操作，两个yield执行的操作无法保证顺序（同步）
    let y1 = yield testAsyncOperation(50, 'hello5')
    console.log('y1:' + y1) //第2次执行next后执行
    let y2 = yield testAsyncOperation(15, 'hi5')
    console.log('y2:' + y2) //第3次执行next后执行
  }
  function testAsyncOperation(times, param) {
    setTimeout(printArgs, times, param)
    return param
  }
  function printArgs(param) {
    console.log(param + ':are printed.')
  }

  var g2 = gen2()
  var res = g2.next()

  while (!res.done) {
    console.log(res.value)
    res = g2.next(res.value) //此处如果next无参数，g2.next()，则y1，y2就说undefined
  }
  // 上面代码中，Generator 函数gen会自动执行完所有步骤。
  // 但是，这不适合异步操作。如果必须保证前一步执行完，才能执行后一步，
  // 上面的自动执行就不可行。这时，Thunk 函数就能派上用处。以读取文件为例。
  // 下面的 Generator 函数封装了两个异步操作。见serverside.js
}
