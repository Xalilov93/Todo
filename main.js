const {createServer} = require('http');
const data = require('./data')
const {NotFoundException} = require('./exceptions')

const PORT = 9000;

const server = createServer( async (req, res) => {
    const httpMethod = req.method
    const options = {
        'Content-type': 'application/json'
    }

    if (httpMethod == 'GET') {
        const meetingId = req.url.split('/')[1]
        
        if(!meetingId) {
            res.writeHead(200, options)
            res.end(JSON.stringify(data))
            return
        }

        const meeting = data.find(e => e.id == meetingId)

        if(meeting) {
            res.writeHead(404, options)
            res.end(JSON.stringify({meeting}))
            return
        }
    }


    if(httpMethod == 'POST') {
        
        req.on('data', chunk => {
            const body = JSON.parse(chunk)
            function currentTime() {
                let date = new Date(); 
                let hh = date.getHours();
                let mm = date.getMinutes();
                let ss = date.getSeconds();
                let session = "AM";
              
                if(hh == 0){
                    hh = 12;
                }
                if(hh > 12){
                    hh = hh - 12;
                    session = "PM";
                 }
              
                 hh = (hh < 10) ? "0" + hh : hh;
                 mm = (mm < 10) ? "0" + mm : mm;
                 ss = (ss < 10) ? "0" + ss : ss;
                  
                 let time = hh + ":" + mm + ":" + ss + " " + session;      
                 return time;          
              }
              let time = currentTime()
            data.push({
                id: data.at(-1)?.id + 1 || 1,
                ...body,
                "creatadd": `${time}`
            })
            res.writeHead(201, options)
            res.end(JSON.stringify({
                message: 'Object created'
            }))
            return
        })
    }

    if(httpMethod == 'PATCH') {
        const meetingId = req.url.split('/')[1]
        
        if(!meetingId) {
            res.writeHead(404, options)
            res.end(JSON.stringify({
                message: 'Not Found'
            }))
            return
        }

        const meeting = data.find(e => e.id == meetingId)

        if(!meeting) {
            res.writeHead(404, options)
            res.end(JSON.stringify({
                message: 'Meeting Not Found'
            }))
            return
        }

        req.on('data', chunk => {
            const { title, text} = JSON.parse(chunk)
            
            meeting.title = title ?? meeting.title
            meeting.text = text ?? meeting.text

            const meetingIndex = data.findIndex(e => e.id == meetingId)

            data.splice(meetingIndex, 1)

            data.push(meeting)

            res.writeHead(204, options)
            res.end(JSON.stringify({
                message: 'Object updated'
            }))
            return
        })
    }
    
    if(httpMethod == 'DELETE') {
        const meetingId = req.url.split('/')[1]
        
        const meeting = data.find(e => e.id == meetingId)
        
        if(!meetingId) {
            res.writeHead(404, options)
            res.end(JSON.stringify({
                message: 'Not Found'
            }))
            return
        }
        
        const meetingIndex = data.findIndex(e => e.id == meetingId)
        
        data.splice(meetingIndex, 1)

        res.writeHead(204, options)
        res.end(JSON.stringify({
            message: 'Object deleted'
        }))
        return

        req.on('data', chunk => {
            const { title, text} = JSON.parse(chunk)
            
            meeting.title = title ?? meeting.title
            meeting.text = text ?? meeting.text



            data.push(meeting)

            res.writeHead(204, options)
            res.end(JSON.stringify({
                message: 'Object updated'
            }))
            return
        })
    }
})

server.listen(PORT, () => {
    console.log('listening');
})