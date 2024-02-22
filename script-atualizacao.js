let currentServicoId = null;
let currentStatus = null;

function openModal(servicoId) {
    clearModalFields(servicoId);

    let modal = document.getElementById(`modal${servicoId}`);
    modal.style.display = "block";
}

function clearModalFields(servicoId) {
    let usuarioInput = document.getElementById(`usuario${servicoId}`);
    let justificativaTextarea = document.getElementById(`justificativa${servicoId}`);
    usuarioInput.value = "";
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

            localStorage.setItem('atualizacaoServico', JSON.stringify({ servicoId: currentServicoId, newStatus: currentStatus }));
    

           let justificativa = document.getElementById(`justificativa${servicoId}`).value;
            

            console.log(justificativa);
            
            salvarJustificativa(servicoId, justificativa);

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


function atualizarDropdownJustificativa(servicoId, justificativa) {
    let dropdownContent = document.getElementById(`dropdownServico${servicoId}`);
    if (dropdownContent) {
        dropdownContent.innerHTML = `<p>${justificativa}</p>`;
    } else {
        console.error(`Dropdown de justificativa não encontrado para o serviço ${servicoId}`);
    }
}


function salvarJustificativa(servicoId, justificativa) {
    localStorage.setItem(`justificativaServico${servicoId}`, justificativa);
    window.dispatchEvent(new CustomEvent('justificativaAtualizada', { detail: { servicoId: servicoId, justificativa: justificativa } }));
}





