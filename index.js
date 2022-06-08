
function renderForm(){
    let content = document.getElementById("dynamic-content");
    content.innerHTML = `
        <form action="index.php" method="get" class="shadow-sm p-3 mb-5 bg-body rounded">
            <div class="form-check ">
                <label class="form-check-label"> 
                    <input class="form-check-input" type="radio" name="clients-filter" id="filter1" value="cf1" checked>
                    Show all clients
                </label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="radio" name="clients-filter" id="filter2" value="cf2">
                <label class="form-check-label" for="filter2"> Show with money </label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="radio" name="clients-filter" id="filter3" value="cf3">
                <label class="form-check-label" for="filter3"> Show without money </label>
            </div>
            <div class="p-2 mt-1">
                <button type="button" class="btn btn-success" onclick="getClients()">Apply filter</button>
            </div>
        </form>
    `
}

async function getClients(){
    let filter = document.querySelector('input[name="clients-filter"]:checked').value

    fetch(`${window.location.href}handlers/get-clients.php?filter=${filter}`,{method: 'GET'})
        .then(function(response) { return response.json() })
        .then(function(json) { printClients(json) });
}

function printClients(clients){

    let container = document.getElementById("clients-info");
    if(container === null){
        container = document.createElement("div");
        container.id = "clients-info"
        document.getElementById("dynamic-content").appendChild(container);
    }

    if (clients.length === 0) {
        container.innerHTML = "<p> No clients found </p>"
    }else {
        let list = document.getElementById("clients-list");
        if(list === null){
            list = document.createElement("div");
            list.id = "clients-list"
            document.getElementById("clients-info").appendChild(list);
        } else {
            list.innerHTML = ''
        }
        clients.forEach(c => {
            let client = document.createElement("a");
            client.setAttribute( "class", "list-group-item list-group-item-info" );
            client.onclick = function() { getClientStatistic(c.id); }
            client.innerHTML = `
                <div class="d-flex w-100 justify-content-between ">
                    <h5 class="mb-1">${c.name}</h5>
                    <small> Balance: ${c.balance}</small>
                </div>
                <p class="mb-1"> ${c.login} : ${c.ip} </p>`
            list.appendChild(client)
        });
    }
}

function getClientStatistic(id){
    let xhr = new XMLHttpRequest();
    xhr.open('GET', `handlers/client-statistic.php?id=${id}`, true);
    xhr.send();

    xhr.onreadystatechange = function() {
        if (xhr.readyState !== 4) {
            return null
        }
        document.getElementById("dynamic-content").innerHTML = xhr.responseText
    }
    return null
}

function getGlobalStatistic(){
    const xhr = new XMLHttpRequest();
    xhr.open('GET', "handlers/global-statistic.php", true);
    xhr.responseType = "document";
    xhr.send();
    xhr.onload = function () {
        if (xhr.readyState === xhr.DONE) {
            if (xhr.status === 200) {
                
                document.getElementById("dynamic-content").innerHTML = getTable(xhr.responseXML)
            }
        }
        
    };
}

function getTable(stat){
    
    let t_head = "<table class='table table-success table-bordered border-primary'>" +
    "<thead>" +
    "<td>start</td>" +
    "<td>stop</td>" +
    "<td>in_traffic</td>" +
    "<td>out_traffic</td>" +
    "<td>name</td>" +
    "<td>IP</td>" +
    "</thead><tbody>";
let t_body = "";
$(stat).find('statistics statistic').each(function () {
    let start= $(this).find('start').text();
    let stop = $(this).find('stop').text();
    let in_traffic = $(this).find('in_traffic').text();
    let out_traffic = $(this).find('out_traffic').text();
    let name = $(this).find('name').text();
    let IP = $(this).find('IP').text();
    t_body = t_body+"<tr><td>"+start+"</td><td>"+stop+"</td><td>"+in_traffic+"</td><td>"+out_traffic+"</td><td>"+name+"</td><td>"+IP+"</td></tr>";
});
t_body+="</tbody></table>"

    return t_head+t_body; 
}

