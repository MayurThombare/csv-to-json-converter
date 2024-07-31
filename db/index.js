const { Client } = require('pg');

const client  = new Client({
  host: process.env.PG_HOST,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
});

client.connect();

async function insertUser(user) {
  const { name, age, address, additionalInfo } = user;
  const query = `
    INSERT INTO public.users (name, age, address, additional_info)
    VALUES ($1, $2, $3, $4);
  `;

  const values = [name, age, address, additionalInfo];

  try {
    await client.query(query, values);
    console.log('User inserted successfully');
  } catch (error) {
    console.error('Error inserting user:', error);
  }
}

async function calculateAgeDistribution() {
  const query = `
    SELECT age FROM public.users;
  `;

  try {
    const res = await client.query(query);
    const ages = res.rows.map(row => row.age);

    const distribution = {
      '< 20': 0,
      '20 to 40': 0,
      '40 to 60': 0,
      '> 60': 0,
    };

    ages.forEach(age => {
      if (age < 20) {
        distribution['< 20'] += 1;
      } else if (age >= 20 && age <= 40) {
        distribution['20 to 40'] += 1;
      } else if (age > 40 && age <= 60) {
        distribution['40 to 60'] += 1;
      } else {
        distribution['> 60'] += 1;
      }
    });

    const total = ages.length;
    for (const key in distribution) {
      distribution[key] = ((distribution[key] / total) * 100).toFixed(2);
    }

    console.log('Age-Group % Distribution');
    console.log('< 20:', distribution['< 20']);
    console.log('20 to 40:', distribution['20 to 40']);
    console.log('40 to 60:', distribution['40 to 60']);
    console.log('> 60:', distribution['> 60']);
  } catch (error) {
    console.error('Error calculating age distribution:', error);
  }
}

module.exports = {
  client,
  insertUser,
  calculateAgeDistribution,
};
