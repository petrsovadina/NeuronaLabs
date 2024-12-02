using HotChocolate;
using HotChocolate.Types;
using NeuronaLabs.Services;
using NeuronaLabs.Models;
using System.ComponentModel.DataAnnotations;

namespace NeuronaLabs.GraphQL.Mutations
{
    [ExtendObjectType("Mutation")]
    public class AuthMutations
    {
        public async Task<AuthResult> Register(
            [Service] AuthService authService,
            [Required] string email, 
            [Required] string password,
            [Required] UserRole role)
        {
            // Validace emailu
            if (!IsValidEmail(email))
            {
                return new AuthResult 
                { 
                    Success = false, 
                    Message = "Neplatný formát emailu." 
                };
            }

            // Validace hesla
            if (!IsStrongPassword(password))
            {
                return new AuthResult 
                { 
                    Success = false, 
                    Message = "Heslo musí obsahovat alespoň 8 znaků, velké a malé písmeno, číslo a speciální znak." 
                };
            }

            return await authService.RegisterAsync(email, password, role);
        }

        public async Task<AuthResult> Login(
            [Service] AuthService authService,
            [Required] string email, 
            [Required] string password)
        {
            return await authService.LoginAsync(email, password);
        }

        public async Task<bool> ChangePassword(
            [Service] AuthService authService,
            [Required] int userId,
            [Required] string currentPassword,
            [Required] string newPassword)
        {
            // Validace nového hesla
            if (!IsStrongPassword(newPassword))
            {
                throw new GraphQLException("Nové heslo nesplňuje požadavky na bezpečnost.");
            }

            return await authService.ChangePasswordAsync(userId, currentPassword, newPassword);
        }

        private bool IsValidEmail(string email)
        {
            try 
            {
                var addr = new System.Net.Mail.MailAddress(email);
                return addr.Address == email;
            }
            catch 
            {
                return false;
            }
        }

        private bool IsStrongPassword(string password)
        {
            // Alespoň 8 znaků, velké a malé písmeno, číslo a speciální znak
            return password.Length >= 8 &&
                   password.Any(char.IsUpper) &&
                   password.Any(char.IsLower) &&
                   password.Any(char.IsDigit) &&
                   password.Any(ch => !char.IsLetterOrDigit(ch));
        }
    }
}
