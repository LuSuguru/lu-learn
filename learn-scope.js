// 学习作用域

// console.log(1,c)
//  {
//   console.log(2,c)

//   function c() {
//     console.log(c)
//   }


// }



if (true) {
  console.log('a', a, window.a);// 函数提升，是块级作用域，输出 function a 和 0
  // a = 1;  // 取作用域最近的块级作用域的 function a ,且被重置为 1了，本质又是一个 变量的赋值。
  console.log('b', a, window.a);// a 是指向块级作用域的 a, 输出 1 和 0 
  function a() { } // 函数的声明，将执行函数的变量的定义同步到函数级的作用域。
  console.log('c', a, window.a);// 输出 1 和 1
  a = 21; // 仍然是函数定义块级作用域的 a ,重置为 21
  console.log('d', a, window.a); // 输出为函数提升的块级作用域的 a, 输出 21，1
  console.log("里面", a);
}
console.log("外部", a);

// a()