"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Clock } from "lucide-react"

// Nigerian food database
const nigerianFoods = [
  // Staples
  {
    id: 1,
    name: "Jollof Rice",
    category: "Staples",
    calories: 180,
    protein: 4,
    carbs: 35,
    fat: 3,
    fiber: 1,
    iron: 1.2,
    vitaminA: 50,
    serving: "1 cup",
  },
  {
    id: 2,
    name: "Pounded Yam",
    category: "Staples",
    calories: 120,
    protein: 2,
    carbs: 28,
    fat: 0.2,
    fiber: 2,
    iron: 0.8,
    vitaminA: 10,
    serving: "1 medium portion",
  },
  {
    id: 3,
    name: "Eba (Garri)",
    category: "Staples",
    calories: 160,
    protein: 1,
    carbs: 38,
    fat: 0.5,
    fiber: 1.5,
    iron: 0.5,
    vitaminA: 5,
    serving: "1 cup",
  },
  {
    id: 4,
    name: "Amala",
    category: "Staples",
    calories: 140,
    protein: 2.5,
    carbs: 32,
    fat: 0.3,
    fiber: 3,
    iron: 1.5,
    vitaminA: 15,
    serving: "1 medium portion",
  },
  {
    id: 5,
    name: "White Rice",
    category: "Staples",
    calories: 150,
    protein: 3,
    carbs: 33,
    fat: 0.3,
    fiber: 0.5,
    iron: 0.8,
    vitaminA: 0,
    serving: "1 cup",
  },

  // Proteins
  {
    id: 6,
    name: "Grilled Tilapia",
    category: "Proteins",
    calories: 180,
    protein: 35,
    carbs: 0,
    fat: 4,
    fiber: 0,
    iron: 1.2,
    vitaminA: 20,
    serving: "1 medium fish",
  },
  {
    id: 7,
    name: "Chicken (Grilled)",
    category: "Proteins",
    calories: 220,
    protein: 40,
    carbs: 0,
    fat: 6,
    fiber: 0,
    iron: 1.5,
    vitaminA: 15,
    serving: "1 piece",
  },
  {
    id: 8,
    name: "Beef (Lean)",
    category: "Proteins",
    calories: 250,
    protein: 35,
    carbs: 0,
    fat: 12,
    fiber: 0,
    iron: 3.5,
    vitaminA: 0,
    serving: "100g",
  },
  {
    id: 9,
    name: "Akara (Bean Cakes)",
    category: "Proteins",
    calories: 120,
    protein: 8,
    carbs: 10,
    fat: 6,
    fiber: 4,
    iron: 2.2,
    vitaminA: 5,
    serving: "3 pieces",
  },
  {
    id: 10,
    name: "Moin Moin",
    category: "Proteins",
    calories: 140,
    protein: 12,
    carbs: 8,
    fat: 7,
    fiber: 5,
    iron: 2.8,
    vitaminA: 25,
    serving: "1 wrap",
  },

  // Soups & Stews
  {
    id: 11,
    name: "Egusi Soup",
    category: "Soups",
    calories: 200,
    protein: 15,
    carbs: 8,
    fat: 14,
    fiber: 3,
    iron: 3.2,
    vitaminA: 180,
    serving: "1 bowl",
  },
  {
    id: 12,
    name: "Okra Soup",
    category: "Soups",
    calories: 150,
    protein: 12,
    carbs: 6,
    fat: 10,
    fiber: 4,
    iron: 2.5,
    vitaminA: 120,
    serving: "1 bowl",
  },
  {
    id: 13,
    name: "Vegetable Soup (Efo)",
    category: "Soups",
    calories: 130,
    protein: 10,
    carbs: 5,
    fat: 8,
    fiber: 5,
    iron: 4.2,
    vitaminA: 250,
    serving: "1 bowl",
  },
  {
    id: 14,
    name: "Pepper Soup",
    category: "Soups",
    calories: 100,
    protein: 18,
    carbs: 3,
    fat: 2,
    fiber: 1,
    iron: 1.8,
    vitaminA: 30,
    serving: "1 bowl",
  },

  // Vegetables & Sides
  {
    id: 15,
    name: "Fried Plantain",
    category: "Sides",
    calories: 180,
    protein: 2,
    carbs: 35,
    fat: 6,
    fiber: 3,
    iron: 0.8,
    vitaminA: 80,
    serving: "1 medium plantain",
  },
  {
    id: 16,
    name: "Boiled Plantain",
    category: "Sides",
    calories: 120,
    protein: 1.5,
    carbs: 30,
    fat: 0.5,
    fiber: 2.5,
    iron: 0.6,
    vitaminA: 60,
    serving: "1 medium plantain",
  },
  {
    id: 17,
    name: "Ugwu (Fluted Pumpkin)",
    category: "Vegetables",
    calories: 25,
    protein: 3,
    carbs: 4,
    fat: 0.2,
    fiber: 2,
    iron: 2.8,
    vitaminA: 200,
    serving: "1 cup cooked",
  },
  {
    id: 18,
    name: "Waterleaf",
    category: "Vegetables",
    calories: 20,
    protein: 2.5,
    carbs: 3,
    fat: 0.1,
    fiber: 1.5,
    iron: 3.5,
    vitaminA: 150,
    serving: "1 cup cooked",
  },

  // Breakfast Items
  {
    id: 19,
    name: "Akamu (Pap)",
    category: "Breakfast",
    calories: 80,
    protein: 2,
    carbs: 18,
    fat: 0.5,
    fiber: 1,
    iron: 0.5,
    vitaminA: 10,
    serving: "1 cup",
  },
  {
    id: 20,
    name: "Bread (Agege)",
    category: "Breakfast",
    calories: 120,
    protein: 4,
    carbs: 22,
    fat: 2,
    fiber: 1,
    iron: 1.2,
    vitaminA: 0,
    serving: "2 slices",
  },
  {
    id: 21,
    name: "Yam (Boiled)",
    category: "Breakfast",
    calories: 140,
    protein: 2,
    carbs: 32,
    fat: 0.2,
    fiber: 4,
    iron: 0.8,
    vitaminA: 15,
    serving: "1 medium tuber",
  },

  // Fruits
  {
    id: 22,
    name: "Orange",
    category: "Fruits",
    calories: 60,
    protein: 1,
    carbs: 15,
    fat: 0.2,
    fiber: 3,
    iron: 0.2,
    vitaminA: 15,
    serving: "1 medium",
  },
  {
    id: 23,
    name: "Banana",
    category: "Fruits",
    calories: 90,
    protein: 1,
    carbs: 23,
    fat: 0.3,
    fiber: 2.5,
    iron: 0.3,
    vitaminA: 10,
    serving: "1 medium",
  },
  {
    id: 24,
    name: "Pineapple",
    category: "Fruits",
    calories: 50,
    protein: 0.5,
    carbs: 13,
    fat: 0.1,
    fiber: 1.5,
    iron: 0.3,
    vitaminA: 5,
    serving: "1 cup chunks",
  },
  {
    id: 25,
    name: "Pawpaw (Papaya)",
    category: "Fruits",
    calories: 40,
    protein: 0.5,
    carbs: 10,
    fat: 0.1,
    fiber: 2,
    iron: 0.2,
    vitaminA: 180,
    serving: "1 cup chunks",
  },
]

export default function FoodLogger() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMeal, setSelectedMeal] = useState("breakfast")
  const [selectedFoods, setSelectedFoods] = useState<any[]>([])
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({})

  const filteredFoods = nigerianFoods.filter(
    (food) =>
      food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      food.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const addFood = (food: any) => {
    const quantity = quantities[food.id] || 1
    const existingIndex = selectedFoods.findIndex((f) => f.id === food.id)

    if (existingIndex >= 0) {
      const updated = [...selectedFoods]
      updated[existingIndex] = { ...food, quantity: updated[existingIndex].quantity + quantity }
      setSelectedFoods(updated)
    } else {
      setSelectedFoods([...selectedFoods, { ...food, quantity }])
    }

    setQuantities({ ...quantities, [food.id]: 1 })
  }

  const removeFood = (foodId: number) => {
    setSelectedFoods(selectedFoods.filter((f) => f.id !== foodId))
  }

  const totalCalories = selectedFoods.reduce((sum, food) => sum + food.calories * food.quantity, 0)
  const totalProtein = selectedFoods.reduce((sum, food) => sum + food.protein * food.quantity, 0)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-green-600" />
            Log Your Meal
          </CardTitle>
          <CardDescription>Track your Nigerian meals and get personalized nutrition insights</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="meal-type">Meal Type</Label>
              <Select value={selectedMeal} onValueChange={setSelectedMeal}>
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
                  placeholder="Search for jollof rice, egusi, akara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Food Search Results */}
        <Card>
          <CardHeader>
            <CardTitle>Nigerian Food Database</CardTitle>
            <CardDescription>{filteredFoods.length} foods found</CardDescription>
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
                    <p className="text-xs text-muted-foreground">
                      {food.calories} cal, {food.protein}g protein per {food.serving}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min="0.5"
                      step="0.5"
                      value={quantities[food.id] || 1}
                      onChange={(e) =>
                        setQuantities({
                          ...quantities,
                          [food.id]: Number.parseFloat(e.target.value) || 1,
                        })
                      }
                      className="w-16 h-8 text-xs"
                    />
                    <Button size="sm" onClick={() => addFood(food)} className="h-8 px-2">
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
              {selectedMeal.charAt(0).toUpperCase() + selectedMeal.slice(1)} Items
            </CardTitle>
            <CardDescription>
              Total: {totalCalories.toFixed(0)} calories, {totalProtein.toFixed(1)}g protein
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedFoods.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No foods selected yet. Search and add Nigerian foods above.
              </p>
            ) : (
              <div className="space-y-3">
                {selectedFoods.map((food) => (
                  <div key={food.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{food.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {food.quantity} × {food.serving} = {(food.calories * food.quantity).toFixed(0)} cal
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFood(food.id)}
                      className="h-8 px-2 text-red-600 hover:text-red-700"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button className="w-full mt-4 bg-green-600 hover:bg-green-700">
                  Log {selectedMeal.charAt(0).toUpperCase() + selectedMeal.slice(1)}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
