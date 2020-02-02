var eventBus = new Vue()
// View Component for Product
Vue.component('product', {
    template: `<div class="product">
<div class="product-image">
  <img v-bind:src="image" length = 200 width="200" />
</div>
<div class="product-info">
  <h1>{{title}}</h1>
  <p>{{description}} {{product}}</p>
  <p v-if="inventory >10">In Stock</p>
  <p v-else-if="inventory<=10 && inventory >0">Almost sold out!</p>
  <p v-else>Out of Stock</p>
  <p v-if="onSale">On Sale</p>
  <ul>
      <li v-for="detail in details">{{detail}}</li>
  </ul>
  <div v-for = "(variant, index) in variants" 
  :key="variant.variantId" 
  class="color-box" 
  :style ="{backgroundColor:variant.variantColor}"
  @mouserover="updateProduct(index)">
      
  </div>
  <p><a :href="product_link" target="_blank">Follow this link to product's page</a></p>
  <button v-on:click= "addToCart" :disabled = "inventory<=0">Add to Cart</button>
  <button v-on:click = "reduceCart" :disabled = "inventory<=0">Remove from Cart</button>
  
</div><br>
<product-tabs :reviews = 'reviews'></product-tabs>

</div>`,
    // Product data
    data() {
        return {
            brand: 'Okello',
            product: 'Socks',
            description: 'I love cotton',
            selectedVariant: 0,
            product_link: 'https://www.google.com',
            onSale: true,
            details: ["80% cotton", "20% polyester", "Gender-neutral"],
            variants: [{
                variantId: 2234,
                variantColor: 'green',
                variantImage: '/assests/green-socks.jpg',
                variantQuantity: 10
            },
            {
                variantId: 2235,
                variantColor: 'blue',
                variantImage: '/assests/blue-socks.jpg',
                variantQuantity: 0
            }],
            reviews: []

        }
    },
    // Product methods
    methods: {
        addToCart() {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId)
        },
        reduceCart() {
            this.$emit('remove-from-cart', this.variants[this.selectedVariant].variantId)
        },
        updateProduct(index) {
            this.selectedVariant = index
            console.log(index)
        },

    },
    // Computed properties for product
    computed: {
        title() {
            return this.brand + ' ' + this.product
        },
        image() {
            return this.variants[this.selectedVariant].variantImage
        },
        inventory() {
            return this.variants[this.selectedVariant].variantQuantity
        }
    },
    mounted(){
        eventBus.$on('review-submitted', productReview =>{
            this.reviews.push(productReview)
        })
    }
})
// Vue component for Reviews
Vue.component('product-review', {
    template: `
    <form class = 'review-form' @submit.prevent = 'onSubmit'>
    <p v-if = "errors.length">
    <b>Please correct the following error(s):</b>
    <li v-for="error in errors">{{error}}</li>
    </p>
    <p>
    <label for='name' >Name:</label>
    <input id = 'name' v-model='name'>
    </p> 

    <p>
    <label for='review'>Review:</label>
    <textarea id='review' v-model='review'></textarea>
    </p>

    <p>
    <label for='rating' >Rating:</label>
    <select id=rating v-model.number='rating'>
    <option>1</option>
    <option>2</option>
    <option>3</option>
    <option>4</option>
    <option>5</option>
    </select>
    </p>

    <input type='submit' value='Submit'>
    </form>
    `,

    data() {
        return {
            name: null,
            review: null,
            rating: null,
            errors: []
        }

    },
    methods: {
        onSubmit() {
            if (this.name && this.review && this.rating) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating
                }
                eventBus.$emit('review-submitted', productReview)
                this.name = null,
                    this.review = null,
                    this.rating = null
            }
            else {
                if (!this.name) this.errors.push("Name is required")
                if (!this.review) this.errors.push("Review is required")
                if (!this.rating) this.errors.push("Rating is required")
            }

        }


    }

})
// Vue component for product tabs

Vue.component('product-tabs', {
    props:{
        reviews:{
            type: Array,
            required: true
        }
    },
    template: `
    <div>
    <span class='tab' 
    :class = '{activeTab:selectedTab === tab}'
    v-for ='(tab, index) in tabs ' 
    :key='index'
    @click='selectedTab = tab'>{{tab}}</span>
      
    <div v-show="selectedTab === 'Reviews'">
<p v-if='!reviews.length'>Be the firt person to review this product</p>
<ul>
<li v-for='review in reviews'>
<p>{{review.name}}</p>
<p>{{review.rating}}</p>
<p>{{review.review}}</p>
</li>
</ul>
</div>
<product-review v-show="selectedTab === 'Make a Review'"></product-review>
</div>
    `,
    data() {
        return {
            tabs: ['Reviews', 'Make a Review'],
            selectedTab: 'Reviews'
        }
    }
})

// Vue instance
var app = new Vue({
    el: '#app',
    data: {
        cart: []
    },
    methods: {
        updateCart(id) {
            this.cart.push(id)
        },
        deductCart(id) {
            this.cart.splice(id)
        },

    }

});


