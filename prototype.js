/*
 * @Date: 2020-07-07 10:08:30
 * @Author: 芦杰
 * @Description: 研究原型专用
 * @LastEditors: 芦杰
 * @LastEditTime: 2020-07-07 10:08:53
 */

const Tree = function () { }

Tree.prototype.oneMoreLeaf = function () {
  this.leaf = this.leaf + 1
  console.log(`I have ${this.leaf} leafs`)
}

Tree.prototype.leaf = 0

const tree1 = new Tree()
tree1.oneMoreLeaf()
tree1.oneMoreLeaf()

const tree2 = new Tree()
tree2.oneMoreLeaf()
