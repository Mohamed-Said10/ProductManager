

namespace ProductManager.Domain.Common;
public abstract class BaseAuditableEntity
{
    public int Id { get; set; } // Primary Key
    public DateTime Created { get; set; }
    public string? CreatedBy { get; set; }
    public DateTime? LastModified { get; set; }
    public string? LastModifiedBy { get; set; }
}
