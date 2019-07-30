export default function testPromise() {
  // Promise 构造函数接受一个函数作为参数，该函数的两个参数分别是 resolve 方法和 reject 方法。
  // 如果异步操作成功，则用 resolve 方法将 Promise 对象的状态，从“未完成”变为“成功”（即从 pending 变为 resolved）；
  // 如果异步操作失败，则用 reject 方法将 Promise 对象的状态，从“未完成”变为“失败”（即从 pending 变为 rejected）。
  let op = false
  var promise = new Promise(function(resolve, reject) {
    if (op) {
      resolve('success')
    } else {
      reject('error')
    }
  })
  //Promise 实例生成以后，可以用 then 方法分别指定 resolve 方法和 reject 方法的回调函数。
  promise.then(
    function(value) {
      // success
      console.log(value)
    },
    function(error) {
      // failure
      console.log(error)
    }
  )

  function timeout(ms) {
    return new Promise((resolve, reject) => {
      // 要么成功，要么失败，下面语句第一条语句生效
      setTimeout(reject, ms)
      setTimeout(resolve, ms)
    })
  }

  timeout(100).then(
    () => {
      console.log('done')
    },
    () => {
      console.log('Fail')
    }
  )

  var getJSON = function(url) {
    var promise = new Promise(function(resolve, reject) {
      var client = new XMLHttpRequest()
      client.open('GET', url)
      client.onreadystatechange = handler
      client.responseType = 'json'
      client.setRequestHeader('Accept', 'application/json')
      client.send()

      function handler() {
        if (this.readyState === 4) {
          if (this.status === 200) {
            // for (let a in this) {
            //     if(a!='responseText' ||a!='responseXML')
            //     console.log(a+":"+this[a])
            //   }
            resolve(this.response)
          } else {
            reject(new Error(this.statusText))
          }
        }
      }
    })

    return promise
  }
  // 改成post2.json 出错
  getJSON('/posts.json').then(
    function(json) {
      console.log('Contents: ')
      for (let j in json) {
        console.log(j + ':' + json[j])
      }
    },
    function(error) {
      console.error('出错了', error)
    }
  )

  var promise2 = new Promise(function(resolve, reject) {
    throw new Error('test')
  })
  promise2.catch(function(error) {
    console.log(error)
  })
  // Error: test

  // 如果Promise状态已经变成resolved，再抛出错误是无效的。
  var promise3 = new Promise(function(resolve, reject) {
    resolve('ok')
    throw new Error('test')
  })
  promise3
    .then(function(value) {
      console.log(value)
    })
    .catch(function(error) {
      console.log(error)
    })
  // ok

  // var p = Promise.all([p1,p2,p3]);
  // 上面代码中，Promise.all方法接受一个数组作为参数，p1、p2、p3都是Promise对象的实例。（Promise.all方法的参数不一定是数组，但是必须具有iterator接口，且返回的每个成员都是Promise实例。）
  // p的状态由p1、p2、p3决定，分成两种情况。
  // （1）只有p1、p2、p3的状态都变成fulfilled，p的状态才会变成fulfilled，此时p1、p2、p3的返回值组成一个数组，传递给p的回调函数。
  // （2）只要p1、p2、p3之中有一个被rejected，p的状态就变成rejected，此时第一个被reject的实例的返回值，会传递给p的回调函数。
  // 生成一个Promise对象的数组
  var promises = [2, 3].map(function(id) {
    return getJSON('/post' + id + '.json')
  })
  Promise.all(promises)
    .then(function(posts) {
      console.log(posts)
    })
    .catch(function(reason) {
      console.log(reason)
    })

  // Promise.race方法同样是将多个Promise实例，包装成一个新的Promise实例。
  // var p = Promise.race([p1,p2,p3]);
  // 上面代码中，只要p1、p2、p3之中有一个实例率先改变状态，p的状态就跟着改变。那个率先改变的Promise实例的返回值，就传递给p的返回值。
  // 如果Promise.all方法和Promise.race方法的参数，不是Promise实例，就会先调用下面讲到的Promise.resolve方法，将参数转为Promise实例，再进一步处理
  promises = [2, 3, 5].map(function(id) {
    return getJSON('/post' + id + '.json')
  })
  Promise.race(promises)
    .then(function(posts) {
      console.log(posts)
    })
    .catch(function(reason) {
      console.log(reason)
    })

  function getFoo(value) {
    return new Promise(function(resolve, reject) {
      resolve(value)
    })
  }

  function getFoo2(value) {
    return new Promise(function(resolve, reject) {
      resolve(value)
    })
  }

  var g = function*() {
    try {
      var foo = yield getFoo('foo')
      var foo2 = yield getFoo2('foo2')
      console.log(foo)
      console.log(foo2)
    } catch (e) {
      console.log(e)
    }
  }

  //这么玩的话，134，135行代码不会执行
  let fooPromises = g()
  console.log('fooPromises')
  let fooPromise = fooPromises.next() //.value
  console.log(fooPromise)
  fooPromise = fooPromises.next() //.value
  console.log(fooPromise)

  function run(generator) {
    var it = generator()

    function go(result) {
      // done:true才返回值
      if (result.done) return 'abc' //result.value; 返回自动变成Promise类型

      return result.value.then(
        function(value) {
          //resolve 内容会用next函数的参数替换
          return go(it.next('value:' + value))
        },
        function(error) {
          return go(it.throw(error + ':' + value))
        }
      )
    }

    console.log(go(it.next())) // promise:undefined
    function go2() {
      op = true
      var promise5 = new Promise(function(resolve, reject) {
        if (op) {
          resolve('success')
        } else {
          reject('error')
        }
      })

      return promise5.then(function(value) {
        console.log('promise5:' + value)
        return 'success' // 这个success将是一个promise对象。如果这里没有return，则表示返回undefined
      })
    }

    console.log(go2()) // promise:undefined
  }

  run(g)
}
