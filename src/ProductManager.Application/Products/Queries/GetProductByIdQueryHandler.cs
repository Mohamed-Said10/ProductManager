using AutoMapper;
using MediatR;
using ProductManager.Application.Products.DTOs;
using ProductManager.Domain.Interfaces;

namespace ProductManager.Application.Products.Queries;

public class GetProductByIdQueryHandler : IRequestHandler<GetProductByIdQuery, ProductDto>
{
    private readonly IProductRepository _productRepository;
    private readonly IMapper _mapper;

    public GetProductByIdQueryHandler(IProductRepository productRepository, IMapper mapper)
    {
        _productRepository = productRepository;
        _mapper = mapper;
    }

    public async Task<ProductDto> Handle(GetProductByIdQuery request, CancellationToken cancellationToken)
    {
        var product = await _productRepository.GetByIdAsync(request.Id, cancellationToken);

        if (product == null)
        {
            throw new Exception($"Product with ID {request.Id} not found.");
        }

        return _mapper.Map<ProductDto>(product);
    }
}