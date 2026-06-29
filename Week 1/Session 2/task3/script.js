const form = document.querySelector("#searchForm");
const input = document.querySelector("#ingredientInput");
const mealsGrid = document.querySelector("#mealsGrid");
const message = document.querySelector("#statusMessage");
const apiUrl = "https://www.themealdb.com/api/json/v1/1/filter.php?i=";

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const ingredient = input.value.trim();
  if (!ingredient) return showMessage("Please enter an ingredient.", true);

  mealsGrid.innerHTML = "";
  showMessage("Searching...");

  try {
    const response = await fetch(apiUrl + encodeURIComponent(ingredient));
    const data = await response.json();
    const meals = data.meals;

    if (!meals) {
      showMessage(`No meals found for "${ingredient}".`);
      return;
    }

    showMessage(`Found ${meals.length} meals for "${ingredient}".`);
    mealsGrid.innerHTML = meals
      .map(
        (meal) => `
          <article class="meal-card">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <h2>${meal.strMeal}</h2>
          </article>
        `
      )
      .join("");
  } catch {
    showMessage("Could not fetch meals. Please try again.", true);
  }
});

function showMessage(text, isError = false) {
  message.textContent = text;
  message.className = isError ? "status-message error" : "status-message";
}
