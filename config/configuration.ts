export default () => ({
  port: parseInt(process.env.PORT || "3000", 10),
  database: {
    url: process.env.DATABASE_URL,
    port: parseInt(process.env.DATABASE_PORT || "5432", 10) || 5432
  }
})