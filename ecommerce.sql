-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: ecommerce
-- ------------------------------------------------------
-- Server version	8.4.3

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `address`
--

DROP TABLE IF EXISTS `address`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `address` (
  `address_id` int NOT NULL AUTO_INCREMENT,
  `city` varchar(50) NOT NULL,
  `street` varchar(50) NOT NULL,
  `postalcode` varchar(50) NOT NULL,
  PRIMARY KEY (`address_id`)
) ENGINE=InnoDB AUTO_INCREMENT=104 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `address`
--

LOCK TABLES `address` WRITE;
/*!40000 ALTER TABLE `address` DISABLE KEYS */;
INSERT INTO `address` VALUES (3,'Haifa','Haddar','123453'),(4,'Nazareth','Eastern','1649500'),(5,'Nazareth','Alhara alsharqiya','1623400'),(6,'כפר סבא','טשרניחובסקי','4425416'),(7,'Haifa','Haddar','4425416'),(8,'Nazareth','Diana','4857685'),(9,'Nazareth','Diana','534543'),(10,'Haifa','Abbas','25478'),(11,'Nazareth','Deyana','010101'),(12,'Nazareth','Beer Alameer','1649500'),(13,'נצרת','נצרת, ביר אלאמיר 1010','1649500'),(14,'נצרת','נצרת, ביר אלאמיר 1010','1649500'),(15,'Haifa','123 Test Street','12345'),(16,'Haifa','123 Test Street','12345'),(17,'Haifa','123 Test Street','12345'),(18,'Haifa','123 Test Street','12345'),(19,'Haifa','123 Test Street','12345'),(20,'Haifa','123 Test Street','12345'),(37,'Haifa','Abbas','12332'),(38,'Haifa','Abbas','12332'),(39,'Haifa','Abbas','12332'),(40,'Haifa','Abbas','12332'),(41,'Haifa','Abbas','3623'),(42,'Haifa','Abbas','12345'),(43,'Haifa','123 test street','12345'),(44,'Haifa','123 test street','12345'),(45,'נצרת','נצרת, ביר אלאמיר 1010','1649500'),(46,'Haifa','123 test street','12345'),(47,'Haifa','1234 test','54321'),(48,'Nazareth','Dianna','16212'),(49,'Haifa','new street','123123'),(50,'Haifa','ana aref','21212'),(51,'Haifa','new street','12123'),(52,'Haifa','haifa','121332'),(53,'Haifa','haifa','121332'),(54,'Haifa','stam','23412'),(55,'Nazareth','Alhara alsharqiya','43748'),(56,'Nazareth','Alhara alsharqiya','43125'),(57,'Haifa','Abbas','12121'),(58,'Haifa','Abbas','12121'),(59,'Haifa','Abbas 123','32121'),(60,'Haifa','123 Abbas','43210'),(61,'Haifa','123 Test Street','12345'),(62,'Haifa','123 Test Street','12345'),(63,'Haifa','123 Test Street','12345'),(64,'Haifa','123 Test Street','12345'),(65,'Haifa','123 Test Street','12345'),(66,'Haifa','123 Test Street','12345'),(67,'Haifa','123 Test Street','12345'),(68,'Haifa','123 Test Street','12345'),(69,'Haifa','123 Test Street','12345'),(70,'Haifa','123 Test Street','12345'),(71,'Haifa','123 Test Street','12345'),(72,'Haifa','123 Test Street','12345'),(73,'Haifa','123 Test Street','12345'),(74,'Haifa','123 Test Street','12345'),(75,'Haifa','123 Test Street','12345'),(76,'Haifa','123 Test Street','12345'),(77,'Haifa','123 Test Street','12345'),(78,'Haifa','123 Test Street','12345'),(79,'Haifa','123 Test Street','12345'),(80,'Haifa','123 Test Street','12345'),(81,'Haifa','123 Test Street','12345'),(82,'Haifa','123 Test Street','12345'),(83,'Haifa','123 Test Street','12345'),(84,'Haifa','123 Test Street','12345'),(85,'Haifa','123 Test Street','12345'),(86,'Haifa','123 Test Street','12345'),(87,'Haifa','123 Test Street','12345'),(88,'Haifa','123 Test Street','12345'),(89,'Haifa','123 Test Street','12345'),(90,'Haifa','123 Test Street','12345'),(91,'Haifa','123 Test Street','12345'),(92,'Haifa','123 Test Street','12345'),(93,'Haifa','123 Test Street','12345'),(94,'Haifa','123 Test Street','12345'),(95,'Haifa','123 Test Street','12345'),(96,'Haifa','123 Test Street','12345'),(97,'Haifa','123 Test Street','12345'),(98,'Haifa','123 Test Street','12345'),(99,'Haifa','123 Test Street','12345'),(100,'Haifa','123 Test Street','12345'),(101,'Haifa','123 Test Street','12345'),(102,'Haifa','123 Test Street','12345'),(103,'Haifa','123 Test Street','12345');
/*!40000 ALTER TABLE `address` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart_items`
--

DROP TABLE IF EXISTS `cart_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_items` (
  `user_id` int NOT NULL,
  `item_id` int NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `photo` text,
  `quantity` int DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`,`item_id`),
  KEY `item_id` (`item_id`),
  CONSTRAINT `cart_items_ibfk_1` FOREIGN KEY (`item_id`) REFERENCES `itemtable` (`id`),
  CONSTRAINT `cart_items_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `usertable` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_items`
--

LOCK TABLES `cart_items` WRITE;
/*!40000 ALTER TABLE `cart_items` DISABLE KEYS */;
INSERT INTO `cart_items` VALUES (2,1,'آيفون 15 برو',1199.00,'/images/iphone15pro.jpg',1,'2025-09-29 10:57:10'),(6,2,'Samsung Galaxy S24 Ultra',1100.00,'/images/s24ultra.jpg',1,'2025-08-20 15:25:32');
/*!40000 ALTER TABLE `cart_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `item_translations`
--

DROP TABLE IF EXISTS `item_translations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `item_translations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `item_id` int NOT NULL,
  `language_code` varchar(5) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_item_language` (`item_id`,`language_code`),
  CONSTRAINT `fk_item` FOREIGN KEY (`item_id`) REFERENCES `itemtable` (`id`) ON DELETE CASCADE,
  CONSTRAINT `item_translations_ibfk_1` FOREIGN KEY (`item_id`) REFERENCES `itemtable` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `item_translations`
--

LOCK TABLES `item_translations` WRITE;
/*!40000 ALTER TABLE `item_translations` DISABLE KEYS */;
INSERT INTO `item_translations` VALUES (1,1,'en','iPhone 15 Pro','Apple\'s flagship smartphone with A17 chip and titanium body.'),(2,1,'ar','آيفون 15 برو','هاتف آبل الرائد بمعالج اي  17 وهيكل من التيتانيوم.'),(3,1,'he','אייפון 15 פרו','הסמארטפון המוביל של אפל עם שבב א 17 וגוף טיטניום.'),(4,2,'en','Samsung Galaxy S24 Ultra','Great High-end Android phone with 200MP camera and S Pen.'),(5,2,'ar','سامسونج جالاكسي اس 24 الترا','هاتف اندرويد متطور مع كاميرا 200 ميجابيكسل وقلم اس الذكي'),(6,2,'he','סמסונג גלאקסי אס24 אולטרא','מכשיר אנדרויד מתקדם עם מצלמת 200 מיגה פיקסל ועט אס החכם'),(7,4,'en','MacBook Air M3','Lightweight Apple laptop with M3 chip and Retina display'),(8,4,'ar','ماك بوك اير م3','حاسوب نقال خفيف من انتاج ابل يتمتع بمعالج م3 وعرض الشبكية'),(9,4,'he','מאק בוק אייר מ3','מחשב נייד קל משקל של אפל עם מעבד מ3 ותצוגת ריטינה'),(10,5,'en','Dell XPS 13 Plus','Sleek Windows ultrabook with InfinityEdge display'),(11,5,'ar','ديل اكس بي اس 13 بلاس','جهاز ويندوز اولترا بوك مع شاشة بعرض لا محدود - بدون اطار'),(12,5,'he','דל אקס פי אס 13 פלוס','מחשב נייד עם וינדוס אולטראבוק עם תצוגה ללא גבולות מסגרת'),(13,6,'en','Lenovo ThinkPad X1 Carbon','Business-class laptop with legendary keyboard and durability'),(14,6,'ar','لينوفو ثيتك باد اكس1 كربون','حاسوب نقال درجة رجال اعمال مع لوحة مفاتيح اسطورية وقدرة تحمل'),(15,6,'he','לינובו תינקפאד אקס1 קרבון','מחשב נייד ברמה מקצועית עם מקלדת ויציבות אגדית'),(16,7,'en','Sony Playstation 5','Gaming console with two wireless controls'),(17,7,'ar','سوني بلايستاشن 5','قنصل العاب مع جهازين تحكم لا سلكيين'),(18,7,'he','סוני פלאיסטאשן 5','קונסולת משחקים עם שתי ידיות אלחוטיות'),(19,10,'en','T500 Smart Watch','Unisex smart watch with bluetooth calls and health mentoring'),(20,10,'ar','ساعة ذكية تي 500','ساعة ذكية يونيسكس مع مكالمات بلوتوث ومراقبة الصحة'),(21,10,'he','שעון חכם  תי 500','שעון חכם יוניסקס עם שיחות בלוטות והשגחת בריאות'),(22,16,'en','Xiaomi tab7 pro','combines sleek design with powerful performance, making it the perfect companion for work, play, and everything in between'),(23,16,'ar','شاومي تاب7 برو','جهاز لوحي يدمح التصميم العصري مع قوة الاداء, مثالي للعمل اللعب وكل ما بينهما'),(24,16,'he','שיאומי טאב7 פרו','טאבלט עם עיצוב מרהיב טביצועי על, המכשיר הטוב ביותר לעבודה למשחקים ולכל מה שביניהם'),(25,17,'en','Google Pixel 8 Pro','delivers cutting-edge performance with pure Android experience, wrapped in a sleek, modern design'),(26,17,'ar','جوجل بيكسل 8 برو','يدمح اداء عصري متقدم مع تجربة الاندرويد النقية مغلفة بتصميم انيق وعصري'),(27,17,'he','גוגל פיקסל 8 פרו','משלב ביצועי על חדשניים עם חוויות אנדרויד נקייה בתוך עיצוב מושך וחדשני');
/*!40000 ALTER TABLE `item_translations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `itemtable`
--

DROP TABLE IF EXISTS `itemtable`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `itemtable` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `price` int NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `category` varchar(45) NOT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `quantity` int NOT NULL,
  `itemtablecol` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `itemtable`
--

LOCK TABLES `itemtable` WRITE;
/*!40000 ALTER TABLE `itemtable` DISABLE KEYS */;
INSERT INTO `itemtable` VALUES (1,'iPhone 15 Pro',1198,'Apple\'s flagship smartphone with A17 chip and titanium body.','Smartphone','/images/iphone15pro.jpg',10,NULL),(2,'Samsung Galaxy S24 Ultra',1100,'Great High-end Android phone with 200MP camera and S Pen. ','Smartphone','/images/s24ultra.jpg',9,NULL),(4,'MacBook Air M3',1300,'Lightweight Apple laptop with M3 chip and Retina display.','Laptop','/images/mackbook.jpg',2,NULL),(5,'Dell XPS 13 Plus',1399,'Sleek Windows ultrabook with InfinityEdge display.','Laptop','/images/dell.jpg',5,NULL),(6,'Lenovo ThinkPad X1 Carbon',1499,'Business-class laptop with legendary keyboard and durability.','Laptop','/images/lenovo.jpg',0,NULL),(7,'Sony Playstation 5',2240,'Gaming Console with two wireless controls','Gaming Console','/images/playstation5.jpg',0,NULL),(10,'T500 Smart Watch',250,'Unisex smart watch with bluetooth calls and health mentoring','Smart Watch','/images/t500.jpg',0,NULL),(16,'Xiaomi tab 7 pro',2679,'combines sleek design with powerful performance, making it the perfect companion for work, play, and everything in between','Tablet','/images/pad7pro.jpg',8,NULL),(17,'Google Pixel 8 Pro',2650,'delivers cutting-edge performance with pure Android experience, wrapped in a sleek, modern design','Smartphone','/images/pixel.jpg',2,NULL);
/*!40000 ALTER TABLE `itemtable` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ordertable`
--

DROP TABLE IF EXISTS `ordertable`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ordertable` (
  `order_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `total_amount` int NOT NULL,
  `items_json` json NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` varchar(20) DEFAULT 'Processing',
  `address_id` int DEFAULT NULL,
  PRIMARY KEY (`order_id`),
  KEY `user_id` (`user_id`),
  KEY `address_id` (`address_id`),
  CONSTRAINT `ordertable_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `usertable` (`id`),
  CONSTRAINT `ordertable_ibfk_2` FOREIGN KEY (`address_id`) REFERENCES `address` (`address_id`)
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ordertable`
--

LOCK TABLES `ordertable` WRITE;
/*!40000 ALTER TABLE `ordertable` DISABLE KEYS */;
INSERT INTO `ordertable` VALUES (1,3,1399,'[{\"id\": 5, \"name\": \"Dell XPS 13 Plus\", \"photo\": \"/images/dell.jpg\", \"price\": 1399, \"quantity\": 1}]','2025-07-01 09:32:24','Processing',NULL),(2,3,3240,'[{\"id\": 7, \"name\": \"Sony Playstation 5\", \"photo\": \"/images/playstation5.jpg\", \"price\": 2240, \"quantity\": 1}, {\"id\": 3, \"name\": \"Google Pixel 8 Pro\", \"photo\": \"/images/pixel.jpg\", \"price\": 1000, \"quantity\": 1}]','2025-07-01 09:32:24','Processing',NULL),(3,2,2240,'[{\"id\": 7, \"name\": \"Sony Playstation 5\", \"photo\": \"/images/playstation5.jpg\", \"price\": 2240, \"quantity\": 1}]','2025-07-01 09:32:24','Processing',NULL),(4,2,2998,'[{\"id\": 6, \"name\": \"Lenovo ThinkPad X1 Carbon\", \"photo\": \"/images/lenovo.jpg\", \"price\": 1499, \"quantity\": 2}]','2025-07-01 09:32:24','Processing',NULL),(5,3,1499,'[{\"id\": 6, \"name\": \"Lenovo ThinkPad X1 Carbon\", \"photo\": \"/images/lenovo.jpg\", \"price\": 1499, \"quantity\": 1}]','2025-07-01 09:32:24','Processing',NULL),(6,3,1100,'[{\"id\": 2, \"name\": \"Samsung Galaxy S24 Ultra\", \"photo\": \"/images/s24ultra.jpg\", \"price\": 1100, \"quantity\": 1}]','2025-07-01 09:32:24','Shipped',NULL),(7,3,6037,'[{\"id\": 4, \"name\": \"MacBook Air M3\", \"photo\": \"/images/mackbook.jpg\", \"price\": 1299, \"quantity\": 2}, {\"id\": 1, \"name\": \"iPhone 15 Pro\", \"photo\": \"/images/iphone15pro.jpg\", \"price\": 1199, \"quantity\": 1}, {\"id\": 7, \"name\": \"Sony Playstation 5\", \"photo\": \"/images/playstation5.jpg\", \"price\": 2240, \"quantity\": 1}]','2025-07-01 09:32:24','Shipped',NULL),(8,2,2000,'[{\"id\": 3, \"name\": \"Google Pixel 8 Pro\", \"photo\": \"/images/pixel.jpg\", \"price\": 1000, \"quantity\": 2}]','2025-07-01 09:32:24','Shipped',NULL),(9,6,1399,'[{\"id\": 5, \"name\": \"Dell XPS 13 Plus\", \"photo\": \"/images/dell.jpg\", \"price\": 1399, \"quantity\": 1}]','2025-07-01 09:32:24','Shipped',NULL),(23,3,2639,'[{\"id\": 11, \"name\": \"Xiaomi tab 7 pro\", \"photo\": \"/images/pad7pro.jpg\", \"price\": 2639, \"quantity\": 1}]','2025-07-01 11:52:50','Processing',NULL),(24,6,250,'[{\"id\": 10, \"name\": \"T500 Smart Watch\", \"photo\": \"/images/t500.jpg\", \"price\": 250, \"quantity\": 1}]','2025-07-01 12:00:42','Shipped',NULL),(27,6,2889,'[{\"id\": 11, \"name\": \"Xiaomi tab 7 pro\", \"photo\": \"/images/pad7pro.jpg\", \"price\": 2639, \"quantity\": 1}, {\"id\": 10, \"name\": \"T500 Smart Watch\", \"photo\": \"/images/t500.jpg\", \"price\": 250, \"quantity\": 1}]','2025-07-02 09:20:02','Shipped',NULL),(28,6,2200,'[{\"id\": 2, \"name\": \"Samsung Galaxy S24 Ultra\", \"photo\": \"/images/s24ultra.jpg\", \"price\": 1100, \"quantity\": 2}]','2025-07-02 09:22:18','Processing',NULL),(29,2,3139,'[{\"id\": 11, \"name\": \"Xiaomi tab 7 pro\", \"photo\": \"/images/pad7pro.jpg\", \"price\": 2639, \"quantity\": 1}, {\"id\": 10, \"name\": \"T500 Smart Watch\", \"photo\": \"/images/t500.jpg\", \"price\": 250, \"quantity\": 2}]','2025-07-05 10:34:29','Processing',NULL),(30,6,2240,'[{\"id\": 7, \"name\": \"Sony Playstation 5\", \"photo\": \"/images/playstation5.jpg\", \"price\": 2240, \"quantity\": 1}]','2025-07-08 11:10:35','Processing',NULL),(31,6,1100,'[{\"id\": 2, \"name\": \"Samsung Galaxy S24 Ultra\", \"photo\": \"/images/s24ultra.jpg\", \"price\": 1100, \"quantity\": 1}]','2025-07-08 14:55:06','Processing',NULL),(32,3,1549,'[{\"id\": 10, \"name\": \"T500 Smart Watch\", \"photo\": \"/images/t500.jpg\", \"price\": 250, \"quantity\": 1}, {\"id\": 4, \"name\": \"MacBook Air M3\", \"photo\": \"/images/mackbook.jpg\", \"price\": 1299, \"quantity\": 1}]','2025-07-08 14:57:44','Shipped',NULL),(33,2,1100,'[{\"id\": 2, \"name\": \"Samsung Galaxy S24 Ultra\", \"photo\": \"/images/s24ultra.jpg\", \"price\": 1100, \"quantity\": 1}]','2025-07-09 11:02:56','Processing',NULL),(34,2,1749,'[{\"id\": 6, \"name\": \"Lenovo ThinkPad X1 Carbon\", \"photo\": \"/images/lenovo.jpg\", \"price\": 1499, \"quantity\": 1}, {\"id\": 10, \"name\": \"T500 Smart Watch\", \"photo\": \"/images/t500.jpg\", \"price\": 250, \"quantity\": 1}]','2025-07-09 11:19:10','Shipped',NULL),(35,2,2398,'[{\"id\": 1, \"name\": \"iPhone 15 Pro\", \"photo\": \"/images/iphone15pro.jpg\", \"price\": 1199, \"quantity\": 2}]','2025-07-09 11:24:05','Shipped',NULL),(39,6,1199,'[{\"id\": 1, \"name\": \"iPhone 15 Pro\", \"photo\": \"/images/iphone15pro.jpg\", \"price\": 1199, \"quantity\": 1}]','2025-07-09 13:03:56','Processing',5),(40,6,1499,'[{\"id\": 6, \"name\": \"Lenovo ThinkPad X1 Carbon\", \"photo\": \"/images/lenovo.jpg\", \"price\": 1499, \"quantity\": 1}]','2025-07-09 13:24:03','Shipped',6),(41,2,1499,'[{\"id\": 6, \"name\": \"Lenovo ThinkPad X1 Carbon\", \"photo\": \"/images/lenovo.jpg\", \"price\": 1499, \"quantity\": 1}]','2025-07-09 13:46:42','Shipped',7),(42,2,5528,'[{\"id\": 11, \"name\": \"Xiaomi tab 7 pro\", \"photo\": \"/images/pad7pro.jpg\", \"price\": 2639, \"quantity\": 2}, {\"id\": 10, \"name\": \"T500 Smart Watch\", \"photo\": \"/images/t500.jpg\", \"price\": 250, \"quantity\": 1}]','2025-07-09 13:53:48','Processing',8),(43,2,1299,'[{\"id\": 4, \"name\": \"MacBook Air M3\", \"photo\": \"/images/mackbook.jpg\", \"price\": 1299, \"quantity\": 1}]','2025-07-09 13:56:39','Processing',9),(44,2,1100,'[{\"id\": 2, \"name\": \"Samsung Galaxy S24 Ultra\", \"photo\": \"/images/s24ultra.jpg\", \"price\": 1100, \"quantity\": 1}]','2025-07-09 14:10:01','Shipped',10),(45,2,2240,'[{\"id\": 7, \"name\": \"Sony Playstation 5\", \"photo\": \"/images/playstation5.jpg\", \"price\": 2240, \"quantity\": 1}]','2025-07-09 14:12:35','Processing',11),(46,7,1199,'[{\"id\": 1, \"name\": \"iPhone 15 Pro\", \"photo\": \"/images/iphone15pro.jpg\", \"price\": 1199, \"quantity\": 1}]','2025-07-11 15:05:40','Shipped',12),(47,6,2650,'[{\"id\": 17, \"name\": \"Google Pixel 8 Pro\", \"photo\": \"/images/pixel.jpg\", \"price\": 2650, \"quantity\": 1}]','2025-08-20 11:21:16','Processing',55),(48,6,1399,'[{\"id\": 5, \"name\": \"Dell XPS 13 Plus\", \"photo\": \"/images/dell.jpg\", \"price\": 1399, \"quantity\": 1}]','2025-08-20 11:45:55','Processing',56),(49,2,1100,'[{\"id\": 2, \"name\": \"Samsung Galaxy S24 Ultra\", \"photo\": \"/images/s24ultra.jpg\", \"price\": 1100, \"quantity\": 1}]','2025-08-23 05:34:41','Processing',57),(50,2,1100,'[{\"id\": 2, \"name\": \"Samsung Galaxy S24 Ultra\", \"photo\": \"/images/s24ultra.jpg\", \"price\": 1100, \"quantity\": 1}]','2025-08-23 05:45:47','Processing',58),(51,2,1300,'[{\"id\": 4, \"name\": \"MacBook Air M3\", \"photo\": \"/images/mackbook.jpg\", \"price\": 1300, \"quantity\": 1}]','2025-08-23 05:56:54','Processing',59),(52,2,1199,'[{\"id\": 1, \"name\": \"iPhone 15 Pro\", \"photo\": \"/images/iphone15pro.jpg\", \"price\": 1199, \"quantity\": 1}]','2025-08-23 06:00:53','Processing',60);
/*!40000 ALTER TABLE `ordertable` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `token_hash` varchar(64) NOT NULL,
  `expires_at` datetime NOT NULL,
  `used` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `password_reset_tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `usertable` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
INSERT INTO `password_reset_tokens` VALUES (15,7,'5dccd2776c7729eb353c22e4143feb4909d384961d807e6a5dddc30b2af22483','2025-09-06 17:25:34',1),(16,7,'d1fdff4644ab085f2ddbd0e37e5dabd72af5bfb0a3835701df79868a4712406d','2025-09-06 18:00:40',0),(17,6,'e40dcd928bf4e473ccd15fa106fe52b203cb4760dac122f9374967af959891c4','2025-09-06 18:12:57',0),(18,6,'c5d695aa37435b967fc0f8b39f8d605946c77ccac4cf30404f991d1fea44418e','2025-09-06 18:24:16',0),(19,6,'1e640475c7138f0637e1dbb94cf1b72442379910d221c28740c61a0e1dd838f6','2025-09-06 18:27:50',0);
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_translations`
--

DROP TABLE IF EXISTS `user_translations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_translations` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `language_code` varchar(5) NOT NULL,
  `name` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `unique_user_language` (`user_id`,`language_code`),
  CONSTRAINT `fk_user` FOREIGN KEY (`user_id`) REFERENCES `usertable` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_translations`
--

LOCK TABLES `user_translations` WRITE;
/*!40000 ALTER TABLE `user_translations` DISABLE KEYS */;
INSERT INTO `user_translations` VALUES (1,1,'en','Muhannad Yazbak','2025-09-25 12:48:41','2025-09-25 12:48:41'),(2,1,'ar','مهند يزبك','2025-09-25 12:48:41','2025-09-25 12:48:41'),(3,1,'he','מוהנד יזבכ','2025-09-25 12:48:41','2025-09-25 12:48:41'),(4,2,'en','Amer Sajrawi','2025-09-25 12:48:41','2025-09-25 12:48:41'),(5,2,'ar','عامر شجراوي','2025-09-25 12:48:41','2025-09-25 12:48:41'),(6,2,'he','עאמר שגראוי','2025-09-25 12:48:41','2025-09-25 12:48:41'),(7,3,'en','Elias Hlees','2025-09-25 12:48:41','2025-09-25 12:48:41'),(8,3,'ar','الياس حليص','2025-09-25 12:48:41','2025-09-25 12:48:41'),(9,3,'he','אליאס חליס','2025-09-25 12:48:41','2025-09-25 12:48:41'),(10,6,'en','Jihad Wawi','2025-09-25 12:48:41','2025-09-25 12:48:41'),(11,6,'ar','جهاد واوي','2025-09-25 12:48:41','2025-09-25 12:48:41'),(12,6,'he','גיהאד ואוי','2025-09-25 12:48:41','2025-09-25 12:48:41'),(13,7,'en','Bedaya Yazbak','2025-09-25 12:48:41','2025-09-25 12:48:41'),(14,7,'ar','بداية يزبك','2025-09-25 12:48:41','2025-09-25 12:48:41'),(15,7,'he','בידאיה יזבכ','2025-09-25 12:48:41','2025-09-25 12:48:41'),(16,10,'en','Awny Yazbak','2025-09-27 10:33:17','2025-09-27 10:33:17'),(17,10,'ar','عوني يزبك','2025-09-27 10:33:17','2025-09-27 10:33:17'),(18,10,'he','עאוני יזבכ','2025-09-27 10:33:17','2025-09-27 10:33:17');
/*!40000 ALTER TABLE `user_translations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usertable`
--

DROP TABLE IF EXISTS `usertable`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usertable` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fullname` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `dateOfBirth` date NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('user','admin','guest') DEFAULT 'user',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usertable`
--

LOCK TABLES `usertable` WRITE;
/*!40000 ALTER TABLE `usertable` DISABLE KEYS */;
INSERT INTO `usertable` VALUES (1,'Muhannad Yazbak','yazbakm@gmail.com','1991-03-08','$2b$10$hJc6wOqSQulWPd0YeV8JFe2yc7TQj7tFCC/Ya11EhDovaSQgzfBXC','admin'),(2,'Amer Sajrawi','sajrawiAmer@gmail.com','1991-08-22','$2b$10$ESY8PoVcI2TZBT//dX3Uu.Fo/45.oM/cYSCgb4TXsl1/ieVlrh39K','user'),(3,'Elias Hlees','hlees.e@intel.co.il','1991-08-22','$2b$10$6/5xzvu8dykgB9F10tlVeOF3MgwKcEXDeY0lB9nD9YvnIOVYtdNaK','user'),(6,'Jihad Wawi','abo.essa@gmail.com','1979-01-09','$2b$10$/l/rl67cPFSKMwtPE4h/n.s2t5Qlft6k5f8TNAz7L/OSpiIgjgZzq','user'),(7,'Bedaya Yazbak','bedaya.17.8@gmail.com','1964-08-16','$2b$10$3OKJv3vgt7DLapybsww8XuX2KweYLf5jgC/5BBKks7dKj12DDJpoO','user'),(10,'Awny Yazbak','awnyazbak@gmail.com','1967-10-03','$2b$10$iuvXmyvMDL07KE/P2P4qSOD9tiqYEYBko/pZkQQXZTnOvbM.u2bri','user');
/*!40000 ALTER TABLE `usertable` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wishtable`
--

DROP TABLE IF EXISTS `wishtable`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wishtable` (
  `user_id` int NOT NULL,
  `item_id` int NOT NULL,
  `item_name` varchar(255) NOT NULL,
  `wished_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  KEY `user_id` (`user_id`),
  KEY `item_id` (`item_id`),
  CONSTRAINT `wishtable_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `usertable` (`id`),
  CONSTRAINT `wishtable_ibfk_2` FOREIGN KEY (`item_id`) REFERENCES `itemtable` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wishtable`
--

LOCK TABLES `wishtable` WRITE;
/*!40000 ALTER TABLE `wishtable` DISABLE KEYS */;
INSERT INTO `wishtable` VALUES (2,4,'ماك بوك اير م3','2025-09-29 14:41:09');
/*!40000 ALTER TABLE `wishtable` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-17 13:09:37
