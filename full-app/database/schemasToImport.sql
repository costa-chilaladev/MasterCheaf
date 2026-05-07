CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL UNIQUE,
  `password_hash` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

create table if not exists `recipes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

alter table recipes add column user_id int(11) not null;
alter table recipes add foreign key (user_id) references users(id) on delete cascade;

create table if not exists `ingredients` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL UNIQUE,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT IGNORE INTO `ingredients` (`name`) VALUES 
('Salt'),
('Sugar'),
('Water'),
('Olive oil'),
('Vegetable oil'),
('Garlic'),
('Onion'),
('Tomato'),
('Flour'),
('Butter'),
('Milk'),
('Lemon'),
('Parsley'),
('Cilantro'),
('Basil'),
('Oregano'),
('Cinnamon'),
('Honey'),
('Vinegar'),
('Chicken breast'),
('Beef'),
('Carrot'),
('Potato'),
('Bell pepper'),
('Rice'),
('Baking powder'),
('Vanilla extract'),
('Yeast'),
('Cornstarch'),
('Ginger'),
('Soy sauce'),
('Baking soda'),
('Broth'),
('Mustard'),
('Ketchup');

INSERT IGNORE INTO `ingredients` (`name`) VALUES 
('Flour'),
('Turkey'),
('Cocoa powder'),
('Sugar'),
('Banana'),
('Egg'),
('Milk'),
('Chicken breast'),
('Butter'),
('Garlic'),
('Salt'),
('Pepper'),
('Bread'),
('Avocado'),
('Lemon juice'),
('Lentils'),
('Carrot'),
('Onion'),
('Vegetable broth'),
('Cheese'),
('Spaghetti'),
('Ground beef'),
('Tomato sauce'),
('Apple'),
('Orange'),
('Grapes'),
('Eggs'),
('Vegetables'),
('Whole turkey'),
('Herbs'),
('Quinoa'),
('Tomato'),
('Cucumber'),
('Olive oil'),
('Rice'),
('Soy sauce'),
('Frozen fruits'),
('Yogurt'),
('Honey'),
('Salmon'),
('Lemon'),
('Corn kernels');

create table if not exists `recipe_ingredients` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `recipe_id` int(11) NOT NULL,
  `ingredient_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`recipe_id`) REFERENCES `recipes`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`ingredient_id`) REFERENCES `ingredients`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

create table if not exists `images` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `recipe_id` int NOT NULL,
  `image_name` varchar(255) NOT NULL,
  FOREIGN KEY (`recipe_id`) REFERENCES `recipes`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

create table if not exists `preparation_steps` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `recipe_id` int NOT NULL,
  `step_number` int NOT NULL,
  `description` text NOT NULL,
  FOREIGN KEY (`recipe_id`) REFERENCES `recipes`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

create table if not exists `categorys` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `name` varchar(250) not null,
  `type` VARCHAR(50) not null
)

INSERT INTO `categorys` (`name`, `type`) VALUES
-- tipo de prato
('Sweet', 'type'),
('Savory', 'type'),
('Breakfast', 'meal'),
('Lunch', 'meal'),
('Dinner', 'meal'),
('Dessert', 'meal'),
('Snack', 'meal'),
('Christmas', 'occasion'),
('Party', 'occasion'),
('Everyday', 'occasion'),
('Healthy', 'attribute'),
('Quick', 'attribute'),
('Vegetarian', 'attribute'),
('Vegan', 'attribute'),
('Gluten-Free', 'attribute');

CREATE TABLE IF NOT EXISTS `recipe_categories` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `recipe_id` INT NOT NULL,
  `category_id` INT NOT NULL,

  FOREIGN KEY (`recipe_id`) REFERENCES `recipes`(`id`),
  FOREIGN KEY (`category_id`) REFERENCES `categorys`(`id`),

  UNIQUE (`recipe_id`, `category_id`)
);

ALTER TABLE recipe_categories
ADD CONSTRAINT recipe_categories_ibfk_1
FOREIGN KEY (recipe_id)
REFERENCES recipes(id)
ON DELETE CASCADE,

ADD CONSTRAINT recipe_categories_ibfk_2
FOREIGN KEY (category_id)
REFERENCES categorys(id)
ON DELETE CASCADE;

CREATE TABLE IF NOT EXISTS `measurements` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(50) NOT NULL
);

INSERT INTO `measurements` (`name`)
VALUES
('gram (g)'),
('kilogram (kg)'),
('milliliter (ml)'),
('liter (L)'),
('tablespoon (tbsp)'),
('teaspoon (tsp)'),
('cup'),
('unit'),
('to taste'),
('pinch');

INSERT INTO `measurements` (`name`)
VALUES
('slice');

alter table `recipe_ingredients` add column `number` int not null;
alter table `recipe_ingredients` add column `measurements_id` int not null; 

CREATE TABLE IF NOT EXISTS `user_recipe_interactions` (
  id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  recipe_id INT NOT NULL,
  user_id INT NOT NULL,
  type ENUM('save', 'favorite') NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  active BOOLEAN DEFAULT TRUE,

  CONSTRAINT recipe_user_relation UNIQUE (user_id, recipe_id, type)
);

CREATE TABLE IF NOT EXISTS `comments` (
  `id` int not null AUTO_INCREMENT PRIMARY KEY,
  `recipe_id` int not null,
  `user_id` int not null,
  `comment` text not null,
  `rate` DECIMAL(2, 1) not null,

  FOREIGN KEY (`recipe_id`) REFERENCES `recipes`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
)

alter table comments add column active BOOLEAN DEFAULT TRUE;
