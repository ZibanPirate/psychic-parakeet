module.exports = {
  url: process.env.DB_URI,
  type: "postgres",
  synchronize: false,
  logging: false,
  migrationsTableName: "typeorm_migration_table",
  cli: {
    entitiesDir: "src/app/database/entity",
    migrationsDir: "src/app/database/migration",
    subscribersDir: "src/app/database/subscriber",
  },
};
