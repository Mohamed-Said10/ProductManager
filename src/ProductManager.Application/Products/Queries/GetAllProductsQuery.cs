using MediatR;
using ProductManager.Application.Products.DTOs;

namespace ProductManager.Application.Products.Queries;

// This query request returns a List of ProductDto objects
public record GetAllProductsQuery : IRequest<List<ProductDto>>;