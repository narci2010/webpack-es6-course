//node serverside.js
//   Thunkify 模块
// 生产环境的转换器，建议使用 Thunkify 模块。
// npm install thunkify -D
//  npm install fs -D
var thunkify = require('thunkify')
var fs = require('fs')

// var read = thunkify(fs.readFile)
// read('./package.json')(function(err, str) {
//   console.log(err + ':' + str)
// })

// var readFileThunk = thunkify(fs.readFile)

// var gen = function*() {
//   var r1 = yield readFileThunk('./package.json')
//   console.log(r1.toString())
//   var r2 = yield readFileThunk('./readme.MD')
//   console.log(r2.toString())
// }

// var g = gen()

// var r1 = g.next()
// r1.value(function(err, data) {
//   if (err) throw err
//   var r2 = g.next(data)
//   r2.value(function(err, data) {
//     if (err) throw err
//     g.next(data)
//   })
// })
// 上面代码中，变量g是 Generator 函数的内部指针，表示目前执行到哪一步。next方法负责将指针移动到下一步，并返回该步的信息（value属性和done属性）。
// 仔细查看上面的代码，可以发现 Generator 函数的执行过程，其实是将同一个回调函数，反复传入next方法的value属性。这使得我们可以用递归来自动完成这个过程。

// Thunk 函数有什么作用?
// 情景：如果我们想从一个文件中读取内容，然后在将读取的内容写入到另一个文件中。读文件是异步的，这时我们要阻塞线程，才能保证存入到新文件的内容是刚才读取的内容。
// 异步变成同步
const path = require('path')
const fpath1 = path.join(__dirname, './test1.txt')
const fpath2 = path.join(__dirname, './test2.txt')

var readFileThunify = thunkify(fs.readFile)
var writeFileThunify = thunkify(fs.writeFile)
var gen5 = function*() {
  var data = yield readFileThunify(fpath1)
  console.log('read file:' + data)
  var data2 = yield writeFileThunify(fpath2, data) //写文件无返回值，故undefined
  console.log('write file:' + data2)
}

// (1) 与（2）、（3）代码效果相同
// var g5 = gen5()
// g5.next().value((err, data) => {
//   if (err) console.log(`${err}`)
//   else {
//     console.log(`${data}`) //only for test
//     // 将读取到的内容传给写入文件的方法中
//     g5.next(data).value((err, data) => {
//       //read file:only for test
//       if (err) console.log(`${err}`)
//       else {
//         console.log(`${data}`) //undefined
//         g5.next('successfully.') //write file:successfully
//       }
//     })
//   }
// })

//（2）
// Thunk 函数的自动流程管理
// Thunk 函数真正的威力，在于可以自动执行 Generator 函数。下面就是一个基于 Thunk 函数的 Generator 执行器。
// function run(fn) {
//   var gen = fn()

//   function next(err, data) {
//     if (err) {
//       console.log(`${err}`)
//     } else {
//       if (!data) data = 'successfully'
//       var result = gen.next(data)
//       if (result.done) return
//       result.value(next)
//     }
//   }

//   next()
// }
// run(gen5)

// (3)
// co 模块是著名程序员 TJ Holowaychuk 于 2013 年 6 月发布的一个小工具，用于 Generator 函数的自动执行。
//  npm i co -D
var co = require('co')
co(gen5)
// 为什么 co 可以自动执行 Generator 函数？
// 前面说过，Generator 就是一个异步操作的容器。它的自动执行需要一种机制，当异步操作有了结果，能够自动交回执行权。
// 两种方法可以做到这一点。
// （1）回调函数。将异步操作包装成 Thunk 函数，在回调函数里面交回执行权。
// （2）Promise 对象。将异步操作包装成 Promise 对象，用then方法交回执行权。
// co 模块其实就是将两种自动执行器（Thunk 函数和 Promise 对象），包装成一个模块。
// 使用 co 的前提条件是，Generator 函数的yield命令后面，只能是 Thunk 函数或 Promise 对象。

// 处理并发的异步操作
// co 支持并发的异步操作，即允许某些操作同时进行，等到它们全部完成，才进行下一步。
// 这时，要把并发的操作都放在数组或对象里面，跟在yield语句后面。
// 数组的写法
co(function*() {
  var res = yield [Promise.resolve(1), Promise.resolve(2)]
  console.log(res)
}).catch(onerror)

// 对象的写法
co(function*() {
  var res = yield {
    1: Promise.resolve(1),
    2: Promise.resolve(2)
  }
  console.log(res)
}).catch(onerror)

function onerror() {
  console.log('error occur.')
}

co(function*() {
  var values = [1, 3, 5]
  let a = yield values.map(somethingAsync)
  console.log(typeof a == Array)
  console.log('done:' + a)
})

function* somethingAsync(x) {
  // do something async
  // 没有yield只有return的生成器，效果跟普通函数一样，故此处function*==function
  return x + 1
}
//    上面的代码允许并发三个somethingAsync异步操作，等到它们全部完成，才会进行下一步。

// 实例：处理 Stream
// Node 提供 Stream 模式读写数据，特点是一次只处理数据的一部分，数据分成一块块依次处理，就好像“数据流”一样。
// 这对于处理大规模数据非常有利。Stream 模式使用 EventEmitter API，会释放三个事件。

// data事件：下一块数据块已经准备好了。
// end事件：整个“数据流”处理完了。
// error事件：发生错误。
// 使用Promise.race()函数，可以判断这三个事件之中哪一个最先发生，只有当data事件最先发生时，
// 才进入下一个数据块的处理。从而，我们可以通过一个while循环，完成所有数据的读取。

const stream = fs.createReadStream('./les_miserables.txt')
let valjeanCount = 0

co(function*() {
  while (true) {
    const res = yield Promise.race([
      new Promise(resolve => stream.once('data', resolve)),
      new Promise(resolve => stream.once('end', resolve)),
      new Promise((resolve, reject) => stream.once('error', reject))
    ])
    if (!res) {
      break
    }
    stream.removeAllListeners('data')
    stream.removeAllListeners('end')
    stream.removeAllListeners('error')
    valjeanCount += (res.toString().match(/雨果/gi) || []).length
  }
  console.log('count:', valjeanCount) // count: 14
})
// 上面代码采用 Stream 模式读取《悲惨世界》的文本文件，对于每个数据块都使用stream.once方法，
// 在data、end、error三个事件上添加一次性回调函数。变量res只有在data事件发生时才有值，然后累加每个数据块之中"雨果"这个词出现的次数。
