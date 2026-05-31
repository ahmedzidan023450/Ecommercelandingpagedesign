using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Furniture_E_Commerce.Models;

[Table("RefreshTokens")]
public class RefreshToken
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    /// <summary>
    /// SHA-256 hash of the raw token. Never store the plain token.
    /// </summary>
    [Required]
    [MaxLength(255)]
    public string TokenHash { get; set; } = string.Empty;

    [Required]
    public DateTime ExpiresAt { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public bool IsRevoked { get; set; } = false;

    /// <summary>
    /// Stores the hash of the replacement token when rotation occurs.
    /// Enables detection of refresh token reuse attacks.
    /// </summary>
    [MaxLength(255)]
    public string? ReplacedByTokenHash { get; set; }

    /// <summary>
    /// IP address of the client that created this token — for audit.
    /// </summary>
    [MaxLength(45)]
    public string? CreatedByIp { get; set; }

    // ── Foreign key ────────────────────────────────────────────────────────
    [Required]
    public int UserId { get; set; }

    // ── Navigation property ────────────────────────────────────────────────
    [ForeignKey(nameof(UserId))]
    public virtual User User { get; set; } = null!;

    // ── Computed helpers ───────────────────────────────────────────────────
    [NotMapped]
    public bool IsExpired => DateTime.UtcNow >= ExpiresAt;

    [NotMapped]
    public bool IsActive => !IsRevoked && !IsExpired;
}