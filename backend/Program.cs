using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using student_information_system.Models;
using student_information_system.Services;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// 添加 CORS 服務
var allowedOrigins = builder.Configuration.GetSection("AllowedOrigins").Get<string[]>();
builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactApp", policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// JWT Token配置
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true, // 驗證發行者
            ValidIssuer = builder.Configuration["JwtSettings:Issuer"], // 發行者
            ValidateAudience = true, // 驗證受眾
            ValidAudience = builder.Configuration["JwtSettings:Audience"], // 受眾
            ValidateLifetime = true, // 驗證有效期
            ValidateIssuerSigningKey = true, // 驗證簽名金鑰
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["JwtSettings:Key"])) // 簽名金鑰
        };
    });

// Add services to the container.
builder.Services.AddControllers();

// MS SQL DI
builder.Services.AddDbContext<Std_info_sysContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultDatabase")));
builder.Services.AddScoped<ISecurityService, SecurityService>(); // 添加安全服務 DI 依賴注入

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseHttpsRedirection();

// 啟用 CORS - 注意位置很重要，必須在 UseRouting 之後，UseAuthorization 之前
app.UseCors("ReactApp");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
