# CS509_Group_Project
For this first iteration of your final group project you are to roll out part of the functionality. This iteration will represent an important milestone in the development of your application, incorporating RDS and front-end capabilities. The functionality at this point is truly limited. Your cloud-based application will only be partially working.

A. [30 points] GUI landing page (in HTML to be rendered on a browser)
You need to provide a URL landing page (like I've shown for the calculator example) that converts your storyboard ideas into actual presentation. It's your choice whether to have multiple landing pages or a single one.

Provide the initial landing pages for:

Site Manager
Store Owner 
Customer
Note that not all of the functionality has to be working, other than the specific use cases below. I will  be able to validate these are working by typing the URLs into my browser. These URLs are to be hosted within your S3 bucket.

B. [50 points] Demonstrate ideas for next iteration
The following use cases must be supported:

(SM) Report total inventory $$ amount in entire site
(SM) Remove Store
(SO) Create Store 
(SO) Add Computer 
(SO) Generate Inventory
I will validate the capabilities by executing the following concrete scenario. First four steps are from the point of view of the Store Owner.

(SO) Create Worcester store at (42.26259, -71.80229) with appropriate credentials
(SO) Create Boston store at (42.361145,  -71.057083) with appropriate credentials
(SO) Worcester store adds computer (price=$1500, Memory=16GB, Storage=1TB, Processor="Intel i9", Process Generation="13th Gen Intel", Graphics="NVIDIA GeForce RTX 4090")
(SO) Boston store adds computer (price=$2000, Memory=32GB, Storage=1TB, Processor="Intel i7", Process Generation="12th Gen Intel", Graphics="NVIDIA GeForce RTX 4080")
(SO) Boston store adds computer (price=$1250, Memory=16GB, Storage=4TB, Processor="Intel i9", Process Generation="11th Gen Intel", Graphics="AMD Radeon Pro W6300") 
(SO) Boston store owner can generate inventory for store to show list of two computers 
Next scenarios are from point of view of Site Manager

(SM) Site Manager reports total inventory for site to show (Worcester Store, $1500) and (Boston Store, $3250)
(SM) Site Manager removes the Worcester store
(SM) Site Manager reports total inventory for site to show (Boston Store, $3250)
 

C. [20 points] Database storage tables
I will not be judging this information from the point of view of a database designer (such as you would do for a class like CS 542 Database Systems) but from the point of view of a software engineer. Will these tables support the expected use cases for the final application? 

You need to present the schema that you have settled upon for this project. There are many ways to do this. If you have created the tables in the database already, then go to the MySqlWorkbench and issue a command like "show create table FULL-TABLE-NAME" (help hereLinks to an external site.) which will produce text output like the following:

CREATE TABLE 
 (
   
 varchar(20) NOT NULL,
   
 double DEFAULT NULL,
   PRIMARY KEY (
),
   UNIQUE KEY 
 (
)
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

This gives me all of the information I need. If you haven't created the tables yet, then use this same format to represent the tables you intend to create. I will review and make suggestions to improve chance of success in completing the project.