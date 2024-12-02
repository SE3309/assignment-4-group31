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
INSERT INTO `studentexperience` VALUES ('Business Administration','University of Cambridge',1,5,5,1,1),('Computer Science','Harvard University',5,2,5,3,1),('Law','University of Oxford',5,5,4,4,3),('Mechanical Engineering','Stanford University',5,3,5,3,3),('Medicine','Massachusetts Institute of Technology',2,2,5,3,3),('Astrophysics', 'California Institute of Technology', 5, 5, 5, 4, 5),('Chemical Engineering', 'California Institute of Technology', 4, 5, 4, 3, 4),('Computer Science', 'California Institute of Technology', 5, 5, 5, 4, 5),('Applied Physics', 'California Institute of Technology', 5, 5, 4, 3, 4),('Bioinformatics', 'California Institute of Technology', 4, 4, 4, 3, 4),('History', 'Princeton University', 4, 4, 3, 3, 4),('Economics', 'Princeton University', 5, 5, 4, 4, 5),('Public Policy', 'Princeton University', 4, 5, 4, 3, 4),('Computer Science', 'Princeton University', 5, 5, 5, 4, 5),('Environmental Studies', 'Princeton University', 4, 4, 4, 3, 4),('Sociology', 'University of Chicago', 4, 4, 3, 3, 4),('Business Administration', 'University of Chicago', 5, 5, 5, 4, 5),('Statistics', 'University of Chicago', 4, 5, 4, 3, 4),('Public Policy', 'University of Chicago', 4, 5, 4, 3, 4),('Economics', 'University of Chicago', 5, 5, 5, 4, 5),('Law', 'Yale University', 5, 5, 5, 4, 5),('English Literature', 'Yale University', 4, 4, 4, 3, 4),('Medicine', 'Yale University', 5, 5, 5, 4, 5),('Political Science', 'Yale University', 5, 4, 4, 3, 4),('Divinity', 'Yale University', 3, 4, 3, 2, 3),('Journalism', 'Columbia University', 5, 4, 4, 3, 5),('Architecture', 'Columbia University', 4, 5, 4, 3, 4),('Finance', 'Columbia University', 5, 5, 5, 4, 5),('Data Science', 'Columbia University', 4, 5, 4, 3, 4),('Psychology', 'Columbia University', 4, 4, 4, 3, 4),('Mechanical Engineering', 'University of California, Berkeley', 5, 5, 5, 4, 5),('Electrical Engineering', 'University of California, Berkeley', 4, 5, 4, 3, 4),('Economics', 'University of California, Berkeley', 4, 4, 3, 3, 4),('Computer Science', 'University of California, Berkeley', 5, 5, 5, 4, 5),('Data Science', 'University of California, Berkeley', 4, 5, 4, 3, 4),('Forestry', 'University of British Columbia', 4, 4, 4, 3, 4),('Marine Biology', 'University of British Columbia', 5, 5, 5, 4, 5),('Medicine', 'University of British Columbia', 5, 5, 5, 4, 5),('Political Science', 'University of British Columbia', 5, 4, 4, 3, 4),('Data Analytics', 'University of British Columbia', 4, 5, 4, 3, 4),('Veterinary Medicine', 'University of Edinburgh', 5, 5, 5, 4, 5),('Creative Writing', 'University of Edinburgh', 4, 4, 3, 3, 4),('Artificial Intelligence', 'University of Edinburgh', 5, 5, 5, 4, 5),('Law', 'University of Edinburgh', 4, 5, 4, 3, 4),('Physics', 'University of Edinburgh', 4, 4, 4, 3, 4),('Astrophysics', 'Australian National University', 5, 5, 5, 4, 5),('Environmental Science', 'Australian National University', 4, 5, 4, 3, 4),('Political Science', 'Australian National University', 4, 4, 4, 3, 4),('Business Analytics', 'Australian National University', 4, 5, 4, 3, 4),('Data Science', 'Australian National University', 5, 5, 5, 4, 5),('Architecture', 'University of Melbourne', 5, 5, 5, 4, 5),('Medicine', 'University of Melbourne', 5, 5, 5, 4, 5),('Economics', 'University of Melbourne', 4, 4, 4, 3, 4),('Law', 'University of Melbourne', 4, 5, 4, 3, 4),('Physics', 'University of Melbourne', 5, 5, 5, 4, 5);
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
