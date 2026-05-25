using Furniture_E_Commerce.Repositories.Implementations;
using Furniture_E_Commerce.Repositories.Interfaces;
using Furniture_E_Commerce.Services.Implementations;
using Furniture_E_Commerce.Services.Interfaces;
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
           
            return services;
        }
        public static IServiceCollection AddServices(this IServiceCollection services)
        {

            services.AddScoped<IAdminService, AdminService>();
            services.AddScoped<ICategoryService, CategoryService>();

            return services;
        }
    }
}
