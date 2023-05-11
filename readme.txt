Group Number 33














Youtube tutorial used to kick start  https://www.youtube.com/watch?v=fPuLnzSjPLE


Deviations from tutorial:
- npm install and import mysql2, to avoid authentication error

-change line about insert line to include number of ? values e.g:
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
        })
    })


-Used next.js instead of create react app


-Note after installing cors in the backend folder, you have to run both the backend folder in one terminal and the front end folder in another terminal

-onclick button function changed name to onsubmit, functionality not changed at all

Tools and libraries:
React
MySQL 2
Express
Postman
Axios
CORS