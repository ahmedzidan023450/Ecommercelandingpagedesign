using Furniture_E_Commerce.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Security.Claims;

namespace Furniture_E_Commerce.Filters
{
    public class BlockedUserFilter : IAsyncActionFilter
    {
        private readonly IUserRepository _userRepo;

        public BlockedUserFilter(IUserRepository userRepo)
        {
            _userRepo = userRepo;
        }

        public async Task OnActionExecutionAsync(
            ActionExecutingContext context,
            ActionExecutionDelegate next)
        {
            var user = context.HttpContext.User;

            // skip if not authenticated
            if (!user.Identity?.IsAuthenticated ?? true)
            {
                await next();
                return;
            }

            var userIdClaim = user.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userIdClaim, out var userId))
            {
                await next();
                return;
            }

            var dbUser = await _userRepo.GetByIdAsync(userId);
            if (dbUser != null && dbUser.IsBlocked)
            {
                context.Result = new ObjectResult(new
                {
                    message = "Your account has been blocked. Please contact support."
                })
                {
                    StatusCode = StatusCodes.Status403Forbidden
                };
                return;
            }

            await next();
        }
    }
}