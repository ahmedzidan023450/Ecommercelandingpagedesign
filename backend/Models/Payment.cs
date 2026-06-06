using Furniture_E_Commerce.Models;
using Furniture_E_Commerce.Models.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Furniture_E_Commerce.Models;

[Table("Payments")]
public class Payment : ISoftDelete
{
    [Key]
    public int Id { get; set; }

    [Required]
    public PaymentMethod Method { get; set; }

    [Required]
    public PaymentStatus Status { get; set; } = PaymentStatus.Pending;

    [Required]
    [Column(TypeName = "decimal(18,2)")]
    public decimal Amount { get; set; }

    /// <summary>
    /// Reference ID returned by the payment gateway (Stripe, PayPal, etc.).
    /// Null for Cash on Delivery.
    /// </summary>
    [MaxLength(200)]
    public string? TransactionId { get; set; }

    /// <summary>
    /// Raw JSON response from gateway — stored for audit and debugging.
    /// </summary>
    [Column(TypeName = "nvarchar(max)")]
    public string? GatewayResponse { get; set; }

    public DateTime? PaidAt { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public bool IsDeleted { get; set; } = false;
    
    public DateTime? DeletedAt { get; set; }

    [Required]
    public int OrderId { get; set; }

    // ── Navigation property ────────────────────────────────────────────────
    [ForeignKey(nameof(OrderId))]
    public virtual Order Order { get; set; } = null!;
}