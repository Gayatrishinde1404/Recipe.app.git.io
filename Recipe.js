const searchBtn = document.getElementById('search-btn');
const mealList = document.getElementById('meal');
const mealDetailsContent = document.querySelector('.meal-details-content');
const recipeCloseBtn = document.getElementById('recipe-close-btn');

// Event listeners
searchBtn.addEventListener('click', getMealList);
mealList.addEventListener('click', getMealRecipe);
recipeCloseBtn.addEventListener('click', () => {
    mealDetailsContent.parentElement.classList.remove('showRecipe');
});

// Fetch meal list based on ingredients
function getMealList() {
    const searchInputText = document.getElementById('search-input').value.trim();
    
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInputText}`)
        .then(response => response.json())
        .then(data => {
            if (data.meals) {
                mealList.innerHTML = data.meals.map(meal => `
                    <div class="meal-item" data-id="${meal.idMeal}">
                        <div class="meal-img">
                            <img src="${meal.strMealThumb}" alt="food">
                        </div>
                        <div class="meal-name">
                            <h3>${meal.strMeal}</h3>
                            <a href="#" class="recipe-btn">Get Recipe</a>
                        </div>
                    </div>
                `).join('');
                mealList.classList.remove('notFound');
            } else {
                mealList.innerHTML = "Sorry, We didn't find any meal :(";
                mealList.classList.add('notFound');
            }
        })
        .catch(error => console.error('Error fetching meal list:', error));
}

// Fetch recipe of the selected meal
function getMealRecipe(e) {
    e.preventDefault();
    if (e.target.classList.contains('recipe-btn')) {
        const mealItem = e.target.closest('.meal-item'); // More efficient way to find parent
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`)
            .then(response => response.json())
            .then(data => mealRecipeModel(data.meals[0])) // Directly passing the first meal
            .catch(error => console.error('Error fetching meal recipe:', error));
    }
}

// Create a modal with meal details
function mealRecipeModel(meal) {
    let ingredientsHtml = '';

    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        if (ingredient) {
            ingredientsHtml += `<li>${ingredient} - ${measure}</li>`;
        }
    }

    mealDetailsContent.innerHTML = `
        <h2 class="recipe-title">${meal.strMeal}</h2>
        <p class="recipe-category">${meal.strCategory}</p>
        <div class="recipe-instruct">
            <h3>Instructions:</h3>
            <p>${meal.strInstructions}</p>
        </div>
        <div class="recipe-meal-img">
            <img src="${meal.strMealThumb}" alt="">
        </div>
        <div class="recipe-ingredients">
            <h3>Ingredients:</h3>
            <ul>${ingredientsHtml}</ul>
        </div>
        <div class="recipe-link">
            <a href="${meal.strYoutube}" target="_blank">Watch Video</a>
        </div>
    `;

    mealDetailsContent.parentElement.classList.add('showRecipe');
}
