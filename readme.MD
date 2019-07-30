# demo1

##style,css loader
##babel loader
##devtool
##webpack-dev-server

```
 npm i @babel/preset-* -S

```

安装 babel

// es2015 转码规则

npm install --save-dev babel-preset-es2015

// react 转码规则

npm install --save-dev babel-preset-react

// ES7 不同阶段语法提案的转码规则（共有 4 个阶段），选装一个

npm install --save-dev babel-preset-stage-0

npm install --save-dev babel-preset-stage-1

npm install --save-dev babel-preset-stage-2

npm install --save-dev babel-preset-stage-3

然后，将安装好的规则加入到 .babelrc

{
"presets": [
"es2015",
"react",
"stage-0"
],
"plugins": []
}

开启严格模式（”use strict")：
在全局代码的开始处加入
在 eval 代码的开始处加入
在函数声明代码处加入
在 new Function() 所传入的 body 参数块开始处加入

1：在对象中声明相同的属性名

例如: var obj ={

                   'name': 1,


                   'name': 2


           };

会抛出 SyntaxError: Duplicate data property in object literal not allowed in strict mode.

2：在函数声明中相同的参数名

例如： "use strict";

     function fix(a,b,a) {


         return a+b;


     }

会抛出 SyntaxError: Strict mode function may not have duplicate parameter names .

3：不能用前导 0 声明 8 进制直接量

例如： var a = 012;

会抛出 SyntaxError: Octal literals are not allowed in strict mode.

4： 不能重新声明、删除或重写 eval 和 arguments 这两个标示符

var eval = ......;

会抛出 SyntaxError: Assignment to eval or arguments is not allowed in strict mode

5:用 delete 删除显示声明的标识符、名称和具名函数

    function temp() {


       'use strict';


        var test = 1;


        delete test;


    }

会抛出 SyntaxError: Delete of an unqualified identifier in strict mode.

6.代码中使用扩展的保留字，例如 interface,let,yield,package,private 等

会抛出 SyntaxError: Unexpected strict mode reserved word

7.严格模式下是禁止使用 with 的

会抛出 SyntaxError: Strict mode code may not include a with statement

取消 strict mode
npm i @babel/plugin-transform-modules-commonjs @babel/plugin-transform-strict-mode -D
["@babel/plugin-transform-modules-commonjs", { "strictMode": false }]

分别运行下面两段代码

使用 with 的时候:test\_\_time: 390.218ms

const obj = { cunt: 122 };
function test*with() {
with (obj) {
for (let i = 0; i < 1e6; i++) {
cunt = 100;
a = 0;
}
}
console.log(a);
console.log(obj.cunt);
}
console.time("test\*\*\_start");
test_with();
console.timeEnd("test*\*\*start");//test\_\_\_start: 390.218ms

不用 with 的时候:test\_\_time: 6.668ms

const obj = { cunt: 122 };
function test*with() {
for (let i = 0; i < 1e6; i++) {
obj.cunt = 100;
a = 0;
}
console.log(a);
console.log(obj.cunt);
}
console.time("test\*\*\_start");
test_with();
console.timeEnd("test*\*\*start"); //test\_\_\_start: 6.668ms

对比耗时 明显 with 耗时更久，尽量不使用 with
with(object){
　　 statement;
}

总结一下：with 会把 object 添加到作用域的头部,然后执行 statement,与 eval 类似，with 语句的 javascript 代码非常难于优化，同时也会给调试代码造成困难，并且同没有使用 with 语句的代码相比，它运算得更慢.
npm i @babel/plugin-transform-modules-commonjs @babel/plugin-transform-strict-mode -D
在.babelrc 文件添加：

     "plugins": [

"@babel/plugin-transform-strict-mode",
["@babel/plugin-transform-modules-commonjs", { "strictMode": false }]

     ]

Support for the experimental syntax 'decorators-legacy' isn't currently enabled
npm install --save-dev @babel/plugin-proposal-decorators
"plugins": [
[
"@babel/plugin-proposal-decorators",
{
"legacy": true
}
]
]
vscode 设置"javascript.implicitProjectConfig.experimentalDecorators": true，该选项默认为 false，需要改为 true
npm i @babel/plugin-proposal-class-properties -D
{
"presets": [
[
"@babel/preset-env",
{
"modules": false
}
],
"@babel/preset-react"
],
"plugins": ["@babel/proposal-class-properties"]
}

npm install core-decorators -D
import { autobind } from 'core-decorators';

@autobind
class Person {
getPerson() {
return this;
}

getPersonAgain() {
return this;
}
}

let person = new Person();
let { getPerson, getPersonAgain } = person;

getPerson() === person;
// true

getPersonAgain() === person;
// true
