using AutoMapper;
using ProductManager.Application.Products.DTOs;
using ProductManager.Domain.Entities;

namespace ProductManager.Application.Common;

// AutoMapper will automatically discover this class
public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // Create a mapping rule from Product (Source) to ProductDto (Destination)
        CreateMap<Product, ProductDto>();
        // You can also reverse the map if needed: .ReverseMap();
    }
}