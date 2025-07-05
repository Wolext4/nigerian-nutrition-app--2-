"use client"

import { useState } from "react"
import { useAuth } from "../contexts/auth-context"
import { useMeals } from "../hooks/use-meals"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { nigerianFoods, searchFoods, type NigerianFood } from "../data/nigerian-foods"
import { calculateNutrition } from "../utils/calculations"
import { Search, Plus, Trash2, Clock, CheckCircle, AlertCircle } from "lucide-react"

interface SelectedFood {
  food: NigerianFood
  grams: number
  nutrition: ReturnType<typeof calculateNutrition>
}

// Add this prop to the component
interface MealLoggerProps {
  onMealLogged?: () => void
}

export default function MealLogger({ onMealLogged }: MealLoggerProps = {}) {
  const { user } = useAuth()
  const today = new Date().toISOString().split("T")[0]
  const { addMeal } = useMeals(today)

  const [mealType, setMealType] = useState<"breakfast" | "lunch" | "dinner" | "snack">("breakfast")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFoods, setSelectedFoods] = useState<SelectedFood[]>([])
  const [portionSizes, setPortionSizes] = useState<{ [key: string]: number }>({})
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  if (!user) return null

  const filteredFoods = searchTerm ? searchFoods(searchTerm) : nigerianFoods

  const addFood = (food: NigerianFood) => {
    const grams = portionSizes[food.id] || 100
    const nutrition = calculateNutrition(
      food.calories,
      food.protein,
      food.carbs,
      food.fats,
      food.fiber,
      food.iron,
      food.vitaminA,
      grams,
    )

    const existingIndex = selectedFoods.findIndex((sf) => sf.food.id === food.id)
    if (existingIndex >= 0) {
      const updated = [...selectedFoods]
      updated[existingIndex] = { food, grams, nutrition }
      setSelectedFoods(updated)
    } else {
      setSelectedFoods([...selectedFoods, { food, grams, nutrition }])
    }

    // Reset portion size
    setPortionSizes({ ...portionSizes, [food.id]: 100 })
  }

  const removeFood = (foodId: string) => {
    setSelectedFoods(selectedFoods.filter((sf) => sf.food.id !== foodId))
  }

  const saveMeal = async () => {
    if (selectedFoods.length === 0) {
      setMessage({ type: "error", text: "Please add at least one food item" })
      return
    }

    setIsLoading(true)
    setMessage(null)

    const currentTime = new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })

    const mealData = {
      type: mealType,
      date: today,
      time: currentTime,
      foods: selectedFoods.map((sf) => ({
        id: sf.food.id,
        name: sf.food.name,
        grams: sf.grams,
        nutrition: sf.nutrition,
      })),
    }

    const result = await addMeal(mealData)

    if (result.success) {
      setSelectedFoods([])
      setSearchTerm("")
      setMessage({ type: "success", text: "Meal logged successfully!" })

      // Call the callback to refresh dashboard
      if (onMealLogged) {
        onMealLogged()
      }

      // Clear success message after 3 seconds
      setTimeout(() => setMessage(null), 3000)
    } else {
      setMessage({ type: "error", text: result.error || "Failed to log meal" })
    }

    setIsLoading(false)
  }

  const totalNutrition = selectedFoods.reduce(
    (total, sf) => ({
      calories: total.calories + sf.nutrition.calories,
      protein: total.protein + sf.nutrition.protein,
      carbs: total.carbs + sf.nutrition.carbs,
      fats: total.fats + sf.nutrition.fats,
      fiber: total.fiber + sf.nutrition.fiber,
      iron: total.iron + sf.nutrition.iron,
      vitaminA: total.vitaminA + sf.nutrition.vitaminA,
    }),
    { calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0, iron: 0, vitaminA: 0 },
  )

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-green-600" />
            Log Your Meal
          </CardTitle>
          <CardDescription>Track your Nigerian meals and monitor your nutrition</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="meal-type">Meal Type</Label>
              <Select value={mealType} onValueChange={(value: any) => setMealType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="breakfast">Breakfast</SelectItem>
                  <SelectItem value="lunch">Lunch</SelectItem>
                  <SelectItem value="dinner">Dinner</SelectItem>
                  <SelectItem value="snack">Snack</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="search">Search Nigerian Foods</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search for jollof rice, egusi, suya..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {message && (
            <div
              className={`flex items-center gap-2 p-3 rounded-lg ${
                message.type === "success"
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {message.type === "success" ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              {message.text}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Food Search Results */}
        <Card>
          <CardHeader>
            <CardTitle>Nigerian Food Database</CardTitle>
            <CardDescription>{filteredFoods.length} foods available</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredFoods.map((food) => (
                <div key={food.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-sm">{food.name}</h4>
                      <Badge variant="outline" className="text-xs">
                        {food.category}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      {food.calories} cal, {food.protein}g protein per 100g
                    </p>
                    <p className="text-xs text-muted-foreground">{food.description}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <div className="space-y-1">
                      <Input
                        type="number"
                        min="10"
                        step="10"
                        value={portionSizes[food.id] || 100}
                        onChange={(e) =>
                          setPortionSizes({
                            ...portionSizes,
                            [food.id]: Number.parseInt(e.target.value) || 100,
                          })
                        }
                        className="w-16 h-8 text-xs"
                      />
                      <p className="text-xs text-center text-muted-foreground">grams</p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => addFood(food)}
                      className="h-8 px-2 bg-green-600 hover:bg-green-700"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Selected Foods */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-600" />
              {mealType.charAt(0).toUpperCase() + mealType.slice(1)} Items
            </CardTitle>
            <CardDescription>
              Total: {totalNutrition.calories.toFixed(0)} calories, {totalNutrition.protein.toFixed(1)}g protein
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedFoods.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No foods selected yet. Search and add Nigerian foods from the left panel.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedFoods.map((sf) => (
                  <div key={sf.food.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{sf.food.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {sf.grams}g = {sf.nutrition.calories.toFixed(0)} cal, {sf.nutrition.protein.toFixed(1)}g protein
                      </p>
                      <div className="flex gap-4 text-xs text-muted-foreground mt-1">
                        <span>Carbs: {sf.nutrition.carbs.toFixed(1)}g</span>
                        <span>Fats: {sf.nutrition.fats.toFixed(1)}g</span>
                        <span>Fiber: {sf.nutrition.fiber.toFixed(1)}g</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFood(sf.food.id)}
                      className="h-8 px-2 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}

                {/* Nutrition Summary */}
                <div className="border-t pt-3 mt-4">
                  <h4 className="font-medium mb-2">Meal Summary</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      Calories: <span className="font-medium">{totalNutrition.calories.toFixed(0)}</span>
                    </div>
                    <div>
                      Protein: <span className="font-medium">{totalNutrition.protein.toFixed(1)}g</span>
                    </div>
                    <div>
                      Carbs: <span className="font-medium">{totalNutrition.carbs.toFixed(1)}g</span>
                    </div>
                    <div>
                      Fats: <span className="font-medium">{totalNutrition.fats.toFixed(1)}g</span>
                    </div>
                    <div>
                      Fiber: <span className="font-medium">{totalNutrition.fiber.toFixed(1)}g</span>
                    </div>
                    <div>
                      Iron: <span className="font-medium">{totalNutrition.iron.toFixed(1)}mg</span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={saveMeal}
                  className="w-full mt-4 bg-green-600 hover:bg-green-700"
                  disabled={selectedFoods.length === 0 || isLoading}
                >
                  {isLoading ? "Logging..." : `Log ${mealType.charAt(0).toUpperCase() + mealType.slice(1)}`}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
