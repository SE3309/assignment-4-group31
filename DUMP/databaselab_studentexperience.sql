-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: databaselab
-- ------------------------------------------------------
-- Server version	8.0.40

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
-- Table structure for table `studentexperience`
--

DROP TABLE IF EXISTS `studentexperience`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `studentexperience` (
  `programName` varchar(50) NOT NULL,
  `universityName` varchar(50) NOT NULL,
  `careerRating` int DEFAULT NULL,
  `facilitiesRating` int DEFAULT NULL,
  `learningEnviroRating` int DEFAULT NULL,
  `scholarshipsRating` int DEFAULT NULL,
  `studentSatisfactionRating` int DEFAULT NULL,
  PRIMARY KEY (`programName`,`universityName`),
  CONSTRAINT `studentexperience_ibfk_1` FOREIGN KEY (`programName`, `universityName`) REFERENCES `program` (`programName`, `universityName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `studentexperience`
--

LOCK TABLES `studentexperience` WRITE;
/*!40000 ALTER TABLE `studentexperience` DISABLE KEYS */;
INSERT INTO `studentexperience` VALUES ('Business Administration','University of Cambridge',1,5,5,1,1),('Computer Science','Harvard University',5,2,5,3,1),('Law','University of Oxford',5,5,4,4,3),('Mechanical Engineering','Stanford University',5,3,5,3,3),('Medicine','Massachusetts Institute of Technology',2,2,5,3,3);
/*!40000 ALTER TABLE `studentexperience` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-11-21 16:20:47
