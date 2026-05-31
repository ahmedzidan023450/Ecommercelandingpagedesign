using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Furniture_E_Commerce.Models
{

    [Table("OrderItems")]
    public class OrderItem
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        /// <summary>
        /// Snapshot of product name at the time of the order.
        /// Ensures order history is accurate even if the product name changes later.
        /// </summary>
        [Required]
        [MaxLength(200)]
        public string ProductName { get; set; } = string.Empty;

        /// <summary>
        /// Snapshot of unit price at the time of the order.
        /// </summary>
        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal UnitPrice { get; set; }

        [Required]
        [Range(1, 100, ErrorMessage = "Quantity must be between 1 and 100")]
        public int Quantity { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalPrice { get; set; }

        // ── Foreign keys ───────────────────────────────────────────────────────
        [Required]
        public int OrderId { get; set; }

        /// <summary>
        /// Kept for reference — uses DeleteBehavior.Restrict so order history
        /// is never orphaned if the product is soft-deleted.
        /// </summary>
        [Required]
        public int ProductId { get; set; }

        // ── Navigation properties ──────────────────────────────────────────────
        [ForeignKey(nameof(OrderId))]
        public virtual Order Order { get; set; } = null!;

        [ForeignKey(nameof(ProductId))]
        public virtual Product Product { get; set; } = null!;
    }
}