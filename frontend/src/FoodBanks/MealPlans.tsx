import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "../components/sidebar";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";
import { TimeAway } from "../lib/utils";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Plus,

  Package,

} from "lucide-react";
interface Donation {
  id: number;
  name: string;
  weight: number;
  status: string;
  user_id: string;
  location: string;
  expiry_date: string;
  food_type: string;
  priority: string;
  // Add more properties here as needed
  [key: string]: any; // Allow any other properties
}

interface User {
  id: string;
  user_metadata: {
    role: string;
    // Add more properties here as needed
    [key: string]: any; // Allow any other properties
  };
}

import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = "AIzaSyCkZxJra9GCBy7XDquZ9eSts8D_07JaArI";


export default function FoodBankMealPlans() {


  const navigate = useNavigate();
  interface Meal {
    meal: {
      name: string;
      cost: string;
      nutrition: {
        calories: string;
        fat: string;
      };
      ingredients: {
        name: string;
        amount: string;
      }[];
    };
  }

  const [meal, setMeal] = useState<Meal | null>(null);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  

  const getMeals = async() => {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" }); // Or another suitable Gemini model

      // Prepare the prompt
      const prompt = `Using this information about these ingredients: ${JSON.stringify(
        donations
      )} give me meal in json and ,cost excluding ingredients provided, ONLY JSON LIKE an API, JSON format: meal:{name:'name',cost:'',nutrition:[calories:'', servings:'', fat:""],ingredients:[name:"name",amount:'amount']}`;

      // Send request to Gemini API
      const response = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      });

      // Extract the JSON respo

      if (response.response && response.response.candidates && response.response.candidates.length > 0) {
        console.log("AI Response:", response.response.candidates[0].content.parts[0].text);
        const { error } = await supabase
      .from("foods")
      .insert({ json: response.response.candidates[0].content.parts[0].text ? JSON.parse(response.response.candidates[0].content.parts[0].text) : {} });

      if (error) {
        console.error("Error inserting meal data:", error);
      }
   if (response.response.candidates[0].content.parts[0].text) {
     setMeal(JSON.parse(response.response.candidates[0].content.parts[0].text));
   }
      } else {
        console.error("No candidates found in the AI response.");
      }



    
  }

  const getData = async (userDat:User) => {
    const { data, error } = await supabase
      .from("donation")
      .select()
      .eq("food_bank_id", userDat.id)
      .eq("status", "delivered");

    if (error) {
      console.error("Error fetching donations:", error);
    } else {
      setDonations(data);
      
    }
  };


  useEffect(() => {
    const fetchUser = async () => {
      const { data }:any = await supabase.auth.getUser();
      if (data.user) {

        getData(data.user);
      } else {
        navigate("/");
      }
    };

    fetchUser();
  }, [supabase.auth]);




  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const sortedDonations = donations.sort((a, b) => {
    const aTime = new Date(a.expiry_date).getTime();
    const bTime = new Date(b.expiry_date).getTime();
    if (aTime === bTime) {
      const priorityOrder = { high: 1, medium: 2, low: 3 };
      const isValidPriority = (priority: string): priority is keyof typeof priorityOrder => {
        return priority in priorityOrder;
      };
  
      if (isValidPriority(a.priority) && isValidPriority(b.priority)) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      } else {
        // Handle the case where priority is not valid (e.g., log an error)
        console.error("Invalid priority value:", a.priority, b.priority);
        return 0; // Or another appropriate default sorting behavior
      }
    }
    return aTime - bTime;
  });

  const currentDonations = sortedDonations.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(donations.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  

  return (
    <SidebarProvider>
      <div className="flex w-full h-screen overflow-scroll bg-gradient-to-br from-emerald-50 to-green-100">
        <div className="w-fit">
          <AppSidebar />
        </div>
        <div className="space-y-8 w-full h-full px-16 mt-10">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mt-10">Meal Plans</h1>
              <p className="text-muted-foreground mt-2">
                AI-powered system for optimized recipes based on inventory.
              </p>
            </div>
            <Button onClick={() => getMeals()} className="bg-primary hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" /> Generate
            </Button>
          </div>

          {/* Charts Section */}

          {/* Orders List */}
          <Card>
            <div className="p-6 space-y-4 relative">
              <h2 className="text-xl font-semibold flex items-center">
                <Package className="h-5 w-5 mr-2 text-primary" />
                Ingredients
              </h2>

              <div className="divide-y divide-border">
                {currentDonations.map((donation) => {
                  const { text, status } = TimeAway(donation.expiry_date, "Expired");
                  return (
                    <div
                      key={donation.id}
                      className="py-4 flex items-center justify-between space-x-4"
                    >
                      <div>
                        <p className="text-sm font-semibold">{donation.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {donation.food_type} - {donation.weight} oz
                        </p>
                      </div>
                      <div>
                        <p className="text-sm">{text}</p>
                        <span className="text-xs text-muted-foreground">{status}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              <div className="flex justify-end space-x-4 mt-4">
                <Button
                  variant="outline"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6 space-y-4 relative">
              <h2 className="text-xl font-semibold flex items-center">
                <Package className="h-5 w-5 mr-2 text-primary" />
                Meal Plan Suggestions
              </h2>

              <div className="divide-y divide-border">
              {meal ? (
                
    <div className="border p-4 rounded-lg">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">{meal.meal.name}</h2>
        <p className="text-sm text-muted-foreground">Cost: {meal.meal.cost}</p>
        <div className="mt-2">
          <p className="text-xs">Calories: {meal.meal.nutrition.calories}</p>
          <p className="text-xs">Fat: {meal.meal.nutrition.fat}</p>
        </div>
      </div>
      
      {/* Ingredients List */}
      {meal.meal.ingredients.map((ingredient, index) => (
        <div key={index} className="py-4 flex items-center justify-between space-x-4">
          <div>
            <p className="text-sm font-semibold">{ingredient.name}</p>
            <p className="text-xs text-muted-foreground">{ingredient.amount}</p>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <p>No ingredients available.</p>
  )}
              </div>

              {/* Pagination */}
              <div className="flex justify-end space-x-4 mt-4">
                <Button
                  variant="outline"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          </Card>
        </div>

        
      </div>
    </SidebarProvider>
  );
}