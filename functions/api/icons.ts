import icons from '../../dist/icons.json'

const iconNameList = [...new Set(Object.keys(icons).map(i => i.split('-')[0]))]

export async function onRequestGet() {
    return new Response(JSON.stringify(iconNameList), {
        headers: {
            'content-type': 'application/json;charset=UTF-8',
        },
    })
}
