import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { FaTrash, FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactPaginate from 'react-paginate';

const InputArea = styled.div`
  display: flex;
  flex-direction: column;
`;



const Input = styled.input`
  width: 120px;
  padding: 0 10px;
  border: 1px solid #bbb;
  border-radius: 5px;
  height: 40px;
`;

const EditButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center; /* Para centralizar verticalmente */
  margin-top: 15px;
  margin-left: 30px;
  margin-bottom: 20px;
`;

const PreviousButton = styled.div`
  margin-right: 30px; /* Adiciona margem à direita do botão "Anterior" */
`;

const EditIcon = styled(FaEdit)`
  margin-right: 50px; 
`;

const DeleteIcon = styled(FaTrash)`
  margin-right: 50px; 
  gap: 20px;
`;

const Grid = ({ users, setUsers, setOnEdit }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(0);
  const usersPerPage = 5;
  const pagesVisited = pageNumber * usersPerPage;

  const displayUsers = users
    .slice(pagesVisited, pagesVisited + usersPerPage)
    .map((item, i) => (
      <tr key={i}>
        <td>{i + 1}</td>
        <td>{item.NOME}</td>
        <td>{item.IDADE}</td>
        <td>{item.NUMERO}</td>
        <td>
          <EditIcon onClick={() => handleEdit(item)} />
          <DeleteIcon onClick={() => handleDelete(item.ID)} />
        </td>
      </tr>
    ));

  const pageCount = Math.ceil(users.length / usersPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        let url = "http://localhost:8840/";
        if (searchTerm.trim() !== "") {
          url = `http://localhost:8840/search?q=${searchTerm}`;
        }
        const response = await axios.get(url);
        setUsers(response.data);
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
      }
    };

    fetchUsers();
  }, [searchTerm, setUsers]);

  const handleDelete = async (ID) => {
    try {
      await axios.delete("http://localhost:8840/" + ID);
      const newArray = users.filter((user) => user.ID !== ID);
      setUsers(newArray);
      toast.success("Contato excluído com sucesso.");
    } catch (error) {
      console.error("Erro ao excluir contato:", error);
      toast.error("Erro ao excluir contato.");
    }
  };

  const handleEdit = (ID) => {
    // Define o contato em edição
    setOnEdit(ID);
  };

  return (
    <div>
      <InputArea>
        <Input
          id="busca"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: "200px" }}
          placeholder="Digite sua busca aqui"
        />
      </InputArea>

      <table className="table" style={{ width: "80vw", margin: "0 auto", height: "25vw", marginTop: "15px", color: "green" }}>
        <thead className="table table-dark">
          <tr>
            <th scope="col">#</th>
            <th scope="col">Nome</th>
            <th scope="col">Idade</th>
            <th scope="col">Telefone</th>
            <th scope="col">Ações</th>
          </tr>
        </thead>
        <tbody>
          {displayUsers}
        </tbody>
      </table>

      <PaginationContainer>
        <PreviousButton>
          <ReactPaginate
            previousLabel={"Anterior"}
            nextLabel={"Próximo"}
            pageCount={pageCount}
            onPageChange={changePage}
            containerClassName={"pagination"}
            previousLinkClassName={"pagination__link"}
            nextLinkClassName={"pagination__link"}
            disabledClassName={"pagination__link--disabled"}
            activeClassName={"pagination__link--active"}
          />
        </PreviousButton>
      </PaginationContainer>
    </div>
  );
};

export default Grid;
