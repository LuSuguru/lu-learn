/*
 * @Date: 2020-07-07 10:08:30
 * @Author: 芦杰
 * @Description: 研究原型专用
 * @LastEditors: 芦杰
 * @LastEditTime: 2020-07-07 10:13:45
 */

// const Tree = function () { }

// Tree.prototype.oneMoreLeaf = function () {
//   this.leaf = this.leaf + 1
//   console.log(`I have ${this.leaf} leafs`)
// }

// Tree.prototype.leaf = 0

// const tree1 = new Tree()
// tree1.oneMoreLeaf()
// tree1.oneMoreLeaf()

// const tree2 = new Tree()
// tree2.oneMoreLeaf()

/**
  * 研究原型专用
  */
function Test() {
  // this.a = 3
}

Test.prototype.changeA = function () {
  this.a = this.a++
  this.constructor.prototype.a = 3
}

Test.prototype.a = 2

const test = new Test()
console.log(test.a)
test.changeA()
console.log(test)

const test2 = new Test()

console.log(test2.a)
test2.changeA()
console.log(test2)  
