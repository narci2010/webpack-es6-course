export default function testClosure() {
  // 闭包是函数和声明该函数的词法环境的组合。
  function makeFunc() {
    // 闭包：相当于下面的语句是private
    var name = 'Mozilla'
    function displayName() {
      console.log(name)
    }
    return displayName
  }
  //   闭包是由函数以及创建该函数的词法环境组合而成。这个环境包含了这个闭包创建时所能访问的所有局部变量。
  var myFunc = makeFunc()
  myFunc()

  function makeAdder(x) {
    return function(y) {
      return x + y
    }
  }
  //   add5 和 add10 都是闭包。它们共享相同的函数定义，但是保存了不同的词法环境。在 add5 的环境中，x 为 5。而在 add10 中，x 则为 10。
  var add5 = makeAdder(5)
  var add10 = makeAdder(10)
  console.log(add5(2)) // 7
  console.log(add10(2)) // 12

  //   用闭包模拟私有方法
  // IIFE（立即调用函数表达式） Immediately Invoked Function Expression
  var Counter = (function() {
    var privateCounter = 0
    function changeBy(val) {
      privateCounter += val
    }
    return {
      increment: function() {
        changeBy(1)
      },
      decrement: function() {
        changeBy(-1)
      },
      value: function() {
        return privateCounter
      }
    }
  })()
  console.log(Counter.value()) /* logs 0 */
  Counter.increment()
  Counter.increment()
  console.log(Counter.value()) /* logs 2 */
  Counter.decrement()
  console.log(Counter.value()) /* logs 1 */

  //   请注意两个计数器 counter1 和 counter2 是如何维护它们各自的独立性的。每个闭包都是引用自己词法作用域内的变量 privateCounter 。
  var makeCounter = function() {
    var privateCounter = 0
    function changeBy(val) {
      privateCounter += val
    }
    return {
      increment: function() {
        changeBy(1)
      },
      decrement: function() {
        changeBy(-1)
      },
      value: function() {
        return privateCounter
      }
    }
  }
  var Counter1 = makeCounter()
  var Counter2 = makeCounter()
  console.log(Counter1.value()) /* logs 0 */
  Counter1.increment()
  Counter1.increment()
  console.log(Counter1.value()) /* logs 2 */
  Counter1.decrement()
  console.log(Counter1.value()) /* logs 1 */
  console.log(Counter2.value()) /* logs 0 */

  //   在循环中创建闭包：一个常见错误
  //   function showHelp(help) {
  //     document.getElementById('help').innerHTML = help
  //   }
  //   function setupHelp() {
  //     var helpText = [
  //       { id: 'email', help: 'Your e-mail address' },
  //       { id: 'name', help: 'Your full name' },
  //       { id: 'age', help: 'Your age (you must be over 16)' }
  //     ]
  //     for (var i = 0; i < helpText.length; i++) {
  //       var item = helpText[i]
  //       document.getElementById(item.id).onfocus = function() {
  //         showHelp(item.help)
  //       }
  //     }
  //   }
  //   setupHelp()
  // 循环多少次就创建了多少个闭包，他们共享词法作用域
  //   无论焦点在哪个input上，显示的都是关于年龄的信息。
  // 原因是赋值给 onfocus 的是闭包。这些闭包是由他们的函数定义和在 setupHelp 作用域中捕获的环境所组成的。
  // 这三个闭包在循环中被创建，但他们共享了同一个词法作用域，在这个作用域中存在一个变量item。
  // 当onfocus的回调执行时，item.help的值被决定。由于循环在事件触发之前早已执行完毕，
  // 变量对象item（被三个闭包所共享）已经指向了helpText的最后一项。

  //   解决这个问题的一种方案是使用更多的闭包：特别是使用前面所述的函数工厂：
  //   这段代码可以如我们所期望的那样工作。所有的回调不再共享同一个环境，
  //   makeHelpCallback 函数为每一个回调创建一个新的词法环境。在这些环境中，help 指向 helpText 数组中对应的字符串。
  //   function showHelp(help) {
  //     document.getElementById('help').innerHTML = help
  //   }
  //   function makeHelpCallback(help) {
  //     return function() {
  //       showHelp(help)
  //     }
  //   }
  //   function setupHelp() {
  //     var helpText = [
  //       { id: 'email', help: 'Your e-mail address' },
  //       { id: 'name', help: 'Your full name' },
  //       { id: 'age', help: 'Your age (you must be over 16)' }
  //     ]

  //     for (var i = 0; i < helpText.length; i++) {
  //       var item = helpText[i]
  //       document.getElementById(item.id).onfocus = makeHelpCallback(item.help)
  //     }
  //   }
  //   setupHelp()

  // 另一种方法使用了匿名闭包：通过IIFE函数，立刻创建生效的闭包，三个闭包有各自的词法环境
  //   function showHelp(help) {
  //     document.getElementById('help').innerHTML = help
  //   }
  //   function setupHelp() {
  //     var helpText = [
  //       { id: 'email', help: 'Your e-mail address' },
  //       { id: 'name', help: 'Your full name' },
  //       { id: 'age', help: 'Your age (you must be over 16)' }
  //     ]
  //     for (var i = 0; i < helpText.length; i++) {
  //       ;(function() {
  //         var item = helpText[i]
  //         document.getElementById(item.id).onfocus = function() {
  //           showHelp(item.help)
  //         }
  //       })() // 马上把当前循环项的item与事件回调相关联起来
  //     }
  //   }
  //   setupHelp()

  //   避免使用过多的闭包，可以用let关键词：
  //   这个例子使用let而不是var，因此每个闭包都绑定了块作用域的变量，这意味着不再需要额外的闭包。
  function showHelp(help) {
    document.getElementById('help').innerHTML = help
  }
  function setupHelp() {
    var helpText = [
      { id: 'email', help: 'Your e-mail address' },
      { id: 'name', help: 'Your full name' },
      { id: 'age', help: 'Your age (you must be over 16)' }
    ]
    for (var i = 0; i < helpText.length; i++) {
      // 每次循环item都是不同的值，因为let关键字，使得item只在本次循环中生效
      // 三个闭包，对应的item变量值不一样了
      let item = helpText[i]
      document.getElementById(item.id).onfocus = function() {
        showHelp(item.help)
      }
    }
  }
  setupHelp()

  //   性能考量节
  // 如果不是某些特定任务需要使用闭包，在其它函数中创建函数是不明智的，因为闭包在处理速度和内存消耗方面对脚本性能具有负面影响。
  // 例如，在创建新的对象或者类时，方法通常应该关联于对象的原型，而不是定义到对象的构造器中。原因是这将导致每次构造器被调用时，
  // 方法都会被重新赋值一次（也就是，每个对象的创建）。
  // 考虑以下示例：
  // function MyObject(name, message) {
  //   this.name = name.toString();
  //   this.message = message.toString();
  //   this.getName = function() {
  //     return this.name;
  //   };

  //   this.getMessage = function() {
  //     return this.message;
  //   };
  // }
  // 在上面的代码中，我们并没有利用到闭包的好处，因此可以避免使用闭包。修改成如下：
  //   function MyObject(name, message) {
  //     this.name = name.toString()
  //     this.message = message.toString()
  //   }
  //   MyObject.prototype = {
  //     getName: function() {
  //       return this.name
  //     },
  //     getMessage: function() {
  //       return this.message
  //     }
  //   }
  // 但我们不建议重新定义原型。可改成如下例子：
  //   function MyObject(name, message) {
  //     this.name = name.toString()
  //     this.message = message.toString()
  //   }
  //   MyObject.prototype.getName = function() {
  //     return this.name
  //   }
  //   MyObject.prototype.getMessage = function() {
  //     return this.message
  //   }
}
