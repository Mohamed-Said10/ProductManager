using MediatR;
using ProductManager.Application.Products.DTOs;

namespace ProductManager.Application.Products.Queries;

public record GetProductByIdQuery : IRequest<ProductDto>
{
    public int Id { get; set; }
}