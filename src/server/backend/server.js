const express = require("express");
const mysql = require("mysql"); // Use the callback-based API
const mysql2 = require("mysql2/promise"); // Use the callback-based API
const bodyParser = require("body-parser");
const cors = require("cors");
const { parse } = require("json2csv");
const app = express();
const port = 3001;
const axios = require("axios");

app.use(cors());
app.use(bodyParser.json());
app.use(express.json()); // Support JSON payloads

// Create connection to MySQL database

// const dbConfig = {
//   host: '192.168.101.108',
//   user: 'treasurer_root2',
//   password: '$p4ssworD!',
//   database: 'treasurer_management_app',
//   port: 3307
// };

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "",
  database: "treasurer_management_app",
  port: 3307,
};

const dbConfigs = {
  host: "localhost",
  user: "root",
  password: "",
  database: "psic_code",
};

// Create a connection pool (more efficient for multiple queries)
const db = mysql.createPool(dbConfig);
const db2 = mysql.createPool(dbConfigs);
const pool = mysql2.createPool(dbConfig);

// Helper function to add date filters
const addDateFilters = (sql, month, day, year) => {
  if (month) {
    sql += ` AND MONTH(date) = ${db.escape(month)}`;
  }
  if (day) {
    sql += ` AND DAY(date) = ${db.escape(day)}`;
  }
  if (year) {
    sql += ` AND YEAR(date) = ${db.escape(year)}`;
  }
  return sql;
};

// Define an endpoint to fetch all data from real_property_tax_data to show in the table
app.get("/api/allData", (req, res) => {
  const sql = "SELECT * FROM real_property_tax_data";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching data:", err);
      res.status(500).send("Error fetching data");
    } else {
      res.json(results);
    }
  });
});

// Update comment for a specific receipt_no
app.post("/api/updateComment", async (req, res) => {
  const { receipt_no, comment } = req.body;

  try {
    await db.query(
      "UPDATE real_property_tax_data SET comments = ? WHERE receipt_no = ?",
      [comment, receipt_no]
    );
    res.status(200).json({ message: "Comment updated successfully" });
  } catch (error) {
    console.error("Error updating comment:", error);
    res.status(500).json({ error: "Database update failed" });
  }
});

app.post("/api/updateGFComment", async (req, res) => {
  const { receipt_no, comment } = req.body;

  try {
    await db.query(
      "UPDATE general_fund_data SET comments = ? WHERE receipt_no = ?",
      [comment, receipt_no]
    );
    res.status(200).json({ message: "Comment updated successfully" });
  } catch (error) {
    console.error("Error updating comment:", error);
    res.status(500).json({ error: "Database update failed" });
  }
});

app.post("/api/updateTFComment", async (req, res) => {
  const { RECEIPT_NO, COMMENTS } = req.body;

  try {
    await db.query(
      "UPDATE trust_fund_data SET COMMENTS = ? WHERE RECEIPT_NO = ?",
      [COMMENTS, RECEIPT_NO]
    );
    res.status(200).json({ message: "Comment updated successfully" });
  } catch (error) {
    console.error("Error updating comment:", error);
    res.status(500).json({ error: "Database update failed" });
  }
});

app.post("/api/updateCedulaComment", async (req, res) => {
  const { CTCNO, COMMENT } = req.body;

  try {
    await db.query("UPDATE cedula SET COMMENT = ? WHERE CTCNO  = ?", [
      COMMENT,
      CTCNO,
    ]);
    res.status(200).json({ message: "Comment updated successfully" });
  } catch (error) {
    console.error("Error updating comment:", error);
    res.status(500).json({ error: "Database update failed" });
  }
});

// Update comment for all under date
app.post("/api/allDayComment", (req, res) => {
  const { description, user } = req.body;

  // Get the current date and time
  const date = new Date();
  const formattedDate = date.toISOString().slice(0, 10); // YYYY-MM-DD
  const formattedTime = date.toTimeString().slice(0, 8); // HH:mm:ss

  const query =
    "INSERT INTO rpt_comments (date, description, time, user) VALUES (?, ?, ?, ?)";
  db.query(
    query,
    [formattedDate, description, formattedTime, user],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error saving comment");
      } else {
        res.status(200).send("Comment saved successfully");
      }
    }
  );
});

app.post("/api/insertGFComment", async (req, res) => {
  const { date, receipt_no, date_comment, name_client, description, user } =
    req.body;

  try {
    await db.query(
      "INSERT INTO gf_comment (date, receipt_no, date_comment, name_client, description, user, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())",
      [date, receipt_no, date_comment, name_client, description, user]
    );
    res.status(200).json({ message: "Comment inserted successfully" });
  } catch (error) {
    console.error("Error inserting comment:", error);
    res.status(500).json({ error: "Database insert failed" });
  }
});

// API to insert a comment into the `rpt_comments` table
app.post("/api/insertComment", async (req, res) => {
  const { date, receipt_no, date_comment, name_client, description, user } =
    req.body;

  try {
    await db.query(
      "INSERT INTO rpt_comment (date, receipt_no, date_comment, name_client, description, user, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())",
      [date, receipt_no, date_comment, name_client, description, user]
    );
    res.status(200).json({ message: "Comment inserted successfully" });
  } catch (error) {
    console.error("Error inserting comment:", error);
    res.status(500).json({ error: "Database insert failed" });
  }
});

app.post("/api/insertTFComment", async (req, res) => {
  const { date, receipt_no, date_comment, name_client, description, user } =
    req.body;

  console.log("Received data for insertion:", {
    date,
    receipt_no,
    date_comment,
    name_client,
    description,
    user,
  });

  try {
    await db.query(
      "INSERT INTO tf_comment (date, receipt_no, date_comment, name_client, description, user, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())",
      [date, receipt_no, date_comment, name_client, description, user]
    );
    res.status(200).json({ message: "Comment inserted successfully" });
  } catch (error) {
    console.error("Error inserting comment:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/insertCedulaComment", async (req, res) => {
  const { date, receipt_no, date_comment, name_client, description, user } =
    req.body;

  console.log("Received data for insertion:", {
    date,
    receipt_no,
    date_comment,
    name_client,
    description,
    user,
  });

  try {
    await db.query(
      "INSERT INTO cedula_comment (date, receipt_no, date_comment, name_client, description, user, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())",
      [date, receipt_no, date_comment, name_client, description, user]
    );
    res.status(200).json({ message: "Comment inserted successfully" });
  } catch (error) {
    console.error("Error inserting comment:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/commentRPTCounts", (req, res) => {
  const query = `
    SELECT DATE_FORMAT(date, "%Y-%m-%d") AS formatted_date, COUNT(*) as count 
    FROM rpt_comment 
    GROUP BY formatted_date
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching comment counts:", err);
      res.status(500).send("Error fetching comment counts");
    } else {
      const counts = {};
      results.forEach((row) => {
        counts[row.formatted_date] = row.count; // Use formatted_date instead of full timestamp
      });
      res.json(counts);
    }
  });
});

app.get("/api/commentGFCounts", (req, res) => {
  const query = `
    SELECT DATE_FORMAT(date, "%Y-%m-%d") AS formatted_date, COUNT(*) as count 
    FROM gf_comment 
    GROUP BY formatted_date
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching comment counts:", err);
      res.status(500).send("Error fetching comment counts");
    } else {
      const counts = {};
      results.forEach((row) => {
        counts[row.formatted_date] = row.count; // Use formatted_date instead of full timestamp
      });
      res.json(counts);
    }
  });
});

app.get("/api/commentTFCounts", (req, res) => {
  const query = `
    SELECT DATE_FORMAT(date, "%Y-%m-%d") AS formatted_date, COUNT(*) as count 
    FROM tf_comment 
    GROUP BY formatted_date
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching comment counts:", err);
      res.status(500).send("Error fetching comment counts");
    } else {
      const counts = {};
      results.forEach((row) => {
        counts[row.formatted_date] = row.count; // Use formatted_date instead of full timestamp
      });
      res.json(counts);
    }
  });
});

app.get("/api/commentCedulaCounts", (req, res) => {
  const query = `
    SELECT DATE_FORMAT(date, "%Y-%m-%d") AS formatted_date, COUNT(*) as count 
    FROM cedula_comment 
    GROUP BY formatted_date
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching comment counts:", err);
      res.status(500).send("Error fetching comment counts");
    } else {
      const counts = {};
      results.forEach((row) => {
        counts[row.formatted_date] = row.count; // Use formatted_date instead of full timestamp
      });
      res.json(counts);
    }
  });
});

app.get("/api/getAllComments", (req, res) => {
  const query = "SELECT * FROM rpt_comment ORDER BY created_at DESC";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching comments:", err);
      res.status(500).send("Error fetching comments");
    } else {
      res.status(200).json(results);
    }
  });
});

// Fetch comment count for a specific date
app.get("/api/getCommentCount/:date", (req, res) => {
  const { date } = req.params;
  const query = "SELECT COUNT(*) AS count FROM rpt_comment WHERE date = ?";

  db.query(query, [date], (err, results) => {
    if (err) {
      console.error("Error fetching comment count:", err);
      res.status(500).send("Error fetching comment count");
    } else {
      res.json({ count: results[0].count });
    }
  });
});

// Fetch comments for a specific date
app.get("/api/getRPTComments/:date", (req, res) => {
  const { date } = req.params;

  // Fetch comments based on the date of the receipt_no
  const query = `SELECT id, 
                        DATE_FORMAT(date, '%Y-%m-%d') AS date, 
                        receipt_no, 
                        DATE_FORMAT(date_comment, '%Y-%m-%d %H:%i:%s') AS date_comment, 
                        name_client, 
                        description, 
                        user, 
                        DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') AS created_at
                 FROM rpt_comment 
                 WHERE date = ? 
                 ORDER BY created_at DESC`;

  db.query(query, [date], (err, results) => {
    if (err) {
      console.error("Error fetching comments:", err);
      return res.status(500).send("Error fetching comments");
    }

    res.json(results); // Send formatted data
  });
});

app.get("/api/getGFComments/:date", (req, res) => {
  const { date } = req.params;

  // Fetch comments based on the date of the receipt_no
  const query = `SELECT id, 
                        DATE_FORMAT(date, '%Y-%m-%d') AS date, 
                        receipt_no, 
                        DATE_FORMAT(date_comment, '%Y-%m-%d %H:%i:%s') AS date_comment, 
                        name_client, 
                        description, 
                        user, 
                        DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') AS created_at
                 FROM gf_comment 
                 WHERE date = ? 
                 ORDER BY created_at DESC`;

  db.query(query, [date], (err, results) => {
    if (err) {
      console.error("Error fetching comments:", err);
      return res.status(500).send("Error fetching comments");
    }

    res.json(results); // Send formatted data
  });
});

app.get("/api/getTFComments/:date", (req, res) => {
  const { date } = req.params;

  // Fetch comments based on the date of the receipt_no
  const query = `SELECT id, 
                        DATE_FORMAT(date, '%Y-%m-%d') AS date, 
                        receipt_no, 
                        DATE_FORMAT(date_comment, '%Y-%m-%d %H:%i:%s') AS date_comment, 
                        name_client, 
                        description, 
                        user, 
                        DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') AS created_at
                 FROM tf_comment 
                 WHERE date = ? 
                 ORDER BY created_at DESC`;

  db.query(query, [date], (err, results) => {
    if (err) {
      console.error("Error fetching comments:", err);
      return res.status(500).send("Error fetching comments");
    }

    res.json(results); // Send formatted data
  });
});

app.get("/api/getCedulaComments/:date", (req, res) => {
  const { date } = req.params;

  // Fetch comments based on the date of the receipt_no
  const query = `SELECT id, 
                        DATE_FORMAT(date, '%Y-%m-%d') AS date, 
                        receipt_no, 
                        DATE_FORMAT(date_comment, '%Y-%m-%d %H:%i:%s') AS date_comment, 
                        name_client, 
                        description, 
                        user, 
                        DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') AS created_at
                 FROM cedula_comment 
                 WHERE date = ? 
                 ORDER BY created_at DESC`;

  db.query(query, [date], (err, results) => {
    if (err) {
      console.error("Error fetching comments:", err);
      return res.status(500).send("Error fetching comments");
    }

    res.json(results); // Send formatted data
  });
});

// Save endpoint
app.post("/api/save", (req, res) => {
  const newRecord = req.body;

  const sql = `
    INSERT INTO real_property_tax_data (
      date, name, receipt_no, current_year, current_penalties, current_discounts,
      prev_year, prev_penalties, prior_years, prior_penalties, total, barangay,
      share, additional_current_year, additional_penalties, additional_discounts,
      additional_prev_year, additional_prev_penalties, additional_prior_years,
      additional_prior_penalties, additional_total, gf_total, status, cashier, comments
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    newRecord.date,
    newRecord.name,
    newRecord.receipt_no,
    newRecord.current_year,
    newRecord.current_penalties,
    newRecord.current_discounts,
    newRecord.prev_year,
    newRecord.prev_penalties,
    newRecord.prior_years,
    newRecord.prior_penalties,
    newRecord.total,
    newRecord.barangay,
    newRecord.share,
    newRecord.additional_current_year,
    newRecord.additional_penalties,
    newRecord.additional_discounts,
    newRecord.additional_prev_year,
    newRecord.additional_prev_penalties,
    newRecord.additional_prior_years,
    newRecord.additional_prior_penalties,
    newRecord.additional_total,
    newRecord.gf_total,
    newRecord.status,
    newRecord.cashier,
    newRecord.comments,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error inserting data:", err);
      return res
        .status(500)
        .send({ error: err.sqlMessage || "Error inserting data" });
    }
    res
      .status(201)
      .send({ message: "Record inserted successfully", id: result.insertId });
  });
});

app.delete("/api/deleteRPT/:id", (req, res) => {
  const recordId = req.params.id;

  const sql = `DELETE FROM real_property_tax_data WHERE id = ?`;

  db.query(sql, [recordId], (err, result) => {
    if (err) {
      console.error("Error deleting record:", err);
      return res
        .status(500)
        .send({ error: err.sqlMessage || "Error deleting record" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).send({ message: "Record not found" });
    }
    res.status(200).send({ message: "Record deleted successfully" });
  });
});

app.delete("/api/deleteGF/:id", (req, res) => {
  const recordId = req.params.id;

  const sql = `DELETE FROM general_fund_data WHERE id = ?`;

  db.query(sql, [recordId], (err, result) => {
    if (err) {
      console.error("Error deleting record:", err);
      return res
        .status(500)
        .send({ error: err.sqlMessage || "Error deleting record" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).send({ message: "Record not found" });
    }
    res.status(200).send({ message: "Record deleted successfully" });
  });
});

app.delete("/api/deleteTF/:id", (req, res) => {
  const recordId = req.params.id;

  const sql = `DELETE FROM trust_fund_data WHERE ID = ?`;

  db.query(sql, [recordId], (err, result) => {
    if (err) {
      console.error("Error deleting record:", err);
      return res
        .status(500)
        .send({ error: err.sqlMessage || "Error deleting record" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).send({ message: "Record not found" });
    }
    res.status(200).send({ message: "Record deleted successfully" });
  });
});

app.delete("/api/deleteCedula/:id", (req, res) => {
  const recordId = req.params.id;

  const sql = `DELETE FROM cedula WHERE CTC_ID = ?`;

  db.query(sql, [recordId], (err, result) => {
    if (err) {
      console.error("Error deleting record:", err);
      return res
        .status(500)
        .send({ error: err.sqlMessage || "Error deleting record" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).send({ message: "Record not found" });
    }
    res.status(200).send({ message: "Record deleted successfully" });
  });
});

app.put("/api/update/:id", async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  // Validate ID
  if (!id || isNaN(Number(id))) {
    return res.status(400).send({ message: "Invalid ID" });
  }

  console.log("Received ID for update:", id); // Debugging log
  console.log("Updated Data Received:", updatedData); // Debugging log

  const sql = `
      UPDATE real_property_tax_data
      SET
          date = ?, name = ?, receipt_no = ?, current_year = ?, 
          current_penalties = ?, current_discounts = ?, prev_year = ?, 
          prev_penalties = ?, prior_years = ?, prior_penalties = ?, total = ?, 
          barangay = ?, share = ?, additional_current_year = ?, 
          additional_penalties = ?, additional_discounts = ?, additional_prev_year = ?, 
          additional_prev_penalties = ?, additional_prior_years = ?, 
          additional_prior_penalties = ?, additional_total = ?, gf_total = ?, 
          status = ?, cashier = ?, comments = ?
      WHERE id = ?
  `;

  const values = [
    updatedData.date,
    updatedData.name,
    updatedData.receipt_no,
    updatedData.current_year,
    updatedData.current_penalties,
    updatedData.current_discounts,
    updatedData.prev_year,
    updatedData.prev_penalties,
    updatedData.prior_years,
    updatedData.prior_penalties,
    updatedData.total,
    updatedData.barangay,
    updatedData.share,
    updatedData.additional_current_year,
    updatedData.additional_penalties,
    updatedData.additional_discounts,
    updatedData.additional_prev_year,
    updatedData.additional_prev_penalties,
    updatedData.additional_prior_years,
    updatedData.additional_prior_penalties,
    updatedData.additional_total,
    updatedData.gf_total,
    updatedData.status,
    updatedData.cashier,
    updatedData.comments,
    id,
  ];

  try {
    db.query(sql, values, (err, result) => {
      if (err) {
        console.error("SQL Error:", err.sqlMessage);
        return res
          .status(500)
          .send({ message: "Error updating data", error: err.sqlMessage });
      }

      if (result.affectedRows === 0) {
        console.warn("No record found for update with ID:", id);
        return res.status(404).send({ message: "Record not found" });
      }

      console.log("Record updated successfully with ID:", id);
      res.status(200).send({ message: "Record updated successfully" });
    });
  } catch (err) {
    console.error("Unexpected server error:", err);
    res.status(500).send({ message: "Unexpected server error" });
  }
});

// Define the endpoint for downloading data
app.get("/api/downloadData", (req, res) => {
  const { month, day, year } = req.query;

  let sql = "SELECT * FROM real_property_tax_data WHERE 1=1";
  sql = addDateFilters(sql, month, day, year);

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching data:", err);
      res.status(500).send("Error fetching data");
    } else {
      if (results.length === 0) {
        res.status(404).send("No data found for the specified filters");
        return;
      }

      console.log("Fetched results:", results);

      const fields = Object.keys(results[0]);
      const csv = parse(results, { fields });
      res.setHeader("Content-disposition", "attachment; filename=data.csv");
      res.set("Content-Type", "text/csv");
      res.status(200).send(csv);
    }
  });
});

// Define an endpoint to fetch only gf_sef_total from the database
app.get("/api/TotalFund", (req, res) => {
  const { month, day, year } = req.query;
  let sql = "SELECT gf_total FROM real_property_tax_data WHERE 1=1";
  sql = addDateFilters(sql, month, day, year);

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching data:", err);
      res.status(500).send("Error fetching data");
    } else {
      res.json(results);
    }
  });
});

// Define an endpoint to fetch only General Fund total from the database
app.get("/api/TotalGeneralFund", (req, res) => {
  const { month, day, year } = req.query;
  let sql = "SELECT total FROM real_property_tax_data WHERE 1=1";
  sql = addDateFilters(sql, month, day, year);

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching data:", err);
      res.status(500).send("Error fetching data");
    } else {
      res.json(results);
    }
  });
});

// Define an endpoint to fetch only SEF Fund total from the database
app.get("/api/TotalSEFFund", (req, res) => {
  const { month, day, year } = req.query;
  let sql = "SELECT additional_total FROM real_property_tax_data WHERE 1=1";
  sql = addDateFilters(sql, month, day, year);

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching data:", err);
      res.status(500).send("Error fetching data");
    } else {
      res.json(results);
    }
  });
});

// Define an endpoint to fetch only 25% Share Fund total from the database
app.get("/api/TotalShareFund", (req, res) => {
  const { month, day, year } = req.query;
  let sql = "SELECT share FROM real_property_tax_data WHERE 1=1";
  sql = addDateFilters(sql, month, day, year);

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching data:", err);
      res.status(500).send("Error fetching data");
    } else {
      res.json(results);
    }
  });
});

app.get("/api/landData", (req, res) => {
  const { month, day, year } = req.query;
  let sql = `
    SELECT 
      'AGRI' AS category,
      IFNULL(SUM(current_year), 0) AS current,
      IFNULL(SUM(current_discounts), 0) AS discount,
      IFNULL(SUM(prev_year + prior_years), 0) AS prior,
      IFNULL(SUM(current_penalties), 0) AS penaltiesCurrent,
      IFNULL(SUM(prev_penalties + prior_penalties), 0) AS penaltiesPrior
    FROM real_property_tax_data
    WHERE status = 'LAND-AGRI'
  `;
  sql = addDateFilters(sql, month, day, year);

  sql += `
    UNION ALL
    SELECT 
      'RES' AS category,
      IFNULL(SUM(current_year), 0) AS current,
      IFNULL(SUM(current_discounts), 0) AS discount,
      IFNULL(SUM(prev_year + prior_years), 0) AS prior,
      IFNULL(SUM(current_penalties), 0) AS penaltiesCurrent,
      IFNULL(SUM(prev_penalties + prior_penalties), 0) AS penaltiesPrior
    FROM real_property_tax_data
    WHERE status = 'LAND-RES'
  `;
  sql = addDateFilters(sql, month, day, year);

  sql += `
    UNION ALL
    SELECT 
      'COMML' AS category,
      IFNULL(SUM(current_year), 0) AS current,
      IFNULL(SUM(current_discounts), 0) AS discount,
      IFNULL(SUM(prev_year + prior_years), 0) AS prior,
      IFNULL(SUM(current_penalties), 0) AS penaltiesCurrent,
      IFNULL(SUM(prev_penalties + prior_penalties), 0) AS penaltiesPrior
    FROM real_property_tax_data
    WHERE status = 'LAND-COMML'
  `;
  sql = addDateFilters(sql, month, day, year);

  sql += `
    UNION ALL
    SELECT 
      'SPECIAL' AS category,
      IFNULL(SUM(current_year), 0) AS current,
      IFNULL(SUM(current_discounts), 0) AS discount,
      IFNULL(SUM(prev_year + prior_years), 0) AS prior,
      IFNULL(SUM(current_penalties), 0) AS penaltiesCurrent,
      IFNULL(SUM(prev_penalties + prior_penalties), 0) AS penaltiesPrior
    FROM real_property_tax_data
    WHERE status = 'SPECIAL'
  `;
  sql = addDateFilters(sql, month, day, year);

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching land data:", err);
      res.status(500).send("Error fetching land data");
    } else {
      const totals = results.reduce(
        (acc, row) => {
          acc.current += row.current;
          acc.discount += row.discount;
          acc.prior += row.prior;
          acc.penaltiesCurrent += row.penaltiesCurrent;
          acc.penaltiesPrior += row.penaltiesPrior;
          return acc;
        },
        {
          category: "TOTAL",
          current: 0,
          discount: 0,
          prior: 0,
          penaltiesCurrent: 0,
          penaltiesPrior: 0,
        }
      );

      // Calculate the total based on the formula
      const totalSum =
        totals.current -
        totals.discount +
        totals.prior +
        totals.penaltiesCurrent +
        totals.penaltiesPrior;

      console.log("Total Sum:", totalSum);

      res.json([...results, totals]);
    }
  });
});

app.get("/api/bldgData", (req, res) => {
  const { month, day, year } = req.query;
  let sql = `
    SELECT 
      'MACHINERIES' AS category,
      IFNULL(SUM(current_year), 0) AS current,
      IFNULL(SUM(current_discounts), 0) AS discount,
      IFNULL(SUM(prev_year + prior_years), 0) AS prior,
      IFNULL(SUM(current_penalties), 0) AS penaltiesCurrent,
      IFNULL(SUM(prev_penalties + prior_penalties), 0) AS penaltiesPrior
    FROM real_property_tax_data
    WHERE status = 'MACHINERY'
  `;
  sql = addDateFilters(sql, month, day, year);

  sql += `
    UNION ALL
    SELECT 
      'BLDG-RES' AS category,
      IFNULL(SUM(current_year), 0) AS current,
      IFNULL(SUM(current_discounts), 0) AS discount,
      IFNULL(SUM(prev_year + prior_years), 0) AS prior,
      IFNULL(SUM(current_penalties), 0) AS penaltiesCurrent,
      IFNULL(SUM(prev_penalties + prior_penalties), 0) AS penaltiesPrior
    FROM real_property_tax_data
    WHERE status = 'BLDG-RES'
  `;
  sql = addDateFilters(sql, month, day, year);

  sql += `
    UNION ALL
    SELECT 
      'BLDG-COMML' AS category,
      IFNULL(SUM(current_year), 0) AS current,
      IFNULL(SUM(current_discounts), 0) AS discount,
      IFNULL(SUM(prev_year + prior_years), 0) AS prior,
      IFNULL(SUM(current_penalties), 0) AS penaltiesCurrent,
      IFNULL(SUM(prev_penalties + prior_penalties), 0) AS penaltiesPrior
    FROM real_property_tax_data
    WHERE status = 'BLDG-COMML'
  `;
  sql = addDateFilters(sql, month, day, year);

  sql += `
    UNION ALL
    SELECT 
      'BLDG-INDUS' AS category,
      IFNULL(SUM(current_year), 0) AS current,
      IFNULL(SUM(current_discounts), 0) AS discount,
      IFNULL(SUM(prev_year + prior_years), 0) AS prior,
      IFNULL(SUM(current_penalties), 0) AS penaltiesCurrent,
      IFNULL(SUM(prev_penalties + prior_penalties), 0) AS penaltiesPrior
    FROM real_property_tax_data
    WHERE status = 'BLDG-INDUS'
  `;
  sql = addDateFilters(sql, month, day, year);

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching building data:", err);
      res.status(500).send("Error fetching building data");
    } else {
      const totals = results.reduce(
        (acc, row) => {
          acc.current += row.current;
          acc.discount += row.discount;
          acc.prior += row.prior;
          acc.penaltiesCurrent += row.penaltiesCurrent;
          acc.penaltiesPrior += row.penaltiesPrior;
          return acc;
        },
        {
          category: "TOTAL",
          current: 0,
          discount: 0,
          prior: 0,
          penaltiesCurrent: 0,
          penaltiesPrior: 0,
        }
      );

      const totalSum =
        totals.current -
        totals.discount +
        totals.prior +
        totals.penaltiesCurrent +
        totals.penaltiesPrior;

      console.log("Backend Building Total Sum:", totalSum); // Log the totalSum to verify
      res.json([...results, { ...totals, totalSum }]);
    }
  });
});

app.get("/api/seflandData", (req, res) => {
  const { month, day, year } = req.query;
  let sql = `
    SELECT 
      'AGRI' AS category,
      IFNULL(SUM(additional_current_year), 0) AS current,
      IFNULL(SUM(additional_discounts), 0) AS discount,
      IFNULL(SUM(additional_prev_year + additional_prior_years), 0) AS prior,
      IFNULL(SUM(additional_penalties), 0) AS penaltiesCurrent,
      IFNULL(SUM(additional_prev_penalties + additional_prior_penalties), 0) AS penaltiesPrior
    FROM real_property_tax_data
    WHERE status = 'LAND-AGRI'
  `;
  sql = addDateFilters(sql, month, day, year);

  sql += `
    UNION ALL
    SELECT 
      'RES' AS category,
      IFNULL(SUM(additional_current_year), 0) AS current,
      IFNULL(SUM(additional_discounts), 0) AS discount,
      IFNULL(SUM(additional_prev_year + additional_prior_years), 0) AS prior,
      IFNULL(SUM(additional_penalties), 0) AS penaltiesCurrent,
      IFNULL(SUM(additional_prev_penalties + additional_prior_penalties), 0) AS penaltiesPrior
    FROM real_property_tax_data
    WHERE status = 'LAND-RES'
  `;
  sql = addDateFilters(sql, month, day, year);

  sql += `
    UNION ALL
    SELECT 
      'COMML' AS category,
      IFNULL(SUM(additional_current_year), 0) AS current,
      IFNULL(SUM(additional_discounts), 0) AS discount,
      IFNULL(SUM(additional_prev_year + additional_prior_years), 0) AS prior,
      IFNULL(SUM(additional_penalties), 0) AS penaltiesCurrent,
      IFNULL(SUM(additional_prev_penalties + additional_prior_penalties), 0) AS penaltiesPrior
    FROM real_property_tax_data
    WHERE status = 'LAND-COMML'
  `;
  sql = addDateFilters(sql, month, day, year);

  sql += `
    UNION ALL
    SELECT 
      'SPECIAL' AS category,
      IFNULL(SUM(additional_current_year), 0) AS current,
      IFNULL(SUM(additional_discounts), 0) AS discount,
      IFNULL(SUM(additional_prev_year + additional_prior_years), 0) AS prior,
      IFNULL(SUM(additional_penalties), 0) AS penaltiesCurrent,
      IFNULL(SUM(additional_prev_penalties + additional_prior_penalties), 0) AS penaltiesPrior
    FROM real_property_tax_data
    WHERE status = 'SPECIAL'
  `;
  sql = addDateFilters(sql, month, day, year);

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching land data:", err);
      res.status(500).send("Error fetching land data");
    } else {
      const totals = results.reduce(
        (acc, row) => {
          acc.current += row.current;
          acc.discount += row.discount;
          acc.prior += row.prior;
          acc.penaltiesCurrent += row.penaltiesCurrent;
          acc.penaltiesPrior += row.penaltiesPrior;
          return acc;
        },
        {
          category: "TOTAL",
          current: 0,
          discount: 0,
          prior: 0,
          penaltiesCurrent: 0,
          penaltiesPrior: 0,
        }
      );

      // Calculate the total based on the formula
      const totalSum =
        totals.current -
        totals.discount +
        totals.prior +
        totals.penaltiesCurrent +
        totals.penaltiesPrior;

      console.log("Total Sum:", totalSum);

      res.json([...results, totals]);
    }
  });
});

app.get("/api/sefbldgData", (req, res) => {
  const { month, day, year } = req.query;
  let sql = `
    SELECT 
      'MACHINERIES' AS category,
      IFNULL(SUM(additional_current_year), 0) AS current,
      IFNULL(SUM(additional_discounts), 0) AS discount,
      IFNULL(SUM(additional_prev_year + additional_prior_years), 0) AS prior,
      IFNULL(SUM(additional_penalties), 0) AS penaltiesCurrent,
      IFNULL(SUM(additional_prev_penalties + additional_prior_penalties), 0) AS penaltiesPrior
    FROM real_property_tax_data
    WHERE status = 'MACHINERY'
  `;
  sql = addDateFilters(sql, month, day, year);

  sql += `
    UNION ALL
    SELECT 
      'BLDG-RES' AS category,
      IFNULL(SUM(additional_current_year), 0) AS current,
      IFNULL(SUM(additional_discounts), 0) AS discount,
      IFNULL(SUM(additional_prev_year + additional_prior_years), 0) AS prior,
      IFNULL(SUM(additional_penalties), 0) AS penaltiesCurrent,
      IFNULL(SUM(additional_prev_penalties + additional_prior_penalties), 0) AS penaltiesPrior
    FROM real_property_tax_data
    WHERE status = 'BLDG-RES'
  `;
  sql = addDateFilters(sql, month, day, year);

  sql += `
    UNION ALL
    SELECT 
      'BLDG-COMML' AS category,
      IFNULL(SUM(additional_current_year), 0) AS current,
      IFNULL(SUM(additional_discounts), 0) AS discount,
      IFNULL(SUM(additional_prev_year + additional_prior_years), 0) AS prior,
      IFNULL(SUM(additional_penalties), 0) AS penaltiesCurrent,
      IFNULL(SUM(additional_prev_penalties + additional_prior_penalties), 0) AS penaltiesPrior
    FROM real_property_tax_data
    WHERE status = 'BLDG-COMML'
  `;
  sql = addDateFilters(sql, month, day, year);

  sql += `
    UNION ALL
    SELECT 
      'BLDG-INDUS' AS category,
      IFNULL(SUM(additional_current_year), 0) AS current,
      IFNULL(SUM(additional_discounts), 0) AS discount,
      IFNULL(SUM(additional_prev_year + additional_prior_years), 0) AS prior,
      IFNULL(SUM(additional_penalties), 0) AS penaltiesCurrent,
      IFNULL(SUM(additional_prev_penalties + additional_prior_penalties), 0) AS penaltiesPrior
    FROM real_property_tax_data
    WHERE status = 'BLDG-INDUS'
  `;
  sql = addDateFilters(sql, month, day, year);

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching building data:", err);
      res.status(500).send("Error fetching building data");
    } else {
      const totals = results.reduce(
        (acc, row) => {
          acc.current += row.current;
          acc.discount += row.discount;
          acc.prior += row.prior;
          acc.penaltiesCurrent += row.penaltiesCurrent;
          acc.penaltiesPrior += row.penaltiesPrior;
          return acc;
        },
        {
          category: "TOTAL",
          current: 0,
          discount: 0,
          prior: 0,
          penaltiesCurrent: 0,
          penaltiesPrior: 0,
        }
      );

      const totalSum =
        totals.current -
        totals.discount +
        totals.prior +
        totals.penaltiesCurrent +
        totals.penaltiesPrior;

      console.log("Backend Building Total Sum:", totalSum); // Log the totalSum to verify
      res.json([...results, { ...totals, totalSum }]);
    }
  });
});

app.get("/api/LandSharingData", (req, res) => {
  const rawYear = req.query.year;
  const rawMonth = req.query.month;
  const rawDay = req.query.day;

  // Safely parse inputs
  const year = rawYear ? parseInt(rawYear, 10) : null;
  const month = rawMonth ? parseInt(rawMonth, 10) : null;
  const day = rawDay ? parseInt(rawDay, 10) : null;

  // Construct the WHERE clause
  let whereClause = `WHERE status LIKE 'LAND%'`;
  if (year && month && day) {
    whereClause += ` AND DATE(\`date\`) = '${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}'`;
  } else if (year && month) {
    whereClause += ` AND YEAR(\`date\`) = ${year} AND MONTH(\`date\`) = ${month}`;
  } else if (year) {
    whereClause += ` AND YEAR(\`date\`) = ${year}`;
  }

  // Build the SQL query
  const sql = `
    SELECT
      'Current' AS category,
      SUM(IFNULL(current_year, 0) - IFNULL(current_discounts, 0)) AS LAND,
      SUM((IFNULL(current_year, 0) - IFNULL(current_discounts, 0)) * 0.35) AS \`35% Prov’l Share\`,
      SUM((IFNULL(current_year, 0) - IFNULL(current_discounts, 0)) * 0.40) AS \`40% Mun. Share\`,
      SUM((IFNULL(current_year, 0) - IFNULL(current_discounts, 0)) * 0.25) AS \`25% Brgy. Share\`
    FROM real_property_tax_data
    ${whereClause}

    UNION ALL

    SELECT
      'Prior' AS category,
      SUM(IFNULL(prev_year, 0) + IFNULL(prior_years, 0)) AS LAND,
      SUM((IFNULL(prev_year, 0) + IFNULL(prior_years, 0)) * 0.35) AS \`35% Prov’l Share\`,
      SUM((IFNULL(prev_year, 0) + IFNULL(prior_years, 0)) * 0.40) AS \`40% Mun. Share\`,
      SUM((IFNULL(prev_year, 0) + IFNULL(prior_years, 0)) * 0.25) AS \`25% Brgy. Share\`
    FROM real_property_tax_data
    ${whereClause}

    UNION ALL

    SELECT
      'Penalties' AS category,
      SUM(
        IFNULL(current_penalties, 0) +
        IFNULL(prev_penalties, 0) +
        IFNULL(prior_penalties, 0)
      ) AS LAND,
      SUM(
        (IFNULL(current_penalties, 0) +
        IFNULL(prev_penalties, 0) +
        IFNULL(prior_penalties, 0)) * 0.35
      ) AS \`35% Prov’l Share\`,
      SUM(
        (IFNULL(current_penalties, 0) +
        IFNULL(prev_penalties, 0) +
        IFNULL(prior_penalties, 0)) * 0.40
      ) AS \`40% Mun. Share\`,
      SUM(
        (IFNULL(current_penalties, 0) +
        IFNULL(prev_penalties, 0) +
        IFNULL(prior_penalties, 0)) * 0.25
      ) AS \`25% Brgy. Share\`
    FROM real_property_tax_data
    ${whereClause}

    UNION ALL

    SELECT
      'TOTAL' AS category,
      SUM(
        (IFNULL(current_year, 0) - IFNULL(current_discounts, 0)) +
        (IFNULL(prev_year, 0) + IFNULL(prior_years, 0)) +
        (IFNULL(current_penalties, 0) + IFNULL(prev_penalties, 0) + IFNULL(prior_penalties, 0))
      ) AS LAND,
      (
        SUM(
          (IFNULL(current_year, 0) - IFNULL(current_discounts, 0)) +
          (IFNULL(prev_year, 0) + IFNULL(prior_years, 0)) +
          (IFNULL(current_penalties, 0) + IFNULL(prev_penalties, 0) + IFNULL(prior_penalties, 0))
        ) * 0.35
      ) AS \`35% Prov’l Share\`,
      (
        SUM(
          (IFNULL(current_year, 0) - IFNULL(current_discounts, 0)) +
          (IFNULL(prev_year, 0) + IFNULL(prior_years, 0)) +
          (IFNULL(current_penalties, 0) + IFNULL(prev_penalties, 0) + IFNULL(prior_penalties, 0))
        ) * 0.40
      ) AS \`40% Mun. Share\`,
      (
        SUM(
          (IFNULL(current_year, 0) - IFNULL(current_discounts, 0)) +
          (IFNULL(prev_year, 0) + IFNULL(prior_years, 0)) +
          (IFNULL(current_penalties, 0) + IFNULL(prev_penalties, 0) + IFNULL(prior_penalties, 0))
        ) * 0.25
      ) AS \`25% Brgy. Share\`
    FROM real_property_tax_data
    ${whereClause};
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching land sharing data:", err);
      res.status(500).send("Error fetching land sharing data");
    } else {
      res.json(results);
    }
  });
});

app.get("/api/buildingSharingData", (req, res) => {
  const rawYear = req.query.year;
  const rawMonth = req.query.month;
  const rawDay = req.query.day;

  const year = rawYear ? parseInt(rawYear, 10) : null;
  const month = rawMonth ? parseInt(rawMonth, 10) : null;
  const day = rawDay ? parseInt(rawDay, 10) : null;

  // Construct WHERE clause
  let whereClause = `WHERE status IN ('MACHINERY', 'BLDG-RES', 'BLDG-COMML', 'BLDG-INDUS')`;
  if (year && month && day) {
    whereClause += ` AND DATE(\`date\`) = '${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}'`;
  } else if (year && month) {
    whereClause += ` AND YEAR(\`date\`) = ${year} AND MONTH(\`date\`) = ${month}`;
  } else if (year) {
    whereClause += ` AND YEAR(\`date\`) = ${year}`;
  }

  const sql = `
    SELECT
      'Current' AS category,
      SUM(IFNULL(current_year, 0) - IFNULL(current_discounts, 0)) AS \`BUILDING\`,
      SUM((IFNULL(current_year, 0) - IFNULL(current_discounts, 0)) * 0.35) AS \`35% Prov’l Share\`,
      SUM((IFNULL(current_year, 0) - IFNULL(current_discounts, 0)) * 0.40) AS \`40% Mun. Share\`,
      SUM((IFNULL(current_year, 0) - IFNULL(current_discounts, 0)) * 0.25) AS \`25% Brgy. Share\`
    FROM real_property_tax_data
    ${whereClause}

    UNION ALL

    SELECT
      'Prior' AS category,
      SUM(IFNULL(prev_year, 0) + IFNULL(prior_years, 0)) AS \`BUILDING\`,
      SUM((IFNULL(prev_year, 0) + IFNULL(prior_years, 0)) * 0.35) AS \`35% Prov’l Share\`,
      SUM((IFNULL(prev_year, 0) + IFNULL(prior_years, 0)) * 0.40) AS \`40% Mun. Share\`,
      SUM((IFNULL(prev_year, 0) + IFNULL(prior_years, 0)) * 0.25) AS \`25% Brgy. Share\`
    FROM real_property_tax_data
    ${whereClause}

    UNION ALL

    SELECT
      'Penalties' AS category,
      SUM(
        IFNULL(current_penalties, 0) +
        IFNULL(prev_penalties, 0) +
        IFNULL(prior_penalties, 0)
      ) AS \`BUILDING\`,
      SUM(
        (IFNULL(current_penalties, 0) +
        IFNULL(prev_penalties, 0) +
        IFNULL(prior_penalties, 0)) * 0.35
      ) AS \`35% Prov’l Share\`,
      SUM(
        (IFNULL(current_penalties, 0) +
        IFNULL(prev_penalties, 0) +
        IFNULL(prior_penalties, 0)) * 0.40
      ) AS \`40% Mun. Share\`,
      SUM(
        (IFNULL(current_penalties, 0) +
        IFNULL(prev_penalties, 0) +
        IFNULL(prior_penalties, 0)) * 0.25
      ) AS \`25% Brgy. Share\`
    FROM real_property_tax_data
    ${whereClause}

    UNION ALL

    SELECT
      'TOTAL' AS category,
      SUM(
        (IFNULL(current_year, 0) - IFNULL(current_discounts, 0)) +
        (IFNULL(prev_year, 0) + IFNULL(prior_years, 0)) +
        (IFNULL(current_penalties, 0) + IFNULL(prev_penalties, 0) + IFNULL(prior_penalties, 0))
      ) AS \`BUILDING\`,
      (
        SUM(
          (IFNULL(current_year, 0) - IFNULL(current_discounts, 0)) +
          (IFNULL(prev_year, 0) + IFNULL(prior_years, 0)) +
          (IFNULL(current_penalties, 0) + IFNULL(prev_penalties, 0) + IFNULL(prior_penalties, 0))
        ) * 0.35
      ) AS \`35% Prov’l Share\`,
      (
        SUM(
          (IFNULL(current_year, 0) - IFNULL(current_discounts, 0)) +
          (IFNULL(prev_year, 0) + IFNULL(prior_years, 0)) +
          (IFNULL(current_penalties, 0) + IFNULL(prev_penalties, 0) + IFNULL(prior_penalties, 0))
        ) * 0.40
      ) AS \`40% Mun. Share\`,
      (
        SUM(
          (IFNULL(current_year, 0) - IFNULL(current_discounts, 0)) +
          (IFNULL(prev_year, 0) + IFNULL(prior_years, 0)) +
          (IFNULL(current_penalties, 0) + IFNULL(prev_penalties, 0) + IFNULL(prior_penalties, 0))
        ) * 0.25
      ) AS \`25% Brgy. Share\`
    FROM real_property_tax_data
    ${whereClause};
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching building sharing data:", err);
      res.status(500).send("Error fetching building sharing data");
    } else {
      res.json(results);
    }
  });
});

app.get("/api/grandTotalSharing", (req, res) => {
  const { month, day, year } = req.query;

  // Construct WHERE clauses for LandData and BuildingData
  let landWhereClause = `status LIKE 'LAND%'`;
  landWhereClause = addDateFilters(landWhereClause, month, day, year);

  let buildingWhereClause = `status IN ('MACHINERY', 'BLDG-RES', 'BLDG-COMML', 'BLDG-INDUS')`;
  buildingWhereClause = addDateFilters(buildingWhereClause, month, day, year);

  // Build the SQL query using the updated WHERE clauses
  let sql = `
    WITH LandData AS (
      SELECT
        SUM(IFNULL(current_year, 0) - IFNULL(current_discounts, 0)) AS current,
        SUM(IFNULL(prev_year, 0) + IFNULL(prior_years, 0)) AS prior,
        SUM(
          IFNULL(current_penalties, 0) +
          IFNULL(prev_penalties, 0) +
          IFNULL(prior_penalties, 0)
        ) AS penalties
      FROM real_property_tax_data
      WHERE ${landWhereClause}
    ),
    BuildingData AS (
      SELECT
        SUM(IFNULL(current_year, 0) - IFNULL(current_discounts, 0)) AS current,
        SUM(IFNULL(prev_year, 0) + IFNULL(prior_years, 0)) AS prior,
        SUM(
          IFNULL(current_penalties, 0) +
          IFNULL(prev_penalties, 0) +
          IFNULL(prior_penalties, 0)
        ) AS penalties
      FROM real_property_tax_data
      WHERE ${buildingWhereClause}
    )
    SELECT
      'TOTAL' AS category,
      (
        IFNULL(LandData.current, 0) + IFNULL(LandData.prior, 0) + IFNULL(LandData.penalties, 0) +
        IFNULL(BuildingData.current, 0) + IFNULL(BuildingData.prior, 0) + IFNULL(BuildingData.penalties, 0)
      ) AS \`Grand Total\`,
      (
        (
          IFNULL(LandData.current, 0) + IFNULL(LandData.prior, 0) + IFNULL(LandData.penalties, 0) +
          IFNULL(BuildingData.current, 0) + IFNULL(BuildingData.prior, 0) + IFNULL(BuildingData.penalties, 0)
        ) * 0.35
      ) AS \`35% Prov’l Share\`,
      (
        (
          IFNULL(LandData.current, 0) + IFNULL(LandData.prior, 0) + IFNULL(LandData.penalties, 0) +
          IFNULL(BuildingData.current, 0) + IFNULL(BuildingData.prior, 0) + IFNULL(BuildingData.penalties, 0)
        ) * 0.40
      ) AS \`40% Mun. Share\`,
      (
        (
          IFNULL(LandData.current, 0) + IFNULL(LandData.prior, 0) + IFNULL(LandData.penalties, 0) +
          IFNULL(BuildingData.current, 0) + IFNULL(BuildingData.prior, 0) + IFNULL(BuildingData.penalties, 0)
        ) * 0.25
      ) AS \`25% Brgy. Share\`
    FROM LandData, BuildingData;
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching grand total sharing data:", err);
      res.status(500).send("Error fetching grand total sharing data");
    } else {
      res.json(results);
    }
  });
});

app.get("/api/sefLandSharingData", (req, res) => {
  const rawYear = req.query.year;
  const rawMonth = req.query.month;
  const rawDay = req.query.day;

  // Safely parse inputs
  const year = rawYear ? parseInt(rawYear, 10) : null;
  const month = rawMonth ? parseInt(rawMonth, 10) : null;
  const day = rawDay ? parseInt(rawDay, 10) : null;

  // Construct date filter
  let dateFilter = "";
  if (year && month && day) {
    dateFilter = `AND DATE(\`date\`) = '${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}'`;
  } else if (year && month) {
    dateFilter = `AND YEAR(\`date\`) = ${year} AND MONTH(\`date\`) = ${month}`;
  } else if (year) {
    dateFilter = `AND YEAR(\`date\`) = ${year}`;
  }

  // Build the SQL query
  const sql = `
    WITH LandData AS (
      SELECT
        'Current' AS category,
        SUM(IFNULL(additional_current_year, 0) - IFNULL(additional_discounts, 0)) AS amount
      FROM real_property_tax_data
      WHERE status LIKE 'LAND-%'
      ${dateFilter}

      UNION ALL

      SELECT
        'Prior' AS category,
        SUM(IFNULL(additional_prev_year, 0) + IFNULL(additional_prior_years, 0)) AS amount
      FROM real_property_tax_data
      WHERE status LIKE 'LAND-%'
      ${dateFilter}

      UNION ALL

      SELECT
        'Penalties' AS category,
        SUM(
          IFNULL(additional_penalties, 0) +
          IFNULL(additional_prev_penalties, 0) +
          IFNULL(additional_prior_penalties, 0)
        ) AS amount
      FROM real_property_tax_data
      WHERE status LIKE 'LAND-%'
      ${dateFilter}
    )
    SELECT 
      category,
      amount AS LAND,
      amount * 0.50 AS \`50% Prov’l Share\`,
      amount * 0.50 AS \`50% Mun. Share\`
    FROM LandData

    UNION ALL

    SELECT
      'TOTAL' AS category,
      SUM(amount) AS LAND,
      SUM(amount) * 0.50 AS \`50% Prov’l Share\`,
      SUM(amount) * 0.50 AS \`50% Mun. Share\`
    FROM LandData;
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching SEF land sharing data:", err);
      res.status(500).send("Error fetching SEF land sharing data");
    } else {
      res.json(results);
    }
  });
});

app.get("/api/landData", (req, res) => {
  const { month, day, year } = req.query;
  let sql = `
    SELECT 
      'AGRI' AS category,
      IFNULL(SUM(current_year), 0) AS current,
      IFNULL(SUM(current_discounts), 0) AS discount,
      IFNULL(SUM(prev_year + prior_years), 0) AS prior,
      IFNULL(SUM(current_penalties), 0) AS penaltiesCurrent,
      IFNULL(SUM(prev_penalties + prior_penalties), 0) AS penaltiesPrior
    FROM real_property_tax_data
    WHERE status = 'LAND-AGRI'
  `;
  sql = addDateFilters(sql, month, day, year);

  sql += `
    UNION ALL
    SELECT 
      'RES' AS category,
      IFNULL(SUM(current_year), 0) AS current,
      IFNULL(SUM(current_discounts), 0) AS discount,
      IFNULL(SUM(prev_year + prior_years), 0) AS prior,
      IFNULL(SUM(current_penalties), 0) AS penaltiesCurrent,
      IFNULL(SUM(prev_penalties + prior_penalties), 0) AS penaltiesPrior
    FROM real_property_tax_data
    WHERE status = 'LAND-RES'
  `;
  sql = addDateFilters(sql, month, day, year);

  sql += `
    UNION ALL
    SELECT 
      'COMML' AS category,
      IFNULL(SUM(current_year), 0) AS current,
      IFNULL(SUM(current_discounts), 0) AS discount,
      IFNULL(SUM(prev_year + prior_years), 0) AS prior,
      IFNULL(SUM(current_penalties), 0) AS penaltiesCurrent,
      IFNULL(SUM(prev_penalties + prior_penalties), 0) AS penaltiesPrior
    FROM real_property_tax_data
    WHERE status = 'LAND-COMML'
  `;
  sql = addDateFilters(sql, month, day, year);

  sql += `
    UNION ALL
    SELECT 
      'SPECIAL' AS category,
      IFNULL(SUM(current_year), 0) AS current,
      IFNULL(SUM(current_discounts), 0) AS discount,
      IFNULL(SUM(prev_year + prior_years), 0) AS prior,
      IFNULL(SUM(current_penalties), 0) AS penaltiesCurrent,
      IFNULL(SUM(prev_penalties + prior_penalties), 0) AS penaltiesPrior
    FROM real_property_tax_data
    WHERE status = 'SPECIAL'
  `;
  sql = addDateFilters(sql, month, day, year);

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching land data:", err);
      res.status(500).send("Error fetching land data");
    } else {
      const totals = results.reduce(
        (acc, row) => {
          acc.current += row.current;
          acc.discount += row.discount;
          acc.prior += row.prior;
          acc.penaltiesCurrent += row.penaltiesCurrent;
          acc.penaltiesPrior += row.penaltiesPrior;
          return acc;
        },
        {
          category: "TOTAL",
          current: 0,
          discount: 0,
          prior: 0,
          penaltiesCurrent: 0,
          penaltiesPrior: 0,
        }
      );

      // Calculate the total based on the formula
      const totalSum =
        totals.current -
        totals.discount +
        totals.prior +
        totals.penaltiesCurrent +
        totals.penaltiesPrior;

      console.log("Total Sum:", totalSum);

      res.json([...results, totals]);
    }
  });
});

app.get("/api/sefBuildingSharingData", (req, res) => {
  const rawYear = req.query.year;
  const rawMonth = req.query.month;
  const rawDay = req.query.day;

  const year = rawYear ? parseInt(rawYear, 10) : null;
  const month = rawMonth ? parseInt(rawMonth, 10) : null;
  const day = rawDay ? parseInt(rawDay, 10) : null;

  let whereClause = `WHERE status IN ('MACHINERY', 'BLDG-RES', 'BLDG-COMML', 'BLDG-INDUS')`;
  if (year && month && day) {
    whereClause += ` AND DATE(\`date\`) = '${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}'`;
  } else if (year && month) {
    whereClause += ` AND YEAR(\`date\`) = ${year} AND MONTH(\`date\`) = ${month}`;
  } else if (year) {
    whereClause += ` AND YEAR(\`date\`) = ${year}`;
  }

  const sql = `
    SELECT
      'Current' AS category,
      SUM(IFNULL(additional_current_year, 0) - IFNULL(additional_discounts, 0)) AS \`BUILDING\`,
      SUM((IFNULL(additional_current_year, 0) - IFNULL(additional_discounts, 0)) * 0.50) AS \`50% Prov’l Share\`,
      SUM((IFNULL(additional_current_year, 0) - IFNULL(additional_discounts, 0)) * 0.50) AS \`50% Mun. Share\`
    FROM real_property_tax_data
    ${whereClause}

    UNION ALL

    SELECT
      'Prior' AS category,
      SUM(IFNULL(additional_prev_year, 0) + IFNULL(additional_prior_years, 0)) AS \`BUILDING\`,
      SUM((IFNULL(additional_prev_year, 0) + IFNULL(additional_prior_years, 0)) * 0.50) AS \`50% Prov’l Share\`,
      SUM((IFNULL(additional_prev_year, 0) + IFNULL(additional_prior_years, 0)) * 0.50) AS \`50% Mun. Share\`
    FROM real_property_tax_data
    ${whereClause}

    UNION ALL

    SELECT
      'Penalties' AS category,
      SUM(
        IFNULL(additional_penalties, 0) +
        IFNULL(additional_prev_penalties, 0) +
        IFNULL(additional_prior_penalties, 0)
      ) AS \`BUILDING\`,
      SUM(
        (
          IFNULL(additional_penalties, 0) +
          IFNULL(additional_prev_penalties, 0) +
          IFNULL(additional_prior_penalties, 0)
        ) * 0.50
      ) AS \`50% Prov’l Share\`,
      SUM(
        (
          IFNULL(additional_penalties, 0) +
          IFNULL(additional_prev_penalties, 0) +
          IFNULL(additional_prior_penalties, 0)
        ) * 0.50
      ) AS \`50% Mun. Share\`
    FROM real_property_tax_data
    ${whereClause}

    UNION ALL

    SELECT
      'TOTAL' AS category,
      SUM(
        (IFNULL(additional_current_year, 0) - IFNULL(additional_discounts, 0)) +
        (IFNULL(additional_prev_year, 0) + IFNULL(additional_prior_years, 0)) +
        (
          IFNULL(additional_penalties, 0) +
          IFNULL(additional_prev_penalties, 0) +
          IFNULL(additional_prior_penalties, 0)
        )
      ) AS \`BUILDING\`,
      (
        SUM(
          (IFNULL(additional_current_year, 0) - IFNULL(additional_discounts, 0)) +
          (IFNULL(additional_prev_year, 0) + IFNULL(additional_prior_years, 0)) +
          (
            IFNULL(additional_penalties, 0) +
            IFNULL(additional_prev_penalties, 0) +
            IFNULL(additional_prior_penalties, 0)
          )
        ) * 0.50
      ) AS \`50% Prov’l Share\`,
      (
        SUM(
          (IFNULL(additional_current_year, 0) - IFNULL(additional_discounts, 0)) +
          (IFNULL(additional_prev_year, 0) + IFNULL(additional_prior_years, 0)) +
          (
            IFNULL(additional_penalties, 0) +
            IFNULL(additional_prev_penalties, 0) +
            IFNULL(additional_prior_penalties, 0)
          )
        ) * 0.50
      ) AS \`50% Mun. Share\`
    FROM real_property_tax_data
    ${whereClause};
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching SEF building sharing data:", err);
      res.status(500).send("Error fetching SEF building sharing data");
    } else {
      res.json(results);
    }
  });
});

app.get("/api/sefGrandTotalSharing", (req, res) => {
  const { month, day, year } = req.query;

  // Construct WHERE clauses
  let landWhereClause = `status LIKE 'LAND%'`;
  landWhereClause = addDateFilters(landWhereClause, month, day, year);

  let buildingWhereClause = `status IN ('MACHINERY', 'BLDG-RES', 'BLDG-COMML', 'BLDG-INDUS')`;
  buildingWhereClause = addDateFilters(buildingWhereClause, month, day, year);

  let sql = `
    WITH LandData AS (
      SELECT
        SUM(IFNULL(additional_current_year, 0) - IFNULL(additional_discounts, 0)) AS current,
        SUM(IFNULL(additional_prev_year, 0) + IFNULL(additional_prior_years, 0)) AS prior,
        SUM(
          IFNULL(additional_penalties, 0) +
          IFNULL(additional_prev_penalties, 0) +
          IFNULL(additional_prior_penalties, 0)
        ) AS penalties
      FROM real_property_tax_data
      WHERE ${landWhereClause}
    ),
    BuildingData AS (
      SELECT
        SUM(IFNULL(additional_current_year, 0) - IFNULL(additional_discounts, 0)) AS current,
        SUM(IFNULL(additional_prev_year, 0) + IFNULL(additional_prior_years, 0)) AS prior,
        SUM(
          IFNULL(additional_penalties, 0) +
          IFNULL(additional_prev_penalties, 0) +
          IFNULL(additional_prior_penalties, 0)
        ) AS penalties
      FROM real_property_tax_data
      WHERE ${buildingWhereClause}
    )
    SELECT
      'TOTAL' AS category,
      (
        IFNULL(LandData.current, 0) + IFNULL(LandData.prior, 0) + IFNULL(LandData.penalties, 0) +
        IFNULL(BuildingData.current, 0) + IFNULL(BuildingData.prior, 0) + IFNULL(BuildingData.penalties, 0)
      ) AS \`Grand Total\`,
      (
        (
          IFNULL(LandData.current, 0) + IFNULL(LandData.prior, 0) + IFNULL(LandData.penalties, 0) +
          IFNULL(BuildingData.current, 0) + IFNULL(BuildingData.prior, 0) + IFNULL(BuildingData.penalties, 0)
        ) * 0.50
      ) AS \`50% Prov’l Share\`,
      (
        (
          IFNULL(LandData.current, 0) + IFNULL(LandData.prior, 0) + IFNULL(LandData.penalties, 0) +
          IFNULL(BuildingData.current, 0) + IFNULL(BuildingData.prior, 0) + IFNULL(BuildingData.penalties, 0)
        ) * 0.50
      ) AS \`50% Mun. Share\`
    FROM LandData, BuildingData;
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching SEF grand total sharing data:", err);
      res.status(500).send("Error fetching SEF grand total sharing data");
    } else {
      res.json(results);
    }
  });
});

app.get("/api/overallTotalBasicAndSEF", (req, res) => {
  const { month, day, year } = req.query;

  // Build the SQL query
  let sql = `
    WITH LandData AS (
      SELECT
        SUM(IFNULL(current_year, 0)) AS current,
        SUM(IFNULL(current_discounts, 0)) AS discount,
        SUM(IFNULL(prev_year, 0) + IFNULL(prior_years, 0)) AS prior,
        SUM(IFNULL(current_penalties, 0)) AS penaltiesCurrent,
        SUM(IFNULL(prev_penalties, 0) + IFNULL(prior_penalties, 0)) AS penaltiesPrior
      FROM real_property_tax_data
      WHERE status LIKE 'LAND%'
      ${addDateFilters("", month, day, year)}
    ),
    BuildingData AS (
      SELECT
        SUM(IFNULL(current_year, 0)) AS current,
        SUM(IFNULL(current_discounts, 0)) AS discount,
        SUM(IFNULL(prev_year, 0) + IFNULL(prior_years, 0)) AS prior,
        SUM(IFNULL(current_penalties, 0)) AS penaltiesCurrent,
        SUM(IFNULL(prev_penalties, 0) + IFNULL(prior_penalties, 0)) AS penaltiesPrior
      FROM real_property_tax_data
      WHERE status IN ('MACHINERY', 'BLDG-RES', 'BLDG-COMML', 'BLDG-INDUS')
      ${addDateFilters("", month, day, year)}
    ),
    SEFLandData AS (
      SELECT
        SUM(IFNULL(additional_current_year, 0) - IFNULL(additional_discounts, 0)) AS current,
        SUM(IFNULL(additional_prev_year, 0) + IFNULL(additional_prior_years, 0)) AS prior,
        SUM(
          IFNULL(additional_penalties, 0) +
          IFNULL(additional_prev_penalties, 0) +
          IFNULL(additional_prior_penalties, 0)
        ) AS penalties
      FROM real_property_tax_data
      WHERE status LIKE 'LAND%'
      ${addDateFilters("", month, day, year)}
    ),
    SEFBuildingData AS (
      SELECT
        SUM(IFNULL(additional_current_year, 0) - IFNULL(additional_discounts, 0)) AS current,
        SUM(IFNULL(additional_prev_year, 0) + IFNULL(additional_prior_years, 0)) AS prior,
        SUM(
          IFNULL(additional_penalties, 0) +
          IFNULL(additional_prev_penalties, 0) +
          IFNULL(additional_prior_penalties, 0)
        ) AS penalties
      FROM real_property_tax_data
      WHERE status IN ('MACHINERY', 'BLDG-RES', 'BLDG-COMML', 'BLDG-INDUS')
      ${addDateFilters("", month, day, year)}
    )
    SELECT
      'TOTAL' AS category,
      (
        IFNULL(LandData.current, 0) - IFNULL(LandData.discount, 0) +
        IFNULL(BuildingData.current, 0) - IFNULL(BuildingData.discount, 0) +
        IFNULL(LandData.prior, 0) +
        IFNULL(BuildingData.prior, 0) +
        IFNULL(LandData.penaltiesCurrent, 0) +
        IFNULL(BuildingData.penaltiesCurrent, 0) +
        IFNULL(LandData.penaltiesPrior, 0) +
        IFNULL(BuildingData.penaltiesPrior, 0) +
        IFNULL(SEFLandData.current, 0) +
        IFNULL(SEFBuildingData.current, 0) +
        IFNULL(SEFLandData.prior, 0) +
        IFNULL(SEFBuildingData.prior, 0) +
        IFNULL(SEFLandData.penalties, 0) +
        IFNULL(SEFBuildingData.penalties, 0)
      ) AS \`Grand Total\`
    FROM LandData, BuildingData, SEFLandData, SEFBuildingData;
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error(
        "Error fetching overall total for Basic and SEF data:",
        err
      );
      res
        .status(500)
        .send("Error fetching overall total for Basic and SEF data");
    } else {
      res.json(results);
    }
  });
});

app.get("/api/overallTotalBasicAndSEFSharing", (req, res) => {
  const { month, day, year } = req.query;

  // Build the SQL query
  let sql = `
    WITH LandData AS (
      SELECT
        SUM(IFNULL(current_year, 0) - IFNULL(current_discounts, 0) + IFNULL(prev_year, 0) + IFNULL(prior_years, 0) + IFNULL(current_penalties, 0) + IFNULL(prev_penalties, 0) + IFNULL(prior_penalties, 0)) AS total_amount
      FROM real_property_tax_data
      WHERE status LIKE 'LAND%'
      ${addDateFilters("", month, day, year)}
    ),
    BuildingData AS (
      SELECT
        SUM(IFNULL(current_year, 0) - IFNULL(current_discounts, 0) + IFNULL(prev_year, 0) + IFNULL(prior_years, 0) + IFNULL(current_penalties, 0) + IFNULL(prev_penalties, 0) + IFNULL(prior_penalties, 0)) AS total_amount
      FROM real_property_tax_data
      WHERE status IN ('MACHINERY', 'BLDG-RES', 'BLDG-COMML', 'BLDG-INDUS')
      ${addDateFilters("", month, day, year)}
    ),
    SEFLandData AS (
      SELECT
        SUM(IFNULL(additional_current_year, 0) - IFNULL(additional_discounts, 0) + IFNULL(additional_prev_year, 0) + IFNULL(additional_prior_years, 0) + IFNULL(additional_penalties, 0) + IFNULL(additional_prev_penalties, 0) + IFNULL(additional_prior_penalties, 0)) AS total_amount
      FROM real_property_tax_data
      WHERE status LIKE 'LAND%'
      ${addDateFilters("", month, day, year)}
    ),
    SEFBuildingData AS (
      SELECT
        SUM(IFNULL(additional_current_year, 0) - IFNULL(additional_discounts, 0) + IFNULL(additional_prev_year, 0) + IFNULL(additional_prior_years, 0) + IFNULL(additional_penalties, 0) + IFNULL(additional_prev_penalties, 0) + IFNULL(additional_prior_penalties, 0)) AS total_amount
      FROM real_property_tax_data
      WHERE status IN ('MACHINERY', 'BLDG-RES', 'BLDG-COMML', 'BLDG-INDUS')
      ${addDateFilters("", month, day, year)}
    )
    SELECT
      'TOTAL' AS category,
      (
        IFNULL(LandData.total_amount, 0) +
        IFNULL(BuildingData.total_amount, 0) +
        IFNULL(SEFLandData.total_amount, 0) +
        IFNULL(SEFBuildingData.total_amount, 0)
      ) AS \`Grand Total\`,
      (
        (IFNULL(LandData.total_amount, 0) + IFNULL(BuildingData.total_amount, 0)) * 0.35 +
        (IFNULL(SEFLandData.total_amount, 0) + IFNULL(SEFBuildingData.total_amount, 0)) * 0.50
      ) AS \`Prov’l Share\`,
      (
        (IFNULL(LandData.total_amount, 0) + IFNULL(BuildingData.total_amount, 0)) * 0.40 +
        (IFNULL(SEFLandData.total_amount, 0) + IFNULL(SEFBuildingData.total_amount, 0)) * 0.50
      ) AS \`Mun. Share\`,
      (
        (IFNULL(LandData.total_amount, 0) + IFNULL(BuildingData.total_amount, 0)) * 0.25
      ) AS \`Brgy. Share\`
    FROM LandData, BuildingData, SEFLandData, SEFBuildingData;
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error(
        "Error fetching overall total for Basic and SEF Sharing data:",
        err
      );
      res
        .status(500)
        .send("Error fetching overall total for Basic and SEF Sharing data");
    } else {
      res.json(results);
    }
  });
});

// Download filtered data as CSV
app.get("/api/downloadData", (req, res) => {
  const { month, day, year } = req.query;
  const sqlQuery = `SELECT * FROM real_property_tax_data WHERE 
                    MONTH(date_column) = ? AND 
                    DAY(date_column) = ? AND 
                    YEAR(date_column) = ?`;
  db.query(sqlQuery, [month, day, year], (err, results) => {
    if (err) {
      console.error("Error querying the database:", err);
      res.status(500).send("Error querying the database");
    } else if (results.length === 0) {
      res.status(404).send("No data found for the specified filters");
    } else {
      const csv = parse(results);
      res.attachment("data.csv").send(csv);
    }
  });
});

app.get("/api/generalFundDataAll", (req, res) => {
  const query = "SELECT * FROM general_fund_data";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching data:", err);
      res.status(500).send({ error: "Database query failed" });
    } else {
      res.json(results);
    }
  });
});

app.get("/api/generalFundDataReport", (req, res) => {
  const rawMonth = req.query.month;
  const rawYear = req.query.year;

  const month = rawMonth ? parseInt(rawMonth, 10) : null;
  const year = rawYear ? parseInt(rawYear, 10) : null;

  // Validate parsed inputs
  if (!month || !year) {
    return res.status(400).send({ error: "Valid month and year are required" });
  }

  const query = `
    SELECT * FROM general_fund_data
    WHERE MONTH(\`date\`) = ? AND YEAR(\`date\`) = ?
  `;

  db.query(query, [month, year], (err, results) => {
    if (err) {
      console.error("Error fetching general fund data:", err);
      res.status(500).send({ error: "Database query failed" });
    } else {
      console.log("Filtered General Fund Results:", results);
      res.json(results);
    }
  });
});

app.get("/api/trustFundDataReport", (req, res) => {
  const rawMonth = req.query.month;
  const rawYear = req.query.year;

  const month = rawMonth ? parseInt(rawMonth, 10) : null;
  const year = rawYear ? parseInt(rawYear, 10) : null;

  // Validate parsed inputs
  if (!month || !year) {
    return res.status(400).send({ error: "Valid month and year are required" });
  }

  const query = `
    SELECT * FROM trust_fund_data
    WHERE MONTH(\`date\`) = ? AND YEAR(\`date\`) = ?
  `;

  db.query(query, [month, year], (err, results) => {
    if (err) {
      console.error("Error fetching trust fund data:", err);
      res.status(500).send({ error: "Database query failed" });
    } else {
      console.log("Filtered Trust Fund Results:", results);
      res.json(results);
    }
  });
});

app.get("/api/trustFundDataReport", (req, res) => {
  const { month, year } = req.query;

  // Validate month and year
  if (!month || !year) {
    return res.status(400).send({ error: "Month and year are required" });
  }

  const query = `
    SELECT * FROM trust_fund_data
    WHERE MONTH(DATE) = ? AND YEAR(DATE) = ?
  `;

  db.query(query, [month, year], (err, results) => {
    if (err) {
      console.error("Error fetching data:", err);
      res.status(500).send({ error: "Database query failed" });
    } else {
      console.log("Filtered Results:", results); // Debug log
      res.json(results);
    }
  });
});

app.get("/api/cedulaSummaryCollectionDataReport", (req, res) => {
  const rawMonth = req.query.month;
  const rawYear = req.query.year;

  const month = rawMonth ? parseInt(rawMonth, 10) : null;
  const year = rawYear ? parseInt(rawYear, 10) : null;

  if (!month || !year || isNaN(month) || isNaN(year)) {
    return res.status(400).send({ error: "Valid month and year are required" });
  }

  // Generate actual start and end dates of the month
  const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
  const endDate = new Date(year, month, 0).toISOString().split("T")[0]; // Last day of month

  const query = `
    SELECT SUM(BASICTAXDUE + BUSTAXDUE + SALTAXDUE + RPTAXDUE + INTEREST) AS Totalamountpaid
    FROM cedula
    WHERE DATEISSUED BETWEEN ? AND ?
  `;

  db.query(query, [startDate, endDate], (err, results) => {
    if (err) {
      console.error("Error fetching cedula summary data:", err);
      return res.status(500).send({ error: "Database query failed" });
    }

    console.log("Filtered Cedula Results:", results);
    res.json(results);
  });
});

// POST endpoint to save General Fund data
app.post("/api/saveGeneralFundData", (req, res) => {
  const {
    date,
    name,
    receipt_no,
    Manufacturing,
    Distributor,
    Retailing,
    Financial,
    Other_Business_Tax,
    Sand_Gravel,
    Fines_Penalties,
    Mayors_Permit,
    Weighs_Measure,
    Tricycle_Operators,
    Occupation_Tax,
    Cert_of_Ownership,
    Cert_of_Transfer,
    Cockpit_Prov_Share,
    Cockpit_Local_Share,
    Docking_Mooring_Fee,
    Sultadas,
    Miscellaneous_Fee,
    Reg_of_Birth,
    Marriage_Fees,
    Burial_Fees,
    Correction_of_Entry,
    Fishing_Permit_Fee,
    Sale_of_Agri_Prod,
    Sale_of_Acct_Form,
    Water_Fees,
    Stall_Fees,
    Cash_Tickets,
    Slaughter_House_Fee,
    Rental_of_Equipment,
    Doc_Stamp,
    Police_Report_Clearance,
    Secretaries_Fee,
    Med_Dent_Lab_Fees,
    Garbage_Fees,
    Cutting_Tree,
    total,
    cashier,
    type_receipt,
  } = req.body;

  // 1. First check if this receipt_no already exists
  const checkSql =
    "SELECT COUNT(*) AS count FROM general_fund_data WHERE receipt_no = ?";
  db.query(checkSql, [receipt_no], (checkErr, checkResults) => {
    if (checkErr) {
      console.error("Error checking duplicate receipt_no:", checkErr);
      return res
        .status(500)
        .json({ message: "Server error checking receipt_no" });
    }

    const { count } = checkResults[0];
    if (count > 0) {
      // 2. If exists, return a 400 with error message
      return res.status(400).json({ message: "Receipt number already exists" });
    }

    // 3. Otherwise, proceed to insert
    const query = `
      INSERT INTO general_fund_data (
        date, name, receipt_no, Manufacturing, Distributor, Retailing, Financial, Other_Business_Tax,
        Sand_Gravel, Fines_Penalties, Mayors_Permit, Weighs_Measure, Tricycle_Operators, Occupation_Tax,
        Cert_of_Ownership, Cert_of_Transfer, Cockpit_Prov_Share, Cockpit_Local_Share, Docking_Mooring_Fee,
        Sultadas, Miscellaneous_Fee, Reg_of_Birth, Marriage_Fees, Burial_Fees, Correction_of_Entry,
        Fishing_Permit_Fee, Sale_of_Agri_Prod, Sale_of_Acct_Form, Water_Fees, Stall_Fees, Cash_Tickets,
        Slaughter_House_Fee, Rental_of_Equipment, Doc_Stamp, Police_Report_Clearance, Secretaries_Fee,
        Med_Dent_Lab_Fees, Garbage_Fees, Cutting_Tree, total, cashier, type_receipt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      date,
      name,
      receipt_no,
      Manufacturing,
      Distributor,
      Retailing,
      Financial,
      Other_Business_Tax,
      Sand_Gravel,
      Fines_Penalties,
      Mayors_Permit,
      Weighs_Measure,
      Tricycle_Operators,
      Occupation_Tax,
      Cert_of_Ownership,
      Cert_of_Transfer,
      Cockpit_Prov_Share,
      Cockpit_Local_Share,
      Docking_Mooring_Fee,
      Sultadas,
      Miscellaneous_Fee,
      Reg_of_Birth,
      Marriage_Fees,
      Burial_Fees,
      Correction_of_Entry,
      Fishing_Permit_Fee,
      Sale_of_Agri_Prod,
      Sale_of_Acct_Form,
      Water_Fees,
      Stall_Fees,
      Cash_Tickets,
      Slaughter_House_Fee,
      Rental_of_Equipment,
      Doc_Stamp,
      Police_Report_Clearance,
      Secretaries_Fee,
      Med_Dent_Lab_Fees,
      Garbage_Fees,
      Cutting_Tree,
      total,
      cashier,
      type_receipt,
    ];

    db.query(query, values, (err, results) => {
      if (err) {
        console.error("Failed to insert data:", err);
        return res.status(500).json({ message: "Failed to save data" });
      }
      res.status(200).json({ message: "Data saved successfully" });
    });
  });
});

app.get("/api/TotalGeneralFundS", (req, res) => {
  const { month, day, year } = req.query;
  let sql = "SELECT SUM(`total`) AS overall_total FROM general_fund_data;";
  sql = addDateFilters(sql, month, day, year);
  console.log("SQL Query:", sql); // Debug: Log the SQL query

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching data:", err);
      res.status(500).send("Error fetching data");
    } else {
      console.log("Query Results:", results); // Debug: Log the query results
      res.json(results);
    }
  });
});

// Define an endpoint to get Tax on Business totals
app.get("/api/TaxOnBusinessTotal", (req, res) => {
  const { month, day, year } = req.query;

  let sql = `
    SELECT
      SUM(Manufacturing + Distributor + Retailing + Financial + Other_Business_Tax + Sand_Gravel + Fines_Penalties) AS Tax_On_Business
    FROM general_fund_data
    WHERE 1=1`;

  sql = addDateFilters(sql, month, day, year);

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching data:", err);
      res.status(500).send("Error fetching data");
      return;
    }
    res.json({ tax_on_business: results[0].Tax_On_Business || 0 });
  });
});

// Define an endpoint to get Regulatory Fees totals
app.get("/api/RegulatoryFeesTotal", (req, res) => {
  const { month, day, year } = req.query;

  let sql = `
    SELECT
      SUM(Mayors_Permit + Weighs_Measure + Tricycle_Operators
      + Occupation_Tax+ Cert_of_Ownership + Cert_of_Transfer
      + Cockpit_Prov_Share + Cockpit_Local_Share + Docking_Mooring_Fee
      + Sultadas + Miscellaneous_Fee + Reg_of_Birth
      + Marriage_Fees + Burial_Fees + Correction_of_Entry
      + Fishing_Permit_Fee + Sale_of_Agri_Prod + Sale_of_Acct_Form) AS Regulatory_Fees
    FROM general_fund_data
    WHERE 1=1`;

  sql = addDateFilters(sql, month, day, year);

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching data:", err);
      res.status(500).send("Error fetching data");
      return;
    }
    res.json({ regulatory_fees: results[0].Regulatory_Fees || 0 });
  });
});

// Define an endpoint to get Service/User Charges totals
app.get("/api/ServiceUserChargesTotal", (req, res) => {
  const { month, day, year } = req.query;

  let sql = `
    SELECT
      SUM(Police_Report_Clearance+Secretaries_Fee+Med_Dent_Lab_Fees+Garbage_Fees+Cutting_Tree+Doc_Stamp) AS Service_User_Charges
    FROM general_fund_data
    WHERE 1=1`;

  sql = addDateFilters(sql, month, day, year);

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching data:", err);
      res.status(500).send("Error fetching data");
      return;
    }
    res.json({ service_user_charges: results[0].Service_User_Charges || 0 });
  });
});

// Define an endpoint to get Receipts from Economic Enterprises totals
app.get("/api/ReceiptsFromEconomicEnterprisesTotal", (req, res) => {
  const { month, day, year } = req.query;

  let sql = `
    SELECT
      SUM(Slaughter_House_Fee + Stall_Fees + Water_Fees + Rental_of_Equipment) AS Receipts_From_Economic_Enterprises
    FROM general_fund_data
    WHERE 1=1`;

  sql = addDateFilters(sql, month, day, year);

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching data:", err);
      res.status(500).send("Error fetching data");
      return;
    }
    res.json({
      receipts_from_economic_enterprises:
        results[0].Receipts_From_Economic_Enterprises || 0,
    });
  });
});

app.post("/api/save-trust-fund", (req, res) => {
  const data = req.body;

  // 1. Check if RECEIPT_NO already exists
  const checkSql =
    "SELECT COUNT(*) AS count FROM trust_fund_data WHERE RECEIPT_NO = ?";
  db.query(checkSql, [data.RECEIPT_NO], (err, results) => {
    if (err) {
      console.error("Error checking receipt number:", err);
      return res.status(500).send("Error checking receipt number");
    }

    const { count } = results[0];
    if (count > 0) {
      // 2. If there is a record already, return an error response
      return res.status(400).send("Receipt number already exists");
    }

    // 3. Otherwise, proceed to insert the record
    const sql = "INSERT INTO trust_fund_data SET ?";
    db.query(sql, data, (err, result) => {
      if (err) {
        console.error("Error saving data:", err);
        return res.status(500).send("Error saving data");
      }
      res.send("Data saved successfully");
    });
  });
});

app.put("/api/update-trust-fund/:id", (req, res) => {
  const { id } = req.params;

  // Only allow updates to these specific fields
  const allowedFields = [
    "DATE",
    "NAME",
    "RECEIPT_NO",
    "CASHIER",
    "TYPE_OF_RECEIPT",
    "TOTAL",
    "BUILDING_PERMIT_FEE",
    "LOCAL_80_PERCENT",
    "TRUST_FUND_15_PERCENT",
    "NATIONAL_5_PERCENT",
    "LIVESTOCK_DEV_FUND",
    "LOCAL_80_PERCENT_LIVESTOCK",
    "NATIONAL_20_PERCENT",
    "DIVING_FEE",
    "LOCAL_40_PERCENT_DIVE_FEE",
    "FISHERS_30_PERCENT",
    "BRGY_30_PERCENT",
    "ELECTRICAL_FEE",
    "ZONING_FEE",
  ];

  let setClauses = [];
  let values = [];

  for (const key of allowedFields) {
    if (req.body[key] !== undefined) {
      setClauses.push(`${key} = ?`);
      values.push(req.body[key]);
    }
  }

  // If no fields provided, return error
  if (setClauses.length === 0) {
    return res
      .status(400)
      .json({ message: "No valid fields provided for update." });
  }

  const query = `
    UPDATE trust_fund_data
    SET ${setClauses.join(", ")}
    WHERE ID = ?
  `;

  values.push(id); // Add the ID as the final param

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error updating trust fund:", err);
      return res
        .status(500)
        .json({ message: "Failed to update trust fund.", error: err });
    }
    res.status(200).json({ message: "Trust fund updated successfully." });
  });
});

app.put("/api/updateTrustFund/:id", async (req, res) => {
  const { id } = req.params;
  const {
    DATE,
    NAME,
    RECEIPT_NO,
    CASHIER,
    TYPE_OF_RECEIPT,
    TOTAL,
    BUILDING_PERMIT_FEE,
    LOCAL_80_PERCENT,
    TRUST_FUND_15_PERCENT,
    NATIONAL_5_PERCENT,
    ELECTRICAL_FEE,
    ZONING_FEE,
    LIVESTOCK_DEV_FUND,
    LOCAL_80_PERCENT_LIVESTOCK,
    NATIONAL_20_PERCENT,
    DIVING_FEE,
    LOCAL_40_PERCENT_DIVE_FEE,
    FISHERS_30_PERCENT,
    BRGY_30_PERCENT,
  } = req.body;

  try {
    const query = `
      UPDATE trust_fund_table
      SET
        DATE = ?,
        NAME = ?,
        RECEIPT_NO = ?,
        CASHIER = ?,
        TYPE_OF_RECEIPT = ?,
        TOTAL = ?,
        BUILDING_PERMIT_FEE = ?,
        LOCAL_80_PERCENT = ?,
        TRUST_FUND_15_PERCENT = ?,
        NATIONAL_5_PERCENT = ?,
        ELECTRICAL_FEE = ?,
        ZONING_FEE = ?,
        LIVESTOCK_DEV_FUND = ?,
        LOCAL_80_PERCENT_LIVESTOCK = ?,
        NATIONAL_20_PERCENT = ?,
        DIVING_FEE = ?,
        LOCAL_40_PERCENT_DIVE_FEE = ?,
        FISHERS_30_PERCENT = ?,
        BRGY_30_PERCENT = ?
      WHERE ID = ?;
    `;

    const values = [
      DATE,
      NAME,
      RECEIPT_NO,
      CASHIER,
      TYPE_OF_RECEIPT,
      TOTAL,
      BUILDING_PERMIT_FEE,
      LOCAL_80_PERCENT,
      TRUST_FUND_15_PERCENT,
      NATIONAL_5_PERCENT,
      ELECTRICAL_FEE,
      ZONING_FEE,
      LIVESTOCK_DEV_FUND,
      LOCAL_80_PERCENT_LIVESTOCK,
      NATIONAL_20_PERCENT,
      DIVING_FEE,
      LOCAL_40_PERCENT_DIVE_FEE,
      FISHERS_30_PERCENT,
      BRGY_30_PERCENT,
      id,
    ];

    await db.query(query, values);

    res.status(200).send({ message: "Record updated successfully!" });
  } catch (error) {
    console.error("Error updating record:", error);
    res.status(500).send("Error updating record");
  }
});

app.get("/api/table-trust-fund-all", (req, res) => {
  const sql = "SELECT * FROM `trust_fund_data`";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching data:", err);
      res.status(500).send("Error fetching data");
    } else {
      res.json(result); // Send the fetched data as JSON
    }
  });
});

app.get("/api/trust-fund-total", (req, res) => {
  const sql = "SELECT SUM(`TOTAL`) AS overall_total FROM `trust_fund_data`;";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching data:", err);
      res.status(500).send("Error fetching data");
    } else {
      res.json(result);
    }
  });
});

app.get("/api/general-fund-tax-on-business-report", (req, res) => {
  const { month, day, year } = req.query;

  let sql = `
        SELECT 'Manufacturing' AS Taxes, SUM(Manufacturing) AS Total FROM general_fund_data
        UNION ALL
        SELECT 'Distributor', SUM(Distributor) FROM general_fund_data
        UNION ALL
        SELECT 'Retailing', SUM(Retailing) FROM general_fund_data
        UNION ALL
        SELECT 'Financial', SUM(Financial) FROM general_fund_data
        UNION ALL
        SELECT 'Other Business Tax', SUM(Other_Business_Tax) FROM general_fund_data
        UNION ALL
        SELECT 'Fines Penalties', SUM(Fines_Penalties) FROM general_fund_data
        UNION ALL
        SELECT 'Sand Gravel', SUM(Sand_Gravel) FROM general_fund_data
        UNION ALL
        SELECT 'Overall Total', SUM(Manufacturing+Distributor+Retailing+Financial+Other_Business_Tax+Fines_Penalties+Sand_Gravel) FROM general_fund_data
    `;

  // Construct WHERE clause based on provided parameters
  let filters = [];
  if (year) filters.push(`YEAR(date) = ${db.escape(year)}`);
  if (month) filters.push(`MONTH(date) = ${db.escape(month)}`);
  if (day) filters.push(`DAY(date) = ${db.escape(day)}`);

  if (filters.length > 0) {
    sql = `
            SELECT 'Manufacturing' AS Taxes, SUM(Manufacturing) AS Total FROM general_fund_data WHERE ${filters.join(" AND ")}
            UNION ALL
            SELECT 'Distributor', SUM(Distributor) FROM general_fund_data WHERE ${filters.join(" AND ")}
            UNION ALL
            SELECT 'Retailing', SUM(Retailing) FROM general_fund_data WHERE ${filters.join(" AND ")}
            UNION ALL
            SELECT 'Financial', SUM(Financial) FROM general_fund_data WHERE ${filters.join(" AND ")}
            UNION ALL
            SELECT 'Other Business Tax', SUM(Other_Business_Tax) FROM general_fund_data WHERE ${filters.join(" AND ")}
            UNION ALL
            SELECT 'Fines Penalties', SUM(Fines_Penalties) FROM general_fund_data WHERE ${filters.join(" AND ")}
            UNION ALL
            SELECT 'Sand Gravel', SUM(Sand_Gravel) FROM general_fund_data WHERE ${filters.join(" AND ")}
            UNION ALL
            SELECT 'Overall Total', SUM(Manufacturing+Distributor+Retailing+Financial+Other_Business_Tax+Fines_Penalties+Sand_Gravel) FROM general_fund_data WHERE ${filters.join(" AND ")}
        `;
  }

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching data:", err);
      res.status(500).send("Error fetching data");
    } else {
      res.json(result);
    }
  });
});

app.get("/api/general-fund-regulatory-fees-report", (req, res) => {
  const { month, day, year } = req.query;

  let sql = `
        SELECT 'Mayors Permit' AS Taxes, SUM(Mayors_Permit) AS Total FROM general_fund_data
        UNION ALL
        SELECT 'Weighs and Measure', SUM(Weighs_Measure) FROM general_fund_data
        UNION ALL
        SELECT 'Tricycle Operators', SUM(Tricycle_Operators) FROM general_fund_data
        UNION ALL
        SELECT 'Occupation Tax', SUM(Occupation_Tax) FROM general_fund_data
        UNION ALL
        SELECT 'Certificate of Ownership', SUM(Cert_of_Ownership) FROM general_fund_data
        UNION ALL
        SELECT 'Certificate of Transfer', SUM(Cert_of_Transfer) FROM general_fund_data
        UNION ALL
        SELECT 'Cockpit Prov Share', SUM(Cockpit_Prov_Share) FROM general_fund_data
        UNION ALL
        SELECT 'Cockpit Local Share', SUM(Cockpit_Local_Share) FROM general_fund_data
        UNION ALL
        SELECT 'Docking and Mooring Fee', SUM(Docking_Mooring_Fee) FROM general_fund_data
        UNION ALL
        SELECT 'Sultadas', SUM(Sultadas) FROM general_fund_data
        UNION ALL
        SELECT 'Miscellaneous Fees', SUM(Miscellaneous_Fee) FROM general_fund_data
        UNION ALL
        SELECT 'Registration of Birth', SUM(Reg_of_Birth) FROM general_fund_data
        UNION ALL
        SELECT 'Marriage Fees', SUM(Marriage_Fees) FROM general_fund_data
        UNION ALL
        SELECT 'Burial Fee', SUM(Burial_Fees) FROM general_fund_data
        UNION ALL
        SELECT 'Correction of Entry', SUM(Correction_of_Entry) FROM general_fund_data
        UNION ALL
        SELECT 'Fishing Permit Fee', SUM(Fishing_Permit_Fee) FROM general_fund_data
        UNION ALL
        SELECT 'Sale of Agri. Prod', SUM(Sale_of_Agri_Prod) FROM general_fund_data
        UNION ALL
        SELECT 'Sale of Acct Form', SUM(Sale_of_Acct_Form) FROM general_fund_data
        UNION ALL
        SELECT 'Overall Total', SUM(Mayors_Permit +
            Weighs_Measure +
            Tricycle_Operators +
            Occupation_Tax +
            Cert_of_Ownership +
            Cert_of_Transfer +
            Cockpit_Prov_Share +
            Cockpit_Local_Share +
            Docking_Mooring_Fee +
            Sultadas +
            Miscellaneous_Fee +
            Reg_of_Birth +
            Marriage_Fees +
            Burial_Fees +
            Correction_of_Entry +
            Fishing_Permit_Fee +
            Sale_of_Agri_Prod +
            Sale_of_Acct_Form) FROM general_fund_data;
    `;

  // Construct WHERE clause based on provided parameters
  let filters = [];
  if (year) filters.push(`YEAR(date) = ${db.escape(year)}`);
  if (month) filters.push(`MONTH(date) = ${db.escape(month)}`);
  if (day) filters.push(`DAY(date) = ${db.escape(day)}`);

  if (filters.length > 0) {
    sql = `
            SELECT 'Mayors Permit' AS Taxes, SUM(Mayors_Permit) AS Total FROM general_fund_data WHERE ${filters.join(" AND ")}
        UNION ALL
        SELECT 'Weighs and Measure', SUM(Weighs_Measure) FROM general_fund_data WHERE ${filters.join(" AND ")}
        UNION ALL
        SELECT 'Tricycle Operators', SUM(Tricycle_Operators) FROM general_fund_data WHERE ${filters.join(" AND ")}
        UNION ALL
        SELECT 'Occupation Tax', SUM(Occupation_Tax) FROM general_fund_data WHERE ${filters.join(" AND ")}
        UNION ALL
        SELECT 'Certificate of Ownership', SUM(Cert_of_Ownership) FROM general_fund_data WHERE ${filters.join(" AND ")}
        UNION ALL
        SELECT 'Certificate of Transfer', SUM(Cert_of_Transfer) FROM general_fund_data WHERE ${filters.join(" AND ")}
        UNION ALL
        SELECT 'Cockpit Prov Share', SUM(Cockpit_Prov_Share) FROM general_fund_data WHERE ${filters.join(" AND ")}
        UNION ALL
        SELECT 'Cockpit Local Share', SUM(Cockpit_Local_Share) FROM general_fund_data WHERE ${filters.join(" AND ")}
        UNION ALL
        SELECT 'Docking and Mooring Fee', SUM(Docking_Mooring_Fee) FROM general_fund_data WHERE ${filters.join(" AND ")}
        UNION ALL
        SELECT 'Sultadas', SUM(Sultadas) FROM general_fund_data WHERE ${filters.join(" AND ")}
        UNION ALL
        SELECT 'Miscellaneous Fees', SUM(Miscellaneous_Fee) FROM general_fund_data WHERE ${filters.join(" AND ")}
        UNION ALL
        SELECT 'Registration of Birth', SUM(Reg_of_Birth) FROM general_fund_data WHERE ${filters.join(" AND ")}
        UNION ALL
        SELECT 'Marriage Fees', SUM(Marriage_Fees) FROM general_fund_data WHERE ${filters.join(" AND ")}
        UNION ALL
        SELECT 'Burial Fee', SUM(Burial_Fees) FROM general_fund_data WHERE ${filters.join(" AND ")}
        UNION ALL
        SELECT 'Correction of Entry', SUM(Correction_of_Entry) FROM general_fund_data WHERE ${filters.join(" AND ")}
        UNION ALL
        SELECT 'Fishing Permit Fee', SUM(Fishing_Permit_Fee) FROM general_fund_data WHERE ${filters.join(" AND ")}
        UNION ALL
        SELECT 'Sale of Agri. Prod', SUM(Sale_of_Agri_Prod) FROM general_fund_data WHERE ${filters.join(" AND ")}
        UNION ALL
        SELECT 'Sale of Acct Form', SUM(Sale_of_Acct_Form) FROM general_fund_data WHERE ${filters.join(" AND ")}
        UNION ALL
        SELECT 'Overall Total', SUM(Mayors_Permit +
            Weighs_Measure +
            Tricycle_Operators +
            Occupation_Tax +
            Cert_of_Ownership +
            Cert_of_Transfer +
            Cockpit_Prov_Share +
            Cockpit_Local_Share +
            Docking_Mooring_Fee +
            Sultadas +
            Miscellaneous_Fee +
            Reg_of_Birth +
            Marriage_Fees +
            Burial_Fees +
            Correction_of_Entry +
            Fishing_Permit_Fee +
            Sale_of_Agri_Prod +
            Sale_of_Acct_Form) FROM general_fund_data WHERE ${filters.join(" AND ")};
        `;
  }

  // Execute the SQL query
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).send("Internal Server Error");
      return;
    }
    res.json(results);
  });
});

app.get(
  "/api/general-fund-receipts-from-economic-enterprise-report",
  (req, res) => {
    const { month, day, year } = req.query;

    let sql = `
        SELECT 'Water Fees' AS Taxes, SUM(Water_Fees) AS Total FROM general_fund_data
        UNION ALL
        SELECT 'Stall Fees', SUM(Stall_Fees) FROM general_fund_data
        UNION ALL
        SELECT 'Cash Tickets', SUM(Cash_Tickets) FROM general_fund_data
        UNION ALL
        SELECT 'Slaughter House Fee', SUM(Slaughter_House_Fee) FROM general_fund_data
        UNION ALL
        SELECT 'Rental of Equipment', SUM(Rental_of_Equipment) FROM general_fund_data
        UNION ALL
        SELECT 'Overall Total', SUM(Water_Fees+Stall_Fees+Cash_Tickets+Slaughter_House_Fee+Rental_of_Equipment) FROM general_fund_data
    `;

    // Construct WHERE clause based on provided parameters
    let filters = [];
    if (year) filters.push(`YEAR(date) = ${db.escape(year)}`);
    if (month) filters.push(`MONTH(date) = ${db.escape(month)}`);
    if (day) filters.push(`DAY(date) = ${db.escape(day)}`);

    if (filters.length > 0) {
      sql = `
        SELECT 'Water Fees' AS Taxes, SUM(Water_Fees) AS Total FROM general_fund_data WHERE ${filters.join(" AND ")}
        UNION ALL
        SELECT 'Stall Fees', SUM(Stall_Fees) FROM general_fund_data WHERE ${filters.join(" AND ")}
        UNION ALL
        SELECT 'Cash Tickets', SUM(Cash_Tickets) FROM general_fund_data WHERE ${filters.join(" AND ")}
        UNION ALL
        SELECT 'Slaughter House Fee', SUM(Slaughter_House_Fee) FROM general_fund_data WHERE ${filters.join(" AND ")}
        UNION ALL
        SELECT 'Rental of Equipment', SUM(Rental_of_Equipment) FROM general_fund_data WHERE ${filters.join(" AND ")}
        UNION ALL
        SELECT 'Overall Total', SUM(Water_Fees+Stall_Fees+Cash_Tickets+Slaughter_House_Fee+Rental_of_Equipment) FROM general_fund_data WHERE ${filters.join(" AND ")}
        `;
    }
    // Execute the SQL query
    db.query(sql, (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        res.status(500).send("Internal Server Error");
        return;
      }
      res.json(results);
    });
  }
);

app.get("/api/general-fund-service-user-charges", (req, res) => {
  const { month, day, year } = req.query;

  let sql = `
        SELECT 'Police Report/Clearance' AS Taxes, SUM(0) AS Total FROM general_fund_data
        UNION ALL
        SELECT 'Secretary Fee', SUM(Secretaries_Fee + Police_Report_Clearance) AS Total FROM general_fund_data
        UNION ALL
        SELECT 'Med./Dent. & Lab. Fees', SUM(Med_Dent_Lab_Fees) AS Total FROM general_fund_data
        UNION ALL
        SELECT 'Garbage Fees', SUM(Garbage_Fees) AS Total FROM general_fund_data
        UNION ALL
        SELECT 'Cutting Tree', SUM(Cutting_Tree) AS Total FROM general_fund_data
        UNION ALL
        SELECT 'Documentary Stamp', SUM(Doc_Stamp) AS Total FROM general_fund_data
        UNION ALL
        SELECT 'Overall Total', SUM(Secretaries_Fee + Police_Report_Clearance + Med_Dent_Lab_Fees + Garbage_Fees + Cutting_Tree + Doc_Stamp) AS Total FROM general_fund_data
    `;

  // Construct WHERE clause based on provided parameters
  let filters = [];
  if (year) filters.push(`YEAR(date) = ${db.escape(year)}`);
  if (month) filters.push(`MONTH(date) = ${db.escape(month)}`);
  if (day) filters.push(`DAY(date) = ${db.escape(day)}`);

  if (filters.length > 0) {
    sql = `
        SELECT 'Police Report/Clearance' AS Taxes, SUM(0) AS Total FROM general_fund_data WHERE ${filters.join(" AND ")}
        UNION ALL
        SELECT 'Secretary Fee', SUM(Secretaries_Fee + Police_Report_Clearance) AS Total FROM general_fund_data WHERE ${filters.join(" AND ")}
        UNION ALL
        SELECT 'Med./Dent. & Lab. Fees', SUM(Med_Dent_Lab_Fees) AS Total FROM general_fund_data WHERE ${filters.join(" AND ")}
        UNION ALL
        SELECT 'Garbage Fees', SUM(Garbage_Fees) AS Total FROM general_fund_data WHERE ${filters.join(" AND ")}
        UNION ALL
        SELECT 'Cutting Tree', SUM(Cutting_Tree) AS Total FROM general_fund_data WHERE ${filters.join(" AND ")}
        UNION ALL
        SELECT 'Documentary Stamp', SUM(Doc_Stamp) AS Total FROM general_fund_data WHERE ${filters.join(" AND ")}
        UNION ALL
        SELECT 'Overall Total', SUM(Secretaries_Fee + Police_Report_Clearance + Med_Dent_Lab_Fees + Garbage_Fees + Cutting_Tree + Doc_Stamp) AS Total FROM general_fund_data WHERE ${filters.join(" AND ")}
        `;
  }

  // Execute the SQL query
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).send("Internal Server Error");
      return;
    }
    res.json(results);
  });
});

app.get("/api/general-fund-total-tax-report", (req, res) => {
  const { month, day, year } = req.query;

  let sql = `
        SELECT 'Tax on Business' AS Taxes, SUM(Manufacturing+Distributor+Retailing+Financial+Other_Business_Tax+Fines_Penalties+Sand_Gravel) AS Total FROM general_fund_data
        UNION ALL
        SELECT 'Regulatory Fees', SUM(Weighs_Measure +
            Tricycle_Operators +
            Occupation_Tax +
            Cert_of_Ownership +
            Cert_of_Transfer +
            Cockpit_Prov_Share +
            Cockpit_Local_Share +
            Docking_Mooring_Fee +
            Sultadas +
            Miscellaneous_Fee +
            Reg_of_Birth +
            Marriage_Fees +
            Burial_Fees +
            Correction_of_Entry +
            Fishing_Permit_Fee +
            Sale_of_Agri_Prod +
            Sale_of_Acct_Form) FROM general_fund_data
        UNION ALL
        SELECT 'Receipts From Economic Enterprise', SUM(Water_Fees+Stall_Fees+Cash_Tickets+Slaughter_House_Fee+Rental_of_Equipment) FROM general_fund_data
        UNION ALL
        SELECT 'Service/User Charges', SUM(Police_Report_Clearance+Secretaries_Fee+Med_Dent_Lab_Fees+Garbage_Fees+Cutting_Tree+Doc_Stamp) FROM general_fund_data
        UNION ALL
        SELECT 'Overall Total', SUM(Manufacturing+Distributor+Retailing+Financial+Other_Business_Tax+Fines_Penalties+Sand_Gravel+Weighs_Measure +
            Tricycle_Operators +
            Occupation_Tax +
            Cert_of_Ownership +
            Cert_of_Transfer +
            Cockpit_Prov_Share +
            Cockpit_Local_Share +
            Docking_Mooring_Fee +
            Sultadas +
            Miscellaneous_Fee +
            Reg_of_Birth +
            Marriage_Fees +
            Burial_Fees +
            Correction_of_Entry +
            Fishing_Permit_Fee +
            Sale_of_Agri_Prod +
            Sale_of_Acct_Form+Water_Fees+Stall_Fees+Cash_Tickets+Slaughter_House_Fee+Rental_of_Equipment+Police_Report_Clearance+Secretaries_Fee+Med_Dent_Lab_Fees+Garbage_Fees+Cutting_Tree+Doc_Stamp) FROM general_fund_data
    `;

  // Construct WHERE clause based on provided parameters
  let filters = [];
  if (year) filters.push(`YEAR(date) = ${db.escape(year)}`);
  if (month) filters.push(`MONTH(date) = ${db.escape(month)}`);
  if (day) filters.push(`DAY(date) = ${db.escape(day)}`);

  if (filters.length > 0) {
    sql = `
        SELECT 'Tax on Business' AS Taxes, SUM(Manufacturing+Distributor+Retailing+Financial+Other_Business_Tax+Fines_Penalties+Sand_Gravel) AS Total FROM general_fund_data WHERE ${filters.join(" AND ")}
        UNION ALL
        SELECT 'Regulatory Fees', SUM(Weighs_Measure +
            Tricycle_Operators +
            Occupation_Tax +
            Cert_of_Ownership +
            Cert_of_Transfer +
            Cockpit_Prov_Share +
            Cockpit_Local_Share +
            Docking_Mooring_Fee +
            Sultadas +
            Miscellaneous_Fee +
            Reg_of_Birth +
            Marriage_Fees +
            Burial_Fees +
            Correction_of_Entry +
            Fishing_Permit_Fee +
            Sale_of_Agri_Prod +
            Sale_of_Acct_Form) FROM general_fund_data WHERE ${filters.join(" AND ")}
        UNION ALL
        SELECT 'Receipts From Economic Enterprise', SUM(Water_Fees+Stall_Fees+Cash_Tickets+Slaughter_House_Fee+Rental_of_Equipment) FROM general_fund_data WHERE ${filters.join(" AND ")}
        UNION ALL
        SELECT 'Service/User Charges', SUM(Police_Report_Clearance+Secretaries_Fee+Med_Dent_Lab_Fees+Garbage_Fees+Cutting_Tree+Doc_Stamp) FROM general_fund_data WHERE ${filters.join(" AND ")}
        UNION ALL
        SELECT 'Overall Total', SUM(Manufacturing+Distributor+Retailing+Financial+Other_Business_Tax+Fines_Penalties+Sand_Gravel+Weighs_Measure +
            Tricycle_Operators +
            Occupation_Tax +
            Cert_of_Ownership +
            Cert_of_Transfer +
            Cockpit_Prov_Share +
            Cockpit_Local_Share +
            Docking_Mooring_Fee +
            Sultadas +
            Miscellaneous_Fee +
            Reg_of_Birth +
            Marriage_Fees +
            Burial_Fees +
            Correction_of_Entry +
            Fishing_Permit_Fee +
            Sale_of_Agri_Prod +
            Sale_of_Acct_Form+Water_Fees+Stall_Fees+Cash_Tickets+Slaughter_House_Fee+Rental_of_Equipment+Police_Report_Clearance+Secretaries_Fee+Med_Dent_Lab_Fees+Garbage_Fees+Cutting_Tree+Doc_Stamp) FROM general_fund_data WHERE ${filters.join(" AND ")}
        `;
  }
  // Execute the SQL query
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).send("Internal Server Error");
      return;
    }
    res.json(results);
  });
});

app.get("/api/trust-fund-building-permit-fees", (req, res) => {
  const { month, day, year } = req.query;

  let sql = `
        SELECT 'Building Local Fund 80%' AS Taxes, SUM(LOCAL_80_PERCENT) AS Total FROM trust_fund_data
        UNION ALL
        SELECT 'Building Trust Fund 15%', SUM(TRUST_FUND_15_PERCENT) FROM trust_fund_data
        UNION ALL
        SELECT 'Building National Fund 5% ', SUM(NATIONAL_5_PERCENT) FROM trust_fund_data
        UNION ALL
        SELECT 'Overall Total', SUM(LOCAL_80_PERCENT+TRUST_FUND_15_PERCENT+NATIONAL_5_PERCENT) FROM trust_fund_data
    `;

  // Construct WHERE clause based on provided parameters
  let filters = [];
  if (year) filters.push(`YEAR(date) = ${db.escape(year)}`);
  if (month) filters.push(`MONTH(date) = ${db.escape(month)}`);
  if (day) filters.push(`DAY(date) = ${db.escape(day)}`);

  if (filters.length > 0) {
    sql = `
        SELECT 'Building Local Fund 80%' AS Taxes, SUM(LOCAL_80_PERCENT) AS Total FROM trust_fund_data WHERE ${filters.join(" AND ")}
        UNION ALL
        SELECT 'Building Trust Fund 15%', SUM(TRUST_FUND_15_PERCENT) FROM trust_fund_data WHERE ${filters.join(" AND ")}
        UNION ALL
        SELECT 'Building National Fund 5% ', SUM(NATIONAL_5_PERCENT) FROM trust_fund_data WHERE ${filters.join(" AND ")}
        UNION ALL
        SELECT 'Overall Total', SUM(LOCAL_80_PERCENT+TRUST_FUND_15_PERCENT+NATIONAL_5_PERCENT) FROM trust_fund_data WHERE ${filters.join(" AND ")}
        `;
  }
  // Execute the SQL query
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).send("Internal Server Error");
      return;
    }
    res.json(results);
  });
});

app.get("/api/trust-fund-electrical-permit-fees", (req, res) => {
  const { month, day, year } = req.query;

  let sql = `
        SELECT 'Electrical Fee' AS Taxes, SUM(ELECTRICAL_FEE) AS Total FROM trust_fund_data
        UNION ALL
        SELECT 'Overall Total', SUM(ELECTRICAL_FEE) FROM trust_fund_data
    `;

  // Construct WHERE clause based on provided parameters
  let filters = [];
  if (year) filters.push(`YEAR(date) = ${db.escape(year)}`);
  if (month) filters.push(`MONTH(date) = ${db.escape(month)}`);
  if (day) filters.push(`DAY(date) = ${db.escape(day)}`);

  if (filters.length > 0) {
    sql = `
        SELECT 'Electrical Fee' AS Taxes, SUM(ELECTRICAL_FEE) AS Total FROM trust_fund_data WHERE ${filters.join(" AND ")}
        UNION ALL
        SELECT 'Overall Total', SUM(ELECTRICAL_FEE) FROM trust_fund_data WHERE ${filters.join(" AND ")}
        `;
  }
  // Execute the SQL query
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).send("Internal Server Error");
      return;
    }
    res.json(results);
  });
});

app.get("/api/trust-fund-zoning-permit-fees", (req, res) => {
  const { month, day, year } = req.query;

  let sql = `
        SELECT 'Zoning Fee' AS Taxes, SUM(ZONING_FEE) AS Total FROM trust_fund_data
        UNION ALL
       
        SELECT 'Overall Total', SUM(ZONING_FEE) FROM trust_fund_data
    `;

  // Construct WHERE clause based on provided parameters
  let filters = [];
  if (year) filters.push(`YEAR(date) = ${db.escape(year)}`);
  if (month) filters.push(`MONTH(date) = ${db.escape(month)}`);
  if (day) filters.push(`DAY(date) = ${db.escape(day)}`);

  if (filters.length > 0) {
    sql = `
        SELECT 'Zoning Fee' AS Taxes, SUM(ZONING_FEE) AS Total FROM trust_fund_data WHERE ${filters.join(" AND ")}
		UNION ALL
        SELECT 'Overall Total', SUM(ZONING_FEE) FROM trust_fund_data WHERE ${filters.join(" AND ")}
        `;
  }
  // Execute the SQL query
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).send("Internal Server Error");
      return;
    }
    res.json(results);
  });
});

app.get("/api/trust-fund-livestock-dev-fund-fees", (req, res) => {
  const { month, day, year } = req.query;

  let sql = `
        SELECT 'Livestock Dev Fund Local 80%' AS Taxes, SUM(LOCAL_80_PERCENT_LIVESTOCK) AS Total FROM trust_fund_data
        UNION ALL
        SELECT 'Livestock Dev Fund National 20%', SUM(NATIONAL_20_PERCENT) FROM trust_fund_data
        UNION ALL
        SELECT 'Overall Total', SUM(LOCAL_80_PERCENT_LIVESTOCK+NATIONAL_20_PERCENT) FROM trust_fund_data
    `;

  // Construct WHERE clause based on provided parameters
  let filters = [];
  if (year) filters.push(`YEAR(date) = ${db.escape(year)}`);
  if (month) filters.push(`MONTH(date) = ${db.escape(month)}`);
  if (day) filters.push(`DAY(date) = ${db.escape(day)}`);

  if (filters.length > 0) {
    sql = `
        SELECT 'Livestock Dev Fund Local 80%' AS Taxes, SUM(LOCAL_80_PERCENT_LIVESTOCK) AS Total FROM trust_fund_data WHERE ${filters.join(" AND ")}
        UNION ALL
        SELECT 'Livestock Dev Fund National 20%', SUM(NATIONAL_20_PERCENT) FROM trust_fund_data WHERE ${filters.join(" AND ")}
        UNION ALL
        SELECT 'Overall Total', SUM(LOCAL_80_PERCENT_LIVESTOCK+NATIONAL_20_PERCENT) FROM trust_fund_data WHERE ${filters.join(" AND ")}
        `;
  }
  // Execute the SQL query
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).send("Internal Server Error");
      return;
    }
    res.json(results);
  });
});

app.get("/api/trust-fund-diving-fees", (req, res) => {
  const { month, day, year } = req.query;

  let sql = `
        SELECT 'Diving Fee Local 40%' AS Taxes, SUM(LOCAL_40_PERCENT_DIVE_FEE) AS Total FROM trust_fund_data
        UNION ALL
        SELECT 'Diving Fee Fishers 30%', SUM(FISHERS_30_PERCENT) FROM trust_fund_data
        UNION ALL
		SELECT 'Diving Fee Brgy 30%', SUM(BRGY_30_PERCENT) FROM trust_fund_data
        UNION ALL
        SELECT 'Overall Total', SUM(LOCAL_40_PERCENT_DIVE_FEE+FISHERS_30_PERCENT+BRGY_30_PERCENT) FROM trust_fund_data
    `;

  // Construct WHERE clause based on provided parameters
  let filters = [];
  if (year) filters.push(`YEAR(date) = ${db.escape(year)}`);
  if (month) filters.push(`MONTH(date) = ${db.escape(month)}`);
  if (day) filters.push(`DAY(date) = ${db.escape(day)}`);

  if (filters.length > 0) {
    sql = `
        SELECT 'Diving Fee Local 40%' AS Taxes, SUM(LOCAL_40_PERCENT_DIVE_FEE) AS Total FROM trust_fund_data WHERE ${filters.join(" AND ")}
        UNION ALL
        SELECT 'Diving Fee Fishers 30%', SUM(FISHERS_30_PERCENT) FROM trust_fund_data WHERE ${filters.join(" AND ")}
        UNION ALL
		SELECT 'Diving Fee Brgy 30%', SUM(BRGY_30_PERCENT) FROM trust_fund_data WHERE ${filters.join(" AND ")}
        UNION ALL
        SELECT 'Overall Total', SUM(LOCAL_40_PERCENT_DIVE_FEE+FISHERS_30_PERCENT+BRGY_30_PERCENT) FROM trust_fund_data WHERE ${filters.join(" AND ")}
        `;
  }
  // Execute the SQL query
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).send("Internal Server Error");
      return;
    }
    res.json(results);
  });
});

app.get("/api/trust-fund-total-fees-reports", (req, res) => {
  const { month, day, year } = req.query;

  let sql = `
        SELECT 'Building Permit Fee' AS Taxes, SUM(BUILDING_PERMIT_FEE) AS Total FROM trust_fund_data
        UNION ALL
        SELECT 'Electrical Permit Fee', SUM(ELECTRICAL_FEE) FROM trust_fund_data
        UNION ALL
		SELECT 'Zoning Fee', SUM(ZONING_FEE) FROM trust_fund_data
        UNION ALL
		SELECT 'Livestock Dev. Fund', SUM(LIVESTOCK_DEV_FUND) FROM trust_fund_data
        UNION ALL
		SELECT 'Diving Fee', SUM(DIVING_FEE) FROM trust_fund_data
        UNION ALL
        SELECT 'Overall Total', SUM(BUILDING_PERMIT_FEE+ELECTRICAL_FEE+ZONING_FEE+LIVESTOCK_DEV_FUND+DIVING_FEE) FROM trust_fund_data
    `;

  // Construct WHERE clause based on provided parameters
  let filters = [];
  if (year) filters.push(`YEAR(date) = ${db.escape(year)}`);
  if (month) filters.push(`MONTH(date) = ${db.escape(month)}`);
  if (day) filters.push(`DAY(date) = ${db.escape(day)}`);

  if (filters.length > 0) {
    sql = `
        SELECT 'Building Permit Fee' AS Taxes, SUM(BUILDING_PERMIT_FEE) AS Total FROM trust_fund_data WHERE ${filters.join(" AND ")}
        UNION ALL
        SELECT 'Electrical Permit Fee', SUM(ELECTRICAL_FEE) FROM trust_fund_data WHERE ${filters.join(" AND ")}
        UNION ALL
		SELECT 'Zoning Fee', SUM(ZONING_FEE) FROM trust_fund_data WHERE ${filters.join(" AND ")}
        UNION ALL
		SELECT 'Livestock Dev. Fund', SUM(LIVESTOCK_DEV_FUND) FROM trust_fund_data WHERE ${filters.join(" AND ")}
        UNION ALL
		SELECT 'Diving Fee', SUM(DIVING_FEE) FROM trust_fund_data WHERE ${filters.join(" AND ")}
        UNION ALL
        SELECT 'Overall Total', SUM(BUILDING_PERMIT_FEE+ELECTRICAL_FEE+ZONING_FEE+LIVESTOCK_DEV_FUND+DIVING_FEE) FROM trust_fund_data WHERE ${filters.join(" AND ")}
        `;
  }
  // Execute the SQL query
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).send("Internal Server Error");
      return;
    }
    res.json(results);
  });
});

// Define an endpoint to get Building Permit Fee totals
app.get("/api/BuildingPermitFeeTotal", (req, res) => {
  const { month, day, year } = req.query;

  let sql = `
    SELECT
      SUM(LOCAL_80_PERCENT + TRUST_FUND_15_PERCENT + NATIONAL_5_PERCENT) AS Building_Permit_Fee_Total
    FROM trust_fund_data
    WHERE 1=1`;

  sql = addDateFilters(sql, month, day, year);

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching data:", err);
      res.status(500).send("Error fetching data");
      return;
    }
    res.json({
      building_permit_fee_total: results[0].Building_Permit_Fee_Total || 0,
    });
  });
});

// Define an endpoint to get Electrical Fee totals
app.get("/api/ElectricalFeeTotal", (req, res) => {
  const { month, day, year } = req.query;

  let sql = `
    SELECT
      SUM(ELECTRICAL_FEE) AS Electrical_Fee_Total
    FROM trust_fund_data
    WHERE 1=1`;

  sql = addDateFilters(sql, month, day, year);

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching data:", err);
      res.status(500).send("Error fetching data");
      return;
    }
    res.json({ electrical_fee_total: results[0].Electrical_Fee_Total || 0 });
  });
});

// Define an endpoint to get Zoning Fee totals
app.get("/api/ZoningFeeTotal", (req, res) => {
  const { month, day, year } = req.query;

  let sql = `
    SELECT
      SUM(ZONING_FEE) AS Zoning_Fee_Total
    FROM trust_fund_data
    WHERE 1=1`;

  sql = addDateFilters(sql, month, day, year);

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching data:", err);
      res.status(500).send("Error fetching data");
      return;
    }
    res.json({ zoning_fee_total: results[0].Zoning_Fee_Total || 0 });
  });
});

// Define an endpoint to get Livestock Dev Fund totals
app.get("/api/LivestockDevFundTotal", (req, res) => {
  const { month, day, year } = req.query;

  let sql = `
    SELECT
      SUM(LOCAL_80_PERCENT_LIVESTOCK + NATIONAL_20_PERCENT) AS Livestock_Dev_Fund_Total
    FROM trust_fund_data
    WHERE 1=1`;

  sql = addDateFilters(sql, month, day, year);

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching data:", err);
      res.status(500).send("Error fetching data");
      return;
    }
    res.json({
      livestock_dev_fund_total: results[0].Livestock_Dev_Fund_Total || 0,
    });
  });
});

// Define an endpoint to get Diving Fee totals
app.get("/api/DivingFeeTotal", (req, res) => {
  const { month, day, year } = req.query;

  let sql = `
    SELECT
      SUM(LOCAL_40_PERCENT_DIVE_FEE + FISHERS_30_PERCENT + BRGY_30_PERCENT) AS Diving_Fee_Total
    FROM trust_fund_data
    WHERE 1=1`;

  sql = addDateFilters(sql, month, day, year);

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching data:", err);
      res.status(500).send("Error fetching data");
      return;
    }
    res.json({ diving_fee_total: results[0].Diving_Fee_Total || 0 });
  });
});

app.get("/api/allDataTrustFund", (req, res) => {
  const { year, month, day } = req.query;

  // Base SQL query
  let sql = `
    SELECT 
      DATE_FORMAT(DATE, '%b %d, %Y') AS 'DATE',
      SUM(COALESCE(BUILDING_PERMIT_FEE, 0)) AS BUILDING_PERMIT_FEE,
      SUM(COALESCE(ELECTRICAL_FEE, 0)) AS ELECTRICAL_FEE,
      SUM(COALESCE(ZONING_FEE, 0)) AS ZONING_FEE,
      SUM(COALESCE(LIVESTOCK_DEV_FUND, 0)) AS LIVESTOCK_DEV_FUND,
      SUM(COALESCE(DIVING_FEE, 0)) AS DIVING_FEE,
      SUM(COALESCE(TOTAL, 0)) AS TOTAL,
      GROUP_CONCAT(DISTINCT COMMENTS SEPARATOR '; ') AS COMMENTS
    FROM trust_fund_data
  `;

  // Build WHERE filters
  let filters = [];
  if (year) {
    filters.push(`YEAR(DATE) = ${db.escape(year)}`);
  }
  if (month) {
    filters.push(`MONTH(DATE) = ${db.escape(month)}`);
  }
  if (day) {
    filters.push(`DAY(DATE) = ${db.escape(day)}`);
  }

  // Apply filters if any exist
  if (filters.length > 0) {
    sql += ` WHERE ${filters.join(" AND ")}`;
  }

  // Group by date and order correctly
  sql += `
    GROUP BY DATE_FORMAT(DATE, '%M %e, %Y')
    ORDER BY DATE(DATE);
  `;

  // Execute query
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching trust fund data:", err);
      return res.status(500).send("Error fetching trust fund data");
    }
    res.json(results);
  });
});

// Define an endpoint to fetch all data from general_fund_data to show in the table
app.get("/api/allDataGeneralFund", (req, res) => {
  const { year, month, day } = req.query;

  let sql = `
    SELECT
      DATE_FORMAT(g.date, '%b %d, %Y') AS 'DATE',

      -- Tax on Business
      SUM(
        IFNULL(g.Manufacturing, 0)
        + IFNULL(g.Distributor, 0)
        + IFNULL(g.Retailing, 0)
        + IFNULL(g.Financial, 0)
        + IFNULL(g.Other_Business_Tax, 0)
        + IFNULL(g.Sand_Gravel, 0)
        + IFNULL(g.Fines_Penalties, 0)
      ) AS "Tax on Business",

      -- Regulatory Fees
SUM(
    IFNULL(g.Mayors_Permit, 0)
    + IFNULL(g.Weighs_Measure, 0)
    + IFNULL(g.Tricycle_Operators, 0)
    + IFNULL(g.Occupation_Tax, 0)
    + IFNULL(g.Cert_of_Ownership, 0)
    + IFNULL(g.Cert_of_Transfer, 0)
    + IFNULL(g.Cockpit_Prov_Share, 0)
    + IFNULL(g.Cockpit_Local_Share, 0)
    + IFNULL(g.Docking_Mooring_Fee, 0)
    + IFNULL(g.Sultadas, 0)
    + IFNULL(g.Miscellaneous_Fee, 0)
    + IFNULL(g.Reg_of_Birth, 0)
    + IFNULL(g.Marriage_Fees, 0)
    + IFNULL(g.Burial_Fees, 0)
    + IFNULL(g.Correction_of_Entry, 0)
    + IFNULL(g.Fishing_Permit_Fee, 0)
    + IFNULL(g.Sale_of_Agri_Prod, 0)
    + IFNULL(g.Sale_of_Acct_Form, 0)
) AS "Regulatory Fees",

      -- Receipts from Economic Enterprise
      SUM(
        IFNULL(g.Water_Fees, 0)
        + IFNULL(g.Stall_Fees, 0)
        + IFNULL(g.Cash_Tickets, 0)
        + IFNULL(g.Slaughter_House_Fee, 0)
        + IFNULL(g.Rental_of_Equipment, 0)
        + IFNULL(g.Cutting_Tree, 0)
      ) AS "Receipts From Economic Enterprise",

      -- Service/User Charges
      SUM(
        IFNULL(g.Doc_Stamp, 0)
        + IFNULL(g.Police_Report_Clearance, 0)
        + IFNULL(g.Secretaries_Fee, 0)
        + IFNULL(g.Med_Dent_Lab_Fees, 0)
		+ IFNULL(g.Garbage_Fees, 0)
      ) AS "Service/User Charges",

      -- Overall total
      SUM(
        IFNULL(g.Manufacturing, 0)
        + IFNULL(g.Distributor, 0)
        + IFNULL(g.Retailing, 0)
        + IFNULL(g.Financial, 0)
        + IFNULL(g.Other_Business_Tax, 0)
        + IFNULL(g.Sand_Gravel, 0)
        + IFNULL(g.Fines_Penalties, 0)
        + IFNULL(g.Mayors_Permit, 0)
        + IFNULL(g.Weighs_Measure, 0)
        + IFNULL(g.Tricycle_Operators, 0)
        + IFNULL(g.Occupation_Tax, 0)
        + IFNULL(g.Cert_of_Ownership, 0)
        + IFNULL(g.Cert_of_Transfer, 0)
        + IFNULL(g.Cockpit_Prov_Share, 0)
        + IFNULL(g.Cockpit_Local_Share, 0)
        + IFNULL(g.Docking_Mooring_Fee, 0)
        + IFNULL(g.Sultadas, 0)
        + IFNULL(g.Miscellaneous_Fee, 0)
        + IFNULL(g.Reg_of_Birth, 0)
        + IFNULL(g.Marriage_Fees, 0)
        + IFNULL(g.Burial_Fees, 0)
        + IFNULL(g.Correction_of_Entry, 0)
        + IFNULL(g.Fishing_Permit_Fee, 0)
        + IFNULL(g.Sale_of_Agri_Prod, 0)
        + IFNULL(g.Sale_of_Acct_Form, 0)
        + IFNULL(g.Water_Fees, 0)
        + IFNULL(g.Stall_Fees, 0)
        + IFNULL(g.Cash_Tickets, 0)
        + IFNULL(g.Slaughter_House_Fee, 0)
        + IFNULL(g.Rental_of_Equipment, 0)
        + IFNULL(g.Doc_Stamp, 0)
        + IFNULL(g.Police_Report_Clearance, 0)
        + IFNULL(g.Secretaries_Fee, 0)
        + IFNULL(g.Med_Dent_Lab_Fees, 0)
        + IFNULL(g.Garbage_Fees, 0)
        + IFNULL(g.Cutting_Tree, 0)
      ) AS "Overall Total",

      -- Instead of ANY_VALUE(g.comments):
      GROUP_CONCAT(DISTINCT g.comments SEPARATOR '; ') AS REMARKS,

      'VIEW COMMENT' AS ACTION

    FROM general_fund_data AS g
  `;

  // Build WHERE filters
  let filters = [];
  if (year) {
    filters.push(`YEAR(g.date) = ${db.escape(year)}`);
  }
  if (month) {
    filters.push(`MONTH(g.date) = ${db.escape(month)}`);
  }
  if (day) {
    filters.push(`DAY(g.date) = ${db.escape(day)}`);
  }

  if (filters.length > 0) {
    sql += ` WHERE ${filters.join(" AND ")}`;
  }

  sql += `
    GROUP BY g.date
    ORDER BY g.date;
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching data:", err);
      return res.status(500).send("Error fetching data");
    }
    res.json(results);
  });
});

app.get("/api/generalFundDataDaily", async (req, res) => {
  try {
    // Extract the date string from the query parameters (e.g., ?date=YYYY-MM-DD)
    const { dateStr } = req.query;

    // Validate if dateStr is provided
    if (!dateStr) {
      return res.status(400).json({ error: "Date parameter is required" });
    }

    // Fetch data from the external API
    const response = await axios.get(
      `http://192.168.101.28:3001/api/generalFundDataDaily/${encodeURIComponent(dateStr)}`
    );

    // Check if the response status is OK
    if (response.status === 200) {
      // Send the response data to the client
      res.json(response.data);
    } else {
      // Handle unexpected status codes
      res
        .status(response.status)
        .json({ error: "Failed to fetch data from external API" });
    }
  } catch (error) {
    // Handle errors from axios or other unexpected errors
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Define the API endpoint
app.get("/api/viewalldataGeneralFundTableView", (req, res) => {
  const { date } = req.query;

  if (!date) {
    return res.status(400).send("Date parameter is required");
  }

  // Replace the old table_daily_view query with a direct query to the main table
  // This will return all rows in general_fund_data where date matches.
  const query = `
    SELECT
      id,
      date,
      name,
      receipt_no,
      Manufacturing,
      Distributor,
      Retailing,
      Financial,
      Other_Business_Tax,
      Sand_Gravel,
      Fines_Penalties,
      Mayors_Permit,
      Weighs_Measure,
      Tricycle_Operators,
      Occupation_Tax,
      Cert_of_Ownership,
      Cert_of_Transfer,
      Cockpit_Prov_Share,
      Cockpit_Local_Share,
      Docking_Mooring_Fee,
      Sultadas,
      Miscellaneous_Fee,
      Reg_of_Birth,
      Marriage_Fees,
      Burial_Fees,
      Correction_of_Entry,
      Fishing_Permit_Fee,
      Sale_of_Agri_Prod,
      Sale_of_Acct_Form,
      Water_Fees,
      Stall_Fees,
      Cash_Tickets,
      Slaughter_House_Fee,
      Rental_of_Equipment,
      Doc_Stamp,
      Police_Report_Clearance,
      Secretaries_Fee,
      Med_Dent_Lab_Fees,
      Garbage_Fees,
      Cutting_Tree,
      total,
      cashier,
      type_receipt,
      comments
    FROM general_fund_data
    WHERE DATE(date) = ?
    ORDER BY id ASC
  `;

  // Execute the query
  db.query(query, [date], (error, results) => {
    if (error) {
      console.error("Database query error:", error);
      return res.status(500).send("Database query error");
    }

    if (results.length === 0) {
      return res.status(404).send("No data found for the given date");
    }

    // Send back all rows for that date
    res.json(results);
  });
});

// Define the API endpoint
app.get("/api/viewalldataTrustFundTableView", (req, res) => {
  const { date } = req.query;

  if (!date) {
    return res.status(400).send("Date parameter is required");
  }

  const query = `
    SELECT
      ID,
      DATE,
      RECEIPT_NO,
      NAME,
      COALESCE(BUILDING_PERMIT_FEE, 0) AS BUILDING_PERMIT_FEE,
      COALESCE(ELECTRICAL_FEE, 0) AS ELECTRICAL_FEE,
      COALESCE(ZONING_FEE, 0) AS ZONING_FEE,
      COALESCE(LIVESTOCK_DEV_FUND, 0) AS LIVESTOCK_DEV_FUND,
      COALESCE(DIVING_FEE, 0) AS DIVING_FEE,
      COALESCE(TOTAL, 0) AS TOTAL,
      CASHIER,
      COALESCE(COMMENTS, '') AS COMMENTS
    FROM trust_fund_data
    WHERE DATE(DATE) = ?
    ORDER BY ID ASC
  `;

  db.query(query, [date], (error, results) => {
    if (error) {
      console.error("Database query error:", error);
      return res.status(500).send("Database query error");
    }

    if (results.length === 0) {
      return res.status(404).send("No data found for the given date");
    }

    res.json(results);
  });
});

// Define the route to get the data
app.get("/api/cedula", (req, res) => {
  const query = `
  SELECT
    DATEISSUED AS DATE,
    CTCNO AS 'CTC NO',
    LOCAL_TIN AS LOCAL,
    OWNERNAME AS NAME,
    BASICTAXDUE AS BASIC,
    BUSTAXAMOUNT AS BUSTAXAMOUNT,
    BUSTAXDUE AS BUSTAXDUE,
    SALTAXAMOUNT AS SALTAXAMOUNT,
    SALTAXDUE AS SALTAXDUE,
    RPTAXAMOUNT AS RPTAXAMOUNT,
    RPTAXDUE AS RPTAXDUE,
    (BUSTAXDUE + SALTAXDUE + RPTAXDUE) AS TAX_DUE,
    INTEREST AS INTEREST,
    (BASICTAXDUE + BUSTAXDUE + SALTAXDUE + RPTAXDUE + INTEREST) AS TOTALAMOUNTPAID,
    USERID AS CASHIER,
    COMMENT AS COMMENTS
  FROM
    cedula;
`;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).send("Server error");
      return;
    }
    res.json(results);
  });
});

// Define the API endpoint for updating cedula records
app.post("/api/cedulaedit", async (req, res) => {
  const {
    DATEISSUED,
    CTCNO,
    LOCAL_TIN,
    OWNERNAME,
    BASICTAXDUE,
    BUSTAXAMOUNT,
    BUSTAXDUE,
    SALTAXAMOUNT,
    SALTAXDUE,
    RPTAXAMOUNT,
    RPTAXDUE,
    INTEREST,
    TOTALAMOUNTPAID,
    USERID,
  } = req.body;

  const query = `
    UPDATE cedula 
    SET DATEISSUED = ?, CTCNO = ?, OWNERNAME = ?, BASICTAXDUE = ?, BUSTAXAMOUNT = ?, 
        BUSTAXDUE = ?, SALTAXAMOUNT = ?, SALTAXDUE = ?, RPTAXAMOUNT = ?, RPTAXDUE = ?, INTEREST = ?, 
        TOTALAMOUNTPAID = ?, USERID = ?, DATALASTEDITED = NOW()
    WHERE LOCAL_TIN = ?;
  `;

  const params = [
    DATEISSUED,
    CTCNO,
    OWNERNAME,
    BASICTAXDUE,
    BUSTAXAMOUNT,
    BUSTAXDUE,
    SALTAXAMOUNT,
    SALTAXDUE,
    RPTAXAMOUNT,
    RPTAXDUE,
    INTEREST,
    TOTALAMOUNTPAID,
    USERID,
    LOCAL_TIN,
  ];

  try {
    // Get a connection from the pool
    const connection = await pool.getConnection();

    // Execute the query using the connection
    const [updateResult] = await connection.execute(query, params);

    // Check the result of the query
    if (updateResult.affectedRows > 0) {
      res.status(200).json({ message: "Record updated successfully." });
    } else {
      res.status(404).json({ message: "Record not found for update." });
    }

    // Release the connection back to the pool
    connection.release();
  } catch (error) {
    console.error("Error updating record:", error);
    res
      .status(500)
      .json({ message: "Error updating record.", error: error.message });
  }
});

// Define an API endpoint to get all PSIC data
app.get("/api/datapsic", (req, res) => {
  const sectionsQuery = "SELECT * FROM Sections";
  db2.query(sectionsQuery, (err, sections) => {
    if (err) {
      console.error("Error fetching sections:", err);
      res.status(500).send("Error fetching sections");
      return;
    }

    // Fetch details for each section
    const sectionsWithDetails = [];
    let completedSections = 0;

    sections.forEach((section) => {
      const divisionsQuery = "SELECT * FROM Divisions WHERE section_code = ?";
      db2.query(divisionsQuery, [section.section_code], (err, divisions) => {
        if (err) {
          console.error("Error fetching divisions:", err);
          res.status(500).send("Error fetching divisions");
          return;
        }

        section.Divisions = divisions;
        let completedDivisions = 0;

        divisions.forEach((division) => {
          const groupsQuery = "SELECT * FROM Groups WHERE division_code = ?";
          db2.query(groupsQuery, [division.division_code], (err, groups) => {
            if (err) {
              console.error("Error fetching groups:", err);
              res.status(500).send("Error fetching groups");
              return;
            }

            division.Groups = groups;
            let completedGroups = 0;

            groups.forEach((group) => {
              const classesQuery = "SELECT * FROM Classes WHERE group_code = ?";
              db2.query(classesQuery, [group.group_code], (err, classes) => {
                if (err) {
                  console.error("Error fetching classes:", err);
                  res.status(500).send("Error fetching classes");
                  return;
                }

                group.Classes = classes;
                let completedClasses = 0;

                classes.forEach((classData) => {
                  const subclassesQuery =
                    "SELECT * FROM Subclasses WHERE class_code = ?";
                  db2.query(
                    subclassesQuery,
                    [classData.class_code],
                    (err, subclasses) => {
                      if (err) {
                        console.error("Error fetching subclasses:", err);
                        res.status(500).send("Error fetching subclasses");
                        return;
                      }

                      classData.Subclasses = subclasses;
                      completedClasses++;
                      if (completedClasses === classes.length) {
                        completedGroups++;
                        if (completedGroups === groups.length) {
                          completedDivisions++;
                          if (completedDivisions === divisions.length) {
                            sectionsWithDetails.push(section);
                            completedSections++;
                            if (completedSections === sections.length) {
                              res.json(sectionsWithDetails);
                            }
                          }
                        }
                      }
                    }
                  );
                });
              });
            });
          });
        });
      });
    });
  });
});

app.put("/api/updateGeneralFundData/:id", (req, res) => {
  const { id } = req.params; // e.g. the :id in the URL
  const {
    date,
    name,
    receipt_no,
    Manufacturing,
    Distributor,
    Retailing,
    Financial,
    Other_Business_Tax,
    Sand_Gravel,
    Fines_Penalties,
    Mayors_Permit,
    Weighs_Measure,
    Tricycle_Operators,
    Occupation_Tax,
    Cert_of_Ownership,
    Cert_of_Transfer,
    Cockpit_Prov_Share,
    Cockpit_Local_Share,
    Docking_Mooring_Fee,
    Sultadas,
    Miscellaneous_Fee,
    Reg_of_Birth,
    Marriage_Fees,
    Burial_Fees,
    Correction_of_Entry,
    Fishing_Permit_Fee,
    Sale_of_Agri_Prod,
    Sale_of_Acct_Form,
    Water_Fees,
    Stall_Fees,
    Cash_Tickets,
    Slaughter_House_Fee,
    Rental_of_Equipment,
    Doc_Stamp,
    Police_Report_Clearance,
    Secretaries_Fee,
    Med_Dent_Lab_Fees,
    Garbage_Fees,
    Cutting_Tree,
    total,
    cashier,
    type_receipt,
  } = req.body;

  // Example UPDATE query
  const query = `
    UPDATE general_fund_data
    SET
      date = ?,
      name = ?,
      receipt_no = ?,
      Manufacturing = ?,
      Distributor = ?,
      Retailing = ?,
      Financial = ?,
      Other_Business_Tax = ?,
      Sand_Gravel = ?,
      Fines_Penalties = ?,
      Mayors_Permit = ?,
      Weighs_Measure = ?,
      Tricycle_Operators = ?,
      Occupation_Tax = ?,
      Cert_of_Ownership = ?,
      Cert_of_Transfer = ?,
      Cockpit_Prov_Share = ?,
      Cockpit_Local_Share = ?,
      Docking_Mooring_Fee = ?,
      Sultadas = ?,
      Miscellaneous_Fee = ?,
      Reg_of_Birth = ?,
      Marriage_Fees = ?,
      Burial_Fees = ?,
      Correction_of_Entry = ?,
      Fishing_Permit_Fee = ?,
      Sale_of_Agri_Prod = ?,
      Sale_of_Acct_Form = ?,
      Water_Fees = ?,
      Stall_Fees = ?,
      Cash_Tickets = ?,
      Slaughter_House_Fee = ?,
      Rental_of_Equipment = ?,
      Doc_Stamp = ?,
      Police_Report_Clearance = ?,
      Secretaries_Fee = ?,
      Med_Dent_Lab_Fees = ?,
      Garbage_Fees = ?,
      Cutting_Tree = ?,
      total = ?,
      cashier = ?,
      type_receipt = ?
    WHERE id = ?
  `;

  const values = [
    date,
    name,
    receipt_no,
    Manufacturing,
    Distributor,
    Retailing,
    Financial,
    Other_Business_Tax,
    Sand_Gravel,
    Fines_Penalties,
    Mayors_Permit,
    Weighs_Measure,
    Tricycle_Operators,
    Occupation_Tax,
    Cert_of_Ownership,
    Cert_of_Transfer,
    Cockpit_Prov_Share,
    Cockpit_Local_Share,
    Docking_Mooring_Fee,
    Sultadas,
    Miscellaneous_Fee,
    Reg_of_Birth,
    Marriage_Fees,
    Burial_Fees,
    Correction_of_Entry,
    Fishing_Permit_Fee,
    Sale_of_Agri_Prod,
    Sale_of_Acct_Form,
    Water_Fees,
    Stall_Fees,
    Cash_Tickets,
    Slaughter_House_Fee,
    Rental_of_Equipment,
    Doc_Stamp,
    Police_Report_Clearance,
    Secretaries_Fee,
    Med_Dent_Lab_Fees,
    Garbage_Fees,
    Cutting_Tree,
    total,
    cashier,
    type_receipt,
    id, // <-- The WHERE condition
  ];

  db.query(query, values, (err, results) => {
    if (err) {
      console.error("Failed to update data:", err);
      res.status(500).json({ message: "Failed to update data" });
    } else {
      res.status(200).json({ message: "Data updated successfully" });
    }
  });
});

app.post("/api/dailyComments", (req, res) => {
  const { date, comment, time, user } = req.body;

  if (!date || !comment || !time || !user) {
    return res
      .status(400)
      .json({ error: "Missing one of: date, comment, time, user" });
  }

  const sql = `
    INSERT INTO gf_daily_collection_comment (date, comment, time, user)
    VALUES (?, ?, ?, ?)
  `;
  db.query(sql, [date, comment, time, user], (err, result) => {
    if (err) {
      console.error("Error inserting comment:", err);
      return res
        .status(500)
        .json({ error: "Database error inserting comment" });
    }
    // Return the inserted ID or a success message
    res.status(201).json({
      message: "Comment added successfully",
      insertedId: result.insertId,
    });
  });
});

app.post("/api/saveCedulaData", (req, res) => {
  const {
    DATEISSUED,
    TRANSDATE,
    CTCNO,
    CTCTYPE,
    OWNERNAME,
    BASICTAXDUE,
    SALTAXDUE,
    INTEREST,
    TOTALAMOUNTPAID,
    USERID,
    CTCYEAR,
  } = req.body;

  // Check if the CTCNO already exists
  const checkQuery = "SELECT 1 FROM CEDULA WHERE CTCNO = ? LIMIT 1";
  db.query(checkQuery, [CTCNO], (checkErr, checkResult) => {
    if (checkErr) {
      console.error("Error checking CTCNO:", checkErr);
      return res
        .status(500)
        .json({ error: "Database error while checking CTCNO" });
    }

    // If CTCNO exists, send an error response
    if (checkResult.length > 0) {
      return res
        .status(400)
        .json({ error: "CTCNO already exists. Cannot save duplicate." });
    }

    // Insert new record if no duplicate
    const insertQuery = `
      INSERT INTO CEDULA (
        DATEISSUED,
        TRANSDATE,
        CTCNO,
        CTCTYPE,
        OWNERNAME,
        BASICTAXDUE,
        SALTAXDUE,
        INTEREST,
        TOTALAMOUNTPAID,
        USERID,
        CTCYEAR
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      DATEISSUED,
      TRANSDATE,
      CTCNO,
      CTCTYPE,
      OWNERNAME,
      BASICTAXDUE,
      SALTAXDUE,
      INTEREST,
      TOTALAMOUNTPAID,
      USERID,
      CTCYEAR,
    ];

    db.query(insertQuery, values, (insertErr, result) => {
      if (insertErr) {
        console.error("Error saving data:", insertErr);
        return res.status(500).json({ error: "Failed to save data" });
      }
      res.status(200).json({
        message: "Data saved successfully",
        id: result.insertId,
      });
    });
  });
});

// API Endpoint to update Cedula data
app.put("/api/updateCedulaData/:ctcno", (req, res) => {
  const { ctcno: oldCtcno } = req.params; // existing record identifier
  const {
    DATEISSUED,
    TRANSDATE,
    CTCNO: newCtcno, // potentially new CTCNO
    CTCTYPE,
    OWNERNAME,
    BASICTAXDUE,
    SALTAXDUE,
    INTEREST,
    TOTALAMOUNTPAID,
    USERID,
    CTCYEAR,
    DATALASTEDITED,
  } = req.body;

  // Function to execute the update if no duplicate is found
  function proceedWithUpdate() {
    const sql = `
      UPDATE CEDULA
      SET
        DATEISSUED = ?,
        TRANSDATE = ?,
        CTCNO = ?,
        CTCTYPE = ?,
        OWNERNAME = ?,
        BASICTAXDUE = ?,
        SALTAXDUE = ?,
        INTEREST = ?,
        TOTALAMOUNTPAID = ?,
        USERID = ?,
        CTCYEAR = ?,
        DATALASTEDITED = ?
      WHERE CTCNO = ?;
    `;

    const values = [
      DATEISSUED,
      TRANSDATE,
      newCtcno,
      CTCTYPE,
      OWNERNAME,
      BASICTAXDUE,
      SALTAXDUE,
      INTEREST,
      TOTALAMOUNTPAID,
      USERID,
      CTCYEAR,
      DATALASTEDITED,
      oldCtcno, // condition: update the record with the old CTCNO
    ];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error("Error updating data:", err);
        return res.status(500).json({ error: "Failed to update data" });
      }
      res.status(200).json({ message: "Data updated successfully" });
    });
  }

  // If the CTCNO is being changed, check for duplicates
  if (newCtcno && newCtcno !== oldCtcno) {
    const checkSql = "SELECT COUNT(*) AS count FROM CEDULA WHERE CTCNO = ?";
    db.query(checkSql, [newCtcno], (checkErr, checkResults) => {
      if (checkErr) {
        console.error("Error checking duplicate CTCNO:", checkErr);
        return res
          .status(500)
          .json({ error: "Database error during duplicate check" });
      }

      const { count } = checkResults[0];
      if (count > 0) {
        // Duplicate exists, do not proceed with update
        return res
          .status(400)
          .json({ error: "Duplicate CTCNO exists. Update aborted." });
      } else {
        // No duplicate, safe to proceed
        proceedWithUpdate();
      }
    });
  } else {
    // If CTCNO is unchanged, directly update without duplicate check
    proceedWithUpdate();
  }
});

app.get("/api/CedulaDailyCollection", (req, res) => {
  const { year, month } = req.query;

  let sql = `
    SELECT
      DATE_FORMAT(DATEISSUED, '%b %d, %Y') AS DATE,
      SUM(BASICTAXDUE) AS BASIC,
      SUM(SALTAXDUE) AS TAX_DUE,
      SUM(INTEREST) AS INTEREST,
      SUM(TOTALAMOUNTPAID) AS TOTAL,
      COMMENT
    FROM CEDULA
  `;

  const conditions = [];
  const values = [];

  if (year) {
    conditions.push("YEAR(DATEISSUED) = ?");
    values.push(year);
  }

  if (month) {
    conditions.push("MONTH(DATEISSUED) = ?");
    values.push(month);
  }

  if (conditions.length > 0) {
    sql += ` WHERE ${conditions.join(" AND ")}`;
  }

  sql += `
    GROUP BY DATE(DATEISSUED)
    ORDER BY DATE(DATEISSUED)
  `;

  db.query(sql, values, (err, results) => {
    if (err) {
      console.error("Error fetching daily collection:", err);
      return res
        .status(500)
        .json({ error: "Failed to fetch daily collection" });
    }
    res.status(200).json(results);
  });
});

app.get("/api/fetch-report", (req, res) => {
  const sql = `
    SELECT
      DATE_FORMAT(date, '%Y-%m-%d') AS "date",
      COALESCE(GF, 0) AS "GF",
      COALESCE(TF, 0) AS "TF",
      COALESCE(dueFrom, 0) AS "dueFrom",
      COALESCE(comment, '') AS "comment",

      -- Adjustment Values
      COALESCE(CTCunder, 0) AS "CTCunder",
      COALESCE(CTCover, 0) AS "CTCover",
      COALESCE(RPTunder, 0) AS "RPTunder",
      COALESCE(RPTover, 0) AS "RPTover",
      COALESCE(GFTFunder, 0) AS "GFTFunder",
      COALESCE(GFTFover, 0) AS "GFTFover",

      -- Raw Values
      COALESCE(ctc, 0) AS raw_ctc,
      COALESCE(rpt, 0) AS raw_rpt,
      COALESCE(gfAndTf, 0) AS raw_gfAndTf

    FROM full_report_rcd
    ORDER BY date;
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Error fetching data:", err);
      return res.status(500).send("Error fetching data");
    }

    const formattedResults = results.map((row) => {
      const ctc = (row.raw_ctc || 0) + (row.CTCunder || 0) - (row.CTCover || 0);
      const rpt = (row.raw_rpt || 0) + (row.RPTunder || 0) - (row.RPTover || 0);
      const gfAndTf =
        (row.raw_gfAndTf || 0) + (row.GFTFunder || 0) - (row.GFTFover || 0);
      const dueFrom = row.dueFrom || 0;

      const rcdTotal = ctc + rpt + gfAndTf + dueFrom;

      return {
        date: row.date,
        GF: row.GF,
        TF: row.TF,
        dueFrom,
        comment: row.comment,
        ctc,
        rpt,
        gfAndTf,
        rcdTotal, // ✅ Corrected and visible in the frontend
        adjustments: {
          ctc: { under: row.CTCunder, over: row.CTCover },
          rpt: { under: row.RPTunder, over: row.RPTover },
          gfAndTf: { under: row.GFTFunder, over: row.GFTFover },
        },
      };
    });

    res.json(formattedResults);
  });
});

app.post("/api/update-report", (req, res) => {
  console.log("🔹 Request received:", req.body);

  const { date, dueFrom, comment } = req.body;
  if (!date) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const sql = `
    UPDATE full_report_rcd
    SET dueFrom = ?, comment = ?
    WHERE date = ?;
  `;

  db.query(sql, [dueFrom || 0, comment || "", date], (err, result) => {
    if (err) {
      console.error("❌ Database error:", err);
      return res.status(500).json({ error: "Database update failed" });
    }

    if (result.affectedRows === 0) {
      console.warn("⚠️ No record found for the given date:", date);
      return res
        .status(404)
        .json({ error: "No record found for the given date" });
    }

    res.json({ success: true, message: "Record updated successfully" });
  });
});

app.post("/api/deleteCedulaComment", async (req, res) => {
  try {
    const { receipt_no } = req.body;

    if (!receipt_no) {
      return res.status(400).json({ error: "Receipt number is required" });
    }

    const [result] = await pool.query(
      "DELETE FROM cedula_comment WHERE receipt_no = ?",
      [receipt_no]
    );

    res.status(200).json({
      success: true,
      affectedRows: result.affectedRows,
    });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ error: "Failed to delete comment" });
  }
});

app.post("/api/clearCedulaComment", async (req, res) => {
  try {
    const { CTCNO } = req.body;

    if (!CTCNO) {
      return res.status(400).json({ error: "CTC number is required" });
    }

    const [result] = await pool.query(
      'UPDATE cedula SET COMMENT = "" WHERE CTCNO = ?',
      [CTCNO]
    );

    res.status(200).json({
      success: true,
      affectedRows: result.affectedRows,
    });
  } catch (error) {
    console.error("Error clearing comment:", error);
    res.status(500).json({ error: "Failed to clear comment" });
  }
});

app.get("/api/viewDailyCollectionDetailsCedula", (req, res) => {
  const { date } = req.query;

  // Convert to MySQL DATE format
  const formattedDate = new Date(date)
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");

  const query = `
  SELECT 
    DATE_FORMAT(DATEISSUED, '%Y-%m-%d') AS DATE,
    CTCNO AS "CTC NO",
    NULLIF(LOCAL_TIN, '') AS LOCAL,
    NULLIF(OWNERNAME, '') AS NAME,
    COALESCE(BASICTAXDUE, 0) AS BASIC,
    COALESCE(BUSTAXDUE, 0) + 
    COALESCE(SALTAXDUE, 0) + 
    COALESCE(RPTAXDUE, 0) AS TAX_DUE,
    COALESCE(INTEREST, 0) AS INTEREST,
    COALESCE(BASICTAXDUE, 0) + 
    (COALESCE(BUSTAXDUE, 0) + 
     COALESCE(SALTAXDUE, 0) + 
     COALESCE(RPTAXDUE, 0)) + 
    COALESCE(INTEREST, 0) AS TOTAL,
    NULLIF(USERID, '') AS CASHIER,
    NULLIF(COMMENT, '') AS COMMENT
  FROM cedula
  WHERE DATE(DATEISSUED) = ?
  ORDER BY CTCNO ASC`;

  db.query(query, [formattedDate], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

// app.post('/api/saveCommentCedula', (req, res) => {
//   const { date, ctcNo, comment } = req.body;

//   const query = `
//     UPDATE cedula
//     SET COMMENT = ?
//     WHERE DATE(DATEISSUED) = ? AND CTCNO = ?
//   `;

//   db.query(query, [comment, date, ctcNo], (err, result) => {
//     if (err) {
//       console.error('Database error:', err);
//       return res.status(500).json({ error: 'Database error' });
//     }

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ error: 'Record not found' });
//     }

//     res.json({ message: 'Comment updated successfully' });
//   });
// });

app.post("/api/save-adjustment", (req, res) => {
  const { date, column, value } = req.body;

  console.log("📥 Incoming Request:", req.body); // Debug incoming request

  if (!date || !column || value === undefined) {
    console.error("❌ Missing required fields", req.body);
    return res.status(400).json({ error: "Missing required fields" });
  }

  const allowedColumns = [
    "CTCunder",
    "CTCover",
    "RPTunder",
    "RPTover",
    "GFTFunder",
    "GFTFover",
  ];

  if (!allowedColumns.includes(column)) {
    console.error("❌ Invalid column name:", column);
    return res.status(400).json({ error: "Invalid column name" });
  }

  // ✅ Fixed Query - Remove DATE_FORMAT
  const sql = `
      UPDATE full_report_rcd
      SET ${column} = ?
      WHERE date = ?
  `;

  db.query(sql, [value, date], (err, result) => {
    if (err) {
      console.error("❌ Database error:", err);
      return res.status(500).json({ error: "Database update failed" });
    }

    console.log("🔄 SQL Update Result:", result);

    if (result.affectedRows === 0) {
      console.warn("⚠️ No record found for date:", date);
      return res
        .status(404)
        .json({ error: "No record found for the given date" });
    }

    console.log(`✅ Updated ${column} for date ${date} to ${value}`);
    res.json({ success: true, message: "Adjustment updated successfully!" });
  });
});

app.post("/api/generate-report", (req, res) => {
  const {
    dateType,
    dateFrom,
    dateTo,
    reportType,
    cashier,
    ctcnFrom,
    ctcnTo,
    orFrom,
    orTo,
  } = req.body;

  if (!dateFrom || !dateTo || !cashier || !reportType) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Format date range
  let startDate, endDate;
  if (dateType === "monthYear") {
    const [year, month] = dateFrom.split("-");
    startDate = `${year}-${month}-01`;
    endDate = `${year}-${month}-${new Date(year, month, 0).getDate()}`;
  } else {
    startDate = dateFrom;
    endDate = dateTo;
  }

  let query = "";
  const queryParams = [];

  // --- RPT ---
  if (reportType === "real_property_tax_data") {
    query = `
      SELECT 
        DATE_FORMAT(date, '%Y-%m-%d') AS date,
        cashier,
        'RPT' AS report_type,
        receipt_no AS or_number,
        CAST(gf_total AS DECIMAL(10,2)) AS total
      FROM real_property_tax_data
      WHERE date BETWEEN ? AND ? AND cashier = ?
    `;
    queryParams.push(startDate, endDate, cashier);

    if (orFrom && orTo) {
      query += " AND receipt_no BETWEEN ? AND ?";
      queryParams.push(orFrom, orTo);
    }

    // --- Cedula ---
  } else if (reportType === "CTCI") {
    query = `
      SELECT 
        DATE_FORMAT(DATEISSUED, '%Y-%m-%d') AS date,
        USERID AS cashier,
        CTCTYPE AS report_type,
        CTCNO AS or_number,
        CAST(TOTALAMOUNTPAID AS DECIMAL(10,2)) AS total
      FROM cedula
      WHERE DATEISSUED BETWEEN ? AND ? AND USERID = ? AND CTCTYPE = ?
    `;
    queryParams.push(startDate, endDate, cashier, reportType);

    if (ctcnFrom && ctcnTo) {
      query += " AND CTCNO BETWEEN ? AND ?";
      queryParams.push(ctcnFrom, ctcnTo);
    }

    // --- GF AND TF ---
  } else if (reportType === "51") {
    if (cashier === "AMABELLA") {
      // Special case: AMABELLA – Cash_Tickets only
      query = `
        SELECT 
          DATE_FORMAT(date, '%Y-%m-%d') AS date,
          cashier,
          'GF' AS report_type,
          receipt_no AS or_number,
          CAST(Cash_Tickets AS DECIMAL(10,2)) AS total
        FROM general_fund_data
        WHERE date BETWEEN ? AND ? AND cashier = ? AND type_receipt = '51' AND Cash_Tickets > 0
      `;
      queryParams.push(startDate, endDate, cashier);

      if (orFrom && orTo) {
        query += " AND receipt_no BETWEEN ? AND ?";
        queryParams.push(orFrom, orTo);
      }
    } else {
      // Normal GF + TF
      query = `
        (
          SELECT 
            DATE_FORMAT(date, '%Y-%m-%d') AS date,
            cashier,
            'GF' AS report_type,
            receipt_no AS or_number,
            CAST(total AS DECIMAL(10,2)) AS total
          FROM general_fund_data
          WHERE date BETWEEN ? AND ? AND cashier = ? AND type_receipt = '51'
      `;
      queryParams.push(startDate, endDate, cashier);

      if (orFrom && orTo) {
        query += " AND receipt_no BETWEEN ? AND ?";
        queryParams.push(orFrom, orTo);
      }

      query += `)
        UNION ALL
        (
          SELECT 
            DATE_FORMAT(date, '%Y-%m-%d') AS date,
            cashier,
            'TF' AS report_type,
            receipt_no AS or_number,
            CAST(total AS DECIMAL(10,2)) AS total
          FROM trust_fund_data
          WHERE date BETWEEN ? AND ? AND cashier = ? AND TYPE_OF_RECEIPT = '51'
      `;
      queryParams.push(startDate, endDate, cashier);

      if (orFrom && orTo) {
        query += " AND receipt_no BETWEEN ? AND ?";
        queryParams.push(orFrom, orTo);
      }

      query += ") ORDER BY date";
    }
  } else {
    return res.status(400).json({ error: "Unsupported report type" });
  }

  // Execute the final query
  db.query(query, queryParams, (error, results) => {
    if (error) {
      console.error("SQL Error:", error);
      return res.status(500).json({ error: error.message });
    }

    const processedData = results.map((row) => ({
      ...row,
      total: Number(row.total),
      date: row.date || null,
    }));

    res.json({ data: processedData });
  });
});

app.get("/api/TaxOnBusinessBreakdown", (req, res) => {
  const { months, year } = req.query;
  const monthList = months ? months.split(",").map(Number) : null;

  let sql = `
    SELECT
      Manufacturing,
      Distributor,
      Retailing,
      Financial,
      Other_Business_Tax,
      Sand_Gravel,
      Fines_Penalties
    FROM general_fund_data
    WHERE 1=1`;

  if (year) {
    sql += ` AND YEAR(date) = ${year}`;
  }

  if (monthList?.length) {
    sql += ` AND MONTH(date) IN (${monthList.join(",")})`;
  }

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error" });
    }

    const summedData = results.reduce((acc, row) => {
      Object.keys(row).forEach((key) => {
        acc[key] = (acc[key] || 0) + (row[key] || 0);
      });
      return acc;
    }, {});

    res.json(summedData);
  });
});

app.get("/api/TaxOnBusinessTotalESREBox", (req, res) => {
  const { year, months } = req.query;

  // Validate input parameters
  if (!year || isNaN(year)) {
    return res.status(400).json({
      error: "Invalid year parameter",
      code: "INVALID_YEAR",
    });
  }

  const monthList = months
    ? months
        .split(",")
        .map(Number)
        .filter((m) => m >= 1 && m <= 12)
    : [];

  let sql = `
    SELECT 
      COALESCE(SUM(
        Manufacturing + Distributor + Retailing + 
        Financial + Other_Business_Tax + 
        Sand_Gravel + Fines_Penalties
      ), 0) AS total 
    FROM general_fund_data
    WHERE YEAR(date) = ?
  `;

  const params = [year];

  if (monthList.length > 0) {
    sql += ` AND MONTH(date) IN (${"?,".repeat(monthList.length).slice(0, -1)})`;
    params.push(...monthList);
  }

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({
        error: "Database operation failed",
        code: "DB_ERROR",
      });
    }

    // Ensure numeric value
    const total = Number(results[0]?.total) || 0;

    res.json({
      total: total,
      currency: "USD",
      meta: {
        year: year,
        months: monthList,
      },
    });
  });
});

app.get("/api/RegulatoryFeesAndChargesTotalESREBox", (req, res) => {
  const { year, months } = req.query;

  // Validate input parameters
  if (!year || isNaN(year)) {
    return res.status(400).json({
      error: "Invalid year parameter",
      code: "INVALID_YEAR",
    });
  }

  const monthList = months
    ? months
        .split(",")
        .map(Number)
        .filter((m) => m >= 1 && m <= 12)
    : [];

  let monthConditionGen = "";
  let monthConditionTrust = "";
  const paramsGen = [year];
  const paramsTrust = [year];

  if (monthList.length > 0) {
    const placeholders = monthList.map(() => "?").join(",");
    monthConditionGen = ` AND MONTH(date) IN (${placeholders})`;
    monthConditionTrust = ` AND MONTH(DATE) IN (${placeholders})`;
    paramsGen.push(...monthList);
    paramsTrust.push(...monthList);
  }

  const sql = `
    SELECT 
  (
    SELECT COALESCE(SUM(
      COALESCE(Weighs_Measure, 0) + COALESCE(Tricycle_Operators, 0) + COALESCE(Occupation_Tax, 0) +
      COALESCE(Docking_Mooring_Fee, 0) + COALESCE(Cockpit_Prov_Share, 0) + COALESCE(Cockpit_Local_Share, 0) +
      COALESCE(Sultadas, 0) + COALESCE(Miscellaneous_Fee, 0) + COALESCE(Fishing_Permit_Fee, 0) +
      COALESCE(Sale_of_Agri_Prod, 0) + COALESCE(Sale_of_Acct_Form, 0) +
      COALESCE(Reg_of_Birth, 0) + COALESCE(Marriage_Fees, 0) + COALESCE(Burial_Fees, 0) +
      COALESCE(Correction_of_Entry, 0) + COALESCE(Cert_of_Ownership, 0) + COALESCE(Cert_of_Transfer, 0) +
      COALESCE(Mayors_Permit, 0)
    ), 0)
    FROM general_fund_data
    WHERE YEAR(date) = ? ${monthConditionGen}
  ) +
  (
    SELECT COALESCE(SUM(
      COALESCE(LIVESTOCK_DEV_FUND, 0) + COALESCE(DIVING_FEE, 0) +
      COALESCE(BUILDING_PERMIT_FEE, 0) + COALESCE(ELECTRICAL_FEE, 0) + COALESCE(ZONING_FEE, 0)
    ), 0)
    FROM trust_fund_data
    WHERE YEAR(DATE) = ? ${monthConditionTrust}
  ) AS total;
  `;

  const finalParams = [...paramsGen, ...paramsTrust];

  db.query(sql, finalParams, (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({
        error: "Database operation failed",
        code: "DB_ERROR",
      });
    }

    const total = Number(results[0]?.total) || 0;

    res.json({
      total: total,
      currency: "USD",
      meta: {
        year: parseInt(year),
        months: monthList,
      },
    });
  });
});

app.get("/api/ServiceUserChargesBreakdown", (req, res) => {
  const { months, year } = req.query;

  if (!year || isNaN(year)) {
    return res.status(400).json({
      error: 'Invalid or missing "year" parameter',
      code: "INVALID_YEAR",
    });
  }

  const monthList = months
    ? months
        .split(",")
        .map(Number)
        .filter((m) => m >= 1 && m <= 12)
    : [];

  const baseWhere = `YEAR(date) = ?`;
  const baseParams = [year];

  let monthCondition = "";
  if (monthList.length > 0) {
    const placeholders = monthList.map(() => "?").join(",");
    monthCondition = ` AND MONTH(date) IN (${placeholders})`;
    baseParams.push(...monthList);
  }

  const sql = `
    SELECT category, SUM(total) AS total_amount FROM (
      SELECT 'Secretaries Fee' AS category, SUM(COALESCE(Secretaries_Fee, 0) + COALESCE(Police_Report_Clearance, 0)) AS total
      FROM general_fund_data WHERE ${baseWhere} ${monthCondition}

      UNION ALL
      SELECT 'Garbage Fees', SUM(COALESCE(Garbage_Fees, 0))
      FROM general_fund_data WHERE ${baseWhere} ${monthCondition}

      UNION ALL
      SELECT 'Med./Lab Fees', SUM(COALESCE(Med_Dent_Lab_Fees, 0))
      FROM general_fund_data WHERE ${baseWhere} ${monthCondition}
    ) AS summary
    GROUP BY category;
  `;

  // Duplicate the params once for each SELECT block (3 times)
  const paramsGeneral = [...baseParams, ...baseParams, ...baseParams];

  db.query(sql, paramsGeneral, (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res
        .status(500)
        .json({ error: "Database error", code: "DB_ERROR" });
    }

    res.json({
      year: parseInt(year),
      months: monthList,
      currency: "USD",
      breakdown: results,
    });
  });
});

app.get("/api/ServiceUserChargesTotalESREBox", (req, res) => {
  const { year, months } = req.query;

  // Validate year
  if (!year || isNaN(year)) {
    return res.status(400).json({
      error: "Invalid year parameter",
      code: "INVALID_YEAR",
    });
  }

  const monthList = months
    ? months
        .split(",")
        .map(Number)
        .filter((m) => m >= 1 && m <= 12)
    : [];

  const params = [year];
  let monthCondition = "";

  if (monthList.length > 0) {
    const placeholders = monthList.map(() => "?").join(",");
    monthCondition = ` AND MONTH(date) IN (${placeholders})`;
    params.push(...monthList);
  }

  const sql = `
    SELECT COALESCE(SUM(
      COALESCE(Secretaries_Fee, 0) + COALESCE(Police_Report_Clearance, 0) +
      COALESCE(Garbage_Fees, 0) +
      COALESCE(Med_Dent_Lab_Fees, 0)
    ), 0) AS total
    FROM general_fund_data
    WHERE YEAR(date) = ? ${monthCondition};
  `;

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({
        error: "Database operation failed",
        code: "DB_ERROR",
      });
    }

    const total = Number(results[0]?.total || 0);

    res.json({
      total,
      currency: "USD",
      meta: {
        year: parseInt(year),
        months: monthList,
      },
    });
  });
});

app.get("/api/RegulatoryFeesAndChargesBreakdown", (req, res) => {
  const { months, year } = req.query;

  // Validate input
  if (!year || isNaN(year)) {
    return res.status(400).json({
      error: 'Invalid or missing "year" parameter',
      code: "INVALID_YEAR",
    });
  }

  const monthList = months
    ? months
        .split(",")
        .map(Number)
        .filter((m) => m >= 1 && m <= 12)
    : [];

  let monthConditionGeneral = "";
  let monthConditionTrust = "";
  const paramsGeneral = [year];
  const paramsTrust = [year];

  if (monthList.length > 0) {
    const placeholders = monthList.map(() => "?").join(",");
    monthConditionGeneral = ` AND MONTH(date) IN (${placeholders})`;
    monthConditionTrust = ` AND MONTH(DATE) IN (${placeholders})`;
    paramsGeneral.push(...monthList);
    paramsTrust.push(...monthList);
  }

  const sql = `
    SELECT category, SUM(total) AS total_amount FROM (
      SELECT 'WEIGHS AND MEASURE' AS category, SUM(Weighs_Measure) AS total FROM general_fund_data
      WHERE YEAR(date) = ? ${monthConditionGeneral}
      UNION ALL
      SELECT 'TRICYCLE PERMIT FEE', SUM(Tricycle_Operators) FROM general_fund_data
      WHERE YEAR(date) = ? ${monthConditionGeneral}
      UNION ALL
      SELECT 'OCCUPATION TAX', SUM(Occupation_Tax) FROM general_fund_data
      WHERE YEAR(date) = ? ${monthConditionGeneral}
      UNION ALL
      SELECT 'OTHER PERMIST AND LICENSE', 
             SUM(Docking_Mooring_Fee + Cockpit_Prov_Share + Cockpit_Local_Share + Sultadas + Miscellaneous_Fee +
                 Fishing_Permit_Fee + Sale_of_Agri_Prod + Sale_of_Acct_Form) 
      FROM general_fund_data WHERE YEAR(date) = ? ${monthConditionGeneral}
      UNION ALL
      SELECT 'OTHER PERMIST AND LICENSE', 
             SUM(LIVESTOCK_DEV_FUND + DIVING_FEE) 
      FROM trust_fund_data WHERE YEAR(DATE) = ? ${monthConditionTrust}
      UNION ALL
      SELECT 'CIVIL REGISTRATION', 
             SUM(Reg_of_Birth + Marriage_Fees + Burial_Fees + Correction_of_Entry) 
      FROM general_fund_data WHERE YEAR(date) = ? ${monthConditionGeneral}
      UNION ALL
      SELECT 'CATTLE/ANIMAL REGISTRATION FEES', 
             SUM(Cert_of_Ownership + Cert_of_Transfer) 
      FROM general_fund_data WHERE YEAR(date) = ? ${monthConditionGeneral}
      UNION ALL
      SELECT 'BUILDING PERMITS', 
             SUM(BUILDING_PERMIT_FEE + ELECTRICAL_FEE) 
      FROM trust_fund_data WHERE YEAR(DATE) = ? ${monthConditionTrust}
      UNION ALL
      SELECT 'BUSINESS PERMITS', SUM(Mayors_Permit) FROM general_fund_data
      WHERE YEAR(date) = ? ${monthConditionGeneral}
      UNION ALL
      SELECT 'ZONIAL/LOCATION PERMIT FEES', 
             SUM(ZONING_FEE) FROM trust_fund_data
      WHERE YEAR(DATE) = ? ${monthConditionTrust}
    ) AS summary
    GROUP BY category;
  `;

  const finalParams = [
    ...paramsGeneral, // 1
    ...paramsGeneral, // 2
    ...paramsGeneral, // 3
    ...paramsGeneral, // 4
    ...paramsTrust, // 5
    ...paramsGeneral, // 6
    ...paramsGeneral, // 7
    ...paramsTrust, // 8
    ...paramsGeneral, // 9
    ...paramsTrust, // 10
  ];

  db.query(sql, finalParams, (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res
        .status(500)
        .json({ error: "Database error", code: "DB_ERROR" });
    }

    res.json({
      year: parseInt(year),
      months: monthList,
      currency: "USD",
      breakdown: results,
    });
  });
});

app.get("/api/ReceiptsEconomicEnterprisesTotalESREBox", (req, res) => {
  const { year, months } = req.query;

  // Validate year
  if (!year || isNaN(year)) {
    return res.status(400).json({
      error: "Invalid year parameter",
      code: "INVALID_YEAR",
    });
  }

  const monthList = months
    ? months
        .split(",")
        .map(Number)
        .filter((m) => m >= 1 && m <= 12)
    : [];

  let sql = `
    SELECT 
      COALESCE(SUM(
        COALESCE(Slaughter_House_Fee, 0) + COALESCE(Stall_Fees, 0) + COALESCE(Cash_Tickets, 0) +
        COALESCE(Water_Fees, 0) + COALESCE(Rental_of_Equipment, 0)
      ), 0) AS total 
    FROM general_fund_data
    WHERE YEAR(date) = ?
  `;

  const params = [year];

  if (monthList.length > 0) {
    const placeholders = monthList.map(() => "?").join(",");
    sql += ` AND MONTH(date) IN (${placeholders})`;
    params.push(...monthList);
  }

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({
        error: "Database operation failed",
        code: "DB_ERROR",
      });
    }

    const total = Number(results[0]?.total || 0);

    res.json({
      total,
      currency: "USD",
      meta: {
        year: parseInt(year),
        months: monthList,
      },
    });
  });
});

app.get("/api/OtherTaxesTotalESREBox", (req, res) => {
  const { year, months } = req.query;

  // Validate input parameters
  if (!year || isNaN(year)) {
    return res.status(400).json({
      error: "Invalid year parameter",
      code: "INVALID_YEAR",
    });
  }

  const monthList = months
    ? months
        .split(",")
        .map(Number)
        .filter((m) => m >= 1 && m <= 12)
    : [];

  let sql = `
    SELECT 
      COALESCE(SUM(
        COALESCE(BASICTAXDUE, 0) + COALESCE(BUSTAXDUE, 0) +
        COALESCE(SALTAXDUE, 0) + COALESCE(RPTAXDUE, 0) +
        COALESCE(INTEREST, 0)
      ), 0) AS total 
    FROM cedula
    WHERE YEAR(DATEISSUED) = ?
  `;

  const params = [year];

  if (monthList.length > 0) {
    const placeholders = monthList.map(() => "?").join(",");
    sql += ` AND MONTH(DATEISSUED) IN (${placeholders})`;
    params.push(...monthList);
  }

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({
        error: "Database operation failed",
        code: "DB_ERROR",
      });
    }

    const total = Number(results[0]?.total || 0);

    res.json({
      total,
      currency: "USD",
      meta: {
        year: parseInt(year),
        months: monthList,
      },
    });
  });
});

app.get("/api/ReceiptsFromEconomicEntBreakdown", (req, res) => {
  const { months, year } = req.query;
  const monthList = months ? months.split(",").map(Number) : null;

  let sql = `
    SELECT
      Slaughter_House_Fee,
      Stall_Fees,
      Cash_Tickets,
      Water_Fees,
      Rental_of_Equipment
    FROM general_fund_data
    WHERE 1=1`;

  if (year) {
    sql += ` AND YEAR(date) = ${year}`;
  }

  if (monthList?.length) {
    sql += ` AND MONTH(date) IN (${monthList.join(",")})`;
  }

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error" });
    }

    const summedData = results.reduce((acc, row) => {
      Object.keys(row).forEach((key) => {
        acc[key] = (acc[key] || 0) + (row[key] || 0);
      });
      return acc;
    }, {});

    const categorizedData = {
      "Slaughterhouse Operations": summedData.Slaughter_House_Fee || 0,
      "Market Operations":
        (summedData.Stall_Fees || 0) + (summedData.Cash_Tickets || 0),
      "Water Work System Operations": summedData.Water_Fees || 0,
      "Lease/Rental Facilities": summedData.Rental_of_Equipment || 0,
    };

    res.json(categorizedData);
  });
});

app.get("/api/OtherTaxesBreakdown", (req, res) => {
  const { months, year } = req.query;
  const monthList = months ? months.split(",").map(Number) : null;

  let sql = `
    SELECT
      COALESCE(SUM(
        COALESCE(BASICTAXDUE, 0) +
        COALESCE(BUSTAXDUE, 0) +
        COALESCE(SALTAXDUE, 0) +
        COALESCE(RPTAXDUE, 0) +
        COALESCE(INTEREST, 0)
      ), 0) AS TOTALPAID
    FROM cedula
    WHERE 1 = 1
  `;

  if (year) {
    sql += ` AND YEAR(DATEISSUED) = ${db.escape(year)}`;
  }

  if (monthList?.length) {
    sql += ` AND MONTH(DATEISSUED) IN (${monthList.map((m) => db.escape(m)).join(",")})`;
  }

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error" });
    }

    const summedData = results.reduce((acc, row) => {
      for (const key in row) {
        acc[key] = (acc[key] || 0) + (row[key] || 0);
      }
      return acc;
    }, {});

    res.json(summedData);
  });
});

app.get("/api/RealPropertyTaxSharingTotalBox", (req, res) => {
  const { year, months } = req.query;

  // Validate input parameters
  if (!year || isNaN(year)) {
    return res.status(400).json({
      error: "Invalid year parameter",
      code: "INVALID_YEAR",
    });
  }

  const monthList = months
    ? months
        .split(",")
        .map(Number)
        .filter((m) => m >= 1 && m <= 12)
    : [];

  let sql = `
    SELECT 
      COALESCE(SUM(
        IFNULL(current_year, 0) - IFNULL(current_discounts, 0) +
        IFNULL(prev_year, 0) + IFNULL(prior_years, 0) +
        IFNULL(current_penalties, 0) + IFNULL(prev_penalties, 0) + IFNULL(prior_penalties, 0)
      ), 0) AS total
    FROM real_property_tax_data
    WHERE (status LIKE 'LAND%' OR status IN ('MACHINERY', 'BLDG-RES', 'BLDG-COMML', 'BLDG-INDUS'))
      AND YEAR(date) = ?
  `;

  const params = [year];

  if (monthList.length > 0) {
    sql += ` AND MONTH(date) IN (${Array(monthList.length).fill("?").join(",")})`;
    params.push(...monthList);
  }

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({
        error: "Database operation failed",
        code: "DB_ERROR",
      });
    }

    const total = Number(results[0]?.total) || 0;

    res.json({
      total: total,
      currency: "USD",
      meta: {
        year: Number(year),
        months: monthList,
      },
    });
  });
});

app.get("/api/RealPropertyTaxSharingSEFTotalBox", (req, res) => {
  const { year, months } = req.query;

  // Validate input parameters
  if (!year || isNaN(year)) {
    return res.status(400).json({
      error: "Invalid year parameter",
      code: "INVALID_YEAR",
    });
  }

  const monthList = months
    ? months
        .split(",")
        .map(Number)
        .filter((m) => m >= 1 && m <= 12)
    : [];

  let sql = `
    SELECT 
      COALESCE(SUM(
        IFNULL(additional_current_year, 0) - IFNULL(additional_discounts, 0) +
        IFNULL(additional_prev_year, 0) + IFNULL(additional_prior_years, 0) +
        IFNULL(additional_penalties, 0) + IFNULL(additional_prev_penalties, 0) + IFNULL(additional_prior_penalties, 0)
      ), 0) AS total
    FROM real_property_tax_data
    WHERE (status LIKE 'LAND%' OR status IN ('MACHINERY', 'BLDG-RES', 'BLDG-COMML', 'BLDG-INDUS'))
      AND YEAR(date) = ?
  `;

  const params = [year];

  if (monthList.length > 0) {
    sql += ` AND MONTH(date) IN (${Array(monthList.length).fill("?").join(",")})`;
    params.push(...monthList);
  }

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({
        error: "Database operation failed",
        code: "DB_ERROR",
      });
    }

    const total = Number(results[0]?.total) || 0;

    res.json({
      total: total,
      currency: "USD",
      meta: {
        year: Number(year),
        months: monthList,
      },
    });
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
