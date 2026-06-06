
using Furniture_E_Commerce.Models.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Furniture_E_Commerce.Models;

[Table("FinancialRecords")]
public class FinancialRecord : ISoftDelete
{
    [Key]
    public int Id { get; set; } 
    [Required]
    public FinancialRecordType Type { get; set; }

    [Required]
    [Column(TypeName = "decimal(18,2)")]
    [Range(0.01, double.MaxValue, ErrorMessage = "Amount must be greater than 0")]
    public decimal Amount { get; set; }

    [Required]
    [MaxLength(500)]
    public string Description { get; set; } = string.Empty;

    /// <summary>
    /// "System" for auto-logged payments; AdminId for manually entered records.
    /// </summary>
    [Required]
    [MaxLength(100)]
    public string RecordedBy { get; set; } = "System";

    /// <summary>
    /// Stored explicitly for fast GROUP BY queries on monthly reports.
    /// </summary>
    [Required]
    [Range(1, 12)]
    public int Month { get; set; }

    [Required]
    [Range(2000, 2100)]
    public int Year { get; set; }
    
    public bool IsDeleted { get; set; } = false;
    
    public DateTime? DeletedAt { get; set; }

    public DateTime RecordedAt { get; set; } = DateTime.UtcNow;

    // ── Foreign key ────────────────────────────────────────────────────────
    /// <summary>
    /// Nullable — manual records entered by admin may not reference an order.
    /// </summary>
    public int? OrderId { get; set; }

    // ── Navigation property ────────────────────────────────────────────────
    [ForeignKey(nameof(OrderId))]  
    public virtual Order? Order { get; set; }
}