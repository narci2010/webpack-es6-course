// run in backend
// node modules.js
// 在 ES6 之前，社区制定了一些模块加载方案，最主要的有 CommonJS 和 AMD 两种。
// 前者用于服务器，后者用于浏览器。ES6 在语言标准的层面上，实现了模块功能，
// 而且实现得相当简单，完全可以取代 CommonJS 和 AMD 规范，成为浏览器和服务器通用的模块解决方案。
// ES6 模块的设计思想是尽量的静态化，使得编译时就能确定模块的依赖关系，
// 以及输入和输出的变量。CommonJS 和 AMD 模块，都只能在运行时确定这些东西。
// 比如，CommonJS 模块就是对象，输入时必须查找对象属性。
// CommonJS模块
// let { stat, exists, readFile } = require('fs')
// 等同于
// let _fs = require('fs')
// let stat = _fs.stat
// let exists = _fs.exists
// let readfile = _fs.readfile
// 上面代码的实质是整体加载fs模块（即加载fs的所有方法），生成一个对象（_fs），
// 然后再从这个对象上面读取 3 个方法。这种加载称为“运行时加载”，
// 因为只有运行时才能得到这个对象，导致完全没办法在编译时做“静态优化”。

// ES6 模块不是对象，而是通过export命令显式指定输出的代码，再通过import命令输入。
// ES6模块
import { stat, exists, readFile } from 'fs'
// SyntaxError: Unexpected token import
// node --experimental-modules modules.mjs
// 上面代码的实质是从fs模块加载 3 个方法，其他方法不加载。这种加载称为“编译时加载”或者静态加载，
// 即 ES6 可以在编译时就完成模块加载，效率要比 CommonJS 模块的加载方式高。
// 当然，这也导致了没法引用 ES6 模块本身，因为它不是对象。
console.log(stat)
console.log(exists)
console.log(readFile)

// 严格模式
// ES6 的模块自动采用严格模式，不管你有没有在模块头部加上"use strict";。

// 严格模式主要有以下限制。

// 变量必须声明后再使用
// 函数的参数不能有同名属性，否则报错
// 不能使用with语句
// 不能对只读属性赋值，否则报错
// 不能使用前缀 0 表示八进制数，否则报错
// 不能删除不可删除的属性，否则报错
// 不能删除变量delete prop，会报错，只能删除属性delete global[prop]
// eval不会在它的外层作用域引入变量
// eval和arguments不能被重新赋值
// arguments不会自动反映函数参数的变化
// 不能使用arguments.callee
// 不能使用arguments.caller
// 禁止this指向全局对象
// 不能使用fn.caller和fn.arguments获取函数调用的堆栈
// 增加了保留字（比如protected、static和interface）
// 上面这些限制，模块都必须遵守。
