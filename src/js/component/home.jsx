import React, {useEffect, useState} from "react";

const Home = () => {
    const[inputTodo, setInputTodo] = useState('');
    const[todoList, setTodoList] = useState([]);
    const[selectedTodo, setSelectedTodo] = useState(-1);
    const todosOwner = "andresl";

    useEffect( () => {
        refreshTodoList();
    }, []);

    const refreshTodoList = () => {
        fetch("https://assets.breatheco.de/apis/fake/todos/user/"+ todosOwner, {
            method: "GET",
            headers: {
                'Content-Type' : 'application/json'
            }
        })
        .then(res => {
            if(!res.ok)
                throw new Error(res.statusText);

            return res.json();
        })
        .then(data => {
            const arr = data.map(todoItem => todoItem['label']);
            setTodoList(arr);
        })
    }

    const handleNewTodo = (e) => {
        if(e.key=== 'Enter') {
            setTodoList([...todoList, inputTodo]);
            setInputTodo('');
        }        
    }

    const handleClickEvent = (index) => {
        const updatedTodoList = todoList.filter((item, cIndex) => index != cIndex);
        setTodoList(updatedTodoList);
        setSelectedTodo(-1);
    }

    const updateHandler = () => {
        const arr = [];
        todoList.forEach(item => {
            arr.push({"label" : item, "done" : false});
        });

        fetch("https://assets.breatheco.de/apis/fake/todos/user/"+ todosOwner, {
            method: "PUT",
            body: JSON.stringify(arr),
            headers: {
                'Content-Type' : "application/json"
            }
        })
        .then(res => {
            if(!res.ok)
                throw new Error(res.statusText);

            refreshTodoList();
            alert("Todo List was updated");
        })
        .catch(error => console.log("Ha ocurrido un error al actualizar: " + error));
    }

    return (
		<div className="container bg-light">
			<div className="row justify-content-center" style={{marginTop: 150}}>
				<div className="d-flex flex-column justify-content-center align-items-center w-50">

                    <h1>My Todos</h1>

					<div className="col-xs-8 w-100 h4 border-bottom">
						<input type="text" 
							className="form-control input-lg h4" style={{boxShadow: 'none'}} 
							placeholder="Ingresa una nueva tarea" 
							onChange={(e) => {setInputTodo(e.target.value)}}
							onKeyPress={(e) => handleNewTodo(e)}
							value={inputTodo}
						/>
					</div>

					<div className="w-100">
                        {todoList.map((item, index) => (
                            <div className="w-100 h4 p-3" key={index} onMouseEnter={() => setSelectedTodo(index)} onMouseLeave={() => setSelectedTodo(-1)}>
                                <div className="row border-bottom">
                                    <div className="col-11">
                                        {item}
                                    </div>
                                    
                                    {selectedTodo === index ? 
                                        <div className="col-1">
                                            <i className="fa-solid fa-x" onClick={() => handleClickEvent(index)}></i>
                                        </div> : ""
                                    }
                                    
                                </div>          
                            </div>
                        ))}
                    </div>

                    <div className="w-100 text-center">
                        <p>Please click <font color="red"> <b> "update todos" </b> </font>to synchronize your todos in the server...</p>
                        <button type="button" className="btn btn-dark" onClick={() => updateHandler()}>Update Todos</button>
                    </div>

				</div>
			</div>
		</div>
	);

}

export default Home;