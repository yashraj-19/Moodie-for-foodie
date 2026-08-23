import type { Recipe, SearchResult, SearchResponse } from "./types"

export const MOCK_RECIPES: Recipe[] = [
  {
    id: 716429,
    title: "Pasta with Garlic, Scallions, Cauliflower & Breadcrumbs",
    image: "https://images.unsplash.com/photo-1621996346565-e3d5d6281292?auto=format&fit=crop&w=800&q=80",
    imageType: "jpg",
    readyInMinutes: 30,
    servings: 4,
    sourceUrl: "https://spoonacular.com/pasta-with-garlic-scallions-cauliflower-breadcrumbs-716429",
    summary: "Pasta with Garlic, Scallions, Cauliflower & Breadcrumbs is a <b>vegetarian and delicious</b> recipe. One serving contains <b>584 calories</b>, <b>19g protein</b>, and <b>19g fat</b>. It's a quick, easy weeknight favorite with crispy texture and fragrant garlic.",
    cuisines: ["Italian", "Mediterranean"],
    dishTypes: ["lunch", "main course", "dinner"],
    diets: ["vegetarian"],
    instructions: "1. Cook pasta according to package directions.\n2. In a large skillet over medium heat, heat olive oil. Add minced garlic, chopped scallions, and cauliflower florets.\n3. Sauté until tender-crisp and golden, about 8 minutes.\n4. Toast breadcrumbs in a separate pan until golden brown.\n5. Toss pasta with the cauliflower mixture, top with crispy breadcrumbs and fresh parmesan.",
    analyzedInstructions: [
      {
        name: "",
        steps: [
          { number: 1, step: "Bring a large pot of salted water to a boil and cook pasta al dente." },
          { number: 2, step: "Heat 3 tbsp extra virgin olive oil in a skillet over medium heat. Add thinly sliced garlic and sauté until fragrant." },
          { number: 3, step: "Add cauliflower florets and chopped scallions; cook for 8-10 minutes until golden and tender." },
          { number: 4, step: "Toast breadcrumbs in butter until golden brown and crispy." },
          { number: 5, step: "Combine drained pasta with cauliflower mixture, toss with freshly grated parmesan, and garnish with breadcrumbs." }
        ]
      }
    ],
    vegetarian: true,
    vegan: false,
    glutenFree: false,
    dairyFree: false,
    veryHealthy: true,
    cheap: true,
    veryPopular: true,
    sustainable: false,
    lowFodmap: false,
    weightWatcherSmartPoints: 16,
    gaps: "no",
    preparationMinutes: 10,
    cookingMinutes: 20,
    aggregateLikes: 432,
    healthScore: 88,
    creditsText: "Chef Marco Rossi",
    sourceName: "Culinary Canvas Kitchen",
    pricePerServing: 1.85,
    spoonacularScore: 92,
    extendedIngredients: [
      { name: "linguine pasta", amount: 400, unit: "g", nameClean: "linguine" },
      { name: "cauliflower florets", amount: 1, unit: "head", nameClean: "cauliflower" },
      { name: "garlic cloves, sliced", amount: 4, unit: "cloves", nameClean: "garlic" },
      { name: "scallions, chopped", amount: 4, unit: "stalks", nameClean: "scallions" },
      { name: "panko breadcrumbs", amount: 0.5, unit: "cup", nameClean: "breadcrumbs" },
      { name: "extra virgin olive oil", amount: 3, unit: "tbsp", nameClean: "olive oil" },
      { name: "Parmigiano-Reggiano", amount: 0.5, unit: "cup", nameClean: "parmesan cheese" },
      { name: "red pepper flakes", amount: 0.5, unit: "tsp", nameClean: "red chili flakes" }
    ],
    nutrition: {
      nutrients: [
        { name: "Calories", amount: 584, unit: "kcal" },
        { name: "Protein", amount: 19, unit: "g" },
        { name: "Fat", amount: 19, unit: "g" },
        { name: "Carbohydrates", amount: 82, unit: "g" },
        { name: "Fiber", amount: 7, unit: "g" },
        { name: "Sugar", amount: 5, unit: "g" }
      ]
    }
  },
  {
    id: 715538,
    title: "Bruschetta Style Pork & Zucchini Salad",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
    imageType: "jpg",
    readyInMinutes: 25,
    servings: 4,
    sourceUrl: "https://spoonacular.com/bruschetta-style-pork-zucchini-salad-715538",
    summary: "Bruschetta Style Pork & Zucchini Salad is a vibrant, low-carb dish loaded with fresh vine-ripened tomatoes, sweet basil, and balsamic reduction.",
    cuisines: ["Italian", "Mediterranean"],
    dishTypes: ["salad", "lunch", "dinner"],
    diets: ["gluten free", "dairy free"],
    instructions: "1. Season pork chops with Italian herbs and grill for 5 minutes per side.\n2. Slice grilled zucchini into ribbons.\n3. Dice fresh tomatoes and toss with fresh basil, minced garlic, and balsamic glaze.\n4. Arrange pork slices over zucchini ribbons and spoon fresh tomato bruschetta over the top.",
    analyzedInstructions: [
      {
        name: "",
        steps: [
          { number: 1, step: "Season lean pork tenderloin with sea salt, cracked black pepper, and oregano." },
          { number: 2, step: "Sear in a cast-iron skillet for 4-5 minutes per side until nicely browned." },
          { number: 3, step: "Shave zucchini into ribbons using a mandoline or vegetable peeler." },
          { number: 4, step: "Toss diced heirloom tomatoes with extra virgin olive oil, minced garlic, and fresh basil." },
          { number: 5, step: "Slice pork, plate over zucchini, and top with tomato mixture and aged balsamic drizzle." }
        ]
      }
    ],
    vegetarian: false,
    vegan: false,
    glutenFree: true,
    dairyFree: true,
    veryHealthy: true,
    cheap: false,
    veryPopular: true,
    sustainable: false,
    lowFodmap: false,
    weightWatcherSmartPoints: 10,
    gaps: "no",
    preparationMinutes: 10,
    cookingMinutes: 15,
    aggregateLikes: 289,
    healthScore: 94,
    creditsText: "Chef Elena Vance",
    sourceName: "Culinary Canvas Kitchen",
    pricePerServing: 3.20,
    spoonacularScore: 89,
    extendedIngredients: [
      { name: "pork tenderloin", amount: 450, unit: "g", nameClean: "pork" },
      { name: "medium zucchini", amount: 2, unit: "whole", nameClean: "zucchini" },
      { name: "roma tomatoes", amount: 3, unit: "medium", nameClean: "tomatoes" },
      { name: "fresh basil leaves", amount: 0.25, unit: "cup", nameClean: "basil" },
      { name: "balsamic glaze", amount: 2, unit: "tbsp", nameClean: "balsamic vinegar" },
      { name: "extra virgin olive oil", amount: 2, unit: "tbsp", nameClean: "olive oil" }
    ],
    nutrition: {
      nutrients: [
        { name: "Calories", amount: 340, unit: "kcal" },
        { name: "Protein", amount: 36, unit: "g" },
        { name: "Fat", amount: 14, unit: "g" },
        { name: "Carbohydrates", amount: 16, unit: "g" },
        { name: "Fiber", amount: 4, unit: "g" },
        { name: "Sugar", amount: 9, unit: "g" }
      ]
    }
  },
  {
    id: 644387,
    title: "Garlic Butter Pan-Seared Salmon with Asparagus",
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=800&q=80",
    imageType: "jpg",
    readyInMinutes: 20,
    servings: 2,
    sourceUrl: "https://spoonacular.com/garlic-butter-pan-seared-salmon-644387",
    summary: "Crispy skin, tender flaky salmon basted in rich lemon-garlic butter alongside tender crisp asparagus. High in Omega-3 fatty acids and keto-friendly.",
    cuisines: ["American", "French"],
    dishTypes: ["dinner", "main course"],
    diets: ["gluten free", "ketogenic", "pescatarian"],
    instructions: "1. Pat salmon dry and season generously with salt and pepper.\n2. Heat olive oil in skillet over medium-high heat. Sear salmon skin-side down for 4 minutes.\n3. Flip salmon, add butter, garlic, and asparagus to the pan.\n4. Baste salmon with melted garlic butter for 3-4 minutes until cooked through.",
    analyzedInstructions: [
      {
        name: "",
        steps: [
          { number: 1, step: "Pat salmon fillets completely dry with paper towels; season both sides with sea salt and cracked black pepper." },
          { number: 2, step: "Heat 1 tbsp olive oil in a stainless steel or cast iron skillet over medium-high heat until shimmering." },
          { number: 3, step: "Place salmon skin-side down and press gently. Cook undisturbed for 4-5 minutes until skin is golden and crispy." },
          { number: 4, step: "Flip fillets, reduce heat to medium. Add butter, crushed garlic cloves, fresh thyme, and trimmed asparagus to pan." },
          { number: 5, step: "Spoon foaming butter continuously over salmon for 3 minutes. Squeeze fresh lemon juice and serve immediately." }
        ]
      }
    ],
    vegetarian: false,
    vegan: false,
    glutenFree: true,
    dairyFree: false,
    veryHealthy: true,
    cheap: false,
    veryPopular: true,
    sustainable: true,
    lowFodmap: false,
    weightWatcherSmartPoints: 8,
    gaps: "no",
    preparationMinutes: 5,
    cookingMinutes: 15,
    aggregateLikes: 612,
    healthScore: 96,
    creditsText: "Chef David Chen",
    sourceName: "Seafood Gourmet",
    pricePerServing: 5.50,
    spoonacularScore: 95,
    extendedIngredients: [
      { name: "wild salmon fillets", amount: 2, unit: "fillets (6 oz each)", nameClean: "salmon" },
      { name: "fresh asparagus, trimmed", amount: 1, unit: "bunch", nameClean: "asparagus" },
      { name: "unsalted grass-fed butter", amount: 3, unit: "tbsp", nameClean: "butter" },
      { name: "garlic cloves, crushed", amount: 4, unit: "cloves", nameClean: "garlic" },
      { name: "fresh lemon juice", amount: 1, unit: "lemon", nameClean: "lemon" },
      { name: "fresh thyme sprigs", amount: 3, unit: "sprigs", nameClean: "thyme" }
    ],
    nutrition: {
      nutrients: [
        { name: "Calories", amount: 440, unit: "kcal" },
        { name: "Protein", amount: 42, unit: "g" },
        { name: "Fat", amount: 28, unit: "g" },
        { name: "Carbohydrates", amount: 6, unit: "g" },
        { name: "Fiber", amount: 3, unit: "g" },
        { name: "Sugar", amount: 2, unit: "g" }
      ]
    }
  },
  {
    id: 640062,
    title: "Authentic Thai Green Curry with Tofu & Crisp Veggies",
    image: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&w=800&q=80",
    imageType: "jpg",
    readyInMinutes: 30,
    servings: 4,
    sourceUrl: "https://spoonacular.com/thai-green-curry-tofu-640062",
    summary: "Fragrant coconut green curry infused with lemongrass, kaffir lime, crispy pressed tofu, bamboo shoots, and Thai sweet basil.",
    cuisines: ["Thai", "Asian"],
    dishTypes: ["main course", "dinner", "soup"],
    diets: ["vegan", "vegetarian", "gluten free", "dairy free"],
    instructions: "1. Press tofu and cube into bite-sized pieces. Pan-fry until golden.\n2. Sauté green curry paste in coconut cream until fragrant.\n3. Pour in remaining coconut milk, add bell peppers, bamboo shoots, and snap peas.\n4. Simmer for 10 minutes. Stir in fried tofu, kaffir lime leaves, and fresh Thai basil.",
    analyzedInstructions: [
      {
        name: "",
        steps: [
          { number: 1, step: "Cut extra-firm tofu into 1-inch cubes and pan fry in sesame oil until golden on all sides." },
          { number: 2, step: "In a wok, heat 3 tbsp coconut milk and fry green curry paste for 2 minutes until aromatic oil separates." },
          { number: 3, step: "Add remainder of coconut milk, vegetable broth, and bring to a gentle simmer." },
          { number: 4, step: "Add sliced bell peppers, sugar snap peas, and bamboo shoots; simmer for 6 minutes." },
          { number: 5, step: "Stir in tofu, soy sauce, lime juice, and generous handful of fresh Thai basil. Serve with jasmine rice." }
        ]
      }
    ],
    vegetarian: true,
    vegan: true,
    glutenFree: true,
    dairyFree: true,
    veryHealthy: true,
    cheap: true,
    veryPopular: true,
    sustainable: true,
    lowFodmap: false,
    weightWatcherSmartPoints: 12,
    gaps: "no",
    preparationMinutes: 10,
    cookingMinutes: 20,
    aggregateLikes: 530,
    healthScore: 90,
    creditsText: "Chef Somchai Prasert",
    sourceName: "Bangkok Street Kitchen",
    pricePerServing: 2.10,
    spoonacularScore: 93,
    extendedIngredients: [
      { name: "extra firm tofu", amount: 400, unit: "g", nameClean: "tofu" },
      { name: "coconut milk", amount: 1, unit: "can (400ml)", nameClean: "coconut milk" },
      { name: "Thai green curry paste", amount: 3, unit: "tbsp", nameClean: "curry paste" },
      { name: "sugar snap peas", amount: 1.5, unit: "cups", nameClean: "snap peas" },
      { name: "red bell pepper, sliced", amount: 1, unit: "medium", nameClean: "bell pepper" },
      { name: "Thai sweet basil", amount: 1, unit: "cup", nameClean: "thai basil" },
      { name: "lime juice", amount: 1, unit: "tbsp", nameClean: "lime" }
    ],
    nutrition: {
      nutrients: [
        { name: "Calories", amount: 380, unit: "kcal" },
        { name: "Protein", amount: 16, unit: "g" },
        { name: "Fat", amount: 26, unit: "g" },
        { name: "Carbohydrates", amount: 18, unit: "g" },
        { name: "Fiber", amount: 5, unit: "g" },
        { name: "Sugar", amount: 6, unit: "g" }
      ]
    }
  },
  {
    id: 638604,
    title: "Classic Shakshuka with Feta & Sourdough",
    image: "https://images.unsplash.com/photo-1590412200988-a436970781fa?auto=format&fit=crop&w=800&q=80",
    imageType: "jpg",
    readyInMinutes: 25,
    servings: 3,
    sourceUrl: "https://spoonacular.com/classic-shakshuka-feta-638604",
    summary: "Gently poached eggs in a simmering, spiced sauce of crushed tomatoes, roasted bell peppers, cumin, paprika, and creamy crumbled feta cheese.",
    cuisines: ["Middle Eastern", "Mediterranean"],
    dishTypes: ["breakfast", "brunch", "lunch", "dinner"],
    diets: ["vegetarian"],
    instructions: "1. Sauté onions, garlic, and bell peppers in olive oil until soft.\n2. Add spices (cumin, paprika, chili) and toast for 1 minute.\n3. Pour in crushed tomatoes and simmer until thick sauce forms.\n4. Create 4 small wells in the sauce and crack eggs directly in.\n5. Cover and simmer 5-7 minutes until egg whites are set. Top with crumbled feta and cilantro.",
    analyzedInstructions: [
      {
        name: "",
        steps: [
          { number: 1, step: "Heat extra virgin olive oil in a deep skillet. Add chopped onion and bell peppers; sauté for 7 minutes." },
          { number: 2, step: "Add minced garlic, ground cumin, smoked paprika, and red pepper flakes; stir until fragrant." },
          { number: 3, step: "Pour in whole canned San Marzano tomatoes, crush with wooden spoon, and simmer on medium-low for 10 minutes." },
          { number: 4, step: "Make indentations in the bubbling sauce and gently crack eggs into each well." },
          { number: 5, step: "Cover with a lid and cook 5-8 minutes until whites are firm but yolks remain runny. Crumble feta and garnish with fresh parsley." }
        ]
      }
    ],
    vegetarian: true,
    vegan: false,
    glutenFree: false,
    dairyFree: false,
    veryHealthy: true,
    cheap: true,
    veryPopular: true,
    sustainable: false,
    lowFodmap: false,
    weightWatcherSmartPoints: 7,
    gaps: "no",
    preparationMinutes: 8,
    cookingMinutes: 17,
    aggregateLikes: 780,
    healthScore: 89,
    creditsText: "Chef Yasmin Al-Hassan",
    sourceName: "Mediterranean Delights",
    pricePerServing: 1.60,
    spoonacularScore: 94,
    extendedIngredients: [
      { name: "free-range eggs", amount: 4, unit: "large", nameClean: "eggs" },
      { name: "San Marzano canned tomatoes", amount: 1, unit: "can (28 oz)", nameClean: "tomatoes" },
      { name: "red bell pepper", amount: 1, unit: "diced", nameClean: "bell pepper" },
      { name: "feta cheese", amount: 75, unit: "g", nameClean: "feta" },
      { name: "ground cumin", amount: 1, unit: "tsp", nameClean: "cumin" },
      { name: "smoked paprika", amount: 1, unit: "tsp", nameClean: "paprika" },
      { name: "fresh cilantro / parsley", amount: 0.25, unit: "cup", nameClean: "cilantro" }
    ],
    nutrition: {
      nutrients: [
        { name: "Calories", amount: 290, unit: "kcal" },
        { name: "Protein", amount: 18, unit: "g" },
        { name: "Fat", amount: 17, unit: "g" },
        { name: "Carbohydrates", amount: 18, unit: "g" },
        { name: "Fiber", amount: 5, unit: "g" },
        { name: "Sugar", amount: 9, unit: "g" }
      ]
    }
  },
  {
    id: 654959,
    title: "Rich Dark Chocolate Lava Cakes with Berry Coulis",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80",
    imageType: "jpg",
    readyInMinutes: 25,
    servings: 4,
    sourceUrl: "https://spoonacular.com/chocolate-lava-cakes-654959",
    summary: "Individual decadent chocolate cakes with warm, molten fudge centers. Decadent dessert ready in under 30 minutes.",
    cuisines: ["French", "European"],
    dishTypes: ["dessert"],
    diets: ["vegetarian"],
    instructions: "1. Preheat oven to 425°F (220°C). Butter and cocoa powder 4 ramekins.\n2. Melt dark chocolate and butter together until silky smooth.\n3. Whisk eggs, yolks, and powdered sugar until pale. Fold into chocolate with flour.\n4. Divide into ramekins and bake for 12-14 minutes until edges are set but center jiggles.\n5. Invert onto plates and dust with powdered sugar.",
    analyzedInstructions: [
      {
        name: "",
        steps: [
          { number: 1, step: "Preheat oven to 425°F. Grease 4 ramekins with butter and dust thoroughly with cocoa powder." },
          { number: 2, step: "Melt 70% dark chocolate and unsalted butter in a heatproof bowl set over simmering water." },
          { number: 3, step: "In a separate bowl, whisk whole eggs, egg yolks, and confectioner's sugar until thick and pale yellow." },
          { number: 4, step: "Fold chocolate mixture and 2 tbsp all-purpose flour into eggs until just combined." },
          { number: 5, step: "Bake for 12 minutes. Run a knife around edges, flip onto plates, and serve immediately with fresh raspberries." }
        ]
      }
    ],
    vegetarian: true,
    vegan: false,
    glutenFree: false,
    dairyFree: false,
    veryHealthy: false,
    cheap: false,
    veryPopular: true,
    sustainable: false,
    lowFodmap: false,
    weightWatcherSmartPoints: 18,
    gaps: "no",
    preparationMinutes: 12,
    cookingMinutes: 13,
    aggregateLikes: 940,
    healthScore: 55,
    creditsText: "Chef Pierre Dubois",
    sourceName: "Parisian Bakery",
    pricePerServing: 2.40,
    spoonacularScore: 88,
    extendedIngredients: [
      { name: "70% bittersweet dark chocolate", amount: 170, unit: "g", nameClean: "dark chocolate" },
      { name: "unsalted butter", amount: 0.5, unit: "cup", nameClean: "butter" },
      { name: "large eggs", amount: 2, unit: "whole", nameClean: "eggs" },
      { name: "large egg yolks", amount: 2, unit: "yolks", nameClean: "egg yolk" },
      { name: "powdered sugar", amount: 0.5, unit: "cup", nameClean: "powdered sugar" },
      { name: "all-purpose flour", amount: 2, unit: "tbsp", nameClean: "flour" },
      { name: "fresh raspberries", amount: 1, unit: "cup", nameClean: "raspberries" }
    ],
    nutrition: {
      nutrients: [
        { name: "Calories", amount: 460, unit: "kcal" },
        { name: "Protein", amount: 7, unit: "g" },
        { name: "Fat", amount: 32, unit: "g" },
        { name: "Carbohydrates", amount: 41, unit: "g" },
        { name: "Fiber", amount: 4, unit: "g" },
        { name: "Sugar", amount: 31, unit: "g" }
      ]
    }
  },
  {
    id: 637876,
    title: "Street Style Crispy Chicken Tacos with Pico & Lime Crema",
    image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=800&q=80",
    imageType: "jpg",
    readyInMinutes: 30,
    servings: 4,
    sourceUrl: "https://spoonacular.com/crispy-chicken-tacos-637876",
    summary: "Spiced marinated chicken in warm corn tortillas, topped with crunchy shredded cabbage, fresh pico de gallo, and tangy cilantro lime crema.",
    cuisines: ["Mexican"],
    dishTypes: ["lunch", "dinner", "main course"],
    diets: ["gluten free"],
    instructions: "1. Marinate chicken in lime juice, cumin, smoked paprika, garlic, and chili powder.\n2. Grill or pan-sear chicken over high heat for 6-8 minutes until charred and cooked through. Dice.\n3. Warm corn tortillas on a dry skillet.\n4. Assemble tacos with chicken, cabbage, pico de gallo, cotija cheese, and cilantro lime crema.",
    analyzedInstructions: [
      {
        name: "",
        steps: [
          { number: 1, step: "Mix cumin, chipotle chili powder, garlic powder, lime juice, and olive oil. Marinate chicken for 15 minutes." },
          { number: 2, step: "Cook chicken in a hot skillet for 6-8 minutes until charred on edges. Rest for 5 minutes, then chop into bite-sized pieces." },
          { number: 3, step: "Whisk sour cream with lime zest, lime juice, and finely chopped cilantro for the crema." },
          { number: 4, step: "Char corn tortillas over an open flame or in a hot dry skillet for 30 seconds per side." },
          { number: 5, step: "Layer tacos with spiced chicken, crisp cabbage, fresh tomato pico de gallo, and drizzle with lime crema." }
        ]
      }
    ],
    vegetarian: false,
    vegan: false,
    glutenFree: true,
    dairyFree: false,
    veryHealthy: true,
    cheap: true,
    veryPopular: true,
    sustainable: false,
    lowFodmap: false,
    weightWatcherSmartPoints: 11,
    gaps: "no",
    preparationMinutes: 15,
    cookingMinutes: 15,
    aggregateLikes: 820,
    healthScore: 86,
    creditsText: "Chef Carlos Mendez",
    sourceName: "Oaxaca Taqueria",
    pricePerServing: 2.80,
    spoonacularScore: 94,
    extendedIngredients: [
      { name: "boneless chicken thighs", amount: 500, unit: "g", nameClean: "chicken" },
      { name: "corn tortillas", amount: 8, unit: "tortillas", nameClean: "tortillas" },
      { name: "shredded red cabbage", amount: 1.5, unit: "cups", nameClean: "cabbage" },
      { name: "pico de gallo", amount: 1, unit: "cup", nameClean: "salsa" },
      { name: "sour cream / Mexican crema", amount: 0.5, unit: "cup", nameClean: "sour cream" },
      { name: "fresh limes", amount: 2, unit: "whole", nameClean: "lime" },
      { name: "cotija or feta cheese", amount: 0.5, unit: "cup", nameClean: "cotija cheese" }
    ],
    nutrition: {
      nutrients: [
        { name: "Calories", amount: 480, unit: "kcal" },
        { name: "Protein", amount: 34, unit: "g" },
        { name: "Fat", amount: 20, unit: "g" },
        { name: "Carbohydrates", amount: 42, unit: "g" },
        { name: "Fiber", amount: 6, unit: "g" },
        { name: "Sugar", amount: 4, unit: "g" }
      ]
    }
  },
  {
    id: 642582,
    title: "Creamy Coconut Butter Chicken (Murgh Makhani)",
    image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=800&q=80",
    imageType: "jpg",
    readyInMinutes: 40,
    servings: 4,
    sourceUrl: "https://spoonacular.com/butter-chicken-642582",
    summary: "Tender yogurt-marinated chicken simmered in an aromatic spiced tomato, butter, and cream sauce. Perfect with warm garlic naan.",
    cuisines: ["Indian", "Asian"],
    dishTypes: ["dinner", "main course", "curry"],
    diets: ["gluten free"],
    instructions: "1. Marinate chicken in yogurt, ginger-garlic paste, garam masala, and chili powder for 30 minutes.\n2. Sear chicken pieces in butter until lightly charred.\n3. Make gravy: sauté onions, pureed tomatoes, cashews, cardamom, and fenugreek leaves.\n4. Blend gravy until velvet smooth, simmer with chicken and cream for 10 minutes.",
    analyzedInstructions: [
      {
        name: "",
        steps: [
          { number: 1, step: "Marinate diced chicken breast in Greek yogurt, garam masala, turmeric, Kashmiri chili powder, and minced ginger-garlic." },
          { number: 2, step: "Sear marinated chicken in 2 tbsp butter in a hot pan until 80% cooked and golden; set aside." },
          { number: 3, step: "In the same pan, cook chopped onions, garlic, tomato puree, and soaked cashews for 12 minutes." },
          { number: 4, step: "Blend the sauce until completely smooth and return to the skillet." },
          { number: 5, step: "Add seared chicken, heavy cream, kasuri methi (fenugreek leaves), and 1 tbsp butter. Simmer for 8 minutes." }
        ]
      }
    ],
    vegetarian: false,
    vegan: false,
    glutenFree: true,
    dairyFree: false,
    veryHealthy: false,
    cheap: false,
    veryPopular: true,
    sustainable: false,
    lowFodmap: false,
    weightWatcherSmartPoints: 14,
    gaps: "no",
    preparationMinutes: 20,
    cookingMinutes: 20,
    aggregateLikes: 1120,
    healthScore: 82,
    creditsText: "Chef Priya Sharma",
    sourceName: "Spice Symphony",
    pricePerServing: 3.50,
    spoonacularScore: 96,
    extendedIngredients: [
      { name: "boneless chicken breast", amount: 600, unit: "g", nameClean: "chicken" },
      { name: "tomato puree", amount: 2, unit: "cups", nameClean: "tomato puree" },
      { name: "heavy whipping cream", amount: 0.5, unit: "cup", nameClean: "cream" },
      { name: "unsalted butter", amount: 3, unit: "tbsp", nameClean: "butter" },
      { name: "garam masala", amount: 1.5, unit: "tsp", nameClean: "garam masala" },
      { name: "ginger garlic paste", amount: 2, unit: "tbsp", nameClean: "ginger garlic" },
      { name: "kasuri methi", amount: 1, unit: "tbsp", nameClean: "fenugreek leaves" }
    ],
    nutrition: {
      nutrients: [
        { name: "Calories", amount: 520, unit: "kcal" },
        { name: "Protein", amount: 44, unit: "g" },
        { name: "Fat", amount: 28, unit: "g" },
        { name: "Carbohydrates", amount: 14, unit: "g" },
        { name: "Fiber", amount: 3, unit: "g" },
        { name: "Sugar", amount: 7, unit: "g" }
      ]
    }
  }
]

export function getMockSearchResponse({
  query = "",
  cuisine = "",
  diet = "",
  type = "",
  maxReadyTime,
  number = 12,
  offset = 0,
}: {
  query?: string
  cuisine?: string
  diet?: string
  type?: string
  maxReadyTime?: number
  number?: number
  offset?: number
}): SearchResponse {
  let filtered = [...MOCK_RECIPES]

  if (query) {
    const q = query.toLowerCase()
    filtered = filtered.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.summary.toLowerCase().includes(q) ||
        r.cuisines.some((c) => c.toLowerCase().includes(q)) ||
        r.dishTypes.some((d) => d.toLowerCase().includes(q))
    )
  }

  if (cuisine) {
    const cuisines = cuisine.toLowerCase().split(",").map((c) => c.trim())
    filtered = filtered.filter((r) =>
      r.cuisines.some((c) => cuisines.includes(c.toLowerCase()))
    )
  }

  if (diet) {
    const diets = diet.toLowerCase().split(",").map((d) => d.trim())
    filtered = filtered.filter((r) =>
      diets.some((d) => {
        if (d === "vegetarian") return r.vegetarian
        if (d === "vegan") return r.vegan
        if (d === "gluten free" || d === "gluten-free") return r.glutenFree
        if (d === "dairy free" || d === "dairy-free") return r.dairyFree
        return r.diets.some((rd) => rd.toLowerCase().includes(d))
      })
    )
  }

  if (type) {
    const types = type.toLowerCase().split(",").map((t) => t.trim())
    filtered = filtered.filter((r) =>
      r.dishTypes.some((dt) => types.includes(dt.toLowerCase()))
    )
  }

  if (maxReadyTime) {
    filtered = filtered.filter((r) => r.readyInMinutes <= maxReadyTime)
  }

  if (filtered.length === 0 && !query) {
    filtered = [...MOCK_RECIPES]
  }

  const results: SearchResult[] = filtered.slice(offset, offset + number).map((r) => ({
    id: r.id,
    title: r.title,
    image: r.image,
    imageType: r.imageType,
    readyInMinutes: r.readyInMinutes,
    servings: r.servings,
    nutrition: r.nutrition,
  }))

  return {
    results,
    offset,
    number,
    totalResults: filtered.length,
  }
}

export function getMockRecipeById(id: number): Recipe | null {
  const found = MOCK_RECIPES.find((r) => r.id === id)
  if (found) return found
  const fallback = { ...MOCK_RECIPES[0], id }
  return fallback
}
