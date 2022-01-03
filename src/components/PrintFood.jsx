import {useState,useEffect} from "react";
import {Food} from "./Food.jsx";
import {ShowFood} from "./ShowFood.jsx"
import {nanoid} from "nanoid";
import "../styles/print.css"


export const PrintFood = (food) => {
    let [list,setList] = useState([]);

    let [page,setPage] = useState(1)

    useEffect(()=>{
        getTodo(page)
    },[page])

    const getTodo = (page) => {
        fetch(`http://localhost:3001/api/receipe?_page=${page}&_limit=3`)
        .then((d)=> d.json())

        .then((res)=>{
            setList(res)
        })
    }



    const handleData = async (receipe)=>{
        const payload = {
            id:nanoid(4),
            title:receipe.title,
            ingredients:receipe.ingredients,
            time:Number(receipe.time),
            instructions:receipe.instructions,
            image:receipe.image,
        };

        setList([...list,payload]);

        try{
            let resp = await fetch("http://localhost:3001/api/receipe",{
                method: "POST",
                body: JSON.stringify(payload),
                headers: {'Content-Type': 'application/json'}
            });
            let data = await resp.json();
            console.log(data);

        } catch(err){
            console.log(err);
        }
        getTodo();
    };

    const handleDelete = async(id) => {
        setList(list.filter(list => list.id !== id));

        let resp = await fetch(`http://localhost:3001/api/receipe/${id}`,{
            method: "DELETE",
            headers: {'Content-Type': 'application/json'}
        });
        let data = await resp.json();
        console.log(data);
    }

    return (
        <>
    <div>
        <div className="input">
            <Food getData = {handleData}/>
           
        </div>
        <div>
                
            {list.map((e)=>(
                <ShowFood key={e.id} {...e} handleDelete={handleDelete}/>
            ))}
        </div>
    </div>
        
        </>
    )
}