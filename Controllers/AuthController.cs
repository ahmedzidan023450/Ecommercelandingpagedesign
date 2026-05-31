using System.Security.Claims;
using Furniture_E_Commerce.DTOs.Auth;
using Furniture_E_Commerce.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Furniture_E_Commerce.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        // =========================
        // REGISTER
        // =========================
        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            var result = await _authService.RegisterAsync(dto);

            return Ok(new
            {
                message = "Account created successfully",
                data = result
            });
        }

        // =========================
        // LOGIN
        // =========================
        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var result = await _authService.LoginAsync(dto);

            return Ok(new
            {
                message = "Login successful",
                data = result
            });
        }

        // =========================
        // CURRENT USER
        // =========================
        [HttpGet("me")]
        [Authorize]
        public IActionResult Me()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var email = User.FindFirstValue(ClaimTypes.Email);
            var role = User.FindFirstValue(ClaimTypes.Role);

            if (userId == null)
                return Unauthorized();

            return Ok(new
            {
                userId,
                email,
                role
            });
        }
    }
}