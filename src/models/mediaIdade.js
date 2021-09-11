const fs = require('fs');
const parser = require('csv-parser');
const inquirer = require('inquirer');

/* 
1. [Consultar média de idade dos pacientes] Permitir que o usuário informe o nome do
município residencial e como resultado o programa deverá exibir:
a. O número total de pacientes do município;
b. A média de idade dos pacientes separados por gênero;
c. A média de idade de todos os pacientes; */


function mediaIdade(filePath, municipioPesquisado) {
    
    let idadesPacientesMunicipio = []
    let idadesF = [];
    let idadesM = [];

    fs.createReadStream(filePath)
        .pipe(parser({
            separator: ';'
        }))
        .on('data', function (data) {
            try {
                
                if (data["municipio_residencia"] == municipioPesquisado) {

                    let idades = parseInt(data["idade"]);

                    if (data["sexo"] == 'MASCULINO') {
                        idadesM.push(idades);
                    } else if (data["sexo"] == 'FEMININO') {
                        idadesF.push(idades);
                    }
                    
                    idadesPacientesMunicipio.push(idades);
                }

            } catch (err) {
                //tratamento de erros
            }
        })

        .on('end', function () {
            const mediaF = calculaMedia(idadesF);
            const mediaM = calculaMedia(idadesM);
            const mediaTotal = calculaMedia(idadesPacientesMunicipio);

            const { apresentaResultado } = require('../interfaces/interfaceMediaidade.js');
            apresentaResultado(municipioPesquisado, idadesPacientesMunicipio, mediaM, mediaF, mediaTotal);
            
        });
}


//utilitaria
function calculaMedia(array) {
    let somaIdades = 0;
    for (i = 0; i < array.length; i++) {
        somaIdades += array[i];
    }
    let saida = somaIdades / array.length;
    return saida.toFixed(0);
}



module.exports = { mediaIdade };