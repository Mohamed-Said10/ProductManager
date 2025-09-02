using AutoMapper;
using MediatR;
using ProductManager.Application.Products.DTOs;
using ProductManager.Domain.Entities;
using ProductManager.Domain.Interfaces;

namespace ProductManager.Application.Products.Commands;

public class CreateProductCommandHandler : IRequestHandler<CreateProductCommand, ProductDto>
{
    private readonly IProductRepository _productRepository;
    private readonly IMapper _mapper;

    public CreateProductCommandHandler(IProductRepository productRepository, IMapper mapper)
    {
        _productRepository = productRepository;
        _mapper = mapper;
    }

    public async Task<ProductDto> Handle(CreateProductCommand request, CancellationToken cancellationToken)
    {
        Console.WriteLine("=== CreateProductCommandHandler: Starting ===");
        Console.WriteLine($"Request: Name={request.Name}, Price={request.Price}, Stock={request.Stock}");

        var product = new Product
        {
            Name = request.Name,
            Description = request.Description,
            Price = request.Price,
            Stock = request.Stock
        };

        Console.WriteLine($"Created product entity: ID={product.Id}, Name={product.Name}");

        try
        {
            await _productRepository.AddAsync(product, cancellationToken);
            Console.WriteLine($"AddAsync completed. Product ID after add: {product.Id}");

            var changesSaved = await _productRepository.SaveChangesAsync(cancellationToken);
            Console.WriteLine($"SaveChanges completed. Changes saved: {changesSaved}");
            Console.WriteLine($"Product ID after save: {product.Id}");

            var result = _mapper.Map<ProductDto>(product);
            Console.WriteLine($"Mapped result: ID={result.Id}, Name={result.Name}");
            Console.WriteLine("=== CreateProductCommandHandler: Completed Successfully ===");

            return result;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"=== ERROR in CreateProductCommandHandler ===");
            Console.WriteLine($"Exception: {ex.Message}");
            Console.WriteLine($"StackTrace: {ex.StackTrace}");
            throw;
        }
    }
}