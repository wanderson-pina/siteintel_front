/*
  --------------------------------------------------------------------------------------
  Função para obter a lista existente do servidor via requisição GET
  --------------------------------------------------------------------------------------
*/
const getList = async () => {
  let url = 'http://127.0.0.1:5000/amostras';
  fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => {
      data.amostras.forEach(item => insertList(item.lote,
                                                item.aph, 
                                                item.hard, 
                                                item.soli,
                                                item.chlo,
                                                item.sulf,
                                                item.condu,
                                                item.organ,
                                                item.triha,
                                                item.turbi,                                                
                                                item.potability
                                              ))
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

/*
  --------------------------------------------------------------------------------------
  Chamada da função para carregamento inicial dos dados
  --------------------------------------------------------------------------------------
*/
getList()




/*
  --------------------------------------------------------------------------------------
  Função para colocar um item na lista do servidor via requisição POST
  --------------------------------------------------------------------------------------
*/
const postItem = async (inputSample, inputAph, inputHard,
                        inputSoli, inputChlo, inputSulf, 
                        inputCondu, inputOrgan, inputTriha, inputTurbi) => {
    
  const formData = new FormData();
  formData.append('lote', inputSample);
  formData.append('aph', inputAph);
  formData.append('hard', inputHard);
  formData.append('soli', inputSoli);
  formData.append('chlo', inputChlo);
  formData.append('sulf', inputSulf);
  formData.append('condu', inputCondu);
  formData.append('organ', inputOrgan);
  formData.append('triha', inputTriha);
  formData.append('turbi', inputTurbi);

  let url = 'http://127.0.0.1:5000/amostra';
  fetch(url, {
    method: 'post',
    body: formData
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
}


/*
  --------------------------------------------------------------------------------------
  Função para criar um botão close para cada item da lista
  --------------------------------------------------------------------------------------
*/
const insertDeleteButton = (parent) => {
  let span = document.createElement("span");
  let txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  parent.appendChild(span);
}

/*
  --------------------------------------------------------------------------------------
  Função para remover um item da lista de acordo com o click no botão close
  --------------------------------------------------------------------------------------
*/
const removeElement = () => {
  let close = document.getElementsByClassName("close");
  // var table = document.getElementById('myTable');
  let i;
  for (i = 0; i < close.length; i++) {
    close[i].onclick = function () {
      let div = this.parentElement.parentElement;
      const nomeItem = div.getElementsByTagName('td')[0].innerHTML
      if (confirm("Você tem certeza?")) {
        div.remove()
        deleteItem(nomeItem)
        alert("Removido!")
      }
    }
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para deletar um item da lista do servidor via requisição DELETE
  --------------------------------------------------------------------------------------
*/
const deleteItem = (item) => {
  console.log(item)
  let url = 'http://127.0.0.1:5000/amostra?lote='+item;
  fetch(url, {
    method: 'delete'
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
}

/*
  --------------------------------------------------------------------------------------
  Função para adicionar um novo item com nome, quantidade e valor 
  --------------------------------------------------------------------------------------
*/
const newItem = async () => {
  let inputSample = document.getElementById("newInput").value;
  let inputAph = document.getElementById("newAph").value;
  let inputHard = document.getElementById("newHard").value;
  let inputSoli = document.getElementById("newSoli").value;
  let inputChlo = document.getElementById("newChlo").value;
  let inputSulf = document.getElementById("newSulf").value;
  let inputCondu = document.getElementById("newCondu").value;
  let inputOrgan = document.getElementById("newOrgan").value;
  let inputTriha = document.getElementById("newTriha").value;
  let inputTurbi = document.getElementById("newTurbi").value;

  // Verifique se o nome do produto já existe antes de adicionar
  const checkUrl = `http://127.0.0.1:5000/amostras?cod=${inputSample}`;
  fetch(checkUrl, {
    method: 'get'
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.amostras && data.amostras.some(item => item.lote === inputSample)) {
        alert("A amostra já está cadastrada.\nCadastre a amostra com um codigo diferente ou atualize o existente.");
      } else if (inputSample === '') {
        alert("O codigo da amostra não pode ser vazio!");
      } else if (isNaN(inputAph) || isNaN(inputHard) || isNaN(inputSoli) || isNaN(inputChlo) || isNaN(inputSulf) || isNaN(inputCondu) || isNaN(inputOrgan) || isNaN(inputTriha) || isNaN(inputTurbi)) {
        alert("Esse(s) campo(s) precisam ser números!");
      } else {
        insertList(inputSample, inputAph, inputHard, inputSoli, inputChlo, inputSulf, inputCondu, inputOrgan, inputTriha, inputTurbi);
        postItem(inputSample, inputAph, inputHard, inputSoli, inputChlo, inputSulf, inputCondu, inputOrgan, inputTriha, inputTurbi);
        alert("Item adicionado!");
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}


/*
  --------------------------------------------------------------------------------------
  Função para inserir items na lista apresentada
  --------------------------------------------------------------------------------------
*/
const insertList = (loteSample, aph, hard, soli, chlo, sulf, condu, organ, triha, turbi, potability) => {
  var item = [loteSample, aph, hard, soli, chlo, sulf, condu, organ, triha, turbi, potability ];
  var table = document.getElementById('myTable');
  var row = table.insertRow();

  for (var i = 0; i < item.length; i++) {
    var cell = row.insertCell(i);
    cell.textContent = item[i];
  }

  var deleteCell = row.insertCell(-1);
  insertDeleteButton(deleteCell);


  document.getElementById("newInput").value = "";
  document.getElementById("newAph").value = "";
  document.getElementById("newHard").value = "";
  document.getElementById("newSoli").value = "";
  document.getElementById("newChlo").value = "";
  document.getElementById("newSulf").value = "";
  document.getElementById("newCondu").value = "";
  document.getElementById("newOrgan").value = "";
  document.getElementById("newTriha").value = "";
  document.getElementById("newTurbi").value = "";
  removeElement();
}