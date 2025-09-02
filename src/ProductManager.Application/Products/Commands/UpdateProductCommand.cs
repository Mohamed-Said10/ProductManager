using MediatR;
using ProductManager.Application.Products.DTOs;

namespace ProductManager.Application.Products.Commands;

public record UpdateProductCommand : IRequest<ProductDto>
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public int Stock { get; set; }
}