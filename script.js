var requestBody = [];
var createBody = [];
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

async function Postupdate(){
    let updateId = [];

    let url = "http://localhost:8080/v1/" + document.getElementById("selected_resources").textContent;

    for(let i = 0; i < requestBody.length; i++){
        option = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody[i])
        }
        let newArray = await fetch(url + "/" + requestBody[i].id, option)
            .then(response=> response.json())
            .then(data => data.result);
        updateId.push(newArray.id);
    }
    requestBody = [];
    return updateId;
}

function updateResourcesValue(event){
    // event.preventDefault();
    Postupdate().then(data => console.log(data));
    return null;
}


async function createResourcesValue(event){
    event.preventDefault();

    res = [];

    let url = "http://localhost:8080/v1/" + document.getElementById("selected_resources").textContent;
    for(let k = 0; k < createBody.length; k++){
        option = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(createBody[k])
        }
        let r = await PostInfo(url, option);
        res.push(r);
    }
    createBody = [];
    return res;
}


//after click list button, all items will be listed
async function renderResourcesTable(url){

    event.preventDefault();

    selectedResource = event.target.id;

    let list = await getInfo(url);

    if (list != null) {

        // remove all table header rows
        let existed_table_header = document.getElementById("table-header").firstChild;
        while (existed_table_header != null) {
            document.getElementById("table-header").removeChild(existed_table_header);
            existed_table_header = document.getElementById("table-header").firstChild;
        }
        // remove all table body rows
        let existed_table_body = document.getElementById("table-body").firstChild;
        while (existed_table_body != null) {
            document.getElementById("table-body").removeChild(existed_table_body);
            existed_table_body = document.getElementById("table-body").firstChild;
        }

        // remove all create button
        let button_insert1 = document.getElementById("button_row");
        let button_insert2 = document.getElementById("button_insert");
        let button_update1 = document.getElementById("button_update");
        if(button_insert1 != null){
            button_insert1.parentElement.removeChild(button_insert1);
        }
        if(button_insert2 != null){
            button_insert2.parentElement.removeChild(button_insert2);
        }
        if(button_update1 != null){
            button_update1.parentElement.removeChild(button_update1);
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
            for (let key in item) {
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
            /** make input read only */
            body_row.firstChild.firstChild.readOnly = true;
            table_body.appendChild(body_row);
        })

        // add update button
        let button_update = document.createElement("button");
        button_update.textContent = "update change";
        button_update.setAttribute("class", "btn btn-secondary");
        button_update.setAttribute("id", "button_update");
        button_update.addEventListener('click', updateResourcesValue(event));

        // create two button, one for add row and another for submit to the database
        // 1) button_row
        let button_row = document.createElement("button");
        button_row.textContent = "add row";
        button_row.setAttribute("class", "btn btn-success");
        button_row.setAttribute("id", "button_row");
        button_row.addEventListener('click', (event) => {
            event.preventDefault();
            let adding_row = document.createElement("tr")
            let create_table = document.getElementById("create-body");
            Object.keys(list[0]).forEach((item) => {
                let adding_cell = document.createElement("td");
                let adding_input = document.createElement("input");
                adding_input.setAttribute("name", item);
                if(item == "id"){ adding_input.readOnly = true;}

                adding_cell.appendChild(adding_input);
                adding_row.appendChild(adding_cell);
                create_table.appendChild(adding_row);
            });
        });

        // 2) button insert
        let button_insert = document.createElement("button");
        button_insert.textContent = "insert them";
        button_insert.setAttribute("class", "btn btn-primary");
        button_insert.setAttribute("id", "button_insert");
        button_insert.addEventListener('click', (event) => {
            event.preventDefault();
            let all_rows = document.getElementById("create-body")
                .getElementsByTagName("tr")
            for(let i = 0; i < all_rows.length; i++){
                let createBodyItem = {};
                all_rows[i].childNodes.forEach((item) => {
                    let cell_name = item.firstChild.name;
                    let cell_value = item.firstChild.value;
                    createBodyItem[cell_name] = cell_value;
                });
                createBody.push(createBodyItem);
            }
            let who_insert = createResourcesValue(event);
        })
        document.getElementById("create").appendChild(button_row);
        document.getElementById("create").appendChild(button_insert);
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




// async function createMemory(event){
//
//     event.preventDefault();
//     let label = document.getElementById("label").value;
//     let price = document.getElementById("price").value;
//
//     option = {
//         method: "POST",
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({"label":label,
//             "price": price}),
//     }
//
//     let data = await PostInfo('http://localhost:8080/v1/memory_cards', option);
//
//     if (data != null){
//         let existed_table = document.getElementsByTagName("table").item(0);
//         while (existed_table != null){
//             document.getElementById("placeholder").removeChild(existed_table);
//             existed_table = document.getElementsByTagName("table").item(0);
//         }
//
//         let table = document.createElement("table");
//         let header = document.createElement("tr");
//         let header_cell_1 = document.createElement("th");
//         let header_cell_1_text = document.createTextNode("id");
//         let header_cell_2 = document.createElement("th");
//         let header_cell_2_text = document.createTextNode("label");
//         let header_cell_3 = document.createElement("th");
//         let header_cell_3_text = document.createTextNode("price");
//         let header_cell_4 = document.createElement("th");
//         let header_cell_4_text = document.createTextNode("create_at");
//         let header_cell_5 = document.createElement("th");
//         let header_cell_5_text = document.createTextNode("modified_at");
//
//         header_cell_1.appendChild(header_cell_1_text);
//         header_cell_2.appendChild(header_cell_2_text);
//         header_cell_3.appendChild(header_cell_3_text);
//         header_cell_4.appendChild(header_cell_4_text);
//         header_cell_5.appendChild(header_cell_5_text);
//         header.append(header_cell_1, header_cell_2, header_cell_3,
//                     header_cell_4, header_cell_5);
//         table.append(header);
//
//         let place = document.getElementById("placeholder");
//         place.appendChild(table);
//
//         let row = document.createElement("tr");
//         let row_cell_1 = document.createElement("td");
//         let row_cell_1_text = document.createTextNode(data.id);
//         let row_cell_2 = document.createElement("td");
//         let row_cell_2_text = document.createTextNode(data.label);
//         let row_cell_3 = document.createElement("td");
//         let row_cell_3_text = document.createTextNode(data.price);
//         let row_cell_4 = document.createElement("td");
//         let row_cell_4_text = document.createTextNode(data.created_at);
//         let row_cell_5 = document.createElement("td");
//         let row_cell_5_text = document.createTextNode(data.modified_at);
//
//         row_cell_1.appendChild(row_cell_1_text);
//         row_cell_2.appendChild(row_cell_2_text);
//         row_cell_3.appendChild(row_cell_3_text);
//         row_cell_4.appendChild(row_cell_4_text);
//         row_cell_5.appendChild(row_cell_5_text);
//         row.append(row_cell_1, row_cell_2, row_cell_3,
//                 row_cell_4, row_cell_5);
//         table.appendChild(row);
//     }
// }

// async function updateResourcesValue(event){
//
//     event.preventDefault();
//
//     let updateId = [];
//
//     let url = "http://localhost:8080/v1/" + document.getElementById("selected_resources").textContent;
//
//     for(let i = 0; i < requestBody.length; i++){
//         option = {
//             method: "POST",
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(requestBody[i])
//         }
//         let newArray = await PostInfo(url + "/" + requestBody[i].id, option);
//         updateId.push(newArray.id);
//     }
//     requestBody = [];
//     return updateId;
// }


