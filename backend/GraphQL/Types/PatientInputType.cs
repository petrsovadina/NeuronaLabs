using GraphQL.Types;
using NeuronaLabs.Models;

namespace NeuronaLabs.GraphQL.Types
{
    public class PatientInputType : InputObjectGraphType<Patient>
    {
        public PatientInputType()
        {
            Name = "PatientInput";
            Description = "Vstupní typ pro vytvoření nebo aktualizaci pacienta";

            Field(x => x.FirstName).Description("Křestní jméno pacienta");
            Field(x => x.LastName).Description("Příjmení pacienta");
            Field(x => x.DateOfBirth).Description("Datum narození pacienta");
            Field(x => x.Gender).Description("Pohlaví pacienta");
            Field(x => x.BloodType, nullable: true).Description("Krevní skupina pacienta");
            Field(x => x.ContactEmail, nullable: true).Description("Kontaktní email pacienta");
            Field(x => x.PhoneNumber, nullable: true).Description("Telefonní číslo pacienta");
            Field(x => x.Address, nullable: true).Description("Adresa pacienta");
        }
    }
}
