using MediatR;

namespace ProductManager.Application.Products.Commands;

public record DeleteProductCommand : IRequest<bool>
{
    public int Id { get; set; }
}