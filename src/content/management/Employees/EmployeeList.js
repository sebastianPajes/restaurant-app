import { useState, useEffect } from 'react';
import axios from 'axios';
import { Auth } from 'aws-amplify';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

const styles = {
  editedRow: {
    backgroundColor: 'lightblue'
  }
};

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [newEmployee, setNewEmployee] = useState({
    email: '',
    phone: '',
    firstName: '',
    lastName: ''
  });
  const [editingRows, setEditingRows] = useState([]);
  const [editData, setEditData] = useState({
    email: '',
    phone: '',
    firstName: '',
    lastName: ''
  });

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const { idToken } = await Auth.currentSession();
        const response = await axios.get(`${process.env.REACT_APP_API}api/employees`, {
          headers: {
            Authorization: `Bearer ${idToken.jwtToken}`
          }
        });
        const employees = response.data.data.employees.map(employee => ({
            ...employee,
            sk: employee.sk.split('#')[1]
          }));
        setEmployees(employees);
      } catch (error) {
        console.error(error);
      }
    };
    fetchEmployees();
  }, []);

  const handleAddEmployee = async () => {
    try {
      const { idToken } = await Auth.currentSession();
      const response = await axios.post(`${process.env.REACT_APP_API}api/employees`, newEmployee, {
        headers: {
          Authorization: `Bearer ${idToken.jwtToken}`
        }
      });
      const { employeeParam } = response.data.data;
      const newEmployeeData = {
        sk: employeeParam.primaryKeys.id,
        firstName: employeeParam.attr.firstName,
        lastName: employeeParam.attr.lastName,
        email: employeeParam.attr.email,
        phone: employeeParam.attr.phone
      };
      setEmployees([...employees, newEmployeeData]);
      setNewEmployee({
        email: '',
        phone: '',
        firstName: '',
        lastName: ''
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = id => {
    setEditingRows([...editingRows, id]);
    const employee = employees.find(employee => employee.sk === id)
    setEditData({
        id,
        email: employee.email,
        phone: employee.phone,
        firstName: employee.firstName,
        lastName: employee.lastName
    });
  };

  const handleCancel = id => {
    setEditingRows(editingRows.filter(rowId => rowId !== id));
  };

  const handleSave = async (id, updatedData) => {
    try {
      const { idToken } = await Auth.currentSession();
      console.log(id, updatedData)
      await axios.post(`${process.env.REACT_APP_API}api/employees`, updatedData, {
        headers: {
          Authorization: `Bearer ${idToken.jwtToken}`
        }
      });
      const updatedEmployees = employees.map(employee => {
        if (employee.sk === id) {
          return { ...employee, ...updatedData };
        }
        return employee;
      });
      setEmployees(updatedEmployees);
      setEditingRows(editingRows.filter(rowId => rowId !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async id => {
    try {
      const { idToken } = await Auth.currentSession();
      await axios.delete(`${process.env.REACT_APP_API}api/employees/${id}`, {
        headers: {
          Authorization: `Bearer ${idToken.jwtToken}`
        }
      });
      const updatedEmployees = employees.filter(employee => employee.sk !== id);
      setEmployees(updatedEmployees);
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = e => {
    setNewEmployee({ ...newEmployee, [e.target.name]: e.target.value });
  };

  const handleEditInputChange = (id, e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Nombre</TableCell>
            <TableCell>Apellido</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Celular</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {employees.map(employee => (
            <TableRow key={employee.sk} style={editingRows.includes(employee.sk) ? styles.editedRow : null}>
              <TableCell>{employee.sk}</TableCell>
              <TableCell>
                {editingRows.includes(employee.sk) ? (
                  <input type="text" name="firstName" value={editData.firstName} onChange={(e) => handleEditInputChange(employee.sk, e)} />
                ) : (
                  employee.firstName
                )}
              </TableCell>
              <TableCell>
                {editingRows.includes(employee.sk) ? (
                  <input type="text" name="lastName" value={editData.lastName} onChange={(e) => handleEditInputChange(employee.sk, e)} />
                ) : (
                  employee.lastName
                )}
              </TableCell>
              <TableCell>
                {editingRows.includes(employee.sk) ? (
                  <input type="email" name="email" value={editData.email} onChange={(e) => handleEditInputChange(employee.sk, e)} />
                ) : (
                  employee.email
                )}
              </TableCell>
              <TableCell>
                {editingRows.includes(employee.sk) ? (
                  <input type="tel" name="phone" value={editData.phone} onChange={(e) => handleEditInputChange(employee.sk, e)} />
                ) : (
                  employee.phone
                )}
              </TableCell>
              <TableCell>
                {editingRows.includes(employee.sk) ? (
                  <>
                    <button onClick={() => handleSave(employee.sk, editData)}>Guardar</button>
                    <button onClick={() => handleCancel(employee.sk)}>Cancelar</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEdit(employee.sk)}>Editar</button>
                    <button onClick={() => handleDelete(employee.sk)} disabled={employee.isAdmin}>Borrar</button>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell></TableCell>
            <TableCell>
              <input type="text" name="firstName" value={newEmployee.firstName} onChange={handleInputChange} />
            </TableCell>
            <TableCell>
              <input type="text" name="lastName" value={newEmployee.lastName} onChange={handleInputChange} />
            </TableCell>
            <TableCell>
              <input type="email" name="email" value={newEmployee.email} onChange={handleInputChange} />
            </TableCell>
            <TableCell>
              <input type="tel" name="phone" value={newEmployee.phone} onChange={handleInputChange} />
            </TableCell>
            <TableCell>
              <button onClick={handleAddEmployee}>Add Employee</button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default EmployeeList;
