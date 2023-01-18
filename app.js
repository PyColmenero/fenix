let data = {
    "SMARTDATA": 0,
    "IGN-SOLAR": 0,
    "CONTRATACIÓN": 0,
    "AGROINTEL": 0,
    "CLOUDIA": 0
}

let counting = false;
let start_time = undefined;
let final_time = undefined;
let selected = undefined;

const buttons = document.getElementsByClassName("button");
const reloads = document.getElementsByClassName("reload");

function msToTime(s) {
    var ms = s % 1000;
    s = (s - ms) / 1000;
    var secs = s % 60;
    s = (s - secs) / 60;
    var mins = s % 60;
    var hrs = (s - mins) / 60;

    return hrs + 'h ' + mins + 'm ' + secs + 's';
}

function format(time) {
    // let seconds =
    return msToTime(
        time
    );
}

let ls_start_time = localStorage.getItem("start_time");
let ls_selected = localStorage.getItem("selected");
if (ls_start_time) {
    counting = true;
    selected = ls_selected;
    start_time = parseInt(ls_start_time);
    const element = document.getElementById("icon-" + ls_selected);
    element.innerHTML = `<i class="bi bi-stop-circle-fill"></i>`;
    console.log(start_time);
}
times = localStorage.getItem("times");
if (times) {
    data = JSON.parse(
        times
    );
    visualize(true);
}

function visualize(t) {

    if (!t) {
        if (!counting) {
            return;
        }
    }

    let ndata = {};

    // console.log(data);

    for (const key in data) {
        if (Object.hasOwnProperty.call(data, key)) {

            // console.log(data, key);
            let time = data[key];

            // console.log(start_time);

            if (selected === key) {
                time += Date.now() - start_time;
                ndata[key] = Date.now() - start_time;
            } else {
                ndata[key] = time;
            }


            // console.log(time);

            time = format(time);

            const element = document.getElementById(key);
            element.innerText = time;

        }
    }

    localStorage.setItem(
        "times",
        JSON.stringify(
            ndata
        )
    );
    if (start_time) {
        localStorage.setItem(
            "start_time",
            start_time
        );
        localStorage.setItem(
            "selected",
            selected
        );
    } else {
        localStorage.removeItem(
            "start_time"
        );
    }


}

setInterval(() => {

    visualize(false);

}, 1000);



function paddy(num, padlen, padchar) {
    var pad_char = typeof padchar !== 'undefined' ? padchar : '0';
    var pad = new Array(1 + padlen).join(pad_char);
    return (pad + num).slice(-pad.length);
}

for (const reload of reloads) {
    reload.click = function () {
        const id = this.dataset.id;
        data[id] = 0;
        selected = undefined;
        visualize(true);
        counting = false;
        html(buttons, `<i class="bi bi-play-circle-fill"></i>`);

        localStorage.removeItem(
            "start_time"
        );
    };
}

function html(items, xhtml) {
    for (const i of items) {
        i.innerHTML = xhtml;
    }
}


for (const button of buttons) {

    button.addEventListener('click', function () {
        const id = this.dataset.id;
        if (selected === id) {
            counting = false;
            data[id] += Date.now() - start_time;
            html(buttons, `<i class="bi bi-play-circle-fill"></i>`);
            selected = undefined;

            localStorage.removeItem(
                "start_time"
            );

            return;
        } else {
            if (counting) {
                data[selected] += Date.now() - start_time;
            }
            start_time = Date.now();
            counting = true;
            html(buttons, `<i class="bi bi-play-circle-fill"></i>`);
            const element = document.getElementById("icon-" + id);
            element.innerHTML = `<i class="bi bi-stop-circle-fill"></i>`;
            visualize(true);
        }
        selected = id;
    });

}
