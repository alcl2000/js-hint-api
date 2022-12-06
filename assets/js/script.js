const API_KEY = 'Tibx60Dh1REpOmRsDLrGobL1UVA';
const API_URL = 'https://ci-jshint.herokuapp.com/api'
var resultModal = new bootstrap.Modal(document.getElementById('resultsModal'))

document.getElementById('status').addEventListener('click', e => getStatus(e));
document.getElementById('submit').addEventListener('click', e => postForm(e));

function processOptions(form){
    
    let optArray = [];
    for(let entry of form.entries()){
        if(entry[0] === 'options'){
            optArray.push(entry[1])
        }
    }
    form.delete('options');
    form.append('options', optArray.join());

    return form;
}

async function postForm(e){
    const form = processOptions(new FormData(document.getElementById('checksform')));
    
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Authorization": API_KEY,
        },
        body: form,
    });

    const data = await response.json();

    if(response.ok){
        displayErrors(data)
    }
    else{
        throw new Error(data.error);
    };
}

function displayErrors(data){
    document.getElementById('resultsModalTitle').innerText = `Error Report for ${data.file}`;
    let results = ""

    if(data.total_errors === 0){
        results = `<div class = 'no_errors'>No Errors Reported</div>`
    }
    else{
        results = `<div>Total Errors: <span class='error_count'>${data.total_errors}</span></div>`
        for(let error of data.error_list){
            results += `<div>At Line <span class = 'line'>${error.line}</span>,`;
            results += `& column <span class='line'>${error.col}</span></div>`;
            results += `<div class='error'>${error.error}</div>`
        }
    }
    document.getElementById('results-content').innerHTML = results;
    resultModal.show();
}

async function getStatus(e){
    const queryString = `${API_URL}?api_key=${API_KEY}`;
    const response = await fetch(queryString);
    const data = await response.json();

    if(response.ok){
        displayStatus(data);
    }
    else{
        throw new Error(data.error);
    }
};
function displayStatus(data){
    document.getElementById('resultsModalTitle').innerText = 'API Key Status';
    document.getElementById('results-content').innerHTML = `<div>Your key is valid until</div>
    <div class="key-status">${data.expiry}</div>`;
    resultModal.show();
}
