let data = [];
// let data = {
//     "SMARTDATA": 0,
//     "IGN-SOLAR": 0,
//     "CONTRATACIÓN": 0,
//     "AGROINTEL": 0,
//     "CLOUDIA": 0
// }

let counting = false;
let start_time = undefined;
let final_time = undefined;
let selected = undefined;

const pasaosi = document.getElementById("pasaosi");
const pesao = document.getElementById("pesao");
const showms = document.getElementById("showms");
const contratos = document.getElementById("contratos");

let show_ms = false;

function msToTime(s) {
    var ms = s % 1000;
    s = (s - ms) / 1000;
    var secs = s % 60;
    s = (s - secs) / 60;
    var mins = s % 60;
    var hrs = (s - mins) / 60;

    time = hrs + 'h ' + mins + 'm ' + secs + 's'
    if (show_ms) {
        time += " " + + ms
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


const new_contrato_btn = document.getElementById("new-contrato-btn");
const new_contrato_input = document.getElementById("new-contrato-input");

new_contrato_btn.addEventListener('click', function () {

    const name = new_contrato_input.value;
    const id = data.length;

    let item = {
        "id": id,
        "name": name,
        "time": 0
    }
    data.push(
        item
    );

    saveData();

    addDataHtml(item);



    visualize(true);

});

function addDataHtml(data) {
    contratos.innerHTML += `<div class="contrato" id='i${data.id}'>
        <div class="row mb-1">
            <div class="col-3 d-flex">
                <div class="m-0 kill w-33">
                    <i class="bi bi-x-lg"></i>
                </div>
                <div class="m-0 reload w-33">
                    <i class="bi bi-arrow-clockwise"></i>
                </div>
                <div class="m-0 button w-33">
                    <i class="bi bi-play-circle-fill"></i>
                </div>
            </div>
            <div class="col-5">
                <p class="m-0">${data.name}</p>
            </div>
            <div class="col-4 timer">
                0h 0m 0s
            </div>
        </div>
    </div>`;

    addListeners();
}



// debugger
times = localStorage.getItem("data");
if (times) {
    data = JSON.parse(
        times
    );
    for (const d of data) {
        addDataHtml(d);
    }
    visualize(true);
}

let ls_start_time = localStorage.getItem("start_time");
let ls_selected = localStorage.getItem("selected");
if (ls_start_time && ls_selected && ls_selected != 'undefined') {

    counting = true;
    selected = parseInt(ls_selected);
    start_time = parseInt(ls_start_time);


    const icon = document.getElementsByClassName("button")[selected];
    icon.innerHTML = `<i class="bi bi-stop-circle-fill"></i>`;
}

function visualize(skip_counting) {

    if (!skip_counting) {
        if (!counting) {
            return;
        }
    }

    for (const item of data) {

        let time = item.time;
        const id = item.id;

        if (selected === id) {
            time += Date.now() - start_time;
        }

        time = format(time);

        const element = document.getElementById("i" + id);

        const timer = element.getElementsByClassName("timer")[0];

        timer.innerText = time;
    }

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

// showms.addEventListener('click', function () {
//     show_ms = !show_ms;
// });



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

            
            data.splice(id, 1);
            
            
            let i = 0;
            for (const d of data) {
                
                const celement = document.getElementById("i" + d.id);
                celement.id = "i"+i;
                d.id = i++;
            }

            saveData();
            visualize(true);

        });
    }

}