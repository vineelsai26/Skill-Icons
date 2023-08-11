import icons from '../../dist/icons.json'

export async function onRequestGet() {
    return new Response(JSON.stringify(icons), {
        headers: {
            'content-type': 'application/json;charset=UTF-8',
        },
    })
}
