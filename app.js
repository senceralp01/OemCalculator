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
        getProductById: (id) => {
            let product = null;

            data.products.forEach(prd => {
                if(prd.id == id){
                    product = prd;
                }
            });

            return product;

        },
        setCurrentProduct: function(product){
            data.selectedProduct = product;
        },
        getCurrentProduct: function(){
            return data.selectedProduct;
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
        updateProduct: function(name, price){
            let product = null;

            data.products.forEach(prd => {
                if(prd.id == data.selectedProduct.id){
                    prd.name = name;
                    prd.price = parseFloat(price);
                    product = prd;
                }
            });


            return product;
        },
        deleteProduct: function(product) {
            data.products.forEach((prd, index) => {
                if(prd.id == product.id){
                    data.products.splice(index,1);
                }
            })
            
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
        productListItems: '#item-list tr',
        addButton: '.addBtn',
        addButton: '.addBtn',
        updateButton: '.updateBtn',
        cancelButton: '.cancelBtn',
        deleteButton: '.deleteBtn',
        productName: '#productName',
        productPrice: '#productPrice',
        productCard: '#productCard',
        totalTl: '#total-tl',
        totalDollar: '#total-dollar',
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
                            <i class="far fa-edit edit-product"></i>
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
                        <i class="far fa-edit edit-product"></i>
                    </td>
                </tr>
            `;

            document.querySelector(Selectors.productList).innerHTML += item;
        },
        updateProduct: function(prd) {

            let updatedItem = null;
            let items = document.querySelectorAll(Selectors.productListItems);
            items.forEach(item => {
                if(item.classList.contains('bg-warning')){
                    item.children[1].textContent = prd.name;
                    item.children[2].textContent = prd.price + ' $';
                    updatedItem = item;
                }
            });

            return updatedItem
        },
        clearInputs: function (){
            document.querySelector(Selectors.productName).value = '';
            document.querySelector(Selectors.productPrice).value = '';

        },
        clearWarnnigs: function() {
            const items = document.querySelectorAll(Selectors.productListItems);
            items.forEach(item => {
                // item.classList.remove('bg-warning');
                if(item.classList.contains('bg-warning')){
                    item.classList.remove('bg-warning');
                }
            });
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
            
            document.querySelector(Selectors.totalDollar).textContent = `${total} $`;
            document.querySelector(Selectors.totalTl).textContent = `${total*currency} TL`;
        },
        addProductToForm: function(){
            const selectedProduct = ProductController.getCurrentProduct();
            document.querySelector(Selectors.productName).value = selectedProduct.name;
            document.querySelector(Selectors.productPrice).value = selectedProduct.price;

        },
        addingState: function(item) {
            UIController.clearWarnnigs();
            UIController.clearInputs();
            document.querySelector(Selectors.addButton).style.display = 'inline';
            document.querySelector(Selectors.updateButton).style.display = 'none';
            document.querySelector(Selectors.deleteButton).style.display = 'none';
            document.querySelector(Selectors.cancelButton).style.display = 'none';
        },
        editState: function(tr) {
            tr.classList.add('bg-warning');
            document.querySelector(Selectors.addButton).style.display = 'none';
            document.querySelector(Selectors.updateButton).style.display = 'inline';
            document.querySelector(Selectors.deleteButton).style.display = 'inline';
            document.querySelector(Selectors.cancelButton).style.display = 'inline';
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

        //edit product click
        document.querySelector(UISelectors.productList).addEventListener('click', productEditClick);

        //edit product submit
        document.querySelector(UISelectors.updateButton).addEventListener('click', editProductSubmit);

        //cancel button click
        document.querySelector(UISelectors.cancelButton).addEventListener('click', cancelUpdate);

        //delete button click
        document.querySelector(UISelectors.deleteButton).addEventListener('click', deleteProductSubmit);
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
            UICtrl.clearInputs();
        }


        e.preventDefault();
    }

    const productEditClick = (e) => {
        
        if(e.target.classList.contains('edit-product')){

            const id = e.target.parentNode.previousElementSibling.previousElementSibling.previousElementSibling.textContent;

            //get selected product
            const product = ProductCtrl.getProductById(id);
            
            //set current product
            ProductCtrl.setCurrentProduct(product);

            //clear bg-warning
            UICtrl.clearWarnnigs();

            //add product to UI
            UICtrl.addProductToForm();

            //pass to edit state
            UICtrl.editState(e.target.parentNode.parentNode);

        }

        e.preventDefault();
    }

    const editProductSubmit = (e) => {

        const productName = document.querySelector(UISelectors.productName).value;
        const productPrice = document.querySelector(UISelectors.productPrice).value;

        if(productName !== '' && productPrice !== ''){

            //update product
            const updatedProduct = ProductCtrl.updateProduct(productName, productPrice);

            //update UI
            let item = UICtrl.updateProduct(updatedProduct);

            //Get total price
            const total = ProductCtrl.getTotal();

            //Show total price
            UICtrl.showTotal(total);

            UICtrl.addingState();

        }

        e.preventDefault();
    }

    const cancelUpdate = (e) => {

        UICtrl.addingState();
        UICtrl.clearWarnnigs();
        e.preventDefault();
    }

    const deleteProductSubmit = (e) => {

        //get selected product
        const selectedProduct = ProductCtrl.getCurrentProduct();

        //delete product from Product Controller
        ProductCtrl.deleteProduct(selectedProduct);

        e.preventDefault();
    }

    //public//
    return{
        init: function(){
            console.log("Starting App..");
            UICtrl.addingState();

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