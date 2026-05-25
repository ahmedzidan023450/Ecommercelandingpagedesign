using System;
using System.Collections.Generic;
using System.Text;
using Furniture_E_Commerce.DTOs.Products;
using Furniture_E_Commerce.Models;
using Furniture_E_Commerce.DTOs.Common;
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace Furniture_E_Commerce.Services.Interfaces
{
    public interface IProductService
    {
        Task<Product> CreateAsync(CreateProductDto dto, List<IFormFile> images);

        Task<Product?> UpdateAsync(int id, UpdateProductDto dto);

        Task<bool> DeleteAsync(int id);

        Task<ProductDetailsDto?> GetDetailsAsync(int id);

        Task<PagedResultDto<ProductCardDto>> GetPagedAsync(ProductQueryDto query);

        Task UpdateStockAsync(int productId, int quantity);
    }
}
