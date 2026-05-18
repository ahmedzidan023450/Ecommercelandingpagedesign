using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Furniture_E_Commerce.Models;

[Table("Reviews")]
public class Review
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Required]
    [Range(1, 5, ErrorMessage = "Rating must be between 1 and 5")]
    public int Rating { get; set; }

    [MaxLength(1000)]
    public string? Comment { get; set; }

    /// <summary>
    /// Admin can hide inappropriate reviews without deleting them.
    /// </summary>
    public bool IsHidden { get; set; } = false;

    /// <summary>
    /// True only if the user has a completed (Delivered) order containing this product.
    /// Set by the service layer before saving.
    /// </summary>
    public bool IsVerifiedPurchase { get; set; } = false;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }

    // ── Foreign keys ───────────────────────────────────────────────────────
    [Required]
    public Guid UserId { get; set; }

    [Required]
    public Guid ProductId { get; set; }

    // ── Navigation properties ──────────────────────────────────────────────
    [ForeignKey(nameof(UserId))]
    public virtual User User { get; set; } = null!;

    [ForeignKey(nameof(ProductId))]
    public virtual Product Product { get; set; } = null!;
}