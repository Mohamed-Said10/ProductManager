using MediatR;
using ProductManager.Application.Products.DTOs;

namespace ProductManager.Application.Products.Commands;

public record CreateProductCommand : IRequest<ProductDto>
{
    public required string Name { get; set; }
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public int Stock { get; set; }
}