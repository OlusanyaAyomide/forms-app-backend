import { Request } from "express"

export type CompanyMetaData = {
  id: string
  email: string
  iat: number,
  exp: number
}

export type CustomRequest = {
  company: CompanyMetaData
} & Request
