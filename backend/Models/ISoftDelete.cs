namespace Furniture_E_Commerce.Models
{
    public interface ISoftDelete
    {
        bool IsDeleted { get; set; }

        DateTime? DeletedAt { get; set; }
    }
}