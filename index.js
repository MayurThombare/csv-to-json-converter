require('dotenv').config();
const express = require('express');
const parseCSV = require('./utils/csvToJson');
const { insertUser, calculateAgeDistribution } = require('./db');
const app = express();
const port = process.env.PORT || 3000;

app.get('/convert', async (req, res) => {
  const csvFilePath = process.env.CSV_FILE_PATH;
  const jsonData = parseCSV(csvFilePath);

  for (const record of jsonData) {
    const user = {
      name: `${record.name.firstName} ${record.name.lastName}`,
      age: parseInt(record.age, 10),
      address: {
        line1: record.address.line1,
        line2: record.address.line2,
        city: record.address.city,
        state: record.address.state,
      },
      additionalInfo: {},
    };

    for (const key in record) {
      if (!['name', 'age', 'address'].includes(key)) {
        user.additionalInfo[key] = record[key];
      }
    }

    await insertUser(user);
  }

  await calculateAgeDistribution();

  res.send('Data inserted and age distribution calculated successfully');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
