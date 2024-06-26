import GlobalStyle from "./styles/global";
import styled from "styled-components";
import Form from "./components/Formulario.js";
import Grid from "./components/Grid";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';


const Container = styled.div`
  width: 100%;
  max-width: 800px;
  margin-top: 20px;
  display: flex;
  flex-direction: column;

  align-items: center;
  gap: 10px;
`;

const Title = styled.h2``;

function App() {
  const [users, setUsers] = useState([]);
  const [onEdit, setOnEdit] = useState(null);
  

  const getUsers = async () => {
    try {
      const res = await axios.get("http://localhost:8840");
      setUsers(res.data.sort((a, b) => (a.nome > b.nome ? 1 : -1)));
    } catch (error) {
      toast.error(error);
    }
  };

  useEffect(() => {
    getUsers();
  }, [setUsers]);



  return (
    <>

    <Container>
      <Title>Contatos</Title>
      <Form onEdit={onEdit} setOnEdit={setOnEdit} getUsers={getUsers} />
      <Grid users={users} setUsers={setUsers} setOnEdit={setOnEdit}/>

    </Container>
    <GlobalStyle/>
    
    </>
    
    
  );
}

export default App;
