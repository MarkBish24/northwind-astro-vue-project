import express from "express";
import db from "./db.js";
const router = express.Router();

// Sanity Check
router.get("/hello", (req, res) => {
  res.send("Hello World from backend!");
});

// *** Establish a password column with nulls ***

// router.get("/add-password-column", async (req, res) => {
//   const query = "ALTER TABLE Employees ADD COLUMN Password TEXT";

//   db.run(query, (err) => {
//     if (err) {
//       console.error("Error adding column:", err.message);
//       return res
//         .status(500)
//         .json({ message: "Error adding password column", error: err.message });
//     }
//     console.log("Password column added successfully!");
//     res.status(200).json({ message: "Password column added successfully!" });
//   });
// });

// Test Code
router.get("/get-all-employees", async (req, res) => {
  const query = "SELECT * FROM Products";

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error("Error fetching orders:", err.message);
      return res.status(500).json({ message: "Server error" });
    }

    res.status(200).json(rows);
  });
});

router.post("/check-employee-login/:employeeId", (req, res) => {
  const employeeId = req.params.employeeId;
  const { password } = req.body;

  // Look up Employee by ID only
  const query = `SELECT * FROM Employees WHERE EmployeeID = ?`;

  db.get(query, [employeeId], (err, row) => {
    if (err)
      return res.status(500).json({ valid: false, message: "Server Error" });
    if (!row) return res.json({ valid: false, message: "Employee not found" });

    // Check if password is null
    if (!row.Password) {
      // First Time login: Setting the Password
      const querySet = `UPDATE Employees SET Password = ? WHERE EmployeeID = ?`;
      db.run(querySet, [password, employeeId], function (err) {
        if (err)
          return res
            .status(500)
            .json({ valid: false, message: "Server error" });
        return res.json({ valid: true });
      });
    }
    // Password Already Exists, normal check in
    else {
      if (row.Password === password) {
        return res.json({ valid: true });
      } else {
        return res.json({ valid: false });
      }
    }
  });
});

// getting basic employee info for Orders Table

router.get("/get-employee-info/:employeeId", (req, res) => {
  const employeeId = req.params.employeeId;

  const query = `SELECT * FROM Employees WHERE EmployeeID = ?`;

  db.get(query, [employeeId], (err, row) => {
    if (err) return res.status(500).json({ message: "Server Error" });
    else if (!row)
      return res.status(404).json({ message: "Employee ID not found" });
    else return res.status(200).json(row);
  });
});

router.get("/get-orders/:employeeId", (req, res) => {
  const employeeId = req.params.employeeId;

  const query = `SELECT o.OrderID, o.OrderDate, o.CustomerID, 
                SUM(od.Quantity) AS TotalQuantity, 
                ROUND (SUM(od.Quantity * od.UnitPrice), 2) AS TotalAmount,
                GROUP_CONCAT(od.ProductID) AS ProductIDs
                FROM Orders o
                JOIN [Order Details] od ON o.OrderID = od.OrderID
                WHERE o.EmployeeID = ?
                GROUP BY o.OrderID
                ORDER BY o.OrderDate DESC
                `;
  db.all(query, [employeeId], (err, rows) => {
    if (err) {
      console.error("DB Error:", err.message);
      return res.status(500).json({ message: "Server Error" });
    }
    res.status(200).json(rows);
  });
});

router.get("/get-products-by-order/:orderId", (req, res) => {
  const orderId = req.params.orderId;

  const query = `SELECT 
                p.ProductID,
                p.ProductName,
                od.Quantity,
                od.UnitPrice,
                ROUND(od.Quantity * od.UnitPrice, 2) AS LineTotal
                FROM [Order Details] od
                JOIN Products p ON od.ProductID = p.ProductID
                WHERE od.OrderID = ?;`;

  db.all(query, [orderId], (err, rows) => {
    if (err) {
      console.error("DB Error:", err.message);
      return res.status(500).json({ message: "Server Error" });
    }
    res.status(200).json(rows);
  });
});

export default router;
