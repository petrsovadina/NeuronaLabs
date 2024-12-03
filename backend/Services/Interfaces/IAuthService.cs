using NeuronaLabs.Models;
using NeuronaLabs.Models.Identity;
using System.Threading.Tasks;

namespace NeuronaLabs.Services
{
    public interface IAuthService
    {
        /// <summary>
        /// Registruje nového uživatele
        /// </summary>
        /// <param name="email">Email uživatele</param>
        /// <param name="password">Heslo uživatele</param>
        /// <param name="role">Role uživatele</param>
        /// <returns>Výsledek registrace</returns>
        Task<AuthResult> RegisterAsync(string email, string password, NeuronaLabs.Models.Identity.UserRole role);

        /// <summary>
        /// Přihlásí uživatele
        /// </summary>
        /// <param name="email">Email uživatele</param>
        /// <param name="password">Heslo uživatele</param>
        /// <returns>Výsledek přihlášení</returns>
        Task<AuthResult> LoginAsync(string email, string password);

        /// <summary>
        /// Změní heslo uživatele
        /// </summary>
        /// <param name="userId">ID uživatele</param>
        /// <param name="currentPassword">Současné heslo</param>
        /// <param name="newPassword">Nové heslo</param>
        /// <returns>True pokud bylo heslo změněno, jinak false</returns>
        Task<bool> ChangePasswordAsync(int userId, string currentPassword, string newPassword);
    }
}
