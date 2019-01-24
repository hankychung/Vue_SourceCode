class H_Vue {
  constructor(vm) {
    this.$el = vm.el 
    this.$data = vm.data
    this.observer(this.$data)
  }
  observer(datas) {
    Object.keys(datas).forEach(key => {
      this.reactive(datas, key, datas[key])
    })
  }
  reactive(obj, key, val) {
    Object.defineProperty(obj, key, {
      get() {
        return val
      },
      set(newVal) {
        if (newVal == val) return
        console.log('change!!!!', newVal)
      }
    })
  }
}

window.H_Vue = H_Vue
