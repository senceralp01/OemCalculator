
// Storage Controller (Module)
const StorageController = (function() {

})(); // IIFE (Immediately Invoked Function Expression)

// Product Controller (Module)
const ProductController = (function() {
    
    //private
    const Product = function (id, name, price){
        this.id = id;
        this.name = name;
        this.price = price;
    }

    const data = {
        products: [
            {id:0, name:'Monitor', price: 100},
            {id:0, name:'Ram', price: 30},
            {id:0, name:'Klavye', price: 10}
        ],
        selectedProduct: null,
        totalPrice: 0
    }

    //public
    return{
        getProducts: function(){
            return data.products;
        },
        getData: function (){
            return data;
        }
    }


})();

// UI Controller (Module)
const UIController = (function() {

})();

// App Controller (Module)
const App = (function(ProductCtrl, UICtrl){

    //public
    return{
        init: function(){
            console.log("Starting App..");
            const products = ProductCtrl.getProducts();
            
            UICtrl.createProductList(products);

        }
    }
})(ProductController, UIController);

App.init();