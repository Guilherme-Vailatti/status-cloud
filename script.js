function atualizarStatusServicos() {
    for (let key in localStorage) {
        if (key.startsWith('atualizacaoServico')) {
            let serviceData = JSON.parse(localStorage.getItem(key));
            let servicoId = serviceData.servicoId; 
            let status = serviceData.newStatus;

            updateMainPageStatus(servicoId, status);

            // Remover a atualização após ter sido aplicada
            localStorage.removeItem(key);
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



// Função para carregar e exibir os textos no dropdown da página principal
function carregarTextosDropdown() {
    // Verifica se há um texto personalizado armazenado
    let textoPersonalizado = localStorage.getItem('textoPersonalizado');
    
    // Se houver um texto personalizado, exibe-o no dropdown
    if (textoPersonalizado) {
        exibirTextoDropdown(textoPersonalizado);
    } else {
        // Caso contrário, verifica se há textos pré-definidos armazenados
        let textosPredefinidos = JSON.parse(localStorage.getItem('textosPredefinidos')) || [];
        
        // Se houver textos pré-definidos, exibe o primeiro no dropdown
        if (textosPredefinidos.length > 0) {
            exibirTextoDropdown(textosPredefinidos[0]);
        }
    }
}

// Função para exibir o texto no dropdown da página principal
function exibirTextoDropdown(texto) {
    let dropdownContent = document.getElementById('dropdownTextos');
    dropdownContent.innerHTML = `<p>${texto}</p>`;
}

// Chama a função para carregar e exibir os textos no dropdown ao carregar a página
carregarTextosDropdown();






loadSavedStatus();