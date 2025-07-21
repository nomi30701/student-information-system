using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using student_information_system.Models;
using student_information_system.Services;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// �K�[ CORS �A��
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

// JWT Token�t�m
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true, // ���ҵo���
            ValidIssuer = builder.Configuration["JwtSettings:Issuer"], // �o���
            ValidateAudience = true, // ���Ҩ���
            ValidAudience = builder.Configuration["JwtSettings:Audience"], // ����
            ValidateLifetime = true, // ���Ҧ��Ĵ�
            ValidateIssuerSigningKey = true, // ����ñ�W���_
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["JwtSettings:Key"])) // ñ�W���_
        };
    });

// Add services to the container.
builder.Services.AddControllers();

// MS SQL DI
builder.Services.AddDbContext<Std_info_sysContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultDatabase")));
builder.Services.AddScoped<ISecurityService, SecurityService>(); // �K�[�w���A�� DI �̿�`�J

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseHttpsRedirection();

// �ҥ� CORS - �`�N��m�ܭ��n�A�����b UseRouting ����AUseAuthorization ���e
app.UseCors("ReactApp");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
