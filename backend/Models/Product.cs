using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Furniture_E_Commerce.Models;

[Table("Products")]
public class Product
{
    [Key]
    public int Id { get; set; }

    // =========================
    // BASIC INFO
    // =========================

    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// URL-friendly unique identifier
    /// Example: "modern-grey-sofa"
    /// </summary>
    [Required]
    [MaxLength(220)]
    public string Slug { get; set; } = string.Empty;

    [MaxLength(50)]
    public string SKU { get; set; } = string.Empty;

    [Required]
    [MaxLength(3000)]
    public string Description { get; set; } = string.Empty;

    // =========================
    // PRICING
    // =========================

    [Required]
    [Column(TypeName = "decimal(18,2)")]
    [Range(typeof(decimal), "0.01", "999999999")]
    public decimal Price { get; set; }

    /// <summary>
    /// Cached discounted price for performance.
    /// Optional because product may not have discount.
    /// </summary>
    [Column(TypeName = "decimal(18,2)")]
    public decimal? DiscountedPrice { get; set; }

    // =========================
    // INVENTORY
    // =========================

    [Required]
    [Range(0, int.MaxValue)]
    public int StockQuantity { get; set; }

    /// <summary>
    /// Used for analytics and top-selling products.
    /// </summary>
    [Range(0, int.MaxValue)]
    public int SoldCount { get; set; } = 0;

    public bool IsActive { get; set; } = true;



    // =========================
    // REVIEW STATS (CACHED)
    // =========================

    [Column(TypeName = "decimal(3,2)")]
    [Range(typeof(decimal), "0", "5")]
    public decimal AverageRating { get; set; } = 0m;

    [Range(0, int.MaxValue)]
    public int ReviewCount { get; set; } = 0;

    // =========================
    // AUDIT
    // =========================

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }

    // =========================
    // FOREIGN KEYS
    // =========================

    [Required]
    public int CategoryId { get; set; }

    public int? DiscountId { get; set; }

    // =========================
    // NAVIGATION PROPERTIES
    // =========================

    [ForeignKey(nameof(CategoryId))]
    public virtual Category Category { get; set; } = null!;

    [ForeignKey(nameof(DiscountId))]
    public virtual Discount? Discount { get; set; }

    public virtual ICollection<ProductImage> Images { get; set; }
        = new List<ProductImage>();

    public virtual ICollection<Review> Reviews { get; set; }
        = new List<Review>();

    public virtual ICollection<OrderItem> OrderItems { get; set; }
        = new List<OrderItem>();

    public virtual ICollection<CartItem> CartItems { get; set; }
        = new List<CartItem>();
}