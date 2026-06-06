using Furniture_E_Commerce.Filters;
using Furniture_E_Commerce.Models;
using Furniture_E_Commerce.Repositories.Implementations;
using Furniture_E_Commerce.Repositories.Interfaces;
using Furniture_E_Commerce.Services.Implementations;
using Furniture_E_Commerce.Services.Implementations.Admin;
using Furniture_E_Commerce.Services.Implementations.Auth;
using Furniture_E_Commerce.Services.Interfaces;
using Furniture_E_Commerce.Services.Interfaces.Admin;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;

namespace Furniture_E_Commerce
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddRepositories(this IServiceCollection services) 
        { 
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IProductRepository, ProductRepository>();
            services.AddScoped<IOrderRepository, OrderRepository>();
            services.AddScoped<IReviewRepository, ReviewRepository>();
            services.AddScoped<IFinancialRecordRepository, FinancialRecordRepository>();
            services.AddScoped<IDiscountRepository, DiscountRepository>();
            services.AddScoped<ICartRepository, CartRepository>();
            services.AddScoped<ICategoryRepository, CategoryRepository>();
            services.AddScoped<IOrderItemRepository, OrderItemRepository>();
            services.AddScoped<IPaymentRepository, PaymentRepository>();
            services.AddScoped<IProductImageRepository, ProductImageRepository>();
            services.AddScoped<IRefreshTokenRepository, RefreshTokenRepository>();
            services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
            services.AddScoped<BlockedUserFilter>();
            services.AddScoped<ValidationFilter>();

            return services;
        }
        public static IServiceCollection AddServices(this IServiceCollection services) 
        {
            services.AddScoped<IAdminDashboardService, AdminDashboardService>();
            services.AddScoped<IAdminUserService, AdminUserService>();
            services.AddScoped<IAdminOrderService, AdminOrderService>();
            services.AddScoped<IAdminReviewService, AdminReviewService>();
            services.AddScoped<IAdminFinancialService, AdminFinancialService>();
            services.AddScoped<IAdminDiscountService, AdminDiscountService>();
            services.AddScoped<IAdminCategoryService, AdminCategoryService>();

            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<ITokenService, TokenService>();

            services.AddScoped<IUserService, UserService>();
            services.AddScoped<ICartService, CartService>();
            services.AddScoped<ICategoryService, CategoryService>();
            services.AddScoped<IDiscountService, DiscountService>();
            services.AddScoped<IOrderService, OrderService>();
            services.AddScoped<IPaymentService, PaymentService>();
            services.AddScoped<IProductService, ProductService>();
            services.AddScoped<IReviewService, ReviewService>();

            services.AddScoped<IPasswordHasher<User>, PasswordHasher<User>>();

            return services;
        }
    }
}
