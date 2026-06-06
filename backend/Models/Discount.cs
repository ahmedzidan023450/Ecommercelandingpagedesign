using Furniture_E_Commerce.Models.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Furniture_E_Commerce.Models;

[Table("Discounts")]
public class Discount
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    public DiscountType DiscountType { get; set; }

    /// <summary>
    /// Either a percentage (e.g. 15 = 15%) or a fixed amount (e.g. 50.00).
    /// </summary>
    [Required]
    [Column(TypeName = "decimal(18,2)")]
    [Range(0.01, double.MaxValue, ErrorMessage = "Discount value must be greater than 0")]
    public decimal Value { get; set; }

    [Required]
    public DateTime StartDate { get; set; }

    [Required]
    public DateTime EndDate { get; set; }

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // ── Navigation properties ──────────────────────────────────────────────
    public virtual ICollection<Product> Products { get; set; } = new List<Product>();
}