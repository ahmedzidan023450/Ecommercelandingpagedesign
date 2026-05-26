using Furniture_E_Commerce.Services.Interfaces.Admin;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Furniture_E_Commerce.Controllers.Admin
{
    [ApiController]
    [Route("api/admin/users")]
    [Authorize(Roles = "Admin")]
    public class AdminUsersController : ControllerBase
    {
        private readonly IAdminUserService _adminService;

        public AdminUsersController(IAdminUserService adminService)
        {
            _adminService = adminService;
        }

        [HttpGet]
        public async Task<IActionResult> GetUsers(
    int page = 1,
    int pageSize = 10,
    string? search = null,
    bool? isBlocked = null)
        {
            var (items, totalCount) = await _adminService.GetUsersPagedAsync(page, pageSize, search, isBlocked);
            return Ok(new
            {
                items,
                totalCount,
                page,
                pageSize,
                totalPages = (int)Math.Ceiling((double)totalCount / pageSize)
            });
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetUserDetails(int id)
        {
            var result = await _adminService.GetUserDetailsAsync(id);
            return result == null ? NotFound() : Ok(result);
        }

        [HttpPut("{id:int}/block")]
        public async Task<IActionResult> BlockUser(int id)
        {
            await _adminService.BlockUserAsync(id);
            return Ok();
        }

        [HttpPut("{id:int}/unblock")]
        public async Task<IActionResult> UnblockUser(int id)
        {
            await _adminService.UnblockUserAsync(id);
            return Ok();
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            await _adminService.DeleteUserAsync(id);
            return Ok();
        }
    }
}