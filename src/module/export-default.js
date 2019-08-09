// export default 命令
// 从前面的例子可以看出，使用import命令的时候，用户需要知道所要加载的变量名或函数名，否则无法加载。
// 但是，用户肯定希望快速上手，未必愿意阅读文档，去了解模块有哪些属性和方法。
// 为了给用户提供方便，让他们不用阅读文档就能加载模块，就要用到export default命令，为模块指定默认输出。
// export-default.js
export default function() {
  console.log('foo')
}
// 上面代码是一个模块文件export-default.js，它的默认输出是一个函数。
// 其他模块加载该模块时，import命令可以为该匿名函数指定任意名字。
// import-default.js
// import customName from './export-default';
// customName(); // 'foo'
// 上面代码的import命令，可以用任意名称指向export-default.js输出的方法，这时就不需要知道原模块输出的函数名。
// 需要注意的是，这时import命令后面，不使用大括号。

// export default命令用在非匿名函数前，也是可以的。
// export-default.js
// export default function foo() {
//   console.log('foo');
// }
// 或者写成
// function foo() {
//   console.log('foo');
// }
// export default foo;
// 上面代码中，foo函数的函数名foo，在模块外部是无效的。加载的时候，视同匿名函数加载。

// 下面比较一下默认输出和正常输出。
// 第一组
// export default function crc32() { // 输出
//   // ...
// }
// import crc32 from 'crc32'; // 输入
// 第二组
// export function crc32() { // 输出
//   // ...
// };
// import {crc32} from 'crc32'; // 输入
// 上面代码的两组写法，第一组是使用export default时，对应的import语句不需要使用大括号；
// 第二组是不使用export default时，对应的import语句需要使用大括号。

// export default命令用于指定模块的默认输出。显然，一个模块只能有一个默认输出，
// 因此export default命令只能使用一次。所以，import命令后面才不用加大括号，因为只可能唯一对应export default命令。

// 本质上，export default就是输出一个叫做default的变量或方法，然后系统允许你为它取任意名字。所以，下面的写法是有效的。
// modules.js
// function add(x, y) {
//   return x * y;
// }
// export {add as default};
// 等同于
// export default add;
// app.js
// import { default as foo } from 'modules';
// 等同于
// import foo from 'modules';

// 正是因为export default命令其实只是输出一个叫做default的变量，所以它后面不能跟变量声明语句。
// 正确
// export var a = 1;
// 正确
// var a = 1;
// export default a;
// 错误
// export default var a = 1;
// 上面代码中，export default a的含义是将变量a的值赋给变量default。所以，最后一种写法会报错。

// 同样地，因为export default命令的本质是将后面的值，赋给default变量，所以可以直接将一个值写在export default之后。
// // 正确
// export default 42;
// // 报错
// export 42;
// 上面代码中，后一句报错是因为没有指定对外的接口，而前一句指定对外接口为default。

// 有了export default命令，输入模块时就非常直观了，以输入 lodash 模块为例。
import _ from 'lodash'
// 如果想在一条import语句中，同时输入默认方法和其他接口，可以写成下面这样。
import _, { each, forEach } from 'lodash'
// 对应上面代码的export语句如下。
// export default function (obj) {
//   // ···
// }
// export function each(obj, iterator, context) {
//   // ···
// }
// export { each as forEach };
// 上面代码的最后一行的意思是，暴露出forEach接口，默认指向each接口，即forEach和each指向同一个方法。

// export default也可以用来输出类。
// // MyClass.js
// export default class { ... }
// // main.js
// import MyClass from 'MyClass';
// let o = new MyClass();

// export 与 import 的复合写法
// 如果在一个模块之中，先输入后输出同一个模块，import语句可以与export语句写在一起。
// export { foo, bar } from 'my_module';
// // 可以简单理解为
// import { foo, bar } from 'my_module';
// export { foo, bar };
// 上面代码中，export和import语句可以结合在一起，写成一行。
// 但需要注意的是，写成一行以后，foo和bar实际上并没有被导入当前模块，
// 只是相当于对外转发了这两个接口，导致当前模块不能直接使用foo和bar。

// 模块的接口改名和整体输出，也可以采用这种写法。
// // 接口改名
// export { foo as myFoo } from 'my_module';
// // 整体输出
// export * from 'my_module';

// 默认接口的写法如下。
// export { default } from 'foo';
// 具名接口改为默认接口的写法如下。
// export { es6 as default } from './someModule';
// // 等同于
// import { es6 } from './someModule';
// export default es6;
// 同样地，默认接口也可以改名为具名接口。
// export { default as es6 } from './someModule';

// 下面三种import语句，没有对应的复合写法。
// import * as someIdentifier from "someModule";
// import someIdentifier from "someModule";
// import someIdentifier, { namedIdentifier } from "someModule";
// 为了做到形式的对称，现在有提案，提出补上这三种复合写法。
// export * as someIdentifier from "someModule";
// export someIdentifier from "someModule";
// export someIdentifier, { namedIdentifier } from "someModule";

// import()
// 简介
// 前面介绍过，import命令会被 JavaScript 引擎静态分析，先于模块内的其他语句执行（import命令叫做“连接” binding 其实更合适）。
// 所以，下面的代码会报错。
// // 报错
// if (x === 2) {
//   import MyModual from './myModual';
// }
// 上面代码中，引擎处理import语句是在编译时，这时不会去分析或执行if语句，所以import语句放在if代码块之中毫无意义，
// 因此会报句法错误，而不是执行时错误。也就是说，import和export命令只能在模块的顶层，
// 不能在代码块之中（比如，在if代码块之中，或在函数之中）。

// 这样的设计，固然有利于编译器提高效率，但也导致无法在运行时加载模块。
// 在语法上，条件加载就不可能实现。如果import命令要取代 Node 的require方法，
// 这就形成了一个障碍。因为require是运行时加载模块，import命令无法取代require的动态加载功能。
// const path = './' + fileName;
// const myModual = require(path);
// 上面的语句就是动态加载，require到底加载哪一个模块，只有运行时才知道。import命令做不到这一点。

// 因此，有一个提案，建议引入import()函数，完成动态加载。
// import(specifier)
// 上面代码中，import函数的参数specifier，指定所要加载的模块的位置。
// import命令能够接受什么参数，import()函数就能接受什么参数，两者区别主要是后者为动态加载。

// import()返回一个 Promise 对象。下面是一个例子。
// const main = document.querySelector('main');
// import(`./section-modules/${someVariable}.js`)
//   .then(module => {
//     module.loadPageInto(main);
//   })
//   .catch(err => {
//     main.textContent = err.message;
//   });
// import()函数可以用在任何地方，不仅仅是模块，非模块的脚本也可以使用。它是运行时执行，也就是说，
// 什么时候运行到这一句，就会加载指定的模块。
// 另外，import()函数与所加载的模块没有静态连接关系，这点也是与import语句不相同。
// import()类似于 Node 的require方法，区别主要是前者是异步加载，后者是同步加载。

// 适用场合
// 下面是import()的一些适用场合。
// （1）按需加载。
// import()可以在需要的时候，再加载某个模块。
// button.addEventListener('click', event => {
//   import('./dialogBox.js')
//   .then(dialogBox => {
//     dialogBox.open();
//   })
//   .catch(error => {
//     /* Error handling */
//   })
// });
// 上面代码中，import()方法放在click事件的监听函数之中，只有用户点击了按钮，才会加载这个模块。

// （2）条件加载
// import()可以放在if代码块，根据不同的情况，加载不同的模块。
// if (condition) {
//   import('moduleA').then(...);
// } else {
//   import('moduleB').then(...);
// }
// 上面代码中，如果满足条件，就加载模块 A，否则加载模块 B。

// （3）动态的模块路径
// import()允许模块路径动态生成。
// import(f())
// .then(...);
// 上面代码中，根据函数f的返回结果，加载不同的模块。

// 注意点
// import()加载模块成功以后，这个模块会作为一个对象，当作then方法的参数。因此，可以使用对象解构赋值的语法，获取输出接口。
// import('./myModule.js')
// .then(({export1, export2}) => {
//   // ...·
// });
// 上面代码中，export1和export2都是myModule.js的输出接口，可以解构获得。
