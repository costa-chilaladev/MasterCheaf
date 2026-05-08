

export const recipes = [
  {
    id: 60,
    name: "Ultimate Moist Chocolate Cake",
    description:
      "A rich, ultra-moist chocolate cake with deep cocoa flavor, perfect for celebrations or when you're craving something indulgent",
    images: [
      "recipe-0_Ultimate_Moist_Chocolate_Cake_60.webp",
      "recipe-1_Ultimate_Moist_Chocolate_Cake_60.webp"
    ]
  },

  {
    id: 61,
    name: "Fresh & Creamy Avocado Toast",
    description:
      "A simple yet delicious avocado toast topped with a fresh citrus touch, perfect for a healthy and quick breakfast",
    images: [
      "recipe-0_Fresh___Creamy_Avocado_Toast_61.webp",
      "recipe-1_Fresh___Creamy_Avocado_Toast_61.webp"
    ]
  },

  {
    id: 62,
    name: "Classic Crispy Grilled Cheese Sandwich",
    description:
      "Golden, buttery bread filled with perfectly melted cheese. A timeless comfort food that's quick, satisfying, and incredibly tasty",
    images: [
      "recipe-0_Classic_Crispy_Grilled_Cheese_Sandwich_62.webp",
      "recipe-1_Classic_Crispy_Grilled_Cheese_Sandwich_62.webp"
    ]
  },

  {
    id: 63,
    name: "Perfect Movie Night Popcorn Snack",
    description:
      "Light, fluffy popcorn with a buttery finish. The ultimate snack for movie nights or quick cravings",
    images: [
      "recipe-0_Perfect_Movie_Night_Popcorn_Snack_63.webp",
      "recipe-1_Perfect_Movie_Night_Popcorn_Snack_63.webp",
      "recipe-2_Perfect_Movie_Night_Popcorn_Snack_63.webp"
    ]
  },

  {
    id: 64,
    name: "Quick Homemade Fried Rice",
    description:
      "A fast and flavorful fried rice packed with vegetables and savory seasoning. Perfect for using leftover rice and making a satisfying meal in minutes",
    images: [
      "recipe-0_Quick_Homemade_Fried_Rice_64.webp",
      "recipe-1_Quick_Homemade_Fried_Rice_64.webp",
      "recipe-2_Quick_Homemade_Fried_Rice_64.webp"
    ]
  },

  {
    id: 66,
    name: "Fresh Mediterranean Quinoa Salad",
    description:
      "A vibrant quinoa salad packed with crisp vegetables and perfect for healthy lunches or quick dinners",
    images: [
      "recipe-0_Fresh_Mediterranean_Quinoa_Salad_66.webp",
      "recipe-1_Fresh_Mediterranean_Quinoa_Salad_66.webp"
    ]
  }
];

export const ingredients = [
  { id: 1, name: "All-purpose flour" },
  { id: 2, name: "Sugar" },
  { id: 3, name: "Cocoa powder" },
  { id: 4, name: "Eggs" },
  { id: 5, name: "Milk" },
  { id: 6, name: "Vegetable oil" },
  { id: 7, name: "Baking powder" },
  { id: 8, name: "Salt" },
  { id: 9, name: "Vanilla extract" },
  { id: 10, name: "Butter" },
  { id: 11, name: "Tomatoes" },
  { id: 12, name: "Avocado" },
  { id: 13, name: "Cheese" },
  { id: 14, name: "Garlic" },
  { id: 15, name: "Rice" },
  { id: 16, name: "Chicken" },
  { id: 17, name: "Olive oil" },
  { id: 18, name: "Onion" },
  { id: 19, name: "Black pepper" },
  { id: 20, name: "Parsley" }
];

export const categories = [
  { id: 1, type: "category", name: "Breakfast" },
  { id: 2, type: "category", name: "Lunch" },
  { id: 3, type: "category", name: "Dinner" },
  { id: 4, type: "category", name: "Dessert" },
  { id: 5, type: "category", name: "Snack" },
  { id: 6, type: "category", name: "Vegetarian" },
  { id: 7, type: "category", name: "Vegan" },
  { id: 8, type: "category", name: "Comfort Food" },
  { id: 9, type: "category", name: "Healthy" },
  { id: 10, type: "category", name: "Party" }
];

export const measurements = [
  { id: 1, name: "gram" },
  { id: 2, name: "kilogram" },
  { id: 3, name: "milliliter (ml)" },
  { id: 4, name: "liter (l)" },
  { id: 5, name: "cup" },
  { id: 6, name: "tablespoon" },
  { id: 7, name: "teaspoon" },
  { id: 8, name: "unit" },
  { id: 9, name: "pinch" },
  { id: 10, name: "slice" }
];


export const recipeDetails = [
  {
    recipeInfo: {
      id: 60,

      name: "Ultimate Moist Chocolate Cake",

      description:
        "A rich, ultra-moist chocolate cake with deep cocoa flavor and a soft, melt-in-your-mouth texture. Perfect for celebrations or when you're craving something indulgent.",

      images: [
        "recipe-0_Ultimate_Moist_Chocolate_Cake_60.webp",
        "recipe-1_Ultimate_Moist_Chocolate_Cake_60.webp"
      ],

      ingredients: [
        {
          number: 200,
          ingredient_name: "All-purpose flour",
          measurement_name: "gram"
        },
        {
          number: 200,
          ingredient_name: "Sugar",
          measurement_name: "gram"
        },
        {
          number: 75,
          ingredient_name: "Cocoa powder",
          measurement_name: "gram"
        },
        {
          number: 2,
          ingredient_name: "Eggs",
          measurement_name: "unit"
        },
        {
          number: 240,
          ingredient_name: "Milk",
          measurement_name: "milliliter (ml)"
        },
        {
          number: 120,
          ingredient_name: "Vegetable oil",
          measurement_name: "milliliter (ml)"
        },
        {
          number: 10,
          ingredient_name: "Baking powder",
          measurement_name: "gram"
        },
        {
          number: 1,
          ingredient_name: "Salt",
          measurement_name: "pinch"
        },
        {
          number: 5,
          ingredient_name: "Vanilla extract",
          measurement_name: "milliliter (ml)"
        },
        {
          number: 100,
          ingredient_name: "Hot water",
          measurement_name: "milliliter (ml)"
        }
      ],

      preparation_steps: [
        {
          step_number: 1,
          description: "Preheat the oven to 180°C"
        },
        {
          step_number: 2,
          description:
            "In a bowl, mix flour, sugar, cocoa powder, baking powder, and salt"
        },
        {
          step_number: 3,
          description:
            "Add eggs, milk, oil, and vanilla extract. Mix until smooth"
        },
        {
          step_number: 4,
          description: "Slowly add hot water and stir well"
        },
        {
          step_number: 5,
          description: "Pour the batter into a greased pan"
        },
        {
          step_number: 6,
          description:
            "Bake for 30–35 minutes or until a toothpick comes out clean"
        },
        {
          step_number: 7,
          description: "Let it cool before serving"
        }
      ],

      comments: [],

      state: ["save"]
    },

    categories: [
      "Sweet",
      "Dessert",
      "Party",
      "Everyday",
      "Vegetarian"
    ]
  },

  {
    recipeInfo: {
      id: 61,

      name: "Fresh & Creamy Avocado Toast",

      description:
        "A simple yet delicious avocado toast topped with a creamy spread and a hint of citrus, perfect for a healthy and quick breakfast.",

      images: [
        "recipe-0_Fresh___Creamy_Avocado_Toast_61.webp",
        "recipe-1_Fresh___Creamy_Avocado_Toast_61.webp"
      ],

      ingredients: [
        {
          number: 2,
          ingredient_name: "Bread",
          measurement_name: "slice"
        },
        {
          number: 1,
          ingredient_name: "Avocado",
          measurement_name: "unit"
        },
        {
          number: 5,
          ingredient_name: "Lemon juice",
          measurement_name: "milliliter (ml)"
        },
        {
          number: 1,
          ingredient_name: "Salt",
          measurement_name: "pinch"
        },
        {
          number: 1,
          ingredient_name: "Black pepper",
          measurement_name: "pinch"
        },
        {
          number: 5,
          ingredient_name: "Olive oil",
          measurement_name: "milliliter (ml)"
        }
      ],

      preparation_steps: [
        {
          step_number: 1,
          description: "Toast the bread slices until golden and crispy"
        },
        {
          step_number: 2,
          description: "Mash the avocado in a bowl"
        },
        {
          step_number: 3,
          description:
            "Add lemon juice, salt, and black pepper. Mix well"
        },
        {
          step_number: 4,
          description: "Spread the avocado mixture on the toast"
        },
        {
          step_number: 5,
          description:
            "Drizzle olive oil and sprinkle chili flakes on top"
        },
        {
          step_number: 6,
          description: "Serve immediately"
        }
      ],

      comments: [],

      state: ["save"]
    },

    categories: [
      "Savory",
      "Breakfast",
      "Everyday",
      "Healthy",
      "Quick",
      "Vegan"
    ]
  },

  {
    recipeInfo: {
      id: 62,

      name: "Classic Crispy Grilled Cheese Sandwich",

      description:
        "Golden, buttery bread filled with perfectly melted cheese. A timeless comfort food that's quick, satisfying, and incredibly tasty.",

      images: [
        "recipe-0_Classic_Crispy_Grilled_Cheese_Sandwich_62.webp",
        "recipe-1_Classic_Crispy_Grilled_Cheese_Sandwich_62.webp"
      ],

      ingredients: [
        {
          number: 2,
          ingredient_name: "Bread",
          measurement_name: "slice"
        },
        {
          number: 50,
          ingredient_name: "Cheddar cheese",
          measurement_name: "gram"
        },
        {
          number: 20,
          ingredient_name: "Butter",
          measurement_name: "gram"
        }
      ],

      preparation_steps: [
        {
          step_number: 1,
          description:
            "Spread butter on one side of each bread slice"
        },
        {
          step_number: 2,
          description:
            "Place cheese between the unbuttered sides"
        },
        {
          step_number: 3,
          description: "Heat a pan over medium heat"
        },
        {
          step_number: 4,
          description:
            "Cook the sandwich until golden brown on one side"
        },
        {
          step_number: 5,
          description:
            "Flip and cook the other side until the cheese melts"
        },
        {
          step_number: 6,
          description: "Remove, slice, and serve hot"
        }
      ],

      comments: [],

      state: ["save"]
    },

    categories: [
      "Savory",
      "Lunch",
      "Snack",
      "Everyday",
      "Quick",
      "Vegetarian"
    ]
  },

  {
    recipeInfo: {
      id: 63,

      name: "Perfect Movie Night Popcorn Snack",

      description:
        "Light, fluffy popcorn with a buttery finish. The ultimate snack for movie nights or quick cravings.",

      images: [
        "recipe-0_Perfect_Movie_Night_Popcorn_Snack_63.webp",
        "recipe-1_Perfect_Movie_Night_Popcorn_Snack_63.webp"
      ],

      ingredients: [
        {
          number: 100,
          ingredient_name: "Popcorn kernels",
          measurement_name: "gram"
        },
        {
          number: 30,
          ingredient_name: "Vegetable oil",
          measurement_name: "milliliter (ml)"
        },
        {
          number: 1,
          ingredient_name: "Salt",
          measurement_name: "pinch"
        },
        {
          number: 1,
          ingredient_name: "Butter",
          measurement_name: "to taste"
        }
      ],

      preparation_steps: [
        {
          step_number: 1,
          description:
            "Heat oil in a large pot over medium heat"
        },
        {
          step_number: 2,
          description:
            "Add popcorn kernels and cover with a lid"
        },
        {
          step_number: 3,
          description:
            "Shake the pot occasionally while cooking"
        },
        {
          step_number: 4,
          description:
            "Once popping slows down, remove from heat"
        },
        {
          step_number: 5,
          description:
            "Season with salt and butter if desired"
        },
        {
          step_number: 6,
          description: "Serve warm"
        }
      ],

      comments: [],

      state: ["save"]
    },

    categories: [
      "Savory",
      "Snack",
      "Party",
      "Everyday",
      "Quick",
      "Vegan"
    ]
  },

  {
    recipeInfo: {
      id: 64,

      name: "Quick Homemade Fried Rice",

      description:
        "A fast and flavorful fried rice packed with vegetables and savory seasoning. Perfect for using leftover rice and making a satisfying meal in minutes.",

      images: [
        "recipe-0_Quick_Homemade_Fried_Rice_64.webp",
        "recipe-1_Quick_Homemade_Fried_Rice_64.webp"
      ],

      ingredients: [
        {
          number: 300,
          ingredient_name: "Cooked rice",
          measurement_name: "gram"
        },
        {
          number: 2,
          ingredient_name: "Eggs",
          measurement_name: "unit"
        },
        {
          number: 100,
          ingredient_name: "Mixed vegetables",
          measurement_name: "gram"
        },
        {
          number: 50,
          ingredient_name: "Green onions",
          measurement_name: "gram"
        },
        {
          number: 30,
          ingredient_name: "Soy sauce",
          measurement_name: "milliliter (ml)"
        },
        {
          number: 15,
          ingredient_name: "Vegetable oil",
          measurement_name: "milliliter (ml)"
        },
        {
          number: 1,
          ingredient_name: "Salt",
          measurement_name: "pinch"
        },
        {
          number: 1,
          ingredient_name: "Black pepper",
          measurement_name: "pinch"
        }
      ],

      preparation_steps: [
        {
          step_number: 1,
          description:
            "Heat oil in a pan or wok over medium-high heat"
        },
        {
          step_number: 2,
          description: "Scramble the eggs and set aside"
        },
        {
          step_number: 3,
          description:
            "Add vegetables and cook for 2–3 minutes"
        },
        {
          step_number: 4,
          description: "Add cooked rice and stir well"
        },
        {
          step_number: 5,
          description:
            "Pour soy sauce and mix evenly"
        },
        {
          step_number: 6,
          description:
            "Add scrambled eggs back into the pan"
        },
        {
          step_number: 7,
          description:
            "Season with salt and black pepper"
        },
        {
          step_number: 8,
          description:
            "Garnish with green onions and serve hot"
        }
      ],

      comments: [],

      state: ["save"]
    },

    categories: [
      "Savory",
      "Lunch",
      "Dinner",
      "Everyday",
      "Quick"
    ]
  },

  {
    recipeInfo: {
      id: 65,

      name: "Fresh Mediterranean Quinoa Salad",

      description:
        "A vibrant quinoa salad packed with crisp vegetables, fresh herbs, and a zesty lemon dressing. Light, nutritious, and perfect for healthy lunches or quick dinners.",

      images: [
        "recipe-0_Fresh_Mediterranean_Quinoa_Salad_65.webp",
        "recipe-1_Fresh_Mediterranean_Quinoa_Salad_65.webp"
      ],

      ingredients: [
        {
          number: 200,
          ingredient_name: "Quinoa",
          measurement_name: "gram"
        },
        {
          number: 150,
          ingredient_name: "Cherry tomatoes",
          measurement_name: "gram"
        },
        {
          number: 100,
          ingredient_name: "Cucumber",
          measurement_name: "gram"
        },
        {
          number: 50,
          ingredient_name: "Red onion",
          measurement_name: "gram"
        },
        {
          number: 30,
          ingredient_name: "Feta cheese",
          measurement_name: "gram"
        },
        {
          number: 15,
          ingredient_name: "Olive oil",
          measurement_name: "milliliter (ml)"
        },
        {
          number: 10,
          ingredient_name: "Lemon juice",
          measurement_name: "milliliter (ml)"
        },
        {
          number: 10,
          ingredient_name: "Fresh parsley",
          measurement_name: "gram"
        },
        {
          number: 1,
          ingredient_name: "Salt",
          measurement_name: "pinch"
        },
        {
          number: 1,
          ingredient_name: "Black pepper",
          measurement_name: "pinch"
        }
      ],

      preparation_steps: [
        {
          step_number: 1,
          description:
            "Rinse the quinoa under cold water"
        },
        {
          step_number: 2,
          description:
            "Cook the quinoa according to package instructions and let it cool"
        },
        {
          step_number: 3,
          description:
            "Chop the cherry tomatoes, cucumber, and red onion into small pieces"
        },
        {
          step_number: 4,
          description:
            "In a large bowl, combine quinoa and chopped vegetables"
        },
        {
          step_number: 5,
          description:
            "Add feta cheese and fresh parsley"
        },
        {
          step_number: 6,
          description:
            "Drizzle olive oil and lemon juice over the salad"
        },
        {
          step_number: 7,
          description:
            "Season with salt and black pepper"
        },
        {
          step_number: 8,
          description:
            "Toss everything together until well combined"
        },
        {
          step_number: 9,
          description:
            "Serve chilled or at room temperature"
        }
      ],

      comments: [],

      state: ["save"]
    },

    categories: [
      "Savory",
      "Lunch",
      "Dinner",
      "Everyday",
      "Party",
      "Healthy",
      "Vegetarian",
      "Gluten-Free"
    ]
  }
];