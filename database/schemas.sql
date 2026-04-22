create database if not EXISTS mastercheaf_aoa;

use mastercheaf_aoa;

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


