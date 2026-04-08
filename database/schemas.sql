create database if not EXISTS mastercheaf_aoa;

use mastercheaf_aoa;

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

create table if not exists `recipes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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

insert into `users` (username, password_hash) values ('admin', '1234')

insert into `recipes` (name, description) values ('Pasta Carbonara', 'A classic Italian pasta dish with eggs, cheese, pancetta, and black pepper.');

insert into ingredients (name) values ('Pasta'), ('Eggs'), ('Cheese'), ('Pancetta'), ('Black Pepper');

insert into recipe_ingredients (recipe_id, ingredient_id) values (1, 1), (1, 2), (1, 3), (1, 4), (1, 5);

create table if not exists `images` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `recipe_id` int NOT NULL,
  `image_name` varchar(255) NOT NULL,
  FOREIGN KEY (`recipe_id`) REFERENCES `recipes`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

insert into images (recipe_id, image_name) values (1, 'pasta_carbonara.jpg'), (1, 'pasta_carbonara2.jpg');

delete from images where id = 1;