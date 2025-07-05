import { v4 as uuidv4 } from "uuid"

// Types
export interface User {
  id: string
  email: string
  fullName: string
  age: number
  gender: "male" | "female" | "other"
  height: number
  weight: number
  location?: string
  occupation?: string
  healthConditions?: string[]
  fitnessGoals?: string[]
  role: "user" | "admin"
  createdAt: string
  updatedAt: string
  lastLoginAt: string
}

export interface UserProfile {
  userId: string
  preferences: {
    culturalBackground: string[]
    dietaryRestrictions: string[]
    activityLevel: "sedentary" | "light" | "moderate" | "active"
    healthGoals: string[]
    favoriteNigerianFoods: string[]
    mealPreferences: {
      breakfast: string[]
      lunch: string[]
      dinner: string[]
      snacks: string[]
    }
  }
  settings: {
    notifications: boolean
    dataSharing: boolean
    units: "metric" | "imperial"
    reminderTimes: {
      breakfast: string
      lunch: string
      dinner: string
    }
    weeklyGoals: {
      calorieTarget: number
      proteinTarget: number
      exerciseDays: number
    }
  }
  personalizedRecommendations: {
    suggestedFoods: string[]
    avoidFoods: string[]
    mealPlanPreferences: string
    supplementSuggestions: string[]
  }
  updatedAt: string
}

export interface Meal {
  id: string
  userId: string
  type: "breakfast" | "lunch" | "dinner" | "snack"
  date: string
  time: string
  foods: {
    id: string
    name: string
    grams: number
    nutrition: {
      calories: number
      protein: number
      carbs: number
      fats: number
      fiber: number
      iron: number
      vitaminA: number
    }
  }[]
  totalNutrition: {
    calories: number
    protein: number
    carbs: number
    fats: number
    fiber: number
    iron: number
    vitaminA: number
  }
  mood?: "great" | "good" | "okay" | "poor"
  notes?: string
  createdAt: string
}

export interface UserStats {
  userId: string
  totalMealsLogged: number
  averageDailyCalories: number
  favoriteFood: string
  longestStreak: number
  currentStreak: number
  weightProgress: {
    date: string
    weight: number
  }[]
  achievements: string[]
  lastUpdated: string
}

// Storage keys
const STORAGE_KEYS = {
  USERS: "naijafit_users",
  CURRENT_USER: "naijafit_current_user",
  MEALS: "naijafit_meals",
  PROFILES: "naijafit_profiles",
  USER_STATS: "naijafit_user_stats",
  PASSWORDS: "naijafit_passwords",
  INITIALIZED: "naijafit_initialized",
  APP_SETTINGS: "naijafit_app_settings",
} as const

// Utility functions
function getFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue

  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error(`Error reading from localStorage key ${key}:`, error)
    return defaultValue
  }
}

function setToStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Error writing to localStorage key ${key}:`, error)
  }
}

// Database operations
export class LocalDatabase {
  // Initialize with demo data and personalized content
  static async initialize() {
    const isInitialized = getFromStorage(STORAGE_KEYS.INITIALIZED, false)

    if (!isInitialized) {
      // Create multiple demo users with different profiles
      const demoUsers: User[] = [
        {
          id: uuidv4(),
          email: "test@naijafit.com",
          fullName: "Adunni Okafor",
          age: 28,
          gender: "female",
          height: 165,
          weight: 68,
          location: "Lagos, Nigeria",
          occupation: "Software Developer",
          healthConditions: [],
          fitnessGoals: ["weight_maintenance", "muscle_building"],
          role: "user",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
        },
        {
          id: uuidv4(),
          email: "kemi@naijafit.com",
          fullName: "Kemi Adebayo",
          age: 35,
          gender: "female",
          height: 160,
          weight: 75,
          location: "Abuja, Nigeria",
          occupation: "Teacher",
          healthConditions: ["diabetes"],
          fitnessGoals: ["weight_loss", "diabetes_management"],
          role: "user",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
        },
        {
          id: uuidv4(),
          email: "chidi@naijafit.com",
          fullName: "Chidi Okwu",
          age: 42,
          gender: "male",
          height: 175,
          weight: 85,
          location: "Port Harcourt, Nigeria",
          occupation: "Engineer",
          healthConditions: [],
          fitnessGoals: ["weight_loss", "heart_health"],
          role: "user",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
        },
      ]

      // Save demo users
      setToStorage(STORAGE_KEYS.USERS, demoUsers)

      // Save demo passwords
      const passwords: Record<string, string> = {}
      demoUsers.forEach((user) => {
        passwords[user.id] = "password123"
      })
      setToStorage(STORAGE_KEYS.PASSWORDS, passwords)

      // Create personalized profiles for each user
      const demoProfiles: UserProfile[] = [
        {
          userId: demoUsers[0].id, // Adunni
          preferences: {
            culturalBackground: ["yoruba", "general-nigerian"],
            dietaryRestrictions: [],
            activityLevel: "moderate",
            healthGoals: ["balanced", "muscle-gain"],
            favoriteNigerianFoods: ["jollof-rice", "egusi-soup", "suya"],
            mealPreferences: {
              breakfast: ["akamu-pap", "akara", "bread-agege"],
              lunch: ["jollof-rice", "fried-rice", "beans"],
              dinner: ["pounded-yam", "amala", "rice"],
              snacks: ["plantain", "groundnuts", "fruits"],
            },
          },
          settings: {
            notifications: true,
            dataSharing: false,
            units: "metric",
            reminderTimes: {
              breakfast: "07:30",
              lunch: "12:30",
              dinner: "19:00",
            },
            weeklyGoals: {
              calorieTarget: 2000,
              proteinTarget: 120,
              exerciseDays: 4,
            },
          },
          personalizedRecommendations: {
            suggestedFoods: ["grilled-fish", "ugwu-vegetable", "boiled-plantain"],
            avoidFoods: ["excessive-fried-foods"],
            mealPlanPreferences: "balanced_nigerian",
            supplementSuggestions: ["vitamin-d", "omega-3"],
          },
          updatedAt: new Date().toISOString(),
        },
        {
          userId: demoUsers[1].id, // Kemi (Diabetic)
          preferences: {
            culturalBackground: ["yoruba"],
            dietaryRestrictions: ["low-sugar", "diabetic-friendly"],
            activityLevel: "light",
            healthGoals: ["diabetes-management", "weight-loss"],
            favoriteNigerianFoods: ["pepper-soup", "vegetable-soup", "grilled-fish"],
            mealPreferences: {
              breakfast: ["boiled-yam", "eggs", "vegetables"],
              lunch: ["brown-rice", "grilled-protein", "vegetables"],
              dinner: ["pepper-soup", "small-portions"],
              snacks: ["nuts", "cucumber", "carrots"],
            },
          },
          settings: {
            notifications: true,
            dataSharing: true,
            units: "metric",
            reminderTimes: {
              breakfast: "06:30",
              lunch: "12:00",
              dinner: "18:30",
            },
            weeklyGoals: {
              calorieTarget: 1600,
              proteinTarget: 100,
              exerciseDays: 3,
            },
          },
          personalizedRecommendations: {
            suggestedFoods: ["bitter-leaf", "unripe-plantain", "fish", "vegetables"],
            avoidFoods: ["white-rice", "fried-plantain", "sugary-drinks"],
            mealPlanPreferences: "diabetic_nigerian",
            supplementSuggestions: ["chromium", "alpha-lipoic-acid", "vitamin-b12"],
          },
          updatedAt: new Date().toISOString(),
        },
        {
          userId: demoUsers[2].id, // Chidi (Weight Loss)
          preferences: {
            culturalBackground: ["igbo", "general-nigerian"],
            dietaryRestrictions: [],
            activityLevel: "active",
            healthGoals: ["weight-loss", "heart-health"],
            favoriteNigerianFoods: ["pepper-soup", "grilled-fish", "vegetables"],
            mealPreferences: {
              breakfast: ["oatmeal", "fruits", "nuts"],
              lunch: ["salads", "grilled-protein", "vegetables"],
              dinner: ["soup", "small-carb-portions"],
              snacks: ["fruits", "nuts", "water"],
            },
          },
          settings: {
            notifications: true,
            dataSharing: false,
            units: "metric",
            reminderTimes: {
              breakfast: "06:00",
              lunch: "13:00",
              dinner: "19:30",
            },
            weeklyGoals: {
              calorieTarget: 1800,
              proteinTarget: 140,
              exerciseDays: 5,
            },
          },
          personalizedRecommendations: {
            suggestedFoods: ["lean-proteins", "vegetables", "whole-grains"],
            avoidFoods: ["fried-foods", "excessive-carbs", "sugary-snacks"],
            mealPlanPreferences: "weight_loss_nigerian",
            supplementSuggestions: ["green-tea-extract", "l-carnitine", "multivitamin"],
          },
          updatedAt: new Date().toISOString(),
        },
      ]

      setToStorage(STORAGE_KEYS.PROFILES, demoProfiles)

      // Create user stats for each user
      const userStats: UserStats[] = demoUsers.map((user, index) => ({
        userId: user.id,
        totalMealsLogged: 45 + index * 10,
        averageDailyCalories: 1800 + index * 100,
        favoriteFood: ["Jollof Rice", "Pepper Soup", "Egusi Soup"][index],
        longestStreak: 12 + index,
        currentStreak: 5 + index,
        weightProgress: [
          { date: "2024-01-01", weight: user.weight + 2 },
          { date: "2024-01-15", weight: user.weight + 1 },
          { date: "2024-02-01", weight: user.weight },
        ],
        achievements: [
          "First Week Complete",
          "Consistent Logger",
          "Healthy Choices",
          ...(index > 0 ? ["Weight Loss Champion"] : []),
          ...(index > 1 ? ["Fitness Enthusiast"] : []),
        ],
        lastUpdated: new Date().toISOString(),
      }))

      setToStorage(STORAGE_KEYS.USER_STATS, userStats)

      // Create sample meals for the main demo user (Adunni)
      const demoMeals: Meal[] = []
      const today = new Date()
      const mainUserId = demoUsers[0].id

      for (let i = 0; i < 14; i++) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)
        const dateString = date.toISOString().split("T")[0]

        // Breakfast
        demoMeals.push({
          id: uuidv4(),
          userId: mainUserId,
          type: "breakfast",
          date: dateString,
          time: "07:30 AM",
          foods: [
            {
              id: "akamu-pap",
              name: "Akamu (Pap)",
              grams: 200,
              nutrition: { calories: 142, protein: 3.6, carbs: 32.4, fats: 0.8, fiber: 2.2, iron: 1.0, vitaminA: 20 },
            },
            {
              id: "akara",
              name: "Akara",
              grams: 90,
              nutrition: { calories: 149, protein: 7.4, carbs: 10.9, fats: 8.8, fiber: 4.1, iron: 2.0, vitaminA: 5 },
            },
          ],
          totalNutrition: { calories: 291, protein: 11.0, carbs: 43.3, fats: 9.6, fiber: 6.3, iron: 3.0, vitaminA: 25 },
          mood: ["great", "good", "okay"][i % 3] as "great" | "good" | "okay",
          notes: i % 4 === 0 ? "Feeling energetic today!" : undefined,
          createdAt: new Date(date.getTime() + 7.5 * 60 * 60 * 1000).toISOString(),
        })

        // Lunch
        demoMeals.push({
          id: uuidv4(),
          userId: mainUserId,
          type: "lunch",
          date: dateString,
          time: "12:30 PM",
          foods: [
            {
              id: "jollof-rice",
              name: "Jollof Rice",
              grams: 200,
              nutrition: { calories: 314, protein: 6.4, carbs: 44.2, fats: 12.8, fiber: 2.4, iron: 2.4, vitaminA: 100 },
            },
            {
              id: "grilled-fish",
              name: "Grilled Fish (Tilapia)",
              grams: 150,
              nutrition: { calories: 192, protein: 39.3, carbs: 0, fats: 4.1, fiber: 0, iron: 1.8, vitaminA: 30 },
            },
          ],
          totalNutrition: {
            calories: 506,
            protein: 45.7,
            carbs: 44.2,
            fats: 16.9,
            fiber: 2.4,
            iron: 4.2,
            vitaminA: 130,
          },
          mood: ["good", "great", "okay"][i % 3] as "good" | "great" | "okay",
          createdAt: new Date(date.getTime() + 12.5 * 60 * 60 * 1000).toISOString(),
        })

        // Dinner
        demoMeals.push({
          id: uuidv4(),
          userId: mainUserId,
          type: "dinner",
          date: dateString,
          time: "07:00 PM",
          foods: [
            {
              id: "pounded-yam",
              name: "Pounded Yam",
              grams: 250,
              nutrition: { calories: 295, protein: 5.3, carbs: 68.3, fats: 0.3, fiber: 5.8, iron: 2.0, vitaminA: 25 },
            },
            {
              id: "egusi-soup",
              name: "Egusi Soup",
              grams: 200,
              nutrition: {
                calories: 442,
                protein: 20.4,
                carbs: 18.2,
                fats: 38.6,
                fiber: 7.0,
                iron: 6.4,
                vitaminA: 360,
              },
            },
          ],
          totalNutrition: {
            calories: 737,
            protein: 25.7,
            carbs: 86.5,
            fats: 38.9,
            fiber: 12.8,
            iron: 8.4,
            vitaminA: 385,
          },
          mood: ["great", "good"][i % 2] as "great" | "good",
          notes: i % 5 === 0 ? "Family dinner - delicious!" : undefined,
          createdAt: new Date(date.getTime() + 19 * 60 * 60 * 1000).toISOString(),
        })
      }

      setToStorage(STORAGE_KEYS.MEALS, demoMeals)

      // Set app settings
      const appSettings = {
        totalUsers: demoUsers.length,
        totalMealsLogged: demoMeals.length,
        lastInitialized: new Date().toISOString(),
        version: "1.0.0",
      }
      setToStorage(STORAGE_KEYS.APP_SETTINGS, appSettings)

      setToStorage(STORAGE_KEYS.INITIALIZED, true)
    }
  }

  // User operations
  static getUsers(): User[] {
    return getFromStorage<User[]>(STORAGE_KEYS.USERS, [])
  }

  static saveUsers(users: User[]): void {
    setToStorage(STORAGE_KEYS.USERS, users)
  }

  static async createUser(
    userData: Omit<User, "id" | "createdAt" | "updatedAt" | "lastLoginAt"> & { password: string },
  ): Promise<{ success: boolean; user?: User; error?: string }> {
    const users = this.getUsers()

    // Check if user already exists
    if (users.find((u) => u.email === userData.email.toLowerCase())) {
      return { success: false, error: "User with this email already exists" }
    }

    const now = new Date().toISOString()
    const newUser: User = {
      id: uuidv4(),
      email: userData.email.toLowerCase(),
      fullName: userData.fullName,
      age: userData.age,
      gender: userData.gender,
      height: userData.height,
      weight: userData.weight,
      location: userData.location,
      occupation: userData.occupation,
      healthConditions: userData.healthConditions || [],
      fitnessGoals: userData.fitnessGoals || [],
      role: "user",
      createdAt: now,
      updatedAt: now,
      lastLoginAt: now,
    }

    users.push(newUser)
    this.saveUsers(users)

    // Save password
    const passwords = getFromStorage<Record<string, string>>(STORAGE_KEYS.PASSWORDS, {})
    passwords[newUser.id] = userData.password
    setToStorage(STORAGE_KEYS.PASSWORDS, passwords)

    // Create default profile for new user
    const defaultProfile: UserProfile = {
      userId: newUser.id,
      preferences: {
        culturalBackground: ["general-nigerian"],
        dietaryRestrictions: [],
        activityLevel: "moderate",
        healthGoals: ["balanced"],
        favoriteNigerianFoods: [],
        mealPreferences: {
          breakfast: [],
          lunch: [],
          dinner: [],
          snacks: [],
        },
      },
      settings: {
        notifications: true,
        dataSharing: false,
        units: "metric",
        reminderTimes: {
          breakfast: "07:00",
          lunch: "12:00",
          dinner: "19:00",
        },
        weeklyGoals: {
          calorieTarget: 2000,
          proteinTarget: 100,
          exerciseDays: 3,
        },
      },
      personalizedRecommendations: {
        suggestedFoods: ["jollof-rice", "grilled-fish", "vegetables"],
        avoidFoods: [],
        mealPlanPreferences: "balanced_nigerian",
        supplementSuggestions: [],
      },
      updatedAt: now,
    }

    const profiles = this.getProfiles()
    profiles.push(defaultProfile)
    this.saveProfiles(profiles)

    // Create initial user stats
    const initialStats: UserStats = {
      userId: newUser.id,
      totalMealsLogged: 0,
      averageDailyCalories: 0,
      favoriteFood: "Not determined yet",
      longestStreak: 0,
      currentStreak: 0,
      weightProgress: [{ date: now.split("T")[0], weight: newUser.weight }],
      achievements: ["Welcome to NaijaFit!"],
      lastUpdated: now,
    }

    const userStats = this.getUserStats()
    userStats.push(initialStats)
    this.saveUserStats(userStats)

    return { success: true, user: newUser }
  }

  static async loginUser(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
    const users = this.getUsers()
    const user = users.find((u) => u.email === email.toLowerCase())

    if (!user) {
      return { success: false, error: "Invalid email or password" }
    }

    // Check password
    const passwords = getFromStorage<Record<string, string>>(STORAGE_KEYS.PASSWORDS, {})
    if (passwords[user.id] !== password) {
      return { success: false, error: "Invalid email or password" }
    }

    // Update last login time
    user.lastLoginAt = new Date().toISOString()
    this.saveUsers(users)

    // Set current user
    setToStorage(STORAGE_KEYS.CURRENT_USER, user)

    return { success: true, user }
  }

  static getCurrentUser(): User | null {
    return getFromStorage<User | null>(STORAGE_KEYS.CURRENT_USER, null)
  }

  static logoutUser(): void {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER)
  }

  static async updateUser(
    id: string,
    updates: Partial<Omit<User, "id" | "createdAt">>,
  ): Promise<{ success: boolean; user?: User; error?: string }> {
    const users = this.getUsers()
    const userIndex = users.findIndex((u) => u.id === id)

    if (userIndex === -1) {
      return { success: false, error: "User not found" }
    }

    const updatedUser = {
      ...users[userIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    users[userIndex] = updatedUser
    this.saveUsers(users)

    // Update current user if it's the same user
    const currentUser = this.getCurrentUser()
    if (currentUser && currentUser.id === id) {
      setToStorage(STORAGE_KEYS.CURRENT_USER, updatedUser)
    }

    return { success: true, user: updatedUser }
  }

  // Meal operations
  static getMeals(): Meal[] {
    return getFromStorage<Meal[]>(STORAGE_KEYS.MEALS, [])
  }

  static saveMeals(meals: Meal[]): void {
    setToStorage(STORAGE_KEYS.MEALS, meals)
  }

  static async createMeal(
    mealData: Omit<Meal, "id" | "createdAt">,
  ): Promise<{ success: boolean; meal?: Meal; error?: string }> {
    const meals = this.getMeals()

    const newMeal: Meal = {
      id: uuidv4(),
      ...mealData,
      createdAt: new Date().toISOString(),
    }

    meals.push(newMeal)
    this.saveMeals(meals)

    // Update user stats
    this.updateUserStatsAfterMeal(mealData.userId, newMeal)

    return { success: true, meal: newMeal }
  }

  static getUserMeals(userId: string, startDate?: string, endDate?: string): Meal[] {
    const meals = this.getMeals()
    let userMeals = meals.filter((m) => m.userId === userId)

    if (startDate) {
      userMeals = userMeals.filter((m) => m.date >= startDate)
    }

    if (endDate) {
      userMeals = userMeals.filter((m) => m.date <= endDate)
    }

    return userMeals.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  static getMealsByDate(userId: string, date: string): Meal[] {
    const meals = this.getMeals()
    return meals.filter((m) => m.userId === userId && m.date === date)
  }

  static async deleteMeal(id: string, userId: string): Promise<{ success: boolean; error?: string }> {
    const meals = this.getMeals()
    const mealIndex = meals.findIndex((m) => m.id === id && m.userId === userId)

    if (mealIndex === -1) {
      return { success: false, error: "Meal not found" }
    }

    meals.splice(mealIndex, 1)
    this.saveMeals(meals)

    // Update user stats
    this.recalculateUserStats(userId)

    return { success: true }
  }

  // Profile operations
  static getProfiles(): UserProfile[] {
    return getFromStorage<UserProfile[]>(STORAGE_KEYS.PROFILES, [])
  }

  static saveProfiles(profiles: UserProfile[]): void {
    setToStorage(STORAGE_KEYS.PROFILES, profiles)
  }

  static getUserProfile(userId: string): UserProfile | null {
    const profiles = this.getProfiles()
    return profiles.find((p) => p.userId === userId) || null
  }

  static async updateUserProfile(
    userId: string,
    profileData: Omit<UserProfile, "userId" | "updatedAt">,
  ): Promise<{ success: boolean; profile?: UserProfile; error?: string }> {
    const profiles = this.getProfiles()
    const profileIndex = profiles.findIndex((p) => p.userId === userId)

    const updatedProfile: UserProfile = {
      userId,
      ...profileData,
      updatedAt: new Date().toISOString(),
    }

    if (profileIndex === -1) {
      profiles.push(updatedProfile)
    } else {
      profiles[profileIndex] = updatedProfile
    }

    this.saveProfiles(profiles)
    return { success: true, profile: updatedProfile }
  }

  // User Stats operations
  static getUserStats(): UserStats[] {
    return getFromStorage<UserStats[]>(STORAGE_KEYS.USER_STATS, [])
  }

  static saveUserStats(stats: UserStats[]): void {
    setToStorage(STORAGE_KEYS.USER_STATS, stats)
  }

  static getUserStatsById(userId: string): UserStats | null {
    const stats = this.getUserStats()
    return stats.find((s) => s.userId === userId) || null
  }

  static updateUserStatsAfterMeal(userId: string, meal: Meal): void {
    const allStats = this.getUserStats()
    const userStatsIndex = allStats.findIndex((s) => s.userId === userId)

    if (userStatsIndex === -1) return

    const userStats = allStats[userStatsIndex]
    userStats.totalMealsLogged += 1

    // Recalculate average daily calories
    const userMeals = this.getUserMeals(userId)
    const totalCalories = userMeals.reduce((sum, m) => sum + m.totalNutrition.calories, 0)
    const uniqueDays = new Set(userMeals.map((m) => m.date)).size
    userStats.averageDailyCalories = uniqueDays > 0 ? totalCalories / uniqueDays : 0

    // Update favorite food (most logged food)
    const foodCounts: Record<string, number> = {}
    userMeals.forEach((m) => {
      m.foods.forEach((f) => {
        foodCounts[f.name] = (foodCounts[f.name] || 0) + 1
      })
    })
    const mostLoggedFood = Object.entries(foodCounts).sort(([, a], [, b]) => b - a)[0]
    if (mostLoggedFood) {
      userStats.favoriteFood = mostLoggedFood[0]
    }

    // Update streaks
    const sortedDates = [...new Set(userMeals.map((m) => m.date))].sort()
    let currentStreak = 0
    let longestStreak = 0
    let tempStreak = 1

    for (let i = sortedDates.length - 1; i >= 0; i--) {
      const currentDate = new Date(sortedDates[i])
      const expectedDate = new Date()
      expectedDate.setDate(expectedDate.getDate() - (sortedDates.length - 1 - i))

      if (currentDate.toDateString() === expectedDate.toDateString()) {
        currentStreak = tempStreak
        tempStreak++
      } else {
        break
      }
    }

    // Calculate longest streak
    for (let i = 1; i < sortedDates.length; i++) {
      const prevDate = new Date(sortedDates[i - 1])
      const currDate = new Date(sortedDates[i])
      const diffTime = currDate.getTime() - prevDate.getTime()
      const diffDays = diffTime / (1000 * 60 * 60 * 24)

      if (diffDays === 1) {
        tempStreak++
      } else {
        longestStreak = Math.max(longestStreak, tempStreak)
        tempStreak = 1
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak)

    userStats.currentStreak = currentStreak
    userStats.longestStreak = Math.max(userStats.longestStreak, longestStreak)
    userStats.lastUpdated = new Date().toISOString()

    // Add achievements
    if (userStats.totalMealsLogged === 1 && !userStats.achievements.includes("First Meal Logged")) {
      userStats.achievements.push("First Meal Logged")
    }
    if (userStats.totalMealsLogged === 10 && !userStats.achievements.includes("Consistent Logger")) {
      userStats.achievements.push("Consistent Logger")
    }
    if (userStats.currentStreak >= 7 && !userStats.achievements.includes("Week Warrior")) {
      userStats.achievements.push("Week Warrior")
    }
    if (userStats.longestStreak >= 30 && !userStats.achievements.includes("Monthly Master")) {
      userStats.achievements.push("Monthly Master")
    }

    allStats[userStatsIndex] = userStats
    this.saveUserStats(allStats)
  }

  static recalculateUserStats(userId: string): void {
    const userMeals = this.getUserMeals(userId)
    const allStats = this.getUserStats()
    const userStatsIndex = allStats.findIndex((s) => s.userId === userId)

    if (userStatsIndex === -1) return

    const userStats = allStats[userStatsIndex]
    userStats.totalMealsLogged = userMeals.length

    // Recalculate everything
    if (userMeals.length > 0) {
      const totalCalories = userMeals.reduce((sum, m) => sum + m.totalNutrition.calories, 0)
      const uniqueDays = new Set(userMeals.map((m) => m.date)).size
      userStats.averageDailyCalories = uniqueDays > 0 ? totalCalories / uniqueDays : 0

      // Recalculate favorite food
      const foodCounts: Record<string, number> = {}
      userMeals.forEach((m) => {
        m.foods.forEach((f) => {
          foodCounts[f.name] = (foodCounts[f.name] || 0) + 1
        })
      })
      const mostLoggedFood = Object.entries(foodCounts).sort(([, a], [, b]) => b - a)[0]
      userStats.favoriteFood = mostLoggedFood ? mostLoggedFood[0] : "Not determined yet"
    } else {
      userStats.averageDailyCalories = 0
      userStats.favoriteFood = "Not determined yet"
      userStats.currentStreak = 0
    }

    userStats.lastUpdated = new Date().toISOString()
    allStats[userStatsIndex] = userStats
    this.saveUserStats(allStats)
  }

  // Data export/import
  static exportUserData(userId: string): string {
    const user = this.getCurrentUser()
    const meals = this.getUserMeals(userId)
    const profile = this.getUserProfile(userId)
    const stats = this.getUserStatsById(userId)

    const exportData = {
      user,
      meals,
      profile,
      stats,
      exportDate: new Date().toISOString(),
    }

    return JSON.stringify(exportData, null, 2)
  }

  static async importUserData(jsonData: string): Promise<{ success: boolean; error?: string }> {
    try {
      const data = JSON.parse(jsonData)

      if (data.user) {
        const users = this.getUsers()
        const existingIndex = users.findIndex((u) => u.id === data.user.id)

        if (existingIndex >= 0) {
          users[existingIndex] = data.user
        } else {
          users.push(data.user)
        }

        this.saveUsers(users)
      }

      if (data.meals && Array.isArray(data.meals)) {
        const allMeals = this.getMeals()
        const existingMealIds = new Set(allMeals.map((m) => m.id))

        const newMeals = data.meals.filter((meal: Meal) => !existingMealIds.has(meal.id))
        this.saveMeals([...allMeals, ...newMeals])
      }

      if (data.profile) {
        const profiles = this.getProfiles()
        const profileIndex = profiles.findIndex((p) => p.userId === data.profile.userId)

        if (profileIndex >= 0) {
          profiles[profileIndex] = data.profile
        } else {
          profiles.push(data.profile)
        }

        this.saveProfiles(profiles)
      }

      if (data.stats) {
        const allStats = this.getUserStats()
        const statsIndex = allStats.findIndex((s) => s.userId === data.stats.userId)

        if (statsIndex >= 0) {
          allStats[statsIndex] = data.stats
        } else {
          allStats.push(data.stats)
        }

        this.saveUserStats(allStats)
      }

      return { success: true }
    } catch (error) {
      return { success: false, error: "Invalid data format" }
    }
  }

  // Get app statistics
  static getAppStats() {
    const users = this.getUsers()
    const meals = this.getMeals()
    const profiles = this.getProfiles()

    return {
      totalUsers: users.length,
      totalMeals: meals.length,
      totalProfiles: profiles.length,
      activeUsers: users.filter((u) => {
        const lastLogin = new Date(u.lastLoginAt)
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)
        return lastLogin > weekAgo
      }).length,
    }
  }

  // Clear all data (for testing/reset)
  static clearAllData(): void {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key)
    })
  }
}
