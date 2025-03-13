const express = require('express');
const mysql = require('mysql');  // Use the callback-based API
const mysql2 = require('mysql2/promise');  // Use the callback-based API
const bodyParser = require('body-parser');
const cors = require('cors');
const { parse } = require('json2csv');
const path = require("path");
const app = express();
const port = 3001;
const axios = require('axios');
const fs = require("fs");

app.use(cors());
app.use(bodyParser.json());
app.use(express.json()); // Support JSON payloads



// Create connection to MySQL database
const dbConfig = {
  host: '192.168.101.108',
  user: 'treasurer_root2',
  password: '$p4ssworD!',
  database: 'treasurer_management_app',
  port: 3307
};

// const dbConfig = {
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'treasurer_management_app',
//   port: 3307
// };



const dbConfigs = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'psic_code'
};

const BASE_DIR = path.join(
  "C:", "xampp", "htdocs", "TreasurerManagementSoftware",
  "my-app", "src", "template", "layout", "reports", "FullReport", "components"
);


// Create a connection pool (more efficient for multiple queries)
const db = mysql.createPool(dbConfig);
const db2 = mysql.createPool(dbConfigs);
const pool = mysql2.createPool(dbConfig);

// Define an endpoint to handle form submissions
app.post('/api/save', (req, res) => {
  const { receipt_no, status } = req.body;

  // Check for duplicate
  const checkSql = 'SELECT * FROM real_property_tax_data WHERE receipt_no = ? AND status = ?';
  db.query(checkSql, [receipt_no, status], (err, results) => {
    if (err) {
      console.error('Error checking for duplicates:', err);
      return res.status(500).send('Error checking for duplicates');
    }

    if (results.length > 0) {
      return res.status(400).send('Duplicate entry: receipt_no and status already exist');
    }

    // Insert new record if no duplicate found
    const sql = 'INSERT INTO real_property_tax_data SET ?';
    db.query(sql, req.body, (err, result) => {
      if (err) {
        console.error('Error saving data:', err);
        return res.status(500).send('Error saving data');
      }
      res.send('Data saved successfully');
    });
  });
});

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
app.get('/api/allData', (req, res) => {
  const sql = 'SELECT * FROM real_property_tax_data';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      res.status(500).send('Error fetching data');
    } else {
      res.json(results);
    }
  });
});

// Update comment for a specific receipt_no
app.post('/api/updateComment', (req, res) => {
  const { receipt_no, comment } = req.body; // Use receipt_no
  const query = 'UPDATE real_property_tax_data SET comments = ? WHERE receipt_no = ?';

  db.query(query, [comment, receipt_no], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error updating comment');
    } else {
      res.status(200).send('Comment updated successfully');
    }
  });
});

// Update comment for all under date
app.post('/api/allDayComment', (req, res) => {
  const { description, user } = req.body;

  // Get the current date and time
  const date = new Date();
  const formattedDate = date.toISOString().slice(0, 10); // YYYY-MM-DD
  const formattedTime = date.toTimeString().slice(0, 8); // HH:mm:ss

  const query = 'INSERT INTO rpt_comments (date, description, time, user) VALUES (?, ?, ?, ?)';
  db.query(query, [formattedDate, description, formattedTime, user], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error saving comment');
    } else {
      res.status(200).send('Comment saved successfully');
    }
  });
});

// API to insert a comment into the `rpt_comments` table
app.post('/api/insertComment', (req, res) => {
  const { date, description, time, user } = req.body; // Extract the data from the request body
  const query = 'INSERT INTO rpt_comments (date, description, time, user) VALUES (?, ?, ?, ?)';

  db.query(query, [date, description, time, user], (err, result) => {
    if (err) {
      console.error('Error inserting comment:', err);
      res.status(500).send('Error inserting comment');
    } else {
      res.status(200).send('Comment inserted successfully');
    }
  });
});

app.get('/api/commentCounts', (req, res) => {
  const query = 'SELECT date, COUNT(*) as count FROM rpt_comments GROUP BY date';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching comment counts:', err);
      res.status(500).send('Error fetching comment counts');
    } else {
      const counts = {};
      results.forEach((row) => {
        counts[row.date] = row.count;
      });
      res.json(counts);
    }
  });
});

app.get('/api/getComments/:date', (req, res) => {
  const { date } = req.params;

  const query = 'SELECT * FROM rpt_comments WHERE date = ?';
  db.query(query, [date], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error fetching comments');
    } else {
      res.status(200).json(results);
    }
  });
});

app.get('/api/getAllComments', (req, res) => {
  const query = 'SELECT * FROM rpt_comments ORDER BY date DESC, time DESC';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching comments:', err);
      res.status(500).send('Error fetching comments');
    } else {
      res.status(200).json(results);
    }
  });
});

// Fetch comment count for a specific date
app.get('/api/getCommentCount/:date', (req, res) => {
  const { date } = req.params;
  const query = 'SELECT COUNT(*) AS count FROM rpt_comments WHERE date = ?';

  db.query(query, [date], (err, results) => {
    if (err) {
      console.error('Error fetching comment count:', err);
      res.status(500).send('Error fetching comment count');
    } else {
      res.json({ count: results[0].count });
    }
  });
});

// Fetch comments for a specific date
app.get('/api/getComments/:date', (req, res) => {
  const { date } = req.params;
  const query = 'SELECT * FROM rpt_comments WHERE date = ? ORDER BY time DESC';

  db.query(query, [date], (err, results) => {
    if (err) {
      console.error('Error fetching comments:', err);
      res.status(500).send('Error fetching comments');
    } else {
      res.json(results);
    }
  });
});


// Save endpoint
app.post('/api/save', (req, res) => {
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
      console.error('Error inserting data:', err);
      return res.status(500).send({ error: err.sqlMessage || 'Error inserting data' });
    }
    res.status(201).send({ message: 'Record inserted successfully', id: result.insertId });
  });
});


app.put('/api/update/:id', async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  // Validate ID and data
  if (!id || isNaN(Number(id))) {
    return res.status(400).send({ message: 'Invalid ID' });
  }

  const sql = `
    UPDATE real_property_tax_data
    SET
      date = ?,
      name = ?,
      receipt_no = ?,
      current_year = ?,
      current_penalties = ?,
      current_discounts = ?,
      prev_year = ?,
      prev_penalties = ?,
      prior_years = ?,
      prior_penalties = ?,
      total = ?,
      barangay = ?,
      share = ?,
      additional_current_year = ?,
      additional_penalties = ?,
      additional_discounts = ?,
      additional_prev_year = ?,
      additional_prev_penalties = ?,
      additional_prior_years = ?,
      additional_prior_penalties = ?,
      additional_total = ?,
      gf_total = ?,
      status = ?,
      cashier = ?,
      comments = ?
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
    id, // Ensure update applies only to the specific record
  ];

  try {
    db.query(sql, values, (err, result) => {
      if (err) {
        console.error('Error updating data:', err);
        return res.status(500).send({ message: 'Error updating data' });
      }

      // Check if the record was updated
      if (result.affectedRows === 0) {
        return res.status(404).send({ message: 'Record not found' });
      }

      res.status(200).send({ message: 'Record updated successfully' });
    });
  } catch (err) {
    console.error('Unexpected server error:', err);
    res.status(500).send({ message: 'Unexpected server error' });
  }
});


// Define the endpoint for downloading data
app.get('/api/downloadData', (req, res) => {
  const { month, day, year } = req.query;
  
  
  let sql = 'SELECT * FROM real_property_tax_data WHERE 1=1';
  sql = addDateFilters(sql, month, day, year);

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      res.status(500).send('Error fetching data');
    } else {
      if (results.length === 0) {
        res.status(404).send('No data found for the specified filters');
        return;
      }

      console.log('Fetched results:', results);
      
      const fields = Object.keys(results[0]);
      const csv = parse(results, { fields });
      res.setHeader('Content-disposition', 'attachment; filename=data.csv');
      res.set('Content-Type', 'text/csv');
      res.status(200).send(csv);
    }
  });
});


// Define an endpoint to fetch only gf_sef_total from the database
app.get('/api/TotalFund', (req, res) => {
  const { month, day, year } = req.query;
  let sql = 'SELECT gf_total FROM real_property_tax_data WHERE 1=1';
  sql = addDateFilters(sql, month, day, year);

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      res.status(500).send('Error fetching data');
    } else {
      res.json(results);
    }
  });
});

// Define an endpoint to fetch only General Fund total from the database
app.get('/api/TotalGeneralFund', (req, res) => {
  const { month, day, year } = req.query;
  let sql = 'SELECT total FROM real_property_tax_data WHERE 1=1';
  sql = addDateFilters(sql, month, day, year);

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      res.status(500).send('Error fetching data');
    } else {
      res.json(results);
    }
  });
});

// Define an endpoint to fetch only SEF Fund total from the database
app.get('/api/TotalSEFFund', (req, res) => {
  const { month, day, year } = req.query;
  let sql = 'SELECT additional_total FROM real_property_tax_data WHERE 1=1';
  sql = addDateFilters(sql, month, day, year);

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      res.status(500).send('Error fetching data');
    } else {
      res.json(results);
    }
  });
});

// Define an endpoint to fetch only 25% Share Fund total from the database
app.get('/api/TotalShareFund', (req, res) => {
  const { month, day, year } = req.query;
  let sql = 'SELECT share FROM real_property_tax_data WHERE 1=1';
  sql = addDateFilters(sql, month, day, year);

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      res.status(500).send('Error fetching data');
    } else {
      res.json(results);
    }
  });
});

app.get('/api/landData', (req, res) => {
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
      console.error('Error fetching land data:', err);
      res.status(500).send('Error fetching land data');
    } else {
      const totals = results.reduce((acc, row) => {
        acc.current += row.current;
        acc.discount += row.discount;
        acc.prior += row.prior;
        acc.penaltiesCurrent += row.penaltiesCurrent;
        acc.penaltiesPrior += row.penaltiesPrior;
        return acc;
      }, {
        category: 'TOTAL',
        current: 0,
        discount: 0,
        prior: 0,
        penaltiesCurrent: 0,
        penaltiesPrior: 0
      });

      // Calculate the total based on the formula
      const totalSum = totals.current - totals.discount + totals.prior + totals.penaltiesCurrent + totals.penaltiesPrior;

      console.log('Total Sum:', totalSum);

      res.json([...results, totals]);
    }
  });
});

app.get('/api/bldgData', (req, res) => {
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
      console.error('Error fetching building data:', err);
      res.status(500).send('Error fetching building data');
    } else {
      const totals = results.reduce((acc, row) => {
        acc.current += row.current;
        acc.discount += row.discount;
        acc.prior += row.prior;
        acc.penaltiesCurrent += row.penaltiesCurrent;
        acc.penaltiesPrior += row.penaltiesPrior;
        return acc;
      }, {
        category: 'TOTAL',
        current: 0,
        discount: 0,
        prior: 0,
        penaltiesCurrent: 0,
        penaltiesPrior: 0
      });

      const totalSum = totals.current - totals.discount + totals.prior + totals.penaltiesCurrent + totals.penaltiesPrior;

      console.log('Backend Building Total Sum:', totalSum);  // Log the totalSum to verify
      res.json([...results, { ...totals, totalSum }]);
    }
  });
});

app.get('/api/seflandData', (req, res) => {
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
      console.error('Error fetching land data:', err);
      res.status(500).send('Error fetching land data');
    } else {
      const totals = results.reduce((acc, row) => {
        acc.current += row.current;
        acc.discount += row.discount;
        acc.prior += row.prior;
        acc.penaltiesCurrent += row.penaltiesCurrent;
        acc.penaltiesPrior += row.penaltiesPrior;
        return acc;
      }, {
        category: 'TOTAL',
        current: 0,
        discount: 0,
        prior: 0,
        penaltiesCurrent: 0,
        penaltiesPrior: 0
      });

      // Calculate the total based on the formula
      const totalSum = totals.current - totals.discount + totals.prior + totals.penaltiesCurrent + totals.penaltiesPrior;

      console.log('Total Sum:', totalSum);

      res.json([...results, totals]);
    }
  });
});

app.get('/api/sefbldgData', (req, res) => {
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
      console.error('Error fetching building data:', err);
      res.status(500).send('Error fetching building data');
    } else {
      const totals = results.reduce((acc, row) => {
        acc.current += row.current;
        acc.discount += row.discount;
        acc.prior += row.prior;
        acc.penaltiesCurrent += row.penaltiesCurrent;
        acc.penaltiesPrior += row.penaltiesPrior;
        return acc;
      }, {
        category: 'TOTAL',
        current: 0,
        discount: 0,
        prior: 0,
        penaltiesCurrent: 0,
        penaltiesPrior: 0
      });

      const totalSum = totals.current - totals.discount + totals.prior + totals.penaltiesCurrent + totals.penaltiesPrior;

      console.log('Backend Building Total Sum:', totalSum);  // Log the totalSum to verify
      res.json([...results, { ...totals, totalSum }]);
    }
  });
});

app.get('/api/LandSharingData', (req, res) => {
  const { month, day, year } = req.query;

  // Construct the base WHERE clause
  let whereClause = `WHERE status LIKE 'LAND%'`;
  whereClause = addDateFilters(whereClause, month, day, year);

  // Build the SQL query without using CTEs
  let sql = `
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
      console.error('Error fetching land sharing data:', err);
      res.status(500).send('Error fetching land sharing data');
    } else {
      res.json(results);
    }
  });
});



app.get('/api/buildingSharingData', (req, res) => {
  const { month, day, year } = req.query;

  // Construct the base WHERE clause
  let whereClause = `WHERE status IN ('MACHINERY', 'BLDG-RES', 'BLDG-COMML', 'BLDG-INDUS')`;
  whereClause = addDateFilters(whereClause, month, day, year);

  // Build the SQL query without using CTEs
  let sql = `
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

  // Execute the query
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching building sharing data:', err);
      res.status(500).send('Error fetching building sharing data');
    } else {
      res.json(results);
    }
  });
});

app.get('/api/grandTotalSharing', (req, res) => {
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
      console.error('Error fetching grand total sharing data:', err);
      res.status(500).send('Error fetching grand total sharing data');
    } else {
      res.json(results);
    }
  });
});

app.get('/api/sefLandSharingData', (req, res) => {
  const { month, day, year } = req.query;

  // Build the SQL query
  let sql = `
    WITH LandData AS (
      SELECT
        'Current' AS category,
        SUM(IFNULL(additional_current_year, 0) - IFNULL(additional_discounts, 0)) AS amount
      FROM real_property_tax_data
      WHERE status LIKE 'LAND-%'
      ${addDateFilters('', month, day, year)}

      UNION ALL

      SELECT
        'Prior' AS category,
        SUM(IFNULL(additional_prev_year, 0) + IFNULL(additional_prior_years, 0)) AS amount
      FROM real_property_tax_data
      WHERE status LIKE 'LAND-%'
      ${addDateFilters('', month, day, year)}

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
      ${addDateFilters('', month, day, year)}
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
      console.error('Error fetching SEF land sharing data:', err);
      res.status(500).send('Error fetching SEF land sharing data');
    } else {
      res.json(results);
    }
  });
});

app.get('/api/landData', (req, res) => {
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
      console.error('Error fetching land data:', err);
      res.status(500).send('Error fetching land data');
    } else {
      const totals = results.reduce((acc, row) => {
        acc.current += row.current;
        acc.discount += row.discount;
        acc.prior += row.prior;
        acc.penaltiesCurrent += row.penaltiesCurrent;
        acc.penaltiesPrior += row.penaltiesPrior;
        return acc;
      }, {
        category: 'TOTAL',
        current: 0,
        discount: 0,
        prior: 0,
        penaltiesCurrent: 0,
        penaltiesPrior: 0
      });

      // Calculate the total based on the formula
      const totalSum = totals.current - totals.discount + totals.prior + totals.penaltiesCurrent + totals.penaltiesPrior;

      console.log('Total Sum:', totalSum);

      res.json([...results, totals]);
    }
  });
});


app.get('/api/sefBuildingSharingData', (req, res) => {
  const { month, day, year } = req.query;

  // Construct the base WHERE clause
  let whereClause = `WHERE status IN ('MACHINERY', 'BLDG-RES', 'BLDG-COMML', 'BLDG-INDUS')`;
  whereClause = addDateFilters(whereClause, month, day, year);

  // Build the SQL query
  let sql = `
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

  // Execute the query
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching SEF building sharing data:', err);
      res.status(500).send('Error fetching SEF building sharing data');
    } else {
      res.json(results);
    }
  });
});


app.get('/api/sefGrandTotalSharing', (req, res) => {
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
      console.error('Error fetching SEF grand total sharing data:', err);
      res.status(500).send('Error fetching SEF grand total sharing data');
    } else {
      res.json(results);
    }
  });
});

app.get('/api/overallTotalBasicAndSEF', (req, res) => {
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
      ${addDateFilters('', month, day, year)}
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
      ${addDateFilters('', month, day, year)}
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
      ${addDateFilters('', month, day, year)}
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
      ${addDateFilters('', month, day, year)}
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
      console.error('Error fetching overall total for Basic and SEF data:', err);
      res.status(500).send('Error fetching overall total for Basic and SEF data');
    } else {
      res.json(results);
    }
  });
});

app.get('/api/overallTotalBasicAndSEFSharing', (req, res) => {
  const { month, day, year } = req.query;

  // Build the SQL query
  let sql = `
    WITH LandData AS (
      SELECT
        SUM(IFNULL(current_year, 0) - IFNULL(current_discounts, 0) + IFNULL(prev_year, 0) + IFNULL(prior_years, 0) + IFNULL(current_penalties, 0) + IFNULL(prev_penalties, 0) + IFNULL(prior_penalties, 0)) AS total_amount
      FROM real_property_tax_data
      WHERE status LIKE 'LAND%'
      ${addDateFilters('', month, day, year)}
    ),
    BuildingData AS (
      SELECT
        SUM(IFNULL(current_year, 0) - IFNULL(current_discounts, 0) + IFNULL(prev_year, 0) + IFNULL(prior_years, 0) + IFNULL(current_penalties, 0) + IFNULL(prev_penalties, 0) + IFNULL(prior_penalties, 0)) AS total_amount
      FROM real_property_tax_data
      WHERE status IN ('MACHINERY', 'BLDG-RES', 'BLDG-COMML', 'BLDG-INDUS')
      ${addDateFilters('', month, day, year)}
    ),
    SEFLandData AS (
      SELECT
        SUM(IFNULL(additional_current_year, 0) - IFNULL(additional_discounts, 0) + IFNULL(additional_prev_year, 0) + IFNULL(additional_prior_years, 0) + IFNULL(additional_penalties, 0) + IFNULL(additional_prev_penalties, 0) + IFNULL(additional_prior_penalties, 0)) AS total_amount
      FROM real_property_tax_data
      WHERE status LIKE 'LAND%'
      ${addDateFilters('', month, day, year)}
    ),
    SEFBuildingData AS (
      SELECT
        SUM(IFNULL(additional_current_year, 0) - IFNULL(additional_discounts, 0) + IFNULL(additional_prev_year, 0) + IFNULL(additional_prior_years, 0) + IFNULL(additional_penalties, 0) + IFNULL(additional_prev_penalties, 0) + IFNULL(additional_prior_penalties, 0)) AS total_amount
      FROM real_property_tax_data
      WHERE status IN ('MACHINERY', 'BLDG-RES', 'BLDG-COMML', 'BLDG-INDUS')
      ${addDateFilters('', month, day, year)}
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
      console.error('Error fetching overall total for Basic and SEF Sharing data:', err);
      res.status(500).send('Error fetching overall total for Basic and SEF Sharing data');
    } else {
      res.json(results);
    }
  });
});


// Fetch data based on date filtering
app.get('/api/filteredData', (req, res) => {
  const { month, day, year } = req.query;
  
  let query = `
    SELECT * FROM your_table_name
    WHERE YEAR(date) = ? AND MONTH(date) = ?
  `;

  const params = [year, month];
  
  if (day) {
    query += ` AND DAY(date) = ?`;
    params.push(day);
  }

  db.query(query, params, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Download filtered data as CSV
app.get('/api/downloadData', (req, res) => {
  const { month, day, year } = req.query;
  const sqlQuery = `SELECT * FROM real_property_tax_data WHERE 
                    MONTH(date_column) = ? AND 
                    DAY(date_column) = ? AND 
                    YEAR(date_column) = ?`;
  db.query(sqlQuery, [month, day, year], (err, results) => {
    if (err) {
      console.error('Error querying the database:', err);
      res.status(500).send('Error querying the database');
    } else if (results.length === 0) {
      res.status(404).send('No data found for the specified filters');
    } else {
      const csv = parse(results);
      res.attachment('data.csv').send(csv);
    }
  });
});


app.get('/api/generalFundDataAll', (req, res) => {
  const query = 'SELECT * FROM general_fund_data';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      res.status(500).send({ error: 'Database query failed' });
    } else {
      res.json(results);
    }
  });
});

app.get('/api/generalFundDataReport', (req, res) => {
  const { month, year } = req.query;

  // Validate month and year
  if (!month || !year) {
    return res.status(400).send({ error: 'Month and year are required' });
  }

  const query = `
    SELECT * FROM general_fund_data
    WHERE MONTH(date) = ? AND YEAR(date) = ?
  `;

  db.query(query, [month, year], (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      res.status(500).send({ error: 'Database query failed' });
    } else {
      console.log('Filtered Results:', results); // Debug log
      res.json(results);
    }
  });
});

app.get('/api/cedulaSummaryCollectionDataReport', (req, res) => {
  const { month, year } = req.query;

  // Validate month and year
  if (!month || !year) {
    return res.status(400).send({ error: 'Month and year are required' });
  }

  // Ensure month and year are numbers
  const monthInt = parseInt(month, 10);
  const yearInt = parseInt(year, 10);

  if (isNaN(monthInt) || isNaN(yearInt)) {
    return res.status(400).send({ error: 'Invalid month or year' });
  }

  // Calculate start and end date for better performance
  const startDate = `${yearInt}-${monthInt.toString().padStart(2, '0')}-01`;
  const endDate = `${yearInt}-${monthInt.toString().padStart(2, '0')}-31`;

  // Optimized query using date range (Better performance with indexes)
  const query = `
    SELECT Totalamountpaid FROM cedula
    WHERE DATEISSUED BETWEEN ? AND ?
  `;

  db.query(query, [startDate, endDate], (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      return res.status(500).send({ error: 'Database query failed' });
    }

    console.log('Filtered Results:', results);
    res.json(results);
  });
});

// POST endpoint to save General Fund data
app.post('/api/saveGeneralFundData', (req, res) => {
  const {
    date, name, receipt_no, Manufacturing, Distributor, Retailing, Financial, Other_Business_Tax,
    Sand_Gravel, Fines_Penalties, Mayors_Permit, Weighs_Measure, Tricycle_Operators, Occupation_Tax,
    Cert_of_Ownership, Cert_of_Transfer, Cockpit_Prov_Share, Cockpit_Local_Share, Docking_Mooring_Fee,
    Sultadas, Miscellaneous_Fee, Reg_of_Birth, Marriage_Fees, Burial_Fees, Correction_of_Entry,
    Fishing_Permit_Fee, Sale_of_Agri_Prod, Sale_of_Acct_Form, Water_Fees, Stall_Fees, Cash_Tickets,
    Slaughter_House_Fee, Rental_of_Equipment, Doc_Stamp, Police_Report_Clearance, Secretaries_Fee,
    Med_Dent_Lab_Fees, Garbage_Fees, Cutting_Tree, total, cashier, type_receipt
  } = req.body;

  // 1. First check if this receipt_no already exists
  const checkSql = 'SELECT COUNT(*) AS count FROM general_fund_data WHERE receipt_no = ?';
  db.query(checkSql, [receipt_no], (checkErr, checkResults) => {
    if (checkErr) {
      console.error('Error checking duplicate receipt_no:', checkErr);
      return res.status(500).json({ message: 'Server error checking receipt_no' });
    }

    const { count } = checkResults[0];
    if (count > 0) {
      // 2. If exists, return a 400 with error message
      return res.status(400).json({ message: 'Receipt number already exists' });
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
      date, name, receipt_no, Manufacturing, Distributor, Retailing, Financial, Other_Business_Tax,
      Sand_Gravel, Fines_Penalties, Mayors_Permit, Weighs_Measure, Tricycle_Operators, Occupation_Tax,
      Cert_of_Ownership, Cert_of_Transfer, Cockpit_Prov_Share, Cockpit_Local_Share, Docking_Mooring_Fee,
      Sultadas, Miscellaneous_Fee, Reg_of_Birth, Marriage_Fees, Burial_Fees, Correction_of_Entry,
      Fishing_Permit_Fee, Sale_of_Agri_Prod, Sale_of_Acct_Form, Water_Fees, Stall_Fees, Cash_Tickets,
      Slaughter_House_Fee, Rental_of_Equipment, Doc_Stamp, Police_Report_Clearance, Secretaries_Fee,
      Med_Dent_Lab_Fees, Garbage_Fees, Cutting_Tree, total, cashier, type_receipt
    ];

    db.query(query, values, (err, results) => {
      if (err) {
        console.error('Failed to insert data:', err);
        return res.status(500).json({ message: 'Failed to save data' });
      }
      res.status(200).json({ message: 'Data saved successfully' });
    });
  });
});


app.get('/api/TotalGeneralFundS', (req, res) => {
  const { month, day, year } = req.query;
  let sql = 'SELECT SUM(`total`) AS overall_total FROM general_fund_data;';
  sql = addDateFilters(sql, month, day, year);
  console.log('SQL Query:', sql); // Debug: Log the SQL query

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      res.status(500).send('Error fetching data');
    } else {
      console.log('Query Results:', results); // Debug: Log the query results
      res.json(results);
    }
  });
});


// Define an endpoint to get Tax on Business totals
app.get('/api/TaxOnBusinessTotal', (req, res) => {
  const { month, day, year } = req.query;

  let sql = `
    SELECT
      SUM(Manufacturing + Distributor + Retailing + Financial + Other_Business_Tax + Sand_Gravel + Fines_Penalties) AS Tax_On_Business
    FROM general_fund_data
    WHERE 1=1`;

  sql = addDateFilters(sql, month, day, year);

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      res.status(500).send('Error fetching data');
      return;
    }
    res.json({ tax_on_business: results[0].Tax_On_Business || 0 });
  });
});

// Define an endpoint to get Regulatory Fees totals
app.get('/api/RegulatoryFeesTotal', (req, res) => {
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
      console.error('Error fetching data:', err);
      res.status(500).send('Error fetching data');
      return;
    }
    res.json({ regulatory_fees: results[0].Regulatory_Fees || 0 });
  });
});

// Define an endpoint to get Service/User Charges totals
app.get('/api/ServiceUserChargesTotal', (req, res) => {
  const { month, day, year } = req.query;

  let sql = `
    SELECT
      SUM(Police_Report_Clearance+Secretaries_Fee+Med_Dent_Lab_Fees+Garbage_Fees+Cutting_Tree+Doc_Stamp) AS Service_User_Charges
    FROM general_fund_data
    WHERE 1=1`;

  sql = addDateFilters(sql, month, day, year);

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      res.status(500).send('Error fetching data');
      return;
    }
    res.json({ service_user_charges: results[0].Service_User_Charges || 0 });
  });
});

// Define an endpoint to get Receipts from Economic Enterprises totals
app.get('/api/ReceiptsFromEconomicEnterprisesTotal', (req, res) => {
  const { month, day, year } = req.query;

  let sql = `
    SELECT
      SUM(Slaughter_House_Fee + Stall_Fees + Water_Fees + Rental_of_Equipment) AS Receipts_From_Economic_Enterprises
    FROM general_fund_data
    WHERE 1=1`;

  sql = addDateFilters(sql, month, day, year);

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      res.status(500).send('Error fetching data');
      return;
    }
    res.json({ receipts_from_economic_enterprises: results[0].Receipts_From_Economic_Enterprises || 0 });
  });
});

app.post('/api/save-trust-fund', (req, res) => {
  const data = req.body;
  
  // 1. Check if RECEIPT_NO already exists
  const checkSql = 'SELECT COUNT(*) AS count FROM trust_fund_data WHERE RECEIPT_NO = ?';
  db.query(checkSql, [data.RECEIPT_NO], (err, results) => {
    if (err) {
      console.error('Error checking receipt number:', err);
      return res.status(500).send('Error checking receipt number');
    }

    const { count } = results[0];
    if (count > 0) {
      // 2. If there is a record already, return an error response
      return res.status(400).send('Receipt number already exists');
    }

    // 3. Otherwise, proceed to insert the record
    const sql = 'INSERT INTO trust_fund_data SET ?';
    db.query(sql, data, (err, result) => {
      if (err) {
        console.error('Error saving data:', err);
        return res.status(500).send('Error saving data');
      }
      res.send('Data saved successfully');
    });
  });
});

app.post('/api/update-trust-fund/:id', (req, res) => {
  const { id } = req.params; // Extract ID from request parameters
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
    LIVESTOCK_DEV_FUND,
    LOCAL_80_PERCENT_LIVESTOCK,
    NATIONAL_20_PERCENT,
    DIVING_FEE,
    LOCAL_40_PERCENT_DIVE_FEE,
    FISHERS_30_PERCENT,
    BRGY_30_PERCENT,
    ELECTRICAL_FEE,
    ZONING_FEE,
  } = req.body;

  const query = `
    UPDATE trust_fund_data
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
      LIVESTOCK_DEV_FUND = ?,
      LOCAL_80_PERCENT_LIVESTOCK = ?,
      NATIONAL_20_PERCENT = ?,
      DIVING_FEE = ?,
      LOCAL_40_PERCENT_DIVE_FEE = ?,
      FISHERS_30_PERCENT = ?,
      BRGY_30_PERCENT = ?,
      ELECTRICAL_FEE = ?,
      ZONING_FEE = ?
    WHERE ID = ?
  `;

  db.query(
    query,
    [
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
      LIVESTOCK_DEV_FUND,
      LOCAL_80_PERCENT_LIVESTOCK,
      NATIONAL_20_PERCENT,
      DIVING_FEE,
      LOCAL_40_PERCENT_DIVE_FEE,
      FISHERS_30_PERCENT,
      BRGY_30_PERCENT,
      ELECTRICAL_FEE,
      ZONING_FEE,
      id,
    ],
    (err, result) => {
      if (err) {
        console.error('Error updating trust fund:', err);
        return res.status(500).json({ message: 'Failed to update trust fund.', error: err });
      }
      res.status(200).json({ message: 'Trust fund updated successfully.' });
    }
  );
});



app.put('/api/updateTrustFund/:id', async (req, res) => {
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

    res.status(200).send({ message: 'Record updated successfully!' });
  } catch (error) {
    console.error('Error updating record:', error);
    res.status(500).send('Error updating record');
  }
});

app.get('/api/table-trust-fund-all', (req, res) => {
  const sql = 'SELECT * FROM `trust_fund_data`';
  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error fetching data:', err);
      res.status(500).send('Error fetching data');
    } else {
      res.json(result); // Send the fetched data as JSON
    }
  });
});


app.get('/api/trust-fund-total', (req, res) => {
    const sql = 'SELECT SUM(`TOTAL`) AS overall_total FROM `trust_fund_data`;';
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error fetching data:', err);
            res.status(500).send('Error fetching data');
        } else {
            res.json(result);
        }
    });
});


app.get('/api/general-fund-tax-on-business-report', (req, res) => {
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
            SELECT 'Manufacturing' AS Taxes, SUM(Manufacturing) AS Total FROM general_fund_data WHERE ${filters.join(' AND ')}
            UNION ALL
            SELECT 'Distributor', SUM(Distributor) FROM general_fund_data WHERE ${filters.join(' AND ')}
            UNION ALL
            SELECT 'Retailing', SUM(Retailing) FROM general_fund_data WHERE ${filters.join(' AND ')}
            UNION ALL
            SELECT 'Financial', SUM(Financial) FROM general_fund_data WHERE ${filters.join(' AND ')}
            UNION ALL
            SELECT 'Other Business Tax', SUM(Other_Business_Tax) FROM general_fund_data WHERE ${filters.join(' AND ')}
            UNION ALL
            SELECT 'Fines Penalties', SUM(Fines_Penalties) FROM general_fund_data WHERE ${filters.join(' AND ')}
            UNION ALL
            SELECT 'Sand Gravel', SUM(Sand_Gravel) FROM general_fund_data WHERE ${filters.join(' AND ')}
            UNION ALL
            SELECT 'Overall Total', SUM(Manufacturing+Distributor+Retailing+Financial+Other_Business_Tax+Fines_Penalties+Sand_Gravel) FROM general_fund_data WHERE ${filters.join(' AND ')}
        `;
    }

     db.query(sql, (err, result) => {
        if (err) {
            console.error('Error fetching data:', err);
            res.status(500).send('Error fetching data');
        } else {
            res.json(result);
        }
    });
});


    app.get('/api/general-fund-regulatory-fees-report', (req, res) => {
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
            SELECT 'Mayors Permit' AS Taxes, SUM(Mayors_Permit) AS Total FROM general_fund_data WHERE ${filters.join(' AND ')}
        UNION ALL
        SELECT 'Weighs and Measure', SUM(Weighs_Measure) FROM general_fund_data WHERE ${filters.join(' AND ')}
        UNION ALL
        SELECT 'Tricycle Operators', SUM(Tricycle_Operators) FROM general_fund_data WHERE ${filters.join(' AND ')}
        UNION ALL
        SELECT 'Occupation Tax', SUM(Occupation_Tax) FROM general_fund_data WHERE ${filters.join(' AND ')}
        UNION ALL
        SELECT 'Certificate of Ownership', SUM(Cert_of_Ownership) FROM general_fund_data WHERE ${filters.join(' AND ')}
        UNION ALL
        SELECT 'Certificate of Transfer', SUM(Cert_of_Transfer) FROM general_fund_data WHERE ${filters.join(' AND ')}
        UNION ALL
        SELECT 'Cockpit Prov Share', SUM(Cockpit_Prov_Share) FROM general_fund_data WHERE ${filters.join(' AND ')}
        UNION ALL
        SELECT 'Cockpit Local Share', SUM(Cockpit_Local_Share) FROM general_fund_data WHERE ${filters.join(' AND ')}
        UNION ALL
        SELECT 'Docking and Mooring Fee', SUM(Docking_Mooring_Fee) FROM general_fund_data WHERE ${filters.join(' AND ')}
        UNION ALL
        SELECT 'Sultadas', SUM(Sultadas) FROM general_fund_data WHERE ${filters.join(' AND ')}
        UNION ALL
        SELECT 'Miscellaneous Fees', SUM(Miscellaneous_Fee) FROM general_fund_data WHERE ${filters.join(' AND ')}
        UNION ALL
        SELECT 'Registration of Birth', SUM(Reg_of_Birth) FROM general_fund_data WHERE ${filters.join(' AND ')}
        UNION ALL
        SELECT 'Marriage Fees', SUM(Marriage_Fees) FROM general_fund_data WHERE ${filters.join(' AND ')}
        UNION ALL
        SELECT 'Burial Fee', SUM(Burial_Fees) FROM general_fund_data WHERE ${filters.join(' AND ')}
        UNION ALL
        SELECT 'Correction of Entry', SUM(Correction_of_Entry) FROM general_fund_data WHERE ${filters.join(' AND ')}
        UNION ALL
        SELECT 'Fishing Permit Fee', SUM(Fishing_Permit_Fee) FROM general_fund_data WHERE ${filters.join(' AND ')}
        UNION ALL
        SELECT 'Sale of Agri. Prod', SUM(Sale_of_Agri_Prod) FROM general_fund_data WHERE ${filters.join(' AND ')}
        UNION ALL
        SELECT 'Sale of Acct Form', SUM(Sale_of_Acct_Form) FROM general_fund_data WHERE ${filters.join(' AND ')}
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
            Sale_of_Acct_Form) FROM general_fund_data WHERE ${filters.join(' AND ')};
        `;
    }

    // Execute the SQL query
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.json(results);
    });
});


app.get('/api/general-fund-receipts-from-economic-enterprise-report', (req, res) => {
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
        SELECT 'Water Fees' AS Taxes, SUM(Water_Fees) AS Total FROM general_fund_data WHERE ${filters.join(' AND ')}
        UNION ALL
        SELECT 'Stall Fees', SUM(Stall_Fees) FROM general_fund_data WHERE ${filters.join(' AND ')}
        UNION ALL
        SELECT 'Cash Tickets', SUM(Cash_Tickets) FROM general_fund_data WHERE ${filters.join(' AND ')}
        UNION ALL
        SELECT 'Slaughter House Fee', SUM(Slaughter_House_Fee) FROM general_fund_data WHERE ${filters.join(' AND ')}
        UNION ALL
        SELECT 'Rental of Equipment', SUM(Rental_of_Equipment) FROM general_fund_data WHERE ${filters.join(' AND ')}
        UNION ALL
        SELECT 'Overall Total', SUM(Water_Fees+Stall_Fees+Cash_Tickets+Slaughter_House_Fee+Rental_of_Equipment) FROM general_fund_data WHERE ${filters.join(' AND ')}
        `;
    }
        // Execute the SQL query
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.json(results);
    });
});

app.get('/api/general-fund-service-user-charges', (req, res) => {
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
        SELECT 'Police Report/Clearance' AS Taxes, SUM(0) AS Total FROM general_fund_data WHERE ${filters.join(' AND ')}
        UNION ALL
        SELECT 'Secretary Fee', SUM(Secretaries_Fee + Police_Report_Clearance) AS Total FROM general_fund_data WHERE ${filters.join(' AND ')}
        UNION ALL
        SELECT 'Med./Dent. & Lab. Fees', SUM(Med_Dent_Lab_Fees) AS Total FROM general_fund_data WHERE ${filters.join(' AND ')}
        UNION ALL
        SELECT 'Garbage Fees', SUM(Garbage_Fees) AS Total FROM general_fund_data WHERE ${filters.join(' AND ')}
        UNION ALL
        SELECT 'Cutting Tree', SUM(Cutting_Tree) AS Total FROM general_fund_data WHERE ${filters.join(' AND ')}
        UNION ALL
        SELECT 'Documentary Stamp', SUM(Doc_Stamp) AS Total FROM general_fund_data WHERE ${filters.join(' AND ')}
        UNION ALL
        SELECT 'Overall Total', SUM(Secretaries_Fee + Police_Report_Clearance + Med_Dent_Lab_Fees + Garbage_Fees + Cutting_Tree + Doc_Stamp) AS Total FROM general_fund_data WHERE ${filters.join(' AND ')}
        `;
    }

    // Execute the SQL query
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.json(results);
    });
});


app.get('/api/general-fund-total-tax-report', (req, res) => {
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
        SELECT 'Tax on Business' AS Taxes, SUM(Manufacturing+Distributor+Retailing+Financial+Other_Business_Tax+Fines_Penalties+Sand_Gravel) AS Total FROM general_fund_data WHERE ${filters.join(' AND ')}
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
            Sale_of_Acct_Form) FROM general_fund_data WHERE ${filters.join(' AND ')}
        UNION ALL
        SELECT 'Receipts From Economic Enterprise', SUM(Water_Fees+Stall_Fees+Cash_Tickets+Slaughter_House_Fee+Rental_of_Equipment) FROM general_fund_data WHERE ${filters.join(' AND ')}
        UNION ALL
        SELECT 'Service/User Charges', SUM(Police_Report_Clearance+Secretaries_Fee+Med_Dent_Lab_Fees+Garbage_Fees+Cutting_Tree+Doc_Stamp) FROM general_fund_data WHERE ${filters.join(' AND ')}
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
            Sale_of_Acct_Form+Water_Fees+Stall_Fees+Cash_Tickets+Slaughter_House_Fee+Rental_of_Equipment+Police_Report_Clearance+Secretaries_Fee+Med_Dent_Lab_Fees+Garbage_Fees+Cutting_Tree+Doc_Stamp) FROM general_fund_data WHERE ${filters.join(' AND ')}
        `;
    }
        // Execute the SQL query
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.json(results);
    });
});


app.get('/api/trust-fund-building-permit-fees', (req, res) => {
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
        SELECT 'Building Local Fund 80%' AS Taxes, SUM(LOCAL_80_PERCENT) AS Total FROM trust_fund_data WHERE ${filters.join(' AND ')}
        UNION ALL
        SELECT 'Building Trust Fund 15%', SUM(TRUST_FUND_15_PERCENT) FROM trust_fund_data WHERE ${filters.join(' AND ')}
        UNION ALL
        SELECT 'Building National Fund 5% ', SUM(NATIONAL_5_PERCENT) FROM trust_fund_data WHERE ${filters.join(' AND ')}
        UNION ALL
        SELECT 'Overall Total', SUM(LOCAL_80_PERCENT+TRUST_FUND_15_PERCENT+NATIONAL_5_PERCENT) FROM trust_fund_data WHERE ${filters.join(' AND ')}
        `;
    }
        // Execute the SQL query
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.json(results);
    });
});


app.get('/api/trust-fund-electrical-permit-fees', (req, res) => {
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
        SELECT 'Electrical Fee' AS Taxes, SUM(ELECTRICAL_FEE) AS Total FROM trust_fund_data WHERE ${filters.join(' AND ')}
        UNION ALL
        SELECT 'Overall Total', SUM(ELECTRICAL_FEE) FROM trust_fund_data WHERE ${filters.join(' AND ')}
        `;
    }
        // Execute the SQL query
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.json(results);
    });
});


app.get('/api/trust-fund-zoning-permit-fees', (req, res) => {
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
        SELECT 'Zoning Fee' AS Taxes, SUM(ZONING_FEE) AS Total FROM trust_fund_data WHERE ${filters.join(' AND ')}
		UNION ALL
        SELECT 'Overall Total', SUM(ZONING_FEE) FROM trust_fund_data WHERE ${filters.join(' AND ')}
        `;
    }
        // Execute the SQL query
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.json(results);
    });
});



app.get('/api/trust-fund-livestock-dev-fund-fees', (req, res) => {
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
        SELECT 'Livestock Dev Fund Local 80%' AS Taxes, SUM(LOCAL_80_PERCENT_LIVESTOCK) AS Total FROM trust_fund_data WHERE ${filters.join(' AND ')}
        UNION ALL
        SELECT 'Livestock Dev Fund National 20%', SUM(NATIONAL_20_PERCENT) FROM trust_fund_data WHERE ${filters.join(' AND ')}
        UNION ALL
        SELECT 'Overall Total', SUM(LOCAL_80_PERCENT_LIVESTOCK+NATIONAL_20_PERCENT) FROM trust_fund_data WHERE ${filters.join(' AND ')}
        `;
    }
        // Execute the SQL query
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.json(results);
    });
});

app.get('/api/trust-fund-diving-fees', (req, res) => {
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
        SELECT 'Diving Fee Local 40%' AS Taxes, SUM(LOCAL_40_PERCENT_DIVE_FEE) AS Total FROM trust_fund_data WHERE ${filters.join(' AND ')}
        UNION ALL
        SELECT 'Diving Fee Fishers 30%', SUM(FISHERS_30_PERCENT) FROM trust_fund_data WHERE ${filters.join(' AND ')}
        UNION ALL
		SELECT 'Diving Fee Brgy 30%', SUM(BRGY_30_PERCENT) FROM trust_fund_data WHERE ${filters.join(' AND ')}
        UNION ALL
        SELECT 'Overall Total', SUM(LOCAL_40_PERCENT_DIVE_FEE+FISHERS_30_PERCENT+BRGY_30_PERCENT) FROM trust_fund_data WHERE ${filters.join(' AND ')}
        `;
    }
        // Execute the SQL query
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.json(results);
    });
});


app.get('/api/trust-fund-total-fees-reports', (req, res) => {
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
        SELECT 'Building Permit Fee' AS Taxes, SUM(BUILDING_PERMIT_FEE) AS Total FROM trust_fund_data WHERE ${filters.join(' AND ')}
        UNION ALL
        SELECT 'Electrical Permit Fee', SUM(ELECTRICAL_FEE) FROM trust_fund_data WHERE ${filters.join(' AND ')}
        UNION ALL
		SELECT 'Zoning Fee', SUM(ZONING_FEE) FROM trust_fund_data WHERE ${filters.join(' AND ')}
        UNION ALL
		SELECT 'Livestock Dev. Fund', SUM(LIVESTOCK_DEV_FUND) FROM trust_fund_data WHERE ${filters.join(' AND ')}
        UNION ALL
		SELECT 'Diving Fee', SUM(DIVING_FEE) FROM trust_fund_data WHERE ${filters.join(' AND ')}
        UNION ALL
        SELECT 'Overall Total', SUM(BUILDING_PERMIT_FEE+ELECTRICAL_FEE+ZONING_FEE+LIVESTOCK_DEV_FUND+DIVING_FEE) FROM trust_fund_data WHERE ${filters.join(' AND ')}
        `;
    }
        // Execute the SQL query
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.json(results);
    });
});

// Define an endpoint to get Building Permit Fee totals
app.get('/api/BuildingPermitFeeTotal', (req, res) => {
  const { month, day, year } = req.query;

  let sql = `
    SELECT
      SUM(LOCAL_80_PERCENT + TRUST_FUND_15_PERCENT + NATIONAL_5_PERCENT) AS Building_Permit_Fee_Total
    FROM trust_fund_data
    WHERE 1=1`;

  sql = addDateFilters(sql, month, day, year);

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      res.status(500).send('Error fetching data');
      return;
    }
    res.json({ building_permit_fee_total: results[0].Building_Permit_Fee_Total || 0 });
  });
});

// Define an endpoint to get Electrical Fee totals
app.get('/api/ElectricalFeeTotal', (req, res) => {
  const { month, day, year } = req.query;

  let sql = `
    SELECT
      SUM(ELECTRICAL_FEE) AS Electrical_Fee_Total
    FROM trust_fund_data
    WHERE 1=1`;

  sql = addDateFilters(sql, month, day, year);

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      res.status(500).send('Error fetching data');
      return;
    }
    res.json({ electrical_fee_total: results[0].Electrical_Fee_Total || 0 });
  });
});

// Define an endpoint to get Zoning Fee totals
app.get('/api/ZoningFeeTotal', (req, res) => {
  const { month, day, year } = req.query;

  let sql = `
    SELECT
      SUM(ZONING_FEE) AS Zoning_Fee_Total
    FROM trust_fund_data
    WHERE 1=1`;

  sql = addDateFilters(sql, month, day, year);

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      res.status(500).send('Error fetching data');
      return;
    }
    res.json({ zoning_fee_total: results[0].Zoning_Fee_Total || 0 });
  });
});

// Define an endpoint to get Livestock Dev Fund totals
app.get('/api/LivestockDevFundTotal', (req, res) => {
  const { month, day, year } = req.query;

  let sql = `
    SELECT
      SUM(LOCAL_80_PERCENT_LIVESTOCK + NATIONAL_20_PERCENT) AS Livestock_Dev_Fund_Total
    FROM trust_fund_data
    WHERE 1=1`;

  sql = addDateFilters(sql, month, day, year);

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      res.status(500).send('Error fetching data');
      return;
    }
    res.json({ livestock_dev_fund_total: results[0].Livestock_Dev_Fund_Total || 0 });
  });
});

// Define an endpoint to get Diving Fee totals
app.get('/api/DivingFeeTotal', (req, res) => {
  const { month, day, year } = req.query;

  let sql = `
    SELECT
      SUM(LOCAL_40_PERCENT_DIVE_FEE + FISHERS_30_PERCENT + BRGY_30_PERCENT) AS Diving_Fee_Total
    FROM trust_fund_data
    WHERE 1=1`;

  sql = addDateFilters(sql, month, day, year);

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      res.status(500).send('Error fetching data');
      return;
    }
    res.json({ diving_fee_total: results[0].Diving_Fee_Total || 0 });
  });
});

// Define an endpoint to fetch all data from trust_fund_data to show in the table
app.get('/api/allDataTrustFund', (req, res) => {
  const { year, month } = req.query;

  if (!year || !month) {
    return res.status(400).send('Year and Month parameters are required');
  }

  const sql = `
    SELECT
      DATE_FORMAT(DATE, '%b %d, %Y') AS 'DATE',
      COALESCE(BUILDING_PERMIT_FEE, 0) AS BUILDING_PERMIT_FEE,
      COALESCE(ELECTRICAL_FEE, 0) AS ELECTRICAL_FEE,
      COALESCE(ZONING_FEE, 0) AS ZONING_FEE,
      COALESCE(LIVESTOCK_DEV_FUND, 0) AS LIVESTOCK_DEV_FUND,
      COALESCE(DIVING_FEE, 0) AS DIVING_FEE,
      COALESCE(TOTAL, 0) AS TOTAL,
      COALESCE(COMMENTS, '') AS COMMENTS
    FROM
      trust_fund_data
    WHERE
      YEAR(DATE) = ? AND MONTH(DATE) = ?
  `;

  db.query(sql, [year, month], (err, result) => {
    if (err) {
      console.error('Error fetching trust fund data:', err);
      return res.status(500).send('Error fetching trust fund data');
    }

    res.json(result);
  });
});


// Define an endpoint to fetch all data from general_fund_data to show in the table
app.get('/api/allDataGeneralFund', (req, res) => {
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
    sql += ` WHERE ${filters.join(' AND ')}`;
  }

  sql += `
    GROUP BY g.date
    ORDER BY g.date;
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      return res.status(500).send('Error fetching data');
    } 
    res.json(results);
  });
});

app.get('/api/generalFundDataDaily', async (req, res) => {
  try {
    // Extract the date string from the query parameters (e.g., ?date=YYYY-MM-DD)
    const { dateStr } = req.query;
    
    // Validate if dateStr is provided
    if (!dateStr) {
      return res.status(400).json({ error: 'Date parameter is required' });
    }

    // Fetch data from the external API
    const response = await axios.get(`http://192.168.101.28:3001/api/generalFundDataDaily/${encodeURIComponent(dateStr)}`);

    // Check if the response status is OK
    if (response.status === 200) {
      // Send the response data to the client
      res.json(response.data);
    } else {
      // Handle unexpected status codes
      res.status(response.status).json({ error: 'Failed to fetch data from external API' });
    }
  } catch (error) {
    // Handle errors from axios or other unexpected errors
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Define the API endpoint
app.get('/api/viewalldataGeneralFundTableView', (req, res) => {
  const { date } = req.query;

  if (!date) {
    return res.status(400).send('Date parameter is required');
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
      console.error('Database query error:', error);
      return res.status(500).send('Database query error');
    }

    if (results.length === 0) {
      return res.status(404).send('No data found for the given date');
    }

    // Send back all rows for that date
    res.json(results);
  });
});

// Define the API endpoint
app.get('/api/viewalldataTrustFundTableView', (req, res) => {
  const { date } = req.query;

  if (!date) {
    return res.status(400).send('Date parameter is required');
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
      console.error('Database query error:', error);
      return res.status(500).send('Database query error');
    }

    if (results.length === 0) {
      return res.status(404).send('No data found for the given date');
    }

    res.json(results);
  });
});

// Define the route to get the data
app.get('/api/cedula', (req, res) => {
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
      USERID AS CASHIER
      FROM
      cedula;
  `;

  db.query(query, (err, results) => {
      if (err) {
          console.error('Error executing query:', err);
          res.status(500).send('Server error');
          return;
      }
      res.json(results);
  });
});

// Define the API endpoint for updating cedula records
app.post('/api/cedulaedit', async (req, res) => {
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
    USERID
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
    LOCAL_TIN
  ];

  try {
    // Get a connection from the pool
    const connection = await pool.getConnection();

    // Execute the query using the connection
    const [updateResult] = await connection.execute(query, params);

    // Check the result of the query
    if (updateResult.affectedRows > 0) {
      res.status(200).json({ message: 'Record updated successfully.' });
    } else {
      res.status(404).json({ message: 'Record not found for update.' });
    }

    // Release the connection back to the pool
    connection.release();
  } catch (error) {
    console.error('Error updating record:', error);
    res.status(500).json({ message: 'Error updating record.', error: error.message });
  }
});


// Define an API endpoint to get all PSIC data
app.get('/api/datapsic', (req, res) => {
    const sectionsQuery = 'SELECT * FROM Sections';
    db2.query(sectionsQuery, (err, sections) => {
        if (err) {
            console.error('Error fetching sections:', err);
            res.status(500).send('Error fetching sections');
            return;
        }

        // Fetch details for each section
        const sectionsWithDetails = [];
        let completedSections = 0;

        sections.forEach(section => {
            const divisionsQuery = 'SELECT * FROM Divisions WHERE section_code = ?';
            db2.query(divisionsQuery, [section.section_code], (err, divisions) => {
                if (err) {
                    console.error('Error fetching divisions:', err);
                    res.status(500).send('Error fetching divisions');
                    return;
                }

                section.Divisions = divisions;
                let completedDivisions = 0;

                divisions.forEach(division => {
                    const groupsQuery = 'SELECT * FROM Groups WHERE division_code = ?';
                    db2.query(groupsQuery, [division.division_code], (err, groups) => {
                        if (err) {
                            console.error('Error fetching groups:', err);
                            res.status(500).send('Error fetching groups');
                            return;
                        }

                        division.Groups = groups;
                        let completedGroups = 0;

                        groups.forEach(group => {
                            const classesQuery = 'SELECT * FROM Classes WHERE group_code = ?';
                            db2.query(classesQuery, [group.group_code], (err, classes) => {
                                if (err) {
                                    console.error('Error fetching classes:', err);
                                    res.status(500).send('Error fetching classes');
                                    return;
                                }

                                group.Classes = classes;
                                let completedClasses = 0;

                                classes.forEach(classData => {
                                    const subclassesQuery = 'SELECT * FROM Subclasses WHERE class_code = ?';
                                    db2.query(subclassesQuery, [classData.class_code], (err, subclasses) => {
                                        if (err) {
                                            console.error('Error fetching subclasses:', err);
                                            res.status(500).send('Error fetching subclasses');
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
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});

app.put('/api/updateGeneralFundData/:id', (req, res) => {
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
    type_receipt
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
    id // <-- The WHERE condition
  ];

  db.query(query, values, (err, results) => {
    if (err) {
      console.error('Failed to update data:', err);
      res.status(500).json({ message: 'Failed to update data' });
    } else {
      res.status(200).json({ message: 'Data updated successfully' });
    }
  });
});


app.post('/api/dailyComments', (req, res) => {
  const { date, comment, time, user } = req.body;

  if (!date || !comment || !time || !user) {
    return res.status(400).json({ error: 'Missing one of: date, comment, time, user' });
  }

  const sql = `
    INSERT INTO gf_daily_collection_comment (date, comment, time, user)
    VALUES (?, ?, ?, ?)
  `;
  db.query(sql, [date, comment, time, user], (err, result) => {
    if (err) {
      console.error('Error inserting comment:', err);
      return res.status(500).json({ error: 'Database error inserting comment' });
    }
    // Return the inserted ID or a success message
    res.status(201).json({
      message: 'Comment added successfully',
      insertedId: result.insertId
    });
  });
});

app.post('/api/saveCedulaData', (req, res) => {
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
  const checkQuery = 'SELECT 1 FROM CEDULA WHERE CTCNO = ? LIMIT 1';
  db.query(checkQuery, [CTCNO], (checkErr, checkResult) => {
    if (checkErr) {
      console.error('Error checking CTCNO:', checkErr);
      return res.status(500).json({ error: 'Database error while checking CTCNO' });
    }

    // If CTCNO exists, send an error response
    if (checkResult.length > 0) {
      return res.status(400).json({ error: 'CTCNO already exists. Cannot save duplicate.' });
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
        console.error('Error saving data:', insertErr);
        return res.status(500).json({ error: 'Failed to save data' });
      }
      res.status(200).json({
        message: 'Data saved successfully',
        id: result.insertId,
      });
    });
  });
});

// API Endpoint to update Cedula data
app.put('/api/updateCedulaData/:ctcno', (req, res) => {
  const { ctcno: oldCtcno } = req.params;  // existing record identifier
  const {
    DATEISSUED,
    TRANSDATE,
    CTCNO: newCtcno,  // potentially new CTCNO
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
      oldCtcno,  // condition: update the record with the old CTCNO
    ];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error('Error updating data:', err);
        return res.status(500).json({ error: 'Failed to update data' });
      }
      res.status(200).json({ message: 'Data updated successfully' });
    });
  }

  // If the CTCNO is being changed, check for duplicates
  if (newCtcno && newCtcno !== oldCtcno) {
    const checkSql = 'SELECT COUNT(*) AS count FROM CEDULA WHERE CTCNO = ?';
    db.query(checkSql, [newCtcno], (checkErr, checkResults) => {
      if (checkErr) {
        console.error('Error checking duplicate CTCNO:', checkErr);
        return res.status(500).json({ error: 'Database error during duplicate check' });
      }

      const { count } = checkResults[0];
      if (count > 0) {
        // Duplicate exists, do not proceed with update
        return res.status(400).json({ error: 'Duplicate CTCNO exists. Update aborted.' });
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


app.get('/api/CedulaDailyCollection', (req, res) => {
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
    conditions.push('YEAR(DATEISSUED) = ?');
    values.push(year);
  }

  if (month) {
    conditions.push('MONTH(DATEISSUED) = ?');
    values.push(month);
  }

  if (conditions.length > 0) {
    sql += ` WHERE ${conditions.join(' AND ')}`;
  }

  sql += `
    GROUP BY DATE(DATEISSUED)
    ORDER BY DATE(DATEISSUED)
  `;

  db.query(sql, values, (err, results) => {
    if (err) {
      console.error('Error fetching daily collection:', err);
      return res.status(500).json({ error: 'Failed to fetch daily collection' });
    }
    res.status(200).json(results);
  });
});




app.get('/api/fetch-report', (req, res) => {
  const sql = `
    WITH cedula_data AS (
        SELECT DATE(DATEISSUED) AS date, SUM(TOTALAMOUNTPAID) AS ctc_total
        FROM cedula
        GROUP BY DATE(DATEISSUED)
    ),
    real_property_tax_data_aggregated AS (
        SELECT DATE(date) AS date, SUM(total) AS rpt_total
        FROM real_property_tax_data
        GROUP BY DATE(date)
    ),
    general_fund_data_aggregated AS (
        SELECT DATE(date) AS date, SUM(total) AS general_fund_total
        FROM general_fund_data
        GROUP BY DATE(date)
    ),
    trust_fund_data_aggregated AS (
        SELECT DATE(date) AS date, SUM(total) AS trust_fund_total
        FROM trust_fund_data
        GROUP BY DATE(date)
    ),
    combined_ctc_and_rpt AS (
        SELECT c.date AS report_date, c.ctc_total, r.rpt_total
        FROM cedula_data c
        LEFT JOIN real_property_tax_data_aggregated r ON c.date = r.date

        UNION ALL

        SELECT r.date AS report_date, NULL AS ctc_total, r.rpt_total
        FROM real_property_tax_data_aggregated r
        LEFT JOIN cedula_data c ON c.date = r.date
        WHERE c.date IS NULL
    ),
    combined_all_data AS (
        SELECT cr.report_date, cr.ctc_total, cr.rpt_total, gf.general_fund_total, tf.trust_fund_total,
               COALESCE(gf.general_fund_total, 0) + COALESCE(tf.trust_fund_total, 0) AS gf_and_tf_total
        FROM combined_ctc_and_rpt cr
        LEFT JOIN general_fund_data_aggregated gf ON cr.report_date = gf.date
        LEFT JOIN trust_fund_data_aggregated tf ON cr.report_date = tf.date

        UNION ALL

        SELECT gf.date AS report_date, NULL AS ctc_total, NULL AS rpt_total, gf.general_fund_total, NULL AS trust_fund_total, gf.general_fund_total AS gf_and_tf_total
        FROM general_fund_data_aggregated gf
        LEFT JOIN combined_ctc_and_rpt cr ON cr.report_date = gf.date
        WHERE cr.report_date IS NULL

        UNION ALL

        SELECT tf.date AS report_date, NULL AS ctc_total, NULL AS rpt_total, NULL AS general_fund_total, tf.trust_fund_total, tf.trust_fund_total AS gf_and_tf_total
        FROM trust_fund_data_aggregated tf
        LEFT JOIN combined_ctc_and_rpt cr ON cr.report_date = tf.date
        WHERE cr.report_date IS NULL
    )
    SELECT report_date AS "date",
           COALESCE(ctc_total, 0) AS "ctc",
           COALESCE(rpt_total, 0) AS "rpt",
           COALESCE(general_fund_total, 0) AS "GF",
           COALESCE(trust_fund_total, 0) AS "TF",
           COALESCE(gf_and_tf_total, 0) AS "gfAndTf",
           0 AS "dueFrom",
           COALESCE(ctc_total, 0) + COALESCE(rpt_total, 0) + COALESCE(gf_and_tf_total, 0) AS "rcdTotal",
           NULL AS "comment",
           NULL AS "under",
           NULL AS "over"
    FROM combined_all_data
    ORDER BY report_date;
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      res.status(500).send('Error fetching data');
      return;
    }

    // ✅ Convert date format to "January 2, 2025"
    const resultsFormatted = results.map(row => {
      const dateObj = new Date(row.date);
      const formattedDate = dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      return {
        ...row,
        date: formattedDate // Replace with formatted date
      };
    });

    // ✅ Save formatted data to JSON
    const baseDir = path.join(
      'C:', 'xampp', 'htdocs', 'TreasurerManagementSoftware', 'my-app',
      'src', 'template', 'layout', 'reports', 'FullReport', 'components'
    );

    const groupedResults = resultsFormatted.reduce((acc, row) => {
      const date = new Date(row.date);
      const year = date.getFullYear(); 
      const month = date.toLocaleString('default', { month: 'long' }).toUpperCase();

      if (!acc[year]) acc[year] = {};
      if (!acc[year][month]) acc[year][month] = [];
      acc[year][month].push(row);

      return acc;
    }, {});

    Object.keys(groupedResults).forEach(year => {
      const yearDir = path.join(baseDir, year);
      if (!fs.existsSync(yearDir)) fs.mkdirSync(yearDir, { recursive: true });

      Object.keys(groupedResults[year]).forEach(month => {
        const monthDir = path.join(yearDir, month);
        const filePath = path.join(monthDir, 'data.json');
        if (!fs.existsSync(monthDir)) fs.mkdirSync(monthDir, { recursive: true });

        try {
          fs.writeFileSync(filePath, JSON.stringify(groupedResults[year][month], null, 2));
          console.log(`File created: ${filePath}`);
        } catch (err) {
          console.error(`Error writing file (${filePath}):`, err);
        }
      });
    });

    res.json(resultsFormatted); // Send formatted data
  });
});


app.get('/api/viewDailyCollectionDetailsCedula', (req, res) => {
  const { date } = req.query;
  
  // Convert to MySQL DATE format
  const formattedDate = new Date(date).toISOString().slice(0, 19).replace('T', ' ');

  const query = `
    SELECT 
      DATE_FORMAT(DATEISSUED, '%Y-%m-%d') AS DATE,
      CTCNO AS "CTC NO",
      LOCAL_TIN AS LOCAL,
      OWNERNAME AS NAME,
      BASICTAXDUE AS BASIC,
      (BUSTAXDUE + SALTAXDUE + RPTAXDUE) AS TAX_DUE,
      INTEREST,
      (BUSTAXDUE + SALTAXDUE + RPTAXDUE + INTEREST) AS TOTAL,
      USERID AS CASHIER,
      COMMENT
    FROM cedula
    WHERE DATE(DATEISSUED) = ?`;

  db.query(query, [formattedDate], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

app.post('/api/saveCommentCedula', (req, res) => {
  const { date, ctcNo, comment } = req.body;

  const query = `
    UPDATE cedula 
    SET COMMENT = ? 
    WHERE DATE(DATEISSUED) = ? AND CTCNO = ?
  `;

  db.query(query, [comment, date, ctcNo], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }

    res.json({ message: 'Comment updated successfully' });
  });
});


// Define the API endpoint to fetch the report based on month & year
app.get("/api/fetch-report-json", async (req, res) => {
  const { month, year } = req.query;

  console.log(`Received request for Month: ${month}, Year: ${year}`);

  if (!month || !year || isNaN(month) || isNaN(year)) {
    return res.status(400).json({ error: "Valid Month and Year are required." });
  }

  const monthNames = [
    "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
    "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
  ];

  const monthIndex = parseInt(month, 10) - 1;
  if (monthIndex < 0 || monthIndex > 11) {
    return res.status(400).json({ error: "Invalid month provided." });
  }

  const monthName = monthNames[monthIndex];

  const filePath = path.join(
    "C:", "xampp", "htdocs", "TreasurerManagementSoftware",
    "my-app", "src", "template", "layout", "reports",
    "FullReport", "components", year, monthName, "data.json"
  );

  console.log(`Looking for file at: ${filePath}`);

  // ✅ FIX: Use fs.promises properly
  try {
    await fs.promises.access(filePath); // Checks if file exists
    const data = await fs.promises.readFile(filePath, "utf8"); // Read JSON
    console.log(`Successfully read data from: ${filePath}`);
    return res.json(JSON.parse(data));
  } catch (err) {
    console.error(`Error accessing file: ${filePath}`, err.message);
    return res.status(404).json({ error: "Report not found for the selected month and year." });
  }
});

// API to Update Report JSON
app.post("/api/save-adjustment", async (req, res) => {
  const { year, month, date, field, value, adjustmentType } = req.body;

  if (!year || !month || !date || !field || value === undefined) {
    return res.status(400).json({ error: "Invalid data provided." });
  }

  // Construct the file path
  const filePath = path.join(BASE_DIR, year.toString(), month.toUpperCase(), "data.json");

  try {
    let reportData = [];

    // Read existing data.json
    if (fs.existsSync(filePath)) {
      const existingData = fs.readFileSync(filePath, "utf8");
      reportData = JSON.parse(existingData);
    }

    // Find the row by date
    const rowIndex = reportData.findIndex((item) => item.date === date);
    if (rowIndex === -1) {
      return res.status(404).json({ error: "Row not found in JSON." });
    }

    // Update the field (ctc, rpt, etc.)
    reportData[rowIndex][field] = (reportData[rowIndex][field] || 0) + value;
    
    // Update the under/over field
    reportData[rowIndex][adjustmentType] = (reportData[rowIndex][adjustmentType] || 0) + Math.abs(value);

    // Write back the updated data to the file
    fs.writeFileSync(filePath, JSON.stringify(reportData, null, 2));

    res.json({ message: "Adjustment saved successfully!", updatedData: reportData[rowIndex] });
  } catch (err) {
    console.error("Error saving adjustment:", err);
    res.status(500).json({ error: "Failed to save adjustment." });
  }
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
