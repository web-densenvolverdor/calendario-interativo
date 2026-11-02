const dias = document.getElementById('dias');
const mesAno = document.getElementById("mes-ano");
const botaoAnterior = document.getElementById("mes-anterior");
const botaoProximo = document.getElementById("proximo-mes");

let dataAtual = new Date();
let mesAtual = dataAtual.getMonth();
let anoAtual = dataAtual.getFullYear();
let datasPersonalizadas = {};

const botaoAdicionar = document.getElementById('adicionar-data');

botaoAdicionar.addEventListener('click', function () {

    const dia = Number(document.getElementById('dia-personalizado').value);
    const mes = document.getElementById('mes-personalizado').value;
    const nome = document.getElementById('nome-personalizado').value;
    const descricao = document.getElementById('descricao-personalizada').value;


    if (!dia || mes === '' || !nome.trim() || !descricao.trim()) {
        alert('Preencha todos os campos!');
        return;
    }

    const quantidadeDias = new Date(anoAtual, Number(mes) + 1, 0).getDate();

    if (dia < 1 || dia > quantidadeDias) {
        alert('Esse dia não existe no mês selecionado!');
        return;
    }

    const chave = `${Number(mes)}-${dia}`;

    datasPersonalizadas[chave] = {
        nome: nome.trim(),
        descricao: descricao.trim()
    };

    gerarCalendario();

    alert('Data personalizada cadastrada com sucesso!');


});

const feriados = {
    "0-1": {
        nome: "Confraternização Universal",
        descricao: "Celebra o início de um novo ano."
    },
    "3-21": {
        nome: "Tiradentes",
        descricao: "Homenageia Joaquim José da Silva Xavier, símbolo da luta pela independência do Brasil."
    },
    "4-1": {
        nome: "Dia do Trabalhador",
        descricao: "Reconhece a importância dos trabalhadores e suas conquistas."
    },
    "8-7": {
        nome: "Independência do Brasil",
        descricao: "Comemora a declaração de independência do Brasil, em 7 de setembro de 1822."
    },
    "9-12": {
        nome: "Nossa Senhora Aparecida",
        descricao: "Celebra a padroeira do Brasil."
    },
    "10-2": {
        nome: "Finados",
        descricao: "Dia dedicado à memória das pessoas falecidas."
    },
    "10-15": {
        nome: "Proclamação da República",
        descricao: "Marca a proclamação da República no Brasil, em 15 de novembro de 1889."
    },
    "11-25": {
        nome: "Natal",
        descricao: "Celebra o nascimento de Jesus Cristo na tradição cristã."
    }
};

function calcularPascoa(ano) {

    const a = ano % 19;
    const b = Math.floor(ano / 100);
    const c = ano % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);

    const mes = Math.floor((h + l - 7 * m + 114) / 31);
    const dia = ((h + l - 7 * m + 114) % 31) + 1;

    return new Date(ano, mes - 1, dia);
}


function gerarCalendario() {


    dias.innerHTML = "";

    const primeiroDia = new Date(anoAtual, mesAtual, 1).getDay();

    const ultimoDia = new Date(anoAtual, mesAtual + 1, 0).getDate();

    const pascoa = calcularPascoa(anoAtual);

    const sextaSanta = new Date(pascoa);
    sextaSanta.setDate(pascoa.getDate() - 2);

    const corpusChristi = new Date(pascoa);
    corpusChristi.setDate(pascoa.getDate() + 60);

    const feriadosMoveis = {
        [`${sextaSanta.getMonth()}-${sextaSanta.getDate()}`]: {
            nome: "Sexta-feira Santa",
            descricao: "Data cristã que recorda a crucificação e morte de Jesus Cristo."
        },

        [`${corpusChristi.getMonth()}-${corpusChristi.getDate()}`]: {
            nome: "Corpus Christi",
            descricao: "Celebra a presença de Cristo na Eucaristia, segundo a tradição católica."
        }
    };

    for (let i = 0; i < primeiroDia; i++) {
        dias.innerHTML += '<div></div>';
    }

    for (let dia = 1; dia <= ultimoDia; dia++) {

        const elementoDia = document.createElement('div');

        elementoDia.textContent = dia;

        if (
            dia === dataAtual.getDate() &&
            mesAtual === dataAtual.getMonth() &&
            anoAtual === dataAtual.getFullYear()
        ) {
            elementoDia.classList.add('hoje');
        }

        const chaveFeriado = `${mesAtual}-${dia}`;

        const feriado = feriados[chaveFeriado] ||
            feriadosMoveis[chaveFeriado] ||
            datasPersonalizadas[chaveFeriado];


        if (feriado) {
            elementoDia.classList.add('feriado');
            elementoDia.title = feriado.nome;
        }

        elementoDia.addEventListener('click', function () {
            const informacao = document.getElementById('informacao-feriado');

            if (feriado) {
                informacao.innerHTML = `
        <h3>${feriado.nome}</h3>
        <p>${feriado.descricao}</p>
    `;
            } else {
                informacao.innerHTML = '';
            }
        });


        dias.appendChild(elementoDia);
    }

    mesAno.textContent = new Date(anoAtual, mesAtual).toLocaleDateString('pt-BR', {
        month: 'long',
        year: 'numeric'
    });
}

gerarCalendario();

botaoAnterior.addEventListener('click', function () {
    mesAtual--;

    if (mesAtual < 0) {
        mesAtual = 11;
        anoAtual--;
    }

    gerarCalendario();
});

botaoProximo.addEventListener('click', function () {
    mesAtual++;

    if (mesAtual > 11) {
        mesAtual = 0;
        anoAtual++;
    }

    gerarCalendario();
});