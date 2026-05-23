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

        Task<Product?> UpdateAsync(Guid id, UpdateProductDto dto);

        Task<bool> DeleteAsync(Guid id);

        Task<ProductDetailsDto?> GetDetailsAsync(Guid id);

        Task<PagedResultDto<ProductCardDto>> GetPagedAsync(ProductQueryDto query);

        Task UpdateStockAsync(Guid productId, int quantity);
    }
}
