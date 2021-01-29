const express = require('express');
const app = express();
const port = 3000;
const axios = require('axios');

app.use(express.json());

app.get('/api/ping', (req, res) =>
    res.status(200).json({ "success": true }));

app.get('/api/posts', (req, res) => 
    res.status(400).json({ "error": "Tags parameter is required" }));

app.get('/api/posts/:tags', async (req, res) => {
    const { tags } = req.params

    let array = []
    const Tags = tags + ','
    const tagArray = Tags.split(',')
    await Promise.all(tagArray.map(async (tag) => {
        if(tag !== '') {
            const { data } = await axios.get(`https://api.hatchways.io/assessment/blog/posts?tag=${tag}`)
            array = [...array, ...data.posts]
        }
    }));
    const result = []

    // filter
    array.map((obj) => {
        let test = true;
        for(let i = 0; i < result.length; i++) {
            if(result[i].id === obj.id) {
                test = false;
            }
        }
        if(test) {
            result.push(obj);
        }
    })

    result.sort((a, b) => a.id - b.id);

    res.status(200).json({ "posts": result });
});

app.get('/api/posts/:tags/:sortBy', async (req, res) => {
    const { tags, sortBy } = req.params

    if (sortBy === 'id' || sortBy === 'reads' || sortBy === 'likes'|| sortBy === 'popularity') {
        let array = []
        const Tags = tags + ','
        const tagArray = Tags.split(',')
        await Promise.all(tagArray.map(async (tag) => {
            if(tag !== '') {
                const { data } = await axios.get(`https://api.hatchways.io/assessment/blog/posts?tag=${tag}`)
                array = [...array, ...data.posts]
            }
        }));

        const result = []

        // filter
        array.map((obj) => {
            let test = true;
            for(let i = 0; i < result.length; i++) {
                if(result[i].id === obj.id) {
                    test = false;
                }
            }
            if(test) {
                result.push(obj);
            }
        })

        result.sort((a, b) => a[sortBy] - b[sortBy]);

        res.status(200).json({ "posts": result });

    } else {
        res.status(400).json({ "error": "sortBy parameter is invalid" });
    }
});

app.get('/api/posts/:tags/:sortBy/:direction', async (req, res) => {
    const { tags, sortBy, direction } = req.params

    if (direction === 'asc' || direction === 'desc') {
        if (sortBy === 'id' || sortBy === 'reads' || sortBy === 'likes'|| sortBy === 'popularity') {
            let array = []
            const Tags = tags + ','
            const tagArray = Tags.split(',')
            await Promise.all(tagArray.map(async (tag) => {
                if(tag !== '') {
                    const { data } = await axios.get(`https://api.hatchways.io/assessment/blog/posts?tag=${tag}`)
                    array = [...array, ...data.posts]
                }
            }));

            const result = []

            // filter
            array.map((obj) => {
                let test = true;
                for(let i = 0; i < result.length; i++) {
                    if(result[i][sortBy] === obj[sortBy]) {
                        test = false;
                    }
                }
                if(test) {
                    result.push(obj);
                }
            })

            if (direction === 'asc') {
                result.sort((a, b) => a[sortBy] - b[sortBy]);
            } else {
                result.sort((a, b) => b[sortBy] - a[sortBy]);
            }

            res.status(200).json({ "posts": result });
            
        } else {
            res.status(400).json({ "error": "sortBy parameter is invalid" });
        }
    } else {
        res.status(400).json({ "error": "direction parameter is invalid" });
    }

});

app.listen(port, () => console.info(`http://localhost:${port}`));
