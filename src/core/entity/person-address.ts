import { City } from "./city"

  
  export interface PersonAddress {
    id: string
    person: string
    address: string
    neighborhood: string
    number: string
    city: City
    complement: string
    postalCode: string
  }
  