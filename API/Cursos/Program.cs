using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System.Data;
using System.Data.SqlClient;
using System.Text.Json;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Cursos;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddCors(options =>
{
    options.AddPolicy("MyCorsProfile", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

app.UseCors("MyCorsProfile");


app.MapPost("/login", async (HttpContext context) =>
{
    var prm = await System.Text.Json.JsonSerializer.DeserializeAsync<Parms>(context.Request.Body);
    var username = prm.User;
    var password = prm.Password;

    var biblio = new Biblio();
    var ds = new DataSet();
    var isAuthenticated = biblio.Login(username, password, ref ds);

    if (isAuthenticated)
    {
        await context.Response.WriteAsync("Login Successful wag");


        // Faça algo com o DataSet, se necessário
    }
    else
    {
        await context.Response.WriteAsync("Invalid username or password teste");
    }
});


app.MapPost("/curso", async (HttpContext context) =>
{
    var biblio = new Biblio();
    var ds = biblio.GetCourses();

    if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
    {
        // Converter o DataSet para JSON

        string json = JsonConvert.SerializeObject(ds.Tables[0]);

        await context.Response.WriteAsync(json);
    }
    else
    {
        await context.Response.WriteAsync("No courses found.");
    }
});

app.MapPost("/curso/{id}", async (HttpContext context) =>
{
    // Obter o ID do curso da rota
    string id = context.Request.RouteValues["id"].ToString();

    var biblio = new Biblio();
    var ds = biblio.GetCourseById(id);

    if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
    {
        // Converter o DataSet para JSON
        string json = JsonConvert.SerializeObject(ds.Tables[0]);

        await context.Response.WriteAsync(json);
    }
    else
    {
        await context.Response.WriteAsync("Course not found.");
    }
});


app.Run();

public class Parms
{
    public string User { get; set; }
    public string Password { get; set; }
}


