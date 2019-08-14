// 字符的 Unicode 表示法
// ES6 加强了对 Unicode 的支持，允许采用uxxxx形式表示一个字符，其中xxxx表示字符的 Unicode 码点。
const { log } = console
log(`\u0061`) // "a"
// 但是，这种表示法只限于码点在u0000~uFFFF之间的字符。超出这个范围的字符，必须用两个双字节的形式表示。
log(`\uD842\uDFB7`) // "𠮷"
log(`\u20BB7`) // " 7"
// 上面代码表示，如果直接在u后面跟上超过0xFFFF的数值（比如u20BB7），JavaScript 会理解成u20BB+7。
// 由于u20BB是一个不可打印字符，所以只会显示一个空格，后面跟着一个7。

// ES6 对这一点做出了改进，只要将码点放入大括号，就能正确解读该字符。
log(`\u{20BB7}`) // "𠮷"
log(`\u{41}\u{42}\u{43}`) // "ABC"
log(`\u{1F680}` === `\uD83D\uDE80`) // true
// 上面代码中，最后一个例子表明，大括号表示法与四字节的 UTF-16 编码是等价的。

//es5表示法
console.log('a', `\u0061`) // a  a
console.log('a', `\u20BB7`) // a ₻7 （后面这个是乱码）
//es6表示法
console.log('s', `\u{20BB7}`) // s 𠮷

// 有了这种表示法之后，JavaScript 共有5 种方法可以表示一个字符。
log('z' === 'z') // true
//log('\0172' === 'z') // true  SyntaxError:Octal literal in strict mode
log('\x7A' === 'z') // true
log('\u007A' === 'z') // true
log('\u{7A}' === 'z') // true

// 字符串的遍历器接口
// ES6 为字符串添加了遍历器接口，使得字符串可以被for...of循环遍历。
for (let codePoint of 'foo') {
  console.log(codePoint)
}
// "f"
// "o"
// "o"

// 除了遍历字符串，这个遍历器最大的优点是可以识别大于0xFFFF的码点，传统的for循环无法识别这样的码点。
let text = String.fromCodePoint(0x20bb7)
for (let i = 0; i < text.length; i++) {
  console.log(text[i])
}
// " "
// " "
for (let i of text) {
  console.log(i)
}
// "𠮷"
// 上面代码中，字符串text只有一个字符，但是for循环会认为它包含两个字符（都不可打印），而for...of循环会正确识别出这一个字符。

// JavaScript 字符串允许直接输入字符，以及输入字符的转义形式。举例来说，“中”的 Unicode 码点是 U+4e2d，
// 你可以直接在字符串里面输入这个汉字，也可以输入它的转义形式u4e2d，两者是等价的。
log('中' === '\u4e2d') // true

// 但是，JavaScript 规定有5个字符，不能在字符串里面直接使用，只能使用转义形式。
// U+005C：反斜杠（reverse solidus \)
// U+000D：回车（carriage return）
// U+2028：行分隔符（line separator）
// U+2029：段分隔符（paragraph separator）
// U+000A：换行符（line feed）
// 举例来说，字符串里面不能直接包含反斜杠，一定要转义写成\或者u005c。
log('\\')
log('\u005c')
log('\
')
log('\u000d')
log('\u2028')
log('\u2029')
log('\u000a')

// 模板字符串
// 模板字符串（template string）是增强版的字符串，用反引号（`）标识。它可以当作普通字符串使用，
// 也可以用来定义多行字符串，或者在字符串中嵌入变量。
// 普通字符串
log(`In JavaScript 'n' is a line-feed.`)
// 多行字符串
log(`In JavaScript this is
 not legal.`)
console.log(`string text line 1
string text line 2`)
// 字符串中嵌入变量
let name = 'Bob',
  time = 'today'
log(`Hello ${name}, how are you ${time}?`)
// 上面代码中的模板字符串，都是用反引号表示。如果在模板字符串中需要使用反引号，则前面要用反斜杠转义。

// 标签模板
// 模板字符串的功能，不仅仅是上面这些。它可以紧跟在一个函数名后面，该函数将被调用来处理这个模板字符串。
// 这被称为“标签模板”功能（tagged template）。
log`123`
// 等同于
log(456)
// 标签模板其实不是模板，而是函数调用的一种特殊形式。“标签”指的就是函数，紧跟在后面的模板字符串就是它的参数。

// 但是，如果模板字符里面有变量，就不是简单的调用了，而是会将模板字符串先处理成多个参数，再调用函数。
let a = 5
let b = 10
function tag(s, v1, v2) {
  console.log(s[0])
  console.log(s[1])
  console.log(s[2])
  console.log(v1)
  console.log(v2)
  return 'OK'
}
tag`Hello ${a + b} world ${a * b}`
// "Hello "
// " world "
// ""
// 15
// 50
// "OK"
// 等同于
log('++++++++++++++++++++++++++++++++++++')
tag(['Hello ', ' world ', ''], 15, 50)
// 上面代码中，模板字符串前面有一个标识名tag，它是一个函数。整个表达式的返回值，就是tag函数处理模板字符串后的返回值。

// 字符串的新增方法
// String.fromCodePoint()
// ES5 提供String.fromCharCode()方法，用于从 Unicode 码点返回对应字符，但是这个方法不能识别码点大于0xFFFF的字符。
log(String.fromCharCode(0x20bb7))
// "ஷ"
// 上面代码中，String.fromCharCode()不能识别大于0xFFFF的码点，所以0x20BB7就发生了溢出，最高位2被舍弃了，
// 最后返回码点U+0BB7对应的字符，而不是码点U+20BB7对应的字符。
// ES6 提供了String.fromCodePoint()方法，可以识别大于0xFFFF的字符，弥补了String.fromCharCode()方法的不足。
// 在作用上，正好与下面的codePointAt()方法相反。
log(String.fromCodePoint(0x20bb7)) // "𠮷"
// 注意，fromCodePoint方法定义在String对象上，而codePointAt方法定义在字符串的实例对象上。

// String.raw()
// ES6 还为原生的 String 对象，提供了一个raw()方法。该方法返回一个斜杠都被转义（即斜杠前面再加一个斜杠）的字符串，
// 往往用于模板字符串的处理方法。
log(String.raw`Hin${2 + 3}!`)
// 返回 "Hi\n5!"
log(String.raw`Hiu000A!`)
// 返回 "Hi\u000A!"
// 如果原字符串的斜杠已经转义，那么String.raw()会进行再次转义。
log(String.raw`Hi\n`)
// 返回 "Hi\\n"
log(String.raw`Hi\n` === 'Hi\\n') // true

// 实例方法：codePointAt()
// JavaScript 内部，字符以 UTF-16 的格式储存，每个字符固定为2个字节。
// 对于那些需要4个字节储存的字符（Unicode 码点大于0xFFFF的字符），JavaScript 会认为它们是两个字符。
var s = '𠮷'
//字符串的length属性是基于编码单元返回的长度
//因为不在 BMP 范围内，所以“𠮷”这个字符长度为2（两个16位编码）
log(s.length) // 2
log(s.match(/./gu).length) //1 √
log(s.charAt(0)) // ''
log(s.charAt(1)) // ''
log(s.charCodeAt(0)) // 55362
log(s.charCodeAt(1)) // 57271
// 上面代码中，汉字“𠮷”（注意，这个字不是“吉祥”的“吉”）的码点是0x20BB7，
// UTF-16 编码为0xD842 0xDFB7（十进制为55362 57271），需要4个字节储存。
// 对于这种4个字节的字符，JavaScript 不能正确处理，字符串长度会误判为2，
// 而且charAt()方法无法读取整个字符，charCodeAt()方法只能分别返回前两个字节和后两个字节的值。
let s1 = '𠮷a'
log(s1.length)
log(s1.codePointAt(0).toString(16)) // "20bb7"
log(s1.codePointAt(1).toString(16))
log(s1.codePointAt(2).toString(16)) // "61"

// codePointAt()方法是测试一个字符由两个字节还是由四个字节组成的最简单方法。
function is32Bit(c) {
  return c.codePointAt(0) > 0xffff
}
log(is32Bit('𠮷')) // true
log(is32Bit('a')) // false

// 实例方法：normalize()
// 许多欧洲语言有语调符号和重音符号。为了表示它们，Unicode 提供了两种方法。
// 一种是直接提供带重音符号的字符，比如Ǒ（u01D1）。另一种是提供合成符号（combining character），
// 即原字符与重音符号的合成，两个字符合成一个字符，比如O（u004F）和ˇ（u030C）合成Ǒ（u004Fu030C）。
// 这两种表示方法，在视觉和语义上都等价，但是 JavaScript 不能识别。
log('\u01D1' === '\u004F\u030C') //false
log('\u01D1'.length) // 1
log('\u004F\u030C'.length) // 2
// 上面代码表示，JavaScript 将合成字符视为两个字符，导致两种表示方法不相等。
// ES6 提供字符串实例的normalize()方法，用来将字符的不同表示方法统一为同样的形式，这称为 Unicode 正规化。
log('\u01D1'.normalize() === '\u004F\u030C'.normalize()) // true

// 实例方法：includes(), startsWith(), endsWith()
// 传统上，JavaScript 只有indexOf方法，可以用来确定一个字符串是否包含在另一个字符串中。ES6 又提供了三种新方法。
// includes()：返回布尔值，表示是否找到了参数字符串。
// startsWith()：返回布尔值，表示参数字符串是否在原字符串的头部。
// endsWith()：返回布尔值，表示参数字符串是否在原字符串的尾部。
let s2 = 'Hello world!'
log(s2.startsWith('Hello')) // true
log(s2.endsWith('!')) // true
log(s2.includes('o')) // true
// 这三个方法都支持第二个参数，表示开始搜索的位置。
// let s = 'Hello world!';
// s.startsWith('world', 6) // true
// s.endsWith('Hello', 5) // true
// s.includes('Hello', 6) // false
// 上面代码表示，使用第二个参数n时，endsWith的行为与其他两个方法有所不同。
// 它针对前n个字符，而其他两个方法针对从第n个位置直到字符串结束。

// 实例方法：repeat()
// repeat方法返回一个新字符串，表示将原字符串重复n次。
log('x'.repeat(3)) // "xxx"
log('hello'.repeat(2)) // "hellohello"
log('na'.repeat(0)) // ""
// 参数如果是小数，会被取整。
log('na'.repeat(2.9)) // "nana"
// 如果repeat的参数是负数或者Infinity，会报错。
// log('na'.repeat(Infinity)) // RangeError
// log('na'.repeat(-1)) // RangeError
// 但是，如果参数是 0 到-1 之间的小数，则等同于 0，这是因为会先进行取整运算。
// 0 到-1 之间的小数，取整以后等于-0，repeat视同为 0。
log('na'.repeat(-0.9)) // ""
// 参数NaN等同于 0。
log('na'.repeat(NaN)) // ""
// 如果repeat的参数是字符串，则会先转换成数字。
log('na'.repeat('na')) // ""
log('na'.repeat('3')) // "nanana"

// 实例方法：padStart()，padEnd()
// ES2017 引入了字符串补全长度的功能。如果某个字符串不够指定长度，会在头部或尾部补全。
// padStart()用于头部补全，padEnd()用于尾部补全。
log('x'.padStart(5, 'ab')) // 'ababx'
log('x'.padStart(4, 'ab')) // 'abax'
log('x'.padEnd(5, 'ab')) // 'xabab'
log('x'.padEnd(4, 'ab')) // 'xaba'
// 上面代码中，padStart()和padEnd()一共接受两个参数，第一个参数是字符串补全生效的最大长度，第二个参数是用来补全的字符串。

// 如果原字符串的长度，等于或大于最大长度，则字符串补全不生效，返回原字符串。
// 'xxx'.padStart(2, 'ab') // 'xxx'
// 'xxx'.padEnd(2, 'ab') // 'xxx'
// 如果用来补全的字符串与原字符串，两者的长度之和超过了最大长度，则会截去超出位数的补全字符串。
// 'abc'.padStart(10, '0123456789')
// // '0123456abc'
// 如果省略第二个参数，默认使用空格补全长度。
// 'x'.padStart(4) // '   x'
// 'x'.padEnd(4) // 'x   '
// padStart()的常见用途是为数值补全指定位数。下面代码生成 10 位的数值字符串。
// '1'.padStart(10, '0') // "0000000001"
// '12'.padStart(10, '0') // "0000000012"
// '123456'.padStart(10, '0') // "0000123456"
// 另一个用途是提示字符串格式。
// '12'.padStart(10, 'YYYY-MM-DD') // "YYYY-MM-12"
// '09-12'.padStart(10, 'YYYY-MM-DD') // "YYYY-09-12"

// 实例方法：trimStart()，trimEnd()
// ES2019 对字符串实例新增了trimStart()和trimEnd()这两个方法。它们的行为与trim()一致，
// trimStart()消除字符串头部的空格，trimEnd()消除尾部的空格。它们返回的都是新字符串，不会修改原始字符串。
// const s = '  abc  ';
// s.trim() // "abc"
// s.trimStart() // "abc  "
// s.trimEnd() // "  abc"
// 上面代码中，trimStart()只消除头部的空格，保留尾部的空格。trimEnd()也是类似行为。
// 除了空格键，这两个方法对字符串头部（或尾部）的 tab 键、换行符等不可见的空白符号也有效。
// 浏览器还部署了额外的两个方法，trimLeft()是trimStart()的别名，trimRight()是trimEnd()的别名。
