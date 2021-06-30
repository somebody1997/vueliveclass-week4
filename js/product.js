import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.11/vue.esm-browser.js'
import pagination from '../components/pagination.js'
import productModalCom from '../components/productModal.js'
import delModalCom from '../components/delModal.js'

const url = "https://vue3-course-api.hexschool.io"
const path = "vueliveclass"

let productModal = {}
let delProductModal = {}
const app = createApp({
  data() {
    return {
      products: [],
      content: '',
      image: '',
      tempProduct: {
        // imagesUrl: []
      },
      isNew: false,
      pagination: {}
    }
  },
  methods: {
    init() {
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)myToken\s*\=\s*([^;]*).*$)|^.*$/, "$1")
      // console.log(token)
      axios.defaults.headers.common['Authorization'] = token
    },
    getProduct (page = 1) {
      axios.get(`${url}/api/${path}/admin/products?page=${page}`)
        .then(res => {
          console.log(res.data)
          if (res.data.success) {
            this.products = res.data.products
            this.pagination = res.data.pagination
          }
        })
        .catch(err => console.log(err))
    },
    openModal (isNew, item) {
      this.isNew = isNew
      if(this.isNew){
        this.tempProduct = {imgUrl: []}
      }else{
        this.tempProduct = {...item} 
      }
      productModal.show()
    },
    updateProduct (tempProduct) {
      let updateUrl = `${url}/api/${path}/admin/product`
      let method = 'post'
      if(!this.isNew){
        method = 'put'
        updateUrl = `${url}/api/${path}/admin/product/${tempProduct.id}`
      }
      tempProduct.origin_price = parseInt(tempProduct.origin_price)
      tempProduct.price = parseInt(tempProduct.price)

      axios[method](updateUrl,{ data: tempProduct })
        .then(res => {
          console.log(res)
          if(res.data.success) {
            this.getProduct()
            productModal.hide()
          }
        })
        .catch(err => console.log(err))
    },
    deleteProductModal (item) {
      delProductModal.show()
      this.tempProduct = {...item}
    },
    delProduct () {
      axios.delete(`${url}/api/${path}/admin/product/${this.tempProduct.id}`)
      .then(res => {
        if(res.data.success) {
          this.getProduct()
          delProductModal.hide()
          alert(`已刪除 ${this.tempProduct.title} 商品 `);
        }else{
          alert(res.data.message);
        }
      })
      .catch(err => console.log(err))
    }
  },
  components: { 
    pagination,
    productModalCom,
    delModalCom
  },
  created () {
    this.init()
    this.getProduct()
  },
  mounted () {
    productModal = new bootstrap.Modal(document.getElementById('productModal'), {
      keyboard: false
    }),
    delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'), {
      keyboard: false
    })
  }
})

app.mount('#app')