const { log } = console
// 含义
// ES2017 标准引入了 async 函数，使得异步操作变得更加方便。
// async 函数是什么？一句话，它就是 Generator 函数的语法糖。

// 下面是另一个例子，指定多少毫秒后输出一个值。
function timeout(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}
async function asyncPrint(value, ms) {
  await timeout(ms)
  console.log(value)
}
asyncPrint('hello world', 50)
// 上面代码指定 50 毫秒以后，输出hello world。

// 语法
// async函数的语法规则总体上比较简单，难点是错误处理机制。
// 返回 Promise 对象
// async函数返回一个 Promise 对象。
// async函数内部return语句返回的值，会成为then方法回调函数的参数。
async function f() {
  return 'hello world'
}
f().then(v => console.log(v))
// "hello world"
// 上面代码中，函数f内部return命令返回的值，会被then方法回调函数接收到。

// async函数内部抛出错误，会导致返回的 Promise 对象变为reject状态。抛出的错误对象会被catch方法回调函数接收到。
async function f2() {
  throw new Error('出错了')
}
f2().then(v => console.log(v), e => console.log(e))
// .catch(log('error'))
// Error: 出错了

log('******************************************************************')
async function getFoo() {
  await timeout(50)
  log('foo:foo')
  return 'Foo'
}
async function getBar() {
  await timeout(30)
  log('bar:bar')
  return 'Bar'
}
async function testAsync1() {
  //下面两个get函数同步执行 总时间：30+50
  let foo = await getFoo()
  let bar = await getBar()
  log('testAsync1', foo, bar)
}
testAsync1()
async function testAsync2() {
  // 写法一
  // 两个get函数可以异步执行：总时间50
  let [foo, bar] = await Promise.all([getFoo(), getBar()])
  // 写法二
  //   let fooPromise = getFoo()
  //   let barPromise = getBar()
  //   let foo = await fooPromise
  //   let bar = await barPromise
  log('testAsync2', foo, bar)
}
testAsync2()
