import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import InputMask from "react-input-mask";
import { ToastContainer, toast } from 'react-toastify';

const FormContainer = styled.form`
  display: flex;
  color: #101010;
  align-items: flex-end;
  gap: 20px;
  flex-wrap: wrap;
  background-color: #a5dd9b;
  padding: 20px;
  box-shadow: 0px 0px 5px #ccc;
  border-radius: 5px;
`;

const InputArea = styled.div`
  display: flex;
  flex-direction: column;
`;


const InputMaskStyled = styled(InputMask)`
  width: 150px;
  padding: 0 10px;
  border: 1px solid #bbb;
  border-radius: 10px;
  height: 40px;
  color: black;
`;


const Input = styled.input`
  width: 150px;
  padding: 0 10px;
  border: 1px solid #bbb;
  border-radius: 10px;
  height: 40px;
  color: black;
`;

const Label = styled.label``;

const Button = styled.button`
  padding: 10px;
  cursor: pointer;
  border-radius: 5px;
  border: none;
  background-color: #9bb0c1;
  color: white;
  height: 42px;
`;

const Formulario = ({ getUsers, onEdit, setOnEdit }) => {
  const ref = useRef();
  const [NUMERO, setNumeros] = useState([]);

  const handleChange = (e, index) => {
    const { value } = e.target;
    const updatedNumeros = [...NUMERO];
    updatedNumeros[index] = value;
    setNumeros(updatedNumeros);
  };
  const addPhoneNumberField = () => {
    setNumeros([...NUMERO, ""]); // Adicionar um novo campo de número de telefone vazio
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = ref.current;
    // Verificar se o número de telefone tem pelo menos 11 dígitos
    if (NUMERO.some(NUMERO => NUMERO.replace(/\D/g, '').length < 11)) {
      toast.error("O número de telefone está incompleto.");
      return;
    }

    if(user.NOME.value === "" || user.IDADE.value === ""){
      toast.error("Preencha todos os campos.");
      return;
    }

    const formData = {
      NOME: user.NOME.value,
      IDADE: user.IDADE.value,
      NUMERO: NUMERO,
    };
   console.log(NUMERO)
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

    user.NOME.value = "";
    user.IDADE.value = "";
    setNumeros([]); // Limpar o valor dos números de telefone após o envio do formulário
  };

  useEffect(() => {
    if (onEdit) {
      const user = ref.current;

      user.NOME.value = onEdit.NOME;
      user.IDADE.value = onEdit.IDADE;
      setNumeros(onEdit.NUMERO); // Definir o valor dos números de telefone
    }
  }, [onEdit]);

  return (
    <>
      <FormContainer ref={ref} onSubmit={handleSubmit} style={{ width: "50vw", margin: "0 auto" }}>
        <InputArea>
          <Label>Nome</Label>
          <Input name="NOME" />
        </InputArea>
        <InputArea>
          <Label>Idade</Label>
          <Input name="IDADE" type="number" />
        </InputArea>
        <InputArea>
          <Label>Telefones</Label>
          {NUMERO.map((numero, index) => (
            <InputMaskStyled
              key={index}
              mask="(99) 99999-9999"
              value={numero}
              onChange={(e) => handleChange(e, index)}
              name={`NUMERO[${index}]`}
            />
          ))}
          <Button type="button" onClick={addPhoneNumberField}>Adicionar Telefone</Button>
        </InputArea>
        <Button type="submit">Salvar</Button>
      </FormContainer>
      <ToastContainer />
    </>
  );
};

export default Formulario;
