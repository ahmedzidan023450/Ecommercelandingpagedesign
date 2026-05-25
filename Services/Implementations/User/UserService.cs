using Furniture_E_Commerce.DTOs.Users;
using Furniture_E_Commerce.Repositories.Interfaces;
using Mapster;
using Microsoft.EntityFrameworkCore;

namespace Furniture_E_Commerce.Services.Implementations
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepo;
        private readonly IOrderRepository _orderRepo;

        public UserService(
            IUserRepository userRepo,
            IOrderRepository orderRepo)
        {
            _userRepo = userRepo;
            _orderRepo = orderRepo;
        }


        public async Task<UserDto> GetProfileAsync(int userId)
        {
            var user = await _userRepo.GetByIdAsync(userId);

            if (user == null)
                throw new Exception("User not found");

            return user.Adapt<UserDto>();
        }



        public async Task<UserDetailsDto?> GetUserDetailsAsync(int userId)
        {
            var user = await _userRepo.Query()
                .Include(u => u.Orders)
                    .ThenInclude(o => o.Items)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
                return null;

            var dto = user.Adapt<UserDetailsDto>();

            dto.TotalOrders = user.Orders.Count;

            dto.TotalSpent = user.Orders
                .Sum(o => o.TotalAmount);

            dto.TotalReviews = user.Reviews?.Count ?? 0;

            dto.RecentOrders = user.Orders
                .OrderByDescending(o => o.PlacedAt)
                .Take(5)
                .Select(o => new UserOrderSummaryDto
                {
                    OrderId = o.Id,
                    OrderNumber = o.OrderNumber,
                    TotalAmount = o.TotalAmount,
                    Status = o.Status.ToString(),
                    PlacedAt = o.PlacedAt
                })
                .ToList();

            return dto;
        }


        public async Task UpdateProfileAsync(int userId, UpdateUserDto dto)
        {
            var user = await _userRepo.GetByIdAsync(userId);

            if (user == null)
                throw new Exception("User not found");

            dto.Adapt(user);

            _userRepo.Update(user);
            await _userRepo.SaveChangesAsync();
        }


        public async Task<IEnumerable<UserOrderSummaryDto>> GetUserOrdersAsync(int userId)
        {
            var orders = await _orderRepo.Query()
                .Where(o => o.UserId == userId)
                .OrderByDescending(o => o.PlacedAt)
                .ToListAsync();

            return orders.Select(o => new UserOrderSummaryDto
            {
                OrderId = o.Id,
                OrderNumber = o.OrderNumber,
                TotalAmount = o.TotalAmount,
                Status = o.Status.ToString(),
                PlacedAt = o.PlacedAt
            });
        }
    }
}