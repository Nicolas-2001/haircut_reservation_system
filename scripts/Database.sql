CREATE DATABASE  IF NOT EXISTS `reservations_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `reservations_db`;
-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: reservations_db
-- ------------------------------------------------------
-- Server version	8.0.44

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
-- Table structure for table `appointment`
--

DROP TABLE IF EXISTS `appointment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `appointment` (
  `id` int NOT NULL AUTO_INCREMENT,
  `client_id` int NOT NULL,
  `professional_id` int NOT NULL,
  `service_id` int NOT NULL,
  `appointment_date` date NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `status_id` tinyint NOT NULL,
  `notes` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `client_id` (`client_id`),
  KEY `service_id` (`service_id`),
  KEY `status_id` (`status_id`),
  KEY `idx_disponibilidad` (`professional_id`,`appointment_date`,`start_time`,`end_time`,`status_id`),
  CONSTRAINT `appointment_ibfk_1` FOREIGN KEY (`professional_id`) REFERENCES `professionals` (`id`) ON DELETE CASCADE,
  CONSTRAINT `appointment_ibfk_2` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE CASCADE,
  CONSTRAINT `appointment_ibfk_3` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE CASCADE,
  CONSTRAINT `appointment_ibfk_4` FOREIGN KEY (`status_id`) REFERENCES `appointment_status` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `appointment`
--

LOCK TABLES `appointment` WRITE;
/*!40000 ALTER TABLE `appointment` DISABLE KEYS */;
INSERT INTO `appointment` VALUES (1,1,1,1,'2026-04-13','08:00:00','08:45:00',2,'Cliente solicita corte clasico.','2026-04-10 03:15:48','2026-04-10 03:15:48'),(2,2,1,2,'2026-04-13','09:00:00','10:00:00',1,'Primera vez en el establecimiento.','2026-04-10 03:15:48','2026-04-10 03:15:48'),(3,3,2,4,'2026-04-14','09:00:00','10:30:00',2,'Masaje enfocado en espalda.','2026-04-10 03:15:48','2026-04-10 03:15:48'),(4,4,3,3,'2026-04-11','09:00:00','10:00:00',3,'Servicio completado sin novedades.','2026-04-10 03:15:48','2026-04-10 03:15:48'),(5,5,3,6,'2026-04-11','10:30:00','11:10:00',2,'Depilacion de piernas.','2026-04-10 03:15:48','2026-04-10 03:15:48'),(6,6,4,5,'2026-04-10','14:00:00','14:50:00',1,'Cliente con piel sensible.','2026-04-10 03:15:48','2026-04-10 03:15:48'),(7,7,4,4,'2026-04-12','10:00:00','11:30:00',4,'Cancelada por el cliente.','2026-04-10 03:15:48','2026-04-10 03:15:48'),(8,8,2,1,'2026-04-16','15:00:00','15:45:00',2,'Corte moderno.','2026-04-10 03:15:48','2026-04-10 03:15:48');
/*!40000 ALTER TABLE `appointment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `appointment_status`
--

DROP TABLE IF EXISTS `appointment_status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `appointment_status` (
  `id` tinyint NOT NULL,
  `name` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `appointment_status`
--

LOCK TABLES `appointment_status` WRITE;
/*!40000 ALTER TABLE `appointment_status` DISABLE KEYS */;
INSERT INTO `appointment_status` VALUES (4,'Cancelada'),(3,'Completada'),(2,'Confirmada'),(1,'Pendiente');
/*!40000 ALTER TABLE `appointment_status` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `available_times`
--

DROP TABLE IF EXISTS `available_times`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `available_times` (
  `id` int NOT NULL AUTO_INCREMENT,
  `professional_id` int NOT NULL,
  `day_week_id` tinyint NOT NULL COMMENT '1=Dom,2=Lun,3=Mar,4=Mie,5=Jue,6=Vie,7=Sab',
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_horario` (`professional_id`,`day_week_id`,`start_time`),
  KEY `day_week_id` (`day_week_id`),
  CONSTRAINT `available_times_ibfk_1` FOREIGN KEY (`professional_id`) REFERENCES `professionals` (`id`) ON DELETE CASCADE,
  CONSTRAINT `available_times_ibfk_2` FOREIGN KEY (`day_week_id`) REFERENCES `days_of_week` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `available_times`
--

LOCK TABLES `available_times` WRITE;
/*!40000 ALTER TABLE `available_times` DISABLE KEYS */;
INSERT INTO `available_times` VALUES (1,1,1,'08:00:00','12:00:00'),(2,1,1,'14:00:00','18:00:00'),(3,1,3,'08:00:00','12:00:00'),(4,1,5,'09:00:00','17:00:00'),(5,2,2,'09:00:00','13:00:00'),(6,2,2,'15:00:00','19:00:00'),(7,2,4,'09:00:00','13:00:00'),(8,2,6,'08:00:00','12:00:00'),(9,3,1,'10:00:00','14:00:00'),(10,3,3,'10:00:00','14:00:00'),(11,3,5,'12:00:00','18:00:00'),(12,3,6,'09:00:00','13:00:00'),(13,4,2,'08:00:00','12:00:00'),(14,4,4,'14:00:00','18:00:00'),(15,4,5,'08:00:00','12:00:00'),(16,4,6,'10:00:00','16:00:00');
/*!40000 ALTER TABLE `available_times` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clients`
--

DROP TABLE IF EXISTS `clients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clients` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(250) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_active` tinyint DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clients`
--

LOCK TABLES `clients` WRITE;
/*!40000 ALTER TABLE `clients` DISABLE KEYS */;
INSERT INTO `clients` VALUES (1,'Juan Perez','juan.perez@gmail.com','3001234567','2026-04-10 03:12:37','2026-04-10 03:12:37',1),(2,'Maria Gomez','maria.gomez@gmail.com','3012345678','2026-04-10 03:12:37','2026-04-10 03:12:37',1),(3,'Carlos Ramirez','carlos.ramirez@gmail.com','3023456789','2026-04-10 03:12:37','2026-04-10 03:12:37',1),(4,'Laura Torres','laura.torres@gmail.com','3034567890','2026-04-10 03:12:37','2026-04-10 03:12:37',1),(5,'Andres Castro','andres.castro@gmail.com','3045678901','2026-04-10 03:12:37','2026-04-10 03:12:37',1),(6,'Sofia Herrera','sofia.herrera@gmail.com','3056789012','2026-04-10 03:12:37','2026-04-10 03:12:37',1),(7,'Daniel Rojas','daniel.rojas@gmail.com','3067890123','2026-04-10 03:12:37','2026-04-10 03:12:37',1),(8,'Valentina Ruiz','valentina.ruiz@gmail.com','3078901234','2026-04-10 03:12:37','2026-04-10 03:12:37',1);
/*!40000 ALTER TABLE `clients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `days_of_week`
--

DROP TABLE IF EXISTS `days_of_week`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `days_of_week` (
  `id` tinyint NOT NULL UNIQUE,
  `nombre` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `days_of_week`
--

LOCK TABLES `days_of_week` WRITE;
/*!40000 ALTER TABLE `days_of_week` DISABLE KEYS */;
INSERT INTO `days_of_week` VALUES (2,'Lunes'),(3,'Martes'),(4,'Miercoles'),(5,'Jueves'),(6,'Viernes'),(7,'Sabado'),(1,'Domingo');
/*!40000 ALTER TABLE `days_of_week` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `professionals`
--

DROP TABLE IF EXISTS `professionals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `professionals` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(250) NOT NULL,
  `email` varchar(250) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_active` tinyint DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `professionals`
--

LOCK TABLES `professionals` WRITE;
/*!40000 ALTER TABLE `professionals` DISABLE KEYS */;
INSERT INTO `professionals` VALUES (1,'Ana Martinez','ana.martinez@empresa.com','3101112233','2026-04-10 03:12:37','2026-04-10 03:12:37',1),(2,'Luis Fernandez','luis.fernandez@empresa.com','3102223344','2026-04-10 03:12:37','2026-04-10 03:12:37',1),(3,'Paola Sanchez','paola.sanchez@empresa.com','3103334455','2026-04-10 03:12:37','2026-04-10 03:12:37',1),(4,'Miguel Rodriguez','miguel.rodriguez@empresa.com','3104445566','2026-04-10 03:12:37','2026-04-10 03:12:37',1),(5,'Nicolas Peña','nicolas2@mail.com','3125668956','2026-04-10 04:20:13','2026-04-10 04:20:13',1);
/*!40000 ALTER TABLE `professionals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `professionals_services`
--

DROP TABLE IF EXISTS `professionals_services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `professionals_services` (
  `professional_id` int NOT NULL,
  `service_id` int NOT NULL,
  PRIMARY KEY (`professional_id`,`service_id`),
  KEY `service_id` (`service_id`),
  CONSTRAINT `professionals_services_ibfk_1` FOREIGN KEY (`professional_id`) REFERENCES `professionals` (`id`) ON DELETE CASCADE,
  CONSTRAINT `professionals_services_ibfk_2` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `professionals_services`
--

LOCK TABLES `professionals_services` WRITE;
/*!40000 ALTER TABLE `professionals_services` DISABLE KEYS */;
INSERT INTO `professionals_services` VALUES (1,1),(2,1),(1,2),(3,2),(3,3),(2,4),(4,4),(1,5),(4,5),(3,6),(4,6);
/*!40000 ALTER TABLE `professionals_services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `services`
--

DROP TABLE IF EXISTS `services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `services` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(250) NOT NULL,
  `description` text NOT NULL,
  `duration_minutes` int NOT NULL DEFAULT '30',
  `price` decimal(10,2) NOT NULL DEFAULT '0.00',
  `is_active` tinyint DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `services`
--

LOCK TABLES `services` WRITE;
/*!40000 ALTER TABLE `services` DISABLE KEYS */;
INSERT INTO `services` VALUES (1,'Corte de Cabello','Servicio de corte de cabello para cliente.',45,25000.00,1,'2026-04-10 03:12:37','2026-04-10 03:12:37'),(2,'Manicure','Servicio de manicure completo.',60,30000.00,1,'2026-04-10 03:12:37','2026-04-10 03:12:37'),(3,'Pedicure','Servicio de pedicure completo.',60,35000.00,1,'2026-04-10 03:12:37','2026-04-10 03:12:37'),(4,'Masaje Relajante','Sesion de masaje corporal relajante.',90,80000.00,1,'2026-04-10 03:12:37','2026-04-10 03:12:37'),(5,'Limpieza Facial','Tratamiento de limpieza facial profunda.',50,55000.00,1,'2026-04-10 03:12:37','2026-04-10 03:12:37'),(6,'Depilacion','Servicio de depilacion en diferentes zonas.',40,40000.00,1,'2026-04-10 03:12:37','2026-04-10 03:12:37');
/*!40000 ALTER TABLE `services` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-11 12:02:46
