const hbs = require('handlebars');
const path = require('path');
const fs = require('fs');

const buildings_data = JSON.parse(fs.readFileSync(path.resolve(__dirname, "buildings.json")))["buildings"];

formatted_buildings = {
    towers: [],
    t4towers: [],
    barracks: [],
    ancients: []
};

LANES = {
    0: 'ancient',
    1: 'top',
    2: 'middle',
    3: 'bottom'
}

TOWERS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 18, 19, 20, 21, 22, 23, 24, 25, 26]
T4_TOWERS = [9, 10, 27, 28]
RAX = [11, 12, 13, 14, 15, 16, 29, 30, 31, 32, 33, 34]
ANCIENTS = [17, 35]

for (tower_index of TOWERS) {
    let tower = buildings_data[tower_index]
    formatted_buildings.towers.push({
        team: tower['team'] == 2 ? 'rad' : 'dire',
        lane: LANES[tower['lane']],
        tier: tower['tier'],
        left: 50 + (100 * tower['x']),
        bottom: 50 + (100 * tower['y'])
    })
}

let left = true;
for (tower_index of T4_TOWERS) {
    let tower = buildings_data[tower_index]
    formatted_buildings.t4towers.push({
        team: tower['team'] == 2 ? 'rad' : 'dire',
        side: left ? 'left' : 'right',
        left: 50 + (100 * tower['x']),
        bottom: 50 + (100 * tower['y'])
    })
    left = !left
}

let melee = true;
for (rax_index of RAX) {
    let rax = buildings_data[rax_index]
    formatted_buildings.barracks.push({
        team: rax['team'] == 2 ? 'rad' : 'dire',
        type: melee ? 'melee' : 'ranged',
        lane: LANES[rax['lane']],
        left: 50 + (100 * rax['x']),
        bottom: 50 + (100 * rax['y'])
    })
    melee = !melee
}

for (ancient_index of ANCIENTS) {
    let ancient = buildings_data[ancient_index]
    formatted_buildings.ancients.push({
        team: ancient['team'] == 2 ? 'rad' : 'dire',
        left: 50 + (100 * ancient['x']),
        bottom: 50 + (100 * ancient['y'])
    })
}

const template = hbs.compile(
    fs.readFileSync(path.resolve(__dirname, "d2minimap.css.hbs"), "utf-8")
)

const output = template(formatted_buildings)

fs.writeFileSync("assets/stylesheets/d2minimap.css", output);

const demoTemplate = hbs.compile(
    fs.readFileSync(path.resolve(__dirname, "demo.html.hbs"), "utf-8")
)

const demoOutput = demoTemplate(formatted_buildings);

fs.writeFileSync("demo.html", demoOutput);

console.log("Generated CSS and Demo");
