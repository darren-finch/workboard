using backend.Hubs;
using backend.Persistence;
using backend.Persistence.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddCors();
builder.Services.AddSingleton<MockDbContext>();
builder.Services.AddScoped<IBoardRepository, MockBoardRepository>();
builder.Services.AddScoped<IColumnRepository, MockColumnRepository>();
builder.Services.AddScoped<ICardRepository, CardRepository>();
builder.Services.AddLogging(builder => builder.AddConsole());
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSignalR(options =>
{
    options.EnableDetailedErrors = true;
});

var app = builder.Build();

var allowedOriginsEnv = Environment.GetEnvironmentVariable("ALLOWED_ORIGINS");
var allowedOrigins = allowedOriginsEnv is not null
    ? allowedOriginsEnv.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
    : app.Configuration.GetSection("AllowedOrigins").Get<string[]>() ?? Array.Empty<string>();

app.UseCors(builder => builder
    .WithOrigins(allowedOrigins)
    .AllowAnyMethod()
    .AllowAnyHeader()
    .AllowCredentials());

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.MapHub<BoardHub>("/boardHub");

app.Run();

