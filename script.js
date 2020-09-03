var requestBody = [];
var selectedResource;

function getInfo(url){
    return fetch(url, {method: "GET"})
        .then(response => response.json())
        .then(data=>data.result);
}

function PostInfo(url, options){
    return fetch(url, options)
            .then(response => response.json())
            .then(data => data.result);
}

async function renderResourcesTable(url){

    event.preventDefault();

    selectedResource = event.target.id;

    let list = await getInfo(url);

    if (list != null){

        // remove all table header rows
        let existed_table_header = document.getElementById("table-header").firstChild;
        while (existed_table_header != null){
            document.getElementById("table-header").removeChild(existed_table_header);
            existed_table_header = document.getElementById("table-header").firstChild;
        }
        // remove all table body rows
        let existed_table_body = document.getElementById("table-body").firstChild;
        while (existed_table_body != null){
            document.getElementById("table-body").removeChild(existed_table_body);
            existed_table_body = document.getElementById("table-body").firstChild;
        }

        // pass selected resource to the frontend
        document.getElementById("selected_resources").textContent = selectedResource;

        // add table header
        let table_header = document.getElementById("table-header");
        header_row = document.createElement("tr");
        Object.keys(list[0]).forEach((item) => {
            header_column = document.createElement("th");
            header_text = document.createTextNode(item);
            header_column.appendChild(header_text);
            header_row.appendChild(header_column);
        });
        table_header.appendChild(header_row);

        // add table body
        let table_body = document.getElementById("table-body");
        list.forEach((item) => {
            body_row = document.createElement("tr");
            for(let key in item){
                let val = item[key];
                let body_column = document.createElement("td");
                let body_input = document.createElement("input");
                body_input.setAttribute("value", val);
                body_input.setAttribute("type", "text");
                body_input.setAttribute("name", key);
                body_column.appendChild(body_input);
                body_row.appendChild(body_column);
                // add event trigger
                body_input.addEventListener('change', (event) => {

                    event.preventDefault();


                    event.target.setAttribute("style", "background:red");
                    let tr_parent = event.target.parentElement
                        .parentElement;
                    let id = tr_parent.firstChild.firstChild.value;
                    let updateKey = event.target.name;
                    let updateValue = event.target.value;
                    /** tips: set variable as key in object**/
                    requestBody.push({id: id, [updateKey]: updateValue});
                })
                // end trigger
            }
            body_row.firstChild.firstChild.readOnly = true;
            table_body.appendChild(body_row);
        })
    }
}

function renderCpuTable(){
    renderResourcesTable("http://localhost:8080/v1/cpus");
}

function renderGraphicTable(){
    renderResourcesTable("http://localhost:8080/v1/graphic_cards");
}

function renderMemoryTable(){
    renderResourcesTable("http://localhost:8080/v1/memory_cards");
}




async function createMemory(event){

    event.preventDefault();
    let label = document.getElementById("label").value;
    let price = document.getElementById("price").value;

    option = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({"label":label,
            "price": price}),
    }

    let data = await PostInfo('http://localhost:8080/v1/memory_cards', option);

    if (data != null){
        let existed_table = document.getElementsByTagName("table").item(0);
        while (existed_table != null){
            document.getElementById("placeholder").removeChild(existed_table);
            existed_table = document.getElementsByTagName("table").item(0);
        }

        let table = document.createElement("table");
        let header = document.createElement("tr");
        let header_cell_1 = document.createElement("th");
        let header_cell_1_text = document.createTextNode("id");
        let header_cell_2 = document.createElement("th");
        let header_cell_2_text = document.createTextNode("label");
        let header_cell_3 = document.createElement("th");
        let header_cell_3_text = document.createTextNode("price");
        let header_cell_4 = document.createElement("th");
        let header_cell_4_text = document.createTextNode("create_at");
        let header_cell_5 = document.createElement("th");
        let header_cell_5_text = document.createTextNode("modified_at");

        header_cell_1.appendChild(header_cell_1_text);
        header_cell_2.appendChild(header_cell_2_text);
        header_cell_3.appendChild(header_cell_3_text);
        header_cell_4.appendChild(header_cell_4_text);
        header_cell_5.appendChild(header_cell_5_text);
        header.append(header_cell_1, header_cell_2, header_cell_3,
                    header_cell_4, header_cell_5);
        table.append(header);

        let place = document.getElementById("placeholder");
        place.appendChild(table);

        let row = document.createElement("tr");
        let row_cell_1 = document.createElement("td");
        let row_cell_1_text = document.createTextNode(data.id);
        let row_cell_2 = document.createElement("td");
        let row_cell_2_text = document.createTextNode(data.label);
        let row_cell_3 = document.createElement("td");
        let row_cell_3_text = document.createTextNode(data.price);
        let row_cell_4 = document.createElement("td");
        let row_cell_4_text = document.createTextNode(data.created_at);
        let row_cell_5 = document.createElement("td");
        let row_cell_5_text = document.createTextNode(data.modified_at);

        row_cell_1.appendChild(row_cell_1_text);
        row_cell_2.appendChild(row_cell_2_text);
        row_cell_3.appendChild(row_cell_3_text);
        row_cell_4.appendChild(row_cell_4_text);
        row_cell_5.appendChild(row_cell_5_text);
        row.append(row_cell_1, row_cell_2, row_cell_3,
                row_cell_4, row_cell_5);
        table.appendChild(row);
    }
}

async function updateResourcesValue(event){

    event.preventDefault();

    let url = "http://localhost:8080/v1/" + document.getElementById("selected_resources").textContent;

    for(let i = 0; i < requestBody.length; i++){
        option = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody[i])
        }
        let newArray = await PostInfo(url + "/" + requestBody[i].id, option);
        console.log(newArray);
    }
    requestBody = [];
}
