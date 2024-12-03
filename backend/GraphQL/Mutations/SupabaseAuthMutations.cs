using HotChocolate;
using HotChocolate.Types;
using System.ComponentModel.DataAnnotations;
using NeuronaLabs.Services.Implementation;

namespace NeuronaLabs.GraphQL.Mutations
{
    [ExtendObjectType(Name = "Mutation")]
    public class SupabaseAuthMutations
    {
        public async Task<AuthResult> SupabaseLogin(
            [Service] ISupabaseAuthService authService,
            [Required] string email, 
            [Required] string password)
        {
            var (success, token, errorMessage) = await authService.SignInWithPassword(email, password);

            return new AuthResult
            {
                Success = success,
                Token = token,
                Message = errorMessage
            };
        }

        public async Task<AuthResult> SupabaseRegister(
            [Service] ISupabaseAuthService authService,
            [Required] string email, 
            [Required] string password)
        {
            var (success, token, errorMessage) = await authService.SignUp(email, password);

            return new AuthResult
            {
                Success = success,
                Token = token,
                Message = errorMessage
            };
        }
    }

    public class AuthResult
    {
        public bool Success { get; set; }
        public string? Token { get; set; }
        public string? Message { get; set; }
    }
}
