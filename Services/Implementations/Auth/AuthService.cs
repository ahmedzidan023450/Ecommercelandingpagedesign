using Furniture_E_Commerce.DTOs.Auth;
using Furniture_E_Commerce.Models;
using Furniture_E_Commerce.Models.Enums;
using Furniture_E_Commerce.Repositories.Interfaces;
using Microsoft.AspNetCore.Identity;

namespace Furniture_E_Commerce.Services.Implementations.Auth
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepo;
        private readonly IPasswordHasher<User> _passwordHasher;
        private readonly ITokenService _tokenService;

        public AuthService(
            IUserRepository userRepo,
            IPasswordHasher<User> passwordHasher,
            ITokenService tokenService)
        {
            _userRepo = userRepo;
            _passwordHasher = passwordHasher;
            _tokenService = tokenService;
        }

        public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto)
        {
            var existingUser = await _userRepo.GetByEmailAsync(dto.Email);
            if (existingUser != null)
                throw new Exception("Email already exists");

            var user = new User
            {
                FullName = dto.FullName,
                Email = dto.Email,
                PhoneNumber = dto.PhoneNumber,
                CreatedAt = DateTime.UtcNow,
                Role = UserRole.Customer
            };

            const string ADMIN_CODE = "ADMIN-2026-SECRET";

            if (!string.IsNullOrEmpty(dto.AdminCode) &&
                dto.AdminCode == ADMIN_CODE)
            {
                user.Role = UserRole.Admin;
            }

            user.PasswordHash = _passwordHasher.HashPassword(user, dto.Password);

            await _userRepo.AddAsync(user);
            await _userRepo.SaveChangesAsync();

            var token = _tokenService.GenerateToken(user);

            return new AuthResponseDto
            {
                UserID = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                AccessToken = token,
                RefreshToken = "",
                ExpiresAt = DateTime.UtcNow.AddDays(7)
            };
        }

        public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
        {
            var user = await _userRepo.GetByEmailAsync(dto.Email);

            if (user == null)
                throw new Exception("Invalid credentials");

            var result = _passwordHasher.VerifyHashedPassword(
                user,
                user.PasswordHash,
                dto.Password
            );

            if (result != PasswordVerificationResult.Success)
                throw new Exception("Invalid credentials");

            var token = _tokenService.GenerateToken(user);

            return new AuthResponseDto
            {
                UserID = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                AccessToken = token,
                RefreshToken = "",
                ExpiresAt = DateTime.UtcNow.AddDays(7)
            };
        }
    }
}