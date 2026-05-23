using System;
using System.Collections.Generic;
using System.Text;

namespace Furniture_E_Commerce.DTOs.Auth
{
    internal class LoginDto
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; }
    }
}
