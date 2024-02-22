
function atualizarStatusServicos() {
    for (let key in localStorage) {
        if (key.startsWith('atualizacaoServico')) {
            let serviceData = JSON.parse(localStorage.getItem(key));
            let servicoId = serviceData.servicoId; 
            let status = serviceData.newStatus;

            updateMainPageStatus(servicoId, status);

            salvarStatusServico(servicoId, status);
        }
    }
}

atualizarStatusServicos();

window.addEventListener('storage', function(event) {
    if (event.key.startsWith('atualizacaoServico')) {
        atualizarStatusServicos();
    }
});

function salvarStatusServico(servicoId, status) {
    let savedStatus = JSON.parse(localStorage.getItem('savedStatus')) || {};
    savedStatus[servicoId] = status;
    localStorage.setItem('savedStatus', JSON.stringify(savedStatus));
}

function updateMainPageStatus(servicoId, status) {
    let statusElement = document.getElementById(`statusServico${servicoId}`);
    if (statusElement) {
        statusElement.textContent = status;
        statusElement.className = 'status ' + status.toLowerCase();
    } else {
        console.error(`Status não encontrado para o serviço ${servicoId}`);
    }
    
}

function loadSavedStatus() {
    let savedStatus = JSON.parse(localStorage.getItem('savedStatus')) || {};
    for (let servicoId in savedStatus) {
        updateMainPageStatus(servicoId, savedStatus[servicoId]);
    }
}

window.addEventListener('statusUpdate', function(event) {
    loadSavedStatus();
});


function getStatusServico(servicoId) {
    return localStorage.getItem(`statusServico${servicoId}`);
}




function carregarJustificativas() {
    for (let servicoId = 1; servicoId <= 10; servicoId++) {
        let justificativa = localStorage.getItem(`justificativaServico${servicoId}`);
        if (justificativa) {
            let dropdownContent = document.getElementById(`dropdownServico${servicoId}`);
            if (dropdownContent) {
                dropdownContent.innerHTML = `<p>${justificativa}</p>`;
            }
        }
    }
}

carregarJustificativas();

window.addEventListener('justificativaAtualizada', function(event) {
    let servicoId = event.detail.servicoId;
    let justificativa = event.detail.justificativa;
    atualizarDropdownJustificativa(servicoId, justificativa);
});

// Adicione este trecho para atualizar automaticamente as justificativas sempre que uma nova justificativa for salva
window.addEventListener('storage', function(event) {
    if (event.key.startsWith('justificativaServico')) {
        carregarJustificativas();
    }
});



loadSavedStatus();
