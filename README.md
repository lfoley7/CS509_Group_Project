Hello!

Site link(From S3 Bucket): http://groupanalysishtml.s3-website.us-east-2.amazonaws.com

Frontend Repo: https://github.com/lfoley7/CS509_Group_Project

Lambda Function Repo: https://github.com/lyuchil/CS-509-Lambda-Functions/tree/master


Credentials for Site Manager: 
Username: SiteManager
Password: SiteManagerPassword

Credientials for Exisiting Store:
Store1
Username: TheStoreUsername
Password: TheStorePassword

Store2
Username: TheStore2Username
Password: TheStore2Password


- For the site, we currently have two stores with one comptuer in each. The credientials for site manager and the stores are listed above. Use the sign in button on the top left to get access their respective dashboards. 

- Above the filters, there is a section to input the customer's coordiante. If values are not entered into the textbox, then the shipping price is calcualted wit hteh customer location being Long: 0 Lat: 0. The total price will adjust after clicking the calcualte shippign button. 

- For the price filter, you must put in both min and max values. The filter will not work if either value if left empty. 

- To comapre two computers, follwo the text labels on the site and click on the row of each computer to add/remove them from the comparison table. 

- To create a store, please follwo the link that says "Click here to register!". It will take you to the sign up page. The store name is unqiue so no store with the same name will be created. Then be sure to input a set of credentials that will be used as login with the store location before creating the store. Once the crate store button is clicked, it will redirect to the sign in page.

- In the store owner dashboard, please use the fields above and input specific specifications for the computer. (Note: The RAM and Storage fileds are using GBs. So 1 TB = 1000 GB. To see the current) Then to see the current inventory for the store, click on the generate inventory report button. 

- The store balance is also displayed on the dashboard below the inventory table.

- To modify price, please enter the new amount into the new price textbox in the table and click modify price button next to it. Then click the generate invetory button again to see the change.

- To remove a computer, please click the remove computer button then click generate inventory again to see the changes again. Note: Deletion of a comptuer will incur a $25 fee

- For site manager, the current manager balance and total site inventory value is displayed in the dashboard.

- The site manager dashboard has the ability to sort store inventroy report in ascending or descending order, please select one before generate inventory report.

- To remove store click the remove store button next to the store and then click generate inventory report again to see the change.

- If at any point the website becomes unresponsive or things are not refreshing, it unfortuantely means that we have hit too many connections to the database. We are aware of the issue and was unable to resolve it. Please kindly wait 5-10 min for the connections to timeout and retry. 

