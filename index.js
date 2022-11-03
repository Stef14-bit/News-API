const PORT = process.env.PORT || 8000   //for deploying on heroku
const express = require('express')
const cheerio = require('cheerio')
const axios = require('axios')
const app = express()
const cors = require('cors')

const newspapers = [
    {
        name: 'New Scientist',
        adress: 'https://www.newscientist.com/section/news/',
        base: ''
    },

    {
        name: 'America Space',
        adress: 'https://www.americaspace.com/',
        base: ''
    },
    {
        name: 'NASA spaceflight',
        adress: 'https://www.nasaspaceflight.com/',
        base: ''
    },
    // {
    //     name: 'Space com',
    //     adress: 'https://www.space.com/',
    //     base: ''
    // },

    {
        name: 'Nasa watch',
        adress: 'https://nasawatch.com/space-science-news/',
        base: ''
    },
]

const articles = []

newspapers.forEach(newspaper => {
    axios.get(newspaper.adress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)

            $('a:contains("Space")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')

                articles.push({
                    title, url,
                    source: newspaper.name
                })
            })
        })
});



app.use(cors({
    origin: '*'
}));

app.get('/', (req, res) => {
    res.json(articles)
})

app.get('/:newspaperId', (req, res) => {
    const newspaperId = req.params.newspaperId

    const newspaperAdress = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].adress
    const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base

    axios.get(newspaperAdress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const specificArticles = []

            $('a:contains("Space")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                specificArticles.push({
                    title,
                    url: newspaperBase + url,
                    source: newspaperId
                })
            })
            res.json(specificArticles)
        }).catch(err => console.log(err))

})
app.listen(PORT, () => console.log(`Server running on ${PORT}`))