using System.Linq.Expressions;

namespace Furniture_E_Commerce.Repositories.Interfaces;

/// <summary>
/// Generic repository contract — provides basic CRUD operations.
/// All domain-specific repositories extend this.
/// </summary>
public interface IGenericRepository<T> where T : class
{
    // ── Queries ────────────────────────────────────────────────────────────
    Task<T?> GetByIdAsync(Guid id);
    Task<IEnumerable<T>> GetAllAsync();
    Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate);
    Task<T?> FirstOrDefaultAsync(Expression<Func<T, bool>> predicate);
    Task<bool> ExistsAsync(Expression<Func<T, bool>> predicate);
    Task<int> CountAsync(Expression<Func<T, bool>>? predicate = null);

    // ── Commands ───────────────────────────────────────────────────────────
    Task<T> AddAsync(T entity);
    Task AddRangeAsync(IEnumerable<T> entities);
    void Update(T entity);
    void Delete(T entity);
    void DeleteRange(IEnumerable<T> entities);

    // ── Persistence ────────────────────────────────────────────────────────
    Task<int> SaveChangesAsync();
}