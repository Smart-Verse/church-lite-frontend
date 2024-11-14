import {Person} from "../entity/person";
import {PersonAddress} from "../entity/person-address";
import {City} from "../entity/city";
import {State} from "../entity/state";
import {Country} from "../entity/country";
import {PersonalDocs} from "../entity/personal-docs";
import {PersonalTelphone} from "../entity/personal-telphone";
import {PersonalEmail} from "../entity/personal-email";

export class DTOConverter {

  static convertPersonToDTO(root: any): Person {
    return <Person>{
      id: root.id,
      name: root.name,
      active: root.active,
      personAddress: this.convertPersonAddressToDTO(root.personAddress),
      personalDocs: this.convertPersonalDocsToDTO(root.personalDocs),
      personalTelphone: root.personalTelphone.map(this.convertPersonalTelphoneToDTO),
      personalEmail: this.convertPersonalEmailToDTO(root.personalEmail)
    };
  }

  static convertPersonAddressToDTO(address: any): PersonAddress {
    return <PersonAddress>{
      id: address.id,
      person: address.person,
      address: address.address,
      neighborhood: address.neighborhood,
      number: address.number,
      city: this.convertCityToDTO(address.city),
      complement: address.complement,
      postalCode: address.postalCode
    };
  }

  static convertCityToDTO(city: any): City {
    return <City>{
      id: city.id,
      name: city.name,
      ibge: city.ibge,
      state: this.convertStateToDTO(city.state)
    };
  }

  static convertStateToDTO(state: any): State {
    return <State>{
      id: state.id,
      name: state.name,
      abreviation: state.abreviation,
      country: this.convertCountryToDTO(state.country)
    };
  }

  static convertCountryToDTO(country: any): Country {
    return {
      id: country.id,
      name: country.name,
      codeIso: country.codeIso,
      ddi: country.ddi
    };
  }

  static convertPersonalDocsToDTO(docs: any): PersonalDocs {
    return {
      id: docs.id,
      person: docs.person,
      cpf: docs.cpf,
      rg: docs.rg,
      cnpj: docs.cnpj,
      birthDate: docs.birthDate,
      typePerson: docs.typePerson,
      ie: docs.ie
    };
  }

  static convertPersonalTelphoneToDTO(tel: any): PersonalTelphone {
    return {
      id: tel.id,
      person: tel.person,
      fone: tel.fone,
      type: tel.type
    };
  }

  static convertPersonalEmailToDTO(email: any): PersonalEmail {
    return {
      id: email.id,
      person: email.person,
      email: email.email
    };
  }
}
