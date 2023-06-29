// variables

const landingPage=document.querySelector(".landing-page");
const loginIcon=document.querySelector(".user");
const loginForm=document.querySelector(".login-form");
const bagIcon=document.querySelector(".bag-info");
const cartShow=document.querySelector(".cart");
const backToStore=document.querySelector(".back-to-store");
const ProductsInfo=document.querySelector(".products-section .row");
const cartItem=document.querySelector(".cart .items")
const totalNumberOfItems=document.querySelector(".total-items");
const totalPrice=document.querySelector(".total-price");


//background overlay
// let backgroundArray=["images/design-1.jpg","images/design-2.jpg","images/design-3.jpg","images/design-4.jpeg","images/design-5.jpg","images/design-6.jpg","images/design-7.png","images/design-8.jpg","images/design-9.png"];
// setInterval(()=>{
//     let randamnumber=Math.floor(Math.random()* backgroundArray.length);
//     landingPage.style.backgroundImage='url("'+backgroundArray[randamnumber] +'")';
// },2000);

let cart=JSON.parse(localStorage.getItem("cart")) || [];
updata();

//full overlay
let overlayBlack=document.createElement("div");
    overlayBlack.className="full-overlay";


//login section
loginIcon.addEventListener("click",function(){
    loginForm.classList.toggle("login-show");
    
});

//show cart
bagIcon.addEventListener("click",function(){
    cartShow.classList.add("show-cart");
    document.body.appendChild(overlayBlack);
});

//close cart
backToStore.addEventListener("click",function(){
    cartShow.classList.remove("show-cart");
    document.body.removeChild(overlayBlack);
});

//get products from json file
async function getProducts(){
    let url='items.json';
    try{
        let res=await fetch(url);
        return await res.json();
    }catch(error){
        console.log(error)

    }
}

async function renderProducts(){
    let products= await getProducts();
    products.forEach(product => {
        ProductsInfo.innerHTML+=`<div class="col-lg-3 col-md-6 mb-4">
        <div class="card" id="${product.id}">
            <div class="add-to-cart" onclick="addToCart(${product.id})">
                ADD TO CART
            </div>
            <div class="item-img">
                <img src="${product.image}" class="img-fluid" />
            </div>
            <div class="card-body">
                <a href="" class="text-reset">
                    <h5 class="card-title mb-3">${product.title}</h5>
                </a>
                <h6 class="mb-3 item-color">${product.price}</h6>
            </div>
        </div>
    </div>`;
        
    });
        
    
}
renderProducts();

//check items in cart
async function addToCart(id){
    let products= await getProducts();
    //check if product already in cart
    if(cart.some((product)=>product.id===id)){
        changeNumberOfUnits('up',id);
    }else{
    const item=products.find((product)=> product.id===id);
    cart.push({
        ...item,
    numberUnits:1,
});
    }
    updata()

}

//updata function
function updata(){
    putItemInCart()
    totalCost()
    //save items in local storage
    localStorage.setItem("cart",JSON.stringify(cart));
}


//put item in card
function putItemInCart(){
    cartItem.innerHTML='';
    cart.forEach((item)=>{
        cartItem.innerHTML+=`<div class="cart-item mt-4 d-flex gap-5">
        <div class="item-img">
            <img src="${item.image}" class="img-fluid" alt="">
        </div>
        <div class="item-info">
            <h4>${item.title}</h4>
            <div class="row  ">
                <div class="col d-flex align-items-center">
                    <div class="btn-up "  onclick="changeNumberOfUnits('up',${item.id})">+</i></div>
                    <div class="number p-2">${item.numberUnits}</div>
                    <div class="btn-down "  onclick="changeNumberOfUnits('down',${item.id})">-</i></div>
                </div>
                <div class="col ">
                    <p class="pt-3 ps-2 ">$<span class="item-price ">${item.price}</span></p>
                </div>
            </div>
        </div>
        <div class="remove" onclick="removeItem(${item.id})">
            <i class="fas fa-times item-color "></i>
        </div>
    </div>
        `
    });


};


//collect total cost 
function totalCost(){
    let total=0;
    let totalitems=0;

    cart.forEach((item)=>{
        total+=item.price * item.numberUnits;
        totalitems +=item.numberUnits;
    });
    totalNumberOfItems.textContent=totalitems;
    totalPrice.textContent=total.toFixed(2);
    

};

//remove item from cart
function removeItem(id){
    cart=cart.filter((item)=> item.id !== id);
    updata();
};


function changeNumberOfUnits(btnName,id){
    cart= cart.map((item)=>{
        let oldnumberUnits=item.numberUnits;
        if(item.id===id){
            if(btnName==='up' && oldnumberUnits<5){
                oldnumberUnits++;
                
            }else if(btnName==='down' && oldnumberUnits>1){
                oldnumberUnits--;
                
            }
        }

        return {
            ...item,
            numberUnits:oldnumberUnits,
        };
    })
    updata()

}





