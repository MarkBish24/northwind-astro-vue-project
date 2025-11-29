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

router.get("/all-orders", async (req, res) => {
  const query = "SELECT * FROM Employees";

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
    } else {
      if (row.Password === password) {
        return res.json({ valid: true });
      } else {
        return res.json({ valid: false });
      }
    }
  });
});

export default router;
