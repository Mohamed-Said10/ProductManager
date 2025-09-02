using Microsoft.EntityFrameworkCore;
using ProductManager.Application;
using ProductManager.Infrastructure;
using ProductManager.Infrastructure.Data;
using Microsoft.Extensions.Logging;

try
{
    var builder = WebApplication.CreateBuilder(args);

    // Add services to the container.
    builder.Services.AddControllers();
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen();

    // Register layers from our Clean Architecture
    builder.Services.AddApplication();
    builder.Services.AddInfrastructure(builder.Configuration);

    var app = builder.Build();

    // Apply pending migrations with retry logic
    using (var scope = app.Services.CreateScope())
    {
        var services = scope.ServiceProvider;
        var logger = services.GetRequiredService<ILogger<Program>>();
        var dbContext = services.GetRequiredService<ApplicationDbContext>();

        var maxRetries = 10;
        var retryDelay = 5000; // 5 seconds

        for (var retry = 1; retry <= maxRetries; retry++)
        {
            try
            {
                logger.LogInformation("Attempting database migration (attempt {Retry}/{MaxRetries})", retry, maxRetries);

                // Check if database is accessible first
                if (dbContext.Database.CanConnect())
                {
                    logger.LogInformation("Database connection successful, applying migrations...");
                    dbContext.Database.Migrate();
                    logger.LogInformation("Migrations applied successfully");
                    break;
                }
                else
                {
                    logger.LogWarning("Database not accessible yet");
                    throw new Exception("Database not accessible");
                }
            }
            catch (Exception ex) when (retry < maxRetries)
            {
                logger.LogWarning("Migration attempt {Retry} failed: {Message}", retry, ex.Message);
                logger.LogWarning("Retrying in {Delay}ms...", retryDelay);
                await Task.Delay(retryDelay);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Failed to apply migrations after {MaxRetries} attempts", maxRetries);
                // Don't crash the app - let it start without migrations
                logger.LogWarning("Application starting without migrations. Manual migration may be required.");
                break;
            }
        }
    }

    // Configure the HTTP request pipeline.
    if (app.Environment.IsDevelopment())
    {
        app.UseSwagger();
        app.UseSwaggerUI();
    }

    app.UseHttpsRedirection();

    // Add CORS for frontend development
    app.UseCors(policy => policy
        .AllowAnyOrigin()
        .AllowAnyMethod()
        .AllowAnyHeader());

    app.Use(async (context, next) =>
    {
        Console.WriteLine($"Request: {context.Request.Method} {context.Request.Path}");
        await next();
        Console.WriteLine($"Response: {context.Response.StatusCode}");
    });

    app.MapControllers();

    // Health check endpoint
    app.MapGet("/api/health", () =>
    {
        return Results.Ok(new
        {
            status = "Healthy",
            timestamp = DateTime.UtcNow,
            message = "API is running"
        });
    });

    app.MapGet("/api/test", () => "Test endpoint works!");

    Console.WriteLine("Application starting successfully...");
    app.Run();
}
catch (Exception ex)
{
    Console.WriteLine($"Fatal startup error: {ex}");
    throw;
}