import { vttLog, vttError, getFolderPath } from './lib/moduleLib.js'

import { FOES_STATS, FOES_TYPE } from './lib/foes.js'
import ForgeOfFoes from './lib/fof.js';

Handlebars.registerHelper

CONFIG.debug.hooks = true

Hooks.once('init', async function () {
    var f = new ForgeOfFoes()
    console.log(f)
});

Hooks.once('ready', async function () {

});

Hooks.on('renderSidebarTab', async (app, html, data) => generate(app, html, data))

Hooks.on('changeSidebarTab', async (app, html, data) => generate(app, html, data))

function generate(app, html, data) {
    if (app.options.classes.includes('actors-sidebar') && app._element.find('.create-monster').length == 0) {
        const actionsTabButton = $('<button class="create-document create-monster"><i class="fa-solid fa-spaghetti-monster-flying"></i> Generate Foe</button>');
        const create = app._element.find('.create-entry')
        actionsTabButton.insertBefore(create)
        actionsTabButton.on('click', showMonsterForm)
    }
}

async function showMonsterForm(event) {
    const hbs = await fetch('modules/forgemyfoes/templates/create-foe.hbs').then(response => response.text());
    const template = Handlebars.compile(hbs);
    const options = { stats: FOES_STATS, type: FOES_TYPE }
    const html = template({ options })

    new Dialog({
        title: "Forge a Foe",
        content: html,
        buttons: {
            ok: {
                label: "Ok",
                callback: createActor
            },
            cancel: {
                label: "Cancel"
            }
        },
        close: () => "Cancel"
    }).render(true);
}

async function createActor(context) {
    const crInfos = FOES_STATS[context.find('#cr-value')[0].selectedIndex]
    const dmgMid = crInfos.DpA

    const type = FOES_TYPE[context.find('#monster-type')[0].selectedIndex]

    let itemData = {
        name: "Attack",
        img: "icons/skills/melee/strike-slashes-red.webp",
        type: "weapon",
        system: {
            activation: {
                type: "action"
            },
            actionType: "mwak",
            attackBonus: crInfos.PAB,
            proficient: 0,
            damage: {
                parts: [
                    [
                        crInfos.DpACalc
                    ]
                ],
            }
        }
    }

    let attacks = {
        name: `${crInfos.NoA} attack(s)`,
        img: "icons/skills/melee/maneuver-greatsword-yellow.webp",
        type: "feat",
        system: {
            description: {
                value: `<p>The creature can perform ${crInfos.NoA} attack(s) per turn.</p>`
            }
        }
    }

    const name = `${type.name} - ${crInfos.CR}`
    const token = `modules/forgemyfoes/tokens/${type.name.toLowerCase()}.png`

    let actor = await Actor.create({
        name: name,
        type: "npc",
        img: token,
        system: {
            attributes: {
                ac: { flat: crInfos.ACDC, calc: "flat" },
                hp: { value: crInfos.HP, max: crInfos.HP }
            },
            details: {
                type: type.name,
                cr: eval(crInfos.CR)
            }
        },
        prototypeToken : {
            name: name,
            texture: {
                src: token
            }
        }
    });

    actor.createEmbeddedDocuments('Item', [itemData, attacks]);

}

Hooks.on('renderSidebar', async (app, html, data) => {

    vttLog('renderSidebar')
    // if (app && app.documents && app.documents.find(d => d.type === "npc")) {
    // const actionContainer = html[0].find('.actors-sidebar')
    // const header = actionContainer.find('.directory-header')

    // var newElement = $('<a class="file-picker" data-tab="vttestofoundry-journal" data-journalid="' + data._id + '"> VTTES Import </a>');

    // header.insertBefore(newElement, null);

    // console.log(html)
    // console.log(actionContainer)
    // console.log(header)
    // }
    // console.log(data)
    // console.log(app)
    // console.log(html)
})



