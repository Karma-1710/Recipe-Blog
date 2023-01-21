let addIngredientsBtn = document.getElementById("addIngredientsBtn");
let ingredientList = document.querySelector(".ingredientList");
let ingredientsDiv = document.querySelectorAll(".ingredientsDiv")[0];

addIngredientsBtn.addEventListener("click", function(){

  //clones all the properties and attributes of ingredientsDiv
  let newIngredients = ingredientsDiv.cloneNode(true);

  //it gets the elements of <input> tag name & it gets the topmost element using [0]
  let input = newIngredients.getElementsByTagName("input")[0];

  //assigns value to the new input textarea that is formed
  input.value = '';

  // it helps append a node(element) as the last child, it appends a empty input area to the end of ingredientList
  ingredientList.appendChild(newIngredients);
});
