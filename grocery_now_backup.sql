-- MySQL dump 10.13  Distrib 8.0.44, for Linux (x86_64)
--
-- Host: localhost    Database: grocery_now
-- ------------------------------------------------------
-- Server version	8.0.44-0ubuntu0.24.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cart_items`
--

DROP TABLE IF EXISTS `cart_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cart_id` int NOT NULL,
  `product_id` int unsigned NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `price_at_time` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `cart_id` (`cart_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `cart_items_ibfk_1` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `cart_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=192 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_items`
--

LOCK TABLES `cart_items` WRITE;
/*!40000 ALTER TABLE `cart_items` DISABLE KEYS */;
INSERT INTO `cart_items` VALUES (8,3,2,7,4.99,'2025-07-31 13:37:26','2025-10-10 11:05:23'),(9,3,4,2,967.00,'2025-07-31 17:34:30','2025-09-23 16:16:48'),(10,3,1,3,145.00,'2025-08-11 19:22:44','2025-10-10 11:05:20'),(17,6,4,2,967.00,'2025-10-15 06:17:29','2025-10-15 06:17:36'),(86,8,2,1,1000.00,'2025-10-31 12:16:00','2025-10-31 12:16:00'),(87,8,66,1,5000.00,'2025-10-31 12:20:33','2025-10-31 12:20:33'),(90,9,11,1,4000.00,'2025-10-31 12:38:48','2025-10-31 12:38:48'),(115,10,6,1,5000.00,'2025-11-02 18:00:00','2025-11-02 18:00:00'),(154,5,67,1,2000.00,'2025-11-20 07:46:40','2025-11-20 07:46:40'),(155,5,147,1,3500.00,'2025-11-20 07:46:43','2025-11-20 07:46:43'),(162,5,4,3,30000.00,'2025-11-25 22:52:10','2025-11-25 22:52:10'),(173,11,16,2,1500.00,'2025-12-05 12:53:55','2025-12-05 12:54:03'),(174,11,46,1,2500.00,'2025-12-05 12:54:32','2025-12-05 12:54:32'),(175,11,83,1,2500.00,'2025-12-05 12:54:58','2025-12-05 12:54:58'),(176,11,71,1,6500.00,'2025-12-05 12:55:33','2025-12-05 12:55:33'),(177,11,22,1,12000.00,'2025-12-05 12:56:22','2025-12-05 12:56:22'),(178,11,75,1,2000.00,'2025-12-05 12:56:53','2025-12-05 12:56:53');
/*!40000 ALTER TABLE `cart_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `carts`
--

DROP TABLE IF EXISTS `carts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `carts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carts`
--

LOCK TABLES `carts` WRITE;
/*!40000 ALTER TABLE `carts` DISABLE KEYS */;
INSERT INTO `carts` VALUES (3,4,'2025-07-31 12:44:40','2025-07-31 12:44:40'),(4,6,'2025-10-14 13:27:13','2025-10-14 13:27:13'),(5,7,'2025-10-14 14:43:58','2025-10-14 14:43:58'),(6,8,'2025-10-15 06:17:29','2025-10-15 06:17:29'),(7,9,'2025-10-18 14:51:37','2025-10-18 14:51:37'),(8,10,'2025-10-31 12:16:00','2025-10-31 12:16:00'),(9,11,'2025-10-31 12:36:43','2025-10-31 12:36:43'),(10,12,'2025-11-02 17:52:52','2025-11-02 17:52:52'),(11,13,'2025-12-05 12:53:55','2025-12-05 12:53:55');
/*!40000 ALTER TABLE `carts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `offers`
--

DROP TABLE IF EXISTS `offers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `offers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_general_ci NOT NULL,
  `image` varchar(500) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `discount` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `category` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `link` varchar(255) COLLATE utf8mb4_general_ci DEFAULT '#',
  `isActive` tinyint(1) DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_offers_category` (`category`),
  KEY `idx_offers_active` (`isActive`),
  KEY `idx_offers_created` (`created_at`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `offers`
--

LOCK TABLES `offers` WRITE;
/*!40000 ALTER TABLE `offers` DISABLE KEYS */;
INSERT INTO `offers` VALUES (1,'Weekend Freshness Deal','Get 15% off all fresh produce this weekend! Limited time offer on fruits and vegetables.','https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=250&fit=crop','15% OFF','Fresh Produce','/products?category=Fresh%20Produce',0,'2025-07-22 12:58:42','2025-10-29 19:35:43'),(2,'Dairy & Eggs Bundle','Buy any 2 dairy products and get a dozen eggs absolutely free! Perfect for families.','https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=250&fit=crop','FREE EGGS','Dairy & Eggs','/products?category=Dairy%20%26%20Eggs',0,'2025-07-22 12:58:42','2025-07-22 13:24:31'),(3,'Bulk Pantry Savings','Save 10% when you buy 3 or more pantry staples. Stock up and save big!','https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=250&fit=crop','10% OFF','Pantry Staples','/products?category=Pantry%20Staples',0,'2025-07-22 12:58:42','2025-10-29 19:35:38'),(4,'Meat Lover\'s Special','20% off on all premium meat and fresh seafood products this week only.','https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400&h=250&fit=crop','20% OFF','Meat & Seafood','/products?category=Meat%20%26%20Seafood',0,'2025-07-22 12:58:42','2025-10-29 19:35:30'),(5,'Beverage Bonanza','Buy 2 get 1 free on all beverages! Refresh yourself with our premium drinks.','https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=250&fit=crop','BUY 2 GET 1 FREE','Beverages','/products?category=Beverages',0,'2025-07-22 12:58:42','2025-10-29 19:35:24'),(6,'Snack Attack Deal','Mix and match any 5 snacks for just UGX 25,000. Perfect for movie nights!','https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400&h=250&fit=crop','5 FOR UGX 25K','Snacks','/products?category=Snacks',0,'2025-07-22 12:58:42','2025-10-29 19:35:32');
/*!40000 ALTER TABLE `offers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `orderId` int NOT NULL,
  `productId` int unsigned NOT NULL,
  `quantity` int NOT NULL,
  `price` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `orderId` (`orderId`),
  KEY `productId` (`productId`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`orderId`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=157 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (141,62,163,1,4000.00),(142,62,18,1,7000.00),(143,62,15,1,6100.00),(144,63,163,1,4000.00),(145,63,18,1,7000.00),(146,63,15,1,6100.00),(147,64,75,2,2000.00),(148,64,146,1,6000.00),(149,64,112,1,2500.00),(150,64,70,2,3500.00),(151,65,153,1,1500.00),(152,65,66,1,2000.00),(153,66,66,1,2000.00),(154,66,153,1,1500.00),(155,66,16,1,1500.00),(156,66,6,1,6000.00);
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `customerName` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `location` text COLLATE utf8mb4_general_ci,
  `deliveryZone` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `notes` text COLLATE utf8mb4_general_ci,
  `subtotal` int NOT NULL DEFAULT '0',
  `deliveryFee` int NOT NULL DEFAULT '0',
  `status` enum('pending','confirmed','delivered') COLLATE utf8mb4_general_ci DEFAULT 'pending',
  `total` decimal(10,2) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=67 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (62,'Bingana Titus','+256700121987','Burton street\nNakasero','Kampala Central','Payment: 80% deposit (UGX 14,000). ',17100,7000,'pending',24100.00,'2026-01-24 22:04:10'),(63,'Bingana Titus','+256700121987','Burton street\nNakasero','Kampala Central','Payment: Full payment (UGX 24,100). ',17100,7000,'pending',24100.00,'2026-01-24 22:09:56'),(64,'Bingana Titus','+256700121987','Burton street\nNakasero','Kampala Central','Payment: 80% deposit (UGX 16,000). ',19500,7000,'pending',26500.00,'2026-01-26 12:10:33'),(65,'Bingana Titus','+256700121987','Burton street\nNakasero','Wakiso','Payment: Full payment (UGX 13,500). ',3500,10000,'pending',13500.00,'2026-02-01 14:58:29'),(66,'Bingana Titus','+256700121987','Burton street\nNakasero','Wakiso','Payment: Full payment (UGX 21,000). ',11000,10000,'pending',21000.00,'2026-02-03 13:41:27');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `amount` int NOT NULL,
  `phone_number` varchar(20) NOT NULL,
  `reference` varchar(64) NOT NULL,
  `provider` varchar(20) NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'pending',
  `transaction_uuid` varchar(64) DEFAULT NULL,
  `provider_reference` varchar(128) DEFAULT NULL,
  `marzpay_response` json DEFAULT NULL,
  `webhook_data` json DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `reference` (`reference`),
  KEY `idx_payments_order_id` (`order_id`),
  KEY `idx_payments_reference` (`reference`),
  KEY `idx_payments_status` (`status`),
  CONSTRAINT `fk_payments_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `chk_payments_amount` CHECK ((`amount` > 0)),
  CONSTRAINT `chk_payments_provider` CHECK ((`provider` in (_utf8mb4'mtn',_utf8mb4'airtel'))),
  CONSTRAINT `chk_payments_status` CHECK ((`status` in (_utf8mb4'pending',_utf8mb4'processing',_utf8mb4'completed',_utf8mb4'failed',_utf8mb4'cancelled')))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `category` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_general_ci,
  `unit` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `inStock` tinyint unsigned NOT NULL DEFAULT '1',
  `image` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `images` longtext COLLATE utf8mb4_general_ci,
  `variants` longtext COLLATE utf8mb4_general_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=170 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'Beef',17000.00,'Meat&Seafood','Fresh beef rich in protein and essential micronutrients, particularly iron, zinc, and B vitamins (especially B_{12}).','kg',1,'/api/uploads/1764909308974-414387649-Raw_Beef_Steak_and_Meat_on_transparency_Background_Isolated_Gourmet_Meal-removebg-preview.png','[\"/api/uploads/1760802868983-504816497-Raw Beef Steak and Meat on transparency Background Isolated Gourmet Meal.jpeg\"]','[{\"id\":\"5add8621-a87c-4b06-b63a-d3aeb37c9109\",\"label\":\"\",\"unit\":\"Half\",\"price\":8000}]'),(2,'Red Apples',1000.00,'Fruits','Local and Imported apples rich in dietary fiber (especially pectin), Vitamin C, and antioxidants like quercetin and anthocyanins.','piece ',1,'/api/uploads/1761755460852-977422136-The Expert Guide to Healthy Eating.jpg','[\"/api/uploads/1761755460852-977422136-The Expert Guide to Healthy Eating.jpg\"]',NULL),(4,'Ghee',30000.00,'Diary&Poultry','Ghee is a source of energy, vitamins (A, D, E, and K), and healthy fats, including medium-chain triglycerides (MCTs) and butyric acid.','kg',1,'/api/uploads/1762344076706-78466691-1000770640-removebg-preview.png','[\"/api/uploads/1762344076706-78466691-1000770640-removebg-preview.png\"]',NULL),(6,'Banana',6000.00,'Fruits','Big local banana(Bogoya)\r\nWith different sizes directly sourced from our local farms','cluster',1,'/api/uploads/1761914460939-283728390-16_Best_Ways_to_Use_Ripe_Bananas_-_Recipes_and_Tips_-removebg-preview.png','[\"/api/uploads/1761914460939-283728390-16_Best_Ways_to_Use_Ripe_Bananas_-_Recipes_and_Tips_-removebg-preview.png\"]',NULL),(7,'Tomato',4000.00,'Greens&Vegetables','From our local farms, rich in Vitamins C and K, and potassium.','kg',1,'/api/uploads/1760803628335-285827563-4d8d3e12-85d5-4b21-9b51-cd247c1885ff.jpeg',NULL,NULL),(8,'Onion',3500.00,'Greens&Vegetables','Locally sourced from farm, fresh and rich in fiber, Vitamin C, Vitamin B6, potassium, and beneficial antioxidant compounds like quercetin.','kg',1,'/api/uploads/1762349425484-180376694-13_Veggies_You_Only_Think_You_Don_t_Like-removebg-preview.png',NULL,NULL),(10,'Chicken',20000.00,'Meat&Seafood','Chicken is primarily a lean source of high-quality protein, alongside essential B vitamins (like Niacin and B6), and minerals such as selenium and zinc.','piece',1,'/api/uploads/1760804297253-265074513-5273a00e-c5f5-40d9-a7cb-85e9e09a4475.jpeg','[\"/api/uploads/1760804297253-265074513-5273a00e-c5f5-40d9-a7cb-85e9e09a4475.jpeg\"]',NULL),(11,'Carrot ',3500.00,'Greens&Vegetables','excellent source of beta-carotene (which converts to Vitamin A for eye and immune health) and provide good amounts of fiber, potassium, and various antioxidants','kg',1,'/api/uploads/1761752909272-595333152-Ceylon Supermart Fresh Carrots Approximate Weight 500g.jpg',NULL,NULL),(12,'ginger ',4500.00,'Greens&Vegetables','Source of antioxidants (especially the active compound gingerol), and contains trace amounts of vitamins like Vitamin C and folate, along with minerals like potassium and magnesium.','kg',1,'/api/uploads/1760804368550-701656515-Green Vegetables Etcetera.jpeg',NULL,NULL),(13,'Sweet Potatoes',4000.00,'Greens&Vegetables','Sourced from our local farms, highly nutritious root vegetable, exceptionally rich in beta-carotene (Provitamin A), Vitamin C, manganese, and dietary fiber.','kg',1,'/api/uploads/1761753726656-833946636-Batata-removebg-preview.png',NULL,NULL),(14,'Beetroot',4500.00,'Fruits','Beetroot is a  root vegetable, rich in folate (Vitamin B9), manganese, potassium, iron, Vitamin C, fiber, and powerful antioxidants (like betalains and inorganic nitrates).','kg',1,'/api/uploads/1760806343134-443162000-bridge the gap.jpeg','[\"/api/uploads/1760806343134-443162000-bridge the gap.jpeg\"]',NULL),(15,'Tanagrine',6100.00,'Fruits','No description available','kg',1,'/api/uploads/1761839726955-745541496-TANAGRINE.jpg','[\"/api/uploads/1761839726955-745541496-TANAGRINE.jpg\"]',NULL),(16,'Avocado',1500.00,'Greens&Vegetables','nutrient-dense fruit rich in heart-healthy monounsaturated fats, dietary fiber (for satiety and digestion), and essential micronutrients, particularly Potassium (for blood pressure regulation), Vitamin K, and Folate.','piece',1,'/api/uploads/1760804490117-347561155-Organic Medium Avocado.jpeg',NULL,NULL),(17,'Pineapple ',4000.00,'Fruits','Pineapples are exceptionally rich in Vitamin C and the essential mineral manganese, and it also contains the beneficial digestive enzyme bromelain.\r\n','piece',1,'/api/uploads/1760804546885-344282465-pineapple clip art free clipart images pineapple 2 - WikiClipArt.jpeg','[\"/api/uploads/1760804546885-344282465-pineapple clip art free clipart images pineapple 2 - WikiClipArt.jpeg\"]',NULL),(18,'Watermelon',7000.00,'Fruits','Highly hydrating and low-calorie, notable for its high levels of the antioxidant lycopene, also rich in Vitamin C, Vitamin A, and potassium.\r\n','piece',1,'/api/uploads/1760804599058-34908537-dc861187-c825-41c8-b8db-8b6ce7a4a3b2.jpeg','[\"/api/uploads/1760804599058-34908537-dc861187-c825-41c8-b8db-8b6ce7a4a3b2.jpeg\"]',NULL),(19,'Mangoes',10500.00,'Fruits','Rich in Vitamin C and a good source of Vitamin A (beta-carotene), folate, and fiber, while being low in fat and cholesterol.','4 pieces',1,'/api/uploads/1762432369016-293385994-Mango___-removebg-preview.png','[\"/api/uploads/1762432369016-293385994-Mango___-removebg-preview.png\"]',NULL),(20,'Passion Fruits',6000.00,'Fruits','Sourced from our local farms,organic and fiber-rich source of antioxidants, especially Vitamin C and Vitamin A (as beta-carotene), along with beneficial minerals like Potassium and Iron.','kg',1,'/api/uploads/1761753078455-35186210-Mango_with_passion_fruit_smoothie_by_fresh_ingredients___Premium_Photo-removebg-preview.png','[\"/api/uploads/1761753078455-35186210-Mango_with_passion_fruit_smoothie_by_fresh_ingredients___Premium_Photo-removebg-preview.png\"]',NULL),(21,'Milk ',2500.00,'Diary&Poultry','Our locally sourced milk has a high-quality protein, calcium, and vitamins like D and B12','liter',1,'/api/uploads/1760805035448-217422579-milk.jpeg','[\"/api/uploads/1760805035448-217422579-milk.jpeg\"]',NULL),(22,'Eggs',12000.00,'Diary&Poultry','Eggs offer high-quality protein, essential vitamins (like B12, D, and A), and minerals such as choline and selenium','Tray',1,'/api/uploads/1760805138922-71812968-eggs.jpeg','[\"/api/uploads/1760805138922-71812968-eggs.jpeg\"]',NULL),(24,'French Beans',6500.00,'Greens&Vegetables','rich in dietary fiber, protein, and essential vitamins (especially C, K, and Folate) and minerals (like iron and potassium).','kg',1,'/api/uploads/1760805359315-969330320-8ada0f34-f4f1-4b88-a2f2-aca81f972b4d.jpeg',NULL,NULL),(25,'jack fruit',10000.00,'Fruits','Rich in carbohydrates, a good source of fiber and protein and packed with Vitamin C, potassium, and various antioxidants.','piece',1,'/api/uploads/1760805584723-340503971-Jackfruit.jpeg','[\"/api/uploads/1760805584723-340503971-Jackfruit.jpeg\"]',NULL),(30,'Goat Meat ',21000.00,'Meat&Seafood','Goat meat is a lean, high-quality protein rich in essential nutrients like iron, B vitamins (especially B12), and zinc, while being lower in total fat and saturated fat than many other red meats.','kg',1,'/api/uploads/1761755318482-790564382-goatttt-removebg-preview.png','[\"/api/uploads/1761755318482-790564382-goatttt-removebg-preview.png\"]',NULL),(33,'Pork ',18000.00,'Meat&Seafood','Pork is an excellent source of high-quality protein, rich in B vitamins (especially thiamin, B6, and B12), and essential minerals like zinc and iron.','kg',1,'/api/uploads/1761755178500-84787699-poork-removebg-preview.png','[\"/api/uploads/1761755178500-84787699-poork-removebg-preview.png\"]',NULL),(34,'Liver',22000.00,'Meat&Seafood','Liver is exceptionally rich in Vitamin A, B vitamins (especially B12 and folate), iron, and copper.','kg',1,'/api/uploads/1760806875407-147836630-Beef Liver Pate.jpeg','[\"/api/uploads/1760806875407-147836630-Beef Liver Pate.jpeg\"]',NULL),(36,'Smoked Fish',16000.00,'Meat&Seafood','our local smoked fish is a great source of high-quality protein, omega-3 fatty acids, and essential vitamins (like B12 and D) and minerals, but it is typically high in sodium','piece',1,'/api/uploads/1760807068412-688683067-smoked fish.jpeg','[\"/api/uploads/1760807068412-688683067-smoked fish.jpeg\"]',NULL),(43,'Fresh Beans',3000.00,'Greens&Vegetables','source of fiber and plant-based protein, along with essential vitamins (like folate, A, and C) and minerals (like iron and potassium).','cup',1,'/api/uploads/1761752522114-778806151-Fresh_Cranberry_beans-removebg-preview.png','[\"/api/uploads/1761752522114-778806151-Fresh_Cranberry_beans-removebg-preview.png\"]','[{\"id\":\"f422de2b-2705-40fd-a495-db0fc7c12460\",\"label\":\"kg\",\"unit\":\"kg\",\"price\":5000}]'),(44,'Groundnuts',7500.00,'Greens&Vegetables','Our local dry groundnuts are primarily rich in protein, healthy unsaturated fats, fiber, and various B vitamins and minerals like magnesium and phosphorus.','kg',1,'/api/uploads/1760808159697-283112005-Raw Peanuts.jpeg','[\"/api/uploads/1760808159697-283112005-Raw Peanuts.jpeg\"]',NULL),(45,'pawpaw(papaya)',6000.00,'Fruits','Paw paw (papaya) from our local farms, is rich in Vitamin C, a good source of Vitamin A and folate, and contains beneficial minerals like potassium and magnesium, along with the digestive enzyme papain.\r\n','piece',1,'/api/uploads/1761753552189-505471073-baede441-b71a-49f0-b0b7-33d2c467aa9b-removebg-preview.png','[\"/api/uploads/1761753552189-505471073-baede441-b71a-49f0-b0b7-33d2c467aa9b-removebg-preview.png\"]',NULL),(46,'Broccoli',2500.00,'Greens&Vegetables','fiber-rich, high levels of Vitamin C and Vitamin K, along with beneficial antioxidants and compounds like sulforaphane.','piece',1,'/api/uploads/1761753948129-812282873-broccoli.jpg',NULL,NULL),(47,'Spinach',2500.00,'Greens&Vegetables','',' Bunch',1,'/api/uploads/1761754127125-142907291-spinach.jpg',NULL,NULL),(65,'Bitter Berries (Katunkuma)',4000.00,'Greens&Vegetables','rich in antioxidants, Vitamin C, and dietary fiber, which support immune health and digestion.','kg',1,'/api/uploads/1761821454423-801388079-5cc6da57-f174-4258-bff8-b0c708a73284.jpeg',NULL,NULL),(66,'Aloe vera',2000.00,'Greens&Vegetables','Aloe vera has numerous benefits, primarily for skin and digestive health, due to its anti-inflammatory and antibacterial properties. It is used to soothe burns as well.','piece',1,'/api/uploads/1761821886764-200039725-Fresh green aloe vera leaves on white background _ Premium Photo.jpeg','[\"/api/uploads/1761821886764-200039725-Fresh green aloe vera leaves on white background _ Premium Photo.jpeg\"]',NULL),(67,'Bugga',2000.00,'Greens&Vegetables','No description available','Bunch ',1,'/api/uploads/1761822557875-617236659-1000763017.jpg',NULL,NULL),(68,'sweet plantain (Gonja)',6000.00,'Greens&Vegetables','Our Gonja is locally sourced from our farms, and good source of complex carbohydrates, fiber, and essential nutrients like potassium (for blood pressure) and Vitamin C (for immune health).',' cluster',1,'/api/uploads/1761824337998-891603266-Venezuelan_Sweet_Plantains__Video__-_Mommy_s_Home_Cooking-removebg-preview.png',NULL,NULL),(69,'small banana(Ndizi)',4000.00,'Greens&Vegetables','Locally sourced small banana(ndizi) rich in potassium, fiber, Vitamin B6, and Vitamin C.','cluster',1,'/api/uploads/1761825854314-730422587-Fruits Exporter in India [Fresh Fruits].jpeg',NULL,NULL),(70,'Lemon',3500.00,'Greens&Vegetables','Excellent source of Vitamin C and are also low in calories, providing small amounts of potassium, B vitamins, fiber, and antioxidant plant compounds like flavonoids.','kg',1,'/api/uploads/1761839828266-671353690-LEMON.jpg',NULL,NULL),(71,'Dry Beans',6500.00,'Greens&Vegetables','our local dry beans provide excellent sources of plant-based protein, fiber, complex carbohydrates, and essential micronutrients like folate, iron, and magnesium, while being naturally low in fat and cholesterol.','kg',1,'/api/uploads/1761840200956-361836408-dry beans.jpg','[\"/api/uploads/1761840200956-361836408-dry beans.jpg\"]',NULL),(72,'Cassava',6000.00,'Greens&Vegetables','energy-rich source of carbohydrates and resistant starch, also providing notable amounts of Vitamin C and Potassium.','5 pieces ',1,'/api/uploads/1761840485682-578708462-casava-removebg-preview.png',NULL,NULL),(74,'Groundnut Powder ',7000.00,'Greens&Vegetables','Dry groundnut powder is rich in protein, healthy fats, dietary fiber, and essential minerals and B vitamins like niacin and folate.','kg',1,'/api/uploads/1761841015929-442869610-gnut_powdeer-removebg-preview.png','[\"/api/uploads/1761841015929-442869610-gnut_powdeer-removebg-preview.png\"]',NULL),(75,'Kale',2000.00,'Greens&Vegetables','Kale is a nutrient-dense superfood, low in calories but exceptionally rich in vitamins K, A, and C, as well as fiber and various antioxidants.',' Bunch',1,'/api/uploads/1761841140854-671534-Produce_Spotlight__The_Ultimate_Guide_to_Kale-removebg-preview.png','[\"/api/uploads/1761841140854-671534-Produce_Spotlight__The_Ultimate_Guide_to_Kale-removebg-preview.png\"]',NULL),(76,'Okra',5000.00,'Greens&Vegetables','Okra is  a healthy vegetable, low in calories, high in fiber, and a good source of vitamins A and C, as well as minerals like potassium and magnesium.','kg',1,'/api/uploads/1761841253613-69651410-What_Fruits_Are_In_Season_Right_Now__Get_the_Season-by-Season_Breakdown-removebg-preview.png','[\"/api/uploads/1761841253613-69651410-What_Fruits_Are_In_Season_Right_Now__Get_the_Season-by-Season_Breakdown-removebg-preview.png\"]',NULL),(77,'Yams',5500.00,'Greens&Vegetables','Our local yams are nutrient-dense tubers rich in complex carbohydrates, dietary fiber, and vital micronutrients like potassium, manganese, and Vitamin C.\r\n','3 pieces ',1,'/api/uploads/1761841430135-961288412-4718f1d3-76d9-4dd5-89b1-f790c031485f-removebg-preview.png',NULL,NULL),(78,'Green pepper ',1000.00,'Greens&Vegetables','Rich in Vitamin C, along with being a good source of fiber, Vitamin A, and other antioxidants like lutein.','3 pieces ',1,'/api/uploads/1761841877627-297240801-f539b4a6-2922-42da-b765-ee4f4babb5b1-removebg-preview.png',NULL,NULL),(79,'Fresh chili',5000.00,'Greens&Vegetables','very rich in Vitamin C and Vitamin A (from carotenoids), also providing Vitamin B6, potassium, and the anti-inflammatory compound capsaicin.','kg',1,'/api/uploads/1761841926799-866999585-Red-green_group_of_chili_pepper__iso-removebg-preview.png',NULL,NULL),(80,'Dry chili',7000.00,'Spices','Dry chili peppers are rich in vitamins (especially A and C), antioxidants, and the active compound capsaicin','kg',1,'/api/uploads/1761841962945-164511553-download-removebg-preview.png','[\"/api/uploads/1761841962945-164511553-download-removebg-preview.png\"]',NULL),(81,'Sugarcane',4000.00,'Greens&Vegetables','Sourced from our local farms, primarily a source of carbohydrates for energy, but also contains beneficial amounts of vitamins (especially C and B-complex), minerals (like iron, calcium, and potassium), antioxidants, and fiber.\r\nWould you like a brief explanation of how one of these nutrients benefits the body?\r\n','whole stem',1,'/api/uploads/1761842709549-895806630-download__1_-removebg-preview.png',NULL,NULL),(82,'Dry Termite mushrooms',5000.00,'Spices','Dry termite mushrooms are a nutritious source of protein, fiber, and essential minerals like iron, potassium, and zinc.','pack',1,'/api/uploads/1761842811755-733715033-ingrid-holding-her-mushrooms-uganda-252216-800x533-removebg-preview.png','[\"/api/uploads/1761842811755-733715033-ingrid-holding-her-mushrooms-uganda-252216-800x533-removebg-preview.png\"]',NULL),(83,'Cabbage',2500.00,'Greens&Vegetables','fiber-rich cruciferous vegetable that is an excellent source of essential micronutrients, particularly Vitamin C (for immune support) and Vitamin K (for bone health and blood clotting), alongside beneficial glucosinolates and antioxidants.','piece',1,'/api/uploads/1761842869220-603063052-MY_-_-_Thor_Gift__thorgift_com__-_If_you_like_it_-removebg-preview.png',NULL,NULL),(84,'swiss chard',4000.00,'Greens&Vegetables','No description available','cluster',1,'/api/uploads/1761893223396-840609373-1000763920.png',NULL,NULL),(85,'Irish potato',3000.00,'Greens&Vegetables','Source of complex carbohydrates, rich in Potassium and Vitamin C, and contain beneficial dietary fiber (especially with the skin).','kg',1,'/api/uploads/1761909249946-549292846-48907888-a85f-42d6-b176-f730062aced5-removebg-preview.png',NULL,NULL),(86,'Matookey',30000.00,'Greens&Vegetables','Local matookey directly sourced from our farms, rich in complex carbohydrates, fiber, potassium, and vitamins B6 and C.','buch',1,'/api/uploads/1761911444552-608097658-Matooke.jpg',NULL,NULL),(87,'Tilapia',17000.00,'Meat&Seafood','Tilapia is a lean protein source rich in essential nutrients like Vitamin B12, selenium, and phosphorus.','piece',1,'/api/uploads/1761911869551-992482086-Tilapia_Fish_White_Transparent__Tilapia_Fish_Png__Fish_Png__Fish__Tilapia_PNG_Image_For_Free_Download-removebg-preview.png','[\"/api/uploads/1761911869551-992482086-Tilapia_Fish_White_Transparent__Tilapia_Fish_Png__Fish_Png__Fish__Tilapia_PNG_Image_For_Free_Download-removebg-preview.png\"]',NULL),(88,'Nile perch',19000.00,'Meat&Seafood','Nile perch is a lean source of high-quality protein, rich in Omeg-3 fatty acids, and a good source of vitamins like B12 and D, and minerals like selenium and potassium.','piece',1,'/api/uploads/1761912144422-64128778-181181_2-removebg-preview.png','[\"/api/uploads/1761912144422-64128778-181181_2-removebg-preview.png\"]',NULL),(89,'Mud fish',4000.00,'Meat&Seafood','','piece ',1,'/api/uploads/1761912398157-575434048-B_-_The_abc_of_Food_Cooking_and_People__Bullhead_Catfish____Bullhead_Catfish_-_Freshwater_Favourite_with_a_Feisty_Reputation__With_its_broad__flat_head_and_unmistakable_whisker-like_barbels__the_bullh.png',NULL,NULL),(90,'Moringa Powder',8000.00,'Spices','Moringa powder contains high levels of vitamins A, C, and E, along with minerals like iron and calcium. It also provides all nine essential amino acids. ','kg',1,'/api/uploads/1761913269091-644233652-___Unlock_Nature_s_Multivitamin__Pure_Moringa_-removebg-preview.png','[\"/api/uploads/1761913269091-644233652-___Unlock_Nature_s_Multivitamin__Pure_Moringa_-removebg-preview.png\"]',NULL),(91,'Cloves',5500.00,'Spices','Cloves are rich in manganese, an essential mineral, and contain high levels of antioxidants, particularly the compound eugenol.','tin',1,'/api/uploads/1761914171818-645646266-Whole_Dried_Cengkeh_Indonesian_Cloves_Stock_Photo-removebg-preview.png','[\"/api/uploads/1761914171818-645646266-Whole_Dried_Cengkeh_Indonesian_Cloves_Stock_Photo-removebg-preview.png\"]',NULL),(110,'sweet Melon',4500.00,'Fruits','Sweet melon is a hydrating, low-fat fruit that is an excellent source of Vitamin C and potassium, and in some varieties, beta-carotene (Vitamin A), along with fiber and other B vitamins.\r\n','piece',1,'/api/uploads/1762430770506-869652201-sweet-melon-1-550x550-removebg-preview.png','[\"/api/uploads/1762430770506-869652201-sweet-melon-1-550x550-removebg-preview.png\"]',NULL),(111,'Nectarines',6000.00,'Fruits','Nectarines are source of dietary fiber, and are particularly rich in Vitamin C, Vitamin A  and potassium.\r\n','piece',1,'/api/uploads/1762430918788-13976427-nectarine-1-550x550-removebg-preview.png','[\"/api/uploads/1762430918788-13976427-nectarine-1-550x550-removebg-preview.png\"]',NULL),(112,'kiwi',2500.00,'Fruits','Kiwi is exceptionally rich in Vitamin C, along with good amounts of dietary fiber, Vitamin K, potassium, and antioxidants.\r\n\r\n','piece ',1,'/api/uploads/1762431017586-901197807-kiwi-550x550-removebg-preview.png','[\"/api/uploads/1762431017586-901197807-kiwi-550x550-removebg-preview.png\"]',NULL),(113,'Dates',6000.00,'Fruits','Dates provide natural sugars for energy, a good amount of dietary fiber for digestion, and essential minerals like potassium, magnesium, and iron, along with various beneficial antioxidants.','pack',1,'/api/uploads/1762431099370-943289309-dtes-550x550-removebg-preview.png','[\"/api/uploads/1762431099370-943289309-dtes-550x550-removebg-preview.png\"]',NULL),(114,'Goosebarries',6000.00,'Fruits','low in calories but rich in Vitamin C, dietary fiber, and antioxidants.','pack',1,'/api/uploads/1762431212271-284984978-goose-berry-1-550x550-removebg-preview.png','[\"/api/uploads/1762431212271-284984978-goose-berry-1-550x550-removebg-preview.png\"]',NULL),(115,'Tamarind',5000.00,'Greens&Vegetables','Tamarind is a good source of potassium, magnesium, iron, and B vitamins (especially thiamin and niacin), along with a high content of dietary fiber and potent antioxidants.\r\n','kg',1,'/api/uploads/1762431264803-647326370-tamarind-550x550-removebg-preview.png',NULL,NULL),(116,'pears',2000.00,'Fruits','Pears are an excellent source of dietary fiber, and a good source of Vitamin C, Vitamin K, potassium.','piece',1,'/api/uploads/1762431338105-393805538-pear1-550x550-removebg-preview.png','[\"/api/uploads/1762431338105-393805538-pear1-550x550-removebg-preview.png\"]',NULL),(117,'Peaches',7000.00,'Fruits','Peaches provide good amounts of Vitamin C, Vitamin A, fiber, and potassium.\r\n','piece',1,'/api/uploads/1762431431275-6757167-peaches-1-550x550-removebg-preview.png','[\"/api/uploads/1762431431275-6757167-peaches-1-550x550-removebg-preview.png\"]',NULL),(118,'Chayote',3500.00,'Greens&Vegetables','Locally sourced  Chayote, low-calorie vegetable particularly rich in folate and Vitamin C, along with a good amount of fiber and various antioxidants.\r\n','3 pieces ',1,'/api/uploads/1762431507375-300483040-chayote-550x550-removebg-preview.png',NULL,NULL),(119,'Pomegranate',12000.00,'Fruits','Pomegranates are a good source of fiber, Vitamin C, Vitamin K, and folate, and are exceptionally rich in antioxidants which help the body from cell damage.','piece',1,'/api/uploads/1762431616327-323137250-pomegranate-550x550-removebg-preview.png','[\"/api/uploads/1762431616327-323137250-pomegranate-550x550-removebg-preview.png\"]',NULL),(120,'Soursop',6000.00,'Fruits','Soursop is a nutrient-dense fruit rich in Vitamin C, fiber, potassium, and copper, also providing a good source of iron, magnesium, and folate.\r\n','piece',1,'/api/uploads/1762431683817-200989843-soursop-550x550-removebg-preview.png','[\"/api/uploads/1762431683817-200989843-soursop-550x550-removebg-preview.png\"]',NULL),(121,'Custard Apple',2500.00,'Fruits','custard apple is a fruit rich in Vitamin C, a good source of dietary fiber, and contains essential minerals like Potassium and Magnesium.\r\n','piece',1,'/api/uploads/1762431933054-123853924-custard-apple-removebg-preview.png','[\"/api/uploads/1762431933054-123853924-custard-apple-removebg-preview.png\"]',NULL),(122,'Tree Tomato',5000.00,'Fruits','Tree Tomato is a fruit rich in vitamins A, C, and E, potassium, dietary fiber, and various antioxidants like anthocyanins and carotenoids.','kg',1,'/api/uploads/1762431996747-808516468-tree-tomto-removebg-preview.png','[\"/api/uploads/1762431996747-808516468-tree-tomto-removebg-preview.png\"]',NULL),(123,'Dragon Fruit',14000.00,'Fruits','Dragon fruit is rich in  high fiber and antioxidants (like betalains and flavonoids), and a good source of vitamins like Vitamin C and minerals like magnesium and iron.\r\n','piece',1,'/api/uploads/1762432058649-931523205-dragonm-fruit-removebg-preview.png','[\"/api/uploads/1762432058649-931523205-dragonm-fruit-removebg-preview.png\"]',NULL),(124,'Guavas',5500.00,'Fruits','Guava is notably rich in Vitamin C and an excellent source of dietary fiber, with good levels of potassium and antioxidants like lycopene.\r\n','kg',1,'/api/uploads/1762432111337-519765552-guava-550x550-removebg-preview.png','[\"/api/uploads/1762432111337-519765552-guava-550x550-removebg-preview.png\"]',NULL),(125,'Thorn Melon',2500.00,'Fruits','Thorn melon is a highly hydrating fruit that is a good source of Vitamin C, Vitamin A, magnesium, iron, potassium, and beneficial antioxidants like lutein and beta-carotene.\r\n','piece',1,'/api/uploads/1762432162638-234386489-thorn-melon-550x550-removebg-preview.png','[\"/api/uploads/1762432162638-234386489-thorn-melon-550x550-removebg-preview.png\"]',NULL),(126,'Cocoa',6000.00,'Fruits',' rich in polyphenols and a significant source of minerals such as magnesium, iron, potassium, and zinc, along with fiber, protein, and healthy fats. \r\n','3 pieces ',1,'/api/uploads/1762432209862-699107390-Cocoa-550x550-removebg-preview.png','[\"/api/uploads/1762432209862-699107390-Cocoa-550x550-removebg-preview.png\"]',NULL),(146,'Karela',6000.00,'Greens&Vegetables','Karela is rich in vitamins A and C, fiber, and antioxidants, offering benefits for blood sugar regulation, digestion, and immunity.','kg',1,'/api/uploads/1763291753106-32594178-Organic_Heirloom_Non_GMO__Indian_Karela__Bitter_melon___Bitter_Gourd_seeds_25_seeds-removebg-preview.png','[\"/api/uploads/1763291753106-32594178-Organic_Heirloom_Non_GMO__Indian_Karela__Bitter_melon___Bitter_Gourd_seeds_25_seeds-removebg-preview.png\"]',NULL),(147,'Celery',3500.00,'Greens&Vegetables','Celery is low in sodium and has nutrients that can help keep your blood pressure in a healthy range.','bunch',1,'/api/uploads/1763291948630-915979358-15_Food_Scraps_You_Didn_t_Know_Were_Edible____Delicious__-removebg-preview.png','[\"/api/uploads/1763291948630-915979358-15_Food_Scraps_You_Didn_t_Know_Were_Edible____Delicious__-removebg-preview.png\"]',NULL),(148,'Red Radish',8000.00,'Greens&Vegetables','Red radishes are nutritious and provide numerous benefits, including supporting heart and liver health, aiding digestion, and boosting the immune system.','kg',1,'/api/uploads/1763292021886-298120998-19_Vegetables_That_Can_Cause_Inflammation-removebg-preview.png','[\"/api/uploads/1763292021886-298120998-19_Vegetables_That_Can_Cause_Inflammation-removebg-preview.png\"]',NULL),(150,'Rosemary',2500.00,'Herbs','Rosemary provides numerous nutritional benefits, including high levels of antioxidants and essential vitamins and minerals like manganese, niacin, and folate.',' Bunch',1,'/api/uploads/1763292181730-411566688-Rosemary_Plants__How_To_Grow__Harvest___Use_Them__2022_-removebg-preview.png','[\"/api/uploads/1763292181730-411566688-Rosemary_Plants__How_To_Grow__Harvest___Use_Them__2022_-removebg-preview.png\"]',NULL),(151,'parsley',3500.00,'Greens&Vegetables','Parsley is rich in vitamin K that helps blood to clot in addition to contributing to bone health.',' Bunch',1,'/api/uploads/1763292566487-385412569-Evergreen_Parsley_Seeds___Heirloom__Non-GMO_Herb-removebg-preview.png','[\"/api/uploads/1763292566487-385412569-Evergreen_Parsley_Seeds___Heirloom__Non-GMO_Herb-removebg-preview.png\"]',NULL),(153,' Silverfish',1500.00,'Meat&Seafood','locally sourced silverfish are  source of protein, Omega-3 fatty acids, calcium, and Vitamins A, D, and E','pack',1,'/api/uploads/1763294604901-907371327-download__4_-removebg-preview.png','[\"/api/uploads/1763294604901-907371327-download__4_-removebg-preview.png\"]',NULL),(154,'Banana Leaves',1000.00,'Greens&Vegetables','','piece',1,'/api/uploads/1763301165299-547823103-Cara_Menyimpan_Daun_Pisang_Agar_Tetap_Segar_dan_Tidak_Menguning__Awet_Sampai_Lebih_dari_Sebulan__-_Sajian_Sedap-removebg-preview.png',NULL,NULL),(158,'White Radish',8000.00,'Greens&Vegetables','White radish is a nutrient-rich vegetable that offers numerous health benefits, including supporting the immune system with vitamin C, aiding digestion with fiber, and promoting heart health with potassium.','kg',1,'/api/uploads/1764322091076-310033888-744-removebg-preview.png','[\"/api/uploads/1764322091078-360226064-istockphoto-689955536-612x612-removebg-preview.png\"]',NULL),(162,'Couliflowers',5000.00,'Greens&Vegetables','locally sourced from our local farms form different regions of the country','piece',1,'/api/uploads/1764827008818-615368366-What_Nutritionists_Want_You_to_Know_About_These_30_Low-Calorie_Foods-removebg-preview.png',NULL,NULL),(163,'White Eggplant',4000.00,'Greens&Vegetables','locally sourced fresh eggplants straight from out farms','kg',1,'/api/uploads/1764864384030-603236415-images-removebg-preview.png',NULL,NULL),(164,'Purple Eggplants',5000.00,'Greens&Vegetables','','kg',1,'/api/uploads/1764864550526-594059318-aubergine__-removebg-preview.png',NULL,NULL),(165,'Lettuce',4000.00,'Greens&Vegetables','No description available','piece',1,'/api/uploads/1764913677060-674082889-download__2_-removebg-preview.png','[\"/api/uploads/1764864822980-966138985-Tartare_de_boeuf_faÃ§on_CÃ©sar___RICARDO-removebg-preview.png\"]',NULL),(166,'Cucumber',4000.00,'Greens&Vegetables','','kg',1,'/api/uploads/1764864976205-534404360-Fresh_cucumbers_with_water_droplets_and_slices_on_a_white_background-removebg-preview.png',NULL,NULL),(167,'Hibiscus',30000.00,'Spices','No description available','kg',1,'/api/uploads/1764866132346-171719715-Hibiscus_Leaves__Hibiscus_Flower__Dried_Hibiscus_Flower__Sorrel_Hibiscus__Organic_Hibiscus_Flower__Zobo__Sobolo_leaves__Bulk_Zobo_leaves_-removebg-preview.png','[\"/api/uploads/1764865089390-90949787-Fleurs_d_hibiscus__trÃ¨s_rouge__-_Hibiscus_Flowers__Deep_Red____Bissap-removebg-preview.png\"]',NULL),(168,'Garlic',6000.00,'Spices','','Pound',1,'/api/uploads/1764865226341-215373906-Midjourney___Fresh__whole_garlic_bulbs_and_cloves_on_a_white_background_-removebg-preview.png',NULL,NULL);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_sessions`
--

DROP TABLE IF EXISTS `user_sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_sessions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `token_hash` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `expires_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_token_hash` (`token_hash`),
  KEY `idx_expires_at` (`expires_at`),
  CONSTRAINT `user_sessions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_sessions`
--

LOCK TABLES `user_sessions` WRITE;
/*!40000 ALTER TABLE `user_sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `first_name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `last_name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `address` text COLLATE utf8mb4_general_ci,
  `city` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `postal_code` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `email_verified` tinyint(1) DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'john.doe@example.com','$2b$10$rOzJqQZQXQXQXQXQXQXQXeJ7qQZQXQXQXQXQXQXQXQXQXQXQXQXQXQ','John','Doe','+1234567890','123 Main St','New York','10001',1,0,'2025-07-22 19:20:11','2025-07-22 19:20:11'),(2,'jane.smith@example.com','$2b$10$rOzJqQZQXQXQXQXQXQXQXeJ7qQZQXQXQXQXQXQXQXQXQXQXQXQXQXQ','Jane','Smith','+1234567891','456 Oak Ave','Los Angeles','90210',1,0,'2025-07-22 19:20:11','2025-07-22 19:20:11'),(3,'admin@centurygroceries.com','$2b$10$rOzJqQZQXQXQXQXQXQXQXeJ7qQZQXQXQXQXQXQXQXQXQXQXQXQXQXQ','Admin','User','+1234567892','789 Admin St','Chicago','60601',1,0,'2025-07-22 19:20:11','2025-07-22 19:20:11'),(4,'vierycalliper@gmail.com','$2a$10$YvdLEeIO80j1hkhWNBFI4exuYXsHRfItWG1bZ71M2k.chMGn2bt3G','Erasmus','Hodges','+1 (206) 195-8758','Officiis autem id in','Ut culpa harum ad e','Ea voluptatem volupt',1,0,'2025-07-22 19:49:48','2025-07-22 19:49:48'),(5,'jyfomo@mailinator.com','$2a$10$ip38H5WmfxXWdLn44HDgQOhLU3ZWSkqfnrj6pGmP1N0k5OoCmV4xS','Audra','Delaney','+1 (731) 593-6307','Ut sunt atque harum ','Molestias iste dolor','Quisquam dolore ut r',1,0,'2025-08-11 17:19:47','2025-08-11 17:19:47'),(6,'silverfox@gmail.com','$2a$10$Uw.mqLCOTsJYK7hdPQEGWe2PPpGKSKNgYvTiQh1yGWiadgjc6dA.u','Fox','Silver','0754092850',NULL,NULL,NULL,1,0,'2025-10-14 13:25:52','2025-10-14 13:25:52'),(7,'dinducatering@gmail.com','$2a$10$OpcNrWwPfO/79RblZfwvq.4CmVQwQkaHFQhCbPKsFYMwjvSsK8jgu','Yolanda','Mccoy','+1 (246) 742-7404','Aut ut animi quo au','Ullam tempora qui oc','Iure irure lorem qui',1,0,'2025-10-14 14:43:40','2025-10-14 14:43:40'),(8,'dorisvizie@gmail.com','$2a$10$cVo24L3tLT23CTxOOqIFauBbhQQqQRSNuEhiFTx.DBF95koyJz1bq','Doris','ma’am','0750899637',NULL,NULL,NULL,1,0,'2025-10-15 06:16:31','2025-10-15 06:16:31'),(9,'tybrwxr@gmail.com','$2a$10$pHLkxTv4uUyG0F01aknTquVvxJJXfX0AIyKd3jNy8JqOszGU4VK1K','Bingana','Titus','774001780','Mkumba','Entebbe','',1,0,'2025-10-18 14:51:23','2025-10-19 10:52:49'),(10,'goodsuubi@gmail.com','$2a$10$mIC5uFsZhO0q2LAe4KZNs..b9fYI7bRkgt..bJlu8f9FK8IdVDDIq','Good','suubi','+256 776 493059',NULL,NULL,NULL,1,0,'2025-10-31 12:15:07','2025-10-31 12:15:07'),(11,'namanyakarim1@gmail.com','$2a$10$9AP2pN.icTtmsUsDkI0KVuYdjXruV27F4ApyiOxrs.xaigvqpObmi','NAMANYA','KALIM','+256780732425','Kabale central','Kabale',NULL,1,0,'2025-10-31 12:36:17','2025-10-31 12:36:17'),(12,'timocarter93@gmail.com','$2a$10$woWLn4TlzMItv0K3sKgbB.Y4kJgJk54v2YVuvV1AgI1Vn6lo2NT8a','Timo','Carter','+256747734130','Kyengera ','Kampala ',NULL,1,0,'2025-11-02 17:52:14','2025-11-02 17:52:14'),(13,'kabunyiann2006@yahoo.com','$2a$10$B0Pq5Pw.9trNIcRs.55.mOeqPJJ8wc06JvGT2UtHxqN05g9/IO5jO','Ann','Kabunyi','+256746506138','Malaika apartment kitende,',NULL,NULL,1,0,'2025-12-05 12:53:37','2025-12-05 12:53:37');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wishlist`
--

DROP TABLE IF EXISTS `wishlist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wishlist` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `product_id` int unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_product` (`user_id`,`product_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `wishlist_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `wishlist_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wishlist`
--

LOCK TABLES `wishlist` WRITE;
/*!40000 ALTER TABLE `wishlist` DISABLE KEYS */;
INSERT INTO `wishlist` VALUES (26,10,1,'2025-10-31 12:21:48'),(27,10,36,'2025-10-31 12:21:58');
/*!40000 ALTER TABLE `wishlist` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-02-09  8:46:21
