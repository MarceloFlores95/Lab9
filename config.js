exports.DATABASE_URL =
  process.env.DATABASE_URL || 'mongodb://localhost/bookmarksdb';
exports.PORT = process.env.PORT || '8080';
exports.TOKEN = process.env.API_TOKEN || '2abbf7c3-245b-404f-9473-ade729ed4653';