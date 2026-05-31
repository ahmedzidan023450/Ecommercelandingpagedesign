using Furniture_E_Commerce.Models.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Furniture_E_Commerce.Models;

[Table("Orders")]
public class Order
{
    [Key]
    public int Id { get; set; }

    /// <summary>
    /// Human-readable unique order reference. e.g. FSH-20240601-0042
    /// </summary>
    [Required]
    [MaxLength(30)]
    public string OrderNumber { get; set; } = string.Empty;

    [Required]
    public OrderStatus Status { get; set; } = OrderStatus.Pending;

    [Required]
    public ShippingStatus ShippingStatus { get; set; } = ShippingStatus.NotShipped;

    [Required]
    public PaymentStatus PaymentStatus { get; set; } = PaymentStatus.Pending;

    [Required]
    [Column(TypeName = "decimal(18,2)")]
    public decimal TotalAmount { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal DiscountAmount { get; set; } = 0m;

    [Required]
    [MaxLength(100)]
    public string RecipientName { get; set; } = string.Empty;

    [Required]
    [MaxLength(20)]
    [Phone]
    public string PhoneNumber { get; set; } = string.Empty;

    [Required]
    [MaxLength(500)]
    public string ShippingAddress { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string? Notes { get; set; }

    public DateTime PlacedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }

    // ── Foreign key ────────────────────────────────────────────────────────
    [Required]
    public int UserId { get; set; }

    // ── Navigation properties ──────────────────────────────────────────────
    [ForeignKey(nameof(UserId))]
    public virtual User User { get; set; } = null!;

    public virtual ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();

    public virtual Payment? Payment { get; set; }
}