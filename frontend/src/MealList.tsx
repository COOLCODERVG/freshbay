import { useState } from "react";
import { supabase } from "./supabase";

const EDAMAM_APP_ID = "8a5af08c";
const EDAMAM_API_KEY = "bd4241688c706a45798487ecdcda958a";
const EDAMAM_URL = "https://api.edamam.com/api/nutrition-details";

const classifyMeal = (ingredients: string) => {
  if (/chicken|beef|pork|fish/i.test(ingredients)) return "meat";
  if (/tofu|soy|almond milk/i.test(ingredients)) return "vegan";
  if (/cheese|egg|milk/i.test(ingredients)) return "vegetarian";
  if (/corn|rice|quinoa/i.test(ingredients)) return "gluten_free";
  return "unknown";
};

const MealClassifier = () => {
  const [mealName, setMealName] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const analyzeMeal = async () => {
    if (!mealName || !ingredients) return alert("Enter meal details.");
    setLoading(true);

    const category = classifyMeal(ingredients);
    const ingrArray = ingredients.split(",").map((i) => i.trim());

    try {
      // Fetch nutrition data
      const response = await fetch(`${EDAMAM_URL}?app_id=${EDAMAM_APP_ID}&app_key=${EDAMAM_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingr: ingrArray }),
      });

      const nutritionData = await response.json();
      if (nutritionData.error) throw new Error(nutritionData.message);

      // Extract detailed nutrition info
      const ingredientAnalysis = nutritionData.ingredients.map((item: any) => ({
        text: item.text,
        weight: item.parsed[0]?.weight || 0,
        calories: item.parsed[0]?.nutrients?.ENERC_KCAL?.quantity || 0,
        protein: item.parsed[0]?.nutrients?.PROCNT?.quantity || 0,
        fat: item.parsed[0]?.nutrients?.FAT?.quantity || 0,
        carbs: item.parsed[0]?.nutrients?.CHOCDF?.quantity || 0,
        allergens: item.parsed[0]?.foodCategory || "Unknown",
      }));

      // Save to Supabase
      const { error } = await supabase
        .from("meals")
        .insert([{ name: mealName, ingredients, category, nutrition_info: ingredientAnalysis }]);

      if (error) throw new Error(error.message);

      setResult({ name: mealName, category, nutrition_info: ingredientAnalysis });
    } catch (error: any) {
      console.error("Error analyzing meal:", error.message);
      alert("Failed to analyze meal. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold">Smart Menu Insights</h2>
      <input
        type="text"
        placeholder="Meal Name"
        value={mealName}
        onChange={(e) => setMealName(e.target.value)}
        className="border p-2 rounded w-full mt-2"
      />
      <textarea
        placeholder="Enter ingredients (comma-separated)"
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
        className="border p-2 rounded w-full mt-2"
      />
      <button onClick={analyzeMeal} className="bg-blue-500 text-white p-2 rounded mt-2" disabled={loading}>
        {loading ? "Analyzing..." : "Analyze Meal"}
      </button>
      {result && (
        <div className="mt-4">
          <h3 className="font-semibold">Category: {result.category}</h3>
          <h4 className="font-bold mt-2">Ingredient Breakdown:</h4>
          <ul className="mt-2">
            {result.nutrition_info.map((item: any, index: number) => (
              <li key={index} className="p-2 border-b">
                <strong>{item.text}</strong> - {item.calories} kcal | {item.protein}g Protein | {item.fat}g Fat | {item.carbs}g Carbs
                <p className="text-sm text-gray-500">Allergen Category: {item.allergens}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MealClassifier;
