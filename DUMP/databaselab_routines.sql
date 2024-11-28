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
-- Temporary view structure for view `universitystudentprogramsview`
--

DROP TABLE IF EXISTS `universitystudentprogramsview`;
/*!50001 DROP VIEW IF EXISTS `universitystudentprogramsview`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `universitystudentprogramsview` AS SELECT 
 1 AS `StudentID`,
 1 AS `UniversityName`,
 1 AS `ProgramName`,
 1 AS `degree`,
 1 AS `tuition`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `studentgradesview`
--

DROP TABLE IF EXISTS `studentgradesview`;
/*!50001 DROP VIEW IF EXISTS `studentgradesview`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `studentgradesview` AS SELECT 
 1 AS `StudentID`,
 1 AS `CurrentHighSchool`,
 1 AS `GradYear`,
 1 AS `HighSchoolCourseName`,
 1 AS `HighSchoolGrade`*/;
SET character_set_client = @saved_cs_client;

--
-- Final view structure for view `universitystudentprogramsview`
--

/*!50001 DROP VIEW IF EXISTS `universitystudentprogramsview`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `universitystudentprogramsview` AS select `us`.`StudentID` AS `StudentID`,`us`.`UniversityName` AS `UniversityName`,`us`.`ProgramName` AS `ProgramName`,`p`.`degree` AS `degree`,`p`.`tuition` AS `tuition` from (`universitystudent` `us` join `program` `p` on(((`us`.`ProgramName` = `p`.`programName`) and (`us`.`UniversityName` = `p`.`universityName`)))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `studentgradesview`
--

/*!50001 DROP VIEW IF EXISTS `studentgradesview`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `studentgradesview` AS select `hs`.`StudentID` AS `StudentID`,`hs`.`CurrentHighSchool` AS `CurrentHighSchool`,`hs`.`GradYear` AS `GradYear`,`hg`.`HighSchoolCourseName` AS `HighSchoolCourseName`,`hg`.`HighSchoolGrade` AS `HighSchoolGrade` from (`highschoolstudent` `hs` join `highschoolgrade` `hg` on((`hs`.`StudentID` = `hg`.`StudentID`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-11-21 16:20:48
