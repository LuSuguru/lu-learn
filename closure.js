/*
 * @Date: 2020-07-07 10:10:06
 * @Author: 芦杰
 * @Description: 研究闭包专用
 * @LastEditors: 芦杰
 * @LastEditTime: 2020-07-07 10:28:04
 */

/**
* 研究闭包专用1
*/
// var a = 1;
// function f() {
//   var a = 2;
//   c = 4;
//   return function g() {
//     console.log(a++); // 2
//     console.log(b++); // 3
//     console.log(c++); // 4
//   }
// }

// console.log(a); // 1
// console.log(b); // undefined
// // console.log(c); // 报错

// var g = f();
// var b = 3;
// g();

// console.log(a); // 1
// console.log(b); // 4
// console.log(c); // 5

/**
 * 研究闭包专用2
 */

var a = 1
var test = [{ a: 1 }, { b: 1 }]

function f() {
  var a = 2
  var c = 4

  var [testb] = test
  function g() {
    console.log('-----')
    console.log(a++) //2
    console.log(b++) //3
    console.log(c++) //6
    console.log(testb)
  }

  setTimeout(() => {
    test[0] = { c: 1 }
    // test[0].a = 3
  }, 0);

  return g
}

console.log(a)//1
console.log(b) // underfind
console.log(c) // underfind 

var g = f()
var b = 3
var c = 5

g() // a:2 b:3 c:4 {b:1}
setTimeout(() => {
  // var g = f()
  g()  // a:2 b:4 c:4 {a:3}
}, 0)

console.log('-----')
console.log(a) //1
console.log(b) //4
console.log(c) //5
