using System;
using System.Collections.Generic;
using System.Text;

namespace Furniture_E_Commerce.DTOs.Auth
{
    public class AuthResponseDto
    {
        public int UserID { get; set; }
        public required string FullName { get; set; }
        public required string Email { get; set; }
        public string? Role { get; set; }
        public required string AccessToken { get; set; }
        public required string RefreshToken { get; set; }
        public DateTime ExpiresAt { get; set; }
    }
}
