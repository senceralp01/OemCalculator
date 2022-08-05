
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
            {id:1, name:'Ram', price: 30},
            {id:2, name:'Klavye', price: 10},
            {id:3, name:'Mouse', price: 5}
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

    //private
    const Selectors = {
        productList: "#item-list"
    }

    //public
    return{
        createProductList: function(products){
            let html = '';

            products.forEach(prd => {
                html += `
                    <tr>
                        <td>${prd.id}</td>
                        <td>${prd.name}</td>
                        <td>${prd.price} $</td>
                        <td class="text-right">
                        <button type="submit" class="btn btn-warning btn-sm">
                            <i class="far fa-edit"></i>
                        </button>
                        </td>
                    </tr>
                `;
            });

            document.querySelector(Selectors.productList).innerHTML = html;
        },
        getSelectors: function(){
            return Selectors;
        }
    }
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