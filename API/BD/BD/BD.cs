using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.SqlTypes;

namespace Cursos
{
    public class BD
    {
        public static SqlConnection Abrir(string s)
        {
            SqlConnection cn;

            try
            {
                cn = new SqlConnection(s);
                cn.Open();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }

            return cn;
        }

        public static void Fechar(ref SqlConnection cn)
        {
            try { cn.Close(); cn.Dispose(); cn = null; } catch { }
        }

        public static void FecharDS(ref DataSet ds)
        {
            try { ds.Dispose(); ds = null; } catch { }
        }

        public static DataSet ExecutarSQL(string connectionString, string SQL, SqlTransaction pTrans = null)
        {
            SqlConnection cn = Abrir(connectionString);

            DataSet ds = ExecutarSQL(cn, SQL, pTrans);

            Fechar(ref cn);

            return ds;
        }

        public static DataSet ExecutarSQL(SqlConnection cn, string SQL, SqlTransaction pTrans = null)
        {
            SqlDataAdapter da = new SqlDataAdapter(SQL, cn);
            if (pTrans != null)
            {
                da.SelectCommand.Transaction = pTrans;
            }

            DataSet ds = new DataSet();

            da.Fill(ds);

            return ds;
        }

        public static int ExecutarDDL(SqlConnection cn, string SQL, SqlTransaction pTrans = null)
        {
            int result = 0;

            SqlCommand sqlCmd = cn.CreateCommand();
            sqlCmd.CommandText = SQL;
            if (pTrans != null)
            {
                sqlCmd.Transaction = pTrans;
            }
            result = sqlCmd.ExecuteNonQuery();

            return result;
        }
        public static int ExecutarDDL(string connectionString, string SQL, SqlTransaction pTrans = null)
        {
            int result = 0;

            SqlConnection cn = Abrir(connectionString);

            result = ExecutarDDL(cn, SQL, pTrans);

            Fechar(ref cn);

            return result;
        }

        public void ExecutarSP(string connectionString, string spName, SqlParameter[] parameters, SqlTransaction pTrans = null)
        {
            SqlConnection cn = Abrir(connectionString);

            ExecutarSP(cn, spName, parameters, pTrans);

            Fechar(ref cn);
        }

        public void ExecutarSP(SqlConnection cn, string spName, SqlParameter[] parameters, SqlTransaction pTrans = null)
        {
            SqlCommand cmd = new SqlCommand(spName, cn);
            cmd.CommandType = CommandType.StoredProcedure;

            if (pTrans != null)
            {
                cmd.Transaction = pTrans;
            }

            if (parameters != null)
            {
                cmd.Parameters.AddRange(parameters);
            }

            try
            {
                cn.Open();
                cmd.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public T ExecutarSP<T>(string connectionString, string spName, SqlParameter[] parameters, SqlTransaction pTrans = null)
        {
            SqlConnection cn = Abrir(connectionString);

            var result = ExecutarSP<T>(cn, spName, parameters, pTrans);

            Fechar(ref cn);

            return (T)Convert.ChangeType(result, typeof(T));
        }

        public T ExecutarSP<T>(SqlConnection cn, string spName, SqlParameter[] parameters, SqlTransaction pTrans = null)
        {
            SqlCommand cmd = new SqlCommand(spName, cn);
            cmd.CommandType = CommandType.StoredProcedure;

            if (pTrans != null)
            {
                cmd.Transaction = pTrans;
            }

            if (parameters != null)
            {
                cmd.Parameters.AddRange(parameters);
            }

            try
            {
                cn.Open();
                var result = cmd.ExecuteScalar();

                return (T)Convert.ChangeType(result, typeof(T));
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
                //return default(T); // Return the default value for the type T in case of an error
            }

        }

        public DataSet? ExecutarSQL(string cnString, string qry)
        {
            throw new NotImplementedException();
        }
    }
}
