using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace Cursos
{
    public class Biblio
    {
        public bool Login(string user, string pwd, ref DataSet ds)
        {
            ds = Login(user, pwd);

            return ds.Tables[0].Rows.Count > 0 ? true : false;
        }

        public DataSet Login(string user, string pwd)
        {
            SqlConnection cn = null;
            DataSet ds = null;

            try
            {
                string currentDirectory = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);
                string filePath = Path.Combine(currentDirectory, "ConsoleADONET1.ini");
                Utils.INIFile ini = new Utils.INIFile(filePath);


                string cnString = ini.ReadKey("Connection_Biblio");
                //string connectionString = "Server=.;Database=courses;Trusted_Connection=True;";

                string qry = "SELECT * FROM Login WHERE [User]=" + Utils.UT_DuplicaPlicas(user) + " AND [Password]=" + Utils.UT_DuplicaPlicas(pwd);
                ds = BD.ExecutarSQL(cnString, qry);

                if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                {
                    // Login successful
                    Console.WriteLine("Login successful!");
                }
                else
                {
                    // Login failed
                    Console.WriteLine("Invalid username or password. Please try again.");
                }
            }
            catch (Exception ex)
            {
                // Error occurred during login
                Console.WriteLine("An error occurred during login: " + ex.Message);
                throw new Exception(ex.Message);
            }
            finally
            {
                // Cleanup code here (if any)
            }

            return ds;
        }


        public DataSet GetCourses()
        {
            SqlConnection cn = null;
            DataSet ds = null;

            try
            {
                string currentDirectory = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);
                string filePath = Path.Combine(currentDirectory, "ConsoleADONET1.ini");
                Utils.INIFile ini = new Utils.INIFile(filePath);

                string cnString = ini.ReadKey("Connection_Biblio");
                //string connectionString = "Server=.;Database=courses;Trusted_Connection=True;";


                string qry = @"SELECT Cursos.ISBN, Cursos.nome AS Curso, Cursos.imagem AS FotoCapa, 
                                     CONCAT(Autor.Nome, ' ', Autor.Apelido) AS Autor, 
                                     Categoria.nome AS Categoria, Cursos.preco AS Preço, Valor AS Avaliação,   
                                     Promocao.Nome AS Promoção,  Promocao.ValorPercentagem AS Percentagem
                    FROM Cursos
                    INNER JOIN Autor ON Cursos.AutorID = Autor.id
                    INNER JOIN Categoria ON Categoria.id = Cursos.CategoryID
                    INNER JOIN Promocao ON Cursos.PromotionID = Promocao.id
                    INNER JOIN Rating ON Cursos.RatingID = Rating.id";


                ds = BD.ExecutarSQL(cnString, qry);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            finally
            {
            }

            return ds;
        }

        public DataSet GetCourseById(string id)
        {
            SqlConnection cn = null;
            DataSet ds = null;

            try
            {
                string currentDirectory = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);
                string filePath = Path.Combine(currentDirectory, "ConsoleADONET1.ini");
                Utils.INIFile ini = new Utils.INIFile(filePath);

                string cnString = ini.ReadKey("Connection_Biblio");
                //string connectionString = "Server=.;Database=courses;Trusted_Connection=True;";

                string qry = $@"SELECT Cursos.ISBN, Cursos.nome AS Curso, Cursos.imagem AS FotoCapa, 
                                CONCAT(Autor.Nome, ' ', Autor.Apelido) AS Autor, 
                                Categoria.nome AS Categoria, Cursos.preco AS Preço, Valor AS Avaliação,   
                                Promocao.Nome AS Promoção,  Promocao.ValorPercentagem AS Percentagem
                        FROM Cursos
                        INNER JOIN Autor ON Cursos.AutorID = Autor.id
                        INNER JOIN Categoria ON Categoria.id = Cursos.CategoryID
                        INNER JOIN Promocao ON Cursos.PromotionID = Promocao.id
                        INNER JOIN Rating ON Cursos.RatingID = Rating.id
                        WHERE Cursos.ISBN = {id}";

                ds = BD.ExecutarSQL(cnString, qry);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            finally
            {
                // Cleanup code here (if any)
            }

            return ds;
        }



    }
}
 