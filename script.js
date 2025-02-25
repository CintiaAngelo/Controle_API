document.addEventListener("DOMContentLoaded", buscarViagens);

const API_URL = "http://demo1464921.mockable.io/viagens";
let listaViagens = [];

document.getElementById("viagemForm").addEventListener("submit", function (event) {
    event.preventDefault();
    adicionarViagem();
});

function buscarViagens() {
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            listaViagens = data.viagens || [];  // Supondo que o Mockable retorne 'viagens'
            preencherTabela(listaViagens);
        })
        .catch(error => console.error("Erro ao buscar as viagens:", error));
}

function adicionarViagem() {
    const destino = document.getElementById('destinoViagem').value.trim();
    const tempo = parseInt(document.getElementById('tempoViagem').value.trim());
    const valor = parseFloat(document.getElementById('valorViagem').value.trim());

    if (!destino || isNaN(tempo) || isNaN(valor)) {
        alert('Preencha todos os campos corretamente.');
        return;
    }

    const novaViagem = { destino, tempo, passagem: valor }; // Campo 'passagem' no lugar de 'valor'

    fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novaViagem) // Envia a viagem em formato JSON
    })
    .then(response => response.json())  // Assume resposta JSON
    .then(data => {
        // Atualiza a lista localmente após o POST
        listaViagens.push(novaViagem);
        preencherTabela(listaViagens);
        alert('Viagem adicionada com sucesso!');
    })
    .catch(error => console.error('Erro ao adicionar viagem:', error));

    document.getElementById("viagemForm").reset();  // Reseta o formulário após a submissão
}

function preencherTabela(lista) {
    const tbody = document.getElementById("tabela-viagens");
    tbody.innerHTML = "";

    lista.forEach((viagem, index) => {
        let linha = document.createElement("tr");
        linha.innerHTML = `
            <td>${viagem.destino}</td>
            <td>${viagem.tempo} dias</td>
            <td>R$ ${viagem.passagem.toFixed(2)}</td> <!-- Exibe o campo 'passagem' -->
            <td>
                <button onclick="editarViagem(${index})">Editar</button>
                <button onclick="removerViagem(${index})">Remover</button>
            </td>
        `;
        tbody.appendChild(linha);
    });
}

function editarViagem(index) {
    const viagem = listaViagens[index];
    const novoDestino = prompt("Novo destino:", viagem.destino);
    const novoTempo = parseInt(prompt("Novo tempo de viagem (em dias):", viagem.tempo));
    const novoValor = parseFloat(prompt("Novo valor da passagem:", viagem.passagem));

    if (novoDestino && !isNaN(novoTempo) && !isNaN(novoValor)) {
        listaViagens[index] = { destino: novoDestino, tempo: novoTempo, passagem: novoValor }; // 'passagem' no lugar de 'valor'
        preencherTabela(listaViagens);
    } else {
        alert("Dados inválidos.");
    }
}

function removerViagem(index) {
    listaViagens.splice(index, 1);
    preencherTabela(listaViagens);
}
