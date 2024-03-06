let currentServicoId = null;
let currentStatus = null;

function openModal(servicoId) {
    clearModalFields(servicoId);

    let modal = document.getElementById(`modal${servicoId}`);
    modal.style.display = "block";
}




function clearModalFields(servicoId) {
    let justificativaTextarea = document.getElementById(`justificativa${servicoId}`);
    justificativaTextarea.value = "";
    let checkboxes = document.querySelectorAll(`#modal${servicoId} input[type="checkbox"]`);
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
}
    



function closeModal(servicoId) {
    let modal = document.getElementById(`modal${servicoId}`);
    modal.style.display = "none";
    currentStatus = null;
}




function updateStatus(servicoId, status) {
    currentServicoId = servicoId;
    currentStatus = status;
    openModal(servicoId);
}







// Função para salvar o status atualizado tanto na página de atualizações quanto na página principal
function salvarStatus(servicoId, status) {
    // Salva o status na página de atualizações
    updateMainPageStatus(servicoId, status);
    
    // Salva o status na página principal
    let savedStatus = JSON.parse(localStorage.getItem('savedStatus')) || {};
    savedStatus[servicoId] = status;
    localStorage.setItem('savedStatus', JSON.stringify(savedStatus));
}



// Função para confirmar a atualização do status
function confirmUpdate(servicoId) {
    if (servicoId !== null && currentStatus !== null) {
        let allStatusButtons = document.querySelectorAll(`#servico${servicoId} .updateBtn`);
        allStatusButtons.forEach(button => {
            button.classList.remove('active');
            button.classList.remove('operacional', 'instabilidade', 'indisponibilidade');
        });

        let updateBtn = document.getElementById(`statusServico${currentServicoId}-${currentStatus}`);
        if (updateBtn) {
            updateBtn.classList.add('active');
            updateBtn.classList.add(currentStatus.toLowerCase());
            updateBtn.textContent = currentStatus;

            // Salva o status atualizado
            salvarStatus(servicoId, currentStatus);

            // Fecha o modal
            closeModal(currentServicoId);
        } else {
            console.error(`Botão de status não encontrado: statusServico${currentServicoId}-${currentStatus}`);
        }

        
    } else {
        console.error("ID do serviço ou status não definidos");
    }
}







function updateMainPageStatus(servicoId, status) {
    let servico = document.getElementById(`servico${servicoId}`);
    let statusButtons = servico.querySelectorAll('.updateBtn');
    statusButtons.forEach(button => {
        button.classList.remove('active', 'operacional', 'instabilidade', 'indisponibilidade');
    });
    let updateBtn = document.getElementById(`statusServico${servicoId}-${status}`);
    if (updateBtn) {
        updateBtn.classList.add('active', status.toLowerCase());
        updateBtn.textContent = status;
    } else {
        console.error(`Botão de status não encontrado: statusServico${servicoId}-${status}`);
    }
  

    localStorage.setItem('atualizacaoServico', JSON.stringify({ servicoId: servicoId, newStatus: status }));

}

let checkboxState = {};







function initializeCheckboxesAndTextarea(abaId) {
    let checkboxes = document.querySelectorAll(`#${abaId} input[type="checkbox"]`);
    let textarea = document.querySelector(`#${abaId} textarea`);

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('click', function() {
            if (checkbox.checked) {
                // Desmarcar todas as outras checkboxes dentro da mesma aba
                checkboxes.forEach(otherCheckbox => {
                    if (otherCheckbox !== checkbox) {
                        otherCheckbox.checked = false;
                    }
                });
                // Desabilitar a textarea
                textarea.disabled = true;
            } else {
                // Habilitar a textarea se nenhuma checkbox estiver marcada
                let isAnyCheckboxChecked = Array.from(checkboxes).some(otherCheckbox => otherCheckbox.checked);
                if (!isAnyCheckboxChecked) {
                    textarea.disabled = false;
                }
            }
        });
    });
}






function openAba(modalId, abaNome) {
    // Oculta todas as abas dentro do modal
    let abas = document.querySelectorAll(`#modal${modalId} .aba-container`);
    abas.forEach(aba => {
        aba.style.display = 'none';
    });

    // Exibe a aba selecionada
    let aba = document.getElementById(`aba-${abaNome}${modalId}`);
    if (aba) {
        aba.style.display = 'block';
        // Inicializar checkboxes e textarea da aba
        initializeCheckboxesAndTextarea(`aba-${abaNome}${modalId}`);
    } else {
        console.error(`Aba não encontrada: aba-${abaNome}${modalId}`);
    }
}





let textosSelecionados = {};

function salvarOpcoes(abaNome) {
    let checkboxes = document.querySelectorAll(`#aba-${abaNome} input[type="checkbox"]`);
    let textarea = document.querySelector(`#aba-${abaNome} textarea`);
    let checkboxState = {};

    checkboxes.forEach(checkbox => {
        checkboxState[checkbox.id] = checkbox.checked;
    });

    // Verifica se o textarea para status personalizado está preenchido
    let statusPersonalizado = textarea.value.trim();
    if (statusPersonalizado !== "") {
        checkboxState["statusPersonalizado"] = statusPersonalizado;
    }

    // Salva o estado das checkboxes e o status personalizado
    localStorage.setItem(abaNome, JSON.stringify(checkboxState));

    // Fecha a aba após salvar
    fecharAba(abaNome);
}

function atualizarDropdown(servicoId) {
    let dropdownServico = document.getElementById(`dropdownServico${servicoId}`);
    if (dropdownServico) {
        let selectedTexts = textosSelecionados[servicoId];
        dropdownServico.innerHTML = "";
        selectedTexts.forEach(texto => {
            dropdownServico.innerHTML += `<p>${texto}</p>`;
        });
    }
}



function fecharAba(abaNome, checkboxId) {
    let aba = document.getElementById(`aba-${abaNome}`);
    aba.style.display = 'none';

    let checkboxPai = document.getElementById(checkboxId);
    if (checkboxPai) {
        checkboxPai.checked = false;
    }
}
