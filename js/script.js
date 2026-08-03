//array methods
//array => operations

//allages.push(56);//Appends new elements to the end of an array, and returns the new length of the array.
//allages.sort(); /*Sorts an array in place. This method mutates the array and returns a reference to the same array. */
//allages.reverse(); //Reverses the elements in an array in place. This method mutates the array and returns a reference to the same array.
//allages.unshift();//Inserts new elements at the start of an array, and returns the new length of the array.
//allages.pop();//Removes the last element from an array and returns it. If the array is empty, undefined is returned and the array is not modified.
//allages.shift();//Removes the first element from an array and returns it. If the array is empty, undefined is returned and the array is not modified.
//allages.toString();//Returns a string representation of an array
//allages.join();//A string used to separate one element of the array from the next in the resulting string. If omitted, the array elements are separated with a comma.
//allages.indexOf();//Returns the index of the first occurrence of a value in an array, or -1 if it is not present.
//allages.lastIndexOf();//Returns the index of the last occurrence of a specified value in an array, or -1 if it is not present.
//allages.slice()/*Returns a copy of a section of an array. For both start and end, a negative index can be used to indicate an offset from the end of the array. For example, -2 refers to the second to last element of the array.*/
//allages.splice(the index of the first,namber of the element ,the new elemnt u wanna insert);//most important array method
//can delete value from specified index
//can add value from specified index
//can update value from specified index



var productName = document.getElementById("pn");
var productPrice = document.getElementById("pp");
var productCategory = document.getElementById("pc");
var productImg = document.getElementById("img");
var productDescription = document.getElementById("pd");
var successMsg = document.getElementById("successMsg");
var allProducts = [];

// addNewProduct creates a new product object from the form inputs,
// adds it to the allProducts array, clears the form, and shows a success message.
function addNewProduct() {
  var staticimg = "black profile.jpg";
  if (productImg.files["0"] != undefined) {
    staticimg = productImg.files["0"].name;

  }
  var product = {
    name: productName.value,
    price: Number(productPrice.value),
    category: productCategory.value,
    img: staticimg,
    description: productDescription.value,
  };
  allProducts.push(product);
  console.log(allProducts);

  // Clear all inputs after adding product
  productName.value = "";
  productPrice.value = "";
  productCategory.value = "";
  productImg.value = "";
  productDescription.value = "";
  localStorage.setItem("allProducts",allProducts)

  
}

// display builds HTML for each product and inserts it into the page.
function display() {
  var cartona = "";
  for (let i = 0; i < allProducts.length; i++) {
    // Optional chaining with ?. avoids errors if img or img[0] is missing,
    // and || 'default.jpg' returns a fallback name when no file name exists.
    // This lets the code safely handle products without selected image files.

    cartona += `
      <div class="col-lg-2 col-md-3">
        <div class="product">
          <img class="w-100" src="./imgs/${allProducts[i].img}" alt="">
          <h5>${allProducts[i].name}</h5>
          <p>${allProducts[i].price} EGP</p>
          <p>${allProducts[i].category}</p>
          <p>${allProducts[i].description}</p>
        </div>
      </div>
    `;
  }
  document.getElementById("product").innerHTML = cartona;
}

// clr removes the last product from the array.
function clr() {
  var index = prompt("enter the order of the item u wanna delete")
  allProducts.splice((index + 1),1);
  display();
}
// ux => user experience
//any attribute in any html => u can get a value from it and u can set an value to it



//CRUD Operations
// Create  Read Upgrade Delete



// parameters => variables that ur function depends on


//Browser can store your data inside his storage 
//Browser has it is own memory(storage)

//types of storage => Cookies       session storage    local storage

//size                4KB              5-10MB            5-10MB    

//storage interval  customizable    per session         until u delete it


window.localStorage
window.sessionStorage