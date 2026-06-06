using Furniture_E_Commerce.DTOs.Users;
using Furniture_E_Commerce.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

[ApiController]
[Route("api/user")]
[Authorize]
public class UserController : ControllerBase
{
    private readonly IUserService _userService;

    public UserController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpGet("profile")]
    public async Task<IActionResult> GetProfile()
    {
        var claim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(claim)) return Unauthorized();
        var userId = int.Parse(claim);
        var result = await _userService.GetProfileAsync(userId);
        return Ok(result);
    }

    [HttpPut("profile")]
    public async Task<IActionResult> UpdateProfile(UpdateUserDto dto)
    {
        var claim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(claim)) return Unauthorized();
        var userId = int.Parse(claim);
        await _userService.UpdateProfileAsync(userId, dto);
        return NoContent();
    }

    [HttpGet("orders")]
    public async Task<IActionResult> GetOrders()
    {
        var claim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(claim)) return Unauthorized();
        var userId = int.Parse(claim);
        var result = await _userService.GetUserOrdersAsync(userId);
        return Ok(result);
    }
}