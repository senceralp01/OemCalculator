// MODULE PATTERN APP

// ***** Storage Controller (Module) *****
const StorageController = (function() {

})(); // IIFE (Immediately Invoked Function Expression)

// ***** Product Controller (Module) *****
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
        },
        getTotal: function(){
            let total = 0;
            data.products.forEach(item => {
                total += item.price;
            });
            data.totalPrice = total;
            return data.totalPrice;
        }
    }


})();

// ***** UI Controller (Module) *****
const UIController = (function() {

    //private//
    const Selectors = {
        productList: "#item-list",
        addButton: '.addBtn',
        productName: '#productName',
        productPrice: '#productPrice',
        productCard: '#productCard',
        totalTl: '#total-tl',
        totalDollar: '#total-dollar'
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

            document.querySelector(Selectors.productCard).style.display = 'block';
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

        },
        hideCard: function() {
            document.querySelector(Selectors.productCard).style.display = 'none';
        },
        showTotal: async (total) => {
            const api_key = "1dfbf427ddec9712b8ea50fd";
            const url = "https://v6.exchangerate-api.com/v6/" + api_key + "/latest/USD";

            // Get Dollar <=> TL currency by API
            const response = await fetch(url);
            const responseData = await response.json();
            let currency = responseData.conversion_rates.TRY;
            console.log(currency);

            document.querySelector(Selectors.totalDollar).textContent = `${total} $`;
            document.querySelector(Selectors.totalTl).textContent = `${total*currency} TL`;
        }

    }
})();

// ***** App Controller (Module) *****
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

            //Get total price
            const total = ProductCtrl.getTotal();

            //Show total price
            UICtrl.showTotal(total);
            

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

            if(products.length == 0){
                UICtrl.hideCard();
            }else{
                UICtrl.createProductList(products);
            }

            //load event listeners
            loadEventListeners();
        }
    }
})(ProductController, UIController);

App.init();