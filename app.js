
// Storage Controller (Module)
const StorageController = (function() {

})(); // IIFE (Immediately Invoked Function Expression)

// Product Controller (Module)
const ProductController = (function() {
    
    //private//
    const Product = function (id, name, price){
        this.id = id;
        this.name = name;
        this.price = price;
    }

    const data = {
        products: [
            // {id:0, name:'Monitor', price: 100},
            // {id:1, name:'Ram', price: 30},
            // {id:2, name:'Klavye', price: 10},
            // {id:3, name:'Mouse', price: 5}
        ],
        selectedProduct: null,
        totalPrice: 0
    }

    //public//
    return{
        getProducts: function() {
            return data.products;
        },
        getData: function() {
            return data;
        },
        addProduct: function(name, price) {
            let id;

            if(data.products.length>0){
                id = data.products[data.products.length-1].id+1;
            }else{
                id = 0;
            }
            const newProduct = new Product(id, name, parseFloat(price));
            data.products.push(newProduct);
            return newProduct;
        }
    }


})();

// UI Controller (Module)
const UIController = (function() {

    //private//
    const Selectors = {
        productList: "#item-list",
        addButton: '.addBtn',
        productName: '#productName',
        productPrice: '#productPrice'
    }

    //public//
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
        },
        addProductToList: function(newPrd){
            var item = `
                <tr>
                    <td>${newPrd.id}</td>
                    <td>${newPrd.name}</td>
                    <td>${newPrd.price} $</td>
                    <td class="text-right">
                    <button type="submit" class="btn btn-warning btn-sm">
                        <i class="far fa-edit"></i>
                    </button>
                    </td>
                </tr>
            `;

            document.querySelector(Selectors.productList).innerHTML += item;
        },
        clearInputs: function(){
            document.querySelector(Selectors.productName).value = '';
            document.querySelector(Selectors.productPrice).value = '';

        }
    }
})();

// App Controller (Module)
const App = (function(ProductCtrl, UICtrl){

    //private//
    const UISelectors = UICtrl.getSelectors();

    //Load Event Listeners
    const loadEventListeners = function(){
        //add product event
        document.querySelector(UISelectors.addButton).addEventListener('click', productAddSubmit);
    }

    const productAddSubmit = function(e){
        const productName = document.querySelector(UISelectors.productName).value;
        const productPrice = document.querySelector(UISelectors.productPrice).value;

        if(productName !== '' && productPrice !== ''){
            //Add new product
            const newProduct = ProductCtrl.addProduct(productName, productPrice);

            //Add product to list
            UICtrl.addProductToList(newProduct);

            //Clear inputs
            UIController.clearInputs();
        }


        e.preventDefault();
    }

    //public//
    return{
        init: function(){
            console.log("Starting App..");
            const products = ProductCtrl.getProducts();
            
            UICtrl.createProductList(products);

            //load event listeners
            loadEventListeners();
        }
    }
})(ProductController, UIController);

App.init();