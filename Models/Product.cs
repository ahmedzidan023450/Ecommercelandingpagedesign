using Furniture_E_Commerce.Models;
using Microsoft.AspNetCore.Mvc.ViewEngines;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Furniture_E_Commerce.Models;
   

[Table("Products")]
public class Product
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// URL-friendly unique identifier. e.g. "nordic-oak-sofa"
    /// </summary>
    [Required]
    [MaxLength(220)]
    public string Slug { get; set; } = string.Empty;

    [Required]
    [MaxLength(2000)]
    public string Description { get; set; } = string.Empty;

    [Required]
    [Column(TypeName = "decimal(18,2)")]
    [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than 0")]
    public decimal Price { get; set; }

    [Required]
    [Range(0, int.MaxValue, ErrorMessage = "Stock quantity cannot be negative")]
    public int StockQuantity { get; set; } = 0;

    [MaxLength(100)]
    public string? Material { get; set; }

    [MaxLength(80)]
    public string? Color { get; set; }

    /// <summary>
    /// Human-readable dimension string. e.g. "W200 x D90 x H75 cm"
    /// </summary>
    [MaxLength(100)]
    public string? Dimensions { get; set; }

    /// <summary>
    /// Cached average — updated after every new review.
    /// </summary>
    [Column(TypeName = "decimal(3,2)")]
    [Range(0, 5)]
    public decimal AverageRating { get; set; } = 0m;

    public int ReviewCount { get; set; } = 0;

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }

    // ── Foreign keys ───────────────────────────────────────────────────────
    [Required]
    public int CategoryId { get; set; }

    public int? DiscountId { get; set; }

    // ── Navigation properties ──────────────────────────────────────────────
    [ForeignKey(nameof(CategoryId))]
    public virtual Category Category { get; set; } = null!;

    [ForeignKey(nameof(DiscountId))]
    public virtual Discount? Discount { get; set; }

    public virtual ICollection<ProductImage> Images { get; set; } = new List<ProductImage>();

    public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();

    public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();

    public virtual ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();
}