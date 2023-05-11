import express from "express"
import mysql from "mysql2"
import cors from "cors"


const app = express()
app.use(express.json())
app.use(cors())

/*--------------------------------------------------------------------------------------------------------------------------------------------------*/
/*---------------------------------------------------------------MYSQL CONNECTION-------------------------------------------------------------------*/
/*--------------------------------------------------------------------------------------------------------------------------------------------------*/

//INITALIZE MYSQL DATABASE CONNECTION
const db = mysql.createConnection({
    host: "localhost",
    user:"root",
    password:"Hotdogjuicejuly1!",
    database:"mydb",
})


app.get("/", (req, res)=> {
    //on window
    res.json("hello this is the backend")
})

/*--------------------------------------------------------------------------------------------------------------------------------------------------*/
/*--------------------------------------------------------------------TABLES------------------------------------------------------------------------*/
/*--------------------------------------------------------------------------------------------------------------------------------------------------*/

//DISPLAY TABLES
app.get("/Tables", (req, res)=> {
    const q = "SHOW TABLES from mydb"
    db.query(q,(err, data) => {
        if (err) return res.json(err.message)
        return res.json(data)
    })
})


//DROP TABLES
app.post("/Tables/ProductReviews", (req, res)=> {
    //Drop from weak entities to strong entities
   const q = "DROP TABLE IF EXISTS StoreReviews, ProductReviews, Products_contained_Orders, Orders, Customers, Products, Stores, StoreEmployee"
    db.query(q,(err, data) => {
        if (err) return res.json(err.message)
        return res.json(data)
    })
})



//CREATE TABLES
//ALL TABLES ARE  3NF/BCNF
app.post('/CreateTables', (req, res) => {
    const q = 'CREATE TABLE IF NOT EXISTS Customers(CustomerID VARCHAR(16) NOT NULL,Name VARCHAR(255) NOT NULL,Address VARCHAR(255) NOT NULL,City VARCHAR(255) NOT NULL,Country VARCHAR(255) NOT NULL,Password VARCHAR(12) NOT NULL, Login VARCHAR(16) NOT NULL, Email VARCHAR(100) NOT NULL, CreditInfo INT UNSIGNED NULL, PRIMARY KEY(CustomerID),UNIQUE(CustomerID), UNIQUE INDEX (Login), UNIQUE (Email))'
    db.query(q, (err, data) => {
    if (err) {
        return res.json(err.message);
    }
    });

const q2 = 'CREATE TABLE IF NOT EXISTS StoreEmployee(EmployeeID VARCHAR(16) NOT NULL, Permissions TINYINT NULL, PRIMARY KEY(EmployeeID),UNIQUE(EmployeeID))'
    db.query(q2, (err, data) => {
    if (err) {
        return res.json(err.message);
    }
    });

const q3 = 'CREATE TABLE IF NOT EXISTS Stores(StoreID VARCHAR(16) NOT NULL, Rating FLOAT UNSIGNED NULL,Date DATE NULL, Text LONGTEXT NULL, Name VARCHAR(255) NOT NULL, Image LONGTEXT NULL, Logo LONGTEXT NULL, StoreDescription LONGTEXT NULL, EmployeeID VARCHAR(16), PRIMARY KEY(StoreID),UNIQUE(EmployeeID), UNIQUE(StoreID), FOREIGN KEY (EmployeeID) REFERENCES StoreEmployee(EmployeeID))'
    db.query(q3, (err, data) => {
    if (err) {
        return res.json(err.message);
    }
    });

const q4 = 'CREATE TABLE IF NOT EXISTS StoreReviews(StoreReviewID VARCHAR(16) NOT NULL, Rating INT UNSIGNED NULL,Date DATE NULL, Text LONGTEXT NULL, UpdateDate DATE NULL, Image LONGTEXT NULL, CustomerID VARCHAR(16) NOT NULL, StoreID VARCHAR(16) NOT NULL, PRIMARY KEY(StoreReviewID), UNIQUE(StoreReviewID), FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID), FOREIGN KEY (StoreID) REFERENCES Stores(StoreID))'
    db.query(q4, (err, data) => {
    if (err) {
        return res.json(err.message);
    }
    });

const q5 = 'CREATE TABLE IF NOT EXISTS Products(ProductID VARCHAR(16) NOT NULL,ProductName VARCHAR(255) NOT NULL, Material TEXT NOT NULL, Size FLOAT UNSIGNED NOT NULL, Colour TEXT NOT NULL, Gender TEXT NULL, Type TEXT NOT NULL, Price FLOAT UNSIGNED NOT NULL, Brand TEXT NOT NULL, ProductLocation TEXT NOT NULL,  Discount FLOAT NULL,  ProductDescription LONGTEXT NULL,  ProductImage LONGTEXT NOT NULL,  StoreID VARCHAR(16) NOT NULL,  PRIMARY KEY (ProductID),   FOREIGN KEY (StoreID) REFERENCES Stores(StoreID),   UNIQUE (ProductID))'
    db.query(q5, (err, data) => {
    if (err) {
        return res.json(err.message);
    }
    });

const q6 = 'CREATE TABLE IF NOT EXISTS ProductReviews (ProductReviewID VARCHAR(16) NOT NULL, Image LONGTEXT NULL, Date DATE NOT NULL, UpdateDate DATE NULL, Rating FLOAT UNSIGNED NOT NULL, Text LONGTEXT NULL, ProductID VARCHAR(16) NOT NULL, CustomerID VARCHAR(16) NOT NULL, PRIMARY KEY(ProductReviewID), UNIQUE(ProductReviewID), FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID), FOREIGN KEY (ProductID) REFERENCES Products(ProductID))'
    db.query(q6, (err, data) => {
    if (err) {
        return res.json(err.message);
    }
    });

const q7 = 'CREATE TABLE IF NOT EXISTS Orders(OrderID VARCHAR(16) NOT NULL, QuantityofProduct INT UNSIGNED NOT NULL,DatePlaced DATE NOT NULL, DateDelivery DATE  NOT NULL, TotalPrice DOUBLE UNSIGNED NOT NULL, CustomerID VARCHAR(16) NOT NULL, PRIMARY KEY(OrderID),UNIQUE(OrderID), FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID))'
    db.query(q7, (err, data) => {
    if (err) {
        return res.json(err.message);
    }
    });

const q8 = 'CREATE TABLE IF NOT EXISTS Products_contained_Orders(ProductID VARCHAR(16) NOT NULL, OrderID VARCHAR(16) NOT NULL, QuantityofProd INT NOT NULL, FOREIGN KEY (ProductID) REFERENCES Products(ProductID), FOREIGN KEY (OrderID) REFERENCES Orders(OrderID))'
    db.query(q8, (err, data) => {
    if (err) {
        return res.json(err.message);
    }
    return res.json(data);
    });
});



//POPULATE INSERT INTO TABLES
app.post("/Populate", (req, res) => {
    //POPULATE CUSTOMERS
    const q = `INSERT IGNORE INTO Customers VALUES 
    ('210607540', 'Victoria Kreinin', '185 King St North', 'Waterloo', 'Canada', 'vika', 'krei7540', 'krei7540@mylaurier.ca', 123),
    ('210607540', 'Victoria Kreinin', '185 King St North', 'Waterloo', 'Canada', 'vika', 'krei7540', 'krei7540@mylaurier.ca', 123),
    ('210607541', 'Eesha', '185 King St North', 'Waterloo', 'Canada', 'vika', 'eesha1234', 'eesha1234@mylaurier.ca', 123),
    ('210607542', 'Amani', '1 Erb St North', 'Toronto', 'Canada', 'amani', 'amani1234', 'amani1234@mylaurier.ca', NULL),
    ('210607543', 'Gbone', '12 King St North', 'Waterloo', 'Canada', 'Gbone', 'Gbone', 'Gbone@mylaurier.ca', 124569875)`;
    db.query(q, (err, data) => {
        if (err) return res.json(err)
    });

    //POPULATE CUSTOMERS    //note we deleted something in here
    const q2 = `INSERT IGNORE INTO Orders VALUES 
    ('123456789', 2, '2023-02-06', '2023-02-12', 15.99, (SELECT CustomerId from Customers WHERE CustomerId='210607540')),
    ('123456790', 15, '2023-02-07', '2023-02-13', 2024.75, (SELECT CustomerId from Customers WHERE CustomerId='210607540')),
    ('123456794', 1, '2023-02-07', '2023-02-13', 255.99, (SELECT CustomerId from Customers WHERE CustomerId='210607542')),
    ('123456795', 1, '2023-02-11', '2023-02-15', 521.12, (SELECT CustomerId from Customers WHERE CustomerId='210607540'))`;
    db.query(q2, (err, data) => {
        if (err) return res.json(err)
    });

    //POPULATE STORE EMPLOYEE
    const q3 = `INSERT IGNORE INTO StoreEmployee VALUES 
    ('5432110', 0),
    ('5432111', 1),
    ('5432112', 0),
    ('5432113', 0),
    ('5432114', 1)`;
    db.query(q3, (err, data) => {
        if (err) return res.json(err)
    });

    //POPULATE STORES
    const q4 = `INSERT IGNORE INTO Stores VALUES 
    ('6987569810', 4.2, '2022-12-20', NULL, "LuxShoes", NULL, NULL, "This is a luxury shoe store, provide a gift for YOUR feet", (SELECT EmployeeID from StoreEmployee WHERE EmployeeID='5432111')),
    ('6987569811', 4.7, '2022-01-03', NULL, "Vintage Shoes", NULL, NULL, "Step back into the past with the right shoes", (SELECT EmployeeID from StoreEmployee WHERE EmployeeID='5432114'))`;
    db.query(q4, (err, data) => {
        if (err) return res.json(err)
    });
    
    //POPULATE STOREREVIEWS TABLE
    const q5 = `INSERT IGNORE INTO StoreReviews VALUES 
    ('98725610', 3.0, '2023-01-20', NULL, NULL, NULL, (SELECT CustomerID from Customers WHERE CustomerID='210607540'), (SELECT StoreID from Stores WHERE StoreID='6987569810')),
    ('98725611', 5.0, '2023-02-13', "LOVED THIS STORE", NULL, "Image.url", (SELECT CustomerID from Customers WHERE CustomerID='210607542'), (SELECT StoreID from Stores WHERE StoreID='6987569811'))`;
    db.query(q5, (err, data) => {
        if (err) return res.json(err)
    });

    //POPULATE PRODUCTS TABLE
    const q6 = `INSERT IGNORE INTO Products VALUES 
    ('425136910', 'StrongSneak', 'Leather', 8.5, 'blue', NULL, "Sneaker", 52.25, "Nike", "Canada", NULL, "Cool blue shoes", "Image101.ca", (SELECT StoreID from Stores WHERE StoreID='6987569810')),
    ('425136911', 'PumpingPump', 'Velvet', 6, 'purple', NULL, "Heel", 80.00, "Chennel", "US", 5.00, "Cool purple shoes", "Image1712.ca", (SELECT StoreID from Stores WHERE StoreID='6987569811')),
    ('425136912', 'HighSky', 'Rubber', 6, 'purple', NULL, "Heel", 25.00, "Crocs", "US", 5.00, "Cool purple shoes", "Image1712.ca", (SELECT StoreID from Stores WHERE StoreID='6987569811')),
    ('425136913', 'HighSky', 'Rubber', 6, 'blue', NULL, "Heel", 25.00, "Crocs", "US", 5.00, "Cool purple shoes", "Image1712.ca", (SELECT StoreID from Stores WHERE StoreID='6987569811'))`;
    db.query(q6, (err, data) => {
        if (err) return res.json(err)
    });

    //POPULATE PRODUCTREVIEWS TABLE
    const q7 = `INSERT IGNORE INTO ProductReviews VALUES 
    ('6351', NULL, '2023-02-11', '2023-02-15', 4.0, "Great fit", (SELECT ProductID from Products WHERE ProductID='425136910'), (SELECT CustomerID from Customers WHERE CustomerID='210607540')),
    ('6352', NULL, '2023-02-11', '2023-02-15', 5.0, "LOVED ITTTT", (SELECT ProductID from Products WHERE ProductID='425136910'), (SELECT CustomerID from Customers WHERE CustomerID='210607541')), 
    ('6353', NULL, '2023-02-11', '2023-02-15', 2.0, "EWWWWWWWWW", (SELECT ProductID from Products WHERE ProductID='425136910'), (SELECT CustomerID from Customers WHERE CustomerID='210607542')),
    ('6354', "Image52436.ca", '2023-02-11', '2023-02-15', 1.0, "DONT BUY", (SELECT ProductID from Products WHERE ProductID='425136911'), (SELECT CustomerID from Customers WHERE CustomerID='210607540'))`;
    db.query(q7, (err, data) => {
        if (err) return res.json(err)
    });

    //POPULATE Products_contained_Orders TABLE
    const q8 = `INSERT IGNORE INTO Products_contained_Orders VALUES 
    ((SELECT ProductID from Products WHERE ProductID='425136910'), (SELECT OrderID from Orders WHERE OrderID='123456790'), 2),
    ((SELECT ProductID from Products WHERE ProductID='425136911'), (SELECT OrderID from Orders WHERE OrderID='123456790'), 1)`;
    db.query(q8, (err, data) => {
        if (err) return res.json(err)
        return res.json("All tables populated successfully!")
    });

})

    




/*--------------------------------------------------------------------------------------------------------------------------------------------------*/
/*--------------------------------------------------------------------CUSTOMERS---------------------------------------------------------------------*/
/*--------------------------------------------------------------------------------------------------------------------------------------------------*/
//DISPLAY CUSTOMERS TABLE
app.get("/Customers", (req, res)=> {
    const q = "SELECT * FROM Customers" 
    db.query(q,(err, data) => {
        if (err) return res.json(err.message)
        return res.json(data)
    });
})



//ADD INSERT CUSTOMER ROW
app.post("/Customers", (req, res) => {
    const q = "INSERT INTO Customers (CustomerID, Name, Address, City, Country, Password, Login, Email, CreditInfo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const values = [
        req.body.CustomerID,
        req.body.Name,
        req.body.Address,
        req.body.City,
        req.body.Country,
        req.body.Password,
        req.body.Login,
        req.body.Email,
        req.body.CreditInfo,
    ];

    db.query(q, values, (err, data) => {
        if (err) return res.json(err)
        return res.json("new customer has been added successfully!")
    });
})



//DELETE CUSTOMER
app.delete("/Customers/:CustomerID", (req, res) => {
    const CustomerID = req.params.CustomerID;
    const q = "DELETE FROM Customers WHERE CustomerID IN (?)"

    db.query(q, [[CustomerID]], (err, data) => {
        if (err) return res.send(err);
        return res.json(data);
      });
})


//UPDATE A CUSTOMER
app.put("/Customers/:CustomerID", (req, res) => {
    const CustomerID = req.params.CustomerID;
    const q = "UPDATE Customers SET Name= ?, Address= ?, City= ?, Country= ?, Password= ?, Login= ?, Email= ?, CreditInfo= ? WHERE CustomerID = ?";
  
    const values = [
      req.body.Name,
      req.body.Address,
      req.body.City,
      req.body.Country,
      req.body.Password,
      req.body.Login,
      req.body.Email,
      req.body.CreditInfo,
      CustomerID,
    ];
  
    db.query(q, values, (err, data) => {
      if (err) return res.send(err);
      return res.json(data);
    });
});


/*--------------------------------------------------------------------------------------------------------------------------------------------------*/
/*--------------------------------------------------------------------STOREEMPLOYEE-----------------------------------------------------------------*/
/*--------------------------------------------------------------------------------------------------------------------------------------------------*/

//DISPLAY STOREEMPLOYEE TABLE
app.get("/StoreEmployee", (req, res)=> {
    const q = "SELECT * FROM StoreEmployee" 
    db.query(q,(err, data) => {
        if (err) return res.json(err.message)
        return res.json(data)
    });
})


//ADD INSERT STOREEMPLOYEE ROW
app.post("/StoreEmployee", (req, res) => {
    const q = "INSERT INTO StoreEmployee (EmployeeID, Permissions) VALUES (?, ?)";
    const values = [
        req.body.EmployeeID,
        req.body.Permissions,
    ];

    db.query(q, values, (err, data) => {
        if (err) return res.json(err)
        return res.json("new store employee has been added successfully!")
    });
})


//DELETE STOREEMPLOYEE
app.delete("/StoreEmployee/:EmployeeID", (req, res) => {
    const EmployeeID = req.params.EmployeeID;
    const q = "DELETE FROM StoreEmployee WHERE EmployeeID IN (?)"

    db.query(q, [[EmployeeID]], (err, data) => {
        if (err) return res.send(err);
        return res.json(data);
      });
})


//UPDATE A STOREEMPLOYEE
app.put("/StoreEmployee/:EmployeeID", (req, res) => {
    const EmployeeID = req.params.EmployeeID;
    const q = "UPDATE StoreEmployee SET Permissions= ? WHERE EmployeeID = ?";

    const values = [
      req.body.Permissions,
      EmployeeID,
    ];
  
    db.query(q, values, (err, data) => {
      if (err) return res.send(err);
      return res.json(data);
    });
});








/*--------------------------------------------------------------------------------------------------------------------------------------------------*/
/*--------------------------------------------------------------------STORES------------------------------------------------------------------------*/
/*--------------------------------------------------------------------------------------------------------------------------------------------------*/


//DISPLAY STORES TABLE
app.get("/Stores", (req, res)=> {
    const q = "SELECT * FROM Stores" 
    db.query(q,(err, data) => {
        if (err) return res.json(err.message)
        return res.json(data)
    });
})


//ADD INSERT STORES ROW
app.post("/Stores", (req, res) => {
    const q = "INSERT INTO Stores (StoreID, Rating, Date, Text, Name, Image, Logo, StoreDescription, EmployeeID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const values = [
        req.body.StoreID,
        req.body.Rating,
        req.body.Date,
        req.body.Text,
        req.body.Name,
        req.body.Image,
        req.body.Logo,
        req.body.StoreDescription,
        req.body.EmployeeID,
    ];

    db.query(q, values, (err, data) => {
        if (err) return res.json(err)
        return res.json("new store has been added successfully!")
    });
})


//DELETE STORE
app.delete("/Stores/:StoreID", (req, res) => {
    const StoreID = req.params.StoreID;
    const q = "DELETE FROM Stores WHERE StoreID IN (?)"

    db.query(q, [[StoreID]], (err, data) => {
        if (err) return res.send(err);
        return res.json(data);
      });
})


//UPDATE A STORE
app.put("/Stores/:StoreID", (req, res) => {
    const StoreID = req.params.StoreID;
    const q = "UPDATE Stores SET Rating= ?, Date=?, Text=?, Name=?, Image=?, Logo=?, StoreDescription=?, EmployeeID=? WHERE StoreID = ?";

    const values = [
        req.body.Rating,
        req.body.Date,
        req.body.Text,
        req.body.Name,
        req.body.Image,
        req.body.Logo,
        req.body.StoreDescription,
        req.body.EmployeeID,
        StoreID,
    ];
  
    db.query(q, values, (err, data) => {
      if (err) return res.send(err);
      return res.json(data);
    });
});


/*--------------------------------------------------------------------------------------------------------------------------------------------------*/
/*--------------------------------------------------------------------Products----------------------------------------------------------------------*/
/*--------------------------------------------------------------------------------------------------------------------------------------------------*/

//DISPLAY Products TABLE
app.get("/Products", (req, res)=> {
    const q = "SELECT * FROM Products" 
    db.query(q,(err, data) => {
        if (err) return res.json(err.message)
        return res.json(data)
    });
})


//ADD INSERT Products ROW
app.post("/Products", (req, res) => {
    const q = "INSERT INTO Products (ProductID, ProductName, Material, Size, Colour, Gender, Type, Price, Brand, ProductLocation, Discount, ProductDescription, ProductImage, StoreID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const values = [
        req.body.ProductID,
        req.body.ProductName,
        req.body.Material,
        req.body.Size,
        req.body.Colour,
        req.body.Gender,
        req.body.Type,
        req.body.Price,
        req.body.Brand,
        req.body.ProductLocation,
        req.body.Discount,
        req.body.ProductDescription,
        req.body.ProductImage,
        req.body.StoreID,
    ];

    db.query(q, values, (err, data) => {
        if (err) return res.json(err)
        return res.json("new Product has been added successfully!")
    });
})


//DELETE PRODUCT
app.delete("/Products/:ProductID", (req, res) => {
    const ProductID = req.params.ProductID;
    const q = "DELETE FROM Products WHERE ProductID IN (?)"

    db.query(q, [[ProductID]], (err, data) => {
        if (err) return res.send(err);
        return res.json(data);
      });
})


//UPDATE A PRODUCT
app.put("/Products/:ProductID", (req, res) => {
    const ProductID = req.params.ProductID;
    const q = "UPDATE Products SET ProductName=?, Material=?, Size=?, Colour=?, Gender=?, Type=?, Price=?, Brand=?, ProductLocation=?, Discount=?, ProductDescription=?, ProductImage=?, StoreID=? WHERE ProductID = ?";

    const values = [
        req.body.ProductName,
        req.body.Material,
        req.body.Size,
        req.body.Colour,
        req.body.Gender,
        req.body.Type,
        req.body.Price,
        req.body.Brand,
        req.body.ProductLocation,
        req.body.Discount,
        req.body.ProductDescription,
        req.body.ProductImage,
        req.body.StoreID,
        ProductID,
    ];
  
    db.query(q, values, (err, data) => {
      if (err) return res.send(err);
      return res.json(data);
    });
});

/*--------------------------------------------------------------------------------------------------------------------------------------------------*/
/*--------------------------------------------------------------------ORDERS----------------------------------------------------------------------*/
/*--------------------------------------------------------------------------------------------------------------------------------------------------*/


//DISPLAY ORDERS TABLE
app.get("/Orders", (req, res)=> {
    const q = "SELECT * FROM Orders" 
    db.query(q,(err, data) => {
        if (err) return res.json(err.message)
        return res.json(data)
    });
})


//ADD INSERT Orders ROW
app.post("/Orders", (req, res) => {
    const q = "INSERT INTO Orders (OrderID, DatePlaced, DateDelivery, TotalPrice, CustomerID) VALUES (?, ?, ?, ?, ?, ?)";
    const values = [
        req.body.OrderID,
        req.body.DatePlaced, 
        req.body.DateDelivery, 
        req.body.TotalPrice, 
        req.body.CustomerID,
    ];

    db.query(q, values, (err, data) => {
        if (err) return res.json(err)
        return res.json("new Order has been added successfully!")
    });
})


//DELETE ORDER
app.delete("/Orders/:OrderID", (req, res) => {
    const OrderID = req.params.OrderID;
    const q = "DELETE FROM Orders WHERE OrderID IN (?)"

    db.query(q, [[OrderID]], (err, data) => {
        if (err) return res.send(err);
        return res.json(data);
      });
})


//UPDATE AN ORDER
app.put("/Orders/:OrderID", (req, res) => {
    const OrderID = req.params.OrderID;
    const q = "UPDATE Orders SET DatePlaced=?, DateDelivery=?, TotalPrice=?, CustomerID=? WHERE OrderID = ?";
    const values = [
        req.body.DatePlaced, 
        req.body.DateDelivery, 
        req.body.TotalPrice, 
        req.body.CustomerID,
        OrderID,
    ];
  
    db.query(q, values, (err, data) => {
      if (err) return res.send(err);
      return res.json(data);
    });
});




/*--------------------------------------------------------------------------------------------------------------------------------------------------*/
/*--------------------------------------------------------------------STOREREVIEWS----------------------------------------------------------------------*/
/*--------------------------------------------------------------------------------------------------------------------------------------------------*/


//DISPLAY StoreReviews TABLE
app.get("/StoreReviews", (req, res)=> {
    const q = "SELECT * FROM StoreReviews" 
    db.query(q,(err, data) => {
        if (err) return res.json(err.message)
        return res.json(data)
    });
})


//ADD INSERT StoreReviews ROW
app.post("/StoreReviews", (req, res) => {
    const q = "INSERT INTO StoreReviews ( StoreReviewID, Rating, Date, Text, UpdateDate, Image, CustomerID, StoreID) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    const values = [
        req.body.StoreReviewID,
        req.body.Rating, 
        req.body.Date, 
        req.body.Text, 
        req.body.UpdateDate, 
        req.body.Image,
        req.body.CustomerID,
        req.body.StoreID,
    ];
   

    db.query(q, values, (err, data) => {
        if (err) return res.json(err)
        return res.json("new StoreReview has been added successfully!")
    });
})


//DELETE StoreReview
app.delete("/StoreReviews/:StoreReviewID", (req, res) => {
    const StoreReviewID = req.params.StoreReviewID;
    const q = "DELETE FROM StoreReviews WHERE StoreReviewID IN (?)"

    db.query(q, [[StoreReviewID]], (err, data) => {
        if (err) return res.send(err);
        return res.json(data);
      });
})


//UPDATE A StoreReview
app.put("/StoreReviews/:StoreReviewID", (req, res) => {
    const StoreReviewID = req.params.StoreReviewID;
    const q = "UPDATE StoreReviews SET Rating=?, Date=?, Text=?, UpdateDate=?, Image=?, CustomerID=?, StoreID=? WHERE StoreReviewID = ?";
    const values = [
        req.body.Rating, 
        req.body.Date, 
        req.body.Text, 
        req.body.UpdateDate, 
        req.body.Image,
        req.body.CustomerID,
        req.body.StoreID,
        StoreReviewID,
    ];
  
    db.query(q, values, (err, data) => {
      if (err) return res.send(err);
      return res.json(data);
    });
});







/*--------------------------------------------------------------------------------------------------------------------------------------------------*/
/*--------------------------------------------------------------------PRODUCTREVIEWS----------------------------------------------------------------*/
/*--------------------------------------------------------------------------------------------------------------------------------------------------*/


//DISPLAY ProductReviews TABLE
app.get("/ProductReviews", (req, res)=> {
    const q = "SELECT * FROM ProductReviews" 
    db.query(q,(err, data) => {
        if (err) return res.json(err.message)
        return res.json(data)
    });
})


//ADD INSERT ProductReviews ROW
app.post("/ProductReviews", (req, res) => {
    const q = "INSERT INTO ProductReviews ( ProductReviewID, Rating, Date, Text, UpdateDate, Image, CustomerID, StoreID) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    const values = [
        req.body.ProductReviewID,
        req.body.Rating, 
        req.body.Date, 
        req.body.Text, 
        req.body.UpdateDate, 
        req.body.Image,
        req.body.CustomerID,
        req.body.ProductID,
    ];
   

    db.query(q, values, (err, data) => {
        if (err) return res.json(err)
        return res.json("new ProductReview has been added successfully!")
    });
})


//DELETE ProductReview
app.delete("/ProductReviews/:ProductReviewID", (req, res) => {
    const ProductReviewID = req.params.ProductReviewID;
    const q = "DELETE FROM ProductReviews WHERE ProductReviewID IN (?)"

    db.query(q, [[ProductReviewID]], (err, data) => {
        if (err) return res.send(err);
        return res.json(data);
      });
})


//UPDATE A ProductReview
app.put("/ProductReviews/:ProductReviewID", (req, res) => {
    const ProductReviewID = req.params.ProductReviewID;
    const q = "UPDATE ProductReviews SET Rating=?, Date=?, Text=?, UpdateDate=?, Image=?, CustomerID=?, StoreID=? WHERE ProductReviewID = ?";
    const values = [
        req.body.Rating, 
        req.body.Date, 
        req.body.Text, 
        req.body.UpdateDate, 
        req.body.Image,
        req.body.CustomerID,
        req.body.ProductID,
        ProductReviewID,
    ];
  
    db.query(q, values, (err, data) => {
      if (err) return res.send(err);
      return res.json(data);
    });
});










/*--------------------------------------------------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------Products_contained_Orders-------------------------------------------------------------*/
/*--------------------------------------------------------------------------------------------------------------------------------------------------*/


//DISPLAY Products_contained_Orders TABLE
app.get("/Products_contained_Orders", (req, res)=> {
    const q = "SELECT * FROM Products_contained_Orders" 
    db.query(q,(err, data) => {
        if (err) return res.json(err.message)
        return res.json(data)
    });
})


//ADD INSERT Products_contained_Orders ROW
app.post("/Products_contained_Orders", (req, res) => {
    const q = "INSERT INTO Products_contained_Orders (OrderID, ProductID, QuantityofProd) VALUES (?, ?, ?)";
    const values = [
        req.body.OrderID,
        req.body.ProductID,
        req.body.QuantityofProd,
    ];

    db.query(q, values, (err, data) => {
        if (err) return res.json(err)
        return res.json("new Products_contained_Orders has been added successfully!")
    });
})



















/*--------------------------------------------------------------------------------------------------------------------------------------------------*/
/*--------------------------------------------------------------------QUERIES------------------------------------------------------------------------*/
/*--------------------------------------------------------------------------------------------------------------------------------------------------*/



// SELECT 'Show all the product reviews a customer has written';
app.get("/Q1", (req, res)=> {
   const q = `
   SELECT Customers.Name, ProductReviews.CustomerID, ProductReviews.Text, ProductReviews.Rating, ProductReviews.ProductReviewID
   FROM ProductReviews
   INNER JOIN Customers ON (Customers.CustomerID = ProductReviews.CustomerID)
   WHERE (Customers.CustomerID = '210607542')`
   db.query(q,(err, data) => {
       if (err) return res.json(err.message)
       return res.json(data)
   })
})
// ΠName, CustomerID, Text, Rating, ProductReviewID ((σCustomerID = ‘210607542’) (Customers ∩ ProductReviews)) 






// SELECT 'Which stores have discounted products';
app.get("/Q2", (req, res)=> {
   const q = `
   SELECT Stores.StoreID, Stores.Name, Products.σProductID, Products.ProductName, Products.Discount
   FROM Stores
   INNER JOIN Products ON (Products.StoreID = Stores.StoreID)
   WHERE (Stores.StoreID = '6987569811')`
   db.query(q,(err, data) => {
       if (err) return res.json(err.message)
       return res.json(data)
   })
})
// ΠStoreID, Name, ProductID, ProductName, Discount((σStoreID = ‘6987569811’)(Products ∩ Stores)






// SELECT 'Displays the store owner of each store';
app.get("/Q3", (req, res)=> {
   const q = `
   SELECT StoreEmployee.EmployeeID, Stores.Name AS StoreOwned
   FROM StoreEmployee
   INNER JOIN Stores ON (Stores.EmployeeID = StoreEmployee.EmployeeID)
   WHERE (StoreEmployee.Permissions = 1)
   GROUP BY StoreEmployee.EmployeeID`
   db.query(q,(err, data) => {
       if (err) return res.json(err.message)
       return res.json(data)
   })
})


// ΠEmployeeID, Name As StoreOwned(ΓEmployeeID)((σPermissions = 1)(Stores ∩ StoreEmployee)) 


// SELECT 'Displays the all the products of a store (ex of storeid 6987569810)';
app.get("/Q4", (req, res)=> {
   const q = `
   SELECT Products.StoreID, Stores.Name, Products.ProductID, Products.ProductName
   FROM Products
   INNER JOIN Stores ON (Stores.StoreID = Products.StoreID)
   WHERE (Products.StoreID = 6987569810)
   GROUP BY Products.ProductID`
   db.query(q,(err, data) => {
       if (err) return res.json(err.message)
       return res.json(data)
   })
})


// ΠStoreID, Name, ProductID, ProductName(ΓProductID)((σStoreID = ‘6987569810)(Stores ∩ Products))


// SELECT 'Quantity of reviews per product';
app.get("/Q5", (req, res)=> {
   const q = `
   SELECT ProductReviews.ProductID, COUNT(ProductReviews.ProductID) AS AmountOfReviewsPerProduct
   FROM ProductReviews
   INNER JOIN Products On (Products.ProductID = ProductReviews.ProductID)
   GROUP BY ProductReviews.ProductID`
   db.query(q,(err, data) => {
       if (err) return res.json(err.message)
       return res.json(data)
   })
})


// ΠProductID((ProductIDFCOUNT ProductReviews As AmountOfReviewsPerProduct)(Products ∩ ProductReviews)) 








//   SELECT 'Displays all customers that are from Waterloo';
app.get("/Q6", (req, res)=> {
   const q = `
   SELECT CustomerId, Name, Email AS Contact, City
   FROM Customers
   WHERE (City = 'Waterloo')`
   db.query(q,(err, data) => {
       if (err) return res.json(err.message)
       return res.json(data)
   })
})
// ΠCustomerID, Name, Email As Contact, City(σCity = ‘Waterloo’ (Customers))






// SELECT 'Displays the order of a specific customer (in this example 210607542 is used)';
app.get("/Q7", (req, res)=> {
   const q = `
   SELECT *
   FROM Orders
   WHERE (CustomerID = '210607542')`
   db.query(q,(err, data) => {
       if (err) return res.json(err.message)
       return res.json(data)
   })
})
// σCustomerID = ‘210607542’ (Orders)








// SELECT ' Amount of orders placed by customers that did place an order';
app.get("/Q8", (req, res)=> {
   const q = `
   SELECT Orders.CustomerID, Customers.Name AS CustomerName, Count(DatePlaced) As HowManyOrdersPlaced, Customers.City
   FROM Orders
   INNER JOIN Customers On (Customers.CustomerId = Orders.CustomerId)
   GROUP BY CustomerId`
   db.query(q,(err, data) => {
       if (err) return res.json(err.message)
       return res.json(data)
   })
})
//((CustomerID, Name As CustomerName, CityFCOUNT DatePlaced As HowManyOrdersPlaced)(Customers ∩ Orders)) 




// SELECT ' Amount of orders placed by customers that did place an order';
app.get("/Q9", (req, res)=> {
   const q = `
   SELECT o.CustomerID, c.Name AS CustomerName, COUNT(o.DatePlaced) AS
   HowManyOrdersPlaced, c.City
   FROM Customers c
   INNER JOIN Orders o ON c.CustomerId = o.CustomerId
   WHERE EXISTS (
     SELECT 1
     FROM Orders o2
     WHERE o2.CustomerId = o.CustomerId
   )
   GROUP BY o.CustomerID`
   db.query(q,(err, data) => {
       if (err) return res.json(err.message)
       return res.json(data)
   })
})




























// SELECT ' Amount of orders placed on a specific date';
app.get("/Q10", (req, res)=> {
   const q = `
   SELECT DatePlaced, Count(DatePlaced) As HowManyOrdersPlacedOnSpecificDate
   FROM Orders
   GROUP BY DatePlaced`
   db.query(q,(err, data) => {
       if (err) return res.json(err.message)
       return res.json(data)
   })
})
//(DatePlaced FCOUNT DatePlaced As HowManyOrdersPlacedOnSpecificDate) (Orders)






// SELECT ' All stores and all their product offerings ordered by descending order of price';
app.get("/Q11", (req, res)=> {
   const q = `
   SELECT Stores.StoreID, Stores.Name, Products.ProductID, Products.ProductName, Products.Colour, Price
   FROM Products
   INNER JOIN Stores ON (Stores.StoreID = Products.StoreID)
   ORDER BY Price DESC`
   db.query(q,(err, data) => {
       if (err) return res.json(err.message)
       return res.json(data)
   })
})
// ΠStoreID, Name, ProductID, ProductName, Colour, Price DESC (Products ∩ Stores)




// SELECT ' Quantity of different colored shoes available at a specific store (in example store id 6987569811 used)';
app.get("/Q12", (req, res)=> {
   const q = `
   SELECT Products.Colour, COUNT(Products.StoreId) AS AmountofProductsOfThisColorAtStore, Products.StoreID
   FROM Products
   INNER JOIN Stores ON (Stores.StoreID = Products.StoreID)
   WHERE (Products.StoreId = '6987569811')
   GROUP BY Products.Colour
   UNION
   SELECT DISTINCT Products.Colour, 0 AS AmountofProductsOfThisColorAtStore, NULL AS StoreID
   FROM Products
   WHERE Products.StoreID != '6987569811'
   GROUP BY Products.Colour`
   db.query(q,(err, data) => {
       if (err) return res.json(err.message)
       return res.json(data)
   })
})
//(StoreID, Colour, FCOUNT Colour AS AmountOfProductsOfThisColourAtStore) (σStoreID = '6987569811' (Products ∩ Stores))






// SELECT 'All store reviews that have ratigns over or equal to 4.0';
app.get("/Q13", (req, res)=> {
   const q = `
   SELECT *
   FROM StoreReviews
   WHERE (Rating >= 4.0)`
   db.query(q,(err, data) => {
       if (err) return res.json(err.message)
       return res.json(data)
   })
})
// σRating >= 4.0 (StoreReviews)







// SELECT 'Descending order by total price';
app.get("/Q14", (req, res)=> {
   const q = `
   SELECT *
   FROM Orders
   ORDER BY TotalPrice DESC`
   db.query(q,(err, data) => {
       if (err) return res.json(err.message)
       return res.json(data)
   })
})
// t-TotalPrice DESC (Orders)






// SELECT 'Displays what the customer ordered';
app.get("/Q15", (req, res)=> {
   const q = `
   SELECT Products_contained_Orders.OrderID, Orders.CustomerID, Products_contained_Orders.ProductID, Products_contained_Orders.QuantityofProd
   FROM Products_contained_Orders
   INNER JOIN Orders ON (Orders.OrderID = Products_contained_Orders.OrderID)`
   db.query(q,(err, data) => {
       if (err) return res.json(err.message)
       return res.json(data)
   })
})
// ΠOrderID, CustomerID, ProductID, QuantityofProd(Orders ∩ Products_Contained_Orders)






















// SELECT 'Amount of people per city';
app.get("/Q16", (req, res)=> {
   const q = `
   SELECT DISTINCT City, COUNT(Customers.CustomerID) As AmountOfCustomersPerCity
   FROM Customers
   GROUP BY City`
   db.query(q,(err, data) => {
       if (err) return res.json(err.message)
       return res.json(data)
   })
})
// (City, CustomerIDFCOUNT City)(Customers)












// SELECT 'LOOK AT ALL THE CUSTOMERS WHO ARE IN WATERLOO BUT HAVE NOT YET PLACED AN ORDER';
app.get("/Q17", (req, res)=> {
   const q = `
   SELECT Customers.CustomerID, Customers.Name, Customers.Email
   FROM Customers
   WHERE (City = 'Waterloo')
   AND Customers.CustomerID NOT IN (
   SELECT Orders.CustomerID
   FROM Orders
   WHERE (Orders.CustomerID = Customers.CustomerID))`
   db.query(q,(err, data) => {
       if (err) return res.json(err.message)
       return res.json(data)
   })
})
// Π CustomerID, Name, Email ((σCity = ‘Waterloo’)(Customers - (Customers ⋈ Orders)))


























app.listen(8800, ()=> {
    console.log("Connected to backend!")
})


