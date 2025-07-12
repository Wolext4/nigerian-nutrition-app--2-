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
import { Search, Plus, Trash2, Clock, CheckCircle, AlertCircle, Bluetooth, Scale, Wifi, Minus } from "lucide-react"
import { Switch } from "@/components/ui/switch"

interface SelectedFood {
  food: NigerianFood
  grams: number
  portions: number
  nutrition: ReturnType<typeof calculateNutrition>
}

interface IoTScale {
  id: string
  name: string
  type: "bluetooth" | "wifi"
  batteryLevel?: number
  isConnected: boolean
  signal?: number
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
  const [gramAmounts, setGramAmounts] = useState<{ [key: string]: number }>({})
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  // IoT Scale states - portions are default, grams when scale is enabled
  const [useIoTScale, setUseIoTScale] = useState(false)
  const [scaleWeight, setScaleWeight] = useState(0)
  const [selectedScale, setSelectedScale] = useState<IoTScale | null>(null)
  const [showScaleEditor, setShowScaleEditor] = useState(false)
  const [showScaleSelection, setShowScaleSelection] = useState(false)
  const [isScanning, setIsScanning] = useState(false)

  // Mock available scales
  const [availableScales] = useState<IoTScale[]>([
    {
      id: "scale-1",
      name: "Kitchen Pro Scale",
      type: "bluetooth",
      batteryLevel: 85,
      isConnected: false,
      signal: 4,
    },
    {
      id: "scale-2",
      name: "Smart Scale X1",
      type: "wifi",
      isConnected: false,
      signal: 3,
    },
    {
      id: "scale-3",
      name: "NutriScale 2000",
      type: "bluetooth",
      batteryLevel: 42,
      isConnected: false,
      signal: 5,
    },
    {
      id: "scale-4",
      name: "Digital Food Scale",
      type: "bluetooth",
      batteryLevel: 91,
      isConnected: false,
      signal: 2,
    },
  ])

  if (!user) return null

  const filteredFoods = searchTerm ? searchFoods(searchTerm) : nigerianFoods

  const addFoodPortion = (food: NigerianFood) => {
    let grams: number
    let portions: number

    if (useIoTScale && selectedScale) {
      // IoT scale mode uses direct gram input
      grams = gramAmounts[food.id] || 100
      portions = grams / food.servingWeight
    } else {
      // Default portion mode - add 1 portions each time
      const existingFood = selectedFoods.find((sf) => sf.food.id === food.id)
      portions = existingFood ? existingFood.portions + 1 : 1
      grams = food.servingWeight * portions
    }

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
      updated[existingIndex] = { food, grams, portions, nutrition }
      setSelectedFoods(updated)
    } else {
      setSelectedFoods([...selectedFoods, { food, grams, portions, nutrition }])
    }
  }

  const removeFoodPortion = (foodId: string) => {
    const existingFood = selectedFoods.find((sf) => sf.food.id === foodId)
    if (!existingFood) return

    if (existingFood.portions <= 1) {
      // Remove the food entirely if it's the last portion
      setSelectedFoods(selectedFoods.filter((sf) => sf.food.id !== foodId))
    } else {
      // Reduce by 1 portions
      const newPortions = existingFood.portions - 1
      const newGrams = existingFood.food.servingWeight * newPortions
      const newNutrition = calculateNutrition(
        existingFood.food.calories,
        existingFood.food.protein,
        existingFood.food.carbs,
        existingFood.food.fats,
        existingFood.food.fiber,
        existingFood.food.iron,
        existingFood.food.vitaminA,
        newGrams,
      )

      const updated = [...selectedFoods]
      const index = updated.findIndex((sf) => sf.food.id === foodId)
      updated[index] = {
        food: existingFood.food,
        grams: newGrams,
        portions: newPortions,
        nutrition: newNutrition,
      }
      setSelectedFoods(updated)
    }
  }

  const removeFood = (foodId: string) => {
    setSelectedFoods(selectedFoods.filter((sf) => sf.food.id !== foodId))
  }

  const connectToScale = (scale: IoTScale) => {
    setSelectedScale({ ...scale, isConnected: true })
    setScaleWeight(0)
    setShowScaleSelection(false)
    setMessage({ type: "success", text: `Connected to ${scale.name}!` })
    setTimeout(() => setMessage(null), 3000)
  }

  const disconnectScale = () => {
    setSelectedScale(null)
    setScaleWeight(0)
    setUseIoTScale(false)
  }

  const scanForScales = () => {
    setIsScanning(true)
    // Simulate scanning delay
    setTimeout(() => {
      setIsScanning(false)
      setMessage({ type: "success", text: `Found ${availableScales.length} scales` })
      setTimeout(() => setMessage(null), 2000)
    }, 2000)
  }

  const simulateScaleReading = () => {
    if (!selectedScale) return
    // Simulate getting weight from IoT scale
    const randomWeight = Math.floor(Math.random() * 500) + 50 // 50-550g
    setScaleWeight(randomWeight)
  }

  const updateScaleWeight = (newWeight: number) => {
    setScaleWeight(newWeight)
    setShowScaleEditor(false)
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
      setGramAmounts({})
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
            <Plus className="h-5 w-5 text-green-600 dark:text-green-400" />
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

          {/* IoT Scale Controls */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Label htmlFor="iot-scale">Use IoT Scale (Grams Mode)</Label>
                <Switch
                  id="iot-scale"
                  checked={useIoTScale}
                  onCheckedChange={(checked) => {
                    setUseIoTScale(checked)
                    if (checked) {
                      setShowScaleSelection(true)
                    } else {
                      disconnectScale()
                    }
                  }}
                />
              </div>
              {selectedScale?.isConnected && (
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-600 dark:text-green-400">{selectedScale.name}</span>
                </div>
              )}
            </div>

            {useIoTScale && selectedScale?.isConnected && (
              <div className="space-y-3 p-4 bg-muted/30 rounded-lg border">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-sm">Current Scale Reading</h4>
                    <p className="text-xs text-muted-foreground">Total weight on {selectedScale.name}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">{scaleWeight}g</div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowScaleEditor(true)}
                      className="text-xs h-6 px-2"
                    >
                      Edit Weight
                    </Button>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={simulateScaleReading}
                    className="flex-1 h-8 bg-transparent"
                  >
                    Read Scale
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setScaleWeight(0)} className="h-8 px-3">
                    Reset
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setShowScaleSelection(true)} className="h-8 px-3">
                    Change Scale
                  </Button>
                </div>

                <div className="text-xs text-muted-foreground p-2 bg-blue-50 dark:bg-blue-950/50 rounded border-l-4 border-blue-400 dark:border-blue-600">
                  <strong>Scale Mode:</strong> Enter food amounts in grams. The scale will help you measure precise
                  weights.
                </div>
              </div>
            )}

            {!useIoTScale && (
              <div className="text-xs text-muted-foreground p-2 bg-orange-50 dark:bg-orange-950/50 rounded border-l-4 border-orange-400 dark:border-orange-600">
                <strong>Portion Mode:</strong> Click the + button to add 1 portion at a time. Perfect for quick logging
                without a scale.
              </div>
            )}
          </div>

          {message && (
            <div
              className={`flex items-center gap-2 p-3 rounded-lg border ${
                message.type === "success"
                  ? "bg-green-50 dark:bg-green-950/50 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800"
                  : "bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800"
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
              {filteredFoods.map((food) => {
                const selectedFood = selectedFoods.find((sf) => sf.food.id === food.id)
                return (
                  <div
                    key={food.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm">{food.name}</h4>
                        <Badge variant="outline" className="text-xs">
                          {food.category}
                        </Badge>
                        {selectedFood && (
                          <Badge
                            variant="secondary"
                            className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                          >
                            {useIoTScale && selectedScale?.isConnected
                              ? `${selectedFood.grams}g added`
                              : `${selectedFood.portions} portions added`}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        {food.calories} cal, {food.protein}g protein per 100g
                      </p>
                      <p className="text-xs text-muted-foreground">{food.description}</p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      {useIoTScale && selectedScale?.isConnected ? (
                        <div className="flex items-center gap-2">
                          <div className="text-center">
                            <div className="text-xs font-medium text-blue-600 dark:text-blue-400">Grams</div>
                            <Input
                              type="number"
                              min="10"
                              step="10"
                              value={gramAmounts[food.id] || 100}
                              onChange={(e) =>
                                setGramAmounts({
                                  ...gramAmounts,
                                  [food.id]: Number.parseInt(e.target.value) || 100,
                                })
                              }
                              className="w-16 h-8 text-xs"
                            />
                          </div>
                          <Button
                            size="sm"
                            onClick={() => addFoodPortion(food)}
                            className="h-8 px-2 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <div className="text-center">
                            <div className="text-xs font-medium text-green-600 dark:text-green-400">+1 portion</div>
                            <div className="text-xs text-muted-foreground">per click</div>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => addFoodPortion(food)}
                            className="h-8 px-2 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Selected Foods */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
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
                  <div key={sf.food.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{sf.food.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {useIoTScale && selectedScale?.isConnected
                          ? `${sf.grams}g`
                          : `${sf.portions} portions (${sf.grams}g)`}{" "}
                        = {sf.nutrition.calories.toFixed(0)} cal, {sf.nutrition.protein.toFixed(1)}g protein
                      </p>
                      <div className="flex gap-4 text-xs text-muted-foreground mt-1">
                        <span>Carbs: {sf.nutrition.carbs.toFixed(1)}g</span>
                        <span>Fats: {sf.nutrition.fats.toFixed(1)}g</span>
                        <span>Fiber: {sf.nutrition.fiber.toFixed(1)}g</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {!useIoTScale && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFoodPortion(sf.food.id)}
                          className="h-8 px-2 text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300"
                          title="Remove 1 portion"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFood(sf.food.id)}
                        className="h-8 px-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        title="Remove completely"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
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
                  className="w-full mt-4 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
                  disabled={selectedFoods.length === 0 || isLoading}
                >
                  {isLoading ? "Logging..." : `Log ${mealType.charAt(0).toUpperCase() + mealType.slice(1)}`}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Scale Selection Dialog */}
      {showScaleSelection && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50">
          <div className="bg-background border rounded-lg shadow-lg max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium flex items-center gap-2">
                  <Scale className="h-5 w-5" />
                  Select IoT Scale
                </h3>
                <Button variant="ghost" size="sm" onClick={() => setShowScaleSelection(false)} className="h-8 w-8 p-0">
                  ×
                </Button>
              </div>

              <div className="space-y-4">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={scanForScales}
                    disabled={isScanning}
                    className="flex-1 h-9 bg-transparent"
                  >
                    {isScanning ? "Scanning..." : "Scan for Scales"}
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label>Available Scales</Label>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {availableScales.map((scale) => (
                      <div
                        key={scale.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                        onClick={() => connectToScale(scale)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            {scale.type === "bluetooth" ? (
                              <Bluetooth className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            ) : (
                              <Wifi className="h-4 w-4 text-green-600 dark:text-green-400" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium text-sm">{scale.name}</h4>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span className="capitalize">{scale.type}</span>
                              {scale.batteryLevel && <span>• Battery: {scale.batteryLevel}%</span>}
                              <span>
                                • Signal: {"●".repeat(scale.signal || 0)}
                                {"○".repeat(5 - (scale.signal || 0))}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          className="h-7 px-3 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
                        >
                          Connect
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-xs text-muted-foreground p-2 bg-blue-50 dark:bg-blue-950/50 rounded border-l-4 border-blue-400 dark:border-blue-600">
                  <strong>Note:</strong> Make sure your scale is powered on and in pairing mode. Bluetooth scales need
                  to be within range.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Scale Weight Editor Dialog */}
      {showScaleEditor && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50">
          <div className="bg-background border rounded-lg shadow-lg max-w-sm w-full mx-4">
            <div className="p-6">
              <h3 className="font-medium mb-4">Edit Scale Weight</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="scale-weight">Weight (grams)</Label>
                  <Input
                    id="scale-weight"
                    type="number"
                    min="0"
                    step="1"
                    defaultValue={scaleWeight}
                    className="mt-1"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const target = e.target as HTMLInputElement
                        updateScaleWeight(Number.parseInt(target.value) || 0)
                      }
                    }}
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setShowScaleEditor(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button
                    onClick={(e) => {
                      const input = (e.target as HTMLElement)
                        .closest(".bg-background")
                        ?.querySelector("input") as HTMLInputElement
                      updateScaleWeight(Number.parseInt(input?.value) || 0)
                    }}
                    className="flex-1 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
                  >
                    Update
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
