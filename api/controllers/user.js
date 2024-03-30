import fs from 'fs'; 


import { db } from "../db.js";


function logContatoExcluido(nomeContato, dataHoraExclusao) {
    const logMessage = `[${dataHoraExclusao}] Contato "${nomeContato}" excluído.\n`;

   
    const logFileName = 'log_contatos.txt';

    fs.appendFile(logFileName, logMessage, (err) => {
        if (err) {
            console.error('Erro ao gravar no arquivo de log:', err);
        } else {
            console.log('Registro de log adicionado com sucesso.');
        }
    });
}

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
    const q = "INSERT INTO contato (`NOME`, `IDADE`) VALUES (?, ?)";
    const values = [req.body.NOME, req.body.IDADE];

    db.query(q, values, (err, result) => {
        if (err) {
            console.error("Erro ao adicionar usuário:", err);
            return res.status(500).json("Erro interno do servidor.");
        }

        if (req.body.NUMERO && req.body.NUMERO.length > 0) {
            const NUMERO = req.body.NUMERO;
            const qTelefone = "INSERT INTO telefone (`IDCONTATO`, `NUMERO`) VALUES (?, ?)";
            console.log(NUMERO)
            // Mapear todas as consultas em Promessas
            const promises = NUMERO.map(numero => {
                return new Promise((resolve, reject) => {
                    const valuesTelefone = [result.insertId, numero];
                    
                    db.query(qTelefone, valuesTelefone, (err) => {
                        if (err) {
                            console.error("Erro ao adicionar número de telefone:", err);
                            reject(err);
                        } else {
                            resolve();
                        }
                    });
                });
            });

            // Executar todas as consultas em paralelo
            Promise.all(promises)
                .then(() => {
                    return res.status(200).json("Usuário criado com sucesso.");
                })
                .catch(err => {
                    return res.status(500).json("Erro interno do servidor.");
                });
        } else {
            return res.status(200).json("Usuário criado com sucesso.");
        }
    });
};






export const updateUser = (req, res) => {
    const idContato = req.params.ID;
    const { NOME, IDADE, NUMERO } = req.body;

    // Query para atualizar o contato
    const q = "UPDATE contato SET NOME = ?, IDADE = ? WHERE ID = ?";
    const values = [NOME, IDADE, idContato];

    db.query(q, values, (err, result) => {
        if (err) {
            console.error("Erro ao atualizar contato:", err);
            return res.status(500).json("Erro interno do servidor.");
        }

        // Se houver um número de telefone fornecido, atualize-o também
        if (NUMERO) {
            const qTelefone = "UPDATE telefone SET NUMERO = ? WHERE IDCONTATO = ?";
            const valuesTelefone = [NUMERO, idContato];

            db.query(qTelefone, valuesTelefone, (err) => {
                if (err) {
                    console.error("Erro ao atualizar número de telefone:", err);
                    return res.status(500).json("Erro interno do servidor.");
                }

                // Chame a função para registrar o log de edição
                const dataHoraEdicao = new Date().toLocaleString();
                logContatoEditado(idContato, dataHoraEdicao);

                return res.status(200).json("Contato atualizado com sucesso.");
            });
        } else {
            // Se não houver número de telefone fornecido, retorne uma mensagem de sucesso
            // e chame a função para registrar o log de edição
            const dataHoraEdicao = new Date().toLocaleString();
            logContatoEditado(idContato, dataHoraEdicao);
            return res.status(200).json("Contato atualizado com sucesso.");
        }
    });
};








export const deleteUser = (req, res) => {
    const contatoQuery = "DELETE FROM contato WHERE `ID` = ?";
    const telefoneQuery = "DELETE FROM telefone WHERE `IDCONTATO` = ?";
    const idContato = req.params.ID;

    db.query(telefoneQuery, [idContato], (err, result) => {
        if (err) {
            console.error("Erro ao deletar telefones:", err);
            return res.status(500).json("Erro interno do servidor ao excluir telefones.");
        }

        db.query(contatoQuery, [idContato], (err, result) => {
            if (err) {
                console.error("Erro ao deletar contato:", err);
                return res.status(500).json("Erro interno do servidor ao excluir contato.");
            }

            // Chama a função para registrar o log de exclusão
            const dataHoraExclusao = new Date().toLocaleString();
            logContatoExcluido(`Contato com ID ${idContato} foi excluído`, dataHoraExclusao);

            return res.status(200).json("Contato e telefones associados excluídos com sucesso.");
        });
    });
};

export const searchUsers = (req, res) => {
    const searchTerm = req.query.q; // Obtém o termo de busca da query da URL
    const q = `
        SELECT c.ID, c.NOME, c.IDADE, t.NUMERO 
        FROM contato c 
        LEFT JOIN telefone t ON c.ID = t.IDCONTATO
        WHERE c.NOME LIKE ? OR t.NUMERO LIKE ?
    `;
    const values = [`%${searchTerm}%`, `%${searchTerm}%`];

    db.query(q, values, (err, data) => {
        if (err) {
            console.error("Erro ao buscar usuários:", err);
            return res.status(500).json("Erro interno do servidor.");
        }

        return res.status(200).json(data);
    });
};