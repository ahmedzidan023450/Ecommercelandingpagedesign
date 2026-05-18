using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Furniture_E_Commerce.Models
{
    [Table("CartItems")]
    public class CartItem
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [Range(1, 100, ErrorMessage = "Quantity must be between 1 and 100")]
        public int Quantity { get; set; }

        public DateTime AddedAt { get; set; } = DateTime.UtcNow;

        // ── Foreign keys ───────────────────────────────────────────────────────
        [Required]
        public Guid CartId { get; set; }

        [Required]
        public Guid ProductId { get; set; }

        // ── Navigation properties ──────────────────────────────────────────────
        [ForeignKey(nameof(CartId))]
        public virtual Cart Cart { get; set; } = null!;

        [ForeignKey(nameof(ProductId))]
        public virtual Product Product { get; set; } = null!;
    }
}
