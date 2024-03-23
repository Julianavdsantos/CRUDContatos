import { db } from "../db.js";

export const getUsers = (_, res) => {
    const q = "SELECT c.ID, c.NOME, c.IDADE, t.NUMERO FROM contato c LEFT JOIN telefone t ON c.ID = t.IDCONTATO";

    db.query(q, (err, data) => {
        if (err) {
            console.error("Erro ao buscar usuários:", err);
            return res.status(500).json("Erro interno do servidor.");
        }

        return res.status(200).json(data);
    });
};

export const addUser = (req, res) => {
    debugger;
    const q = "INSERT INTO contato(`NOME`, `IDADE`) VALUES(?, ?)";
  
    const values = [
        req.body.NOME,
        req.body.IDADE,
        
    ];
  
    db.query(q, values, (err, result) => {
        if (err) {
            console.error("Erro ao adicionar usuário:", err);
            return res.status(500).json("Erro interno do servidor.");
        }

        // Adiciona telefone se estiver presente nos dados recebidos
        if (req.body.telefone) {
            const telefone = req.body.telefone;
            addTelefone(result.insertId, telefone, res);
        } else {
            return res.status(200).json("Usuário criado com sucesso.");
        }
    });
};

const addTelefone = (idContato, numero, res) => {
    const q = "INSERT INTO telefone(`IDCONTATO`, `NUMERO`) VALUES(?, ?)";

    const values = [
        idContato,
        numero,
    ];

    db.query(q, values, (err) => {
        if (err) {
            console.error("Erro ao adicionar telefone:", err);
            return res.status(500).json("Erro interno do servidor.");
        }

        return res.status(200).json("Usuário criado com sucesso.");
    });
};

export const updateUser = (req, res) => {
    const q = "UPDATE contato SET `NOME` = ?, `IDADE` = ? WHERE `ID` = ?";
  
    const values = [
        req.body.NOME,
        req.body.IDADE,
        req.params.ID,
    ];

    db.query(q, values, (err, result) => {
        if (err) {
            console.error("Erro ao atualizar usuário:", err);
            return res.status(500).json("Erro interno do servidor.");
        }
        
        // Atualiza telefone se estiver presente nos dados recebidos
        if (req.body.NUMERO) {
            const numero = req.body.NUMERO;
            updateTelefone(req.params.ID, numero, res);
        } else {
            return res.status(200).json("Usuário atualizado com sucesso.");
        }
    });
};


const updateTelefone = (idContato, numero, res) => {
    const q = "UPDATE telefone SET `NUMERO` = ? WHERE `IDCONTATO` = ?";

    const values = [
        numero,
        idContato,
    ];

    db.query(q, values, (err) => {
        if (err) {
            console.error("Erro ao atualizar telefone:", err);
            return res.status(500).json("Erro interno do servidor.");
        }

        return res.status(200).json("Usuário atualizado com sucesso.");
    });
};

export const deleteUser = (req, res) => {
    const q = "DELETE FROM contato WHERE `id` = ?";
  
    db.query(q, [req.params.ID], (err) => {
        if (err) {
            console.error("Erro ao deletar usuário:", err);
            return res.status(500).json("Erro interno do servidor.");
        }

        // Deleta telefone associado ao contato
        deleteTelefone(req.params.ID, res);
    });
};

const deleteTelefone = (idContato, res) => {
    const q = "DELETE FROM telefone WHERE `IDCONTATO` = ?";
  
    db.query(q, [idContato], (err) => {
        if (err) {
            console.error("Erro ao deletar telefone:", err);
            return res.status(500).json("Erro interno do servidor.");
        }

        return res.status(200).json("Usuário deletado com sucesso.");
    });
};
