using System.Data;
using Biblio;
using Newtonsoft.Json;
using static System.Net.Mime.MediaTypeNames;
using static Biblio.API;
using static Biblio.AutenticationAPI;


DataSet cursoDS = new DataSet();
DataSet userDS = new DataSet();
DataSet carinhoDS = new DataSet();
DataSet vendidoDS = new DataSet();
DataSet top5 = new DataSet();
DataSet promocaoDS = new DataSet();
DataSet categoriaDS = new DataSet();
DataSet favoritosDS = new DataSet();


Ex1 readBD = new Ex1();

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors(options =>
{
    options.AddPolicy("MyCorsProfile",
        policy =>
        {
            policy
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader();
        });
});

/*JSON Serializer
services.AddControllersWithViews().AddNewtonsoftJson(options =>
options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore)
    .AddNewtonsoftJson(options => options.SerializerSettings.ContractResolver
    = new DefaultContractResolver()); 

services.AddControllers();
// Adicione os serviços ao contêiner.*/

var app = builder.Build();
app.UseCors("MyCorsProfile");

// Configure o pipeline de solicitação HTTP.



app.MapPost("/register", (UserData userData) =>
{
    // Crie uma nova instância do objeto AutenticationAPI
    var authApi = new AutenticationAPI();

    // Use o método InsertUser para tentar inserir o usuário no banco de dados
    bool isRegistered = authApi.InsertUser(userData);

    // Retorne o resultado do registro
    return isRegistered;
});



app.MapPost("/Login", (Prm_Login prmIn) =>
{
    return Gateway.ExecuteLogin(prmIn);
});



app.MapPost("/Cursos", () =>
{
    Ex1 ReadB = new Ex1();
    string result = null;

    try
    {
        bool isDataLoaded = readBD.GetCursos(ref cursoDS); // Carregar os dados no DataSet
        if (!isDataLoaded)
        {
            return null;
        }

        // Verificar se o DataSet possui pelo menos uma tabela
        if (cursoDS.Tables.Count >= 0)
        {
            DataTable table = cursoDS.Tables[0];
            int linhaCount = table.Rows.Count;

            // Criar uma lista para armazenar cada linha da tabela como objecto
            List<object> cursosList = new List<object>();

            for (int i = 0; i < linhaCount; i++)
            {
                DataRow linha = table.Rows[i];

                // Criar um objeto novo para cada coluna
                var cursoObj = new
                {
                    ISBN = linha["ISBN"],
                    Autor = linha["Autor"],
                    Curso = linha["Curso"],
                    FotoCapa = linha["FotoCapa"],
                    Categoria = linha["Categoria"],
                    Preço = linha["Preço"],
                    Avaliação = linha["Avaliação"],
                    Promoção = linha["Promoção"],
                    Percentagem = linha["Percentagem"]
                };

                cursosList.Add(cursoObj);
            }
            // Converter a lista de objetos em JSON
            result = JsonConvert.SerializeObject(cursosList);
        }
        else
        {
            // Se não houver tabelas no DataSet, retornar null
            Console.WriteLine("Não há tabelas no DataSet");
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine(ex.Message);
    }
    return result;
});


app.MapPost("/SetFavoritos", (Favoritos setFavoritos) =>
{
    string userID = setFavoritos.UserID;
    string isbn = setFavoritos.ISBN;
    int isSet = readBD.SetFavoritos(userID, isbn);
    if (isSet == 0) { return false; }

    return true;
});

app.MapPost("/GetFavoritos", (string Cliente_id) => {

    string result = null;

    try
    {
        bool isDataLoaded = readBD.GetFavoritos(ref favoritosDS, Cliente_id);
        if (!isDataLoaded)
        {
            return null;
        }

        // Verificar se o DataSet possui pelo menos uma tabela
        if (favoritosDS.Tables.Count >= 0)
        {
            DataTable table = favoritosDS.Tables[0];
            int linhaCount = table.Rows.Count;

            // Criar uma lista para armazenar cada linha da tabela como objecto
            List<object> favoritosList = new List<object>();

            for (int i = 0; i < linhaCount; i++)
            {
                DataRow linha = table.Rows[i];

                // Criar um objeto novo para cada coluna
                var favoritosObj = new
                {
                    ISBN = linha["curso_ISBN"],
                    Cliente_id = linha["Cliente_id"]
                };

                favoritosList.Add(favoritosObj);
            }
            // Converter a lista de objetos em JSON
            result = JsonConvert.SerializeObject(favoritosList);
        }
        else
        {
            // Se não houver tabelas no DataSet, retornar null
            Console.WriteLine("Sem dados no DB");
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine(ex.Message);
    }
    return result;
});

app.MapPost("/GetCarinho", (string Cliente_id) =>
{

    string result = null;

    try
    {
        bool isDataLoaded = readBD.GetCart(Cliente_id, ref carinhoDS);
        if (!isDataLoaded)
        {
            return null;
        }

        // Verificar se o DataSet possui pelo menos uma tabela
        if (carinhoDS.Tables.Count >= 0)
        {
            DataTable table = carinhoDS.Tables[0];
            int linhaCount = table.Rows.Count;

            // Criar uma lista para armazenar cada linha da tabela como objecto
            List<object> carinhoList = new List<object>();

            for (int i = 0; i < linhaCount; i++)
            {
                DataRow linha = table.Rows[i];

                // Criar um objeto novo para cada coluna
                var carinhoObj = new
                {
                    ISBN = linha["Curso_ISBN"],
                    Cliente_id = linha["Cliente_id"],
                    Quantidade = linha["Quantidade"],
                    Total = linha["Total"]
                };

                carinhoList.Add(carinhoObj);
            }
            // Converter a lista de objetos em JSON
            result = JsonConvert.SerializeObject(carinhoList);
        }
        else
        {
            // Se não houver tabelas no DataSet, retornar null
            Console.WriteLine("Sem dados no DB");
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine(ex.Message);
    }
    return result;
});

app.MapPost("/SetCarinho", (Carinho carinho) =>
{
    string userID = carinho.UserID;
    string isbn = carinho.ISBN;
    int quantidade = carinho.Quantidade;
    int total = carinho.Total;
    int isSet = readBD.SetCart(userID, isbn, quantidade, total);
    if (isSet == 0) { return false; }

    return true;
});

app.MapPost("/ClearCart", (string user) =>
{
    int result = readBD.ClearCart(user);
    if (result != 0)
    {
        carinhoDS.Dispose();
        carinhoDS = null;
    }

    return result;
});


app.MapPost("/Finalizar", (string userID) =>
{
    int result = readBD.finalizarCompra(userID);
    if (result != 0)
    {
        carinhoDS.Dispose();
        carinhoDS = null;
    }
    return result;
});

app.MapPost("/GetSolds", () =>
{
    string result = null;
    bool isSold = readBD.getSolds(ref vendidoDS, ref top5);

    if (isSold)
    {
        if (top5.Tables.Count >= 0)
        {
            DataTable table = top5.Tables[0];
            int linhaCount = table.Rows.Count;

            // Criar uma lista para armazenar cada linha da tabela como objecto
            List<object> top5List = new List<object>();

            for (int i = 0; i < linhaCount; i++)
            {
                DataRow linha = table.Rows[i];

                // Criar um objeto novo para cada coluna
                var top5Obj = new
                {
                    ISBN = linha["curso_ISBN"],
                    Quantidade = linha["Quantidade"]
                };

                top5List.Add(top5Obj);
            }
            // Converter a lista de objetos em JSON
            result = JsonConvert.SerializeObject(top5List);

        }
        else
        {
            // Se não houver tabelas no DataSet, retornar null
            Console.WriteLine("Sem dados no DB");
        }
    }
    else
    {
        // Caso não haja vendas registradas, retornar uma mensagem de erro ou valor nulo
        return "Nenhum registro de vendas encontrado.";
    }
    return result;
});



app.Run();


public class Favoritos
{
    public string UserID { get; set; }
    public string ISBN { get; set; }
}



public class Carinho
{
    public string UserID { get; set; }
    public string ISBN { get; set; }
    public int Quantidade { get; set; }
    public int Total { get; set; }
}


public class LoginDT
{
    public string User { get; set; }
    public string Password { get; set; }
}


