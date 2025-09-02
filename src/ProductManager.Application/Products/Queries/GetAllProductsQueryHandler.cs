using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using ProductManager.Application.Products.DTOs;
using ProductManager.Domain.Interfaces;

namespace ProductManager.Application.Products.Queries;

// The handler must implement IRequestHandler< [Request Type], [Return Type] >
public class GetAllProductsQueryHandler : IRequestHandler<GetAllProductsQuery, List<ProductDto>>
{
    private readonly IProductRepository _productRepository;
    private readonly IMapper _mapper;

    // Dependency Injection provides the repository and mapper
    public GetAllProductsQueryHandler(IProductRepository productRepository, IMapper mapper)
    {
        _productRepository = productRepository;
        _mapper = mapper;
    }

    public async Task<List<ProductDto>> Handle(GetAllProductsQuery request, CancellationToken cancellationToken)
    {
        // 1. Fetch the data from the database using the repository
        var products = await _productRepository.GetAllAsync(cancellationToken);

        // 2. Map the Domain Entities to DTOs and return the list
        return _mapper.Map<List<ProductDto>>(products);
    }
}