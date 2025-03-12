export type EnvVariable = {
  port: number
  database: {
    url: string
    port: number
  },
  auth_secret: string
  expiry: string
}