/**
 * Run this ONCE from backend folder:  node check_and_fix_indexes.js
 * It only inspects/cleans indexes on these 5 collections.
 * Country/State/City/District are NOT touched.
 */
require('dotenv').config();
const dns = require("dns");
dns.setServers([
  "8.8.8.8",
  "1.1.1.1"
]);


const mongoose = require('mongoose');

const collections = [
  'industrysegments',
  'msmestatuses',
  'customerstatuses',
  'customertypes',
  'departments'
];

(async () => {
//   await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI);

const mongoURI =
  process.env.MONGODB_URI_ATLAS || process.env.MONGODB_URI_LOCAL;

await mongoose.connect(mongoURI);

const db = mongoose.connection.db;

  for (const collName of collections) {
    const coll = db.collection(collName);
    const indexes = await coll.indexes();
    console.log(`\n--- ${collName} ---`);
    console.log(indexes.map(i => ({ name: i.name, key: i.key, unique: i.unique })));

    for (const idx of indexes) {
      const isDefault = idx.name === '_id_';
      const isCurrentField = idx.key && (idx.key.name !== undefined);
      if (!isDefault && idx.unique && !isCurrentField) {
        console.log(`Dropping stale unique index: ${idx.name}`);
        await coll.dropIndex(idx.name);
      }
    }
  }

  console.log('\nDone.');
  process.exit(0);
})().catch(err => {
  console.error(err);
  process.exit(1);
});