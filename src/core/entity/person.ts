import { PersonAddress } from "./person-address"
import { PersonalDocs } from "./personal-docs"
import { PersonalEmail } from "./personal-email"
import { PersonalTelphone } from "./personal-telphone"

export interface Person {
    id: string
    name: string
    active: string
    personAddress: PersonAddress
    personalDocs: PersonalDocs
    personalTelphone: PersonalTelphone[]
    personalEmail: PersonalEmail
  }
  

  
