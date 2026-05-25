using System.Linq.Expressions;

namespace Furniture_E_Commerce.Repositories.Interfaces
{
    public interface IGenericRepository<T> where T : class
    {
        // =========================
        // QUERIES
        // =========================

        IQueryable<T> Query();

        Task<T?> GetByIdAsync(object id);

        Task<T?> FirstOrDefaultAsync(
            Expression<Func<T, bool>> predicate);

        Task<bool> ExistsAsync(
            Expression<Func<T, bool>> predicate);

        Task<int> CountAsync(
            Expression<Func<T, bool>>? predicate = null);

        // =========================
        // COMMANDS
        // =========================

        Task<T> AddAsync(T entity);

        void Update(T entity);

        void Delete(T entity);

        // =========================
        // SAVE
        // =========================

        Task<int> SaveChangesAsync();
    }
}