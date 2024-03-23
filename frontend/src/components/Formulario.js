import axios from "axios";
import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";

const FormContainer = styled.form`
  display: flex;
  align-items: flex-end;
  gap: 10px;
  flex-wrap: wrap;
  background-color: #fff;
  padding: 20px;
  box-shadow: 0px 0px 5px #ccc;
  border-radius: 5px;
`;

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

const Label = styled.label``;

const Button = styled.button`
  padding: 5px;
  cursor: pointer;
  border-radius: 5px;
  border: none;
  background-color: #2c73d2;
  color: white;
  height: 42px;
`;



const Formulario =({ getUsers, onEdit, setOnEdit }) => {
  const ref = useRef();


  useEffect(() => {
    if (onEdit) {
      const user = ref.current;

      user.NOME.value = onEdit.NOME;
      user.IDADE.value = onEdit.IDADE;
      user.NUMERO.value = onEdit.NUMERO;
      
      
    }
  }, [onEdit]);

  const handleSubmit = async (e) => {
  e.preventDefault();

  const user = ref.current;

  if (!user.NOME.value || !user.IDADE.value || !user.NUMERO.value) {
    return toast.warn("Preencha todos os campos!");
  }

  const formData = {
    NOME: user["NOME"].value,
    IDADE: user["IDADE"].value,
    NUMERO: user["NUMERO"].value,
  };

  if (onEdit) {
    await axios
      .put(`http://localhost:8840/${onEdit.ID}`, formData)
      .then(({ data }) => toast.success(data))
      .catch(({ data }) => toast.error(data));
  } else {
    await axios
      .post("http://localhost:8840", formData)
      .then(({ data }) => toast.success(data))
      .catch(({ data }) => toast.error(data));
  }

  setOnEdit(null);
  getUsers();

  // Limpar os campos após submissão
  user.NOME.value = "";
  user.IDADE.value = "";
  user.NUMERO.value = "";
};




  return (
    <FormContainer ref={ref} onSubmit={handleSubmit}>
      <InputArea>
        <Label>nome</Label>
        <Input name="NOME" />
      </InputArea>
      <InputArea>
        <Label>Idade</Label>
        <Input name="IDADE" type="" />
      </InputArea>
      <InputArea>
        <Label>Telefone</Label>
        <Input name="NUMERO" />
      </InputArea>
    
      <Button type="submit">Salvar</Button>

      <Input type="text"     
        placeholder="Pesquisar"
      />
      <Button >
        Pesquisar
      </Button>

    
    </FormContainer>
    
  );
};

export default Formulario;
