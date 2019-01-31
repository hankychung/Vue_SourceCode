class Compiler {
  constructor(el, vm) {
    this.$el = el
    this.$data = vm
    if (this.$el) {
      // 遍历所有节点，将节点存入内存碎片
      this.$fragment = this.toFragment(this.$el)
      // 编译
      this.compile(this.$fragment)
      // 输出到节点
      this.$el.appendChild(this.$fragment)
    }
  }

  toFragment(el) {
    console.log(el)
    let fragment = document.createDocumentFragment()
    while(el.firstChild) {
      fragment.appendChild(el.firstChild)
    }    
    console.log(fragment)
    return fragment
  }

  compile(frag) {
    console.log(frag.childNodes)
    let nodes = Array.from(frag.childNodes)
    console.log(nodes)
    nodes.forEach(node => {
      // console.dir(node)
      if (this.isElement(node)) {
        console.log('node below --------------')
        console.dir(node)
        console.log(Array.from(node.attributes))
        Array.from(node.attributes).forEach(attr => {
          // 是否含有指令
          if (/^h\-/.test(attr.name)) {
            console.dir(attr)
            this.handleDir(node, attr.value, attr.name.substring(2))
          }
        })
        this.compile(node)
      }
      if (this.isText(node)) {
        this.handleText(node)
      }
    })
  }
  // 节点是否为元素
  isElement(node) {
    if (node.nodeType === 1) return true
  }
  // 节点是否为文本
  isText(node) {
    if (node.nodeType === 3) return true
  }

  // 判断是否含有vue变量 - {{}}
  handleText(node) {    
    let ctn = node.textContent
    let reg = /\{\{(.*)\}\}/
    if (reg.test(ctn)) {
      console.log(ctn)
      console.log(RegExp.$1)
      let exp = RegExp.$1
      this.updator(node, exp, 'text')
    }
  }

  // 判断指令
  handleDir(node, exp, dir) {
    this.updator(node, exp, dir)
  }

  updator(node, exp, type) {
    new Watcher(this.$data, exp, () => {
      this.updateFn(type, node, exp, this)
    })
  }

  updateFn(type, node, exp, _this) {
    let updator = {
      text() {
        console.log('inUpdatorTHIS', this)
        node.textContent = _this.$data[exp]
        return _this.$data[exp]
      },
      html() {
        console.log('html below----------')
        console.dir(node)
        node.innerHTML = exp
        return exp
      },
      model() {
        console.log('model below----------')
        console.dir(node)
        node.value = _this.$data[exp]
        node.oninput = () => {
          _this.$data[exp] = node.value
        }
        return _this.$data[exp]
      }
    }    
    return updator[type]()
  }

  // textUpdator(node, exp, val) {
  //   console.log('inUpdator', node)
  //   console.dir(node)
  //   console.log(this)
  //   node.textContent = val
  //   return val
  // }

}
class Watcher {
  constructor(vm, key, cb) {
    this.vm = vm
    this.key = key
    this.cb = cb
    this.val = this.get()
  }
  get() {
    Dep.target = this.cb
    let val = this.cb()
    return val
  }
}

class Dep {
  constructor() {
    this.deps = []
  }
  collect(cb) {
    this.deps.push(cb)
  }
  update() {
    this.deps.forEach(dep => {
      dep()
    })
  }
}


class H_Vue {
  constructor(vm) {
    this.$el = vm.el 
    this.$data = vm.data
    this.observer(this.$data)
    new Compiler(this.$el, this.$data)    
  }
  observer(datas) {
    Object.keys(datas).forEach(key => {
      this.proxyData(key)
      this.defineReactive(datas, key, datas[key])
    })
  }
  // 数据代理
  proxyData(key) {
    Object.defineProperty(this, key, {
      get() {
        return this.$data[key]
      },
      set(newVal) {
        this.$data[key] = newVal
      }
    })
  }
  // 数据响应
  defineReactive(obj, key, val) {
    let dep = new Dep()
    Object.defineProperty(obj, key, {
      get() {
        if (dep.deps.indexOf(Dep.target) == -1) {
          dep.collect(Dep.target)
        }        
        return val
      },
      set(newVal) {
        if (newVal == val) return
        val = newVal
        dep.update()
        console.log('change!!!!', newVal)
      }
    })
  }
}

window.H_Vue = H_Vue
