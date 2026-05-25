using Furniture_E_Commerce.DTOs.Users;

namespace Furniture_E_Commerce.Services.Interfaces
{
    public interface IUserService
    {
        Task<(IEnumerable<UserDto> Items, int TotalCount)> GetUsersPagedAsync(
            int page, int pageSize, string? search = null, bool? isBlocked = null);
        Task<UserDetailsDto?> GetUserDetailsAsync(int userId);
        Task BlockUserAsync(int userId);
        Task UnblockUserAsync(int userId);
        Task DeleteUserAsync(int userId);
    }
}