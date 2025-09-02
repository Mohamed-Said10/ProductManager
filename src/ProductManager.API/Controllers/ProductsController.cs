using MediatR;
using Microsoft.AspNetCore.Mvc;
using ProductManager.Application.Products.Commands;
using ProductManager.Application.Products.Queries;

namespace ProductManager.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly ISender _mediator;

    public ProductsController(ISender mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetProducts()
    {
        var query = new GetAllProductsQuery();
        var products = await _mediator.Send(query);
        return Ok(products);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetProduct(int id)
    {
        var query = new GetProductByIdQuery { Id = id };
        var product = await _mediator.Send(query);
        return Ok(product);
    }

    [HttpPost]
    public async Task<IActionResult> CreateProduct(CreateProductCommand command)
    {
        var product = await _mediator.Send(command);
        return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, product);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProduct(int id, [FromBody] Application.Products.DTOs.UpdateProductRequest request)
    {
        // Add debug logging
        Console.WriteLine($"Route ID: {id}");
        Console.WriteLine($"Request Name: {request.Name}");
        Console.WriteLine($"Request Price: {request.Price}");

        try
        {
            var command = new UpdateProductCommand
            {
                Id = id, // Set ID from route parameter
                Name = request.Name,
                Description = request.Description,
                Price = request.Price,
                Stock = request.Stock
            };

            Console.WriteLine($"Command ID: {command.Id}");
            Console.WriteLine($"About to send command to mediator...");

            var product = await _mediator.Send(command);

            Console.WriteLine("Command executed successfully");
            return Ok(product);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error in UpdateProduct: {ex.Message}");
            Console.WriteLine($"Exception Type: {ex.GetType().Name}");
            Console.WriteLine($"Stack trace: {ex.StackTrace}");
            return BadRequest(new { error = ex.Message, type = ex.GetType().Name });
        }
    }



    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProduct(int id)
    {
        var command = new DeleteProductCommand { Id = id };
        var result = await _mediator.Send(command);

        if (!result)
        {
            return NotFound();
        }

        return NoContent();
    }
}