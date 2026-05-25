using System;
using System.Collections.Generic;
using System.Text;

namespace Furniture_E_Commerce.DTOs.Users
{
    public class UserDetailsDto
    {
        public int Id { get; set; }

        public string FullName { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string? PhoneNumber { get; set; }

        public string Role { get; set; } = string.Empty;

        public bool IsBlocked { get; set; }

        public bool EmailConfirmed { get; set; }

        public DateTime CreatedAt { get; set; }

        public int TotalOrders { get; set; }

        public decimal TotalSpent { get; set; }

        public int TotalReviews { get; set; }

        public List<UserOrderSummaryDto> RecentOrders { get; set; }
            = new();
    }
}
