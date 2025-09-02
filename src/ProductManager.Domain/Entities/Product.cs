using ProductManager.Domain.Common;

namespace ProductManager.Domain.Entities;

public class Product : BaseAuditableEntity
{
    public required string Name { get; set; }
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public int Stock { get; set; }
}
