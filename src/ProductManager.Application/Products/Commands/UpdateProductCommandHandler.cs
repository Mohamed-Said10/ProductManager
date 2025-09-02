using AutoMapper;
using MediatR;
using ProductManager.Application.Products.DTOs;
using ProductManager.Domain.Interfaces;

namespace ProductManager.Application.Products.Commands;

public class UpdateProductCommandHandler : IRequestHandler<UpdateProductCommand, ProductDto>
{
    private readonly IProductRepository _productRepository;
    private readonly IMapper _mapper;

    public UpdateProductCommandHandler(IProductRepository productRepository, IMapper mapper)
    {
        _productRepository = productRepository;
        _mapper = mapper;
    }

    public async Task<ProductDto> Handle(UpdateProductCommand request, CancellationToken cancellationToken)
    {
        var product = await _productRepository.GetByIdAsync(request.Id, cancellationToken);

        if (product == null)
        {
            throw new Exception($"Product with ID {request.Id} not found.");
        }

        product.Name = request.Name;
        product.Description = request.Description;
        product.Price = request.Price;
        product.Stock = request.Stock;

        _productRepository.Update(product);
        await _productRepository.SaveChangesAsync(cancellationToken);

        return _mapper.Map<ProductDto>(product);
    }
}