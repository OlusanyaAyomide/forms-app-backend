import { Request } from "express"

export type PayloadMetaData = {
  id: string
  email: string
  iat?: number,
  type: "Company" | "Member"
  exp?: number
}

export type CustomRequest = {
  company: PayloadMetaData
} & Request


