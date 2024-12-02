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
-- Table structure for table `program`
--

DROP TABLE IF EXISTS `program`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `program` (
  `programName` varchar(50) NOT NULL,
  `universityName` varchar(50) NOT NULL,
  `degree` varchar(50) DEFAULT NULL,
  `programLength` int DEFAULT NULL,
  `tuition` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`programName`,`universityName`),
  KEY `universityName` (`universityName`),
  CONSTRAINT `program_ibfk_1` FOREIGN KEY (`universityName`) REFERENCES `university` (`universityName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `program`
--

LOCK TABLES `program` WRITE;
/*!40000 ALTER TABLE `program` DISABLE KEYS */;
INSERT INTO `program` VALUES ('Business Administration','University of Cambridge','hr',4,4000.00),
  ('Computer Science','Harvard University','compsci',4,110000.00),
  ('Law','University of Oxford','MD',3,2000.00),
  ('Mechanical Engineering','Stanford University','Hr',4,5000.00),
  ('Medicine','Massachusetts Institute of Technology','Dermatology',4,3300.00),
  -- California Institute of Technology
('Astrophysics', 'California Institute of Technology', 'PhD', 5, 60000),
('Chemical Engineering', 'California Institute of Technology', 'MS', 2, 70000),
('Computer Science', 'California Institute of Technology', 'MS', 2, 75000),
('Applied Physics', 'California Institute of Technology', 'PhD', 5, 62000),
('Bioinformatics', 'California Institute of Technology', 'MS', 2, 68000),

-- Princeton University
('History', 'Princeton University', 'PhD', 5, 45000),
('Economics', 'Princeton University', 'PhD', 5, 47000),
('Public Policy', 'Princeton University', 'MPP', 2, 50000),
('Computer Science', 'Princeton University', 'MS', 2, 70000),
('Environmental Studies', 'Princeton University', 'MS', 1.5, 65000),

-- University of Chicago
('Sociology', 'University of Chicago', 'PhD', 5, 50000),
('Business Administration', 'University of Chicago', 'MBA', 2, 110000),
('Statistics', 'University of Chicago', 'MS', 2, 72000),
('Public Policy', 'University of Chicago', 'MPP', 2, 55000),
('Economics', 'University of Chicago', 'PhD', 5, 48000),

-- Yale University
('Law', 'Yale University', 'JD', 3, 140000),
('English Literature', 'Yale University', 'PhD', 5, 45000),
('Medicine', 'Yale University', 'MD', 4, 150000),
('Political Science', 'Yale University', 'PhD', 5, 47000),
('Divinity', 'Yale University', 'MDiv', 3, 42000),

-- Columbia University
('Journalism', 'Columbia University', 'MS', 2, 65000),
('Architecture', 'Columbia University', 'MS', 2, 72000),
('Finance', 'Columbia University', 'MBA', 2, 120000),
('Data Science', 'Columbia University', 'MS', 1.5, 68000),
('Psychology', 'Columbia University', 'PhD', 5, 45000),

-- University of California, Berkeley
('Mechanical Engineering', 'University of California, Berkeley', 'MS', 2, 75000),
('Electrical Engineering', 'University of California, Berkeley', 'MS', 2, 72000),
('Economics', 'University of California, Berkeley', 'PhD', 5, 50000),
('Computer Science', 'University of California, Berkeley', 'MS', 2, 77000),
('Data Science', 'University of California, Berkeley', 'MS', 1.5, 70000),

-- University of British Columbia
('Forestry', 'University of British Columbia', 'PhD', 5, 48000),
('Marine Biology', 'University of British Columbia', 'MS', 2, 62000),
('Medicine', 'University of British Columbia', 'MD', 4, 130000),
('Political Science', 'University of British Columbia', 'PhD', 5, 52000),
('Data Analytics', 'University of British Columbia', 'MS', 2, 65000),

-- University of Edinburgh
('Veterinary Medicine', 'University of Edinburgh', 'BVSc', 5, 75000),
('Creative Writing', 'University of Edinburgh', 'MA', 1, 40000),
('Artificial Intelligence', 'University of Edinburgh', 'MS', 2, 72000),
('Law', 'University of Edinburgh', 'LLM', 1, 55000),
('Physics', 'University of Edinburgh', 'PhD', 5, 46000),

-- Australian National University
('Astrophysics', 'Australian National University', 'PhD', 5, 47000),
('Environmental Science', 'Australian National University', 'MS', 2, 52000),
('Political Science', 'Australian National University', 'PhD', 5, 51000),
('Business Analytics', 'Australian National University', 'MBA', 2, 95000),
('Data Science', 'Australian National University', 'MS', 1.5, 60000),

-- University of Melbourne
('Architecture', 'University of Melbourne', 'MS', 2, 72000),
('Medicine', 'University of Melbourne', 'MD', 4, 140000),
('Economics', 'University of Melbourne', 'PhD', 5, 50000),
('Law', 'University of Melbourne', 'JD', 3, 125000),
('Physics', 'University of Melbourne', 'PhD', 5, 48000);
/*!40000 ALTER TABLE `program` ENABLE KEYS */;
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
