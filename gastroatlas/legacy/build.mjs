import {mkdir,readFile,writeFile} from 'node:fs/promises'
import {cities,restaurants,sections} from './dist/data.mjs'
const shell=await readFile('dist/shell.html','utf8')
const routes=['',...Object.keys(sections),...cities.map(c=>'restaurants/'+c[4]),...restaurants.map(r=>'restaurant/'+r.slug),'experiences/last-minute','travel/tuscany','magazine/wine','magazine/menus']
await Promise.all(['it','en'].flatMap(locale=>routes.map(async route=>{
 const dir=['dist',locale,route].filter(Boolean).join('/')
 await mkdir(dir,{recursive:true})
 await writeFile(dir+'/index.html',shell.replace('lang="it"',`lang="${locale}"`))
})))
await writeFile('dist/index.html',shell)
await writeFile('dist/404.html',shell)
