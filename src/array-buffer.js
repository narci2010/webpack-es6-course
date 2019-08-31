// ArrayBuffer对象、TypedArray视图和DataView视图是 JavaScript 操作二进制数据的一个接口。这些对象早就存在，属于独立的规格（2011 年 2 月发布），
// ES6 将它们纳入了 ECMAScript 规格，并且增加了新的方法。它们都是以数组的语法处理二进制数据，所以统称为二进制数组。

// 这个接口的原始设计目的，与 WebGL 项目有关。所谓 WebGL，就是指浏览器与显卡之间的通信接口，为了满足 JavaScript 与显卡之间大量的、实时的数据交换，
// 它们之间的数据通信必须是二进制的，而不能是传统的文本格式。文本格式传递一个 32 位整数，两端的 JavaScript 脚本与显卡都要进行格式转化，将非常耗时。
// 这时要是存在一种机制，可以像 C 语言那样，直接操作字节，将 4 个字节的 32 位整数，以二进制形式原封不动地送入显卡，脚本的性能就会大幅提升。
// 二进制数组就是在这种背景下诞生的。它很像 C 语言的数组，允许开发者以数组下标的形式，直接操作内存，大大增强了 JavaScript 处理二进制数据的能力，
// 使得开发者有可能通过 JavaScript 与操作系统的原生接口进行二进制通信。
// 二进制数组由三类对象组成。
// （1）ArrayBuffer对象：代表内存之中的一段二进制数据，可以通过“视图”进行操作。“视图”部署了数组接口，这意味着，可以用数组的方法操作内存。
// （2）TypedArray视图：共包括 9 种类型的视图，比如Uint8Array（无符号 8 位整数）数组视图, Int16Array（16 位整数）数组视图, Float32Array（32 位浮点数）数组视图等等。
// （3）DataView视图：可以自定义复合格式的视图，比如第一个字节是 Uint8（无符号 8 位整数）、第二、三个字节是 Int16（16 位整数）、第四个字节开始是 Float32（32 位浮点数）等等，
// 此外还可以自定义字节序。
// 简单说，ArrayBuffer对象代表原始的二进制数据，TypedArray视图用来读写简单类型的二进制数据，DataView视图用来读写复杂类型的二进制数据。
// TypedArray视图支持的数据类型一共有 9 种（DataView视图支持除Uint8C以外的其他 8 种）。

// 数据类型	字节长度	含义	对应的 C 语言类型
// Int8	1	8 位带符号整数	signed char
// Uint8	1	8 位不带符号整数	unsigned char
// Uint8C	1	8 位不带符号整数（自动过滤溢出）	unsigned char
// Int16	2	16 位带符号整数	short
// Uint16	2	16 位不带符号整数	unsigned short
// Int32	4	32 位带符号整数	int
// Uint32	4	32 位不带符号的整数	unsigned int
// Float32	4	32 位浮点数	float
// Float64	8	64 位浮点数	double
// 注意，二进制数组并不是真正的数组，而是类似数组的对象。

// ArrayBuffer 对象
// 概述
// ArrayBuffer对象代表储存二进制数据的一段内存，它不能直接读写，只能通过视图（TypedArray视图和DataView视图)来读写，视图的作用是以指定格式解读二进制数据。
// ArrayBuffer也是一个构造函数，可以分配一段可以存放数据的连续内存区域。
const buf = new ArrayBuffer(32)
// 上面代码生成了一段 32 字节的内存区域，每个字节的值默认都是 0。可以看到，ArrayBuffer构造函数的参数是所需要的内存大小（单位字节）。
// 为了读写这段内容，需要为它指定视图。DataView视图的创建，需要提供ArrayBuffer对象实例作为参数。
const dataView = new DataView(buf)
const { log } = console
log(dataView.getUint8(0)) // 0
// 上面代码对一段 32 字节的内存，建立DataView视图，然后以不带符号的 8 位整数格式，从头读取 8 位二进制数据，结果得到 0，因为原始内存的ArrayBuffer对象，默认所有位都是 0。

// 另一种TypedArray视图，与DataView视图的一个区别是，它不是一个构造函数，而是一组构造函数，代表不同的数据格式。
const buffer = new ArrayBuffer(12)
const x1 = new Int32Array(buffer)
x1[0] = 1
const x2 = new Uint8Array(buffer)
x2[0] = 2
log(x1[0]) // 2
log(x1[2])
// 上面代码对同一段内存，分别建立两种视图：32 位带符号整数（Int32Array构造函数）和 8 位不带符号整数（Uint8Array构造函数）。
// 由于两个视图对应的是同一段内存，一个视图修改底层内存，会影响到另一个视图。

// TypedArray视图的构造函数，除了接受ArrayBuffer实例作为参数，还可以接受普通数组作为参数，直接分配内存生成底层的ArrayBuffer实例，
// 并同时完成对这段内存的赋值。
const typedArray = new Uint8Array([0, 1, 2])
log(typedArray.length) // 3
typedArray[0] = 5
log(typedArray) // [5, 1, 2]
// 上面代码使用TypedArray视图的Uint8Array构造函数，新建一个不带符号的 8 位整数视图。可以看到，Uint8Array直接使用普通数组作为参数，对底层内存的赋值同时完成。

// ArrayBuffer.prototype.byteLength
// ArrayBuffer实例的byteLength属性，返回所分配的内存区域的字节长度。
const buffer2 = new ArrayBuffer(32)
log(buffer2.byteLength) // 32
// 如果要分配的内存区域很大，有可能分配失败（因为没有那么多的连续空余内存），所以有必要检查是否分配成功。
// if (buffer.byteLength === n) {
//   // 成功
// } else {
//   // 失败
// }

// ArrayBuffer.prototype.slice()
// ArrayBuffer实例有一个slice方法，允许将内存区域的一部分，拷贝生成一个新的ArrayBuffer对象。
const buffer3 = new ArrayBuffer(8)
log(buffer3.byteLength)
const newBuffer = buffer3.slice(0, 3)
log(newBuffer.byteLength)
// 上面代码拷贝buffer对象的前 3 个字节（从 0 开始，到第 3 个字节前面结束），生成一个新的ArrayBuffer对象。slice方法其实包含两步，
// 第一步是先分配一段新内存，第二步是将原来那个ArrayBuffer对象拷贝过去。
// slice方法接受两个参数，第一个参数表示拷贝开始的字节序号（含该字节），第二个参数表示拷贝截止的字节序号（不含该字节）。
// 如果省略第二个参数，则默认到原ArrayBuffer对象的结尾。
// 除了slice方法，ArrayBuffer对象不提供任何直接读写内存的方法，只允许在其上方建立视图，然后通过视图读写。

// ArrayBuffer.isView()
// ArrayBuffer有一个静态方法isView，返回一个布尔值，表示参数是否为ArrayBuffer的视图实例。这个方法大致相当于判断参数，是否为TypedArray实例或DataView实例。
const buffer5 = new ArrayBuffer(8)
log(ArrayBuffer.isView(buffer)) // false
const v = new Int32Array(buffer5)
log(ArrayBuffer.isView(v)) // true

// 同一个ArrayBuffer对象之上，可以根据不同的数据类型，建立多个视图。
// 创建一个8字节的ArrayBuffer
const b = new ArrayBuffer(8)
// 创建一个指向b的Int32视图，开始于字节0，直到缓冲区的末尾
const v1 = new Int32Array(b)
// 创建一个指向b的Uint8视图，开始于字节2，直到缓冲区的末尾
const v2 = new Uint8Array(b, 2)
// 创建一个指向b的Int16视图，开始于字节2，长度为2
const v3 = new Int16Array(b, 2, 2)
// 上面代码在一段长度为 8 个字节的内存（b）之上，生成了三个视图：v1、v2和v3。
// 视图的构造函数可以接受三个参数：
// 第一个参数（必需）：视图对应的底层ArrayBuffer对象。
// 第二个参数（可选）：视图开始的字节序号，默认从 0 开始。
// 第三个参数（可选）：视图包含的数据个数，默认直到本段内存区域结束。
// 因此，v1、v2和v3是重叠的：v1[0]是一个 32 位整数，指向字节 0 ～字节 3；v2[0]是一个 8 位无符号整数，指向字节 2；v3[0]是一个 16 位整数，
// 指向字节 2 ～字节 3。只要任何一个视图对内存有所修改，就会在另外两个视图上反应出来。
v1[0] = 1000000
log(v1[0], v2[0], v3[0], v1[1], v2[1], v3[1])
log(v1.length) //2
log(v2.length) //6
log(v3.length) //2

// （2）TypedArray(length)
// 视图还可以不通过ArrayBuffer对象，直接分配内存而生成。
const f64a = new Float64Array(8)
f64a[0] = 10
f64a[1] = 20
f64a[2] = f64a[0] + f64a[1]
log(f64a[2])
log(f64a.length) //8
// 上面代码生成一个 8 个成员的Float64Array数组（共 64 字节），然后依次对每个成员赋值。这时，视图构造函数的参数就是成员的个数。
// 可以看到，视图数组的赋值操作与普通数组的操作毫无两样。

// （3）TypedArray(typedArray)
// TypedArray 数组的构造函数，可以接受另一个TypedArray实例作为参数。
const typedArray2 = new Int8Array(new Uint8Array(4))
log(typedArray2.length) //4
const typedArray3 = new Int8Array(new Uint16Array(4))
log(typedArray3.length) //4 不会*2
// 上面代码中，Int8Array构造函数接受一个Uint8Array实例作为参数。
// 注意，此时生成的新数组，只是复制了参数数组的值，对应的底层内存是不一样的。新数组会开辟一段新的内存储存数据，不会在原数组的内存之上建立视图。
const x = new Int8Array([1, 1])
const y = new Int8Array(x)
log(x[0]) // 1
log(y[0]) // 1
x[0] = 2
log(y[0]) // 1
// 上面代码中，数组y是以数组x为模板而生成的，当x变动的时候，y并没有变动。
// 如果想基于同一段内存，构造不同的视图，可以采用下面的写法。
// const x = new Int8Array([1, 1]);
// const y = new Int8Array(x.buffer);
// x[0] // 1
// y[0] // 1
// x[0] = 2;
// y[0] // 2

// （4）TypedArray(arrayLikeObject)
// 构造函数的参数也可以是一个普通数组，然后直接生成TypedArray实例。
// const typedArray = new Uint8Array([1, 2, 3, 4]);
// 注意，这时TypedArray视图会重新开辟内存，不会在原数组的内存上建立视图。
// 上面代码从一个普通的数组，生成一个 8 位无符号整数的TypedArray实例。
// TypedArray 数组也可以转换回普通数组。
// const normalArray = [...typedArray];
// // or
// const normalArray = Array.from(typedArray);
// // or
// const normalArray = Array.prototype.slice.call(typedArray);

// 数组方法
// 普通数组的操作方法和属性，对 TypedArray 数组完全适用。
// TypedArray.prototype.copyWithin(target, start[, end = this.length])
// TypedArray.prototype.entries()
// TypedArray.prototype.every(callbackfn, thisArg?)
// TypedArray.prototype.fill(value, start=0, end=this.length)
// TypedArray.prototype.filter(callbackfn, thisArg?)
// TypedArray.prototype.find(predicate, thisArg?)
// TypedArray.prototype.findIndex(predicate, thisArg?)
// TypedArray.prototype.forEach(callbackfn, thisArg?)
// TypedArray.prototype.indexOf(searchElement, fromIndex=0)
// TypedArray.prototype.join(separator)
// TypedArray.prototype.keys()
// TypedArray.prototype.lastIndexOf(searchElement, fromIndex?)
// TypedArray.prototype.map(callbackfn, thisArg?)
// TypedArray.prototype.reduce(callbackfn, initialValue?)
// TypedArray.prototype.reduceRight(callbackfn, initialValue?)
// TypedArray.prototype.reverse()
// TypedArray.prototype.slice(start=0, end=this.length)
// TypedArray.prototype.some(callbackfn, thisArg?)
// TypedArray.prototype.sort(comparefn)
// TypedArray.prototype.toLocaleString(reserved1?, reserved2?)
// TypedArray.prototype.toString()
// TypedArray.prototype.values()
// 上面所有方法的用法，请参阅数组方法的介绍，这里不再重复了。
// 注意，TypedArray 数组没有concat方法。如果想要合并多个 TypedArray 数组，可以用下面这个函数。
function concatenate(resultConstructor, ...arrays) {
  let totalLength = 0
  for (let arr of arrays) {
    totalLength += arr.length
  }
  let result = new resultConstructor(totalLength)
  let offset = 0
  for (let arr of arrays) {
    result.set(arr, offset)
    offset += arr.length
  }
  return result
}
log(concatenate(Uint8Array, Uint8Array.of(1, 2), Uint8Array.of(3, 4)))
// Uint8Array [1, 2, 3, 4]

// 另外，TypedArray 数组与普通数组一样，部署了 Iterator 接口，所以可以被遍历。
let ui8 = Uint8Array.of(0, 1, 2)
for (let byte of ui8) {
  console.log(byte)
}
// 0
// 1
// 2

// 字节序
// 字节序指的是数值在内存中的表示方式。
const buffer10 = new ArrayBuffer(16)
const int32View = new Int32Array(buffer10)
for (let i = 0; i < int32View.length; i++) {
  int32View[i] = i * 2
}
for (let i of int32View) {
  log(i)
}
// 上面代码生成一个 16 字节的ArrayBuffer对象，然后在它的基础上，建立了一个 32 位整数的视图。
// 由于每个 32 位整数占据 4 个字节，所以一共可以写入 4 个整数，依次为 0，2，4，6。
// 如果在这段数据上接着建立一个 16 位整数的视图，则可以读出完全不一样的结果。
const int16View = new Int16Array(buffer10)
for (let i = 0; i < int16View.length; i++) {
  console.log('Entry ' + i + ': ' + int16View[i])
}
// 由于每个 16 位整数占据 2 个字节，所以整个ArrayBuffer对象现在分成 8 段。然后，由于 x86 体系的计算机都采用小端字节序（little endian），相对重要的字节排在后面的内存地址，
// 相对不重要字节排在前面的内存地址，所以就得到了上面的结果。
// 比如，一个占据四个字节的 16 进制数0x12345678，决定其大小的最重要的字节是“12”，最不重要的是“78”。小端字节序将最不重要的字节排在前面，储存顺序就是78563412；
// 大端字节序则完全相反，将最重要的字节排在前面，储存顺序就是12345678。目前，所有个人电脑几乎都是小端字节序，所以 TypedArray 数组内部也采用小端字节序读写数据，
// 或者更准确的说，按照本机操作系统设定的字节序读写数据。
// 这并不意味大端字节序不重要，事实上，很多网络设备和特定的操作系统采用的是大端字节序。这就带来一个严重的问题：如果一段数据是大端字节序，
// TypedArray 数组将无法正确解析，因为它只能处理小端字节序！为了解决这个问题，JavaScript 引入DataView对象，可以设定字节序，下文会详细介绍。
// 下面是另一个例子。
// 假定某段buffer包含如下字节 [0x02, 0x01, 0x03, 0x07]
const buffer11 = new ArrayBuffer(4)
const v11 = new Uint8Array(buffer11)
v11[0] = 2
v11[1] = 1
v11[2] = 3
v11[3] = 7
const uInt16View = new Uint16Array(buffer11)
// 计算机采用小端字节序
// 所以头两个字节等于258 0x0102()实际值->存储0x0201格式
// if (uInt16View[0] === 258) {
//   console.log('OK') // "OK"
// }
log(uInt16View[0]) //258
//0x0703->0x0307 //1795
log(uInt16View[1])
// log(uInt16View[2])
// 赋值运算
//0x00FF->0xFF00
uInt16View[0] = 255 // 字节变为[0xFF, 0x00, 0x03, 0x07]
//0Xff05->0x05ff
uInt16View[0] = 0xff05 // 字节变为[0x05, 0xFF, 0x03, 0x07]
uInt16View[1] = 0x0210 // 字节变为[0x05, 0xFF, 0x10, 0x02]

const BIG_ENDIAN = Symbol('BIG_ENDIAN')
const LITTLE_ENDIAN = Symbol('LITTLE_ENDIAN')

function getPlatformEndianness() {
  let arr32 = Uint32Array.of(0x12345678)
  let arr8 = new Uint8Array(arr32.buffer)
  switch (arr8[0] * 0x1000000 + arr8[1] * 0x10000 + arr8[2] * 0x100 + arr8[3]) {
    case 0x12345678:
      return BIG_ENDIAN
    case 0x78563412:
      return LITTLE_ENDIAN
    default:
      throw new Error('Unknown endianness')
  }
}
// 总之，与普通数组相比，TypedArray 数组的最大优点就是可以直接操作内存，不需要数据类型转换，所以速度快得多。
log(getPlatformEndianness())

// BYTES_PER_ELEMENT 属性
// 每一种视图的构造函数，都有一个BYTES_PER_ELEMENT属性，表示这种数据类型占据的字节数。
// Int8Array.BYTES_PER_ELEMENT // 1
// Uint8Array.BYTES_PER_ELEMENT // 1
// Uint8ClampedArray.BYTES_PER_ELEMENT // 1
// Int16Array.BYTES_PER_ELEMENT // 2
// Uint16Array.BYTES_PER_ELEMENT // 2
// Int32Array.BYTES_PER_ELEMENT // 4
// Uint32Array.BYTES_PER_ELEMENT // 4
// Float32Array.BYTES_PER_ELEMENT // 4
// Float64Array.BYTES_PER_ELEMENT // 8
// 这个属性在TypedArray实例上也能获取，即有TypedArray.prototype.BYTES_PER_ELEMENT。

// DataView 视图
// 如果一段数据包括多种类型（比如服务器传来的 HTTP 数据），这时除了建立ArrayBuffer对象的复合视图以外，还可以通过DataView视图进行操作。
// DataView视图提供更多操作选项，而且支持设定字节序。本来，在设计目的上，ArrayBuffer对象的各种TypedArray视图，是用来向网卡、声卡之类的本机设备传送数据，
// 所以使用本机的字节序就可以了；而DataView视图的设计目的，是用来处理网络设备传来的数据，所以大端字节序或小端字节序是可以自行设定的。
// DataView视图本身也是构造函数，接受一个ArrayBuffer对象作为参数，生成视图。
// DataView(ArrayBuffer buffer [, 字节起始位置 [, 长度]]);
// 下面是一个例子。
// const buffer = new ArrayBuffer(24);
// const dv = new DataView(buffer);
// DataView实例有以下属性，含义与TypedArray实例的同名方法相同。
// DataView.prototype.buffer：返回对应的 ArrayBuffer 对象
// DataView.prototype.byteLength：返回占据的内存字节长度
// DataView.prototype.byteOffset：返回当前视图从对应的 ArrayBuffer 对象的哪个字节开始
// DataView实例提供 8 个方法读取内存。
// getInt8：读取 1 个字节，返回一个 8 位整数。
// getUint8：读取 1 个字节，返回一个无符号的 8 位整数。
// getInt16：读取 2 个字节，返回一个 16 位整数。
// getUint16：读取 2 个字节，返回一个无符号的 16 位整数。
// getInt32：读取 4 个字节，返回一个 32 位整数。
// getUint32：读取 4 个字节，返回一个无符号的 32 位整数。
// getFloat32：读取 4 个字节，返回一个 32 位浮点数。
// getFloat64：读取 8 个字节，返回一个 64 位浮点数。
// 这一系列get方法的参数都是一个字节序号（不能是负数，否则会报错），表示从哪个字节开始读取。
const buffer24 = new ArrayBuffer(64)
const dv = new DataView(buffer24)
// 从第1个字节读取一个8位无符号整数
const v61 = dv.getUint8(0)
// 从第2个字节读取一个16位无符号整数
const v62 = dv.getUint16(1)
// 从第4个字节读取一个16位无符号整数
const v63 = dv.getUint16(3)
log(v61, v62, v63)
// 上面代码读取了ArrayBuffer对象的前 5 个字节，其中有一个 8 位整数和两个十六位整数。
// 如果一次读取两个或两个以上字节，就必须明确数据的存储方式，到底是小端字节序还是大端字节序。
// 默认情况下，DataView的get方法使用大端字节序解读数据，如果需要使用小端字节序解读，必须在get方法的第二个参数指定true。
// 小端字节序
const v71 = dv.getUint16(1, true)
// 大端字节序
const v72 = dv.getUint16(3, false)
// 大端字节序
const v73 = dv.getUint16(3)
log(v71, v72, v73)

// DataView 视图提供 8 个方法写入内存。
// setInt8：写入 1 个字节的 8 位整数。
// setUint8：写入 1 个字节的 8 位无符号整数。
// setInt16：写入 2 个字节的 16 位整数。
// setUint16：写入 2 个字节的 16 位无符号整数。
// setInt32：写入 4 个字节的 32 位整数。
// setUint32：写入 4 个字节的 32 位无符号整数。
// setFloat32：写入 4 个字节的 32 位浮点数。
// setFloat64：写入 8 个字节的 64 位浮点数。
// 这一系列set方法，接受两个参数，第一个参数是字节序号，表示从哪个字节开始写入，第二个参数为写入的数据。
// 对于那些写入两个或两个以上字节的方法，需要指定第三个参数，false或者undefined表示使用大端字节序写入，true表示使用小端字节序写入。
// 在第1个字节，以大端字节序写入值为25的32位整数
dv.setInt32(0, 25, false)
// 在第5个字节，以大端字节序写入值为25的32位整数
dv.setInt32(4, 25)
// 在第9个字节，以小端字节序写入值为2.5的32位浮点数
dv.setFloat32(8, 2.5, true)
// 小端字节序
const v81 = dv.getInt32(0, false)
// 大端字节序
const v82 = dv.getInt32(4)
// 大端字节序
const v83 = dv.getFloat32(8, true)
log(v81, v82, v83)

//https://xin-tan.com/passages/2018-07-29-webpack-demos-introduction/
