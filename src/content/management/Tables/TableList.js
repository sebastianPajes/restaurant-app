import { useState, useEffect } from 'react';
import axios from 'axios';
import { Auth } from 'aws-amplify';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

const styles = {
  editedRow: {
    backgroundColor: 'lightblue'
  }
};

function TableList() {
  const [tables, setTables] = useState([]);
  const [newTable, setNewTable] = useState({
    code: '',
    size: 0
  });
  const [editingRows, setEditingRows] = useState([]);
  const [editData, setEditData] = useState({
    code: '',
    size: 0
  });
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchTables = async () => {
      try {
        const { idToken } = await Auth.currentSession();
        const response = await axios.get(`${process.env.REACT_APP_API}api/tables`, {
          headers: {
            Authorization: `Bearer ${idToken.jwtToken}`
          }
        });
        const tables = response.data.map(table => ({
          ...table,
          code: table.sk.split('#')[1]
        }));
        setTables(tables);
      } catch (error) {
        console.error(error);
      }
    };
    fetchTables();
  }, []);

  const handleAddTable = async () => {
    try {
      const { idToken } = await Auth.currentSession();
      const formattedTable = {
        ...newTable,
        size: parseInt(newTable.size, 10) 
      }
      const response = await axios.post(`${process.env.REACT_APP_API}api/tables`, formattedTable, {
        headers: {
          Authorization: `Bearer ${idToken.jwtToken}`
        }
      });
      const newTableData = {
        pk: response.data.pk,
        sk: response.data.sk,
        code: response.data.sk.split('#')[1],
        size: response.data.size
      };
      setTables([...tables, newTableData]);
      setNewTable({
        code: '',
        size: 0
      });
    } catch (error) {
        if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
        } else {
        setError("Error al agregar la mesa");
        }
        console.error("Error al agregar la mesa:", error);
    }
  };

  const handleEdit = code => {
    setEditingRows([...editingRows, code]);
    const table = tables.find(table => table.code === code);
    setEditData({
      code,
      size: table.size
    });
  };

  const handleCancel = code => {
    setEditingRows(editingRows.filter(rowCode => rowCode !== code));
  };

  const handleSave = async (code, updatedData) => {
    try {
      const { idToken } = await Auth.currentSession();
      await axios.put(`${process.env.REACT_APP_API}api/tables`, updatedData, {
        headers: {
          Authorization: `Bearer ${idToken.jwtToken}`
        }
      });
      const updatedTables = tables.map(table => {
        if (table.code === code) {
          return { ...table, ...updatedData };
        }
        return table;
      });
      setTables(updatedTables);
      setEditingRows(editingRows.filter(rowCode => rowCode !== code));
    } catch (error) {
        if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
        } else {
        setError("Error al actualizar la mesa");
        }
        console.error("Error al actualizar la mesa:", error);
    }
  };

  const handleDelete = async code => {
    try {
      const { idToken } = await Auth.currentSession();
      await axios.delete(`${process.env.REACT_APP_API}api/tables/${code}`, {
        headers: {
          Authorization: `Bearer ${idToken.jwtToken}`
        }
      });
      const updatedTables = tables.filter(table => table.code !== code);
      setTables(updatedTables);
    } catch (error) {
        console.error(error);
    }
  };

  const handleInputChange = e => {
    setNewTable({ ...newTable, [e.target.name]: e.target.value });
  };

  const handleEditInputChange = (code, e) => {
    const { name, value } = e.target;
    setEditData((prevData) => ({
      ...prevData,
      [name]: name === "size" ? parseInt(value, 10) : value,
    }));
  };

  const clearError = () => {
    setError(null);
  };
  

  if (!tables || tables.length === 0) return <div>Cargando...</div>;

  return (
    <TableContainer>
      {error && (
        <div
            style={{
            backgroundColor: "red",
            color: "white",
            padding: "10px",
            borderRadius: "5px",
            marginBottom: "10px",
            }}
        >
            {error}
        </div>
        )}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Código</TableCell>
            <TableCell>Ocupado</TableCell> 
            <TableCell>Tamaño</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tables.map(table => (
            <TableRow key={table.code} style={editingRows.includes(table.code) ? styles.editedRow : null}>
              <TableCell>{table.code}</TableCell>
              <TableCell>
                {table.partyId ? 'Sí' : 'No'}
              </TableCell>
              <TableCell>
                {editingRows.includes(table.code) ? (
                  <input type="number" name="size" value={editData.size} onChange={(e) => handleEditInputChange(table.code, e)} />
                ) : (
                  table.size
                )}
              </TableCell>
              <TableCell>
                {editingRows.includes(table.code) ? (
                  <>
                    <button onClick={() => handleSave(table.code, editData)}>Guardar</button>
                    <button onClick={() => handleCancel(table.code)}>Cancelar</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEdit(table.code)}>Editar</button>
                    <button onClick={() => handleDelete(table.code)}>Borrar</button>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell>
              <input type="text" name="code" value={newTable.code} onChange={handleInputChange} onFocus={clearError} />
            </TableCell>
            <TableCell>No</TableCell>
            <TableCell>
              <input type="number" name="size" value={newTable.size} onChange={handleInputChange} onFocus={clearError}  />
            </TableCell>
            <TableCell>
              <button onClick={handleAddTable}>Agregar Mesa</button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default TableList;
