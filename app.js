let data = [];

let counting = false;
let start_time = undefined;
let final_time = undefined;
let selected = undefined;
let show_add = false;
let add_contrato_str = "";

const pasaosi = document.getElementById("pasaosi");
const pesao = document.getElementById("pesao");
const showms = document.getElementById("showms");
const contratos = document.getElementById("contratos");
const show_ms_btn = document.getElementById("toggle-show-ms");

let show_ms = false;

let show_e = false;

function msToTime(s) {
    var ms = s % 1000;
    s = (s - ms) / 1000;
    var secs = s % 60;
    s = (s - secs) / 60;
    var mins = s % 60;
    var hrs = (s - mins) / 60;

    time = hrs + 'h ' + mins + 'm ' + secs + 's'
    if (show_ms) {
        time += " " + ms
    }

    return time;
}

let day = undefined;
function getCurrentDay() {
    const d = new Date();
    day = d.getDay();

    let lastDay = localStorage.getItem("lastday");

    if (lastDay) {

        lastDay = parseInt(lastDay);

        if (lastDay !== day) {

            // si la última vez que dije que si, no es hoy
            pesao.classList.remove("d-none")

        }

    } else {
        pesao.classList.remove("d-none")
    }

}

getCurrentDay();

function format(time) {
    return msToTime(
        time
    );
}


const toggle_add_button = document.getElementById("toggle-add-button");
const new_contrato = document.getElementById("new-contrato");
const new_contrato_btn = document.getElementById("new-contrato-btn");
const new_contrato_input = document.getElementById("new-contrato-input");

show_ms_btn.addEventListener("click", function (e) {
    show_ms = !show_ms
    save(show_ms, "show_ms");
});

new_contrato_input.addEventListener("keyup", function (e) {

    const key = e.key;
    const name = new_contrato_input.value;

    save(name, "add_contrato_str");

    if (key === 'Enter') {
        new_contrato_btn.click();
    }

});


new_contrato_btn.addEventListener('click', function () {

    const name = new_contrato_input.value;
    const id = data.length;

    if (!name) return;

    new_contrato_input.value = "";
    remove("add_contrato_str");

    for (const d of data) {
        if (name === d.name) {
            return;
        }
    }

    let item = {
        "id": id,
        "name": name,
        "time": 0,
        "description": "",
        "show_description": false
    }
    last_data_len = data.length;
    data.push(item);

    saveData();
    addDataHtml(item);
    visualize(true);

});

function addDataHtml(item) {

    if (data.length === 1) {
        contratos.innerHTML = "";
    }

    contratos.innerHTML += `<div class="contrato" id='i${item.id}'>
        <div class="row mb-1">
            <div class="col-3 d-flex">
                <div class="m-0 kill w-25">
                    <i class="bi bi-x-lg"></i>
                </div>
                <div class="m-0 text w-25">
                <i class="bi bi-card-text"></i>
                </div>
                <div class="m-0 reload w-25">
                    <i class="bi bi-arrow-clockwise"></i>
                </div>
                <div class="m-0 button w-25">
                    <i class="bi bi-play-circle-fill"></i>
                </div>
            </div>
            <div class="col-5">
                <p class="m-0">${item.name}</p>
            </div>
            <div class="col-4 timer">
                0h 0m 0s
            </div>
            <div class="col-12 textd ${(item.show_description) ? '' : 'd-none'}">
                <textarea class="w-100 textarea form-control">${item.description}</textarea>
            </div>
        </div>
    </div>`;

    addListeners();
}


toggle_add_button.addEventListener("click", function () {

    show_add = !show_add;
    save(show_add, "show_add");

    if (show_add) {
        new_contrato.classList.remove("d-none");
        toggle_add_button.innerText = "-";
    } else {
        new_contrato.classList.add("d-none");
        toggle_add_button.innerText = "+";
    }

})

// debugger
let ls_show_ms = localStorage.getItem("show_ms");
if (ls_show_ms !== null) {
    show_ms = ls_show_ms === 'true';
}
let ls_show_e = localStorage.getItem("show_e");
if (ls_show_e !== null) {
    show_e = ls_show_e === 'true';
}
let ls_add_contrato_str = localStorage.getItem("add_contrato_str");
if (ls_add_contrato_str !== null) {
    new_contrato_input.value = ls_add_contrato_str;
}
times = localStorage.getItem("data");
if (times) {
    data = JSON.parse(
        times
    );
    for (const d of data) {
        addDataHtml(d);
    }

    if (data.length === 0) {
        contratos.innerHTML = "<h3 class='fs-6'>Ningun contrato dado de alta.</h3>";
        save(true, "show_add");
    }

    // visualize(true);
}

var last_data_len = data.length;
initChar(data);

if (times) {
    visualize(true);
}



let ls_show_add = localStorage.getItem("show_add");
if (ls_show_add) {
    show_add = ls_show_add === 'true';
    if (show_add) {
        new_contrato.classList.remove("d-none");
        toggle_add_button.innerText = "-";
    }
}

let ls_start_time = localStorage.getItem("start_time");
let ls_selected = localStorage.getItem("selected");
if (ls_start_time && ls_selected && ls_selected != 'undefined') {

    counting = true;
    selected = parseInt(ls_selected);
    start_time = parseInt(ls_start_time);


    console.log(selected);
    const icon = document.getElementsByClassName("button")[selected];
    icon.innerHTML = `<i class="bi bi-stop-circle-fill"></i>`;
}

function visualize(skip_counting) {

    if (!skip_counting) {
        if (!counting) {
            return;
        }
    }

    var ndata = [];
    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        const nitem = {};
        Object.assign(nitem,item);
        ndata.push(nitem);
    }

    for (const item of data) {

        let time = item.time;
        const id = item.id;

        if (selected === id) {
            time += Date.now() - start_time;
            // console.log(ndata);
            ndata[id].time = time
        }

        time = format(time);

        const element = document.getElementById("i" + id);

        const timer = element.getElementsByClassName("timer")[0];

        timer.innerText = time;
    }

    // console.log(ndata);
    updateChart(ndata);

}

function saveData() {
    localStorage.setItem(
        "data",
        JSON.stringify(
            data
        )
    );
}

function save(variable, variable_str) {
    localStorage.setItem(
        variable_str,
        variable
    );
}
function remove(variable_str) {
    localStorage.removeItem(
        variable_str
    );
}


function resetitall() {
    localStorage.removeItem(
        "start_time"
    );
    localStorage.removeItem(
        "data"
    );
    localStorage.removeItem(
        "selected"
    );
}

setInterval(() => {
    visualize(false);
}, 10);


function paddy(num, padlen, padchar) {
    var pad_char = typeof padchar !== 'undefined' ? padchar : '0';
    var pad = new Array(1 + padlen).join(pad_char);
    return (pad + num).slice(-pad.length);
}

const estatistics_container = document.getElementById("contratos-container");
const contratos_container = document.getElementById("estatistics-container");

const toggle_e_button = document.getElementById("toggle-e-button");
toggle_e_button.addEventListener('click', function () {
    show_e = !show_e;
    save(show_e, "show_e");

    if (show_e) {
        estatistics_container.classList.add("d-none");
        contratos_container.classList.remove("d-none");
    } else {
        estatistics_container.classList.remove("d-none");
        contratos_container.classList.add("d-none");
    }

});

if (show_e) {
    estatistics_container.classList.add("d-none");
    contratos_container.classList.remove("d-none");
} else {
    estatistics_container.classList.remove("d-none");
    contratos_container.classList.add("d-none");
}


function html(items, xhtml) {
    for (const i of items) {
        i.innerHTML = xhtml;
    }
}

pasaosi.addEventListener('click', function () {

    localStorage.setItem("lastday", day);
    pesao.remove();

});


function addListeners() {

    const buttons = document.getElementsByClassName("button");
    const reloads = document.getElementsByClassName("reload");
    const kills = document.getElementsByClassName("kill");
    const texts = document.getElementsByClassName("text");
    const textareas = document.getElementsByClassName("textarea");

    for (const textarea of textareas) {

        textarea.addEventListener('keyup', function (e) {
            const text = this.value;
            const parent = this.parentElement.parentElement.parentElement;
            const id = parseInt(
                parent.id.substring(1)
            );

            data[id].description = text;

            saveData();

        });
    }

    for (const button of texts) {

        button.addEventListener('click', function () {

            const element = this.parentElement.parentElement.parentElement;
            const textarea = element.getElementsByClassName("textd")[0];

            const id = parseInt(
                element.id.substring(1)
            );

            const item = data[id];
            item.show_description = !item.show_description;

            if (item.show_description) {
                textarea.classList.remove("d-none");
            } else {
                textarea.classList.add("d-none");
            }

            saveData();

        });

    }

    for (const button of buttons) {

        button.addEventListener('click', function () {

            const element = this.parentElement.parentElement.parentElement;

            const id = parseInt(
                element.id.substring(1)
            );

            if (selected === id) {

                counting = false;
                data[id].time += Date.now() - start_time;
                html(buttons, `<i class="bi bi-play-circle-fill"></i>`);

                selected = undefined;
                remove("selected")
                remove("start_time");

            } else {
                if (counting) {
                    data[selected].time += Date.now() - start_time;
                }

                start_time = Date.now();
                save(start_time, "start_time");

                counting = true;
                html(buttons, `<i class="bi bi-play-circle-fill"></i>`);
                const icon = element.getElementsByClassName("button")[0];
                icon.innerHTML = `<i class="bi bi-stop-circle-fill"></i>`;

                selected = id;
                save(selected, "selected");
            }

            saveData();
            visualize(true);

        });

    }

    for (const reload of reloads) {
        reload.addEventListener('click', function () {

            const element = this.parentElement.parentElement.parentElement;

            const id = parseInt(
                element.id.substring(1)
            );

            data[id].time = 0;

            if (id === selected) {
                selected = undefined;
                remove("selected");
                remove("start_time");
                counting = false;
                html(buttons, `<i class="bi bi-play-circle-fill"></i>`);
            }

            visualize(true);
            saveData();

        });
    }

    for (const kill of kills) {
        kill.addEventListener('click', function () {

            const element = this.parentElement.parentElement.parentElement;

            element.remove();

            const id = parseInt(
                element.id.substring(1)
            );


            if (selected === id) {
                selected = undefined;
                remove("selected");
            }
            if (selected > id) {
                selected--;
            }

            last_data_len = data.length;
            data.splice(id, 1);


            let i = 0;
            for (const d of data) {
                const celement = document.getElementById("i" + d.id);
                celement.id = "i" + i;
                d.id = i++;
            }

            if (data.length === 0) {
                if (data.length === 0) {
                    contratos.innerHTML = "<h3 class='fs-6'>Ningun contrato dado de alta.</h3>";
                    save(true, "show_add");
                }
            }

            saveData();
            visualize(true);

        });
    }

}