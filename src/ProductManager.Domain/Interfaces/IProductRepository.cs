using ProductManager.Domain.Entities;

namespace ProductManager.Domain.Interfaces;

public interface IProductRepository
{
    Task<Product?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<List<Product>> GetAllAsync(CancellationToken cancellationToken = default);
    Task AddAsync(Product product, CancellationToken cancellationToken = default);
    void Update(Product product);
    void Delete(Product product);
    Task<bool> ExistsAsync(int id, CancellationToken cancellationToken = default);

    // ADD these two methods:
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    Task<Product?> FindByIdAsync(int id, CancellationToken cancellationToken = default);
}