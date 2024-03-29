// export 命令
// 模块功能主要由两个命令构成：export和import。
// export命令用于规定模块的对外接口，import命令用于输入其他模块提供的功能。
// 一个模块就是一个独立的文件。该文件内部的所有变量，外部无法获取。
// 如果你希望外部能够读取模块内部的某个变量，就必须使用export关键字输出该变量。
// 下面是一个 JS 文件，里面使用export命令输出变量。
// profile.js
// export var firstName = 'Michael'
// export var lastName = 'Jackson'
// export var year = 1958

// 上面代码是profile.js文件，保存了用户信息。ES6 将其视为一个模块，里面用export命令对外部输出了三个变量。
// export的写法，除了像上面这样，还有另外一种。

// profile.js
var firstName = 'Michael'
var lastName = 'Jackson'
var year = 1958

export { firstName, lastName, year }
// 上面代码在export命令后面，使用大括号指定所要输出的一组变量。
// 它与前一种写法（直接放置在var语句前）是等价的，但是应该优先考虑使用这种写法。
// 因为这样就可以在脚本尾部，一眼看清楚输出了哪些变量。

// export命令除了输出变量，还可以输出函数或类（class）。
export function multiply(x, y) {
  return x * y
}
// 上面代码对外输出一个函数multiply。

// 通常情况下，export输出的变量就是本来的名字，但是可以使用as关键字重命名。
function v1() {
  console.log('v1')
}
function v2() {
  console.log('v2')
}
export { v1 as streamV1, v2 as streamV2, v2 as streamLatestVersion }
// 上面代码使用as关键字，重命名了函数v1和v2的对外接口。重命名后，v2可以用不同的名字输出两次。

// 需要特别注意的是，export命令规定的是对外的接口，必须与模块内部的变量建立一一对应关系。
// 报错
// export 1;
// 报错
// var m = 1;
// export m;
// 上面两种写法都会报错，因为没有提供对外的接口。第一种写法直接输出 1，
// 第二种写法通过变量m，还是直接输出 1。1只是一个值，不是接口。正确的写法是下面这样。
// 写法一
export var m = 1;
// 写法二
var m = 1;
export {m};
// 写法三
var n = 1;
export {n as m};
// 上面三种写法都是正确的，规定了对外的接口m。其他脚本可以通过这个接口，取到值1。
// 它们的实质是，在接口名与模块内部变量之间，建立了一一对应的关系

// 同样的，function和class的输出，也必须遵守这样的写法。
// 报错
// function f() {}
// export f;
// 正确
export function f2() {};
// 正确
function f3() {}
export {f3};

// 另外，export语句输出的接口，与其对应的值是动态绑定关系，即通过该接口，可以取到模块内部实时的值。
export var foo = 'bar';
setTimeout(() => foo = 'baz', 500);
// 上面代码输出变量foo，值为bar，500 毫秒之后变成baz。
// 这一点与 CommonJS 规范完全不同。CommonJS 模块输出的是值的缓存，不存在动态更新

// 最后，export命令可以出现在模块的任何位置，只要处于模块顶层就可以。
// 如果处于块级作用域内，就会报错，下一节的import命令也是如此。
// 这是因为处于条件代码块之中，就没法做静态优化了，违背了 ES6 模块的设计初衷。
function foo() {
  export default 'bar' // SyntaxError
}
foo()
// 上面代码中，export语句放在函数之中，结果报错。
