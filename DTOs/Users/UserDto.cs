using Microsoft.Identity.Client;
using System;
using System.Collections.Generic;
using System.Text;

namespace Furniture_E_Commerce.DTOs.Users
{
    public class UserDto
    {
        public Guid Id { get; set; }
        public string Fullname { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? PhoneNumber {  get; set; } 
        public DateTime CreatedDate { get; set; } = DateTime.Now;
    }
}
