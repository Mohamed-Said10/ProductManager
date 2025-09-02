using MediatR;
using ProductManager.Domain.Interfaces;

namespace ProductManager.Application.Products.Commands;

public class DeleteProductCommandHandler : IRequestHandler<DeleteProductCommand, bool>
{
    private readonly IProductRepository _productRepository;

    public DeleteProductCommandHandler(IProductRepository productRepository)
    {
        _productRepository = productRepository;
    }

    public async Task<bool> Handle(DeleteProductCommand request, CancellationToken cancellationToken)
    {
        var product = await _productRepository.GetByIdAsync(request.Id, cancellationToken);

        if (product == null)
        {
            return false;
        }

        _productRepository.Delete(product);
        await _productRepository.SaveChangesAsync(cancellationToken);

        return true;
    }
}