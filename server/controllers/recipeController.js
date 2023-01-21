require("../models/database");
const Category = require("../models/Category");
const Recipe = require("../models/Recipe");


/**
  *GET
  *homepage
*/

exports.homepage = async(req, res) => {

  try {
    const limitNumber = 5;

    //Finding everything from Category but limiting them to a specific number by using .limit
    const categories = await Category.find({}).limit(limitNumber);
    const latest = await Recipe.find({}).sort({_id: -1}).limit(limitNumber);
    const thai = await Recipe.find({"category": "Thai"}).limit(limitNumber);
    const american = await Recipe.find({"category": "American"}).limit(limitNumber);
    const chinese = await Recipe.find({"category": "Chinese"}).limit(limitNumber);

    const food = { latest, thai, american, chinese };
    res.render("index", {title: "Cooking Blog - Home", categories, food});
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured"});
  }
}


/**
  *GET /categories
  *homepage
*/

exports.exploreCategories = async(req, res) => {
  try {
    const limitNumber = 6;

    //Finding everything from Category but limiting them to a specific number by using .limit
    const categories = await Category.find({}).limit(limitNumber);

    res.render("categories", {title: "Cooking Blog - categories", categories});
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured"});
  }
}



/**
  *GET /categories/id
  *homepage
*/

exports.exploreCategoriesById = async(req, res) => {
  try {
    let categoryId = req.params.id;
    const limitNumber = 20;
    const categoryById = await Recipe.find({ 'category': categoryId }).limit(limitNumber);
    res.render('categories', { title: 'Cooking Blog - Categoreis', categoryById } );
  } catch (error) {
    res.satus(500).send({message: error.message || "Error Occured" });
  }
}


/**
  *GET /explore-latest
  *homepage
*/
exports.exploreLatest = async(req, res) => {
  try {
    const limitNumber = 20;
    const recipe = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);
    res.render('explore-latest', { title: 'Cooking Blog - Explore Latest', recipe } );
  } catch (error) {
    res.satus(500).send({message: error.message || "Error Occured" });
  }
}

/**
  *GET /explore-random
  *homepage
*/
exports.exploreRandom = async(req, res) => {
  try {
    let count = await Recipe.find().countDocuments();
    let random = Math.floor(Math.random() * count);
    let recipe = await Recipe.findOne().skip(random).exec();

    res.render('explore-random', { title: 'Cooking Blog - Explore Random', recipe } );
  } catch (error) {
    res.satus(500).send({message: error.message || "Error Occured" });
  }
}

/**
  *GET /recipe/:id
  *homepage
*/

exports.exploreRecipe = async(req, res) => {
  try {
    let recipeId = req.params.id;
    const recipe = await Recipe.findById(recipeId);

    res.render("recipe", {title: "Cooking Blog - Recipe", recipe});
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured"});
  }
}

/**
  *GET /search
  *search
*/

exports.searchRecipe = async(req, res) => {

  try{
    let searchTerm = req.body.searchTerm;

    let recipe = await Recipe.find({ $text: { $search: searchTerm, $diacriticSensitive:   true } });
  res.render("search", {title: "Cooking Blog - Recipe", recipe});
  }catch(error){
    res.status(500).send({message: error.message || "Error Occured"});
  }
}

/**
  *GET /submitRecipe
  *submit-recipe
*/

exports.submitRecipe = async(req, res) => {
  const infoErrorObj = req.flash("infoError");
  const infoSubmitObj = req.flash("infoSubmit");

  res.render("submit-recipe", {title: "Cooking Blog - Recipe", infoErrorObj,infoSubmitObj});
}


/**
  *POST /submitRecipe
  *submit-recipe
*/


exports.submitRecipeOnPost = async(req, res) => {
  try {

    let imageUploadFile;
    let uploadPath;
    let newImageName;

    if(!req.files || Object.keys(req.files).length === 0){
      console.log('No Files where uploaded.');
    } else {

      imageUploadFile = req.files.image;
      newImageName = Date.now() + imageUploadFile.name;

      uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;

      imageUploadFile.mv(uploadPath, function(err){
        if(err) return res.satus(500).send(err);
      })

    }

    const newRecipe = new Recipe({
      name: req.body.name,
      description: req.body.description,
      email: req.body.email,
      ingredients: req.body.ingredients,
      category: req.body.category,
      image: newImageName
    });

    await newRecipe.save();

    req.flash('infoSubmit', 'Recipe has been added.')
    res.redirect('/submit-recipe');
  } catch (error) {
    // res.json(error);
    req.flash('infoErrors', error);
    res.redirect('/submit-recipe');
  }
}




// Query to update a recipe
//
// async function updateRecipe(){
//   try{
//     const res = await Recipe.updateOne({name:"Chocolate-Brownie"}, {name: "Dark-Chocolate-Brownie"});
//     res.n;
//     res.nModified;
//   }catch(error){
//     console.log(error);
//   }
// }
//
// updateRecipe();


//Query to delete a recipes
// async function deleteRecipe(){
//   try{
//     await Recipe.deleteOne({name:"Chinese-pinch-salad"});
//   }catch(error){
//     console.log(error);
//   }
// }
//
// deleteRecipe();



/**
  *GET /contact
  *contact
*/
exports.contact = async(req, res) => {
  try {
    res.render('contact', { title: 'Cooking-Blog - Contact'} );
  } catch (error) {
    res.satus(500).send({message: error.message || "Error Occured" });
  }
}


/**
  *GET /about
  *about
*/
exports.about = async(req, res) => {
  try {
    res.render('about', { title: 'Cooking-Blog - About'} );
  } catch (error) {
    res.satus(500).send({message: error.message || "Error Occured" });
  }
}



// Dummy Category data for mongoDB

// async function insertDummyCategoryData(){
//   try{
//     await Category.insertMany([
//           {
//             "name": "Thai",
//             "image": "thai-food.jpg"
//           },
//           {
//             "name": "American",
//             "image": "american-food.jpg"
//           },
//           {
//             "name": "Chinese",
//             "image": "chinese-food.jpg"
//           },
//           {
//             "name": "Mexican",
//             "image": "mexican-food.jpg"
//           },
//           {
//             "name": "Indian",
//             "image": "indian-food.jpg"
//           },
//           {
//             "name": "Spanish",
//             "image": "spanish-food.jpg"
//           }
//         ]);
//   }catch(error){
//     console.log("err", + error);
//   }
// }
//
// insertDummyCategoryData();


// Dummy Recipe Data for mongoDB


//
// async function insertDummyRecipeData(){
//   try {
//     await Recipe.insertMany([
//       {
//         "name": "chinese-steak-tofu-stew",
//         "description": `Recipe Description Goes Here`,
//         "email": "doodloorestaurant@business.com",
//         "ingredients": [
//           "1 level teaspoon baking powder",
//           "1 level teaspoon cayenne pepper",
//           "1 level teaspoon hot smoked paprika",
//         ],
//         "category": "American",
//         "image": "chinese-steak-tofu-stew.jpg"
//       },
//       {
//         "name": "chocolate-banoffe-whoopie-pies",
//         "description": `Recipe Description Goes Here`,
//         "email": "doodloorestaurant@business.com",
//         "ingredients": [
//           "1 level teaspoon baking powder",
//           "1 level teaspoon cayenne pepper",
//           "1 level teaspoon hot smoked paprika",
//         ],
//         "category": "American",
//         "image": "chocolate-banoffe-whoopie-pies.jpg"
//       },
//       {
//         "name": "crab-cakes",
//         "description": `Recipe Description Goes Here`,
//         "email": "doodloorestaurant@business.com",
//         "ingredients": [
//           "1 level teaspoon baking powder",
//           "1 level teaspoon cayenne pepper",
//           "1 level teaspoon hot smoked paprika",
//         ],
//         "category": "American",
//         "image": "crab-cakes.jpg"
//       },
//       {
//         "name": "grilled-lobster-rolls",
//         "description": `Recipe Description Goes Here`,
//         "email": "doodloorestaurant@business.com",
//         "ingredients": [
//           "1 level teaspoon baking powder",
//           "1 level teaspoon cayenne pepper",
//           "1 level teaspoon hot smoked paprika",
//         ],
//         "category": "American",
//         "image": "grilled-lobster-rolls.jpg"
//       },
//       {
//         "name": "key-lime-pie",
//         "description": `Recipe Description Goes Here`,
//         "email": "doodloorestaurant@business.com",
//         "ingredients": [
//           "1 level teaspoon baking powder",
//           "1 level teaspoon cayenne pepper",
//           "1 level teaspoon hot smoked paprika",
//         ],
//         "category": "American",
//         "image": "key-lime-pie.jpg"
//       },
//       {
//         "name": "southern-friend-chicken",
//         "description": `Recipe Description Goes Here`,
//         "email": "doodloorestaurant@business.com",
//         "ingredients": [
//           "1 level teaspoon baking powder",
//           "1 level teaspoon cayenne pepper",
//           "1 level teaspoon hot smoked paprika",
//         ],
//         "category": "American",
//         "image": "southern-friend-chicken.jpg"
//       },
//       {
//         "name": "spring-rolls",
//         "description": `Recipe Description Goes Here`,
//         "email": "doodloorestaurant@business.com",
//         "ingredients": [
//           "1 level teaspoon baking powder",
//           "1 level teaspoon cayenne pepper",
//           "1 level teaspoon hot smoked paprika",
//         ],
//         "category": "American",
//         "image": "spring-rolls.jpg"
//       },
//       {
//         "name": "stir-fried-vegetables",
//         "description": `Recipe Description Goes Here`,
//         "email": "doodloorestaurant@business.com",
//         "ingredients": [
//           "1 level teaspoon baking powder",
//           "1 level teaspoon cayenne pepper",
//           "1 level teaspoon hot smoked paprika",
//         ],
//         "category": "American",
//         "image": "stir-fried-vegetables.jpg"
//       },
//       {
//         "name": "thai-chinese-inspired-pinch-salad",
//         "description": `Recipe Description Goes Here`,
//         "email": "doodloorestaurant@business.com",
//         "ingredients": [
//           "1 level teaspoon baking powder",
//           "1 level teaspoon cayenne pepper",
//           "1 level teaspoon hot smoked paprika",
//         ],
//         "category": "American",
//         "image": "thai-chinese-inspired-pinch-salad.jpg"
//       },
//       {
//         "name": "thai-green-curry",
//         "description": `Recipe Description Goes Here`,
//         "email": "doodloorestaurant@business.com",
//         "ingredients": [
//           "1 level teaspoon baking powder",
//           "1 level teaspoon cayenne pepper",
//           "1 level teaspoon hot smoked paprika",
//         ],
//         "category": "American",
//         "image": "thai-green-curry.jpg"
//       },
//       {
//         "name": "thai-inspired-vegetable-broth",
//         "description": `Recipe Description Goes Here`,
//         "email": "doodloorestaurant@business.com",
//         "ingredients": [
//           "1 level teaspoon baking powder",
//           "1 level teaspoon cayenne pepper",
//           "1 level teaspoon hot smoked paprika",
//         ],
//         "category": "American",
//         "image": "thai-inspired-vegetable-broth.jpg"
//       },
//       {
//         "name": "thai-red-chicken-soup",
//         "description": `Recipe Description Goes Here`,
//         "email": "doodloorestaurant@business.com",
//         "ingredients": [
//           "1 level teaspoon baking powder",
//           "1 level teaspoon cayenne pepper",
//           "1 level teaspoon hot smoked paprika",
//         ],
//         "category": "American",
//         "image": "thai-red-chicken-soup.jpg"
//       },
//       {
//         "name": "thai-style-mussels",
//         "description": `Recipe Description Goes Here`,
//         "email": "doodloorestaurant@business.com",
//         "ingredients": [
//           "1 level teaspoon baking powder",
//           "1 level teaspoon cayenne pepper",
//           "1 level teaspoon hot smoked paprika",
//         ],
//         "category": "American",
//         "image": "thai-style-mussels.jpg"
//       },
//       {
//         "name": "tom-daley",
//         "description": `Recipe Description Goes Here`,
//         "email": "doodloorestaurant@business.com",
//         "ingredients": [
//           "1 level teaspoon baking powder",
//           "1 level teaspoon cayenne pepper",
//           "1 level teaspoon hot smoked paprika",
//         ],
//         "category": "American",
//         "image": "tom-daley.jpg"
//       },
//       {
//         "name": "veggie-pad-thai",
//         "description": `Recipe Description Goes Here`,
//         "email": "doodloorestaurant@business.com",
//         "ingredients": [
//           "1 level teaspoon baking powder",
//           "1 level teaspoon cayenne pepper",
//           "1 level teaspoon hot smoked paprika",
//         ],
//         "category": "American",
//         "image": "veggie-pad-thai.jpg"
//       },
//     ]);
//   } catch (error) {
//     console.log('err', + error)
//   }
// }
//
// insertDummyRecipeData();
