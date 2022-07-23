const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const _ = require('lodash')

const app = express()
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended:'true'}))
app.use(express.static('public'))

mongoose.connect('mongodb+srv://sherlomck:Test123@todoproject.xddpz.mongodb.net/todoListDB',{useNewUrlParser:true})

const itemSchema = {name:String}
const item = mongoose.model('Item', itemSchema)

const item0 = new item({
    name:'type /<name> in address bar for personalized list!'
})

const item1 = new item({
    name:'Welcome To Your To-Do List!'
})
const item2 = new item({
    name:'Hit the + button to add a new item'
})
const item3 = new item({
    name:'<--- Hit this to delete an item'
})

const default_items = [item1,item2,item3]

const listSchema = {
    name:String,
    items:[itemSchema]
}

const list = mongoose.model('List', listSchema)

app.get('/', function(req,res){
    item.find({},function(err, found_items){
        if(err){console.log(err)}
        else{
            if(found_items.length === 0){
                item.insertMany(default_items, function(err){
                    if(err){console.log(err)}
                    else(console.log('Success!!'))
                })
                res.redirect('/')
            }
            else(res.render('list',{list_title:"To-Do List",items:found_items}))
        }
    })
})

app.get('/:custom_list_name',function(req,res){
    const custom_list_name = _.capitalize(req.params.custom_list_name)
    
    list.findOne({name:custom_list_name},function(err, found_list){
        if(!err){
            if(!found_list){
                const List = new list({
                    name: custom_list_name,
                    items: default_items
                })
                List.save()
                res.redirect('/'+custom_list_name)
            }else{
                res.render('list',{list_title:found_list.name,items:found_list.items})
            }
        }
    })
})

app.post('/input',function(req,res){
    const newItem = req.body.fill
    const listName = req.body.list
    const Item = new item({
        name : newItem
    })
    if(listName === "To-Do List"){
        Item.save()
        res.redirect('/')
    }
    else{
        list.findOne({name:listName}, function(err,foundList){
            foundList.items.push(Item)
            foundList.save()
            res.redirect('/'+listName)
        })
    }
})

app.post('/delete',function(req,res){
    const deleted_id = req.body.checkbox
    const listName = req.body.listName
    if(listName === "To-Do List"){
        item.findByIdAndRemove(deleted_id, function(err){
            console.log("Successfully deleted !!")
            res.redirect('/')
        })
    }
    else{
        list.findOneAndUpdate({name:listName},{$pull:{items:{_id:deleted_id}}},function(){

        })
    }
})

let port = process.env.PORT;
if (port == null || port == ""){
    port = 3000;
}

app.listen(port)