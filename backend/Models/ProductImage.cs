
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Furniture_E_Commerce.Models;

[Table("ProductImages")]
public class ProductImage : ISoftDelete
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Required]
    [MaxLength(500)]
    public string Url { get; set; } = string.Empty;

    [MaxLength(200)]
    public string? AltText { get; set; }

    /// <summary>
    /// Only one image per product may be primary (enforced at service layer).
    /// </summary>
    public bool IsPrimary { get; set; } = false;

    /// <summary>
    /// Controls display order in gallery. Lower = first.
    /// </summary>
    [Range(0, 100)]
    public int DisplayOrder { get; set; } = 0;

    public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
    
    public bool IsDeleted { get; set; } = false;
    
    public DateTime? DeletedAt { get; set; }

    // ── Foreign key ────────────────────────────────────────────────────────
    [Required]
    public int ProductId { get; set; }

    // ── Navigation property ────────────────────────────────────────────────
    [ForeignKey(nameof(ProductId))]
    public virtual Product Product { get; set; } = null!;
}