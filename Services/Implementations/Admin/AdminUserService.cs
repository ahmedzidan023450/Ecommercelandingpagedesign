using Furniture_E_Commerce.DTOs.Users;
using Furniture_E_Commerce.Repositories.Interfaces;
using Furniture_E_Commerce.Services.Interfaces.Admin;
using Mapster;
using Microsoft.EntityFrameworkCore;

namespace Furniture_E_Commerce.Services.Implementations.Admin
{
    public class AdminUserService : IAdminUserService
    {
        private readonly IUserRepository _userRepo;

        public AdminUserService(IUserRepository userRepo)
        {
            _userRepo = userRepo;
        }

        public async Task<(IEnumerable<UserDto> Items, int TotalCount)>
            GetUsersPagedAsync(int page, int pageSize, string? search = null, bool? isBlocked = null)
        {
            var query = _userRepo.Query().AsNoTracking();

            if (!string.IsNullOrWhiteSpace(search))
                query = query.Where(u => u.FullName.Contains(search) || u.Email.Contains(search));

            if (isBlocked.HasValue)
                query = query.Where(u => u.IsBlocked == isBlocked.Value);

            var totalCount = await query.CountAsync();

            var users = await query
                .OrderByDescending(u => u.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (users.Adapt<IEnumerable<UserDto>>(), totalCount);
        }

        public async Task<UserDetailsDto?> GetUserDetailsAsync(int userId)
        {
            var user = await _userRepo.GetWithOrdersAsync(userId);
            return user == null ? null : user.Adapt<UserDetailsDto>();
        }

        public async Task BlockUserAsync(int userId)
        {
            var user = await _userRepo.GetByIdAsync(userId);
            if (user == null) throw new Exception("User not found");
            user.IsBlocked = true;
            _userRepo.Update(user);
            await _userRepo.SaveChangesAsync();
        }

        public async Task UnblockUserAsync(int userId)
        {
            var user = await _userRepo.GetByIdAsync(userId);
            if (user == null) throw new Exception("User not found");
            user.IsBlocked = false;
            _userRepo.Update(user);
            await _userRepo.SaveChangesAsync();
        }

        public async Task DeleteUserAsync(int userId)
        {
            var user = await _userRepo.GetByIdAsync(userId);
            if (user == null) throw new Exception("User not found");
            _userRepo.Delete(user);
            await _userRepo.SaveChangesAsync();
        }
    }
}