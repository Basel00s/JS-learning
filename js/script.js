//array methods
//array => operations
var allages = [30, 20, 10, 50, 60];
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
var productDescribtion = document.getElementById("pd");
var allProducts = [];
function addNewProduct() {
  var product = {
    name: productName.value,
    price: Number(productPrice.value),
    category: productCategory.value,
    img: productImg.value,
    describtion: productDescribtion.value,
  };
  allProducts.push(product)
  console.log(allProducts);
}

function clr() {
  productName.value = "";
  productPrice.value = "";
  productCategory.value = "";
  productImg.value = "";
  productDescribtion.value = "";
}
