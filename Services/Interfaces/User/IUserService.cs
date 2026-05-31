using Furniture_E_Commerce.DTOs.Users;

public interface IUserService
{
    Task<UserDto> GetProfileAsync(int userId);

    Task<UserDetailsDto?> GetUserDetailsAsync(int userId);

    Task UpdateProfileAsync(int userId, UpdateUserDto dto);

    Task<IEnumerable<UserOrderSummaryDto>> GetUserOrdersAsync(int userId);
}