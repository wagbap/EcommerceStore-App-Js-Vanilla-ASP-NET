using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cursos
{
    public class Utils
    {
        public class INIFile
        {
            public string FileName { get; set; }

            public INIFile(string fileName) { FileName = fileName; }

            public string ReadKey(string keyName)
            {
                StreamReader strmIn = null;
                string result = "";

                try
                {
                    if (File.Exists(FileName))
                    {
                        strmIn = new StreamReader(FileName);

                        string? line;
                        while ((line = strmIn.ReadLine()) != null)
                        {
                            if (line.StartsWith(keyName + "="))
                            {
                                result = line.Substring((keyName + "=").Length);
                                break;
                            }
                        }
                        strmIn.Close();
                    }
                    else
                    {
                        throw new Exception("File not found.");
                    }
                }
                catch (Exception ex)
                {
                    throw new Exception(ex.Message);
                }
                finally
                {
                    try { strmIn.Close(); } catch { }
                }

                return result;
            }

            public void WriteKey(string keyName, string keyValue)
            {
                StreamReader strmIn = null;
                StreamWriter strmOut = null;

                try
                {
                    if (File.Exists(FileName))
                    {
                        strmIn = new StreamReader(FileName);
                        List<string> fileOut = new List<string>();
                        string? line;
                        while ((line = strmIn.ReadLine()) != null)
                        {
                            if (line.StartsWith(keyName + "="))
                            {
                                fileOut.Add(keyName + "=" + keyValue);
                            }
                            else
                            {
                                fileOut.Add(line);
                            }
                        }
                        strmIn.Close();

                        int index = fileOut.FindIndex(line => line.StartsWith(keyName + "="));

                        strmOut = new StreamWriter(FileName);
                        if (index != -1)
                        {
                            fileOut[index] = keyName + "=" + keyValue;
                        }
                        else
                        {
                            fileOut.Add(keyName + "=" + keyValue);
                        }
                        foreach (var ln in fileOut) { strmOut.WriteLine(ln); }

                        strmOut.Close();
                    }
                    else
                    {
                        throw new Exception("File not found.");
                    }
                }
                catch (Exception ex)
                {
                    throw new Exception(ex.Message);
                }
                finally
                {
                    try { strmIn.Close(); } catch { }
                    try { strmOut.Close(); } catch { }
                }
            }

            public void DeleteKey(string keyName)
            {
                StreamReader strmIn = null;
                StreamWriter strmOut = null;
                try
                {
                    if (File.Exists(FileName))
                    {
                        strmIn = new StreamReader(FileName);
                        List<string> fileOut = new List<string>();
                        string? line;
                        while ((line = strmIn.ReadLine()) != null)
                        {
                            if (!line.StartsWith(keyName + "="))
                            {
                                fileOut.Add(line);
                            }
                        }
                        strmIn.Close();

                        strmOut = new StreamWriter(FileName);
                        foreach (var ln in fileOut) { strmOut.WriteLine(ln); }
                        strmOut.Close();
                    }
                    else
                    {
                        throw new Exception("File not found.");
                    }
                }
                catch (Exception ex)
                {
                    throw new Exception(ex.Message);
                }
                finally
                {
                    try { strmIn.Close(); } catch { }
                    try { strmOut.Close(); } catch { }
                }
            }
        }

        public static string UT_DuplicaPlicas(string s)
        {
            return "'" + s + "'";
        }

        //Conversão de DataSet para List<Dictionary<string, Object>> Feito por Dmytro
        public static List<Dictionary<string, Object>> DataSetToList(DataSet ds)
        {
            List<Dictionary<string, Object>> lst = new List<Dictionary<string, Object>>();

            if (ds != null && ds.Tables.Count > 0)
            {
                DataTable dataTable = ds.Tables[0];

                foreach (DataRow row in dataTable.Rows)
                {
                    Dictionary<string, Object> rowDict = new Dictionary<string, Object>();

                    foreach (DataColumn col in dataTable.Columns)
                    {
                        rowDict.Add(col.ColumnName, row[col]);
                    }

                    lst.Add(rowDict);
                }
            }

            return lst;
        }


    }
}
