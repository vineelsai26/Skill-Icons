import icons from '../dist/icons.json'

const iconNameList = [...new Set(Object.keys(icons).map(i => i.split('-')[0]))]
const shortNames = {
	js: 'javascript',
	ts: 'typescript',
	py: 'python',
	tailwind: 'tailwindcss',
	vue: 'vuejs',
	nuxt: 'nuxtjs',
	go: 'golang',
	cf: 'cloudflare',
	wasm: 'webassembly',
	postgres: 'postgresql',
	k8s: 'kubernetes',
	next: 'nextjs',
	mongo: 'mongodb',
	md: 'markdown',
	ps: 'photoshop',
	ai: 'illustrator',
	pr: 'premiere',
	ae: 'aftereffects',
	scss: 'sass',
	sc: 'scala',
	net: 'dotnet',
	gatsbyjs: 'gatsby',
	gql: 'graphql',
	vlang: 'v',
	amazonwebservices: 'aws',
	bots: 'discordbots',
	express: 'expressjs',
	googlecloud: 'gcp',
	mui: 'materialui',
	windi: 'windicss',
	unreal: 'unrealengine',
	nest: 'nestjs',
	ktorio: 'ktor',
	pwsh: 'powershell',
	au: 'audition',
	rollup: 'rollupjs',
	rxjs: 'reactivex',
	rxjava: 'reactivex',
	ghactions: 'githubactions',
}

const themedIcons = [
	...Object.keys(icons)
		.filter(i => i.includes('-light') || i.includes('-dark'))
		.map(i => i.split('-')[0]),
]

const ICONS_PER_LINE = 15
const ONE_ICON = 48
const SCALE = ONE_ICON / (300 - 44)

type Theme = 'dark' | 'light'

function generateSvg(iconNames: string[], perLine: number) {
	const iconSvgList = iconNames.map(i => icons[i])

	const length = Math.min(perLine * 300, iconNames.length * 300) - 44
	const height = Math.ceil(iconSvgList.length / perLine) * 300 - 44
	const scaledHeight = height * SCALE
	const scaledWidth = length * SCALE

	return (
		`<svg width="${scaledWidth}" height="${scaledHeight}" viewBox="0 0 ${length} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1">
		${iconSvgList.map((i, index: number) => {
			return (
				`<g transform="translate(${(index % perLine) * 300}, ${Math.floor(index / perLine) * 300})">
					${i}
				</g>`
			)
		}).join(' ')}
		</svg>`
	)
}

function parseShortNames(names: string[], theme: Theme) {
	return names.map((name) => {
		if (iconNameList.includes(name)) {
			return name + (themedIcons.includes(name) ? `-${theme}` : '')
		}
		else if (name in shortNames) {
			return (
				shortNames[name] +
				(themedIcons.includes(shortNames[name]) ? `-${theme}` : '')
			)
		}
	})
}

export async function onRequestGet(context) {
	const {
		request
	} = context

	console.log(request)

	const { searchParams } = new URL(request.url)

	const iconParam = searchParams.get('i') || searchParams.get('icons')
	if (!iconParam) {
		return new Response(
			"You didn't specify any icons!",
			{
				status: 400
			}
		)
	}

	const themeParam = searchParams.get('t') || searchParams.get('theme')
	if (themeParam && themeParam !== 'dark' && themeParam !== 'light') {
		return new Response(
			'Theme must be either "light" or "dark"',
			{
				status: 400,
			}
		)
	}

	const theme = themeParam as Theme

	const perLine = parseInt(searchParams.get('perline')) || ICONS_PER_LINE
	if (isNaN(perLine) || perLine < -1 || perLine > 50) {
		return new Response(
			'Icons per line must be a number between 1 and 50',
			{
				status: 400,
			}
		)
	}

	let iconShortNames: string[]
	if (iconParam === 'all') {
		iconShortNames = iconNameList
	} else {
		iconShortNames = iconParam.split(',')
	}

	const iconNames = parseShortNames(iconShortNames, theme)
	if (!iconNames) {
		return new Response(
			"You didn't format the icons param correctly!",
			{
				status: 400,
			}
		)
	}

	const svg = generateSvg(iconNames, perLine)
	return new Response(
		svg,
		{
			headers: {
				'Content-Type': 'image/svg+xml'
			},
			status: 200
		}
	)
}
